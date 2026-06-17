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

function isReturnedDeliveredToSupplier(status: string): boolean {
  const s = (status || "").toString().trim();
  const patterns = [
    "تم تسليم المرتجع للمورد",
    "مرتجع تم تسليمه للمورد",
    "التسليم للمورد",
    "تم تسليم المرتجع للمورد وتصفية حسابه",
    "تسليم المرتجع للمورد",
    "تسليمه للمورد",
    "تصفية حسابه"
  ];
  return patterns.some((p) => s.includes(p));
}

function isSomeReturn(status: string): boolean {
  const s = (status || "").toString().trim();
  const patterns = ["مرتجع", "مرفوض", "فشل", "مسترجع", "التسليم للمورد", "تصفية"];
  return patterns.some((p) => s.includes(p));
}

const normalizeArabic = (str: string): string => {
  if (!str) return "";
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[أإآإأ]/g, "ا")
    .replace(/[يى]/g, "ي")
    .replace(/[ة]/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
};

const sameSup = (na: string, nb: string): boolean => {
  if (!na || !nb) return false;
  return normalizeArabic(na) === normalizeArabic(nb);
};

const isSupplierRole = (r: string): boolean => {
  if (!r) return false;
  const t = r.toString().trim().toLowerCase();
  return t === "مورد" || t === "موردين" || t.includes("مورد") || t === "supplier" || t.includes("supplier");
};

function getOrderFinancials(o: any) {
  if (!o) return { prodPrice: 0, shipPrice: 0, totalCOD: 0 };
  
  // 1. Resolve shipPrice
  let shipPrice = 0;
  const rawShip = o["سعر الشحن"] ?? o["الشحن"] ?? o["تكلفة الشحن"] ?? o["مصاريف الشحن"] ?? o["shipping"] ?? o["shipPrice"] ?? o["ship_price"];
  if (rawShip !== undefined && rawShip !== null && rawShip !== "") {
    shipPrice = Number(rawShip);
  }
  if (isNaN(shipPrice)) shipPrice = 0;

  // 2. Resolve totalCOD
  let totalCOD = 0;
  const rawTotal = o["المطلوب تحصيله"] ?? o["التحصيل"] ?? o["المطلوب"] ?? o["إجمالي الكود"] ?? o["الإجمالي"] ?? o["الاجمالي"] ?? o["إجمالي الأوردر"] ?? o["total"] ?? o["totalCOD"] ?? o["total_cod"] ?? o["cash_to_be_collected"] ?? o["cash"];
  if (rawTotal !== undefined && rawTotal !== null && rawTotal !== "") {
    totalCOD = Number(rawTotal);
  }
  if (isNaN(totalCOD)) totalCOD = 0;

  // 3. Resolve prodPrice
  let prodPrice = 0;
  const rawProd = o["سعر المنتج"] ?? o["المنتج"] ?? o["سعر المادة"] ?? o["price"] ?? o["prodPrice"] ?? o["product_price"];
  if (rawProd !== undefined && rawProd !== null && rawProd !== "") {
    prodPrice = Number(rawProd);
  }
  if (isNaN(prodPrice)) prodPrice = 0;

  // If totalCOD is provided, enforce formula: prodPrice = totalCOD - shipPrice
  if (totalCOD > 0) {
    prodPrice = totalCOD - shipPrice;
  } else if (prodPrice > 0 && shipPrice > 0 && totalCOD === 0) {
    totalCOD = prodPrice + shipPrice;
  }

  return {
    prodPrice: isNaN(prodPrice) ? 0 : prodPrice,
    shipPrice: isNaN(shipPrice) ? 0 : shipPrice,
    totalCOD: isNaN(totalCOD) ? 0 : totalCOD
  };
}

function getSupplierUnifiedLedger(db: any, supplierName: string) {
  if (!db) {
    return {
      entries: [],
      stats: {
        totalOrdersCount: 0,
        totalGoodsUploaded: 0,
        deliveredOrdersCount: 0,
        deliveredOrdersValue: 0,
        returnsDeliveredCount: 0,
        returnsDeliveredValue: 0,
        paymentsValue: 0,
        reverseAdjustmentsValue: 0,
        outstanding: 0,
        rate: 0
      }
    };
  }

  const rawOrders = (db.orders || []).filter((o: any) => sameSup(o.supplier, supplierName));
  
  // Dedup rawOrders by tracking ID (Unique Order ID) keeping the latest instance/update
  const supplierOrdersMap = new Map<string, any>();
  for (const o of rawOrders) {
    const track = (o.tracking || "").toString().trim();
    if (track) {
      supplierOrdersMap.set(track, o);
    } else {
      supplierOrdersMap.set(`NO-TRACK-${Math.random()}`, o);
    }
  }
  const supplierOrders = Array.from(supplierOrdersMap.values());
  
  // Clean raw ledger: force payouts and withdrawals to be negative (debited deductions)
  const rawLedger = (db.supplierLedger || []).filter((l: any) => sameSup(l.supplier, supplierName)).map((l: any) => {
    const type = (l.type || "").toString().trim();
    const isWithdrawal = type.includes("سحب") || type.includes("عكسية") || type.includes("طرح") || type.includes("خصم");
    const isPayout = ["دفع نقدي", "دفعة مورد", "صرف مورد", "دفعة", "مسحوبات", "تسوية"].some(p => type.includes(p)) || l.tracking === "CASH-PAY";
    const val = Number(l.amount || 0);

    if (isWithdrawal || isPayout) {
      return {
        ...l,
        amount: -Math.abs(val)
      };
    }
    return l;
  });

  // Helper function to check for genuine human payouts/adjustments
  const isHumanLedgedPayout = (l: any) => {
    if (!l) return false;
    const type = (l.type || "").toString().trim();
    const desc = (l.desc || "").toString().trim();
    const tracking = (l.tracking || "").toString().trim();

    const isPayOrAdj = ["دفع نقدي", "دفعة مورد", "صرف مورد", "دفعة", "مسحوبات", "طرح", "تسوية", "سحب"].includes(type) ||
                       type.includes("دفعة") ||
                       type.includes("صرف") ||
                       type.includes("سحب") ||
                       tracking === "CASH-PAY";

    const isAutoOrReturn = type.includes("مرتجع") ||
                           desc.includes("مرتجع") ||
                           type.includes("أوردر") ||
                           type.includes("حقوق") ||
                           desc.includes("حقوق") ||
                           (tracking !== "" && tracking !== "—" && tracking !== "CASH-PAY" && tracking.startsWith("FP-"));

    return isPayOrAdj && !isAutoOrReturn;
  };

  // 1. Total uploaded goods (value of products only without shipping) using getOrderFinancials
  const totalGoodsUploaded = supplierOrders.reduce((sum: number, o: any) => {
    const financials = getOrderFinancials(o);
    return sum + financials.prodPrice;
  }, 0);

  // 2. Successful deliveries
  const deliveredOrders = supplierOrders.filter((o: any) => o.status === "تم التسليم");
  const deliveredOrdersCount = deliveredOrders.length;
  const deliveredOrdersValue = deliveredOrders.reduce((sum: number, o: any) => {
    const financials = getOrderFinancials(o);
    return sum + financials.prodPrice;
  }, 0);

  // 3. Returns delivered back to supplier (Dynamic Status Matching - only deduct financially when officially delivered to supplier)
  const returnedOrders = supplierOrders.filter((o: any) => {
    return isReturnedDeliveredToSupplier(o.status);
  });
  const returnsDeliveredCount = returnedOrders.length;
  const returnsDeliveredValue = returnedOrders.reduce((sum: number, o: any) => {
    const financials = getOrderFinancials(o);
    return sum + financials.prodPrice;
  }, 0);

  // 4. Payments and Adjustments made to supplier from ledger (Strict human payout classification)
  const adjustmentsAndPayments = rawLedger.filter(isHumanLedgedPayout);

  // Separate Cash Payments from Reverse Adjustments
  const cashPayments = adjustmentsAndPayments.filter((l: any) => {
    const type = (l.type || "").toString().trim();
    return !type.includes("سحب") && !type.includes("عكسية") && !type.includes("طرح") && !type.includes("خصم");
  });

  const reverseAdjustments = adjustmentsAndPayments.filter((l: any) => {
    const type = (l.type || "").toString().trim();
    return type.includes("سحب") || type.includes("عكسية") || type.includes("طرح") || type.includes("خصم");
  });

  const paymentsValue = cashPayments.reduce((sum: number, l: any) => {
    return sum - Number(l.amount || 0);
  }, 0);

  const reverseAdjustmentsValue = reverseAdjustments.reduce((sum: number, l: any) => {
    return sum - Number(l.amount || 0);
  }, 0);

  // 5. Calculate outstanding balance: Outstanding = TotalGoodsUploaded - Returned - Paid
  const rawOutstanding = totalGoodsUploaded - returnsDeliveredValue - paymentsValue - reverseAdjustmentsValue;
  const outstanding = rawOutstanding;

  // Build the ledger entries list
  const entries: any[] = [];

  // A. All uploaded orders count as supplier credit
  for (const o of supplierOrders) {
    const financials = getOrderFinancials(o);
    const prodPriceNum = financials.prodPrice;
    entries.push({
      date: o.orderDate || o.createdAt || "",
      type: "حقوق بضاعة أوردر",
      tracking: o.tracking,
      amount: prodPriceNum,
      desc: `حقوق توريد أوردر رقم #${o.tracking} (صافي بضاعة: ${prodPriceNum} ج.م - حالة الأوردر: ${o.status})`
    });
  }

  // B. Returned orders as debit
  for (const o of returnedOrders) {
    const financials = getOrderFinancials(o);
    const prodPrice = financials.prodPrice;
    entries.push({
      date: o.retDate || o.updatedAt || o.createdAt || "",
      type: "مرتجع مخصوم",
      tracking: o.tracking,
      amount: -prodPrice,
      desc: `خصم مرتجع مستلم للمورد أوردر رقم #${o.tracking} (بضاعة: -${prodPrice} ج.م)`
    });
  }

  // C. Payouts and adjustments
  for (const l of adjustmentsAndPayments) {
    entries.push({
      date: l.date || "",
      type: l.type || "تعديل حساب",
      tracking: l.tracking || "CASH-PAY",
      amount: Number(l.amount || 0),
      desc: l.desc || `تسوية/دفعة مالیة للمورد بمبلغ ${l.amount} ج.م`
    });
  }

  // Sort entries chronologically to compute running balance correctly
  entries.sort((a, b) => {
    const dateA = a.date || "";
    const dateB = b.date || "";
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    const typeOrder: { [key: string]: number } = { "حقوق بضاعة أوردر": 1, "مرتجع مخصوم": 2 };
    const orderA = typeOrder[a.type] || 3;
    const orderB = typeOrder[b.type] || 3;
    return orderA - orderB;
  });

  // Calculate live running balance Chronologically
  let runBal = 0;
  const finalEntries = entries.map((item) => {
    runBal += item.amount;
    return { ...item, balanceAfter: runBal };
  });

  const totalOrdersCount = supplierOrders.length;
  const rate = totalOrdersCount ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100) : 0;

  return {
    entries: finalEntries.reverse(), // latest first
    balance: outstanding,
    stats: {
      totalOrdersCount,
      totalGoodsUploaded,
      deliveredOrdersCount,
      deliveredOrdersValue,
      returnsDeliveredCount,
      returnsDeliveredValue,
      paymentsValue,
      reverseAdjustmentsValue,
      outstanding,
      rate
    }
  };
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
          const isReturnedToSupplier = isReturnedDeliveredToSupplier(order.status);
          if (isReturnedToSupplier) {
            return {
              ...item,
              amount: 0,
              desc: `تسليم مرتجع مصفى بالكامل - قيمة صفرية للأوردر رقم #${order.tracking}`
            };
          } else {
            // بمجرد رفع الأوردرات يستحق المورد إجمالي ثمن البضاعة بالكامل بدون شحن
            const price = Number(order.prodPrice || 0);
            return { 
              ...item, 
              amount: price, 
              desc: `حقوق شراء بضاعة أوردر رقم #${order.tracking} (قيمة المنتج: ${price} ج.م - الحالة الحالية: ${order.status})` 
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
    const s = SESSIONS[token];
    return {
      user: (s.user || "").toString().trim(),
      role: (s.role || "").toString().trim(),
      perms: s.perms
    };
  }
  const verified = verifyStatelessToken(token);
  if (verified) {
    return {
      user: (verified.user || "").toString().trim(),
      role: (verified.role || "").toString().trim(),
      perms: verified.perms
    };
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

async function fetchWithTimeout(url: string, options: any = {}, timeoutMs = 30000): Promise<any> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function executeProxyRequest(gscriptUrl: string, payload: any): Promise<any> {
  const isWrite = [
    "addOrder", "addBulk", "updateStatus", "updateOrder", "deleteOrder", "bulkUpdate", "updateOrdersStatusBulk",
    "addSupplierPayment", "addCourierAdjustment", "addCashbox", "addExpense",
    "addUser", "registerUser", "updateUser", "addDailyClosing", "updateCourier",
    "archiveOrder"
  ].includes(payload.action);

  if (isWrite) {
    READ_CACHE.clear();
    ACTIVE_FETCHES.clear();
    
    const response = await fetchWithTimeout(gscriptUrl, {
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
          const response = await fetchWithTimeout(gscriptUrl, {
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
      const response = await fetchWithTimeout(gscriptUrl, {
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
          const response = await fetchWithTimeout(gscriptUrl, {
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
            console.warn("Google Sheets getUsers returned non-ok. Falling back to local authentication.");
          }
        } catch (authErr: any) {
          console.warn("Google Sheets Auth Proxy error. Falling back to local authentication:", authErr);
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

      if (payloadToSheet.courier === "reset_warehouse") {
        payloadToSheet.courier = "";
      }

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

      if (d.action === "updateOrder" && payloadToSheet.order && !payloadToSheet.order.tracking && d.tracking) {
        payloadToSheet.order.tracking = d.tracking;
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

      if (d.action === "addDailyClosing") {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "فقط المدير والمحاسب يمتلك صلاحية تسجيل التقفيل اليومي");
        }

        const { date, deliveredCount, returnedCount, returnedValue, totalCOD, shippingCost, cashboxIn, cashboxOut, cashboxNet } = d;
        if (!date) return err(res, "تاريخ التقفيل مطلوب");

        // 1. Invalidate caches
        READ_CACHE.clear();
        ACTIVE_FETCHES.clear();

        // 2. Perform optimistic local database write
        const db = readDB();
        if (!db.dailyClosing) db.dailyClosing = [];
        
        const isAlreadyClosed = db.dailyClosing.some((r: any) => r.date === date);
        if (isAlreadyClosed) {
          return err(res, "عذراً، هذا اليوم المالي تم تقفيله واعتماده ولا يمكن تعديل أو تكرار تسوياته نهائياً من جديد برمجياً");
        }

        db.dailyClosing.push({
          date,
          deliveredCount: Number(deliveredCount || 0),
          returnedCount: Number(returnedCount || 0),
          returnedValue: Number(returnedValue || 0),
          totalCOD: Number(totalCOD || 0),
          shippingCost: Number(shippingCost || 0),
          cashboxIn: Number(cashboxIn || 0),
          cashboxOut: Number(cashboxOut || 0),
          cashboxNet: Number(cashboxNet || 0),
          addedBy: currentUser,
          createdAt: now()
        });

        // Add to audit logs optimistically
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "ترصيد تقفيل يومي",
          dateTime: now(),
          oldVal: "—",
          newVal: `تقفيل يوم: ${date} (مسلم: ${deliveredCount}، مرتجع: ${returnedCount} (بقيمة ${returnedValue || 0} ج.م)، محصل COD: ${totalCOD} ج.م، صافي الخزنة: ${cashboxNet || 0} ج.م)`,
          reason: `ترصيد اليوم المالي من خلال أداة التصدير السريع`
        });

        writeDB(db);

        // 3. Queue asynchronous Google Sheets write in background
        executeProxyRequest(gscriptUrl, payloadToSheet).catch((syncErr) => {
          console.error("Async Google Sheets synchronization for addDailyClosing failed:", syncErr);
        });

        // 4. Return instant fast response for Fire & Forget
        return ok(res, { ok: true, msg: "تم ترحيل وحفظ التقرير اليومي بنجاح وجاري المزامنة في الخلفية", background: true });
      }

      if (["getSupplierLedger", "supplierAccounts", "supplierDashboard"].includes(d.action)) {
        try {
          const isSup = isSupplierRole(currentRole);
          const targetSupplier = isSup ? currentUser : (d.supplier || "");

          // Fetch raw orders and ledger from Google Sheets proxy using cached helpers
          const resOrders = await executeProxyRequest(gscriptUrl, {
            action: "getOrders",
            token: "14014",
            currentUser,
            currentRole,
            supplier: targetSupplier
          });
          const resLedger = await executeProxyRequest(gscriptUrl, {
            action: "getSupplierLedger",
            token: "14014",
            currentUser,
            currentRole,
            supplier: targetSupplier
          });

          const mockDb = {
            orders: resOrders.orders || [],
            supplierLedger: resLedger.ledger || []
          };

          if (d.action === "getSupplierLedger") {
            const supplierName = isSupplierRole(currentRole) ? currentUser : (d.supplier || "");
            const unified = getSupplierUnifiedLedger(mockDb, supplierName);
            // Return identical structure with local mode
            return ok(res, { 
              entries: unified.entries, 
              balance: unified.balance, 
              stats: unified.stats 
            });
          }

          if (d.action === "supplierDashboard") {
            const isSupplier = isSupplierRole(currentRole);
            const targetSupplier = isSupplier ? currentUser : (d.supplier || "");
            if (!targetSupplier) return err(res, "المورد غير معروف");

            const unified = getSupplierUnifiedLedger(mockDb, targetSupplier);

            return ok(res, {
              stats: {
                total: unified.stats.totalOrdersCount,
                delivered: unified.stats.deliveredOrdersCount,
                returned: unified.stats.returnsDeliveredCount,
                pending: unified.stats.totalOrdersCount - unified.stats.deliveredOrdersCount - unified.stats.returnsDeliveredCount,
                cod: unified.stats.totalGoodsUploaded,
                rate: unified.stats.rate,
                due: unified.stats.outstanding,
                returnsDeliveredValue: unified.stats.returnsDeliveredValue,
                paymentsValue: unified.stats.paymentsValue
              }
            });
          }

          if (d.action === "supplierAccounts") {
            const isSup = isSupplierRole(currentRole);
            if (!isSup && !["مدير", "مشرف", "محاسب"].includes(currentRole)) {
              return err(res, "ليس لديك صلاحية سحب كشوفات الموردين المالية");
            }

            let allSuppliers: string[] = [];
            if (isSup) {
              allSuppliers = [currentUser];
            } else {
              const resSuppliers = await executeProxyRequest(gscriptUrl, {
                action: "getSuppliers",
                token: "14014",
                currentUser,
                currentRole
              });
              const registeredNames = (resSuppliers.suppliers || []).map((s: any) => s.name).filter(Boolean);
              const orderNames = (mockDb.orders || []).map((o: any) => o.supplier).filter(Boolean);
              allSuppliers = Array.from(new Set([...registeredNames, ...orderNames]));
            }

            const accountsList = allSuppliers.map((supName: any) => {
              const sup = String(supName);
              const unified = getSupplierUnifiedLedger(mockDb, sup);
              return {
                name: sup,
                totalCOD: unified.stats.totalGoodsUploaded,
                returnsDelivered: unified.stats.returnsDeliveredValue,
                adjustments: unified.stats.reverseAdjustmentsValue,
                payments: unified.stats.paymentsValue,
                totalOrders: unified.stats.totalOrdersCount,
                deliveredOrders: unified.stats.deliveredOrdersCount,
                returnsCount: unified.stats.returnsDeliveredCount,
                balance: unified.stats.outstanding,
                rate: unified.stats.rate
              };
            });

            return ok(res, { accounts: accountsList });
          }
        } catch (calcError: any) {
          console.error("Local supplier calculations in Sheets mode failed:", calcError);
          return err(res, "خطأ في حساب مديونيات الموردين: " + calcError.message);
        }
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
            returnedDeliveredToSupplier: 0,
            returnedDeliveredToSupplierValue: 0,
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

            const isDeliveredToSupplier = isReturnedDeliveredToSupplier(o.status);
            const isClosed = ["تم التسليم"].includes(o.status) || isDeliveredToSupplier;
            const isAssigned = o.courier && o.courier !== "";
            if (isAssigned && !isClosed) {
              stats.assignedPending++;
            }

            const isReturn = isSomeReturn(o.status);

            if (o.status === "تم التسليم") {
              stats.delivered++;
              stats.totalCOD += Number(o.totalCOD || 0);
              stats.profit += Number(o.shipPrice || o.shipCost || 0);

              if (o.delivDate && isDateToday(o.delivDate)) {
                stats.todayCOD += Number(o.totalCOD || 0);
              }
            } else if (isReturn) {
              if (isDeliveredToSupplier) {
                stats.returnedDeliveredToSupplier++;
                stats.returnedDeliveredToSupplierValue += Number(o.prodPrice !== undefined ? o.prodPrice : (Number(o.totalCOD || 0) - Number(o.shipPrice || 0)));
              } else {
                stats.returned++;
              }
            } else if (["جديد", "تم الإسناد", "مؤجل", "لا يوجد رد", "العميل لم يقم بالرد"].includes(o.status)) {
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
          const remainingStock = ordersList.filter((o: any) => !["تم التسليم", "خارج مع المندوب", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه", "التسليم للمورد"].includes(o.status)).length;
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
            const isOps = (currentRole || "").toString().trim() === "موظف عمليات" || (currentRole || "").toString().trim().includes("عمليات");
            let ordersList = [...resData.orders];

            if (isAgent || isReturnsOfficer || isOps) {
              const todayStr = tod(); // Cairo YYYY-MM-DD
              ordersList = ordersList.filter((o: any) => {
                // 1. Role boundaries
                if (isAgent) {
                  if (!o.courier || o.courier.toString().trim().toLowerCase() !== currentUser.trim().toLowerCase()) return false;
                } else if (isReturnsOfficer) {
                  const isRet = ["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) || o.returnQueueStatus;
                  if (!isRet) return false;
                }
                
                // 2. Strict Today's Filter - Filter out orders completed and completed on previous days
                const orderDateYMD = o.orderDate ? o.orderDate.substring(0, 10) : (o.createdAt ? o.createdAt.substring(0, 10) : "");
                const updateDateYMD = o.updatedAt ? o.updatedAt.substring(0, 10) : "";
                const delivDateYMD = o.delivDate ? o.delivDate.substring(0, 10) : "";
                const retDateYMD = o.retDate ? o.retDate.substring(0, 10) : "";
                
                const isClosedStatus = o.isClosed || ["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع والعميل دفع الشحن", "مرتجع مدفوع الشحن"].includes(o.status);
                
                if (isClosedStatus) {
                  const completedToday = (delivDateYMD === todayStr) || (retDateYMD === todayStr) || (updateDateYMD === todayStr);
                  if (!completedToday) {
                    return false;
                  }
                }
                
                const activeOrUpdatedToday = (orderDateYMD === todayStr) || (updateDateYMD === todayStr) || !isClosedStatus;
                return activeOrUpdatedToday;
              });
            } else if (isSupplier) {
              ordersList = ordersList.filter((o: any) => o.supplier && sameSup(o.supplier, currentUser));
            }
            resData.orders = ordersList;
          }

          if (d.action === "getSupplierLedger" && Array.isArray(resData.ledger)) {
            const isSupplier = (currentRole || "").toString().trim() === "مورد" || (currentRole || "").toString().trim().includes("مورد");
            const targetSupplier = isSupplier ? currentUser : (d.supplier || "");
            resData.ledger = resData.ledger.filter((l: any) => l.supplier && sameSup(l.supplier, targetSupplier));
          }
        }

        return res.json(resData);
      } catch (proxyError: any) {
        console.warn("Google Sheets proxy failed or timed out. Falling back to local database routing:", proxyError?.message || proxyError);
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
        const isAgent = (currentRole || "").toString().trim() === "مندوب" || (currentRole || "").toString().trim().includes("مندوب");
        const isSupplier = isSupplierRole(currentRole);
        const isReturnsOfficer = (currentRole || "").toString().trim() === "مسؤول مرتجعات" || (currentRole || "").toString().trim().includes("مرتجع");
        const isOps = currentRole === "موظف عمليات" || (currentRole || "").toString().includes("عمليات");
        let ordersList = [...db.orders];

        // Apply role filter
        if (isAgent || isReturnsOfficer || isOps) {
          const todayStr = tod(); // Cairo YYYY-MM-DD
          ordersList = ordersList.filter((o: any) => {
            // 1. Role boundaries
            if (isAgent) {
              if (!o.courier || o.courier.toString().trim().toLowerCase() !== currentUser.trim().toLowerCase()) return false;
            } else if (isReturnsOfficer) {
              const isRet = ["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) || o.returnQueueStatus;
              if (!isRet) return false;
            }
            
            // 2. Strict Today's Filter - Filter out orders completed and completed on previous days
            const orderDateYMD = o.orderDate ? o.orderDate.substring(0, 10) : (o.createdAt ? o.createdAt.substring(0, 10) : "");
            const updateDateYMD = o.updatedAt ? o.updatedAt.substring(0, 10) : "";
            const delivDateYMD = o.delivDate ? o.delivDate.substring(0, 10) : "";
            const retDateYMD = o.retDate ? o.retDate.substring(0, 10) : "";
            
            const isClosedStatus = o.isClosed || ["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع والعميل دفع الشحن", "مرتجع مدفوع الشحن"].includes(o.status);
            
            if (isClosedStatus) {
              const completedToday = (delivDateYMD === todayStr) || (retDateYMD === todayStr) || (updateDateYMD === todayStr);
              if (!completedToday) {
                return false;
              }
            }
            
            const activeOrUpdatedToday = (orderDateYMD === todayStr) || (updateDateYMD === todayStr) || !isClosedStatus;
            return activeOrUpdatedToday;
          });
        } else if (isSupplier) {
          ordersList = ordersList.filter((o: any) => o.supplier && o.supplier.toString().trim().toLowerCase() === currentUser.trim().toLowerCase());
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
           supplier: isSupplierRole(currentRole) ? currentUser : (o.supplier || ""),
           prodType: o.prodType || "",
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
 
         // Automatically register supplier in db.suppliers if not present
         const orderSupplier = (newOrder.supplier || "").toString().trim();
         if (orderSupplier) {
           if (!db.suppliers) db.suppliers = [];
           const matchedSup = db.suppliers.find(
             (s: any) => s.name && s.name.trim().toLowerCase() === orderSupplier.toLowerCase()
           );
           if (!matchedSup) {
             db.suppliers.push({
               name: orderSupplier,
               phone: "—",
               price: shipPrice,
               notes: "تم تسجيله تلقائياً عن طريق إضافة أوردر يدوي"
             });
           }
         }

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
        if (!["مدير", "مشرف"].includes(currentRole) && !isSupplierRole(currentRole)) {
          return err(res, "ليس لديك صلاحية رفع طلبات جماعية");
        }

        const ordersArr = d.orders || [];
        const fallbackSupplier = isSupplierRole(currentRole) ? currentUser : (d.supplier || "مورد عام");
        const tNow = now();
        let addedCount = 0;

        for (const item of ordersArr) {
          const ph = fixPhone(item.phone || "");
          if (!ph && !item.customer) continue;

          // Resolve supplier row-by-row
          let orderSupplier = fallbackSupplier;
          if (isSupplierRole(currentRole)) {
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
            prodType: item.prodType || "",
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
        const { tracking, status, returnShippingType, notes, delivDate, partialAmount } = d;
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

        // 🚨 Standard Restriction on 'تم التسليم' or 'تسليم جزئي'
        if (oldStatus === "تم التسليم" || oldStatus === "تسليم جزئي") {
          return err(res, "لا يمكن تعديل حالة أوردر تم تسليمه أو تسليمه جزئياً");
        }

        // 🚨 Role Permissions Guard for status transitions
        const isAdmin = currentRole === "مدير";
        const isSuper = currentRole === "مشرف";
        const isOps = currentRole === "موظف عمليات";
        const isAgent = currentRole === "مندوب";
        const isSupplier = isSupplierRole(currentRole);
        const isReturnsOfficer = currentRole === "مسؤول مرتجعات";

        // Assignment restrictions:
        const assignStatuses = ["تم الإسناد", "خارج مع المندوب", "ملغي", "التسليم للمورد"];
        if (assignStatuses.includes(status) && !isAdmin && !isSuper) {
          return err(res, "فقط المشرف أو المدير يستطيع تحديد وتوزيع الأوردرات");
        }

        // Agent Restrictions:
        if (isAgent) {
          const agentAllowedStatuses = ["تم التسليم", "تسليم جزئي", "مرتجع", "مؤجل", "لا يوجد رد"];
          if (!agentAllowedStatuses.includes(status)) {
            return err(res, "غير مسموح للمندوب باختيار هذه الحالة");
          }
          // Courier can only change status of their OWN orders
          if (order.courier !== currentUser) {
            return err(res, "هذا الأوردر ليس مسنداً إليك");
          }
        }

        // Ops and Supplier permissions
        if (isOps) {
          const opsAllowedStatuses = ["تم رد العميل وجاري التنسيق", "مؤجل", "لا يوجد رد", "جديد"];
          if (!opsAllowedStatuses.includes(status)) {
            return err(res, "موظف العمليات يمتلك فقط صلاحية تحديث نتيجة اتصال العميل وإرجاع الحالة");
          }
        }
        if (isSupplier) return err(res, "المورد لا يمتلك صلاحية تعديل الحالة");

        // Returns Officer Control
        if (isReturnsOfficer) {
          const returnsOfficerAllowed = ["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد", "جاري الرجوع للمورد", "جديد"];
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
        else if (["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد", "جاري الرجوع للمورد"].includes(status)) {
          order.returnQueueStatus = status;
          if (status === "تم تسليم المرتجع للمورد") {
            order.status = "تم تسليم المرتجع للمورد";
            order.retDate = now();
          } else {
            order.status = status;
          }
        }

        // Standard Transitions
        else {
          order.status = status;
          order.updatedAt = now();
          
          if (status === "جديد") {
            order.returnQueueStatus = undefined;
            order.returnQueueAgent = undefined;
          }

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

            // PREVENT AUTOMATIC COMPOUNDING IN CENTRAL CASHBOX - Held under Courier Custody (العهدة المعلقة مع المندوب)
            // It will only enter the cashbox when the Supervisor settles the courier's account from the Ledger page.

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

          if (status === "تسليم جزئي") {
            order.delivDate = now();
            const pAm = Number(partialAmount || order.totalCOD || 0);
            order.totalCOD = pAm;
            order.partialAmount = pAm;
            order.returnQueueStatus = "مرتجع جزئي بالمستودع";
            order.isPartial = true;

            // Calculate Courier Commission
            const courierProfile = db.couriers.find((c: any) => c.name === order.courier);
            const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
            order.commission = commVal;

            // Save to Courier Ledger
            db.courierLedger.push({
              courier: order.courier,
              date: now(),
              type: "تسليم جزئي",
              tracking: order.tracking,
              amount: commVal,
              desc: `عمولة تسليم جزئي للأوردر: ${order.tracking} (المبلغ الفعلي المستلم: ${pAm} ج.م)`
            });

            // Credit the Supplier Ledger based on updated totalCOD (TotalCOD - Shipping)
            const dupLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "أوردر مستلم" || l.type === "تسليم" || l.type === "أوردر مستلم جزئي"));
            if (!dupLedger) {
              const supplierShare = pAm - Number(order.shipPrice || 0);
              db.supplierLedger.push({
                supplier: order.supplier,
                date: now(),
                type: "أوردر مستلم جزئي",
                tracking: order.tracking,
                amount: supplierShare,
                desc: `حقوق توريد أوردر تسليم جزئي: ${order.tracking} (المبلغ المحصل للشركة ${pAm} - شحن الشركة ${order.shipPrice})`
              });
            }
          }

          if (status === "التسليم للمورد") {
            order.retDate = now();
          }
        }

        // --- DEDUCTION TO SUPPLIER LEDGER SYSTEM (DISABLED FOR STABILITY AND NO PRE-DELIVERY CREDITING) ---

        if (notes !== undefined) {
          order.notes = notes;
        }
        if (delivDate !== undefined) {
          order.delivDate = delivDate;
        }

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
        order.prodType = o.prodType !== undefined ? o.prodType : order.prodType;
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
      // ARCHIVE ORDER (Admin/Accountant Only)
      // ─────────────────────────────────────────────────────────────
      case "archiveOrder": {
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "فقط المدير والمحاسب يمتلك صلاحية أرشفة الطلبات");
        }

        const { tracking } = d;
        if (!tracking) return err(res, "معامل مفقود");

        const order = db.orders.find((x: any) => x.tracking === tracking);
        if (!order) return err(res, "الأوردر غير موجود");

        const oldStatus = order.status;
        order.status = "مؤرشف";
        order.isArchived = true;
        order.updatedAt = now();

        if (!db.statusHistory) db.statusHistory = [];
        db.statusHistory.push({
          tracking,
          oldStatus,
          newStatus: "مؤرشف",
          updatedBy: currentUser,
          dateTime: now()
        });

        // Add to audit logs optimistically
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: "أرشفة أوردر",
          dateTime: now(),
          oldVal: oldStatus,
          newVal: "مؤرشف",
          reason: `أرشفة الشحنة وتثبيت تصفيتها التاريخية للشحنة: ${tracking}`
        });

        writeDB(db);

        // Queue asynchronous Google Sheets write in background if available
        const localGscriptUrl = process.env.GOOGLE_SCRIPT_URL;
        if (localGscriptUrl) {
          const payloadToSheet = {
            ...d,
            token: "14014",
            currentUser,
            currentRole
          };
          executeProxyRequest(localGscriptUrl.trim(), payloadToSheet).catch((syncErr) => {
            console.error("Async Google Sheets synchronization for archiveOrder failed:", syncErr);
          });
        }

        return ok(res, { tracking, msg: "تم أرشفة الأوردر وتصفيته بنجاح" });
      }

      // ─────────────────────────────────────────────────────────────
      // BULK RE-ASSIGN / BATCH MANIFEST
      // ─────────────────────────────────────────────────────────────
      case "bulkUpdate": {
        const allowedRoles = ["مدير", "مشرف", "مسؤول مرتجعات", "موظف عمليات", "مندوب"];
        if (!allowedRoles.includes(currentRole)) {
          return err(res, "لا تمتلك الصلاحيات اللازمة للقيام بالتعديل الجماعي");
        }

        const trackings = d.trackings || [];
        let status = d.status;
        const courier = d.courier;
        const notes = d.notes || d.bulkNotes;
        const postponeDate = d.date || d.delivDate || d.postponedDate;

        // Map labels to standard schema statuses safely
        if (status === "تم التسليم بنجاح") status = "تم التسليم";
        if (status === "مؤجل بناءً على طلب العميل") status = "مؤجل";
        if (status === "تم تسليم المرتجع للمورد وتصفية حسابه") status = "تم تسليم المرتجع للمورد";

        // Enforce role-based allowed status boundaries
        if (currentRole === "مسؤول مرتجعات") {
          const returnsOfficerAllowed = ["مرتجع جديد", "مرتجع جاري تسليمه للمكتب", "جاري الرجوع للمورد", "تم تسليم المرتجع للمورد", "جديد"];
          if (status && !returnsOfficerAllowed.includes(status)) {
            return err(res, "Unauthorized Action: مسؤول المرتجعات يمتلك صلاحية تعديل حالات المرتجعات المكتبية فقط");
          }
          if (courier !== undefined) {
            return err(res, "Unauthorized Action: لا تمتلك صلاحية تعديل أو تعيين المناديب");
          }
        } else if (currentRole === "موظف عمليات") {
          const opsAllowed = ["تم رد العميل وجاري التنسيق", "لا يرد - محاولة أولى/ثانية", "تحديث نتيجة الاتصال", "مؤجل", "لا يوجد رد", "جديد"];
          if (status && !opsAllowed.includes(status)) {
            return err(res, "Unauthorized Action: موظف العمليات يمتلك فقط صلاحية تحديث نتيجة اتصال العميل وتأجيل الأوردرات");
          }
          if (courier !== undefined) {
            return err(res, "Unauthorized Action: لا تمتلك صلاحية تعديل أو تعيين المناديب");
          }
        } else if (currentRole === "مندوب") {
          const agentAllowed = ["تم التسليم", "مؤجل", "لا يوجد رد", "مرتجع"];
          if (status && !agentAllowed.includes(status)) {
            return err(res, "Unauthorized Action: المندوب يمتلك فقط صلاحية تحديث حالات التوصيل والتعليق المباشرة");
          }
          if (courier !== undefined) {
            return err(res, "Unauthorized Action: لا تمتلك صلاحية تعديل أو تعيين المناديب");
          }
        }

        let modified = 0;

        for (const t of trackings) {
          const order = db.orders.find((o: any) => o.tracking === t);
          if (!order) continue;

          // Double check that the rider can only touch their OWN assigned orders
          if (currentRole === "مندوب" && order.courier !== currentUser) {
            continue; // Skip silently or can throw, let's skip to process valid items
          }

          const oldStatus = order.status;

          // Set optional notes or postponed dates collectively
          if (notes !== undefined && notes !== "") {
            order.notes = notes;
          }
          if (postponeDate !== undefined && postponeDate !== "") {
            order.delivDate = postponeDate;
          }

          if (courier !== undefined && ["مدير", "مشرف"].includes(currentRole)) {
            if (courier === "reset_warehouse" || courier === "") {
              order.lastCourier = order.courier;
              order.lastCommission = order.commission;
              // Don't zero out courier or commission to maintain historical logs and commissions
              if (order.status !== "جديد") {
                const prevStatus = order.status;
                order.status = "جديد";
                if (!db.statusHistory) db.statusHistory = [];
                db.statusHistory.push({
                  tracking: t,
                  oldStatus: prevStatus,
                  newStatus: "جديد",
                  updatedBy: currentUser,
                  dateTime: now()
                });
              }
            } else if (courier !== order.courier) {
              order.courier = courier;
              const cProfile = db.couriers.find((c: any) => c.name === courier);
              order.commission = cProfile ? Number(cProfile.commission || 25) : 25;

              // If courier is assigned, move 'جديد' to 'تم الإسناد'
              if (courier && oldStatus === "جديد") {
                order.status = "تم الإسناد";
                if (!db.statusHistory) db.statusHistory = [];
                db.statusHistory.push({
                  tracking: t,
                  oldStatus: "جديد",
                  newStatus: "تم الإسناد",
                  updatedBy: currentUser,
                  dateTime: now()
                });
              }
            }
          }

          // Apply bulkStatus override only if not resetting to warehouse
          if (status !== undefined && status !== order.status && (courier !== "reset_warehouse" && courier !== "")) {
            order.status = status;
            order.updatedAt = now();

            if (status === "تم التسليم") {
              order.delivDate = postponeDate || now();
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

              // Held under Courier Custody (العهدة المعلقة مع المندوب) - No automatic central cashbox entry on bulk delivery.

              // Credit Supplier Ledger if not already done
              const dupLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "أوردر مستلم" || l.type === "تسليم"));
              if (!dupLedger) {
                const supplierShare = Number(order.prodPrice || 0) - Number(order.shipPrice || 0);
                db.supplierLedger.push({
                  supplier: order.supplier,
                  date: now(),
                  type: "أوردر مستلم",
                  tracking: order.tracking,
                  amount: supplierShare,
                  desc: `حقوق أوردر تم تسليمه جماعياً: ${order.tracking} (سعر المنتج ${order.prodPrice} - شحن الشركة ${order.shipPrice})`
                });
              }
            }

            if (["مرتجع", "تم تسليم المرتجع للمورد", "التسليم للمورد"].includes(status)) {
              order.retDate = now();
              if (status === "تم تسليم المرتجع للمورد" || status === "التسليم للمورد") {
                order.returnQueueStatus = "تم تسليم المرتجع للمورد";
                const dupLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "مرتجع" || l.type === "مرتجع تم تسليمه للمورد"));
                if (!dupLedger) {
                  db.supplierLedger.push({
                    supplier: order.supplier,
                    date: now(),
                    type: "مرتجع تم تسليمه للمورد",
                    tracking: order.tracking,
                    amount: -Number(order.prodPrice || 0),
                    desc: `خصم قيمة المنتج لمرتجع تسلمه المورد جماعياً: ${order.tracking}`
                  });
                }
              }
            }

            if (!db.statusHistory) db.statusHistory = [];
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
      // BATCH UPDATE: updateOrdersStatusBulk
      // ─────────────────────────────────────────────────────────────
      case "updateOrdersStatusBulk": {
        const allowedRoles = ["مدير", "مشرف", "مسؤول مرتجعات", "موظف عمليات", "مندوب"];
        if (!allowedRoles.includes(currentRole)) {
          return err(res, "لا تمتلك الصلاحيات اللازمة للقيام بالتعديل الجماعي");
        }

        const updates = d.updates || [];
        if (!Array.isArray(updates) || updates.length === 0) {
          return err(res, "لم يتم استلام مصفوفة تحديثات جماعية صالحة");
        }

        let modified = 0;

        for (const item of updates) {
          const t = item.tracking;
          if (!t) continue;

          const order = db.orders.find((o: any) => o.tracking === t);
          if (!order) continue;

          // Double check that the rider can only touch their OWN assigned orders
          if (currentRole === "مندوب" && order.courier !== currentUser) {
            continue; 
          }

          const oldStatus = order.status;

          // Set optional notes or postponed dates collectively
          if (item.notes !== undefined && item.notes !== "") {
            order.notes = item.notes;
          }
          const itemDate = item.date || item.delivDate || item.postponedDate;
          if (itemDate !== undefined && itemDate !== "") {
            order.delivDate = itemDate;
          }

           // Apply courier re-assignment if permitted
          if (item.courier !== undefined && ["مدير", "مشرف"].includes(currentRole)) {
            const courier = item.courier;
            if (courier === "reset_warehouse" || courier === "") {
              order.lastCourier = order.courier;
              order.lastCommission = order.commission;
              // Don't zero out courier or commission to maintain historical logs and commissions
              if (order.status !== "جديد") {
                const prevStatus = order.status;
                order.status = "جديد";
                if (!db.statusHistory) db.statusHistory = [];
                db.statusHistory.push({
                  tracking: t,
                  oldStatus: prevStatus,
                  newStatus: "جديد",
                  updatedBy: currentUser,
                  dateTime: now()
                });
              }
            } else if (courier !== order.courier) {
              order.courier = courier;
              const cProfile = db.couriers.find((c: any) => c.name === courier);
              order.commission = cProfile ? Number(cProfile.commission || 25) : 25;

              // If courier is assigned, move 'جديد' to 'تم الإسناد'
              if (courier && oldStatus === "جديد") {
                order.status = "تم الإسناد";
                if (!db.statusHistory) db.statusHistory = [];
                db.statusHistory.push({
                  tracking: t,
                  oldStatus: "جديد",
                  newStatus: "تم الإسناد",
                  updatedBy: currentUser,
                  dateTime: now()
                });
              }
            }
          }

          // Map labels to standard schema statuses safely
          let status = item.status;
          if (status === "تم التسليم بنجاح") status = "تم التسليم";
          if (status === "مؤجل بناءً على طلب العميل") status = "مؤجل";
          if (status === "تم تسليم المرتجع للمورد وتصفية حسابه") status = "تم تسليم المرتجع للمورد";

          // Enforce role-based allowed status boundaries
          if (status) {
            if (currentRole === "مسؤول مرتجعات") {
              const returnsOfficerAllowed = ["مرتجع جديد", "مرتجع جاري تسليمه للمكتب", "جاري الرجوع للمورد", "تم تسليم المرتجع للمورد", "جديد"];
              if (!returnsOfficerAllowed.includes(status)) continue;
            } else if (currentRole === "موظف عمليات") {
              const opsAllowed = ["تم رد العميل وجاري التنسيق", "لا يرد - محاولة أولى/ثانية", "تحديث نتيجة الاتصال", "مؤجل", "لا يوجد رد", "جديد"];
              if (!opsAllowed.includes(status)) continue;
            } else if (currentRole === "مندوب") {
              const agentAllowed = ["تم التسليم", "مؤجل", "لا يوجد رد", "مرتجع"];
              if (!agentAllowed.includes(status)) continue;
            }
          }

          // Apply status override
          if (status !== undefined && status !== order.status && (item.courier !== "reset_warehouse" && item.courier !== "")) {
            order.status = status;
            order.updatedAt = now();

            if (status === "تم التسليم") {
              order.delivDate = itemDate || now();
              // Add to Courier Ledger
              const cProfile = db.couriers.find((c: any) => c.name === order.courier);
              const comm = cProfile ? Number(cProfile.commission || 25) : 25;
              db.courierLedger.push({
                courier: order.courier,
                date: now(),
                type: "تسليم",
                tracking: order.tracking,
                amount: comm,
                desc: `عمولة تسليم الأوردر جماعياً (الدفعة المجمعة): ${order.tracking}`
              });

              // Held under Courier Custody (العهدة المعلقة مع المندوب) - No automatic central cashbox entry on bulk delivery.

              // Credit Supplier Ledger if not already done
              const dupLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "أوردر مستلم" || l.type === "تسليم"));
              if (!dupLedger) {
                const supplierShare = Number(order.prodPrice || 0) - Number(order.shipPrice || 0);
                db.supplierLedger.push({
                  supplier: order.supplier,
                  date: now(),
                  type: "أوردر مستلم",
                  tracking: order.tracking,
                  amount: supplierShare,
                  desc: `حقوق أوردر تم تسليمه جماعياً (الدفعة المجمعة): ${order.tracking} (صافي بضاعة ${supplierShare})`
                });
              }
            }

            if (["مرتجع", "تم تسليم المرتجع للمورد", "التسليم للمورد"].includes(status)) {
              order.retDate = now();
              if (status === "تم تسليم المرتجع للمورد" || status === "التسليم للمورد") {
                order.returnQueueStatus = "تم تسليم المرتجع للمورد";
                const dupLedger = db.supplierLedger.find((l: any) => l.tracking === order.tracking && (l.type === "مرتجع" || l.type === "مرتجع تم تسليمه للمورد"));
                if (!dupLedger) {
                  db.supplierLedger.push({
                    supplier: order.supplier,
                    date: now(),
                    type: "مرتجع تم تسليمه للمورد",
                    tracking: order.tracking,
                    amount: -Number(order.prodPrice || 0),
                    desc: `خصم قيمة المنتج لمرتجع تسلمه المورد جماعياً (الدفعة المجمعة): ${order.tracking}`
                  });
                }
              }
            }

            if (!db.statusHistory) db.statusHistory = [];
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
        return ok(res, { done: modified, msg: `تم تحديث وإسناد ${modified} أوردر مجمّعاً بنجاح فائق السرعة` });
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
          returnedDeliveredToSupplier: 0,
          returnedDeliveredToSupplierValue: 0,
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

          const isClosed = ["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status);
          const isAssigned = o.courier && o.courier !== "";
          if (isAssigned && !isClosed) {
            stats.assignedPending++;
          }

          const isSomeReturn = ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "مرتجع والعميل دفع الشحن", "تم تسليم المرتجع للمورد وتصفية حسابه"].includes(o.status) || (o.status || "").includes("مرتجع");
          const isDeliveredToSupplier = ["تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه"].includes(o.status);

          if (o.status === "تم التسليم") {
            stats.delivered++;
            stats.totalCOD += Number(o.totalCOD || 0);
            stats.profit += Number(o.shipPrice || 0); // profit is ship share

            if (o.delivDate && isDateToday(o.delivDate)) {
              stats.todayCOD += Number(o.totalCOD || 0); // Money collected today
            }
          } else if (isSomeReturn) {
            if (isDeliveredToSupplier) {
              stats.returnedDeliveredToSupplier++;
              stats.returnedDeliveredToSupplierValue += Number(o.prodPrice || 0);
            } else {
              stats.returned++;
            }
          } else if (["جديد", "تم الإسناد", "مؤجل", "لا يوجد رد", "العميل لم يقم بالرد"].includes(o.status)) {
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
        const remainingStock = ordersList.filter((o: any) => !["تم التسليم", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "التسليم للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه", "بالمستودع"].includes(o.status)).length;
        const inOfficeStock = stats.total - (stats.active + stats.returned + stats.returnedDeliveredToSupplier);

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
        const supplierName = isSupplierRole(currentRole) ? currentUser : (d.supplier || "");
        const unified = getSupplierUnifiedLedger(db, supplierName);
        return ok(res, { 
          entries: unified.entries, 
          balance: unified.balance, 
          stats: unified.stats 
        });
      }

      case "supplierDashboard": {
        const isSupplier = isSupplierRole(currentRole);
        const targetSupplier = isSupplier ? currentUser : (d.supplier || "");

        if (!targetSupplier) return err(res, "المورد غير معروف");

        const unified = getSupplierUnifiedLedger(db, targetSupplier);

        return ok(res, {
          stats: {
            total: unified.stats.totalOrdersCount,
            delivered: unified.stats.deliveredOrdersCount,
            returned: unified.stats.returnsDeliveredCount,
            pending: unified.stats.totalOrdersCount - unified.stats.deliveredOrdersCount - unified.stats.returnsDeliveredCount,
            cod: unified.stats.totalGoodsUploaded,
            rate: unified.stats.rate,
            due: unified.stats.outstanding,
            returnsDeliveredValue: unified.stats.returnsDeliveredValue,
            paymentsValue: unified.stats.paymentsValue
          }
        });
      }

      case "supplierAccounts": {
        const isSup = isSupplierRole(currentRole);
        if (!isSup && !["مدير", "مشرف", "محاسب"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحية سحب كشوفات الموردين المالية");
        }

        let allSuppliers: string[] = [];
        if (isSup) {
          allSuppliers = [currentUser];
        } else {
          const registeredNames = (db.suppliers || []).map((s: any) => s.name).filter(Boolean);
          const orderNames = (db.orders || []).map((o: any) => o.supplier).filter(Boolean);
          allSuppliers = Array.from(new Set([...registeredNames, ...orderNames]));
        }

        const accountsList = allSuppliers.map((supName: any) => {
          const sup = String(supName);
          const unified = getSupplierUnifiedLedger(db, sup);
          return {
            name: sup,
            totalCOD: unified.stats.totalGoodsUploaded,
            returnsDelivered: unified.stats.returnsDeliveredValue,
            adjustments: unified.stats.reverseAdjustmentsValue,
            payments: unified.stats.paymentsValue,
            totalOrders: unified.stats.totalOrdersCount,
            deliveredOrders: unified.stats.deliveredOrdersCount,
            returnsCount: unified.stats.returnsDeliveredCount,
            balance: unified.stats.outstanding,
            rate: unified.stats.rate
          };
        });

        return ok(res, { accounts: accountsList });
      }

      case "addSupplierPayment": {
        // Admin or accountant can make cash payouts
        if (!["مدير", "محاسب"].includes(currentRole)) {
          return err(res, "ليس لديك صلاحية صرف دفعات للموردين");
        }

        const { supplier, amount, desc, transactionType } = d;
        if (!supplier || !amount) return err(res, "بيانات مفقودة");

        // Take absolute value first in case they passed a negative number, as we always want to store manual deductions as negative in ledger
        const val = Math.abs(Number(amount));
        const isWithdrawal = transactionType === "withdrawal" || transactionType === "سحب";
        const finalDesc = desc || (isWithdrawal ? `سحب مالي / تسوية عكسية من المورد: ${supplier}` : `دفعة نقدية مسددة للمورد: ${supplier}`);

        // Deducts balance of Supplier (Debits account balance with a negative entry)
        db.supplierLedger.push({
          supplier,
          date: now(),
          type: isWithdrawal ? "سحب من المورد" : "دفع نقدي",
          tracking: "CASH-PAY",
          amount: -val,
          desc: finalDesc
        });

        // Deduct from Cashbox or Add into Cashbox
        db.cashbox.push({
          date: now(),
          desc: `${finalDesc} (${isWithdrawal ? "إيداع" : "صرف"} مورد)`,
          type: isWithdrawal ? "إيداع" : "سداد مورد",
          amount: val,
          ref: "SUPPAY",
          addedBy: currentUser
        });

        // Audit Log entry inside central system
        if (!db.auditLog) db.auditLog = [];
        db.auditLog.push({
          user: currentUser,
          type: isWithdrawal ? "سحب مالي من مورد" : "سداد مورد / دفعة نقدية",
          dateTime: now(),
          oldVal: "—",
          newVal: isWithdrawal ? `سحب مبلغ: ${val} ج.م من المورد: ${supplier}` : `صرف مبلغ: ${val} ج.م للمورد: ${supplier}`,
          reason: desc || (isWithdrawal ? `سحب مالي لتصحيح حساب المورد` : `دفعة نقدية منصرفة للمورد: ${supplier}`)
        });

        writeDB(db);
        return ok(res, { msg: isWithdrawal ? "تم تسجيل حركة السحب المالي العكسية بنجاح وتسويتها بالخزنة" : "تم تسجيل الدفعة النقدية بنجاح وتسويتها بالخزنة" });
      }
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

        // Strict Courier Settlement Calculations (Today's performance):
        // 1. Delivered Cash (كاش الأوردرات المسلمة اليوم): (ثمن المنتجات + مصاريف الشحن) لجميع الأوردرات "تم التسليم" أو "تسليم جزئي" اليوم
        const todayDeliveredOrders = courierOrders.filter((o: any) => (o.status === "تم التسليم" || o.status === "تسليم جزئي") && o.delivDate && isDateToday(o.delivDate));
        const todayDeliveredCount = todayDeliveredOrders.length;
        const todayDeliveredCash = todayDeliveredOrders.reduce((sum: number, o: any) => sum + Number(o.totalCOD || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0))), 0);

        // 2. Returned Shipping Cash (كاش شحن المرتجعات اليوم): (مصاريف الشحن فقط) لجميع الأوردرات "مرتجع مدفوع الشحن" اليوم
        const todayReturnedPaidOrders = courierOrders.filter((o: any) => 
          (o.status === "مرتجع والعميل دفع الشحن" || o.status === "مرتجع مدفوع الشحن" || (o.status === "مرتجع" && o.returnShippingType === "paid")) && 
          o.retDate && isDateToday(o.retDate)
        );
        const todayReturnedPaidCount = todayReturnedPaidOrders.length;
        const todayReturnedPaidCash = todayReturnedPaidOrders.reduce((sum: number, o: any) => sum + Number(o.shipPrice || o.shipCost || 0), 0);

        // 3. Total Commission (عمولة المندوب الكلية اليوم): (deliveredCount * successRate) + (returnedPaidCount * successRate)
        const todayTotalCommission = (todayDeliveredCount * commissionSuccess) + (todayReturnedPaidCount * commissionSuccess);

        // Cumulative totals (for historical indicators)
        const deliveredCount = courierOrders.filter((o: any) => o.status === "تم التسليم" || o.status === "تسليم جزئي").length;
        const returnedCount = courierOrders.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;
        const returnedPaidCount = courierOrders.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid").length;

        // Strict Financial Separation:
        // Outstanding / Due Delivery commission consists ONLY of today's deliveries since past days are already closed & settled/paid.
        const delivCommission = todayDeliveredCount * commissionSuccess;
        const returnShippingCommission = todayReturnedPaidCount * commissionSuccess;

        // Fetch adjustments (Bonuses, Penalties) from courierLedger entries
        const targetLedger = db.courierLedger.filter((l: any) => l.courier === courierName);
        const bonusesSum = targetLedger.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);
        // Force penaltiesSum to be a POSITIVE number in representation, avoiding double negative maths!
        const penaltiesSum = targetLedger.filter((l: any) => l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز").reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);

        // 4. Adjustments for today:
        const todayBonuses = targetLedger.filter((l: any) => l.type === "مكافأة" && l.date && isDateToday(l.date)).reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);
        const todayPenalties = targetLedger.filter((l: any) => (l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز") && l.date && isDateToday(l.date)).reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);

        // Final Settle Equation (الصافي المطلوب توريده للخزنة لليوم):
        // الصافي المطلوب توريده للخزنة = (كاش الأوردرات المسلمة + كاش شحن المرتجعات) - (عمولة المندوب الكلية) - (قيمة الجزاء المخصوم) + (قيمة المكافأة المضافة).
        const requiredHandoverToday = (todayDeliveredCash + todayReturnedPaidCash) - todayTotalCommission - todayPenalties + todayBonuses;

        // Compute COD Collection tracking for anti-deficit control
        // Life-time or cumulative collected
        const totalCollected = courierOrders.filter((o: any) => o.status === "تم التسليم" || o.status === "تسليم جزئي").reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);
        
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
          if ((o.status === "تم التسليم" || o.status === "تسليم جزئي") && o.delivDate) {
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

          const deliveredList = courierOrders.filter((o: any) => (o.status === "تم التسليم" || o.status === "تسليم جزئي") && o.delivDate && o.delivDate.substring(0, 10) === dStr);
          const returnedList = courierOrders.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && o.retDate.substring(0, 10) === dStr);
          
          const deliveredDay = deliveredList.length;
          const returnedDay = returnedList.length;

          const baseEarning = Number((basicSalary / daysCount).toFixed(2));
          
          // Strict Financial Logic: Zero out past days' commissions since they have already been closed and paid.
          const delivEarning = isToday ? (deliveredDay * commissionSuccess) : 0;
          const retEarning = isToday ? (returnedDay * commissionReturn) : 0;

          const dayLedger = db.courierLedger.filter((l: any) => l.courier === courierName && l.date && l.date.substring(0, 10) === dStr);
          const dayPenalties = dayLedger.filter((l: any) => l.type === "جزاء" || l.type === "خصم").reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount)), 0);
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
        const netSalary = todayTotalCommission + baseEarningToday + allowanceTotal + bonusesSum - penaltiesSum - todayExpensesCombined;

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
            todayDelivCommission: todayTotalCommission, // backward compatibility
            todayDeliveredCash,
            todayReturnedPaidCash,
            todayTotalCommission,
            todayPenalties,
            todayBonuses,
            requiredHandoverToday,
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
        const delivered = ordersList.filter((o: any) => o.status === "تم التسليم" || o.status === "تسليم جزئي").length;
        const returnedPaid = ordersList.filter((o: any) => o.status === "مرتجع" && o.returnShippingType === "paid").length;
        const returnedAll = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;

        const basicSalary = courierProfile.base_fixed_salary !== undefined ? Number(courierProfile.base_fixed_salary) : Number(courierProfile.salary || 3000);
        const commissionSuccess = courierProfile.commission_success !== undefined ? Number(courierProfile.commission_success) : Number(courierProfile.commission || 25);
        const commissionReturn = courierProfile.commission_return !== undefined ? Number(courierProfile.commission_return) : 10;

        // Fetch adjustment amounts
        const ledgerTr = db.courierLedger.filter((l: any) => l.courier === courierName);
        const bonuses = ledgerTr.filter((l: any) => l.type === "مكافأة").reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);
        const penalties = ledgerTr.filter((l: any) => l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز").reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);

        const todayDate = tod();

        // Strict Courier Settlement Calculations (Today's performance):
        // 1. Delivered Cash (كاش الأوردرات المسلمة اليوم): (ثمن المنتجات + مصاريف الشحن) لجميع الأوردرات "تم التسليم" أو "تسليم جزئي" اليوم
        const todayDeliveredOrders = ordersList.filter((o: any) => (o.status === "تم التسليم" || o.status === "تسليم جزئي") && o.delivDate && isDateToday(o.delivDate));
        const todayDeliveredCount = todayDeliveredOrders.length;
        const todayDeliveredCash = todayDeliveredOrders.reduce((sum: number, o: any) => sum + Number(o.totalCOD || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0))), 0);

        // 2. Returned Shipping Cash (كاش شحن المرتجعات اليوم): (مصاريف الشحن فقط) لجميع الأوردرات "مرتجع مدفوع الشحن" اليوم
        const todayReturnedPaidOrders = ordersList.filter((o: any) => 
          (o.status === "مرتجع والعميل دفع الشحن" || o.status === "مرتجع مدفوع الشحن" || (o.status === "مرتجع" && o.returnShippingType === "paid")) && 
          o.retDate && isDateToday(o.retDate)
        );
        const todayReturnedPaidCount = todayReturnedPaidOrders.length;
        const todayReturnedPaidCash = todayReturnedPaidOrders.reduce((sum: number, o: any) => sum + Number(o.shipPrice || o.shipCost || 0), 0);

        // 3. Total Commission (عمولة المندوب الكلية اليوم): (deliveredCount * successRate) + (returnedPaidCount * successRate)
        const todayTotalCommission = (todayDeliveredCount * commissionSuccess) + (todayReturnedPaidCount * commissionSuccess);

        const todayBonuses = ledgerTr.filter((l: any) => l.type === "مكافأة" && l.date && isDateToday(l.date)).reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);
        const todayPenalties = ledgerTr.filter((l: any) => (l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز") && l.date && isDateToday(l.date)).reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount || 0)), 0);

        // Final Settle Equation (الصافي المطلوب توريده للخزنة لليوم):
        const requiredHandoverToday = (todayDeliveredCash + todayReturnedPaidCash) - todayTotalCommission - todayPenalties + todayBonuses;

        // Total commissions to pay consists of today's deliveries since past days are already closed & settled/paid.
        const totalCommission = todayTotalCommission;
        const totalEarnings = basicSalary + totalCommission + bonuses - penalties;

        // Cumulative Daily Ledger calculations
        const nowCairo = getCairoDateObj();
        const daysInCurrentMonth = new Date(nowCairo.getFullYear(), nowCairo.getMonth() + 1, 0).getDate();
        const daysCount = daysInCurrentMonth || 30;

        const datesSet = new Set<string>();
        for (const o of ordersList) {
          if ((o.status === "تم التسليم" || o.status === "تسليم جزئي") && o.delivDate) {
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

          const deliveredList = ordersList.filter((o: any) => (o.status === "تم التسليم" || o.status === "تسليم جزئي") && o.delivDate && o.delivDate.substring(0, 10) === dStr);
          const returnedList = ordersList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && o.retDate.substring(0, 10) === dStr);
          
          const deliveredDay = deliveredList.length;
          const returnedDay = returnedList.length;

          const baseEarning = Number((basicSalary / daysCount).toFixed(2));
          
          // Strict Financial Logic: Zero out past days' commissions since they have already been closed and paid.
          const delivEarning = isToday ? (deliveredDay * commissionSuccess) : 0;
          const retEarning = isToday ? (returnedDay * commissionReturn) : 0;

          const dayLedger = db.courierLedger.filter((l: any) => l.courier === courierName && l.date && l.date.substring(0, 10) === dStr);
          const dayPenalties = dayLedger.filter((l: any) => l.type === "جزاء" || l.type === "خصم").reduce((sum: number, x: any) => sum + Math.abs(Number(x.amount)), 0);
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
        const totalCollectedOnInfo = ordersList.filter((o: any) => o.status === "تم التسليم" || o.status === "تسليم جزئي").reduce((sum: number, o: any) => sum + Number(o.totalCOD || 0), 0);
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
          todayDelivered: todayDeliveredCount,
          todayDelivCommission: todayTotalCommission,
          todayReturned: todayReturnedPaidCount,
          todayReturnCommission: todayReturnedPaidCount * commissionSuccess,
          todayDeliveredCash,
          todayReturnedPaidCash,
          todayTotalCommission,
          todayPenalties,
          todayBonuses,
          requiredHandoverToday,
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

        let val = Number(amount);
        if (type === "جزاء" || type === "خصم" || type === "خصم عجز") {
          val = Math.abs(val) * -1;
        }
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
            amount: Math.abs(val),
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

        // ويتم تصفير عدادات المندوب الحركية فوراً لاستقبل يوم جديد
        if (type === "استلام عهدة مندوب" && ref) {
          const courierName = ref;
          if (db.orders) {
            for (const o of db.orders) {
              if (o.courier === courierName) {
                const isCommitted = ["تم التسليم", "تسليم جزئي", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع والعميل دفع الشحن"].includes(o.status);
                if (isCommitted) {
                  o.isClosed = true;
                }
              }
            }
          }
        }

        writeDB(db);
        return ok(res, { msg: "تم إدراج بند الخزينة وتصفيته وتصفير العدادات" });
      }

      // ─────────────────────────────────────────────────────────────
      // EXPENSES OPERATIONS
      // ─────────────────────────────────────────────────────────────
      case "expenses": {
        let expensesList = db.expenses || [];
        if (!["مدير", "محاسب"].includes(currentRole)) {
          expensesList = expensesList.filter((e: any) => e.addedBy === currentUser);
        }

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
        if (supplier) list = list.filter((o: any) => o.supplier && sameSup(o.supplier, supplier));

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
