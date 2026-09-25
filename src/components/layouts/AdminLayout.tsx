import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MapPin,
  Grid3x3,
  CalendarCheck,
  Users,
  CreditCard,
  FileBarChart,
  Bell,
  Settings,
  Menu,
  Moon,
  Sun,
  LogOut,
  Car,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useApp } from "../../context/AppContext";
import { Avatar } from "../ui-kit";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/parking", label: "Parking Lots", icon: MapPin },
  { to: "/admin/slots", label: "Slots", icon: Grid3x3 },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, user } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const NavList = () => (
    <nav className="flex flex-col gap-1 p-3">
      {nav.map((n) => {
        const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
        const Icon = n.icon;
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              active ? "gradient-primary text-primary-foreground shadow-md shadow-primary/25" : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{n.label}</span>
          </Link>
        );
      })}
      <Link to="/admin/login" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent">
        <LogOut className="h-4 w-4" /> Logout
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">ParkPilot</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin</p>
          </div>
        </div>
        <NavList />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-sidebar">
            <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <Car className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold">ParkPilot Admin</p>
            </div>
            <NavList />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl">
          <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Avatar src={user?.avatar || undefined} name={user?.name ?? "Admin"} size={36} />
          </div>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
