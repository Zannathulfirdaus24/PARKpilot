import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, MapPin, Clock } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Badge, Button, Card, Input } from "../components/ui-kit";
import { bookings } from "../data/dummy";

export const Route = createFileRoute("/bookings")({
  head: () => ({ meta: [{ title: "My Bookings · ParkPilot" }, { name: "description", content: "History of all your parking reservations." }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "Completed" | "Cancelled">("all");
  const list = useMemo(() => bookings.filter((b) => (tab === "all" || b.status === tab) && (b.lot + b.id).toLowerCase().includes(q.toLowerCase())), [q, tab]);

  return (
    <UserLayout title="My Bookings">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input className="sm:flex-1" icon={<Search className="h-4 w-4" />} placeholder="Search by lot or booking ID" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2">
          {(["all", "Completed", "Cancelled"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`h-11 rounded-xl px-4 text-sm font-medium capitalize transition-all ${tab === t ? "gradient-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {list.map((b) => (
          <Card key={b.id} hover className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{b.lot}</p>
                  <Badge variant={b.status === "Completed" ? "success" : "danger"}>{b.status}</Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground"><Clock className="mr-1 inline h-3 w-3" />{b.date} · {b.time} · Slot {b.slot}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">ID: {b.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-bold">${b.amount}</p>
              <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Receipt</Button>
            </div>
          </Card>
        ))}
        {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No bookings match your search.</p>}
      </div>
    </UserLayout>
  );
}
