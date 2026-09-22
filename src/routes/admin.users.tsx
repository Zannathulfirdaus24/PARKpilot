import { createFileRoute } from "@tanstack/react-router";
import { Search, Ban, Eye } from "lucide-react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Badge, Button, Card, Input } from "../components/ui-kit";
import { users } from "../data/dummy";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users · Admin · ParkPilot" }, { name: "description", content: "Manage ParkPilot users." }] }),
  component: AdminUsers,
});

function AdminUsers() {
  return (
    <AdminLayout title="Users">
      <div className="mb-4"><Input icon={<Search className="h-4 w-4" />} placeholder="Search users by name, email or phone..." /></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {users.map((u, i) => (
          <Card key={u.id}>
            <div className="flex items-center gap-3">
              <img src={`https://i.pravatar.cc/80?img=${i + 20}`} className="h-12 w-12 rounded-full ring-2 ring-primary/20" alt="" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{u.name}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <Badge variant={u.status === "Active" ? "success" : "danger"}>{u.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
              <div><p className="font-bold">{u.bookings}</p><p className="text-muted-foreground">Bookings</p></div>
              <div><p className="font-bold">{u.phone.slice(-4)}</p><p className="text-muted-foreground">Phone</p></div>
              <div><p className="font-bold">{u.joined.slice(5)}</p><p className="text-muted-foreground">Joined</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1"><Eye className="h-3.5 w-3.5" /> History</Button>
              <Button size="sm" variant="outline" className="text-destructive"><Ban className="h-3.5 w-3.5" /> Suspend</Button>
            </div>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
