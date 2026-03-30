"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideQuote, LucideMountain, LucideFeather, LucideHistory, LucideCompass } from 'lucide-react';
import { getPersonalities } from '../../lib/services/personalities';

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

  const featured = personalities.find(p => p.isPromoted && p.category !== 'Poetas') || personalities[0];
  const poets = personalities.filter(p => p.category === 'Poetas');
  const others = personalities.filter(p => p.id !== featured?.id && p.category !== 'Poetas');

  const goToPersonality = (slug) => {
    window.location.href = `/historia/${slug}`;
  };

  return (
    <div className="pt-20 animate-in fade-in">
      {/* Hero Section con Mirador Real */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900 border-b-8 border-terracotta-500 group">
        <div className="absolute inset-0 z-0">
           <img 
             src="/images/landmarks/ermita.jpg" 
             className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-100 transition-transform duration-[5000ms]" 
             alt="Mirador La Ermita Contumazá"
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
          <div className="py-20 text-center text-stone-400 italic animate-pulse">Cargando legado cultural...</div>
        ) : (
          <>
            {/* Featured Section (Walter Alva or first personality) */}
            {featured && (
              <section className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1 relative cursor-pointer" onClick={() => goToPersonality(featured.slug)}>
                  <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl transform -rotate-1 border-4 border-white">
                    <img src={featured.image} className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" alt={featured.name} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-stone-900 text-white p-4 rounded-xl shadow-xl max-w-xs hidden md:block">
                    <LucideCompass className="text-terracotta-400 mb-2" size={24} />
                    <p className="text-xs italic">{featured.role}</p>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <span className="text-andeansky-700 font-bold text-[10px] uppercase tracking-widest bg-andeansky-50 px-3 py-1 rounded-full mb-3 inline-block">{featured.category}</span>
                  <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">{featured.name}</h2>
                  <div className="space-y-4 text-stone-600 leading-relaxed">
                    <div className="text-lg line-clamp-6 prose prose-stone lg:prose-lg" dangerouslySetInnerHTML={{ __html: featured.description }} />
                    <button onClick={() => goToPersonality(featured.slug)} className="text-andeansky-700 font-bold hover:underline">Seguir leyendo →</button>
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
                         <button key={p.id} onClick={() => goToPersonality(p.slug)} className="bg-white px-5 py-2 rounded-full shadow-sm border border-stone-100 text-sm font-medium text-stone-800 hover:bg-orange-50 hover:border-orange-200 transition">
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
                <h3 className="text-2xl font-serif text-stone-900 text-center">Otras figuras notables</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {others.map(p => (
                    <div key={p.id} onClick={() => goToPersonality(p.slug)} className="bg-white p-6 rounded-2xl border border-stone-100 hover:border-andeansky-200 shadow-sm hover:shadow-md transition cursor-pointer group">
                      <div className="w-16 h-16 rounded-full bg-stone-100 mb-4 overflow-hidden border-2 border-white shadow-sm">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={p.name} />
                      </div>
                      <h4 className="font-bold text-stone-900 mb-1">{p.name}</h4>
                      <p className="text-xs text-stone-400 uppercase tracking-wider mb-3">{p.role}</p>
                      <div className="text-sm text-stone-500 line-clamp-3 leading-relaxed prose prose-stone prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: p.description }} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* General History & Traditions (Real) */}
        <section className="grid md:grid-cols-2 gap-8 pt-12 border-t border-stone-100">
           <div className="bg-andeangreen-50 p-8 rounded-3xl border border-andeangreen-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 group-hover:opacity-30 transition-opacity">
                <img src="/images/landmarks/CALVARIO.jpeg" className="w-full h-full object-cover rounded-bl-full" alt="El Calvario de Contumazá" />
              </div>
              <LucideHistory className="text-andeangreen-700 mb-4" size={32} />
              <h3 className="text-xl font-serif font-bold text-andeangreen-900 mb-3">{t('history.general.title')}</h3>
              <p className="text-andeangreen-800/80 leading-relaxed">
                {t('history.general.desc')}
              </p>
           </div>
           <div className="bg-textilemagenta-50 p-8 rounded-3xl border border-textilemagenta-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 opacity-10 group-hover:opacity-30 transition-opacity">
                <img src="/images/landmarks/plaza_armas.jpg" className="w-full h-full object-cover rounded-bl-full" alt="Plaza de Armas de Contumazá" />
              </div>
              <LucideMountain className="text-textilemagenta-700 mb-4" size={32} />
              <h3 className="text-xl font-serif font-bold text-textilemagenta-900 mb-3">Nido de Cóndores</h3>
              <p className="text-textilemagenta-800/80 leading-relaxed">
                A 2675 m.s.n.m, Contumazá es un balcón hacia los Andes. Su geografía moldea el carácter de su gente: fuerte, resiliente y profundamente conectada con la tierra y sus tradiciones.
              </p>
           </div>
        </section>

      </div>
    </div>
  );
}
