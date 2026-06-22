import React, { useEffect, useState } from "react";
import { PlusCircle, Wallet, FileText, ArrowUpRight, ArrowDownRight, Calendar, Filter, Users, ShieldAlert, Search, Eye, CheckCircle2, Clock, Loader2, ArrowLeft, Check, Shield } from "lucide-react";
import { apiCall } from "../utils";

interface LedgerProps {
  token: string;
  role: string;
  user: string;
  activeLedgerMode?: "supplier" | "courier";
}

export default function Ledger({ token, role, user, activeLedgerMode }: LedgerProps) {
  const isSupplier = (role || "").toString().trim() === "مورد" || (role || "").toString().trim().includes("مورد");
  const isCourier = (role || "").toString().trim() === "مندوب" || (role || "").toString().trim().includes("مندوب");
  const isFinancial = (role || "").toString().trim() === "مدير" || (role || "").toString().trim() === "محاسب" || (role || "").toString().trim().includes("مدير") || (role || "").toString().trim().includes("محاسب");

  const [activeLedger, setActiveLedger] = useState<"supplier" | "courier">(
    activeLedgerMode || (isSupplier ? "supplier" : "courier")
  );

  useEffect(() => {
    if (activeLedgerMode) {
      setActiveLedger(activeLedgerMode);
    }
  }, [activeLedgerMode]);

  // --- Supplier Ledger States ---
  const [subscribes, setSubscribes] = useState<any[]>([]);
  const [liveBalance, setLiveBalance] = useState(0);
  const [supplierStats, setSupplierStats] = useState<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState(isSupplier ? user : "");
  const [allSuppliers, setAllSuppliers] = useState<any[]>([]);
  const [payAmount, setPayAmount] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [supplierTransType, setSupplierTransType] = useState<"payout" | "withdrawal">("payout");
  const [submittingLedger, setSubmittingLedger] = useState(false);
  const [ledgerCache, setLedgerCache] = useState<Record<string, { subscribes: any[], liveBalance: number, stats: any, dailyLedger?: any }>>({});

  // --- New Daily Supplier Ledger States ---
  const [dailyLedgers, setDailyLedger] = useState<any>(null);
  const [daySearchQuery, setDaySearchQuery] = useState("");
  const [selectedDayOrdersDetail, setSelectedDayOrdersDetail] = useState<any[] | null>(null);
  const [selectedDayDate, setSelectedDayDate] = useState<string>("");
  const [selectedDayStatus, setSelectedDayStatus] = useState<string>("");
  const [settleDayProgress, setSettleDayProgress] = useState<string>("");
  const [modalSearchFilter, setModalSearchFilter] = useState<string>("");

  // --- Courier Ledger States ---
  const [courierSummary, setCourierSummary] = useState<any>(null);
  const [courierTrs, setCourierTrs] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState(isCourier ? user : "");
  const [allCouriers, setAllCouriers] = useState<any[]>([]);
  const [periodFilter, setPeriodFilter] = useState<"day" | "week" | "month">("month");
  const [adjustmentType, setAdjustmentType] = useState<"مكافأة" | "جزاء">("مكافأة");
  const [adjAmount, setAdjAmount] = useState("");
  const [adjDesc, setAdjDesc] = useState("");

  // --- Courier Handover States ---
  const [handoverAmount, setHandoverAmount] = useState("");
  const [handoverRef, setHandoverRef] = useState("");
  const [handoverDesc, setHandoverDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Populate drop-downs for Admin/Accountant
  async function fetchResourceLists() {
    if (isFinancial || role === "مشرف") {
      try {
        const resSuppliers = await apiCall("supplierAccounts", token);
        if (resSuppliers.ok && resSuppliers.accounts && resSuppliers.accounts.length > 0) {
          setAllSuppliers(resSuppliers.accounts);
          if (!selectedSupplier) setSelectedSupplier(resSuppliers.accounts[0].name);
        }
        const resCouriers = await apiCall("getCouriers", token);
        if (resCouriers.ok && resCouriers.couriers.length > 0) {
          setAllCouriers(resCouriers.couriers);
          if (!selectedCourier) setSelectedCourier(resCouriers.couriers[0].name);
        }
      } catch (err) {
        console.error("Failed to load selectors lists", err);
      }
    }
  }

  // --- Load Supplier accounts information ---
  async function loadSupplierLedger() {
    const targetSup = isSupplier ? user : selectedSupplier;
    if (!targetSup) return;

    setFeedback("");

    // Optimistically render from the client cache if available
    if (ledgerCache[targetSup]) {
      const cached = ledgerCache[targetSup];
      setSubscribes(cached.subscribes);
      setLiveBalance(cached.liveBalance);
      setSupplierStats(cached.stats);
      setDailyLedger(cached.dailyLedger || null);
      setLoading(false); // No full screen blocker
    } else {
      // Clear data to prevent old figures from sticking
      setSubscribes([]);
      setLiveBalance(0);
      setSupplierStats(null);
      setDailyLedger(null);
      setLoading(true);
    }

    try {
      const res = await apiCall("getSupplierLedger", token, {
        supplier: targetSup
      });
      if (res.ok) {
        const finalEntries = res.entries || [];
        const actualBalance = res.balance !== undefined ? res.balance : 0;
        const stats = res.stats || {
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
        };

        // Update the client local cache
        setLedgerCache(prev => ({
          ...prev,
          [targetSup]: {
            subscribes: finalEntries,
            liveBalance: actualBalance,
            stats: stats,
            dailyLedger: res.dailyLedger || null
          }
        }));

        setSubscribes(finalEntries);
        setLiveBalance(actualBalance);
        setSupplierStats(stats);
        setDailyLedger(res.dailyLedger || null);
      } else {
        setFeedback(res.error || "خطأ أثناء تحميل كشف حساب المورد");
      }
    } catch (err) {
      setFeedback("حدث خطأ في الشبكة أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  async function handleSettleDay(dateStr: string) {
    const targetSup = isSupplier ? user : selectedSupplier;
    if (!targetSup) return;
    if (!confirm(`هل أنت متأكد من تصفية وإقفال كاش تاريخ ${dateStr} للمورد (${targetSup}) وتسليمه كامل مستحقات هذا اليوم الحالية وتسجيل قفل المعاملة؟`)) {
      return;
    }
    setSettleDayProgress(dateStr);
    try {
      const res = await apiCall("settleSupplierDay", token, {
        supplier: targetSup,
        dateStr: dateStr
      });
      if (res.ok) {
        // Reload ledger
        await loadSupplierLedger();
      } else {
        alert(res.error || "فشل تصفية اليوم");
      }
    } catch (err) {
      alert("خطأ في الاتصال بالخادم أثناء التصفية");
    } finally {
      setSettleDayProgress("");
    }
  }

  // --- Load Courier salary summaries ---
  async function loadCourierLedger() {
    if (!selectedCourier && !isCourier) return;
    setLoading(true);
    setFeedback("");
    try {
      const res = await apiCall("getCourierLedger", token, {
        courier: isCourier ? user : selectedCourier,
        period: periodFilter
      });
      if (res.ok) {
        setCourierSummary(res.ledgerInfo);
        setCourierTrs(res.transactions || []);
      } else {
        setFeedback(res.error || "خطأ أثناء تحميل كشف حساب المندوب المالية");
      }
    } catch (err) {
      setFeedback("فشل الاتصال بالمسار المالي للمناديب");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchResourceLists();
  }, [token]);

  // Sync selectedSupplier with the user prop when it updates (especially on slow async logins)
  useEffect(() => {
    if (isSupplier && user) {
      setSelectedSupplier(user);
    }
  }, [isSupplier, user]);

  useEffect(() => {
    if (activeLedger === "supplier") {
      loadSupplierLedger();
    } else {
      loadCourierLedger();
    }
  }, [activeLedger, selectedSupplier, selectedCourier, periodFilter, user]);

  // Submit payment to supplier (Deducted from Ledger & Cashbox)
  async function handleSupplierPayout(e: React.FormEvent) {
    e.preventDefault();
    if (!payAmount || Number(payAmount) <= 0) {
      alert("الرجاء إدخال مبلغ صحيح");
      return;
    }
    setSubmittingLedger(true);
    try {
      const isWithdrawal = supplierTransType === "withdrawal";
      const res = await apiCall("addSupplierPayment", token, {
        supplier: selectedSupplier,
        amount: Number(payAmount),
        desc: payDesc.trim() || (isWithdrawal ? `سحب مالي / تسوية عكسية من المورد: ${selectedSupplier}` : `صرف دفعة للمورد: ${selectedSupplier}`),
        transactionType: supplierTransType
      });
      if (res.ok) {
        setPayAmount("");
        setPayDesc("");
        setSupplierTransType("payout");
        loadSupplierLedger();
        alert(isWithdrawal ? "✅ تم تسجيل السحب وتسويته بالخزنة بنجاح" : "✅ تم تسجيل السداد المالي وصرفه من الخزينة بنجاح");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("عطل في تسجيل العملية المالية");
    } finally {
      setSubmittingLedger(false);
    }
  }

  // Submit Adjustment to Courier Salary Ledger (Bonuses / Penalties)
  async function handleCourierAdjustment(e: React.FormEvent) {
    e.preventDefault();
    if (!adjAmount || Number(adjAmount) <= 0) {
      alert("يرجى إرساء قيمة تعديل صحيحة");
      return;
    }
    
    const val = Number(adjAmount);
    const type = adjustmentType;
    const desc = adjDesc.trim() || `${adjustmentType} للمندوب ${selectedCourier}`;
    const courier = selectedCourier;

    // 1. Reset inputs immediately for responsive Fire & Forget
    setAdjAmount("");
    setAdjDesc("");

    // 2. Optimistically update local UI states immediately (0.1 seconds response)
    if (courierSummary) {
      const isBonus = type === "مكافأة";
      const nextBonusesSum = courierSummary.bonusesSum + (isBonus ? val : 0);
      const nextPenaltiesSum = courierSummary.penaltiesSum + (!isBonus ? val : 0);
      const nextNetSalary = courierSummary.netSalary + (isBonus ? val : -val);
      const nextTodayBonuses = (courierSummary.todayBonuses || 0) + (isBonus ? val : 0);
      const nextTodayPenalties = (courierSummary.todayPenalties || 0) + (!isBonus ? val : 0);
      const nextRequiredHandoverToday = (courierSummary.requiredHandoverToday || 0) + (isBonus ? val : -val);

      setCourierSummary({
        ...courierSummary,
        bonusesSum: nextBonusesSum,
        penaltiesSum: nextPenaltiesSum,
        netSalary: nextNetSalary,
        todayBonuses: nextTodayBonuses,
        todayPenalties: nextTodayPenalties,
        requiredHandoverToday: nextRequiredHandoverToday
      });
    }

    // Append a mock transaction record to the logs so the director/accountant sees it immediately
    const mockTx = {
      courier,
      date: new Date().toISOString(),
      type,
      tracking: "ADJUST",
      amount: val,
      desc
    };
    setCourierTrs(prev => [mockTx, ...prev]);

    // Show success alert immediately without any waiting
    alert(`✅ تم حفظ تسوية الـ ${type} بنجاح وبدء يوم جديد (مزامنة خلفية جاهزة)`);

    // 3. Dispatch bg-sync events and invoke background API Call
    window.dispatchEvent(new CustomEvent("bg-sync-start"));

    apiCall("addCourierAdjustment", token, {
      courier,
      type,
      amount: val,
      desc
    })
      .then((res) => {
        if (res && res.ok) {
          console.log("Asynchronous courier adjustment saved successfully");
          // Silently reload the actual server ledger values
          loadCourierLedger();
        } else {
          console.error("Asynchronous courier adjustment sync error:", res?.error);
        }
      })
      .catch((err) => {
        console.error("Asynchronous courier adjustment call failed:", err);
      })
      .finally(() => {
        window.dispatchEvent(new CustomEvent("bg-sync-end"));
      });
  }

  // Settle and pull all courier active orders to warehouse
  async function handleSettleCourierOrders() {
    if (!selectedCourier) return;
    if (!confirm(`هل أنت متأكد من سحب جميع الشحنات وجرد المرتجعات الميدانية لـ (${selectedCourier})؟ \n\nسيتم سحب كافة الأوردرات المعلقة وتبرئة عهدة المندوب فوراً من الشاشة.`)) {
      return;
    }

    setSubmittingLedger(true);
    window.dispatchEvent(new CustomEvent("bg-sync-start"));

    apiCall("settleCourierOrders", token, {
      courier: selectedCourier
    })
      .then((res) => {
        if (res && res.ok) {
          alert(`✅ ${res.msg || "تم سحب وتصفية عهدة المندوب بالمستودع وتبرئته بنجاح!"}`);
          loadCourierLedger();
        } else {
          alert(`⚠️ عطل: ${res?.error || "فشل تصفية العهدة والفرز"}`);
        }
      })
      .catch((err) => {
        console.error("Settle courier orders error:", err);
        alert("⚠️ عطل عابر في تصفية عهدة المندوب");
      })
      .finally(() => {
        setSubmittingLedger(false);
        window.dispatchEvent(new CustomEvent("bg-sync-end"));
      });
  }

  // Submit Physical COD Handover from Courier directly to Centralized Cashbox
  async function handleCourierHandover(e: React.FormEvent) {
    e.preventDefault();
    if (!handoverAmount || Number(handoverAmount) <= 0) {
      alert("يرجى إدخال مبلغ صحيح للاستلام");
      return;
    }

    const val = Number(handoverAmount);
    const ref = handoverRef;
    const desc = handoverDesc.trim() || `استلام دفعة عهدة نقدية من المندوب: ${selectedCourier} بموجب وصل: ${handoverRef || "—"}`;
    const courier = selectedCourier;

    // 1. Reset inputs immediately for responsive Fire & Forget
    setHandoverAmount("");
    setHandoverRef("");
    setHandoverDesc("");

    // 2. Optimistically update local UI states immediately (0.1 seconds response)
    if (courierSummary) {
      const nextPaid = (courierSummary.totalPaidToCompany || 0) + val;
      const nextDeficit = (courierSummary.totalCollected || 0) - nextPaid;

      setCourierSummary({
        ...courierSummary,
        totalPaidToCompany: nextPaid,
        deficit: nextDeficit
      });
    }

    // Show success alert immediately
    alert(`✅ تم استلام دفعة عهدة المندوب بنجاح وتصفية العجز وجاري ترحيل التعديلات للخلفية...`);

    // 3. Dispatch bg-sync events and invoke background API Call
    window.dispatchEvent(new CustomEvent("bg-sync-start"));

    apiCall("addCashbox", token, {
      type: "استلام عهدة مندوب",
      ref: courier,
      amount: val,
      desc
    })
      .then((res) => {
        if (res && res.ok) {
          console.log("Asynchronous cashbox handover synchronization complete");
          loadCourierLedger();
        } else {
          console.error("Asynchronous cashbox handover saved, error during refresh:", res?.error);
        }
      })
      .catch((err) => {
        console.error("Asynchronous cashbox handover background call failed:", err);
      })
      .finally(() => {
        window.dispatchEvent(new CustomEvent("bg-sync-end"));
      });
  }

  return (
    <div className="p-4 space-y-6 select-none font-sans text-right">
      {/* Ledger Mode Filter (Hidden if activeLedgerMode is provided to ensure absolute view isolation) */}
      {isFinancial && !activeLedgerMode && (
        <div className="flex bg-slate-950 border border-white/6 rounded-xl p-1 max-w-[400px] mx-auto">
          <button
            onClick={() => setActiveLedger("courier")}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeLedger === "courier"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🛵 كشف حساب المناديب
          </button>
          <button
            onClick={() => setActiveLedger("supplier")}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeLedger === "supplier"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📦 كشف حساب الموردين
          </button>
        </div>
      )}

      {/* --- SUPPLIER LEDGER WORKSPACE --- */}
      {activeLedger === "supplier" && (
        <div className="space-y-6">
          {/* Target Selector details for Financial staffs */}
          {isFinancial && (
            <div className="flex items-center justify-between gap-4 bg-slate-900 border border-white/6 p-4 rounded-xl shadow-inner">
              <span className="text-xs font-extrabold text-slate-400 whitespace-nowrap">اختر المورد المراد عرض حسابه بالأيام:</span>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none"
              >
                {allSuppliers.map((s, idx) => (
                  <option key={idx} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Supplier Header Card / KPI Banners */}
          <div className="bg-gradient-to-l from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/20 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute top-3 left-3 text-emerald-500/10">
              <Wallet size={64} />
            </div>

            <span className="px-3.5 py-1.5 bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[10.5px] font-black rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <span>🏆 كشف الحساب التراكمي وتصفية كاش المورد</span>
              <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            </span>

            <div className="text-4xl font-mono font-black text-emerald-400 tracking-tight">
              {Number(liveBalance || 0).toLocaleString("ar")}{" "}
              <span className="text-sm font-medium">جنيهاً مصرياً</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed font-bold max-w-2xl mx-auto">
              هذه القيمة تمثل مجموع مستحقات <span className="text-emerald-400">جميع الأيام المعلقة</span> (صافي مستحقات الأيام التي لم تصفى بعد)، وهي تتأثر تلقائياً بمجرد نقر المدير على زر التصفية اليومية.
            </p>

            {/* Quick Metrics */}
            {dailyLedgers && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-5xl mx-auto pt-2">
                <div className="bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center shadow-md">
                  <div className="text-[10px] font-black text-slate-400">إجمالي البضاعة المرفوعة</div>
                  <div className="text-sm font-mono font-bold text-slate-200 mt-1">
                    {Number(dailyLedgers.totalGoodsUploaded || 0).toLocaleString("ar")} ج.م
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-amber-500/20 p-3 rounded-xl text-center shadow-md">
                  <div className="text-[10px] font-black text-amber-500">صافي قيمة البضاعة (تسليم وجزئي)</div>
                  <div className="text-sm font-mono font-bold text-amber-450 mt-1">
                    {Number(dailyLedgers.overallNetProductValue || 0).toLocaleString("ar")} ج.م
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center shadow-md">
                  <div className="text-[10px] font-black text-slate-400">المرتجع المعتمد المستلم</div>
                  <div className="text-sm font-mono font-bold text-red-400 mt-1">
                    {Number(dailyLedgers.returnsDeliveredValue || 0).toLocaleString("ar")} ج.م
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center shadow-md">
                  <div className="text-[10px] font-black text-slate-400">إجمالي الدفعات المسددة</div>
                  <div className="text-sm font-mono font-bold text-indigo-400 mt-1">
                    {Number(dailyLedgers.globalPayments || 0).toLocaleString("ar")} ج.م
                  </div>
                </div>
                <div className="bg-slate-950/85 border-2 border-emerald-500/20 p-3 rounded-xl text-center shadow-md">
                  <div className="text-[10px] font-black text-emerald-400">مستحقات معلقة تصفية نهائية</div>
                  <div className="text-sm font-mono font-bold text-emerald-300 mt-1">
                    {Number(dailyLedgers.outstandingBalance || 0).toLocaleString("ar")} ج.م
                  </div>
                </div>
                <div className="bg-slate-950/80 border border-white/4 p-3 rounded-xl text-center col-span-2 sm:col-span-1 shadow-md">
                  <div className="text-[10px] font-black text-slate-400">حالة الأيام</div>
                  <div className="text-[10px] font-bold text-slate-300 mt-1 flex justify-around border-t border-white/5 pt-1">
                    <span className="text-red-350">🔴 {dailyLedgers.days.filter((d: any) => !d.isSettled).length} معلق</span>
                    <span className="text-emerald-400">🟢 {dailyLedgers.days.filter((d: any) => d.isSettled).length} مصفى</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Days Explorer Block */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-white/6 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <Calendar className="text-amber-500" size={18} />
                <h3 className="text-xs font-black text-slate-300">سجل كشوف الحساب اليومية التفصيلية للأيام والدفعات</h3>
              </div>
              <div className="relative w-full sm:w-[280px]">
                <span className="absolute inset-y-0 right-3 flex items-center pr-1 text-slate-550">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="ابحث بالتاريخ (مثال: 2026-06)..."
                  value={daySearchQuery}
                  onChange={(e) => setDaySearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/8 rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16 space-y-3">
                <Loader2 size={36} className="text-amber-500 animate-spin mx-auto" />
                <div className="text-xs text-slate-400 animate-pulse font-bold">جاري حساب وتجميع كشف الأيام للمورد ديناميكياً...</div>
              </div>
            ) : !dailyLedgers || (dailyLedgers.days.length === 0 && (!dailyLedgers.paymentEntries || dailyLedgers.paymentEntries.length === 0)) ? (
              <div className="bg-slate-900/50 border border-white/4 rounded-2xl py-12 text-center text-xs text-slate-405 font-bold">
                🫙 لا يوجد أوردرات أو معاملات مسجلة كحساب يومي تحت اسم هذا المورد حالياً
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const daysFiltered = dailyLedgers.days.map((d: any) => ({ ...d, timelineType: "day" }));
                  const paymentsFiltered = (dailyLedgers.paymentEntries || []).map((p: any) => ({ ...p, timelineType: "payment" }));
                  
                  const mergedTimeline = [...daysFiltered, ...paymentsFiltered];
                  
                  // Sort by date (descending)
                  mergedTimeline.sort((a, b) => {
                    const dateA = a.date ? a.date.split("T")[0] : "";
                    const dateB = b.date ? b.date.split("T")[0] : "";
                    return dateB.localeCompare(dateA);
                  });

                  const finalFiltered = mergedTimeline.filter((item: any) => {
                    if (!daySearchQuery) return true;
                    return item.date && item.date.includes(daySearchQuery);
                  });

                  if (finalFiltered.length === 0) {
                    return (
                      <div className="col-span-2 bg-slate-900/50 border border-white/4 rounded-2xl py-12 text-center text-xs text-slate-405 font-bold">
                        🔍 لا توجد أوردرات أو حركات سداد مطابقة للبحث حالياً
                      </div>
                    );
                  }

                  return finalFiltered.map((item: any, idx: number) => {
                    if (item.timelineType === "payment") {
                      return (
                        <div
                          key={`p-${idx}`}
                          className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-500/10 hover:border-indigo-500/25 rounded-2xl p-5 space-y-4 shadow-md transition-all hover:translate-y-[-2px] relative overflow-hidden text-right"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
                          <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                            <span className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                              <Wallet size={14} className="text-indigo-400" />
                              <span>يوم: {item.date}</span>
                            </span>
                            <span className="px-3 py-1 text-[10px] font-black rounded-lg bg-indigo-950/50 border border-indigo-900/50 text-indigo-300 flex items-center gap-1">
                              <span>💳 دفعة نقدية مسددة</span>
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="bg-slate-950/80 border border-indigo-500/5 p-3 rounded-xl flex justify-between items-center">
                              <span className="text-[10px] text-slate-400 font-bold block">القيمة المالية المصروفة للمورد</span>
                              <span className="text-sm font-mono font-black text-indigo-350">
                                -{Number(item.amount || 0).toLocaleString("ar")} ج.م
                              </span>
                            </div>
                            <div className="bg-slate-950/60 border border-white/4 p-2.5 rounded-xl">
                              <span className="text-[9.5px] text-slate-400 block font-bold">البيان / تفاصيل الدفعة</span>
                              <span className="text-xs text-slate-300 font-medium block mt-1 leading-relaxed">
                                {item.desc || "حركة صرف نقدية وتصفية حساب"}
                              </span>
                            </div>
                            {item.tracking && (
                              <div className="text-[10px] text-slate-500 font-mono text-left pt-1">
                                الرقم المرجعي: {item.tracking}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    const isPending = !item.isSettled;
                    return (
                      <div
                        key={`d-${idx}`}
                        className={`bg-slate-900 border rounded-2xl p-5 space-y-4 shadow-md transition-all hover:translate-y-[-2px] text-right ${
                          isPending ? "border-amber-500/10 hover:border-amber-500/25" : "border-emerald-500/10 hover:border-emerald-500/25"
                        }`}
                      >
                        {/* Day Card Header */}
                        <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                          <span className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                            <Clock size={14} className="text-slate-400" />
                            <span>يوم: {item.date}</span>
                          </span>
                          <span
                            className={`px-3 py-1 text-[10px] font-black rounded-lg ${
                              isPending
                                ? "bg-amber-950/50 border border-amber-900/50 text-amber-400"
                                : "bg-emerald-950/50 border border-emerald-900/50 text-emerald-400"
                            }`}
                          >
                            {isPending ? "🔴 معلق لم يصفى" : "🟢 تم تصفية الكاش والمرتجع"}
                          </span>
                        </div>

                        {/* Day Financial Grid Stats */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                          <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                            <span className="text-[9.5px] text-slate-400 block font-bold">إجمالي قيمة الشغل (COD كلي)</span>
                            <span className="text-xs font-mono font-black text-slate-200">{Number(item.totalWorkValue || 0).toLocaleString("ar")} ج.م</span>
                          </div>
                          <div className="bg-slate-950 border border-amber-500/20 p-2.5 rounded-xl">
                            <span className="text-[9.5px] text-amber-500 block font-bold">صافي ثمن البضاعة (بدون شحن)</span>
                            <span className="text-xs font-mono font-bold text-amber-400">{Number(item.netProductValue || 0).toLocaleString("ar")} ج.م</span>
                          </div>
                          <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                            <span className="text-[9.5px] text-slate-400 block font-bold">إجمالي التحصيل الفعلي الميداني</span>
                            <span className="text-xs font-mono font-black text-emerald-400">{Number(item.totalActualCollected || 0).toLocaleString("ar")} ج.م</span>
                          </div>
                          <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                            <span className="text-[9.5px] text-slate-400 block font-bold">المرتجع المسترد اليوم</span>
                            <span className="text-xs font-mono font-black text-red-400">{Number(item.returnedValueRefunded || 0).toLocaleString("ar")} ج.م</span>
                          </div>
                          <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                            <span className="text-[9.5px] text-slate-400 block font-bold">خصم شحن المرتجعات</span>
                            <span className="text-xs font-mono font-black text-slate-350">{Number(item.returnShippingFees || 0).toLocaleString("ar")} ج.م</span>
                          </div>
                        </div>

                        {/* Net Dues Container */}
                        <div className="bg-slate-950 border border-white/6 p-3.5 rounded-xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-black">صافي حساب اليوم:</span>
                            <span className="text-2xs text-slate-500 font-semibold">(إجمالي التحصيل الفعلي - مرتجعات مستلمة - نقدية مصروفة باليوم)</span>
                          </div>
                          <div className="text-base font-mono font-black text-emerald-400 text-left">
                            {Number(item.netDues || 0).toLocaleString("ar")} ج.م
                          </div>
                        </div>

                        {/* Actions Inside Card */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDayDate(item.date);
                              setSelectedDayStatus(item.status);
                              setSelectedDayOrdersDetail(item.orders);
                            }}
                            className="bg-slate-950 hover:bg-slate-950/80 border border-white/8 text-slate-200 py-2.5 px-3 rounded-lg text-2xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Eye size={13} className="text-amber-500" />
                            <span>تفاصيل أوردرات اليوم</span>
                          </button>

                          {isFinancial && isPending ? (
                            <button
                              type="button"
                              disabled={settleDayProgress === item.date}
                              onClick={() => handleSettleDay(item.date)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-slate-950 py-2.5 px-3 rounded-lg text-2xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                            >
                              {settleDayProgress === item.date ? (
                                <Loader2 size={13} className="animate-spin text-slate-950" />
                              ) : (
                                <CheckCircle2 size={13} className="text-slate-950" />
                              )}
                              <span>تقفيل وتسليم الكاش المالي</span>
                            </button>
                          ) : (
                            <div className="bg-emerald-950/30 border border-emerald-900/30 text-emerald-400 py-2.5 px-3 rounded-lg text-2xs font-bold flex items-center justify-center gap-1">
                              <Check size={12} />
                              <span>حساب مقفل ومصفى تماماً</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- COURIER LEDGER WORKSPACE --- (Fixes Courier Salary screen failure) */}
      {activeLedger === "courier" && (
        <div className="space-y-6">
          {/* Target Courier selection detail */}
          {isFinancial && (
            <div className="flex items-center justify-between gap-4 bg-slate-900 border border-white/6 p-4 rounded-xl">
              <span className="text-xs font-extrabold text-slate-400">تابع موازنة المندوب:</span>
              <select
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold text-slate-200 focus:outline-none"
              >
                {allCouriers.map((c, idx) => (
                  <option key={idx} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Timeframe Filter (day, week, month) */}
          <div className="flex items-center gap-2 bg-slate-900 border border-white/6 p-3 rounded-xl justify-between">
            <span className="text-xs font-bold text-slate-450 flex items-center gap-1.5">
              <Filter size={14} />
              تصفية الحسابات والعمولات:
            </span>
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-white/4">
              {(["day", "week", "month"] as const).map((p) => {
                const labels = { day: "اليوم", week: "الأسبوع", month: "الشهر" };
                return (
                  <button
                    key={p}
                    onClick={() => setPeriodFilter(p)}
                    className={`px-3 py-1 text-[10px] font-black rounded-md cursor-pointer transition-all ${
                      periodFilter === p ? "bg-amber-600 text-slate-950" : "text-slate-400"
                    }`}
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Earning Calculations (Sixth Point - Courier Ledger Sheet!) */}
          {courierSummary && (
            <div className="space-y-4">
              {/* Today's Courier Financial Performance Table */}
              <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-black text-amber-500 border-b border-white/6 pb-2">
                   📊 جدول المطابقة المالية للمندوب (مسترجع لحظياً من Google Sheets)
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-extrabold">
                        <th className="py-2 px-3 text-right">كشف الحساب</th>
                        <th className="py-2 px-3 text-center">البيان الميداني</th>
                        <th className="py-2 px-3 text-left">القيمة المالية</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/4 hover:bg-slate-950/40">
                        <td className="py-3 px-3 font-semibold text-slate-200">الراتب الأساسي للشهر</td>
                        <td className="py-3 px-3 text-slate-450 text-center font-bold">تعيين تعاقدي ثابت</td>
                        <td className="py-3 px-3 text-left font-mono font-black text-slate-200">
                          {(courierSummary.basicSalary || 0).toLocaleString("ar")} ج.م
                        </td>
                      </tr>
                      <tr className="border-b border-white/4 hover:bg-slate-950/40">
                        <td className="py-3 px-3 font-semibold text-slate-200">عدد الطلبات التي تم تسليمها اليوم</td>
                        <td className="py-3 px-3 text-emerald-400 text-center font-bold">
                          {(courierSummary.todayDeliveredCount || 0)} شحنة اليوم
                        </td>
                        <td className="py-3 px-3 text-left font-mono font-black text-emerald-400">
                          +{(courierSummary.todayDelivCommission || 0).toLocaleString("ar")} ج.م (عمولة اليوم)
                        </td>
                      </tr>
                      <tr className="border-b border-white/4 hover:bg-slate-950/40 font-bold">
                        <td className="py-3 px-3 text-slate-300">إجمالي عمولات التوصيل (جميع الفترات)</td>
                        <td className="py-3 px-3 text-slate-400 text-center">
                          {(courierSummary.deliveredCount || 0)} أوردر مسلّم كلياً
                        </td>
                        <td className="py-3 px-3 text-left font-mono font-black text-emerald-500">
                          +{(courierSummary.delivCommission || 0).toLocaleString("ar")} ج.م
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-950/40 font-black text-sm text-amber-500 bg-amber-950/10">
                        <td className="py-3 px-3">الراتب الصافي الإجمالي المستحق</td>
                        <td className="py-3 px-3 text-center text-xs">شامل العمولات والمكافآت والخصومات</td>
                        <td className="py-3 px-3 text-left font-mono">
                          {(courierSummary.netSalary || 0).toLocaleString("ar")} ج.م
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cumulative Daily Earnings Ledger (Live chronologically tracked table) */}
              <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-white/6 pb-2">
                  <h3 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>📅 دفتر يومية الأرباح التراكمية (Cumulative Daily Ledger)</span>
                  </h3>
                  <span className="text-[9px] font-bold bg-amber-950/20 text-amber-500 border border-amber-900/40 px-2 py-0.5 rounded">
                     محدث لـ {new Date().getFullYear()}/{String(new Date().getMonth() + 1).padStart(2, "0")}
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-500 pb-1">
                  رصد يومي مستمر للمعادلة المعتمدة: الراتب اليومي الثابت (الراتب الأساسي / أيام الشهر) + (عدد التسليمات × {courierSummary.commission_success || 25}) + (عدد المرتجعات × {courierSummary.commission_return || 10}).
                </p>

                <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                  <table className="w-full text-right text-xs border-collapse">
                    <thead className="sticky top-0 bg-slate-900 z-10">
                      <tr className="border-b border-white/10 text-slate-400 font-extrabold text-[10px]">
                        <th className="py-2 px-3 text-right">اليوم والتاريخ</th>
                        <th className="py-2 px-3 text-center">التسليمات</th>
                        <th className="py-2 px-3 text-center">المرتجعات</th>
                        <th className="py-2 px-3 text-center">حصة الراتب اليومي</th>
                        <th className="py-2 px-3 text-center">العمولات المكتسبة</th>
                        <th className="py-2 px-3 text-left">صافي اليوم</th>
                        <th className="py-2 px-3 text-left">التراكمي المتراكم</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(!courierSummary.dailyEarnings || courierSummary.dailyEarnings.length === 0) ? (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-slate-500 text-xs">
                            لا يوجد سجل حركات يومية متاح لهذا الشهر للأن
                          </td>
                        </tr>
                      ) : (
                        courierSummary.dailyEarnings.map((dItem: any, idx: number) => {
                          const dailyCommissions = (dItem.delivered * (courierSummary.commission_success || 25)) + (dItem.returned * (courierSummary.commission_return || 10));
                          return (
                            <tr key={idx} className={`border-b border-white/4 text-[11px] hover:bg-slate-950/40 transition-colors ${idx === 0 ? "bg-amber-500/5 animate-pulse" : ""}`}>
                              <td className="py-3 px-3 font-bold text-slate-200">{dItem.date} {idx === 0 ? " (اليوم)" : ""}</td>
                              <td className={`py-3 px-3 text-center font-black ${dItem.delivered > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                                {dItem.delivered} شحنة
                              </td>
                              <td className={`py-3 px-3 text-center font-black ${dItem.returned > 0 ? "text-amber-500" : "text-slate-500"}`}>
                                {dItem.returned} شحنة
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-slate-400">{(dItem.baseEarning || 0).toFixed(2)} ج.م</td>
                              <td className={`py-3 px-3 text-center font-mono ${dailyCommissions > 0 ? "text-emerald-400 font-bold" : "text-slate-500"}`}>
                                {dailyCommissions > 0 ? `+${dailyCommissions.toLocaleString("ar")}` : "0"} ج.م
                              </td>
                              <td className="py-3 px-3 text-left font-mono font-black text-amber-500">
                                {dItem.total.toLocaleString("ar")} ج.م
                              </td>
                              <td className="py-3 px-3 text-left font-mono font-black text-emerald-400 bg-emerald-950/5">
                                {dItem.cumulative.toLocaleString("ar")} ج.م
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
                <div className="text-center bg-slate-950/80 border border-white/4 py-5 rounded-xl space-y-1 relative">
                  <div className="text-[10px] font-extrabold tracking-widest text-slate-450 uppercase">
                    صافي مستحقات المندوب للتقفيل ({periodFilter === "day" ? "اليومي" : periodFilter === "week" ? "الأسبوعي" : "الشهري"})
                  </div>
                  <div className="text-3xl font-black text-amber-500">
                    {courierSummary.netSalary.toLocaleString("ar")} <span className="text-xs">ج.م</span>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    الراتب الأساسي مفلتر + عمولات التسليم + عمولات المرتجعات مدفوعة الشحن + المكافآت - الجزاءات
                  </div>
                </div>

                {/* Grid Breakdown */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl text-center border border-white/4">
                    <div className="text-[18px] text-amber-400 font-black font-mono">
                      {courierSummary.basicSalary.toLocaleString("ar")} ج
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold mt-1">الراتب الأساسي المفترض</div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl text-center border border-white/4">
                    <div className="text-[18px] text-emerald-400 font-black font-mono">
                      {courierSummary.delivCommission.toLocaleString("ar")} ج
                    </div>
                    <div className="text-[9px] text-slate-500 font-bold mt-1">
                      عمولة التسليم ({courierSummary.deliveredCount} أوردر)
                    </div>
                  </div>

                <div className="bg-slate-950 p-3 rounded-xl text-center border border-white/4">
                  <div className="text-[18px] text-emerald-400 font-black font-mono">
                    {courierSummary.returnShippingCommission.toLocaleString("ar")} ج
                  </div>
                  <div className="text-[9px] text-slate-500 font-bold mt-1">
                    مرتجع دفع شحن ({courierSummary.returnedPaidCount} أوردر)
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl text-center border border-white/4">
                  <div className="text-[18px] font-black font-mono text-cyan-400">
                    {courierSummary.bonusesSum.toLocaleString("ar")} ج
                  </div>
                  <div className="text-[9px] text-slate-505 font-bold mt-1">مكافآت وتكريمات مضافة</div>
                </div>

                <div className="col-span-2 md:col-span-4 bg-red-950/15 border border-red-950/40 p-3.5 rounded-xl text-center flex items-center justify-between">
                  <div className="text-[9px] text-red-400/80 font-bold uppercase flex items-center gap-1">
                    <ShieldAlert size={14} />خصومات وجزاءات المندوب (مؤثرة سلباً على الراتب):
                  </div>
                  <span className="text-sm font-black text-red-400 font-mono">
                    -{courierSummary.penaltiesSum.toLocaleString("ar")} ج.م
                  </span>
                </div>
              </div>
            </div>
            </div>
          )}

          {/* --- ANTI-LOSS COD & DEFICIT TRACKER CARD --- */}
          {courierSummary && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-white/6 rounded-2xl p-5 space-y-4">
              <div className="border-b border-white/6 pb-2">
                <h3 className="text-xs font-black text-rose-400 flex items-center justify-between">
                  <span>🚨 جهاز تعقب عهدة الـ COD ومنع العجز (المطابقة اللحظية)</span>
                  <span className="text-[10px] font-bold bg-rose-950/20 text-rose-500 border border-rose-900/40 px-2 py-0.5 rounded">
                     نظام حماية الحصيلة 100%
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">مطابقة النقدية المستلمة في الخزنة مع المجموع المستلم مع المندوبين وتحديد الفروقات.</p>
              </div>

              {/* COD Stat Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-4 border border-white/4 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">إجمالي النقدية المحصلة (COD)</div>
                  <div className="text-xl font-black text-slate-200 font-mono">
                    {Number(courierSummary.totalCollected || 0).toLocaleString("ar")} <span className="text-xs font-medium">ج.م</span>
                  </div>
                  <div className="text-[9px] text-slate-500">مجموع الأوردرات المسلّمة بنجاح</div>
                </div>

                <div className="bg-slate-950 p-4 border border-white/4 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-slate-400">ما تم إيداعه بالشركة فعلياً</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    {Number(courierSummary.totalPaidToCompany || 0).toLocaleString("ar")} <span className="text-xs font-medium">ج.م</span>
                  </div>
                  <div className="text-[9px] text-emerald-500">إجمالي التوريدات المسجلة بالخزنة</div>
                </div>

                 <div className={`p-4 rounded-xl space-y-1 border ${
                  (courierSummary.deficit || 0) > 0 
                  ? "bg-rose-950/15 border-rose-900/40" 
                  : "bg-emerald-950/10 border-emerald-900/30"
                }`}>
                  <div className="text-[10px] font-bold text-slate-200">العهدة المعلقة مع المندوب (Courier Custody)</div>
                  <div className={`text-xl font-black font-mono ${(courierSummary.deficit || 0) > 0 ? "text-rose-450" : "text-emerald-400"}`}>
                    {Number(courierSummary.deficit || 0).toLocaleString("ar")} <span className="text-xs font-medium">ج.م</span>
                  </div>
                  <div className="text-[9px] text-slate-400 leading-none">
                    {(courierSummary.deficit || 0) > 0 ? "⚠️ توجد عهدة مالية في الشارع لم تُسلم بعد للشركة" : "✅ ذمة المندوب خالية تماماً من العهدة"}
                  </div>
                </div>
              </div>

              {/* Handover payout form */}
              {isFinancial && (
                <div className="bg-slate-950 p-4 rounded-xl border border-white/4 space-y-4">
                  <h4 className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5 border-b border-white/6 pb-2">
                     🤝 بوابة التسوية والمطابقة وجهاً لوجه لـ {selectedCourier}
                  </h4>

                  {/* Strict Settlement Verification Box */}
                  <div className="bg-indigo-950/25 border border-indigo-500/25 p-3.5 rounded-xl space-y-3">
                    <h5 className="text-[10px] font-black text-indigo-400 flex items-center gap-1.5 justify-between">
                      <span>🔒 تصفية الحساب الإلكترونية الموحدة (Rider Settlement)</span>
                      <span className="bg-indigo-950 text-[9px] text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-950/50">تاريخ اليوم الحالي المفلتر</span>
                    </h5>
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5">
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">1. كاش المسلَّم اليوم</span>
                        <div className="text-sm font-extrabold text-emerald-400 mt-0.5 font-mono">{(courierSummary.todayDeliveredCash || 0).toLocaleString("ar")} ج.م</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">2. كاش شحن المرتجع اليوم</span>
                        <div className="text-sm font-extrabold text-teal-400 mt-0.5 font-mono">{(courierSummary.todayReturnedPaidCash || 0).toLocaleString("ar")} ج.م</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">3. عمولة المندوب اليوم</span>
                        <div className="text-sm font-extrabold text-rose-400 mt-0.5 font-mono">-{(courierSummary.todayTotalCommission || 0).toLocaleString("ar")} ج.م</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">4. جزاءات اليوم</span>
                        <div className="text-sm font-extrabold text-red-500 mt-0.5 font-mono">-{(courierSummary.todayPenalties || 0).toLocaleString("ar")} ج.م</div>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-white/4 text-right">
                        <span className="text-[9px] text-slate-400 block font-bold">5. مكافآت اليوم</span>
                        <div className="text-sm font-extrabold text-cyan-400 mt-0.5 font-mono">+{(courierSummary.todayBonuses || 0).toLocaleString("ar")} ج.م</div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-950 border border-white/4 p-3 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-right">
                      <div className="space-y-1">
                        <div className="text-[9px] font-bold text-indigo-400">الصافي المالي المطلوب توريده رسمياً للخزنة الآن:</div>
                        <div className="text-[8.5px] text-slate-400 font-sans leading-relaxed">
                          (كاش المسلَّم [{(courierSummary.todayDeliveredCash || 0).toLocaleString("ar")}] + كاش شحن المرتجع [{(courierSummary.todayReturnedPaidCash || 0).toLocaleString("ar")}]) - عمولات اليوم [{(courierSummary.todayTotalCommission || 0).toLocaleString("ar")}] - جزاءات اليوم [{(courierSummary.todayPenalties || 0).toLocaleString("ar")}] + مكافآت اليوم [{(courierSummary.todayBonuses || 0).toLocaleString("ar")}].
                        </div>
                      </div>
                      <div className="bg-indigo-950 border border-indigo-400/30 px-5 py-2 rounded-lg text-center shrink-0">
                        <span className="text-[8.5px] text-slate-300 font-extrabold block mb-0.5">العهدة الصافية للتوريد</span>
                        <span className="text-[17px] font-black text-indigo-300 font-mono">
                          {(courierSummary.requiredHandoverToday !== undefined ? courierSummary.requiredHandoverToday : ((courierSummary.todayDeliveredCash || 0) + (courierSummary.todayReturnedPaidCash || 0) - (courierSummary.todayTotalCommission || 0) - (courierSummary.todayPenalties || 0) + (courierSummary.todayBonuses || 0))).toLocaleString("ar")} ج.م
                        </span>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleCourierHandover} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">المبلغ المستلم بالجنيه*</label>
                      <input 
                        type="number"
                        required
                        value={handoverAmount}
                        onChange={(e) => setHandoverAmount(e.target.value)}
                        placeholder="3500"
                        className="w-full bg-slate-900 text-slate-200 border border-white/8 rounded-lg px-2.5 py-2 text-xs font-mono text-right"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">رقم إيصال الاستلام (REF)*</label>
                      <input 
                        type="text"
                        required
                        value={handoverRef}
                        onChange={(e) => setHandoverRef(e.target.value)}
                        placeholder="REC-5502..."
                        className="w-full bg-slate-900 text-slate-200 border border-white/8 rounded-lg px-2.5 py-2 text-xs text-right"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] text-slate-400 font-bold">بيان إضافي (اختياري)</label>
                      <input 
                        type="text"
                        value={handoverDesc}
                        onChange={(e) => setHandoverDesc(e.target.value)}
                        placeholder="توريد الوردية المسائية..."
                        className="w-full bg-slate-900 text-slate-200 border border-white/8 rounded-lg px-2.5 py-2 text-xs text-right"
                      />
                    </div>

                     <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                       <button
                        type="submit"
                        disabled={submittingLedger}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        🤝 تسوية حساب المندوب المالي وإيداع الخزنة
                      </button>
                      <button
                        type="button"
                        onClick={handleSettleCourierOrders}
                        disabled={submittingLedger}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-slate-950 font-black text-xs py-3 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                      >
                        🔄 سحب الأوردرات للمستودع وتصفية العهدة اللوجستية
                      </button>
                     </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Add Adjustments Form (Only Accountant/Admin) */}
          {isFinancial && (
            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-400">➕ إضافة تسوية مالية للمندوب (مكافأة أو جزاء)</h3>
              <form onSubmit={handleCourierAdjustment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">نوع التسوية</label>
                  <select
                    value={adjustmentType}
                    onChange={(e) => setAdjustmentType(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="مكافأة">مكافأة مضافة (+)</option>
                    <option value="جزاء">جزاء مخصوم (-)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">القيمة المالية (ج.م)*</label>
                  <input
                    type="number"
                    required
                    value={adjAmount}
                    onChange={(e) => setAdjAmount(e.target.value)}
                    placeholder="100"
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">البيان / السبب</label>
                  <input
                    type="text"
                    value={adjDesc}
                    onChange={(e) => setAdjDesc(e.target.value)}
                    placeholder="مكافأة تميز / تأخر عن التسليم..."
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingLedger}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 px-4 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                >
                  حفظ التسوية ومزامنة الخزنة
                </button>
              </form>
            </div>
          )}

          {/* Courier dynamic entries timeline log */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-400 flex items-center justify-between border-b border-white/6 pb-2">
              <span>📊 حركات وتسويات عمولات المندوب</span>
              <FileText size={16} className="text-slate-500" />
            </h3>

            {loading ? (
              <div className="text-center py-6 text-xs text-slate-500 animate-pulse">جاري تحميل حركات المندوب...</div>
            ) : courierTrs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">لا يوجد حركات مسجلة لهذا المندوب حالياً</div>
            ) : (
              <div className="space-y-3">
                {courierTrs.map((e: any, idx: number) => {
                  const isPositive = e.type !== "جزاء";
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-white/4 p-4 rounded-xl flex items-center justify-between hover:bg-slate-950/70"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-lg text-xs ${isPositive ? "text-emerald-400 bg-emerald-950/20" : "text-red-400 bg-red-950/20"}`}>
                          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-200">{e.desc || e.type}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-semibold">
                            {e.date} {e.tracking !== "ADJUST" ? `· الأوردر ${e.tracking}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className={`text-xs font-black font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {isPositive ? "+" : "-"}
                        {e.amount.toLocaleString("ar")} ج
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🔍 Deep-Dive Daily Financial Ledger Modal */}
      {selectedDayOrdersDetail && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/10 rounded-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-right animate-fadeIn">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-white/8 flex items-center justify-between bg-slate-900">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <Shield size={16} className="text-amber-500" />
                  <span>🔍 كشف الحساب التفصيلي للطلبات - ليوم {selectedDayDate}</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-bold">
                  حالة اليوم الحالية: <span className={selectedDayStatus === "pending" ? "text-amber-450" : "text-emerald-400"}>{selectedDayStatus === "pending" ? "🔴 معلق لم يصفى" : "🟢 تم تصفيته وقفل حسابه"}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedDayOrdersDetail(null);
                  setSelectedDayDate("");
                  setModalSearchFilter("");
                }}
                className="p-1 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 bg-slate-950 border-b border-white/4">
              <div className="relative">
                <span className="absolute inset-y-0 right-3 flex items-center pr-1 text-slate-550">
                  <Search size={14} />
                </span>
                <input
                  type="text"
                  placeholder="ابحث باسم العميل، رقم الهاتف، كود التتبع، أو حالة الأوردر..."
                  value={modalSearchFilter}
                  onChange={(e) => setModalSearchFilter(e.target.value)}
                  className="w-full bg-slate-900 border border-white/8 rounded-lg pr-9 pl-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Modal Table Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="overflow-x-auto border border-white/6 rounded-xl">
                <table className="w-full text-right border-collapse text-2xs font-semibold">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-white/6 font-bold">
                      <th className="p-3">رقم التتبع</th>
                      <th className="p-3">اسم العميل</th>
                      <th className="p-3">الهاتف</th>
                      <th className="p-3">المحافظة</th>
                      <th className="p-3">الحالة الحالية</th>
                      <th className="p-3 text-left">قيمة المنتج الصافي</th>
                      <th className="p-3 text-left">مصاريف الشحن</th>
                      <th className="p-3 text-left">COD المطلوب الكلي</th>
                      <th className="p-3 text-left">الكاش المحصل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {selectedDayOrdersDetail
                      .filter((o: any) => {
                        const term = modalSearchFilter.toLowerCase().trim();
                        if (!term) return true;
                        return (
                          (o.trackingId || "").toLowerCase().includes(term) ||
                          (o.custName || "").toLowerCase().includes(term) ||
                          (o.custPhone || "").toLowerCase().includes(term) ||
                          (o.status || "").toLowerCase().includes(term)
                        );
                      })
                      .map((o: any, oIdx: number) => {
                        const isDelivered = ["تم التسليم", "تسليم جزئي"].includes(o.status);
                        const isReturned = (o.status || "").includes("مرتجع") || ["قيد المرتجع"].includes(o.status);
                        return (
                          <tr key={oIdx} className="hover:bg-slate-900/40">
                            <td className="p-3 font-mono text-slate-300 select-all">{o.trackingId}</td>
                            <td className="p-3 text-slate-100 font-bold">{o.custName}</td>
                            <td className="p-3 font-mono text-slate-300">{o.custPhone}</td>
                            <td className="p-3 text-slate-400">{o.custProvince || "—"}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isDelivered
                                    ? "bg-emerald-950/50 text-emerald-400"
                                    : isReturned
                                    ? "bg-red-950/50 text-red-400"
                                    : "bg-slate-800 text-slate-200"
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="p-3 text-left font-mono text-slate-300">{(o.prodPrice || 0).toLocaleString("ar")} ج.م</td>
                            <td className="p-3 text-left font-mono text-slate-300">{(o.shipPrice || 0).toLocaleString("ar")} ج.م</td>
                            <td className="p-3 text-left font-mono text-amber-400">{(o.cod || 0).toLocaleString("ar")} ج.م</td>
                            <td className="p-3 text-left font-mono font-bold text-emerald-400">{(o.collectedAmount || 0).toLocaleString("ar")} ج.م</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom KPI Summary */}
            <div className="p-4 bg-slate-900 border-t border-white/8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">عدد أوردرات اليوم المصنفة</span>
                <span className="text-sm font-mono font-black text-slate-100">{selectedDayOrdersDetail.length} أوردرات</span>
              </div>
              <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">إجمالي كود المطلوب كلياً</span>
                <span className="text-sm font-mono font-black text-amber-400">
                  {selectedDayOrdersDetail.reduce((acc, cur) => acc + (cur.cod || 0), 0).toLocaleString("ar")} ج.م
                </span>
              </div>
              <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">إجمالي الكاش المحصل الفعلي</span>
                <span className="text-sm font-mono font-black text-emerald-400">
                  {selectedDayOrdersDetail.reduce((acc, cur) => acc + (cur.collectedAmount || 0), 0).toLocaleString("ar")} ج.م
                </span>
              </div>
              <div className="bg-slate-950 border border-white/4 p-2.5 rounded-xl">
                <span className="text-[10px] text-slate-400 block font-bold">إجمالي شحن أوردرات اليوم</span>
                <span className="text-sm font-mono font-black text-slate-300">
                  {selectedDayOrdersDetail.reduce((acc, cur) => acc + (cur.shipPrice || 0), 0).toLocaleString("ar")} ج.م
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-3 bg-slate-950 border-t border-white/4 text-left">
              <button
                type="button"
                onClick={() => {
                  setSelectedDayOrdersDetail(null);
                  setSelectedDayDate("");
                  setModalSearchFilter("");
                }}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-5 rounded-lg text-xs font-black cursor-pointer transition-colors"
              >
                إغلاق الكشف التفصيلي
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
