import { createFileRoute } from "@tanstack/react-router";
import { Search, Ban, Eye, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Avatar, Badge, Button, Card, Input } from "../components/ui-kit";
import { api } from "../lib/api";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users · Admin · ParkPilot" }, { name: "description", content: "Manage ParkPilot users." }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [q, setQ] = useState("");
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({ queryKey: ["admin-users"], queryFn: api.adminUsers });

  const list = useMemo(
    () => users.filter((u) => (u.name + u.email + (u.phone ?? "")).toLowerCase().includes(q.toLowerCase())),
    [users, q],
  );

  const toggleStatus = async (id: string, current: "ACTIVE" | "SUSPENDED") => {
    await api.adminSetUserStatus(id, current === "ACTIVE" ? "SUSPENDED" : "ACTIVE");
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };

  return (
    <AdminLayout title="Users">
      <div className="mb-4"><Input icon={<Search className="h-4 w-4" />} placeholder="Search users by name, email or phone..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((u) => (
          <Card key={u.id}>
            <div className="flex items-center gap-3">
              <Avatar src={u.avatarUrl || undefined} name={u.name} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{u.name}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <Badge variant={u.status === "ACTIVE" ? "success" : "danger"}>{u.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
              <div><p className="font-bold">{u.bookings}</p><p className="text-muted-foreground">Bookings</p></div>
              <div><p className="font-bold">{u.phone ? u.phone.slice(-4) : "—"}</p><p className="text-muted-foreground">Phone</p></div>
              <div><p className="font-bold">{new Date(u.joined).toLocaleDateString(undefined, { month: "short", year: "2-digit" })}</p><p className="text-muted-foreground">Joined</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1"><Eye className="h-3.5 w-3.5" /> History</Button>
              {u.status === "ACTIVE" ? (
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => toggleStatus(u.id, u.status)}><Ban className="h-3.5 w-3.5" /> Suspend</Button>
              ) : (
                <Button size="sm" variant="outline" className="text-[color:var(--color-success)]" onClick={() => toggleStatus(u.id, u.status)}><CheckCircle className="h-3.5 w-3.5" /> Activate</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      {!isLoading && list.length === 0 && <p className="py-16 text-center text-muted-foreground">No users found.</p>}
    </AdminLayout>
  );
}
