import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Button, Card, Modal, Input } from "../components/ui-kit";
import { api, CURRENCY, type ParkingLot } from "../lib/api";

export const Route = createFileRoute("/admin/parking")({
  head: () => ({ meta: [{ title: "Parking Lots · Admin · ParkPilot" }, { name: "description", content: "Manage parking lot inventory." }] }),
  component: ManageParking,
});

const statusLabel: Record<ParkingLot["status"], string> = {
  OPEN: "Open", FILLING_FAST: "Filling Fast", FULL: "Full", CLOSED: "Closed",
};

function ManageParking() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", pricePerHour: "", totalSlots: "", hours: "24/7" });
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();

  const { data: lots = [], isLoading } = useQuery({ queryKey: ["lots"], queryFn: () => api.listLots() });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this parking lot?")) return;
    await api.deleteLot(id);
    qc.invalidateQueries({ queryKey: ["lots"] });
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      await api.createLot({
        name: form.name,
        address: form.address,
        pricePerHour: Number(form.pricePerHour) || 0,
        totalSlots: Number(form.totalSlots) || 0,
        hours: form.hours,
      });
      qc.invalidateQueries({ queryKey: ["lots"] });
      setOpen(false);
      setForm({ name: "", address: "", pricePerHour: "", totalSlots: "", hours: "24/7" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Parking Lots">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{lots.length} lots active</p>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Parking</Button>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {lots.map((p) => (
          <Card key={p.id} className="!p-0 overflow-hidden">
            <img src={p.imageUrl} className="h-40 w-full object-cover" alt="" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.address}</p>
                </div>
                <Badge variant={p.status === "FULL" ? "danger" : p.status === "FILLING_FAST" ? "warning" : "success"}>{statusLabel[p.status]}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{p.rating}</span>
                <span>{CURRENCY}{p.pricePerHour}/hr</span>
                <span>{p.availableSlots}/{p.totalSlots} free</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Parking Lot">
        <div className="space-y-3">
          <Input label="Lot name" placeholder="e.g. Anna Nagar Parking" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Address" placeholder="Full street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price per hour (₹)" placeholder="40" value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} />
            <Input label="Total slots" placeholder="80" value={form.totalSlots} onChange={(e) => setForm({ ...form, totalSlots: e.target.value })} />
          </div>
          <Input label="Working hours" placeholder="24/7 or 06:00 – 23:00" value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
          <Button className="w-full" loading={saving} onClick={handleCreate}>Create Parking Lot</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
