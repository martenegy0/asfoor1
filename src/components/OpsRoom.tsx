import React, { useState, useMemo } from "react";
import { 
  Activity, 
  User, 
  MapPin, 
  PhoneCall, 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  Search, 
  X, 
  Copy, 
  ExternalLink, 
  Smile, 
  FileText, 
  Coins, 
  MessageSquare,
  Sparkles,
  ClipboardCheck,
  Package,
  AlertTriangle
} from "lucide-react";
import { getTodayDateStr, normalizeDateToYMD, toWA, toWAUrl, getOrderWAMessage, apiCall } from "../utils";
import { motion, AnimatePresence } from "motion/react";
import { Order } from "../types";

interface OpsRoomProps {
  token: string;
  role: string;
  username: string;
  orders: Order[];
  couriers: any[];
  onRefresh: () => void;
}

export default function OpsRoom({ token, role, username, orders, couriers, onRefresh }: OpsRoomProps) {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateStr());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCourier, setSelectedCourier] = useState<string | null>(null);
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>("");
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [selectedMapRegion, setSelectedMapRegion] = useState<string | null>(null);

  // States for settle all returns feature
  const [showConfirmSettleAll, setShowConfirmSettleAll] = useState(false);
  const [isSettlingAll, setIsSettlingAll] = useState(false);
  const [settleAllFeedback, setSettleAllFeedback] = useState<string | null>(null);

  // 1. Map configurations for major Egyptian delivery zones
  const regionConfig = useMemo(() => [
    {
      id: "cairo",
      name: "القاهرة والجيزة",
      searchKeys: ["القاهرة", "الجيزة", "حلوان", "أكتوبر", "قليوبية", "شبرا", "فيصل", "هرم", "التجمع", "مدينة نصر", "عين شمس", "المرج"],
      x: 135, y: 110,
      color: "from-amber-400 to-amber-600",
      accent: "amber",
      svgPath: "M 115,95 C 130,85 155,85 170,100 C 175,115 160,135 145,130 C 130,125 110,110 115,95 Z"
    },
    {
      id: "alex",
      name: "الإسكندرية والساحل",
      searchKeys: ["الإسكندرية", "الاسكندرية", "البحيرة", "مطروح", "الساحل", "دمنهور"],
      x: 60, y: 55,
      color: "from-sky-400 to-sky-600",
      accent: "sky",
      svgPath: "M 40,50 C 65,40 85,50 85,70 C 80,85 55,90 45,80 C 35,70 35,60 40,50 Z"
    },
    {
      id: "delta",
      name: "الدلتا والوجه البحري",
      searchKeys: ["طنطا", "المحلة", "المنصورة", "الغربية", "الدقهلية", "الشرقية", "المنوفية", "دمياط", "كفر الشيخ", "الزقازيق", "بنها", "شبين", "كفرالشيخ"],
      x: 110, y: 50,
      color: "from-emerald-400 to-emerald-600",
      accent: "emerald",
      svgPath: "M 90,45 C 105,35 125,35 135,50 C 135,65 115,80 100,75 C 85,70 85,55 90,45 Z"
    },
    {
      id: "canal",
      name: "مدن القناة وسيناء",
      searchKeys: ["السويس", "بورسعيد", "الإسماعيلية", "الاسماعيلية", "سيناء", "العريش", "شرم"],
      x: 185, y: 70,
      color: "from-purple-400 to-purple-600",
      accent: "purple",
      svgPath: "M 145,55 C 165,45 195,50 205,70 C 205,90 185,100 165,95 C 150,90 140,70 145,55 Z"
    },
    {
      id: "south",
      name: "الصعيد والوجه القبلي",
      searchKeys: ["الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "الصعيد", "قنا", "الاقصر", "اسوان"],
      x: 125, y: 165,
      color: "from-rose-400 to-rose-600",
      accent: "rose",
      svgPath: "M 110,130 C 120,125 135,130 145,145 C 145,165 130,190 115,185 C 105,180 100,150 110,130 Z"
    }
  ], []);

  // Pending returned orders of the selected courier on the selected date that are not fully settled yet
  const pendingReturns = useMemo(() => {
    if (!selectedCourier) return [];
    const rawOrders = getCourierDailyOrders(selectedCourier, selectedDate);
    return rawOrders.filter(o => {
      const statusStr = (o.status || "").toString().trim();
      const isAlreadySettled = ["تم تسليم المرتجع للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه", "تم تسليمه للمورد", "مرتجع تم تسليمه للمورد"].includes(statusStr);
      if (isAlreadySettled) return false;
      
      const isReturn = ["مرتجع", "مرتجع جديد", "مرتجع بالمستودع", "مرفوض", "فشل", "مسترجع", "جاري الرجوع للمورد", "التسليم للمورد", "مرتجع والعميل دفع الشحن", "مرتجع مدفوع الشحن"].includes(statusStr) || statusStr.includes("مرتجع");
      return isReturn;
    });
  }, [selectedCourier, selectedDate, orders]);

  const handleSettleAllReturns = async () => {
    if (!selectedCourier || pendingReturns.length === 0) return;
    setIsSettlingAll(true);
    setSettleAllFeedback("جاري تصفية كافة الأوردرات المرتجعة وتحديثها في قاعدة البيانات...");
    
    try {
      const updatesList = pendingReturns.map(o => ({
        tracking: o.tracking,
        status: "تم تسليمه للمورد"
      }));
      
      const res = await apiCall("updateOrdersStatusBulk", token, {
        updates: updatesList
      });
      
      if (res && res.ok) {
        setSettleAllFeedback(`✅ نجحت تصفية ${res.done || updatesList.length} أوردر مرتجع بنجاح تام!`);
        setTimeout(() => {
          setShowConfirmSettleAll(false);
          setSettleAllFeedback(null);
          onRefresh();
        }, 1500);
      } else {
        setSettleAllFeedback(`⚠️ فشلت التصفية: ${res?.error || "خطأ غير معروف في الخادم"}`);
      }
    } catch (err: any) {
      setSettleAllFeedback(`⚠️ حدث خطأ أثناء الاتصال بالخادم: ${err?.message || err}`);
    } finally {
      setIsSettlingAll(false);
    }
  };

  // 1. Get filtered list of couriers based on search term (name or region) and map selection
  const filteredCouriers = useMemo(() => {
    return couriers.filter(c => {
      if (selectedMapRegion) {
        const rConf = regionConfig.find(r => r.id === selectedMapRegion);
        if (rConf) {
          const cRegion = (c.region || "").toLowerCase();
          const belongs = rConf.searchKeys.some(key => cRegion.includes(key.toLowerCase()));
          if (!belongs) return false;
        }
      }
      const nameMatch = (c.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const regionMatch = (c.region || "").toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || regionMatch;
    });
  }, [couriers, searchTerm, selectedMapRegion, regionConfig]);

  // 2. Map orders for active calculations of the selected date
  // "ماذا يوجد في حقيبة المندوب لليوم الحالي حصرياً"
  // For safety and comprehensive tracking, we filter orders where the order was assigned to the courier
  // and either its main date or any processing dates map to the selectedDate.
  const getCourierDailyOrders = (courierName: string, dateStr: string) => {
    return orders.filter(o => {
      if (o.courier !== courierName) return false;
      const orderDateStr = normalizeDateToYMD(o.orderDate || o.createdAt);
      const delivDateStr = o.delivDate ? normalizeDateToYMD(o.delivDate) : "";
      const retDateStr = o.retDate ? normalizeDateToYMD(o.retDate) : "";
      const updateDateStr = o.updatedAt ? normalizeDateToYMD(o.updatedAt) : "";

      return (
        orderDateStr === dateStr ||
        delivDateStr === dateStr ||
        retDateStr === dateStr ||
        (o.status === "خارج مع المندوب" && updateDateStr === dateStr)
      );
    });
  };

  // 3. Compute overall operational statistics for the selected date
  const overallStats = useMemo(() => {
    let totalOrders = 0;
    let totalCash = 0;
    let totalShipFees = 0;
    let activeRidersCount = 0;

    couriers.forEach(c => {
      const riderOrders = getCourierDailyOrders(c.name, selectedDate);
      if (riderOrders.length > 0) {
        activeRidersCount++;
        totalOrders += riderOrders.length;
        totalCash += riderOrders.reduce((sum, o) => {
          const cod = Number(o.totalCOD || 0) || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
          return sum + cod;
        }, 0);
        totalShipFees += riderOrders.reduce((sum, o) => sum + Number(o.shipPrice || 0), 0);
      }
    });

    return { totalOrders, totalCash, totalShipFees, activeRidersCount };
  }, [couriers, orders, selectedDate]);

  // Compute dynamic stats per region for the active map mockup
  const regionalData = useMemo(() => {
    return regionConfig.map(region => {
      // Find couriers in this region
      const matchingCouriers = couriers.filter(c => {
        const cRegion = (c.region || "").toLowerCase();
        return region.searchKeys.some(key => cRegion.includes(key.toLowerCase()));
      });

      // Find all orders for these couriers on the selected date
      let regionOrdersCount = 0;
      let regionActiveCount = 0;
      let regionDeliveredCount = 0;
      let regionCash = 0;

      matchingCouriers.forEach(c => {
        const riderOrders = getCourierDailyOrders(c.name, selectedDate);
        regionOrdersCount += riderOrders.length;
        regionActiveCount += riderOrders.filter(o => o.status === "خارج مع المندوب" || o.status === "تم الإسناد").length;
        regionDeliveredCount += riderOrders.filter(o => o.status === "تم التسليم").length;
        regionCash += riderOrders.reduce((sum, o) => {
          const cod = Number(o.totalCOD || 0) || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
          return sum + cod;
        }, 0);
      });

      return {
        ...region,
        matchingCouriers,
        ordersCount: regionOrdersCount,
        activeCount: regionActiveCount,
        deliveredCount: regionDeliveredCount,
        cash: regionCash
      };
    });
  }, [couriers, orders, selectedDate, regionConfig]);

  // Handle Copy function to make life super easy
  const handleCopyText = (text: string, refId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(refId);
    setTimeout(() => {
      setCopiedTracking(null);
    }, 2000);
  };

  // Get active courier details
  const activeCourierData = useMemo(() => {
    if (!selectedCourier) return null;
    return couriers.find(c => c.name === selectedCourier) || { name: selectedCourier, region: "افتراضي", phone: "" };
  }, [selectedCourier, couriers]);

  // Get active courier's orders and stats for the selected date
  const inspectedOrders = useMemo(() => {
    if (!selectedCourier) return [];
    const rawOrders = getCourierDailyOrders(selectedCourier, selectedDate);
    if (!orderSearchTerm.trim()) return rawOrders;
    return rawOrders.filter(o => 
      (o.tracking || "").toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (o.customer || "").toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
      (o.phone || "").includes(orderSearchTerm)
    );
  }, [selectedCourier, selectedDate, orders, orderSearchTerm]);

  // Calculate stats for the inspected courier
  const inspectedStats = useMemo(() => {
    if (!selectedCourier) return { total: 0, productsCash: 0, totalShipping: 0, delivered: 0, returned: 0, active: 0 };
    const rawOrders = getCourierDailyOrders(selectedCourier, selectedDate);
    
    const total = rawOrders.length;
    const delivered = rawOrders.filter(o => o.status === "تم التسليم").length;
    const returned = rawOrders.filter(o => ["مرتجع", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد", "التسليم للمورد"].includes(o.status)).length;
    const active = rawOrders.filter(o => ["خارج مع المندوب", "تم الإسناد"].includes(o.status)).length;

    const productsCash = rawOrders.reduce((sum, o) => {
      // Products cash is the total expected COD or prodPrice
      return sum + (Number(o.totalCOD || 0) || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0)));
    }, 0);

    const totalShipping = rawOrders.reduce((sum, o) => sum + Number(o.shipPrice || 0), 0);

    return { total, productsCash, totalShipping, delivered, returned, active };
  }, [selectedCourier, selectedDate, orders]);

  return (
    <div className="p-4 md:p-6 text-right space-y-6 dir-rtl" style={{ direction: "rtl" }}>
      
      {/* Header section with Date filtering */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-white/6 p-5 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
            <Activity className="w-5 h-5 animate-pulse" />
            <h2 className="text-sm font-black text-slate-100 uppercase tracking-tight">غرفة العمليات وجدول المناديب اللحظي</h2>
          </div>
          <p className="text-[10px] text-slate-400 font-bold leading-relaxed max-w-2xl">
            شاشة الرقابة المركزية التفاعلية لمتابعة تفاصيل حقائب شحنات المناديب اليومية، ومراجعة العُهد المالية وقيمة كاش الشحنات في الشارع اليوم بشكل فوري.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-2 bg-slate-950 border border-white/6 px-3 py-1.5 rounded-xl">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] text-slate-300 font-bold ml-1">تاريخ المتابعة:</span>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-black text-amber-400 outline-none cursor-pointer select-none"
          />
        </div>
      </div>

      {/* Dynamic Summary counters for Selected Date */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-white/6 p-4 rounded-xl flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
            <span className="p-1 px-2 rounded-lg bg-indigo-505/20 text-indigo-400 font-bold text-[9px]">المناديب</span>
            <User className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500">مناديب قيد التشغيل اليوم</div>
            <div className="text-lg font-black text-indigo-400 font-mono mt-0.5">
              {overallStats.activeRidersCount} <span className="text-xs font-bold text-slate-500">/ {couriers.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/6 p-4 rounded-xl flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
            <span className="p-1 px-2 rounded-lg bg-amber-500/10 text-amber-500 font-bold text-[9px]">الأوردرات</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500">إجمالي شحنات الشارع</div>
            <div className="text-lg font-black text-amber-500 font-mono mt-0.5">
              {overallStats.totalOrders} <span className="text-xs font-black">شحنة</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/6 p-4 rounded-xl flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
            <span className="p-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-[9px]">كاش المنتجات</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-500">إجمالي عهدة الكاش المتوقعة</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              {overallStats.totalCash.toLocaleString()} <span className="text-xs font-bold">ج.م</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/6 p-4 rounded-xl flex flex-col justify-between h-24">
          <div className="flex justify-between items-start">
            <span className="p-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold text-[9px]">عمولات الشحن</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400">إجمالي إيراد الشحن</div>
            <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
              {overallStats.totalShipFees.toLocaleString()} <span className="text-xs font-bold">ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ Interactive Live Distribution Map Mockup */}
      <div className="bg-slate-900 border border-white/6 p-5 rounded-2xl shadow-xl space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-amber-500/15 text-amber-500 rounded-xl text-xs shrink-0">🗺️</span>
            <div>
              <h3 className="text-xs font-black text-slate-100">بوابة الرصد الجغرافي وتوزيع المناديب</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                توزيع فوري للمناديب والشحنات النشطة على مستوى أقاليم مصر التشغيلية. اضغط على أي إقليم للتصفية السريعة.
              </p>
            </div>
          </div>

          {selectedMapRegion && (
            <button
              onClick={() => setSelectedMapRegion(null)}
              className="text-[10px] text-red-400 hover:text-red-300 transition-all font-black border border-red-900/30 bg-red-950/20 px-3 py-1.5 rounded-xl cursor-pointer self-start sm:self-auto"
            >
              🚫 إلغاء تصفية الخريطة
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Interactive Vector Map Mockup (SVG) */}
          <div className="lg:col-span-5 bg-slate-950 border border-white/6 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
            {/* Grid background for technical/high-end UI touch */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

            <div className="absolute top-3 left-3 flex flex-col gap-1 text-[9px] font-bold text-slate-400 bg-slate-900/80 backdrop-blur-sm border border-white/5 p-2 rounded-lg z-10">
              <span className="text-slate-300 border-b border-white/5 pb-1 mb-1">دليل الخريطة:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>العاصمة والجيزة</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>الإسكندرية والساحل</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>محافظات الدلتا</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>مدن القناة وسيناء</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>الصعيد وقبلي</span>
              </div>
            </div>

            {/* Custom Interactive Egypt Vector Outline representation */}
            <svg viewBox="0 0 240 220" className="w-full max-w-[280px] h-auto z-0 select-none">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background Mediterranean Sea / Red Sea abstract lines */}
              <path d="M 10 30 Q 80 15 230 40" stroke="rgba(56, 189, 248, 0.1)" strokeWidth="2" fill="none" />
              <path d="M 200 120 Q 220 160 210 210" stroke="rgba(244, 63, 94, 0.08)" strokeWidth="1.5" fill="none" />

              {/* Map Regions */}
              {regionalData.map((reg) => {
                const isSelected = selectedMapRegion === reg.id;
                const isHovered = !selectedMapRegion || isSelected;

                return (
                  <g
                    key={reg.id}
                    onClick={() => setSelectedMapRegion(selectedMapRegion === reg.id ? null : reg.id)}
                    className="cursor-pointer transition-all duration-300"
                  >
                    {/* Outline Shape */}
                    <motion.path
                      d={reg.svgPath}
                      fill={isSelected ? "rgba(245, 158, 11, 0.15)" : "rgba(30, 41, 59, 0.4)"}
                      stroke={isSelected ? "#f59e0b" : "rgba(255,255,255,0.15)"}
                      strokeWidth={isSelected ? "2" : "1"}
                      whileHover={{ scale: 1.03, fill: "rgba(255,255,255,0.05)", stroke: "#64748b" }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />

                    {/* Interactive Pin point */}
                    <circle
                      cx={reg.x}
                      cy={reg.y}
                      r="4"
                      className={`fill-current ${
                        reg.id === "cairo" ? "text-amber-500" :
                        reg.id === "alex" ? "text-sky-500" :
                        reg.id === "delta" ? "text-emerald-500" :
                        reg.id === "canal" ? "text-purple-500" :
                        "text-rose-500"
                      }`}
                    />

                    {reg.activeCount > 0 && (
                      <circle
                        cx={reg.x}
                        cy={reg.y}
                        r="10"
                        className={`stroke-current fill-none animate-ping opacity-60 ${
                          reg.id === "cairo" ? "text-amber-500/40" :
                          reg.id === "alex" ? "text-sky-500/40" :
                          reg.id === "delta" ? "text-emerald-500/40" :
                          reg.id === "canal" ? "text-purple-500/40" :
                          "text-rose-500/40"
                        }`}
                        style={{ animationDuration: "2s" }}
                      />
                    )}

                    {/* Quick overlay counter badge next to the Pin */}
                    <g transform={`translate(${reg.x + 8}, ${reg.y - 4})`}>
                      <rect
                        width="18"
                        height="11"
                        rx="3"
                        fill="rgba(15, 23, 42, 0.85)"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="0.5"
                      />
                      <text
                        x="9"
                        y="8"
                        textAnchor="middle"
                        fontSize="7"
                        fontWeight="bold"
                        fill="#f8fafc"
                      >
                        {reg.ordersCount}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Text indicator for Nile River abstract flow */}
              <path d="M 125 210 Q 135 150 125 110" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1.5" fill="none" />
              <text x="110" y="200" fill="rgba(255, 255, 255, 0.15)" fontSize="6" fontWeight="bold" letterSpacing="1">
                نهر النيل
              </text>
            </svg>

            <span className="text-[9px] text-slate-500 font-bold mt-2 text-center">
              💡 اضغط على المناطق جغرافياً لفرز المناديب بالأسفل على الفور
            </span>
          </div>

          {/* Right Column: Interactive Region Cards List */}
          <div className="lg:col-span-7 flex flex-col gap-3 justify-center">
            {regionalData.map((reg) => {
              const isSelected = selectedMapRegion === reg.id;
              const hasActiveRiders = reg.matchingCouriers.length > 0;
              const deliveryRate = reg.ordersCount > 0 ? Math.round((reg.deliveredCount / reg.ordersCount) * 100) : 0;

              return (
                <div
                  key={reg.id}
                  onClick={() => setSelectedMapRegion(selectedMapRegion === reg.id ? null : reg.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                    isSelected
                      ? "bg-slate-950 border-amber-500 shadow-lg shadow-amber-500/5"
                      : "bg-slate-900/60 border-white/5 hover:border-white/10 hover:bg-slate-900"
                  }`}
                >
                  {/* Decorative glowing gradient backdrop on selection */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${reg.color}`} />
                      <span className="text-xs font-black text-slate-100">{reg.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block leading-none">إجمالي اليوم</span>
                        <span className="text-xs font-black font-mono text-slate-200 mt-1 block">
                          {reg.ordersCount} شحنة
                        </span>
                      </div>
                      <div className="w-px h-6 bg-white/5" />
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block leading-none">المناديب</span>
                        <span className="text-xs font-black font-mono text-indigo-400 mt-1 block">
                          {reg.matchingCouriers.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar for deliverability or load */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                      <span>نسبة الإنجاز اليومي:</span>
                      <span className="text-emerald-400 font-mono font-black">{deliveryRate}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${deliveryRate || (reg.ordersCount > 0 ? 15 : 0)}%` }}
                      />
                    </div>
                  </div>

                  {/* Nested Courier Badges */}
                  {hasActiveRiders ? (
                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-white/5 mt-1">
                      <span className="text-[8px] font-black text-slate-500 self-center">المناديب بالمنطقة:</span>
                      {reg.matchingCouriers.map((c) => (
                        <span
                          key={c.name}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourier(c.name);
                          }}
                          className="px-2 py-0.5 bg-slate-950/80 hover:bg-slate-950 text-[9px] font-black text-amber-400 rounded-md border border-white/5 transition-all"
                        >
                          👤 {c.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[8px] font-bold text-slate-600 mt-1 leading-none">
                      ⚠️ لا يوجد مناديب مسجلين ميدانياً في هذا الإقليم اليوم
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Riders Listing & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96 text-right">
            <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
            <input 
              type="text"
              placeholder="البحث عن مندوب بالاسم أو المنطقة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/6 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-200 focus:outline-none focus:border-amber-500 transition-all text-right"
            />
          </div>
          <button 
            onClick={onRefresh}
            className="w-full md:w-auto px-4 py-2.5 bg-slate-950 border border-white/6 hover:border-slate-800 rounded-xl font-bold text-xs text-slate-300 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <span>🔄 تحديث المتجر الفوري</span>
          </button>
        </div>

        {/* Courier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCouriers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-xs text-slate-500 bg-slate-900 border border-white/6 rounded-2xl animate-pulse">
              لا يوجد مناديب مسجلين يطابقون اسم البحث.
            </div>
          ) : (
            filteredCouriers.map(c => {
              const riderOrders = getCourierDailyOrders(c.name, selectedDate);
              const totalCount = riderOrders.length;
              const deliveredCount = riderOrders.filter(o => ["تم التسليم", "تم التسليم بنجاح", "تم التسليم (ناجح كاش)", "تسليم جزئي", "تسليم جزئي - معلق للجرد", "مرتجع جزئي"].includes(o.status)).length;
              const returnedCount = riderOrders.filter(o => ["مرتجع", "مرتجع جديد", "مرتجع بالمستودع", "تم تسليم المرتجع للمورد", "تم تسليم المرتجع للمورد وتصفية حسابه", "جاري الرجوع للمورد", "التسليم للمورد", "تم تسليمه للمورد", "مرتجع تم تسليمه للمورد", "مرتجع والعميل دفع الشحن"].includes(o.status)).length;
              const activeCount = riderOrders.filter(o => ["خارج مع المندوب", "تم الإسناد", "مسند", "تم الاسناد", "العميل رد وجاري التسليم", "تم رد العميل وجاري التنسيق", "خارج للتسليم", "خارج للتوصيل", "مع المندوب"].includes(o.status)).length;
              
              const productsValue = riderOrders.reduce((sum, o) => {
                return sum + (Number(o.totalCOD || 0) || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0)));
              }, 0);

              const successRate = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0;

              return (
                <div 
                  key={c.name}
                  className="bg-slate-900 border border-white/6 rounded-2xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-md group"
                  id={`ops-courier-card-${c.name}`}
                >
                  <div className="space-y-4">
                    {/* Card Header */}
                    <div className="flex justify-between items-start border-b border-white/6 pb-3">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-0.5 rounded-lg">
                        📍 {c.region || "منطقة غير محددة"}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-slate-100 group-hover:text-amber-500 transition-colors">
                          {c.name}
                        </span>
                      </div>
                    </div>

                    {/* 7-Status High Density Grid */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 font-extrabold block text-right">📊 توزيع حالات الأوردرات الـ 28:</span>
                      <div className="grid grid-cols-4 gap-1.5 text-center bg-slate-950/70 p-2.5 rounded-xl border border-white/4">
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-blue-400">🆕 جديد</div>
                          <div className="text-[11px] font-mono font-black text-slate-200 mt-0.5">
                            {riderOrders.filter(o => o.status === "جديد").length}
                          </div>
                        </div>
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-amber-500">📋 مسند</div>
                          <div className="text-[11px] font-mono font-black text-slate-200 mt-0.5">
                            {riderOrders.filter(o => ["تم الإسناد", "مسند", "تم الاسناد", "العميل رد وجاري التسليم", "تم رد العميل وجاري التنسيق"].includes(o.status)).length}
                          </div>
                        </div>
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-teal-400">🚚 خارج</div>
                          <div className="text-[11px] font-mono font-black text-slate-200 mt-0.5">
                            {riderOrders.filter(o => ["خارج مع المندوب", "خارج للتسليم", "خارج للتوصيل", "مع المندوب"].includes(o.status)).length}
                          </div>
                        </div>
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-emerald-400">✅ مسلّم</div>
                          <div className="text-[11px] font-mono font-black text-emerald-400 mt-0.5">
                            {deliveredCount}
                          </div>
                        </div>
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-red-400">📦 مرتجع</div>
                          <div className="text-[11px] font-mono font-black text-slate-200 mt-0.5">
                            {returnedCount}
                          </div>
                        </div>
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-indigo-400">⏳ مؤجل</div>
                          <div className="text-[11px] font-mono font-black text-slate-200 mt-0.5">
                            {riderOrders.filter(o => ["مؤجل", "مؤجل بالمستودع"].includes(o.status)).length}
                          </div>
                        </div>
                        <div className="bg-slate-900/40 p-1.5 rounded border border-white/2">
                          <div className="text-[8px] font-bold text-rose-550">📵 لا يرد</div>
                          <div className="text-[11px] font-mono font-black text-slate-200 mt-0.5">
                            {riderOrders.filter(o => ["لا يوجد رد", "العميل لم يقم بالرد", "العميل لا يرد", "لا يوجد رد بالمستودع"].includes(o.status)).length}
                          </div>
                        </div>
                        <div className="bg-amber-950/20 p-1.5 rounded border border-amber-500/10">
                          <div className="text-[8px] font-black text-amber-500">💼 إجمالي</div>
                          <div className="text-[11px] font-mono font-black text-amber-500 mt-0.5">
                            {totalCount}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial stats */}
                    <div className="space-y-2 text-[11px] font-bold bg-slate-950 p-3 rounded-xl border border-white/4">
                      {/* Calculated actual cash strictly */}
                      {(() => {
                        const deliveredOrdersList = riderOrders.filter(o => ["تم التسليم", "تم التسليم بنجاح", "تم التسليم (ناجح كاش)", "تسليم جزئي"].includes(o.status));
                        const actualCash = deliveredOrdersList.reduce((sum, o) => {
                          const cod = Number(o.totalCOD || 0) || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
                          return sum + cod;
                        }, 0);

                        return (
                          <>
                            <div className="flex justify-between items-center text-slate-400">
                              <span className="text-slate-200 font-mono text-emerald-400">{actualCash.toLocaleString("ar")} ج.م</span>
                              <span>💵 الكاش الفعلي بالعهدة:</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400">
                              <span className="text-slate-400 font-mono">{productsValue.toLocaleString("ar")} ج.م</span>
                              <span>📦 قيمة إجمالي العهود الحالية:</span>
                            </div>
                          </>
                        );
                      })()}
                      
                      {/* Success rate progress bar */}
                      <div className="space-y-1 border-t border-white/4 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-emerald-400 text-[10px]">{successRate}%</span>
                          <span className="text-slate-500 text-[10px]">معدل إنجاز اليوم:</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${successRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="mt-5 pt-3 border-t border-white/6 flex gap-2">
                    {c.phone && (
                      <>
                        <a 
                          href={`tel:${c.phone.toString().startsWith('0') ? c.phone.toString() : '0' + c.phone.toString()}`}
                          className="p-2 border border-blue-900/40 hover:border-blue-500 bg-blue-950/20 text-blue-400 rounded-xl cursor-pointer active:scale-95 transition-all text-xs flex items-center justify-center"
                          title="اتصال هاتفي بالمندوب"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>
                        <a 
                          href={toWAUrl(c.phone)}
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 border border-emerald-900/40 hover:border-emerald-500 bg-emerald-950/20 text-emerald-400 rounded-xl cursor-pointer active:scale-95 transition-all text-xs flex items-center justify-center"
                          title="مراسلة المندوب واتساب"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedCourier(c.name);
                        setOrderSearchTerm("");
                      }}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
                    >
                      <span>👜 تفاصيل الحقيبة اللحظية</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          LIVE INSPECTOR POP-UP MODAL (AnimatePresence React Flow)
          ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedCourier && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedCourier(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/8 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 bg-slate-950 border-b border-white/6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                    <h3 className="text-sm font-black text-slate-100">
                      حقيبة شحنات المندوب: <span className="text-amber-500">{selectedCourier}</span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold mt-1.5">
                    <span>📍 {activeCourierData?.region || "غير محدد"}</span>
                    <span>•</span>
                    <span className="font-mono">{activeCourierData?.phone || "—"}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-black">📅 {selectedDate}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedCourier(null)}
                  className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 rounded-xl border border-white/6 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inspector Content container */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 text-right">
                
                {/* 1. Metric cards - Bento representation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Total orders in street today */}
                  <div className="bg-slate-950 border border-white/6 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-slate-500">إجمالي الأوردرات في الشارع اليوم</div>
                      <div className="text-2xl font-black text-slate-100 font-mono">
                        {inspectedStats.total} <span className="text-xs font-normal text-slate-400">طرد</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Product Value (کاش المنتجات) */}
                  <div className="bg-slate-950 border border-white/6 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Coins className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-slate-500">إجمالي كاش المنتجات بالجنيه</div>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        {inspectedStats.productsCash.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Shipping costs */}
                  <div className="bg-slate-950 border border-white/6 p-5 rounded-2xl flex items-center gap-4 relative overflow-hidden">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-slate-500">إجمالي مصاريف الشحن</div>
                      <div className="text-2xl font-black text-cyan-400 font-mono">
                        {inspectedStats.totalShipping.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status indicator row summary */}
                <div className="flex flex-wrap gap-2 py-3 px-4 bg-slate-950/60 rounded-xl border border-white/4 text-xs font-bold items-center">
                  <span className="text-slate-400">حالات شحنات حقيبة اليوم:</span>
                  <span className="px-2.5 py-1 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-lg">
                    {inspectedStats.delivered} تم التسليم
                  </span>
                  <span className="px-2.5 py-1 bg-red-950/40 text-red-400 border border-red-900/30 rounded-lg">
                    {inspectedStats.returned} مرتجع ومرفوض
                  </span>
                  {pendingReturns.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSettleAllFeedback(null);
                        setShowConfirmSettleAll(true);
                      }}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer transition-all active:scale-95 duration-150 flex items-center gap-1.5 shrink-0 shadow-lg shadow-red-900/20"
                      title="تصفية كافة الأوردرات المرتجعة لهذا المندوب دفعة واحدة"
                    >
                      <span>🤝 تصفية الكل</span>
                    </button>
                  )}
                  <span className="px-2.5 py-1 bg-blue-950/40 text-blue-400 border border-blue-900/30 rounded-lg">
                    {inspectedStats.active} معلق قيد التشغيل
                  </span>
                </div>

                {/* Orders detailed listing inside pop-up */}
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0c1224] p-3 rounded-xl border border-white/4">
                    <div className="text-xs font-black text-slate-300">
                      📄 قائمة الشوراع والطرود بالتفصيل ({inspectedOrders.length})
                    </div>
                    <div className="relative w-full md:w-80">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 right-3" />
                      <input 
                        type="text" 
                        placeholder="ابحث بكود الطرد، اسم العميل، الهاتف..."
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-white/6 rounded-lg py-1.5 pr-9 pl-4 text-xs text-slate-200 focus:outline-none focus:border-amber-500 text-right font-bold"
                      />
                    </div>
                  </div>

                  {/* Main Detailed Orders Table */}
                  <div className="overflow-x-auto rounded-xl border border-white/6 bg-slate-950">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-slate-400 border-b border-white/6 h-10 select-none">
                          <th className="px-4 text-right py-2.5 font-bold">كود الأوردر</th>
                          <th className="px-4 text-right py-2.5 font-bold">اسم العميل</th>
                          <th className="px-4 text-right py-2.5 font-bold">رقم الهاتف</th>
                          <th className="px-4 text-right py-2.5 font-bold">العنوان المكتمل</th>
                          <th className="px-4 text-center py-2.5 font-bold">سعر المنتج</th>
                          <th className="px-4 text-center py-2.5 font-bold">مصاريف الشحن</th>
                          <th className="px-4 text-center py-2.5 font-bold">حالة الأوردر الحالية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/4">
                        {inspectedOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-500 text-[11px] font-bold">
                              لا توجد أي شحنات في حقيبة المندوب مطابقة لتاريخ أو معيار البحث.
                            </td>
                          </tr>
                        ) : (
                          inspectedOrders.map(o => {
                            const codValue = Number(o.totalCOD || 0) || (Number(o.prodPrice || 0) + Number(o.shipPrice || 0));
                            const productPriceOnly = Number(o.prodPrice || 0);
                            const shipPriceOnly = Number(o.shipPrice || 0);

                            // Badges for status styling
                            let statusStyle = "bg-slate-900 border-slate-700 text-slate-400";
                            if (o.status === "تم التسليم") {
                              statusStyle = "bg-emerald-950/40 text-emerald-400 border-emerald-900/30";
                            } else if (["مرتجع", "التسليم للمورد", "تم تسليم المرتجع للمورد", "مرتجع تم تسليمه للمورد"].includes(o.status)) {
                              statusStyle = "bg-red-950/45 text-red-500 border-red-900/30 font-black";
                            } else if (["خارج مع المندوب", "تم الإسناد"].includes(o.status)) {
                              statusStyle = "bg-blue-950/40 text-blue-400 border-blue-900/30 font-bold";
                            } else if (["مؤجل", "لا يوجد رد", "العميل لم يقم بالرد"].includes(o.status)) {
                              statusStyle = "bg-amber-950/40 text-amber-500 border-amber-900/30";
                            }

                            return (
                              <tr 
                                key={o.tracking} 
                                className="hover:bg-white/[2%] transition-all h-11"
                              >
                                <td className="px-4 py-2 font-mono text-amber-400 font-extrabold whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    <button 
                                      onClick={() => handleCopyText(o.tracking, o.tracking)}
                                      className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-white/6 cursor-pointer"
                                      title="نسخ كود الأوردر"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <span className="text-[11px]">{o.tracking}</span>
                                    {copiedTracking === o.tracking && (
                                      <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded border border-emerald-900/20">تم النسخ!</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-2 font-black text-slate-100 whitespace-nowrap">
                                  {o.customer || "—"}
                                </td>
                                <td className="px-4 py-2 font-mono font-bold text-slate-300 whitespace-nowrap">
                                  {o.phone ? (
                                    <div className="flex items-center gap-1.5">
                                      <a 
                                        href={`tel:${o.phone.toString().startsWith('0') ? o.phone.toString() : '0' + o.phone.toString()}`}
                                        className="text-slate-400 hover:text-amber-500 shrink-0"
                                        title="اتصال هاتفي"
                                      >
                                        <PhoneCall className="w-3 h-3 text-slate-400" />
                                      </a>
                                      <a 
                                        href={toWAUrl(o.phone, getOrderWAMessage(o))}
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-emerald-500 hover:text-emerald-400 shrink-0"
                                        title="مراسلة واتساب"
                                      >
                                        <MessageSquare className="w-3 h-3" />
                                      </a>
                                      <span>{o.phone}</span>
                                    </div>
                                  ) : "—"}
                                </td>
                                <td className="px-4 py-2 text-slate-300 max-w-xs truncate font-bold text-[10.5px]">
                                  {o.gov} • {o.region} • {o.address}
                                </td>
                                <td className="px-4 py-2 text-center text-slate-100 font-mono font-extrabold whitespace-nowrap">
                                  {productPriceOnly.toLocaleString()} ج.م
                                </td>
                                <td className="px-4 py-2 text-center text-cyan-400 font-mono font-extrabold whitespace-nowrap">
                                  {shipPriceOnly.toLocaleString()} ج.م
                                </td>
                                <td className="px-4 py-2 text-center whitespace-nowrap">
                                  <span className={`px-2.5 py-1 text-[10px] rounded-lg border leading-none font-bold ${statusStyle}`}>
                                    {o.status || "قيد الانتظار"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950 border-t border-white/6 flex items-center justify-between">
                <div className="text-[10px] text-slate-500 font-bold">
                  * يتم جرد الحساب والعدادات بناء على كاش الشارع المتنقل والعهود المسندة للمندوب.
                </div>
                <button 
                  onClick={() => setSelectedCourier(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-850 border border-white/6 hover:border-slate-800 text-slate-300 font-black text-xs rounded-xl cursor-pointer active:scale-95 transition-all"
                >
                  إغلاق الشاشة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settle All Returns Confirmation Modal */}
      <AnimatePresence>
        {showConfirmSettleAll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => {
              if (!isSettlingAll) setShowConfirmSettleAll(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl p-6 text-right space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
                <h4 className="text-sm font-black text-slate-100">تأكيد التصفية الجماعية للمرتجعات</h4>
              </div>
              
              <p className="text-xs text-slate-300 leading-relaxed font-bold">
                هل أنت متأكد من تصفية جميع الأوردرات المرتجعة المعلقة <span className="text-red-400 font-mono">({pendingReturns.length} أوردر)</span> للمندوب <span className="text-amber-500 font-extrabold">{selectedCourier}</span> دفعة واحدة؟
              </p>
              
              <p className="text-[10px] text-slate-400 leading-normal">
                * سيتم تحويل حالة هذه الأوردرات إلى <span className="text-emerald-400">"تم تسليم المرتجع للمورد"</span> وتصفية عهدة المندوب منها فوراً.
              </p>

              {settleAllFeedback && (
                <div className="p-3 bg-slate-950 rounded-xl border border-white/5 text-[11px] font-black text-center text-amber-400">
                  {settleAllFeedback}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSettlingAll}
                  onClick={handleSettleAllReturns}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-slate-950 hover:text-slate-950 disabled:opacity-50 font-black text-xs rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  {isSettlingAll ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>نعم، تصفية الكل 🤝</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSettlingAll}
                  onClick={() => setShowConfirmSettleAll(false)}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 font-black text-xs rounded-xl cursor-pointer transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
