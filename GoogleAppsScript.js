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
  if (!e || !e.postData || !e.postData.contents) {
    return contentResponse({ ok: false, error: "لم يتم استقبال أي بيانات صالحة (Empty payload)" });
  }

  var requestData;
  try {
    requestData = JSON.parse(e.postData.contents);
  } catch(parseErr) {
    return contentResponse({ ok: false, error: "فشل تحليل البيانات المرسلة: " + parseErr.toString() });
  }

  var action = requestData.action;
  var token = requestData.token;

  // التحقق من صحة التوكن المركزي للأمان لمنع أي اختراق أو استدعاء خارجي
  if (token !== ACCESS_TOKEN) {
    return contentResponse({ ok: false, error: "صلاحية الرمز البرمجي (Token) غير صحيحة أو منتهية" });
  }

  // تحديد ما إذا كان الإجراء عبارة عن كتابة أو تعديل يحتاج إلى قفل حماية
  var writeActions = [
    "addOrder", "addBulk", "updateStatus", "updateOrder", "deleteOrder", 
    "bulkUpdate", "updateOrdersStatusBulk", "addSupplierPayment", 
    "addCourierAdjustment", "addCashbox", "addExpense", "addUser", 
    "registerUser", "updateUser", "updateCourier", "addDailyClosing"
  ];
  
  var isWrite = writeActions.indexOf(action) !== -1;
  var lock = LockService.getScriptLock();
  var lockAcquired = false;

  if (isWrite) {
    try {
      // محاولة الحصول على قفل حماية لمنع حدوث تداخل في البيانات عند الطلبات المتزامنة
      lock.waitLock(15000);
      lockAcquired = true;
    } catch (err) {
      return contentResponse({ ok: false, error: "الخادم مشغول حالياً بطلب كتابة آخر، يرجى المحاولة بعد قليل." });
    }
  }

  try {
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
      case "updateOrdersStatusBulk":
        result = updateOrdersStatusBulk(sheets, requestData);
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
      case "registerUser":
        result = registerUser(sheets, requestData);
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
      case "updateCourier":
        result = updateCourier(sheets, requestData);
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
    if (lockAcquired) {
      try {
        lock.releaseLock();
      } catch (lockErr) {
        // ignore
      }
    }
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
    couriers: ["name", "phone", "commission", "salary", "region", "base_fixed_salary", "commission_success", "commission_return"],
    suppliers: ["name", "phone", "price", "notes"],
    orders: [
      "tracking", "createdAt", "updatedAt", "orderDate", "supplier", "customer", 
      "phone", "phone2", "gov", "region", "address", "prodPrice", "shipPrice", 
      "totalCOD", "shipCost", "courier", "status", "prodType", "notes", "delivDate", "retDate", 
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
    supplierLedger: ["كشف حساب الموردين", "حساب الموردين", "supplierLedger"],
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
    } else {
      // 🛡️ معالجة احترازية: محاذاة الأعمدة وإضافة الناقص منها تلقائياً لمنع أخطاء البيانات
      const lastCol = sheet.getLastColumn();
      if (lastCol === 0) {
        sheet.appendRow(defs[key]);
        sheet.getRange(1, 1, 1, defs[key].length).setFontWeight("bold").setBackground("#f1f5f9");
      } else {
        const currentHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) {
          return h.toString().trim();
        });
        const expectedHeaders = defs[key];
        const missingHeaders = expectedHeaders.filter(function(h) {
          return h && currentHeaders.indexOf(h) === -1;
        });
        if (missingHeaders.length > 0) {
          const startCol = lastCol + 1;
          const range = sheet.getRange(1, startCol, 1, missingHeaders.length);
          range.setValues([missingHeaders]);
          range.setFontWeight("bold").setBackground("#e2e8f0"); // تظليل الأعمدة المدخلة حديثاً للشفافية
        }
      }
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

function normalizeToDateString(dateInput) {
  if (!dateInput) return "";
  var str = dateInput.toString().trim();

  // 1. Matches YYYY-MM-DD or YYYY/MM/DD (with optional time)
  var matchYMD = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (matchYMD) {
    var y = matchYMD[1];
    var m = matchYMD[2].length === 1 ? "0" + matchYMD[2] : matchYMD[2];
    var d = matchYMD[3].length === 1 ? "0" + matchYMD[3] : matchYMD[3];
    return y + "-" + m + "-" + d;
  }

  // 2. Matches DD/MM/YYYY or DD-MM-YYYY (Egyptian/Arabic standard, with optional time)
  var matchDMY = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (matchDMY) {
    var d = matchDMY[1].length === 1 ? "0" + matchDMY[1] : matchDMY[1];
    var m = matchDMY[2].length === 1 ? "0" + matchDMY[2] : matchDMY[2];
    var y = matchDMY[3];
    return y + "-" + m + "-" + d;
  }

  // 3. Matches DD/MM or DD-MM (with optional time, missing year)
  var matchDM = str.match(/^(\d{1,2})[-/](\d{1,2})/);
  if (matchDM) {
    var d = matchDM[1].length === 1 ? "0" + matchDM[1] : matchDM = matchDM[1];
    var m = matchDM[2].length === 1 ? "0" + matchDM[2] : matchDM = matchDM[2];
    var y = "2026";
    try {
      y = new Date().getFullYear().toString();
    } catch (e) {}
    return y + "-" + m + "-" + d;
  }

  try {
    var dateObj = new Date(str);
    if (!isNaN(dateObj.getTime())) {
      var pad = function(n) { return n.toString().length === 1 ? "0" + n : n.toString(); };
      return dateObj.getFullYear() + "-" + pad(dateObj.getMonth() + 1) + "-" + pad(dateObj.getDate());
    }
  } catch (e) {}
  return str.substring(0, 10);
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

  const sPrice = Number(o.shipPrice || 60);
  const tCOD = Number(o.totalCOD || (Number(o.prodPrice || 0) + sPrice));
  // Formula: Supplier_Net_Balance = Total_Collected - Shipping_Fees
  const pPrice = tCOD - sPrice;

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
    prodType: o.prodType || "",
    notes: o.notes || "",
    delivDate: "",
    retDate: "",
    addedBy: d.currentUser || "إدارة",
    commission: 0,
    returnShippingType: "",
    returnQueueStatus: "",
    returnQueueAgent: ""
  };

  // Automatic registration of new supplier if they are not in sheets.suppliers
  const orderSupplier = (newOrder.supplier || "").toString().trim();
  if (orderSupplier) {
    const registeredSuppliers = getTableData(sheets.suppliers);
    const matchedSup = registeredSuppliers.find(function(s) {
      return s.name && s.name.trim().toLowerCase() === orderSupplier.toLowerCase();
    });
    if (!matchedSup) {
      appendToSheet(sheets.suppliers, ["name", "phone", "price", "notes"], {
        name: orderSupplier,
        phone: "—",
        price: 60,
        notes: "تم تسجيله تلقائياً عن طريق إضافة أوردر يدوي"
      });
    }
  }

  const headers = sheets.orders.getRange(1, 1, 1, sheets.orders.getLastColumn()).getValues()[0].map(h => h.trim());
  appendToSheet(sheets.orders, headers, newOrder);

  // Record Supplier Ledger
  appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
    supplier: newOrder.supplier,
    date: now(),
    type: "أوردر مستلم",
    tracking: newOrder.tracking,
    amount: pPrice,
    desc: `أوردر جديد مستلم من المورد: ${newOrder.tracking} (صافي حساب المورد: ${pPrice} = المحصل ${tCOD} - الشحن ${sPrice})`
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
  const fallbackSupplier = d.supplier || "مورد عام";

  // Pre-fetch all registered suppliers from sheets to check against dynamically
  const registeredSuppliers = getTableData(sheets.suppliers);

  list.forEach(o => {
    if (!o.tracking) {
      o.tracking = "FP-" + (1000 + currentLastRow) + "-" + yearSuffix;
      currentLastRow++;
    }

    if (findRowIndex(sheets.orders, "tracking", o.tracking) === -1) {
      // Resolve supplier row-by-row
      let orderSupplier = fallbackSupplier;
      if (d.currentRole === "مورد") {
        orderSupplier = d.currentUser;
      } else {
        const itemRowSupplier = (o.supplier || "").toString().trim();
        if (itemRowSupplier) {
          orderSupplier = itemRowSupplier;
          // Automap: if it doesn't exist in suppliers, append it to sheets.suppliers
          const matchedSup = registeredSuppliers.find(function(s) {
            return s.name && s.name.trim().toLowerCase() === itemRowSupplier.toLowerCase();
          });
          if (!matchedSup) {
            appendToSheet(sheets.suppliers, ["name", "phone", "price", "notes"], {
              name: itemRowSupplier,
              phone: "—",
              price: 60,
              notes: "تم تسجيله تلقائياً عن طريق رفع جماعي"
            });
            registeredSuppliers.push({ name: itemRowSupplier, phone: "—", price: 60, notes: "تم تسجيله تلقائياً عن طريق رفع جماعي" });
          }
        } else {
          orderSupplier = fallbackSupplier;
        }
      }

      // Resolve prices smartly (by reading total, shipping, product, cash to be collected from synonyms)
      let pPrice = Number(o.prodPrice) || 0;
      let sPrice = Number(o.shipPrice) || 0;
      let tCOD = Number(o.totalCOD) || 0;

      const rawShip = o["سعر الشحن"] || o["الشحن"] || o["تكلفة الشحن"] || o["مصاريف الشحن"] || o["shipping"] || o["shipPrice"] || o["ship_price"];
      const rawTotal = o["المطلوب تحصيله"] || o["التحصيل"] || o["المطلوب"] || o["إجمالي الكود"] || o["الإجمالي"] || o["الاجمالي"] || o["إجمالي الأوردر"] || o["total"] || o["totalCOD"] || o["total_cod"] || o["cash_to_be_collected"] || o["cash"];
      const rawProd = o["سعر المنتج"] || o["المنتج"] || o["سعر المادة"] || o["price"] || o["prodPrice"] || o["product_price"];

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

      const draft = {
        tracking: o.tracking,
        createdAt: now(),
        updatedAt: now(),
        orderDate: o.orderDate || nowDay(),
        supplier: orderSupplier,
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
        prodType: o.prodType || "",
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

      // Record Supplier Ledger (with detailed informative description for balance calculation)
      appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
        supplier: orderSupplier,
        date: now(),
        type: "أوردر مستلم",
        tracking: draft.tracking,
        amount: pPrice,
        desc: `رفع أوردر مستلم جماعياً ${draft.tracking} (صافي حساب المورد: ${pPrice} = المحصل ${tCOD} - الشحن ${sPrice})`
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
  const { tracking, status, returnShippingType, currentUser, currentRole, notes, delivDate, date } = d;
  if (!tracking || !status) return { ok: false, error: "معاملات مسندة مفقودة" };

  // 🚨 Security Guard & Role Enforcement for Apps Script
  const cleanRole = (currentRole || "").toString().trim();
  const isAdmin = cleanRole === "مدير" || cleanRole === "مشرف";
  const isAgent = cleanRole === "مندوب" || cleanRole.includes("مندوب");
  const isOps = cleanRole === "موظف عمليات" || cleanRole.includes("عمليات");
  const isReturnsOfficer = cleanRole === "مسؤول مرتجعات" || cleanRole.includes("مرتجع");
  const isSupplier = cleanRole === "مورد" || cleanRole.includes("مورد");

  let finalStatus = status;
  if (status === "تم تسليم المرتجع للمورد وتصفية حسابه") finalStatus = "تم تسليم المرتجع للمورد";
  if (status === "تم التسليم بنجاح") finalStatus = "تم التسليم";
  if (status === "مؤجل بناءً على طلب العميل") finalStatus = "مؤجل";

  if (isSupplier) {
    return { ok: false, error: "Unauthorized Action: المورد لا يمتلك صلاحية تعديل الحالة" };
  }

  if (isAgent) {
    const allowed = ["تم التسليم", "تم التسليم بنجاح", "مؤجل", "مؤجل بناءً على طلب العميل", "لا يوجد رد", "مرتجع"];
    if (!allowed.includes(status)) {
      return { ok: false, error: "Unauthorized Action: غير مسموح للمندوب باختيار هذه الحالة" };
    }
  }

  if (isOps) {
    const allowed = ["تم رد العميل وجاري التنسيق", "لا يرد - محاولة أولى/ثانية", "تحديث نتيجة الاتصال", "مؤجل", "لا يوجد رد", "جديد"];
    if (!allowed.includes(status)) {
      return { ok: false, error: "Unauthorized Action: غير مسموح لموظف العمليات باختيار هذه الحالة" };
    }
  }

  if (isReturnsOfficer) {
    const allowed = ["مرتجع جديد", "مرتجع جاري تسليمه للمكتب", "جاري الرجوع للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه", "تم تسليم المرتجع للمورد", "جديد"];
    if (!allowed.includes(status)) {
      return { ok: false, error: "Unauthorized Action: غير مسموح لمسؤول المرتجعات باختيار هذه الحالة" };
    }
  }

  const orderIndex = findRowIndex(sheets.orders, "tracking", tracking);
  if (orderIndex === -1) return { ok: false, error: "الأوردر المطلوب غير موجود" };

  const orders = getTableData(sheets.orders);
  const order = orders.find(x => x.tracking === tracking);

  // Rider can only touch their own orders
  if (isAgent && order.courier !== currentUser) {
    return { ok: false, error: "Unauthorized Action: هذا الأوردر ليس مسنداً إليك" };
  }

  const oldStatus = order.status;

  if (oldStatus === "تم التسليم") {
    return { ok: false, error: "لا يمكن تعديل حالة أوردر تم تسليمه مسبقاً" };
  }

  // الحالات الافتراضية للتحديث
  let updateObj = {
    status: finalStatus,
    updatedAt: now()
  };

  if (notes !== undefined && notes !== "") {
    updateObj.notes = notes;
  }
  const anyDate = date || delivDate;
  if (anyDate !== undefined && anyDate !== "") {
    updateObj.delivDate = anyDate;
  }

  // معالجة حالة المرتجع (مرتجع)
  if (finalStatus === "مرتجع") {
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

    // يتم ترحيلها كعهدة معلقة حتى التوريد والإنهاء الفعلي يدوياً من المشرف
    // تم إلغاء التسجيل التلقائي هنا تماشيًا مع فصل كاش الشارع
    // appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], { ... });
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

    // تحديث كشف حساب المورد في الشيت أيضاً لمزامنة التغيير المالي
    const ledgerIndex = findRowIndex(sheets.supplierLedger, "tracking", o.tracking);
    if (ledgerIndex !== -1) {
      updateRowByObject(sheets.supplierLedger, ledgerIndex, {
        amount: newProd,
        desc: `تعديل قيمة أوردر مستلم ${o.tracking} (صافي حساب المورد: ${newProd} = الكلي ${o.totalCOD} - الشحن ${newShip})`
      });
    }

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
  const { trackings, status, courier, bulkStatus, currentRole, currentUser, notes, delivDate, date } = d;
  if (!trackings || !trackings.length) return { ok: false, error: "يرجى تحديد الأوردرات المراد تعديلها" };

  // 🚨 Security Guard & Role Enforcement for Apps Script Bulk
  const cleanRole = (currentRole || "").toString().trim();
  const isAdmin = cleanRole === "مدير" || cleanRole === "مشرف";
  const isAgent = cleanRole === "مندوب" || cleanRole.includes("مندوب");
  const isOps = cleanRole === "موظف عمليات" || cleanRole.includes("عمليات");
  const isReturnsOfficer = cleanRole === "مسؤول مرتجعات" || cleanRole.includes("مرتجع");
  const isSupplier = cleanRole === "مورد" || cleanRole.includes("مورد");

  let targetStatus = status || bulkStatus;
  
  if (targetStatus === "تم تسليم المرتجع للمورد وتصفية حسابه") targetStatus = "تم تسليم المرتجع للمورد";
  if (targetStatus === "تم التسليم بنجاح") targetStatus = "تم التسليم";
  if (targetStatus === "مؤجل بناءً على طلب العميل") targetStatus = "مؤجل";

  if (isSupplier) {
    return { ok: false, error: "Unauthorized Action: المورد لا يمتلك صلاحية تعديل الحالات جماعياً" };
  }

  if (isAgent) {
    const allowed = ["تم التسليم", "مؤجل", "لا يوجد رد", "مرتجع"];
    if (targetStatus && !allowed.includes(targetStatus)) {
      return { ok: false, error: "Unauthorized Action: خطأ في صلاحيات المندوب لتحديث هذه الحالة جماعياً" };
    }
    if (courier !== undefined) {
      return { ok: false, error: "Unauthorized Action: المندوب لا يملك صلاحيات تعديل أو تعيين المناديب المسؤولين" };
    }
  }

  if (isOps) {
    const allowed = ["تم رد العميل وجاري التنسيق", "لا يرد - محاولة أولى/ثانية", "تحديث نتيجة الاتصال", "مؤجل", "لا يوجد رد", "جديد"];
    if (targetStatus && !allowed.includes(targetStatus)) {
      return { ok: false, error: "Unauthorized Action: خطأ في صلاحيات موظف العمليات لتحديث هذه الحالة جماعياً" };
    }
    if (courier !== undefined) {
      return { ok: false, error: "Unauthorized Action: موظف العمليات لا يملك صلاحية تعديل أو تعيين المناديب المسؤولين" };
    }
  }

  if (isReturnsOfficer) {
    const allowed = ["مرتجع جديد", "مرتجع جاري تسليمه للمكتب", "جاري الرجوع للمورد", "تم تسليم المرتجع للمورد", "جديد"];
    if (targetStatus && !allowed.includes(targetStatus)) {
      return { ok: false, error: "Unauthorized Action: خطأ في صلاحيات مسؤول المرتجعات المكتبية لتحديث هذه الحالة جماعياً" };
    }
    if (courier !== undefined) {
      return { ok: false, error: "Unauthorized Action: مسؤول المرتجعات لا يملك صلاحية تعديل أو تعيين المناديب المسؤولين" };
    }
  }

  const sheet = sheets.orders;
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { ok: true, msg: "لا توجد أوردرات للتحديث", done: 0 };

  const lastCol = sheet.getLastColumn();
  const range = sheet.getRange(1, 1, lastRow, lastCol);
  const data = range.getValues();
  
  const headers = data[0].map(h => h.toString().trim());
  const trackingIdx = headers.indexOf("tracking");
  const updatedAtIdx = headers.indexOf("updatedAt");
  const courierIdx = headers.indexOf("courier");
  const statusIdx = headers.indexOf("status");
  const notesIdx = headers.indexOf("notes");
  const delivDateIdx = headers.indexOf("delivDate");

  if (trackingIdx === -1) return { ok: false, error: "عمود الكود التتبعي غير موجود في شيت الأوردرات" };

  let updatedCount = 0;
  const trackingsSet = trackings.map(t => t.toString().trim().toUpperCase());
  const anyNotes = notes;
  const anyDate = date || delivDate;

  for (let r = 1; r < data.length; r++) {
    const rowTracking = data[r][trackingIdx].toString().trim().toUpperCase();
    if (trackingsSet.indexOf(rowTracking) !== -1) {
      // Security: Rider can only adjust their own assigned orders
      if (isAgent && courierIdx !== -1) {
        const rowCourierName = data[r][courierIdx].toString().trim();
        if (rowCourierName !== currentUser) {
          continue; // Skip security violation row
        }
      }

      if (updatedAtIdx !== -1) data[r][updatedAtIdx] = now();
      if (courier && courierIdx !== -1 && (isAdmin || cleanRole === "محاسب")) {
        data[r][courierIdx] = courier;
      }
      if (targetStatus && statusIdx !== -1) {
        data[r][statusIdx] = targetStatus;
      }
      if (anyNotes !== undefined && anyNotes !== "" && notesIdx !== -1) {
        data[r][notesIdx] = anyNotes;
      }
      if (anyDate !== undefined && anyDate !== "" && delivDateIdx !== -1) {
        data[r][delivDateIdx] = anyDate;
      }
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    range.setValues(data);
  }

  return { ok: true, msg: `تم تحديث وإسناد ${updatedCount} أوردر بنجاح بمستوى أمني وقائي عالي`, done: updatedCount };
}

function updateOrdersStatusBulk(sheets, d) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // إجبار السيرفر على الانتظار حتى 10 ثوانٍ لو هناك ضغط عمليات متزامن

  try {
    const { updates, currentRole, currentUser } = d;
    if (!updates || !updates.length) return { ok: false, error: "يرجى تقديم مصفوفة التحديثات الجماعية" };

    // Role checks
    const cleanRole = (currentRole || "").toString().trim();
    const isAdmin = cleanRole === "مدير" || cleanRole === "مشرف";
    const isAgent = cleanRole === "مندوب" || cleanRole.includes("مندوب");
    const isOps = cleanRole === "موظف عمليات" || cleanRole.includes("عمليات");
    const isReturnsOfficer = cleanRole === "مسؤول مرتجعات" || cleanRole.includes("مرتجع");
    const isSupplier = cleanRole === "مورد" || cleanRole.includes("مورد");

    if (isSupplier) {
      return { ok: false, error: "Unauthorized Action: ليس للمورد صلاحية التعديل الجماعي" };
    }

    const sheet = sheets.orders;
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { ok: true, msg: "لا توجد أوردرات للتحديث", done: 0 };

    const lastCol = sheet.getLastColumn();
    const range = sheet.getRange(1, 1, lastRow, lastCol);
    const data = range.getValues();
    
    const headers = data[0].map(h => h.toString().trim());
    const trackingIdx = headers.indexOf("tracking");
    const updatedAtIdx = headers.indexOf("updatedAt");
    const courierIdx = headers.indexOf("courier");
    const statusIdx = headers.indexOf("status");
    const notesIdx = headers.indexOf("notes");
    const delivDateIdx = headers.indexOf("delivDate");
    const retDateIdx = headers.indexOf("retDate");
    const returnShippingTypeIdx = headers.indexOf("returnShippingType");
    const commissionIdx = headers.indexOf("commission");

    if (trackingIdx === -1) return { ok: false, error: "عمود الكود التتبعي غير موجود في شيت الأوردرات" };

    // Build a rows index map
    const rowsMap = {};
    for (let r = 1; r < data.length; r++) {
      const trStr = data[r][trackingIdx].toString().trim().toUpperCase();
      if (trStr) {
        rowsMap[trStr] = r;
      }
    }

    let updatedCount = 0;
    const couriers = getTableData(sheets.couriers);
    
    for (var i = 0; i < updates.length; i++) {
      const item = updates[i];
      const tr = (item.tracking || "").toString().trim().toUpperCase();
      const r = rowsMap[tr];
      if (r === undefined) continue;

      const rowCourierName = courierIdx !== -1 ? data[r][courierIdx].toString().trim() : "";
      if (isAgent && rowCourierName !== currentUser) {
        continue; // Security check
      }

      // Role status validation
      let targetStatus = item.status;
      if (targetStatus === "تم تسليم المرتجع للمورد وتصفية حسابه") targetStatus = "تم تسليم المرتجع للمورد";
      if (targetStatus === "تم التسليم بنجاح") targetStatus = "تم التسليم";
      if (targetStatus === "مؤجل بناءً على طلب العميل") targetStatus = "مؤجل";

      if (targetStatus) {
        if (isAgent) {
          const allowed = ["تم التسليم", "مؤجل", "لا يوجد رد", "مرتجع"];
          if (allowed.indexOf(targetStatus) === -1) continue;
        }
        if (isOps) {
          const allowed = ["تم رد العميل وجاري التنسيق", "لا يرد - محاولة أولى/ثانية", "تحديث نتيجة الاتصال", "مؤجل", "لا يوجد رد", "جديد"];
          if (allowed.indexOf(targetStatus) === -1) continue;
        }
        if (isReturnsOfficer) {
          const allowed = ["مرتجع جديد", "مرتجع جاري تسليمه للمكتب", "جاري الرجوع للمورد", "تم تسليم المرتجع للمورد", "جديد"];
          if (allowed.indexOf(targetStatus) === -1) continue;
        }
      }

      const oldStatus = statusIdx !== -1 ? data[r][statusIdx].toString().trim() : "";

       // Courier Assignment
       if (item.courier !== undefined && courierIdx !== -1 && (isAdmin || cleanRole === "محاسب")) {
         const newCourier = item.courier;
         if (newCourier === "reset_warehouse" || newCourier === "") {
           const lastCourierIdx = headers.indexOf("lastCourier");
           if (lastCourierIdx !== -1) {
             data[r][lastCourierIdx] = data[r][courierIdx];
           }
           const lastCommissionIdx = headers.indexOf("lastCommission");
           if (lastCommissionIdx !== -1 && commissionIdx !== -1) {
             data[r][lastCommissionIdx] = data[r][commissionIdx];
           }
           // Do not clear courier ID to preserve historical custody visibility
           // Do not reset courier commission to preserve historical settlement details
           if (statusIdx !== -1 && oldStatus !== "جديد") {
            data[r][statusIdx] = "جديد";
          }
        } else if (newCourier !== rowCourierName) {
          data[r][courierIdx] = newCourier;
          const cProfile = couriers.find(function(c) { return c.name === newCourier; });
          const comm = cProfile ? Number(cProfile.commission || 25) : 25;
          if (commissionIdx !== -1) data[r][commissionIdx] = comm;

          if (oldStatus === "جديد" && statusIdx !== -1) {
            data[r][statusIdx] = "تم الإسناد";
          }
        }
      }

      // Apply Status Override
      if (targetStatus !== undefined && statusIdx !== -1 && targetStatus !== oldStatus) {
        data[r][statusIdx] = targetStatus;

        if (targetStatus === "تم التسليم") {
          const itemDate = item.date || item.delivDate || item.postponedDate;
          if (delivDateIdx !== -1) data[r][delivDateIdx] = itemDate || now();
          
          const currentCourier = courierIdx !== -1 ? data[r][courierIdx].toString().trim() : "";
          const cProfile = couriers.find(function(c) { return c.name === currentCourier; });
          const comm = cProfile ? Number(cProfile.commission || 25) : 25;

          appendToSheet(sheets.courierLedger, ["courier", "date", "type", "tracking", "amount", "desc"], {
            courier: currentCourier,
            date: now(),
            type: "تسليم",
            tracking: tr,
            amount: comm,
            desc: "عمولة تسليم الأوردر جماعياً (الدفعة المجمعة): " + tr
          });

          const totalCOD = headers.indexOf("totalCOD") !== -1 ? Number(data[r][headers.indexOf("totalCOD")] || 0) : 0;
          // تم إلغاء التسجيل التلقائي هنا لمطابقة فصل كاش الشارع
          // appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], { ... });

          const prodPrice = headers.indexOf("prodPrice") !== -1 ? Number(data[r][headers.indexOf("prodPrice")] || 0) : 0;
          const shipPrice = headers.indexOf("shipPrice") !== -1 ? Number(data[r][headers.indexOf("shipPrice")] || 0) : 0;
          const supplierPrice = prodPrice !== 0 ? prodPrice : (totalCOD - shipPrice);
          const supplierName = headers.indexOf("supplier") !== -1 ? data[r][headers.indexOf("supplier")].toString().trim() : "";
          
          if (supplierName) {
            appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
              supplier: supplierName,
              date: now(),
              type: "أوردر مستلم",
              tracking: tr,
              amount: supplierPrice,
              desc: "حقوق توريد أوردر تم تسليمه جماعياً (الدفعة المجمعة): " + tr + " (بضاعة " + supplierPrice + ")"
            });
          }
        }

        if (["مرتجع", "تم تسليم المرتجع للمورد", "التسليم للمورد"].indexOf(targetStatus) !== -1) {
          if (retDateIdx !== -1) data[r][retDateIdx] = now();
          if (targetStatus === "تم تسليم المرتجع للمورد" || targetStatus === "التسليم للمورد") {
            const prodPrice = headers.indexOf("prodPrice") !== -1 ? Number(data[r][headers.indexOf("prodPrice")] || 0) : 0;
            const supplierName = headers.indexOf("supplier") !== -1 ? data[r][headers.indexOf("supplier")].toString().trim() : "";
            if (supplierName) {
              appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
                supplier: supplierName,
                date: now(),
                type: "مرتجع تم تسليمه للمورد",
                tracking: tr,
                amount: -Number(prodPrice),
                desc: "خصم قيمة المنتج لمرتجع تسلمه المورد جماعياً (الدفعة المجمعة): " + tr
              });
            }
          }
        }

        appendToSheet(sheets.statusHistory, ["tracking", "oldStatus", "newStatus", "updatedBy", "dateTime"], {
          tracking: tr,
          oldStatus: oldStatus,
          newStatus: targetStatus || (statusIdx !== -1 ? data[r][statusIdx].toString().trim() : "جديد"),
          updatedBy: currentUser,
          dateTime: now()
        });
      }

      if (item.notes !== undefined && notesIdx !== -1) {
        data[r][notesIdx] = item.notes;
      }
      if (updatedAtIdx !== -1) {
        data[r][updatedAtIdx] = now();
      }

      updatedCount++;
    }

    if (updatedCount > 0) {
      range.setValues(data);
    }

    return { ok: true, msg: "تم ترحيل وتحديث الفوج الجماعي لـ " + updatedCount + " أوردر دفعة واحدة بنجاح تام", done: updatedCount };
  } finally {
    lock.releaseLock();
  }
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
  const returned = orders.filter(o => {
    const isSomeReturn = ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "مرتجع والعميل دفع الشحن"].includes(o.status) || (o.status || "").indexOf("مرتجع") !== -1;
    const isDeliveredToSupplier = ["تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status);
    return isSomeReturn && !isDeliveredToSupplier;
  }).length;
  const shipping = orders.filter(o => o.status === "خارج مع المندوب" || o.status === "تم الإسناد").length;

  const rate = total > 0 ? ((delivered / (delivered + returned || 1)) * 100) : 0;
  const assignedPending = orders.filter(o => o.courier && o.courier !== "" && !["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;

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
      assignedPending,
      rate: rate.toFixed(1) + "%",
      cashBalance,
      remainingStock: orders.filter(o => !["تم التسليم", "خارج مع المندوب", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)).length
    },
    couriers: couriers.map(c => ({ name: c.name, total: orders.filter(o => o.courier === c.name).length })),
    suppliers: suppliers.map(s => ({ name: s.name, total: orders.filter(o => isSameSupplier(o.supplier, s.name)).length })),
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
// HELPER FOR GENUINE HUMAN PAYOUT CLASSIFICATION
// ───────────────────────────────────────────────
function isHumanPayout(l) {
  if (!l) return false;
  var type = (l.type || "").toString().trim();
  var desc = (l.desc || "").toString().trim();
  var tracking = (l.tracking || "").toString().trim();
  
  var isPayOrAdj = ["دفع نقدي", "دفعة مورد", "صرف مورد", "دفعة", "مسحوبات", "سحب"].indexOf(type) !== -1 || 
                     type.indexOf("دفعة") !== -1 || 
                     type.indexOf("صرف") !== -1 || 
                     type.indexOf("سحب") !== -1 || 
                     tracking === "CASH-PAY";
                     
  var isAutoOrReturn = type.indexOf("مرتجع") !== -1 || 
                         desc.indexOf("مرتجع") !== -1 || 
                         type.indexOf("أوردر") !== -1 ||
                         type.indexOf("حقوق") !== -1 ||
                         desc.indexOf("حقوق") !== -1 ||
                         (tracking !== "" && tracking !== "—" && tracking !== "CASH-PAY" && tracking.indexOf("FP-") === 0);
                         
  return isPayOrAdj && !isAutoOrReturn;
}

function isReturnedDeliveredToSupplier(status) {
  var s = (status || "").toString().trim();
  var patterns = [
    "تم تسليم المرتجع للمورد",
    "مرتجع تم تسليمه للمورد",
    "التسليم للمورد",
    "تم تسليم المرتجع للمورد وتصفية حسابه",
    "تسليم المرتجع للمورد",
    "تسليمه للمورد",
    "تصفية حسابه"
  ];
  return patterns.some(function(p) {
    return s.indexOf(p) !== -1;
  });
}

function isSomeReturn(status) {
  var s = (status || "").toString().trim();
  var patterns = ["مرتجع", "مرفوض", "فشل", "مسترجع", "التسليم للمورد", "تصفية"];
  return patterns.some(function(p) {
    return s.indexOf(p) !== -1;
  });
}

function isSameSupplier(nameA, nameB) {
  if (!nameA || !nameB) return false;
  return nameA.toString().trim().toLowerCase() === nameB.toString().trim().toLowerCase();
}

function getSupplierLedger(sheets, d) {
  const { supplier } = d;
  const ledger = getTableData(sheets.supplierLedger);
  if (!supplier) {
    return { ok: true, ledger: ledger };
  }
  const filtered = ledger.filter(l => isSameSupplier(l.supplier, supplier));
  return { ok: true, ledger: filtered.reverse() };
}

function getSupplierDashboard(sheets, d) {
  const { supplier } = d;
  const orders = getTableData(sheets.orders);
  const ledger = getTableData(sheets.supplierLedger);

  const rawSupOrders = orders.filter(o => isSameSupplier(o.supplier, supplier));
  
  // Dedup rawSupOrders by tracking ID
  const uniqueSupOrdersMap = {};
  rawSupOrders.forEach(o => {
    var track = (o.tracking || "").toString().trim();
    if (track) {
      uniqueSupOrdersMap[track] = o;
    } else {
      uniqueSupOrdersMap["NO-TRACK-" + Math.random()] = o;
    }
  });
  const supOrders = Object.keys(uniqueSupOrdersMap).map(k => uniqueSupOrdersMap[k]);
  const total = supOrders.length;
  
  const deliveredOrders = supOrders.filter(o => o.status === "تم التسليم");
  const delivered = deliveredOrders.length;
  
  // 1. Total uploaded goods (value of products only without shipping)
  const totalGoodsUploaded = supOrders.reduce((sum, o) => {
    return sum + (Number(o.totalCOD || 0) - Number(o.shipPrice || 0));
  }, 0);

  const returnedDGoods = supOrders.filter(o => isReturnedDeliveredToSupplier(o.status));
  const returned = supOrders.filter(o => isSomeReturn(o.status) && !isReturnedDeliveredToSupplier(o.status)).length;
  
  // 2. Returns delivered back to supplier ("تم تسليم المرتجع للمورد" or equivalent)
  const returnsDeliveredValue = returnedDGoods.reduce((sum, o) => {
    return sum + (Number(o.totalCOD || 0) - Number(o.shipPrice || 0));
  }, 0);

  // 3. Cash payments paid to supplier (Strict signed human payout classification)
  const sLedger = ledger.filter(l => isSameSupplier(l.supplier, supplier));
  const totalPaid = sLedger.filter(isHumanPayout).reduce((sum, l) => sum - Number(l.amount || 0), 0);

  // 4. Current outstanding balance based on formula: Outstanding = TotalGoodsUploaded - Returned - Paid
  const remaining = totalGoodsUploaded - returnsDeliveredValue - totalPaid;

  return {
    ok: true,
    stats: {
      total,
      delivered,
      returned,
      totalCredited: totalGoodsUploaded,
      totalPaid,
      remaining
    }
  };
}

function getSupplierAccounts(sheets) {
  const suppliers = getTableData(sheets.suppliers);
  const orders = getTableData(sheets.orders);
  const ledger = getTableData(sheets.supplierLedger);

  // Extract all unique names from both suppliers list and orders list
  const registeredNames = suppliers.map(function(s) { return s.name; }).filter(Boolean);
  const orderNames = orders.map(function(o) { return o.supplier; }).filter(Boolean);
  const allSupplierNames = [];
  const seenSuppliers = {};

  // Combine both arrays, preserving case, unique
  registeredNames.concat(orderNames).forEach(function(name) {
    const cleanName = name.toString().trim();
    if (cleanName && !seenSuppliers[cleanName.toLowerCase()]) {
      seenSuppliers[cleanName.toLowerCase()] = true;
      allSupplierNames.push(cleanName);
    }
  });

  const list = allSupplierNames.map(function(supplierName) {
    const sObj = suppliers.find(function(s) {
      return s.name && s.name.toString().trim().toLowerCase() === supplierName.toLowerCase();
    });
    const sLedger = ledger.filter(function(l) { return isSameSupplier(l.supplier, supplierName); });
    const rawSupOrders = orders.filter(function(o) { return isSameSupplier(o.supplier, supplierName); });

    // Dedup rawSupOrders by tracking ID
    const uniqueSupOrdersMap = {};
    rawSupOrders.forEach(function(o) {
      var track = (o.tracking || "").toString().trim();
      if (track) {
        uniqueSupOrdersMap[track] = o;
      } else {
        uniqueSupOrdersMap["NO-TRACK-" + Math.random()] = o;
      }
    });
    const sOrders = Object.keys(uniqueSupOrdersMap).map(function(k) { return uniqueSupOrdersMap[k]; });

    // 1. Total Goods Uploaded (without shipping)
    const totalGoodsUploaded = sOrders.reduce(function(sum, o) {
      return sum + (Number(o.totalCOD || 0) - Number(o.shipPrice || 0));
    }, 0);

    // 2. Returns delivered back to supplier
    const returnedOrders = sOrders.filter(function(o) { return isReturnedDeliveredToSupplier(o.status); });
    const returnsCount = returnedOrders.length;
    const returnsDeliveredValue = returnedOrders.reduce(function(sum, o) {
      return sum + (Number(o.totalCOD || 0) - Number(o.shipPrice || 0));
    }, 0);

    // 3. Cash payments paid to supplier
    const paid = sLedger.filter(isHumanPayout).reduce(function(sum, l) { return sum - Number(l.amount || 0); }, 0);

    // 4. Current outstanding balance based on final formula: Outstanding = TotalGoodsUploaded - Returned - Paid
    const balance = totalGoodsUploaded - returnsDeliveredValue - paid;

    const totalOrders = sOrders.length;
    const deliveredOrders = sOrders.filter(function(o) { return o.status === "تم التسليم"; }).length;

    return {
      name: supplierName,
      phone: sObj ? (sObj.phone || "—") : "—",
      totalRevenue: totalGoodsUploaded,
      totalCOD: totalGoodsUploaded,
      returnsDelivered: returnsDeliveredValue,
      returnsCount: returnsCount,
      paid: paid,
      payments: paid,
      balance: balance,
      totalOrders: totalOrders,
      deliveredOrders: deliveredOrders
    };
  });

  return { ok: true, accounts: list };
}

function addSupplierPayment(sheets, d) {
  const { supplier, amount, desc, currentUser, transactionType } = d;
  if (!supplier || !amount || Number(amount) === 0) return { ok: false, error: "قيمة الدفعة المالية المكتوبة غير صحيحة" };

  // Handle absolute values, manual deductions are stored as negative in ledger
  const val = Math.abs(Number(amount));
  const isWithdrawal = transactionType === "withdrawal" || transactionType === "سحب";

  // 1. قيد الخزانة (صرف الدفعة المادية من السند المركزي لتقليص النقدية أو إيداعها)
  appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
    date: now(),
    desc: desc || (isWithdrawal ? `سحب مالي / تسوية عكسية من المورد: ${supplier}` : `دفعة نقدية منصرفة للمورد: ${supplier}`),
    type: isWithdrawal ? "إيداع" : "صرف مورد",
    amount: val,
    ref: supplier,
    addedBy: currentUser || "إدارة الحسابات"
  });

  // 2. قيد دفتر الأستاذ الخاص بالمورد لإعدام الدائنة أو زيادتها (خصم دائم لدائن المورد)
  appendToSheet(sheets.supplierLedger, ["supplier", "date", "type", "tracking", "amount", "desc"], {
    supplier: supplier,
    date: now(),
    type: isWithdrawal ? "سحب من المورد" : "دفعة مورد",
    tracking: "—",
    amount: -val,
    desc: desc || (isWithdrawal ? `سحب مالي / تسوية عكسية من المورد: ${supplier}` : `استلام دفعة نقدية مسواة للمورد: ${supplier}`)
  });

  // 3. تدوين الحدث الأمني المهم في سجل التدقيق المالي
  appendToSheet(sheets.auditLog, ["user", "type", "dateTime", "oldVal", "newVal", "reason"], {
    user: currentUser || "حسابات",
    type: isWithdrawal ? "سحب مالي من مورد" : "سداد مورد / دفعة نقدية",
    dateTime: now(),
    oldVal: "—",
    newVal: isWithdrawal ? `سحب مبلغ: ${val} ج.م من المورد: ${supplier}` : `صرف مبلغ: ${val} ج.م للمورد: ${supplier}`,
    reason: desc || (isWithdrawal ? `سحب مالي لتصحيح حساب المورد` : `تخليص سداد وتصفية للمورد: ${supplier}`)
  });

  return { ok: true, msg: isWithdrawal ? "تم تسجيل حركة السحب المالي العكسية بنجاح وتسويتها بالخزنة" : "تم تسجيل الدفعة النقدية بنجاح وتسويتها بالخزنة" };
}

// ───────────────────────────────────────────────
// (د) حسابات تصفية مناديب الشحن ومنع العجز (Deficit System)
// ───────────────────────────────────────────────

function getCourierLedger(sheets, d) {
  const { courier } = d;
  const ledger = getTableData(sheets.courierLedger);
  const couriers = getTableData(sheets.couriers);
  const orders = getTableData(sheets.orders);
  const cashbox = getTableData(sheets.cashbox);

  const courierObj = couriers.find(c => c.name === courier);
  
  // Calculations - using new persistent configs with backward-compatible defaults
  const basicSalary = courierObj ? Number(courierObj.base_fixed_salary !== undefined && courierObj.base_fixed_salary !== "" ? courierObj.base_fixed_salary : (courierObj.salary || 3000)) : 3000;
  const commissionSuccess = courierObj ? Number(courierObj.commission_success !== undefined && courierObj.commission_success !== "" ? courierObj.commission_success : (courierObj.commission || 25)) : 25;
  const commissionReturn = courierObj ? Number(courierObj.commission_return !== undefined && courierObj.commission_return !== "" ? courierObj.commission_return : 10) : 10;

  const courierOrders = orders.filter(o => o.courier === courier);
  const targetLedger = ledger.filter(l => l.courier === courier);

  const todayDate = nowDay();

  // Strict Courier Settlement Calculations (Today's performance):
  // 1. Delivered Cash (كاش الأوردرات المسلمة اليوم): (ثمن المنتجات + مصاريف الشحن) لجميع الأوردرات "تم التسليم" اليوم
  const todayDeliveredOrders = courierOrders.filter(o => o.status === "تم التسليم" && o.delivDate && o.delivDate.substring(0, 10) === todayDate);
  const todayDeliveredCount = todayDeliveredOrders.length;
  const todayDeliveredCash = todayDeliveredOrders.reduce((sum, o) => sum + Number(o.totalCOD || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0))), 0);

  // 2. Returned Shipping Cash (كاش شحن المرتجعات اليوم): (مصاريف الشحن فقط) لجميع الأوردرات "مرتجع مدفوع الشحن" اليوم
  const todayReturnedPaidOrders = courierOrders.filter(o => 
    (o.status === "مرتجع والعميل دفع الشحن" || o.status === "مرتجع مدفوع الشحن" || (o.status === "مرتجع" && o.returnShippingType === "paid")) && 
    o.retDate && o.retDate.substring(0, 10) === todayDate
  );
  const todayReturnedPaidCount = todayReturnedPaidOrders.length;
  const todayReturnedPaidCash = todayReturnedPaidOrders.reduce((sum, o) => sum + Number(o.shipPrice || o.shipCost || 0), 0);

  // 3. Total Commission (عمولة المندوب الكلية اليوم): (deliveredCount * successRate) + (returnedPaidCount * successRate)
  const todayTotalCommission = (todayDeliveredCount * commissionSuccess) + (todayReturnedPaidCount * commissionSuccess);

  const deliveredCount = courierOrders.filter(o => o.status === "تم التسليم").length;
  const delivCommission = deliveredCount * commissionSuccess;

  const returnedCount = courierOrders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length;
  const returnedPaidCount = courierOrders.filter(o => o.status === "مرتجع" && o.returnShippingType === "paid").length;
  const returnShippingCommission = returnedPaidCount * commissionSuccess;

  const bonusesSum = targetLedger.filter(l => l.type === "مكافأة").reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
  const penaltiesSum = targetLedger.filter(l => l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز").reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);

  // 4. Adjustments for today:
  const todayBonuses = targetLedger.filter(l => l.type === "مكافأة" && l.date && l.date.substring(0, 10) === todayDate).reduce((sum, x) => sum + Math.abs(Number(x.amount || 0)), 0);
  const todayPenalties = targetLedger.filter(l => (l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز") && l.date && l.date.substring(0, 10) === todayDate).reduce((sum, x) => sum + Math.abs(Number(x.amount || 0)), 0);

  // Final Settle Equation (الصافي المطلوب توريده للخزنة لليوم):
  const requiredHandoverToday = (todayDeliveredCash + todayReturnedPaidCash) - todayTotalCommission - todayPenalties + todayBonuses;

  const totalCollected = courierOrders.filter(o => o.status === "تم التسليم").reduce((sum, o) => sum + Number(o.totalCOD || 0), 0);
  const totalPaidToCompany = cashbox.filter(item => item.type === "استلام عهدة مندوب" && item.ref === courier).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const deficit = totalCollected - totalPaidToCompany;

  // Cumulative Daily Ledger calculations for Apps Script
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysCount = daysInCurrentMonth || 30;

  const datesSet = {};
  courierOrders.forEach(o => {
    if (o.status === "تم التسليم" && o.delivDate) {
      datesSet[o.delivDate.substring(0, 10)] = true;
    }
    if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate) {
      datesSet[o.retDate.substring(0, 10)] = true;
    }
  });

  datesSet[todayDate] = true;

  const todayDayNum = now.getDate();
  for (let dMonth = 1; dMonth <= todayDayNum; dMonth++) {
    const dateStr = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(dMonth).padStart(2, "0");
    datesSet[dateStr] = true;
  }

  const sortedDates = Object.keys(datesSet).sort();
  let runningCumulative = 0;
  const dailyEarnings = sortedDates.map(dStr => {
    const deliveredDay = courierOrders.filter(o => o.status === "تم التسليم" && o.delivDate && o.delivDate.substring(0, 10) === dStr).length;
    const returnedDay = courierOrders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && o.retDate.substring(0, 10) === dStr).length;

    const baseEarning = Number((basicSalary / daysCount).toFixed(2));
    const delivEarning = deliveredDay * commissionSuccess;
    const retEarning = returnedDay * commissionReturn;
    const total = baseEarning + delivEarning + retEarning;
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

  const netSalary = basicSalary + todayTotalCommission + bonusesSum - penaltiesSum;

  return {
    ok: true,
    ledgerInfo: {
      courierName: courier,
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
      dailyEarnings: dailyEarnings.reverse() // Sort descending
    },
    transactions: targetLedger.reverse()
  };
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

  const basicSalary = courierObj ? Number(courierObj.base_fixed_salary !== undefined && courierObj.base_fixed_salary !== "" ? courierObj.base_fixed_salary : (courierObj.salary || 3000)) : 3000;
  const commissionSuccess = courierObj ? Number(courierObj.commission_success !== undefined && courierObj.commission_success !== "" ? courierObj.commission_success : (courierObj.commission || 25)) : 25;
  const commissionReturn = courierObj ? Number(courierObj.commission_return !== undefined && courierObj.commission_return !== "" ? courierObj.commission_return : 10) : 10;

  const todayDate = nowDay();

  // Strict Courier Settlement Calculations (Today's performance):
  // 1. Delivered Cash (كاش الأوردرات المسلمة اليوم): (ثمن المنتجات + مصاريف الشحن) لجميع الأوردرات "تم التسليم" اليوم
  const todayDeliveredOrders = courierOrders.filter(o => o.status === "تم التسليم" && o.delivDate && o.delivDate.substring(0, 10) === todayDate);
  const todayDeliveredCount = todayDeliveredOrders.length;
  const todayDeliveredCash = todayDeliveredOrders.reduce((sum, o) => sum + Number(o.totalCOD || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0))), 0);

  // 2. Returned Shipping Cash (كاش شحن المرتجعات اليوم): (مصاريف الشحن فقط) لجميع الأوردرات "مرتجع مدفوع الشحن" اليوم
  const todayReturnedPaidOrders = courierOrders.filter(o => 
    (o.status === "مرتجع والعميل دفع الشحن" || o.status === "مرتجع مدفوع الشحن" || (o.status === "مرتجع" && o.returnShippingType === "paid")) && 
    o.retDate && o.retDate.substring(0, 10) === todayDate
  );
  const todayReturnedPaidCount = todayReturnedPaidOrders.length;
  const todayReturnedPaidCash = todayReturnedPaidOrders.reduce((sum, o) => sum + Number(o.shipPrice || o.shipCost || 0), 0);

  // 3. Total Commission (عمولة المندوب الكلية اليوم): (deliveredCount * successRate) + (returnedPaidCount * successRate)
  const todayTotalCommission = (todayDeliveredCount * commissionSuccess) + (todayReturnedPaidCount * commissionSuccess);

  const delivCommission = targetLedger.filter(l => l.type === "تسليم").reduce((sum, item) => sum + Number(item.amount || commissionSuccess), 0);
  const returnShippingCommission = targetLedger.filter(l => l.type === "مرتجع مدفوع الشحن").reduce((sum, item) => sum + Number(item.amount || commissionSuccess), 0);
  const bonusesSum = targetLedger.filter(l => l.type === "مكافأة").reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);
  const penaltiesSum = targetLedger.filter(l => l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز").reduce((sum, item) => sum + Math.abs(Number(item.amount || 0)), 0);

  const todayBonuses = targetLedger.filter(l => l.type === "مكافأة" && l.date && l.date.substring(0, 10) === todayDate).reduce((sum, x) => sum + Math.abs(Number(x.amount || 0)), 0);
  const todayPenalties = targetLedger.filter(l => (l.type === "جزاء" || l.type === "خصم" || l.type === "خصم عجز") && l.date && l.date.substring(0, 10) === todayDate).reduce((sum, x) => sum + Math.abs(Number(x.amount || 0)), 0);

  // Final Settle Equation (الصافي المطلوب توريده للخزنة لليوم):
  const requiredHandoverToday = (todayDeliveredCash + todayReturnedPaidCash) - todayTotalCommission - todayPenalties + todayBonuses;

  const totalCollected = courierOrders.filter(o => o.status === "تم التسليم").reduce((sum, o) => sum + Number(o.totalCOD || 0), 0);
  const totalPaidToCompany = cashbox.filter(item => item.type === "استلام عهدة مندوب" && item.ref === courierName).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const deficit = totalCollected - totalPaidToCompany;

  const netSalary = basicSalary + todayTotalCommission + bonusesSum - penaltiesSum;

  const todayDelivered = todayDeliveredCount;
  const todayDelivCommission = todayTotalCommission;
  const todayReturned = todayReturnedPaidCount;

  // Cumulative Daily Ledger calculations for Apps Script
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysCount = daysInCurrentMonth || 30;

  const datesSet = {};
  courierOrders.forEach(o => {
    if (o.status === "تم التسليم" && o.delivDate) {
      datesSet[o.delivDate.substring(0, 10)] = true;
    }
    if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate) {
      datesSet[o.retDate.substring(0, 10)] = true;
    }
  });

  datesSet[todayDate] = true;

  const todayDayNum = now.getDate();
  for (let dMonth = 1; dMonth <= todayDayNum; dMonth++) {
    const dateStr = year + "-" + String(month + 1).padStart(2, "0") + "-" + String(dMonth).padStart(2, "0");
    datesSet[dateStr] = true;
  }

  const sortedDates = Object.keys(datesSet).sort();
  let runningCumulative = 0;
  const dailyEarnings = sortedDates.map(dStr => {
    const deliveredDay = courierOrders.filter(o => o.status === "تم التسليم" && o.delivDate && o.delivDate.substring(0, 10) === dStr).length;
    const returnedDay = courierOrders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) && o.retDate && o.retDate.substring(0, 10) === dStr).length;

    const baseEarning = Number((basicSalary / daysCount).toFixed(2));
    const delivEarning = deliveredDay * commissionSuccess;
    const retEarning = returnedDay * commissionReturn;
    const total = baseEarning + delivEarning + retEarning;
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

  return {
    ok: true,
    summary: {
      courierName,
      basicSalary,
      base_fixed_salary: basicSalary,
      commission_success: commissionSuccess,
      commission_return: commissionReturn,
      deliveredCount: courierOrders.filter(o => o.status === "تم التسليم").length,
      returnedPaidCount: courierOrders.filter(o => o.status === "مرتجع" && o.returnShippingType === "paid").length,
      returnedCount: courierOrders.filter(o => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length,
      delivCommission,
      returnShippingCommission,
      bonusesSum,
      penaltiesSum,
      netSalary,
      totalCollected,
      totalPaidToCompany,
      deficit,
      todayDelivered,
      todayDelivCommission,
      todayReturned,
      todayReturnCommission: todayReturned * commissionSuccess,
      todayDeliveredCash,
      todayReturnedPaidCash,
      todayTotalCommission,
      todayPenalties,
      todayBonuses,
      requiredHandoverToday,
      dailyEarnings: dailyEarnings.reverse() // Sort descending
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
    amount: (type === "جزاء" || type === "خصم" || type === "خصم عجز" || type === "خصم عجز تلقائي") ? -val : val,
    desc: desc || `تسوية مالية يدوية من نوع ${type}`
  });

  // تسجيلها بالخزنة فوراً ليتطابق الحساب أوتوماتيكياً
  if (type === "مكافأة") {
    appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
      date: now(),
      desc: `مكافأة منصرفة للمندوب: ${courier} - ${desc || ''}`,
      type: "صرف",
      amount: val,
      ref: "BONUS",
      addedBy: currentUser || "إدارة الحسابات"
    });
  } else if (type === "جزاء" || type === "خصم" || type === "خصم عجز" || type === "خصم عجز تلقائي") {
    appendToSheet(sheets.cashbox, ["date", "desc", "type", "amount", "ref", "addedBy"], {
      date: now(),
      desc: `تسوية خصم/جزاء مستقطع للمندوب: ${courier} - ${desc || ''}`,
      type: "استلام عهدة مندوب",
      amount: val,
      ref: "PENALTY",
      addedBy: currentUser || "إدارة الحسابات"
    });
  } else if (type === "استلام تصفية") {
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

function getPermissionsForRole(role) {
  const r = (role || "").toString().trim();
  if (r === "مدير") return "كاملة";
  if (r === "مشرف" || r === "موظف عمليات") return "توزيع ومتابعة";
  if (r === "محاسب") return "خزنة وحسابات وتقارير مالية";
  if (r === "مندوب" || r.indexOf("مندوب") > -1) return "أوردرات المندوب وتحديث الحالات";
  if (r === "مورد" || r.indexOf("مورد") > -1) return "إضافة أوردرات ورفع كشوفات";
  if (r === "مسؤول مرتجعات" || r === "موظف مرتجعات" || r === "موظف مرتجعات") return "متابعة المرتجعات";
  return "متابعة حالات فقط";
}

function addUser(sheets, d) {
  return registerUser(sheets, d);
}

function registerUser(sheets, d) {
  const userContainer = d.user || {};
  const name = (userContainer.name ? userContainer.name : d.name || "").toString().trim();
  const role = (userContainer.role ? userContainer.role : d.role || "").toString().trim();
  const pass = (userContainer.pass ? userContainer.pass : d.pass || "").toString().trim();
  const active = (userContainer.active ? userContainer.active : d.active || "نعم").toString().trim();
  const email = (userContainer.email ? userContainer.email : d.email || "").toString().trim();
  let assignedPerms = userContainer.perms || d.perms || "";

  // Ensure minimal required fields are checked properly
  if (!name || !role || !pass) {
    return { ok: false, error: "اسم المستخدم، الدور الوظيفي، وكلمة المرور حقول إجبارية" };
  }

  const usersSheet = sheets.users;
  const userIndex = findRowIndex(usersSheet, "name", name);
  if (userIndex !== -1) return { ok: false, error: "اسم الحساب المدخل مسجل به مستخدم آخر مسبقاً" };

  // Auto-map permissions based on role if not provided by UI
  if (!assignedPerms) {
    if (role === "مدير") assignedPerms = "كاملة";
    else if (role === "مشرف") assignedPerms = "توزيع ومتابعة";
    else if (role === "مندوب") assignedPerms = "معاينة الشحنات والتقفيل";
    else assignedPerms = "متابعة محدودة";
  }

  // Append row safely to the unified English users layout using key mappings with appendToSheet
  appendToSheet(usersSheet, ["name", "role", "pass", "active", "email", "perms"], {
    name: name,
    role: role,
    pass: pass,
    active: active,
    email: email || "—",
    perms: assignedPerms
  });

  // Auto-generate Courier Profile if the newly created user is a Courier
  if (role === "مندوب") {
    const couriersSheet = sheets.couriers;
    if (couriersSheet) {
      const courierIndex = findRowIndex(couriersSheet, "name", name);
      if (courierIndex === -1) {
        appendToSheet(couriersSheet, ["name", "phone", "commission", "salary", "region", "base_fixed_salary", "commission_success", "commission_return"], {
          name: name,
          phone: "—",
          commission: 20,
          salary: 3000,
          region: "—",
          base_fixed_salary: 3000,
          commission_success: 20,
          commission_return: 0
        });
      }
    }
  }

  // Auto-generate Supplier Profile if the newly created user is a Supplier
  if (role === "مورد") {
    const suppliersSheet = sheets.suppliers;
    if (suppliersSheet) {
      const supplierIndex = findRowIndex(suppliersSheet, "name", name);
      if (supplierIndex === -1) {
        appendToSheet(suppliersSheet, ["name", "phone", "price", "notes"], {
          name: name,
          phone: "—",
          price: 65,
          notes: "مورد جديد"
        });
      }
    }
  }

  return { ok: true, msg: "تم إنشاء الحساب وإعداد الصلاحيات والملف المالي بنجاح" };
}

function updateUser(sheets, d) {
  let u = d.user || {};
  if (!u.name) u.name = d.name;
  if (!u.role) u.role = d.role;
  if (!u.active) u.active = d.active;
  if (!u.perms) u.perms = d.perms;

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
  const users = getTableData(sheets.users);
  const profiles = getTableData(sheets.couriers);

  const activeUsersCouriers = users.filter(function(u) {
    const role = (u.role || "").toString().trim();
    const active = (u.active || "").toString().trim();
    const name = (u.name || "").toString().trim();
    return (role === "مندوب" || role.indexOf("مندوب") > -1 || name === "عصفور") && active !== "لا";
  });

  const list = activeUsersCouriers.map(function(u) {
    const profile = profiles.find(function(c) {
      return (c.name || "").toString().trim() === (u.name || "").toString().trim();
    }) || {};

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

function updateCourier(sheets, d) {
  const { name, phone, region, base_fixed_salary, commission_success, commission_return } = d;
  if (!name) return { ok: false, error: "اسم المندوب مطلوب لتحديث البيانات" };

  const couriersSheet = sheets.couriers;
  const trimmedName = name.toString().trim();
  let courierIndex = -1;
  const lastRow = couriersSheet.getLastRow();
  if (lastRow > 1) {
    const colIndex = getHeaderIndex(couriersSheet, "name");
    if (colIndex !== -1) {
      const vals = couriersSheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
      for (let i = 0; i < vals.length; i++) {
        if (vals[i][0].toString().trim().toLowerCase() === trimmedName.toLowerCase()) {
          courierIndex = i + 2;
          break;
        }
      }
    }
  }

  const courierObj = {
    name: trimmedName,
    phone: phone || "—",
    salary: Number(base_fixed_salary !== undefined ? base_fixed_salary : 3000),
    commission: Number(commission_success !== undefined ? commission_success : 25),
    region: region || "—",
    base_fixed_salary: Number(base_fixed_salary !== undefined ? base_fixed_salary : 3000),
    commission_success: Number(commission_success !== undefined ? commission_success : 25),
    commission_return: Number(commission_return !== undefined ? commission_return : 10)
  };

  if (courierIndex === -1) {
    appendToSheet(couriersSheet, ["name", "phone", "commission", "salary", "region", "base_fixed_salary", "commission_success", "commission_return"], courierObj);
  } else {
    updateRowByObject(couriersSheet, courierIndex, courierObj);
  }

  return { ok: true, msg: "تم تحديث وحفظ بيانات المندوب بنجاح بفولدر السيستم" };
}
