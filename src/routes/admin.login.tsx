import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button, Input } from "../components/ui-kit";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login · ParkPilot" }, { name: "description", content: "Sign in to the ParkPilot admin console." }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell
      title="Admin Console"
      subtitle="Restricted access — authorized personnel only."
      footer={<Link to="/login" className="text-primary font-medium">Back to user login</Link>}
    >
      <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm text-primary">
        <ShieldCheck className="h-4 w-4" /> Two-factor authentication is required after login.
      </div>
      <Input label="Admin Email" icon={<Mail className="h-4 w-4" />} defaultValue="admin@parkpilot.com" />
      <Input label="Password" icon={<Lock className="h-4 w-4" />} type="password" defaultValue="admin" />
      <Button className="w-full" loading={loading} onClick={() => { setLoading(true); setTimeout(() => nav({ to: "/admin" }), 700); }}>Sign In to Console</Button>
    </AuthShell>
  );
}
