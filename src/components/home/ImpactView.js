"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  LucideHeartHandshake, 
  LucideTrendingUp, 
  LucideAward, 
  LucideUsers, 
  LucideGlobe,
  LucideInfo 
} from 'lucide-react';
import { AnalyticsEvents } from '@/lib/analytics';
import { getImpactData } from '../../lib/services/impact';

const IconMap = {
  HeartHandshake: LucideHeartHandshake,
  TrendingUp: LucideTrendingUp,
  Award: LucideAward,
  Users: LucideUsers,
  Globe: LucideGlobe
};

export function ImpactView() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getImpactData();
        setData(result);
        AnalyticsEvents.IMPACT_VIEW('general');
      } catch (error) {
        console.error("Error loading impact data:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Hero Impacto Cinematic Full-Bleed - Nido de Cóndores Remasterizado */}
      {/* El margen negativo anula el pt-108px global de ClientProviders */}
      <div className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden flex items-center group -mt-[108px]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-900/30 to-stone-50 z-10"></div>
          <img 
            src={data.hero.backgroundImage || "/images/landmarks/plaza_armas.jpg"} 
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-[10000ms] ease-out" 
            alt="Contumazá Heritage"
          />
        </div>
        
        {/* pt-20 adicional para centrar verticalmente considerando el Navbar que está encima */}
        <div className="max-w-6xl mx-auto px-8 relative z-20 text-center pt-24 md:pt-40">
          <span className="text-wheat-500 font-bold uppercase tracking-[0.4em] text-[10px] md:text-sm mb-6 block drop-shadow-lg animate-in slide-in-from-top-4 duration-700">
            {data.hero.subtitle}
          </span>
          <h1 className="text-6xl md:text-9xl font-serif font-black text-white mb-8 tracking-tighter leading-none drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {data.hero.title}
          </h1>
          <p className="text-white max-w-2xl mx-auto text-lg md:text-2xl font-light leading-relaxed drop-shadow-md opacity-90">
            {data.hero.description}
          </p>
        </div>
      </div>

      {/* Narrativa Social: El Reto & La Solución con Retoque Premium */}
      <div className="max-w-7xl mx-auto px-8 py-24 md:py-36">
        
        {/* Sección 1: El Reto */}
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center mb-32 md:mb-48">
          <div className="animate-in slide-in-from-left-12 duration-1000">
            <div className="flex items-center gap-4 mb-6">
               <span className="h-0.5 w-12 bg-terracotta-500"></span>
               <span className="text-terracotta-600 font-bold text-xs uppercase tracking-widest">{t('impact.section_subtitle')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight italic">
               {data.story1.title}
            </h2>
            <p className="text-stone-600 text-lg md:text-xl leading-relaxed mb-8 font-light">
               {data.story1.description1}
            </p>
            <p className="text-stone-500 text-md leading-relaxed italic border-l-4 border-stone-100 pl-6">
               {data.story1.description2}
            </p>
          </div>
          <div className="relative group p-4 animate-in zoom-in duration-1000">
            {/* Retoque de Imagen: Contenedor Premium con Borde de Hilo y Sombra de Autor */}
            <div className="absolute inset-0 bg-stone-100 rounded-[3rem] transform rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-700 shadow-xl"></div>
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm group-hover:scale-[1.02] transition-transform duration-700">
               <img 
                 src={data.story1.image} 
                 className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.02] saturate-[1.1]" 
                 alt="El Reto Artesanal" 
               />
               <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay"></div>
               <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] font-black text-terracotta-600 uppercase tracking-widest mb-1">Impacto Real</p>
                  <p className="text-xs text-stone-900 font-bold italic font-serif leading-snug">Preservando el legado ante los retos de la globalización.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Sección 2: La Solución */}
        <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="order-2 lg:order-1 relative group p-4 animate-in zoom-in duration-1000 delay-300">
            <div className="absolute inset-0 bg-andean-neutral-100 rounded-[3rem] transform -rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-700 shadow-xl"></div>
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/50 backdrop-blur-sm group-hover:scale-[1.02] transition-transform duration-700">
               <img 
                 src={data.story2.image} 
                 className="w-full h-full object-cover" 
                 alt="Solución Tecnológica" 
               />
               <div className="absolute inset-0 bg-andeangreen-900/10"></div>
            </div>
          </div>
          <div className="order-1 lg:order-2 animate-in slide-in-from-right-12 duration-1000 delay-300">
            <div className="flex items-center gap-4 mb-6">
               <span className="h-0.5 w-12 bg-andeangreen-500"></span>
               <span className="text-andeangreen-600 font-bold text-xs uppercase tracking-widest">Acompañamiento Tecnológico</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-stone-900 mb-8 leading-tight">
               {data.story2.title}
            </h2>
            <p className="text-stone-600 text-lg md:text-xl leading-relaxed mb-8 font-light">
               {data.story2.description1}
            </p>
            <p className="text-stone-500 text-md leading-relaxed border-l-4 border-andeangreen-100 pl-6">
               {data.story2.description2}
            </p>
          </div>
        </div>
      </div>

      {/* Secciones Adicionales Dinámicas (Futuro Crecimiento) */}
      {data.extraSections?.length > 0 && (
        <div className="max-w-7xl mx-auto px-8 py-24 space-y-32">
          {data.extraSections.map((section, idx) => (
            <div 
              key={section.id || idx} 
              className={`grid lg:grid-cols-2 gap-16 md:gap-24 items-center animate-in fade-in slide-in-from-bottom-12 duration-1000`}
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              <div className={`${section.imageSide === 'right' ? 'order-2 lg:order-1' : 'order-2'}`}>
                {section.subtitle && (
                  <span className="text-andeansky-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">
                    {section.subtitle}
                  </span>
                )}
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
                  {section.title}
                </h3>
                <p className="text-stone-600 text-lg leading-relaxed font-light">
                  {section.content}
                </p>
              </div>
              
              <div className={`${section.imageSide === 'right' ? 'order-1 lg:order-2' : 'order-1'} relative group`}>
                <div className="absolute inset-0 bg-stone-100 rounded-[2.5rem] transform rotate-2 -z-10 group-hover:rotate-0 transition-transform duration-700"></div>
                <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                  {section.image ? (
                    <img src={section.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={section.title} />
                  ) : (
                    <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400 italic text-sm">
                      Sin imagen configurada
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transparencia - Distribución de ganancias Dashboard Style */}
      <div className="bg-stone-950 py-32 md:py-48 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-stone-50 to-transparent opacity-10"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-andeangreen-600/10 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
             <span className="text-andeangreen-400 font-black text-[10px] md:text-xs uppercase tracking-[0.5em] mb-4 block">Transparencia Total</span>
             <h2 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6">Métricas de Propósito</h2>
             <p className="text-stone-400 max-w-xl mx-auto text-lg font-light">Cada compra es un motor de cambio auditable y directo.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
            {data.stats.map((stat, idx) => {
               const Icon = IconMap[stat.icon] || LucideInfo;
               return (
                  <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[3.5rem] flex flex-col items-center group hover:bg-white/10 transition-all duration-500 hover:-translate-y-4 shadow-2xl">
                    <div className="w-20 h-20 bg-white/10 text-andeangreen-400 rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-andeangreen-400 group-hover:text-white transition-all duration-500 transform rotate-6 group-hover:rotate-0 shadow-lg">
                       <Icon size={36} />
                    </div>
                    <h3 className="text-5xl md:text-7xl font-serif font-black text-white mb-4 tracking-tighter">
                       {stat.value}
                    </h3>
                    <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] text-center leading-loose">
                       {stat.label}
                    </p>
                  </div>
               );
            })}
          </div>

          <div className="mt-32 p-8 md:p-12 bg-white rounded-[3rem] shadow-3xl text-center max-w-4xl mx-auto">
             <LucideInfo className="mx-auto mb-6 text-terracotta-500" size={32} />
             <h4 className="text-2xl font-serif font-bold text-stone-900 mb-4">¿Tejes un Legado?</h4>
             <p className="text-stone-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                Estamos construyendo la comunidad de artesanas digitales más grande del norte peruano. Si eres de Contumazá y deseas digitalizar tu arte, únete a nosotras.
             </p>
             <button 
                onClick={() => window.location.href = '/unete'}
                className="bg-stone-900 text-white px-14 py-6 rounded-full font-bold hover:bg-terracotta-600 transition-all duration-300 shadow-xl shadow-stone-200 hover:-translate-y-1 block sm:inline-block"
             >
                POSTULAR COMO ARTESANA
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
