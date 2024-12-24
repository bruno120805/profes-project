import MainNavigation from "@/components/MainNavigation";
import type { Metadata } from "next";
import "./globals.css";
import SessionAuthProvider from "@/context/SessionAuthProvider";

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
        <SessionAuthProvider>
          <MainNavigation />
          {children}
        </SessionAuthProvider>        
      </body>
    </html>
  );
}
