/**
 * 🔒 نظام التشغيل والربط المركزي لجوجل شيت (مؤسسة فريند بلس - Friend Plus Shipping)
 * متوافق بشكل كامل 100% مع واجهة العمل الحديثة، المراقبة المالية، وتأمين النقدية ومنع العجز (Anti-Deficit Module).
 * 
 * 🛠️ طريقة التثبيت والاستخدام:
 * 1. افتح الجوجل شيت الخاص بك.
 * 2. اختر "Extensions" (الامتدادات) -> "Apps Script".
 * 3. احذف أي كود موجود وقم بلصق هذا الكود بالكامل.
 * 4. اكتب كلمة سر حماية الرابط (TOKEN) بالخلفية أو اتركها مطابقة للمتصفح.
 * 5. اضغط على زر "Deploy" -> "New deployment" -> اختر النوع "Web app".
 * 6. اجعل الصلاحيات "Execute as: Me" والوصول "Who has access: Anyone".
 * 7. انسخ رابط الويب وباسمه GOOGLE_SCRIPT_URL وضعه في ملف بيئة المتصفح (.env) أو إعدادات Vercel.
 */

// 🔑 توكن الحماية المركزي (يجب أن يطابق المرسل من التطبيق لضمان الأمان والخصوصية)
const ACCESS_TOKEN = "14014"; 

/**
 * 🚀 دالة التهيئة المباشرة (تشغيل يدوي)
 * اختر هذه الدالة (setup) من القائمة المنسدلة في الأعلى واضغط على "Run" أو "تشغيل"
 * لتهيئة وتجهيز جميع الجداول والترويسات داخل الجوجل شيت فوراً!
 */
function setup() {
  const sheets = initSheets();
  Logger.log("✅ تم تجهيز وتهيئة جميع جداول قاعدة بيانات الشيت بنجاح! تفقد الشيت الآن لتجد الجداول قد تم إنشاؤها تلقائياً.");
}

/**
 * 📊 إضافة قائمة مخصصة في الجوجل شيت للتشغيل والتنصيب المباشر بضغطة زر واحدة!
 * بعد حفظ السكريبت وإغلاقه، قم بإنعاش (Refresh) صفحة الجوجل شيت وستظهر لك القائمة في الأعلى.
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚛 نظام فريند بلس')
    .addItem('🛠️ تهيئة جداول النظام (Setup)', 'setup')
    .addToUi();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    // محاولة الحصول على قفل حماية لمنع حدوث تداخل في البيانات عند الطلبات المتزامنة
    lock.waitLock(15000); 
  } catch (err) {
    return contentResponse({ ok: false, error: "الخادم مشغول حالياً بطلب آخر، يرجى المحاولة بعد قليل." });
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return contentResponse({ ok: false, error: "لم يتم استقبال أي بيانات صالحة (Empty payload)" });
    }

    const requestData = JSON.parse(e.postData.contents);
    const { action, token } = requestData;

    // التحقق من صحة التوكن المركزي للأمان لمنع أي اختراق أو استدعاء خارجي
    if (token !== ACCESS_TOKEN) {
      return contentResponse({ ok: false, error: "صلاحية الرمز البرمجي (Token) غير صحيحة أو منتهية" });
    }

    const sheets = initSheets();
    let result = null;

    switch (action) {
      case "getOrders":
        result = getOrders(sheets);
        break;
      case "addOrder":
        result = addOrder(sheets, requestData);
        break;
      case "addBulk":
        result = addBulk(sheets, requestData);
        break;
      case "updateStatus":
        result = updateStatus(sheets, requestData);
        break;
      case "updateOrder":
        result = updateOrder(sheets, requestData);
        break;
      case "deleteOrder":
        result = deleteOrder(sheets, requestData);
        break;
      case "bulkUpdate":
        result = bulkUpdate(sheets, requestData);
        break;
      case "dashboard":
        result = getDashboardStats(sheets, requestData);
        break;
      case "getAuditLog":
        result = getAuditLog(sheets);
        break;
      case "getSupplierLedger":
        result = getSupplierLedger(sheets, requestData);
        break;
      case "supplierDashboard":
        result = getSupplierDashboard(sheets, requestData);
        break;
      case "supplierAccounts":
        result = getSupplierAccounts(sheets);
        break;
      case "addSupplierPayment":
        result = addSupplierPayment(sheets, requestData);
        break;
      case "getCourierLedger":
        result = getCourierLedger(sheets, requestData);
        break;
      case "getCourierInfo":
        result = getCourierInfo(sheets, requestData);
        break;
      case "addCourierAdjustment":
        result = addCourierAdjustment(sheets, requestData);
        break;
      case "statusHistory":
        result = getStatusHistory(sheets, requestData);
        break;
      case "cashbox":
        result = getCashbox(sheets);
        break;
      case "addCashbox":
        result = addCashbox(sheets, requestData);
        break;
      case "expenses":
        result = getExpenses(sheets);
        break;
      case "addExpense":
        result = addExpense(sheets, requestData);
        break;
      case "getUsers":
        result = getUsers(sheets);
        break;
      case "addUser":
        result = addUser(sheets, requestData);
        break;
      case "updateUser":
        result = updateUser(sheets, requestData);
        break;
      case "checkPhone":
        result = checkPhone(sheets, requestData);
        break;
      case "getCouriers":
        result = getCouriers(sheets);
        break;
      case "getSuppliers":
        result = getSuppliers(sheets);
        break;
      case "report":
        result = getReportStats(sheets, requestData);
        break;
      case "getDailyClosing":
        result = getDailyClosing(sheets);
        break;
      case "addDailyClosing":
        result = addDailyClosing(sheets, requestData);
        break;
      default:
        result = { ok: false, error: "الإجراء المطلوب غير مدعوم في السكريبت الحالي." };
    }

    return contentResponse(result);
  } catch (error) {
    return contentResponse({ ok: false, error: "حدث خطأ داخلي في معالجة الطلب: " + error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function contentResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 🗂️ تهيئة وبناء الجداول تلقائياً إن لم تكن موجودة في الشيت
 */
function initSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const defs = {
    users: ["name", "role", "pass", "active", "email", "perms"],
    couriers: ["name", "phone", "commission", "salary", "region"],
    suppliers: ["name", "phone", "price", "notes"],
    orders: [
      "tracking", "createdAt", "updatedAt", "orderDate", "supplier", "customer", 
      "phone", "phone2", "gov", "region", "address", "prodPrice", "shipPrice", 
      "totalCOD", "shipCost", "courier", "status", "notes", "delivDate", "retDate", 
      "addedBy", "commission", "returnShippingType", "returnQueueStatus", "returnQueueAgent"
    ],
    expenses: ["id", "date", "amount", "desc", "category", "addedBy"],
    cashbox: ["date", "desc", "type", "amount", "ref", "addedBy"],
    statusHistory: ["tracking", "oldStatus", "newStatus", "updatedBy", "dateTime"],
    supplierLedger: ["supplier", "date", "type", "tracking", "amount", "desc"],
    courierLedger: ["courier", "date", "type", "tracking", "amount", "desc"],
    auditLog: ["user", "type", "dateTime", "oldVal", "newVal", "reason"],
    dailyClosing: ["date", "deliveredCount", "returnedCount", "totalCOD", "shippingCost", "addedBy"]
  };

  // 🔄 قائمة مرادفات أسماء الشيتات (عربي / إنجليزي) لربط الشيتات الموجودة مسبقاً ومنع تكرارها
  const nameMappings = {
    users: ["المستخدمون", "المستخدمين", "الموظفين", "users"],
    couriers: ["المناديب", "اسم المندوب", "المندوبين", "مندوبي الشحن", "couriers"],
    suppliers: ["الموردين", "المورد المالي", "محل الأناقة", "suppliers"],
    orders: ["الطلبات", "الأوردرات", "الطلبيات", "orders"],
    expenses: ["المصاريف", "المصروفات", "expenses"],
    cashbox: ["الخزنة", "حركة الخزينة", "الخزينة", "cashbox"],
    statusHistory: ["سجل الحالات", "حالات الشحنات", "حالات الشحنة", "statusHistory"],
    supplierLedger: ["كشف حساب الموردين", "حساب الموردين", "حسابات الموردين", "supplierLedger"],
    courierLedger: ["كشف حساب المناديب", "حساب المناديب", "حساب المندوبين", "courierLedger"],
    auditLog: ["سجل العمليات", "سجل التدقيق", "audit.log", "auditLog"],
    dailyClosing: ["التقفيل اليومي", "dailyClosing"]
  };

  const sheets = {};
  for (let key in defs) {
    let sheet = null;
    let fallbackName = key;
    if (key === "dailyClosing") {
      fallbackName = "التقفيل اليومي";
    }

    // البحث المتقدم بالأسماء المتوقعة
    const listNames = nameMappings[key] || [key];
    for (let i = 0; i < listNames.length; i++) {
      const nameToCheck = listNames[i];
      sheet = ss.getSheetByName(nameToCheck);
      if (sheet) {
        // وجدنا الشيت باسم مرادف، نقوم باعتماده وكسر البحث
        break;
      }
    }

    // إذا لم يعثر على الشيت بأي اسم مرادف، ننشئه بالاسم الافتراضي للمزامنة
    if (!sheet) {
      sheet = ss.insertSheet(fallbackName);
      sheet.appendRow(defs[key]);
      sheet.getRange(1, 1, 1, defs[key].length).setFontWeight("bold").setBackground("#f1f5f9");
    }
    sheets[key] = sheet;
  }
  return sheets;
}

/**
 * 📄 تحويل جدول الشيت إلى مصفوفة كائنات مستندة على ترويسة الأعمدة
 */
function getTableData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(h => h.trim());
  const rows = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();
  
  return rows.map(row => {
    let obj = {};
    headers.forEach((h, idx) => {
      let val = row[idx];
      // معالجة التواريخ لتجنب الاختلافات الزمنية لتبدو منسقة
      if (val instanceof Date) {
        obj[h] = Utilities.formatDate(val, "GMT+3", "yyyy-MM-dd HH:mm");
      } else {
        obj[h] = val;
      }
    });
    return obj;
  });
}

function appendToSheet(sheet, headers, obj) {
  const row = headers.map(h => obj[h] !== undefined ? obj[h] : "");
  sheet.appendRow(row);
}

function now() {
  return Utilities.formatDate(new Date(), "GMT+3", "yyyy-MM-dd HH:mm:ss");
}

function nowDay() {
  return Utilities.formatDate(new Date(), "GMT+3", "yyyy-MM-dd");
}

/**
 * دالة البحث السريع عن سطر أوردر بناءً على كود التتبع
 */
function findRowIndex(sheet, key, value) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;
  const colIndex = getHeaderIndex(sheet, key);
  if (colIndex === -1) return -1;
  const vals = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  for (let i = 0; i < vals.length; i++) {
    if (vals[i][0].toString().trim() === value.toString().trim()) {
      return i + 2; // +2 للتعويض عن الترويسة وبدء العد من 1
    }
  }
  return -1;
}

function getHeaderIndex(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].trim() === headerName) return i + 1;
  }
  return -1;
}

function updateRowByObject(sheet, rowIndex, obj) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => h.trim());
  headers.forEach((h, colIdx) => {
    if (obj[h] !== undefined) {
      sheet.getRange(rowIndex, colIdx + 1).setValue(obj[h]);
    }
  });
}

// ───────────────────────────────────────────────
// (أ) الدوال الرئيسية للتعامل مع الأوردرات
// ───────────────────────────────────────────────

function getOrders(sheets) {
  const orders = getTableData(sheets.orders);
  return { ok: true, orders: orders };
}

function addOrder(sheets, d) {
  const o = d.order;
  if (!o) return { ok: false, error: "بيانات الأوردر مفقودة" };

  // Generate tracking ID if missing
  if (!o.tracking) {
    const lastRow = sheets.orders.getLastRow();
    const counter = 1000 + lastRow;
    const yearSuffix = Utilities.formatDate(new Date(), "GMT+3", "yy");
    o.tracking = "FP-" + counter + "-" + yearSuffix;
  }

  // فحص عدم تكرار التتبع
  if (findRowIndex(sheets.orders, "tracking", o.tracking) !== -1) {
    return { ok: false, error: "رقم التتبع المسجل مستخدم بالفعل لأوردر آخر" };
  }

  const pPrice = Number(o.prodPrice || 0);
  const sPrice = Number(o.shipPrice || 60);
  const tCOD = pPrice + sPrice;

  const newOrder = {
    tracking: o.tracking,
    createdAt: now(),
    updatedAt: now(),
    orderDate: o.orderDate || nowDay(),
    supplier: o.supplier || "مورد عام",
    customer: o.customer || "",
    phone: o.phone || "",
    phone2: o.phone2 || "",
    gov: o.gov || "القاهرة",
    region: o.region || "",
    address: o.address || "",
    prodPrice: pPrice,
    shipPrice: sPrice,
    totalCOD: tCOD,
    shipCost: sPrice,
    courier: "", // Empty during creation
    status: o.status || "جديد",
    notes: o.notes || "",
    delivDate: "",
    retDate: "",
    addedBy: d.currentUser || "إدارة",
    commission: 0,
    returnShippingType: "",
    returnQueueStatus: "",
    returnQueueAgent: ""
  };

  const headers = sheets.orders.getRange(1, 1, 1, sheets.orders.getLastColumn()).getValues()[0].map(h => h.trim());
  appendToSheet(sheets.orders, headers, newOrder);

  // Record Supplier Ledger
  appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
    supplier: newOrder.supplier,
    date: now(),
    type: "أوردر مستلم",
    tracking: newOrder.tracking,
    amount: pPrice,
    desc: `أوردر جديد مستلم من المورد: ${newOrder.tracking}`
  });

  // Record Status History
  appendToSheet(sheets.statusHistory, ["tracking", "oldStatus", "newStatus", "updatedBy", "dateTime"], {
    tracking: newOrder.tracking,
    oldStatus: "",
    newStatus: "جديد",
    updatedBy: d.currentUser || "موظف",
    dateTime: now()
  });

  return { ok: true, msg: "تم تسجيل الأوردر بنجاح", order: newOrder };
}

function addBulk(sheets, d) {
  const list = d.orders;
  if (!list || !list.length) return { ok: false, error: "لا توجد أوردرات للرفع" };

  const headers = sheets.orders.getRange(1, 1, 1, sheets.orders.getLastColumn()).getValues()[0].map(h => h.trim());
  let addedCount = 0;
  
  // Cache current last row to avoid reading getLastRow inside loop
  let currentLastRow = sheets.orders.getLastRow();
  const yearSuffix = Utilities.formatDate(new Date(), "GMT+3", "yy");
  const supplierName = d.supplier || "مورد عام";

  list.forEach(o => {
    if (!o.tracking) {
      o.tracking = "FP-" + (1000 + currentLastRow) + "-" + yearSuffix;
      currentLastRow++;
    }

    if (findRowIndex(sheets.orders, "tracking", o.tracking) === -1) {
      const pPrice = Number(o.prodPrice || 0);
      const sPrice = Number(o.shipPrice || 60);
      const tCOD = pPrice + sPrice;

      const draft = {
        tracking: o.tracking,
        createdAt: now(),
        updatedAt: now(),
        orderDate: o.orderDate || nowDay(),
        supplier: supplierName,
        customer: o.customer || "",
        phone: o.phone || "",
        phone2: o.phone2 || "",
        gov: o.gov || "القاهرة",
        region: o.region || "",
        address: o.address || "",
        prodPrice: pPrice,
        shipPrice: sPrice,
        totalCOD: tCOD,
        shipCost: sPrice,
        courier: "",
        status: o.status || "جديد",
        notes: o.notes || "",
        delivDate: "",
        retDate: "",
        addedBy: d.currentUser || "إدارة",
        commission: 0,
        returnShippingType: "",
        returnQueueStatus: "",
        returnQueueAgent: ""
      };

      appendToSheet(sheets.orders, headers, draft);

      // Record Supplier Ledger
      appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
        supplier: draft.supplier,
        date: now(),
        type: "أوردر مستلم",
        tracking: draft.tracking,
        amount: pPrice,
        desc: `رفع أوردر مستلم جماعياً ${draft.tracking}`
      });

      // Record Status History
      appendToSheet(sheets.statusHistory, ["tracking", "oldStatus", "newStatus", "updatedBy", "dateTime"], {
        tracking: draft.tracking,
        oldStatus: "",
        newStatus: "جديد",
        updatedBy: d.currentUser || "موظف",
        dateTime: now()
      });

      addedCount++;
    }
  });

  return { ok: true, added: addedCount, msg: `تم رفع ${addedCount} أوردر بنجاح` };
}

function updateStatus(sheets, d) {
  const { tracking, status, returnShippingType, currentUser } = d;
  if (!tracking || !status) return { ok: false, error: "معاملات مسندة مفقودة" };

  const orderIndex = findRowIndex(sheets.orders, "tracking", tracking);
  if (orderIndex === -1) return { ok: false, error: "الأوردر المطلوب غير موجود" };

  const orders = getTableData(sheets.orders);
  const order = orders.find(x => x.tracking === tracking);
  const oldStatus = order.status;

  if (oldStatus === "تم التسليم") {
    return { ok: false, error: "لا يمكن تعديل حالة أوردر تم تسليمه مسبقاً" };
  }

  // الحالات الافتراضية للتحديث
  let updateObj = {
    status: status,
    updatedAt: now()
  };

  // معالجة حالة المرتجع (مرتجع)
  if (status === "مرتجع") {
    if (!returnShippingType) {
      return { ok: false, error: "يرجى تحديد ما إذا كان العميل قد دفع الشحن أم رفض" };
    }
    updateObj.status = "مرتجع";
    updateObj.returnShippingType = returnShippingType;
    updateObj.retDate = now();

    // 1. حساب عمولة المندوب للمرتجع
    if (returnShippingType === "paid") {
      const couriers = getTableData(sheets.couriers);
      const courierProfile = couriers.find(c => c.name === order.courier);
      const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
      updateObj.commission = commVal;

      appendToSheet(sheets.courierLedger, ["courier", "date", "type", "tracking", "amount", "desc"], {
        courier: order.courier,
        date: now(),
        type: "مرتجع مدفوع الشحن",
        tracking: tracking,
        amount: commVal,
        desc: `عمولة مرتجع مدفوع الشحن للأوردر: ${tracking}`
      });
    } else {
      updateObj.commission = 0;
      appendToSheet(sheets.courierLedger, ["courier", "date", "type", "tracking", "amount", "desc"], {
        courier: order.courier,
        date: now(),
        type: "مرتجع غير مدفوع الشحن",
        tracking: tracking,
        amount: 0,
        desc: `عمولة مرتجع غير مدفوع الشحن للأوردر: ${tracking}`
      });
    }

    // 2. تفعيل Queue المرتجعات تلقائياً للمتابعة
    updateObj.returnQueueStatus = "مرتجع جديد";
    const users = getTableData(sheets.users);
    const returnsAgent = users.find(u => u.role === "مسؤول مرتجعات" && u.active === "نعم");
    updateObj.returnQueueAgent = returnsAgent ? returnsAgent.name : "أحمد المرتجعات";
  }

  // معالجة تغيير أوضاع تتبع المرتجعات Queue
  const queueStatuses = ["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"];
  if (queueStatuses.includes(status)) {
    updateObj.returnQueueStatus = status;
    if (status === "تم تسليم المرتجع للمورد") {
      updateObj.status = "التسليم للمورد";
      updateObj.retDate = now();
    }
  }

  // معالجة استلام المرتجع عند المورد وحسم حسابه المالي تلقائياً
  if (status === "التسليم للمورد" || status === "تم تسليم المرتجع للمورد") {
    updateObj.retDate = now();
    // خصم قيمة المنتج من حساب المورد لكي لا يستحق الأرباح
    const ledgerData = getTableData(sheets.supplierLedger);
    const dupLedger = ledgerData.find(l => l.tracking === tracking && (l.type === "مرتجع" || l.type === "مرتجع تم تسليمه للمورد"));
    if (!dupLedger) {
      appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
        supplier: order.supplier,
        date: now(),
        type: "مرتجع تم تسليمه للمورد",
        tracking: tracking,
        amount: -Number(order.prodPrice || 0),
        desc: `خصم قيمة المنتج لمرتجع تسلمه المورد: ${tracking}`
      });
    }
  }

  // معالجة الأوردرات المسلّمة (تم التسليم) وحركتها المالية بالخزنة المركزية لتجنب العجز
  if (status === "تم التسليم") {
    updateObj.delivDate = now();
    const couriers = getTableData(sheets.couriers);
    const courierProfile = couriers.find(c => c.name === order.courier);
    const commVal = courierProfile ? Number(courierProfile.commission || 25) : 25;
    updateObj.commission = commVal;

    // تسجيل عمولة التوصيل بدفتر المندوب
    appendToSheet(sheets.courierLedger, ["courier", "date", "type", "tracking", "amount", "desc"], {
      courier: order.courier,
      date: now(),
      type: "تسليم",
      tracking: tracking,
      amount: commVal,
      desc: `عمولة تسليم الأوردر والتحصيل للأوردر: ${tracking}`
    });

    // جلب وحساب القيمة المستلمة (COD) وترحيلها كعهدة معلقة حتى التوريد الفعلي
    appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
      date: now(),
      desc: `تحصيل أوردر مسلّم: ${tracking} (المندوب: ${order.courier})`,
      type: "تحصيل مندوب",
      amount: Number(order.totalCOD),
      ref: tracking,
      addedBy: "النظام التلقائي"
    });
  }

  // إتمام الحفظ والتعديل
  updateRowByObject(sheets.orders, orderIndex, updateObj);

  // إثبات التغيير في سجل الحركات والأمان
  appendToSheet(sheets.statusHistory, ["tracking", "oldStatus", "newStatus", "updatedBy", "dateTime"], {
    tracking: tracking,
    oldStatus: oldStatus,
    newStatus: status,
    updatedBy: currentUser || "خادم تلقائي",
    dateTime: now()
  });

  return { ok: true, tracking, status, msg: "تم تحديث حالة الأوردر بنجاح" };
}

function updateOrder(sheets, d) {
  const o = d.order;
  if (!o || !o.tracking) return { ok: false, error: "بيانات الأوردر المطلوب تعديله غير صحيحة" };

  const orderIndex = findRowIndex(sheets.orders, "tracking", o.tracking);
  if (orderIndex === -1) return { ok: false, error: "الأوردر غير موجود" };

  const orders = getTableData(sheets.orders);
  const order = orders.find(x => x.tracking === o.tracking);

  const oldProd = Number(order.prodPrice || 0);
  const oldShip = Number(order.shipPrice || 0);
  const newProd = o.prodPrice !== undefined ? Number(o.prodPrice) : oldProd;
  const newShip = o.shipPrice !== undefined ? Number(o.shipPrice) : oldShip;

  // رصد ومراقبة التعديل المالي في سجل الأمان لمنع الاختلاس
  if (oldProd !== newProd || oldShip !== newShip) {
    o.prodPrice = newProd;
    o.shipPrice = newShip;
    o.totalCOD = newProd + newShip;
    o.shipCost = newShip;

    appendToSheet(sheets.auditLog, ["user", "type", "dateTime", "oldVal", "newVal", "reason"], {
      user: d.currentUser || "إدارة",
      type: "تعديل مالي أوردر",
      dateTime: now(),
      oldVal: `سعر المنتج: ${oldProd} ج.م، الشحن: ${oldShip} ج.م`,
      newVal: `سعر المنتج: ${newProd} ج.م، الشحن: ${newShip} ج.م`,
      reason: d.reason || o.reason || "تجميع وتعديل الأسعار يدويًا بواسطة الإدارة"
    });
  }

  o.updatedAt = now();
  updateRowByObject(sheets.orders, orderIndex, o);
  return { ok: true, msg: "تم حفظ وتحديث الأوردر بالكامل بنجاح" };
}

function deleteOrder(sheets, d) {
  const { tracking, currentUser } = d;
  const orderIndex = findRowIndex(sheets.orders, "tracking", tracking);
  if (orderIndex === -1) return { ok: false, error: "الأوردر غير موجود لحذفه" };

  sheets.orders.deleteRow(orderIndex);

  // تسجيل عملية الحذف في سجلات المراقبة الأمنية
  appendToSheet(sheets.auditLog, ["user", "type", "dateTime", "oldVal", "newVal", "reason"], {
    user: currentUser || "إدارة",
    type: "حذف أوردر",
    dateTime: now(),
    oldVal: tracking,
    newVal: "—",
    reason: `حذف الأوردر كود: ${tracking} نهائياً بواسطة الإدارة`
  });

  return { ok: true, msg: "تم حذف الأوردر نهائياً بكل أمان" };
}

function bulkUpdate(sheets, d) {
  const { trackings, status, courier, bulkStatus } = d;
  if (!trackings || !trackings.length) return { ok: false, error: "يرجى تحديد الأوردرات المراد تعديلها" };

  let updatedCount = 0;
  trackings.forEach(tracking => {
    const orderIndex = findRowIndex(sheets.orders, "tracking", tracking);
    if (orderIndex !== -1) {
      let upd = { updatedAt: now() };
      if (courier) upd.courier = courier;
      if (status) upd.status = status;
      if (bulkStatus) upd.status = bulkStatus;

      updateRowByObject(sheets.orders, orderIndex, upd);
      updatedCount++;
    }
  });

  return { ok: true, msg: `تم تحديث وإسناد ${updatedCount} أوردر بنجاح` };
}

// ───────────────────────────────────────────────
// (ب) لوحة الإحصائيات المركزية والأمان والتدقيق
// ───────────────────────────────────────────────

function getDashboardStats(sheets) {
  const orders = getTableData(sheets.orders);
  const couriers = getTableData(sheets.couriers);
  const suppliers = getTableData(sheets.suppliers);
  const expenses = getTableData(sheets.expenses);
  const cashbox = getTableData(sheets.cashbox);

  const total = orders.length;
  const delivered = orders.filter(o => o.status === "تم التسليم").length;
  const returned = orders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;
  const shipping = orders.filter(o => o.status === "خارج مع المندوب" || o.status === "تم الإسناد").length;

  const rate = total > 0 ? ((delivered / (delivered + returned || 1)) * 100) : 0;

  // حساب حركة الخزنة
  const cashIn = cashbox.filter(c => ["تحصيل مندوب", "إيداع خزنة direct", "إيداع"].includes(c.type)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const cashOut = cashbox.filter(c => ["صرف مورد", "دفعة للمورد", "مصروفات"].includes(c.type) || c.type.startsWith("سداد")).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const cashBalance = cashIn - cashOut;

  return {
    ok: true,
    stats: {
      total,
      delivered,
      returned,
      shipping,
      rate: rate.toFixed(1) + "%",
      cashBalance,
      remainingStock: orders.filter(o => !["تم التسليم", "خارج مع المندوب", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)).length
    },
    couriers: couriers.map(c => ({ name: c.name, total: orders.filter(o => o.courier === c.name).length })),
    suppliers: suppliers.map(s => ({ name: s.name, total: orders.filter(o => o.supplier === s.name).length })),
    bestCourier: couriers[0] ? couriers[0].name : "—",
    bestSupplier: suppliers[0] ? suppliers[0].name : "—"
  };
}

function getAuditLog(sheets) {
  const list = getTableData(sheets.auditLog);
  return { ok: true, logs: list.reverse() };
}

// ───────────────────────────────────────────────
// (ج) حركات حسابات الموردين والدفعات المالية
// ───────────────────────────────────────────────

function getSupplierLedger(sheets, d) {
  const { supplier } = d;
  const ledger = getTableData(sheets.supplierLedger);
  const filtered = ledger.filter(l => l.supplier === supplier);
  return { ok: true, ledger: filtered.reverse() };
}

function getSupplierDashboard(sheets, d) {
  const { supplier } = d;
  const orders = getTableData(sheets.orders);
  const ledger = getTableData(sheets.supplierLedger);

  const supOrders = orders.filter(o => o.supplier === supplier);
  const total = supOrders.length;
  const delivered = supOrders.filter(o => o.status === "تم التسليم").length;
  const returned = supOrders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;

  // الحسابات والمدفوعات والذمم الدائنة
  const totalCredited = supOrders.filter(o => o.status === "تم التسليم").reduce((sum, o) => sum + Number(o.prodPrice || 0), 0);
  const totalPaid = ledger.filter(l => l.supplier === supplier && l.type === "دفعة مورد").reduce((sum, l) => sum + Number(l.amount || 0), 0);
  const remaining = totalCredited - totalPaid;

  return {
    ok: true,
    stats: {
      total,
      delivered,
      returned,
      totalCredited,
      totalPaid,
      remaining
    }
  };
}

function getSupplierAccounts(sheets) {
  const suppliers = getTableData(sheets.suppliers);
  const orders = getTableData(sheets.orders);
  const ledger = getTableData(sheets.supplierLedger);

  const list = suppliers.map(s => {
    const sOrders = orders.filter(o => o.supplier === s.name && o.status === "تم التسليم");
    const sLedger = ledger.filter(l => l.supplier === s.name);

    const totalRevenue = sOrders.reduce((sum, o) => sum + Number(o.prodPrice || 0), 0);
    const paid = sLedger.filter(l => l.type === "دفعة مورد" || l.type.includes("دفعة")).reduce((sum, l) => sum + Number(l.amount || 0), 0);
    const balance = totalRevenue - paid;

    return {
      name: s.name,
      phone: s.phone,
      totalRevenue,
      paid,
      balance
    };
  });

  return { ok: true, accounts: list };
}

function addSupplierPayment(sheets, d) {
  const { supplier, amount, desc, currentUser } = d;
  if (!supplier || !amount || Number(amount) <= 0) return { ok: false, error: "قيمة الدفعة المالية المكتوبة غير صحيحة" };

  const val = Number(amount);

  // 1. قيد الخزانة (صرف الدفعة المادية من السند المركزي لتقليص النقدية)
  appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
    date: now(),
    desc: desc || `دفعة نقدية منصرفة للمورد: ${supplier}`,
    type: "صرف مورد",
    amount: val,
    ref: supplier,
    addedBy: currentUser || "إدارة الحسابات"
  });

  // 2. قيد دفتر الأستاذ الخاص بالمورد لإعدام الدائنة
  appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
    supplier: supplier,
    date: now(),
    type: "دفعة مورد",
    tracking: "—",
    amount: val,
    desc: desc || `استلام دفعة نقدية مسواة للمورد: ${supplier}`
  });

  // 3. تدوين الحدث الأمني المهم في سجل التدقيق المالي
  appendToSheet(sheets.auditLog, ["user", "type", "dateTime", "oldVal", "newVal", "reason"], {
    user: currentUser || "حسابات",
    type: "سداد مورد / دفعة نقدية",
    dateTime: now(),
    oldVal: "—",
    newVal: `صرف مبلغ: ${val} ج.م للمورد: ${supplier}`,
    reason: desc || `تخليص سداد وتصفية للمورد: ${supplier}`
  });

  return { ok: true, msg: "تم تسجيل الدفعة النقدية بنجاح وتسويتها بالخزنة" };
}

// ───────────────────────────────────────────────
// (د) حسابات تصفية مناديب الشحن ومنع العجز (Deficit System)
// ───────────────────────────────────────────────

function getCourierLedger(sheets, d) {
  const { courier } = d;
  const ledger = getTableData(sheets.courierLedger);
  const filtered = ledger.filter(l => l.courier === courier);
  return { ok: true, transactions: filtered.reverse() };
}

function getCourierInfo(sheets, d) {
  const courierName = d.courier;
  const couriers = getTableData(sheets.couriers);
  const orders = getTableData(sheets.orders);
  const ledger = getTableData(sheets.courierLedger);
  const cashbox = getTableData(sheets.cashbox);

  const courierObj = couriers.find(c => c.name === courierName);
  if (!courierObj) return { ok: false, error: "المندوب غير مسجل" };

  const courierOrders = orders.filter(o => o.courier === courierName);
  const targetLedger = ledger.filter(l => l.courier === courierName);

  const basicSalary = Number(courierObj.salary || 3000);
  const delivCommission = targetLedger.filter(l => l.type === "تسليم").reduce((sum, item) => sum + Number(item.amount || 25), 0);
  const returnShippingCommission = targetLedger.filter(l => l.type === "مرتجع مدفوع الشحن").reduce((sum, item) => sum + Number(item.amount || 25), 0);
  const bonusesSum = targetLedger.filter(l => l.type === "مكافأة").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const penaltiesSum = targetLedger.filter(l => l.type === "جزاء").reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // آلية تعقب عهدة النقدية ومنع العجز (Anti-loss tracking logic)
  // إجمالي المحصل من الأوردرات المسلمة
  const totalCollected = courierOrders.filter(o => o.status === "تم التسليم").reduce((sum, o) => sum + Number(o.totalCOD || 0), 0);
  // إجمالي ما دفعه وسلمه المندوب للشركة فعلياً
  const totalPaidToCompany = cashbox.filter(item => item.type === "استلام عهدة مندوب" && item.ref === courierName).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  // عجز المندوب المالي المعلق برقبته للشركة
  const deficit = totalCollected - totalPaidToCompany;

  const netSalary = basicSalary + delivCommission + returnShippingCommission + bonusesSum - penaltiesSum;

  return {
    ok: true,
    summary: {
      courierName,
      basicSalary,
      deliveredCount: courierOrders.filter(o => o.status === "تم التسليم").length,
      returnedPaidCount: courierOrders.filter(o => o.status === "مرتجع" && o.returnShippingType === "paid").length,
      delivCommission,
      returnShippingCommission,
      bonusesSum,
      penaltiesSum,
      netSalary,
      totalCollected,
      totalPaidToCompany,
      deficit
    },
    transactions: targetLedger.reverse()
  };
}

function addCourierAdjustment(sheets, d) {
  const { courier, type, amount, desc, currentUser } = d;
  if (!courier || !amount || Number(amount) <= 0) return { ok: false, error: "المبلغ المالي المكتوب لتسوية المندوب غير صحيح" };

  const val = Number(amount);

  // تسجيل القيد بدفتر العهد والمكافآت والجزاءات للمندوب
  appendToSheet(sheets.courierLedger, ["courier", "date", "type", "tracking", "amount", "desc"], {
    courier: courier,
    date: now(),
    type: type, // 'مكافأة' أو 'جزاء' أو 'خصم عجز تلقائي'
    tracking: "—",
    amount: type === "جزاء" ? -val : val,
    desc: desc || `تسوية مالية يدوية من نوع ${type}`
  });

  // تسجيلها بالخزنة في حال كانت تسوية عجز مباشر
  if (type === "خصم عجز تلقائي" || type === "استلام تصفية") {
    appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
      date: now(),
      desc: desc || `تسوية عجز مباشر مسترد للمندوب: ${courier}`,
      type: "استلام عهدة مندوب",
      amount: val,
      ref: courier,
      addedBy: currentUser || "إدارة العمليات"
    });
  }

  // تسجيل القيد الأمني في نظام التدقيق المالي
  appendToSheet(sheets.auditLog, ["user", "type", "dateTime", "oldVal", "newVal", "reason"], {
    user: currentUser || "إدارة الحسابات",
    type: `تسوية مندوب (${type})`,
    dateTime: now(),
    oldVal: "—",
    newVal: `${type}: ${val} ج.م للمندوب: ${courier}`,
    reason: desc || `تسجيل تسوية للمندوب: ${courier}`
  });

  return { ok: true, msg: "تم تسجيل التسوية المالية للمندوب بنجاح" };
}

// ───────────────────────────────────────────────
// (هـ) دوال الخزانة والمصروفات الإدارية والمستخدمين
// ───────────────────────────────────────────────

function getStatusHistory(sheets, d) {
  const list = getTableData(sheets.statusHistory);
  const filtered = list.filter(h => h.tracking === d.tracking);
  return { ok: true, history: filtered };
}

function getCashbox(sheets) {
  const list = getTableData(sheets.cashbox);
  const inSum = list.filter(c => ["تحصيل مندوب", "إيداع خزنة direct", "إيداع", "استلام عهدة مندوب"].includes(c.type)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const outSum = list.filter(c => ["صرف مورد", "دفعة للمورد", "مصروفات"].includes(c.type) || c.type.startsWith("سداد") || c.type === "صرف").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = inSum - outSum;

  return { ok: true, entries: list.reverse(), balance };
}

function addCashbox(sheets, d) {
  const { type, amount, desc, ref, currentUser } = d;
  if (!amount || Number(amount) <= 0) return { ok: false, error: "المبلغ المالي المكتوب غير صالح" };

  const val = Number(amount);

  const cashObj = {
    date: now(),
    desc: desc || "حركة توريد خزنة مباشرة",
    type: type, // 'إيداع خزنة direct' أو 'استلام عهدة مندوب'
    amount: val,
    ref: ref || "—",
    addedBy: currentUser || "الحسابات"
  };

  appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], cashObj);
  return { ok: true, msg: "تم إيداع المبلغ بالخزنة بنجاح وتصحيح العجز" };
}

function getExpenses(sheets) {
  const list = getTableData(sheets.expenses);
  return { ok: true, expenses: list };
}

function addExpense(sheets, d) {
  const { amount, desc, category, currentUser } = d;
  if (!amount || Number(amount) <= 0) return { ok: false, error: "قيمة الصرف للمصروفات غير صالحة" };

  const val = Number(amount);
  const idValue = "EXP-" + Math.floor(100000 + Math.random() * 900000);

  // 1. تسجيل المصروف بقيد جدول المصروفات الإدارية
  appendToSheet(sheets.expenses, ["id", "date", "amount", "desc", "category", "addedBy"], {
    id: idValue,
    date: nowHour(),
    amount: val,
    desc: desc,
    category: category,
    addedBy: currentUser || "عمليات"
  });

  // 2. ترحيل الأثر المالي فوراً لحسمه من الخزنة المركزية لضمان المطابقة
  appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
    date: now(),
    desc: `بند مصروفات إدارية: ${desc} (فئة: ${category})`,
    type: "مصروفات",
    amount: val,
    ref: idValue,
    addedBy: currentUser || "إدارة الحسابات"
  });

  return { ok: true, msg: "تم تسجيل وتسجيل المصروف الإداري وتحريره من الخزنة بنجاح" };
}

function nowHour() {
  return Utilities.formatDate(new Date(), "GMT+3", "yyyy-MM-dd HH:mm");
}

function getUsers(sheets) {
  const list = getTableData(sheets.users);
  return { ok: true, users: list };
}

function addUser(sheets, d) {
  const u = d.user;
  if (!u || !u.name || !u.pass) return { ok: false, error: "معلومات العضو الجديد غير كافية لإنشاء الحساب" };

  const userIndex = findRowIndex(sheets.users, "name", u.name);
  if (userIndex !== -1) return { ok: false, error: "اسم الحساب المدخل مسجل به مستخدم آخر مسبقاً" };

  appendToSheet(sheets.users, ["name", "role", "pass", "active", "email", "perms"], u);
  return { ok: true, msg: "تم حفظ وتفعيل حساب الموظف الجديد بنجاح" };
}

function updateUser(sheets, d) {
  const u = d.user;
  if (!u || !u.name) return { ok: false, error: "اسم الموظف مفقود لتحديث ملفه" };

  const userIndex = findRowIndex(sheets.users, "name", u.name);
  if (userIndex === -1) return { ok: false, error: "الموظف المطلوب غير موجود في النظام" };

  updateRowByObject(sheets.users, userIndex, u);
  return { ok: true, msg: "تم تحديث وحفظ تفاصيل حساب الموظف المختار" };
}

function checkPhone(sheets, d) {
  const { phone } = d;
  const orders = getTableData(sheets.orders);
  const found = orders.some(o => o.phone === phone || o.phone2 === phone);
  return { ok: true, exists: found };
}

function getCouriers(sheets) {
  const list = getTableData(sheets.couriers);
  return { ok: true, couriers: list };
}

function getSuppliers(sheets) {
  const list = getTableData(sheets.suppliers);
  return { ok: true, suppliers: list };
}

function getReportStats(sheets, d) {
  const { period } = d;
  const orders = getTableData(sheets.orders);
  let list = orders;

  const todayStr = nowDay();
  if (period === "today") {
    list = orders.filter(o => o.orderDate === todayStr);
  } else if (period === "pending") {
    list = orders.filter(o => o.status === "جاهز للشحن" || o.status === "جاري التجهيز");
  } else if (period === "return") {
    list = orders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status));
  } else if (period === "delivered") {
    list = orders.filter(o => o.status === "تم التسليم");
  }

  return { ok: true, count: list.length, orders: list };
}

function getDailyClosing(sheets) {
  const data = getTableData(sheets.dailyClosing);
  return { ok: true, records: data };
}

function addDailyClosing(sheets, d) {
  const { date, deliveredCount, returnedCount, totalCOD, shippingCost, currentUser } = d;
  if (!date) return { ok: false, error: "التاريخ مطلوب لتسجيل التقفيل اليومي" };

  const sheet = sheets.dailyClosing;
  const rowIndex = findRowIndex(sheet, "date", date);

  const closingObj = {
    date: date,
    deliveredCount: Number(deliveredCount || 0),
    returnedCount: Number(returnedCount || 0),
    totalCOD: Number(totalCOD || 0),
    shippingCost: Number(shippingCost || 0),
    addedBy: currentUser || "النظام"
  };

  if (rowIndex !== -1) {
    // تحديث صف التقفيل لموجود مسبقاً
    updateRowByObject(sheet, rowIndex, closingObj);
  } else {
    // إضافة صف جديد
    const headers = ["date", "deliveredCount", "returnedCount", "totalCOD", "shippingCost", "addedBy"];
    appendToSheet(sheet, headers, closingObj);
  }

  // تدوين التغيير المالي في سجل التدقيق الأمني لمنع التلاعب بالتقفيل
  appendToSheet(sheets.auditLog, ["user", "type", "dateTime", "oldVal", "newVal", "reason"], {
    user: currentUser || "محاسب",
    type: "ترصيد تقفيل يومي",
    dateTime: now(),
    oldVal: rowIndex !== -1 ? "تحديث تقرير موجود" : "تقرير جديد",
    newVal: `تقفيل ${date}: تسليم ${deliveredCount}أوردر، مرتجع ${returnedCount}أوردر، تحصيل ${totalCOD}ج.م، شحن ${shippingCost}ج.م`,
    reason: `تسجيل ومطابقة التقفيل اليومي المجمع لليوم المالي ${date}`
  });

  return { ok: true, msg: `تم حفظ تقرير التقفيل لليوم ${date} بالملفات المركزية للشيت بنجاح` };
}
