"use client";
import { useState, useEffect } from "react";
import { formatINR } from "@/lib/utils";

interface AggItem { _id: string; count: number; revenue: number; avg: number; }
interface TopCustomer {
  _id: string; customer_name: string; shop_name: string;
  mobile_number: string; city: string; state: string; total_amount: number;
}
interface AnalyticsData {
  stats: { total: number; revenue: number; avg: number; cities: number; states: number; transports: number };
  cityAgg: AggItem[];
  stateAgg: AggItem[];
  transportAgg: AggItem[];
  topCustomers: TopCustomer[];
}

function medal(i: number) { return i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`; }
function medalBg(i: number) { return i === 0 ? "#fff8e1" : i === 1 ? "#f5f5f5" : i === 2 ? "#fbe9e7" : "#e8eaf6"; }

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-slate-400 text-lg">⏳ Loading analytics…</div>
  );
  if (!data) return null;

  const { stats } = data;

  const statCards = [
    { label: "Total Bills",      value: stats.total.toLocaleString("en-IN"), icon: "🧾", color: "#Fd0304" },
    { label: "Total Revenue",    value: formatINR(stats.revenue),            icon: "💰", color: "#10b981" },
    { label: "Average Bill",     value: formatINR(stats.avg),                icon: "📊", color: "#f59e0b" },
    { label: "Cities Covered",   value: String(stats.cities),                icon: "🏙️", color: "#06b6d4" },
    { label: "States Covered",   value: String(stats.states),                icon: "🗺️", color: "#8b5cf6" },
    { label: "Transports Used",  value: String(stats.transports),            icon: "🚚", color: "#ec4899" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">📊 Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your business performance.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((c, i) => (
          <div key={i}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:-translate-y-0.5 transition-transform"
            style={{ borderLeftWidth: "4px", borderLeftColor: c.color }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{c.label}</div>
              <div className="text-2xl opacity-20">{c.icon}</div>
            </div>
            <div className="text-2xl font-bold tracking-tight" style={{ color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChartCard title="🏙️ Top Cities by Revenue" items={data.cityAgg} type="revenue" />
        <ChartCard title="🗺️ Top States by Customers" items={data.stateAgg} type="count" />
      </div>

      <ChartCard title="🚚 Top Transports Used" items={data.transportAgg} type="count" />

      {/* Top customers */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800">💰 Top 10 Customers by Bill Amount</div>
        <div className="divide-y divide-slate-100">
          {data.topCustomers.length === 0 ? (
            <div className="text-center py-10 text-slate-400">No data yet</div>
          ) : data.topCustomers.map((c, i) => (
            <div key={c._id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: medalBg(i), fontSize: i < 3 ? "16px" : "11px", fontWeight: 700 }}>
                {medal(i)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-800 truncate">{c.customer_name || "—"}</div>
                <div className="text-xs text-slate-500 truncate">
                  {c.shop_name || "—"} &nbsp;|&nbsp; 📱 {c.mobile_number || "—"} &nbsp;|&nbsp; 📍 {c.city || "—"}
                </div>
              </div>
              <div className="font-bold text-[#Fd0304] text-sm whitespace-nowrap">
                ₹{Number(c.total_amount || 0).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, items, type }: { title: string; items: AggItem[]; type: "revenue" | "count" }) {
  const max = items.length > 0 ? (type === "revenue" ? items[0].revenue : items[0].count) : 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-5 py-4 border-b border-slate-100 font-semibold text-slate-800">{title}</div>
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">No data yet</div>
        ) : items.map((item, i) => {
          const val = type === "revenue" ? item.revenue : item.count;
          const pct = max ? Math.round((val / max) * 100) : 0;
          const valLabel = type === "revenue" ? "₹" + Math.round(val).toLocaleString("en-IN") : val + " customers";
          return (
            <div key={item._id} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: medalBg(i), fontSize: i < 3 ? "14px" : "10px" }}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 truncate">{item._id}</div>
                <div className="text-xs text-slate-400">{item.count} bills &nbsp;|&nbsp; Avg: ₹{Math.round(item.avg).toLocaleString("en-IN")}</div>
                <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#Fd0304" }} />
                </div>
              </div>
              <div className="text-sm font-bold text-[#Fd0304] whitespace-nowrap">{valLabel}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
