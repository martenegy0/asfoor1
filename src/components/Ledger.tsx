import React, { useEffect, useState } from "react";
import { PlusCircle, Wallet, FileText, ArrowUpRight, ArrowDownRight, Calendar, Filter, Users, ShieldAlert } from "lucide-react";
import { apiCall } from "../utils";

interface LedgerProps {
  token: string;
  role: string;
  user: string;
}

export default function Ledger({ token, role, user }: LedgerProps) {
  const isSupplier = (role || "").toString().trim() === "مورد" || (role || "").toString().trim().includes("مورد");
  const isCourier = (role || "").toString().trim() === "مندوب" || (role || "").toString().trim().includes("مندوب");
  const isFinancial = (role || "").toString().trim() === "مدير" || (role || "").toString().trim() === "محاسب" || (role || "").toString().trim().includes("مدير") || (role || "").toString().trim().includes("محاسب");

  const [activeLedger, setActiveLedger] = useState<"supplier" | "courier">(
    isSupplier ? "supplier" : "courier"
  );

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
  const [ledgerCache, setLedgerCache] = useState<Record<string, { subscribes: any[], liveBalance: number, stats: any }>>({});

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
        const resSuppliers = await apiCall("getSuppliers", token);
        if (resSuppliers.ok && resSuppliers.suppliers.length > 0) {
          setAllSuppliers(resSuppliers.suppliers);
          if (!selectedSupplier) setSelectedSupplier(resSuppliers.suppliers[0].name);
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
      setLoading(false); // No full screen blocker
    } else {
      // Clear data to prevent old figures from sticking
      setSubscribes([]);
      setLiveBalance(0);
      setSupplierStats(null);
      setLoading(true);
    }

    try {
      const res = await apiCall("getSupplierLedger", token, {
        supplier: targetSup
      });
      if (res.ok) {
        const rawEntries = res.entries || res.ledger || [];
        
        // Calculate running balance from oldest to newest (chronological order)
        let tempBalance = 0;
        const chronological = [...rawEntries].reverse();
        const entriesWithBalance = chronological.map((item: any) => {
          tempBalance += Number(item.amount || 0);
          return { ...item, balanceAfter: tempBalance };
        });
        
        const finalEntries = [...entriesWithBalance].reverse();
        const actualBalance = res.balance !== undefined ? res.balance : tempBalance;
        const stats = res.stats || {
          totalOrdersCount: rawEntries.filter((e: any) => e.type === "حقوق بضاعة أوردر").length,
          totalGoodsUploaded: Math.abs(rawEntries.filter((e: any) => e.type === "حقوق بضاعة أوردر").reduce((sum: number, x: any) => sum + Number(x.amount || 0), 0)),
          deliveredOrdersCount: 0,
          deliveredOrdersValue: actualBalance, // fallback mapping
          returnsDeliveredCount: rawEntries.filter((e: any) => e.type === "مرتجع مخصوم").length,
          returnsDeliveredValue: Math.abs(rawEntries.filter((e: any) => e.type === "مرتجع مخصوم").reduce((sum: number, x: any) => sum + Number(x.amount || 0), 0)),
          paymentsValue: Math.abs(rawEntries.filter((e: any) => {
            const isHuman = ["دفع نقدي", "دفعة مورد", "صرف مورد", "دفعة", "مسحوبات", "تسوية", "سحب"].some(p => (e.type || "").includes(p)) || e.tracking === "CASH-PAY";
            const containsSettleOrWithdraw = (e.type || "").includes("سحب") || (e.type || "").includes("عكسية") || (e.type || "").includes("طرح") || (e.type || "").includes("خصم");
            return isHuman && !containsSettleOrWithdraw;
          }).reduce((sum: number, x: any) => sum + Number(x.amount || 0), 0)),
          reverseAdjustmentsValue: Math.abs(rawEntries.filter((e: any) => {
            const isHuman = ["دفع نقدي", "دفعة مورد", "صرف مورد", "تعديل حساب", "سحب"].some(p => (e.type || "").includes(p)) || e.tracking === "CASH-PAY";
            const containsSettleOrWithdraw = (e.type || "").includes("سحب") || (e.type || "").includes("عكسية") || (e.type || "").includes("طرح") || (e.type || "").includes("خصم");
            return isHuman && containsSettleOrWithdraw;
          }).reduce((sum: number, x: any) => sum + Number(x.amount || 0), 0)),
          outstanding: actualBalance,
          rate: 0
        };

        // Update the client local cache
        setLedgerCache(prev => ({
          ...prev,
          [targetSup]: {
            subscribes: finalEntries,
            liveBalance: actualBalance,
            stats: stats
          }
        }));

        setSubscribes(finalEntries);
        setLiveBalance(actualBalance);
        setSupplierStats(stats);
      } else {
        setFeedback(res.error || "خطأ أثناء تحميل كشف حساب المورد");
      }
    } catch (err) {
      setFeedback("حدث خطأ في الشبكة أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
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

  useEffect(() => {
    if (activeLedger === "supplier") {
      loadSupplierLedger();
    } else {
      loadCourierLedger();
    }
  }, [activeLedger, selectedSupplier, selectedCourier, periodFilter]);

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
      {/* Ledger Mode Filter */}
      {isFinancial && (
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
            <div className="flex items-center justify-between gap-4 bg-slate-900 border border-white/6 p-4 rounded-xl">
              <span className="text-xs font-extrabold text-slate-400 whitespace-nowrap">اختر المورد المراد تسوية حسابه:</span>
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

          {/* 📦 5-Field Mirror Data Grid for Supplier Portal & Statement */}
          {supplierStats ? (
            <div className="space-y-6" id="supplier-mirror-grid">
              {/* Main Top Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. إجمالي الطلبات المرفوعة */}
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 space-y-2 text-right hover:border-amber-500/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">📦  إجمالي المنتجات المرفوعة</span>
                  <div className="text-xl font-mono font-black text-slate-100">
                    {Number(supplierStats.totalGoodsUploaded || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
                  </div>
                  <div className="text-[9.5px] text-amber-400 font-bold">
                     عدد: {supplierStats.totalOrdersCount || 0} أوردر كلي (بضاعة فقط)
                  </div>
                </div>

                {/* 2. الطلبات المسلمة بنجاح */}
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 space-y-2 text-right hover:border-emerald-500/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">🟢  الطلبات المسلمة بنجاح</span>
                  <div className="text-xl font-mono font-black text-emerald-400">
                    {Number(supplierStats.deliveredOrdersValue || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
                  </div>
                  <div className="text-[9.5px] text-emerald-500 font-bold">
                     عدد: {supplierStats.deliveredOrdersCount || 0} أوردر مسلّم
                  </div>
                </div>

                {/* 3. المرتجع المخصوم بالكامل */}
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 space-y-2 text-right hover:border-red-500/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">🔴  المرتجع المعتمد المستلم</span>
                  <div className="text-xl font-mono font-black text-red-400">
                    {Number(supplierStats.returnsDeliveredValue || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
                  </div>
                  <div className="text-[9.5px] text-red-500 font-bold">
                     عدد: {supplierStats.returnsDeliveredCount || 0} أوردر مرتجع
                  </div>
                </div>

                {/* 4. كلي الدفعات المصروفة */}
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 space-y-2 text-right hover:border-cyan-500/20 transition-all">
                  <span className="text-[10px] font-black text-slate-400 block tracking-wider uppercase">💵  إجمالي الدفعات النقدية</span>
                  <div className="text-xl font-mono font-black text-cyan-400">
                    {Number(supplierStats.paymentsValue || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
                  </div>
                  <div className="text-[9.5px] text-cyan-500 font-bold">
                     المسحوبات النقدية المباشرة
                  </div>
                </div>

                {/* 5. التسويات العكسية والصفرية */}
                <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 space-y-2 text-right hover:border-red-400/20 transition-all">
                  <span className="text-[10px] font-black text-purple-400 block tracking-wider uppercase">🔄  التسويات العكسية والسحب</span>
                  <div className="text-xl font-mono font-black text-red-300">
                    {Number(supplierStats.reverseAdjustmentsValue || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
                  </div>
                  <div className="text-[9.5px] text-red-400 font-bold">
                     تعديلات وخصومات إدارية
                  </div>
                </div>
              </div>

              {/* 5. الحقل الرئيسي البارز [المبلغ المستحق النهائي للمورد] */}
              <div className="bg-gradient-to-l from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-500/25 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="absolute top-2 left-2 text-emerald-500/10">
                  <Wallet size={50} />
                </div>
                
                <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-widest inline-block">
                  🏆 المبلغ المستحق النهائي للمورد (الصافي القابل للصرف)
                </span>

                <div className="text-4xl font-mono font-black text-emerald-400 tracking-tight animate-pulse">
                  {Number(supplierStats.outstanding || 0).toLocaleString("ar")}{" "}
                  <span className="text-sm font-medium">جنيهاً مصرياً</span>
                </div>

                {/* Formula display */}
                <div className="bg-slate-950/80 border border-white/4 rounded-xl py-3 px-4 max-w-2xl mx-auto text-xs text-slate-300 leading-relaxed font-bold">
                  <span className="text-amber-400">المعادلة البرمجية الإجبارية لتصفية الحساب:</span>
                  <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-100">إجمالي المنتجات المرفوعة ({Number(supplierStats.totalGoodsUploaded || 0).toLocaleString("ar")})</span>
                    <span className="text-slate-400 font-sans"> - </span>
                    <span className="text-red-400">المرتجع المعتمد المستلم ({Number(supplierStats.returnsDeliveredValue || 0).toLocaleString("ar")})</span>
                    <span className="text-slate-400 font-sans"> - </span>
                    <span className="text-cyan-400">إجمالي الدفعات النقدية ({Number(supplierStats.paymentsValue || 0).toLocaleString("ar")})</span>
                    <span className="text-slate-400 font-sans"> - </span>
                    <span className="text-red-300">التسويات العكسية الصادرة ({Number(supplierStats.reverseAdjustmentsValue || 0).toLocaleString("ar")})</span>
                    <span className="text-slate-400 font-sans"> = </span>
                    <span className="text-emerald-400 font-black">{Number(supplierStats.outstanding || 0).toLocaleString("ar")} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/6 rounded-2xl p-6 text-center space-y-2 relative overflow-hidden">
              <div className="absolute top-2 left-2 text-emerald-500/10">
                <Wallet size={64} />
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                 الرصيد الدائن الحالي للمورد (ج.م)
              </div>
              <div className="text-4xl font-black text-emerald-400">
                {liveBalance.toLocaleString("ar")}{" "}
                <span className="text-sm font-medium">جنيهاً مصرياً</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-semibold max-w-[420px] mx-auto">
                تُعنى هذه القيمة بإجمالي COD سعر المنتجات المحصّلة من عملائه مطروحاً منه الدفعات النقدية المسلمة له والمرتجع الذي تسلمه من الشركة.
              </p>
            </div>
          )}

          {/* Settle Outlay Panel (Only visible to Admin / Controller) */}
          {isFinancial && (
            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-450 flex items-center gap-2">
                <PlusCircle size={16} className="text-amber-500" />
                <span>صرف دفعة مالية للمورد أو سحب تسوية عكسية وتسجيلها بالخزنة</span>
              </h3>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="w-full md:w-1/4 space-y-1">
                  <label className="block text-[10px] text-slate-405 font-bold">نوع المعاملة*</label>
                  <select
                    value={supplierTransType}
                    onChange={(e) => setSupplierTransType(e.target.value as any)}
                    className="w-full h-[38px] bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs font-bold focus:border-amber-500 outline-none"
                  >
                    <option value="payout">صرف دفعة للمورد</option>
                    <option value="withdrawal">سحب / تسوية عكسية</option>
                  </select>
                </div>
                <div className="flex-1">
                  <form onSubmit={handleSupplierPayout} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 font-bold">
                        {supplierTransType === "withdrawal" ? "مبلغ السحب (ج.م)*" : "مبلغ السداد (ج.م)*"}
                      </label>
                      <input
                        type="number"
                        required
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        placeholder="1000"
                        className={`w-full h-[38px] bg-slate-950 border border-white/8 rounded-lg px-3 py-2 text-xs font-mono font-bold outline-none ${
                          supplierTransType === "withdrawal" ? "text-red-450 border-red-500 focus:border-red-500" : "text-slate-200 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 font-bold">تفاصيل البيان / المرجع</label>
                      <input
                        type="text"
                        value={payDesc}
                        onChange={(e) => setPayDesc(e.target.value)}
                        placeholder="تحويل بنكي / كاش..."
                        className="w-full h-[38px] bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingLedger}
                      className={`font-black text-xs h-[38px] px-4 rounded-lg cursor-pointer transition-colors disabled:opacity-50 ${
                        supplierTransType === "withdrawal" ? "bg-red-600 hover:bg-red-750 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-slate-950"
                      }`}
                    >
                      {supplierTransType === "withdrawal" ? "تسجيل سحب المورد" : "صرف سداد المورد"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Supplier Ledger Transactions Ledger Timeline */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-black text-slate-400 flex items-center justify-between border-b border-white/6 pb-2">
              <span>📊 دفتر كشف الحساب والمراكز المالي</span>
              <FileText size={16} className="text-slate-500" />
            </h3>

            {loading ? (
              <div className="text-center py-6 text-xs text-slate-500 animate-pulse">جاري سحب تسويات وحركات المورد...</div>
            ) : subscribes.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">لا يوجد حركات قيود مسجلة لهذا المورد حالياً</div>
            ) : (
              <div className="space-y-3">
                {subscribes.map((e: any, idx: number) => {
                  const isPositive = Number(e.amount) > 0;
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
                            {e.date} {e.tracking !== "CASH-PAY" ? `· الأوردر ${e.tracking}` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-left space-y-1">
                        <div className={`text-xs font-black font-mono ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? "+" : ""}
                          {e.amount.toLocaleString("ar")} ج.م
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold font-mono">
                          رصيد: {(e.balanceAfter || 0).toLocaleString("ar")}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  <div className="text-[10px] font-bold text-slate-200">عجز المندوب المتبقي (العهدة المعلقة)</div>
                  <div className={`text-xl font-black font-mono ${(courierSummary.deficit || 0) > 0 ? "text-rose-450" : "text-emerald-400"}`}>
                    {Number(courierSummary.deficit || 0).toLocaleString("ar")} <span className="text-xs font-medium">ج.م</span>
                  </div>
                  <div className="text-[9px] text-slate-400 leading-none">
                    {(courierSummary.deficit || 0) > 0 ? "⚠️ توجد عهدة مالية معلقة برقبته للجهة" : "✅ ذمة المندوب خالية تماماً"}
                  </div>
                </div>
              </div>

              {/* Handover payout form */}
              {isFinancial && (
                <div className="bg-slate-950 p-4 rounded-xl border border-white/4 space-y-4">
                  <h4 className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5 border-b border-white/6 pb-2">
                     📥 تصفية الحساب اليومية الصارمة وإخلاء العهدة لـ {selectedCourier}
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

                    <button
                      type="submit"
                      disabled={submittingLedger}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2.5 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                    >
                      تصفية وتوريد كاش المندوب
                    </button>
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
    </div>
  );
}
