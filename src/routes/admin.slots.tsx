import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Card } from "../components/ui-kit";
import { api } from "../lib/api";

export const Route = createFileRoute("/admin/slots")({
  head: () => ({ meta: [{ title: "Manage Slots · Admin · ParkPilot" }, { name: "description", content: "Manage slot status across parking lots." }] }),
  component: ManageSlots,
});

const NEXT: Record<string, string> = { AVAILABLE: "OCCUPIED", OCCUPIED: "RESERVED", RESERVED: "AVAILABLE" };

function ManageSlots() {
  const qc = useQueryClient();
  const [lotId, setLotId] = useState<string>("");

  const { data: lots = [] } = useQuery({ queryKey: ["lots"], queryFn: () => api.listLots() });

  // Default to the first lot once loaded.
  useEffect(() => {
    if (!lotId && lots.length) setLotId(lots[0].id);
  }, [lots, lotId]);

  const { data: slots = [] } = useQuery({
    queryKey: ["admin-slots", lotId],
    queryFn: () => api.getSlots(lotId),
    enabled: !!lotId,
  });

  const summary = useMemo(() => ({
    available: slots.filter((s) => s.status === "AVAILABLE").length,
    occupied: slots.filter((s) => s.status === "OCCUPIED").length,
    reserved: slots.filter((s) => s.status === "RESERVED").length,
  }), [slots]);

  const cycle = async (id: string, status: string) => {
    await api.setSlotStatus(id, NEXT[status] ?? "AVAILABLE");
    qc.invalidateQueries({ queryKey: ["admin-slots", lotId] });
  };

  return (
    <AdminLayout title="Manage Slots">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select value={lotId} onChange={(e) => setLotId(e.target.value)} className="h-11 rounded-xl border border-border bg-card px-3 text-sm">
          {lots.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
        <div className="ml-auto flex gap-3 text-sm">
          <Badge variant="success">{summary.available} Available</Badge>
          <Badge variant="danger">{summary.occupied} Occupied</Badge>
          <Badge variant="warning">{summary.reserved} Reserved</Badge>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
          {slots.map((s) => {
            const st = s.status.toUpperCase();
            const c = st === "AVAILABLE" ? "bg-[color:var(--color-success)]/25 text-[color:var(--color-success)]"
              : st === "OCCUPIED" ? "bg-destructive/25 text-destructive"
              : "bg-[color:var(--color-warning)]/25 text-[color:var(--color-warning)]";
            return (
              <button key={s.id} onClick={() => cycle(s.id, st)} className={`aspect-square rounded-lg text-xs font-bold transition-transform hover:scale-105 ${c}`}>
                {s.code}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Click any slot to cycle its status: Available → Occupied → Reserved.</p>
      </Card>
    </AdminLayout>
  );
}
