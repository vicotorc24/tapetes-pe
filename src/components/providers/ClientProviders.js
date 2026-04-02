"use client";
import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CartDrawer } from '@/components/ecommerce/CartDrawer';

import { usePathname, useRouter } from 'next/navigation';
import { AnalyticsEvents } from '@/lib/analytics';
import { InfoModal } from '@/components/ui/InfoModal';

export function ClientProviders({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdminPath = pathname.startsWith('/admin');
  
  // Estado para modales de ayuda del footer
  const [helpModal, setHelpModal] = React.useState({ isOpen: false, type: '' });

  const handleFooterNav = (path, eventName) => {
    AnalyticsEvents.trackEvent('footer_click', { link_name: eventName || path });
    router.push(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenHelp = (type) => {
    AnalyticsEvents.trackEvent('footer_help_click', { type });
    setHelpModal({ isOpen: true, type });
  };

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          {!isAdminPath && <Navbar />}
          {!isAdminPath && <Breadcrumbs />}
          <main className={!isAdminPath ? "min-h-screen pt-[108px]" : ""}>
            {children}
          </main>
          {!isAdminPath && (
            <Footer 
              onAbout={() => handleFooterNav('/nosotras', 'About')}
              onHistory={() => handleFooterNav('/historia', 'Heritage')}
              onImpact={() => handleFooterNav('/impacto', 'Social Impact')}
              onCategory={(cat) => handleFooterNav(`/?category=${cat}`, 'Catalog')}
              onOpenInfo={handleOpenHelp}
            />
          )}
          {!isAdminPath && <CartDrawer />}
          
          {helpModal.isOpen && (
            <InfoModal 
              type={helpModal.type} 
              onClose={() => setHelpModal({ ...helpModal, isOpen: false })} 
            />
          )}
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
