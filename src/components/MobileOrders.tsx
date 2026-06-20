import React, { useState, useRef, useMemo, useEffect } from "react";
import { Phone, MessageSquare, Search, Trash2 } from "lucide-react";
import { apiCall } from "../utils";

interface SearchableCourierSelectProps {
  value: string;
  onChange: (val: string) => void;
  couriers: any[];
  placeholder?: string;
  id?: string;
  showWarehouseReset?: boolean;
}

function SearchableCourierSelect({ value, onChange, couriers, placeholder = "اختر المندوب...", id, showWarehouseReset }: SearchableCourierSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse cached list if sheets fetch fails or to avoid sheets roundtripping
  const cachedCouriers = useMemo(() => {
    try {
      const cached = localStorage.getItem("fp_cached_couriers");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...couriers];
          parsed.forEach((x: any) => {
            if (x && x.name && !merged.some(y => y.name === x.name)) {
              merged.push(x);
            }
          });
          return merged;
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (couriers && couriers.length > 0) {
      localStorage.setItem("fp_cached_couriers", JSON.stringify(couriers));
    }
    return couriers;
  }, [couriers]);

  const filtered = useMemo(() => {
    return cachedCouriers.filter(c => 
      (c?.name || "").toString().toLowerCase().includes(search.toLowerCase()) ||
      (c?.region || "").toString().toLowerCase().includes(search.toLowerCase())
    );
  }, [cachedCouriers, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedCourier = cachedCouriers.find(c => c.name === value);

  return (
    <div ref={dropdownRef} className="relative w-full text-right" id={id}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-4 py-3 text-xs text-right flex items-center justify-between gap-2 min-h-[46px] cursor-pointer hover:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20 transition-all font-black"
      >
        <span className="text-slate-400">▼</span>
        <span className="truncate">
          {value === "reset_warehouse" 
            ? "🔄 إعادة للمستودع (سحب من المندوب وإرجاعه طلب حر)"
            : selectedCourier 
              ? `👤 ${selectedCourier.name} (${selectedCourier.region || "شامل"})` 
              : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-full bg-slate-900 border border-white/12 rounded-2xl p-2.5 shadow-2xl z-[900] space-y-2 animate-in fade-in slide-in-from-top-1 duration-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث باسم المندوب أو المنطقة..."
            className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-3 py-2.5 text-xs text-right outline-none focus:border-amber-505/50"
            autoFocus
          />
          <div className="max-h-[180px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-705">
            {placeholder && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="w-full text-right px-3 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-950 hover:text-white rounded-lg transition-colors"
              >
                {placeholder}
              </button>
            )}
            {showWarehouseReset && (
              <button
                type="button"
                onClick={() => {
                  onChange("reset_warehouse");
                  setIsOpen(false);
                }}
                className="w-full text-right px-3 py-2 text-xs font-black text-amber-400 hover:bg-slate-950 rounded-lg transition-colors border border-amber-500/10"
              >
                🔄 إعادة تعيين للمستودع (سحب وتخلية)
              </button>
            )}
            {filtered.map((c: any, index: number) => (
              <button
                key={c.name || index}
                type="button"
                onClick={() => {
                  onChange(c.name);
                  setIsOpen(false);
                }}
                className="w-full text-right px-3 py-2 text-xs font-black text-slate-250 hover:bg-amber-500 hover:text-slate-950 rounded-lg transition-all"
              >
                👤 {c.name} {c.region ? `(${c.region})` : ""}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileOrdersProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  token: string | null;
  role: string | null;
  isAdmin: boolean;
  isSuper: boolean;
  isOps: boolean;
  isAgent: boolean;
  canManage: boolean;
  canSelectBulk: boolean;
  canReconcile: boolean;
  visibleOrders: any[];
  statusCounts: { [key: string]: number };
  couriers: any[];
  search: string;
  setSearch: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  selectedDate: string;
  setSelectedDate: (val: string) => void;
  selectedSupplierFilter: string;
  setSelectedSupplierFilter: (val: string) => void;
  triggerStatusUpdate: (
    tracking: string,
    newStatus: string,
    returnShippingType?: string,
    notes?: string,
    delivDate?: string,
    clearCourierWithSignature?: boolean,
    partialAmount?: number
  ) => void;
  onRefresh: () => void;
  selected: Set<string>;
  setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
  getBadgeStyle: (status: string) => string;
  getOrderWAMessage: (o: any) => string;
  toWAUrl: (phone: any, msg: string) => string;
  setReturnedSelectOpen: (val: boolean) => void;
  setSelectedReturnOrder: (val: any) => void;
}

export default function MobileOrders({
  orders,
  setOrders,
  token,
  role,
  isAdmin,
  isSuper,
  isOps,
  isAgent,
  canManage,
  canSelectBulk,
  canReconcile,
  visibleOrders,
  statusCounts,
  couriers,
  search,
  setSearch,
  activeFilter,
  setActiveFilter,
  selectedDate,
  setSelectedDate,
  selectedSupplierFilter,
  setSelectedSupplierFilter,
  triggerStatusUpdate,
  onRefresh,
  selected,
  setSelected,
  getBadgeStyle,
  getOrderWAMessage,
  toWAUrl,
  setReturnedSelectOpen,
  setSelectedReturnOrder
}: MobileOrdersProps) {
  const [mobileDrawerOrder, setMobileDrawerOrder] = useState<any | null>(null);
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(25);

  const toggleSelect = (tracking: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tracking)) {
        next.delete(tracking);
      } else {
        next.add(tracking);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === visibleOrders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visibleOrders.map((o) => o.tracking)));
    }
  };

  const getTodayDateStr = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  return (
    <div className="block md:hidden space-y-3.5 antialiased text-right font-sans pb-24 h-full relative" id="mobile_shipments_container">
      
      {/* 🌟 Sticky Top Header */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/6 px-4 py-3 flex items-center gap-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث برقم تتبع، اسم عميل، أو مورد..."
            className="w-full bg-slate-900 border border-white/6 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-205 placeholder-slate-500 text-right outline-none focus:border-amber-500/30"
            id="mobile_search_input"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 text-xs py-1 px-1.5 font-bold"
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => setBarcodeScannerOpen(!barcodeScannerOpen)}
          className={`p-2.5 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
            barcodeScannerOpen
              ? "bg-amber-500 text-slate-950 border-amber-500 font-bold"
              : "bg-slate-950 text-amber-550 border-white/6 text-amber-500"
          }`}
          title="تفعيل قارئ الباركود"
          id="mobile_scanner_trigger_btn"
        >
          <span className="text-sm font-sans font-black">📷</span>
        </button>
      </div>

      {/* 🌟 Barcode scanner visual simulation */}
      {barcodeScannerOpen && (
        <div className="p-4 bg-[#0c1322] border border-amber-500/20 rounded-2xl text-right space-y-2.5 mx-4 mt-2 shadow-xl animate-fadeIn" id="mobile_scanner_overlay">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-black text-amber-400">🔍 قارئ الباركود / إدخال سريع فوري</span>
            <button
              onClick={() => setBarcodeScannerOpen(false)}
              className="text-slate-400 hover:text-white text-xs bg-slate-950/40 px-2 py-1 rounded-lg border border-white/4"
            >
              إغلاق ✕
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
            قم بالمسح مباشرة باستخدام قارئ خارجي أو الكاميرا. يتم فلترة الشحنات لحظياً عند الإدخال.
          </p>
          <input
            type="text"
            placeholder="اضغط هنا ومرر الباركود لقراءة الشحنة..."
            className="w-full bg-slate-955 bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono font-black text-slate-100 placeholder-slate-600 text-center outline-none focus:border-amber-500"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="mobile_scanner_input_field"
          />
        </div>
      )}

      {/* 🌟 Horizontal Filter badge Row */}
      <div className="px-4" id="mobile_filter_row_container">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10.5px] font-black text-slate-450 text-slate-400">تصفية سريعة للحالات</span>
          <span className="text-[9.5px] text-slate-500 font-extrabold">المخزن التشغيلي والعهدة</span>
        </div>
        
        <div
          className="overflow-x-auto flex items-center gap-2 pb-2 mr-[-16px] ml-[-16px] px-4 scrollbar-none snap-x"
          style={{ WebkitOverflowScrolling: "touch" }}
          id="mobile_horizontal_filter_scroll"
        >
          {[
            { key: "all", label: "الكل" },
            { key: "جديد", label: "🆕 جديد" },
            { key: "مسند", label: "📋 مسند" },
            { key: "خارج للتسليم", label: "🚚 خارج للتسليم" },
            { key: "تم التسليم", label: "✅ تم التسليم" },
            { key: "مرتجع بالمستودع", label: "📦 بالمنشأ/المكتب" },
            { key: "تم تسليم المرتجع للمورد", label: "↩ تسليم للمورد" },
            { key: "مؤجل", label: "⏳ مؤجل" },
            { key: "لا يوجد رد", label: "📵 لا يرد" }
          ].map((f) => {
            const count = statusCounts[f.key] || 0;
            const isSelected = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  setSelected(new Set());
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all border snap-start cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-500 font-black shadow-lg shadow-amber-500/10 scale-95"
                    : "bg-slate-900 border-white/6 text-slate-350 hover:text-white"
                }`}
                id={`mobile_filter_badge_${f.key}`}
              >
                <span>{f.label}</span>
                <span className={`text-[9.5px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                  isSelected ? "bg-slate-950/20 text-slate-950" : "bg-slate-950 text-amber-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🌟 Bulk selection tools for Mobiles */}
      {canSelectBulk && (
        <div className="px-4 flex items-center justify-between" id="mobile_selection_toolbar">
          <button
            onClick={toggleSelectAll}
            className="text-[10px] font-black text-slate-400 border border-white/6 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg"
            id="mobile_toggle_select_all"
          >
            {selected.size === visibleOrders.length ? "إلغاء تحديد الكل" : `تحديد الكل (${visibleOrders.length})`}
          </button>
          
          {selected.size > 0 && (
            <div className="text-[10px] font-black text-amber-500 flex items-center gap-1.5 animate-pulse">
              <span>● تم تحديد {selected.size} شحنات لتحديث جماعي</span>
            </div>
          )}
        </div>
      )}

      {/* 🌟 Orders Compact List Section */}
      <div className="px-4 space-y-3" id="mobile_orders_list_wrapper">
        {visibleOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500 space-y-1.5 bg-slate-900/20 rounded-2xl border border-white/4 p-6" id="mobile_empty_state">
            <div className="text-xl">📭</div>
            <p className="font-bold">لا توجد شحنات مطابقة لتصفية البحث والفلترة حالياً</p>
          </div>
        ) : (
          <>
            {visibleOrders.slice(0, displayLimit).map((o) => {
              const isSel = selected.has(o.tracking);
              const statusType = (o.status || "").toString();
              const totalCODValue = o.totalCOD !== undefined ? o.totalCOD : (Number(o.prodPrice || 0) + Number(o.shipPrice || 0));

              let cardBorderStyle = "border-slate-850";
              let cardBgClass = "bg-slate-900/90";

              if (statusType === "العميل رد وجاري التسليم") {
                cardBorderStyle = "border-r-4 border-r-lime-400 border-lime-500/30";
                cardBgClass = "bg-lime-950/15 border-lime-400/35 shadow-md";
              } else if (statusType === "لا يوجد رد") {
                cardBorderStyle = "border-r-4 border-r-rose-550 border-rose-500/20";
                cardBgClass = "bg-rose-950/10 border-rose-950/10";
              } else if (o.customerConfirmed === "true" || o.customerConfirmed === true) {
                cardBorderStyle = "border-r-4 border-r-emerald-500 border-emerald-500/30";
                cardBgClass = "bg-emerald-950/15";
              } else if (statusType === "تم التسليم" || statusType === "تسليم جزئي - معلق للجرد") {
                cardBorderStyle = "border-r-4 border-r-emerald-500";
                cardBgClass = "bg-emerald-950/10";
              } else if (statusType.includes("مرتجع")) {
                cardBorderStyle = "border-r-4 border-r-red-500";
                cardBgClass = "bg-red-950/15";
              } else if (statusType === "جديد") {
                cardBorderStyle = "border-r-4 border-r-blue-500";
                cardBgClass = "bg-blue-950/10";
              }

              return (
                <div
                  key={o.tracking}
                  className={`border rounded-xl p-3.5 transition-all ${cardBgClass} ${cardBorderStyle} ${
                    isSel ? "ring-1 ring-amber-500 border-amber-500" : "border-white/6"
                  }`}
                  id={`mobile_order_card_${o.tracking}`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/4">
                    <div className="flex items-center gap-1.5">
                      {canSelectBulk && (
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleSelect(o.tracking)}
                          className="w-4 h-4 rounded border-white/10 bg-slate-950 text-amber-505 accent-amber-500 cursor-pointer"
                        />
                      )}
                      <span className="text-xs font-black text-amber-500 font-mono">{o.tracking}</span>
                    </div>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(o.status)}`}>
                      {o.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 py-1.5 text-[11px] text-slate-300">
                    <div>
                      <span className="text-[9px] text-slate-500 block font-bold">العميل</span>
                      <span className="font-extrabold text-slate-200">{o.customer || "مجهول الاسم"}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block font-bold">المحافظة / المنطقة</span>
                      <span className="font-black text-slate-100 truncate block">{o.gov} · {o.region}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block font-bold">المندوب المسؤول</span>
                      <span className="font-extrabold text-teal-400 truncate block">
                        {o.courier ? `👤 ${o.courier}` : <span className="text-red-400 font-bold">لم يسند بعد ⚠️</span>}
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] text-slate-500 block font-bold">الصافي المالي</span>
                      <span className="text-xs font-black text-emerald-400 font-mono text-left block">
                        {(totalCODValue || 0).toLocaleString("ar")} ج.م
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-white/4 pt-2.5 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1">
                      {o.phone && (() => {
                        const rawPhone = o.phone.toString().trim();
                        const formattedPhone = rawPhone.startsWith("0") ? rawPhone : "0" + rawPhone;
                        return (
                          <>
                            <a
                              href={`tel:${formattedPhone}`}
                              className="p-1.5 bg-slate-950 hover:bg-slate-850 text-blue-400 rounded-lg border border-white/6 flex items-center justify-center cursor-pointer"
                            >
                              <Phone size={11} />
                            </a>
                            <a
                              href={toWAUrl(o.phone, getOrderWAMessage(o))}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-slate-950 hover:bg-slate-850 text-emerald-400 rounded-lg border border-white/6 flex items-center justify-center cursor-pointer font-sans"
                            >
                              <MessageSquare size={11} />
                            </a>
                          </>
                        );
                      })()}
                    </div>
                    
                    <button
                      onClick={() => setMobileDrawerOrder(o)}
                      className="px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] rounded-lg cursor-pointer flex items-center gap-0.5"
                    >
                      <span>🛠️ إجراء عمليات</span>
                    </button>
                  </div>
                </div>
              );
            })}
            
            {visibleOrders.length > displayLimit && (
              <button
                type="button"
                onClick={() => setDisplayLimit((prev) => prev + 25)}
                className="w-full py-3 bg-slate-900 border border-white/10 hover:border-amber-500 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                🚀 عرض المزيد ({visibleOrders.length - displayLimit} متبقية)
              </button>
            )}
          </>
        )}
      </div>

      {/* 🌟 Bottom Sheet Action Drawer for Mobiles */}
      {mobileDrawerOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center p-0 transition-opacity duration-200" id="mobile_drawer_overlay">
          <div className="bg-[#0b1220] border-t-2 border-amber-500/20 rounded-t-3xl w-full p-6 text-right space-y-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 pb-10 max-h-[90vh] overflow-y-auto" id="mobile_drawer_sheet">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/6 pb-3">
              <div className="text-right">
                <h3 className="text-xs font-black text-amber-550 text-amber-400 flex items-center gap-1.5 justify-end">
                  <span>⚡ إجراء سريع للاوردر:</span>
                  <span className="font-mono underline">{mobileDrawerOrder.tracking}</span>
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">العميل: {mobileDrawerOrder.customer || "مجهول الاسم"}</p>
              </div>
              <button
                onClick={() => setMobileDrawerOrder(null)}
                className="text-slate-400 hover:text-white text-xs bg-slate-950 px-3.5 py-1.5 rounded-xl border border-white/6 cursor-pointer font-bold"
              >
                إغلاق ✕
              </button>
            </div>

            {/* Form list inputs inside bottom sheet */}
            <div className="space-y-4 text-right">
              {/* Courier auto assignments */}
              {(isAdmin || isSuper || isOps) && (
                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-white/4">
                  <label className="block text-[10px] text-slate-400 font-black text-right">👤 إسناد الشحنة لمندوب آخر:</label>
                  <SearchableCourierSelect
                    value={mobileDrawerOrder.courier || ""}
                    onChange={(val) => {
                      if (val === "reset_warehouse") {
                        triggerStatusUpdate(mobileDrawerOrder.tracking, "جديد", "", "إعادة للمستودع وتبرئة المندوب", "", true);
                      } else {
                        apiCall("updateStatus", token, {
                          tracking: mobileDrawerOrder.tracking,
                          status: "تم الإسناد",
                          courier: val
                        }).then((res) => {
                          if (res && res.ok) onRefresh();
                        });
                        setOrders((prev) =>
                          prev.map((item) =>
                            item.tracking === mobileDrawerOrder.tracking
                              ? { ...item, courier: val, status: "تم الإسناد" }
                              : item
                          )
                        );
                      }
                      setMobileDrawerOrder(null);
                    }}
                    couriers={couriers}
                    placeholder="اضغط لاختيار المندوب التوصيل..."
                    showWarehouseReset={true}
                  />
                </div>
              )}

              {/* Status Update shortcuts */}
              <div className="space-y-2">
                <label className="block text-[10px] text-slate-400 font-black text-right">🛠️ تغيير حالة الشحنة فوراً:</label>
                <div className="grid grid-cols-2 gap-2">
                  
                  <button
                    onClick={() => {
                      triggerStatusUpdate(mobileDrawerOrder.tracking, "تم التسليم");
                      setMobileDrawerOrder(null);
                    }}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black text-xs rounded-xl cursor-pointer text-center"
                  >
                    ✅ تم التسليم والتحصيل
                  </button>

                  <button
                    onClick={() => {
                      triggerStatusUpdate(mobileDrawerOrder.tracking, "خارج مع المندوب");
                      setMobileDrawerOrder(null);
                    }}
                    className="py-2.5 bg-slate-950 border border-amber-500/30 text-amber-500 font-black text-xs rounded-xl cursor-pointer text-center"
                  >
                    🚚 خارج للتوصيل
                  </button>

                  <button
                    onClick={() => {
                      // Trigger return selection logic natively
                      setSelectedReturnOrder(mobileDrawerOrder);
                      setReturnedSelectOpen(true);
                      setMobileDrawerOrder(null);
                    }}
                    className="py-2.5 bg-slate-950 border border-red-500/30 text-red-400 font-black text-xs rounded-xl cursor-pointer text-center"
                  >
                    ↩️ تسجيل كمرتجع
                  </button>

                  <button
                    onClick={() => {
                      triggerStatusUpdate(mobileDrawerOrder.tracking, "مؤجل");
                      setMobileDrawerOrder(null);
                    }}
                    className="py-2.5 bg-slate-950 border border-white/8 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer text-center"
                  >
                    ⏳ تأجيل الأوردر
                  </button>

                  <button
                    onClick={() => {
                      triggerStatusUpdate(mobileDrawerOrder.tracking, "لا يوجد رد");
                      setMobileDrawerOrder(null);
                    }}
                    className="py-2.5 bg-slate-950 border border-white/8 text-slate-300 font-semibold text-xs rounded-xl cursor-pointer text-center"
                  >
                    📵 لا يوجد رد
                  </button>

                  <button
                    onClick={() => {
                      triggerStatusUpdate(mobileDrawerOrder.tracking, "جديد");
                      setMobileDrawerOrder(null);
                    }}
                    className="py-2.5 bg-slate-950 border border-white/8 text-blue-400 font-semibold text-xs rounded-xl cursor-pointer text-center"
                  >
                    🔄 إرجاع إلى جديد
                  </button>

                  {mobileDrawerOrder.courier && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `هل تود بالفعل سحب الشحنة من المندوب (${mobileDrawerOrder.courier}) بالكامل لتعود لتتحول إلى عهدة المستودع مع التوقيع الرقمي للمفتش؟`
                          )
                        ) {
                          triggerStatusUpdate(mobileDrawerOrder.tracking, "مرتجع بالمستودع", "", "", "", true);
                        }
                        setMobileDrawerOrder(null);
                      }}
                      className="py-2.5 bg-purple-950 border border-purple-500/20 text-purple-300 font-black text-[10.5px] rounded-xl cursor-pointer col-span-2 text-center"
                    >
                      ✍️ تصفية المندوب وسحب للمستودع (توقيع)
                    </button>
                  )}

                </div>
              </div>

              {/* Instant Telephony/WA lookup inline in Bottom Sheet */}
              {mobileDrawerOrder.phone && (
                <div className="bg-[#070b14] p-3.5 rounded-2xl border border-white/4 space-y-2">
                  <span className="text-[10px] text-slate-400 font-black block text-right">📱 تواصل سريع ومباشر مع العميل من الموبايل:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${mobileDrawerOrder.phone}`}
                      className="py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-900/30 text-indigo-400 text-center text-xs rounded-lg font-black block"
                    >
                      اتصال هاتفي
                    </a>
                    <a
                      href={toWAUrl(mobileDrawerOrder.phone, getOrderWAMessage(mobileDrawerOrder))}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/30 text-emerald-400 text-center text-xs rounded-lg font-black block font-sans"
                    >
                      واتساب
                    </a>
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
