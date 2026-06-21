"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/add-bill",   icon: "➕", label: "Add Bill" },
  { href: "/dashboard/customers",  icon: "📋", label: "Customers" },
  { href: "/dashboard/search",     icon: "🔍", label: "Search" },
  { href: "/dashboard/analytics",  icon: "📊", label: "Analytics" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen flex flex-col z-50 overflow-y-auto"
      style={{ width: "260px", background: "#0f172a" }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "linear-gradient(to right, #ffb25f, #ed1c24, #ff0000)" }}
        >
          ⚡
        </div>
        <div>
          <div className="text-white font-bold text-base leading-tight">Patel Light</div>
          <div className="text-xs" style={{ color: "#64748b" }}>Customer Manager</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] uppercase tracking-widest px-3 mb-2 font-semibold"
          style={{ color: "rgba(136,153,170,0.5)" }}>
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-l-[3px]",
                active
                  ? "border-[#Fd0304] bg-white/[0.06] text-white"
                  : "border-transparent text-[#94a3b8] hover:bg-white/[0.03] hover:text-slate-300"
              )}
            >
              <span className={cn("text-base", active ? "text-[#Fd0304]" : "")}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer user strip */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(to right, #ffb25f, #Fd0304)" }}
          >
            PL
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">Patel Light</div>
            <div className="text-[10px]" style={{ color: "#64748b" }}>Administrator</div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            title="Logout"
            className="text-slate-500 hover:text-red-400 transition-colors text-lg"
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  );
}
