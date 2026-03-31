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
             className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[5000ms]" 
             alt="Plaza de Armas de Contumazá"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40"></div>
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-wheat-400 font-bold tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 block drop-shadow-lg">{t('history.subtitle')}</span>
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
                    <span className="text-wheat-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">{site.role}</span>
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

        {/* Priority 3: Human Legacy Header */}
        <div className="pt-20 border-t border-stone-100 text-center">
            <h3 className="text-3xl font-serif text-stone-900 mb-2">Hijos Ilustres de Contumazá</h3>
            <p className="text-stone-500 max-w-2xl mx-auto">Conoce a las personalidades que han llevado el nombre de nuestra tierra al mundo.</p>
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

        {/* Poets Section */}
        {poets.length > 0 && (
          <section className="bg-stone-50 rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden border border-stone-100">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <LucideFeather size={150} />
             </div>
             <div className="max-w-3xl mx-auto text-center relative z-10">
                <LucideQuote className="text-terracotta-400 mx-auto mb-6" size={40} />
                <h2 className="text-3xl font-serif text-stone-900 mb-4">{t('history.poets.title')}</h2>
                <p className="text-xl font-serif italic text-stone-700 mb-8 leading-relaxed">
                  "{t('history.poets.desc')}"
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   {poets.map((p) => (
                     <button key={p.id} onClick={() => goToPersonality(p.slug)} className="bg-white p-1.5 pr-5 rounded-full shadow-sm border border-stone-100 text-sm font-medium text-stone-800 hover:bg-orange-50 hover:border-orange-200 transition flex items-center gap-3">
                       {p.image && <img src={p.image} className="w-8 h-8 rounded-full object-cover shadow-sm bg-stone-100" alt={p.name} />}
                       {p.name}
                     </button>
                   ))}
                </div>
             </div>
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
