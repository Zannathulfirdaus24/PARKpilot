import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { useEffect } from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" };
  const variants = {
    primary: "gradient-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:brightness-110",
    outline: "border border-border bg-card text-foreground hover:bg-accent",
    ghost: "text-foreground hover:bg-accent",
    destructive: "bg-destructive text-destructive-foreground hover:brightness-110",
    success: "bg-[color:var(--color-success)] text-white hover:brightness-110",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Input({
  label,
  icon,
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; icon?: ReactNode }) {
  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          className={`h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15 ${
            icon ? "pl-10" : ""
          } ${className}`}
          {...rest}
        />
      </div>
    </label>
  );
}

export function Card({ children, className = "", hover = false }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`card-elevated p-5 ${hover ? "transition-all hover:-translate-y-0.5 hover:shadow-xl" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const map = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
    warning: "bg-[color:var(--color-warning)]/20 text-[color:var(--color-warning)]",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-primary/12 text-primary",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${map[variant]}`}>
      {children}
    </span>
  );
}

export function Spinner({ size = 24 }: { size?: number }) {
  return <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} />;
}

export function StatCard({
  label,
  value,
  icon,
  delta,
  tone = "info",
}: {
  label: string;
  value: string;
  icon: ReactNode;
  delta?: string;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  const tones = {
    info: "text-primary bg-primary/10",
    success: "text-[color:var(--color-success)] bg-[color:var(--color-success)]/12",
    warning: "text-[color:var(--color-warning)] bg-[color:var(--color-warning)]/20",
    danger: "text-destructive bg-destructive/12",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
          {delta && <p className="mt-1 text-xs text-[color:var(--color-success)] font-medium">{delta}</p>}
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}>{icon}</div>
      </div>
    </motion.div>
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 animate-in fade-in">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-elevated w-full max-w-md">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed border-border p-10 text-center">
      <p className="font-medium">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
    </div>
  );
}
