"use client";
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';

import { usePathname } from 'next/navigation';

export function ClientProviders({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          {!isAdminPath && <Navbar />}
          {!isAdminPath && <Breadcrumbs />}
          <main className={!isAdminPath ? "min-h-screen pt-[108px]" : ""}>
            {children}
          </main>
          {!isAdminPath && <Footer />}
          {!isAdminPath && <CartDrawer />}
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
