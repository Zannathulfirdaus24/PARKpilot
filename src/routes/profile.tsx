import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CreditCard, LogOut, Mail, Phone, Car, Camera, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { UserLayout } from "../components/layouts/UserLayout";
import { Avatar, Button, Card } from "../components/ui-kit";
import { useApp } from "../context/AppContext";
import { api, CURRENCY } from "../lib/api";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · ParkPilot" }, { name: "description", content: "Manage your ParkPilot profile and preferences." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setAvatar, removeAvatar, logout } = useApp();
  const nav = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Live stats for the profile card.
  const { data: summary } = useQuery({ queryKey: ["dashboard-summary"], queryFn: api.dashboardSummary });
  const { data: bookings } = useQuery({ queryKey: ["my-bookings"], queryFn: api.myBookings });

  if (!user) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { setError("Image must be under 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      setSaving(true);
      try {
        await setAvatar(reader.result as string);
      } catch (err: any) {
        setError(err?.message ?? "Couldn't save photo");
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleRemove = async () => {
    setError(null);
    setSaving(true);
    try {
      await removeAvatar();
    } catch (err: any) {
      setError(err?.message ?? "Couldn't remove photo");
    } finally {
      setSaving(false);
    }
  };

  const bookingCount = bookings?.length ?? 0;
  const spent = summary?.totalSpending ?? 0;

  return (
    <UserLayout title="Profile">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card className="text-center">
          <div className="relative mx-auto w-24">
            <Avatar src={user.avatar || undefined} name={user.name} size={96} className="mx-auto" />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full gradient-primary text-primary-foreground shadow-lg ring-2 ring-background"
              aria-label="Add photo"
              title="Add / change photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">Member</p>

          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" loading={saving} onClick={() => fileRef.current?.click()}>
              <Camera className="h-4 w-4" /> {user.avatar ? "Change photo" : "Add photo"}
            </Button>
            {user.avatar && (
              <Button variant="outline" size="sm" onClick={handleRemove} className="text-destructive">
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-border pt-5 text-center">
            <div><p className="text-xl font-bold">{bookingCount}</p><p className="text-xs text-muted-foreground">Bookings</p></div>
            <div><p className="text-xl font-bold">{CURRENCY}{spent}</p><p className="text-xs text-muted-foreground">Spent</p></div>
            <div><p className="text-xl font-bold">{summary?.avgRatingGiven ?? "—"}</p><p className="text-xs text-muted-foreground">Rating</p></div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold">Contact Information</h3>
            <div className="mt-4 space-y-3">
              <Row icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
              <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone || "—"} />
              <Row icon={<Car className="h-4 w-4" />} label="Vehicle Number" value={user.vehicle || "—"} />
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold">Saved Payment Methods</h3>
            <div className="mt-4 space-y-2">
              {[
                { last4: "4242", brand: "Visa", exp: "08/28" },
                { last4: "1881", brand: "Mastercard", exp: "12/27" },
              ].map((c) => (
                <div key={c.last4} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-14 place-items-center rounded-lg gradient-primary text-xs font-bold text-primary-foreground">{c.brand}</div>
                    <div>
                      <p className="text-sm font-medium">•••• •••• •••• {c.last4}</p>
                      <p className="text-xs text-muted-foreground">Exp {c.exp}</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-muted-foreground hover:text-foreground">Remove</button>
                </div>
              ))}
              <Button variant="outline" className="w-full"><CreditCard className="h-4 w-4" /> Add Payment Method</Button>
            </div>
          </Card>

          <Button variant="outline" onClick={() => { logout(); nav({ to: "/login" }); }} className="w-full text-destructive">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </UserLayout>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-secondary/60 p-3">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-card text-primary">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
