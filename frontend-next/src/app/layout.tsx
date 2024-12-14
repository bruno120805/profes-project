import MainNavigation from "@/components/MainNavigation";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Califica tu profesor",
  description: "Califica tu profesor y encuentra los apuntes de sus materias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <MainNavigation />
        {children}
      </body>
    </html>
  );
}
