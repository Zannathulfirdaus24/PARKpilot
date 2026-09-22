import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageSquare, Bell, Send } from "lucide-react";
import { useState } from "react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Button, Card, Input } from "../components/ui-kit";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications · Admin · ParkPilot" }, { name: "description", content: "Send announcements to users via email or SMS." }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [ch, setCh] = useState<"push" | "email" | "sms">("push");
  return (
    <AdminLayout title="Notifications">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="font-semibold">Compose Notification</h2>
          <div className="mt-4 flex gap-2">
            {[
              { id: "push", label: "Push", icon: Bell },
              { id: "email", label: "Email", icon: Mail },
              { id: "sms", label: "SMS", icon: MessageSquare },
            ].map((c) => (
              <button key={c.id} onClick={() => setCh(c.id as any)} className={`flex flex-1 items-center justify-center gap-2 rounded-xl border p-3 text-sm ${ch === c.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"}`}>
                <c.icon className="h-4 w-4" /> {c.label}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <Input label="Audience" placeholder="All users, or filter…" defaultValue="All Users (12,458)" />
            <Input label="Title" placeholder="Special offer today only!" />
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Message</span>
              <textarea rows={5} className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15" placeholder="Type your message..." />
            </label>
            <Button className="w-full"><Send className="h-4 w-4" /> Send Notification</Button>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Recent Broadcasts</h2>
          <div className="mt-4 space-y-3">
            {[
              { t: "20% off weekend parking", c: "Push", when: "2h ago", reach: "12,204" },
              { t: "System maintenance notice", c: "Email", when: "Yesterday", reach: "12,458" },
              { t: "New lot: Bay Bridge Garage", c: "SMS", when: "3d ago", reach: "8,930" },
            ].map((n) => (
              <div key={n.t} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{n.t}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.c} · {n.when} · {n.reach} recipients</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
