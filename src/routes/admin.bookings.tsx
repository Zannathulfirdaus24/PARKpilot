import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Card, Input } from "../components/ui-kit";
import { api, CURRENCY, type BookingDto } from "../lib/api";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "Bookings · Admin · ParkPilot" }, { name: "description", content: "Approve, cancel and refund bookings." }] }),
  component: AdminBookings,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
}
const badgeVariant = (s: BookingDto["status"]) =>
  s === "COMPLETED" ? "success" : s === "CANCELLED" ? "danger" : s === "ACTIVE" ? "info" : "warning";

function AdminBookings() {
  const [q, setQ] = useState("");
  const { data: bookings = [], isLoading } = useQuery({ queryKey: ["admin-bookings"], queryFn: api.adminBookings });

  const list = useMemo(
    () => bookings.filter((b) => (b.lotName + b.reference).toLowerCase().includes(q.toLowerCase())),
    [bookings, q],
  );

  return (
    <AdminLayout title="Bookings">
      <div className="mb-4"><Input icon={<Search className="h-4 w-4" />} placeholder="Search by booking ID or lot..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Booking</th>
                <th className="px-4 py-3 text-left">Parking Lot</th>
                <th className="px-4 py-3 text-left">Slot</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => (
                <tr key={b.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{b.reference}</td>
                  <td className="px-4 py-3">{b.lotName}</td>
                  <td className="px-4 py-3">{b.slotCode}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(b.startTime)} · {fmtTime(b.startTime)} – {fmtTime(b.endTime)}</td>
                  <td className="px-4 py-3 font-semibold">{CURRENCY}{b.amount}</td>
                  <td className="px-4 py-3"><Badge variant={badgeVariant(b.status)}>{b.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isLoading && <p className="p-4 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && list.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No bookings found.</p>}
        <div className="border-t border-border p-3 text-sm text-muted-foreground">Showing {list.length} bookings</div>
      </Card>
    </AdminLayout>
  );
}
