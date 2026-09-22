import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, CalendarDays, User, Moon, Sun, Bell, Car } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "../../context/AppContext";

const nav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/search", label: "Search", icon: Search },
  { to: "/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/profile", label: "Profile", icon: User },
];

export function UserLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { theme, toggleTheme, user } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-lg shadow-primary/30">
              <Car className="h-5 w-5" />
            </div>
            <span className="hidden text-lg font-bold tracking-tight sm:block">ParkPilot</span>
          </Link>
          <div className="hidden flex-1 items-center gap-1 md:flex justify-center">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleTheme} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-accent" aria-label="Theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="relative grid h-10 w-10 place-items-center rounded-xl hover:bg-accent" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
            {user && (
              <img src={user.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/20" />
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {title && <h1 className="mb-4 text-2xl font-bold tracking-tight">{title}</h1>}
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4">
          {nav.map((n) => {
            const active = pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
