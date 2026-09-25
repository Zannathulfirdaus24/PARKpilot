import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, MapPin, Car } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Button, Card } from "../components/ui-kit";
import { useApp } from "../context/AppContext";
import { CURRENCY } from "../lib/api";

export const Route = createFileRoute("/summary")({
  head: () => ({ meta: [{ title: "Reservation Summary · ParkPilot" }, { name: "description", content: "Review your parking reservation before payment." }] }),
  component: Summary,
});

function Summary() {
  const { draft } = useApp();
  const nav = useNavigate();
  const [secs, setSecs] = useState(9 * 60 + 45);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const total = (draft.price ?? 60) * (draft.hours ?? 2);
  const tax = Math.round(total * 0.08);

  return (
    <UserLayout title="Confirm Reservation">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="h-4 w-4" />
              <p className="text-sm font-medium">Hold expires in</p>
            </div>
            <p className="text-lg font-bold tabular-nums text-primary">
              {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"><MapPin className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">{draft.lotName ?? "Downtown Central Parking"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"><Car className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Slot</p>
                <p className="font-semibold">{draft.slot ?? "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary"><Clock className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="font-semibold">{draft.hours ?? 2} hours</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <h2 className="font-semibold">Price Details</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Parking fee</span><span>{CURRENCY}{total}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Service tax</span><span>{CURRENCY}{tax}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Platform fee</span><span>{CURRENCY}2</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-lg font-bold"><span>Total</span><span className="text-primary">{CURRENCY}{total + tax + 2}</span></div>
          </div>
          <Button className="mt-5 w-full" onClick={() => nav({ to: "/payment" })}>Continue to Payment</Button>
          <Link to="/search" className="mt-3 block text-center text-xs text-muted-foreground hover:underline">Cancel and search again</Link>
        </Card>
      </div>
    </UserLayout>
  );
}
