import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { LucideShoppingCart, LucideMenu, LucideX, LucideUser, LucideGlobe } from 'lucide-react';

export function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const { cart, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Banner Superior - Regresamos al Negro Sobrio */}
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
          
          {/* Logo Rediseñado - Serif & Premium */}
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

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center space-x-8 text-[13px] font-bold tracking-wide uppercase">
            <button onClick={() => navigateToCatalog()} className="hover:text-terracotta-600 transition-colors relative group py-2">
              {t('nav.catalog')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta-600 transition-all group-hover:w-full"></span>
            </button>
            <Link href="/nosotras" className={`hover:text-terracotta-600 transition-colors relative group py-2 ${pathname === '/nosotras' ? 'text-terracotta-600' : ''}`}>
              {t('nav.story')}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-terracotta-600 transition-all ${pathname === '/nosotras' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link href="/historia" className={`hover:text-terracotta-600 transition-colors relative group py-2 ${pathname === '/historia' ? 'text-terracotta-600' : ''}`}>
              {t('nav.heritage')}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-terracotta-600 transition-all ${pathname === '/historia' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            
            <span className="h-4 w-px bg-stone-200"></span>

            <Link href="/unete" className={`text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2 ${pathname === '/unete' ? 'text-stone-900' : ''}`}>
              {t('nav.join')}
              {pathname === '/unete' && <div className="w-1.5 h-1.5 bg-terracotta-500 rounded-full"></div>}
            </Link>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 border-r border-stone-200 pr-6 mr-2">
               {user ? (
                <Link href="/admin" className="flex items-center gap-2 text-[11px] font-bold bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-terracotta-600 transition-all shadow-lg shadow-stone-900/10">
                  <LucideUser size={14}/> {t('nav.dashboard')}
                </Link> 
              ) : (
                <Link href="/login" className="text-stone-400 hover:text-stone-900 flex items-center gap-2 transition-colors text-[11px] font-bold uppercase tracking-widest">
                   {t('nav.admin')}
                </Link>
              )}
              
              <button 
                onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} 
                className="w-8 h-8 flex items-center justify-center rounded-full border border-stone-200 text-[10px] font-bold hover:bg-stone-50 transition-all"
              >
                {language.toUpperCase()}
              </button>
            </div>

            <button className="relative p-2 text-stone-800 hover:text-terracotta-600 transition-all group" onClick={() => setIsCartOpen(true)}>
              <LucideShoppingCart className="group-hover:scale-110 transition-transform" size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-stone-900 p-2">
              {menuOpen ? <LucideX size={28} /> : <LucideMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Menú Mobile Rediseñado */}
        {menuOpen && (
          <div className="fixed inset-0 top-32 bg-white z-40 p-8 lg:hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-8 text-2xl font-serif font-bold text-stone-900">
              <button onClick={() => navigateToCatalog()} className="text-left py-2 border-b border-stone-100 flex justify-between items-center group">
                {t('nav.catalog')}
                <div className="w-2 h-2 bg-stone-200 rounded-full group-active:bg-terracotta-500"></div>
              </button>
              <Link href="/nosotras" onClick={() => setMenuOpen(false)} className="py-2 border-b border-stone-100 flex justify-between items-center group">
                {t('nav.story')}
                <div className="w-2 h-2 bg-stone-200 rounded-full group-active:bg-terracotta-500"></div>
              </Link>
              <Link href="/historia" onClick={() => setMenuOpen(false)} className="py-2 border-b border-stone-100 flex justify-between items-center group">
                {t('nav.heritage')}
                <div className="w-2 h-2 bg-stone-200 rounded-full group-active:bg-terracotta-500"></div>
              </Link>
              <Link href="/unete" onClick={() => setMenuOpen(false)} className="py-2 border-b border-stone-100 flex justify-between items-center group italic text-terracotta-600">
                {t('nav.join')}
                <div className="w-2 h-2 bg-terracotta-300 rounded-full"></div>
              </Link>

              <div className="mt-8 flex flex-col gap-4">
                 <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full bg-stone-900 text-white py-5 rounded-2xl text-center text-sm uppercase tracking-widest font-sans font-bold">
                    {t('nav.admin')}
                 </Link>
                 <button onClick={() => setLanguage(language === 'es' ? 'en' : 'es')} className="w-full border border-stone-200 py-5 rounded-2xl text-center text-sm uppercase tracking-widest font-sans font-bold">
                    Idioma: {language.toUpperCase()}
                 </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
