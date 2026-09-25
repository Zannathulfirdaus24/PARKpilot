import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserLayout } from "../components/layouts/UserLayout";
import { Badge, Button, Card, Input } from "../components/ui-kit";
import { api, CURRENCY, type BookingDto } from "../lib/api";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My Bookings · ParkPilot" }, { name: "description", content: "History of all your parking reservations." }] }),
  component: BookingsPage,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}

const badgeVariant = (status: BookingDto["status"]) =>
  status === "COMPLETED" ? "success"
  : status === "CANCELLED" ? "danger"
  : status === "ACTIVE" ? "info"
  : "warning";

function BookingsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "ACTIVE" | "COMPLETED" | "CANCELLED">("all");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: api.myBookings,
  });

  const list = useMemo(
    () => bookings.filter(
      (b) =>
        (tab === "all" || b.status === tab) &&
        (b.lotName + b.reference).toLowerCase().includes(q.toLowerCase()),
    ),
    [bookings, q, tab],
  );

  const tabs: Array<{ key: typeof tab; label: string }> = [
    { key: "all", label: "All" },
    { key: "ACTIVE", label: "Active" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  return (
    <UserLayout title="My Bookings">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input className="sm:flex-1" icon={<Search className="h-4 w-4" />} placeholder="Search by lot or booking ID" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`h-11 rounded-xl px-4 text-sm font-medium transition-all ${tab === t.key ? "gradient-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading your bookings…</p>}

      <div className="mt-6 grid gap-3">
        {list.map((b) => (
          <Card key={b.id} hover className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{b.lotName}</p>
                  <Badge variant={badgeVariant(b.status)}>{b.status}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground"><Clock className="mr-1 inline h-3 w-3" />{fmtDate(b.startTime)} · {fmtTime(b.startTime)} – {fmtTime(b.endTime)} · Slot {b.slotCode}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">ID: {b.reference}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-bold">{CURRENCY}{b.amount}</p>
              <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Receipt</Button>
            </div>
          </Card>
        ))}
        {!isLoading && list.length === 0 && <p className="py-16 text-center text-muted-foreground">No bookings yet.</p>}
      </div>
    </UserLayout>
  );
}
