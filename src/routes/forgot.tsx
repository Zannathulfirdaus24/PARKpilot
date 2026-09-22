import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button, Input } from "../components/ui-kit";

export const Route = createFileRoute("/forgot")({
  head: () => ({ meta: [{ title: "Reset Password · ParkPilot" }, { name: "description", content: "Reset your ParkPilot password by email." }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link."
      footer={<><Link to="/login" className="font-semibold text-primary">Back to sign in</Link></>}
    >
      {!sent ? (
        <>
          <Input label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" />
          <Button className="w-full" onClick={() => setSent(true)}>Send Reset Link</Button>
        </>
      ) : (
        <div className="rounded-xl bg-primary/10 p-5 text-sm text-primary">Check your inbox — we sent a reset link to your email.</div>
      )}
    </AuthShell>
  );
}
