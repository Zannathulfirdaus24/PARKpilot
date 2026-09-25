import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Check, Download, Share2, Wallet } from "lucide-react";
import { UserLayout } from "../components/layouts/UserLayout";
import { Button, Card } from "../components/ui-kit";
import { useApp } from "../context/AppContext";

export const Route = createFileRoute("/success")({
  head: () => ({ meta: [{ title: "Booking Confirmed · ParkPilot" }, { name: "description", content: "Your parking is booked. Show this ticket at the gate." }] }),
  component: SuccessPage,
});

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
function fmtTime(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function SuccessPage() {
  const { draft } = useApp();
  const id = draft.reference ?? "BK-—";
  const timeRange = draft.startTime && draft.endTime
    ? `${fmtTime(draft.startTime)} – ${fmtTime(draft.endTime)}`
    : "—";

  return (
    <UserLayout>
      <div className="mx-auto max-w-lg">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full gradient-primary text-primary-foreground shadow-xl shadow-primary/40">
          <Check className="h-10 w-10" />
        </motion.div>
        <h1 className="mt-5 text-center text-2xl font-bold tracking-tight">Booking Confirmed!</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Show this ticket at the entry gate</p>

        <Card className="mt-6 overflow-hidden !p-0">
          <div className="grid place-items-center bg-white p-6">
            <QRCodeSVG value={`PARKPILOT:${id}`} size={180} bgColor="#ffffff" fgColor="#1e3a8a" level="H" />
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 -top-3 flex justify-between px-1">
              {Array.from({ length: 20 }).map((_, i) => (<span key={i} className="h-6 w-6 rounded-full bg-background" />))}
            </div>
          </div>
          <div className="space-y-3 p-6">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Booking ID</span><span className="font-semibold">{id}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Location</span><span className="font-semibold">{draft.lotName ?? "—"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Slot</span><span className="font-semibold">{draft.slot ?? "—"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="font-semibold">{fmtDate(draft.startTime)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Time</span><span className="font-semibold">{timeRange}</span></div>
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline"><Download className="h-4 w-4" />Download</Button>
          <Button variant="outline"><Wallet className="h-4 w-4" />Wallet</Button>
          <Button variant="outline"><Share2 className="h-4 w-4" />Share</Button>
        </div>
        <Link to="/dashboard"><Button className="mt-3 w-full">Back to Dashboard</Button></Link>
      </div>
    </UserLayout>
  );
}
