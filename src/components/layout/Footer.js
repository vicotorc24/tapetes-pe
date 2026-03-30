"use client";
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideInstagram, LucideFacebook, LucideTruck, LucideHeart, LucideHelpCircle, LucidePhone, LucideMail, LucideMapPin } from 'lucide-react';

export function Footer({ onOpenInfo, onCategory, onAbout, onHistory, onImpact }) {
  const { t } = useTranslation();
  return (
    <footer className="bg-stone-900 text-stone-400 py-16 border-t border-stone-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-6 text-white">
            <div className="w-8 h-8 bg-andeansky-700 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg">T</div>
            <span className="font-serif font-bold text-xl tracking-tight">Tapetes.pe</span>
          </div>
          <p className="text-sm leading-relaxed opacity-80 mb-6">{t('footer.purpose')}</p>
          <div className="flex gap-4">
            <button className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-andeansky-700 transition text-white"><LucideInstagram size={16}/></button>
            <button className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center hover:bg-andeansky-700 transition text-white"><LucideFacebook size={16}/></button>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t('footer.explore')}</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => onCategory('Todos')} className="hover:text-wheat-500 transition text-left">{t('nav.catalog')}</button></li>
            <li><button onClick={onAbout} className="hover:text-wheat-500 transition text-left">{t('nav.story')}</button></li>
            <li><button onClick={onHistory} className="hover:text-wheat-500 transition text-left">{t('nav.history')}</button></li>
            <li><button onClick={onImpact} className="text-textilemagenta-500 font-bold hover:text-wheat-500 transition text-left">Impacto Social</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t('footer.help')}</h4>
          <ul className="space-y-4 text-sm">
            <li><button onClick={() => onOpenInfo('envios')} className="hover:text-white flex items-center gap-2 transition"><LucideTruck size={16}/> Envíos</button></li>
            <li><button onClick={() => onOpenInfo('cuidado')} className="hover:text-white flex items-center gap-2 transition"><LucideHeart size={16}/> Cuidado</button></li>
            <li><button onClick={() => onOpenInfo('preguntas')} className="hover:text-white flex items-center gap-2 transition"><LucideHelpCircle size={16}/> FAQ</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">{t('footer.contact')}</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li className="flex items-start gap-3"><LucidePhone size={18} className="text-terracotta-500 mt-0.5 shrink-0"/><span>+51 999 999 999<br/><span className="text-xs opacity-60">9am - 6pm</span></span></li>
            <li className="flex items-center gap-3"><LucideMail size={18} className="text-terracotta-500 shrink-0"/><span>hola@tapetes.pe</span></li>
            <li className="flex items-start gap-3"><LucideMapPin size={18} className="text-terracotta-500 mt-0.5 shrink-0"/><span>Contumazá, Perú</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 pt-8 max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs opacity-80 gap-4">
        <p className="opacity-60">© 2024 Tapetes.pe. Todos los derechos reservados.</p>
        <div className="flex items-center gap-2">
           <span className="opacity-60">Desarrollado con el respaldo de la</span>
           <a href="https://www.municontumaza.gob.pe/" target="_blank" rel="noopener noreferrer" className="text-wheat-500 font-bold hover:text-white transition">
             Municipalidad Provincial de Contumazá
           </a>
        </div>
      </div>
    </footer>
  );
}
