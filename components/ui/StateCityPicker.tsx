"use client";
import { useState, useEffect, useRef } from "react";

interface Props {
  stateValue: string;
  cityValue: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  required?: boolean;
}

// starts-with first, then contains
function smartFilter(list: string[], query: string): string[] {
  if (!query) return list;
  const q = query.toLowerCase();
  const starts = list.filter((s) => s.toLowerCase().startsWith(q));
  const contains = list.filter((s) => !s.toLowerCase().startsWith(q) && s.toLowerCase().includes(q));
  return [...starts, ...contains];
}

// Highlights matching part in red bold
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-bold text-[#Fd0304]">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}

export function StateCityPicker({ stateValue, cityValue, onStateChange, onCityChange, required }: Props) {
  const [states, setStates] = useState<string[]>([]);
  const [statesLoading, setStatesLoading] = useState(true);
  const [stateSearch, setStateSearch] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const stateRef = useRef<HTMLDivElement>(null);

  const [cities, setCities] = useState<string[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const [customState, setCustomState] = useState(false);
  const [customCity, setCustomCity] = useState(false);

  // Fetch states once
  useEffect(() => {
    fetch("/api/locations/states")
      .then((r) => r.json())
      .then((d) => { setStates(d.states || []); setStatesLoading(false); })
      .catch(() => setStatesLoading(false));
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!stateValue || customState) { setCities([]); return; }
    setCitiesLoading(true);
    setCities([]);
    onCityChange("");
    setCitySearch("");
    setCustomCity(false);
    fetch(`/api/locations/cities?state=${encodeURIComponent(stateValue)}`)
      .then((r) => r.json())
      .then((d) => { setCities(d.cities || []); setCitiesLoading(false); })
      .catch(() => setCitiesLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateValue]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) setStateOpen(false);
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredStates = smartFilter(states, stateSearch);
  const filteredCities = smartFilter(cities, citySearch);

  return (
    <>
      {/* ── STATE ── */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          State{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {customState ? (
          <div className="flex gap-1.5">
            <input
              type="text"
              value={stateValue}
              onChange={(e) => onStateChange(e.target.value)}
              placeholder="Type state / UT name"
              className="input-base flex-1"
              autoFocus
            />
            <button type="button" title="Back to list"
              onClick={() => { setCustomState(false); onStateChange(""); onCityChange(""); }}
              className="px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 text-sm transition-colors">
              ↩
            </button>
          </div>
        ) : (
          <div ref={stateRef} className="relative">
            <button type="button"
              onClick={() => { setStateOpen((o) => !o); setStateSearch(""); }}
              className="input-base w-full text-left flex items-center justify-between gap-2">
              <span className={stateValue ? "text-slate-800 font-medium" : "text-slate-400"}>
                {stateValue || (statesLoading ? "Loading states…" : "— Select State —")}
              </span>
              <svg className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform ${stateOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {stateOpen && (
              <div className="absolute z-[60] top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-slate-100">
                  <input type="text" value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder="Search state…"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#Fd0304]"
                    autoFocus />
                </div>
                <ul className="max-h-52 overflow-y-auto py-1">
                  {filteredStates.length === 0 ? (
                    <li className="px-4 py-3 text-xs text-slate-400 text-center">No states found</li>
                  ) : filteredStates.map((s) => (
                    <li key={s}>
                      <button type="button"
                        onClick={() => { onStateChange(s); setStateOpen(false); setStateSearch(""); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${stateValue === s ? "bg-red-50 text-[#Fd0304] font-semibold" : "text-slate-700 hover:bg-red-50 hover:text-[#Fd0304]"}`}>
                        <Highlight text={s} query={stateSearch} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 p-2">
                  <button type="button"
                    onClick={() => { setCustomState(true); setStateOpen(false); onStateChange(""); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#Fd0304] hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Enter custom state name manually
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CITY / VILLAGE ── */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
          City / Village{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>

        {customCity ? (
          <div className="flex gap-1.5">
            <input type="text" value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Type city / village / taluka"
              className="input-base flex-1" autoFocus />
            <button type="button" title="Back to list"
              onClick={() => { setCustomCity(false); onCityChange(""); }}
              className="px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 text-sm transition-colors">
              ↩
            </button>
          </div>
        ) : !stateValue ? (
          <div className="input-base flex items-center gap-2 text-slate-400 cursor-not-allowed select-none" style={{ background: "#f8fafc" }}>
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Select state first
          </div>
        ) : citiesLoading ? (
          <div className="input-base flex items-center gap-2 text-slate-400" style={{ background: "#f8fafc" }}>
            <svg className="w-3.5 h-3.5 animate-spin flex-shrink-0 text-[#Fd0304]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading cities…
          </div>
        ) : (
          <div ref={cityRef} className="relative">
            <button type="button"
              onClick={() => { setCityOpen((o) => !o); setCitySearch(""); }}
              className="input-base w-full text-left flex items-center justify-between gap-2">
              <span className={cityValue ? "text-slate-800 font-medium" : "text-slate-400"}>
                {cityValue || "— Select City / Village —"}
              </span>
              <svg className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform ${cityOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {cityOpen && (
              <div className="absolute z-[60] top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-slate-100">
                  <input type="text" value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Search city / village…"
                    className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg outline-none focus:border-[#Fd0304]"
                    autoFocus />
                </div>
                <ul className="max-h-52 overflow-y-auto py-1">
                  {filteredCities.length === 0 ? (
                    <li className="px-4 py-3 text-xs text-slate-400 text-center">
                      {citySearch ? `No match for "${citySearch}"` : "No cities found"}
                    </li>
                  ) : filteredCities.map((c) => (
                    <li key={c}>
                      <button type="button"
                        onClick={() => { onCityChange(c); setCityOpen(false); setCitySearch(""); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${cityValue === c ? "bg-red-50 text-[#Fd0304] font-semibold" : "text-slate-700 hover:bg-red-50 hover:text-[#Fd0304]"}`}>
                        <Highlight text={c} query={citySearch} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-slate-100 p-2">
                  <button type="button"
                    onClick={() => { setCustomCity(true); setCityOpen(false); if (citySearch) onCityChange(citySearch); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#Fd0304] hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {citySearch ? `Add "${citySearch}" manually` : "Enter custom city / village name"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
