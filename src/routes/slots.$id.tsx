import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Button, Card } from "../components/ui-kit";
import { generateSlots, parkingLots } from "../data/dummy";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/slots/$id")({
  head: () => ({ meta: [{ title: "Choose a Slot · ParkPilot" }, { name: "description", content: "Pick your parking slot from the interactive lot map." }] }),
  component: SlotSelection,
});

function SlotSelection() {
  const { id } = useParams({ from: "/slots/$id" });
  const p = parkingLots.find((x) => x.id === id) ?? parkingLots[0];
  const slots = useMemo(() => generateSlots(), []);
  const [selected, setSelected] = useState<string | null>(null);
  const [hours, setHours] = useState(2);
  const nav = useNavigate();
  const { setDraft, draft } = useApp();

  const rows = ["A", "B", "C", "D", "E"];

  return (
    <UserLayout>
      <Link to="/parking/$id" params={{ id }} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h1 className="text-xl font-bold">{p.name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Choose an available slot</p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[color:var(--color-success)]" />Available</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-destructive" />Occupied</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded bg-[color:var(--color-warning)]" />Reserved</span>
            <span className="flex items-center gap-2"><span className="h-3 w-3 rounded gradient-primary" />Selected</span>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/40 p-4">
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="h-1 w-16 rounded-full bg-primary/40" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Entry</p>
              <span className="h-1 w-16 rounded-full bg-primary/40" />
            </div>
            <div className="space-y-2">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <span className="w-4 text-xs font-bold text-muted-foreground">{row}</span>
                  <div className="grid flex-1 grid-cols-10 gap-1.5">
                    {slots.filter((s) => s.id.startsWith(row + "-")).map((s) => {
                      const isSel = selected === s.id;
                      const color =
                        isSel ? "gradient-primary text-primary-foreground scale-110"
                        : s.status === "available" ? "bg-[color:var(--color-success)]/25 text-[color:var(--color-success)] hover:bg-[color:var(--color-success)]/40"
                        : s.status === "occupied" ? "bg-destructive/25 text-destructive/60 cursor-not-allowed"
                        : "bg-[color:var(--color-warning)]/25 text-[color:var(--color-warning)] cursor-not-allowed";
                      return (
                        <button
                          key={s.id}
                          disabled={s.status !== "available" && !isSel}
                          onClick={() => setSelected(s.id)}
                          className={`aspect-square rounded-md text-[9px] font-bold transition-all ${color}`}
                          title={s.id}
                        >
                          {s.id.split("-")[1]}
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
          <p className="mt-1 text-3xl font-bold">{selected ?? "—"}</p>
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
            <div className="flex justify-between"><span className="text-muted-foreground">Rate</span><span>${draft.price ?? p.price}/hr</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{hours}h</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span className="text-primary">${(draft.price ?? p.price) * hours}</span></div>
          </div>
          <Button
            className="mt-5 w-full"
            disabled={!selected}
            onClick={() => { setDraft({ ...draft, lotId: p.id, lotName: p.name, price: p.price, slot: selected!, hours }); nav({ to: "/summary" }); }}
          >
            Continue
          </Button>
        </Card>
      </div>
    </UserLayout>
  );
}
