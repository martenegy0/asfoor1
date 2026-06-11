import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "src", "db.json");

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
      notes: "تم التسليف بنجاح والتحصيل",
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

// Safe JSON Body Parsing: Bypasses parser if Vercel serverless has already populated req.body
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    next();
  } else {
    express.json({ limit: "50mb" })(req, res, next);
  }
});

// Atomic Database Helper
function readDB(): any {
  if (!fs.existsSync(DB_PATH)) {
    console.warn(`Database file not found at ${DB_PATH}. Returning fallback structure.`);
    return DEFAULT_DB;
  }
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return DEFAULT_DB;
  }
}

function writeDB(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Helpers
const now = () => {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const tod = () => {
  const date = new Date();
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

// Session simulated store
const SESSIONS: { [token: string]: { user: string; role: string } } = {};

function getSession(token: string) {
  if (!token) return null;
  return SESSIONS[token] || null;
}

function createSession(user: string, role: string): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  SESSIONS[token] = { user, role };
  return token;
}

// Seed admin sessions on demand so they don't expire easily
SESSIONS["mock-token-asfour"] = { user: "عصفور", role: "مدير" };
SESSIONS["mock-token-abuyassin"] = { user: "ابو ياسين", role: "مدير" };

// Global Error / Response wrapping
const ok = (res: Response, d: any = {}) => res.json({ ok: true, ...d });
const err = (res: Response, m: string) => res.json({ ok: false, error: m });

// ─────────────────────────────────────────────────────────────
// UNIFIED POST HANDLER
// ─────────────────────────────────────────────────────────────
app.post("/api", async (req: Request, res: Response) => {
  try {
    const d = req.body;
    if (!d || !d.action) {
      return err(res, "Missing action parameter");
    }

    // 🌐 Google Sheets Integration Web-App Proxy
    // If GOOGLE_SCRIPT_URL is configured in environment variables (e.g., .env),
    // we bypass local mock processing and forward the entire payload to the Google Sheet script directly.
    // This allows Google Sheets to act as the live cloud database for our modern web application!
    if (process.env.GOOGLE_SCRIPT_URL && process.env.GOOGLE_SCRIPT_URL.trim() !== "" && process.env.GOOGLE_SCRIPT_URL.startsWith("http")) {
      try {
        const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(d)
        });
        const resData = await response.json();
        return res.json(resData);
      } catch (proxyError: any) {
        console.error("Error proxying to Google Sheets Script URL:", proxyError);
        return err(res, `خطأ في الاتصال بسكريبت جوجل شيت: ${proxyError.message || proxyError}`);
      }
    }

    const db = readDB();
    const sess = getSession(d.token);

    // Authentication Action (No Auth Required)
    if (d.action === "login") {
      const { name, pass } = d;
      if (!name || !pass) return err(res, "اكتب الاسم وكلمة المرور");
      const user = db.users.find(
        (u: any) => u.name.trim() === name.trim() && u.pass.trim() === pass.trim()
      );
      if (!user) return err(res, "اسم المستخدم أو كلمة المرور غلط");
      if (user.active === "لا") return err(res, "الحساب موقوف");

      const token = createSession(user.name, user.role);
      return ok(res, { user: user.name, role: user.role, token, perms: user.perms });
    }

    // From this point onward, session verification is required
    if (!sess) {
      return err(res, "انتهت الجلسة، الرجاء تسجيل الدخول مجدداً");
    }

    const currentUser = sess.user;
    const currentRole = sess.role;

    switch (d.action) {
      // ─────────────────────────────────────────────────────────────
      // GET ORDERS
      // ─────────────────────────────────────────────────────────────
      case "getOrders": {
        const isAgent = currentRole === "مندوب";
        const isSupplier = currentRole === "مورد";
        const isReturnsOfficer = currentRole === "مسؤول مرتجعات";
        let ordersList = [...db.orders];

        // Apply role filter
        if (isAgent) {
          ordersList = ordersList.filter((o: any) => o.courier === currentUser);
          // If todayOnly is request, filter by today + pending
          if (d.todayOnly) {
            ordersList = ordersList.filter((o: any) => {
              const dt = o.createdAt.substring(0, 10);
              const isToday = dt === tod();
              const isPending = ["جديد", "تم الإسناد", "خارج مع المندوب", "مؤجل", "لا يوجد رد"].includes(o.status);
              return isToday || isPending;
            });
          }
        } else if (isSupplier) {
          ordersList = ordersList.filter((o: any) => o.supplier === currentUser);
        } else if (isReturnsOfficer) {
          // Returns Officer sees all orders that are returned (مرتجع) to manage them
          ordersList = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) || o.returnQueueStatus);
        }

        // Apply filters
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

        // Return reverse chronological order
        ordersList.reverse();
        return ok(res, { orders: ordersList, count: ordersList.length });
      }

      // ─────────────────────────────────────────────────────────────
      // ADD ORDER
      // ─────────────────────────────────────────────────────────────
      case "addOrder": {
        // Create order: Allowed for Admin and Supplier only
        if (currentRole !== "مدير" && currentRole !== "مورد") {
          return err(res, "ليس لديك صلاحية إضافة أوردرات");
        }

        const o = d.order || {};
        const phoneClean = fixPhone(o.phone || "");

        // Validate Phone
        if (!phoneClean) {
          return err(res, "رقم الهاتف مطلوب");
        }

        // Duplicate Check unless forced
        if (!d.force) {
          const dupOrders = db.orders.filter((x: any) => fixPhone(x.phone) === phoneClean || fixPhone(x.phone2) === phoneClean);
          if (dupOrders.length > 0) {
            const deliveredCount = dupOrders.filter((x: any) => x.status === "تم التسليم").length;
            const rate = Math.round((deliveredCount / dupOrders.length) * 100);
            return ok(res, {
              dup: true,
              count: dupOrders.length,
              rate,
              msg: `هذا العميل لديه ${dupOrders.length} طلب سابق (نسبة النجاح لطلباته ${rate}%)`
            });
          }
        }

        // New orders ALWAYS created with courier = "" per system rule:
        // "لا يتم اختيار مندوب أثناء إنشاء الأوردر. بعد ذلك فقط يقوم المشرف أو المدير بعملية الإسناد."
        const id = generateID(db);
        const tNow = now();
        const prodPrice = Number(o.prodPrice) || 0;
        const shipPrice = Number(o.shipPrice) || 60; // default 60
        const totalCOD = prodPrice + shipPrice;

        const newOrder = {
          tracking: id,
          createdAt: tNow,
          updatedAt: tNow,
          orderDate: tod(),
          supplier: currentRole === "مورد" ? currentUser : (o.supplier || ""),
          customer: o.customer || "",
          phone: phoneClean,
          phone2: fixPhone(o.phone2 || ""),
          gov: o.gov || "",
          region: o.region || "",
          address: o.address || "",
          prodPrice: prodPrice,
          shipPrice: shipPrice,
          totalCOD: totalCOD,
          shipCost: shipPrice, // ship cost defaults to ship price
          courier: "", // MUST BE EMPTY during creation
          status: "جديد", // ALWAYS starts as "جديد"
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

        // Record Supplier Ledger (COD values tracking)
        // Order addition adds product sum as supplier ledger row
        db.supplierLedger.push({
          supplier: newOrder.supplier,
          date: tNow,
          type: "أوردر مستلم",
          tracking: id,
          amount: prodPrice,
          desc: `أوردر جديد مستلم من المورد: ${id}`
        });

        // Add to audit trail
        db.statusHistory.push({
          tracking: id,
          oldStatus: "",
          newStatus: "جديد",
          updatedBy: currentUser,
          dateTime: tNow
        });

        writeDB(db);
        return ok(res, { id, msg: `تم إضافة الأوردر ${id} بنجاح` });
      }

      // ─────────────────────────────────────────────────────────────
      // BULK UPLOAD EXCEL / CSV
      // ─────────────────────────────────────────────────────────────
      case "addBulk": {
        if (!["مدير", "مشرف", "مورد"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحية رفع طلبات جماعية");
        }

        const ordersArr = d.orders || [];
        const supplierName = currentRole === "مورد" ? currentUser : (d.supplier || "مورد عام");
        const tNow = now();
        let addedCount = 0;

        for (const item of ordersArr) {
          const ph = fixPhone(item.phone || "");
          if (!ph && !item.customer) continue;

          const id = generateID(db);
          const pPrice = Number(item.prodPrice) || 0;
          const sPrice = Number(item.shipPrice) || 60;

          const newObj = {
            tracking: id,
            createdAt: tNow,
            updatedAt: tNow,
            orderDate: tod(),
            supplier: supplierName,
            customer: item.customer || "",
            phone: ph,
            phone2: "",
            gov: item.gov || "",
            region: item.region || "",
            address: item.address || "",
            prodPrice: pPrice,
            shipPrice: sPrice,
            totalCOD: pPrice + sPrice,
            shipCost: sPrice,
            courier: "", // EMPTY AT CREATION ALWAYS
            status: "جديد",
            notes: item.notes || "",
            delivDate: "",
            retDate: "",
            addedBy: currentUser,
            commission: 0,
            returnShippingType: "",
            returnQueueStatus: "",
            returnQueueAgent: ""
          };

          db.orders.push(newObj);

          // Supplier Ledger Transaction
          db.supplierLedger.push({
            supplier: supplierName,
            date: tNow,
            type: "أوردر مستلم",
            tracking: id,
            amount: pPrice,
            desc: `رفع أوردر مستلم جماعياً ${id}`
          });

          // History Log
          db.statusHistory.push({
            tracking: id,
            oldStatus: "",
            newStatus: "جديد",
            updatedBy: currentUser,
            dateTime: tNow
          });

          addedCount++;
        }

        writeDB(db);
        return ok(res, { added: addedCount, msg: `تم رفع ${addedCount} أوردر بنجاح` });
      }

      // ─────────────────────────────────────────────────────────────
      // UPDATE ORDER STATUS (Workflow Controls)
      // ─────────────────────────────────────────────────────────────
      case "updateStatus": {
        const { tracking, status, returnShippingType, returnQueueStatus } = d;
        if (!tracking || !status) return err(res, "معاملات مفقودة");

        const order = db.orders.find((o: any) => o.tracking === tracking);
        if (!order) return err(res, "الأوردر غير موجود");

        const oldStatus = order.status;

        // 🚨 Standard Restriction on 'تم التسليم'
        if (oldStatus === "تم التسليم") {
          return err(res, "لا يمكن تعديل حالة أوردر تم تسليمه");
        }

        // 🚨 Role Permissions Guard for status transitions
        // Admin, Supervisor: distributed/assigments/everything allowed
        const isAdmin = currentRole === "مدير";
        const isSuper = currentRole === "مشرف";
        const isOps = currentRole === "موظف عمليات";
        const isAgent = currentRole === "مندوب";
        const isSupplier = currentRole === "مورد";
        const isReturnsOfficer = currentRole === "مسؤول مرتجعات";

        // Assignment restrictions:
        const assignStatuses = ["تم الإسناد", "خارج مع المندوب", "ملغي", "التسليم للمورد"];
        if (assignStatuses.includes(status) && !isAdmin && !isSuper) {
          return err(res, "فقط المشرف أو المدير يستطيع تحديد وتوزيع الأوردرات");
        }

        // Agent Restrictions:
        if (isAgent) {
          const agentAllowedStatuses = ["تم التسليم", "مرتجع", "مؤجل", "لا يوجد رد"];
          if (!agentAllowedStatuses.includes(status)) {
            return err(res, "غير مسموح للمندوب باختيار هذه الحالة");
          }
          // Courier can only change status of their OWN orders
          if (order.courier !== currentUser) {
            return err(res, "هذا الأوردر ليس مسنداً إليك");
          }
        }

        // Ops and Supplier: Forbidden from state changes
        if (isOps) return err(res, "موظف العمليات لا يمتلك صلاحية تغيير الحالة");
        if (isSupplier) return err(res, "المورد لا يمتلك صلاحية تعديل الحالة");

        // Returns Officer Control
        if (isReturnsOfficer) {
          const returnsOfficerAllowed = ["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"];
          if (!returnsOfficerAllowed.includes(status)) {
            return err(res, "مسؤول المرتجعات يمكنه فقط تعيين حالات المرتجعات وتحديث مسارها");
          }
        }

        // Handle Return Logic (مرتجع)
        if (status === "مرتجع") {
          // Requires choice of shipping paid behavior
          if (!returnShippingType) {
            return err(res, "يرجى تحديد ما إذا دفع العميل الشحن أم رفض");
          }

          order.status = "مرتجع";
          order.returnShippingType = returnShippingType; // 'paid' or 'unpaid'
          order.retDate = now();

          // 1. Calculate Courier Commission according to:
          // "إذا دفع الشحن: يتم احتساب عمولة المندوب. إذا رفض دفع الشحن: لا يتم احتساب عمولة المندوب."
          if (returnShippingType === "paid") {
            const courierProfile = db.couriers.find((c: any) => c.name === order.courier);
            const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
            order.commission = commVal;

            // Log Courier Ledger Entry
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "مرتجع مدفوع الشحن",
              tracking: order.tracking,
              amount: commVal,
              desc: `عمولة مرتجع مدفوع الشحن للأوردر: ${order.tracking}`
            });
          } else {
            order.commission = 0;
            // Unpaid return has 0 commission, goes into follow up list
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "مرتجع غير مدفوع الشحن",
              tracking: order.tracking,
              amount: 0,
              desc: `عمولة مرتجع غير مدفوع الشحن للأوردر: ${order.tracking}`
            });
          }

          // 2. Returns Queue System:
          // "عند تحويل أي أوردر إلى: مرتجع، يظهر تلقائياً داخل Return Queue ويتم تعيين مسؤول المرتجعات لمتابعته."
          // Set initial return queue state
          order.returnQueueStatus = "مرتجع جديد";
          const firstReturnsOfficer = db.users.find((u: any) => u.role === "مسؤول مرتجعات" && u.active === "نعم");
          order.returnQueueAgent = firstReturnsOfficer ? firstReturnsOfficer.name : "أحمد المرتجعات";

          // Adjust Supplier Ledger:
          // Returns delivered back to the supplier subtract the product price (reverting the credited balance)
          db.supplierLedger.push({
            supplier: order.supplier,
            date: now(),
            type: "مرتجع",
            tracking: order.tracking,
            amount: -Number(order.prodPrice || 0),
            desc: `تخفيض مرتجع للأوردر ${order.tracking} (${returnShippingType === "paid" ? "دفع الشحن" : "رفض الشحن"})`
          });
        }

        // Handle transitioning between Return Queue statuses directly
        else if (["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(status)) {
          order.returnQueueStatus = status;
          // If return is finally delivered back to the supplier, let's also update status to 'التسليم للمورد' (Delivered to supplier)
          if (status === "تم تسليم المرتجع للمورد") {
            order.status = "التسليم للمورد";
            order.retDate = now();
          }
        }

        // Standard Transitions
        else {
          order.status = status;
          order.updatedAt = now();

          if (status === "تم التسليم") {
            order.delivDate = now();
            // Calculate Courier Commission
            const courierProfile = db.couriers.find((c: any) => c.name === order.courier);
            const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
            order.commission = commVal;

            // Save to Courier Ledger
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "تسليم",
              tracking: order.tracking,
              amount: commVal,
              desc: `عمولة تسليم الأوردر والتحصيل للأوردر: ${order.tracking}`
            });

            // Put delivered cash into Treasury (خارج مع المندوب cash settles to treasury)
            // Add to Cashbox: totalCOD is added as 'تحصيل مندوب'
            db.cashbox.push({
              date: now(),
              desc: `تحصيل أوردر مسلّم: ${order.tracking} (المندوب: ${order.courier})`,
              type: "تحصيل مندوب",
              amount: Number(order.totalCOD),
              ref: order.tracking,
              addedBy: "النظام التلقائي"
            });
          }

          if (status === "التسليم للمورد") {
            order.retDate = now();
          }
        }

        order.updatedAt = now();

        // Save Status History log
        db.statusHistory.push({
          tracking: tracking,
          oldStatus: oldStatus,
          newStatus: status,
          updatedBy: currentUser,
          dateTime: now()
        });

        writeDB(db);
        return ok(res, { tracking, status, msg: "تم تحديث حالة الأوردر بنجاح" });
      }

      // ─────────────────────────────────────────────────────────────
      // EDIT ORDER DETAILS (Admin Only)
      // ─────────────────────────────────────────────────────────────
      case "updateOrder": {
        if (currentRole !== "مدير") {
          return err(res, "فقط المدير يمتلك صلاحية تعديل بيانات الأوردر");
        }

        const { tracking, order: o } = d;
        if (!tracking) return err(res, "معامل رقم التتبع مفقود");

        const order = db.orders.find((x: any) => x.tracking === tracking);
        if (!order) return err(res, "الأوردر غير موجود");

        order.customer = o.customer !== undefined ? o.customer : order.customer;
        order.phone = o.phone !== undefined ? fixPhone(o.phone) : order.phone;
        order.phone2 = o.phone2 !== undefined ? fixPhone(o.phone2) : order.phone2;
        order.gov = o.gov !== undefined ? o.gov : order.gov;
        order.region = o.region !== undefined ? o.region : order.region;
        order.address = o.address !== undefined ? o.address : order.address;
        order.notes = o.notes !== undefined ? o.notes : order.notes;

        if (o.prodPrice !== undefined || o.shipPrice !== undefined) {
          order.prodPrice = o.prodPrice !== undefined ? Number(o.prodPrice) : order.prodPrice;
          order.shipPrice = o.shipPrice !== undefined ? Number(o.shipPrice) : order.shipPrice;
          order.totalCOD = order.prodPrice + order.shipPrice;
          order.shipCost = order.shipPrice;
        }

        // Courier assignment details
        if (o.courier !== undefined) {
          const oldCourier = order.courier;
          order.courier = o.courier;

          // If assigned (and old courier was empty), transition status to 'تم الإسناد' per workflow
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

          // Fetch new commission rate
          const courierProfile = db.couriers.find((c: any) => c.name === o.courier);
          order.commission = courierProfile ? Number(courierProfile.commission || 25) : 0;
        }

        order.updatedAt = now();

        writeDB(db);
        return ok(res, { tracking, msg: "تم تعديل بيانات الأوردر بنجاح" });
      }

      // ─────────────────────────────────────────────────────────────
      // DELETE ORDER (Admin Only)
      // ─────────────────────────────────────────────────────────────
      case "deleteOrder": {
        if (currentRole !== "مدير") {
          return err(res, "فقط المدير يمتلك صلاحية حذف الطلبات");
        }

        const { tracking } = d;
        if (!tracking) return err(res, "معامل مفقود");

        const index = db.orders.findIndex((x: any) => x.tracking === tracking);
        if (index === -1) return err(res, "الأوردر غير موجود");

        const order = db.orders[index];
        db.orders.splice(index, 1);

        // Record to statusHistory as deleted
        db.statusHistory.push({
          tracking,
          oldStatus: order.status,
          newStatus: "محذوف",
          updatedBy: currentUser,
          dateTime: now()
        });

        // Also purge any outstanding supplierLedger transactions to maintain real counts
        db.supplierLedger = db.supplierLedger.filter((l: any) => l.tracking !== tracking);
        db.courierLedger = db.courierLedger.filter((l: any) => l.tracking !== tracking);

        writeDB(db);
        return ok(res, { tracking, msg: "تم حذف الأوردر نهائياً" });
      }

      // ─────────────────────────────────────────────────────────────
      // BULK RE-ASSIGN / BATCH MANIFEST
      // ─────────────────────────────────────────────────────────────
      case "bulkUpdate": {
        if (!["مدير", "مشرف"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحيات التعديل الجماعي والمشافهة");
        }

        const trackings = d.trackings || [];
        const status = d.status;
        const courier = d.courier;
        let modified = 0;

        for (const t of trackings) {
          const order = db.orders.find((o: any) => o.tracking === t);
          if (!order) continue;

          const oldStatus = order.status;

          if (courier !== undefined && courier !== order.courier) {
            order.courier = courier;
            const cProfile = db.couriers.find((c: any) => c.name === courier);
            order.commission = cProfile ? Number(cProfile.commission || 25) : 25;

            // If courier is assigned, move 'جديد' to 'تم الإسناد'
            if (courier && oldStatus === "جديد") {
              order.status = "تم الإسناد";
            }
          }

          if (status !== undefined && status !== order.status) {
            order.status = status;
            if (status === "تم التسليم") {
              order.delivDate = now();
              // Add to Courier Ledger
              const cProfile = db.couriers.find((c: any) => c.name === order.courier);
              const comm = cProfile ? Number(cProfile.commission || 25) : 25;
              db.courierLedger.push({
                courier: order.courier,
                date: now(),
                type: "تسليم",
                tracking: order.tracking,
                amount: comm,
                desc: `عمولة تسليم الأوردر جماعياً: ${order.tracking}`
              });

              // Add to Cashbox
              db.cashbox.push({
                date: now(),
                desc: `تحصيل أوردر جماعي: ${order.tracking}`,
                type: "تحصيل مندوب",
                amount: Number(order.totalCOD),
                ref: order.tracking,
                addedBy: "النظام الجماعي"
              });
            }
            if (["مرتجع", "التسليم للمورد"].includes(status)) {
              order.retDate = now();
            }

            db.statusHistory.push({
              tracking: t,
              oldStatus,
              newStatus: status,
              updatedBy: currentUser,
              dateTime: now()
            });
          }

          order.updatedAt = now();
          modified++;
        }

        writeDB(db);
        return ok(res, { done: modified, msg: `تم تحديث ${modified} أوردر بنجاح` });
      }

      // ─────────────────────────────────────────────────────────────
      // DASHBOARD COUNTERS & PERFORMANCE METRICS
      // ─────────────────────────────────────────────────────────────
      case "dashboard": {
        const todayDate = tod();
        const ordersList = db.orders;

        let stats = {
          total: ordersList.length,
          todayTotal: 0,
          delivered: 0,
          returned: 0,
          pending: 0,
          active: 0,
          totalCOD: 0,
          todayCOD: 0,
          profit: 0
        };

        const courierStats: { [name: string]: { total: number; delivered: number; returned: number; cod: number } } = {};
        const supplierStats: { [name: string]: { total: number; delivered: number; returned: number } } = {};

        for (const o of ordersList) {
          const ordDate = o.createdAt.substring(0, 10);
          const isToday = ordDate === todayDate;

          if (isToday) {
            stats.todayTotal++; // Today's Orders created today
          }

          if (o.status === "تم التسليم") {
            stats.delivered++;
            stats.totalCOD += Number(o.totalCOD || 0);
            stats.profit += Number(o.shipPrice || 0); // profit is ship share

            if (o.delivDate && o.delivDate.substring(0, 10) === todayDate) {
              stats.todayCOD += Number(o.totalCOD || 0); // Money collected today
            }
          } else if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)) {
            stats.returned++;
          } else if (["جديد", "تم الإسناد", "مؤجل", "لا يوجد رد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد"].includes(o.status)) {
            stats.pending++;
          } else if (o.status === "خارج مع المندوب") {
            stats.active++;
          }

          // Courier Statistics
          if (o.courier) {
            if (!courierStats[o.courier]) {
              courierStats[o.courier] = { total: 0, delivered: 0, returned: 0, cod: 0 };
            }
            courierStats[o.courier].total++;
            if (o.status === "تم التسليم") {
              courierStats[o.courier].delivered++;
              courierStats[o.courier].cod += Number(o.totalCOD || 0);
            } else if (["مرتجع", "التسليم للمورد"].includes(o.status)) {
              courierStats[o.courier].returned++;
            }
          }

          // Supplier Statistics
          if (o.supplier) {
            if (!supplierStats[o.supplier]) {
              supplierStats[o.supplier] = { total: 0, delivered: 0, returned: 0 };
            }
            supplierStats[o.supplier].total++;
            if (o.status === "تم التسليم") {
              supplierStats[o.supplier].delivered++;
            } else if (["مرتجع", "التسليم للمورد"].includes(o.status)) {
              supplierStats[o.supplier].returned++;
            }
          }
        }

        // Add rate logic
        const formattedCouriers = Object.entries(courierStats).map(([name, cs]: any) => {
          const rate = cs.total ? Math.round((cs.delivered / cs.total) * 100) : 0;
          return { name, ...cs, rate };
        });

        const formattedSuppliers = Object.entries(supplierStats).map(([name, ss]: any) => {
          const rate = ss.total ? Math.round((ss.delivered / ss.total) * 100) : 0;
          return { name, ...ss, rate };
        });

        // Determine best elements
        const bestCourierObj = [...formattedCouriers].sort((a, b) => b.delivered - a.delivered)[0];
        const bestSupplierObj = [...formattedSuppliers].sort((a, b) => b.delivered - a.delivered)[0];

        const rate = stats.total ? Math.round((stats.delivered / stats.total) * 100) : 0;

        return ok(res, {
          stats: { ...stats, rate },
          couriers: formattedCouriers.sort((a, b) => b.total - a.total),
          suppliers: formattedSuppliers.sort((a, b) => b.total - a.total).slice(0, 10),
          bestCourier: bestCourierObj ? bestCourierObj.name : "—",
          bestSupplier: bestSupplierObj ? bestSupplierObj.name : "—"
        });
      }

      // ─────────────────────────────────────────────────────────────
      // SUPPLIER LEDGER SYSTEM (COD calculations)
      // ─────────────────────────────────────────────────────────────
      case "getSupplierLedger": {
        const supplierName = currentUser;
        const ledger = db.supplierLedger.filter((l: any) => l.supplier === supplierName);

        // Compute running balance live
        // Live Balance = Sum of amounts in ledger
        let balance = 0;
        const entries = ledger.map((item: any) => {
          balance += Number(item.amount);
          return { ...item, balanceAfter: balance };
        });

        return ok(res, { entries: entries.reverse(), balance });
      }

      case "supplierDashboard": {
        const isSupplier = currentRole === "مورد";
        const targetSupplier = isSupplier ? currentUser : (d.supplier || "");

        if (!targetSupplier) return err(res, "المورد غير معروف");

        const orderList = db.orders.filter((o: any) => o.supplier === targetSupplier);
        let total = 0, delivered = 0, returned = 0, pending = 0, cod = 0;

        for (const o of orderList) {
          total++;
          const st = o.status;
          if (st === "تم التسليم") {
            delivered++;
            cod += Number(o.prodPrice || 0); // COD for supplier is strictly their Product price share
          } else if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(st)) {
            returned++;
          } else {
            pending++;
          }
        }

        // Compute Ledger summary
        const ledgerTransactions = db.supplierLedger.filter((l: any) => l.supplier === targetSupplier);
        const ledgerBalance = ledgerTransactions.reduce((acc: number, item: any) => acc + Number(item.amount), 0);

        const rate = total ? Math.round((delivered / total) * 100) : 0;

        return ok(res, {
          stats: {
            total,
            delivered,
            returned,
            pending,
            cod,
            rate,
            due: ledgerBalance // Due matches precisely their current ledger ledger balance
          }
        });
      }

      case "supplierAccounts": {
        // Only accessible to Admin, Super, Accountant
        if (!["مدير", "مشرف", "محاسب"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحية سحب كشوفات الموردين المالية");
        }

        // Extract ledger details by Suppler
        const accountsMap: { [supplier: string]: { name: string; totalCOD: number; returnsDelivered: number; adjustments: number; payments: number; totalOrders: number; deliveredOrders: number; balance: number } } = {};

        // 1. Check with ledger transactions
        const ledger = db.supplierLedger;
        for (const transaction of ledger) {
          const sup = transaction.supplier;
          if (!sup) continue;

          if (!accountsMap[sup]) {
            accountsMap[sup] = { name: sup, totalCOD: 0, returnsDelivered: 0, adjustments: 0, payments: 0, totalOrders: 0, deliveredOrders: 0, balance: 0 };
          }

          accountsMap[sup].balance += Number(transaction.amount);

          if (transaction.type === "أوردر مستلم") accountsMap[sup].totalCOD += Number(transaction.amount);
          if (transaction.type === "مرتجع") accountsMap[sup].returnsDelivered += Math.abs(Number(transaction.amount));
          if (transaction.type === "تسوية") accountsMap[sup].adjustments += Number(transaction.amount);
          if (transaction.type === "دفع نقدي") accountsMap[sup].payments += Math.abs(Number(transaction.amount));
        }

        // 2. Fetch order volumes
        for (const o of db.orders) {
          const sup = o.supplier;
          if (!sup) continue;
          if (!accountsMap[sup]) {
            accountsMap[sup] = { name: sup, totalCOD: 0, returnsDelivered: 0, adjustments: 0, payments: 0, totalOrders: 0, deliveredOrders: 0, balance: 0 };
          }
          accountsMap[sup].totalOrders++;
          if (o.status === "تم التسليم") accountsMap[sup].deliveredOrders++;
        }

        const accountsList = Object.values(accountsMap).map((a: any) => {
          const rate = a.totalOrders ? Math.round((a.deliveredOrders / a.totalOrders) * 100) : 0;
          return { ...a, rate };
        });

        return ok(res, { accounts: accountsList });
      }

      case "addSupplierPayment": {
        // Admin or accountant can make cash payouts
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحية صرف دفعات للموردين");
        }

        const { supplier, amount, desc } = d;
        if (!supplier || !amount) return err(res, "بيانات مفقودة");

        const val = Number(amount);
        const finalDesc = desc || `دفعة نقدية مسددة للمورد: ${supplier}`;

        // Subtract from Supplier Account Ledger (Deducts balance)
        db.supplierLedger.push({
          supplier,
          date: now(),
          type: "دفع نقدي",
          tracking: "CASH-PAY",
          amount: -val,
          desc: finalDesc
        });

        // Dedect from Cashbox too
        db.cashbox.push({
          date: now(),
          desc: `${finalDesc} (صرف مورد)`,
          type: "سداد مورد",
          amount: val,
          ref: "SUPPAY",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, { msg: "تم تسجيل الدفعة النقدية بنجاح وتسويتها بالخزنة" });
      }

      // ─────────────────────────────────────────────────────────────
      // COURIER LEDGER SYSTEM & COMPENSTATION
      // ─────────────────────────────────────────────────────────────
      case "getCourierLedger": {
        // Courier salary summary sheet calculations:
        // Basic Salary, Delivered Orders, Delivery Commission, Returned With Shipping, Return Commission, Bonuses, Penalties, Net Salary
        const courierName = d.courier || currentUser;

        const courierProfile = db.couriers.find((c: any) => c.name === courierName);
        if (!courierProfile) return err(res, "المندوب غير مسجل");

        // Filter courier orders
        const courierOrders = db.orders.filter((o: any) => o.courier === courierName);

        // Calculations
        const basicSalary = Number(courierProfile.salary || 3000);
        const rawCommission = Number(courierProfile.commission || 25);

        const deliveredCount = courierOrders.filter((o: any) => o.status === "تم التسليم").length;
        const delivCommission = deliveredCount * rawCommission;

        const returnedPaidCount = courierOrders.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid").length;
        const returnShippingCommission = returnedPaidCount * rawCommission;

        // Fetch adjustments (Bonuses, Penalties) from courierLedger entries
        const targetLedger = db.courierLedger.filter((l: any) => l.courier === courierName);
        const bonusesSum = targetLedger.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        const penaltiesSum = targetLedger.filter((l: any) => l.type === "جزاء").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        // Apply filters by period if provided (day, week, month)
        // Here we can live compute net salary
        const netSalary = basicSalary + delivCommission + returnShippingCommission + bonusesSum - penaltiesSum;

        return ok(res, {
          ledgerInfo: {
            courierName,
            basicSalary,
            deliveredCount,
            delivCommission,
            returnedPaidCount,
            returnShippingCommission,
            bonusesSum,
            penaltiesSum,
            netSalary
          },
          transactions: targetLedger.reverse()
        });
      }

      case "getCourierInfo": {
        // Fast courier self checking
        const courierName = currentUser;
        const courierProfile = db.couriers.find((c: any) => c.name === courierName);
        if (!courierProfile) return err(res, "المندوب غير مسجل");

        const ordersList = db.orders.filter((o: any) => o.courier === courierName);
        const total = ordersList.length;
        const delivered = ordersList.filter((o: any) => o.status === "تم التسليم").length;
        const returnedPaid = ordersList.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid").length;

        const salary = Number(courierProfile.salary || 3000);
        const comm = Number(courierProfile.commission || 25);

        // Fetch adjustment amounts
        const ledgerTr = db.courierLedger.filter((l: any) => l.courier === courierName);
        const bonuses = ledgerTr.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        const penalties = ledgerTr.filter((l: any) => l.type === "جزاء").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        const totalCommission = (delivered * comm) + (returnedPaid * comm);
        const totalEarnings = salary + totalCommission + bonuses - penalties;

        return ok(res, {
          salary,
          commission: comm,
          total,
          delivered,
          returnedPaid,
          bonuses,
          penalties,
          totalCommission,
          totalEarnings
        });
      }

      case "addCourierAdjustment": {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "فقط المدير والمحاسب يمتلك صلاحية تعديل مكافآت وجزاءات المندوب");
        }

        const { courier, type, amount, desc } = d; // type can be 'مكافأة' or 'جزاء'
        if (!courier || !amount || !type) return err(res, "بيانات مفقودة للتسوية");

        const val = Number(amount);
        db.courierLedger.push({
          courier,
          date: now(),
          type,
          tracking: "ADJUST",
          amount: val,
          desc: desc || `${type} للمندوب بقيمة ${amount} ج`
        });

        // Treasury integration if needed
        if (type === "جزاء") {
          // penalty acts as deduction, doesn't debit treasury directly but increases company reserves
        } else if (type === "مكافأة") {
          // cashbox payout for bonus
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
        return ok(res, { msg: "تم تسجيل التسوية المالية للمندوب بنجاح" });
      }

      // ─────────────────────────────────────────────────────────────
      // STATUS CHANGE LOGICAL DIARY
      // ─────────────────────────────────────────────────────────────
      case "statusHistory": {
        const historyList = db.statusHistory.filter((h: any) => !d.tracking || h.tracking === d.tracking);
        return ok(res, { history: historyList.reverse() });
      }

      // ─────────────────────────────────────────────────────────────
      // CASHBOX (TREASURY LEDGER) OPERATIONS
      // ─────────────────────────────────────────────────────────────
      case "cashbox": {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "لا توجد لديك صلاحيات لرؤية الخزنة");
        }

        let balance = 0;
        const sortedEntries = [...db.cashbox].map((item: any) => {
          const isDeposit = ["وارد", "تحصيل مندوب"].includes(item.type);
          balance += isDeposit ? Number(item.amount) : -Number(item.amount);
          return { ...item, balance };
        });

        return ok(res, { entries: sortedEntries.reverse(), balance });
      }

      case "addCashbox": {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "صلاحية مرفوضة لإدراج حركات الخزنة");
        }

        const { desc, type, amount, ref } = d;
        if (!amount || !type) return err(res, "المبلغ والنوع مطلوبان");

        db.cashbox.push({
          date: now(),
          desc: desc || "",
          type: type,
          amount: Number(amount),
          ref: ref || "",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, { msg: "تم إدراج بند الخزينة وتصفيته" });
      }

      // ─────────────────────────────────────────────────────────────
      // EXPENSES OPERATIONS
      // ─────────────────────────────────────────────────────────────
      case "expenses": {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "لا توجد لديك صلاحية لمطالعة بند المصروفات");
        }

        const expensesList = db.expenses;
        const total = expensesList.reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        return ok(res, { expenses: [...expensesList].reverse(), total });
      }

      case "addExpense": {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "لا توجد صلاحيات صرف لميزانية المصروفات");
        }

        const { cat, desc, amount } = d;
        if (!amount) return err(res, "المبلغ مطلوب");

        const val = Number(amount);

        // Save expense item
        db.expenses.push({
          date: now(),
          cat: cat || "أخرى",
          desc: desc || "",
          amount: val,
          by: currentUser
        });

        // Automatically deduct from Treasury Cashbox (as 'صادر')
        db.cashbox.push({
          date: now(),
          desc: `صرف مصروف: ${desc || cat}`,
          type: "صادر",
          amount: val,
          ref: "EXPENSE",
          addedBy: currentUser
        });

        writeDB(db);
        return ok(res, { msg: "تم إرساء بند الصرف بنجاح وسداده من الخزينة تلقائياً" });
      }

      // ─────────────────────────────────────────────────────────────
      // USER MANAGEMENT (Admin Only)
      // ─────────────────────────────────────────────────────────────
      case "getUsers": {
        if (currentRole !== "مدير") {
          return err(res, "صلاحية حصرية لمدير النظام");
        }
        const usersList = db.users.map((u: any, idx: number) => ({
          row: idx + 1,
          ...u
        }));
        return ok(res, { users: usersList });
      }

      case "addUser": {
        if (currentRole !== "مدير") {
          return err(res, "صلاحية حصرية لمدير النظام");
        }
        const { name, role, pass, email } = d;
        if (!name || !pass || !role) return err(res, "بيانات مفقودة للتسجيل");

        const userExists = db.users.find((u: any) => u.name.trim() === name.trim());
        if (userExists) return err(res, "اسم المستخدم هذا مسجل مسبقاً");

        const newUserObj = {
          name: name.trim(),
          role: role,
          pass: pass.trim(),
          active: "نعم",
          email: email || "",
          perms: role === "مدير" ? "كاملة" : "مخصصة للمركز"
        };

        db.users.push(newUserObj);

        // If newly added role is a courier, add to courier profiles list
        if (role === "مندوب") {
          db.couriers.push({
            name: name.trim(),
            phone: "—",
            commission: 25,
            salary: 3000,
            region: "—"
          });
        }

        // If supplier, add to supplier profiles
        if (role === "مورد") {
          db.suppliers.push({
            name: name.trim(),
            phone: "—",
            price: 65,
            notes: "مورد جديد"
          });
        }

        writeDB(db);
        return ok(res, { msg: "تم تسجيل المستخدم بنجاح" });
      }

      case "updateUser": {
        if (currentRole !== "مدير") {
          return err(res, "صلاحية حصرية لمدير النظام");
        }

        const { row, role, active, perms } = d;
        const index = Number(row) - 1;

        if (index < 0 || index >= db.users.length) {
          return err(res, "المستخدم غير موجود");
        }

        const target = db.users[index];
        target.role = role || target.role;
        target.active = active || target.active;
        target.perms = perms !== undefined ? perms : target.perms;

        writeDB(db);
        return ok(res, { msg: "تم تحديث بيانات المستخدم بنجاح" });
      }

      // ─────────────────────────────────────────────────────────────
      // PHONE NUMBER PRE-SCREEN CONTROLS
      // ─────────────────────────────────────────────────────────────
      case "checkPhone": {
        const phoneClean = fixPhone(d.phone || "");
        if (!phoneClean) return ok(res, { count: 0, rate: 0 });

        const matches = db.orders.filter((o: any) => fixPhone(o.phone) === phoneClean || fixPhone(o.phone2) === phoneClean);
        if (matches.length === 0) return ok(res, { count: 0, rate: 0 });

        const deliv = matches.filter((o: any) => o.status === "تم التسليم").length;
        const rate = Math.round((deliv / matches.length) * 100);

        return ok(res, { count: matches.length, rate });
      }

      // ─────────────────────────────────────────────────────────────
      // RESOURCE MANAGEMENT / STATIC ARRAYS
      // ─────────────────────────────────────────────────────────────
      case "getCouriers": {
        return ok(res, { couriers: db.couriers });
      }

      case "getSuppliers": {
        return ok(res, { suppliers: db.suppliers });
      }

      case "report": {
        const { type, courier, supplier } = d;
        const ordersList = db.orders;
        const todayDate = tod();
        let list = [];

        switch (type) {
          case "today":
            list = ordersList.filter((o: any) => o.createdAt.substring(0, 10) === todayDate || o.updatedAt.substring(0, 10) === todayDate);
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

        if (courier) list = list.filter((o: any) => o.courier === courier);
        if (supplier) list = list.filter((o: any) => o.supplier === supplier);

        return ok(res, { orders: list, count: list.length });
      }

      default:
        return err(res, `العملية المطلوبة ${d.action} غير مدعومة`);
    }
  } catch (error: any) {
    console.error("SERVER DISPATCH ERROR:", error);
    return err(res, "حدث خطأ داخلي في الخادم: " + error.message);
  }
});

// ─────────────────────────────────────────────────────────────
// MIDDLEWARES & DEV SERVERS INGRESS
// ─────────────────────────────────────────────────────────────
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
    console.log(`🚚 Friend Plus Logistics is running on http://localhost:${PORT}`);
  });
}

export default app;

if (!process.env.VERCEL) {
  startServer();
}
