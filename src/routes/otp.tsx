import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button } from "../components/ui-kit";

export const Route = createFileRoute("/otp")({
  head: () => ({ meta: [{ title: "Verify OTP · ParkPilot" }, { name: "description", content: "Confirm your phone number to secure your account." }] }),
  component: OtpPage,
});

function OtpPage() {
  const nav = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [secs, setSecs] = useState(28);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  const set = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <AuthShell title="Verify your number" subtitle="We sent a 6-digit code to +1 415 555 0134.">
      <div className="flex justify-between gap-2">
        {otp.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            value={d}
            onChange={(e) => set(i, e.target.value)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-full max-w-[52px] rounded-xl border border-border bg-card text-center text-xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
          />
        ))}
      </div>
      <Button className="w-full" onClick={() => nav({ to: "/dashboard" })}>Verify & Continue</Button>
      <p className="text-center text-sm text-muted-foreground">
        {secs > 0 ? `Resend code in 0:${String(secs).padStart(2, "0")}` : <button onClick={() => setSecs(28)} className="font-medium text-primary">Resend code</button>}
      </p>
    </AuthShell>
  );
}
