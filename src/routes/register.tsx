import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { User, Mail, Phone, Lock } from "lucide-react";
import { AuthShell } from "../components/AuthShell";
import { Button, Input } from "../components/ui-kit";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account · ParkPilot" }, { name: "description", content: "Sign up to book parking in seconds." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start reserving parking in under a minute."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" icon={<User className="h-4 w-4" />} placeholder="Ava" />
        <Input label="Last name" placeholder="Rodriguez" />
      </div>
      <Input label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" />
      <Input label="Phone" icon={<Phone className="h-4 w-4" />} placeholder="+1 415 555 0134" />
      <Input label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="Create a password" />
      <Button className="w-full" onClick={() => nav({ to: "/otp" })}>Create Account</Button>
      <p className="text-center text-xs text-muted-foreground">By continuing you agree to our Terms & Privacy Policy.</p>
    </AuthShell>
  );
}
