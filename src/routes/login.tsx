import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button, Input } from "../components/ui-kit";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log In · ParkPilot" }, { name: "description", content: "Sign in to your ParkPilot account." }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { loginUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("ava@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      loginUser(res.user, res.accessToken);
      // Admins go to the admin panel; regular users to the dashboard.
      nav({ to: res.user.role === "ADMIN" ? "/admin" : "/dashboard" });
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue booking parking."
      footer={<>Don't have an account? <Link to="/register" className="font-semibold text-primary">Create one</Link></>}
    >
      <Input label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="h-4 w-4 rounded" /> Remember me</label>
        <Link to="/forgot" className="font-medium text-primary">Forgot password?</Link>
      </div>
      <Button className="w-full" loading={loading} onClick={handleLogin}>
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
