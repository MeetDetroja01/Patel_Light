"use client";

export interface Bill {
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
  onEdit: (b: Bill) => void;
  onDelete: (id: string) => void;
}

export function BillCard({ bill: b, onEdit, onDelete }: Props) {
  const initials = b.customer_name
    ? b.customer_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-red-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #ffb25f, #Fd0304)" }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-sm"
            style={{ background: "linear-gradient(135deg, #Fd0304, #ff6b6b)" }}
          >
            {initials}
          </div>

          {/* Name + shop */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[#0f172a] text-base leading-tight truncate">
              {b.customer_name}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate">
              {b.shop_name || "No shop name"}
            </div>
          </div>

          {/* Amount badge */}
          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-extrabold tracking-tight" style={{ color: "#Fd0304" }}>
              ₹{Number(b.total_amount || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
              Total Amount
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
          <InfoRow icon="📍" label="Location" value={[b.city, b.state].filter(Boolean).join(", ") || "—"} />
          <InfoRow icon="🚚" label="Transport" value={b.transport_name || "—"} />
          <InfoRow icon="🧾" label="Bill No." value={b.bill_number || "—"} />
          <InfoRow icon="📅" label="Date" value={b.date || "—"} />
          <InfoRow icon="📱" label="Mobile" value={b.mobile_number || "—"} />
          {b.items_sent && (
            <InfoRow
              icon="📦"
              label="Items"
              value={b.items_sent.length > 45 ? b.items_sent.substring(0, 45) + "…" : b.items_sent}
              full
            />
          )}
        </div>

        {/* Action row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(b)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(b._id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-200 transition-all"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          {/* Bill number chip */}
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 tracking-wide">
            {b.bill_number || "No Bill #"}
          </span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  full,
}: {
  icon: string;
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
        {icon} {label}
      </div>
      <div className="text-xs font-medium text-slate-700 truncate">{value}</div>
    </div>
  );
}
