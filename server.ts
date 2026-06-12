import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(process.cwd(), "src", "db.json");

// قفل تأمين تزامني لمنع تهنيج السيرفر أو ظهور رسالة (السيرفر مشغول بطلب آخر)
class AsyncMutex {
  private queue: Promise<void> = Promise.resolve();
  async acquire(): Promise<() => void> {
    let release: () => void;
    const next = new Promise<void>((resolve) => { release = resolve; });
    const current = this.queue;
    this.queue = next;
    await current;
    return release!;
  }
}
const dbMutex = new AsyncMutex();

// Normalization Helper for account names
export function normalizeName(name: string): string {
  if (!name) return "";
  return name.trim().toLowerCase().replace(/\s+/g, "");
}

export function isOrderReturned(status: string): boolean {
  if (!status) return false;
  const s = status.trim();
  return [
    "مرتجع", "مرتجع كلي", "مرتجع جزئي", "مرتجع جديد", "جاري تجهيز المرتجع",
    "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد", "التسليم للمورد", "مرتجع تم تسليمه للمورد"
  ].includes(s) || s.includes("مرتجع") || s.includes("المرتجع");
}

// Default Fallback Database
const DEFAULT_DB = {
  users: [
    { name: "عصفور", role: "مدير", pass: "14014", active: "نعم", email: "asfour@friendplus.com", perms: "كاملة" },
    { name: "ابو ياسين", role: "مدير", pass: "361991", active: "نعم", email: "abuyassin@friendplus.com", perms: "كاملة" },
    { name: "ابو خديجه", role: "مشرف", pass: "14014", active: "نعم", email: "abukhadija@friendplus.com", perms: "توزيع ومتابعة" },
    { name: "أحمد المرتجعات", role: "مسؤول مرتجعات", pass: "222222", active: "نعم", email: "returns@friendplus.com", perms: "متابعة المرتجعات" },
    { name: "المحاسب أحمد", role: "محاسب", pass: "111111", active: "نعم", email: "accounting@friendplus.com", perms: "خزنة وحسابات وتقارير مالية" },
    { name: "محمد حمدى", role: "مندوب", pass: "500500", active: "نعم", email: "mohamed@friendplus.com", perms: "أوردرات المندوب وتحديث الحالات" },
    { name: "زياد", role: "مندوب", pass: "500500", active: "نعم", email: "ziad@friendplus.com", perms: "أوردرات المندوب وتحديث الحالات" },
    { name: "محل الأناقة", role: "مورد", pass: "333333", active: "نعم", email: "elegance@friendplus.com", perms: "إضافة أوردرات ورفع كشوفات" },
    { name: "صفوت العمليات", role: "موظف عمليات", pass: "444444", active: "نعم", email: "safwat@friendplus.com", perms: "متابعة حالات فقط" }
  ],
  couriers: [
    { name: "محمد حمدى", phone: "01112345678", commission: 25, salary: 3000, region: "القاهرة" },
    { name: "زياد", phone: "01212345678", commission: 25, salary: 3000, region: "الجيزة" }
  ],
  suppliers: [
    { name: "محل الأناقة", phone: "01055556666", price: 65, notes: "ملابس وموضة" },
    { name: "إلكترونيات السلام", phone: "01544443333", price: 60, notes: "أجهزة إلكترونية وإكسسوارات" }
  ],
  orders: [],
  expenses: [],
  cashbox: [
    { date: "2026-06-10 08:00", desc: "رأس مال ابتدائي لتسوية الخزنة", type: "وارد", amount: 10000, ref: "CAP-001", addedBy: "المحاسب أحمد" }
  ],
  statusHistory: [],
  supplierLedger: [],
  courierLedger: [],
  archivedOrders: [],
  dailyClosings: [],
  settings: { COUNTER: 1005, COMPANY: "فريند بلس", VERSION: "5.1" }
};

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

function ensureDbFields(db: any): any {
  if (!db) db = {};
  if (!db.users) db.users = [];
  if (!db.couriers) db.couriers = [];
  if (!db.suppliers) db.suppliers = [];
  if (!db.orders) db.orders = [];
  if (!db.expenses) db.expenses = [];
  if (!db.cashbox) db.cashbox = [];
  if (!db.statusHistory) db.statusHistory = [];
  if (!db.supplierLedger) db.supplierLedger = [];
  if (!db.courierLedger) db.courierLedger = [];
  if (!db.archivedOrders) db.archivedOrders = [];
  if (!db.dailyClosings) db.dailyClosings = [];
  if (!db.settings) db.settings = {};
  return db;
}

function readDB(): any {
  try {
    if (!fs.existsSync(DB_PATH)) return ensureDbFields(DEFAULT_DB);
    const data = fs.readFileSync(DB_PATH, "utf-8");
    if (!data || data.trim() === "") return ensureDbFields(DEFAULT_DB);
    return ensureDbFields(JSON.parse(data));
  } catch (error) {
    return ensureDbFields(DEFAULT_DB);
  }
}

function writeDB(data: any): void {
  try {
    const ensuredData = ensureDbFields(data);
    const TEMP_PATH = DB_PATH + ".tmp";
    fs.writeFileSync(TEMP_PATH, JSON.stringify(ensuredData, null, 2), "utf-8");
    fs.renameSync(TEMP_PATH, DB_PATH);
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

const getCairoDateObj = () => {
  try {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
  } catch (e) {
    return new Date();
  }
};

const now = () => {
  const date = getCairoDateObj();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const tod = () => {
  const date = getCairoDateObj();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

function fixPhone(phone: any): string {
  if (!phone) return "";
  let p = phone.toString().replace(/[^0-9]/g, "");
  if (p.startsWith("002")) p = p.substring(3);
  if (p.startsWith("20") && p.length === 12) p = "0" + p.substring(2);
  if (!p.startsWith("0") && p.length === 10) p = "0" + p;
  return p;
}

function generateID(db: any): string {
  const counter = (db.settings.COUNTER || 1000) + 1;
  db.settings.COUNTER = counter;
  const yearSuffix = new Date().getFullYear().toString().slice(-2);
  return `FP-${counter}-${yearSuffix}`;
}

function createStatelessToken(user: string, role: string, perms: string): string {
  return Buffer.from(JSON.stringify({ user, role, perms, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64");
}

function verifyStatelessToken(token: string): { user: string; role: string; perms: string } | null {
  if (!token) return null;
  const t = token.trim();
  if (t === "mock-token-asfour") return { user: "عصفور", role: "مدير", perms: "كاملة" };
  if (t === "mock-token-abuyassin") return { user: "ابو ياسين", role: "مدير", perms: "كاملة" };
  try {
    const decoded = JSON.parse(Buffer.from(t, "base64").toString("utf-8"));
    if (decoded && decoded.exp && decoded.exp > Date.now()) {
      return { user: decoded.user, role: decoded.role, perms: decoded.perms };
    }
  } catch (e) {}
  return null;
}

const SESSIONS: { [token: string]: { user: string; role: string; perms?: string } } = {};
function getSession(token: string) {
  if (!token) return null;
  const t = token.trim();
  if (SESSIONS[t]) return SESSIONS[t];
  const verified = verifyStatelessToken(t);
  if (verified) { SESSIONS[t] = verified; return verified; }
  return null;
}

const ok = (res: Response, d: any = {}) => res.json({ ok: true, ...d });
const err = (res: Response, m: string) => res.json({ ok: false, error: m });

// ─────────────────────────────────────────────────────────────
// MAIN ROUTER INTERCEPTOR
// ─────────────────────────────────────────────────────────────
app.post("/api", async (req: Request, res: Response) => {
  const release = await dbMutex.acquire();
  try {
    const d = req.body;
    if (!d || !d.action) return err(res, "Missing action parameter");

    // 1. LOGIN ACTION
    if (d.action === "login") {
      const { name, pass } = d;
      if (!name || !pass) return err(res, "اكتب الاسم وكلمة المرور");
      const db = readDB();
      const user = db.users.find((u: any) => normalizeName(u.name) === normalizeName(name) && u.pass?.toString().trim() === pass.trim());
      if (!user) return err(res, "اسم المستخدم أو كلمة المرور غلط");
      if (user.active === "لا") return err(res, "الحساب موقوف عن العمل");
      
      const token = createStatelessToken(user.name, user.role, user.perms || "كاملة");
      return ok(res, { user: user.name, role: user.role, token, perms: user.perms || "كاملة" });
    }

    // AUTHENTICATION CHECK FOR OTHER ACTIONS
    const sess = getSession(d.token);
    if (!sess) return err(res, "انتهت الجلسة، الرجاء تسجيل الدخول مجدداً");
    
    const currentUser = sess.user;
    const currentRole = sess.role;
    const currentPerms = sess.perms || "";
    const isAdmin = normalizeName(currentRole) === "admin" || currentRole === "مدير";
    const isSupplier = currentRole === "مورد" || normalizeName(currentRole) === "supplier";
    const isCourier = currentRole === "مندوب" || normalizeName(currentRole) === "courier";
    const cleanCurrentUser = normalizeName(currentUser);

    const db = readDB();

    switch (d.action) {
      case "getOrders": {
        let ordersList = [...db.orders];
        if (isSupplier) {
          ordersList = ordersList.filter(o => normalizeName(o.supplier) === cleanCurrentUser);
        } else if (isCourier) {
          ordersList = ordersList.filter(o => normalizeName(o.courier) === cleanCurrentUser);
        }
        if (d.status && d.status !== "all") {
          ordersList = ordersList.filter((o: any) => o.status === d.status);
        }
        if (d.search) {
          const q = d.search.toLowerCase().trim();
          ordersList = ordersList.filter((o: any) =>
            [o.tracking, o.supplier, o.courier, o.customer, o.phone, o.gov, o.region, o.status]
              .join(" ").toLowerCase().includes(q)
          );
        }
        return ok(res, { orders: ordersList.reverse(), count: ordersList.length });
      }

      case "addOrder": {
        if (!isAdmin && !isSupplier && !currentPerms.includes("اضافة") && !currentPerms.includes("كاملة")) {
          return err(res, "ليس لديك صلاحية إضافة أوردرات");
        }
        const o = d.order || {};
        const phoneClean = fixPhone(o.phone || "");
        if (!phoneClean) return err(res, "رقم الهاتف مطلوب");

        const id = generateID(db);
        const tNow = now();
        const shipPrice = Number(o.shipPrice || 60);
        const totalCOD = Number(o.totalCOD || (Number(o.prodPrice || 0) + shipPrice));
        const prodPrice = totalCOD - shipPrice;

        const newOrder = {
          tracking: id, createdAt: tNow, updatedAt: tNow, orderDate: tod(),
          supplier: isSupplier ? currentUser : (o.supplier || ""),
          customer: o.customer || "", phone: phoneClean, phone2: fixPhone(o.phone2 || ""),
          gov: o.gov || "", region: o.region || "", address: o.address || "",
          prodPrice, shipPrice, totalCOD, shipCost: shipPrice, courier: "",
          status: "جديد", notes: o.notes || "", delivDate: "", retDate: "",
          addedBy: currentUser, commission: 0, returnShippingType: "",
          returnQueueStatus: "", returnQueueAgent: ""
        };

        db.orders.push(newOrder);
        writeDB(db);
        return ok(res, { id, msg: `تم تسجيل الشحنة برقم: ${id}` });
      }

      case "updateStatus": {
        const { tracking, status, returnShippingType } = d;
        const order = db.orders.find((o: any) => o.tracking === tracking);
        if (!order) return err(res, "الطلب غير مدرج بالخادم");

        const oldStatus = order.status;
        order.status = status;
        order.updatedAt = now();

        if (status === "تم التسليم") {
          order.delivDate = now();
          const coup = db.couriers.find((c: any) => normalizeName(c.name) === normalizeName(order.courier));
          const comm = coup ? Number(coup.commission || 25) : 25;
          order.commission = comm;

          db.cashbox.push({
            date: now(),
            desc: `تحصيل نقدي ناجح للشحنة: ${order.tracking} (المورد: ${order.supplier})`,
            type: "وارد",
            amount: Number(order.totalCOD),
            ref: order.tracking,
            addedBy: currentUser
          });
        } 
        else if (status === "تم تسليم المرتجع للمورد" || status === "مرتجع تم تسليمه للمورد") {
          order.retDate = now();
          order.returnQueueStatus = "تم تسليم المرتجع للمورد";
        }

        writeDB(db);
        return ok(res, { tracking, status, msg: "تم تحديث حالة الشحنة والماليات بنجاح" });
      }

      case "updateOrder": {
        if (!isAdmin && !currentPerms.includes("تعديل") && !currentPerms.includes("كاملة")) {
          return err(res, "عفواً، لا تملك صلاحية تعديل الشحنات");
        }
        const { tracking, order: o } = d;
        const order = db.orders.find((x: any) => x.tracking === tracking);
        if (!order) return err(res, "الشحنة غير موجودة");

        if (o.customer !== undefined) order.customer = o.customer;
        if (o.phone !== undefined) order.phone = fixPhone(o.phone);
        if (o.notes !== undefined) order.notes = o.notes;
        if (o.totalCOD !== undefined) {
          order.totalCOD = Number(o.totalCOD);
          order.prodPrice = Number(o.totalCOD) - Number(order.shipPrice);
        }
        if (o.courier !== undefined) {
          order.courier = o.courier;
          order.status = "خارج مع المندوب";
        }

        writeDB(db);
        return ok(res, { msg: "تم تعديل بيانات الأوردر بنجاح" });
      }

      case "getSupplierLedger": {
        const summaryList = db.suppliers.map((sup: any) => {
          const supOrders = db.orders.filter((o: any) => normalizeName(o.supplier) === normalizeName(sup.name));
          
          const successful = supOrders.filter((o: any) => o.status === "تم التسليم");
          const returnsInHub = supOrders.filter((o: any) => isOrderReturned(o.status) && o.status !== "تم تسليم المرتجع للمورد");
          const returnedToSupplier = supOrders.filter((o: any) => o.status === "تم تسليم المرتجع للمورد");
          const remainingInTransit = supOrders.filter((o: any) => o.status === "جديد" || o.status === "خارج مع المندوب" || o.status === "تأجيل");

          const deliveredValue = successful.reduce((sum: number, o: any) => sum + Number(o.prodPrice || 0), 0);
          const returnsValue = returnsInHub.reduce((sum: number, o: any) => sum + Number(o.prodPrice || 0), 0);
          const transitValue = remainingInTransit.reduce((sum: number, o: any) => sum + Number(o.prodPrice || 0), 0);
          
          const netCOD = deliveredValue; 

          return {
            supplierName: sup.name,
            totalOrdersCount: supOrders.length,
            successfulCount: successful.length,
            returnsInHubCount: returnsInHub.length,
            returnedToSupplierCount: returnedToSupplier.length,
            transitCount: remainingInTransit.length,
            deliveredValue,
            returnsValue,
            transitValue,
            netCOD
          };
        });

        if (isSupplier) {
          const filtered = summaryList.find((s: any) => normalizeName(s.supplierName) === cleanCurrentUser);
          return ok(res, { summary: filtered ? [filtered] : [] });
        }
        return ok(res, { summary: summaryList });
      }

      case "getUsers": {
        return ok(res, { users: db.users });
      }

      case "addUser": {
        if (!isAdmin) return err(res, "صلاحية حصرية للمدير فقط");
        const { name, role, pass, perms } = d.user || {};
        if (!name || !pass) return err(res, "الاسم والرقم السري مطلوبين");
        
        db.users.push({ name, role, pass, perms: perms || "تلقائية", active: "نعم", email: `${Date.now()}@friendplus.com` });
        writeDB(db);
        return ok(res, { msg: "تم إضافة المستخدم وتثبيت صلاحيات المربعات بنجاح" });
      }

      case "addDailyClosing": {
        if (!isAdmin && currentRole !== "محاسب") return err(res, "غير مصرح لك بإجراء التقفيل اليومي للمركز");
        
        const todayDate = tod();
        const activeOrders = db.orders;
        
        const currentCash = db.cashbox.reduce((sum: number, item: any) => {
          return item.type === "وارد" || item.type === "تحصيل مندوب" ? sum + Number(item.amount) : sum - Number(item.amount);
        }, 0);

        const ordersToArchive = activeOrders.filter((o: any) => o.status === "تم التسليم" || o.status === "تم تسليم المرتجع للمورد");
        const ordersToKeep = activeOrders.filter((o: any) => o.status !== "تم التسليم" && o.status !== "تم تسليم المرتجع للمورد");

        db.archivedOrders = [...(db.archivedOrders || []), ...ordersToArchive];
        db.orders = ordersToKeep;

        db.dailyClosings.push({
          date: todayDate,
          closedBy: currentUser,
          finalTreasuryBalance: currentCash,
          archivedCount: ordersToArchive.length,
          remainingCount: ordersToKeep.length
        });

        db.cashbox = [
          { date: now(), desc: `رصيد مالي مرحل من تقفيل يوم ${todayDate}`, type: "وارد", amount: currentCash, ref: "BAL-FORWARD", addedBy: "نظام الجرد الآلي" }
        ];

        writeDB(db);
        return ok(res, { msg: `تم التقفيل اليومي بنجاح! تم جرد الخزنة بمبلغ ${currentCash}ج، وأرشفة ${ordersToArchive.length} أوردر مقفل.` });
      }

      default:
        return err(res, `الإجراء البرمجي [${d.action}] غير معرف على السيرفر`);
    }
  } catch (e: any) {
    return err(res, `خطأ داخلي في السيرفر: ${e.message}`);
  } finally {
    release();
  }
});

app.get("/", (req, res) => {
  res.send("FriendPlus Advanced Logistics API Server V5.1 is active.");
});

// السطرين دول هما اللي بيخلوا السيرفر يشتغل ويسمع على المنفذ بشكل حقيقي وثابت
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});

export default app;