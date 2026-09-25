import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, MapPin, ArrowRight, Wallet, CalendarRange, TrendingUp, Clock } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserLayout } from "../components/layouts/UserLayout";
import { Badge, Button, Card, StatCard } from "../components/ui-kit";
import { useApp } from "../context/AppContext";
import { api, CURRENCY, type BookingDto } from "../lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · ParkPilot" }, { name: "description", content: "Your parking activity at a glance." }] }),
  component: Dashboard,
});

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}
function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

function Dashboard() {
  const { user, isAuthenticated, setUser } = useApp();
  const nav = useNavigate();

  // Redirect to login if there's no session.
  useEffect(() => {
    if (!isAuthenticated) nav({ to: "/login" });
  }, [isAuthenticated, nav]);

  // Load the profile if we have a token but no user object yet (e.g. after refresh).
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: api.me,
    enabled: isAuthenticated && !user,
  });
  useEffect(() => {
    if (me && !user) {
      setUser({
        name: me.name,
        email: me.email,
        phone: me.phone ?? "",
        vehicle: me.vehicleNo ?? "",
        avatar: me.avatarUrl ?? "",
      });
    }
  }, [me, user, setUser]);

  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: api.dashboardSummary,
    enabled: isAuthenticated,
  });

  const { data: bookings } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: api.myBookings,
    enabled: isAuthenticated,
  });

  const active = summary?.activeReservation ?? null;
  const recent: BookingDto[] = (bookings ?? []).slice(0, 3);
  const name = (user?.name ?? me?.name ?? "there").split(" ")[0];

  return (
    <UserLayout>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Good afternoon,</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name} 👋</h1>
        </div>
      </div>

      {active ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl gradient-primary p-6 text-primary-foreground shadow-xl shadow-primary/30">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-primary-foreground/80">Active Reservation</p>
              <h2 className="mt-1 text-xl font-bold">{active.lotName}</h2>
              <p className="text-sm text-primary-foreground/85">Slot {active.slotCode} · {fmtTime(active.startTime)} – {fmtTime(active.endTime)}</p>
            </div>
            <div className="rounded-xl bg-white/15 px-4 py-3 text-center backdrop-blur">
              <p className="text-[10px] uppercase tracking-wider text-primary-foreground/80">Amount</p>
              <p className="text-2xl font-bold tabular-nums">{CURRENCY}{active.amount}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/success"><Button variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20">View Ticket</Button></Link>
            <Link to="/penalty"><Button variant="ghost" className="text-primary-foreground hover:bg-white/15">Extend Time</Button></Link>
          </div>
        </motion.div>
      ) : (
        <Card className="text-center text-muted-foreground">No active reservation right now.</Card>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard label="Bookings this month" value={String(summary?.bookingsThisMonth ?? 0)} icon={<CalendarRange className="h-5 w-5" />} tone="info" />
        <StatCard label="Total spending" value={`${CURRENCY}${summary?.totalSpending ?? 0}`} icon={<Wallet className="h-5 w-5" />} tone="success" />
        <StatCard label="Avg. rating given" value={String(summary?.avgRatingGiven ?? "—")} icon={<TrendingUp className="h-5 w-5" />} tone="warning" />
      </div>

      <Link to="/search" className="mt-6 block">
        <Card hover className="flex items-center justify-between gradient-hero">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Find Parking</p>
              <p className="text-sm text-muted-foreground">Search nearby available spots</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </Card>
      </Link>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
        <Link to="/bookings" className="text-sm font-medium text-primary">View all</Link>
      </div>
      <div className="mt-3 grid gap-3">
        {recent.length === 0 && (
          <Card className="text-center text-muted-foreground">No bookings yet.</Card>
        )}
        {recent.map((b) => (
          <Card key={b.id} className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div>
              <div>
                <p className="font-medium">{b.lotName}</p>
                <p className="text-xs text-muted-foreground"><Clock className="mr-1 inline h-3 w-3" />{fmtDate(b.startTime)} · {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={b.status === "COMPLETED" ? "success" : b.status === "CANCELLED" ? "danger" : "info"}>{b.status}</Badge>
              <p className="font-semibold">{CURRENCY}{b.amount}</p>
            </div>
          </Card>
        ))}
      </div>
    </UserLayout>
  );
}
