"use client";
import { useToast } from "./use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[200px] text-center transition-all animate-fade-in ${
            t.variant === "destructive" ? "bg-red-600" : "bg-[#0f172a]"
          }`}
        >
          {t.title && <div className="font-semibold">{t.title}</div>}
          {t.description && <div className="text-xs opacity-80 mt-0.5">{t.description}</div>}
        </div>
      ))}
    </div>
  );
}
