"use client";
import { useState, useEffect, useCallback, useRef } from "react";

interface RankItem {
  _id: string;
  label?: string;
  count: number;
  revenue: number;
  avg: number;
  customer_name?: string;
  shop_name?: string;
  mobile_number?: string;
  city?: string;
  state?: string;
  transport_name?: string;
  total_amount?: number;
  bill_number?: string;
  date?: string;
}

interface Props {
  type: "city" | "state" | "transport" | "customer";
  defaultSort: string;
}

const SORT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  city:      [{ value: "revenue", label: "Total Revenue" }, { value: "count", label: "No. of Bills" }, { value: "avg", label: "Avg Bill" }],
  state:     [{ value: "revenue", label: "Total Revenue" }, { value: "count", label: "No. of Bills" }, { value: "avg", label: "Avg Bill" }],
  transport: [{ value: "count", label: "No. of Bills" }, { value: "revenue", label: "Total Revenue" }, { value: "avg", label: "Avg Bill" }],
  customer:  [{ value: "amount", label: "Bill Amount" }, { value: "name", label: "Name A–Z" }],
};

const TYPE_LABELS: Record<string, string> = {
  city: "city", state: "state", transport: "transport", customer: "customer name or city",
};

function getMedalStyle(i: number): { bg: string; text: string; emoji: string } {
  if (i === 0) return { bg: "linear-gradient(135deg,#f59e0b,#fcd34d)", text: "#92400e", emoji: "🥇" };
  if (i === 1) return { bg: "linear-gradient(135deg,#94a3b8,#cbd5e1)", text: "#475569", emoji: "🥈" };
  if (i === 2) return { bg: "linear-gradient(135deg,#f97316,#fed7aa)", text: "#9a3412", emoji: "🥉" };
  return { bg: "#f1f5f9", text: "#64748b", emoji: `${i + 1}` };
}

export function RankList({ type, defaultSort }: Props) {
  const [sort, setSort] = useState(defaultSort);
  const [filterQ, setFilterQ] = useState("");
  const [items, setItems] = useState<RankItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (s: string, f: string) => {
    setLoading(true);
    const params = new URLSearchParams({ type, sort: s, ...(f && { filter: f }) });
    const res = await fetch(`/api/bills/rankings?${params}`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }, [type]);

  useEffect(() => { load(sort, filterQ); }, []);

  const filterTimer = useRef<ReturnType<typeof setTimeout>>();
  function handleFilter(v: string) {
    setFilterQ(v);
    clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => load(sort, v), 300);
  }

  const isCustomer = type === "customer";
  const max = items.length > 0
    ? (isCustomer
        ? Number(items[0].total_amount)
        : sort === "count" ? items[0].count : sort === "avg" ? items[0].avg : items[0].revenue)
    : 1;
  const totalAll = items.reduce((s, it) =>
    s + (isCustomer ? 0 : sort === "count" ? it.count : sort === "avg" ? it.avg : it.revenue), 0);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); load(e.target.value, filterQ); }}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-[#Fd0304] focus:ring-2 focus:ring-red-50 transition-all appearance-none font-medium text-slate-700 cursor-pointer"
          >
            {SORT_OPTIONS[type].map((o) => (
              <option key={o.value} value={o.value}>Sort: {o.label}</option>
            ))}
          </select>
        </div>
        <div className="relative flex-1 min-w-[140px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filterQ}
            onChange={(e) => handleFilter(e.target.value)}
            placeholder={`Filter by ${TYPE_LABELS[type]}…`}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#Fd0304] focus:ring-2 focus:ring-red-50 transition-all"
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-2.5 bg-slate-100 rounded w-2/3" />
                <div className="h-1.5 bg-slate-100 rounded w-full" />
              </div>
              <div className="w-20 h-5 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
          <div className="text-5xl mb-3 opacity-40">📊</div>
          <p className="font-semibold text-slate-600 mb-1">No data yet</p>
          <p className="text-sm text-slate-400">Add some bills first to see rankings here.</p>
        </div>
      )}

      {/* List */}
      {!loading && items.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2.5 bg-slate-50 border-b border-slate-200">
            <div className="w-10 flex-shrink-0" />
            <div className="flex-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isCustomer ? "Customer" : type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right min-w-[90px]">
              {isCustomer ? "Amount" : sort === "count" ? "Bills" : sort === "avg" ? "Avg Bill" : "Revenue"}
            </div>
          </div>

          <div className="text-xs text-slate-400 px-5 py-2 border-b border-slate-100 bg-white">
            {items.length} {isCustomer ? "customers" : "entries"} found
          </div>

          {items.map((item, i) => {
            const medal = getMedalStyle(i);

            if (isCustomer) {
              return (
                <div key={item._id || i}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors group">
                  {/* Rank badge */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold shadow-sm"
                    style={{ background: medal.bg, color: medal.text, fontSize: i < 3 ? "18px" : "12px" }}>
                    {medal.emoji}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-slate-800 truncate group-hover:text-[#Fd0304] transition-colors">
                      {item.customer_name || "—"}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">
                      {item.shop_name || "—"}
                      {item.mobile_number && <> &middot; 📱 {item.mobile_number}</>}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      {item.city && <span>📍 {item.city}{item.state ? `, ${item.state}` : ""}</span>}
                      {item.transport_name && <span>🚚 {item.transport_name}</span>}
                      {item.date && <span>📅 {item.date}</span>}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <div className="font-extrabold text-[#Fd0304] text-sm">
                      ₹{Number(item.total_amount || 0).toLocaleString("en-IN")}
                    </div>
                    {item.bill_number && (
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.bill_number}</div>
                    )}
                  </div>
                </div>
              );
            }

            /* Group rows (city / state / transport) */
            const val = sort === "count" ? item.count : sort === "avg" ? item.avg : item.revenue;
            const pct = max ? Math.round((val / max) * 100) : 0;
            const share = totalAll ? Math.round((val / totalAll) * 100) : 0;
            const valLabel = (sort === "revenue" || sort === "avg")
              ? "₹" + Math.round(val).toLocaleString("en-IN")
              : val + " bills";

            return (
              <div key={item._id || i}
                className="flex items-center gap-4 px-5 py-3.5 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors group">
                {/* Rank badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                  style={{ background: medal.bg, color: medal.text, fontSize: i < 3 ? "18px" : "12px", fontWeight: 700 }}>
                  {medal.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-slate-800 group-hover:text-[#Fd0304] transition-colors">
                    {item.label || item._id}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    <span className="font-medium">{item.count}</span> bills
                    &ensp;·&ensp;Total: <span className="font-medium">₹{Math.round(item.revenue).toLocaleString("en-IN")}</span>
                    &ensp;·&ensp;Avg: <span className="font-medium">₹{Math.round(item.avg).toLocaleString("en-IN")}</span>
                    &ensp;·&ensp;<span className="text-slate-400">{share}% share</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: "linear-gradient(to right,#ffb25f,#Fd0304)" }}
                    />
                  </div>
                </div>

                {/* Value */}
                <div className="flex-shrink-0 text-right min-w-[90px]">
                  <div className="font-extrabold text-[#Fd0304] text-sm">{valLabel}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{pct}% of top</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
