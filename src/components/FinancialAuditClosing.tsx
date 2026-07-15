import React, { useState, useEffect } from "react";
import { 
  Package, TrendingUp, TrendingDown, DollarSign, Loader2, 
  ArrowLeftRight, Check, X, ShieldAlert, CheckCircle2, 
  ChevronRight, AlertTriangle, Plus, Landmark, Wallet, RefreshCw
} from "lucide-react";
import { apiCall } from "../utils";

interface FinancialAuditClosingProps {
  token: string;
  role: string;
  user: string;
  orders: any[];
  onRefreshOrders?: () => void;
}

export default function FinancialAuditClosing({ 
  token, 
  role, 
  user, 
  orders = [], 
  onRefreshOrders 
}: FinancialAuditClosingProps) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null); // supplier name
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Modal states
  const [activeModal, setActiveModal] = useState<"creditors" | "debtors" | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
  
  // Transaction inputs
  const [transAmount, setTransAmount] = useState("");
  const [transDesc, setTransDesc] = useState("");

  // Load supplier accounts
  async function loadAccounts() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall("supplierAccounts", token);
      if (res && res.ok && res.accounts) {
        setAccounts(res.accounts);
      } else {
        setErrorMsg(res?.error || "فشل تحميل حسابات الموردين من السيرفر");
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ في الاتصال بالشبكة لطلب الحسابات.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, [token]);

  // Calculate Market Pending Goods (جرد البضاعة بالسوق)
  const marketPendingOrders = orders.filter(o => {
    if (o.isClosed || o.isArchived) return false;
    const stat = (o.status || "").toString().trim();
    // Non-terminal states: meaning they are out on the street or being processed
    const isTerminal = [
      "تم التسليم",
      "تم التسليم بنجاح",
      "تم تسليم المرتجع للمورد",
      "مرتجع تم تسليمه للمورد",
      "مرتجع بالمستودع",
      "مؤرشف"
    ].includes(stat);
    return !isTerminal;
  });

  const marketPendingProductValue = marketPendingOrders.reduce(
    (sum, o) => sum + Number(o.prodPrice || 0), 
    0
  );

  // Creditors list (المبالغ التي علينا للموردين - balance > 0)
  const creditorAccounts = accounts.filter(acc => acc.balance > 0);
  const totalCreditorValue = creditorAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Debtors list (المبالغ التي لنا عند الموردين - balance < 0)
  const debtorAccounts = accounts.filter(acc => acc.balance < 0);
  const totalDebtorValue = debtorAccounts.reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  // Submit payment / payout / inflow directly
  async function handleQuickTransaction(
    supplierName: string, 
    type: "payout" | "inflow" | "adjustment",
    adjType?: "add" | "deduct"
  ) {
    const amt = Number(transAmount);
    if (!supplierName) return;
    if (isNaN(amt) || amt <= 0) {
      alert("يرجى إدخال مبلغ صحيح أكبر من الصفر.");
      return;
    }

    setSubmitting(supplierName);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await apiCall("addSupplierPayment", token, {
        supplier: supplierName,
        amount: amt,
        desc: transDesc || (type === "payout" ? `صرف دفعة سريعة من كارت الجرود` : `استلام نقدية سريع من كارت الجرود`),
        transactionType: type,
        adjustmentType: adjType,
        currentUser: user,
        date: new Date().toISOString()
      });

      if (res && res.ok) {
        setSuccessMsg(`✅ نجح تسجيل المعاملة المالية لـ (${supplierName}) بقيمة ${amt.toLocaleString("ar")} ج.م`);
        setTransAmount("");
        setTransDesc("");
        setSelectedSupplier(null);
        // Refresh local list
        await loadAccounts();
        // Refresh parent orders
        if (onRefreshOrders) {
          onRefreshOrders();
        }
      } else {
        setErrorMsg(res?.error || "فشل تسجيل المعاملة بالخلفية.");
      }
    } catch (err: any) {
      setErrorMsg("عطل عابر بالشبكة أثناء محاولة الحفظ.");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* Top Title Bar */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
            <Landmark className="text-amber-500" size={20} />
            <span>الجرود والتقفيل المالي المركزي اليومي</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            رصد جرد البضاعة الحية في عهدة المناديب وتدقيق مديونيات ومستحقات الموردين مع إمكانية التصفية المباشرة.
          </p>
        </div>
        <button 
          onClick={() => { loadAccounts(); if (onRefreshOrders) onRefreshOrders(); }}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/8 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>تحديث الحسابات الفورية</span>
        </button>
      </div>

      {/* Main feedback indicators */}
      {errorMsg && (
        <div className="p-4 bg-red-950/40 border border-red-900/40 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
          <AlertTriangle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-900/40 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 3 Smart Interactive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: جرد البضاعة بالسوق */}
        <div 
          className="bg-slate-900 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[150px] transition-all duration-200 group hover:shadow-lg"
        >
          <div className="absolute top-2 left-2 text-blue-500/5 group-hover:text-blue-500/10 transition-colors">
            <Package size={64} className="rotate-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400">📦 جرد البضاعة المعلقة بالسوق</div>
            <div className="text-3xl font-black text-blue-400 font-mono mt-3">
              {marketPendingProductValue.toLocaleString("ar")} <span className="text-xs font-bold text-slate-400">ج.م</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-semibold">
              صافي قيمة المنتجات فقط لـ <span className="text-blue-400 underline">{marketPendingOrders.length} طلب نشط</span> مع المناديب (بدون مصاريف الشحن).
            </p>
          </div>
          <div className="border-t border-white/5 pt-2 mt-4 text-[10px] text-slate-400 font-bold flex justify-between items-center">
            <span>حالة الجرد الحالي:</span>
            <span className="px-2 py-0.5 bg-blue-950 text-blue-400 rounded-md">نشط ميدانياً 🏃‍♂️</span>
          </div>
        </div>

        {/* Card 2: مستحقات الموردين (دائن) */}
        <div 
          onClick={() => {
            setActiveModal("creditors");
            setSelectedSupplier(null);
            setTransAmount("");
            setTransDesc("");
          }}
          className="bg-slate-900 border border-white/5 hover:border-emerald-500/30 hover:shadow-emerald-950/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[150px] transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-98"
          title="اضغط لاستعراض الموردين المستحقين وصرف نقدي فوري"
        >
          <div className="absolute top-2 left-2 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors">
            <TrendingUp size={64} className="rotate-3" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
              <span>⚖️ إجمالي مستحقات الموردين (دائن)</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded-md font-bold">عرض التفاصيل 🔍</span>
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono mt-3">
              {totalCreditorValue.toLocaleString("ar")} <span className="text-xs font-bold text-slate-400">ج.م</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-semibold">
              إجمالي المبالغ الصافية التي تقع في ذمة المكتب لصالح <span className="text-emerald-400">{creditorAccounts.length} مورد دائن</span>.
            </p>
          </div>
          <div className="border-t border-white/5 pt-2 mt-4 text-[10px] text-slate-400 font-bold flex justify-between items-center">
            <span>الالتزامات الكلية القائمة:</span>
            <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 rounded-md">جاهز للصرف والتسوية 💳</span>
          </div>
        </div>

        {/* Card 3: مديونيات الموردين (مدين) */}
        <div 
          onClick={() => {
            setActiveModal("debtors");
            setSelectedSupplier(null);
            setTransAmount("");
            setTransDesc("");
          }}
          className="bg-slate-900 border border-white/5 hover:border-rose-500/30 hover:shadow-rose-950/10 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[150px] transition-all duration-200 cursor-pointer group hover:scale-[1.01] active:scale-98"
          title="اضغط لاستعراض الموردين المدينين وتسجيل استلام فوري"
        >
          <div className="absolute top-2 left-2 text-rose-500/5 group-hover:text-rose-500/10 transition-colors">
            <TrendingDown size={64} className="-rotate-3" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 flex items-center justify-between">
              <span>⚖️ إجمالي مديونيات الموردين (مدين)</span>
              <span className="text-[9px] bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded-md font-bold">عرض التفاصيل 🔍</span>
            </div>
            <div className="text-3xl font-black text-rose-400 font-mono mt-3">
              {totalDebtorValue.toLocaleString("ar")} <span className="text-xs font-bold text-slate-400">ج.م</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 font-semibold">
              المبالغ والمستحقات المسترجعة لنا في ذمة <span className="text-rose-400">{debtorAccounts.length} مورد مدين</span>.
            </p>
          </div>
          <div className="border-t border-white/5 pt-2 mt-4 text-[10px] text-slate-400 font-bold flex justify-between items-center">
            <span>مستحقات المكتب بالخارج:</span>
            <span className="px-2 py-0.5 bg-rose-950/60 text-rose-400 rounded-md">تحصيل فوري 📥</span>
          </div>
        </div>

      </div>

      {/* Section explanation banner */}
      <div className="p-4 bg-slate-950/50 border border-white/5 rounded-2xl text-xs text-slate-400 leading-relaxed font-semibold">
        💡 <strong>نظام الجرود المركزي الذكي:</strong> تم تصميمه ليسحب حسابات الموردين في الذاكرة دفعة واحدة، مما يمنح الإدارة المالية تقييماً شاملاً لـ 3 قطاعات مالية حساسة بلحظة واحدة وبأعلى سرعة ممكنة دون التسبب في ثقل خادم Google Sheets.
      </div>

      {/* MODAL / POPUP: Detailed Suppliers List and Quick Transaction Gateway */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-slate-950/40 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-200 tracking-wider flex items-center gap-2">
                  {activeModal === "creditors" ? (
                    <>
                      <TrendingUp className="text-emerald-400" size={18} />
                      <span>تفاصيل مستحقات الموردين الدائنة (مطلوب تسديدها)</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="text-rose-400" size={18} />
                      <span>تفاصيل مديونيات الموردين المدينة (مطلوب تحصيلها)</span>
                    </>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {activeModal === "creditors" 
                    ? `مجموع المستحقات القائمة لصالح الموردين: ${totalCreditorValue.toLocaleString("ar")} ج.م لـ ${creditorAccounts.length} تاجر.` 
                    : `مجموع مديونيات التجار لنا: ${totalDebtorValue.toLocaleString("ar")} ج.م في ذمة ${debtorAccounts.length} تاجر.`}
                </p>
              </div>
              <button 
                onClick={() => { setActiveModal(null); setSelectedSupplier(null); }}
                className="p-1.5 bg-slate-950 rounded-xl text-slate-400 hover:text-white transition-all border border-white/5 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Suppliers List Table (col-span-7) */}
              <div className={`${selectedSupplier ? "lg:col-span-7" : "lg:col-span-12"} transition-all space-y-3`}>
                <h4 className="text-xs font-black text-slate-450">👤 قائمة التجار والشركاء الماليين</h4>
                <div className="overflow-x-auto border border-white/5 rounded-xl">
                  <table className="w-full text-xs text-right border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 font-extrabold border-b border-white/5">
                        <th className="p-3">اسم المورد</th>
                        <th className="p-3 text-center">الرصيد المالي الحالي</th>
                        <th className="p-3 text-center">حسابات الأوردرات</th>
                        <th className="p-3 text-left">إجراء سريع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activeModal === "creditors" ? creditorAccounts : debtorAccounts).map((acc, idx) => (
                        <tr 
                          key={idx} 
                          className={`border-b border-white/4 transition-all hover:bg-slate-950/30 ${selectedSupplier?.name === acc.name ? "bg-amber-500/10 border-amber-500/20" : ""}`}
                        >
                          <td className="p-3 font-extrabold text-slate-100">{acc.name}</td>
                          <td className="p-3 text-center font-mono font-black">
                            <span className={acc.balance > 0 ? "text-emerald-400" : "text-rose-400"}>
                              {Math.abs(acc.balance).toLocaleString("ar")} ج.م
                            </span>
                          </td>
                          <td className="p-3 text-center font-mono text-slate-400 text-[11px]">
                            {acc.deliveredOrders} تسليم / {acc.totalOrders} إجمالي
                          </td>
                          <td className="p-3 text-left">
                            <button 
                              onClick={() => {
                                setSelectedSupplier(acc);
                                setTransAmount(Math.abs(acc.balance).toString()); // pre-fill amount with outstanding balance
                                setTransDesc("");
                              }}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10px] font-black cursor-pointer transition-all active:scale-95"
                            >
                              تسجيل حركة 💸
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Transaction Panel (col-span-5) */}
              {selectedSupplier && (
                <div className="lg:col-span-5 bg-slate-950/40 border border-white/5 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                        <Wallet size={14} />
                        <span>الحركة المالية لـ ({selectedSupplier.name})</span>
                      </h4>
                      <button 
                        onClick={() => setSelectedSupplier(null)}
                        className="text-[10px] text-slate-500 hover:text-slate-300 underline"
                      >
                        إلغاء التحديد
                      </button>
                    </div>

                    <div className="bg-slate-900 border border-white/4 p-3 rounded-xl space-y-1">
                      <div className="text-[10px] text-slate-400 font-bold">الرصيد المعلق الفعلي المستهدف:</div>
                      <div className="text-lg font-mono font-black text-slate-200">
                        {Math.abs(selectedSupplier.balance).toLocaleString("ar")} ج.م 
                        <span className="text-xs font-bold text-slate-400 mr-1">
                          {selectedSupplier.balance > 0 ? "(دائن / مستحقات للمورد)" : "(مدين / مديونية للمكتب)"}
                        </span>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">المبلغ المطلوب تسجيله (ج.م):</label>
                        <input 
                          type="number"
                          value={transAmount}
                          onChange={(e) => setTransAmount(e.target.value)}
                          placeholder="المبلغ كاش بالجنيه المصري..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 outline-none focus:border-amber-500/40"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">ملاحظات / وصف المستند المالي:</label>
                        <textarea 
                          rows={2}
                          value={transDesc}
                          onChange={(e) => setTransDesc(e.target.value)}
                          placeholder="مثال: تسوية نقدية يومية، عهدة مرتجعات..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500/40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2 pt-4 border-t border-white/5">
                    {submitting === selectedSupplier.name ? (
                      <div className="w-full py-3 bg-slate-800 text-slate-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span>جاري ترحيل القيد لملف الشيت...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleQuickTransaction(selectedSupplier.name, "payout")}
                          className="py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
                          title="صرف دفعة نقدية للمورد لتقليص رصيده الدائن"
                        >
                          💵 صرف للمورد
                        </button>
                        <button 
                          onClick={() => handleQuickTransaction(selectedSupplier.name, "inflow")}
                          className="py-3 bg-blue-500 hover:bg-blue-400 text-white font-black rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-md"
                          title="استلام نقود من المورد لزيادة رصيده أو تسوية مديونيته"
                        >
                          📥 استلام نقدية
                        </button>
                      </div>
                    )}
                    <p className="text-[8.5px] text-slate-500 text-center font-bold">
                      * تظهر التحديثات بالخزنة فوراً، ويتم عكس الحساب المالي للمورد بلحظتها.
                    </p>
                  </div>

                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
