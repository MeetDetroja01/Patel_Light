// Minimal toast hook (no external dep)
import { useState, useEffect, useCallback, useRef } from "react";

export type ToastVariant = "default" | "destructive";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

type ToastInput = Omit<Toast, "id">;

const listeners: Array<(toasts: Toast[]) => void> = [];
let memToasts: Toast[] = [];

function dispatch(toasts: Toast[]) {
  memToasts = toasts;
  listeners.forEach((l) => l(toasts));
}

export function toast(input: ToastInput) {
  const id = Math.random().toString(36).slice(2);
  const newToast: Toast = { id, ...input };
  dispatch([...memToasts, newToast]);
  setTimeout(() => {
    dispatch(memToasts.filter((t) => t.id !== id));
  }, 3000);
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  return { toasts };
}
