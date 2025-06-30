import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { CarritoProvider } from "@/contexts/carrito-context";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import { esES } from "@clerk/localizations";

const font = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Pastenería - Sistema de Gestión",
  description:
    "Sistema de gestión para panadería con control de ventas, inventario y empleados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={`${font.className} antialiased`}>
          <CarritoProvider>{children}</CarritoProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
