"use client";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { StateCityPicker } from "@/components/ui/StateCityPicker";

const today = new Date().toISOString().split("T")[0];

const empty = {
  date: today,
  bill_number: "",
  customer_name: "",
  mobile_number: "",
  shop_name: "",
  state: "",
  city: "",
  transport_name: "",
  items_sent: "",
  total_amount: "",
};

export default function AddBillPage() {
  const [form, setForm] = useState({ ...empty });
  const [loading, setLoading] = useState(false);

  function set(field: string, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer_name || !form.bill_number || !form.date) {
      toast({
        title: "Missing fields",
        description: "Date, Bill Number and Customer Name are required.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const res = await fetch("/api/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, total_amount: parseFloat(form.total_amount) || 0 }),
    });
    setLoading(false);
    if (res.ok) {
      toast({ title: "✅ Bill saved!", description: `Bill ${form.bill_number} saved successfully.` });
      setForm({ ...empty, date: today });
    } else {
      const err = await res.json();
      toast({ title: "Error", description: err.error || "Something went wrong.", variant: "destructive" });
    }
  }

  return (
    <>
      <Toaster />
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: "linear-gradient(135deg,#Fd0304,#ff6b6b)", color: "#fff" }}>
              ➕
            </span>
            Add New Bill
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-11">Record a new customer bill entry.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">

            {/* Row 1 — Date + Bill Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Date" required>
                <input type="date" value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className="input-base" required />
              </Field>
              <Field label="Bill Number" required>
                <input type="text" value={form.bill_number}
                  onChange={(e) => set("bill_number", e.target.value)}
                  placeholder="e.g. PL-2024-001" className="input-base" required />
              </Field>
            </div>

            {/* Row 2 — Customer Name + Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Customer Name" required>
                <input type="text" value={form.customer_name}
                  onChange={(e) => set("customer_name", e.target.value)}
                  placeholder="Full name" className="input-base" required />
              </Field>
              <Field label="Mobile Number">
                <input type="tel" value={form.mobile_number}
                  onChange={(e) => set("mobile_number", e.target.value)}
                  placeholder="10 digit number" className="input-base" />
              </Field>
            </div>

            {/* Shop Name */}
            <Field label="Shop Name">
              <input type="text" value={form.shop_name}
                onChange={(e) => set("shop_name", e.target.value)}
                placeholder="Shop or company name" className="input-base" />
            </Field>

            {/* Row 3 — State + City (API-driven) + Transport */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StateCityPicker
                stateValue={form.state}
                cityValue={form.city}
                onStateChange={(v) => set("state", v)}
                onCityChange={(v) => set("city", v)}
              />
              <Field label="Transport Name">
                <input type="text" value={form.transport_name}
                  onChange={(e) => set("transport_name", e.target.value)}
                  placeholder="Transport company" className="input-base" />
              </Field>
            </div>

            {/* Items Sent */}
            <Field label="Items Sent">
              <textarea value={form.items_sent}
                onChange={(e) => set("items_sent", e.target.value)}
                rows={3} placeholder="List all items sent to this customer..."
                className="input-base resize-none" />
            </Field>

            {/* Total Amount */}
            <Field label="Total Bill Amount (₹)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                <input type="number" value={form.total_amount}
                  onChange={(e) => set("total_amount", e.target.value)}
                  placeholder="0" className="input-base pl-7" />
              </div>
            </Field>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 hover:opacity-90"
              style={{ background: "linear-gradient(to right, #ff6b6b, #Fd0304)" }}>
              {loading ? "Saving…" : "💾 Save Bill"}
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
        .input-base:focus {
          border-color: #Fd0304; box-shadow: 0 0 0 3px rgba(253,3,4,0.08);
        }
      `}</style>
    </>
  );
}

function Field({ label, children, required }: {
  label: string; children: React.ReactNode; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
