"use client";
import React from 'react';
import { LucideStar, LucideCheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useTranslation } from '@/context/LanguageContext';
import { Navbar } from '@/components/layout/Navbar';
import { CONFIG } from '@/lib/config';

export function AboutView() {
  const { addToCart } = useCart();
  const { t } = useTranslation();

  const handleContact = () => {
    window.open(`https://wa.me/${CONFIG.CONTACT.WHATSAPP.replace(/\s+/g, '')}?text=Hola,%20quisiera%20saber%20m%C3%A1s%20sobre%20su%20historia.`);
  };

  return (
    <div className="animate-in fade-in pb-20 bg-white min-h-screen">
      <Navbar />
      
      <div className="bg-stone-900 text-white py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 animate-in slide-in-from-bottom-8 duration-1000">
          <span className="text-terracotta-400 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">{t('about.essence')}</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">{t('about.title')}</h1>
          <p className="text-stone-400 max-w-xl mx-auto text-lg font-light">{t('about.subtitle')}</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-8 py-24 space-y-24">
        <div className="grid md:grid-cols-2 gap-20 items-center">
           <div className="animate-in slide-in-from-left-8 duration-1000">
             <div className="flex items-center gap-3 mb-6">
               <span className="h-[1.5px] w-12 bg-terracotta-500"></span>
               <span className="text-terracotta-600 font-bold tracking-widest text-xs uppercase">{t('about.legacy_tag')}</span>
             </div>
             <h2 className="text-4xl font-bold text-stone-900 mb-8 font-serif leading-tight" dangerouslySetInnerHTML={{ __html: t('about.legacy_title') }}></h2>
             <p className="text-lg text-stone-600 leading-relaxed mb-6 font-light">
               {t('about.p1')}
             </p>
             <p className="text-lg text-stone-600 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: t('about.p2') }} />
           </div>
           <div className="relative group">
             <div className="absolute -inset-4 bg-stone-100 rounded-[3rem] -rotate-3 transition-transform group-hover:rotate-0 duration-700"></div>
             <div className="relative aspect-[4/5] bg-stone-200 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white z-10 transition-transform group-hover:-translate-y-2 duration-700">
               <img src="/images/hero_authentic.png" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" alt="Artesanas de Contumazá"/>
             </div>
           </div>
        </div>
        
        <div className="bg-stone-50 p-12 md:p-20 rounded-[3rem] text-center border border-stone-100 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-32 h-32 bg-andeansky-100/30 rounded-full blur-3xl -ml-16 -mt-16"></div>
           
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center mx-auto mb-8 text-terracotta-600">
               <LucideStar size={32} />
             </div>
             <h3 className="text-3xl font-bold text-stone-900 mb-6 font-serif">{t('about.ethics.title')}</h3>
             <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-12 font-light">
               {t('about.ethics.desc')}
             </p>
             
             <div className="grid sm:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
                <div className="flex items-center gap-4 text-left p-6 bg-white rounded-2xl border border-stone-200/50">
                   <LucideCheckCircle className="text-green-600 shrink-0" size={24}/>
                   <span className="font-bold text-stone-800">{t('about.ethics.pay')}</span>
                </div>
                <div className="flex items-center gap-4 text-left p-6 bg-white rounded-2xl border border-stone-200/50">
                   <LucideCheckCircle className="text-green-600 shrink-0" size={24}/>
                   <span className="font-bold text-stone-800">{t('about.ethics.auth')}</span>
                </div>
             </div>

             <button 
                onClick={handleContact} 
                className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-terracotta-600 transition-all duration-300 shadow-xl transform hover:-translate-y-1"
             >
               {t('about.ethics.cta')}
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
