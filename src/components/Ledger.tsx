import React, { useEffect, useState } from "react";
import { PlusCircle, Wallet, FileText, ArrowUpRight, ArrowDownRight, Calendar, Filter, Users, ShieldAlert } from "lucide-react";
import { apiCall } from "../utils";

interface LedgerProps {
  token: string;
  role: string;
  user: string;
}

export default function Ledger({ token, role, user }: LedgerProps) {
  const isSupplier = role === "مورد";
  const isCourier = role === "مندوب";
  const isFinancial = role === "مدير" || role === "محاسب";

  const [activeLedger, setActiveLedger] = useState<"supplier" | "courier">(
    isSupplier ? "supplier" : "courier"
  );

  // --- Supplier Ledger States ---
  const [subscribes, setSubscribes] = useState<any[]>([]);
  const [liveBalance, setLiveBalance] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState(isSupplier ? user : "");
  const [allSuppliers, setAllSuppliers] = useState<any[]>([]);
  const [payAmount, setPayAmount] = useState("");
  const [payDesc, setPayDesc] = useState("");
  const [submittingLedger, setSubmittingLedger] = useState(false);

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
    if (!selectedSupplier && !isSupplier) return;
    setLoading(true);
    setFeedback("");
    try {
      const res = await apiCall("getSupplierLedger", token, {
        supplier: isSupplier ? user : selectedSupplier
      });
      if (res.ok) {
        setSubscribes(res.entries || []);
        setLiveBalance(res.balance || 0);
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
      const res = await apiCall("addSupplierPayment", token, {
        supplier: selectedSupplier,
        amount: Number(payAmount),
        desc: payDesc.trim() || `صرف دفعة للمورد: ${selectedSupplier}`
      });
      if (res.ok) {
        setPayAmount("");
        setPayDesc("");
        loadSupplierLedger();
        alert("✅ تم تسجيل السداد المالي وصرفه من الخزينة بنجاح");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("عطل في تسجيل الدفعة النقدية");
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
    setSubmittingLedger(true);
    try {
      const res = await apiCall("addCourierAdjustment", token, {
        courier: selectedCourier,
        type: adjustmentType,
        amount: Number(adjAmount),
        desc: adjDesc.trim() || `${adjustmentType} للمندوب ${selectedCourier}`
      });
      if (res.ok) {
        setAdjAmount("");
        setAdjDesc("");
        loadCourierLedger();
        alert(`✅ تم إرسال الـ ${adjustmentType} بنجاح وتسويتها في الخزنة`);
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("فشل تسجيل التسوية المالية للمندوب");
    } finally {
      setSubmittingLedger(false);
    }
  }

  // Submit Physical COD Handover from Courier directly to Centralized Cashbox
  async function handleCourierHandover(e: React.FormEvent) {
    e.preventDefault();
    if (!handoverAmount || Number(handoverAmount) <= 0) {
      alert("يرجى إدخال مبلغ صحيح للاستلام");
      return;
    }
    setSubmittingLedger(true);
    try {
      const res = await apiCall("addCashbox", token, {
        type: "استلام عهدة مندوب",
        ref: selectedCourier,
        amount: Number(handoverAmount),
        desc: handoverDesc.trim() || `استلام دفعة عهدة نقدية من المندوب: ${selectedCourier} بموجب وصل: ${handoverRef || "—"}`
      });
      if (res.ok) {
        setHandoverAmount("");
        setHandoverRef("");
        setHandoverDesc("");
        loadCourierLedger();
        alert(`✅ تم استلام عهدة المندوب بنجاح وترحيلها إلى الخزنة المركزية وتصفيتها`);
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("فشل تسجيل حركة استلام العهدة المباشر");
    } finally {
      setSubmittingLedger(false);
    }
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

          {/* Supplier Live accounts balance displays (Supplier Ledger حقيقي) */}
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

          {/* Settle Outlay Panel (Only visible to Admin / Controller) */}
          {isFinancial && (
            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-450 flex items-center gap-2">
                <PlusCircle size={16} className="text-amber-500" />
                <span>صرف دفعة مالية للمورد وسحبها من الخزنة</span>
              </h3>
              <form onSubmit={handleSupplierPayout} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">مبلغ السداد (ج.م)*</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 font-bold">تفاصيل البيان / المرجع</label>
                  <input
                    type="text"
                    value={payDesc}
                    onChange={(e) => setPayDesc(e.target.value)}
                    placeholder="تحويل بنكي / كاش..."
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingLedger}
                  className="bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black text-xs py-3.5 px-4 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                >
                  صرف سداد المورد
                </button>
              </form>
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
                <div className="bg-slate-950 p-4 rounded-xl border border-white/4 space-y-3">
                  <h4 className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5">
                     📥 تسجيل استلام نقدية وإخلاء عهدة مباشرة لـ {selectedCourier}
                  </h4>
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
                      تسجيل التوريد وتصفية العجز
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
