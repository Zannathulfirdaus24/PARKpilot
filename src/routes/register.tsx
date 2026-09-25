import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { User, Mail, Phone, Lock, Car } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "../components/AuthShell";
import { Button, Input } from "../components/ui-kit";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account · ParkPilot" }, { name: "description", content: "Sign up to book parking in seconds." }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const { loginUser } = useApp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    if (!firstName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in your name, email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        name: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        vehicleNo: vehicleNo.trim() || undefined,
      });
      loginUser(res.user, res.accessToken);
      nav({ to: "/dashboard" });
    } catch (e: any) {
      setError(e?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start reserving parking in under a minute."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary">Sign in</Link></>}
    >
      <div className="grid grid-cols-2 gap-3">
        <Input label="First name" icon={<User className="h-4 w-4" />} placeholder="Ava" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <Input label="Last name" placeholder="Rodriguez" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <Input label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Phone" icon={<Phone className="h-4 w-4" />} placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Input label="Vehicle number (car / bike)" icon={<Car className="h-4 w-4" />} placeholder="TN 09 AB 1234" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
      <Input label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button className="w-full" loading={loading} onClick={handleRegister}>Create Account</Button>
      <p className="text-center text-xs text-muted-foreground">By continuing you agree to our Terms & Privacy Policy.</p>
    </AuthShell>
  );
}
