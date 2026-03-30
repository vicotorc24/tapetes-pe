import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { 
  LucideShoppingCart, 
  LucideMenu, 
  LucideX, 
  LucideUser, 
  LucideGlobe, 
  ArrowRight as LucideArrowRight 
} from 'lucide-react';

export function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const { cart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Bloquear scroll cuando el menú móvil está abierto
  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const cartCount = cart?.length || 0;

  const navigateToCatalog = (category = 'Todos') => {
    if (pathname !== '/') {
      router.push(`/#catalog-section`);
    } else {
      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100]">
      {/* Menú Mobile Full Screen Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[120] lg:hidden flex flex-col overflow-y-auto pt-0">
          <div className="h-20 flex items-center justify-between px-6 border-b border-stone-100 bg-white sticky top-0 z-10">
             <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-4">
                <div className="w-8 h-8 border border-stone-200 rounded-full flex items-center justify-center font-serif text-lg">T</div>
                <span className="text-xl font-serif font-black tracking-tighter">Tapetes.pe</span>
             </Link>
             <button onClick={() => setMenuOpen(false)} className="text-stone-900 p-2 hover:bg-stone-50 rounded-full transition-all">
                <LucideX size={32} />
             </button>
          </div>

          <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-6">
              {[
                { label: t('nav.catalog'), action: () => navigateToCatalog() },
                { label: t('nav.story'), href: '/nosotras' },
                { label: t('nav.heritage'), href: '/historia' },
                { label: t('nav.join'), href: '/unete', isSpecial: true }
              ].map((item, idx) => (
                item.href ? (
                  <Link key={idx} href={item.href} onClick={() => setMenuOpen(false)} className="py-4 border-b border-stone-100 flex justify-between items-center group">
                    <span className={`text-3xl font-serif font-bold ${item.isSpecial ? 'text-terracotta-600 italic underline decoration-terracotta-200' : 'text-stone-900'}`}>{item.label}</span>
                    <LucideArrowRight size={24} className={item.isSpecial ? 'text-terracotta-300' : 'text-stone-300'} />
                  </Link>
                ) : (
                  <button key={idx} onClick={item.action} className="text-left py-4 border-b border-stone-100 flex justify-between items-center group">
                    <span className="text-3xl font-serif font-bold text-stone-900">{item.label}</span>
                    <LucideArrowRight size={24} className="text-stone-300" />
                  </button>
                )
              ))}
            </div>

            <div className="space-y-4 pt-12 pb-8">
               <Link href={user ? "/admin" : "/login"} onClick={() => setMenuOpen(false)} className="w-full bg-stone-900 text-white py-6 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] font-bold shadow-2xl shadow-stone-900/20">
                  {user ? <><LucideUser size={18}/> {t('nav.dashboard')}</> : t('nav.admin')}
               </Link>
               
               <button onClick={() => { setLanguage(language === 'es' ? 'en' : 'es'); }} className="w-full border border-stone-200 py-6 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] font-bold text-stone-500 active:bg-stone-50 transition-colors">
                  <LucideGlobe size={18} /> Idioma: {language.toUpperCase()}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Bar Wrapper */}
      <div className="relative z-50">
        <Link 
          href="/unete"
          className="block w-full bg-stone-900 overflow-hidden relative group transition-all"
        >
          <div className="absolute inset-0 bg-stone-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <p className="relative z-10 text-white text-[10px] font-bold text-center py-2 tracking-[0.2em] uppercase transition-colors">
            ✨ ¿Tejes un legado? Únete a nuestra comunidad de artesanas • <span className="underline decoration-white/50">Postula aquí</span> ✨
          </p>
        </Link>
        <nav className="bg-white/95 backdrop-blur-md border-b border-stone-100 h-20 flex items-center transition-all duration-500 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center text-stone-900">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="relative">
                <div className="w-10 h-10 border border-stone-200 rounded-full flex items-center justify-center font-serif text-xl group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">T</div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-terracotta-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-black tracking-tighter leading-none">Tapetes<span className="text-terracotta-600">.</span>pe</span>
                <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-bold font-sans mt-0.5 group-hover:text-terracotta-600 transition-colors">Artesanía de Contumazá</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center space-x-8 text-[13px] font-bold tracking-wide uppercase">
              <button onClick={() => navigateToCatalog()} className="hover:text-terracotta-600 transition-colors relative group py-2">
                {t('nav.catalog')}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta-600 transition-all group-hover:w-full"></span>
              </button>
              <Link href="/nosotras" className={`hover:text-terracotta-600 transition-colors relative group py-2 ${pathname === '/nosotras' ? 'text-terracotta-600' : ''}`}>
                {t('nav.story')}
              </Link>
              <Link href="/historia" className={`hover:text-terracotta-600 transition-colors relative group py-2 ${pathname === '/historia' ? 'text-terracotta-600' : ''}`}>
                {t('nav.heritage')}
              </Link>
              <Link href="/unete" className="hover:text-terracotta-600 transition-colors">{t('nav.join')}</Link>
            </div>
            <div className="flex items-center gap-6">
              <button className="relative p-2 text-stone-800 hover:text-terracotta-600 transition-all group" onClick={() => setIsCartOpen(true)}>
                <LucideShoppingCart className="group-hover:scale-110 transition-transform" size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-stone-900 p-2">
                {menuOpen ? <LucideX size={28} /> : <LucideMenu size={28} />}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
