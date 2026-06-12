import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "src", "db.json");

// Normalization Helper for account names and categories to prevent failures like "asfoor" / "Asfoor", "Silver Team" / "silverteam"
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

// Default Fallback Database to ensure successful startup & login under environments like Vercel with read-only/missing storage
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
  orders: [
    {
      tracking: "FP-1001-26",
      createdAt: "2026-06-10 10:00",
      updatedAt: "2026-06-10 12:00",
      orderDate: "2026-06-10",
      supplier: "محل الأناقة",
      customer: "محسن علي",
      phone: "01011112222",
      phone2: "",
      gov: "القاهرة",
      region: "المعادي",
      address: "شارع 9 عمارة 4 أ",
      prodPrice: 200,
      shipPrice: 65,
      totalCOD: 265,
      shipCost: 65,
      courier: "محمد حمدى",
      status: "تم التسليم",
      notes: "تم التسليم بنجاح والتحصيل",
      delivDate: "2026-06-10 12:00",
      retDate: "",
      addedBy: "محل الأناقة",
      commission: 25,
      returnShippingType: "",
      returnQueueStatus: "",
      returnQueueAgent: ""
    },
    {
      tracking: "FP-1002-26",
      createdAt: "2026-06-10 10:15",
      updatedAt: "2026-06-10 12:30",
      orderDate: "2026-06-10",
      supplier: "محل الأناقة",
      customer: "خالد أحمد",
      phone: "01122223333",
      phone2: "",
      gov: "الجيزة",
      region: "المهندسين",
      address: "شارع البطل أحمد عبد العزيز",
      prodPrice: 300,
      shipPrice: 65,
      totalCOD: 365,
      shipCost: 65,
      courier: "زياد",
      status: "مرتجع",
      notes: "العميل دفع الشحن فقط ورجع المنتج",
      delivDate: "",
      retDate: "2026-06-10 12:30",
      addedBy: "محل الأناقة",
      commission: 25,
      returnShippingType: "paid",
      returnQueueStatus: "جاهز للتسليم للمورد",
      returnQueueAgent: "أحمد المرتجعات"
    }
  ],
  expenses: [
    { date: "2026-06-10 09:00", cat: "إيجار", desc: "إيجار مكتب الفرع الرئيسي", amount: 1500, by: "المحاسب أحمد" }
  ],
  cashbox: [
    { date: "2026-06-10 08:00", desc: "رأس مال ابتدائي لتسوية الخزنة", type: "وارد", amount: 10000, ref: "CAP-001", addedBy: "المحاسب أحمد" },
    { date: "2026-06-10 09:10", desc: "تحويل إلى حساب صادر لدفع المصاريف", type: "صادر", amount: 1500, ref: "EXP-REV-01", addedBy: "المحاسب أحمد" }
  ],
  statusHistory: [],
  supplierLedger: [],
  courierLedger: [],
  settings: {
    COUNTER: 1005,
    COMPANY: "فريند بلس",
    VERSION: "5.1"
  }
};

// Safe JSON Body Parsing
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Atomic & Robust Database Helper with Retries and Healing
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
  let attempts = 5;
  while (attempts > 0) {
    try {
      if (!fs.existsSync(DB_PATH)) {
        console.warn(`Database file not found at ${DB_PATH}. Returning fallback structure.`);
        return ensureDbFields(DEFAULT_DB);
      }
      const data = fs.readFileSync(DB_PATH, "utf-8");
      if (!data || data.trim() === "") {
        throw new Error("Empty database file content detected");
      }
      const parsed = JSON.parse(data);
      return ensureDbFields(parsed);
    } catch (error) {
      attempts--;
      if (attempts === 0) {
        console.error("Critical: Error reading database file after multiple attempts:", error);
        return ensureDbFields(DEFAULT_DB);
      }
      // Busy wait short sleep to yield operational lock thread
      const start = Date.now();
      while (Date.now() - start < 15) {}
    }
  }
  return ensureDbFields(DEFAULT_DB);
}

function writeDB(data: any): void {
  let attempts = 5;
  const TEMP_PATH = DB_PATH + ".tmp";
  while (attempts > 0) {
    try {
      const ensuredData = ensureDbFields(data);
      fs.writeFileSync(TEMP_PATH, JSON.stringify(ensuredData, null, 2), "utf-8");
      fs.renameSync(TEMP_PATH, DB_PATH);
      return;
    } catch (error) {
      attempts--;
      if (attempts === 0) {
        console.error("Critical: Error writing database file atomic replacement after multiple attempts:", error);
      } else {
        const start = Date.now();
        while (Date.now() - start < 15) {}
      }
    }
  }
}

// Cairo timezone helper
const getCairoDateObj = () => {
  try {
    const s = new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });
    return new Date(s);
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
  if (!p) return "";
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

// Stateless Session Token Creation & Verification
function createStatelessToken(user: string, role: string, perms: string): string {
  const payload = {
    user,
    role,
    perms,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function verifyStatelessToken(token: string): { user: string; role: string; perms: string } | null {
  if (!token) return null;
  const normalizedToken = token.trim();
  if (normalizedToken === "mock-token-asfour") return { user: "عصفور", role: "مدير", perms: "كاملة" };
  if (normalizedToken === "mock-token-abuyassin") return { user: "ابو ياسين", role: "مدير", perms: "كاملة" };
  try {
    const decoded = JSON.parse(Buffer.from(normalizedToken, "base64").toString("utf-8"));
    if (decoded && decoded.exp && decoded.exp > Date.now()) {
      return { user: decoded.user, role: decoded.role, perms: decoded.perms };
    }
  } catch (e) {
    // Ignore invalid decoding
  }
  return null;
}

// Local cache for Google Apps Script to stop excessive hits during high concurrency
const SESSIONS: { [token: string]: { user: string; role: string; perms?: string } } = {};

function getSession(token: string) {
  if (!token) return null;
  const trimT = token.trim();
  if (SESSIONS[trimT]) {
    return SESSIONS[trimT];
  }
  const verified = verifyStatelessToken(trimT);
  if (verified) {
    return { user: verified.user, role: verified.role, perms: verified.perms };
  }
  return null;
}

function createSession(user: string, role: string, perms: string = "كاملة"): string {
  const token = createStatelessToken(user, role, perms);
  SESSIONS[token] = { user, role, perms };
  return token;
}

SESSIONS["mock-token-asfour"] = { user: "عصفور", role: "مدير", perms: "كاملة" };
SESSIONS["mock-token-abuyassin"] = { user: "ابو ياسين", role: "مدير", perms: "كاملة" };

// Global Error / Response wraps
const ok = (res: Response, d: any = {}) => res.json({ ok: true, ...d });
const err = (res: Response, m: string) => res.json({ ok: false, error: m });

// Cash and date helpers
const isDateToday = (dateInput: any): boolean => {
  if (!dateInput) return false;
  const str = dateInput.toString().trim().toLowerCase();
  const today = getCairoDateObj();
  const ty = today.getFullYear();
  const tm = today.getMonth() + 1;
  const td = today.getDate();
  
  const pad = (n: number) => n.toString().padStart(2, "0");
  const yStr = ty.toString();
  const mPad = pad(tm);
  const dPad = pad(td);
  
  return str.includes(`${yStr}-${mPad}-${dPad}`) || str.includes(`${yStr}/${mPad}/${dPad}`);
};

interface CacheEntry {
  data: any;
  timestamp: number;
}

const READ_CACHE = new Map<string, CacheEntry>();
const ACTIVE_FETCHES = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 10000; // 10s caching to respect the spec

function getCacheKey(payload: any): string {
  return JSON.stringify({
    action: payload.action,
    todayOnly: payload.todayOnly,
    status: payload.status,
    search: payload.search,
    supplier: payload.supplier,
    courier: payload.courier,
    currentUser: payload.currentUser,
    currentRole: payload.currentRole
  });
}

async function executeProxyRequest(gscriptUrl: string, payload: any): Promise<any> {
  const isWrite = [
    "addOrder", "addBulk", "updateStatus", "updateOrder", "deleteOrder", "bulkUpdate",
    "addSupplierPayment", "addCourierAdjustment", "addCashbox", "addExpense",
    "addUser", "registerUser", "updateUser", "addDailyClosing", "updateCourier"
  ].includes(payload.action);

  if (isWrite) {
    READ_CACHE.clear();
    ACTIVE_FETCHES.clear();
    
    const response = await fetch(gscriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await response.json();
  }

  const cacheKey = getCacheKey(payload);
  const cached = READ_CACHE.get(cacheKey);
  const nowMs = Date.now();
  if (cached && (nowMs - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }

  const active = ACTIVE_FETCHES.get(cacheKey);
  if (active) return active;

  const fetchPromise = (async () => {
    try {
      const response = await fetch(gscriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      READ_CACHE.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (err) {
      ACTIVE_FETCHES.delete(cacheKey);
      throw err;
    } finally {
      ACTIVE_FETCHES.delete(cacheKey);
    }
  })();

  ACTIVE_FETCHES.set(cacheKey, fetchPromise);
  return fetchPromise;
}

// ─────────────────────────────────────────────────────────────
// MAIN UNIFIED ENDPOINT
// ─────────────────────────────────────────────────────────────
let apiWriteQueue = Promise.resolve();

async function handleApiRequest(req: Request, res: Response) {
  try {
    const d = req.body;
    if (!d || !d.action) {
      return err(res, "Missing action parameter");
    }

    const gscriptUrl = (process.env.GOOGLE_SCRIPT_URL || "").trim();
    const hasProxy = gscriptUrl !== "" && gscriptUrl.startsWith("http");

    // 1. Authenticate / Login handles credentials
    if (d.action === "login") {
      const { name, pass } = d;
      if (!name || !pass) return err(res, "اكتب الاسم وكلمة المرور");
      
      if (hasProxy) {
        try {
          const response = await fetch(gscriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getUsers", token: "14014" })
          });
          const resData = await response.json();
          if (resData.ok && resData.users) {
            const user = resData.users.find(
              (u: any) => normalizeName(u.name) === normalizeName(name) && u.pass?.toString().trim() === pass.trim()
            );
            if (!user) return err(res, "اسم المستخدم أو كلمة المرور غلط");
            if (user.active === "لا") return err(res, "الحساب موقوف");
            
            const token = createSession(user.name, user.role, user.perms || "كاملة");
            return ok(res, { user: user.name, role: user.role, token, perms: user.perms || "كاملة" });
          } else {
            return err(res, resData.error || "خطأ في استرجاع بيانات الموظفين من جوجل شيت");
          }
        } catch (authErr: any) {
          console.error("Google Sheets Auth Proxy error:", authErr);
          // Fall back to local DB lookup if Sheets access is failing temporarily
        }
      }

      // Check local JSON DB
      const db = readDB();
      const user = db.users.find(
        (u: any) => normalizeName(u.name) === normalizeName(name) && u.pass?.toString().trim() === pass.trim()
      );
      if (!user) {
        return err(res, "اسم المستخدم أو كلمة المرور غلط");
      }
      if (user.active === "لا") {
        return err(res, "الحساب موقوف");
      }

      const token = createSession(user.name, user.role, user.perms || "كاملة");
      return ok(res, { user: user.name, role: user.role, token, perms: user.perms });
    }

    // 2. Resolve Session & Role for non-login actions
    let currentUser = "زائر";
    let currentRole = "زائر";

    if (d.action !== "checkPhone") {
      const sess = getSession(d.token);
      if (!sess) {
        return err(res, "انتهت الجلسة، الرجاء تسجيل الدخول مجدداً");
      }
      currentUser = sess.user;
      currentRole = sess.role;
    }

    // Role calculations
    const isAdmin = normalizeName(currentRole) === "admin" || currentRole === "مدير";
    const isSupplier = currentRole === "مورد" || normalizeName(currentRole) === "supplier";
    const isCourier = currentRole === "مندوب" || normalizeName(currentRole) === "courier";

    // ─────────────────────────────────────────────────────────────
    // SECURITY GUARD: ENFORCE ADMIN-ONLY DASHBOARD BOUNDARIES
    // ─────────────────────────────────────────────────────────────
    if (d.action === "dashboard") {
      if (!isAdmin) {
        return err(res, "صلاحية مرفوضة: لا يسمح لغير المسؤولين بطلب مؤشرات الخزانة أو الإحصائيات العامة للمركز.");
      }
    }

    if (d.action === "getUsers") {
      if (!isAdmin) {
        return err(res, "صلاحية مرفوضة لعرض لوحة حسابات المستخدمين");
      }
    }

    if (d.action === "expenses" || d.action === "cashbox") {
      if (!isAdmin && currentRole !== "محاسب") {
        return err(res, "صلاحية مرفوضة للتفتيش على الحسابات والخزنة اللحظية");
      }
    }

    // Cleaned current users
    const cleanCurrentUser = normalizeName(currentUser);

    // ─────────────────────────────────────────────────────────────
    // RUNNING FROM EXTERNAL GOOGLE SPREADSHEETS PROXY (IF ACTIVE)
    // ─────────────────────────────────────────────────────────────
    if (hasProxy) {
      const payloadToSheet: any = {
        ...d,
        token: "14014",
        currentUser,
        currentRole
      };

      // Force filtering parameters before sending to Sheets for security isolation
      if (isSupplier) {
        payloadToSheet.supplier = currentUser;
      } else if (isCourier) {
        payloadToSheet.courier = currentUser;
      }

      const resData = await executeProxyRequest(gscriptUrl, payloadToSheet);

      // Enforce security isolation on proxy output data
      if (resData && resData.ok) {
        if (d.action === "getOrders" && Array.isArray(resData.orders)) {
          let list = [...resData.orders];
          if (isSupplier) {
            list = list.filter(o => normalizeName(o.supplier) === cleanCurrentUser);
          } else if (isCourier) {
            list = list.filter(o => normalizeName(o.courier) === cleanCurrentUser);
          } else if (!isAdmin) {
            // Block all other non-admins from getting random orders
            return err(res, "غير مصرح لك بسحب قوائم الطلبات العامة");
          }
          resData.orders = list;
        }

        if (d.action === "getSupplierLedger" && Array.isArray(resData.ledger)) {
          if (isSupplier) {
            resData.ledger = resData.ledger.filter((l: any) => normalizeName(l.supplier) === cleanCurrentUser);
          } else if (!isAdmin && currentRole !== "محاسب") {
            return err(res, "صلاحية مرفوضة لسحب كشوفات الموردين");
          }
        }
      }

      return res.json(resData);
    }

    // ─────────────────────────────────────────────────────────────
    // STANDALONE INDEPENDENT LOCAL JSON DATABASE IMPLEMENTATION
    // ─────────────────────────────────────────────────────────────
    const db = readDB();

    switch (d.action) {
      case "getOrders": {
        let ordersList = [...db.orders];

        if (isSupplier) {
          ordersList = ordersList.filter(o => normalizeName(o.supplier) === cleanCurrentUser);
        } else if (isCourier) {
          ordersList = ordersList.filter(o => normalizeName(o.courier) === cleanCurrentUser);
        } else if (!isAdmin && currentRole !== "مشرف" && currentRole !== "موظف عمليات" && currentRole !== "محاسب" && currentRole !== "مسؤول مرتجعات") {
          return err(res, "منطقة محظورة: لا يمكنك مطالعة قوائم الشحنات العامة");
        }

        if (d.status && d.status !== "all") {
          ordersList = ordersList.filter((o: any) => o.status === d.status);
        }

        if (d.search) {
          const q = d.search.toLowerCase().trim();
          ordersList = ordersList.filter((o: any) =>
            [o.tracking, o.supplier, o.courier, o.customer, o.phone, o.gov, o.region, o.address, o.status, o.notes, o.returnQueueStatus]
              .join(" ")
              .toLowerCase()
              .includes(q)
          );
        }

        ordersList.reverse();
        return ok(res, { orders: ordersList, count: ordersList.length });
      }

      case "addOrder": {
        if (!isAdmin && !isSupplier && currentRole !== "مشرف") {
          return err(res, "ليس لديك صلاحية إضافة أوردرات");
        }

        const o = d.order || {};
        const phoneClean = fixPhone(o.phone || "");
        if (!phoneClean) {
          return err(res, "رقم الهاتف مطلوب");
        }

        // Duplicate screen check
        if (!d.force) {
          const dupOrders = db.orders.filter((x: any) => fixPhone(x.phone) === phoneClean || fixPhone(x.phone2) === phoneClean);
          if (dupOrders.length > 0) {
            const deliveredCount = dupOrders.filter((x: any) => x.status === "تم التسليم").length;
            const rate = Math.round((deliveredCount / dupOrders.length) * 100);
            return ok(res, {
              dup: true,
              count: dupOrders.length,
              rate,
              msg: `هذا العميل لديه ${dupOrders.length} طلب سابق (نسبة التسليم لطلباته ${rate}%)`
            });
          }
        }

        const id = generateID(db);
        const tNow = now();
        const shipPrice = Number(o.shipPrice || 60);
        const totalCOD = Number(o.totalCOD || (Number(o.prodPrice || 0) + shipPrice));
        const prodPrice = totalCOD - shipPrice;

        const newOrder = {
          tracking: id,
          createdAt: tNow,
          updatedAt: tNow,
          orderDate: tod(),
          supplier: isSupplier ? currentUser : (o.supplier || ""),
          customer: o.customer || "",
          phone: phoneClean,
          phone2: fixPhone(o.phone2 || ""),
          gov: o.gov || "",
          region: o.region || "",
          address: o.address || "",
          prodPrice: prodPrice,
          shipPrice: shipPrice,
          totalCOD: totalCOD,
          shipCost: shipPrice,
          courier: "", // Mandatory: ALWAYS blank at creation time
          status: "جديد",
          notes: o.notes || "",
          delivDate: "",
          retDate: "",
          addedBy: currentUser,
          commission: 0,
          returnShippingType: "",
          returnQueueStatus: "",
          returnQueueAgent: ""
        };

        db.orders.push(newOrder);

        // Instantly generate a ledger row for bookkeeping
        db.supplierLedger.push({
          supplier: newOrder.supplier,
          date: tNow,
          type: "أوردر مستلم",
          tracking: id,
          amount: prodPrice,
          desc: `تم استلام الشحنة ${id} صادر من المورد (المطلوب تحصيله ${totalCOD}ج - الشحن ${shipPrice}ج)`
        });

        db.statusHistory.push({
          tracking: id,
          oldStatus: "",
          newStatus: "جديد",
          updatedBy: currentUser,
          dateTime: tNow
        });

        writeDB(db);
        return ok(res, { id, msg: `تم تسجيل الأوردر بنجاح برقم تتبع: ${id}` });
      }

      case "addBulk": {
        if (!isAdmin && currentRole !== "مشرف" && !isSupplier) {
          return err(res, "غير مصرح لك بالتحميل الجماعي للشحنات");
        }

        const ordersArr = d.orders || [];
        const fallbackSupplier = isSupplier ? currentUser : (d.supplier || "مورد عام");
        const tNow = now();
        let addedCount = 0;

        for (const item of ordersArr) {
          const ph = fixPhone(item.phone || "");
          if (!ph && !item.customer) continue;

          let orderSupplier = isSupplier ? currentUser : (item.supplier || fallbackSupplier).toString().trim();
          
          // Auto-insert missing suppliers dynamic registration with safe space-stripped checks
          const normalizedSup = normalizeName(orderSupplier);
          const matchedSup = db.suppliers.find((s: any) => normalizeName(s.name) === normalizedSup);
          if (!matchedSup && orderSupplier) {
            db.suppliers.push({
              name: orderSupplier,
              phone: "—",
              price: 65,
              notes: "تم تسجيل المورد تلقائياً عبر التحميل الجماعي"
            });
          }

          let sPrice = Number(item.shipPrice) || 60;
          let tCOD = Number(item.totalCOD) || 0;
          let pPrice = Number(item.prodPrice) || 0;

          if (tCOD > 0) {
            pPrice = tCOD - sPrice;
          } else if (pPrice > 0) {
            tCOD = pPrice + sPrice;
          } else {
            pPrice = 200;
            tCOD = pPrice + sPrice;
          }

          const id = generateID(db);

          db.orders.push({
            tracking: id,
            createdAt: tNow,
            updatedAt: tNow,
            orderDate: tod(),
            supplier: orderSupplier,
            customer: item.customer || "",
            phone: ph,
            phone2: "",
            gov: item.gov || "",
            region: item.region || "",
            address: item.address || "",
            prodPrice: pPrice,
            shipPrice: sPrice,
            totalCOD: tCOD,
            shipCost: sPrice,
            courier: "", // ALWAYS empty initially
            status: "جديد",
            notes: item.notes || "",
            delivDate: "",
            retDate: "",
            addedBy: currentUser,
            commission: 0,
            returnShippingType: "",
            returnQueueStatus: "",
            returnQueueAgent: ""
          });

          // Ledger row
          db.supplierLedger.push({
            supplier: orderSupplier,
            date: tNow,
            type: "أوردر مستلم",
            tracking: id,
            amount: pPrice,
            desc: `تحميل جماعي للأوردر ${id} (صافي المورد: ${pPrice}ج)`
          });

          addedCount++;
        }

        writeDB(db);
        return ok(res, { added: addedCount, msg: `تم إدراج عدد ${addedCount} شحنة بنجاح` });
      }

      case "updateStatus": {
        const { tracking, status, returnShippingType } = d;
        if (!tracking || !status) return err(res, "بيانات ناقصة");

        const order = db.orders.find((o: any) => o.tracking === tracking);
        if (!order) return err(res, "الطلب غير مدرج بالخادم");

        const oldStatus = order.status;
        if (oldStatus === "تم التسليم") {
          return err(res, "تأمين مالي: يمنع تعديل حالة الطلبات المصنفة كـ 'تم التسليم' منعاً للتلاعب بالحصيلة المسلمة.");
        }

        // Action permissions check
        const isSupervisor = currentRole === "مشرف";
        const isOps = currentRole === "موظف عمليات";
        const isReturnsOfficer = currentRole === "مسؤول مرتجعات";

        const assignStatuses = ["تم الإسناد", "خارج مع المندوب", "ملغي", "التسليم للمورد"];
        if (assignStatuses.includes(status) && !isAdmin && !isSupervisor) {
          return err(res, "فقط المشرف أو المدير يستطيع تحديد وتوزيع الأوردرات");
        }

        if (isCourier) {
          const allowed = ["تم التسليم", "مرتجع", "مؤجل", "لا يوجد رد"];
          if (!allowed.includes(status)) {
            return err(res, "غير مسموح للمندوب بتقرير هذه الحالة");
          }
          if (normalizeName(order.courier) !== cleanCurrentUser) {
            return err(res, "عملية محظورة: هذه الشحنة ليست مسندة لحسابك اللحظي");
          }
        }

        if (isOps) return err(res, "صلاحية مرفوضة: موظف العمليات يكتفي بمطالعة الحالات فقط.");
        if (isSupplier) return err(res, "صلاحية مرفوضة: لا يملك العميل/المورد حق تعديل حالة تسليم الشحنة.");

        if (isReturnsOfficer) {
          const returnsAllowed = ["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"];
          if (!returnsAllowed.includes(status)) {
            return err(res, "موظف المرتجعات يتحكم بالمرتفعات ومساراتها فقط");
          }
        }

        // Apply Status Update
        if (status === "مرتجع") {
          if (!returnShippingType) {
            return err(res, "تحديد تكلفة الرفض مطلوب (العميل سدد الشحن أم رفض الدفع تماماً)");
          }
          order.status = "مرتجع";
          order.returnShippingType = returnShippingType;
          order.retDate = now();

          // Financial configuration for the courier commission
          if (returnShippingType === "paid") {
            const coup = db.couriers.find((c: any) => normalizeName(c.name) === cleanCurrentUser);
            const fee = coup ? Number(coup.commission || 25) : 25;
            order.commission = fee;

            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "مرتجع مدفوع الشحن",
              tracking: order.tracking,
              amount: fee,
              desc: `عمولة تسوية مرتجع مدفوع الشحن للشحنة: ${order.tracking}`
            });
          } else {
            order.commission = 0;
          }

          order.returnQueueStatus = "مرتجع جديد";
          order.returnQueueAgent = "أحمد المرتجعات";
        } else {
          order.status = status;
          order.updatedAt = now();

          if (status === "تم التسليم") {
            order.delivDate = now();
            // Calculate dynamic courier commission or fallback
            const coup = db.couriers.find((c: any) => normalizeName(c.name) === normalizeName(order.courier));
            const commVal = coup ? Number(coup.commission_success || coup.commission || 25) : 25;
            order.commission = commVal;

            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "تسليم",
              tracking: order.tracking,
              amount: commVal,
              desc: `تحصيل عمولة نجاح التوصيل للشحنة: ${order.tracking}`
            });

            // Automatically queue Collected COD into the general cashbox
            db.cashbox.push({
              date: now(),
              desc: `تحصيل نقدي للشحنة المسلمة: ${order.tracking} (المندوب: ${order.courier})`,
              type: "تحصيل مندوب",
              amount: Number(order.totalCOD),
              ref: order.tracking,
              addedBy: "System Live Agent"
            });
          }
        }

        // If returned delivers to supplier
        if (status === "التسليم للمورد" || status === "تم تسليم المرتجع للمورد" || status === "مرتجع تم تسليمه للمورد") {
          const hasLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "مرتجع تم تسليمه للمورد" || l.type === "مرتجع"));
          if (!hasLedger) {
            db.supplierLedger.push({
              supplier: order.supplier,
              date: now(),
              type: "مرتجع تم تسليمه للمورد",
              tracking: order.tracking,
              amount: -Number(order.prodPrice || 0),
              desc: `تصفية مالية: خصم قيمة السلعة لمرتجع استلمة المورد الشريك: ${order.tracking}`
            });
          }
        }

        order.updatedAt = now();

        db.statusHistory.push({
          tracking: tracking,
          oldStatus: oldStatus,
          newStatus: status,
          updatedBy: currentUser,
          dateTime: now()
        });

        writeDB(db);
        return ok(res, { tracking, status, msg: "تم تسجيل الحركة وحفظ التعديلات المالية اللحظية" });
      }

      case "updateOrder": {
        if (!isAdmin) {
          return err(res, "صلاحية حصرية: فرز وتعديل بيانات الشحنات المودعة متاح للمدير العام فقط.");
        }

        const { tracking, order: o } = d;
        if (!tracking) return err(res, "يرجى تقديم معامل رقم التتبع");

        const order = db.orders.find((x: any) => x.tracking === tracking);
        if (!order) return err(res, "الطلب غير مسجل");

        order.customer = o.customer !== undefined ? o.customer : order.customer;
        order.phone = o.phone !== undefined ? fixPhone(o.phone) : order.phone;
        order.phone2 = o.phone2 !== undefined ? fixPhone(o.phone2) : order.phone2;
        order.gov = o.gov !== undefined ? o.gov : order.gov;
        order.region = o.region !== undefined ? o.region : order.region;
        order.address = o.address !== undefined ? o.address : order.address;
        order.notes = o.notes !== undefined ? o.notes : order.notes;

        if (o.prodPrice !== undefined || o.shipPrice !== undefined) {
          const oldProd = order.prodPrice;
          const oldShip = order.shipPrice;
          const newProd = o.prodPrice !== undefined ? Number(o.prodPrice) : oldProd;
          const newShip = o.shipPrice !== undefined ? Number(o.shipPrice) : oldShip;

          if (oldProd !== newProd || oldShip !== newShip) {
            order.prodPrice = newProd;
            order.shipPrice = newShip;
            order.totalCOD = newProd + newShip;
            order.shipCost = newShip;

            // Update ledger bookkeeping for supplier to represent new amounts in real-time
            const supLed = db.supplierLedger.find((l: any) => l.tracking === tracking && l.type === "أوردر مستلم");
            if (supLed) {
              supLed.amount = newProd;
              supLed.desc = `تعديل القيمة المالية للشحنة ${tracking} (صافي حساب المورد الجديد: ${newProd}ج)`;
            }

            if (!db.auditLog) db.auditLog = [];
            db.auditLog.push({
              user: currentUser,
              type: "تعديل ميزانية شحنة",
              dateTime: now(),
              oldVal: `سعر المنتج: ${oldProd}ج، الشحن: ${oldShip}ج`,
              newVal: `سعر المنتج: ${newProd}ج، الشحن: ${newShip}ج`,
              reason: d.reason || "تصفية وتصحيح مالي يدوي من الإدارة"
            });
          }
        }

        if (o.courier !== undefined) {
          const oldCourier = order.courier;
          order.courier = o.courier;

          if (o.courier && !oldCourier && order.status === "جديد") {
            order.status = "تم الإسناد";
            db.statusHistory.push({
              tracking,
              oldStatus: "جديد",
              newStatus: "تم الإسناد",
              updatedBy: currentUser,
              dateTime: now()
            });
          }

          const coup = db.couriers.find((c: any) => normalizeName(c.name) === normalizeName(o.courier));
          order.commission = coup ? Number(coup.commission_success || coup.commission || 25) : 25;
        }

        order.updatedAt = now();
        writeDB(db);
        return ok(res, { tracking, msg: "تم تعديل وحفظ بيانات الأوردر بأمان" });
      }

      case "deleteOrder": {
        if (!isAdmin) return err(res, "صلاحية حصرية لمدير النظام");
        const { tracking } = d;
        const idx = db.orders.findIndex((x: any) => x.tracking === tracking);
        if (idx === -1) return err(res, "الشحنة غير متوفرة");

        const order = db.orders[idx];
        db.orders.splice(idx, 1);

        db.supplierLedger = db.supplierLedger.filter((l: any) => l.tracking !== tracking);
        db.courierLedger = db.courierLedger.filter((l: any) => l.tracking !== tracking);

        db.statusHistory.push({
          tracking,
          oldStatus: order.status,
          newStatus: "محذوف",
          updatedBy: currentUser,
          dateTime: now()
        });

        writeDB(db);
        return ok(res, { tracking, msg: "تم شطب وحذف الشحنة بالكامل من السجلات اللحظية" });
      }

      case "dashboard": {
        // Restricted to admin, returns calculations for dashboard view
        const ordersList = db.orders;
        let stats = {
          total: ordersList.length,
          todayTotal: 0,
          delivered: 0,
          returned: 0,
          pending: 0,
          active: 0,
          assignedPending: 0,
          totalCOD: 0,
          todayCOD: 0,
          profit: 0,
          totalGoodsValue: 0,
          deliveredGoodsValue: 0,
          returnedGoodsValue: 0
        };

        const courierStats: { [name: string]: { total: number; delivered: number; returned: number; cod: number } } = {};
        const supplierStats: { [name: string]: { total: number; delivered: number; returned: number } } = {};

        for (const o of ordersList) {
          const isToday = isDateToday(o.createdAt || o.orderDate);
          if (isToday) stats.todayTotal++;

          const isReturned = isOrderReturned(o.status);
          const isClosed = o.status === "تم التسليم" || isReturned;
          if (o.courier && !isClosed) stats.assignedPending++;

          const pPrice = Number(o.prodPrice || 0);
          stats.totalGoodsValue += pPrice;

          if (o.status === "تم التسليم" || o.status === "مسلم") {
            stats.delivered++;
            stats.totalCOD += Number(o.totalCOD || 0);
            stats.deliveredGoodsValue += pPrice;

            const orderCommission = Number(o.commission !== undefined ? o.commission : 25);
            const hubFee = Number(db.settings?.HUB_FEE !== undefined ? db.settings.HUB_FEE : 10);
            stats.profit += (Number(o.shipPrice || 0) - orderCommission - hubFee);

            if (o.delivDate && isDateToday(o.delivDate)) {
              stats.todayCOD += Number(o.totalCOD || 0);
            }
          } else if (isReturned) {
            stats.returned++;
            stats.returnedGoodsValue += pPrice;
          } else if (["جديد", "تم الإسناد", "مؤجل", "لا يوجد رد"].includes(o.status)) {
            stats.pending++;
          } else if (o.status === "خارج مع المندوب") {
            stats.active++;
          }

          if (o.courier) {
            const cn = o.courier.trim();
            if (!courierStats[cn]) courierStats[cn] = { total: 0, delivered: 0, returned: 0, cod: 0 };
            courierStats[cn].total++;
            if (o.status === "تم التسليم") {
              courierStats[cn].delivered++;
              courierStats[cn].cod += Number(o.totalCOD);
            } else if (isReturned) {
              courierStats[cn].returned++;
            }
          }

          if (o.supplier) {
            const sn = o.supplier.trim();
            if (!supplierStats[sn]) supplierStats[sn] = { total: 0, delivered: 0, returned: 0 };
            supplierStats[sn].total++;
            if (o.status === "تم التسليم") {
              supplierStats[sn].delivered++;
            } else if (isReturned) {
              supplierStats[sn].returned++;
            }
          }
        }

        const formattedCouriers = Object.entries(courierStats).map(([name, cs]: any) => {
          const rate = cs.total ? Math.round((cs.delivered / cs.total) * 100) : 0;
          return { name, ...cs, rate };
        });

        const formattedSuppliers = Object.entries(supplierStats).map(([name, ss]: any) => {
          const rate = ss.total ? Math.round((ss.delivered / ss.total) * 100) : 0;
          return { name, ...ss, rate };
        });

        const bestCourierObj = [...formattedCouriers].sort((a, b) => b.delivered - a.delivered)[0];
        const bestSupplierObj = [...formattedSuppliers].sort((a, b) => b.delivered - a.delivered)[0];

        const rate = stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0;
        const remainingStock = ordersList.filter((o: any) => o.status !== "تم التسليم" && o.status !== "خارج مع المندوب" && !isOrderReturned(o.status)).length;
        const inOfficeStock = stats.total - (stats.active + stats.returned);

        // Budget evaluation
        let treasuryBalance = 0;
        for (const item of db.cashbox) {
          const isDeposit = ["وارد", "تحصيل مندوب", "استلام عهدة مندوب"].includes(item.type);
          treasuryBalance += isDeposit ? Number(item.amount) : -Number(item.amount);
        }

        return ok(res, {
          stats: { ...stats, rate, remainingStock, inOfficeStock, treasuryBalance },
          couriers: formattedCouriers.sort((a, b) => b.delivered - a.delivered),
          suppliers: formattedSuppliers.sort((a, b) => b.delivered - a.delivered).slice(0, 10),
          bestCourier: bestCourierObj ? bestCourierObj.name : "—",
          bestSupplier: bestSupplierObj ? bestSupplierObj.name : "—"
        });
      }

      case "getSupplierLedger": {
        const target = isSupplier ? currentUser : (d.supplier || "");
        if (!target) return err(res, "المورد غير معروف");

        const ledger = db.supplierLedger.filter((l: any) => normalizeName(l.supplier) === normalizeName(target));
        let balance = 0;
        const entries = ledger.map((item: any) => {
          balance += Number(item.amount);
          return { ...item, balanceAfter: balance };
        });

        return ok(res, { entries: entries.reverse(), balance });
      }

      case "supplierDashboard": {
        const target = isSupplier ? currentUser : (d.supplier || "");
        if (!target) return err(res, "المورد المطلوب مجهول");

        const targetNormalized = normalizeName(target);
        const orderList = db.orders.filter((o: any) => normalizeName(o.supplier) === targetNormalized);
        let total = 0, delivered = 0, returned = 0, pending = 0, cod = 0;
        let totalGoodsValue = 0, deliveredGoodsValue = 0, returnedGoodsValue = 0;

        for (const o of orderList) {
          total++;
          const pPrice = Number(o.prodPrice || 0);
          totalGoodsValue += pPrice;

          if (o.status === "تم التسليم" || o.status === "مسلم") {
            delivered++;
            cod += pPrice;
            deliveredGoodsValue += pPrice;
          } else if (isOrderReturned(o.status)) {
            returned++;
            returnedGoodsValue += pPrice;
          } else {
            pending++;
          }
        }

        const transactions = db.supplierLedger.filter((l: any) => normalizeName(l.supplier) === targetNormalized);
        const balance = transactions.reduce((acc: number, item: any) => acc + Number(item.amount), 0);
        const rate = total ? Math.round((delivered / total) * 100) : 0;

        return ok(res, {
          stats: {
            total,
            delivered,
            returned,
            pending,
            cod,
            rate,
            due: balance,
            totalGoodsValue,
            deliveredGoodsValue,
            returnedGoodsValue
          }
        });
      }

      case "supplierAccounts": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية مرفوضة لمطالعة حسابات الموردين الشركاء");
        }

        const accountsMap: { [supplier: string]: any } = {};

        for (const transaction of db.supplierLedger) {
          const sup = transaction.supplier;
          if (!sup) continue;

          if (!accountsMap[sup]) {
            accountsMap[sup] = { name: sup, totalCOD: 0, returnsDelivered: 0, adjustments: 0, payments: 0, totalOrders: 0, deliveredOrders: 0, returnsCount: 0, balance: 0 };
          }

          accountsMap[sup].balance += Number(transaction.amount);
          if (transaction.type === "أوردر مستلم") accountsMap[sup].totalCOD += Number(transaction.amount);
          if (transaction.type === "مرتجع تم تسليمه للمورد") accountsMap[sup].returnsDelivered += Math.abs(Number(transaction.amount));
          if (transaction.type === "تسوية") accountsMap[sup].adjustments += Number(transaction.amount);
          if (transaction.type === "دفع نقدي") accountsMap[sup].payments += Math.abs(Number(transaction.amount));
        }

        for (const o of db.orders) {
          const sup = o.supplier;
          if (!sup) continue;
          if (!accountsMap[sup]) {
            accountsMap[sup] = { name: sup, totalCOD: 0, returnsDelivered: 0, adjustments: 0, payments: 0, totalOrders: 0, deliveredOrders: 0, returnsCount: 0, balance: 0 };
          }
          accountsMap[sup].totalOrders++;
          if (o.status === "تم التسليم") accountsMap[sup].deliveredOrders++;
          if (isOrderReturned(o.status)) {
            accountsMap[sup].returnsCount++;
          }
        }

        const list = Object.values(accountsMap).map((a: any) => {
          const rate = a.totalOrders ? Math.round((a.deliveredOrders / a.totalOrders) * 100) : 0;
          return { ...a, rate };
        });

        return ok(res, { accounts: list });
      }

      case "addSupplierPayment": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية مرفوضة لتسجيل وتفويض صرف الدفعات");
        }

        const { supplier, amount, desc } = d;
        if (!supplier || !amount) return err(res, "معامل المورد والمبلغ مطلوب للتسوية");

        const val = Number(amount);
        const description = desc || `سداد دفعة نقدية منصرفة للمورد: ${supplier}`;

        db.supplierLedger.push({
          supplier,
          date: now(),
          type: "دفع نقدي",
          tracking: "CASH-PAY",
          amount: -val,
          desc: description
        });

        db.cashbox.push({
          date: now(),
          desc: `${description} (صندوق صرف الموردين)`,
          type: "صادر",
          amount: val,
          ref: "SUPPAY",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, { msg: `تم صرف الدفعة النقدية بقيمة ${val}ج للمورد وتسويتها بعهد الصندوق` });
      }

      case "getCourierLedger": {
        const targetCourier = d.courier || currentUser;
        const coupProfile = db.couriers.find((c: any) => normalizeName(c.name) === normalizeName(targetCourier));
        if (!coupProfile) return err(res, "المندوب المختار غير مدرج بالخادم");

        const courierOrders = db.orders.filter((o: any) => normalizeName(o.courier) === normalizeName(targetCourier));

        const basicSalary = Number(coupProfile.base_fixed_salary || coupProfile.salary || 3000);
        const commissionSuccess = Number(coupProfile.commission_success || coupProfile.commission || 25);
        const commissionReturn = Number(coupProfile.commission_return || 10);

        const deliveredCount = courierOrders.filter((o: any) => o.status === "تم التسليم").length;
        const delivCommission = deliveredCount * commissionSuccess;

        const returnedCount = courierOrders.filter((o: any) => isOrderReturned(o.status)).length;
        const returnedPaidCount = courierOrders.filter((o: any) => isOrderReturned(o.status) && o.returnShippingType === "paid").length;
        const returnShippingCommission = returnedPaidCount * commissionSuccess;

        const targetLedger = db.courierLedger.filter((l: any) => normalizeName(l.courier) === normalizeName(targetCourier));
        const bonusesSum = targetLedger.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        const penaltiesSum = targetLedger.filter((l: any) => l.type === "جزاء").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        const totalCollected = courierOrders.filter((o: any) => o.status === "تم التسليم").reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);
        const totalPaidToCompany = db.cashbox
          .filter((item: any) => item.type === "استلام عهدة مندوب" && normalizeName(item.ref) === normalizeName(targetCourier))
          .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

        const deficit = totalCollected - totalPaidToCompany;
        const netSalary = basicSalary + delivCommission + returnShippingCommission + bonusesSum - penaltiesSum;

        return ok(res, {
          ledgerInfo: {
            courierName: targetCourier,
            basicSalary,
            commission_success: commissionSuccess,
            commission_return: commissionReturn,
            deliveredCount,
            delivCommission,
            returnedCount,
            returnedPaidCount,
            returnShippingCommission,
            bonusesSum,
            penaltiesSum,
            netSalary,
            totalCollected,
            totalPaidToCompany,
            deficit
          },
          transactions: targetLedger.reverse()
        });
      }

      case "getCourierInfo": {
        const targetCourier = currentUser;
        const coupProfile = db.couriers.find((c: any) => normalizeName(c.name) === cleanCurrentUser);
        if (!coupProfile) return err(res, "ملف المندوب غير مدرج بالخادم");

        const ordersList = db.orders.filter((o: any) => normalizeName(o.courier) === cleanCurrentUser);
        const total = ordersList.length;
        const delivered = ordersList.filter((o: any) => o.status === "تم التسليم").length;
        const returnedPaid = ordersList.filter((o: any) => isOrderReturned(o.status) && o.returnShippingType === "paid").length;
        const returnedAll = ordersList.filter((o: any) => isOrderReturned(o.status)).length;

        const basicSalary = Number(coupProfile.base_fixed_salary || coupProfile.salary || 3000);
        const commissionSuccess = Number(coupProfile.commission_success || coupProfile.commission || 25);
        const commissionReturn = Number(coupProfile.commission_return || 10);

        const ledgerTr = db.courierLedger.filter((l: any) => normalizeName(l.courier) === cleanCurrentUser);
        const bonuses = ledgerTr.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        const penalties = ledgerTr.filter((l: any) => l.type === "جزاء").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        const totalCommission = (delivered * commissionSuccess) + (returnedPaid * commissionSuccess);
        const totalEarnings = basicSalary + totalCommission + bonuses - penalties;

        const totalCollected = ordersList.filter((o: any) => o.status === "تم التسليم").reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);
        const totalPaidToCompany = db.cashbox
          .filter((item: any) => item.type === "استلام عهدة مندوب" && normalizeName(item.ref) === cleanCurrentUser)
          .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

        const deficit = totalCollected - totalPaidToCompany;

        return ok(res, {
          salary: basicSalary,
          commission: commissionSuccess,
          base_fixed_salary: basicSalary,
          total,
          delivered,
          returnedAll,
          returnedPaid,
          bonuses,
          penalties,
          totalCommission,
          totalEarnings,
          deficit,
          totalCollected,
          totalPaidToCompany
        });
      }

      case "addCourierAdjustment": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية مرفوضة لإجراء تسويات مالية للمناديب");
        }

        const { courier, type, amount, desc } = d;
        if (!courier || !amount || !type) return err(res, "معاملات مفقودة لإجراء التعديل الخاص بملف المندوب");

        const val = Number(amount);
        db.courierLedger.push({
          courier,
          date: now(),
          type,
          tracking: "ADJUST",
          amount: val,
          desc: desc || `تسجيل بند ${type} بقيمة ${val}ج للمندوب (${courier})`
        });

        if (type === "مكافأة") {
          db.cashbox.push({
            date: now(),
            desc: `مكافأة منصرفة للمندوب: ${courier} - ${desc}`,
            type: "صادر",
            amount: val,
            ref: "BONUS",
            addedBy: currentUser
          });
        }

        writeDB(db);
        return ok(res, { msg: "تم إدراج التسوية وحفظها بالملف المالي والعهدة" });
      }

      case "statusHistory": {
        const historyList = db.statusHistory.filter((h: any) => !d.tracking || h.tracking === d.tracking);
        return ok(res, { history: historyList.reverse() });
      }

      case "addCashbox": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية مرفوضة لإدراج قيود بالخزنة اللحظية");
        }

        const { desc, type, amount, ref } = d;
        if (!amount || !type) return err(res, "المبلغ ونوع القيد مطلوبين");

        db.cashbox.push({
          date: now(),
          desc: desc || "",
          type: type,
          amount: Number(amount),
          ref: ref || "",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, { msg: "تم إدراج بند الإيداع وتسييل العهد بشكل فوري بالخزينة" });
      }

      case "cashbox": {
        let balance = 0;
        const sortedEntries = [...db.cashbox].map((item: any) => {
          const isDeposit = ["وارد", "تحصيل مندوب", "استلام عهدة مندوب"].includes(item.type);
          balance += isDeposit ? Number(item.amount) : -Number(item.amount);
          return { ...item, balance };
        });

        return ok(res, { entries: sortedEntries.reverse(), balance });
      }

      case "addExpense": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية مرفوضة لتقييد مصروفات عامة");
        }

        const { cat, desc, amount } = d;
        if (!amount) return err(res, "المبلغ مطلوب للصرف");

        const val = Number(amount);

        db.expenses.push({
          date: now(),
          cat: cat || "أخرى",
          desc: desc || "",
          amount: val,
          by: currentUser
        });

        db.cashbox.push({
          date: now(),
          desc: `صرف بند مصروفات: ${desc || cat}`,
          type: "صادر",
          amount: val,
          ref: "EXPENSE",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, { msg: "تم تقييد المصروف بنجاح وسداده من الخزينة تلقائياً" });
      }

      case "expenses": {
        const total = db.expenses.reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        return ok(res, { expenses: [...db.expenses].reverse(), total });
      }

      case "addUser":
      case "registerUser": {
        if (!isAdmin) return err(res, "صلاحية حصرية لمدير النظام");
        const { name, role, pass, email, perms } = d;
        if (!name || !pass || !role) return err(res, "بيانات مفقودة للتسجيل");

        const normalizedInput = normalizeName(name);
        const userExists = db.users.find((u: any) => normalizeName(u.name) === normalizedInput);
        if (userExists) return err(res, "اسم المستخدم مسجل مسبقاً");

        const newUserObj = {
          name: name.trim(),
          role: role,
          pass: pass.trim(),
          active: "نعم",
          email: email || "",
          perms: role === "مدير" ? "كاملة" : (perms || "مفتوحة")
        };

        db.users.push(newUserObj);

        if (role === "مندوب") {
          db.couriers.push({
            name: name.trim(),
            phone: "—",
            commission: 25,
            salary: 3000,
            region: "—",
            base_fixed_salary: 3000,
            commission_success: 25,
            commission_return: 10
          });
        }

        if (role === "مورد") {
          db.suppliers.push({
            name: name.trim(),
            phone: "—",
            price: 65,
            notes: "مورد جديد"
          });
        }

        writeDB(db);
        return ok(res, { msg: `تم إنشاء الحساب بنجاح وإلحاق الحساب بدليل العمل` });
      }

      case "updateUser": {
        if (!isAdmin) return err(res, "صلاحية حصرية لمدير النظام");
        const { row, role, active, perms } = d;
        const index = Number(row) - 1;

        if (index < 0 || index >= db.users.length) {
          return err(res, "الحساب غير متوفر");
        }

        const target = db.users[index];
        target.role = role || target.role;
        target.active = active || target.active;
        target.perms = perms !== undefined ? perms : target.perms;

        writeDB(db);
        return ok(res, { msg: "تم تحديث وحفظ تفاعلات الحساب بنجاح" });
      }

      case "checkPhone": {
        const phoneClean = fixPhone(d.phone || "");
        if (!phoneClean) return ok(res, { count: 0, rate: 0 });

        const matches = db.orders.filter((o: any) => fixPhone(o.phone) === phoneClean || fixPhone(o.phone2) === phoneClean);
        if (matches.length === 0) return ok(res, { count: 0, rate: 0 });

        const deliv = matches.filter((o: any) => o.status === "تم التسليم").length;
        const rate = Math.round((deliv / matches.length) * 100);

        return ok(res, { count: matches.length, rate });
      }

      case "getCouriers": {
        const activeCouriers = db.users.filter((u: any) => (u.role === "مندوب" || u.name === "عصفور") && u.active !== "لا");
        const list = activeCouriers.map((u: any) => {
          const profile = db.couriers.find((c: any) => normalizeName(c.name) === normalizeName(u.name)) || {};
          return {
            name: u.name,
            phone: profile.phone || "—",
            commission: profile.commission !== undefined ? profile.commission : 25,
            salary: profile.salary !== undefined ? profile.salary : 3000,
            region: profile.region || "—",
            base_fixed_salary: profile.base_fixed_salary !== undefined ? profile.base_fixed_salary : (profile.salary || 3000),
            commission_success: profile.commission_success !== undefined ? profile.commission_success : (profile.commission || 25),
            commission_return: profile.commission_return !== undefined ? profile.commission_return : 10
          };
        });
        return ok(res, { couriers: list });
      }

      case "updateCourier": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية حصرية للادارة والادارة المالية");
        }
        const { name, phone, region, base_fixed_salary, commission_success, commission_return } = d;
        if (!name) return err(res, "الاسم مطلوب لتعديل الملف المالي");

        const normalizedC = normalizeName(name);
        let courier = db.couriers.find((c: any) => normalizeName(c.name) === normalizedC);

        if (!courier) {
          courier = {
            name: name.toString().trim(),
            phone: phone || "—",
            salary: Number(base_fixed_salary || 3000),
            commission: Number(commission_success || 25),
            region: region || "—",
            base_fixed_salary: Number(base_fixed_salary || 3000),
            commission_success: Number(commission_success || 25),
            commission_return: Number(commission_return || 10)
          };
          db.couriers.push(courier);
        } else {
          courier.phone = phone || courier.phone || "—";
          courier.region = region || courier.region || "—";
          courier.salary = Number(base_fixed_salary !== undefined ? base_fixed_salary : courier.salary);
          courier.commission = Number(commission_success !== undefined ? commission_success : courier.commission);
          courier.base_fixed_salary = Number(base_fixed_salary !== undefined ? base_fixed_salary : courier.base_fixed_salary);
          courier.commission_success = Number(commission_success !== undefined ? commission_success : courier.commission_success);
          courier.commission_return = Number(commission_return !== undefined ? commission_return : courier.commission_return);
        }

        writeDB(db);
        return ok(res, { msg: `تم تحديث ملف المندوب المالي ${name} بنجاح` });
      }

      case "dailySettlement": {
        if (!isAdmin && currentRole !== "محاسب") {
          return err(res, "صلاحية مخصصة للمدير المالي أو المحاسب لتأكيد التقفيل اليومي");
        }

        const tNow = now();
        const activeOrders = db.orders || [];

        // Archive fully processed/delivered/returned orders for the day
        const ordersToArchive = activeOrders.filter((o: any) => {
          const s = o.status;
          return s === "تم التسليم" || s === "مسلم" || s === "تم تسليم المرتجع للمورد" || s === "مرتجع تم تسليمه للمورد";
        });

        // Filter out from live
        db.orders = activeOrders.filter((o: any) => {
          const s = o.status;
          return !(s === "تم التسليم" || s === "مسلم" || s === "تم تسليم المرتجع للمورد" || s === "مرتجع تم تسليمه للمورد");
        });

        if (!db.archivedOrders) db.archivedOrders = [];
        db.archivedOrders.push(...ordersToArchive);

        // Calculate statistics
        const deliveredOrders = ordersToArchive.filter((o: any) => o.status === "تم التسليم" || o.status === "مسلم");
        const returnedOrders = ordersToArchive.filter((o: any) => o.status === "تم تسليم المرتجع للمورد" || o.status === "مرتجع تم تسليمه للمورد");

        const totalDelivered = deliveredOrders.length;
        const totalReturned = returnedOrders.length;

        const deliveredGoodsValue = deliveredOrders.reduce((sum: number, o: any) => sum + Number(o.prodPrice || 0), 0);
        const deliveredShippingValue = deliveredOrders.reduce((sum: number, o: any) => sum + Number(o.shipPrice || 0), 0);
        const totalCODCollected = deliveredOrders.reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);

        // Seal current cashbox balance
        let sealedBalance = 0;
        for (const item of (db.cashbox || [])) {
          const isDeposit = ["وارد", "تحصيل مندوب", "استلام عهدة مندوب", "إيداع", "تسوية زائد"].includes(item.type);
          sealedBalance += isDeposit ? Number(item.amount || 0) : -Number(item.amount || 0);
        }

        const closingObj = {
          date: tNow,
          settledBy: currentUser,
          ordersArchivedCount: ordersToArchive.length,
          totalDelivered,
          totalReturned,
          deliveredGoodsValue,
          deliveredShippingValue,
          totalCODCollected,
          sealedBalance,
        };

        if (!db.dailyClosings) db.dailyClosings = [];
        db.dailyClosings.push(closingObj);

        // Log transaction in Cashbox
        db.cashbox.push({
          date: tNow,
          desc: `تقفيل مالي وإغلاق عهدة اليوم وجرد الخزنة (بواسطة: ${currentUser}) - رصيد مغلق: ${sealedBalance}ج.م`,
          type: "تقفيل خزينة",
          amount: sealedBalance,
          ref: "DAILY-SEAL",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, {
          msg: "تم تفعيل وجدولة التقفيل اليومي وإغلاق عهدة اليوم بنجاح وتهيئة النظام لليوم التالي",
          summary: closingObj
        });
      }

      case "getDailyClosings": {
        return ok(res, { dailyClosings: db.dailyClosings || [] });
      }

      case "getSuppliers": {
        return ok(res, { suppliers: db.suppliers, supplierLedger: db.supplierLedger || [] });
      }

      case "report": {
        // Limited for admins or supervisors as reports are global summaries
        if (!isAdmin && currentRole !== "مشرف" && currentRole !== "محاسب") {
          return err(res, "صلاحية السحوبات والتقارير العامة محظورة لغير الإدارة العامة");
        }
        const { type, courier, supplier } = d;
        const ordersList = db.orders;
        let list = [];

        switch (type) {
          case "today":
            list = ordersList.filter((o: any) => isDateToday(o.createdAt) || isDateToday(o.updatedAt));
            break;
          case "pending":
            list = ordersList.filter((o: any) => ["جديد", "تم الإسناد", "خارج مع المندوب", "مؤجل", "لا يوجد رد"].includes(o.status));
            break;
          case "return":
            list = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status));
            break;
          case "delivered":
            list = ordersList.filter((o: any) => o.status === "تم التسليم");
            break;
          default:
            list = ordersList;
        }

        if (courier) list = list.filter((o: any) => normalizeName(o.courier) === normalizeName(courier));
        if (supplier) list = list.filter((o: any) => normalizeName(o.supplier) === normalizeName(supplier));

        return ok(res, { orders: list, count: list.length });
      }

      default:
        return err(res, `العملية المطلوبة ${d.action} غير مدعومة محلياً`);
    }
  } catch (error: any) {
    console.error("SERVER DISPATCH ERROR:", error);
    return err(res, "حدث خطأ غير متوقع بالخادم: " + error.message);
  }
}

app.post("/api", async (req: Request, res: Response) => {
  const d = req.body;
  if (!d || !d.action) {
    return err(res, "Missing action parameter");
  }

  // Clear cache for write actions
  const isWriteAction = [
    "addOrder", "addBulk", "updateStatus", "updateOrder", "deleteOrder", 
    "bulkUpdate", "addSupplierPayment", "addCourierAdjustment", "addCashbox", 
    "addExpense", "addUser", "registerUser", "updateUser", "addDailyClosing", 
    "updateCourier", "dailySettlement"
  ].includes(d.action);

  if (isWriteAction) {
    READ_CACHE.clear();
    ACTIVE_FETCHES.clear();
    return new Promise<void>((resolve) => {
      apiWriteQueue = apiWriteQueue.then(async () => {
        try {
          await handleApiRequest(req, res);
        } catch (e: any) {
          console.error("Queued write action failed:", e);
          if (!res.headersSent) {
            err(res, "حدث خطأ غير متوقع بالخادم أثناء معالجة العملية المتزامنة: " + e.message);
          }
        } finally {
          resolve();
        }
      });
    });
  } else {
    return handleApiRequest(req, res);
  }
});

// Serve frontend assets or integrate Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚚 Friend Plus Logistics is operating on http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
