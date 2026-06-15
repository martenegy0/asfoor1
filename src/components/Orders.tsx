import React, { useState, useRef } from "react";
import { Search, MapPin, Phone, MessageSquare, Check, Truck, User, Calendar, Trash2, Edit3, ShieldAlert, ArrowLeftRight, Download, FileSpreadsheet, Upload, Loader2, XCircle } from "lucide-react";
import { apiCall, toWA, toWAUrl, getOrderWAMessage, getTodayDateStr, normalizeDateToYMD } from "../utils";

interface OrdersProps {
  token: string;
  role: string;
  username: string;
  orders: any[];
  setOrders?: React.Dispatch<React.SetStateAction<any[]>>;
  couriers: any[];
  onRefresh: () => void;
}

interface SearchableCourierSelectProps {
  value: string;
  onChange: (val: string) => void;
  couriers: any[];
  placeholder?: string;
  id?: string;
  showWarehouseReset?: boolean;
}

function SearchableCourierSelect({ value, onChange, couriers, placeholder = "اختر المندوب...", id, showWarehouseReset }: SearchableCourierSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse cached list if sheets fetch fails or to avoid sheets roundtripping
  const cachedCouriers = React.useMemo(() => {
    try {
      const cached = localStorage.getItem("fp_cached_couriers");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to avoid missing newly registered items
          const merged = [...couriers];
          parsed.forEach((x: any) => {
            if (x && x.name && !merged.some(y => y.name === x.name)) {
              merged.push(x);
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // First open cache initialization
    if (couriers && couriers.length > 0) {
      localStorage.setItem("fp_cached_couriers", JSON.stringify(couriers));
    }
    return couriers;
  }, [couriers]);

  // Filter based on search query (by name or region)
  const filtered = React.useMemo(() => {
    return cachedCouriers.filter(c => 
      (c?.name || "").toString().toLowerCase().includes(search.toLowerCase()) ||
      (c?.region || "").toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [cachedCouriers, search]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCourier = cachedCouriers.find(c => c.name === value);

  return (
    <div ref={dropdownRef} className="relative w-full text-right" id={id}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-4 py-3 text-xs text-right flex items-center justify-between gap-2 min-h-[46px] cursor-pointer hover:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 transition-all font-black"
      >
        <span className="text-slate-400">▼</span>
        <span className="truncate">
          {value === "reset_warehouse" 
            ? "🔄 إعادة للمستودع (سحب من المندوب وإرجاعه طلب حر)"
            : selectedCourier 
              ? `👤 ${selectedCourier.name} (${selectedCourier.region || "شامل"})` 
              : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-full bg-slate-900 border border-white/12 rounded-2xl p-2.5 shadow-2xl z-[900] space-y-2 animate-in fade-in slide-in-from-top-1 duration-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث باسم المندوب أو المنطقة..."
            className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-3 py-2.5 text-xs text-right outline-none focus:border-amber-500/50"
            autoFocus
          />
          <div className="max-h-[180px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
            {placeholder && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-950 border border-transparent hover:border-white/4 transition-all min-h-[44px] cursor-pointer ${!value ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "text-slate-400"}`}
              >
                <span>{placeholder}</span>
              </button>
            )}
            
            {showWarehouseReset && (
              <button
                type="button"
                onClick={() => {
                  onChange("reset_warehouse");
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full text-right px-3 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all min-h-[44px] cursor-pointer ${value === "reset_warehouse" ? "bg-red-500/25 text-red-400 border-red-500/35 font-semibold" : "text-red-300"}`}
              >
                <span className="text-[9px] bg-red-950/45 text-red-405 px-1.5 py-0.5 rounded border border-red-900/30 shrink-0">إجراء جماعي</span>
                <span className="truncate font-black text-right">🔄 إعادة للمستودع (إرجاعه كأوردر حر بقائمة الانتظار)</span>
              </button>
            )}
            {filtered.length === 0 ? (
              <div className="text-center py-4 text-[10px] text-slate-500 font-extrabold">لا يوجد مناديب مطابقين للبحث</div>
            ) : (
              filtered.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    onChange(c.name);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full text-right px-3 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-950 border border-transparent hover:border-white/4 transition-all min-h-[44px] cursor-pointer ${value === c.name ? "bg-amber-500/10 text-amber-500 border-amber-500/20 font-black" : "text-slate-300"}`}
                >
                  <span className="text-[10px] text-slate-550 font-normal bg-slate-950 px-2 py-0.5 rounded border border-white/4 shrink-0">
                    {c.region || "شامل"}
                  </span>
                  <span className="truncate font-black">{c.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Orders({ token, role, username, orders, setOrders, couriers, onRefresh }: OrdersProps) {
  const [pendingTrackings, setPendingTrackings] = useState<Set<string>>(new Set());
  const isAdmin = (role || "").toString().trim() === "مدير" || (role || "").toString().trim().includes("مدير");
  const isSuper = (role || "").toString().trim() === "مشرف" || (role || "").toString().trim().includes("مشرف");
  const isOps = (role || "").toString().trim() === "موظف عمليات" || (role || "").toString().trim().includes("عمليات");
  const isAgent = (role || "").toString().trim() === "مندوب" || (role || "").toString().trim().includes("مندوب");
  const isSupplier = (role || "").toString().trim() === "مورد" || (role || "").toString().trim().includes("مورد");
  const isReturnsOfficer = (role || "").toString().trim() === "مسؤول مرتجعات" || (role || "").toString().trim().includes("مرتجعات");
  
  const canManage = isAdmin || isSuper;
  const canSelectBulk = isAdmin || isSuper || isOps || isAgent || isReturnsOfficer;

  // --- Courier specifications for dynamic calculations ---
  const currentCourierProfile = couriers.find((c: any) => c.name === username);
  const basicSalary = currentCourierProfile ? Number(currentCourierProfile.salary || 3000) : 3000;
  const rawCommission = currentCourierProfile ? Number(currentCourierProfile.commission || 25) : 25;

  const [courierExpenses, setCourierExpenses] = useState<number>(0);

  React.useEffect(() => {
    if (isAgent) {
      apiCall("expenses", token).then((res) => {
        if (res && res.ok && res.expenses) {
          const todayYMD = getTodayDateStr();
          const todaySum = res.expenses
            .filter((e: any) => e.dateTime && e.dateTime.substring(0, 10) === todayYMD)
            .reduce((sum: number, e: any) => sum + Number(e.amount || 0), 0);
          setCourierExpenses(todaySum);
        }
      });
    }
  }, [token, isAgent, orders]);

  const todayDateStr = getTodayDateStr();

  const roleFilteredOrders = React.useMemo(() => {
    if (isAgent || isReturnsOfficer || isOps) {
      return orders.filter((o: any) => {
        const orderDateYMD = normalizeDateToYMD(o.orderDate || o.createdAt);
        const updateDateYMD = o.updatedAt ? normalizeDateToYMD(o.updatedAt) : "";
        const delivDateYMD = o.delivDate ? normalizeDateToYMD(o.delivDate) : "";
        const retDateYMD = o.retDate ? normalizeDateToYMD(o.retDate) : "";
        const isClosedStatus = o.isClosed || ["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع والعميل دفع الشحن", "مرتجع مدفوع الشحن"].includes(o.status);
        
        if (isClosedStatus) {
          const completedToday = (delivDateYMD === todayDateStr) || (retDateYMD === todayDateStr) || (updateDateYMD === todayDateStr);
          if (!completedToday) return false;
        }
        
        const activeOrUpdatedToday = (orderDateYMD === todayDateStr) || (updateDateYMD === todayDateStr) || !isClosedStatus;
        return activeOrUpdatedToday;
      });
    }
    return orders;
  }, [orders, isAgent, isReturnsOfficer, isOps, todayDateStr]);

  const todayDeliveredOrders = roleFilteredOrders.filter((o: any) => {
    const isMyDeliv = o.courier === username && o.status === "تم التسليم";
    if (!isMyDeliv) return false;
    const isDelivToday = o.delivDate && normalizeDateToYMD(o.delivDate) === todayDateStr;
    const isUpdatedToday = o.updatedAt && normalizeDateToYMD(o.updatedAt) === todayDateStr;
    return isDelivToday || isUpdatedToday;
  });
  const todayDeliveredCount = todayDeliveredOrders.length;
  const todayCommissions = todayDeliveredCount * rawCommission;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateStr());
  const [displayLimit, setDisplayLimit] = useState<number>(25);
  const [courierConfirmModal, setCourierConfirmModal] = useState<{
    tracking: string;
    status: string;
    title: string;
  } | null>(null);

  React.useEffect(() => {
    setDisplayLimit(25);
  }, [search, activeFilter, selectedDate]);

  const lastDays = React.useMemo(() => {
    const days = [];
    const todayStr = getTodayDateStr(); // e.g. "2026-06-12"
    const todayDate = new Date(todayStr);

    for (let i = 0; i < 7; i++) {
      const d = new Date(todayDate);
      d.setDate(todayDate.getDate() - i);
      const pad = (n: number) => n.toString().padStart(2, "0");
      const ymd = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      
      let label = "";
      if (i === 0) {
        label = "اليوم";
      } else if (i === 1) {
        label = "أمس";
      } else {
        const weekdays = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
        label = `${weekdays[d.getDay()]} ${d.getDate()}`;
      }
      days.push({ ymd, label, dayNum: d.getDate() });
    }
    return days;
  }, []);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  // --- Modals States ---
  const [editOrder, setEditOrder] = useState<any>(null);
  const [confirmingStatus, setConfirmingStatus] = useState<{ tracking: string; status: string } | null>(null);
  const [returnedSelectOpen, setReturnedSelectOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any>(null);

  // --- Ops Officer Call states ---
  const [opsUpdatingCall, setOpsUpdatingCall] = useState<{ [tracking: string]: boolean }>({});
  const [opsNotes, setOpsNotes] = useState<{ [tracking: string]: string }>({});
  const [opsDate, setOpsDate] = useState<{ [tracking: string]: string }>({});
  
  // --- Bulk updates states ---
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkCourier, setBulkCourier] = useState("");

  // --- New Floating Action Bar States ---
  const [floatingStatus, setFloatingStatus] = useState("");
  const [floatingNotes, setFloatingNotes] = useState("");
  const [floatingDate, setFloatingDate] = useState("");
  const [floatingCourier, setFloatingCourier] = useState("");
  const [floatingSubmitting, setFloatingSubmitting] = useState(false);

  // --- Quick Reconciliation Portal States ---
  const [showReconPortal, setShowReconPortal] = useState(false);
  const [reconcileBarcode, setReconcileBarcode] = useState("");
  const [reconcileStatus, setReconcileStatus] = useState("تم التسليم");
  const [reconLoading, setReconLoading] = useState(false);
  const [reconFeedback, setReconFeedback] = useState("");
  const [reconExcelMsg, setReconExcelMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canReconcile = isAdmin || isSuper || isReturnsOfficer || (role || "").toString().includes("محاسب");

  async function handleSingleReconciliation() {
    if (!reconcileBarcode.trim()) {
      alert("يرجى إدخال أو قراءة كود كشف التتبع أولاً");
      return;
    }
    const targetTracking = reconcileBarcode.trim().toUpperCase();
    setReconLoading(true);
    setReconFeedback("");

    // --- OPTIMISTIC FE BACKUP ---
    const nowEgyptStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updatedFields: any = {
      status: reconcileStatus,
      updatedAt: nowEgyptStr
    };
    if (reconcileStatus === "تم التسليم") {
      updatedFields.delivDate = nowEgyptStr;
    }

    if (setOrders) {
      setOrders(prev => {
        const next = prev.map(o => o.tracking === targetTracking ? { ...o, ...updatedFields } : o);
        localStorage.setItem("fp_cached_orders", JSON.stringify(next));
        return next;
      });
    }

    setReconcileBarcode("");
    setReconFeedback(`⚡ تم التحديث محلياً وجاري المزامنة في الخلفية...`);

    // --- BG API CALL ---
    apiCall("updateStatus", token, {
      tracking: targetTracking,
      status: reconcileStatus,
      reason: `تصفية سريعة عبر بوابة الباركود بالواجهة`
    }).then(res => {
      if (res && res.ok) {
        setReconFeedback(`✅ نجح تحديث الأوردر ${targetTracking} إلى [${reconcileStatus}]`);
        onRefresh();
      } else {
        setReconFeedback(`⚠️ تنبيه: فشل مزامنة الخادم لـ ${targetTracking} (${res?.error})`);
        onRefresh();
      }
    }).catch(err => {
      setReconFeedback(`⚠️ خطأ بالشبكة أثناء مزامنة ${targetTracking}`);
      onRefresh();
    }).finally(() => {
      setReconLoading(false);
    });
  }

  function handleReconExcelUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length <= 1) {
        alert("الملف فارغ أو لا يحتوي على صفوف تتبع صحيحة");
        return;
      }
      
      const parsedTrackings: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        const row = lines[i];
        if (i === 0 && (row.toLowerCase().includes("tracking") || row.toLowerCase().includes("barcode") || row.includes("تتبع"))) {
          continue;
        }
        const cols = row.split(",");
        const tr = cols[0].replace(/["']/g, "").trim();
        if (tr) parsedTrackings.push(tr.toUpperCase());
      }

      if (parsedTrackings.length === 0) {
        alert("لم يتم العثور على أي أكواد تتبع صالحة بالملف");
        return;
      }

      setReconExcelMsg(`✅ تم استخراج ${parsedTrackings.length} كود تتبع جاهزة للتحديث الجماعي إلى [${reconcileStatus}]`);
      
      if (confirm(`هل أنت متأكد من رغبتك في تحديث ${parsedTrackings.length} أوردر دفعة واحدة إلى [${reconcileStatus}]؟`)) {
        setReconLoading(true);
        setReconFeedback("");

        // --- OPTIMISTIC BULK UPDATE ---
        const nowEgyptStr = new Date().toISOString().replace("T", " ").substring(0, 16);
        const updatedFields: any = {
          status: reconcileStatus,
          updatedAt: nowEgyptStr
        };
        if (reconcileStatus === "تم التسليم") {
          updatedFields.delivDate = nowEgyptStr;
        }

        if (setOrders) {
          setOrders(prev => {
            const next = prev.map(o => parsedTrackings.includes(o.tracking) ? { ...o, ...updatedFields } : o);
            localStorage.setItem("fp_cached_orders", JSON.stringify(next));
            return next;
          });
        }

        setReconFeedback(`⚡ تم التصفية المحلية لـ ${parsedTrackings.length} أوردر وجاري ترحيل التعديلات للخلفية...`);

        // --- API CALL ---
        try {
          const updatesList = parsedTrackings.map((tr) => ({
            tracking: tr,
            status: reconcileStatus
          }));
          const res = await apiCall("updateOrdersStatusBulk", token, {
            updates: updatesList
          });
          if (res && res.ok) {
            setReconFeedback(`⚡ نجح الارتجاع والتصفية لـ ${res.done} أوردر بنجاح تام!`);
            setReconExcelMsg("");
            if (fileInputRef.current) fileInputRef.current.value = "";
            onRefresh();
          } else {
            setReconFeedback(`⚠️ فشلت المزامنة الكلية للخلفية: ${res?.error}`);
            onRefresh();
          }
        } catch (err) {
          setReconFeedback("حدث خطأ أثناء الاتصال بالخادم للتصفية الجماعية ولكن تم التعديل محلياً");
          onRefresh();
        } finally {
          setReconLoading(false);
        }
      }
    };
    reader.readAsText(file);
  }

  const EgyptGovs = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية", "كفر الشيخ", "الغربية", "المنوفية",
    "البحيرة", "الإسماعيلية", "بور سعيد", "السويس", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
    "البحر الأحمر", "شمال سيناء", "جنوب سيناء", "مطروح", "الوادي الجديد", "بني سويف", "الفيوم"
  ];

  // Filters mapping
  const visibleOrders = React.useMemo(() => {
    return roleFilteredOrders
      .filter((o) => {
        // Strict role-based filter safety enforcement
        if (isAgent) {
          if (!o.courier || o.courier.toString().trim().toLowerCase() !== username.trim().toLowerCase()) return false;
          // Exclude delayed / unanswered hold-ups from the main "all" tab list
          if (activeFilter === "all" && ["مؤجل", "لا يوجد رد", "العميل لم يقم بالرد"].includes(o.status)) {
            return false;
          }
        } else if (isSupplier) {
          if (!o.supplier || o.supplier.toString().trim().toLowerCase() !== username.trim().toLowerCase()) return false;
        } else if (isReturnsOfficer) {
          const isRet = ["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) || o.returnQueueStatus;
          if (!isRet) return false;
        }

        // Logistic Status Categorization & Fallback mapping
        if (activeFilter !== "all") {
          const status = (o.status || "").toString().trim();
          if (activeFilter === "جديد" && status !== "جديد") return false;
          if (activeFilter === "مسند" && !["تم الإسناد", "مسند", "تم الاسناد"].includes(status)) return false;
          if (activeFilter === "خارج للتسليم" && !["خارج مع المندوب", "خارج للتسليم", "خارج للتوصيل", "مع المندوب"].includes(status)) return false;
          if (activeFilter === "تم التسليم" && !["تم التسليم", "تم التسليم بنجاح", "تم التسليم (ناجح كاش)"].includes(status)) return false;
          if (activeFilter === "العميل رد وجاري التسليم" && !["تم رد العميل وجاري التنسيق", "العميل رد وجاري التسليم", "تم رد العميل وجاري التنسيق"].includes(status) && !status.includes("رد وجاري")) return false;
          if (activeFilter === "مرتجع بالمستودع" && !["مرتجع بالمستودع", "مرتجع", "مرتجع جديد", "مرتجع جاري تسليمه للمكتب"].includes(status)) return false;
          if (activeFilter === "تم تسليم المرتجع للمورد" && !["تم تسليم المرتجع للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه", "جاري الرجوع للمورد"].includes(status)) return false;
          
          // Non-standard fallback filter matching
          if (!["جديد", "مسند", "خارج للتسليم", "تم التسليم", "العميل رد وجاري التسليم", "مرتجع بالمستودع", "تم تسليم المرتجع للمورد"].includes(activeFilter)) {
            if (status !== activeFilter) return false;
          }
        }

        // Dynamic Date Filter - Filter by orderDate (or fallback to createdAt) matching selectedDateYMD
        if (selectedDate !== "all") {
          const orderDayStr = normalizeDateToYMD(o.orderDate || o.createdAt);
          if (orderDayStr !== selectedDate) return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase().trim();
          return [
            o.tracking,
            o.customer,
            o.supplier,
            o.courier,
            o.phone,
            o.gov,
            o.region,
            o.address,
            o.notes,
            o.returnQueueStatus,
            o.customerId,
            o.customerCode,
            o.clientCode,
            o.customer_id,
            o.clientId
          ].some(field => field && field.toString().toLowerCase().includes(q));
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a.createdAt || "";
        const valB = b.createdAt || "";
        if (valA && valB) {
          const cmp = valB.localeCompare(valA);
          if (cmp !== 0) return cmp;
        }
        // Fallback
        const timeA = valA ? new Date(valA.replace(" ", "T")).getTime() : 0;
        const timeB = valB ? new Date(valB.replace(" ", "T")).getTime() : 0;
        return timeB - timeA;
      });
  }, [roleFilteredOrders, isAgent, username, activeFilter, isSupplier, isReturnsOfficer, selectedDate, search]);

  // Today's hold-ups / suspended orders ("معلقات اليوم") for agent/courier view
  const suspendedOrders = React.useMemo(() => {
    if (!isAgent) return [];
    return roleFilteredOrders.filter((o) => {
      if (!o.courier || o.courier.toString().trim().toLowerCase() !== username.trim().toLowerCase()) return false;
      const isSuspended = ["مؤجل", "لا يوجد رد", "العميل لم يقم بالرد"].includes(o.status);
      if (!isSuspended) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return [o.tracking, o.supplier, o.courier, o.customer, o.phone, o.gov, o.region, o.address, o.notes, o.returnQueueStatus]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }
      return true;
    });
  }, [isAgent, roleFilteredOrders, username, search]);

  function toggleSelect(tracking: string) {
    const next = new Set(selected);
    if (next.has(tracking)) next.delete(tracking);
    else next.add(tracking);
    setSelected(next);
  }

  function toggleSelectAll() {
    if (selected.size === visibleOrders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visibleOrders.map((o) => o.tracking)));
    }
  }

  const exportToCSV = () => {
    const dateStr = new Date().toISOString().substring(0, 10);
    const filename = `الطلبات-${dateStr}`;

    const headers = [
      "رقم الشحنة",
      "العميل",
      "الهاتف",
      "الهاتف 2",
      "المحافظة",
      "المنطقة",
      "العنوان",
      "سعر المنتج",
      "سعر الشحن",
      "إجمالي التحصيل",
      "المورد",
      "المندوب",
      "الحالة",
      "ملاحظات",
      "تاريخ الإنشاء"
    ];

    const BOM = "\uFEFF";
    const csvContent = [
      headers.join(","),
      ...visibleOrders.map(o => {
        const totalCOD = o.totalCOD !== undefined ? o.totalCOD : (Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
        
        const row = [
          o.tracking || "",
          o.customer || "",
          o.phone || "",
          o.phone2 || "",
          o.gov || "",
          o.region || "",
          o.address || "",
          o.prodPrice || 0,
          o.shipPrice || 0,
          totalCOD,
          o.supplier || "",
          o.courier || "",
          o.status || "",
          o.notes || "",
          o.createdAt || ""
        ];

        return row.map(val => {
          const stringVal = typeof val === "string" ? val.replace(/"/g, '""') : String(val);
          return stringVal.includes(",") || stringVal.includes("\n") || stringVal.includes('"') 
            ? `"${stringVal}"` 
            : stringVal;
        }).join(",");
      })
    ].join("\n");

    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Actions ---
  async function triggerStatusUpdate(tracking: string, status: string, returnShippingType = "", notes = "", delivDate = "") {
    // If order was marked as 'مرتجع' and no shipping type chosen, open dialog (Third Point Fix!)
    if (status === "مرتجع" && !returnShippingType) {
      const ordObj = orders.find((o) => o.tracking === tracking);
      setSelectedReturnOrder(ordObj);
      setReturnedSelectOpen(true);
      return;
    }

    // Add to pending status changes to disable repeating clicks visually
    if (!isAgent) {
      setPendingTrackings((prev) => {
        const next = new Set(prev);
        next.add(tracking);
        return next;
      });
    } else {
      // For agents (couriers), let them feel instantaneous 100ms reaction time with zero blocking
      setPendingTrackings((prev) => {
        const next = new Set(prev);
        next.add(tracking);
        return next;
      });
      setTimeout(() => {
        setPendingTrackings((prev) => {
          const next = new Set(prev);
          next.delete(tracking);
          return next;
        });
      }, 100);
    }

    // --- OPTIMISTIC UI UPDATE ---
    const nowEgyptStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updatedFields: any = {
      status,
      updatedAt: nowEgyptStr,
    };
    if (notes) updatedFields.notes = notes;
    if (delivDate) updatedFields.delivDate = delivDate;

    if (status === "تم التسليم") {
      updatedFields.delivDate = delivDate || nowEgyptStr;
    } else if (["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد"].includes(status)) {
      updatedFields.retDate = nowEgyptStr;
    }
    if (returnShippingType) {
      updatedFields.returnShippingType = returnShippingType;
    }

    if (["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(status)) {
      updatedFields.returnQueueStatus = status;
    }

    if (setOrders) {
      setOrders((prev) => {
        const next = prev.map((o) => (o.tracking === tracking ? { ...o, ...updatedFields } : o));
        localStorage.setItem("fp_cached_orders", JSON.stringify(next));
        return next;
      });
    }

    // Instantly close dialogs & reset multi selection to stay super slick
    setReturnedSelectOpen(false);
    setConfirmingStatus(null);
    setSelected(new Set());

    // --- BG API CALL ---
    apiCall("updateStatus", token, {
      tracking,
      status,
      returnShippingType,
      notes,
      delivDate,
    })
      .then((res) => {
        if (res && res.ok) {
          console.log(`Successfully synced status of ${tracking} to [${status}] in BG`);
          if (!isAgent) {
            onRefresh();
          }
        } else {
          if (!isAgent) {
            alert(`⚠️ عطل مزامنة: فشل تحديث حالة الأوردر ${tracking} على السيرفر: ${res?.error || "خطأ غير معروف"}`);
            onRefresh();
          } else {
            console.error(`Courier BG sync issue for ${tracking}: ${res?.error}`);
          }
        }
      })
      .catch((err) => {
        console.error("BG sync error", err);
        if (!isAgent) {
          onRefresh();
        }
      })
      .finally(() => {
        if (!isAgent) {
          setPendingTrackings((prev) => {
            const next = new Set(prev);
            next.delete(tracking);
            return next;
          });
        }
      });
  }

  // Admin edit order detail saver
  async function saveAdminEdits(e: React.FormEvent) {
    e.preventDefault();
    if (!editOrder) return;
    const tracking = editOrder.tracking;
    const nowEgyptStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const adminFields = {
      customer: editOrder.customer,
      phone: editOrder.phone,
      phone2: editOrder.phone2,
      gov: editOrder.gov,
      region: editOrder.region,
      address: editOrder.address,
      prodPrice: Number(editOrder.prodPrice),
      shipPrice: Number(editOrder.shipPrice),
      courier: editOrder.courier,
      prodType: editOrder.prodType || "",
      notes: editOrder.notes,
      updatedAt: nowEgyptStr,
    };

    // --- OPTIMISTIC UI ---
    if (setOrders) {
      setOrders((prev) => {
        const next = prev.map((o) => (o.tracking === tracking ? { ...o, ...adminFields } : o));
        localStorage.setItem("fp_cached_orders", JSON.stringify(next));
        return next;
      });
    }

    setEditOrder(null);
    alert("⚡ تم الحفظ والتعديل محلياً فورا! جاري التحديث ومزامنة جوجل شيت في الخلفية...");

    // --- BG API CALL ---
    apiCall("updateOrder", token, {
      tracking,
      order: adminFields,
    })
      .then((res) => {
        if (res && res.ok) {
          console.log(`Successfully synced edit updates for ${tracking}`);
          onRefresh();
        } else {
          alert("⚠️ فشل الترحيل بالخلفية لـ " + tracking + ": " + res?.error);
          onRefresh();
        }
      })
      .catch((err) => {
        console.error("BG saveAdminEdits error", err);
        onRefresh();
      });
  }

  async function deleteOrderDirect(tracking: string) {
    if (!confirm(`⚠️ هل تريد حذف الأوردر ${tracking} نهائياً؟ \n\nلا يمكن التراجع عن هذه العملية وسيتم حذف سجلات حسابات المورد المرتبطة به.`)) {
      return;
    }

    // --- OPTIMISTIC UI ---
    if (setOrders) {
      setOrders((prev) => {
        const next = prev.filter((o) => o.tracking !== tracking);
        localStorage.setItem("fp_cached_orders", JSON.stringify(next));
        return next;
      });
    }

    setEditOrder(null);
    alert("🗑 تم الحذف محلياً فورا! جاري الترحيل النهائي للخادم في الخلفية...");

    // --- BG API CALL ---
    apiCall("deleteOrder", token, { tracking })
      .then((res) => {
        if (res && res.ok) {
          console.log(`Successfully synced delete of ${tracking}`);
          onRefresh();
        } else {
          alert("⚠️ فشلت حركة حذف الأوردر بالخلفية: " + res?.error);
          onRefresh();
        }
      })
      .catch((err) => {
        console.error("BG delete order error", err);
        onRefresh();
      });
  }

  // Bulk Manifest batch updates (Supervisor and Admin)
  async function saveBulkUpdate() {
    if (!bulkStatus && !bulkCourier) {
      alert("يرجى تحديد حالة أو مندوب للتوزيع الجماعي");
      return;
    }

    const trackingsToUpdate = Array.from(selected);
    const nowEgyptStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    // Add all of these to pending trackings
    setPendingTrackings((prev) => {
      const next = new Set(prev);
      trackingsToUpdate.forEach((t) => next.add(t));
      return next;
    });

    // --- OPTIMISTIC UI ---
    const updatedFields: any = {
      updatedAt: nowEgyptStr,
    };
    if (bulkStatus) updatedFields.status = bulkStatus;
    if (bulkCourier) {
      if (bulkCourier === "reset_warehouse") {
        updatedFields.courier = "";
        updatedFields.commission = 0;
        updatedFields.status = "جديد";
      } else {
        updatedFields.courier = bulkCourier;
      }
    }

    if (setOrders) {
      setOrders((prev) => {
        const next = prev.map((o) => (trackingsToUpdate.includes(o.tracking) ? { ...o, ...updatedFields } : o));
        localStorage.setItem("fp_cached_orders", JSON.stringify(next));
        return next;
      });
    }

    setBulkModalOpen(false);
    setBulkStatus("");
    setBulkCourier("");
    setSelected(new Set());

    alert(`⚡ تم إسناد وتعديل ${trackingsToUpdate.length} أوردر محلياً فورا، جاري التوزيع في الخلفية...`);

    // --- BG API CALL ---
    const updatesList = trackingsToUpdate.map((tr) => ({
      tracking: tr,
      status: bulkStatus || undefined,
      courier: bulkCourier || undefined,
    }));
    apiCall("updateOrdersStatusBulk", token, {
      updates: updatesList,
    })
      .then((res) => {
        if (res && res.ok) {
          console.log(`Bulk sync completed successfully for ${res.done} orders`);
          onRefresh();
        } else {
          alert(`⚠️ عطل مزامنة جماعية: ${res?.error}`);
          onRefresh();
        }
      })
      .catch((err) => {
        console.error("BG bulk sync error", err);
        onRefresh();
      })
      .finally(() => {
        setPendingTrackings((prev) => {
          const next = new Set(prev);
          trackingsToUpdate.forEach((t) => next.delete(t));
          return next;
        });
      });
  }

  // Floating Action Bar Role-Based Bulk updates
  async function saveFloatingBulkUpdate() {
    if (!floatingStatus && !floatingCourier && !floatingNotes && !floatingDate) {
      alert("يرجى اختيار حالة أو مندوب أو إدخال ملاحظات وتاريخ التحديث");
      return;
    }

    const trackingsToUpdate = Array.from(selected);
    const nowEgyptStr = new Date().toISOString().replace("T", " ").substring(0, 16);

    setPendingTrackings((prev) => {
      const next = new Set(prev);
      trackingsToUpdate.forEach((t) => next.add(t));
      return next;
    });

    // --- OPTIMISTIC UI ---
    const updatedFields: any = {
      updatedAt: nowEgyptStr,
    };
    if (floatingStatus) {
      let mapped = floatingStatus;
      if (mapped === "تم التسليم بنجاح") mapped = "تم التسليم";
      if (mapped === "مؤجل بناءً على طلب العميل") mapped = "مؤجل";
      if (mapped === "تم تسليم المرتجع للمورد وتصفية حسابه") mapped = "تم تسليم المرتجع للمورد";
      updatedFields.status = mapped;
    }
    if (floatingNotes) {
      updatedFields.notes = floatingNotes;
    }
    if (floatingDate) {
      updatedFields.delivDate = floatingDate;
    }
    if (floatingCourier) {
      if (floatingCourier === "reset_warehouse") {
        updatedFields.courier = "";
        updatedFields.commission = 0;
        updatedFields.status = "جديد";
      } else {
        updatedFields.courier = floatingCourier;
      }
    }

    if (setOrders) {
      setOrders((prev) => {
        const next = prev.map((o) => (trackingsToUpdate.includes(o.tracking) ? { ...o, ...updatedFields } : o));
        localStorage.setItem("fp_cached_orders", JSON.stringify(next));
        return next;
      });
    }

    setFloatingStatus("");
    setFloatingCourier("");
    setFloatingNotes("");
    setFloatingDate("");
    setSelected(new Set());

    alert(`⚡ جاري إرسال ومزامنة التعديل الجماعي لـ ${trackingsToUpdate.length} شحنات...`);

    // --- BG API CALL ---
    const updatesList = trackingsToUpdate.map((tr) => ({
      tracking: tr,
      status: floatingStatus || undefined,
      courier: floatingCourier || undefined,
      notes: floatingNotes || undefined,
      date: floatingDate || undefined,
    }));
    apiCall("updateOrdersStatusBulk", token, {
      updates: updatesList,
    })
      .then((res) => {
        if (res && res.ok) {
          console.log(`Floating bulk update success for ${res.done} orders`);
          onRefresh();
        } else {
          alert(`⚠️ خطأ في حفظ التحديث الجماعي: ${res?.error || "صلاحيات غير كافية"}`);
          onRefresh();
        }
      })
      .catch((err) => {
        console.error("Floating bulk sync error", err);
        onRefresh();
      })
      .finally(() => {
        setPendingTrackings((prev) => {
          const next = new Set(prev);
          trackingsToUpdate.forEach((t) => next.delete(t));
          return next;
        });
      });
  }

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "جديد": return "bg-blue-950/40 text-blue-400 border border-blue-900/30";
      case "تم الإسناد": return "bg-indigo-950/40 text-indigo-400 border border-indigo-900/30";
      case "خارج مع المندوب": return "bg-amber-950/40 text-amber-500 border border-amber-900/30";
      case "تم التسليم": return "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30";
      case "مرتجع": return "bg-red-950/40 text-red-450 border border-red-900/30";
      case "مؤجل": return "bg-orange-950/40 text-orange-400 border border-orange-900/30";
      case "لا يوجد رد": return "bg-slate-900/80 text-slate-400 border border-slate-700/30";
      case "التسليم للمورد": return "bg-rose-950/20 text-rose-450 border border-rose-900/30";
      case "تم تسليم المرتجع للمورد": return "bg-purple-950/20 text-purple-400 border border-purple-900/30";
      default: return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  const renderOrderCard = (o: any) => {
    const isSel = selected.has(o.tracking);
    const statusType = (o.status || "").toString();
    let cardBorderStyle = "border-slate-700/80";
    let cardBgClass = "bg-slate-900/95";
    
    if (statusType === "تم التسليم") {
      cardBorderStyle = "border-r-4 border-r-emerald-500 border-y-slate-700/70 border-l-slate-700/70";
      cardBgClass = "bg-emerald-950/10";
    } else if (statusType.includes("مرتجع")) {
      cardBorderStyle = "border-r-4 border-r-red-500 border-y-slate-700/70 border-l-slate-700/70";
      cardBgClass = "bg-red-950/15";
    } else if (
      statusType.includes("تجهيز") || 
      statusType.includes("شحن") || 
      statusType === "جديد" || 
      statusType === "تم الإسناد" ||
      statusType === "خارج مع المندوب"
    ) {
      cardBorderStyle = "border-r-4 border-r-amber-500 border-y-slate-700/70 border-l-slate-700/70";
      cardBgClass = "bg-amber-950/10";
    }

    return (
      <div
        key={o.tracking}
        className={`border shadow-sm rounded-xl p-5 mb-4 relative transition-all ${cardBgClass} ${cardBorderStyle} ${
          isSel ? "ring-2 ring-amber-500/10" : ""
        }`}
      >
        {/* Header components */}
        <div className="flex items-start justify-between border-b border-white/4 pb-3">
          <div className="flex items-center gap-3">
            {canSelectBulk && (
              <input
                type="checkbox"
                checked={isSel}
                onChange={() => toggleSelect(o.tracking)}
                className="w-4 h-4 rounded border-white/10 bg-slate-950 text-amber-500 accent-amber-500 cursor-pointer"
              />
            )}
            <div>
              <div className="text-sm font-black text-amber-500 tracking-wider flex items-center gap-2">
                <span>{o.tracking}</span>
                {/* Edit & Delete panels inline with Tracking ID to prevent overlaps */}
                {isAdmin && (
                  <div className="flex gap-1 mr-2 font-sans">
                    <button
                      onClick={() => setEditOrder(o)}
                      className="p-1 px-1.5 bg-slate-950 text-indigo-400 hover:text-indigo-200 rounded-md border border-white/6 cursor-pointer"
                      title="تعديل الأوردر"
                    >
                      <Edit3 size={11} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف الشحنة كلياً؟ ${o.tracking}`)) {
                          apiCall("deleteOrder", token, { tracking: o.tracking }).then((res) => {
                            if (res.ok) onRefresh();
                            else alert("فشل الحذف: " + res.error);
                          });
                        }
                      }}
                      className="p-1 px-1.5 bg-slate-950 text-red-400 hover:text-red-200 rounded-md border border-white/6 cursor-pointer"
                      title="حذف الأوردر"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5 font-mono">
                {o.createdAt.substring(0, 10)} {o.supplier && `· ${o.supplier}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {o.returnShippingType && (
              <span className="text-[8.5px] font-black bg-purple-950 text-purple-400 border border-purple-900/30 px-1.5 py-0.5 rounded">
                شحن مرتجع: {o.returnShippingType === "paid" ? "مدفوع بالكامل" : "غير مدفوع"}
              </span>
            )}
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${getBadgeStyle(o.status)}`}>
              {o.status}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-300 mt-3">
          <div className="space-y-1.5 col-span-1">
            <div className="flex items-center gap-2 font-black text-slate-200">
              <User size={13} className="text-slate-500 shrink-0" />
              <span>العميل: {o.customer || "مجهول الاسم"}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-slate-200">
              <Phone size={13} className="text-emerald-500 shrink-0" />
              <span>الهاتف: {o.phone || "—"} {o.phone2 ? `· ${o.phone2}` : ""}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t md:border-t-0 md:border-r border-white/4 pt-3.5 md:pt-0 md:pr-3.5 flex flex-col justify-between col-span-1">
            <div className="flex items-start gap-1.5">
              <MapPin size={13} className="text-slate-500 mt-0.5 shrink-0" />
              <span className="text-xs">العنوان: <span className="font-bold text-slate-200">{o.gov} · {o.region} · {o.address}</span></span>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.gov} ${o.region} ${o.address}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/30 text-indigo-300 font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition active:scale-95 cursor-pointer max-w-fit mt-1"
            >
              <MapPin size={11} className="text-indigo-400 shrink-0" />
              <span>توجيه الخرائط GPS</span>
            </a>
          </div>
        </div>

        {/* Settle info */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/4 mt-3">
          <div className="text-slate-300 flex items-center gap-2">
            <span className="text-sm font-mono shrink-0">💵</span>
            <span>إجمالي التحصيل المستحق: <span className="text-sm font-black text-emerald-400 font-mono">{(o.totalCOD || o.prodPrice || 0).toLocaleString("ar")} ج.م</span></span>
          </div>
          <span className="text-[9px] text-slate-500 font-bold font-mono">
            منتج: {o.prodPrice} · شحن: {o.shipPrice}
          </span>
        </div>

        {/* Hide or show sensitive courier assignments */}
        {!isSupplier && o.courier && (
          <div className="flex items-center gap-2 text-slate-300 border-t border-white/4 pt-2 mt-2">
            <Truck size={14} className="text-slate-500 shrink-0" />
            <span>المندوب: <span className="font-bold text-indigo-400">{o.courier}</span></span>
          </div>
        )}

        {o.notes && (
          <div className="p-2.5 bg-slate-950/40 rounded-xl text-[11px] text-slate-400 border border-white/4 leading-relaxed mt-2">
            💬 <span className="font-bold">ملاحظات:</span> {o.notes}
          </div>
        )}

        {o.returnQueueStatus && (
          <div className="p-3 bg-purple-950/10 border border-purple-900/30 rounded-xl text-[11px] text-purple-300 flex items-center justify-between mt-2">
            <span className="font-semibold flex items-center gap-1.5">
              <ArrowLeftRight size={13} className="shrink-0" />
              قائمة المرتجع: <span className="font-black underline">{o.returnQueueStatus}</span>
            </span>
            <span>مسؤول المتابعة: <span className="font-bold underline">{o.returnQueueAgent || "لم يعين"}</span></span>
          </div>
        )}

        {isOps && (
          <div className="col-span-1 md:col-span-2 bg-[#0a1128] p-4 rounded-xl border border-indigo-500/30 text-right space-y-3" dir="rtl">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <span className="text-sm">🎧</span>
              <span className="text-xs font-black">لوحة متابعة موظف العمليات والاتصال:</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold">تسجيل نتيجة المكالمة التفصيلية:</span>
                <textarea
                  id={`notes-input-${o.tracking}`}
                  defaultValue={o.notes || ""}
                  placeholder="شرح تواصل العميل، رغبته، أو تفاصيل المتابعة الحالية..."
                  className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-2 focus:border-indigo-500 font-medium h-16 resize-none w-full"
                />
              </div>

              <div className="flex flex-col gap-2 justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold">تاريخ التوصيل الفعلي المتوقع:</span>
                  <input
                    id={`date-input-${o.tracking}`}
                    type="date"
                    defaultValue={o.delivDate ? o.delivDate.substring(0, 10) : ""}
                    className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-1.5 focus:border-indigo-500 font-semibold w-full mt-1"
                  />
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-[10px] text-indigo-400 font-bold">تعديل الحالة مع حفظ البيانات أعلاه:</span>
                  <select
                    disabled={pendingTrackings.has(o.tracking)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        const notesEl = document.getElementById(`notes-input-${o.tracking}`) as HTMLTextAreaElement | null;
                        const dateEl = document.getElementById(`date-input-${o.tracking}`) as HTMLInputElement | null;
                        const currentNotes = notesEl ? notesEl.value : (o.notes || "");
                        const currentDate = dateEl ? dateEl.value : (o.delivDate || "");
                        
                        triggerStatusUpdate(o.tracking, val, "", currentNotes, currentDate);
                        e.target.value = ""; // Reset value after trigger
                      }
                    }}
                    className="bg-slate-900 border border-white/10 text-xs text-slate-100 rounded-lg p-1.5 focus:border-indigo-500 font-bold focus:ring-0 cursor-pointer w-full"
                  >
                    <option value="">-- اختر الحالة الجديدة --</option>
                    <option value="تم رد العميل وجاري التنسيق">تم رد العميل وجاري التنسيق</option>
                    <option value="مؤجل">مؤجل (تأجيل الطلب)</option>
                    <option value="لا يوجد رد">لا يوجد رد (محاولة تواصل)</option>
                    <option value="جديد">إرجاع الأوردر لحالة "جديد"</option>
                  </select>
                </div>
              </div>
            </div>

            {o.status === "لا يرد" && (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20 flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-amber-400">🚨 تم تصنيف الأوردر كـ "لا يرد"</span>
                  <button
                    type="button"
                    onClick={() => setOpsUpdatingCall(prev => ({ ...prev, [o.tracking]: !prev[o.tracking] }))}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-slate-100 font-extrabold text-[10px] rounded-lg cursor-pointer"
                  >
                    {opsUpdatingCall[o.tracking] ? "إلغاء التحديث" : "📞 تحديث نتيجة الاتصال (رد العميل)"}
                  </button>
                </div>
                {opsUpdatingCall[o.tracking] && (
                  <div className="space-y-3 border-t border-white/6 pt-2 select-text text-right" dir="rtl">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-355 font-bold">ملاحظات رد العميل (إجباري) *</span>
                      <textarea
                        placeholder="اكتب ملاحظات رد وتواصل العميل هنا..."
                        className="bg-slate-900 border border-indigo-500/40 text-xs text-slate-100 rounded-lg p-2 font-medium h-14 resize-none w-full"
                        value={opsNotes[o.tracking] || ""}
                        onChange={(e) => setOpsNotes(prev => ({ ...prev, [o.tracking]: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-355 font-bold">تاريخ الاستلام المؤجل (إجباري) *</span>
                      <input
                        type="date"
                        className="bg-slate-900 border border-indigo-500/40 text-xs text-slate-100 rounded-lg p-2 font-black w-full"
                        value={opsDate[o.tracking] || ""}
                        onChange={(e) => setOpsDate(prev => ({ ...prev, [o.tracking]: e.target.value }))}
                      />
                    </div>
                    <button
                      type="button"
                      disabled={pendingTrackings.has(o.tracking)}
                      onClick={() => {
                        const userNotes = opsNotes[o.tracking] || "";
                        const userDate = opsDate[o.tracking] || "";
                        if (!userNotes.trim()) {
                          alert("يرجى إدخال ملاحظات رد العميل أولاً (إجباري)");
                          return;
                        }
                        if (!userDate.trim()) {
                          alert("يرجى تحديد تاريخ الاستلام المؤجل أولاً (إجباري)");
                          return;
                        }
                        triggerStatusUpdate(o.tracking, "تم رد العميل وجاري التنسيق", "", userNotes, userDate);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-100 font-extrabold text-[11px] rounded-lg cursor-pointer hover:opacity-90"
                    >
                      تحديث الحالة إلى "تم رد العميل وجاري التنسيق" وكتابة التقارير
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}




        {/* Action Controls */}
        {o.status !== "تم التسليم" && !isSupplier && (
          <div className="border-t border-white/6 pt-3 flex flex-wrap gap-2 justify-end">
            {isAgent && o.courier === username && (
              <>
                <button
                  type="button"
                  onClick={() => setCourierConfirmModal({
                    tracking: o.tracking,
                    status: "تم التسليم",
                    title: "تم التسليم والتحصيل"
                  })}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-slate-950 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin text-slate-950" />}
                  <span>✅ تم التسليم والتحصيل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourierConfirmModal({
                    tracking: o.tracking,
                    status: "مرتجع",
                    title: "اختيار مرتجع"
                  })}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-3 py-1.5 bg-red-605 bg-red-650 hover:bg-red-750 text-slate-200 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin text-slate-200" />}
                  <span>↩ اختيار مرتجع</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourierConfirmModal({
                    tracking: o.tracking,
                    status: "مؤجل",
                    title: "تم التأجيل"
                  })}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-[10px] rounded-lg cursor-pointer flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin text-slate-300" />}
                  <span>⏰ تم التأجيل</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourierConfirmModal({
                    tracking: o.tracking,
                    status: "لا يوجد رد",
                    title: "لا يرد"
                  })}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-3 py-1.5 bg-slate-950 text-slate-400 font-bold text-[10px] rounded-lg cursor-pointer border border-white/4 flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin text-slate-400" />}
                  <span>📵 لا يرد</span>
                </button>
              </>
            )}

            {canManage && (
              <>
                <button
                  onClick={() => triggerStatusUpdate(o.tracking, "خارج مع المندوب")}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-2.5 py-1 bg-slate-950 text-amber-500 border border-amber-500/20 text-[9px] font-black rounded hover:bg-slate-900 cursor-pointer flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={10} className="animate-spin text-amber-500" />}
                  <span>🚚 خارج للتسليم</span>
                </button>
                <button
                  onClick={() => triggerStatusUpdate(o.tracking, "تم التسليم")}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-2.5 py-1 bg-emerald-600 text-slate-950 text-[9px] font-black rounded hover:bg-emerald-700 cursor-pointer flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={10} className="animate-spin text-slate-950" />}
                  <span>تسليم سريع</span>
                </button>
                <button
                  onClick={() => triggerStatusUpdate(o.tracking, "مرتجع")}
                  disabled={pendingTrackings.has(o.tracking)}
                  className={`px-2.5 py-1 bg-slate-950 text-red-400 border border-red-900/20 text-[9px] font-black rounded hover:bg-slate-900 cursor-pointer flex items-center gap-1 ${
                    pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {pendingTrackings.has(o.tracking) && <Loader2 size={10} className="animate-spin text-red-500" />}
                  <span>مرتجع سريع</span>
                </button>
              </>
            )}

            {isReturnsOfficer && (
              <div className="flex flex-col gap-3 bg-slate-950 p-3.5 rounded-xl border border-purple-500/30 w-full text-right" dir="rtl">
                <div className="flex items-center gap-1.5 text-purple-400">
                  <span className="text-sm">🔄</span>
                  <span className="text-xs font-black">الدورة المستندية والخطوات اللوجستية للمرتجع:</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">ملاحظات ووصاية المرتجع:</span>
                    <input
                      id={`ret-notes-${o.tracking}`}
                      type="text"
                      placeholder="اكتب ملاحظات فرز المرتجع أو رغبة التوريد..."
                      defaultValue={o.notes || ""}
                      className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-2 focus:border-purple-500 font-medium w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold">تاريخ المتابعة المتوقع:</span>
                    <input
                      id={`ret-date-${o.tracking}`}
                      type="date"
                      defaultValue={o.delivDate ? o.delivDate.substring(0, 10) : ""}
                      className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-1.5 focus:border-purple-500 font-semibold w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-purple-400 font-bold">اختر صفة وحالة المرتجع الحالية:</span>
                  <select
                    value={o.status}
                    disabled={pendingTrackings.has(o.tracking)}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val) {
                        const notesEl = document.getElementById(`ret-notes-${o.tracking}`) as HTMLInputElement | null;
                        const dateEl = document.getElementById(`ret-date-${o.tracking}`) as HTMLInputElement | null;
                        const currentNotes = notesEl ? notesEl.value : (o.notes || "");
                        const currentDate = dateEl ? dateEl.value : (o.delivDate || "");

                        triggerStatusUpdate(o.tracking, val, "", currentNotes, currentDate);
                      }
                    }}
                    className="bg-slate-900 border border-white/10 text-xs text-slate-100 rounded-lg p-2.5 focus:border-purple-500 font-bold focus:ring-0 cursor-pointer w-full text-right"
                  >
                    <option value="">-- اضغط لتعديل الحالة --</option>
                    <option value="جاري التجهيز للرجوع">🔄 جاري التجهيز للرجوع</option>
                    <option value="جاري الرجوع للمورد">🚛 جاري الرجوع للمورد</option>
                    <option value="تم تسليم المرتجع للمورد">📦 تم تسليم المرتجع للمورد (تسوية مالية للمورد)</option>
                    <option value="جديد">↩ تم إلغاء المرتجع وإعادته للمخزن الفعلي</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clean isolated communication */}
        {o.phone && (() => {
          const rawPhone = o.phone.toString().trim();
          const formattedPhone = rawPhone.startsWith('0') ? rawPhone : '0' + rawPhone;
          return (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/6 col-span-1 md:col-span-2">
              <a
                href={`tel:${formattedPhone}`}
                className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-blue-600/10 text-blue-400 bg-blue-950/20 border border-blue-900/30 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-colors text-center"
              >
                <Phone size={13} className="shrink-0" />
                <span>اتصال هاتفي</span>
              </a>
              <a
                href={toWAUrl(o.phone, getOrderWAMessage(o))}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-emerald-600/10 text-emerald-400 bg-emerald-950/20 border border-emerald-950/30 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-colors text-center font-sans"
              >
                <MessageSquare size={13} className="shrink-0" />
                <span>اتصال واتساب</span>
              </a>
            </div>
          );
        })()}
      </div>
    );
  };

  return (
    <div className="font-sans text-right select-none space-y-4">
      {/* Search and select buttons */}
      <div className="flex bg-[#070d1a] px-4 py-3 border-b border-white/6 items-center flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث برقم الأوردر، تليفون، عميل أو مورد..."
            className="w-full bg-slate-900 border border-white/6 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-200 placeholder-slate-500 text-right outline-none focus:border-amber-500/20"
          />
        </div>
        <div className="flex items-center gap-2">
          {canReconcile && (
            <button
              onClick={() => setShowReconPortal(!showReconPortal)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-605 text-slate-950 font-black text-[10px] rounded-xl flex items-center gap-1 cursor-pointer transition-all whitespace-nowrap"
            >
              <span>⚡ تصفية بالباركود والإكسيل</span>
            </button>
          )}
          {canSelectBulk && (
            <button
               onClick={toggleSelectAll}
               className="px-4 py-2 bg-slate-900 border border-white/8 rounded-xl text-[10px] text-slate-300 font-extrabold cursor-pointer transition-colors whitespace-nowrap"
            >
              {selected.size === visibleOrders.length ? "إلغاء التحديد" : "تحديد الكل"}
            </button>
          )}
          {(isAdmin || isSuper || isOps || (role || "").toString().toLowerCase().includes("محاسب")) && (
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-slate-950 font-black text-[10px] rounded-xl flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap"
              title="تصدير النتائج الحليّة بصيغة CSV"
            >
              <Download size={13} />
              تصدير كـ CSV
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {[
          { key: "all", label: "الكل" },
          { key: "جديد", label: "🆕 جديد" },
          { key: "مسند", label: "📋 مسند" },
          { key: "خارج للتسليم", label: "🚚 خارج للتسليم" },
          { key: "تم التسليم", label: "✅ تم التسليم" },
          { key: "العميل رد وجاري التسليم", label: "📞 العميل رد وجاري التسليم" },
          { key: "مرتجع بالمستودع", label: "📦 مرتجع بالمستودع" },
          { key: "تم تسليم المرتجع للمورد", label: "↩ تم تسليم المرتجع للمورد" }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setActiveFilter(f.key);
              setSelected(new Set());
            }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black cursor-pointer transition-all border whitespace-nowrap ${
              activeFilter === f.key
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-slate-950 text-slate-400 border-white/6 hover:text-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 📅 Dynamic Date Filter Bar */}
      <div className="mx-4 p-4 bg-slate-900 border border-white/6 rounded-2xl space-y-3.5 text-right animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 bg-amber-500/10 text-amber-500 rounded-md text-[10px] shrink-0">📅</span>
            <span className="text-xs font-black text-slate-100 font-sans">فلاتر الأيام الذكية للفرز السريع والمسلمات</span>
          </div>
          <div className="text-xs font-black text-amber-505 bg-amber-950/20 px-3 py-1 border border-amber-900/40 rounded-lg">
            إجمالي أوردرات اليوم المحدد: <span className="font-mono text-sm underline text-amber-400">{
              selectedDate === "all"
                ? roleFilteredOrders.filter(o => !o.isArchived && o.status !== "مؤرشف").length
                : roleFilteredOrders.filter(o => normalizeDateToYMD(o.orderDate || o.createdAt) === selectedDate).length
            }</span> أوردر
          </div>
        </div>

        <div className="overflow-x-auto flex items-center gap-3 pb-2 scrollbar-none" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* All button */}
          <button
            onClick={() => setSelectedDate("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border whitespace-nowrap flex flex-col items-center justify-center min-w-[70px] ${
              selectedDate === "all"
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-slate-950 text-slate-400 border-white/6 hover:text-slate-200"
            }`}
          >
            <span>الكل</span>
            <span className="text-[10px] opacity-75 mt-0.5">({roleFilteredOrders.filter(o => !o.isArchived && o.status !== "مؤرشف").length})</span>
          </button>

          {/* Map of last days */}
          {lastDays.map((day) => {
            const dayOrders = roleFilteredOrders.filter((o: any) => normalizeDateToYMD(o.orderDate || o.createdAt) === day.ymd);
            const totalCount = dayOrders.length;
            const delivCount = dayOrders.filter((o: any) => o.status === "تم التسليم").length;
            const delivRate = totalCount > 0 ? Math.round((delivCount / totalCount) * 100) : 0;
            
            const unresolvedCount = dayOrders.filter((o: any) => {
              return !["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "مرتجع والعميل دفع الشحن", "مؤرشف"].includes(o.status);
            }).length;
            const unresolvedRate = totalCount > 0 ? Math.round((unresolvedCount / totalCount) * 100) : 0;

            return (
              <button
                key={day.ymd}
                onClick={() => setSelectedDate(day.ymd)}
                className={`px-4 py-2 rounded-xl text-xs cursor-pointer transition-all border flex flex-col items-center gap-1 min-w-[120px] shrink-0 text-right ${
                  selectedDate === day.ymd
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-extrabold"
                    : "bg-slate-950 text-slate-350 border-white/6 hover:text-white"
                }`}
              >
                <div className="font-bold">{day.label}</div>
                <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono">
                  <span className="opacity-80">({totalCount}) أوردر</span>
                  {totalCount > 0 && (
                    <>
                      <span className={`px-1 rounded-sm ${selectedDate === day.ymd ? "bg-slate-950 text-emerald-400" : "bg-emerald-950/40 text-emerald-400"}`} title="نسبة تسليم فوري">
                        🟢{delivRate}%
                      </span>
                      <span className={`px-1 rounded-sm ${selectedDate === day.ymd ? "bg-slate-950 text-amber-500" : "bg-amber-950/40 text-amber-500"}`} title="نسبة معلق/بايت">
                        🟡{unresolvedRate}%
                      </span>
                    </>
                  )}
                </div>
              </button>
            );
          })}

          {/* Custom Date Picker */}
          <div className="flex flex-col justify-center bg-slate-950 px-4 py-2 rounded-xl border border-white/6 shrink-0 min-w-[140px]">
            <span className="text-[9px] text-slate-400 font-bold block text-center mb-0.5">تقويم مخصص 📅</span>
            <input
              type="date"
              value={selectedDate !== "all" && !lastDays.some(d => d.ymd === selectedDate) ? selectedDate : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                } else {
                  setSelectedDate("all");
                }
              }}
              className="bg-transparent border-none text-[11px] font-mono text-amber-500 font-black outline-none cursor-pointer text-center w-full"
            />
          </div>
        </div>
      </div>

      {/* ⚡ Quick Reconciliation and Returns Portal */}
      {showReconPortal && canReconcile && (
        <div className="mx-4 p-5 bg-[#070d1a] border-2 border-amber-500/40 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/6 pb-3">
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="text-sm font-black">⚡ بوابــة التصفية وتقفيــل الشحنـات السريعة (التحكم السريع)</span>
            </div>
            <button
              onClick={() => setShowReconPortal(false)}
              className="text-slate-400 hover:text-slate-200 text-xs"
            >
              ✕ إغلاق
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Single Scan / Paste */}
            <div className="bg-slate-950 p-4 rounded-xl border border-white/4 space-y-3 text-right">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                🔍 إدخال يدوي سريع للباركود / رقم التتبع
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 text-right">رقم التتبع (مثال: FP-1002-26)</label>
                <input
                  type="text"
                  value={reconcileBarcode}
                  onChange={(e) => setReconcileBarcode(e.target.value)}
                  placeholder="اكتب رقم التتبع أو الباركود هنا..."
                  className="w-full bg-slate-900 border border-white/8 rounded-lg px-3 py-2 text-xs font-black text-slate-200 outline-none text-right focus:border-amber-500/30"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSingleReconciliation();
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 text-right">الحالة المستهدفة المعمدة الشحن</label>
                <select
                  value={reconcileStatus}
                  onChange={(e) => setReconcileStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-white/8 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 outline-none text-right focus:border-amber-500/30"
                >
                  <option value="تم التسليم">✅ تم التسليم</option>
                  <option value="مرتجع">↩️ مرتجع (تجهيز تصفية)</option>
                  <option value="التسليم للمورد">📦 التسليم للمورد (استرداد المرتجعات)</option>
                  <option value="خارج مع المندوب">🚚 خارج للتوصيل مع المندوب</option>
                </select>
              </div>

              <button
                onClick={handleSingleReconciliation}
                disabled={reconLoading}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1"
              >
                {reconLoading && <Loader2 size={13} className="animate-spin" />}
                <span>تثبيت وتحديث حالة الشحنة آلياً</span>
              </button>
            </div>

            {/* Quick Bulk CSV / Excel File */}
            <div className="bg-slate-950 p-4 rounded-xl border border-white/4 flex flex-col justify-between space-y-3 text-right">
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                  📄 رفــع وتصفية ملف إكسيل / CSV دفعة واحدة
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed text-right font-bold">
                  ارفع شيت CSV يتضمن قائمة أرقام التتبع في العمود الأول فقط. سيقوم النظام فوراً بتمرير وتحديث حالتها إلى [{reconcileStatus}] دفعة واحدة وبسرعة فائقة.
                </p>
              </div>

              {reconExcelMsg && (
                <div className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 p-2.5 rounded-lg text-[10.5px]">
                  {reconExcelMsg}
                </div>
              )}

              <div className="space-y-2 pt-1 border-t border-white/4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={reconLoading}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-300 border border-white/8 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Upload size={14} />
                  <span>اختار شيت للتصفية (Excel/CSV)</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv"
                  onChange={handleReconExcelUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {reconFeedback && (
            <div className="bg-slate-950 p-3 rounded-lg text-center font-bold text-xs border border-white/6 text-amber-400">
              {reconFeedback}
            </div>
          )}
        </div>
      )}

      {/* 📊 Courier Dashboard Operational Counters */}
      {isAgent && (() => {
        const targetDateStr = selectedDate === "all" ? getTodayDateStr() : selectedDate;
        const myActiveOrders = roleFilteredOrders.filter((o) => o.courier === username);
        const myTotal = myActiveOrders.filter((o) => normalizeDateToYMD(o.orderDate || o.createdAt) === targetDateStr).length;

        const myDelivered = myActiveOrders.filter((o) => 
          o.status === "تم التسليم" && 
          o.delivDate && 
          normalizeDateToYMD(o.delivDate) === targetDateStr
        ).length;

        const myReturned = myActiveOrders.filter((o) => 
          ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status) && 
          o.retDate && 
          normalizeDateToYMD(o.retDate) === targetDateStr
        ).length;

        const mySuspended = myActiveOrders.filter((o) => 
          ["مؤجل", "لا يوجد رد", "العميل لم يقم بالرد"].includes(o.status) && 
          o.updatedAt && 
          normalizeDateToYMD(o.updatedAt) === targetDateStr
        ).length;

        const myRemaining = Math.max(0, myActiveOrders.filter((o) => !o.isClosed && !["تم التسليم", "مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)).length);

        // Financial Math
        const agentDeliveredOrders = roleFilteredOrders.filter(o => o.courier === username && o.status === "تم التسليم" && o.delivDate && normalizeDateToYMD(o.delivDate) === targetDateStr);
        const agentCustomerPaidReturns = roleFilteredOrders.filter(o => 
          o.courier === username && 
          (o.status === "مرتجع والعميل دفع الشحن" || o.status === "مرتجع مدفوع الشحن" || (o.status === "مرتجع" && o.returnShippingType === "paid")) && 
          o.retDate && 
          normalizeDateToYMD(o.retDate) === targetDateStr
        );
        
        const totalCODDelivered = agentDeliveredOrders.reduce((sum, o) => sum + Number(o.totalCOD || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0))), 0);
        const totalShipReturnsPaidByCust = agentCustomerPaidReturns.reduce((sum, o) => sum + Number(o.shipPrice || o.shipCost || 0), 0);
        
        const totalReceivedCashInHand = totalCODDelivered + totalShipReturnsPaidByCust;
        const totalCommissionsEarned = (agentDeliveredOrders.length * rawCommission) + (agentCustomerPaidReturns.length * rawCommission);
        const netRequiredHandover = totalReceivedCashInHand - totalCommissionsEarned - courierExpenses;

        return (
          <>
            <div className="mx-4 grid grid-cols-2 md:grid-cols-5 gap-3 animate-fadeIn">
              {/* Total Orders Today */}
              <div className="bg-slate-900 border border-white/6 p-3.5 rounded-2xl flex flex-col justify-between space-y-1">
                <span className="text-[10px] text-slate-400 font-bold font-sans">📦 إجمالي طلبات اليوم بالباقة</span>
                <span className="text-xl font-black text-slate-100 font-mono">
                  {myTotal} <span className="text-[10px] font-medium text-slate-400">شحنة</span>
                </span>
              </div>

              {/* Delivered 🟢 */}
              <div className="bg-emerald-950/20 border border-emerald-950/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold font-sans">🟢 تم التسليم اليوم</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {myDelivered} <span className="text-[10px] font-medium text-emerald-550 font-sans">شحنة</span>
                </span>
              </div>

              {/* Returned 🔴 */}
              <div className="bg-red-950/20 border border-red-900/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-1">
                <span className="text-[10px] text-red-400 font-bold font-sans">🔴 مرتجع ميداني نهائي</span>
                <span className="text-xl font-black text-red-400 font-mono">
                  {myReturned} <span className="text-[10px] font-medium text-red-505 font-sans">شحنة</span>
                </span>
              </div>

              {/* Delayed / No Response 🟡 */}
              <div className="bg-amber-950/20 border border-amber-900/30 p-3.5 rounded-2xl flex flex-col justify-between space-y-1">
                <span className="text-[10px] text-amber-400 font-bold font-sans">🟡 معلّق / لا يرد مؤقتاً</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {mySuspended} <span className="text-[10px] font-medium text-amber-505 font-sans">شحنة</span>
                </span>
              </div>

              {/* Remaining in Bag 🔵 */}
              <div className="bg-blue-950/30 border border-blue-900/40 p-3.5 rounded-2xl flex flex-col justify-between col-span-2 md:col-span-1 space-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
                <span className="text-[10px] text-blue-400 font-extrabold flex items-center gap-1.5 font-sans">
                  <span>🔵 المتبقي بالحقيبة حالياً</span>
                </span>
                <span className="text-xl font-black text-blue-400 font-mono">
                  {myRemaining} <span className="text-[10px] font-medium text-blue-400 font-sans">شحنة</span>
                </span>
              </div>
            </div>

            {/* Beautiful Courier Financial & Performance Quick Summary Card */}
            <div className="mx-4 p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/6 rounded-2xl space-y-5 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1 px-1.5 bg-indigo-500/10 text-indigo-400 rounded-md text-xs">💸</span>
                  <h3 className="text-xs font-black text-slate-100 font-sans">معادلة التصفية المالية المقفلة للمندوب</h3>
                </div>
                <span className="text-[9px] font-bold bg-indigo-950/20 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded font-sans">
                  محدث فظيًا ⚡
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Cash In Hand */}
                <div className="bg-slate-950 border border-white/4 p-4 rounded-xl space-y-1 text-right">
                  <span className="text-[10px] text-slate-400 font-bold block font-sans">💵 إجمالي الكاش المستلم ميدانياً</span>
                  <div className="text-lg font-black text-emerald-400 font-mono">{totalReceivedCashInHand.toLocaleString("ar")} ج.م</div>
                  <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
                    تحصيل طلبات مسلّمة ({totalCODDelivered.toLocaleString("ar")} ج.م) + شحن مرتجعات دفعه العميل ({totalShipReturnsPaidByCust.toLocaleString("ar")} ج.م)
                  </p>
                </div>

                {/* 2. Commissions today */}
                <div className="bg-slate-950 border border-white/4 p-4 rounded-xl space-y-1 text-right">
                  <span className="text-[10px] text-slate-400 font-bold block font-sans">🎖️ عمولات التسليم المكتسبة اليوم</span>
                  <div className="text-lg font-black text-indigo-400 font-mono">-{totalCommissionsEarned.toLocaleString("ar")} ج.م</div>
                  <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
                    إجمالي عمولة {agentDeliveredOrders.length} أوردر ناجح (عمولة الطلب: {rawCommission} ج.م)
                  </p>
                </div>

                {/* 3. Daily Expenses */}
                <div className="bg-slate-950 border border-white/4 p-4 rounded-xl space-y-1 text-right">
                  <span className="text-[10px] text-slate-400 font-bold block font-sans">⛽ المصروفات الميدانية اليومية</span>
                  <div className="text-lg font-black text-amber-500 font-mono">-{courierExpenses.toLocaleString("ar")} ج.م</div>
                  <p className="text-[9px] text-slate-500 leading-relaxed font-sans">
                    مجموع البنود والعهد والوقود المسجلة باسمك لليوم الحالي
                  </p>
                </div>
              </div>

              {/* Final Settle Value */}
              <div className="bg-indigo-950/20 border border-indigo-500/25 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-right">
                <div>
                  <div className="text-xs font-black text-indigo-400 flex items-center gap-1.5 font-sans">
                    <span>🔒 الصافي المالي المطلوب توريده رسمياً للخزنة</span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 mt-1 leading-relaxed max-w-xl font-medium font-sans">
                    الصافي مقفل ومحتسب إلكترونياً لإنهاء الأخطاء اليدوية: [الكاش الكلي المستلم {totalReceivedCashInHand}] - [عمولاتك {totalCommissionsEarned}] - [مصروفاتك المعتمدة {courierExpenses}].
                  </p>
                </div>
                <div className="bg-indigo-950 border border-indigo-500/40 p-3 px-6 rounded-xl text-center shrink-0">
                  <span className="text-[9px] text-indigo-400 font-extrabold block mb-0.5 font-sans">العهد المطلوب تسليمها</span>
                  <span className="text-xl font-black text-indigo-300 font-mono">
                    {netRequiredHandover.toLocaleString("ar")} ج.م
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {/* Floating Smart Action Bar (Bulk Action with Role-Based Permissions) */}
      {selected.size > 0 && canSelectBulk && (
        <div className="fixed bottom-6 right-4 left-4 md:right-8 md:left-auto md:w-[480px] bg-slate-950/95 backdrop-blur-lg border border-amber-500/40 rounded-2xl p-4 shadow-2xl z-50 text-right space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <button
              onClick={() => setSelected(new Set())}
              className="text-[10px] text-slate-400 hover:text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-white/6 font-bold cursor-pointer"
            >
              إلغاء التحديد
            </button>
            <span className="text-xs font-black text-amber-550 flex items-center gap-1">
              <span>⚡ تم تحديد {selected.size} من الأوردرات</span>
              <span>📎</span>
            </span>
          </div>

          <div className="space-y-3">
            {/* Dynamic Dropdown per role */}
            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-bold">تحديد الإجراء الجماعي المتاح لدورك</label>
              <select
                value={floatingStatus}
                onChange={(e) => setFloatingStatus(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 border border-white/8 rounded-xl px-3 py-2 text-xs text-right cursor-pointer"
              >
                {isReturnsOfficer && (
                  <>
                    <option value="">-- اختر إجراء المرتجعات الجماعي --</option>
                    <option value="مرتجع جديد">مرتجع جديد (مسار الاسترجاع)</option>
                    <option value="مرتجع جاري تسليمه للمكتب">مرتجع جاري تسليمه للمكتب</option>
                    <option value="جاري الرجوع للمورد">جاري الرجوع للمورد</option>
                    <option value="تم تسليم المرتجع للمورد وتصفية حسابه">تم تسليم المرتجع للمورد وتصفية حسابه</option>
                  </>
                )}

                {isOps && (
                  <>
                    <option value="">-- اختر إجراء العمليات الجماعي --</option>
                    <option value="تم رد العميل وجاري التنسيق">تم رد العميل وجاري التنسيق</option>
                    <option value="لا يرد - محاولة أولى/ثانية">لا يرد - محاولة أولى/ثانية</option>
                    <option value="تحديث نتيجة الاتصال">تحديث نتيجة الاتصال</option>
                  </>
                )}

                {isAgent && (
                  <>
                    <option value="">-- اختر إجراء التوصيل الجماعي المندوب --</option>
                    <option value="تم التسليم بنجاح">تم التسليم بنجاح</option>
                    <option value="مؤجل بناءً على طلب العميل">مؤجل بناءً على طلب العميل</option>
                  </>
                )}

                {(isAdmin || isSuper) && (
                  <>
                    <option value="">-- اختر حالة الأوردرات المحددة --</option>
                    <option value="جديد">جديد (إعادة للانتظار)</option>
                    <option value="تم الإسناد">تم الإسناد</option>
                    <option value="خارج مع المندوب">خارج مع المندوب</option>
                    <option value="تم التسليم">تم التسليم (ناجح كاش)</option>
                    <option value="مرتجع">مرتجع (من طرف العميل)</option>
                    <option value="مؤجل">مؤجل (متابعة لاحقة)</option>
                    <option value="لا يوجد رد">لا يوجد رد</option>
                    <option value="التسليم للمورد">التسليم للمورد</option>
                    <option value="تم تسليم المرتجع للمورد">تم تسليم المرتجع للمورد</option>
                  </>
                )}
              </select>
            </div>

            {/* Courier Assignment for Admins & Supervisors only */}
            {(isAdmin || isSuper) && (
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تعيين أو تغيير المندوب المسؤول</label>
                <SearchableCourierSelect
                  value={floatingCourier}
                  onChange={(val) => setFloatingCourier(val)}
                  couriers={couriers}
                  placeholder="-- بقاء المندوب كما هو --"
                  showWarehouseReset={true}
                />
              </div>
            )}

            {/* Sub-fields for Operations logs or delay captures */}
            {(isOps || isAdmin || isSuper || floatingStatus === "مؤجل بناءً على طلب العميل" || floatingStatus === "تحديث نتيجة الاتصال") && (
              <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="space-y-1">
                  <label className="block text-[10px] text-indigo-400 font-bold">الملاحظات الجماعية</label>
                  <input
                    type="text"
                    value={floatingNotes}
                    onChange={(e) => setFloatingNotes(e.target.value)}
                    placeholder="ملاحظات الاتصال الهاتفي..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-2 text-[10px] text-right text-slate-200 placeholder-slate-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-indigo-400 font-bold">التاريخ المؤجل</label>
                  <input
                    type="date"
                    value={floatingDate}
                    onChange={(e) => setFloatingDate(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-2.5 py-1.5 text-[10px] text-slate-200 [color-scheme:dark] text-center"
                  />
                </div>
              </div>
            )}

            <button
              onClick={saveFloatingBulkUpdate}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer shadow-lg active:scale-98 transition-transform text-center"
            >
              حفظ التعديل الجماعي لحساب {selected.size} طلبات
            </button>
          </div>
        </div>
      )}

      {/* Orders List Workspace */}
      <div className="px-4 space-y-4">
        {visibleOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500 space-y-2">
            <div>📭</div>
            <p>لا توجد شحنات مطابقة لخيارات التصفية الحالية</p>
          </div>
        ) : (
          <>
            {visibleOrders.slice(0, displayLimit).map((o) => renderOrderCard(o))}
            {visibleOrders.length > displayLimit && (
              <div className="flex justify-center pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => setDisplayLimit((prev) => prev + 25)}
                  className="px-6 py-2.5 bg-slate-900 border border-white/10 hover:border-amber-500 text-slate-300 hover:text-amber-500 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  🚀 عرض المزيد من الشحنات ({visibleOrders.length - displayLimit} متبقية)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Today's hold-ups ("معلقات اليوم") at the bottom of the courier screen */}
      {isAgent && suspendedOrders.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xs font-black text-amber-500 bg-amber-950/20 px-4 py-2 border border-amber-900/40 rounded-xl flex items-center gap-2">
              <span>⏳ معلقات اليوم (المؤجلات وعدم الرد) ({suspendedOrders.length})</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-bold">شحنات معلقة تحتاج إعادة محاولة لاحقاً</p>
          </div>
          <div className="px-4 space-y-4">
            {suspendedOrders.map((o) => renderOrderCard(o))}
          </div>
        </div>
      )}

      {/* Swallow old list map compile-safely to bypass duplicate rendering logic */}
      {false && (
        <div className="hidden">
          {visibleOrders.map((o) => {
            const isSel = selected.has(o.tracking);
            return (
              <div
                key={o.tracking}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-4 relative transition-all ${
                  isSel ? "border-amber-500 ring-2 ring-amber-500/10" : "border-white/6"
                }`}
              >
                {/* Header components */}
                <div className="flex items-start justify-between border-b border-white/4 pb-3">
                  <div className="flex items-center gap-3">
                    {canSelectBulk && (
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleSelect(o.tracking)}
                        className="w-4 h-4 rounded border-white/10 bg-slate-950 text-amber-500 accent-amber-500 cursor-pointer"
                      />
                    )}
                    <div>
                      <div className="text-sm font-black text-amber-550 tracking-wider flex items-center gap-2">
                        <span>{o.tracking}</span>
                        {/* Edit & Delete panels inline with Tracking ID to prevent overlaps */}
                        {isAdmin && (
                          <div className="flex gap-1 mr-2">
                            <button
                              onClick={() => setEditOrder(o)}
                              className="p-1 px-1.5 bg-slate-950 text-indigo-400 hover:text-indigo-200 rounded-md border border-white/6 cursor-pointer"
                              title="تعديل الأوردر"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={() => deleteOrderDirect(o.tracking)}
                              className="p-1 px-1.5 bg-slate-950 text-red-400 hover:text-red-200 rounded-md border border-white/6 cursor-pointer"
                              title="حذف الأوردر"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                        {o.createdAt.substring(0, 10)} {o.supplier && `· ${o.supplier}`}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-black rounded ${getBadgeStyle(o.status)}`}>
                    {o.status}
                  </span>
                </div>

                {/* Details components (hide/show sensitive elements as per role controls) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  {/* Customer customer name */}
                  <div className="flex items-center gap-2 text-slate-350">
                    <User size={14} className="text-slate-500" />
                    <span>العميل: <span className="font-bold text-slate-200">{o.customer || "غير مسجل"}</span></span>
                  </div>

                  {/* Telephone display without secondary a button duplication */}
                  {o.phone && (
                    <div className="flex items-center gap-2 text-slate-350 font-mono">
                      <Phone size={14} className="text-slate-500" />
                      <span>الهاتف: <span className="text-slate-200 font-bold">{o.phone}</span> {o.phone2 && ` / ${o.phone2}`}</span>
                    </div>
                  )}

                  {/* Shipping address details */}
                  <div className="flex items-center justify-between gap-2 text-slate-350 bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-500" />
                      <span className="text-xs">العنوان: <span className="font-bold text-slate-250">{o.gov} · {o.region} · {o.address}</span></span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.gov} ${o.region} ${o.address}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/30 text-indigo-300 font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition active:scale-95 cursor-pointer"
                    >
                      <MapPin size={11} className="text-indigo-400" />
                      <span>توجيه الخرائط GPS</span>
                    </a>
                  </div>

                  {/* Financial settle details */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-slate-350 flex items-center gap-2">
                      <span className="text-sm">💵</span>
                      <span>إجمالي التحصيل المستحق: <span className="text-sm font-black text-emerald-400 font-mono">{(o.totalCOD || o.prodPrice || 0).toLocaleString("ar")} ج.م</span></span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold font-mono">
                      منتج: {o.prodPrice} · شحن: {o.shipPrice}
                    </span>
                  </div>

                  {/* Hide or show sensitive courier assignments for Suppliers / Couriers */}
                  {!isSupplier && o.courier && (
                    <div className="flex items-center gap-2 text-slate-350">
                      <Truck size={14} className="text-slate-500" />
                      <span>المندوب: <span className="font-bold text-indigo-400">{o.courier}</span></span>
                    </div>
                  )}

                  {o.notes && (
                    <div className="col-span-1 md:col-span-2 p-2.5 bg-slate-950/40 rounded-xl text-[11px] text-slate-400 border border-white/4 leading-relaxed">
                      💬 <span className="font-bold">ملاحظات:</span> {o.notes}
                    </div>
                  )}

                  {/* Returns management officer details (Return Queue indicators) */}
                  {o.returnQueueStatus && (
                    <div className="col-span-1 md:col-span-2 p-3 bg-purple-950/10 border border-purple-900/30 rounded-xl text-[11px] text-purple-300 flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5">
                        <ArrowLeftRight size={13} />
                        قائمة المرتجع: <span className="font-black underline">{o.returnQueueStatus}</span>
                      </span>
                      <span>مسؤول المتابعة: <span className="font-bold underline">{o.returnQueueAgent || "لم يعين"}</span></span>
                    </div>
                  )}

                  {isOps && (
                    <div className="col-span-1 md:col-span-2 bg-[#0a1128] p-4 rounded-xl border border-indigo-500/30 text-right space-y-3" dir="rtl">
                      <div className="flex items-center gap-1.5 text-indigo-400">
                        <span className="text-sm">🎧</span>
                        <span className="text-xs font-black">لوحة متابعة موظف العمليات والاتصال:</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-slate-400 font-bold">تسجيل نتيجة المكالمة التفصيلية:</span>
                          <textarea
                            id={`notes-compact-${o.tracking}`}
                            defaultValue={o.notes || ""}
                            placeholder="شرح تواصل العميل، رغبته، أو تفاصيل المتابعة الحالية..."
                            className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-2 focus:border-indigo-500 font-medium h-16 resize-none w-full"
                          />
                        </div>

                        <div className="flex flex-col gap-2 justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold">تاريخ التوصيل الفعلي المتوقع:</span>
                            <input
                              id={`date-compact-${o.tracking}`}
                              type="date"
                              defaultValue={o.delivDate ? o.delivDate.substring(0, 10) : ""}
                              className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-1.5 focus:border-indigo-500 font-semibold w-full mt-1"
                            />
                          </div>

                          <div className="flex flex-col gap-1 mt-1">
                            <span className="text-[10px] text-indigo-400 font-bold">تعديل الحالة مع حفظ البيانات أعلاه:</span>
                            <select
                              disabled={pendingTrackings.has(o.tracking)}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                  const notesEl = document.getElementById(`notes-compact-${o.tracking}`) as HTMLTextAreaElement | null;
                                  const dateEl = document.getElementById(`date-compact-${o.tracking}`) as HTMLInputElement | null;
                                  const currentNotes = notesEl ? notesEl.value : (o.notes || "");
                                  const currentDate = dateEl ? dateEl.value : (o.delivDate || "");
                                  
                                  triggerStatusUpdate(o.tracking, val, "", currentNotes, currentDate);
                                  e.target.value = ""; // Reset value after trigger
                                }
                              }}
                              className="bg-slate-900 border border-white/10 text-xs text-slate-100 rounded-lg p-1.5 focus:border-indigo-500 font-bold focus:ring-0 cursor-pointer w-full"
                            >
                              <option value="">-- اختر الحالة الجديدة --</option>
                              <option value="تم رد العميل وجاري التنسيق">تم رد العميل وجاري التنسيق</option>
                              <option value="مؤجل">مؤجل (تأجيل الطلب)</option>
                              <option value="لا يوجد رد">لا يوجد رد (محاولة تواصل)</option>
                              <option value="جديد">إرجاع الأوردر لحالة "جديد"</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {o.status === "لا يرد" && (
                        <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20 flex flex-col gap-2 mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-amber-400">🚨 تم تصنيف الأوردر كـ "لا يرد"</span>
                            <button
                              type="button"
                              onClick={() => setOpsUpdatingCall(prev => ({ ...prev, [o.tracking]: !prev[o.tracking] }))}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-slate-100 font-extrabold text-[10px] rounded-lg cursor-pointer"
                            >
                              {opsUpdatingCall[o.tracking] ? "إلغاء التحديث" : "📞 تحديث نتيجة الاتصال (رد العميل)"}
                            </button>
                          </div>
                          {opsUpdatingCall[o.tracking] && (
                            <div className="space-y-3 border-t border-white/6 pt-2 select-text text-right" dir="rtl">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-355 font-bold">ملاحظات رد العميل (إجباري) *</span>
                                <textarea
                                  placeholder="اكتب ملاحظات رد وتواصل العميل هنا..."
                                  className="bg-slate-900 border border-indigo-500/40 text-xs text-slate-100 rounded-lg p-2 font-medium h-14 resize-none w-full"
                                  value={opsNotes[o.tracking] || ""}
                                  onChange={(e) => setOpsNotes(prev => ({ ...prev, [o.tracking]: e.target.value }))}
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-slate-355 font-bold">تاريخ الاستلام المؤجل (إجباري) *</span>
                                <input
                                  type="date"
                                  className="bg-slate-900 border border-indigo-500/40 text-xs text-slate-100 rounded-lg p-2 font-black w-full"
                                  value={opsDate[o.tracking] || ""}
                                  onChange={(e) => setOpsDate(prev => ({ ...prev, [o.tracking]: e.target.value }))}
                                />
                              </div>
                              <button
                                type="button"
                                disabled={pendingTrackings.has(o.tracking)}
                                onClick={() => {
                                  const userNotes = opsNotes[o.tracking] || "";
                                  const userDate = opsDate[o.tracking] || "";
                                  if (!userNotes.trim()) {
                                    alert("يرجى إدخال ملاحظات رد العميل أولاً (إجباري)");
                                    return;
                                  }
                                  if (!userDate.trim()) {
                                    alert("يرجى تحديد تاريخ الاستلام المؤجل أولاً (إجباري)");
                                    return;
                                  }
                                  triggerStatusUpdate(o.tracking, "تم رد العميل وجاري التنسيق", "", userNotes, userDate);
                                }}
                                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-slate-100 font-extrabold text-[11px] rounded-lg cursor-pointer hover:opacity-90"
                              >
                                تحديث الحالة إلى "تم رد العميل وجاري التنسيق" وكتابة التقارير
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Individual Action Controls */}
                {/* 1. Normal transition status controls (Hide state buttons for Suppliers (Mored) Per User Rules!) */}
                {o.status !== "تم التسليم" && !isSupplier && (
                  <div className="border-t border-white/6 pt-3 flex flex-wrap gap-2 justify-end">
                    {/* Courier quick controls */}
                    {isAgent && o.courier === username && (
                      <>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "تم التسليم")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-slate-950 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin" />}
                          <span>✅ تم التسليم والتحصيل</span>
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "مرتجع")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-3 py-1.5 bg-red-650 hover:bg-red-700 text-slate-200 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin" />}
                          <span>↩ اختيار مرتجع</span>
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "مؤجل")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-[10px] rounded-lg cursor-pointer flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin" />}
                          <span>⏰ تم التأجيل</span>
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "لا يوجد رد")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-3 py-1.5 bg-slate-950 text-slate-400 font-bold text-[10px] rounded-lg cursor-pointer border border-white/4 flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={11} className="animate-spin" />}
                          <span>📵 لا يرد</span>
                        </button>
                      </>
                    )}

                    {/* Admin and Supervisor assignments actions */}
                    {canManage && (
                      <>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "خارج مع المندوب")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-2.5 py-1 bg-slate-950 text-amber-500 border border-amber-500/20 text-[9px] font-black rounded hover:bg-slate-900 cursor-pointer flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={10} className="animate-spin" />}
                          <span>🚚 خارج للتسليم</span>
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "تم التسليم")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-2.5 py-1 bg-emerald-600 text-slate-950 text-[9px] font-black rounded hover:bg-emerald-700 cursor-pointer flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={10} className="animate-spin" />}
                          <span>تسليم سريع</span>
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "مرتجع")}
                          disabled={pendingTrackings.has(o.tracking)}
                          className={`px-2.5 py-1 bg-slate-950 text-red-400 border border-red-900/20 text-[9px] font-black rounded hover:bg-slate-900 cursor-pointer flex items-center gap-1 ${
                            pendingTrackings.has(o.tracking) ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          {pendingTrackings.has(o.tracking) && <Loader2 size={10} className="animate-spin" />}
                          <span>مرتجع سريع</span>
                        </button>
                      </>
                    )}

                    {/* Returns Officer specific status transitions */}
                    {isReturnsOfficer && (
                      <div className="flex flex-col gap-3 bg-slate-950 p-3.5 rounded-xl border border-purple-500/30 w-full text-right" dir="rtl">
                        <div className="flex items-center gap-1.5 text-purple-400">
                          <span className="text-sm">🔄</span>
                          <span className="text-xs font-black">الدورة المستندية والخطوات اللوجستية للمرتجع:</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold">ملاحظات ووصاية المرتجع:</span>
                            <input
                              id={`ret-notes-compact-${o.tracking}`}
                              type="text"
                              placeholder="اكتب ملاحظات فرز المرتجع أو رغبة التوريد..."
                              defaultValue={o.notes || ""}
                              className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-2 focus:border-purple-500 font-medium w-full"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-bold">تاريخ المتابعة المتوقع:</span>
                            <input
                              id={`ret-date-compact-${o.tracking}`}
                              type="date"
                              defaultValue={o.delivDate ? o.delivDate.substring(0, 10) : ""}
                              className="bg-slate-900 border border-white/8 text-xs text-slate-100 rounded-lg p-1.5 focus:border-purple-500 font-semibold w-full"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-purple-400 font-bold">اختر صفة وحالة المرتجع الحالية:</span>
                          <select
                            value={o.status}
                            disabled={pendingTrackings.has(o.tracking)}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                const notesEl = document.getElementById(`ret-notes-compact-${o.tracking}`) as HTMLInputElement | null;
                                const dateEl = document.getElementById(`ret-date-compact-${o.tracking}`) as HTMLInputElement | null;
                                const currentNotes = notesEl ? notesEl.value : (o.notes || "");
                                const currentDate = dateEl ? dateEl.value : (o.delivDate || "");

                                triggerStatusUpdate(o.tracking, val, "", currentNotes, currentDate);
                              }
                            }}
                            className="bg-slate-900 border border-white/10 text-xs text-slate-100 rounded-lg p-2.5 focus:border-purple-500 font-bold focus:ring-0 cursor-pointer w-full text-right"
                          >
                            <option value="">-- اضغط لتعديل الحالة --</option>
                            <option value="جاري التجهيز للرجوع">🔄 جاري التجهيز للرجوع</option>
                            <option value="جاري الرجوع للمورد">🚛 جاري الرجوع للمورد</option>
                            <option value="تم تسليم المرتجع للمورد">📦 تم تسليم المرتجع للمورد (تسوية مالية للمورد)</option>
                            <option value="جديد">↩ تم إلغاء المرتجع وإعادته للمخزن الفعلي</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Clean, isolated mobile connection row at the bottom of each order */}
                {o.phone && (() => {
                  const rawPhone = o.phone.toString().trim();
                  const formattedPhone = rawPhone.startsWith('0') ? rawPhone : '0' + rawPhone;
                  return (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/6">
                      <a
                        href={`tel:${formattedPhone}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-blue-600/10 text-blue-400 bg-blue-950/20 border border-blue-900/30 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-colors text-center"
                      >
                        <Phone size={13} />
                        <span>اتصال هاتفي</span>
                      </a>
                      <a
                        href={toWAUrl(o.phone, getOrderWAMessage(o))}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-emerald-600/10 text-emerald-400 bg-emerald-950/20 border border-emerald-950/30 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-colors text-center font-sans"
                      >
                        <MessageSquare size={13} />
                        <span>اتصال واتساب</span>
                      </a>
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL 1: RETURN SHIPPING SELECTION POPUP (Third Point Fix!) --- */}
      {returnedSelectOpen && selectedReturnOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/8 p-6 rounded-t-2xl md:rounded-2xl w-full max-w-[420px] text-right space-y-4">
            <h3 className="text-sm font-black text-rose-450 border-b border-white/6 pb-2">
              ↩️ تحديد سلوك تصفية الشحن المرتجع
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              يقوم المندوب حالياً بإرجاع الأوردر <span className="text-amber-500 font-bold underline font-mono">{selectedReturnOrder.tracking}</span> للمكتب الرئيسي.
              <br />
              يرجى تحديد ما إذا دفع الزبون تكلفة الشحن أم رفض الدفع:
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => triggerStatusUpdate(selectedReturnOrder.tracking, "مرتجع", "paid")}
                className="w-full py-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-950/45 rounded-xl text-xs font-black cursor-pointer leading-relaxed"
              >
                1. مرتجع والعميل دفع الشحن (يتم احتساب عمولة المندوب)
              </button>

              <button
                onClick={() => triggerStatusUpdate(selectedReturnOrder.tracking, "مرتجع", "unpaid")}
                className="w-full py-3 bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-950/45 rounded-xl text-xs font-black cursor-pointer leading-relaxed"
              >
                2. مرتجع والعميل رفض دفع الشحن (العمولة = 0 + قائمة المتابعة)
              </button>
            </div>

            <button
              onClick={() => {
                setReturnedSelectOpen(false);
                setSelectedReturnOrder(null);
              }}
              className="w-full py-2 bg-slate-950 text-slate-500 text-[10px] font-bold rounded-lg border border-white/4"
            >
              إلغاء لخطأ
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: BULK ASSIGNMENTS MANIFEST MODAL (canManage only) --- */}
      {bulkModalOpen && canManage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[420px] text-right space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-amber-550 border-b border-white/6 pb-2">
              🔗 توزيع وإسناد وتحديث جماعي لعدد {selected.size} طلبات
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">الحالة الجديدة للطلبات</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-3 py-2.5 text-xs text-right"
                >
                  <option value="">-- لا يتم تغيير الحالة --</option>
                  <option value="خارج مع المندوب">خارج مع المندوب</option>
                  <option value="تم التسليم">تم التسليم</option>
                  <option value="مرتجع">مرتجع</option>
                  <option value="مؤجل">مؤجل</option>
                  <option value="لا يوجد رد">لا يوجد رد</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تعيين أو تغيير المندوب المسؤول</label>
                <SearchableCourierSelect
                  value={bulkCourier}
                  onChange={(val) => setBulkCourier(val)}
                  couriers={couriers}
                  placeholder="-- بقاء المندوب كما هو --"
                  showWarehouseReset={true}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveBulkUpdate}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                تطبيق التغييرات لجميع المحدد
              </button>
              <button
                onClick={() => setBulkModalOpen(false)}
                className="px-4 py-3 bg-slate-950 text-slate-400 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADMIN DETAIL ORDER MODIFER MODAL --- */}
      {editOrder && isAdmin && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveAdminEdits} className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[480px] text-right space-y-4 my-8">
            <h3 className="text-sm font-black text-indigo-400 border-b border-white/6 pb-2">
              ✏️ تعديل ومراجعة بيانات الشحنة {editOrder.tracking}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="block text-[9px] text-slate-450 font-bold">اسم المستلم*</label>
                <input
                  type="text"
                  required
                  value={editOrder.customer}
                  onChange={(e) => setEditOrder({ ...editOrder, customer: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="block text-[9px] text-slate-450 font-bold">المندوب المسؤول للتسليم</label>
                <SearchableCourierSelect
                  value={editOrder.courier || ""}
                  onChange={(val) => setEditOrder({ ...editOrder, courier: val })}
                  couriers={couriers}
                  placeholder="بدون مندوب"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تليفون العميل</label>
                <input
                  type="text"
                  required
                  value={editOrder.phone}
                  onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تليفون بديل</label>
                <input
                  type="text"
                  value={editOrder.phone2 || ""}
                  onChange={(e) => setEditOrder({ ...editOrder, phone2: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">محافظة المستلم</label>
                <select
                  value={editOrder.gov}
                  onChange={(e) => setEditOrder({ ...editOrder, gov: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs"
                >
                  {EgyptGovs.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">المنطقة</label>
                <input
                  type="text"
                  value={editOrder.region}
                  onChange={(e) => setEditOrder({ ...editOrder, region: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-bold">العنوان الكامل بالتفصيل</label>
              <input
                type="text"
                value={editOrder.address}
                onChange={(e) => setEditOrder({ ...editOrder, address: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">سعر المنتج (حق المورد)</label>
                <input
                  type="number"
                  required
                  value={editOrder.prodPrice}
                  onChange={(e) => setEditOrder({ ...editOrder, prodPrice: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">سعر شحن الشركة (حق الشركة)</label>
                <input
                  type="number"
                  required
                  value={editOrder.shipPrice}
                  onChange={(e) => setEditOrder({ ...editOrder, shipPrice: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-bold">اسم/نوع المنتج الفعلي (المحتويات)</label>
              <input
                type="text"
                value={editOrder.prodType || ""}
                onChange={(e) => setEditOrder({ ...editOrder, prodType: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right font-sans"
                placeholder="مثال: حذاء كلاسيك جلد طبيعي أسود"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-bold">ملاحظات ووصاية الأوردر</label>
              <input
                type="text"
                value={editOrder.notes}
                onChange={(e) => setEditOrder({ ...editOrder, notes: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-slate-100 font-black text-xs rounded-xl cursor-pointer"
              >
                حفظ وحفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setEditOrder(null)}
                className="px-4 py-3.5 bg-slate-950 text-slate-500 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 4: COURIER CORRECTION / ACCIDENTAL CLICK PREVENTION MODAL --- */}
      {courierConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4" dir="rtl">
          <div className="bg-slate-900 border border-white/8 p-6 rounded-t-2xl md:rounded-2xl w-full max-w-[420px] text-right space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-amber-500 border-b border-white/6 pb-2 flex items-center gap-2">
              <span>⚠️ تأكيد تغيير حالة الأوردر</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-semibold">
              هل أنت متأكد من تغيير حالة الشحنة <span className="text-amber-500 font-bold underline font-mono">{courierConfirmModal.tracking}</span> إلى <span className="text-emerald-400 font-bold">[{courierConfirmModal.title}]</span>؟
            </p>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  const { tracking, status } = courierConfirmModal;
                  setCourierConfirmModal(null);
                  triggerStatusUpdate(tracking, status);
                }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black text-xs rounded-xl cursor-pointer active:scale-98 transition-transform"
              >
                نعم، متأكد
              </button>
              <button
                type="button"
                onClick={() => setCourierConfirmModal(null)}
                className="px-5 py-3 bg-slate-950 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء التغيير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
