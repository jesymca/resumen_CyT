import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Llenador de PDF - Reportes Mincyt",
  description: "Sistema para llenar formularios PDF del Ministerio del Poder Popular para Ciencia, Tecnología e Innovación",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
