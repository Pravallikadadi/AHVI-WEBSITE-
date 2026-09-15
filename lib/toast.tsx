"use client";
import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastContext = createContext<{ push: (message: string, kind?: Toast["kind"]) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] grid gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "flex items-center gap-2.5 border px-4 py-3 text-[13.5px] shadow-lg " +
              (t.kind === "success" ? "border-ink bg-ink text-bg" : "border-error bg-error text-bg")
            }
          >
            {t.kind === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
