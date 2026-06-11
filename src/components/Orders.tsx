import React, { useState } from "react";
import { Search, MapPin, Phone, MessageSquare, Check, Truck, User, Calendar, Trash2, Edit3, ShieldAlert, ArrowLeftRight } from "lucide-react";
import { apiCall, toWA } from "../utils";

interface OrdersProps {
  token: string;
  role: string;
  username: string;
  orders: any[];
  couriers: any[];
  onRefresh: () => void;
}

export default function Orders({ token, role, username, orders, couriers, onRefresh }: OrdersProps) {
  const isAdmin = role === "مدير";
  const isSuper = role === "مشرف";
  const isOps = role === "موظف عمليات";
  const isAgent = role === "مندوب";
  const isSupplier = role === "مورد";
  const isReturnsOfficer = role === "مسؤول مرتجعات";
  
  const canManage = isAdmin || isSuper;

  // --- Courier specifications for dynamic calculations ---
  const currentCourierProfile = couriers.find((c: any) => c.name === username);
  const basicSalary = currentCourierProfile ? Number(currentCourierProfile.salary || 3000) : 3000;
  const rawCommission = currentCourierProfile ? Number(currentCourierProfile.commission || 25) : 25;

  const nowEgypt = new Date();
  nowEgypt.setHours(nowEgypt.getHours() + 3); // GMT+3 Egypt/Cairo offset
  const todayDateStr = nowEgypt.toISOString().substring(0, 10);

  const todayDeliveredOrders = orders.filter((o: any) => {
    const isMyDeliv = o.courier === username && o.status === "تم التسليم";
    if (!isMyDeliv) return false;
    const isDelivToday = o.delivDate && o.delivDate.substring(0, 10) === todayDateStr;
    const isUpdatedToday = o.updatedAt && o.updatedAt.substring(0, 10) === todayDateStr;
    return isDelivToday || isUpdatedToday;
  });
  const todayDeliveredCount = todayDeliveredOrders.length;
  const todayCommissions = todayDeliveredCount * rawCommission;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // --- Modals States ---
  const [editOrder, setEditOrder] = useState<any>(null);
  const [confirmingStatus, setConfirmingStatus] = useState<{ tracking: string; status: string } | null>(null);
  const [returnedSelectOpen, setReturnedSelectOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<any>(null);
  
  // --- Bulk updates states ---
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkCourier, setBulkCourier] = useState("");

  const EgyptGovs = [
    "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "القليوبية", "كفر الشيخ", "الغربية", "المنوفية",
    "البحيرة", "الإسماعيلية", "بور سعيد", "السويس", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان",
    "البحر الأحمر", "شمال سيناء", "جنوب سيناء", "مطروح", "الوادي الجديد", "بني سويف", "الفيوم"
  ];

  // Filters mapping
  const visibleOrders = orders.filter((o) => {
    // Role permissions for returns officer
    if (isReturnsOfficer) {
      const isRet = ["مرتجع", "التسليم للمورد", "مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].includes(o.status) || o.returnQueueStatus;
      if (!isRet) return false;
    }

    if (activeFilter !== "all" && o.status !== activeFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return [o.tracking, o.supplier, o.courier, o.customer, o.phone, o.gov, o.region, o.address, o.notes, o.returnQueueStatus]
        .join(" ")
        .toLowerCase()
        .includes(q);
    }
    return true;
  });

  function toggleSelect(tracking: string) {
    const next = new Set(selected);
    if (next.has(tracking)) next.delete(tracking);
    else next.add(tracking);
    setSelected(next);
  }

  function toggleSelectAll() {
    if (selected.size === visibleOrders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(visibleOrders.map((o) => o.tracking)));
    }
  }

  // --- Actions ---
  async function triggerStatusUpdate(tracking: string, status: string, returnShippingType = "") {
    // If order was marked as 'مرتجع' and no shipping type chosen, open dialog (Third Point Fix!)
    if (status === "مرتجع" && !returnShippingType) {
      const ordObj = orders.find((o) => o.tracking === tracking);
      setSelectedReturnOrder(ordObj);
      setReturnedSelectOpen(true);
      return;
    }

    try {
      const res = await apiCall("updateStatus", token, {
        tracking,
        status,
        returnShippingType
      });
      if (res.ok) {
        setReturnedSelectOpen(false);
        setConfirmingStatus(null);
        setSelected(new Set());
        onRefresh();
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("عطل في الاتصال بالشبكة لتقيد الحالة الجديدة");
    }
  }

  // Admin edit order detail saver
  async function saveAdminEdits(e: React.FormEvent) {
    e.preventDefault();
    if (!editOrder) return;
    try {
      const res = await apiCall("updateOrder", token, {
        tracking: editOrder.tracking,
        order: {
          customer: editOrder.customer,
          phone: editOrder.phone,
          phone2: editOrder.phone2,
          gov: editOrder.gov,
          region: editOrder.region,
          address: editOrder.address,
          prodPrice: Number(editOrder.prodPrice),
          shipPrice: Number(editOrder.shipPrice),
          courier: editOrder.courier,
          notes: editOrder.notes
        }
      });
      if (res.ok) {
        setEditOrder(null);
        onRefresh();
        alert("✅ تم تعديل وحفظ بيانات الأوردر والمزامنة مع الحسابات بنجاح");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("فشل الحفظ المباشر للتعديلات");
    }
  }

  async function deleteOrderDirect(tracking: string) {
    if (!confirm(`⚠️ هل تريد حذف الأوردر ${tracking} نهائياً؟ \n\nلا يمكن التراجع عن هذه العملية وسيتم حذف سجلات حسابات المورد المرتبطة به.`)) {
      return;
    }
    try {
      const res = await apiCall("deleteOrder", token, { tracking });
      if (res.ok) {
        setEditOrder(null);
        onRefresh();
        alert("🗑 تم حذف الأوردر بنجاح");
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("فشل حذف الأوردر");
    }
  }

  // Bulk Manifest batch updates (Supervisor and Admin)
  async function saveBulkUpdate() {
    if (!bulkStatus && !bulkCourier) {
      alert("يرجى تحديد حالة أو مندوب للتوزيع الجماعي");
      return;
    }
    try {
      const res = await apiCall("bulkUpdate", token, {
        trackings: Array.from(selected),
        status: bulkStatus || undefined,
        courier: bulkCourier || undefined
      });
      if (res.ok) {
        setBulkModalOpen(false);
        setBulkStatus("");
        setBulkCourier("");
        setSelected(new Set());
        onRefresh();
        alert(`✅ تم تحديث ${res.done} أوردر بنجاح بالمشافهة والتوزيع للمندوب`);
      } else {
        alert("⚠️ " + res.error);
      }
    } catch (err) {
      alert("فشل التوزيع والتقيد الجماعي");
    }
  }

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "جديد": return "bg-blue-950/40 text-blue-400 border border-blue-900/30";
      case "تم الإسناد": return "bg-indigo-950/40 text-indigo-400 border border-indigo-900/30";
      case "خارج مع المندوب": return "bg-amber-950/40 text-amber-500 border border-amber-900/30";
      case "تم التسليم": return "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30";
      case "مرتجع": return "bg-red-950/40 text-red-450 border border-red-900/30";
      case "مؤجل": return "bg-orange-950/40 text-orange-400 border border-orange-900/30";
      case "لا يوجد رد": return "bg-slate-900/80 text-slate-400 border border-slate-700/30";
      case "التسليم للمورد": return "bg-rose-950/20 text-rose-450 border border-rose-900/30";
      case "تم تسليم المرتجع للمورد": return "bg-purple-950/20 text-purple-400 border border-purple-900/30";
      default: return "bg-slate-900 text-slate-400 border border-slate-800";
    }
  };

  return (
    <div className="font-sans text-right select-none space-y-4">
      {/* Search and select buttons */}
      <div className="flex bg-[#070d1a] px-4 py-3 border-b border-white/6 items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 ابحث برقم الأوردر، تليفون، عميل أو مورد..."
            className="w-full bg-slate-900 border border-white/6 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold text-slate-200 placeholder-slate-500 text-right outline-none focus:border-amber-500/20"
          />
        </div>
        {canManage && (
          <button
            onClick={toggleSelectAll}
            className="px-4 py-2 bg-slate-900 border border-white/8 rounded-xl text-[10px] text-slate-300 font-extrabold cursor-pointer transition-colors whitespace-nowrap"
          >
            {selected.size === visibleOrders.length ? "إلغاء التحديد" : "تحديد الكل"}
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {[
          { key: "all", label: "الكل" },
          { key: "جديد", label: "🆕 جديد" },
          { key: "تم الإسناد", label: "📋 مُسند" },
          { key: "خارج مع المندوب", label: "🚚 خارج مع الدليفري" },
          { key: "تم التسليم", label: "✅ تم التسليم" },
          { key: "مرتجع", label: "↩ مرتجع" },
          { key: "مؤجل", label: "⏰ مؤجل" },
          { key: "لا يوجد رد", label: "📵 لا يوجد رد" }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setActiveFilter(f.key);
              setSelected(new Set());
            }}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black cursor-pointer transition-all border whitespace-nowrap ${
              activeFilter === f.key
                ? "bg-amber-500 text-slate-950 border-amber-500"
                : "bg-slate-950 text-slate-400 border-white/6 hover:text-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 💼 Beautiful Courier Financial & Performance Quick Summary Table */}
      {isAgent && (
        <div className="mx-4 p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <h3 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
              <span>💼 كشف الحساب والراتب اليومي (متصل لحطيًا بـ Google Sheets)</span>
            </h3>
            <span className="text-[9px] font-bold bg-amber-950/20 text-amber-500 border border-amber-900/40 px-2 py-0.5 rounded">
              محدث تلقائياً
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-extrabold">
                  <th className="py-2 px-3">بند الحساب الجاري للمندوب</th>
                  <th className="py-2 px-3 text-center">البيان الميداني</th>
                  <th className="py-2 px-3 text-left">مجموع القيمة</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/4 hover:bg-slate-950/30">
                  <td className="py-3 px-3 text-slate-200">الراتب الأساسي الثابت</td>
                  <td className="py-3 px-3 text-slate-400 text-center">تعاقد شهري أساسي</td>
                  <td className="py-3 px-3 text-left font-mono font-bold text-slate-350">
                    {basicSalary.toLocaleString("ar")} ج.م
                  </td>
                </tr>
                <tr className="border-b border-white/4 hover:bg-slate-950/30">
                  <td className="py-3 px-3 text-slate-250 font-semibold">عدد الطلبات التي تم تسليمها اليوم</td>
                  <td className="py-3 px-3 text-emerald-400 text-center font-bold">
                    {todayDeliveredCount} شحنات مسلّمة اليوم
                  </td>
                  <td className="py-3 px-3 text-left font-mono font-black text-emerald-400">
                    +{todayCommissions.toLocaleString("ar")} ج.م (عمولة اليوم)
                  </td>
                </tr>
                <tr className="hover:bg-slate-950/30 bg-amber-950/10 font-bold text-amber-500">
                  <td className="py-3 px-3">مستحقات اليوم التقريبية</td>
                  <td className="py-3 px-3 text-[#64748b] text-center text-[10px]">
                    عمولات اليوم المستحقة القائمة
                  </td>
                  <td className="py-3 px-3 text-left font-mono">
                    {todayCommissions.toLocaleString("ar")} ج.م
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-[9px] text-slate-500 leading-relaxed">
            * يتم احتساب عمولتك بناءً على عمولتك المعتمدة للطلب الواحد ({rawCommission} ج.م) والمسجلة بملفك الوظيفي بالخادم المركزي والـ Google Sheets.
          </p>
        </div>
      )}

      {/* Bulk Toolbar for Managers and Supervisors */}
      {selected.size > 0 && canManage && (
        <div className="mx-4 p-3 bg-slate-950 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
          <span className="text-xs font-black text-amber-500 animate-pulse">
            📎 {selected.size} طلبات محددة
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setBulkModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors"
            >
              تعديل جماعي وتوزيع للمندوب
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-[10px] font-bold cursor-pointer"
            >
              إلغاء التحديد
            </button>
          </div>
        </div>
      )}

      {/* Orders List Workspace */}
      <div className="px-4 space-y-4">
        {visibleOrders.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500 space-y-2">
            <div>📭</div>
            <p>لا توجد شحنات مطابقة لخيارات التصفية الحالية</p>
          </div>
        ) : (
          visibleOrders.map((o) => {
            const isSel = selected.has(o.tracking);
            return (
              <div
                key={o.tracking}
                className={`bg-slate-900 border rounded-2xl p-5 space-y-4 relative transition-all ${
                  isSel ? "border-amber-500 ring-2 ring-amber-500/10" : "border-white/6"
                }`}
              >
                {/* Header components */}
                <div className="flex items-start justify-between border-b border-white/4 pb-3">
                  <div className="flex items-center gap-3">
                    {canManage && (
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleSelect(o.tracking)}
                        className="w-4 h-4 rounded border-white/10 bg-slate-950 text-amber-500 accent-amber-500 cursor-pointer"
                      />
                    )}
                    <div>
                      <div className="text-sm font-black text-amber-550 tracking-wider flex items-center gap-2">
                        <span>{o.tracking}</span>
                        {/* Edit & Delete panels inline with Tracking ID to prevent overlaps */}
                        {isAdmin && (
                          <div className="flex gap-1 mr-2">
                            <button
                              onClick={() => setEditOrder(o)}
                              className="p-1 px-1.5 bg-slate-950 text-indigo-400 hover:text-indigo-200 rounded-md border border-white/6 cursor-pointer"
                              title="تعديل الأوردر"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={() => deleteOrderDirect(o.tracking)}
                              className="p-1 px-1.5 bg-slate-950 text-red-400 hover:text-red-200 rounded-md border border-white/6 cursor-pointer"
                              title="حذف الأوردر"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                        {o.createdAt.substring(0, 10)} {o.supplier && `· ${o.supplier}`}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[9px] font-black rounded ${getBadgeStyle(o.status)}`}>
                    {o.status}
                  </span>
                </div>

                {/* Details components (hide/show sensitive elements as per role controls) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  {/* Customer customer name */}
                  <div className="flex items-center gap-2 text-slate-350">
                    <User size={14} className="text-slate-500" />
                    <span>العميل: <span className="font-bold text-slate-200">{o.customer || "غير مسجل"}</span></span>
                  </div>

                  {/* Telephone display without secondary a button duplication */}
                  {o.phone && (
                    <div className="flex items-center gap-2 text-slate-350 font-mono">
                      <Phone size={14} className="text-slate-500" />
                      <span>الهاتف: <span className="text-slate-200 font-bold">{o.phone}</span> {o.phone2 && ` / ${o.phone2}`}</span>
                    </div>
                  )}

                  {/* Shipping address details */}
                  <div className="flex items-center gap-2 text-slate-350">
                    <MapPin size={14} className="text-slate-500" />
                    <span>محافظة: <span className="font-bold text-slate-250">{o.gov} · {o.region} · {o.address}</span></span>
                  </div>

                  {/* Financial settle details */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-slate-350 flex items-center gap-2">
                       <span className="text-sm">💵</span>
                      <span>إجمالي التحصيل المستحق: <span className="text-sm font-black text-emerald-400 font-mono">{(o.totalCOD || o.prodPrice || 0).toLocaleString("ar")} ج.م</span></span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-bold font-mono">
                      منتج: {o.prodPrice} · شحن: {o.shipPrice}
                    </span>
                  </div>

                  {/* Hide or show sensitive courier assignments for Suppliers / Couriers */}
                  {!isSupplier && o.courier && (
                    <div className="flex items-center gap-2 text-slate-350">
                      <Truck size={14} className="text-slate-500" />
                      <span>المندوب: <span className="font-bold text-indigo-400">{o.courier}</span></span>
                    </div>
                  )}

                  {o.notes && (
                    <div className="col-span-1 md:col-span-2 p-2.5 bg-slate-950/40 rounded-xl text-[11px] text-slate-400 border border-white/4 leading-relaxed">
                      💬 <span className="font-bold">ملاحظات:</span> {o.notes}
                    </div>
                  )}

                  {/* Returns management officer details (Return Queue indicators) */}
                  {o.returnQueueStatus && (
                    <div className="col-span-1 md:col-span-2 p-3 bg-purple-950/10 border border-purple-900/30 rounded-xl text-[11px] text-purple-300 flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5">
                        <ArrowLeftRight size={13} />
                        قائمة المرتجع: <span className="font-black underline">{o.returnQueueStatus}</span>
                      </span>
                      <span>مسؤول المتابعة: <span className="font-bold underline">{o.returnQueueAgent || "لم يعين"}</span></span>
                    </div>
                  )}
                </div>

                {/* Individual Action Controls */}
                {/* 1. Normal transition status controls (Hide state buttons for Suppliers (Mored) Per User Rules!) */}
                {o.status !== "تم التسليم" && !isSupplier && (
                  <div className="border-t border-white/6 pt-3 flex flex-wrap gap-2 justify-end">
                    {/* Courier quick controls */}
                    {isAgent && o.courier === username && (
                      <>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "تم التسليم")}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-slate-950 font-black text-[10px] rounded-lg cursor-pointer"
                        >
                          ✅ تم التسليم والتحصيل
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "مرتجع")}
                          className="px-3 py-1.5 bg-red-650 hover:bg-red-700 text-slate-200 font-black text-[10px] rounded-lg cursor-pointer"
                        >
                          ↩ اختيار مرتجع
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "مؤجل")}
                          className="px-3 py-1.5 bg-slate-800 text-slate-300 font-bold text-[10px] rounded-lg cursor-pointer"
                        >
                          ⏰ تم التأجيل
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "لا يوجد رد")}
                          className="px-3 py-1.5 bg-slate-950 text-slate-400 font-bold text-[10px] rounded-lg cursor-pointer border border-white/4"
                        >
                          📵 لا يرد
                        </button>
                      </>
                    )}

                    {/* Admin and Supervisor assignments actions */}
                    {canManage && (
                      <>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "خارج مع المندوب")}
                          className="px-2.5 py-1 bg-slate-950 text-amber-500 border border-amber-500/20 text-[9px] font-black rounded hover:bg-slate-900 cursor-pointer"
                        >
                          🚚 خارج للتسليم
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "تم التسليم")}
                          className="px-2.5 py-1 bg-emerald-600 text-slate-950 text-[9px] font-black rounded hover:bg-emerald-700 cursor-pointer"
                        >
                          تسليم سريع
                        </button>
                        <button
                          onClick={() => triggerStatusUpdate(o.tracking, "مرتجع")}
                          className="px-2.5 py-1 bg-slate-950 text-red-400 border border-red-900/20 text-[9px] font-black rounded hover:bg-slate-900 cursor-pointer"
                        >
                          مرتجع سريع
                        </button>
                      </>
                    )}

                    {/* Returns Officer specific status transitions */}
                    {isReturnsOfficer && (
                      <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-white/6 items-center">
                        <span className="text-[9px] text-slate-500 font-bold px-1.5">خط المرتجع:</span>
                        {["مرتجع جديد", "جاري تجهيز المرتجع", "جاهز للتسليم للمورد", "تم تسليم المرتجع للمورد"].map((rs) => (
                          <button
                            key={rs}
                            onClick={() => triggerStatusUpdate(o.tracking, rs)}
                            className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer ${
                              o.returnQueueStatus === rs ? "bg-purple-650 text-slate-100" : "text-slate-500 hover:text-slate-350"
                            }`}
                          >
                            {rs.split(" ").slice(-1)[0]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Clean, isolated mobile connection row at the bottom of each order */}
                {o.phone && (
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/6">
                    <a
                      href={`tel:${o.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-blue-600/10 text-blue-400 bg-blue-950/20 border border-blue-900/30 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-colors text-center"
                    >
                      <Phone size={13} />
                      <span>اتصال هاتفي</span>
                    </a>
                    <a
                      href={`https://wa.me/${toWA(o.phone)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 hover:bg-emerald-600/10 text-emerald-400 bg-emerald-950/20 border border-emerald-950/30 rounded-xl text-xs font-black tracking-wide cursor-pointer transition-colors text-center font-sans"
                    >
                      <MessageSquare size={13} />
                      <span>اتصال واتساب</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* --- MODAL 1: RETURN SHIPPING SELECTION POPUP (Third Point Fix!) --- */}
      {returnedSelectOpen && selectedReturnOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/8 p-6 rounded-t-2xl md:rounded-2xl w-full max-w-[420px] text-right space-y-4">
            <h3 className="text-sm font-black text-rose-450 border-b border-white/6 pb-2">
              ↩️ تحديد سلوك تصفية الشحن المرتجع
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              يقوم المندوب حالياً بإرجاع الأوردر <span className="text-amber-500 font-bold underline font-mono">{selectedReturnOrder.tracking}</span> للمكتب الرئيسي.
              <br />
              يرجى تحديد ما إذا دفع الزبون تكلفة الشحن أم رفض الدفع:
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => triggerStatusUpdate(selectedReturnOrder.tracking, "مرتجع", "paid")}
                className="w-full py-3 bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-950/45 rounded-xl text-xs font-black cursor-pointer leading-relaxed"
              >
                1. مرتجع والعميل دفع الشحن (يتم احتساب عمولة المندوب)
              </button>

              <button
                onClick={() => triggerStatusUpdate(selectedReturnOrder.tracking, "مرتجع", "unpaid")}
                className="w-full py-3 bg-red-950/20 text-red-400 border border-red-900/40 hover:bg-red-950/45 rounded-xl text-xs font-black cursor-pointer leading-relaxed"
              >
                2. مرتجع والعميل رفض دفع الشحن (العمولة = 0 + قائمة المتابعة)
              </button>
            </div>

            <button
              onClick={() => {
                setReturnedSelectOpen(false);
                setSelectedReturnOrder(null);
              }}
              className="w-full py-2 bg-slate-950 text-slate-500 text-[10px] font-bold rounded-lg border border-white/4"
            >
              إلغاء لخطأ
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL 2: BULK ASSIGNMENTS MANIFEST MODAL (canManage only) --- */}
      {bulkModalOpen && canManage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[420px] text-right space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-amber-550 border-b border-white/6 pb-2">
              🔗 توزيع وإسناد وتحديث جماعي لعدد {selected.size} طلبات
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">الحالة الجديدة للطلبات</label>
                <select
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-3 py-2.5 text-xs text-right"
                >
                  <option value="">-- لا يتم تغيير الحالة --</option>
                  <option value="تم الإسناد">تم الإسناد</option>
                  <option value="خارج مع المندوب">خارج مع المندوب</option>
                  <option value="تم التسليم">تم التسليم</option>
                  <option value="مرتجع">مرتجع</option>
                  <option value="مؤجل">مؤجل</option>
                  <option value="لا يوجد رد">لا يوجد رد</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تعيين أو تغيير المندوب المسؤول</label>
                <select
                  value={bulkCourier}
                  onChange={(e) => setBulkCourier(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 rounded-xl px-3 py-2.5 text-xs text-right"
                >
                  <option value="">-- بقاء المندوب كما هو --</option>
                  {couriers.map((c, idx) => (
                    <option key={idx} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveBulkUpdate}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer"
              >
                تطبيق التغييرات لجميع المحدد
              </button>
              <button
                onClick={() => setBulkModalOpen(false)}
                className="px-4 py-3 bg-slate-950 text-slate-400 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADMIN DETAIL ORDER MODIFER MODAL --- */}
      {editOrder && isAdmin && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveAdminEdits} className="bg-slate-900 border border-white/8 p-6 rounded-2xl w-full max-w-[480px] text-right space-y-4 my-8">
            <h3 className="text-sm font-black text-indigo-400 border-b border-white/6 pb-2">
              ✏️ تعديل ومراجعة بيانات الشحنة {editOrder.tracking}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="block text-[9px] text-slate-450 font-bold">اسم المستلم*</label>
                <input
                  type="text"
                  required
                  value={editOrder.customer}
                  onChange={(e) => setEditOrder({ ...editOrder, customer: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="block text-[9px] text-slate-450 font-bold">المندوب المسؤول للتسليم</label>
                <select
                  value={editOrder.courier || ""}
                  onChange={(e) => setEditOrder({ ...editOrder, courier: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs"
                >
                  <option value="">بدون مندوب</option>
                  {couriers.map((c, idx) => (
                    <option key={idx} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تليفون العميل</label>
                <input
                  type="text"
                  required
                  value={editOrder.phone}
                  onChange={(e) => setEditOrder({ ...editOrder, phone: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">تليفون بديل</label>
                <input
                  type="text"
                  value={editOrder.phone2 || ""}
                  onChange={(e) => setEditOrder({ ...editOrder, phone2: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">محافظة المستلم</label>
                <select
                  value={editOrder.gov}
                  onChange={(e) => setEditOrder({ ...editOrder, gov: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs"
                >
                  {EgyptGovs.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">المنطقة</label>
                <input
                  type="text"
                  value={editOrder.region}
                  onChange={(e) => setEditOrder({ ...editOrder, region: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-bold">العنوان الكامل بالتفصيل</label>
              <input
                type="text"
                value={editOrder.address}
                onChange={(e) => setEditOrder({ ...editOrder, address: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">سعر المنتج (حق المورد)</label>
                <input
                  type="number"
                  required
                  value={editOrder.prodPrice}
                  onChange={(e) => setEditOrder({ ...editOrder, prodPrice: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">سعر شحن الشركة (حق الشركة)</label>
                <input
                  type="number"
                  required
                  value={editOrder.shipPrice}
                  onChange={(e) => setEditOrder({ ...editOrder, shipPrice: e.target.value })}
                  className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs font-mono text-right"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-slate-400 font-bold">ملاحظات ووصاية الأوردر</label>
              <input
                type="text"
                value={editOrder.notes}
                onChange={(e) => setEditOrder({ ...editOrder, notes: e.target.value })}
                className="w-full bg-slate-950 text-slate-200 border border-white/8 px-3 py-2.5 rounded-lg text-xs text-right"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-slate-100 font-black text-xs rounded-xl cursor-pointer"
              >
                حفظ وحفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setEditOrder(null)}
                className="px-4 py-3.5 bg-slate-950 text-slate-500 rounded-xl text-xs font-bold border border-white/6 cursor-pointer"
              >
                إلغاء لخطأ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
