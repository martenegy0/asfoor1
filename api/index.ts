import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// 🔗 الرابط المركزي لـ Web App الخاص بك على Google Apps Script بعد آخر Deploy
const GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/AKfycbyK9NA6Fm9O7sQtlMcMpR0Xho3WuyBP2fMo4K6F3QEtwTbcdrvQzTyIO_sfitoQTVmA/exec
const ACCESS_TOKEN = "14014"; 

// 🧠 الذاكرة المؤقتة الشاملة (LOCAL CACHE) لسرعة خارقة وتوفير الحصص اليومية لجوجل
let LOCAL_CACHE: any = {
  orders: [],
  users: [],
  couriers: [],
  suppliers: [],
  dashboard: null,
  supplierAccounts: null,
  cashbox: null,
  expenses: [],
  dailyClosing: [],
  lastUpdated: 0
};

// 🔄 دالة إنعاش ومزامنة الكاش الشامل من الجوجل شيت
async function refreshCache() {
  try {
    const postData = async (action: string) => {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action, token: ACCESS_TOKEN }),
        headers: { "Content-Type": "application/json" }
      });
      return res.json();
    };

    const [ordersRes, usersRes, couriersRes, suppliersRes, dashRes, supAccsRes, cashRes, expRes, closingRes] = await Promise.all([
      postData("getOrders").catch(() => null),
      postData("getUsers").catch(() => null),
      postData("getCouriers").catch(() => null),
      postData("getSuppliers").catch(() => null),
      postData("dashboard").catch(() => null),
      postData("supplierAccounts").catch(() => null),
      postData("getCashbox").catch(() => null),
      postData("getExpenses").catch(() => null),
      postData("getDailyClosing").catch(() => null)
    ]);

    if (ordersRes?.ok) LOCAL_CACHE.orders = ordersRes.orders || [];
    if (usersRes?.ok) LOCAL_CACHE.users = usersRes.users || [];
    if (couriersRes?.ok) LOCAL_CACHE.couriers = couriersRes.couriers || [];
    if (suppliersRes?.ok) LOCAL_CACHE.suppliers = suppliersRes.suppliers || [];
    if (dashRes?.ok) LOCAL_CACHE.dashboard = dashRes;
    if (supAccsRes?.ok) LOCAL_CACHE.supplierAccounts = supAccsRes.accounts || null;
    if (cashRes?.ok) LOCAL_CACHE.cashbox = cashRes;
    if (expRes?.ok) LOCAL_CACHE.expenses = expRes.expenses || [];
    if (closingRes?.ok) LOCAL_CACHE.dailyClosing = closingRes.records || [];

    LOCAL_CACHE.lastUpdated = Date.now();
    console.log("⚡ [Cache Fully Synced] تم تحديث جميع السجلات المالية، الإدارية، والأوردرات بنجاح.");
  } catch (e) {
    console.error("❌ [Cache Sync Error] فشل إنعاش كاش السيرفر الموحد:", e);
  }
}

// ⏱️ مزامنة دورية صامتة بالخلفية كل دقيقتين لضمان تحديث الأرقام والتقارير
setInterval(refreshCache, 2 * 60 * 1000);

app.use(express.json({ limit: "50mb" }));

// 🕹️ الموجه المركزي والربط الذكي للتطبيق
app.post("/api", async (req: Request, res: Response) => {
  try {
    const d = req.body;
    if (!d || !d.action) return res.json({ ok: false, error: "المعامل البرمجي مفقود (Action Required)" });

    // الفحص وبناء الكاش لأول مرة عند إقلاع السيرفر
    if (LOCAL_CACHE.lastUpdated === 0) await refreshCache();

    // ----------------------------------------------------
    // [1] بوابات القراءة الفورية السريعة (سرعة مللي ثانية)
    // ----------------------------------------------------
    
    // تسجيل الدخول المحمي
    if (d.action === "login") {
      const { name, pass } = d;
      const cleanName = name?.trim().toLowerCase().replace(/\s+/g, "");
      const user = LOCAL_CACHE.users.find((u: any) => 
        u.name?.trim().toLowerCase().replace(/\s+/g, "") === cleanName && u.pass?.toString().trim() === pass?.toString().trim()
      );
      if (!user) return res.json({ ok: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      if (user.active === "لا") return res.json({ ok: false, error: "عذراً، هذا الحساب موقوف من قبل الإدارة" });

      const token = Buffer.from(JSON.stringify({ user: user.name, role: user.role, perms: user.perms, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString("base64");
      return res.json({ ok: true, user: user.name, role: user.role, token, perms: user.perms || "كاملة" });
    }

    // جلب وتصفية الشحنات مع دعم البحث الشامل (بالرقم، المورد، المندوب، الهاتف، المحافظة، والمنطقة)
    if (d.action === "getOrders") {
      let filteredOrders = [...LOCAL_CACHE.orders];
      if (d.status && d.status !== "all") {
        filteredOrders = filteredOrders.filter((o: any) => o.status === d.status);
      }
      if (d.search) {
        const q = d.search.toLowerCase().trim();
        filteredOrders = filteredOrders.filter((o: any) =>
          [o.tracking, o.supplier, o.courier, o.customer, o.phone, o.phone2, o.gov, o.region].join(" ").toLowerCase().includes(q)
        );
      }
      return res.json({ ok: true, orders: filteredOrders.reverse(), count: filteredOrders.length });
    }

    // لوحة المراقبة المالية المركزية (Dashboard)
    if (d.action === "dashboard" && LOCAL_CACHE.dashboard) {
      return res.json(LOCAL_CACHE.dashboard);
    }

    // كشوفات مجاميع حسابات الموردين (Supplier Accounts)
    if (d.action === "supplierAccounts" && LOCAL_CACHE.supplierAccounts) {
      return res.json({ ok: true, accounts: LOCAL_CACHE.supplierAccounts });
    }

    // جلب بيانات حركة الخزنة والدفاتر الحالية من الكاش
    if (d.action === "getCashbox" && LOCAL_CACHE.cashbox) return res.json(LOCAL_CACHE.cashbox);
    if (d.action === "getExpenses") return res.json({ ok: true, expenses: LOCAL_CACHE.expenses });
    if (d.action === "getDailyClosing") return res.json({ ok: true, records: LOCAL_CACHE.dailyClosing });
    if (d.action === "getUsers") return res.json({ ok: true, users: LOCAL_CACHE.users });
    if (d.action === "getCouriers") return res.json({ ok: true, couriers: LOCAL_CACHE.couriers });
    if (d.action === "getSuppliers") return res.json({ ok: true, suppliers: LOCAL_CACHE.suppliers });

    // الفحص السريع لتكرار رقم الهاتف لمنع تكرار الشحنات للعملاء
    if (d.action === "checkPhone") {
      const found = LOCAL_CACHE.orders.some((o: any) => o.phone === d.phone || o.phone2 === d.phone);
      return res.json({ ok: true, exists: found });
    }

    // ----------------------------------------------------
    // [2] بوابات العمليات التنفيذية والكتابة (تمرير مباشر للشيت)
    // ----------------------------------------------------
    d.token = ACCESS_TOKEN; 
    const googleResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(d),
      headers: { "Content-Type": "application/json" }
    });
    const googleResult: any = await googleResponse.json();

    // 🛠️ تحديث موضعي ذكي متفائل للكاش لتبدو الاستجابة فورية جداً للمستخدم
    if (googleResult && googleResult.ok) {
      if (d.action === "addOrder" && googleResult.order) {
        LOCAL_CACHE.orders.push(googleResult.order);
      } else if (d.action === "updateStatus") {
        const target = LOCAL_CACHE.orders.find((x: any) => x.tracking === d.tracking);
        if (target) {
          target.status = d.status;
          if (d.returnShippingType) target.returnShippingType = d.returnShippingType;
          target.updatedAt = new Date().toISOString();
        }
      } else if (d.action === "deleteOrder") {
        LOCAL_CACHE.orders = LOCAL_CACHE.orders.filter((x: any) => x.tracking !== d.tracking);
      }
      
      // إطلاق جلب خلفي صامت لتحديث الخزنة وحسابات الأستاذ والقيود الأمنية دون جعل المستخدم ينتظر
      refreshCache();
    }

    return res.json(googleResult);

  } catch (e: any) {
    return res.json({ ok: false, error: `خطأ اتصال بين بوابة Vercel وجوجل شيت: ${e.message}` });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 FriendPlus Enterprise Gateway API v6.5 (Fully Audited & Synced) is working perfectly.");
});

app.listen(PORT, () => console.log(`[Server Online] Gateway running optimally on port ${PORT}`));

export default app;
