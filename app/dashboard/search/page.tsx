"use client";
import { useState, useRef } from "react";
import { BillCard, Bill } from "@/components/bills/BillCard";
import { EditBillModal } from "@/components/bills/EditBillModal";
import { RankList } from "@/components/bills/RankList";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";

type Tab = "search" | "city" | "state" | "transport" | "customer";

const TABS: { id: Tab; icon: string; label: string; desc: string }[] = [
  { id: "search",    icon: "🔍", label: "Search",     desc: "Find bills" },
  { id: "city",      icon: "🏙️", label: "Cities",     desc: "By city" },
  { id: "state",     icon: "🗺️", label: "States",     desc: "By state" },
  { id: "transport", icon: "🚚", label: "Transport",   desc: "By carrier" },
  { id: "customer",  icon: "💰", label: "Customers",   desc: "By amount" },
];

const SEARCH_FIELDS = [
  { value: "all",            label: "All Fields" },
  { value: "customer_name",  label: "Customer Name" },
  { value: "shop_name",      label: "Shop Name" },
  { value: "city",           label: "City" },
  { value: "state",          label: "State" },
  { value: "mobile_number",  label: "Mobile Number" },
  { value: "transport_name", label: "Transport Name" },
  { value: "bill_number",    label: "Bill Number" },
];

export default function SearchPage() {
  const [tab, setTab] = useState<Tab>("search");
  const [editBill, setEditBill] = useState<Bill | null>(null);

  const [searchQ, setSearchQ] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [searchResults, setSearchResults] = useState<Bill[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  function handleSearchInput(q: string) {
    setSearchQ(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) { setSearchResults(null); return; }
    searchTimer.current = setTimeout(() => execSearch(q, searchField), 350);
  }

  async function execSearch(q: string, field: string) {
    setSearchLoading(true);
    const res = await fetch(`/api/bills/search?q=${encodeURIComponent(q)}&field=${field}`);
    const data = await res.json();
    setSearchResults(data.bills || []);
    setSearchLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this bill? This cannot be undone.")) return;
    const res = await fetch(`/api/bills/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({ title: "🗑️ Deleted", description: "Bill removed." });
      setSearchResults((prev) => prev?.filter((b) => b._id !== id) ?? null);
    }
  }

  async function handleUpdate(id: string, data: Partial<Bill>) {
    const res = await fetch(`/api/bills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast({ title: "✅ Updated", description: "Bill updated." });
      setEditBill(null);
      if (searchQ) execSearch(searchQ, searchField);
    }
  }

  return (
    <>
      <Toaster />
      <div className="animate-fade-in">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg,#Fd0304,#ff6b6b)", color: "#fff" }}>
              🔍
            </span>
            Search & Rankings
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-11">Find bills or explore leaderboards by city, state, transport and customer.</p>
        </div>

        {/* Tab bar — card style */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-2xl border text-center transition-all duration-200 ${
                  active
                    ? "border-transparent text-white shadow-md"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm"
                }`}
                style={active ? { background: "linear-gradient(135deg,#Fd0304,#ff6b6b)" } : {}}
              >
                <span className="text-lg leading-none">{t.icon}</span>
                <span className="text-xs font-semibold leading-tight">{t.label}</span>
                <span className={`text-[10px] leading-tight hidden sm:block ${active ? "text-red-100" : "text-slate-400"}`}>
                  {t.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Search tab ──────────────────────────────────────── */}
        {tab === "search" && (
          <div>
            {/* Search box + field selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
              <div className="relative mb-3">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search name, city, mobile, shop, bill number…"
                  className="w-full pl-11 pr-12 py-3.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#Fd0304] focus:ring-2 focus:ring-red-50 transition-all font-medium placeholder:font-normal"
                  autoFocus
                />
                {searchQ && (
                  <button
                    onClick={() => { setSearchQ(""); setSearchResults(null); }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Field chips */}
              <div className="flex flex-wrap gap-1.5">
                {SEARCH_FIELDS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setSearchField(f.value); if (searchQ) execSearch(searchQ, f.value); }}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                      searchField === f.value
                        ? "border-transparent text-white"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                    }`}
                    style={searchField === f.value ? { background: "#Fd0304" } : {}}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results area */}
            {searchLoading && <SearchSkeleton />}

            {!searchLoading && searchResults === null && (
              <SearchPlaceholder />
            )}

            {!searchLoading && searchResults?.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 py-20 text-center">
                <div className="text-5xl mb-3 opacity-40">🔍</div>
                <p className="font-semibold text-slate-600 mb-1">No results found</p>
                <p className="text-sm text-slate-400">
                  No bills match &ldquo;<span className="font-medium text-slate-600">{searchQ}</span>&rdquo;
                  {searchField !== "all" && ` in ${SEARCH_FIELDS.find(f => f.value === searchField)?.label}`}
                </p>
              </div>
            )}

            {!searchLoading && searchResults && searchResults.length > 0 && (
              <>
                {/* Result count bar */}
                <div className="flex items-center gap-3 mb-4 bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  <span className="text-sm text-slate-600">
                    <span className="font-bold text-slate-800">{searchResults.length}</span> result{searchResults.length !== 1 ? "s" : ""} for{" "}
                    <span className="font-semibold text-[#Fd0304]">&ldquo;{searchQ}&rdquo;</span>
                    {searchField !== "all" && (
                      <span className="text-slate-400"> in {SEARCH_FIELDS.find(f => f.value === searchField)?.label}</span>
                    )}
                  </span>
                  <button
                    onClick={() => { setSearchQ(""); setSearchResults(null); }}
                    className="ml-auto text-xs text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {searchResults.map((b) => (
                    <BillCard key={b._id} bill={b} onEdit={setEditBill} onDelete={handleDelete} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Rank tabs ────────────────────────────────────────── */}
        {tab === "city"      && <RankList type="city"      defaultSort="revenue" />}
        {tab === "state"     && <RankList type="state"     defaultSort="revenue" />}
        {tab === "transport" && <RankList type="transport" defaultSort="count"   />}
        {tab === "customer"  && <RankList type="customer"  defaultSort="amount"  />}
      </div>

      {editBill && (
        <EditBillModal bill={editBill} onClose={() => setEditBill(null)} onSave={handleUpdate} />
      )}
    </>
  );
}

/* ── Sub-components ─────────────────────────────────── */

function SearchPlaceholder() {
  const hints = [
    { icon: "👤", text: "Customer name" },
    { icon: "🏪", text: "Shop name" },
    { icon: "🏙️", text: "City" },
    { icon: "📱", text: "Mobile number" },
    { icon: "🧾", text: "Bill number" },
    { icon: "🚚", text: "Transport" },
  ];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
      <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
        style={{ background: "linear-gradient(135deg,#fef2f2,#fce7e7)" }}>
        🔍
      </div>
      <h3 className="font-semibold text-slate-700 mb-1">Start searching</h3>
      <p className="text-sm text-slate-400 mb-6">Type in the search box above to find bills across all fields</p>
      <div className="flex flex-wrap justify-center gap-2">
        {hints.map((h) => (
          <span key={h.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 font-medium">
            <span>{h.icon}</span>{h.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
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
