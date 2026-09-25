import { createFileRoute } from "@tanstack/react-router";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Button, Card } from "../components/ui-kit";
import { api, CURRENCY } from "../lib/api";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports · Admin · ParkPilot" }, { name: "description", content: "Generate daily, weekly and monthly reports." }] }),
  component: AdminReports,
});

function AdminReports() {
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: api.adminDashboard });
  const revenueSeries = data?.revenueSeries ?? [];

  // Derive KPIs from the live series.
  const kpis = useMemo(() => {
    if (!revenueSeries.length) return null;
    const peak = revenueSeries.reduce((a, b) => (b.revenue > a.revenue ? b : a));
    const bestLot = data?.occupancyByLot?.length
      ? data.occupancyByLot.reduce((a, b) => (b.value > a.value ? b : a))
      : null;
    return { peak, bestLot };
  }, [revenueSeries, data]);

  return (
    <AdminLayout title="Reports">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["Daily", "Weekly", "Monthly"] as const).map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`h-10 rounded-xl px-4 text-sm font-medium ${range === r ? "gradient-primary text-primary-foreground" : "border border-border bg-card hover:bg-accent"}`}>{r}</button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button variant="outline"><FileDown className="h-4 w-4" /> Export PDF</Button>
          <Button variant="outline"><FileSpreadsheet className="h-4 w-4" /> Export Excel</Button>
        </div>
      </div>
      <Card>
        <h2 className="font-semibold">{range} Revenue Report</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueSeries} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="bookings" stroke="#93c5fd" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Card>
          <p className="text-xs text-muted-foreground">Peak Day</p>
          <p className="mt-1 text-lg font-bold">{kpis?.peak?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{CURRENCY}{kpis?.peak?.revenue ?? 0} in revenue</p>
        </Card>
        <Card>
          <p className="text-xs text-muted-foreground">Best Lot</p>
          <p className="mt-1 text-lg font-bold">{kpis?.bestLot?.name ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{kpis?.bestLot?.value ?? 0}% occupancy</p>
        </Card>
        <Card>
          <p className="text-xs text-muted-foreground">Total Bookings</p>
          <p className="mt-1 text-lg font-bold">{data?.totalBookings ?? 0}</p>
          <p className="text-xs text-muted-foreground">Across all lots</p>
        </Card>
      </div>
    </AdminLayout>
  );
}
