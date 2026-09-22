import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button, Input } from "../components/ui-kit";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log In · ParkPilot" }, { name: "description", content: "Sign in to your ParkPilot account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue booking parking."
      footer={<>Don't have an account? <Link to="/register" className="font-semibold text-primary">Create one</Link></>}
    >
      <Input label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" defaultValue="ava@example.com" />
      <Input label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="••••••••" defaultValue="password" />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="h-4 w-4 rounded" /> Remember me</label>
        <Link to="/forgot" className="font-medium text-primary">Forgot password?</Link>
      </div>
      <Button
        className="w-full"
        loading={loading}
        onClick={() => {
          setLoading(true);
          setTimeout(() => nav({ to: "/dashboard" }), 700);
        }}
      >
        Sign In
      </Button>
      <div className="relative py-2 text-center text-xs text-muted-foreground">
        <span className="relative z-10 bg-background px-2">or continue with</span>
        <span className="absolute inset-x-0 top-1/2 -z-0 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline">Google</Button>
        <Button variant="outline">Apple</Button>
      </div>
    </AuthShell>
  );
}
