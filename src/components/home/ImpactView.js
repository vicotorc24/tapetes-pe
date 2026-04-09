"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  LucideHeart, 
  LucideGlobe2, 
  LucideUsers, 
  LucideArrowRight,
  LucideInfo,
  LucideCheckCircle2,
  LucideTrendingUp,
  LucideAward,
  LucideMap,
  LucideHandshake,
  LucideSparkles
} from 'lucide-react';
import { AnalyticsEvents } from '@/lib/analytics';
import { getImpactData } from '../../lib/services/impact';

// Helper component to render icons selected in the admin
const ImpactIcon = ({ name, size = 44 }) => {
  const icons = {
    'Handshake': LucideHandshake,
    'TrendingUp': LucideTrendingUp,
    'Award': LucideAward,
    'Users': LucideUsers,
    'Globe': LucideGlobe2,
    'Sparkles': LucideSparkles,
    'Map': LucideMap,
    'Heart': LucideHeart
  };
  
  // Default fallback if icon name doesn't match
  const IconComponent = icons[name] || LucideHeart;
  return <IconComponent size={size} strokeWidth={1.5} />;
};

export function ImpactView() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getImpactData();
        // We use the data as-is from Firestore. 
        // Admin is now responsible for ensuring "Made In Contumazá" branding.
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
    <div className="bg-stone-50 overflow-hidden">
      {/* Hero Impacto Cinematic - Made In Contumazá */}
      <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden flex items-center group -mt-[108px]">
        <div className="absolute inset-0 z-0">
          {/* Overlay cinemático gradiente */}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-900/40 to-stone-50 z-10"></div>
          <img 
            src={data.hero?.backgroundImage || "/images/landmarks/plaza_armas.jpg"} 
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-[10000ms] ease-out" 
            alt="Contumazá Heritage"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-20 text-center pt-32">
          <div className="flex items-center justify-center gap-4 mb-6 animate-in slide-in-from-top-4 duration-700">
             <span className="h-[1px] w-8 bg-andeangreen-400"></span>
             <span className="text-andeangreen-300 font-black text-xs uppercase tracking-[0.5em]">
               {data.hero?.subtitle || t('impact.section_subtitle')}
             </span>
             <span className="h-[1px] w-8 bg-andeangreen-400"></span>
          </div>
          <h1 className="text-5xl md:text-[7rem] font-serif font-black text-white mb-8 tracking-tighter leading-none drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {(data.hero?.title || t('impact.section_title')).replace(/Tapetes\.pe/g, 'Made In Contumazá')}
          </h1>
          <p className="text-white max-w-3xl mx-auto text-lg md:text-xl font-light leading-relaxed drop-shadow-md opacity-90 animate-in fade-in duration-1000 delay-300">
            {data.hero?.description}
          </p>
        </div>
        
        {/* Decorative Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce opacity-50">
           <span className="w-px h-12 bg-white/30"></span>
        </div>
      </div>

      {/* HISTORIA 1: El Reto (Light Section) */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-terracotta-500 font-black text-xs uppercase tracking-widest">{data.story1?.label || t('impact.section_subtitle')}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-8 leading-none tracking-tighter italic">
                 {data.story1?.title}
              </h2>
              <div className="space-y-6">
                <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-light">
                   {data.story1?.description1}
                </p>
                <div className="p-8 bg-stone-50 border-l-4 border-terracotta-500 rounded-r-3xl">
                  <p className="text-stone-700 text-md md:text-lg leading-relaxed italic font-serif">
                     "{data.story1?.description2}"
                  </p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative group p-6">
              <div className="absolute inset-0 bg-stone-100 rounded-[3.5rem] transform rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-700 shadow-xl"></div>
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
                 <img src={data.story1?.image || "/images/impact/story1.png"} className="w-full h-full object-cover" alt="El Reto" />
                 <div className="absolute inset-0 bg-stone-950/10 pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HISTORIA 2: La Solución (AndeanGreen Section) */}
      <section className="bg-andeangreen-50/50 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative group p-6">
              <div className="absolute inset-0 bg-andeangreen-100 rounded-[3.5rem] transform -rotate-3 -z-10 group-hover:rotate-0 transition-transform duration-700 shadow-xl"></div>
              <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
                 <img src={data.story2?.image || "/images/impact/story2.png"} className="w-full h-full object-cover" alt="La Solución" />
                 <div className="absolute inset-0 bg-andeangreen-950/10 pointer-events-none"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-andeangreen-600 font-black text-xs uppercase tracking-widest">{data.settings?.our_response || t('impact.our_response')}</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-8 leading-none tracking-tighter">
                 {data.story2?.title}
              </h2>
              <div className="space-y-6">
                <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-light">
                   {data.story2?.description1}
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    t('impact.benefit1'),
                    t('impact.benefit2'),
                    t('impact.benefit3')
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-stone-700">
                      <LucideCheckCircle2 className="text-andeangreen-600" size={20} />
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOQUES DINÁMICOS ADICIONALES (Extra Sections from Admin) */}
      {data.extraSections && data.extraSections.length > 0 && data.extraSections.map((section, idx) => (
        <section key={section.id || idx} className={`py-24 md:py-32 ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-100/30'}`}>
          <div className="max-w-7xl mx-auto px-8">
            <div className={`grid lg:grid-cols-2 gap-16 md:gap-24 items-center ${section.imageSide === 'right' ? '' : 'lg:flex-row-reverse'}`}>
              <div className={section.imageSide === 'right' ? 'order-1' : 'order-1 lg:order-2'}>
                 <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 mb-8 leading-none tracking-tighter italic">
                    {section.title}
                 </h2>
                 <p className="text-stone-600 text-lg md:text-xl leading-relaxed font-light">
                    {section.content}
                 </p>
              </div>
              {section.image && (
                <div className={section.imageSide === 'right' ? 'order-2' : 'order-2 lg:order-1'}>
                  <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group-hover:scale-[1.02] transition-transform duration-700">
                     <img src={section.image} className="w-full h-full object-cover" alt={section.title} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* MÉTRICAS DE PROPÓSITO: Dashboard Style */}
      <section className="bg-stone-950 py-32 md:py-48 relative overflow-hidden">
        {/* Acentuación Visual */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-andeangreen-600/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-terracotta-500/10 rounded-full blur-[120px]"></div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-24">
             <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-8 bg-andeangreen-500"></span>
                <span className="text-andeangreen-400 font-black text-xs uppercase tracking-[0.4em]">Transparencia Auditable</span>
                <span className="h-px w-8 bg-andeangreen-500"></span>
             </div>
             <h2 className="text-5xl md:text-[6.5rem] font-serif font-black text-white mb-6 tracking-tighter">Métricas de Propósito</h2>
             <p className="text-stone-400 max-w-xl mx-auto text-lg md:text-xl font-light leading-relaxed">Cada cifra cuenta una historia de desarrollo sostenible en Contumazá.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
            {data.stats && data.stats.slice(0, 3).map((stat, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-[3.5rem] border border-white/10 -z-10 group-hover:bg-white/10 transition-all duration-700 shadow-2xl"></div>
                
                <div className="p-12 md:p-14 text-center h-full flex flex-col items-center">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-andeangreen-600 group-hover:text-white transition-all duration-500 transform rotate-6 group-hover:rotate-0 border border-white/10 text-andeangreen-400">
                    <ImpactIcon name={stat.icon} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-6xl md:text-8xl font-serif font-black text-white tracking-tighter tabular-nums mb-2">
                       {stat.value}
                    </h3>
                    <div className="w-12 h-1 bg-andeangreen-500/30 mx-auto rounded-full group-hover:w-20 group-hover:bg-andeangreen-500 transition-all duration-700"></div>
                    <p className="text-stone-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs leading-loose pt-2">
                       {stat.label || t(`impact.stat${idx + 1}_label`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bloque Final: Invitación Editorial */}
          <div className="mt-32 relative group">
             <div className="absolute inset-0 bg-white rounded-[4rem] shadow-3xl -z-10 pointer-events-none"></div>
             <div className="p-12 md:p-20 text-center max-w-4xl mx-auto">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-10 text-terracotta-500 border border-stone-100 shadow-sm">
                   <LucideInfo size={32} />
                </div>
                <h4 className="text-3xl md:text-5xl font-serif font-black text-stone-900 mb-6 tracking-tight italic">
                   {t('impact.cta_title')}
                </h4>
                <p className="text-stone-500 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">
                   {t('impact.cta_desc')}
                </p>
                <button 
                   onClick={() => window.location.href = '/unete'}
                   className="group inline-flex items-center gap-8 bg-stone-900 text-white px-16 py-7 rounded-full font-bold hover:bg-terracotta-600 transition-all duration-500 shadow-2xl hover:-translate-y-2 active:scale-95"
                >
                   <span className="uppercase tracking-[0.3em] text-xs font-black">{t('impact.cta_btn')}</span>
                   <LucideArrowRight size={20} className="group-hover:translate-x-4 transition-transform duration-500" />
                </button>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
