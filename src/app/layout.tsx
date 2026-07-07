import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nidum | Inversion inmobiliaria fraccionada",
  description:
    "Plataforma para invertir en unidades inmobiliarias, administrar rentas y conectar propiedades con inquilinos finales."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
