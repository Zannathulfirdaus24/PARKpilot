import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Moon, Sun } from "lucide-react";
import { AdminLayout } from "../components/layouts/AdminLayout";
import { Button, Card, Input } from "../components/ui-kit";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings · Admin · ParkPilot" }, { name: "description", content: "Admin profile, theme and account settings." }] }),
  component: AdminSettings,
});

function AdminSettings() {
  const { theme, toggleTheme } = useApp();
  const nav = useNavigate();

  return (
    <AdminLayout title="Settings">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Admin Profile</h2>
          <div className="mt-4 flex items-center gap-4">
            <img src="https://i.pravatar.cc/120?img=12" className="h-16 w-16 rounded-full ring-2 ring-primary/20" alt="" />
            <div>
              <p className="font-semibold">Alex Morgan</p>
              <p className="text-xs text-muted-foreground">Super Administrator</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <Input label="Full name" defaultValue="Alex Morgan" />
            <Input label="Email" defaultValue="admin@parkpilot.com" />
            <Input label="Phone" defaultValue="+1 415 555 0100" />
            <Button>Save Changes</Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Change Password</h2>
          <div className="mt-4 space-y-3">
            <Input label="Current password" type="password" />
            <Input label="New password" type="password" />
            <Input label="Confirm new password" type="password" />
            <Button variant="outline">Update Password</Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold">Appearance</h2>
          <div className="mt-4 flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Currently: {theme}</p>
            </div>
            <Button variant="outline" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Toggle
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-destructive">Danger Zone</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign out of the admin console. You'll need to re-authenticate.</p>
          <Button variant="destructive" className="mt-4" onClick={() => nav({ to: "/admin/login" })}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </Card>
      </div>
    </AdminLayout>
  );
}
