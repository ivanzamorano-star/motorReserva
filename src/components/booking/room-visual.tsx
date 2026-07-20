import Image from "next/image";
import { BedDouble } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomVisual({
  gradient,
  imageUrl,
  alt,
  className,
  priority,
}: {
  gradient: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-secondary", className)}>
        <Image
          src={imageUrl}
          alt={alt ?? "Habitación"}
          fill
          sizes="(min-width: 640px) 400px, 100vw"
          className="object-cover"
          priority={priority}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-t", gradient)} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 bg-noise opacity-40" />
      <BedDouble className="h-10 w-10 text-white/70" strokeWidth={1.3} />
    </div>
  );
}
