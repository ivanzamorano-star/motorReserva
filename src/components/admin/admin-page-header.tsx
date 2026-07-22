import * as React from "react";

// Encabezado unificado del panel: overline dorado + título Playfair Display + subtítulo.
// Fuente única para que todas las vistas del admin se vean idénticas y premium.
export function AdminPageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-5">
      <span className="eyebrow text-[0.62rem]">{eyebrow}</span>
      <h1 className="mt-2.5 font-serif text-3xl font-light tracking-[-0.01em]">{title}</h1>
      {children ? <p className="text-sm text-muted-foreground mt-1.5">{children}</p> : null}
    </div>
  );
}
