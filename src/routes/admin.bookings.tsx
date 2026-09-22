import { createFileRoute } from "@tanstack/react-router";
import { Check, X, RefreshCw, Search } from "lucide-react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Button, Card, Input } from "../components/ui-kit";
import { bookings } from "../data/dummy";

export const Route = createFileRoute("/admin/bookings")({
  head: () => ({ meta: [{ title: "Bookings · Admin · ParkPilot" }, { name: "description", content: "Approve, cancel and refund bookings." }] }),
  component: AdminBookings,
});

function AdminBookings() {
  return (
    <AdminLayout title="Bookings">
      <div className="mb-4"><Input icon={<Search className="h-4 w-4" />} placeholder="Search by booking ID, user, or lot..." /></div>
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
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...bookings, ...bookings].map((b, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{b.id}</td>
                  <td className="px-4 py-3">{b.lot}</td>
                  <td className="px-4 py-3">{b.slot}</td>
                  <td className="px-4 py-3 text-muted-foreground">{b.date} · {b.time}</td>
                  <td className="px-4 py-3 font-semibold">${b.amount}</td>
                  <td className="px-4 py-3"><Badge variant={b.status === "Completed" ? "success" : "danger"}>{b.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" className="text-[color:var(--color-success)]"><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="text-destructive"><X className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost"><RefreshCw className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination />
      </Card>
    </AdminLayout>
  );
}

function Pagination() {
  return (
    <div className="flex items-center justify-between border-t border-border p-3 text-sm">
      <p className="text-muted-foreground">Showing 1–8 of 48</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((p) => (
          <button key={p} className={`h-8 w-8 rounded-lg text-xs font-medium ${p === 1 ? "gradient-primary text-primary-foreground" : "hover:bg-accent"}`}>{p}</button>
        ))}
      </div>
    </div>
  );
}
