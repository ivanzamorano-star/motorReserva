"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function todayISO(offsetDays = 0) {
  const d = new Date("2026-07-17");
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [checkIn, setCheckIn] = React.useState(todayISO(1));
  const [checkOut, setCheckOut] = React.useState(todayISO(3));
  const [huespedes, setHuespedes] = React.useState(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ checkIn, checkOut, huespedes: String(huespedes) });
    router.push(`/habitaciones?${params.toString()}`);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      className={
        compact
          ? "flex flex-col sm:flex-row gap-3 items-stretch sm:items-end bg-card border border-border rounded-lg p-4 shadow-sm"
          : "flex flex-col sm:flex-row gap-3 items-stretch sm:items-end bg-card/98 backdrop-blur border border-border/80 rounded-lg p-6 shadow-2xl"
      }
    >
      <div className="flex-1 min-w-[130px]">
        <Label htmlFor="checkin" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2">
          <CalendarDays className="h-3.5 w-3.5" /> Check-in
        </Label>
        <input
          id="checkin"
          type="date"
          required
          value={checkIn}
          min={todayISO(0)}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex-1 min-w-[130px]">
        <Label htmlFor="checkout" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2">
          <CalendarDays className="h-3.5 w-3.5" /> Check-out
        </Label>
        <input
          id="checkout"
          type="date"
          required
          value={checkOut}
          min={checkIn}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="w-full sm:w-32">
        <Label htmlFor="huespedes" className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-2">
          <Users className="h-3.5 w-3.5" /> Huéspedes
        </Label>
        <input
          id="huespedes"
          type="number"
          min={1}
          max={6}
          value={huespedes}
          onChange={(e) => setHuespedes(Number(e.target.value))}
          className="w-full h-11 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Button type="submit" size="lg" variant="gold" className="gap-2 shrink-0">
        <Search className="h-4 w-4" /> Buscar disponibilidad
      </Button>
    </motion.form>
  );
}
