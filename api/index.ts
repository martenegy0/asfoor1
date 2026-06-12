import React, { useState, useEffect } from "react";
import { apiRequest, Order, normalizeName } from "./api";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import CourierPanel from "./components/CourierPanel";
import SupplierPanel from "./components/SupplierPanel";
import ReturnsPanel from "./components/ReturnsPanel";
import { LogOut, Truck, Clock, ShieldCheck, Heart } from "lucide-react";

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("fp_token"));
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("fp_user"));
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem("fp_role"));
  const [userPerms, setUserPerms] = useState<string | null>(localStorage.getItem("fp_perms"));

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Time ticker for Cairo Real-time Operations
  const [cairoTime, setCairoTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const str = new Date().toLocaleTimeString("ar-EG", {
          timeZone: "Africa/Cairo",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        setCairoTime(str);
      } catch (e) {
        setCairoTime(new Date().toLocaleTimeString());
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrdersInSession = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // The server will automatically customize the returned payload strictly based on token role (suppliers only see their own, couriers only see assigned)
      const res = await apiRequest("getOrders");
      if (res.ok) {
        setOrders(res.orders || []);
      } else {
        console.error("Orders fetching failure:", res.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrdersInSession();
    }
  }, [token, refreshTrigger]);

  const handleLoginSuccess = (user: string, role: string, perms: string, userToken: string) => {
    localStorage.setItem("fp_token", userToken);
    localStorage.setItem("fp_user", user);
    localStorage.setItem("fp_role", role);
    localStorage.setItem("fp_perms", perms);

    setToken(userToken);
    setUserName(user);
    setUserRole(role);
    setUserPerms(perms);
  };

  const handleLogout = () => {
    localStorage.removeItem("fp_token");
    localStorage.removeItem("fp_user");
    localStorage.removeItem("fp_role");
    localStorage.removeItem("fp_perms");

    setToken(null);
    setUserName(null);
    setUserRole(null);
    setUserPerms(null);
    setOrders([]);
  };

  if (!token || !userName || !userRole) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Double Check client-side constraints for Role checks
  const isAdmin = normalizeName(userRole) === "admin" || userRole === "مدير";
  const isSupervisor = userRole === "مشرف";
  const isAccountant = userRole === "محاسب";
  const isSupplier = userRole === "مورد" || normalizeName(userRole) === "supplier";
  const isCourier = userRole === "مندوب" || normalizeName(userRole) === "courier";
  const isReturnsOfficer = userRole === "مسؤول مرتجعات";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased text-right" dir="rtl">
      {/* Prime Corporate Header */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Right Brand info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-red-600 rounded-xl flex items-center justify-center shadow-md border border-amber-400">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>فريند بلس لوجستيات</span>
                <span className="text-[10px] bg-amber-550/15 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-bold">V5.1 LIVE</span>
              </h1>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>توقيت القاهرة الميداني:</span>
                <span className="font-mono font-bold text-slate-350">{cairoTime}</span>
              </div>
            </div>
          </div>

          {/* Left User widgets */}
          <div className="flex items-center gap-4">
            
            {/* User credentials badge */}
            <div className="hidden sm:flex flex-col text-right">
              <div className="text-sm font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                <span>{userName}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-[10px] text-indigo-400 font-bold mt-0.5">
                الصفة: {userRole} • الصلاحية: {userPerms || "تلقائية"}
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-xl hover:text-red-400 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold"
              title="تسجيل الخروج الآمن"
            >
              <span>تسجيل الخروج</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading && (
          <div className="mb-4 text-xs font-mono font-bold text-amber-500 text-right flex items-center justify-end gap-2 bg-slate-900 duration-150 p-3 rounded-lg border border-slate-850">
            <span>جاري سحب التعديلات وحفظ الإيصالات المالية اللحظية...</span>
            <span className="w-3.5 h-3.5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Dynamic RBAC Panel Routing */}
        { (isAdmin || isSupervisor || isAccountant) ? (
          <AdminPanel
            orders={orders}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            currentUser={userName}
            currentRole={userRole}
          />
        ) : isSupplier ? (
          <SupplierPanel
            orders={orders}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            currentUser={userName}
          />
        ) : isCourier ? (
          <CourierPanel
            orders={orders}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            currentUser={userName}
          />
        ) : isReturnsOfficer ? (
          <ReturnsPanel
            orders={orders}
            onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            currentUser={userName}
          />
        ) : (
          <div className="bg-slate-900 border border-red-500/25 p-8 text-center rounded-2xl">
            <h3 className="text-lg font-bold text-red-400">صلاحية معلقة بالمخالفة</h3>
            <p className="text-slate-400 mt-2 text-sm">
              الحساب الخاص بك ({userName}) مسجل بنجاح، ولكن المسار الوظيفي ({userRole}) يحتاج لتفعيل إداري من المدير العام عصفور.
            </p>
          </div>
        )}

      </main>

      {/* Elegant minimalist Footer */}
      <footer className="bg-slate-900 border-t border-slate-850/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <div>© {new Date().getFullYear()} شركة فريند بلس لوجستيات - مصر. جميع الحقوق محفوظة.</div>
          <div className="flex items-center gap-1">
            <span>صمم بكل حب وعزم</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>لتوفير الأمان المالي اللحظي للشركاء</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
