import React, { useEffect, useState } from "react";
import { TrendingUp, Award, Calendar, Wallet, CheckCircle2, AlertTriangle, Truck, Layers, Search, BarChart3 } from "lucide-react";
import { apiCall } from "../utils";

interface DashboardProps {
  token: string;
}

export default function Dashboard({ token }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [bestCourier, setBestCourier] = useState("—");
  const [bestSupplier, setBestSupplier] = useState("—");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  async function loadData() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await apiCall("dashboard", token);
      if (res.ok) {
        setStats(res.stats);
        
        // Parse and normalize couriers list to support both Object.entries and normal object formats
        let parsedCouriers: any[] = [];
        if (Array.isArray(res.couriers)) {
          parsedCouriers = res.couriers.map((c: any) => {
            if (Array.isArray(c) && c.length === 2 && typeof c[0] === "string" && typeof c[1] === "object") {
              return {
                name: c[0],
                total: c[1].total || 0,
                delivered: c[1].delivered || 0,
                returned: c[1].returned || 0,
                rate: c[1].rate || 0,
                cod: c[1].cod || 0
              };
            } else if (c && typeof c === "object" && "name" in c) {
              return c;
            } else if (c && typeof c === "object") {
              return {
                name: c.name || "مجهول",
                total: c.total || 0,
                delivered: c.delivered || 0,
                returned: c.returned || 0,
                rate: c.rate || 0,
                cod: c.cod || 0
              };
            }
            return null;
          }).filter(Boolean);
        }
        setCouriers(parsedCouriers);

        let parsedSuppliers: any[] = [];
        if (Array.isArray(res.suppliers)) {
          parsedSuppliers = res.suppliers.map((s: any) => {
            if (Array.isArray(s) && s.length === 2 && typeof s[0] === "string" && typeof s[1] === "object") {
              return {
                name: s[0],
                total: s[1].total || 0,
                delivered: s[1].delivered || 0,
                returned: s[1].returned || 0,
                rate: s[1].rate || 0,
                cod: s[1].cod || 0
              };
            } else if (s && typeof s === "object" && "name" in s) {
              return s;
            } else if (s && typeof s === "object") {
              return {
                name: s.name || "مجهول",
                total: s.total || 0,
                delivered: s.delivered || 0,
                returned: s.returned || 0,
                rate: s.rate || 0,
                cod: s.cod || 0
              };
            }
            return null;
          }).filter(Boolean);
        }
        setSuppliers(parsedSuppliers);

        setBestCourier(res.bestCourier || "—");
        setBestSupplier(res.bestSupplier || "—");
      } else {
        setErrorMsg(res.error || "خطأ أثناء جلب مؤشرات لوحة التحكم");
      }
    } catch (err) {
      setErrorMsg("عطل في الاتصال بالخادم، لم يتم جلب التقارير اللحظية");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm select-none">
        <div className="inline-block animate-spin mr-2">⏳</div>
        جاري تحديث المؤشرات المدمجة وحساب الرصيد اليومي...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="p-8 m-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-center text-sm">
        ⚠️ {errorMsg}
        <button onClick={loadData} className="block mx-auto mt-4 px-4 py-2 bg-red-900/45 text-slate-200 text-xs rounded-lg font-bold">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const s = stats || { total: 0, todayTotal: 0, delivered: 0, returned: 0, pending: 0, active: 0, totalCOD: 0, todayCOD: 0, profit: 0, rate: 0 };

  const getRateColor = (r: number) => {
    if (r >= 75) return "text-emerald-400 bg-emerald-950/20 border border-emerald-900/30";
    if (r >= 50) return "text-amber-400 bg-amber-950/20 border border-amber-900/30";
    return "text-red-400 bg-red-950/20 border border-red-900/30";
  };

  return (
    <div className="p-4 space-y-6 select-none font-sans text-right">
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="col-span-2 md:col-span-1 bg-slate-900 border border-white/6 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 text-amber-500/15">
            <Layers size={48} />
          </div>
          <div className="text-3xl font-black text-amber-500">{s.total}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">إجمالي الطلبات المستلمة</div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 text-emerald-500/10">
            <CheckCircle2 size={48} />
          </div>
          <div className="text-3xl font-black text-emerald-400">{s.delivered}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">تم التسليم والتحصيل</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1 inline-block px-1.5 py-0.5 rounded bg-emerald-950/20">
             نسبة {s.rate}% نجاح
          </div>
        </div>

        {/* Returned Orders */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 text-red-500/10">
            <AlertTriangle size={48} />
          </div>
          <div className="text-3xl font-black text-red-400">{s.returned}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">المرتجع والمرفوض</div>
        </div>

        {/* Active Orders with courier */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 text-center relative overflow-hidden">
          <div className="absolute top-2 left-2 text-blue-500/10">
            <Truck size={48} />
          </div>
          <div className="text-3xl font-black text-blue-400">{s.active}</div>
          <div className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-wider">خارج مع المناديب</div>
        </div>
      </div>

      {/* Major Financial Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total COD */}
        <div className="md:col-span-1 bg-slate-900 border border-white/6 rounded-2xl p-6 text-center space-y-1 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-emerald-500/10">
            <Wallet size={48} />
          </div>
          <div className="text-sm font-bold text-slate-500">مجموع التحصيل المتراكم</div>
          <div className="text-3xl font-black text-emerald-400">
            {(s.totalCOD || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold">بما في ذلك سعر الشحن والمنتجات المسلّمة</div>
        </div>

        {/* Today's Stats & Cash (Seventh Point Fix!) */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-6 text-center space-y-1 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-amber-500/10">
            <Calendar size={48} />
          </div>
          <div className="text-sm font-bold text-slate-400">طلبات اليوم مضافة</div>
          <div className="text-3xl font-black text-amber-400">{s.todayTotal}</div>
          <div className="text-[10px] text-slate-400 font-bold">المحسوبة من تاريخ الإنشاء الفعلي اليوم</div>
        </div>

        {/* Today's Actual Settlement Cash (Seventh Point Fix!) */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-6 text-center space-y-1 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-amber-500/10">
            <TrendingUp size={48} />
          </div>
          <div className="text-sm font-bold text-slate-450">تحصيل اليوم الفعلي</div>
          <div className="text-3xl font-black text-amber-500">
            {(s.todayCOD || 0).toLocaleString("ar")} <span className="text-xs">ج.م</span>
          </div>
          <div className="text-[10px] text-slate-400 font-bold">جميع المبالغ المحصّلة فعلياً اليوم</div>
        </div>
      </div>

      {/* High Performers Recognition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl ring-4 ring-purple-900/20 p-2.5 rounded-xl bg-purple-950/10">🛵</span>
            <div>
              <div className="text-xs text-slate-500 font-bold">أفضل مندوب تسليم</div>
              <div className="text-sm font-black text-purple-400 mt-0.5">{bestCourier}</div>
            </div>
          </div>
          <div className="text-[10px] bg-purple-950/25 text-purple-300 font-bold px-2 py-1 rounded-lg">
            الأكثر كفاءة بالتسليم
          </div>
        </div>

        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl ring-4 ring-amber-900/20 p-2.5 rounded-xl bg-amber-950/10">📦</span>
            <div>
              <div className="text-xs text-slate-500 font-bold">أفضل مورد للشركة</div>
              <div className="text-sm font-black text-amber-400 mt-0.5">{bestSupplier}</div>
            </div>
          </div>
          <div className="text-[10px] bg-amber-950/25 text-amber-300 font-bold px-2 py-1 rounded-lg">
            الأكبر في حجم المبيعات
          </div>
        </div>
      </div>

      {/* Leaderboards Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        {/* Couriers Leaderboard */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/6 pb-3">
            <h3 className="text-xs font-black text-slate-400 tracking-wider">🛵 ليدربورد وجداول المناديب</h3>
            <BarChart3 size={16} className="text-slate-500" />
          </div>
          {couriers.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">لا يوجد مناديب مسجلين حالياً</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-extrabold border-b border-white/6 text-right">
                    <th className="p-3">المندوب</th>
                    <th className="p-3 text-center">الإجمالي</th>
                    <th className="p-3 text-center text-emerald-400">مسلَّم</th>
                    <th className="p-3 text-center text-red-400">مرتجع</th>
                    <th className="p-3 text-center">النسبة</th>
                    <th className="p-3 text-left">COD محصل</th>
                  </tr>
                </thead>
                <tbody>
                  {couriers.map((c: any, index: number) => (
                    <tr key={index} className="border-b border-white/4 hover:bg-slate-950/50 transition-colors">
                      <td className="p-3 font-bold text-slate-350">{c.name}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-400">{c.total}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-400">{c.delivered}</td>
                      <td className="p-3 text-center font-mono font-bold text-red-400">{c.returned}</td>
                      <td className="p-3 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${getRateColor(c.rate)}`}>
                          {c.rate}%
                        </span>
                      </td>
                      <td className="p-3 text-left font-mono font-bold text-emerald-400">
                        {(c.cod || 0).toLocaleString("ar")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Suppliers Leaderboard */}
        <div className="bg-slate-900 border border-white/6 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/6 pb-3">
            <h3 className="text-xs font-black text-slate-400 tracking-wider">📦 ليدربورد وأداء الموردين</h3>
            <BarChart3 size={16} className="text-slate-500" />
          </div>
          {suppliers.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">لا يوجد موردين مسجلين حالياً</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-extrabold border-b border-white/6 text-right">
                    <th className="p-3">المورد</th>
                    <th className="p-3 text-center">الإجمالي</th>
                    <th className="p-3 text-center text-emerald-400">مسلَّم</th>
                    <th className="p-3 text-center text-red-400">مرتجع</th>
                    <th className="p-3 text-left">النسبة</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((s: any, index: number) => (
                    <tr key={index} className="border-b border-white/4 hover:bg-slate-950/50 transition-colors">
                      <td className="p-3 font-bold text-slate-350">{s.name}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-400">{s.total}</td>
                      <td className="p-3 text-center font-mono font-bold text-emerald-400">{s.delivered}</td>
                      <td className="p-3 text-center font-mono font-bold text-red-400">{s.returned}</td>
                      <td className="p-3 text-left">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[10px] ${getRateColor(s.rate)}`}>
                          {s.rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
