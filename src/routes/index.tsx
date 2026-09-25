import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Car, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui-kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ParkPilot — Reserve Parking In Seconds" },
      { name: "description", content: "Find, reserve and pay for verified parking spots in real-time. Skip the search — book with ParkPilot." },
      { property: "og:title", content: "ParkPilot — Reserve Parking In Seconds" },
      { property: "og:description", content: "Find, reserve and pay for verified parking spots in real-time." },
    ],
  }),
  component: Splash,
});

function Splash() {
  return (
    <div className="relative min-h-screen overflow-hidden gradient-hero">
      <div className="absolute inset-0 -z-10 opacity-40">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <div className="mx-auto mb-8 grid h-24 w-24 place-items-center rounded-3xl gradient-primary text-primary-foreground shadow-2xl shadow-primary/40">
            <Car className="h-12 w-12" />
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl font-bold tracking-tight sm:text-6xl">
          Park<span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Pilot</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3 max-w-md text-lg text-muted-foreground">
          Reserve a verified parking spot in seconds. Real-time availability, transparent pricing, contactless entry.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link to="/login"><Button size="lg" className="min-w-[180px]">Get Started</Button></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-16 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: MapPin, title: "Live Map", desc: "See open spots nearby" },
            { icon: ShieldCheck, title: "Verified Lots", desc: "CCTV & security" },
            { icon: Car, title: "Skip the Queue", desc: "Reserved in advance" },
          ].map((f) => (
            <div key={f.title} className="card-elevated p-5 text-left">
              <f.icon className="mb-3 h-5 w-5 text-primary" />
              <p className="font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
