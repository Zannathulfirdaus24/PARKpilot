import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ImagePlus, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Button, Card, Modal, Input } from "../components/ui-kit";
import { parkingLots } from "../data/dummy";

export const Route = createFileRoute("/admin/parking")({
  head: () => ({ meta: [{ title: "Parking Lots · Admin · ParkPilot" }, { name: "description", content: "Manage parking lot inventory." }] }),
  component: ManageParking,
});

function ManageParking() {
  const [open, setOpen] = useState(false);
  return (
    <AdminLayout title="Parking Lots">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{parkingLots.length} lots active</p>
        <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Parking</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {parkingLots.map((p) => (
          <Card key={p.id} className="!p-0 overflow-hidden">
            <img src={p.image} className="h-40 w-full object-cover" alt="" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{p.address}</p>
                </div>
                <Badge variant={p.status === "Full" ? "danger" : "success"}>{p.status}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{p.rating}</span>
                <span>${p.price}/hr</span>
                <span>{p.available}/{p.total} free</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Parking Lot">
        <div className="space-y-3">
          <Input label="Lot name" placeholder="e.g. Downtown Central Parking" />
          <Input label="Address" placeholder="Full street address" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price per hour" placeholder="60" />
            <Input label="Total slots" placeholder="80" />
          </div>
          <Input label="Working hours" placeholder="24/7 or 06:00 – 23:00" />
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Amenities</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {["CCTV", "Covered", "EV Charging", "Security"].map((a) => (
                <label key={a} className="flex items-center gap-2 rounded-xl border border-border p-2.5">
                  <input type="checkbox" className="rounded" /> {a}
                </label>
              ))}
            </div>
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-sm text-muted-foreground hover:bg-accent">
            <ImagePlus className="h-4 w-4" /> Upload images
          </button>
          <Button className="w-full" onClick={() => setOpen(false)}>Create Parking Lot</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
