import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Button, Card } from "../components/ui-kit";

export const Route = createFileRoute("/penalty")({
  head: () => ({ meta: [{ title: "Overtime Penalty · ParkPilot" }, { name: "description", content: "Settle your overtime parking penalty." }] }),
  component: PenaltyPage,
});

function PenaltyPage() {
  return (
    <UserLayout title="Overtime Penalty">
      <div className="mx-auto max-w-lg">
        <Card>
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="text-sm font-medium">Your parking session has exceeded the allotted time.</p>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Grace Time</p>
              <p className="mt-1 text-lg font-bold">15 min</p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Overtime</p>
              <p className="mt-1 flex items-center justify-center gap-1 text-lg font-bold text-destructive"><Clock className="h-4 w-4" />42 min</p>
            </div>
            <div className="rounded-xl bg-secondary p-4">
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="mt-1 text-lg font-bold">$1.5/min</p>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Overtime charges</span><span>$63.00</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Late fee</span><span>$5.00</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-xl font-bold"><span>Penalty due</span><span className="text-destructive">$68.00</span></div>
          </div>
          <Button variant="destructive" className="mt-5 w-full">Pay Penalty Now</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Penalty is auto-charged to your default payment method after 24 hours.</p>
        </Card>
      </div>
    </UserLayout>
  );
}
