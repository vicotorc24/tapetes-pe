"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideQuote, LucideMountain, LucideFeather, LucideHistory, LucideCompass } from 'lucide-react';
import { getPersonalities } from '../../lib/services/personalities';
import { CONFIG } from '../../lib/config';

export function HistoryView() {
  const { t } = useTranslation();
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getPersonalities();
      setPersonalities(data);
      setLoading(false);
    }
    load();
  }, []);

  const historyItems = personalities.filter(p => p.category === CONFIG.LEGACY_CATEGORIES.HISTORY);
  const featured = personalities.find(p => p.isPromoted && ![CONFIG.LEGACY_CATEGORIES.POETS, CONFIG.LEGACY_CATEGORIES.TOURISM, CONFIG.LEGACY_CATEGORIES.HISTORY].includes(p.category)) || personalities.find(p => ![CONFIG.LEGACY_CATEGORIES.POETS, CONFIG.LEGACY_CATEGORIES.TOURISM, CONFIG.LEGACY_CATEGORIES.HISTORY].includes(p.category));
  const poets = personalities.filter(p => p.category === CONFIG.LEGACY_CATEGORIES.POETS);
  const sites = personalities.filter(p => p.category === CONFIG.LEGACY_CATEGORIES.TOURISM);
  const others = personalities.filter(p => 
    ![CONFIG.LEGACY_CATEGORIES.POETS, CONFIG.LEGACY_CATEGORIES.TOURISM, CONFIG.LEGACY_CATEGORIES.HISTORY].includes(p.category) && 
    p.id !== featured?.id
  );

  const goToPersonality = (slug) => {
    window.location.href = `/historia/${slug}`;
  };

  return (
    <div className="animate-in fade-in">
      {/* Hero Section con Mirador Real */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900 border-b-8 border-terracotta-500 group">
        <div className="absolute inset-0 z-0">
           <img 
             src="/images/landmarks/plaza_armas.jpg" 
             className="w-full h-full object-cover opacity-50 scale-105 group-hover:scale-100 transition-transform duration-[5000ms]" 
             alt="Plaza de Armas de Contumazá"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-stone-900/60"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-wheat-200 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 block drop-shadow-lg">{t('history.subtitle')}</span>
          <h1 className="text-5xl md:text-8xl text-white font-serif mb-6 leading-tight drop-shadow-2xl">
            {t('history.title')}
          </h1>
          <div className="w-32 h-1.5 bg-terracotta-500 mx-auto rounded-full shadow-lg"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        
        {loading ? (
          <div className="py-20 text-center text-stone-400 italic animate-pulse">{t('history.loading')}</div>
        ) : (
          <>        {/* Priority 1: Dynamic History Section (from DB) */}
        {historyItems.length > 0 && (
          <section className="space-y-12">
            {historyItems.map((item, idx) => (
              <div key={item.id} onClick={() => goToPersonality(item.slug)} className="group cursor-pointer bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-700">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className={`relative h-[400px] md:h-auto ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
                    <img src={item.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt={item.name} />
                    <div className="absolute inset-0 bg-stone-900/10"></div>
                  </div>
                  <div className="p-8 md:p-16 flex flex-col justify-center">
                    <span className="text-andeansky-600 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                       <LucideHistory size={16} /> {item.category}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-serif text-stone-900 mb-6 leading-tight">{item.name}</h3>
                    <div 
                      className="text-stone-600 text-lg leading-relaxed line-clamp-6 prose prose-stone mb-8"
                      dangerouslySetInnerHTML={{ __html: item.description?.replace(/&nbsp;/g, ' ') }}
                    />
                    <button className="text-andeansky-700 font-bold flex items-center gap-2 group/btn">
                      {t('history.read_more')} <div className="w-8 h-px bg-andeansky-200 group-hover/btn:w-12 transition-all"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Priority 1.5: General History & Traditions (Static) */}
        <section className="grid md:grid-cols-2 gap-8 pt-8">
           <div className="bg-andeangreen-50 p-10 rounded-[3rem] border border-andeangreen-100 relative overflow-hidden group shadow-sm hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <img src="/images/landmarks/CALVARIO.jpeg" className="w-full h-full object-cover rounded-bl-full" alt="El Calvario" />
              </div>
              <LucideHistory className="text-andeangreen-700 mb-6" size={40} />
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-andeangreen-900 mb-4">{t('history.general.title')}</h3>
              <p className="text-andeangreen-800/90 leading-relaxed text-lg">
                {t('history.general.desc')}
              </p>
           </div>
           <div className="bg-textilemagenta-50 p-10 rounded-[3rem] border border-textilemagenta-100 relative overflow-hidden group shadow-sm hover:shadow-md transition">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <img src="/images/landmarks/plaza_armas.jpg" className="w-full h-full object-cover rounded-bl-full" alt="Plaza de Armas" />
              </div>
              <LucideMountain className="text-textilemagenta-700 mb-6" size={40} />
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-textilemagenta-900 mb-4">{t('history.condor.title')}</h3>
              <p className="text-textilemagenta-800/90 leading-relaxed text-lg">
                {t('history.condor.desc')}
              </p>
           </div>
        </section>

        {/* Priority 2: Tourist Sites Section */}
        {sites.length > 0 && (
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <span className="text-andeansky-600 font-bold text-xs uppercase tracking-widest">{t('history.sites.subtitle')}</span>
              <h3 className="text-4xl md:text-5xl font-serif text-stone-900">{t('history.sites.title')}</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-10">
              {sites.map(site => (
                <div key={site.id} onClick={() => goToPersonality(site.slug)} className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700">
                  <img src={site.image} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" alt={site.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10 w-full">
                    <span className="text-wheat-200 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">{site.role}</span>
                    <h4 className="text-3xl font-serif text-white mb-4">{site.name}</h4>
                    <div 
                      className="text-stone-200 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                      dangerouslySetInnerHTML={{ __html: site.description?.replace(/&nbsp;/g, ' ') }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Priority 2: Traditions & Festivities Section [NEW] */}
        <section className="space-y-12">
            <div className="text-center space-y-4">
              <span className="text-terracotta-600 font-bold text-xs uppercase tracking-widest">{t('history.festivities.title')}</span>
              <h3 className="text-4xl md:text-5xl font-serif text-stone-900">Nuestra Cultura Viva</h3>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Semana Santa - Patrimonio Cultural (Prominent) */}
              <div className="relative overflow-hidden rounded-[3rem] group">
                <div className="absolute inset-0 bg-[#3d0a44]"> {/* Purple background from poster */}
                   <img 
                     src="/images/landmarks/CALVARIO.jpeg" 
                     className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-[5000ms]" 
                     alt="Semana Santa Contumazá" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-[#3d0a44] via-[#3d0a44]/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
                   <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/20 border border-amber-400/30">
                         <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                         <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">
                           {t('history.festivities.semana_santa.tag')}
                         </span>
                      </div>
                      <h4 className="text-4xl md:text-6xl font-serif text-white leading-tight">
                        {t('history.festivities.semana_santa.title')}
                      </h4>
                      <p className="text-stone-300 text-lg leading-relaxed max-w-xl italic border-l-2 border-amber-400/50 pl-6">
                        {t('history.festivities.semana_santa.desc')}
                      </p>
                   </div>
                   <div className="shrink-0 relative">
                      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-amber-400/20 p-4 animate-spin-slow">
                         <div className="w-full h-full rounded-full border-2 border-amber-400/40"></div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <LucideQuote size={40} className="text-amber-400 opacity-50" />
                      </div>
                   </div>
                </div>
              </div>

              {/* San Mateo - Patronal Feast */}
              <div className="bg-stone-50 rounded-[3rem] p-8 md:p-12 border border-stone-100 relative overflow-hidden group">
                 <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="w-full md:w-1/3 aspect-square rounded-[2rem] overflow-hidden shadow-2xl relative">
                       <img src="/images/landmarks/san_mateo.jpg" className="w-full h-full object-cover transition duration-700 group-hover:scale-110" alt="San Mateo" />
                       <div className="absolute inset-0 bg-orange-600/10"></div>
                    </div>
                    <div className="flex-1 space-y-4">
                       <span className="text-terracotta-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                         <span className="w-8 h-px bg-terracotta-200"></span> {t('history.festivities.san_mateo.date')}
                       </span>
                       <h4 className="text-3xl md:text-5xl font-serif text-stone-900">
                         {t('history.festivities.san_mateo.title')}
                       </h4>
                       <p className="text-stone-600 text-lg leading-relaxed">
                         {t('history.festivities.san_mateo.desc')}
                       </p>
                    </div>
                 </div>
              </div>
            </div>
        </section>

        {/* Priority 3: Human Legacy Header */}
        <div className="pt-20 border-t border-stone-100 text-center">
            <h3 className="text-3xl font-serif text-stone-900 mb-2">{t('history.illustrious_title')}</h3>
            <p className="text-stone-500 max-w-2xl mx-auto">{t('history.illustrious_desc')}</p>
        </div>

        {/* Featured Personality */}
        {featured && (
          <section className="grid lg:grid-cols-2 gap-12 items-center bg-stone-50/50 p-8 md:p-12 rounded-[3rem] border border-stone-100/50">
            <div className="order-2 lg:order-1 relative cursor-pointer" onClick={() => goToPersonality(featured.slug)}>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl transform -rotate-1 border-4 border-white">
                <img src={featured.image} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" alt={featured.name} />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-andeansky-700 font-bold text-[10px] uppercase tracking-widest bg-andeansky-50 px-3 py-1 rounded-full mb-3 inline-block">{featured.category}</span>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">{featured.name}</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <div className="text-lg line-clamp-6 prose prose-stone lg:prose-lg" dangerouslySetInnerHTML={{ __html: featured.description?.replace(/&nbsp;/g, ' ') }} />
                <button onClick={() => goToPersonality(featured.slug)} className="text-andeansky-700 font-bold hover:underline">{t('history.read_more')}</button>
              </div>
            </div>
          </section>
        )}

        {/* Priority 3: Poets Section (The Intellectual Core) */}
        {poets.length > 0 && (
          <section className="relative overflow-hidden group">
            {/* Fondo Estilo Stone-50 con Borde Decorativo */}
            <div className="bg-stone-50 rounded-[3rem] p-8 md:p-14 border border-stone-200/60 relative z-10 shadow-sm">
               {/* Línea Decorativa Interna */}
               <div className="absolute inset-4 border border-stone-100 rounded-[2.5rem] pointer-events-none"></div>
               
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity duration-1000">
                  <LucideFeather size={280} strokeWidth={1} />
               </div>

               <div className="max-w-4xl mx-auto text-center relative z-20">
                  <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-px bg-terracotta-200 mb-6"></div>
                    <LucideQuote className="text-terracotta-500/80 mb-6 animate-pulse" size={48} strokeWidth={1.5} />
                    <h2 className="text-4xl md:text-6xl font-serif text-stone-900 mb-2 tracking-tight">
                      {t('history.poets.title')}
                    </h2>
                    <span className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.4em]">Cuna de la intelectualidad</span>
                  </div>

                  <p className="text-2xl md:text-3xl font-serif italic text-stone-800 mb-12 leading-relaxed max-w-2xl mx-auto">
                    "{t('history.poets.desc')}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                     {poets.map((p) => (
                       <button 
                         key={p.id} 
                         onClick={() => goToPersonality(p.slug)} 
                         className="group/card bg-white h-24 p-2 pr-8 rounded-2xl shadow-sm border border-stone-100 hover:border-terracotta-200 hover:shadow-xl transition-all duration-500 flex items-center gap-5 text-left active:scale-95"
                       >
                         <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md border-2 border-stone-50 group-hover/card:rotate-2 transition-transform duration-500">
                              {p.image ? (
                                <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                              ) : (
                                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
                                  <LucideFeather size={24} />
                                </div>
                              )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-terracotta-600 text-white p-1 rounded-md opacity-0 group-hover/card:opacity-100 transition-opacity translate-y-2 group-hover/card:translate-y-0 duration-500">
                               <LucideFeather size={10} />
                            </div>
                         </div>
                         <div className="flex flex-col">
                           <span className="text-xs text-stone-400 uppercase tracking-widest mb-1 italic">Poeta Contumacino</span>
                           <h4 className="font-serif text-xl text-stone-900 group-hover/card:text-terracotta-800 transition-colors">{p.name}</h4>
                         </div>
                       </button>
                     ))}
                  </div>

                  <div className="mt-16 w-32 h-px bg-stone-200 mx-auto opacity-40"></div>
               </div>
            </div>
            
            {/* Adornos en las esquinas */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-stone-200 rounded-tl-2xl opacity-40 pointer-events-none"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-stone-200 rounded-br-2xl opacity-40 pointer-events-none"></div>
          </section>
        )}

        {/* Other Personalities Grid */}
        {others.length > 0 && (
          <section className="space-y-8">
            <h3 className="text-2xl font-serif text-stone-900 text-center">{t('history.others')}</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {others.map(p => (
                <div key={p.id} onClick={() => goToPersonality(p.slug)} className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-andeansky-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-stone-100 mb-4 overflow-hidden border-2 border-white shadow-sm">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={p.name} />
                  </div>
                  <h4 className="font-bold text-stone-900 mb-1">{p.name}</h4>
                  <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">{p.role}</p>
                  <div 
                    className="text-sm text-stone-500 line-clamp-3 leading-relaxed prose prose-stone prose-sm" 
                    dangerouslySetInnerHTML={{ __html: p.description?.replace(/&nbsp;/g, ' ') }} 
                  />
                </div>
              ))}
            </div>
          </section>
        )}
          </>
        )}

      </div>
    </div>
  );
}
