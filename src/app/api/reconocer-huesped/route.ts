import { NextRequest, NextResponse } from "next/server";
import { HUESPEDES } from "@/data/mock-data";
import { NIVEL_DESCUENTO, NIVEL_LABEL } from "@/lib/pricing";

// Reconocimiento server-side del huésped por correo (no expone la base de clientes al cliente).
export async function GET(req: NextRequest) {
  const email = (req.nextUrl.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!email) return NextResponse.json({ reconocido: false });

  const huesped = HUESPEDES.find((h) => h.email.toLowerCase() === email);
  if (!huesped || !huesped.nivel) {
    return NextResponse.json({ reconocido: false });
  }

  const descuentoPct = NIVEL_DESCUENTO[huesped.nivel];
  return NextResponse.json({
    reconocido: true,
    nombre: huesped.nombre.split(" ")[0],
    nivel: huesped.nivel,
    nivelLabel: NIVEL_LABEL[huesped.nivel],
    descuentoPct,
  });
}
