import { Link } from "@tanstack/react-router";
import { Car } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="min-h-screen gradient-hero grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 gradient-primary text-primary-foreground">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Car className="h-5 w-5" />
          </div>
          ParkPilot
        </Link>
        <div>
          <h2 className="text-4xl font-bold leading-tight">Park smarter.<br />Move faster.</h2>
          <p className="mt-4 max-w-md text-primary-foreground/85">Reserve verified parking spots in seconds — anywhere in the city, at the best price.</p>
        </div>
        <div className="text-xs text-primary-foreground/70">© 2026 ParkPilot Inc.</div>
      </div>
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <Car className="h-5 w-5" />
            </div>
            <span className="font-bold">ParkPilot</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8 space-y-4">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}
