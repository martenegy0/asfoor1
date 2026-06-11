import React, { useEffect, useState } from "react";
import { LogOut, RefreshCw, PlusCircle, LayoutDashboard, Truck, Wallet, FileText, Settings, Users, BookOpen, Layers, History, Calendar } from "lucide-react";
import { apiCall } from "./utils";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Ledger from "./components/Ledger";
import Orders from "./components/Orders";
import Inputs from "./components/Inputs";
import DailyClosing from "./components/DailyClosing";
import SuppliersManagement from "./components/SuppliersManagement";

export default function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [perms, setPerms] = useState("");
  const [activeTab, setActiveTab] = useState<string>("orders");

  // Load and refresh orders state
  const [orders, setOrders] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // --- Treasury / Cashbox lists and states (Admin & Accountant only!) ---
  const [cashboxEntries, setCashboxEntries] = useState<any[]>([]);
  const [cashboxBalance, setCashboxBalance] = useState(0);
  const [cashModalOpen, setCashModalOpen] = useState(false);
  const [cashType, setCashType] = useState<"وارد" | "صادر" | "تحصيل مندوب" | "سداد مورد">("وارد");
  const [cashAmount, setCashAmount] = useState("");
  const [cashDesc, setCashDesc] = useState("");
  const [cashRef, setCashRef] = useState("");

  // --- Expenses lists and states ---
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expCat, setExpCat] = useState("أخرى");
  const [expAmount, setExpAmount] = useState("");
  const [expDesc, setExpDesc] = useState("");

  // --- Users management states (Admin only!) ---
  const [usersList, setUsersList] = useState<any[]>([]);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addedUsername, setAddedUsername] = useState("");
  const [addedRole, setAddedRole] = useState("مندوب");
  const [addedPass, setAddedPass] = useState("");
  const [addedEmail, setAddedEmail] = useState("");

  // --- Courier profile customization states ---
  const [courierEditModalOpen, setCourierEditModalOpen] = useState(false);
  const [selectedCourierName, setSelectedCourierName] = useState("");
  const [courierPhone, setCourierPhone] = useState("");
  const [courierRegion, setCourierRegion] = useState("");
  const [courierBaseSalary, setCourierBaseSalary] = useState(3000);
  const [courierCommissionSuccess, setCourierCommissionSuccess] = useState(25);
  const [courierCommissionReturn, setCourierCommissionReturn] = useState(10);

  // --- Audit Log states ---
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudits, setLoadingAudits] = useState(false);

  // --- Quick Success rate stats for current logged user ---
  const [quickTotal, setQuickTotal] = useState(0);
  const [quickDelivered, setQuickDelivered] = useState(0);
  const [quickReturned, setQuickReturned] = useState(0);
  const [quickActive, setQuickActive] = useState(0);

  // --- Restore session upon mounting (Fixes Refresh Logout Bug!) ---
  useEffect(() => {
    const savedToken = localStorage.getItem("fp_token");
    const savedUser = localStorage.getItem("fp_user");
    const savedRole = localStorage.getItem("fp_role");
    const savedPerms = localStorage.getItem("fp_perms");

    if (savedToken && savedUser && savedRole) {
      setToken(savedToken);
      setUsername(savedUser);
      setRole(savedRole);
      setPerms(savedPerms || "");
    }
  }, []);

  // Sync session on change
  function handleLoginSuccess(name: string, roleVal: string, tkVal: string, permsVal: string) {
    setToken(tkVal);
    setUsername(name);
    setRole(roleVal);
    setPerms(permsVal);

    localStorage.setItem("fp_token", tkVal);
    localStorage.setItem("fp_user", name);
    localStorage.setItem("fp_role", roleVal);
    localStorage.setItem("fp_perms", permsVal);

    // Default starting view tab based on roles
    if (roleVal === "مدير" || roleVal === "مشرف") {
      setActiveTab("orders");
    } else if (roleVal === "محاسب") {
      setActiveTab("cash");
    } else {
      setActiveTab("orders");
    }

    refreshAllData(tkVal, roleVal);
  }

  // --- Clean Logout (Fixes Blank Page Logout Bug!) ---
  function handleLogout() {
    setToken("");
    setUsername("");
    setRole("");
    setPerms("");
    setOrders([]);
    setCouriers([]);

    localStorage.removeItem("fp_token");
    localStorage.removeItem("fp_user");
    localStorage.removeItem("fp_role");
    localStorage.removeItem("fp_perms");

    // Revert tab details
    setActiveTab("orders");
  }

  // Dual data pull
  async function refreshAllData(tk = token, activeRole = role) {
    if (!tk) return;
    setLoadingOrders(true);
    try {
      // 1. Fetch Orders List
      // If user is Courier (Agent), todayOnly true is enforced to prevent lagging
      const resOrd = await apiCall("getOrders", tk, { todayOnly: activeRole === "مندوب" });
      if (resOrd.ok) {
        const orderList = resOrd.orders || [];
        setOrders(orderList);

        // Compute quick stats counters for header
        setQuickTotal(orderList.length);
        setQuickDelivered(orderList.filter((o: any) => o.status === "تم التسليم").length);
        setQuickReturned(orderList.filter((o: any) => ["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status)).length);
        setQuickActive(orderList.filter((o: any) => o.status === "خارج مع المندوب" || o.status === "تم الإسناد").length);
      }

      // 2. Fetch couriers profiles
      const resCourier = await apiCall("getCouriers", tk);
      if (resCourier.ok) {
        setCouriers(resCourier.couriers || []);
      }

      // 3. Fetch specific financial lists if permitted
      const isFinance = activeRole === "مدير" || activeRole === "محاسب";
      if (isFinance) {
        fetchCashboxDetails(tk);
        fetchExpensesDetails(tk);
        loadAuditLogs(tk);
        if (activeRole === "مدير") {
          fetchUsersDetail(tk);
        }
      }
    } catch (err) {
      console.error("Orders fetching failed offline", err);
    } finally {
      setLoadingOrders(false);
    }
  }

  // --- central audit logging downloader ---
  async function loadAuditLogs(tk = token) {
    if (!tk) return;
    setLoadingAudits(true);
    try {
      const res = await apiCall("getAuditLog", tk);
      if (res.ok) {
        setAuditLogs(res.logs || []);
      }
    } catch (err) {
      console.error("Failed loading audit logs", err);
    } finally {
      setLoadingAudits(false);
    }
  }

  // --- Accountant operations triggers ---
  async function fetchCashboxDetails(tk = token) {
    try {
      const res = await apiCall("cashbox", tk);
      if (res.ok) {
        setCashboxEntries(res.entries || []);
        setCashboxBalance(res.balance || 0);
      }
    } catch (e) {
      console.warn("Cashbox fetching error", e);
    }
  }

  async function fetchExpensesDetails(tk = token) {
    try {
      const res = await apiCall("expenses", tk);
      if (res.ok) {
        setExpenses(res.expenses || []);
        setExpensesTotal(res.total || 0);
      }
    } catch (e) {
      console.warn("Expenses list retrieval error", e);
    }
  }

  async function fetchUsersDetail(tk = token) {
    try {
      const res = await apiCall("getUsers", tk);
      if (res.ok) {
        setUsersList(res.users || []);
      }
    } catch (e) {
       console.warn("Users fetching logs error", e);
    }
  }

  // Submit Cash entry
  async function submitCashboxLog(e: React.FormEvent) {
    e.preventDefault();
    if (!cashAmount || Number(cashAmount) <= 0) {
      alert("الطلب يحتاج إدخال مبلغ صحيح");
      return;
    }
    try {
      const res = await apiCall("addCashbox", token, {
        desc: cashDesc.trim() || `حركة خزينة يدوية: ${cashType}`,
        type: cashType,
        amount: Number(cashAmount),
        ref: cashRef.trim()
      });
      if (res.ok) {
        setCashModalOpen(false);
        setCashAmount("");
        setCashDesc("");
        setCashRef("");
        fetchCashboxDetails();
        alert("✅ تم تسجيل حركة الخزينة وتصفيها بالدفتر اللحظي");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
       alert("فشل تسجيل حركة الخزينة");
    }
  }

  // Submit Expense item
  async function submitExpenseLog(e: React.FormEvent) {
    e.preventDefault();
    if (!expAmount || Number(expAmount) <= 0) {
      alert("يرجى كتابة مبلغ مصروف صحيح");
      return;
    }
    try {
      const res = await apiCall("addExpense", token, {
        cat: expCat,
        desc: expDesc.trim(),
        amount: Number(expAmount)
      });
      if (res.ok) {
         setExpModalOpen(false);
         setExpAmount("");
         setExpDesc("");
         fetchExpensesDetails();
         fetchCashboxDetails(); // sync balances
         alert("✅ تم قيد المصروف وسداده من سحوبات الخزينة");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("عطل في تعيين المصروف");
    }
  }

  // Add User Profile (Manager only)
  async function handleAddUserProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!addedUsername.trim() || !addedPass.trim() || !addedRole) {
      alert("يرجى ملء الحقول الإلزامية للمستخدم");
      return;
    }
    try {
      const res = await apiCall("addUser", token, {
        name: addedUsername.trim(),
        pass: addedPass.trim(),
        role: addedRole,
        email: addedEmail.trim()
      });
      if (res.ok) {
        setAddUserModalOpen(false);
        setAddedUsername("");
        setAddedPass("");
        setAddedEmail("");
        fetchUsersDetail();
        refreshAllData(); // Reload couriers lists
        alert("👥 تم إضافة المستخدم وتفعيله بنجاح");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("فشل قيد المستخدم الجديد");
    }
  }

  async function handleUpdateCourierProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCourierName) return;

    try {
      const res = await apiCall("updateCourier", token, {
        name: selectedCourierName,
        phone: courierPhone,
        region: courierRegion,
        base_fixed_salary: Number(courierBaseSalary),
        commission_success: Number(courierCommissionSuccess),
        commission_return: Number(courierCommissionReturn)
      });
      if (res.ok) {
        setCourierEditModalOpen(false);
        refreshAllData();
        alert("✅ تم تعديل وحفظ ثوابت عمولات وراتب المندوب بنجاح");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("عطل أثناء تحديث بيانات المندوب");
    }
  }

  async function toggleUserActivation(row: number, name: string, activeStatus: string, roleVal: string) {
    const nextStatus = activeStatus === "نعم" ? "لا" : "نعم";
    try {
      const res = await apiCall("updateUser", token, {
        row,
        name,
        role: roleVal,
        active: nextStatus,
        perms: ""
      });
      if (res.ok) {
        fetchUsersDetail();
        alert(`✅ تم ${nextStatus === "نعم" ? "تفعيل" : "إيقاف"} حساب المستخدم ${name}`);
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
       alert("فشل تحديث وضع الحساب الشخصي");
    }
  }

  // Periodical reloading helper
  useEffect(() => {
    if (token) {
      refreshAllData();
      const tid = setInterval(() => refreshAllData(), 30000); // refresh every 30s
      return () => clearInterval(tid);
    }
  }, [token]);

  // If token is missing, direct show the Login Portal
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Role permissions definitions
  const showDashTab = role === "مدير" || role === "مشرف";
  const showFinanceTabs = role === "مدير" || role === "محاسب";
  const showUsersTab = role === "مدير";
  const showAddInputTab = role === "مدير" || role === "مورد";
  const showLedgerAccountingTab = role === "مورد" || role === "مندوب" || role === "مدير" || role === "محاسب";
  const showCouriersProfileTab = role === "مدير" || role === "محاسب" || role === "مشرف";
  const showSuppliersPageTab = role === "مدير" || role === "محاسب" || role === "مشرف";

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#040813] text-[#e2e8f0] relative select-none antialiased">
      {/* Brand Top Header Bar (الهيدر المطور) */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-white/6 sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-lg">
        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-md">
            {username[0]}
          </div>
          <div>
            <div className="text-xs font-black text-slate-100">{username}</div>
            <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-0.5">{role}</div>
          </div>
        </div>

        {/* Global Action items */}
        <div className="flex gap-2">
          {/* Real-time sync trigger (Fixes infinite loading / Lag) */}
          <button
            onClick={() => refreshAllData()}
            disabled={loadingOrders}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-950 rounded-xl border border-white/6 cursor-pointer active:scale-95 transition-all text-xs flex items-center gap-1 font-bold"
          >
            <RefreshCw size={14} className={loadingOrders ? "animate-spin" : ""} />
            <span>تحديث</span>
          </button>

          {/* Master Logout cleanly redirecting */}
          <button
            onClick={handleLogout}
            className="p-2 text-red-400 hover:text-red-300 bg-slate-950 rounded-xl border border-red-950/20 cursor-pointer active:scale-95 transition-all text-xs font-bold"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Dynamic Summary Micro indicators counters */}
      <div className="grid grid-cols-4 border-b border-white/6 bg-slate-950 text-center text-xs py-2 h-14 items-center">
        <div className="border-l border-white/4 space-y-0.5 pointer-events-none">
          <div className="text-sm font-black text-amber-500 font-mono">{quickTotal}</div>
          <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">إجمالي الطلبات</div>
        </div>
        <div className="border-l border-white/4 space-y-0.5 pointer-events-none">
          <div className="text-sm font-black text-emerald-400 font-mono">{quickDelivered}</div>
          <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">تم التسليم</div>
        </div>
        <div className="border-l border-white/4 space-y-0.5 pointer-events-none">
          <div className="text-sm font-black text-red-500 font-mono">{quickReturned}</div>
          <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">المرتجع</div>
        </div>
        <div className="space-y-0.5 pointer-events-none">
          <div className="text-sm font-black text-blue-400 font-mono">{quickActive}</div>
          <div className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">قيد التنفيذ</div>
        </div>
      </div>

      {/* Tabs navigation row bar */}
      <nav className="flex bg-slate-900 border-b border-white/6 overflow-x-auto scrollbar-none scroll-smooth">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "orders" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
        >
          <Truck size={14} />
          <span>الشحنات</span>
        </button>

        {showDashTab && (
          <button
            onClick={() => setActiveTab("dash")}
            className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "dash" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
          }`}
          >
            <LayoutDashboard size={14} />
            <span>لوحة التحكم</span>
          </button>
        )}

        {showAddInputTab && (
          <button
            onClick={() => setActiveTab("inputs")}
            className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "inputs" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <PlusCircle size={14} />
            <span>إضافة أوردرات</span>
          </button>
        )}

        {showLedgerAccountingTab && (
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "ledger" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <BookOpen size={14} />
            <span>دفتر الحسابات</span>
          </button>
        )}

        {showFinanceTabs && (
          <>
            <button
              onClick={() => setActiveTab("cash")}
              className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "cash" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <Wallet size={14} />
              <span>الخزنة</span>
            </button>

            <button
              onClick={() => setActiveTab("exp")}
              className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "exp" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <FileText size={14} />
              <span>المصروفات</span>
            </button>

            <button
              onClick={() => setActiveTab("closing")}
              className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "closing" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <Calendar size={14} />
              <span>التقفيل اليومي</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === "audit" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <History size={14} />
              <span>سجلات التدقيق والأمان</span>
            </button>
          </>
        )}

        {showUsersTab && (
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "users" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Users size={14} />
            <span>إدارة الصلاحيات</span>
          </button>
        )}

        {showCouriersProfileTab && (
          <button
            onClick={() => setActiveTab("couriers_profile")}
            className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "couriers_profile" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Settings size={14} />
            <span>ملفات المناديب المالّية</span>
          </button>
        )}

        {showSuppliersPageTab && (
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-5 py-4 text-xs font-black cursor-pointer transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "suppliers" ? "text-amber-500 border-amber-500" : "text-slate-400 border-transparent hover:text-slate-200"
            }`}
          >
            <Users size={14} />
            <span>إدارة الموردين</span>
          </button>
        )}
      </nav>

      {/* Main Pages router contents switcher */}
      <main className="flex-1 pb-12 overflow-y-auto">
        {activeTab === "orders" && (
          <Orders
            token={token}
            role={role}
            username={username}
            orders={orders}
            couriers={couriers}
            onRefresh={() => refreshAllData()}
          />
        )}

        {activeTab === "dash" && <Dashboard token={token} />}

        {activeTab === "inputs" && (
          <Inputs
            token={token}
            role={role}
            user={username}
            onSuccess={() => {
              setActiveTab("orders");
              refreshAllData();
            }}
          />
        )}

        {activeTab === "ledger" && <Ledger token={token} role={role} user={username} />}

        {/* --- CASHBOX INTEGRATION (Only visible to accountant & admin per rules) --- */}
        {activeTab === "cash" && showFinanceTabs && (
          <div className="p-4 space-y-6 text-right">
            {/* Cash Live Balance display */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/6 p-6 rounded-2xl text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-2 left-2 text-emerald-500/10">
                <Wallet size={64} />
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                رصيد الخزنة الحالي المتوفر (ج.م)
              </div>
              <div className="text-4xl font-black text-emerald-400">
                {(cashboxBalance || 0).toLocaleString("ar")}{" "}
                <span className="text-sm font-medium">ج.م</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                 يشمل التحصيل اليومي المسدد من المندوبين مطروحاً منه مدفوعات الموردين والمصاريف.
              </p>
            </div>

            {/* Admin triggers buttons to insert transaction */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCashType("وارد");
                  setCashModalOpen(true);
                }}
                className="flex-1 py-3 bg-emerald-600 active:scale-98 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                💚 إيداع بالخزينة
              </button>
              <button
                onClick={() => {
                  setCashType("صادر");
                  setCashModalOpen(true);
                }}
                className="flex-1 py-3 bg-red-650 text-slate-200 font-black text-xs rounded-xl cursor-pointer"
              >
                🔴 سحب من الخزينة
              </button>
            </div>

            {/* Timelines of Treasury Logs */}
            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-400 border-b border-white/6 pb-2">
                 سجل حركات الخزينة بالتفصيل
              </h3>
              {cashboxEntries.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">لا توجد قيود بالخزنة للوقت الحالي</div>
              ) : (
                <div className="space-y-2.5">
                  {cashboxEntries.map((e, idx) => {
                    const isCredit = ["وارد", "تحصيل مندوب"].includes(e.type);
                    return (
                      <div
                        key={idx}
                        className="bg-slate-950 p-4 border border-white/4 rounded-xl flex items-center justify-between hover:bg-slate-950/70"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-200">{e.desc || e.type}</div>
                          <div className="text-[9px] text-slate-550 mt-1 font-semibold">
                            {e.date} {e.ref ? `· مرجع: ${e.ref}` : ""} · بواسطة {e.addedBy}
                          </div>
                        </div>
                        <div className="text-left font-mono space-y-1">
                        <div className={`text-xs font-black ${isCredit ? "text-emerald-400" : "text-red-400"}`}>
                          {isCredit ? "+" : "-"}
                          {(e.amount || 0).toLocaleString("ar")} ج.م
                        </div>
                        <div className="text-[9px] text-slate-500 font-bold">
                          رصيد: {e.balance ? (e.balance).toLocaleString("ar") : "0"} ج
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

        {/* --- EXPENSES TAB (Only Accountant & Admin) --- */}
        {activeTab === "exp" && showFinanceTabs && (
          <div className="p-4 space-y-6 text-right">
            {/* Expense Balance summary card */}
            <div className="bg-slate-900 border border-white/6 p-6 rounded-2xl text-center space-y-1 relative overflow-hidden">
              <div className="absolute top-2 left-2 text-red-500/10">
                <FileText size={64} />
              </div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                إجمالي المصروفات المدفوعة (ج.م)
              </div>
              <div className="text-4xl font-black text-red-400">
                {(expensesTotal || 0).toLocaleString("ar")}{" "}
                <span className="text-sm font-medium">جنيهاً</span>
              </div>
              <button
                onClick={() => setExpModalOpen(true)}
                className="mt-3 inline-block px-5 py-2.5 bg-red-650 hover:bg-red-700 text-slate-200 text-xs font-black rounded-lg cursor-pointer"
              >
                💸 إضافة وتسجيل مصروف جديد
              </button>
            </div>

            {/* List of expenses timeline */}
            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-slate-400 border-b border-white/6 pb-2">
                سجل المصروفات وموازنات التشغيل
              </h3>

              {expenses.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">لا توجد مصروفات مسجلة حالياً</div>
              ) : (
                <div className="space-y-2.5">
                  {expenses.map((e, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-4 border border-white/4 rounded-xl flex items-center justify-between hover:bg-slate-950/70"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200">{e.desc || e.cat}</div>
                        <div className="text-[9px] text-slate-500 mt-1 font-semibold">
                          {e.date} · الفئة: <span className="underline">{e.cat}</span> · صرفه: {e.by}
                        </div>
                      </div>
                      <div className="text-xs font-black font-mono text-red-400">
                        -{(e.amount || 0).toLocaleString("ar")} ج.م
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- DAILY CLOSING REPORT TAB (Only Accountant & Admin) --- */}
        {activeTab === "closing" && showFinanceTabs && (
          <DailyClosing token={token} role={role} user={username} />
        )}

        {/* --- USERS MANAGEMENT TAB (Admin only per rules) --- */}
        {activeTab === "users" && showUsersTab && (
          <div className="p-4 space-y-6 text-right">
            <div className="flex items-center justify-between bg-slate-900 border border-white/6 p-4 rounded-xl">
              <div>
                <h3 className="text-xs font-black text-slate-100">👥 إدارة صلاحيات المستخدمين والمناديب</h3>
                <p className="text-[10px] text-slate-500 mt-1">تفعيل أو إيقاف حسابات المناديب والمشرفين التابعين للشركة.</p>
              </div>
              <button
                onClick={() => setAddUserModalOpen(true)}
                className="px-3.5 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                + إضافة مستخدم
              </button>
            </div>

            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3">
              {usersList.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 animate-pulse">جاري تحميل سجلات المستخدمين...</div>
              ) : (
                usersList.map((u) => {
                  const isActive = u.active === "نعم";
                  return (
                    <div
                      key={u.row}
                      className="bg-slate-950 border border-white/4 p-4 rounded-xl flex items-center justify-between hover:bg-slate-950/70"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-100">
                          {u.name}{" "}
                          <span className="text-[10px] font-bold text-amber-500 bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-900/40 font-mono">
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">
                          الصلاحية الممنوحة: {u.perms || "صلاحيات محدودة"} · البريد: {u.email || "—"}
                        </div>
                      </div>

                      <div className="flex gap-2 items-center">
                        {u.role === "مندوب" && (
                          <button
                            onClick={() => {
                              const courierItem = couriers.find((c: any) => c.name === u.name) || {};
                              setSelectedCourierName(u.name);
                              setCourierPhone(courierItem.phone || "");
                              setCourierRegion(courierItem.region || "");
                              setCourierBaseSalary(courierItem.base_fixed_salary !== undefined ? Number(courierItem.base_fixed_salary) : Number(courierItem.salary || 3000));
                              setCourierCommissionSuccess(courierItem.commission_success !== undefined ? Number(courierItem.commission_success) : Number(courierItem.commission || 25));
                              setCourierCommissionReturn(courierItem.commission_return !== undefined ? Number(courierItem.commission_return) : 10);
                              setCourierEditModalOpen(true);
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-[10px] font-black cursor-pointer bg-slate-900 text-slate-300 border border-white/8 hover:text-white transition-colors"
                          >
                            ⚙️ جدول الراتب والعمولة
                          </button>
                        )}

                        <button
                          onClick={() => toggleUserActivation(u.row, u.name, u.active, u.role)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-colors ${
                            isActive
                              ? "bg-red-950/20 text-red-500 border border-red-900/30 hover:bg-red-950/40"
                              : "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-950/40"
                          }`}
                        >
                          {isActive ? "إيقاف الحساب" : "تفعيل الحساب"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- COURIERS FINANCIAL PROFILES TAB (Admin/Accountant/Supervisor only) --- */}
        {activeTab === "couriers_profile" && showCouriersProfileTab && (
          <div className="p-4 space-y-6 text-right">
            <div className="flex items-center justify-between bg-slate-900 border border-white/6 p-4 rounded-xl">
              <div>
                <h3 className="text-xs font-black text-slate-100">📋 الملفات المالية وبيانات مناديب الشحن</h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  تحديد الراتب الأساسي والعمولات الشهرية للمناديب لضمان الاحتساب الآلي في سجل التقفيل وكشف الرواتب.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {couriers.length === 0 ? (
                <div className="col-span-full text-center py-12 text-xs text-slate-500 bg-slate-900 border border-white/6 rounded-2xl animate-pulse">
                  جاري تحميل ملفات المناديب... للتسجيل يرجى تفعيل حساب لمندوب أولاً.
                </div>
              ) : (
                couriers.map((c: any) => {
                  const bSalary = c.base_fixed_salary !== undefined ? Number(c.base_fixed_salary) : Number(c.salary || 3000);
                  const commSuccess = c.commission_success !== undefined ? Number(c.commission_success) : Number(c.commission || 25);
                  const commReturn = c.commission_return !== undefined ? Number(c.commission_return) : 10;

                  return (
                    <div
                      key={c.name}
                      className="bg-slate-900 border border-white/6 rounded-2xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                      id={`courier-card-${c.name}`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-white/6 pb-3">
                          <span className="text-[10px] font-bold text-emerald-450 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded-lg">
                            {c.region || "غير محدد"}
                          </span>
                          <span className="text-xs font-black text-slate-100">{c.name}</span>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-300 font-bold font-mono">{c.phone || "—"}</span>
                            <span className="text-slate-500">: الهاتف</span>
                          </div>

                          <div className="flex justify-between text-[11px]">
                            <span className="text-amber-500 font-extrabold font-mono">{bSalary.toLocaleString()} ج.م</span>
                            <span className="text-slate-500">: الراتب الثابت الأساسي</span>
                          </div>

                          <div className="flex justify-between text-[11px]">
                            <span className="text-emerald-400 font-extrabold font-mono">{commSuccess.toLocaleString()} ج.م</span>
                            <span className="text-slate-500">: عمولة التسليم الناجح</span>
                          </div>

                          <div className="flex justify-between text-[11px]">
                            <span className="text-red-400 font-extrabold font-mono">{commReturn.toLocaleString()} ج.م</span>
                            <span className="text-slate-550">: عمولة المرتجع العام</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/6">
                        <button
                          onClick={() => {
                            setSelectedCourierName(c.name);
                            setCourierPhone(c.phone || "");
                            setCourierRegion(c.region || "");
                            setCourierBaseSalary(bSalary);
                            setCourierCommissionSuccess(commSuccess);
                            setCourierCommissionReturn(commReturn);
                            setCourierEditModalOpen(true);
                          }}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-950/70 border border-white/8 rounded-xl text-[10px] font-black cursor-pointer text-amber-500 hover:text-amber-450 text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <span>⚙️ تعديل الملف المالي للراتب والعمولات</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- AUDIT LOG PANEL (Admin/Accountant/Supervisor only per rules) --- */}
        {activeTab === "audit" && showFinanceTabs && (
          <div className="p-4 space-y-6 text-right">
            <div className="flex items-center justify-between bg-slate-900 border border-white/6 p-4 rounded-xl">
              <div>
                <h3 className="text-xs font-black text-slate-100">🔒 سجلات التدقيق المالي ومراقب الأمان المركزي</h3>
                <p className="text-[10px] text-slate-500 mt-1">تتبع التعديلات والعمليات المالية الحرجة لمنع العجز المالي والائتماني.</p>
              </div>
              <button
                onClick={() => loadAuditLogs()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-205 border border-white/8 font-black text-xs rounded-xl cursor-pointer"
              >
                تحديث السجل
              </button>
            </div>

            <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-3">
              {loadingAudits ? (
                <div className="text-center py-8 text-xs text-slate-500 animate-pulse">جاري تحميل سجلات التدقيق المالي...</div>
              ) : auditLogs.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500">
                  لا توجد سجلات تدقيق مالي مسجلة حالياً في النظام
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {auditLogs.map((log: any, idx: number) => {
                    return (
                      <div
                        key={idx}
                        className="bg-slate-950 border border-white/4 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-950/70"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-bold text-rose-405 bg-rose-950/20 px-1.5 py-0.5 rounded border border-rose-900/40">
                              {log.type}
                            </span>
                            <span className="text-xs font-bold text-slate-205">
                              بواسطة: {log.user}
                            </span>
                            <span className="text-[9px] font-mono font-bold text-slate-500">
                              {log.dateTime}
                            </span>
                          </div>
                          
                          <div className="text-xs text-slate-300 leading-relaxed font-bold">
                            العملية: <span className="font-mono text-slate-400">{log.reason}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-center bg-slate-900 px-3 py-2 rounded-lg border border-white/4">
                          <div className="text-left font-mono text-[10px]">
                            <div className="text-slate-500 line-through">قبل: {log.oldVal}</div>
                            <div className="text-emerald-450 font-bold">بعد: {log.newVal}</div>
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
        {activeTab === "suppliers" && showSuppliersPageTab && (
          <SuppliersManagement token={token} role={role} />
        )}
      </main>

      {/* --- TREASURY ADDITION DIALOG BOX --- */}
      {cashModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={submitCashboxLog} className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[380px] text-right space-y-4">
            <h3 className="text-sm font-black text-amber-550 border-b border-white/6 pb-2">
              ➕ إضافة حركة بالخزينة يدويا ({cashType})
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">مبلغ المعاملة بالجنيه المصري*</label>
                <input
                  type="number"
                  required
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  placeholder="3000"
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">البيان / الوصف*</label>
                <input
                  type="text"
                  required
                  value={cashDesc}
                  onChange={(e) => setCashDesc(e.target.value)}
                  placeholder="قيد تسوية الخزنة..."
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">رقم المرجع (اختياري)</label>
                <input
                  type="text"
                  value={cashRef}
                  onChange={(e) => setCashRef(e.target.value)}
                  placeholder="REF-1033..."
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                تنفيد القيد المالي
              </button>
              <button
                type="button"
                onClick={() => setCashModalOpen(false)}
                className="px-4 py-3.5 bg-slate-950 text-slate-500 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- EXPENSE ADDITION DIALOG BOX --- */}
      {expModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={submitExpenseLog} className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[380px] text-right space-y-4">
            <h3 className="text-sm font-black text-red-400 border-b border-white/6 pb-2">
              💸 تسجيل بند صرف ومصروف تشغيل رئيسي
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">فئة الصرف والترصيد</label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2.5 text-xs text-right"
                >
                  <option value="مرتبات">مرتبات</option>
                  <option value="بنزين">بنزين وصيانة شاحنات</option>
                  <option value="إيجار">إيجار مخازن ومقرات</option>
                  <option value="إنترنت">إنترنت واتصالات</option>
                  <option value="تشغيل">مصاريف تشغيل ومطبوعات</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">مبلغ المصروف بالجنيه*</label>
                <input
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="250"
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">البيان / الوصف*</label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="بنزين ووقود خط القاهرة سموحة..."
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-red-650 hover:bg-red-700 text-slate-200 font-black text-xs rounded-xl cursor-pointer"
              >
                قيد المصروف الآن
              </button>
              <button
                type="button"
                onClick={() => setExpModalOpen(false)}
                className="px-4 py-3.5 bg-slate-950 text-slate-500 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- ADD USER MODAL (Admin only) --- */}
      {addUserModalOpen && showUsersTab && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddUserProfile} className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[400px] text-right space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-amber-550 border-b border-white/6 pb-2">
               👥 تسجيل وإدراج مستخدم جديد بالنظام
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 font-bold">اسم المستخدم (الاسم فريد بدون تكرار)*</label>
                <input
                  type="text"
                  required
                  value={addedUsername}
                  onChange={(e) => setAddedUsername(e.target.value)}
                  placeholder="اسم المستخدم للدخول..."
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2.5 text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-450 font-bold">الدور الوظيفي*</label>
                  <select
                    value={addedRole}
                    onChange={(e) => setAddedRole(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2.5 text-xs text-right"
                  >
                    <option value="مدير">مدير</option>
                    <option value="مشرف">مشرف</option>
                    <option value="موظف عمليات">موظف عمليات</option>
                    <option value="محاسب">محاسب</option>
                    <option value="مندوب">مندوب توصيل شحن</option>
                    <option value="مورد">مورد تجاري</option>
                    <option value="مسؤول مرتجعات">مسؤول مرتجعات</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-450 font-bold">الباسورد*</label>
                  <input
                    type="text"
                    required
                    value={addedPass}
                    onChange={(e) => setAddedPass(e.target.value)}
                    placeholder="كلمة المرور..."
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2.5 text-xs text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-450 font-bold">البريد الإلكتروني (اختياري)</label>
                <input
                  type="email"
                  value={addedEmail}
                  onChange={(e) => setAddedEmail(e.target.value)}
                  placeholder="asfive@yourmail.com"
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2.5 text-xs text-right"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                تفعيل المستخدم وإضافته
              </button>
              <button
                type="button"
                onClick={() => setAddUserModalOpen(false)}
                className="px-4 py-3.5 bg-slate-950 text-slate-400 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- COURIER FINANCE & SETTINGS EDIT MODAL (Admin/Authorized only) --- */}
      {courierEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdateCourierProfile} className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[420px] text-right space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-amber-500 border-b border-white/6 pb-2 flex items-center gap-1.5 justify-end">
              <span>⚙️ تعديل الملف المالي وثوابت المندوب</span>
            </h3>

            <div className="bg-slate-950/40 p-3 rounded-lg border border-white/4">
              <div className="text-[10px] text-slate-400 font-bold">المندوب المختار:</div>
              <div className="text-xs font-black text-slate-100 mt-0.5">{selectedCourierName}</div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-450 font-bold">الهاتف</label>
                  <input
                    type="text"
                    value={courierPhone}
                    onChange={(e) => setCourierPhone(e.target.value)}
                    placeholder="رقم الهاتف..."
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-450 font-bold">منطقة التغطية</label>
                  <input
                    type="text"
                    value={courierRegion}
                    onChange={(e) => setCourierRegion(e.target.value)}
                    placeholder="الإسكندرية، طنطا..."
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-amber-550 font-extrabold">الراتب الشهري الأساسي الثابت (ج.م)*</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={courierBaseSalary}
                  onChange={(e) => setCourierBaseSalary(Number(e.target.value))}
                  placeholder="مثال: 4000..."
                  className="w-full bg-slate-950 text-slate-200 border border-amber-900/40 rounded-lg px-3 py-2 text-xs text-right font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-450 font-bold">عمولة التسليم الناجح (ج.م)*</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={courierCommissionSuccess}
                    onChange={(e) => setCourierCommissionSuccess(Number(e.target.value))}
                    placeholder="25"
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-450 font-bold">عمولة المرتجع العام (ج.م)*</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={courierCommissionReturn}
                    onChange={(e) => setCourierCommissionReturn(Number(e.target.value))}
                    placeholder="10"
                    className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-lg px-3 py-2 text-xs text-right font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                تحديث وحفظ الثوابت بالسيستم
              </button>
              <button
                type="button"
                onClick={() => setCourierEditModalOpen(false)}
                className="px-4 py-3 bg-slate-950 text-slate-400 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
