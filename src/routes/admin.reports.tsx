import { createFileRoute } from "@tanstack/react-router";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Button, Card } from "../components/ui-kit";
import { revenueSeries } from "../data/dummy";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Reports · Admin · ParkPilot" }, { name: "description", content: "Generate daily, weekly and monthly reports." }] }),
  component: AdminReports,
});

function AdminReports() {
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
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
        {[
          { label: "Peak Day", value: "Saturday", detail: "$5,100 in revenue" },
          { label: "Best Lot", value: "Downtown Central", detail: "78% occupancy" },
          { label: "Avg. Session", value: "2h 14m", detail: "Across all lots" },
        ].map((k) => (
          <Card key={k.label}>
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-lg font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.detail}</p>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
