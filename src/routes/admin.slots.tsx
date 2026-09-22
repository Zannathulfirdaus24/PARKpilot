import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Button, Card } from "../components/ui-kit";
import { generateSlots } from "../data/dummy";

export const Route = createFileRoute("/admin/slots")({
  head: () => ({ meta: [{ title: "Manage Slots · Admin · ParkPilot" }, { name: "description", content: "Manage slot status across parking lots." }] }),
  component: ManageSlots,
});

function ManageSlots() {
  const [slots, setSlots] = useState(() => generateSlots());
  const summary = useMemo(() => ({
    available: slots.filter((s) => s.status === "available").length,
    occupied: slots.filter((s) => s.status === "occupied").length,
    reserved: slots.filter((s) => s.status === "reserved").length,
  }), [slots]);

  const cycle = (id: string) => setSlots((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "available" ? "occupied" : s.status === "occupied" ? "reserved" : "available" } : s));

  return (
    <AdminLayout title="Manage Slots">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select className="h-11 rounded-xl border border-border bg-card px-3 text-sm">
          <option>Downtown Central Parking</option>
          <option>Skyline Tower Garage</option>
        </select>
        <div className="ml-auto flex gap-3 text-sm">
          <Badge variant="success">{summary.available} Available</Badge>
          <Badge variant="danger">{summary.occupied} Occupied</Badge>
          <Badge variant="warning">{summary.reserved} Reserved</Badge>
        </div>
        <Button><Plus className="h-4 w-4" /> Add Slot</Button>
      </div>

      <Card>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {slots.map((s) => {
            const c = s.status === "available" ? "bg-[color:var(--color-success)]/25 text-[color:var(--color-success)]" : s.status === "occupied" ? "bg-destructive/25 text-destructive" : "bg-[color:var(--color-warning)]/25 text-[color:var(--color-warning)]";
            return (
              <button key={s.id} onClick={() => cycle(s.id)} className={`aspect-square rounded-lg text-xs font-bold transition-transform hover:scale-105 ${c}`}>
                {s.id}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Click any slot to cycle its status: Available → Occupied → Maintenance.</p>
      </Card>
    </AdminLayout>
  );
}
