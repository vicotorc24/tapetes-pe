import React from "react";
import { Inter, Merriweather } from "next/font/google";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { WebVitals } from "@/components/providers/WebVitals";
import { GoogleAnalytics } from '@next/third-parties/google';
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
  title: "Made In Contumazá - Arte de Contumazá",
  description: "Piezas únicas y productos de la tierra creados por artesanos y productores del norte peruano.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${merriweather.variable} font-sans bg-[#FFFBF7]`}>
        <ClientProviders>
          <WebVitals />
          {children}
        </ClientProviders>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
