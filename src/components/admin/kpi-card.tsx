import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  accent?: "default" | "gold" | "success";
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold/0 via-gold/70 to-gold/0" />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[0.68rem] font-medium text-muted-foreground uppercase tracking-[0.14em]">{label}</p>
            <p className="mt-2.5 font-serif text-3xl font-light tracking-tight text-primary">{value}</p>
            {trend && <p className="mt-1.5 text-xs text-success">{trend}</p>}
          </div>
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border shrink-0",
              accent === "gold" && "border-gold/40 bg-gold/10 text-gold",
              accent === "success" && "border-success/40 bg-success/10 text-success",
              accent === "default" && "border-gold/40 bg-gold/10 text-gold"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
