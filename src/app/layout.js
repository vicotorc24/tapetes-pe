import React from "react";
import { Inter, Merriweather } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const merriweather = Merriweather({ 
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ["latin"],
  variable: '--font-merriweather'
});

export const metadata = {
  title: "Tapetes.pe - Arte de Contumazá",
  description: "Piezas únicas tejidas a mano por madres artesanas en Contumazá.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${merriweather.variable} font-sans bg-[#FFFBF7]`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
