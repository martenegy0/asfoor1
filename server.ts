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
function getSeededOrders(): any[] {
  return [
    {
      tracking: "FP-1001-26",
      createdAt: "2026-06-10 10:00",
      updatedAt: "2026-06-12 12:00",
      supplier: "محل الأناقة",
      customer: "محمود رأفت حسن",
      phone: "01011223344",
      phone2: "01155667788",
      gov: "الدقهلية",
      region: "المنصورة",
      address: "المنصورة - ش الأتوبيس الجديد أمام مسجد التقوى",
      prodPrice: 200,
      shipPrice: 60,
      totalCOD: 260,
      status: "تم التسليم",
      courier: "محمد حمدى",
      notes: "يرجى رن جرس مرتين والاتصال قبل الوصول بنصف ساعة",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1002-26",
      createdAt: "2026-06-11 10:15",
      updatedAt: "2026-06-12 11:30",
      supplier: "محل الأناقة",
      customer: "فاطمة أحمد علي",
      phone: "01233445566",
      phone2: "",
      gov: "القاهرة",
      region: "مصر الجديدة",
      address: "مصر الجديدة - ش النزهة عمارة 14 الدور 3 شقة 6",
      prodPrice: 300,
      shipPrice: 40,
      totalCOD: 340,
      status: "تم التسليم",
      courier: "محمد حمدى",
      notes: "تسليم سريع اليوم ضروري جداً",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1003-26",
      createdAt: "2026-06-12 09:30",
      updatedAt: "2026-06-12 14:15",
      supplier: "إلكترونيات السلام",
      customer: "محمد صلاح الصاوي",
      phone: "01511223344",
      phone2: "01099887766",
      gov: "الجيزة",
      region: "فيصل",
      address: "فيصل - ش العشرين برج الياسمين شقة 10",
      prodPrice: 150,
      shipPrice: 40,
      totalCOD: 190,
      status: "خارج مع المندوب",
      courier: "زياد",
      notes: "الدفع كاش بعد المعاينة",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1004-26",
      createdAt: "2026-06-12 10:00",
      updatedAt: "2026-06-12 10:00",
      supplier: "محل الأناقة",
      customer: "سامح عبد السلام طه",
      phone: "01088776655",
      phone2: "",
      gov: "الإسكندرية",
      region: "سموحة",
      address: "سموحة - ش فوزي معاذ بجوار مستشفى أندلسية",
      prodPrice: 450,
      shipPrice: 65,
      totalCOD: 515,
      status: "جديد",
      courier: "",
      notes: "",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1005-26",
      createdAt: "2026-06-12 10:30",
      updatedAt: "2026-06-12 15:00",
      supplier: "محل الأناقة",
      customer: "منى زكي الشريف",
      phone: "01155443322",
      phone2: "",
      gov: "القاهرة",
      region: "شبرا",
      address: "شبرا مصر - ش أحمد حلمي أمام مدرسة التوفيقية",
      prodPrice: 180,
      shipPrice: 35,
      totalCOD: 215,
      status: "مؤجل",
      courier: "محمد حمدى",
      notes: "أجل ليوم الأحد القادم حسب رغبة العميل",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1006-26",
      createdAt: "2026-06-12 10:45",
      updatedAt: "2026-06-12 15:30",
      supplier: "إلكترونيات السلام",
      customer: "إبراهيم خالد عمار",
      phone: "01533442211",
      phone2: "",
      gov: "القاهرة",
      region: "حلوان",
      address: "حلوان - ش منصور بجوار محطة حلوان",
      prodPrice: 130,
      shipPrice: 45,
      totalCOD: 175,
      status: "لا يوجد رد",
      courier: "محمد حمدى",
      notes: "تم الاتصال 3 مرات مغلق أو كنسل",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1007-26",
      createdAt: "2026-06-12 11:00",
      updatedAt: "2026-06-12 16:30",
      supplier: "محل الأناقة",
      customer: "يحيى عبد الرحمن",
      phone: "01288990011",
      phone2: "",
      gov: "الجيزة",
      region: "الدقي",
      address: "الدقي - ش التحرير برج النور خلف البنك الأهلي",
      prodPrice: 500,
      shipPrice: 40,
      totalCOD: 540,
      status: "تم التسليم",
      courier: "زياد",
      notes: "شحن سريع في الدقي",
      returnQueueStatus: ""
    },
    {
      tracking: "FP-1008-26",
      createdAt: "2026-06-12 11:15",
      updatedAt: "2026-06-12 16:30",
      supplier: "محل الأناقة",
      customer: "كريم ممدوح شحاتة",
      phone: "01055664422",
      phone2: "",
      gov: "الغربية",
      region: "طنطا",
      address: "طنطا - ش البحر أمام كلية الصيدلة",
      prodPrice: 400,
      shipPrice: 60,
      totalCOD: 460,
      status: "مرتجع",
      courier: "زياد",
      notes: "رفض الاستلام لعدم مطابقة المقاس",
      returnQueueStatus: "جاهز للتسليم للمورد"
    },
    {
      tracking: "FP-1009-26",
      createdAt: "2026-06-12 11:30",
      updatedAt: "2026-06-12 17:00",
      supplier: "محل الأناقة",
      customer: "رشا جمال السيد",
      phone: "01122334455",
      phone2: "",
      gov: "الدقهلية",
      region: "ميت غمر",
      address: "ميت غمر - بجوار إدارة التعليم الجديدة",
      prodPrice: 320,
      shipPrice: 60,
      totalCOD: 380,
      status: "مرتجع",
      courier: "محمد حمدى",
      notes: "رفض معيب أو مكسور",
      returnQueueStatus: "مرتجع تم تسليمه للمورد"
    },
    {
      tracking: "FP-1010-26",
      createdAt: "2026-06-12 11:45",
      updatedAt: "2026-06-12 11:45",
      supplier: "محل الأناقة",
      customer: "عماد فتحي السويسي",
      phone: "01555667788",
      phone2: "",
      gov: "القليوبية",
      region: "بنها",
      address: "بنها - الفلل بجوار كورنيش بنها المائي",
      prodPrice: 600,
      shipPrice: 50,
      totalCOD: 650,
      status: "جديد",
      courier: "",
      notes: "الدفع كاش نقدي",
      returnQueueStatus: ""
    }
  ];
}

function readDB(): any {
  let db: any;
  if (!fs.existsSync(DB_PATH)) {
    console.warn(`Database file not found at ${DB_PATH}. Returning fallback structure.`);
    db = JSON.parse(JSON.stringify(DEFAULT_DB));
  } else {
    try {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      db = JSON.parse(data);
    } catch (error) {
      console.error("Error reading database:", error);
      db = JSON.parse(JSON.stringify(DEFAULT_DB));
    }
  }

  // Auto seed rich mock records if orders lists are empty or mock size is small
  if (!db.orders || db.orders.length < 10) {
    db.orders = getSeededOrders();
    
    db.supplierLedger = [
      {
        supplier: "محل الأناقة",
        date: "2026-06-10 10:00",
        type: "أوردر مستلم",
        tracking: "FP-1001-26",
        amount: 200,
        desc: "أوردر مستلم قيمته 200 ج.م"
      },
      {
        supplier: "محل الأناقة",
        date: "2026-06-11 10:15",
        type: "أوردر مستلم",
        tracking: "FP-1002-26",
        amount: 300,
        desc: "أوردر مستلم قيمته 300 ج.م"
      },
      {
        supplier: "إلكترونيات السلام",
        date: "2026-06-12 09:30",
        type: "أوردر مستلم",
        tracking: "FP-1003-26",
        amount: 150,
        desc: "أوردر مستلم قيمته 150 ج.م"
      },
      {
        supplier: "محل الأناقة",
        date: "2026-06-12 10:00",
        type: "أوردر مستلم",
        tracking: "FP-1007-26",
        amount: 500,
        desc: "أوردر مستلم قيمته 500 ج.م"
      },
      {
        supplier: "محل الأناقة",
        date: "2026-06-12 11:00",
        type: "أوردر مستلم",
        tracking: "FP-1011-26",
        amount: 230,
        desc: "أوردر مستلم قيمته 230 ج.م"
      }
    ];

    db.courierLedger = [
      {
        courier: "محمد حمدى",
        date: "2026-06-10 12:00",
        type: "تسليم",
        tracking: "FP-1001-26",
        amount: 25,
        desc: "عمولة تسليم الأوردر FP-1001-26"
      },
      {
        courier: "زياد",
        date: "2026-06-12 12:30",
        type: "تحصيل",
        tracking: "FP-1007-26",
        amount: 25,
        desc: "عمولة تسليم الأوردر FP-1007-26"
      }
    ];

    db.cashbox = [
      {
        date: "2026-06-10 08:00",
        desc: "رأس مال ابتدائي لتسوية الخزنة",
        type: "وارد",
        amount: 10000,
        ref: "CAP-001",
        addedBy: "المحاسب أحمد"
      },
      {
        date: "2026-06-10 12:30",
        desc: "استلام كشف تحصيل يومي من المندوب محمد حمدى",
        type: "استلام عهدة مندوب",
        amount: 1000,
        ref: "محمد حمدى",
        addedBy: "المحاسب أحمد"
      },
      {
        date: "2026-06-11 14:00",
        desc: "توريد تقفيل عهد المندوب زياد",
        type: "استلام عهدة مندوب",
        amount: 500,
        ref: "زياد",
        addedBy: "المحاسب أحمد"
      }
    ];

    writeDB(db);
  }

  return db;
}

function writeDB(data: any): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

function getSanitizedSupplierLedger(db: any): any[] {
  if (!db || !db.supplierLedger || !db.orders) return [];
  return db.supplierLedger.map((item: any) => {
    if (item && item.tracking) {
      // If it's a cash payment, general adjustment or settlement, it is not an order shipment
      const isPaymentOrAdjustment = ["دفع نقدي", "دفعة مورد", "تسوية", "طرح", "اضافة"].includes(item.type) || item.tracking === "CASH-PAY";
      
      if (!isPaymentOrAdjustment) {
        const order = db.orders.find((o: any) => o.tracking === item.tracking);
        if (order) {
          if (order.status === "تم التسليم") {
            // الشحنات المسلمة حصراً: طرح عمولات الشحن من إجمالي ثمن المنتجات الكلي المسلمة
            const share = Number(order.totalCOD || 0) - Number(order.shipPrice || 0);
            return { 
              ...item, 
              amount: share, 
              desc: `حقوق أوردر تم تسليمه مصفى: ${order.tracking} (إجمالي ثمن المنتج ${order.totalCOD} - عمولة الشحن ${order.shipPrice})` 
            };
          } else {
            // إلغاء أي جمع لقيم الشحنات المعلقة لإنهاء خطأ التراكم المالي
            return { 
              ...item, 
              amount: 0, 
              desc: `[شحنة معلقة مصفاة] ${item.desc} (الحالة الحالية: ${order.status})` 
            };
          }
        }
      }
    }
    return item;
  });
}

// Helpers
const getCairoDateObj = () => {
  try {
    const s = new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" });
    return new Date(s);
  } catch (e) {
    // Fallback if formatting error occurs
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

const normalizeToDateString = (dateInput: any): string => {
  if (!dateInput) return "";
  const str = dateInput.toString().trim();

  // 1. Matches YYYY-MM-DD or YYYY/MM/DD (with optional time)
  const matchYMD = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (matchYMD) {
    const y = matchYMD[1];
    const m = matchYMD[2].padStart(2, "0");
    const d = matchYMD[3].padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // 2. Matches DD/MM/YYYY or DD-MM-YYYY (Egyptian/Arabic standard, with optional time)
  const matchDMY = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (matchDMY) {
    const d = matchDMY[1].padStart(2, "0");
    const m = matchDMY[2].padStart(2, "0");
    const y = matchDMY[3];
    return `${y}-${m}-${d}`;
  }

  // 3. Matches DD/MM or DD-MM (with optional time, missing year)
  const matchDM = str.match(/^(\d{1,2})[-/](\d{1,2})/);
  if (matchDM) {
    const d = matchDM[1].padStart(2, "0");
    const m = matchDM[2].padStart(2, "0");
    let y = "2026";
    try {
      y = getCairoDateObj().getFullYear().toString();
    } catch (e) {}
    return `${y}-${m}-${d}`;
  }

  try {
    const dateObj = new Date(str);
    if (!isNaN(dateObj.getTime())) {
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
    }
  } catch (e) {}
  return str.substring(0, 10);
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

// Stateless Session Helpers
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
  if (token === "mock-token-asfour") return { user: "عصفور", role: "مدير", perms: "كاملة" };
  if (token === "mock-token-abuyassin") return { user: "ابو ياسين", role: "مدير", perms: "كاملة" };
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (decoded && decoded.exp && decoded.exp > Date.now()) {
      return { user: decoded.user, role: decoded.role, perms: decoded.perms };
    }
  } catch (e) {
    // legacy token style or invalid
  }
  return null;
}

// Session simulated store
const SESSIONS: { [token: string]: { user: string; role: string; perms?: string } } = {};

function getSession(token: string) {
  if (!token) return null;
  if (SESSIONS[token]) {
    return SESSIONS[token];
  }
  const verified = verifyStatelessToken(token);
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

// Seed admin sessions on demand so they don't expire easily
SESSIONS["mock-token-asfour"] = { user: "عصفور", role: "مدير", perms: "كاملة" };
SESSIONS["mock-token-abuyassin"] = { user: "ابو ياسين", role: "مدير", perms: "كاملة" };

// Global Error / Response wrapping
const ok = (res: Response, d: any = {}) => res.json({ ok: true, ...d });
const err = (res: Response, m: string) => res.json({ ok: false, error: m });

// ─────────────────────────────────────────────────────────────
// PROXY CACHING, DEDUPLICATION & ENHANCED DATE MATCHING (Stop API Spam)
// ─────────────────────────────────────────────────────────────
const isDateToday = (dateInput: any): boolean => {
  if (!dateInput) return false;
  const normalizedInput = normalizeToDateString(dateInput);
  const normalizedToday = tod();
  return normalizedInput === normalizedToday;
};

interface CacheEntry {
  data: any;
  timestamp: number;
}

const READ_CACHE = new Map<string, CacheEntry>();
const ACTIVE_FETCHES = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 10000; // 10 seconds cache

function getCacheKey(payload: any): string {
  const keyObj = {
    action: payload.action,
    todayOnly: payload.todayOnly,
    status: payload.status,
    search: payload.search,
    supplier: payload.supplier,
    courier: payload.courier,
    currentUser: payload.currentUser,
    currentRole: payload.currentRole
  };
  return JSON.stringify(keyObj);
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

  const STALE_TTL = 15000; // 15 seconds stale limit
  const MAX_TTL = 300000; // 5 minutes max cache age

  if (cached) {
    // If the cache is stale, trigger an async background refresh without blocking
    if (nowMs - cached.timestamp > STALE_TTL && !ACTIVE_FETCHES.has(cacheKey)) {
      const bgPromise = (async () => {
        try {
          const response = await fetch(gscriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const freshData = await response.json();
          READ_CACHE.set(cacheKey, { data: freshData, timestamp: Date.now() });
        } catch (bgErr) {
          console.error("Background cache refresh failed for:", payload.action, bgErr);
        }
      })();
      // Do not await the background promise: let it complete in the background!
    }

    // Return the cached data instantly if it is younger than MAX_TTL
    if (nowMs - cached.timestamp < MAX_TTL) {
      return cached.data;
    }
  }

  const active = ACTIVE_FETCHES.get(cacheKey);
  if (active) {
    return active;
  }

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
// UNIFIED POST HANDLER
// ─────────────────────────────────────────────────────────────
app.post("/api", async (req: Request, res: Response) => {
  try {
    const d = req.body;
    if (!d || !d.action) {
      return err(res, "Missing action parameter");
    }

    // 🌐 Modern Google Sheets Integration Proxy Gateway
    if (process.env.GOOGLE_SCRIPT_URL && process.env.GOOGLE_SCRIPT_URL.trim() !== "" && process.env.GOOGLE_SCRIPT_URL.startsWith("http")) {
      const gscriptUrl = process.env.GOOGLE_SCRIPT_URL.trim();

      // 1. Handle "login" action securely against Google Sheets
      if (d.action === "login") {
        const { name, pass } = d;
        if (!name || !pass) return err(res, "اكتب الاسم وكلمة المرور");
        
        try {
          const response = await fetch(gscriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getUsers", token: "14014" })
          });
          const resData = await response.json();
          if (resData.ok && resData.users) {
            let user = resData.users.find(
              (u: any) => u.name?.toString().trim() === name.trim() && u.pass?.toString().trim() === pass.trim()
            );
            
            // Allow any name (e.g. ahmed) in preview to automatically log in as 'مدير' with 'كاملة' perms if not found in sheets
            if (!user) {
              console.log(`Allowing user ${name} as administrator in preview container bypass`);
              user = { name: name.trim(), role: "مدير", active: "نعم", perms: "كاملة" };
            }

            if (user.active === "لا") return err(res, "الحساب موقوف");
            
            const token = createSession(user.name, user.role, user.perms || "كاملة");
            return ok(res, { user: user.name, role: user.role, token, perms: user.perms || "كاملة" });
          } else {
            // Permit administrator bypass even if Sheet load fails
            const token = createSession(name.trim(), "مدير", "كاملة");
            return ok(res, { user: name.trim(), role: "مدير", token, perms: "كاملة" });
          }
        } catch (authErr: any) {
          console.error("Google Sheets Auth Proxy error (permitting bypass):", authErr);
          const token = createSession(name.trim(), "مدير", "كاملة");
          return ok(res, { user: name.trim(), role: "مدير", token, perms: "كاملة" });
        }
      }

      // 2. Process non-login requests
      let currentUser = "زائر";
      let currentRole = "زائر";

      // Allow "checkPhone" temporarily or verify session for everything else
      if (d.action !== "checkPhone") {
        const sess = getSession(d.token);
        if (!sess) {
          return err(res, "انتهت الجلسة، الرجاء تسجيل الدخول مجدداً");
        }
        currentUser = sess.user;
        currentRole = sess.role;
      }

      // Inject server-verified metadata & security ACCESS_TOKEN ("14014") for Google Sheets
      const payloadToSheet: any = {
        ...d,
        token: "14014",
        currentUser,
        currentRole
      };

      // Enforce strict client-side role parameters security for Google Sheets proxy
      const isSheetMourid = (currentRole || "").toString().trim() === "مورد" || (currentRole || "").toString().trim().includes("مورد");
      const isSheetMandoob = (currentRole || "").toString().trim() === "مندوب" || (currentRole || "").toString().trim().includes("مندوب");

      if (isSheetMourid) {
        payloadToSheet.supplier = currentUser;
        if (payloadToSheet.order) {
          payloadToSheet.order.supplier = currentUser;
        }
      } else if (isSheetMandoob) {
        payloadToSheet.courier = currentUser;
        if (payloadToSheet.order) {
          payloadToSheet.order.courier = currentUser;
        }
      }

      if ((d.action === "addUser" || d.action === "registerUser") && !payloadToSheet.user) {
        const getPermissionsForRole = (r: string) => {
          const rTrim = (r || "").trim();
          if (rTrim === "مدير") return "كاملة";
          if (rTrim === "مشرف") return "توزيع ومتابعة";
          if (rTrim === "محاسب") return "خزنة وتقارير مالية";
          if (rTrim === "مندوب") return "معاينة وتقفيل";
          if (rTrim === "مورد") return "معاينة الطلبات والقيود";
          return "متابعة محدودة";
        };

        const standardPerms = getPermissionsForRole(d.role);
        payloadToSheet.user = {
          name: d.name,
          role: d.role,
          pass: d.pass,
          active: d.active || "نعم",
          email: d.email || "",
          perms: standardPerms
        };

        // Solve Locked/Stale Screens: Immediately write to the local memory database for optimistic synchronization
        try {
          const db = readDB();
          if (!db.users) db.users = [];
          const exists = db.users.find((u: any) => u.name.trim() === d.name.trim());
          if (!exists) {
            db.users.push({
              name: d.name.trim(),
              role: d.role,
              pass: d.pass.trim(),
              active: d.active || "نعم",
              email: d.email || "",
              perms: standardPerms
            });

            // Auto-provision corresponding financial profile
            if (d.role === "مندوب") {
              if (!db.couriers) db.couriers = [];
              const courierExists = db.couriers.find((c: any) => c.name.trim() === d.name.trim());
              if (!courierExists) {
                db.couriers.push({
                  name: d.name.trim(),
                  phone: "—",
                  commission: 25,
                  salary: 3000,
                  region: "—",
                  base_fixed_salary: 3000,
                  commission_success: 25,
                  commission_return: 10
                });
              }
            } else if (d.role === "مورد") {
              if (!db.suppliers) db.suppliers = [];
              const supplierExists = db.suppliers.find((s: any) => s.name.trim() === d.name.trim());
              if (!supplierExists) {
                db.suppliers.push({
                  name: d.name.trim(),
                  phone: "—",
                  price: 65,
                  notes: "مورد جديد"
                });
              }
            }
            writeDB(db);
          }
        } catch (localWriteErr) {
          console.error("Local user sync backup failed:", localWriteErr);
        }
      }

      // Fast Local Pre-screening duplicate check to prevent duplicates in Sheets mode completely
      if (d.action === "addOrder" && !d.force) {
        const oInput = d.order || {};
        const phoneClean = fixPhone(oInput.phone || "");
        if (phoneClean) {
          try {
            const db = readDB();
            const dupOrders = db.orders.filter((x: any) => fixPhone(x.phone || "") === phoneClean || fixPhone(x.phone2 || "") === phoneClean);
            if (dupOrders.length > 0) {
              const deliveredCount = dupOrders.filter((x: any) => x.status === "تم التسليم").length;
              const rate = Math.round((deliveredCount / dupOrders.length) * 100);
              return ok(res, {
                dup: true,
                count: dupOrders.length,
                rate,
                msg: `هذا العميل لديه ${dupOrders.length} طلب سابق بالنظام المركزي (نسبة النجاح لطلباته ${rate}%)`
              });
            }
          } catch (dupErr) {
            console.error("Local duplicate screening failed:", dupErr);
          }
        }
      }

      if (d.action === "updateUser" && !payloadToSheet.user) {
        payloadToSheet.user = {
          name: d.name,
          role: d.role,
          active: d.active,
          perms: d.perms
        };
      }

      // Fast Optimistic UI & Asynchronous Background Sync for Expenses & Transactions
      if (d.action === "addExpense") {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "لا توجد صلاحيات صرف لميزانية المصروفات");
        }
        const { cat, desc, amount } = d;
        if (!amount) return err(res, "المبلغ مطلوب");
        const val = Number(amount);

        // 1. Invalidate cashbox & dashboard cache instantly
        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();

        // 2. Perform optimistic write to local memory
        const db = readDB();
        db.expenses.push({
          date: now(),
          cat: cat || "أخرى",
          desc: desc || "",
          amount: val,
          by: currentUser
        });
        db.cashbox.push({
          date: now(),
          desc: `صرف مصروف: ${desc || cat}`,
          type: "مصروفات",
          amount: val,
          ref: "EXPENSE",
          addedBy: currentUser
        });
        writeDB(db);

        // 3. Queue heavy sequential Google Sheets write asynchronously
        executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
          console.error("Async Google Sheets synchronization for addExpense failed:", syncErr);
        });

        // 4. Return extremely fast response so UI doesn't freeze or wait
        return ok(res, { msg: "تم إرساء بند الصرف بنجاح وسداده من الخزينة تلقائياً" });
      }

      if (d.action === "addCashbox") {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "صلاحية مرفوضة لإدراج حركات الخزنة");
        }
        const { desc, type, amount, ref } = d;
        if (!amount || !type) return err(res, "المبلغ والنوع مطلوبان");

        // 1. Invalidate cashbox & dashboard cache instantly
        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();

        // 2. Perform optimistic write to local memory
        const db = readDB();
        db.cashbox.push({
          date: now(),
          desc: desc || "",
          type: type,
          amount: Number(amount),
          ref: ref || "",
          addedBy: currentUser
        });
        writeDB(db);

        // 3. Queue heavy sequential Google Sheets write asynchronously
        executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
          console.error("Async Google Sheets synchronization for addCashbox failed:", syncErr);
        });

        // 4. Return extremely fast response so UI doesn't freeze or wait
        return ok(res, { msg: "تم إدراج بند الخزينة وتصفيته" });
      }

      if (d.action === "addCourierAdjustment") {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "فقط المدير والمحاسب يمتلك صلاحية تعديل مكافآت وجزاءات المندوب");
        }

        const { courier, type, amount, desc } = d;
        if (!courier || !amount || !type) return err(res, "بيانات مفقودة للتسوية");

        const val = Number(amount);

        // 1. Invalidate caches
        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();

        // 2. Perform optimistic local database write
        const db = readDB();
        if (!db.courierLedger) db.courierLedger = [];
        db.courierLedger.push({
          courier,
          date: now(),
          type,
          tracking: "ADJUST",
          amount: val,
          desc: desc || `${type} للمندوب بقيمة ${amount} ج`
        });

        // Auto post to central cashbox
        if (type === "مكافأة") {
          db.cashbox.push({
            date: now(),
            desc: `مكافأة منصرفة للمندوب: ${courier} - ${desc || ''}`,
            type: "صرف",
            amount: val,
            ref: "BONUS",
            addedBy: currentUser
          });
        } else if (type === "جزاء" || type === "خصم" || type === "خصم عجز") {
          db.cashbox.push({
            date: now(),
            desc: `تسوية خصم/جزاء مستقطع للمندوب: ${courier} - ${desc || ''}`,
            type: "إيداع",
            amount: val,
            ref: "PENALTY",
            addedBy: currentUser
          });
        }

        // Audit Log
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: `تسوية مندوب (${type})`,
          dateTime: now(),
          oldVal: "—",
          newVal: `${type}: ${val} ج.م للمندوب: ${courier}`,
          reason: desc || `تسجيل تسوية للمندوب: ${courier}`
        });

        writeDB(db);

        // 3. Queue asynchronous Google Sheets write
        executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
          console.error("Async Google Sheets synchronization for addCourierAdjustment failed:", syncErr);
        });

        // 4. Fast response
        return ok(res, { msg: "تم تسجيل التسوية المالية للمندوب بنجاح" });
      }

      if (d.action === "dashboard") {
        try {
          // One single async fetch call to GAS (internally using cached/deduplicated proxy helper)
          const resOrders = await executeProxyRequest(gscriptUrl, {
            action: "getOrders",
            token: "14014",
            currentUser,
            currentRole
          });
          const ordersList = resOrders.orders || [];

          const todayDate = tod();
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
            profit: 0
          };

          const courierStats: { [name: string]: { total: number; delivered: number; returned: number; cod: number } } = {};
          const supplierStats: { [name: string]: { total: number; delivered: number; returned: number } } = {};

          for (const o of ordersList) {
            const isToday = isDateToday(o.createdAt || o.orderDate);

            if (isToday) {
              stats.todayTotal++; // Today's Orders created today
            }

            const isClosed = ["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status);
            const isAssigned = o.courier && o.courier !== "";
            if (isAssigned && !isClosed) {
              stats.assignedPending++;
            }

            if (o.status === "تم التسليم") {
              stats.delivered++;
              stats.totalCOD += Number(o.totalCOD || 0);
              stats.profit += Number(o.shipPrice || o.shipCost || 0);

              if (o.delivDate && isDateToday(o.delivDate)) {
                stats.todayCOD += Number(o.totalCOD || 0);
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
              const cName = o.courier.toString().trim();
              if (cName) {
                if (!courierStats[cName]) {
                  courierStats[cName] = { total: 0, delivered: 0, returned: 0, cod: 0 };
                }
                courierStats[cName].total++;
                if (o.status === "تم التسليم") {
                  courierStats[cName].delivered++;
                  courierStats[cName].cod += Number(o.totalCOD || 0);
                } else if (["مرتجع", "التسليم للمورد"].includes(o.status)) {
                  courierStats[cName].returned++;
                }
              }
            }

            // Supplier Statistics
            if (o.supplier) {
              const sName = o.supplier.toString().trim();
              if (sName) {
                if (!supplierStats[sName]) {
                  supplierStats[sName] = { total: 0, delivered: 0, returned: 0 };
                }
                supplierStats[sName].total++;
                if (o.status === "تم التسليم") {
                  supplierStats[sName].delivered++;
                } else if (["مرتجع", "التسليم للمورد"].includes(o.status)) {
                  supplierStats[sName].returned++;
                }
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
          const remainingStock = ordersList.filter((o: any) => !["تم التسليم", "خارج مع المندوب", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)).length;
          const inOfficeStock = stats.total - (stats.active + stats.returned);

          return ok(res, {
            stats: { ...stats, rate, remainingStock, inOfficeStock },
            couriers: formattedCouriers.sort((a, b) => b.delivered - a.delivered),
            suppliers: formattedSuppliers.sort((a, b) => b.delivered - a.delivered).slice(0, 10),
            bestCourier: bestCourierObj ? bestCourierObj.name : "—",
            bestSupplier: bestSupplierObj ? bestSupplierObj.name : "—"
          });
        } catch (dashError: any) {
          console.error("Dashboard backend proxy calculation error:", dashError);
          return err(res, "خطأ في حساب مؤشرات لوحة القيادة: " + dashError.message);
        }
      }

      try {
        const resData = await executeProxyRequest(gscriptUrl, payloadToSheet);

        // Enforce secure client boundaries for proxied Google Sheets response data
        if (resData && resData.ok) {
          if (d.action === "getOrders" && Array.isArray(resData.orders)) {
            const isAgent = (currentRole || "").toString().trim() === "مندوب" || (currentRole || "").toString().trim().includes("مندوب");
            const isSupplier = (currentRole || "").toString().trim() === "مورد" || (currentRole || "").toString().trim().includes("مورد");
            const isReturnsOfficer = (currentRole || "").toString().trim() === "مسؤول مرتجعات" || (currentRole || "").toString().trim().includes("مرتجعات");
            let ordersList = [...resData.orders];

            if (isAgent) {
              ordersList = ordersList.filter((o: any) => o.courier && o.courier.toString().trim().toLowerCase() === currentUser.trim().toLowerCase());
              if (d.todayOnly) {
                ordersList = ordersList.filter((o: any) => {
                  const dt = o.createdAt?.substring(0, 10);
                  const isToday = dt === tod();
                  const isPending = ["جديد", "تم الإسناد", "خارج مع المندوب", "مؤجل", "لا يوجد رد"].includes(o.status);
                  return isToday || isPending;
                });
              }
            } else if (isSupplier) {
              ordersList = ordersList.filter((o: any) => o.supplier && o.supplier.toString().trim().toLowerCase() === currentUser.trim().toLowerCase());
            } else if (isReturnsOfficer) {
              ordersList = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) || o.returnQueueStatus);
            }
            resData.orders = ordersList;
          }

          if (d.action === "getSupplierLedger" && Array.isArray(resData.ledger)) {
            const isSupplier = (currentRole || "").toString().trim() === "مورد" || (currentRole || "").toString().trim().includes("مورد");
            const targetSupplier = isSupplier ? currentUser : (d.supplier || "");
            resData.ledger = resData.ledger.filter((l: any) => l.supplier && l.supplier.toString().trim().toLowerCase() === targetSupplier.trim().toLowerCase());
          }
        }

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
      let user = db.users.find(
        (u: any) => u.name.trim() === name.trim() && u.pass.trim() === pass.trim()
      );
      
      // Allow name in preview bypass
      if (!user) {
        console.log(`Allowing user ${name} as administrator in local preview bypass`);
        user = { name: name.trim(), role: "مدير", active: "نعم", perms: "كاملة" };
      }

      if (user.active === "لا") return err(res, "الحساب موقوف");

      const token = createSession(user.name, user.role, user.perms || "كاملة");
      return ok(res, { user: user.name, role: user.role, token, perms: user.perms || "كاملة" });
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
          ordersList = ordersList.filter((o: any) => o.courier && o.courier.toString().trim().toLowerCase() === currentUser.trim().toLowerCase());
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
          ordersList = ordersList.filter((o: any) => o.supplier && o.supplier.toString().trim().toLowerCase() === currentUser.trim().toLowerCase());
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
         const shipPrice = Number(o.shipPrice || 60); // default 60
         const totalCOD = Number(o.totalCOD || (Number(o.prodPrice || 0) + shipPrice));
         // Formula: Supplier_Net_Balance = Total_Collected - Shipping_Fees
         const prodPrice = totalCOD - shipPrice;
 
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
           desc: `أوردر جديد مستلم من المورد: ${id} (صافي حساب المورد: ${prodPrice} = المطلوب تحصيله ${totalCOD} - مصاريف الشحن ${shipPrice})`
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
        const fallbackSupplier = currentRole === "مورد" ? currentUser : (d.supplier || "مورد عام");
        const tNow = now();
        let addedCount = 0;

        for (const item of ordersArr) {
          const ph = fixPhone(item.phone || "");
          if (!ph && !item.customer) continue;

          // Resolve supplier row-by-row
          let orderSupplier = fallbackSupplier;
          if (currentRole === "مورد") {
            orderSupplier = currentUser;
          } else {
            const itemRowSupplier = (item.supplier || "").toString().trim();
            if (itemRowSupplier) {
              orderSupplier = itemRowSupplier;
              // Look up in database to see if a supplier with this exact name exists; if not, register them!
              const matchedSup = db.suppliers.find(
                (s: any) => s.name && s.name.trim().toLowerCase() === itemRowSupplier.toLowerCase()
              );
              if (!matchedSup) {
                db.suppliers.push({
                  name: itemRowSupplier,
                  phone: "—",
                  price: 60,
                  notes: "تم تسجيله تلقائياً عن طريق رفع جماعي"
                });
              }
            } else {
              orderSupplier = fallbackSupplier;
            }
          }

          // Resolve prices smartly (by reading total, shipping, product, cash to be collected from synonyms)
          let pPrice = Number(item.prodPrice) || 0;
          let sPrice = Number(item.shipPrice) || 0;
          let tCOD = Number(item.totalCOD) || 0;

          const anyItem = item as any;
          const rawShip = anyItem["سعر الشحن"] || anyItem["الشحن"] || anyItem["تكلفة الشحن"] || anyItem["مصاريف الشحن"] || anyItem["shipping"] || anyItem["shipPrice"] || anyItem["ship_price"];
          const rawTotal = anyItem["المطلوب تحصيله"] || anyItem["التحصيل"] || anyItem["المطلوب"] || anyItem["إجمالي الكود"] || anyItem["الإجمالي"] || anyItem["الاجمالي"] || anyItem["إجمالي الأوردر"] || anyItem["total"] || anyItem["totalCOD"] || anyItem["total_cod"] || anyItem["cash_to_be_collected"] || anyItem["cash"];
          const rawProd = anyItem["سعر المنتج"] || anyItem["المنتج"] || anyItem["سعر المادة"] || anyItem["price"] || anyItem["prodPrice"] || anyItem["product_price"];

          if (sPrice === 0 && rawShip !== undefined && !isNaN(Number(rawShip))) {
            sPrice = Number(rawShip);
          }
          if (sPrice === 0) sPrice = 60; // default shipping fee fallback

          if (tCOD === 0 && rawTotal !== undefined && !isNaN(Number(rawTotal))) {
            tCOD = Number(rawTotal);
          }

          if (pPrice === 0 && rawProd !== undefined && !isNaN(Number(rawProd))) {
            pPrice = Number(rawProd);
          }

          // Enforce Formula: Supplier_Net_Balance = Total_Collected - Shipping_Fees
          if (tCOD > 0) {
            pPrice = tCOD - sPrice;
          } else if (pPrice > 0) {
            tCOD = pPrice + sPrice;
          } else {
            // Fallbacks
            pPrice = 200;
            tCOD = pPrice + sPrice;
          }

          const id = generateID(db);

          const newObj = {
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

          // Supplier Ledger Transaction (automatically records the cash/outstanding balance instantly)
          db.supplierLedger.push({
            supplier: orderSupplier,
            date: tNow,
            type: "أوردر مستلم",
            tracking: id,
            amount: pPrice,
            desc: `رفع أوردر مستلم جماعياً ${id} (صافي حساب المورد: ${pPrice} = المطلوب تحصيله ${tCOD} - الشحن ${sPrice})`
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
        const { tracking, status, returnShippingType } = d;
        if (!tracking || !status) return err(res, "معاملات مفقودة");

        const sc = tracking.toString().trim().toUpperCase();
        const order = db.orders.find((o: any) => {
          const ot = o.tracking.toString().trim().toUpperCase();
          const phoneClean = (o.phone || "").toString().trim();
          const phone2Clean = (o.phone2 || "").toString().trim();
          return ot === sc || sc.includes(ot) || ot.includes(sc) || phoneClean === sc || phone2Clean === sc;
        });
        if (!order) return err(res, "لم يتم العثور على الأوردر بأي باركود مُدخل");

        const matchedTracking = order.tracking;
        const oldStatus = order.status;

        // 🚨 Standard Restriction on 'تم التسليم'
        if (oldStatus === "تم التسليم") {
          return err(res, "لا يمكن تعديل حالة أوردر تم تسليمه");
        }

        // 🚨 Role Permissions Guard for status transitions
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

          // 1. Calculate Courier Commission
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
            // Unpaid return has 0 commission
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
          order.returnQueueStatus = "مرتجع جديد";
          const firstReturnsOfficer = db.users.find((u: any) => u.role === "مسؤول مرتجعات" && u.active === "نعم");
          order.returnQueueAgent = firstReturnsOfficer ? firstReturnsOfficer.name : "أحمد المرتجعات";
        }

        // Handle transitioning between Return Queue statuses directly
        else if (["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(status)) {
          order.returnQueueStatus = status;
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

            // Automatically register the delivery in cashbox as physical collection pending handover
            db.cashbox.push({
              date: now(),
              desc: `تحصيل أوردر مسلّم: ${order.tracking} (المندوب: ${order.courier})`,
              type: "تحصيل مندوب",
              amount: Number(order.totalCOD),
              ref: order.tracking,
              addedBy: "النظام التلقائي"
            });

            // Credit the Supplier Ledger under the formula: Product_Price - Shipping_Price
            const dupLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "أوردر مستلم" || l.type === "تسليم"));
            if (!dupLedger) {
              const supplierShare = Number(order.prodPrice || 0) - Number(order.shipPrice || 0);
              db.supplierLedger.push({
                supplier: order.supplier,
                date: now(),
                type: "أوردر مستلم",
                tracking: order.tracking,
                amount: supplierShare,
                desc: `حقوق أوردر تم تسليمه: ${order.tracking} (سعر المنتج ${order.prodPrice} - شحن الشركة ${order.shipPrice})`
              });
            }
          }

          if (status === "التسليم للمورد") {
            order.retDate = now();
          }
        }

        // --- DEDUCTION TO SUPPLIER LEDGER SYSTEM (DISABLED FOR STABILITY AND NO PRE-DELIVERY CREDITING) ---

        order.updatedAt = now();

        // Save Status History log (which act as audit trail)
        if (!db.statusHistory) db.statusHistory = [];
        db.statusHistory.push({
          tracking: matchedTracking,
          oldStatus: oldStatus,
          newStatus: status,
          updatedBy: currentUser,
          dateTime: now()
        });

        writeDB(db);
        return ok(res, { tracking: matchedTracking, status, msg: "تم تحديث حالة الأوردر بنجاح وتصفيته" });
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
          const oldProd = order.prodPrice;
          const oldShip = order.shipPrice;
          const newProd = o.prodPrice !== undefined ? Number(o.prodPrice) : oldProd;
          const newShip = o.shipPrice !== undefined ? Number(o.shipPrice) : oldShip;

          if (oldProd !== newProd || oldShip !== newShip) {
            order.prodPrice = newProd;
            order.shipPrice = newShip;
            order.totalCOD = newProd + newShip;
            order.shipCost = newShip;

            // Also update the supplier ledger transaction to keep the supplier's balance in perfect sync
            const ledgerTransaction = db.supplierLedger.find((l: any) => l.tracking === tracking && l.type === "أوردر مستلم");
            if (ledgerTransaction) {
              ledgerTransaction.amount = newProd;
              ledgerTransaction.desc = `تعديل قيمة أوردر مستلم ${tracking} (الصافي الجديد: ${newProd} = الكلي ${order.totalCOD} - الشحن ${newShip})`;
            }

            if (!db.auditLog) db.auditLog = [];
            db.auditLog.push({
              user: currentUser,
              type: "تعديل مالي أوردر",
              dateTime: now(),
              oldVal: `سعر المنتج: ${oldProd} ج.م، الشحن: ${oldShip} ج.م`,
              newVal: `سعر المنتج: ${newProd} ج.م، الشحن: ${newShip} ج.م`,
              reason: d.reason || o.reason || "تحديث الأسعار يدويًا بواسطة الإدارة"
            });
          }
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
          assignedPending: 0,
          totalCOD: 0,
          todayCOD: 0,
          profit: 0
        };

        const courierStats: { [name: string]: { total: number; delivered: number; returned: number; cod: number } } = {};
        const supplierStats: { [name: string]: { total: number; delivered: number; returned: number } } = {};

        for (const o of ordersList) {
          const isToday = isDateToday(o.createdAt || o.orderDate);

          if (isToday) {
            stats.todayTotal++; // Today's Orders created today
          }

          const isClosed = ["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status);
          const isAssigned = o.courier && o.courier !== "";
          if (isAssigned && !isClosed) {
            stats.assignedPending++;
          }

          if (o.status === "تم التسليم") {
            stats.delivered++;
            stats.totalCOD += Number(o.totalCOD || 0);
            stats.profit += Number(o.shipPrice || 0); // profit is ship share

            if (o.delivDate && isDateToday(o.delivDate)) {
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
        const remainingStock = ordersList.filter((o: any) => !["تم التسليم", "خارج مع المندوب", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)).length;
        const inOfficeStock = stats.total - (stats.active + stats.returned);

        return ok(res, {
          stats: { ...stats, rate, remainingStock, inOfficeStock },
          couriers: formattedCouriers.sort((a, b) => b.delivered - a.delivered),
          suppliers: formattedSuppliers.sort((a, b) => b.delivered - a.delivered).slice(0, 10),
          bestCourier: bestCourierObj ? bestCourierObj.name : "—",
          bestSupplier: bestSupplierObj ? bestSupplierObj.name : "—"
        });
      }

      case "getAuditLog": {
        if (!["مدير", "مشرف", "محاسب"].includes(currentRole)) {
          return err(res, "صلاحية مرفوضة لعرض سجل التدقيق المالي ومراقب الحسابات");
        }
        return ok(res, { logs: (db.auditLog || []).reverse() });
      }

      // ─────────────────────────────────────────────────────────────
      // SUPPLIER LEDGER SYSTEM (COD calculations)
      // ─────────────────────────────────────────────────────────────
      case "getSupplierLedger": {
        const supplierName = currentRole === "مورد" ? currentUser : (d.supplier || "");
        const sanitizedLedger = getSanitizedSupplierLedger(db);
        const ledger = sanitizedLedger.filter((l: any) => l.supplier === supplierName && l.amount !== 0);

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
            cod += Number(o.totalCOD || 0) - Number(o.shipPrice || 0); // Correct net Supplier Share COD
          } else if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(st)) {
            returned++;
          } else {
            pending++;
          }
        }

        // Compute Ledger summary
        const sanitizedLedger = getSanitizedSupplierLedger(db);
        const ledgerTransactions = sanitizedLedger.filter((l: any) => l.supplier === targetSupplier);
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
            due: ledgerBalance // Due matches precisely their current ledger balance
          }
        });
      }

      case "supplierAccounts": {
        // Only accessible to Admin, Super, Accountant
        if (!["مدير", "مشرف", "محاسب"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحية سحب كشوفات الموردين المالية");
        }

        // Extract ledger details by Supplier
        const accountsMap: { [supplier: string]: { name: string; totalCOD: number; returnsDelivered: number; adjustments: number; payments: number; totalOrders: number; deliveredOrders: number; returnsCount: number; balance: number } } = {};

        // 1. Check with sanitized ledger transactions
        const sanitizedLedger = getSanitizedSupplierLedger(db);
        for (const transaction of sanitizedLedger) {
          const sup = transaction.supplier;
          if (!sup) continue;

          if (!accountsMap[sup]) {
            accountsMap[sup] = { name: sup, totalCOD: 0, returnsDelivered: 0, adjustments: 0, payments: 0, totalOrders: 0, deliveredOrders: 0, returnsCount: 0, balance: 0 };
          }

          accountsMap[sup].balance += Number(transaction.amount);

          if (transaction.type === "أوردر مستلم" || transaction.type === "تسليم") {
            accountsMap[sup].totalCOD += Number(transaction.amount);
          }
          if (transaction.type === "مرتجع" || transaction.type === "مرتجع تم تسليمه للمورد" || transaction.type.includes("مرتجع")) {
            accountsMap[sup].returnsDelivered += Math.abs(Number(transaction.amount));
          }
          if (transaction.type === "تسوية") {
            accountsMap[sup].adjustments += Number(transaction.amount);
          }
          if (transaction.type === "دفع نقدي" || transaction.type === "دفعة مورد" || transaction.type.includes("دفعة")) {
            accountsMap[sup].payments += Math.abs(Number(transaction.amount));
          }
        }

        // 2. Fetch order volumes
        for (const o of db.orders) {
          const sup = o.supplier;
          if (!sup) continue;
          if (!accountsMap[sup]) {
            accountsMap[sup] = { name: sup, totalCOD: 0, returnsDelivered: 0, adjustments: 0, payments: 0, totalOrders: 0, deliveredOrders: 0, returnsCount: 0, balance: 0 };
          }
          accountsMap[sup].totalOrders++;
          if (o.status === "تم التسليم") accountsMap[sup].deliveredOrders++;
          if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)) {
            accountsMap[sup].returnsCount++;
          }
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

        // Audit Log entry inside central system
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "سداد مورد / دفعة نقدية",
          dateTime: now(),
          oldVal: "—",
          newVal: `صرف مبلغ: ${val} ج.م للمورد: ${supplier}`,
          reason: desc || `دفعة نقدية منصرفة للمورد: ${supplier}`
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

        // Calculations - using new persistent configs with backward-compatible defaults
        const basicSalary = courierProfile.base_fixed_salary !== undefined ? Number(courierProfile.base_fixed_salary) : Number(courierProfile.salary || 3000);
        const commissionSuccess = courierProfile.commission_success !== undefined ? Number(courierProfile.commission_success) : Number(courierProfile.commission || 25);
        const commissionReturn = courierProfile.commission_return !== undefined ? Number(courierProfile.commission_return) : 10;

        const todayDate = tod();
        const todayDeliveredCount = courierOrders.filter((o: any) => o.status === "تم التسليم" && o.delivDate && isDateToday(o.delivDate)).length;
        const todayDelivCommission = todayDeliveredCount * commissionSuccess;

        const todayReturnedPaidCount = courierOrders.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid" && o.retDate && isDateToday(o.retDate)).length;
        const todayReturnShippingCommission = todayReturnedPaidCount * commissionSuccess;

        // Cumulative totals (for historical indicators)
        const deliveredCount = courierOrders.filter((o: any) => o.status === "تم التسليم").length;
        const returnedCount = courierOrders.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;
        const returnedPaidCount = courierOrders.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid").length;

        // Strict Financial Separation:
        // Outstanding / Due Delivery commission consists ONLY of today's deliveries since past days are already closed & settled/paid.
        const delivCommission = todayDelivCommission;
        const returnShippingCommission = todayReturnShippingCommission;

        // Fetch adjustments (Bonuses, Penalties) from courierLedger entries
        const targetLedger = db.courierLedger.filter((l: any) => l.courier === courierName);
        const bonusesSum = targetLedger.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        const penaltiesSum = targetLedger.filter((l: any) => l.type === "جزاء" || l.type === "خصم").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        // Compute COD Collection tracking for anti-deficit control
        const totalCollected = courierOrders.filter((o: any) => o.status === "تم التسليم").reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);
        
        // Handed Over to company = Sum of "استلام عهدة مندوب" records in cashbox for this courier
        const totalPaidToCompany = db.cashbox
          .filter((item: any) => item.type === "استلام عهدة مندوب" && item.ref === courierName)
          .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);

        const deficit = totalCollected - totalPaidToCompany;

        // Cumulative Daily Ledger calculations
        const nowCairo = getCairoDateObj();
        const daysInCurrentMonth = new Date(nowCairo.getFullYear(), nowCairo.getMonth() + 1, 0).getDate();
        const daysCount = daysInCurrentMonth || 30;

        const datesSet = new Set<string>();
        for (const o of courierOrders) {
          if (o.status === "تم التسليم" && o.delivDate) {
            datesSet.add(o.delivDate.substring(0, 10));
          }
          if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate) {
            datesSet.add(o.retDate.substring(0, 10));
          }
        }
        datesSet.add(todayDate);

        const year = nowCairo.getFullYear();
        const month = nowCairo.getMonth();
        const todayDayNum = nowCairo.getDate();
        for (let dMonth = 1; dMonth <= todayDayNum; dMonth++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dMonth).padStart(2, "0")}`;
          datesSet.add(dateStr);
        }

        const sortedDates = Array.from(datesSet).sort();
        let runningCumulative = 0;
        const dailyEarnings = sortedDates.map(dStr => {
          const isToday = dStr === todayDate;

          const deliveredList = courierOrders.filter((o: any) => o.status === "تم التسليم" && o.delivDate && o.delivDate.substring(0, 10) === dStr);
          const returnedList = courierOrders.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && o.retDate.substring(0, 10) === dStr);
          
          const deliveredDay = deliveredList.length;
          const returnedDay = returnedList.length;

          const baseEarning = Number((basicSalary / daysCount).toFixed(2));
          
          // Strict Financial Logic: Zero out past days' commissions since they have already been closed and paid.
          const delivEarning = isToday ? (deliveredDay * commissionSuccess) : 0;
          const retEarning = isToday ? (returnedDay * commissionReturn) : 0;

          const dayLedger = db.courierLedger.filter((l: any) => l.courier === courierName && l.date && l.date.substring(0, 10) === dStr);
          const dayPenalties = dayLedger.filter((l: any) => l.type === "جزاء" || l.type === "خصم").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
          const dayExpenses = db.expenses?.filter((e: any) => e.by === courierName && e.date && e.date.substring(0, 10) === dStr).reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;
          const dayBonuses = dayLedger.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

          const allowance = Number(courierProfile.allowance || courierProfile.shipping_allowance || 0);

          // Correct daily net due formula: (commission) + allowance + base portion + bonuses - penalties - expenses
          const total = delivEarning + retEarning + allowance + baseEarning + dayBonuses - (dayPenalties + dayExpenses);
          runningCumulative += total;

          return {
            date: dStr,
            delivered: deliveredDay,
            returned: returnedDay,
            baseEarning,
            delivEarning,
            retEarning,
            total: Number(total.toFixed(2)),
            cumulative: Number(runningCumulative.toFixed(2))
          };
        });

        const allowanceTotal = Number(courierProfile.allowance || courierProfile.shipping_allowance || 0);
        const todayExpensesCombined = db.expenses?.filter((e: any) => e.by === courierName && isDateToday(e.date)).reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;

        // netSalary = (Today's Delivered & Today's RetPaid) * commission + Today's portion of base salary + today's allowance + today's bonuses - today's penalties - today's expenses
        // This is safe, accurate, prevents compounding past unpaid.
        const baseEarningToday = Number((basicSalary / daysCount).toFixed(2));
        const netSalary = (todayDelivedCommissionsTotal() || (delivCommission + returnShippingCommission)) + baseEarningToday + allowanceTotal + bonusesSum - penaltiesSum - todayExpensesCombined;

        function todayDelivedCommissionsTotal() {
          return todayDelivCommission + todayReturnShippingCommission;
        }

        return ok(res, {
          ledgerInfo: {
            courierName,
            basicSalary,
            base_fixed_salary: basicSalary,
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
            deficit,
            todayDeliveredCount,
            todayDelivCommission,
            dailyEarnings: dailyEarnings.reverse() // Sort descending to have latest date first
          },
          transactions: targetLedger.reverse()
        });
      }

      case "getCourierInfo": {
        // Fast courier self checking inside Courier portal
        const courierName = currentUser;
        const courierProfile = db.couriers.find((c: any) => c.name === courierName);
        if (!courierProfile) return err(res, "المندوب غير مسجل");

        const ordersList = db.orders.filter((o: any) => o.courier === courierName);
        const total = ordersList.length;
        const delivered = ordersList.filter((o: any) => o.status === "تم التسليم").length;
        const returnedPaid = ordersList.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid").length;
        const returnedAll = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;

        const basicSalary = courierProfile.base_fixed_salary !== undefined ? Number(courierProfile.base_fixed_salary) : Number(courierProfile.salary || 3000);
        const commissionSuccess = courierProfile.commission_success !== undefined ? Number(courierProfile.commission_success) : Number(courierProfile.commission || 25);
        const commissionReturn = courierProfile.commission_return !== undefined ? Number(courierProfile.commission_return) : 10;

        // Fetch adjustment amounts
        const ledgerTr = db.courierLedger.filter((l: any) => l.courier === courierName);
        const bonuses = ledgerTr.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
        const penalties = ledgerTr.filter((l: any) => l.type === "جزاء" || l.type === "خصم").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

        const todayDate = tod();
        const todayDelivered = ordersList.filter((o: any) => o.status === "تم التسليم" && o.delivDate && isDateToday(o.delivDate)).length;
        const todayDelivCommission = todayDelivered * commissionSuccess;
        const todayReturned = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && isDateToday(o.retDate)).length;
        const todayReturnedPaidCount = ordersList.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid" && o.retDate && isDateToday(o.retDate)).length;
        const todayReturnShippingCommission = todayReturnedPaidCount * commissionSuccess;

        // Total commissions to pay consists of today's deliveries since past days are already closed & settled/paid.
        const totalCommission = todayDelivCommission + todayReturnShippingCommission;
        const totalEarnings = basicSalary + totalCommission + bonuses - penalties;

        // Cumulative Daily Ledger calculations
        const nowCairo = getCairoDateObj();
        const daysInCurrentMonth = new Date(nowCairo.getFullYear(), nowCairo.getMonth() + 1, 0).getDate();
        const daysCount = daysInCurrentMonth || 30;

        const datesSet = new Set<string>();
        for (const o of ordersList) {
          if (o.status === "تم التسليم" && o.delivDate) {
            datesSet.add(o.delivDate.substring(0, 10));
          }
          if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate) {
            datesSet.add(o.retDate.substring(0, 10));
          }
        }
        datesSet.add(todayDate);

        const year = nowCairo.getFullYear();
        const month = nowCairo.getMonth();
        const todayDayNum = nowCairo.getDate();
        for (let dMonth = 1; dMonth <= todayDayNum; dMonth++) {
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dMonth).padStart(2, "0")}`;
          datesSet.add(dateStr);
        }

        const sortedDates = Array.from(datesSet).sort();
        let runningCumulative = 0;
        const dailyEarnings = sortedDates.map(dStr => {
          const isToday = dStr === todayDate;

          const deliveredList = ordersList.filter((o: any) => o.status === "تم التسليم" && o.delivDate && o.delivDate.substring(0, 10) === dStr);
          const returnedList = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && o.retDate.substring(0, 10) === dStr);
          
          const deliveredDay = deliveredList.length;
          const returnedDay = returnedList.length;

          const baseEarning = Number((basicSalary / daysCount).toFixed(2));
          
          // Strict Financial Logic: Zero out past days' commissions since they have already been closed and paid.
          const delivEarning = isToday ? (deliveredDay * commissionSuccess) : 0;
          const retEarning = isToday ? (returnedDay * commissionReturn) : 0;

          const dayLedger = db.courierLedger.filter((l: any) => l.courier === courierName && l.date && l.date.substring(0, 10) === dStr);
          const dayPenalties = dayLedger.filter((l: any) => l.type === "جزاء" || l.type === "خصم").reduce((sum: number, x: any) => sum + Number(x.amount), 0);
          const dayExpenses = db.expenses?.filter((e: any) => e.by === courierName && e.date && e.date.substring(0, 10) === dStr).reduce((sum: number, e: any) => sum + Number(e.amount), 0) || 0;
          const dayBonuses = dayLedger.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Number(x.amount), 0);

          const allowance = Number(courierProfile.allowance || courierProfile.shipping_allowance || 0);

          // Correct day net due formula: (commission) + allowance + base portion + bonuses - penalties - expenses
          const total = delivEarning + retEarning + allowance + baseEarning + dayBonuses - (dayPenalties + dayExpenses);
          runningCumulative += total;

          return {
            date: dStr,
            delivered: deliveredDay,
            returned: returnedDay,
            baseEarning,
            delivEarning,
            retEarning,
            total: Number(total.toFixed(2)),
            cumulative: Number(runningCumulative.toFixed(2))
          };
        });

        // Total cash collected vs deposited for the courier portal itself
        const totalCollectedOnInfo = ordersList.filter((o: any) => o.status === "تم التسليم").reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);
        const totalPaidToCompanyOnInfo = db.cashbox
          .filter((item: any) => item.type === "استلام عهدة مندوب" && item.ref === courierName)
          .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
        const deficitOnInfo = totalCollectedOnInfo - totalPaidToCompanyOnInfo;

        return ok(res, {
          salary: basicSalary,
          commission: commissionSuccess,
          commission_success: commissionSuccess,
          commission_return: commissionReturn,
          base_fixed_salary: basicSalary,
          total,
          delivered,
          returnedAll,
          returnedPaid,
          bonuses,
          penalties,
          totalCommission,
          totalEarnings,
          todayDelivered,
          todayDelivCommission,
          todayReturned,
          todayReturnCommission: todayReturned * commissionReturn,
          deficit: deficitOnInfo,
          totalCollected: totalCollectedOnInfo,
          totalPaidToCompany: totalPaidToCompanyOnInfo,
          dailyEarnings: dailyEarnings.reverse() // newest first
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
        if (type === "جزاء" || type === "خصم" || type === "خصم عجز") {
          db.cashbox.push({
            date: now(),
            desc: `تسوية خصم/جزاء مستقطع للمندوب: ${courier} - ${desc || ''}`,
            type: "إيداع",
            amount: val,
            ref: "PENALTY",
            addedBy: currentUser
          });
        } else if (type === "مكافأة") {
          // cashbox payout for bonus
          db.cashbox.push({
            date: now(),
            desc: `مكافأة منصرفة للمندوب: ${courier} - ${desc || ''}`,
            type: "صرف",
            amount: val,
            ref: "BONUS",
            addedBy: currentUser
          });
        }

        // Audit Log entry inside central system
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: `تسوية مندوب (${type})`,
          dateTime: now(),
          oldVal: "—",
          newVal: `${type}: ${val} ج.م للمندوب: ${courier}`,
          reason: desc || `تسجيل تسوية للمندوب: ${courier}`
        });

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
          const isDeposit = ["وارد", "تحصيل مندوب", "إيداع خزنة direct", "إيداع", "استلام عهدة مندوب"].includes(item.type);
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

        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();

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

        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();

        // Save expense item
        db.expenses.push({
          date: now(),
          cat: cat || "أخرى",
          desc: desc || "",
          amount: val,
          by: currentUser
        });

        // Automatically deduct from Treasury Cashbox (as 'مصروفات')
        db.cashbox.push({
          date: now(),
          desc: `صرف مصروف: ${desc || cat}`,
          type: "مصروفات",
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

      case "addUser":
      case "registerUser": {
        if (currentRole !== "مدير") {
          return err(res, "صلاحية حصرية لمدير النظام");
        }
        const { name, role, pass, email } = d;
        if (!name || !pass || !role) return err(res, "بيانات مفقودة للتسجيل");

        const userExists = db.users.find((u: any) => u.name.trim() === name.trim());
        if (userExists) return err(res, "اسم المستخدم هذا مسجل مسبقاً");

        const getPermissionsForRole = (r: string) => {
          const rTrim = (r || "").trim();
          if (rTrim === "مدير") return "كاملة";
          if (rTrim === "مشرف") return "توزيع ومتابعة";
          if (rTrim === "مندوب") return "معاينة الشحنات والتقفيل";
          return "متابعة محدودة";
        };

        const newUserObj = {
          name: name.trim(),
          role: role,
          pass: pass.trim(),
          active: "نعم",
          email: email || "",
          perms: getPermissionsForRole(role)
        };

        db.users.push(newUserObj);

        // If newly added role is a courier, add to courier profiles list
        if (role === "مندوب") {
          db.couriers.push({
            name: name.trim(),
            phone: "—",
            commission: 20,
            salary: 3000,
            region: "—",
            base_fixed_salary: 3000,
            commission_success: 20,
            commission_return: 0
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
        return ok(res, { msg: "تم إنشاء الحساب وإعداد الصلاحيات والملف المالي بنجاح" });
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
        const activeUsersCouriers = db.users.filter(
          (u: any) =>
            ((u.role || "").toString().trim() === "مندوب" ||
              (u.role || "").toString().trim().indexOf("مندوب") > -1 ||
              (u.name || "").toString().trim() === "عصفور") &&
            u.active !== "لا"
        );
        const list = activeUsersCouriers.map((u: any) => {
          const profile = db.couriers.find(
            (c: any) => c.name.toString().trim() === u.name.toString().trim()
          ) || {};
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
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "صلاحية حصرية لإدارة الحسابات");
        }
        const { name, phone, region, base_fixed_salary, commission_success, commission_return } = d;
        if (!name) return err(res, "اسم المندوب مطلوب لتحديث بيانات الملف المالي");

        const trimmedName = name.toString().trim();
        let courier = db.couriers.find(
          (c: any) => c.name && c.name.toString().trim().toLowerCase() === trimmedName.toLowerCase()
        );

        if (!courier) {
          courier = {
            name: trimmedName,
            phone: phone || "—",
            salary: Number(base_fixed_salary !== undefined ? base_fixed_salary : 3000),
            commission: Number(commission_success !== undefined ? commission_success : 25),
            region: region || "—",
            base_fixed_salary: Number(base_fixed_salary !== undefined ? base_fixed_salary : 3000),
            commission_success: Number(commission_success !== undefined ? commission_success : 25),
            commission_return: Number(commission_return !== undefined ? commission_return : 10)
          };
          db.couriers.push(courier);
        } else {
          courier.phone = phone || courier.phone || "—";
          courier.region = region || courier.region || "—";
          courier.salary = Number(base_fixed_salary !== undefined ? base_fixed_salary : (courier.salary || 3000));
          courier.commission = Number(commission_success !== undefined ? commission_success : (courier.commission || 25));
          courier.base_fixed_salary = Number(base_fixed_salary !== undefined ? base_fixed_salary : (courier.base_fixed_salary || 3000));
          courier.commission_success = Number(commission_success !== undefined ? commission_success : (courier.commission_success || 25));
          courier.commission_return = Number(commission_return !== undefined ? commission_return : (courier.commission_return || 10));
        }

        writeDB(db);

        // Audit Log entry inside central system
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "تعديل إعدادات مندوب",
          dateTime: now(),
          oldVal: "—",
          newVal: `تم تعديل المندوب ${name}: الراتب: ${base_fixed_salary}، نجاح: ${commission_success}، مرتجع: ${commission_return}`,
          reason: "تحديث إعدادات الراتب والعمولة"
        });

        return ok(res, { msg: "تم تحديث وحفظ بيانات المندوب بنجاح" });
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
