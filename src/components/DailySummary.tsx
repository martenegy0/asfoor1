import React, { useMemo } from "react";
import { Activity, Download, Layers, ShieldAlert } from "lucide-react";
import { getTodayDateStr, normalizeDateToYMD } from "../utils";

interface DailySummaryProps {
  orders: any[];
  cashboxEntries: any[];
  expenses: any[];
  couriers: any[];
  role: string;
  user: string;
  onRefresh: () => void;
  loading: boolean;
}

const kindOfDelivered = new Set(["تم التسليم", "تم التسليم بنجاح", "تم التسليم (ناجح كاش)"]);
const kindOfPartial = new Set(["تسليم جزئي", "تسليم جزئي - معلق للجرد", "مرتجع جزئي", "مرتجع جزئي بالمستودع"]);
const kindOfReturned = [
  "مرتجع",
  "تم تسليم المرتجع للمورد",
  "مرتجع تم تسليمه للمورد",
  "التسليم للمورد",
  "تسليم المرتجع للمورد",
  "مرتجع والعميل دفع الشحن",
  "مرتجع مدفوع الشحن",
  "قيد المرتجع",
  "مرتجع جديد"
];

function normalizeKey(value: any): string {
  return (value || "").toString().trim().toLowerCase();
}

function getOrderAmount(order: any): number {
  const p = Number(order.totalCOD || order.total || order.cod || order.cash || 0);
  if (p > 0) return p;
  const prod = Number(order.prodPrice || order["سعر المنتج"] || order["سعر المادة"] || 0);
  const ship = Number(order.shipPrice || order["سعر الشحن"] || order["الشحن"] || order["تكلفة الشحن"] || 0);
  return prod + ship;
}

function getOrderDate(order: any): string {
  return normalizeDateToYMD(
    order.orderDate || order.createdAt || order.delivDate || order.updatedAt || order.date || order["تاريخ"] || ""
  );
}

export default function DailySummary({ orders = [], cashboxEntries = [], expenses = [], couriers = [], role, user, onRefresh, loading }: DailySummaryProps) {
  const todayStr = getTodayDateStr();

  const {
    todayOrders,
    totalOrderCount,
    deliveredCount,
    partialCount,
    returnedCount,
    activeCount,
    totalOrderValue,
    totalCollectedValue,
    courierSummary,
    supplierSummary,
    statusSummary,
    latestOrders
  } = useMemo(() => {
    const todayOrdersList: any[] = [];
    const courierMap = new Map<string, { count: number; value: number }>();
    const supplierMap = new Map<string, { count: number; value: number }>();
    const statusMap = new Map<string, number>();
    let delivered = 0;
    let partial = 0;
    let returned = 0;
    let active = 0;
    let totalValue = 0;
    let collectedValue = 0;

    for (const order of orders || []) {
      const orderDate = getOrderDate(order);
      if (orderDate !== todayStr) continue;
      todayOrdersList.push(order);

      const amount = getOrderAmount(order);
      totalValue += amount;
      if (kindOfDelivered.has(order.status)) {
        delivered += 1;
        collectedValue += amount;
      } else if (kindOfPartial.has(order.status)) {
        partial += 1;
        collectedValue += Number(order.actualReceivedCash || order.partialAmount || 0);
      } else if (kindOfReturned.some((keyword) => normalizeKey(order.status).includes(normalizeKey(keyword)))) {
        returned += 1;
      }

      if (!kindOfDelivered.has(order.status) && !kindOfReturned.some((keyword) => normalizeKey(order.status).includes(normalizeKey(keyword)))) {
        active += 1;
      }

      const orderStatus = normalizeKey(order.status || order["الحالة"] || "غير معروف");
      statusMap.set(orderStatus, (statusMap.get(orderStatus) || 0) + 1);

      const courierName = normalizeKey(order.courier || order.driver || order["المندوب"] || "غير معروف");
      if (courierName) {
        const current = courierMap.get(courierName) || { count: 0, value: 0 };
        current.count += 1;
        current.value += amount;
        courierMap.set(courierName, current);
      }

      const supplierName = normalizeKey(order.supplier || order["المورد"] || "غير معروف");
      if (supplierName) {
        const current = supplierMap.get(supplierName) || { count: 0, value: 0 };
        current.count += 1;
        current.value += amount;
        supplierMap.set(supplierName, current);
      }
    }

    const courierSummaryArr = Array.from(courierMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const supplierSummaryArr = Array.from(supplierMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const statusSummaryObj: { label: string; count: number }[] = Array.from(statusMap.entries())
      .map(([statusKey, count]) => ({ label: statusKey || "غير معروف", count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      todayOrders: todayOrdersList,
      totalOrderCount: todayOrdersList.length,
      deliveredCount: delivered,
      partialCount: partial,
      returnedCount: returned,
      activeCount: active,
      totalOrderValue: totalValue,
      totalCollectedValue: collectedValue,
      courierSummary: courierSummaryArr,
      supplierSummary: supplierSummaryArr,
      statusSummary: statusSummaryObj,
      latestOrders: todayOrdersList.slice(0, 10)
    };
  }, [orders, todayStr]);

  const { cashboxToday, cashboxIn, cashboxOut, cashboxEntriesToday } = useMemo(() => {
    let total = 0;
    let inbound = 0;
    let outbound = 0;
    const items: any[] = [];

    for (const entry of cashboxEntries || []) {
      const entryDate = normalizeDateToYMD(entry.date || entry.createdAt || "");
      if (entryDate !== todayStr) continue;
      const amount = Number(entry.amount || 0);
      total += amount;
      if (amount >= 0) inbound += amount;
      else outbound += amount;
      items.push(entry);
    }

    return { cashboxToday: total, cashboxIn: inbound, cashboxOut: outbound, cashboxEntriesToday: items };
  }, [cashboxEntries, todayStr]);

  const { expensesToday, expensesCount, expenseCategories } = useMemo(() => {
    let total = 0;
    const categories = new Map<string, number>();
    let count = 0;

    for (const expense of expenses || []) {
      const expenseDate = normalizeDateToYMD(expense.date || expense.createdAt || expense["تاريخ"] || "");
      if (expenseDate !== todayStr) continue;
      const amount = Number(expense.amount || 0);
      total += amount;
      count += 1;
      const category = expense.cat || expense.category || expense.type || "غير مصنّف";
      categories.set(category, (categories.get(category) || 0) + amount);
    }

    return {
      expensesToday: total,
      expensesCount: count,
      expenseCategories: Array.from(categories.entries()).map(([category, amount]) => ({ category, amount }))
    };
  }, [expenses, todayStr]);

  const couriersLoaded = couriers?.length > 0;

  return (
    <div className="p-4 space-y-6 font-sans text-right">
      <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 text-slate-200 mb-1">
              <Layers size={20} className="text-amber-400" />
              <h1 className="text-base font-black">ملخص اليوم وجرد العمليات</h1>
            </div>
            <p className="text-[11px] text-slate-400 max-w-2xl">
              نظرة فورية على بيانات اليوم الحالي المبنية على أوامر النظام الحالية، حركة الخزينة والمصاريف دون التأثير على أي لوجيك مالي موجود.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 rounded-xl font-black text-xs hover:bg-emerald-400 transition-all"
          >
            <Download size={14} />
            تحديث الملخص
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">أداء الطلبات اليوم</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-amber-400">{totalOrderCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">عدد الأوردرات</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-400">{deliveredCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">مسلّم</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-amber-500">{partialCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">جزئي</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-red-400">{returnedCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">مرتجع</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">ملخص الخزينة والمصروفات</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-400">{cashboxToday.toLocaleString("ar")} ج.م</div>
              <div className="text-[10px] text-slate-500 mt-1">صافي الخزينة اليوم</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-300">{cashboxIn.toLocaleString("ar")} ج.م</div>
              <div className="text-[10px] text-slate-500 mt-1">إيرادات الخزينة</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-red-400">{Math.abs(cashboxOut).toLocaleString("ar")} ج.م</div>
              <div className="text-[10px] text-slate-500 mt-1">سحوبات/دفعات</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-orange-300">{expensesToday.toLocaleString("ar")} ج.م</div>
              <div className="text-[10px] text-slate-500 mt-1">مصاريف اليوم</div>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-slate-500 font-bold">سجلات الخزينة اليوم: {cashboxEntriesToday.length} حركة · المصاريف: {expensesCount}</div>
        </div>

        <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">حالة العمليات</div>
            <div className="text-[10px] text-slate-500">{todayStr}</div>
          </div>
          <div className="grid gap-2">
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-slate-100">{activeCount}</div>
              <div className="text-[10px] text-slate-500 mt-1">طلبات نشطة اليوم</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-slate-100">{totalOrderValue.toLocaleString("ar")} ج.م</div>
              <div className="text-[10px] text-slate-500 mt-1">إجمالي حجم العمليات</div>
            </div>
            <div className="bg-slate-950/80 rounded-2xl p-4 text-center">
              <div className="text-3xl font-black text-emerald-400">{totalCollectedValue.toLocaleString("ar")} ج.م</div>
              <div className="text-[10px] text-slate-500 mt-1">القيمة المحصلة</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-black text-slate-100">أهم الطلبات اليوم</div>
            <div className="text-[10px] text-slate-500">يعرض حتى 10 أحدث أوردرات</div>
          </div>
          {latestOrders.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">لا توجد أوردرات مسجّلة لليوم الحالي.</div>
          ) : (
            <div className="space-y-3">
              {latestOrders.map((order, idx) => (
                <div key={`${order.tracking || order.id || idx}-${idx}`} className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="text-[10px] text-slate-500">رقم التتبع</div>
                    <div className="text-sm font-black text-slate-100 mt-1">{order.tracking || order.trackingId || order.id || "-"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">المورد / المندوب</div>
                    <div className="text-sm font-black text-slate-100 mt-1">{order.supplier || order["المورد"] || "-"} · {order.courier || order.driver || order["المندوب"] || "-"}</div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-500">قيمة العملية</div>
                    <div className="text-sm font-black text-emerald-400 mt-1">{getOrderAmount(order).toLocaleString("ar")} ج.م</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-black text-slate-100">أكثر الموردين نشاطاً</div>
              <span className="text-[10px] text-slate-500">أعلى 5</span>
            </div>
            {supplierSummary.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">لا توجد بيانات موردين اليوم.</div>
            ) : (
              <div className="space-y-3">
                {supplierSummary.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-black text-slate-100">{item.name || "غير معروف"}</div>
                      <div className="text-[10px] text-slate-500">طلبات: {item.count}</div>
                    </div>
                    <div className="text-xs font-black text-emerald-300">{item.value.toLocaleString("ar")} ج.م</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-black text-slate-100">أهم المناديب اليوم</div>
              <span className="text-[10px] text-slate-500">أعلى 5</span>
            </div>
            {courierSummary.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                {!couriersLoaded ? "جاري تحميل بيانات المناديب..." : "لا توجد عمليات مندوبين لليوم."}
              </div>
            ) : (
              <div className="space-y-3">
                {courierSummary.map((item, idx) => (
                  <div key={`${item.name}-${idx}`} className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-black text-slate-100">{item.name || "غير معروف"}</div>
                      <div className="text-[10px] text-slate-500">طلبات: {item.count}</div>
                    </div>
                    <div className="text-xs font-black text-emerald-300">{item.value.toLocaleString("ar")} ج.م</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-white/6 rounded-3xl p-5 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-black text-slate-100">توزيع الحركات حسب الحالة</div>
          <div className="text-[10px] text-slate-500 flex items-center gap-2">
            <ShieldAlert size={12} /> بيانات اليوم فقط
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {statusSummary.map((item, idx) => (
            <div key={`${item.label}-${idx}`} className="bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-xs text-slate-400 mb-2">{item.label}</div>
              <div className="text-2xl font-black text-slate-100">{item.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
