import React, { useState, useEffect } from "react";
import { 
  Users, RefreshCw, DollarSign, Wallet, ShieldAlert, CheckCircle2, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Edit3, Sparkles 
} from "lucide-react";
import { apiCall } from "../utils";

interface SuppliersManagementProps {
  token: string;
  role: string;
}

interface SupplierAccount {
  name: string;
  totalCOD: number;
  returnsDelivered: number;
  adjustments: number;
  payments: number;
  totalOrders: number;
  deliveredOrders: number;
  returnsCount: number;
  balance: number;
  rate: number;
}

export default function SuppliersManagement({ token, role }: SuppliersManagementProps) {
  const [accounts, setAccounts] = useState<SupplierAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Payment Settlement states
  const [activeSupplier, setActiveSupplier] = useState<SupplierAccount | null>(null);
  const [settleAmount, setSettleAmount] = useState("");
  const [settleDesc, setSettleDesc] = useState("");
  const [isSettling, setIsSettling] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [token]);

  async function fetchAccounts() {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall("supplierAccounts", token);
      if (res.ok && res.accounts) {
        setAccounts(res.accounts);
      } else {
        setErrorMsg(res.error || "فشل تحميل حسابات الموردين");
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ في الاتصال بالشبكة: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSettleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeSupplier) return;

    const amountNum = Number(settleAmount);
    if (!amountNum || amountNum <= 0) {
      setErrorMsg("يرجى إدخال مبلغ صحيح أكبر من الصفر");
      return;
    }

    setIsSettling(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiCall("addSupplierPayment", token, {
        supplier: activeSupplier.name,
        amount: amountNum,
        desc: settleDesc.trim() || `تصفية حساب المورد: ${activeSupplier.name} بمبلغ ${amountNum} ج.م`
      });

      if (res.ok) {
        setSuccessMsg(res.msg || `تمت تصفية وتسجيل مبلغ الفاتورة ${amountNum} ج.م بنجاح للمورد`);
        setIsSettleModalOpen(false);
        setSettleAmount("");
        setSettleDesc("");
        setActiveSupplier(null);
        // Reload data
        await fetchAccounts();
      } else {
        setErrorMsg(res.error || "فشل تسجيل دفعة المورد المالية");
      }
    } catch (err: any) {
      setErrorMsg("خطأ في معالجة الدفعة: " + err.message);
    } finally {
      setIsSettling(false);
    }
  }

  const filteredAccounts = accounts.filter(acc => 
    acc.name ? acc.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  const isAdmin = role === "مدير" || role === "محاسب";

  return (
    <div className="p-4 space-y-6 select-none font-sans text-right" id="suppliers-mgmt-view">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-white/6 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="text-amber-500" size={18} />
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest">📋 تسيير وبوابة الموردين والتسويات المالية</h2>
          </div>
          <p className="text-[10px] text-slate-405 text-slate-400 font-bold leading-relaxed">
            متابعة حركة الأوردرات المستلمة للموردين، احتساب صافي المستحقات آلياً وتوثيق المدفوعات النقدية مع تحديث الخزنة المركزية.
          </p>
        </div>

        <button
          onClick={fetchAccounts}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-950 text-slate-350 hover:bg-slate-950/70 border border-white/8 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto disabled:opacity-40"
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} size={13} />
          <span>تحديث الحسابات</span>
        </button>
      </div>

      {/* Alert Banners */}
      {errorMsg && (
        <div className="bg-red-950/25 border border-red-900/30 text-red-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <ShieldAlert size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-950/25 border border-emerald-900/30 text-emerald-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Quick Search */}
      <div className="bg-slate-900/40 p-1 rounded-xl flex items-center border border-white/4">
        <input
          type="text"
          placeholder="🎯 ابحث عن مورد أو تاجر بالاسم المعرّف..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent px-4 py-2.5 text-xs font-bold text-slate-100 text-right outline-none placeholder:text-slate-500"
        />
      </div>

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="text-center py-20 text-xs text-slate-500 bg-slate-900/20 border border-white/4 rounded-2xl animate-pulse">
          جاري مراجعة وتحميل كشوفات حساب الموردين والطلبات المسلّمة...
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-16 text-xs text-slate-500 bg-slate-900 border border-white/6 rounded-2xl">
          لا يوجد موردين متوفرين حالياً أو لا يوجد نتائج تطابق المعيار المختار.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((acc) => {
            // Net formula: Sum of all delivered minus ship prices is reflected in acc.totalCOD from ledger.
            // Under addBulk of system or normal creation, Supplier_Net_Balance = TotalCOD - Shipping_Fees
            const computedNet = acc.totalCOD; // The original net amount registered in ledger
            const outstanding = acc.balance; // Remaining outstanding balance after cash payouts

            return (
              <div
                key={acc.name}
                className="bg-slate-900 border border-white/6 rounded-2xl p-5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                id={`supplier-card-${acc.name}`}
              >
                <div className="space-y-4">
                  {/* Card Title & Delivery Success Rate Badge */}
                  <div className="flex justify-between items-start border-b border-white/6 pb-3">
                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                      🟢 تسليم {acc.rate}%
                    </span>
                    <h3 className="text-xs font-black text-slate-100">{acc.name}</h3>
                  </div>

                  {/* Quantitative Metrics */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 font-bold font-mono">{acc.totalOrders} أوردر</span>
                      <span className="text-slate-500">: إجمالي الطلبات المرفوعة</span>
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-emerald-400 font-bold font-mono">{acc.deliveredOrders} أوردر</span>
                      <span className="text-slate-500">: الطلبات المسلمة بنجاح</span>
                    </div>

                    <div className="flex justify-between text-[11px] border-t border-dashed border-white/4 pt-2.5">
                      <span className="text-emerald-400 font-extrabold font-mono">
                        {acc.totalCOD.toLocaleString()} ج.م
                      </span>
                      <span className="text-slate-500">: إجمالي مديونية المورد الثابتة</span>
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-red-400 font-bold font-mono">
                        {Math.abs(acc.returnsDelivered || 0).toLocaleString()} ج.م ({acc.returnsCount || 0} طلب مرتد)
                      </span>
                      <span className="text-slate-500">: المرتجعات المخصومة (ج.م)</span>
                    </div>

                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-350 font-extrabold font-mono">
                        {Math.abs(acc.payments).toLocaleString()} ج.م
                      </span>
                      <span className="text-slate-500">: كلي الدفعات المصروفة</span>
                    </div>

                    <div className="flex justify-between text-xs font-black border-t border-white/6 pt-3 mt-3">
                      <span className="text-amber-500 font-extrabold font-mono text-sm font-black">
                        {outstanding.toLocaleString()} ج.م
                      </span>
                      <span className="text-slate-200 font-black">: المبلغ المستحق الحالي</span>
                    </div>
                  </div>
                </div>

                {/* Administration payout trigger */}
                {isAdmin && (
                  <div className="mt-5 pt-4 border-t border-white/6">
                    <button
                      onClick={() => {
                        setActiveSupplier(acc);
                        setSettleAmount(outstanding.toString());
                        setSettleDesc(`تصفية مالية للمورد العميل ${acc.name} لطلباته المسلّمة`);
                        setIsSettleModalOpen(true);
                      }}
                      className="w-full py-2.5 bg-slate-950 hover:bg-amber-600/10 border border-white/8 rounded-xl text-[10px] font-black cursor-pointer text-amber-500 hover:text-amber-400 text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <DollarSign size={13} />
                      <span>تصفية الحساب / صرف دفعة مالية</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Financial Settlement Dialog Modal */}
      {isSettleModalOpen && activeSupplier && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full text-right space-y-4">
            <div className="flex justify-between items-center border-b border-white/6 pb-3">
              <button 
                onClick={() => setIsSettleModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-black cursor-pointer"
              >
                ✕
              </button>
              <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                <Sparkles className="text-amber-500" size={14} />
                <span>إجراء تسوية وصرف دفعة للمورد [{activeSupplier.name}]</span>
              </h3>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              {/* Detailed accounting breakdown */}
              <div className="bg-slate-950 p-4 border border-white/6 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-extrabold font-mono text-emerald-400">
                    {activeSupplier.totalCOD.toLocaleString()} ج.م
                  </span>
                  <span>إجمالي مديونية المورد الثابتة</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-extrabold font-mono text-red-400">
                    {Math.abs(activeSupplier.returnsDelivered || 0).toLocaleString()} ج.م ({activeSupplier.returnsCount || 0} طلب مرتد)
                  </span>
                  <span>المرتجعات المخصومة (ج.م)</span>
                </div>

                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-extrabold font-mono text-slate-400">
                    {Math.abs(activeSupplier.payments || 0).toLocaleString()} ج.م
                  </span>
                  <span>الدفعات المصروفة سابقاً</span>
                </div>

                <div className="border-t border-white/6 pt-2 pb-1 flex justify-between items-center font-black">
                  <span className="text-amber-500 font-black font-mono text-sm">
                    {activeSupplier.balance.toLocaleString()} ج.م
                  </span>
                  <span className="text-slate-100">المبلغ المستحق الحالي</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">المبلغ المراد صرفه (Amount to Pay)</label>
                <input
                  type="number"
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-xs text-amber-500 font-extrabold outline-none text-right placeholder:text-slate-600 focus:border-amber-500 font-mono"
                  placeholder="حدد مبلغا لصرفه من رصيد المورد للمدفوعات"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">وصف المعاملة المالية لوثائق الخزنة</label>
                <textarea
                  value={settleDesc}
                  onChange={(e) => setSettleDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-bold outline-none text-right placeholder:text-slate-600 focus:border-amber-500 min-h-[60px]"
                  placeholder="اكتب ملاحظة لبيان الدفعة..."
                />
              </div>

              <div className="flex gap-3 pt-3 border-t border-white/6">
                <button
                  type="button"
                  onClick={() => setIsSettleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-950/85 border border-white/6 rounded-xl text-[11px] font-bold text-slate-400 text-center transition-all cursor-pointer"
                >
                  إلغاء الأمر
                </button>
                <button
                  type="submit"
                  disabled={isSettling}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-[11px] font-black text-center transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSettling ? "جاري تسجيل الدفعة..." : "تأكيد وصرف النقديّة ✅"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
