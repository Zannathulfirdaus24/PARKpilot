import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Star, MapPin, Clock, Camera, Umbrella, Zap, Shield, ChevronLeft } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Badge, Button, Card } from "../components/ui-kit";
import { parkingLots } from "../data/dummy";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/parking/$id")({
  head: () => ({ meta: [{ title: "Parking Details · ParkPilot" }, { name: "description", content: "Amenities, hours, pricing and availability for this parking lot." }] }),
  component: ParkingDetails,
});

function ParkingDetails() {
  const { id } = useParams({ from: "/parking/$id" });
  const p = parkingLots.find((x) => x.id === id) ?? parkingLots[0];
  const { setDraft } = useApp();

  const amenities = [
    { icon: Camera, label: "CCTV", on: p.amenities.cctv },
    { icon: Umbrella, label: "Covered", on: p.amenities.covered },
    { icon: Zap, label: "EV Charging", on: p.amenities.ev },
    { icon: Shield, label: "Security", on: p.amenities.security },
  ];

  return (
    <UserLayout>
      <Link to="/search" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to search
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="overflow-hidden rounded-2xl">
            <img src={p.image} alt={p.name} className="h-64 w-full object-cover sm:h-80" />
          </div>
          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight">{p.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{p.address}</p>
            </div>
            <Badge variant={p.status === "Full" ? "danger" : "success"}>{p.status}</Badge>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="mt-1 flex items-center gap-1 font-semibold"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{p.rating} <span className="text-xs font-normal text-muted-foreground">({p.reviews})</span></p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Hours</p>
              <p className="mt-1 flex items-center gap-1 font-semibold"><Clock className="h-4 w-4" />{p.hours}</p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="mt-1 font-semibold">{p.available}/{p.total}</p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Distance</p>
              <p className="mt-1 font-semibold">{p.distance}</p>
            </div>
          </div>

          <h2 className="mt-6 text-sm font-semibold">Amenities</h2>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {amenities.map((a) => (
              <div key={a.label} className={`flex items-center gap-2 rounded-xl border border-border p-3 text-sm ${a.on ? "" : "opacity-40"}`}>
                <a.icon className={`h-4 w-4 ${a.on ? "text-primary" : ""}`} />
                <span>{a.label}</span>
              </div>
            ))}
          </div>

          <h2 className="mt-6 text-sm font-semibold">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Secure multi-level parking with 24/7 CCTV coverage and on-site security personnel. Well-lit spaces, clearly marked EV charging bays, and quick highway access. Perfect for shoppers, commuters and business visitors.
          </p>
        </div>

        <Card className="h-fit lg:sticky lg:top-24">
          <p className="text-sm text-muted-foreground">From</p>
          <p className="text-3xl font-bold text-primary">${p.price}<span className="text-sm font-normal text-muted-foreground">/hour</span></p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Opening hours</span><span className="font-medium">{p.hours}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Available slots</span><span className="font-medium">{p.available}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Rating</span><span className="font-medium">{p.rating} ★</span></div>
          </div>
          <Link to="/slots/$id" params={{ id: p.id }}>
            <Button
              className="mt-5 w-full"
              disabled={p.available === 0}
              onClick={() => setDraft({ lotId: p.id, lotName: p.name, price: p.price })}
            >
              Choose Slot
            </Button>
          </Link>
          <p className="mt-3 text-center text-xs text-muted-foreground">Free cancellation up to 30 min before</p>
        </Card>
      </div>
    </UserLayout>
  );
}
