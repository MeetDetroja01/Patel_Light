"use client";
import { useState, useEffect, useCallback } from "react";
import { EditBillModal } from "@/components/bills/EditBillModal";
import { BillCard, Bill } from "@/components/bills/BillCard";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

const PAGE_SIZE = 20;

interface Filters { state: string; city: string; transport: string; }
interface FilterOptions { states: string[]; cities: string[]; transports: string[]; }

export default function CustomersPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({ state: "", city: "", transport: "" });
  const [options, setOptions] = useState<FilterOptions>({ states: [], cities: [], transports: [] });
  const [editBill, setEditBill] = useState<Bill | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const load = useCallback(async (p: number, f: Filters) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(p), limit: String(PAGE_SIZE),
      ...(f.state && { state: f.state }),
      ...(f.city && { city: f.city }),
      ...(f.transport && { transport: f.transport }),
    });
    const res = await fetch(`/api/bills?${params}`);
    const data = await res.json();
    setBills(data.bills || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, []);

  async function loadFilters() {
    const res = await fetch("/api/bills/filters");
    const data = await res.json();
    setOptions(data);
  }

  useEffect(() => { load(0, filters); loadFilters(); }, []);

  function applyFilter(key: keyof Filters, val: string) {
    const nf = { ...filters, [key]: val };
    setFilters(nf); setPage(0); load(0, nf);
  }

  function clearFilters() {
    const nf = { state: "", city: "", transport: "" };
    setFilters(nf); setPage(0); load(0, nf);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this bill? This cannot be undone.")) return;
    const res = await fetch(`/api/bills/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "🗑️ Deleted", description: "Bill removed successfully." });
      load(page, filters);
    }
  }

  async function handleUpdate(id: string, data: Partial<Bill>) {
    const res = await fetch(`/api/bills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({ title: "✅ Updated", description: "Bill updated successfully." });
      setEditBill(null);
      load(page, filters);
    }
  }

  return (
    <>
      <Toaster />
      <div className="animate-fade-in">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                style={{ background: "linear-gradient(135deg,#Fd0304,#ff6b6b)", color: "#fff" }}>
                📋
              </span>
              Customers
            </h1>
            <p className="text-sm text-slate-500 mt-1 ml-11">
              {loading ? "Loading…" : (
                <><span className="font-semibold text-slate-700">{total.toLocaleString("en-IN")}</span> bills recorded</>
              )}
            </p>
          </div>

          {/* Stat pills */}
          {!loading && (
            <div className="flex gap-2 flex-wrap">
              <StatPill label="Page" value={`${page + 1} / ${totalPages}`} />
              <StatPill label="Showing" value={`${Math.min(bills.length, PAGE_SIZE)}`} />
              {activeFilterCount > 0 && (
                <StatPill label="Filters" value={String(activeFilterCount)} accent />
              )}
            </div>
          )}
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Filter Bills</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters}
                className="ml-auto text-xs font-medium text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { key: "state" as const, opts: options.states, label: "All States", icon: "🗺️" },
              { key: "city" as const, opts: options.cities, label: "All Cities", icon: "🏙️" },
              { key: "transport" as const, opts: options.transports, label: "All Transport", icon: "🚚" },
            ].map(({ key, opts, label, icon }) => (
              <div key={key} className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">{icon}</span>
                <select
                  value={filters[key]}
                  onChange={(e) => applyFilter(key, e.target.value)}
                  className={`w-full pl-8 pr-4 py-2.5 text-sm rounded-xl border transition-all outline-none appearance-none cursor-pointer font-medium
                    ${filters[key]
                      ? "border-red-300 bg-red-50 text-red-700 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 bg-slate-50 text-slate-600 focus:border-[#Fd0304] focus:bg-white focus:ring-2 focus:ring-red-50"
                    }`}
                >
                  <option value="">{label}</option>
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : bills.length === 0 ? (
          <EmptyState hasFilters={activeFilterCount > 0} onClear={clearFilters} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {bills.map((b) => (
              <BillCard key={b._id} bill={b} onEdit={setEditBill} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && bills.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white rounded-2xl border border-slate-200 px-5 py-3.5 shadow-sm">
            <button
              onClick={() => { const p = page - 1; setPage(p); load(p, filters); window.scrollTo(0, 0); }}
              disabled={page === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="text-center">
              <div className="text-sm font-semibold text-slate-700">
                Page {page + 1} <span className="text-slate-400 font-normal">of</span> {totalPages}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{total.toLocaleString("en-IN")} total records</div>
            </div>

            <button
              onClick={() => { const p = page + 1; setPage(p); load(p, filters); window.scrollTo(0, 0); }}
              disabled={(page + 1) * PAGE_SIZE >= total}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {editBill && (
        <EditBillModal bill={editBill} onClose={() => setEditBill(null)} onSave={handleUpdate} />
      )}
    </>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function StatPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`px-3 py-1.5 rounded-xl text-xs font-medium border ${
      accent ? "bg-red-50 border-red-200 text-red-700" : "bg-slate-50 border-slate-200 text-slate-600"
    }`}>
      <span className="text-slate-400 mr-1">{label}:</span>{value}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse">
          <div className="h-1 bg-slate-200" />
          <div className="p-5 space-y-3">
            <div className="flex gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
              <div className="w-20 h-6 bg-slate-200 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="space-y-1">
                  <div className="h-2 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasFilters, onClear }: { hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
      <div className="text-6xl mb-4 opacity-40">📋</div>
      <h3 className="text-base font-semibold text-slate-700 mb-1">
        {hasFilters ? "No matching bills" : "No bills yet"}
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        {hasFilters ? "Try adjusting your filters." : "Add your first bill to get started."}
      </p>
      {hasFilters && (
        <button onClick={onClear}
          className="px-4 py-2 text-sm font-medium rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
          Clear Filters
        </button>
      )}
    </div>
  );
}
