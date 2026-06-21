"use client";
import { useState } from "react";
import { StateCityPicker } from "@/components/ui/StateCityPicker";

interface Bill {
  _id: string;
  date: string;
  bill_number: string;
  customer_name: string;
  mobile_number: string;
  shop_name: string;
  city: string;
  state: string;
  transport_name: string;
  items_sent: string;
  total_amount: number;
}

interface Props {
  bill: Bill;
  onClose: () => void;
  onSave: (id: string, data: Partial<Bill>) => void;
}

export function EditBillModal({ bill, onClose, onSave }: Props) {
  const [form, setForm] = useState({ ...bill, total_amount: String(bill.total_amount) });
  const [saving, setSaving] = useState(false);

  function set(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(bill._id, { ...form, total_amount: parseFloat(form.total_amount) || 0 });
    setSaving(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg,#Fd0304,#ff6b6b)", color: "#fff" }}>
              ✏️
            </span>
            Edit Bill
          </h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all text-lg leading-none">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Date + Bill Number */}
          <div className="grid grid-cols-2 gap-4">
            <F label="Date">
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="input-base" />
            </F>
            <F label="Bill Number">
              <input type="text" value={form.bill_number} onChange={(e) => set("bill_number", e.target.value)} className="input-base" />
            </F>
          </div>

          {/* Customer Name + Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <F label="Customer Name">
              <input type="text" value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} className="input-base" />
            </F>
            <F label="Mobile">
              <input type="tel" value={form.mobile_number} onChange={(e) => set("mobile_number", e.target.value)} className="input-base" />
            </F>
          </div>

          {/* Shop Name */}
          <F label="Shop Name">
            <input type="text" value={form.shop_name} onChange={(e) => set("shop_name", e.target.value)} className="input-base" />
          </F>

          {/* State + City (API-driven) + Transport */}
          <div className="grid grid-cols-3 gap-4">
            <StateCityPicker
              stateValue={form.state}
              cityValue={form.city}
              onStateChange={(v) => set("state", v)}
              onCityChange={(v) => set("city", v)}
            />
            <F label="Transport">
              <input type="text" value={form.transport_name} onChange={(e) => set("transport_name", e.target.value)} className="input-base" />
            </F>
          </div>

          {/* Items Sent */}
          <F label="Items Sent">
            <textarea value={form.items_sent} onChange={(e) => set("items_sent", e.target.value)} rows={3} className="input-base resize-none" />
          </F>

          {/* Total Amount */}
          <F label="Total Amount (₹)">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
              <input type="number" value={form.total_amount} onChange={(e) => set("total_amount", e.target.value)} className="input-base pl-7" />
            </div>
          </F>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity"
              style={{ background: "linear-gradient(to right, #ff6b6b, #Fd0304)" }}>
              {saving ? "Saving…" : "✅ Update Bill"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .input-base {
          width: 100%; padding: 0.55rem 0.85rem; border: 1px solid #e2e8f0;
          border-radius: 8px; font-size: 0.875rem; outline: none;
          transition: all 0.2s; background: #fff; color: #0f172a; font-family: inherit;
        }
        .input-base:focus { border-color: #Fd0304; box-shadow: 0 0 0 3px rgba(253,3,4,0.08); }
      `}</style>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
