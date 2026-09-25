import { createFileRoute } from "@tanstack/react-router";
import { Users, CalendarCheck, Car, IndianRupee, MapPin, Activity } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Card, StatCard } from "../components/ui-kit";
import { api, CURRENCY } from "../lib/api";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard · ParkPilot" }, { name: "description", content: "Operational overview for ParkPilot administrators." }] }),
  component: AdminDashboard,
});

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#2563eb", "#bfdbfe"];

function AdminDashboard() {
  const { data } = useQuery({ queryKey: ["admin-dashboard"], queryFn: api.adminDashboard });

  const revenueSeries = data?.revenueSeries ?? [];
  const occupancySeries = data?.occupancyByLot ?? [];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Users" value={String(data?.totalUsers ?? 0)} icon={<Users className="h-5 w-5" />} tone="info" />
        <StatCard label="Total Bookings" value={String(data?.totalBookings ?? 0)} icon={<CalendarCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Active Reservations" value={String(data?.activeReservations ?? 0)} icon={<Activity className="h-5 w-5" />} tone="warning" />
        <StatCard label="Revenue" value={`${CURRENCY}${data?.revenue ?? 0}`} icon={<IndianRupee className="h-5 w-5" />} tone="success" />
        <StatCard label="Parking Lots" value={String(data?.parkingLots ?? 0)} icon={<MapPin className="h-5 w-5" />} tone="info" />
        <StatCard label="Occupancy Rate" value={`${data?.occupancyRate ?? 0}%`} icon={<Car className="h-5 w-5" />} tone="warning" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Revenue this week</h2>
            <span className="text-xs text-muted-foreground">By weekday</span>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -20, right: 10, top: 10 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Occupancy by Lot</h2>
          <div className="mt-4" style={{ height: Math.max(256, occupancySeries.length * 34) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancySeries} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} unit="%" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis type="category" dataKey="name" width={150} stroke="var(--color-muted-foreground)" fontSize={11} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, "Occupancy"]} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {occupancySeries.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="font-semibold">Bookings per day</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueSeries} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </AdminLayout>
  );
}
