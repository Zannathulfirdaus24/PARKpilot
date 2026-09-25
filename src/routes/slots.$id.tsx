import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserLayout } from "../components/layouts/UserLayout";
import { Button, Card } from "../components/ui-kit";
import { api, CURRENCY } from "../lib/api";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/slots/$id")({
  head: () => ({ meta: [{ title: "Choose a Slot · ParkPilot" }, { name: "description", content: "Pick your parking slot from the interactive lot map." }] }),
  component: SlotSelection,
});

function SlotSelection() {
  const { id } = useParams({ from: "/slots/$id" });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [hours, setHours] = useState(2);
  const nav = useNavigate();
  const { setDraft, draft } = useApp();

  const { data: lot } = useQuery({ queryKey: ["lot", id], queryFn: () => api.getLot(id) });
  const { data: slots = [], isLoading } = useQuery({
    queryKey: ["slots", id],
    queryFn: () => api.getSlots(id),
  });

  const rate = lot?.pricePerHour ?? draft.price ?? 0;

  // Group slot codes by their row letter (e.g. "A-01" -> row "A").
  const rows = useMemo(() => {
    const map: Record<string, typeof slots> = {};
    for (const s of slots) {
      const row = s.code.split("-")[0];
      (map[row] ??= []).push(s);
    }
    return Object.keys(map).sort().map((r) => ({ row: r, slots: map[r] }));
  }, [slots]);

  return (
    <UserLayout>
      <Link to="/parking/$id" params={{ id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h1 className="text-xl font-bold">{lot?.name ?? "Parking"}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Choose an available slot</p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[color:var(--color-success)]" />Available</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-destructive" />Occupied</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[color:var(--color-warning)]" />Reserved</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded gradient-primary" />Selected</span>
          </div>

          {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading slots…</p>}

          <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="h-1 w-16 rounded-full bg-primary/40" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Entry</p>
              <span className="h-1 w-16 rounded-full bg-primary/40" />
            </div>
            <div className="space-y-2">
              {rows.map(({ row, slots: rowSlots }) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-4 text-xs font-bold text-muted-foreground">{row}</span>
                  <div className="grid flex-1 grid-cols-10 gap-1.5">
                    {rowSlots.map((s) => {
                      const status = s.status.toLowerCase();
                      const isSel = selectedId === s.id;
                      const color =
                        isSel ? "gradient-primary text-primary-foreground scale-110"
                        : status === "available" ? "bg-[color:var(--color-success)]/25 text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/40"
                        : status === "occupied" ? "bg-destructive/25 text-destructive/60 cursor-not-allowed"
                        : "bg-[color:var(--color-warning)]/25 text-[color:var(--color-warning)] cursor-not-allowed";
                      return (
                        <button
                          key={s.id}
                          disabled={status !== "available" && !isSel}
                          onClick={() => { setSelectedId(s.id); setSelectedCode(s.code); }}
                          className={`aspect-square rounded-md text-[9px] font-bold transition-all ${color}`}
                          title={s.code}
                        >
                          {s.code.split("-")[1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">Selected slot</p>
          <p className="mt-1 text-3xl font-bold">{selectedCode ?? "—"}</p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Duration</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setHours((h) => Math.max(1, h - 1))} className="h-10 w-10 rounded-xl border border-border font-bold hover:bg-accent">−</button>
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold">{hours}</p>
                <p className="text-xs text-muted-foreground">hours</p>
              </div>
              <button onClick={() => setHours((h) => Math.min(12, h + 1))} className="h-10 w-10 rounded-xl border border-border font-bold hover:bg-accent">+</button>
            </div>
          </div>
          <div className="mt-5 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span>{CURRENCY}{rate}/hr</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{hours}h</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span className="text-primary">{CURRENCY}{rate * hours}</span></div>
          </div>
          <Button
            className="mt-5 w-full"
            disabled={!selectedId}
            onClick={() => {
              setDraft({ ...draft, lotId: id, lotName: lot?.name, price: rate, slot: selectedCode!, slotId: selectedId!, hours });
              nav({ to: "/summary" });
            }}
          >
            Continue
          </Button>
        </Card>
      </div>
    </UserLayout>
  );
}
