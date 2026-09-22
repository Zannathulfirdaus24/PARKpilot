import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal, Star, MapPin, Navigation2 } from "lucide-react";
import { useMemo, useState } from "react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Badge, Button, Card, Input } from "../components/ui-kit";
import { parkingLots } from "../data/dummy";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Find Parking · ParkPilot" }, { name: "description", content: "Search nearby verified parking spots in real time." }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"distance" | "price" | "rating">("distance");
  const list = useMemo(() => {
    const filtered = parkingLots.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.address.toLowerCase().includes(q.toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "rating") return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
  }, [q, sort]);

  return (
    <UserLayout title="Find Parking">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input icon={<Search className="h-4 w-4" />} placeholder="Search area, address, or landmark" value={q} onChange={(e) => setQ(e.target.value)} className="sm:flex-1" />
        <div className="flex gap-2">
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="h-11 rounded-xl border border-border bg-card px-3 text-sm outline-none focus:border-primary">
            <option value="distance">Nearest</option>
            <option value="price">Cheapest</option>
            <option value="rating">Top Rated</option>
          </select>
          <Button variant="outline"><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="mt-5 h-56 overflow-hidden rounded-2xl border border-border md:h-72">
        <div className="relative h-full w-full bg-[linear-gradient(120deg,#dbeafe,#e0f2fe,#f5f3ff)] dark:bg-[linear-gradient(120deg,#0f1e3d,#0b1a33,#111b34)]">
          <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0 120 Q100 80 200 130 T400 100" stroke="currentColor" fill="none" strokeWidth="2" />
            <path d="M0 60 Q120 100 220 60 T400 80" stroke="currentColor" fill="none" strokeWidth="2" />
            <path d="M50 0 L60 200 M180 0 L200 200 M320 0 L340 200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          </svg>
          {parkingLots.map((p, i) => (
            <div key={p.id} className="absolute" style={{ left: `${15 + i * 22}%`, top: `${25 + (i % 2) * 35}%` }}>
              <div className="relative">
                <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-primary-foreground shadow-lg shadow-primary/40">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="absolute -right-1 -top-1 rounded-full bg-card px-1.5 py-0.5 text-[10px] font-bold text-primary shadow">${p.price}</span>
              </div>
            </div>
          ))}
          <button className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-xl bg-card shadow-md">
            <Navigation2 className="h-4 w-4 text-primary" />
          </button>
        </div>
      </div>

      <p className="mt-6 mb-3 text-sm text-muted-foreground">{list.length} spots nearby</p>
      <div className="grid gap-3 md:grid-cols-2">
        {list.map((p) => (
          <Link key={p.id} to="/parking/$id" params={{ id: p.id }}>
            <Card hover className="flex gap-4">
              <img src={p.image} alt={p.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate font-semibold">{p.name}</p>
                  <Badge variant={p.status === "Full" ? "danger" : p.status === "Filling Fast" ? "warning" : "success"}>{p.status}</Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.address}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{p.rating}</span>
                  <span>{p.distance}</span>
                  <span>{p.available}/{p.total} slots</span>
                </div>
                <p className="mt-2 text-lg font-bold text-primary">${p.price}<span className="text-xs font-normal text-muted-foreground">/hr</span></p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </UserLayout>
  );
}
