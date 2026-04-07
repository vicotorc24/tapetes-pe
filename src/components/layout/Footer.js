"use client";
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideInstagram, LucideFacebook, LucideTruck, LucideHeart, LucideHelpCircle, LucidePhone, LucideMail, LucideMapPin } from 'lucide-react';
import { CONFIG } from '../../lib/config';

export function Footer({ onOpenInfo, onCategory, onAbout, onHistory, onImpact }) {
  const { t } = useTranslation();
  return (
    <footer className="bg-stone-900 text-stone-400 py-20 border-t border-stone-800 font-sans mt-0">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
        <div>
          {/* Logo Rediseñado - Serif & Premium (Igual al Navbar) */}
          <div className="flex items-center gap-4 mb-8 text-white group cursor-default">
            <div className="relative">
              <div className="w-10 h-10 border border-stone-700 rounded-xl flex items-center justify-center font-serif text-xl group-hover:bg-white group-hover:text-stone-900 transition-all duration-500 font-black">C</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-terracotta-500 rounded-full border-2 border-stone-900"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tighter leading-none text-white">Made In <span className="text-terracotta-600">Contumazá</span></span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-stone-500 font-bold font-sans mt-0.5">{CONFIG.BRAND.SLOGAN}</span>
            </div>
          </div>
          
          <p className="text-[13px] leading-relaxed opacity-70 mb-8 max-w-xs font-light">{t('footer.purpose')}</p>
          
          <div className="flex gap-4">
            <a href={CONFIG.SOCIAL.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center hover:bg-terracotta-600 hover:border-terracotta-500 transition-all text-white shadow-xl">
              <LucideInstagram size={18}/>
            </a>
            <a href={CONFIG.SOCIAL.FACEBOOK} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center hover:bg-terracotta-600 hover:border-terracotta-500 transition-all text-white shadow-xl">
              <LucideFacebook size={18}/>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em]">{t('footer.explore')}</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><button onClick={() => onCategory('Todos')} className="hover:text-terracotta-500 transition-all text-left flex items-center gap-2 group hover:translate-x-1 duration-300">{t('nav.catalog')} <div className="w-1 h-1 bg-terracotta-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div></button></li>
            <li><button onClick={onAbout} className="hover:text-terracotta-500 transition-all text-left flex items-center gap-2 group hover:translate-x-1 duration-300">{t('nav.story')} <div className="w-1 h-1 bg-terracotta-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div></button></li>
            <li><button onClick={onHistory} className="hover:text-terracotta-500 transition-all text-left flex items-center gap-2 group hover:translate-x-1 duration-300">{t('nav.heritage')} <div className="w-1 h-1 bg-terracotta-500 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div></button></li>
            <li><button onClick={onImpact} className="inline-block text-terracotta-500 font-bold hover:text-white transition-all text-left italic hover:scale-105 duration-300">{t('footer.impact')}</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em]">{t('footer.help')}</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><button onClick={() => onOpenInfo('envios')} className="hover:text-white flex items-center gap-3 transition-all opacity-70 hover:opacity-100 hover:translate-x-1 duration-300"><LucideTruck size={18} className="text-stone-500"/> {t('footer.shipping')}</button></li>
            <li><button onClick={() => onOpenInfo('cuidado')} className="hover:text-white flex items-center gap-3 transition-all opacity-70 hover:opacity-100 hover:translate-x-1 duration-300"><LucideHeart size={18} className="text-stone-500"/> {t('footer.care')}</button></li>
            <li><button onClick={() => onOpenInfo('preguntas')} className="hover:text-white flex items-center gap-3 transition-all opacity-70 hover:opacity-100 hover:translate-x-1 duration-300"><LucideHelpCircle size={18} className="text-stone-500"/> {t('footer.faq')}</button></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-8 uppercase text-[10px] tracking-[0.3em]">{t('footer.contact')}</h4>
          <ul className="space-y-6 text-sm opacity-70">
            <li className="flex items-start gap-4 ring-offset-stone-900">
              <LucidePhone size={20} className="text-terracotta-500 shrink-0 mt-0.5"/>
              <div className="flex flex-col">
                <span className="text-white font-bold">{CONFIG.CONTACT.WHATSAPP}</span>
                <span className="text-[11px] opacity-60 font-bold uppercase tracking-widest mt-1">{CONFIG.CONTACT.HOURS}</span>
              </div>
            </li>
            <li className="flex items-center gap-4">
              <LucideMail size={20} className="text-terracotta-500 shrink-0"/>
              <a href={`mailto:${CONFIG.CONTACT.EMAIL}`} className="text-white font-bold hover:text-terracotta-500 transition-colors cursor-pointer">{CONFIG.CONTACT.EMAIL}</a>
            </li>
            <li className="flex items-start gap-4">
              <LucideMapPin size={20} className="text-terracotta-500 shrink-0 mt-0.5"/>
              <div className="flex flex-col text-white font-bold">
                {CONFIG.BRAND.LOCATION}
                <span className="text-[11px] opacity-60 font-bold uppercase tracking-widest mt-1">Perú • {CONFIG.BRAND.REGION_TAG}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800/50 pt-10 max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold tracking-widest uppercase opacity-40 gap-8">
        <p>© 2026 {CONFIG.BRAND.NAME} • {t('footer.legacy')}</p>
        <div className="flex items-center gap-3">
           <span className="opacity-60">{t('footer.backed_by')}</span>
           <a href={CONFIG.EXTERNAL_LINKS.MUNICIPALITY} target="_blank" rel="noopener noreferrer" className="text-white hover:text-terracotta-500 transition-colors decoration-terracotta-500/30 underline underline-offset-4">
             {t('footer.municipality')}
           </a>
        </div>
      </div>
    </footer>
  );
}
