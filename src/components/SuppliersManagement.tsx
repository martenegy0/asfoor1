import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, RefreshCw, DollarSign, Wallet, ShieldAlert, CheckCircle2, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Edit3, Sparkles,
  Search, Filter, Calendar, Printer, FileText, ArrowRight,
  TrendingUp, TrendingDown, Layers, Copy, Check, Info, Download
} from "lucide-react";
import { apiCall } from "../utils";

interface SuppliersManagementProps {
  token: string;
  role: string;
  orders?: any[];
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

interface LedgerEntry {
  date: string;
  type: string;
  tracking: string;
  amount: number;
  desc: string;
  balanceAfter: number;
}

export default function SuppliersManagement({ token, role, orders = [] }: SuppliersManagementProps) {
  // Navigation tabs (page internal)
  const isSupplierRole = role === "مورد" || role === "موردين";
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "statement" | "query">(
    isSupplierRole ? "statement" : "directory"
  );

  // Directory and common data states
  const [accounts, setAccounts] = useState<SupplierAccount[]>([]);
  const [allRegisteredSuppliers, setAllRegisteredSuppliers] = useState<{ id?: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Detailed Ledger / Statement States
  const [selectedLedgerSupplier, setSelectedLedgerSupplier] = useState("");
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [ledgerStats, setLedgerStats] = useState<any>(null);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  // Statement Filters
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");

  // Payment Settlement Dialog States
  const [activeSettleSupplier, setActiveSettleSupplier] = useState<SupplierAccount | null>(null);
  const [settleAmount, setSettleAmount] = useState("");
  const [settleDesc, setSettleDesc] = useState("");
  const [isSettling, setIsSettling] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleTransType, setSettleTransType] = useState<"payout" | "withdrawal">("payout");

  // --- Supplier Fast Query States ---
  const [querySupplier, setQuerySupplier] = useState("");
  const [queryDate, setQueryDate] = useState(() => {
    try {
      const d = new Date();
      d.setHours(d.getHours() + 3); // Cairo offset fallback
      return d.toISOString().substring(0, 10);
    } catch (e) {
      return new Date().toISOString().split("T")[0];
    }
  });

  // Calculate unique supplier names
  const uniqueSuppliersList = useMemo(() => {
    const names = new Set<string>();
    accounts.forEach(a => { if (a.name) names.add(a.name.trim()); });
    allRegisteredSuppliers.forEach(s => { if (s.name) names.add(s.name.trim()); });
    return Array.from(names).filter(Boolean).sort();
  }, [accounts, allRegisteredSuppliers]);

  // Handle supplier dashboard query details
  const queryResult = useMemo(() => {
    const target = isSupplierRole ? querySupplier || "" : querySupplier;
    if (!target) return null;
    
    const supplierOrders = (orders || []).filter(o => {
      const sup = (o.supplier || "").toString().trim();
      if (sup !== target.trim()) return false;
      const oDate = (o.orderDate || o.createdAt || "").toString().substring(0, 10);
      return oDate === queryDate;
    });

    const isReturnedDelivered = (status: string) => {
      const s = (status || "").toString().trim();
      return s === "تم تسليم المرتجع للمورد" || s === "تم تسليم المرتجع للمورد وتصفية حسابه" || s === "مرتجع تم تسليمه للمورد" || s === "مرتجع والعميل دفع الشحن" || s === "مرتجع مدفوع الشحن";
    };

    const total = supplierOrders.length;
    const delivered = supplierOrders.filter(o => o.status === "تم التسليم").length;
    const returnedToOffice = supplierOrders.filter(o => {
      const s = (o.status || "").toString().trim();
      return (s === "مرتجع" || s === "التسليم للمورد") && !isReturnedDelivered(s);
    }).length;
    const returnedDelivered = supplierOrders.filter(o => isReturnedDelivered(o.status)).length;

    return {
      total,
      delivered,
      returnedToOffice,
      returnedDelivered
    };
  }, [querySupplier, queryDate, orders, isSupplierRole]);

  // Initial bindings
  useEffect(() => {
    initializeData();
  }, [token]);

  // Auto-set supplier for statements if role is "مورد"
  useEffect(() => {
    if (isSupplierRole && uniqueSuppliersList.length > 0) {
      // Find or set to first available or the username
      // In high scale context, username is what matters
      setSelectedLedgerSupplier(uniqueSuppliersList[0] || "");
      setQuerySupplier(uniqueSuppliersList[0] || "");
    }
  }, [uniqueSuppliersList, isSupplierRole]);

  // Load detailed account statement when selected supplier shifts
  useEffect(() => {
    if (selectedLedgerSupplier) {
      fetchSupplierStatement(selectedLedgerSupplier);
    }
  }, [selectedLedgerSupplier]);

  async function initializeData() {
    setIsLoading(true);
    setErrorMsg("");
    try {
      // 1. Fetch directories
      const resAcc = await apiCall("supplierAccounts", token);
      if (resAcc.ok && resAcc.accounts) {
        setAccounts(resAcc.accounts);
      }

      const resSup = await apiCall("getSuppliers", token);
      if (resSup.ok && resSup.suppliers) {
        setAllRegisteredSuppliers(resSup.suppliers);
      }
    } catch (err: any) {
      setErrorMsg("عذراً، فشل تهيئة وإحضار بيانات الفوترة: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch detailed accounting statement for a target vendor
  async function fetchSupplierStatement(supplierName: string) {
    if (!supplierName) return;
    setIsLedgerLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall("getSupplierLedger", token, { supplier: supplierName });
      if (res.ok) {
        setLedgerEntries(res.entries || []);
        setLedgerStats(res.stats || null);
      } else {
        setErrorMsg(res.error || "خطأ أثناء تحميل كشف الحساب التفصيلي.");
      }
    } catch (err: any) {
      setErrorMsg("فشل جلب تفاصيل القيود المالية: " + err.message);
    } finally {
      setIsLedgerLoading(false);
    }
  }

  // Handle manual payouts or debit withdrawals
  async function handleSettleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeSettleSupplier) return;

    const amountNum = Number(settleAmount);
    if (!amountNum || amountNum <= 0) {
      setErrorMsg("يرجى إدخال قيمة صحيحة أكبر من الصفر.");
      return;
    }

    setIsSettling(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await apiCall("addSupplierPayment", token, {
        supplier: activeSettleSupplier.name,
        amount: amountNum,
        desc: settleDesc.trim() || (settleTransType === "withdrawal" ? `سحب مالي / تسوية عكسية من المورد: ${activeSettleSupplier.name} بمبلغ ${amountNum} ج.م` : `تصفية حساب المورد: ${activeSettleSupplier.name} بمبلغ ${amountNum} ج.م`),
        transactionType: settleTransType
      });

      if (res.ok) {
        setSuccessMsg(res.msg || `تم توثيق قيد التسوية بقيمة ${amountNum} ج.م بنجاح للمورد.`);
        setIsSettleModalOpen(false);
        setSettleAmount("");
        setSettleDesc("");
        setSettleTransType("payout");
        setActiveSettleSupplier(null);
        
        // Refresh directories and stats
        await initializeData();
        // If current statement is for this supplier, refresh statement too
        if (selectedLedgerSupplier === activeSettleSupplier.name) {
          fetchSupplierStatement(activeSettleSupplier.name);
        }
      } else {
        setErrorMsg(res.error || "عذراً، فشل تسجيل المستند المالي بالخيمة المركزية.");
      }
    } catch (err: any) {
      setErrorMsg("خطأ في الاتصال أثناء تسجيل التسوية: " + err.message);
    } finally {
      setIsSettling(false);
    }
  }

  // Fast clipboard helper
  function copyToClipboard(val: string) {
    navigator.clipboard.writeText(val);
    setCopiedTracking(val);
    setTimeout(() => setCopiedTracking(null), 1800);
  }

  // Filtering ledger entries locally for powerful statement audits
  const filteredLedgerEntries = useMemo(() => {
    return ledgerEntries.filter(entry => {
      // Date constraints
      if (filterStartDate && entry.date && entry.date.substring(0, 10) < filterStartDate) return false;
      if (filterEndDate && entry.date && entry.date.substring(0, 10) > filterEndDate) return false;

      // Type Constraints
      if (filterType !== "all") {
        const typeClean = entry.type || "";
        if (filterType === "rights" && !typeClean.includes("حقوق")) return false;
        if (filterType === "returns" && !typeClean.includes("مرتجع")) return false;
        if (filterType === "payments" && !["دفع نقدي", "سداد", "سداد مورد", "دفعة"].some(kw => typeClean.includes(kw))) return false;
        if (filterType === "adjustments" && !["خصم", "سحب", "تعديل", "عكسية"].some(kw => typeClean.includes(kw))) return false;
      }

      // Keyword search (tracking, description, type)
      if (filterSearch.trim()) {
        const kw = filterSearch.toLowerCase().trim();
        const trackingClean = (entry.tracking || "").toString().toLowerCase();
        const descClean = (entry.desc || "").toString().toLowerCase();
        const typeClean = (entry.type || "").toString().toLowerCase();
        if (!trackingClean.includes(kw) && !descClean.includes(kw) && !typeClean.includes(kw)) return false;
      }

      return true;
    });
  }, [ledgerEntries, filterStartDate, filterEndDate, filterType, filterSearch]);

  // Overall consolidated metrics for Admin/Accountant Top Banner Card
  const totalFinancialDuesSystem = useMemo(() => {
    return accounts.reduce((sum, item) => sum + Number(item.balance || 0), 0);
  }, [accounts]);

  const totalUploadedGoodsSystem = useMemo(() => {
    return accounts.reduce((sum, item) => sum + Number(item.totalCOD || 0), 0);
  }, [accounts]);

  const totalReturnsGoodsSystem = useMemo(() => {
    return accounts.reduce((sum, item) => sum + Number(item.returnsDelivered || 0), 0);
  }, [accounts]);

  const totalPaymentsMadeSystem = useMemo(() => {
    return accounts.reduce((sum, item) => sum + Number(item.payments || 0), 0);
  }, [accounts]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter(acc => 
      acc.name ? acc.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
    );
  }, [accounts, searchQuery]);

  const isAdminOrAccountant = role === "مدير" || role === "محاسب";

  // Statement print view trigger
  function handlePrintStatement() {
    window.print();
  }

  return (
    <div className="p-4 space-y-6 select-none font-sans text-right" id="suppliers-unified-view">
      
      {/* Page Title & Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border border-white/6 p-5 rounded-2xl print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="text-amber-500" size={18} />
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-widest">
              💼 كشف الحساب المركزي ومستودع الموردين
            </h2>
          </div>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
            البوابة المتكاملة لمراجعة الطلبات المرفوعة للموردين، مطابقة المرتجعات، صرف الدفعات، والاطلاع على التدفق المالي التفصيلي.
          </p>
        </div>

        <button
          onClick={initializeData}
          disabled={isLoading}
          className="px-4 py-2 bg-slate-950 text-slate-350 hover:bg-slate-950/70 border border-white/8 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto disabled:opacity-40"
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} size={13} />
          <span>مزامنة الحسابات الفورية</span>
        </button>
      </div>

      {/* Dynamic Alerts */}
      {errorMsg && (
        <div className="bg-red-950/25 border border-red-900/30 text-red-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 print:hidden">
          <ShieldAlert size={14} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-950/25 border border-emerald-900/30 text-emerald-400 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 print:hidden">
          <CheckCircle2 size={14} className="shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Consolidated Master Stats Dashboard Banner (Admin/Accountant Only) */}
      {isAdminOrAccountant && activeSubTab === "directory" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 print:hidden">
          {/* Active Suppliers Count */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 text-right space-y-1">
            <span className="text-[10px] text-slate-400 font-black block">📁 عدد شركاء المكاتب</span>
            <div className="text-lg font-mono font-black text-slate-200">
              {accounts.length} <span className="text-xs text-slate-400">تاجر نشط</span>
            </div>
          </div>
          {/* Total Uploaded Value */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 text-right space-y-1">
            <span className="text-[10px] text-slate-400 font-black block">📦 البضائع المرفوعة (صافي)</span>
            <div className="text-lg font-mono font-black text-blue-450 text-blue-400">
              {totalUploadedGoodsSystem.toLocaleString()} <span className="text-xs">ج.م</span>
            </div>
          </div>
          {/* Total Returns Handed Back */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 text-right space-y-1">
            <span className="text-[10px] text-slate-400 font-black block">📦 المرتجعات المخصومة</span>
            <div className="text-lg font-mono font-black text-red-400">
              {totalReturnsGoodsSystem.toLocaleString()} <span className="text-xs">ج.م</span>
            </div>
          </div>
          {/* Total Paid Out Cash */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 text-right space-y-1">
            <span className="text-[10px] text-slate-400 font-black block">🟢 كلي المدفوعات المسددة</span>
            <div className="text-lg font-mono font-black text-emerald-400">
              {totalPaymentsMadeSystem.toLocaleString()} <span className="text-xs">ج.م</span>
            </div>
          </div>
          {/* Cumulative Net Dues to all Suppliers */}
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-4 text-right space-y-1 shadow-lg shadow-amber-500/2">
            <span className="text-[10px] text-amber-500 font-black block">👑 المبلغ الكلي العالق بذمة الشركة</span>
            <div className="text-xl font-mono font-black text-amber-450 text-amber-500">
              {totalFinancialDuesSystem.toLocaleString()} <span className="text-xs">ج.م</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigations Tabs (Internal Segmented Control) */}
      <div className="flex bg-slate-950 p-1 border border-white/6 rounded-2xl print:hidden">
        {/* Tab 1: Directory (Only for Admins/Staffs) */}
        {!isSupplierRole && (
          <button
            onClick={() => setActiveSubTab("directory")}
            className={`flex-1 text-center py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "directory"
                ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
                : "text-slate-450 text-slate-400 hover:text-slate-100"
            }`}
          >
            📋 دليل حسابات الموردين والدفعات
          </button>
        )}

        {/* Tab 2: Detailed Chronicle Statement */}
        <button
          onClick={() => setActiveSubTab("statement")}
          className={`flex-1 text-center py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === "statement"
              ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
              : "text-slate-450 text-slate-400 hover:text-slate-100"
          }`}
        >
          📂 كشف الحساب التفصيلي والتدقيق
        </button>

        {/* Tab 3: Cairo-Offset Query Screen */}
        <button
          onClick={() => setActiveSubTab("query")}
          className={`flex-1 text-center py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === "query"
              ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
              : "text-slate-450 text-slate-400 hover:text-slate-100"
          }`}
        >
          🔍 الاستعلام الفوري والمطابقة للمورد
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB A: REGISTERED ACCOUNTS AND DIRECTORY LISTING */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "directory" && !isSupplierRole && (
        <div className="space-y-6 print:hidden" id="directory-subtab-container">
          
          {/* Quick Filter Box */}
          <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 flex items-center">
            <Search className="text-slate-500 ml-2.5" size={16} />
            <input
              type="text"
              placeholder="🎯 ابحث عن تاجر بالاسم المعرّف أو شركة الشحن التابعة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-bold text-slate-100 text-right outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Accounts Grid */}
          {isLoading ? (
            <div className="text-center py-20 text-xs text-slate-500 bg-slate-900/20 border border-white/4 rounded-2xl animate-pulse">
              جاري تدقيق الخزائن وسحب مؤشرات أداء الموردين والشركاء...
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-500 bg-slate-900 border border-white/6 rounded-2xl">
              لا توجد نتائج تطابق معيار التصفية المختار.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((acc) => {
                const outstanding = acc.balance; // Remaining dues (unrestricted negative value allowed)

                return (
                  <div
                    key={acc.name}
                    className="bg-slate-900 border border-white/6 rounded-2xl p-5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Name Header and rate bar */}
                      <div className="flex justify-between items-start border-b border-white/6 pb-3">
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2.5 py-1 rounded-lg">
                          🟢 تسليم {acc.rate || 0}%
                        </span>
                        <h3 className="text-xs font-black text-slate-100">{acc.name}</h3>
                      </div>

                      {/* Quantum of Metrics */}
                      <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-200 font-extrabold font-mono">{acc.totalOrders || 0} طلب</span>
                          <span className="text-slate-450 text-slate-400">: إجمالي الطلبات المرفوعة</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-emerald-400 font-bold font-mono">{acc.deliveredOrders || 0} طلب</span>
                          <span className="text-slate-450">: مسلّم بنجاح للعميل</span>
                        </div>

                        {/* Net Goods value - totalGoodsUploaded (without company shipping fees as requested!) */}
                        <div className="flex justify-between border-t border-dashed border-white/4 pt-2">
                          <span className="text-blue-400 font-extrabold font-mono">
                            {Number(acc.totalCOD || 0).toLocaleString()} ج.م
                          </span>
                          <span className="text-slate-400">: إجمالي البضاعة المرفوعة (صافي)</span>
                        </div>

                        {/* Returns deducted value */}
                        <div className="flex justify-between">
                          <span className="text-red-400 font-bold font-mono">
                            {Number(acc.returnsDelivered || 0).toLocaleString()} ج.م ({acc.returnsCount || 0} طلب مسترجع)
                          </span>
                          <span className="text-slate-400">: المرتجعات المرتدة والخصم</span>
                        </div>

                        {/* Total payments paid to supplier */}
                        <div className="flex justify-between">
                          <span className="text-slate-300 font-bold font-mono">
                            {Number(acc.payments || 0).toLocaleString()} ج.م
                          </span>
                          <span className="text-slate-400">: الدفعات النقدية المسددة</span>
                        </div>

                        {/* Reverse Adjustments on supplier */}
                        {acc.adjustments !== undefined && acc.adjustments !== null && Number(acc.adjustments) !== 0 && (
                          <div className="flex justify-between">
                            <span className="text-red-300 font-bold font-mono">
                              {Number(acc.adjustments).toLocaleString()} ج.م
                            </span>
                            <span className="text-slate-400">: التسويات العكسية/ السحوبات</span>
                          </div>
                        )}

                        {/* Final Net Account Due */}
                        <div className="flex justify-between text-xs font-black border-t border-white/6 pt-2.5 mt-2">
                          <span className={`font-mono text-sm font-black ${outstanding > 0 ? "text-amber-500" : outstanding < 0 ? "text-red-400" : "text-slate-350"}`}>
                            {Number(outstanding || 0).toLocaleString()} ج.م
                          </span>
                          <span className="text-slate-200 font-black">: المستحقات العالقة الحالية</span>
                        </div>
                      </div>
                    </div>

                    {/* Operational triggers */}
                    <div className="mt-5 pt-3.5 border-t border-white/6 flex flex-col sm:flex-row gap-2">
                      {/* Statement Chronicle link */}
                      <button
                        onClick={() => {
                          setSelectedLedgerSupplier(acc.name);
                          setActiveSubTab("statement");
                        }}
                        className="flex-1 py-2 bg-slate-950 hover:bg-slate-900 border border-white/8 rounded-xl text-[10px] font-black text-slate-350 text-center cursor-pointer transition-colors"
                      >
                        📂 كشف تفصيلي
                      </button>

                      {/* Payout button trigger */}
                      {isAdminOrAccountant && (
                        <button
                          onClick={() => {
                            setActiveSettleSupplier(acc);
                            setSettleAmount(outstanding.toString());
                            setSettleDesc(`تصفية وصرف رصيد المورد: ${acc.name} للطلبات المسجلة بالكامل`);
                            setIsSettleModalOpen(true);
                          }}
                          className="flex-1 py-2 bg-slate-950 hover:bg-amber-600/10 border border-white/8 rounded-xl text-[10px] font-black text-amber-500 text-center cursor-pointer transition-all"
                        >
                          💸 دفعة / تسوية
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB B: DETAILED CHRONOLOGICAL STATEMENT TABLE (Kashf Hesab) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "statement" && (
        <div className="space-y-6" id="statement-subtab-container">
          
          {/* Target Supplier Select and Fast Actions Banner */}
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 space-y-4 print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-black text-slate-400 block pb-1">
                  {isSupplierRole ? "اسم المورد الخاص بك" : "اختر المورد لعرض كشف حسابه التفصيلي الحالي"}
                </label>
                
                {isSupplierRole ? (
                  <div className="bg-slate-950 border border-white/8 rounded-xl px-4 py-2.5 text-xs font-black text-amber-500">
                    👑 {selectedLedgerSupplier || "مورد مسجل"}
                  </div>
                ) : (
                  <select
                    value={selectedLedgerSupplier}
                    onChange={(e) => setSelectedLedgerSupplier(e.target.value)}
                    className="w-full bg-slate-950 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-100 outline-none focus:border-amber-500"
                  >
                    <option value="">-- اضغط لتحديد التاجر المراد تدقيقه --</option>
                    {uniqueSuppliersList.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Fast Printing Action */}
              {selectedLedgerSupplier && (
                <div className="flex items-end gap-2 shrink-0 self-end sm:self-auto">
                  {isAdminOrAccountant && (
                    <button
                      onClick={() => {
                        const targetAcc = accounts.find(a => a.name === selectedLedgerSupplier);
                        if (targetAcc) {
                          setActiveSettleSupplier(targetAcc);
                          setSettleAmount(targetAcc.balance.toString());
                          setSettleDesc(`صرف دفعة مالية للحساب من كشف الحساب المركزي`);
                          setIsSettleModalOpen(true);
                        }
                      }}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <DollarSign size={13} />
                      <span>صرف دفعة نقدية</span>
                    </button>
                  )}

                  <button
                    onClick={handlePrintStatement}
                    className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-300 font-extrabold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer size={13} />
                    <span>طباعة / تصدير PDF كشف حساب</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print Header Section (Visible ONLY on viewport printing) */}
            {selectedLedgerSupplier && (
              <div className="hidden print:block text-right pb-4 border-b border-black mb-6">
                <h1 className="text-xl font-black text-black">شركة الشحن والتوصيل المتكاملة</h1>
                <h2 className="text-base font-bold text-gray-700">كشف حساب مالي تفصيلي للمورد الشريك: {selectedLedgerSupplier}</h2>
                <p className="text-[10px] text-gray-500">تم الاستخراج بتاريخ: {new Date().toLocaleString("ar-EG")}</p>
              </div>
            )}

            {/* Selected Supplier Metric Ribbon */}
            {selectedLedgerSupplier && ledgerStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">إجمالي البضائع المرفوعة (صافي)</span>
                  <span className="text-sm font-black font-mono text-blue-400">
                    {ledgerStats.totalGoodsUploaded?.toLocaleString()} ج.م <span className="text-[9px] text-slate-500">({ledgerStats.totalOrdersCount} طلب)</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">المرتجع المرتد المخصوم</span>
                  <span className="text-sm font-black font-mono text-red-400">
                    {ledgerStats.returnsDeliveredValue?.toLocaleString()} ج.م <span className="text-[9px] text-slate-500">({ledgerStats.returnsDeliveredCount} طلب مرتد)</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">الدفعات والسحوبات المصروفة</span>
                  <span className="text-sm font-black font-mono text-emerald-400">
                    {((ledgerStats.paymentsValue || 0) + (ledgerStats.reverseAdjustmentsValue || 0)).toLocaleString()} ج.م
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-amber-500 font-semibold block">الرصيد الدائن الحالي للمورد</span>
                  <span className="text-base font-black font-mono text-amber-500">
                    {ledgerStats.outstanding?.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Statement Audit Filters Box */}
          {selectedLedgerSupplier && (
            <div className="bg-slate-900 border border-white/6 rounded-2xl p-4 space-y-3.5 print:hidden">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                <Filter className="text-amber-500" size={13} />
                <span className="text-[11px] font-black text-slate-200">تصفية وبحث كشف الحساب</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {/* Search query */}
                <div>
                  <label className="text-[9.5px] font-black text-slate-500 block mb-1">ابحث برقم الباركود / الكود</label>
                  <input
                    type="text"
                    placeholder="رقم الأوردر أو البيان..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-white/6 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-200 outline-none text-right"
                  />
                </div>

                {/* Filter Type */}
                <div>
                  <label className="text-[9.5px] font-black text-slate-500 block mb-1">نوع الحركة</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full bg-slate-950 border border-white/6 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-100 outline-none"
                  >
                    <option value="all">كل الحركات والقيود</option>
                    <option value="rights">حقوق بضاعة الأوردرات</option>
                    <option value="returns">المرتجعات المخصومة</option>
                    <option value="payments">الدفعات النقدية والمسددات</option>
                    <option value="adjustments">التسويات العكسية والسحوبات</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="text-[9.5px] font-black text-slate-500 block mb-1">تاريخ البداية من</label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/6 rounded-lg px-3 py-1.5 text-xs font-bold font-mono text-slate-200 outline-none text-right"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="text-[9.5px] font-black text-slate-500 block mb-1">تاريخ النهاية إلى</label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-white/6 rounded-lg px-3 py-1.5 text-xs font-bold font-mono text-slate-200 outline-none text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Statement Chronological Ledger Table representation */}
          {!selectedLedgerSupplier ? (
            <div className="text-center py-12 text-xs text-slate-550 border border-dashed border-white/6 rounded-2xl bg-slate-900/30 print:hidden">
              ⚙️ يرجى اختيار اسم المورد أو التاجر أعلاه لعرض تدقيق الحساب المالي والقيود المتبادلة
            </div>
          ) : isLedgerLoading ? (
            <div className="text-center py-16 text-xs text-slate-550 animate-pulse bg-slate-900/30 border border-white/5 rounded-2xl print:hidden">
              جاري مراجعة الدفاتر والأرشيف التاريخي وحساب الأرصدة التراكمية للمورد...
            </div>
          ) : filteredLedgerEntries.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500 bg-slate-900 border border-white/6 rounded-2xl">
              لا توجد قيود مالية مسجلة تتوافق مع محددات البحث والتاريخ الحالية.
            </div>
          ) : (
            <div className="bg-slate-900 border border-white/6 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-950 font-black text-xs text-slate-200 border-b border-white/6 flex justify-between items-center print:hidden">
                <span>كشف الحساب - القائمة مرتبة بالأحداث الأحدث أولاً</span>
                <span className="text-[10px] text-slate-500">مجموع بنود كشف الحساب: {filteredLedgerEntries.length} قيد</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-white/6 text-slate-400 font-bold">
                      <th className="p-3 text-right">التاريخ والمطابقة</th>
                      <th className="p-3 text-right">نوع المستند</th>
                      <th className="p-3 text-right">الباركود/المرجع</th>
                      <th className="p-3 text-right">البيان والتفاصيل وملاحظات المستند</th>
                      <th className="p-3 text-left">القيمة المتبادلة</th>
                      <th className="p-3 text-left">الرصيد التراكمي العالق</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedgerEntries.map((entry, idx) => {
                      const isCredit = entry.amount > 0;
                      const isReturn = entry.type === "مرتجع مخصوم" || (entry.type || "").includes("مرتجع");
                      const isPayoutTrans = ["دفع نقدي", "سداد", "دفعة"].some(kw => (entry.type || "").includes(kw));
                      
                      return (
                        <tr key={idx} className="border-b border-white/4 hover:bg-slate-950/20 text-[11px] transition-colors">
                          {/* Date */}
                          <td className="p-3 font-mono text-slate-300">
                            {entry.date ? entry.date.substring(0, 16) : "—"}
                          </td>

                          {/* Type with color coded badge */}
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              isCredit 
                                ? "bg-blue-955/20 text-blue-400 border border-blue-900/40" 
                                : isReturn
                                ? "bg-red-955/20 text-red-450 border border-red-900/40"
                                : isPayoutTrans
                                ? "bg-emerald-955/20 text-emerald-450 border border-emerald-900/40"
                                : "bg-amber-955/20 text-amber-450 border border-amber-900/40"
                            }`}>
                              {isCredit && <TrendingUp size={11} className="shrink-0" />}
                              {!isCredit && isReturn && <TrendingDown size={11} className="shrink-0" />}
                              {!isCredit && !isReturn && <Layers size={11} className="shrink-0" />}
                              <span>{entry.type}</span>
                            </span>
                          </td>

                          {/* Tracking barcode with quick copy */}
                          <td className="p-3 font-mono text-slate-200">
                            {entry.tracking && entry.tracking !== "CASH-PAY" ? (
                              <button 
                                onClick={() => copyToClipboard(entry.tracking)}
                                className="flex items-center gap-1 hover:text-amber-450 outline-none transition-colors"
                              >
                                {copiedTracking === entry.tracking ? (
                                  <Check className="text-emerald-500 shrink-0" size={11} />
                                ) : (
                                  <Copy className="text-slate-500 shrink-0" size={11} />
                                )}
                                <span>{entry.tracking}</span>
                              </button>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>

                          {/* Human readable description */}
                          <td className="p-3 text-slate-300 text-right leading-relaxed max-w-sm font-semibold">
                            {entry.desc}
                          </td>

                          {/* Transaction Amount */}
                          <td className={`p-3 text-left font-mono font-black ${isCredit ? "text-blue-400" : isPayoutTrans ? "text-emerald-400" : "text-red-400"}`}>
                            {isCredit ? "+" : ""}{entry.amount?.toLocaleString()} ج.م
                          </td>

                          {/* Running Balance */}
                          <td className="p-3 text-left font-mono font-black text-amber-500">
                            {entry.balanceAfter?.toLocaleString()} ج.م
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}


      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB C: CAIRO-OFFSET PERFORMANCE SPOT CHECKS (Query Screen) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === "query" && (
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-6 print:hidden" id="query-subtab-container">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sparkles className="text-amber-500" size={16} />
            <h3 className="text-xs font-black text-slate-200">🔍 الاستعلام والمطابقة الفورية (اليوم والأوردرات)</h3>
          </div>

          <p className="text-[10px] text-slate-400 font-bold leading-relaxed -mt-2">
            يتيح هذا الموديل مطابقة حركة اليوم الفوري الفعالة للمورد وجهًا لوجه وحساب كميات الأوردرات الجديدة، المسلمة، أو المرتجعة للفرع فوراً.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 block pb-1">اختر التاجر / المورد</label>
              
              {isSupplierRole ? (
                <div className="bg-slate-950 border border-white/8 rounded-xl px-4 py-2.5 text-xs font-black text-amber-500">
                  👑 {selectedLedgerSupplier || "مورد مسجل"}
                </div>
              ) : (
                <select
                  value={querySupplier}
                  onChange={(e) => setQuerySupplier(e.target.value)}
                  className="w-full bg-slate-950 border border-white/8 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-100 outline-none focus:border-amber-500/50"
                >
                  <option value="">-- اضغط لتحديد المورد --</option>
                  {uniqueSuppliersList.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 block pb-1">تاريخ اليوم المالي للاستعلام</label>
              <input
                type="date"
                value={queryDate}
                onChange={(e) => setQueryDate(e.target.value)}
                className="w-full bg-slate-950 border border-white/8 rounded-xl px-3 py-2 text-xs font-bold font-mono text-slate-100 outline-none focus:border-amber-500/50 text-right"
              />
            </div>
          </div>

          {querySupplier ? (
            queryResult ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="bg-slate-950/65 border border-white/5 rounded-xl p-3.5 text-center space-y-1 hover:border-white/10 transition-all">
                  <span className="text-[10px] text-slate-400 block font-bold">الأوردرات المرفوعة اليوم</span>
                  <span className="text-xl font-black text-slate-100 font-mono">{queryResult.total}</span>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3.5 text-center space-y-1 hover:border-emerald-600/20 transition-all">
                  <span className="text-[10px] text-emerald-450 block font-bold">المسلمة للعملاء اليوم</span>
                  <span className="text-xl font-black text-emerald-450 font-mono">{queryResult.delivered}</span>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3.5 text-center space-y-1 hover:border-amber-600/20 transition-all">
                  <span className="text-[10px] text-amber-450 block font-bold">قيد الارتجاع في فرع المكتب</span>
                  <span className="text-xl font-black text-amber-450 font-mono">{queryResult.returnedToOffice}</span>
                </div>
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3.5 text-center space-y-1 hover:border-blue-600/20 transition-all">
                  <span className="text-[10px] text-blue-450 block font-bold">المرتجعات الـمُستلمة فعلياً للتاجر</span>
                  <span className="text-xl font-black text-blue-450 font-mono">{queryResult.returnedDelivered}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-slate-500 font-bold">جاري جلب واحتساب حركات المورد المختار...</div>
            )
          ) : (
            <div className="text-center py-5 text-[10px] text-slate-500 font-black bg-slate-950/30 rounded-xl border border-dashed border-white/5">
              💡 يرجى اختيار اسم التاجر / المورد لعرض كمياته الفورية
            </div>
          )}
        </div>
      )}


      {/* ───────────────────────────────────────────────────────────── */}
      {/* FINANCIAL SETTLEMENT INPUT MODAL (Admin/Accountant Only) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isSettleModalOpen && activeSettleSupplier && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full text-right space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/6 pb-3">
              <button 
                onClick={() => setIsSettleModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-black cursor-pointer bg-transparent border-none"
              >
                ✕
              </button>
              <h3 className="text-xs font-black text-slate-100 flex items-center gap-1.5">
                <Sparkles className="text-amber-500" size={14} />
                <span>إجراء تسوية مالية للمورد: [{activeSettleSupplier.name}]</span>
              </h3>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              
              {/* Settle break stats */}
               <div className="bg-slate-950 p-4 border border-white/6 rounded-xl space-y-2.5 text-xs">
                 <div className="flex justify-between items-center text-slate-300">
                   <span className="font-mono font-bold text-blue-400">
                     {Number(activeSettleSupplier.totalCOD || 0).toLocaleString()} ج.م
                   </span>
                   <span>إجمالي البضاعة المرفوعة (صافي بضاعة)</span>
                 </div>

                 <div className="flex justify-between items-center text-slate-300">
                   <span className="font-mono font-bold text-red-400">
                     {Number(activeSettleSupplier.returnsDelivered || 0).toLocaleString()} ج.م
                   </span>
                   <span>المرتجعات المخصومة والمسلمة</span>
                 </div>

                 <div className="flex justify-between items-center text-slate-300">
                   <span className="font-mono font-light text-slate-400">
                     {Number(activeSettleSupplier.payments || 0).toLocaleString()} ج.م
                   </span>
                   <span>الدفعات النقدية السابقة</span>
                 </div>

                 <div className="border-t border-white/6 pt-2 pb-1 flex justify-between items-center font-black">
                   <span className={`font-mono text-sm font-black ${Number(activeSettleSupplier.balance || 0) > 0 ? "text-amber-500" : Number(activeSettleSupplier.balance || 0) < 0 ? "text-red-400" : "text-slate-200"}`}>
                     {Number(activeSettleSupplier.balance || 0).toLocaleString()} ج.م
                   </span>
                   <span className="text-slate-100">المبلغ المستحق الصافي الحالي</span>
                 </div>
               </div>

              {/* Transaction direction */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">نوع المعاملة المالية*</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSettleTransType("payout")}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      settleTransType === "payout"
                        ? "bg-amber-600/20 text-amber-500 border-amber-500 font-black"
                        : "bg-slate-950 text-slate-400 border-white/6 hover:bg-slate-900"
                    }`}
                  >
                    صرف دفعة للمورد (مدفوع)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettleTransType("withdrawal")}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      settleTransType === "withdrawal"
                        ? "bg-red-650/20 text-red-450 border-red-500 font-black"
                        : "bg-slate-950 text-slate-400 border-white/6 hover:bg-slate-900"
                    }`}
                  >
                    سحب / تسوية عكسية (طرح)
                  </button>
                </div>
              </div>

              {/* Payout Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">
                  {settleTransType === "withdrawal" ? "المبلغ المراد سحبه (ج.م)*" : "المبلغ المراد صرفه (ج.م)*"}
                </label>
                <input
                  type="number"
                  required
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className={`w-full bg-slate-950 border border-white/6 rounded-xl px-4 py-2.5 text-xs font-extrabold outline-none text-right font-mono focus:border-amber-500 ${
                    settleTransType === "withdrawal" ? "text-red-400" : "text-amber-500"
                  }`}
                  placeholder={settleTransType === "withdrawal" ? "خصم/سحب مالي" : "تأدية رصيد أو دفعة"}
                />
              </div>

              {/* Note context */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1.5">بيان الدفعة وموثق الخزنة</label>
                <textarea
                  value={settleDesc}
                  onChange={(e) => setSettleDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/6 rounded-xl px-3 py-2.5 text-xs text-slate-100 font-bold outline-none text-right placeholder:text-slate-600 min-h-[60px] focus:border-amber-550"
                  placeholder="وصف المستند لإيضاح الفاتورة أو التسوية..."
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-3 border-t border-white/6">
                <button
                  type="button"
                  onClick={() => setIsSettleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-950 hover:bg-slate-950/80 border border-white/6 rounded-xl text-[11px] font-extrabold text-slate-400 text-center cursor-pointer transition-all"
                >
                  إلغاء الأمر
                </button>
                <button
                  type="submit"
                  disabled={isSettling}
                  className={`flex-1 py-2.5 text-slate-950 rounded-xl text-[10px] font-black text-center cursor-pointer transition-all disabled:opacity-50 ${
                    settleTransType === "withdrawal"
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  }`}
                >
                  {isSettling ? "جاري الحفظ..." : settleTransType === "withdrawal" ? "تأكيد السحب العكسي ⚠️" : "تأكيد وصرف النقديّة ✅"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
