"use client";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const titles: Record<string, string> = {
  "/dashboard/add-bill":  "Add Bill",
  "/dashboard/customers": "Customers",
  "/dashboard/search":    "Search & Rankings",
  "/dashboard/analytics": "Analytics",
};

export function Topbar({ username }: { username: string }) {
  const pathname = usePathname();
  const title = Object.entries(titles).find(([k]) => pathname.startsWith(k))?.[1] || "Dashboard";

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6"
      style={{
        height: "60px",
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="text-slate-400">⚡</span>
        <span className="text-slate-300">/</span>
        <span className="font-semibold text-slate-700">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
          <span>👤</span>
          <span className="font-medium">{username}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
        >
          <span>↩</span>
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
