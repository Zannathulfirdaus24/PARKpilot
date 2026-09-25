import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Smartphone, Wallet, Landmark, Lock } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Button, Card, Input } from "../components/ui-kit";
import { useApp } from "../context/AppContext";
import { api, CURRENCY } from "../lib/api";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment · ParkPilot" }, { name: "description", content: "Securely pay for your parking reservation." }] }),
  component: PaymentPage,
});

const methods = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Pay by scanning any UPI app" },
  { id: "cc", label: "Credit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex" },
  { id: "dc", label: "Debit Card", icon: Landmark, desc: "All major banks" },
  { id: "wallet", label: "Wallet", icon: Wallet, desc: "ParkPilot balance" },
];

function PaymentPage() {
  const [sel, setSel] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const { draft, setDraft } = useApp();
  const queryClient = useQueryClient();

  const total = (draft.price ?? 60) * (draft.hours ?? 2) + 10;

  const handlePay = async () => {
    setError(null);
    if (!draft.lotId || !draft.slotId) {
      setError("Missing booking details. Please pick a slot again.");
      return;
    }
    setLoading(true);
    try {
      // Mock payment succeeds instantly → create the real booking in the backend.
      const booking = await api.createBooking({
        lotId: draft.lotId,
        slotId: draft.slotId,
        hours: draft.hours ?? 2,
      });
      // Save booking result into the draft for the success screen.
      setDraft({
        ...draft,
        reference: booking.reference,
        slot: booking.slotCode,
        lotName: booking.lotName,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
      // Refresh dashboard + bookings so the new booking shows up immediately.
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      nav({ to: "/success" });
    } catch (e: any) {
      setError(e?.message ?? "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout title="Payment">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {methods.map((m) => {
            const active = sel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSel(m.id)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${active ? "border-primary bg-primary/5 ring-4 ring-primary/10" : "border-border bg-card hover:bg-accent"}`}
              >
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${active ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </div>
                <div className={`h-5 w-5 rounded-full border-2 ${active ? "border-primary bg-primary" : "border-border"}`}>
                  {active && <div className="m-1 h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}

          {sel === "cc" && (
            <Card>
              <div className="grid gap-3">
                <Input label="Card number" placeholder="4242 4242 4242 4242" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Expiry" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="123" />
                </div>
                <Input label="Cardholder name" placeholder="Ava Rodriguez" />
              </div>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Slot</span><span>{draft.slot ?? "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{draft.hours ?? 2}h</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{CURRENCY}{(draft.price ?? 60) * (draft.hours ?? 2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fees & tax</span><span>{CURRENCY}10</span></div>
            <div className="mt-2 flex justify-between border-t border-border pt-3 text-lg font-bold"><span>Total</span><span className="text-primary">{CURRENCY}{total}</span></div>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <Button loading={loading} className="mt-5 w-full" onClick={handlePay}>
            <Lock className="h-4 w-4" /> Pay {CURRENCY}{total}
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Secured by 256-bit SSL encryption</p>
        </Card>
      </div>
    </UserLayout>
  );
}
