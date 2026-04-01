"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/context/LanguageContext';
import { getPersonalityBySlug } from '@/lib/services/personalities';
import { LucideQuote, LucideArrowLeft, LucideCalendar, LucideUser, LucideChevronRight, LucideMaximize2, LucideX, LucidePartyPopper } from 'lucide-react';
import { CONFIG } from '@/lib/config';

export default function PersonalityPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const router = useRouter();
  const [personality, setPersonality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function load() {
      if (slug) {
        const data = await getPersonalityBySlug(slug);
        setPersonality(data);
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const goHome = () => router.push('/');
  const goBack = () => router.push('/historia');

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-andeansky-200 border-t-andeansky-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-400 font-serif italic">Cargando legado...</p>
        </div>
      </div>
    );
  }

  if (!personality) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-stone-900 mb-4">Personaje no encontrado</h1>
          <button onClick={goBack} className="text-andeansky-700 hover:underline">Volver a Historia</button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in">
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img src={personality.image} className="w-full h-full object-cover" alt={personality.name} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF7] via-stone-900/40 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-6xl mx-auto">
            <button onClick={goBack} className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition group">
              <LucideArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
              <span className="text-sm font-bold uppercase tracking-widest font-sans">Regresar al Legado</span>
            </button>
            <span className="inline-block px-4 py-1.5 bg-textilemagenta-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-4 rounded-full shadow-lg font-sans">
              {personality.category}
            </span>
            <h1 className="text-5xl md:text-8xl text-white font-serif mb-4 drop-shadow-2xl leading-tight italic">
              {personality.name}
            </h1>
            <p className="text-xl md:text-2xl text-white font-light tracking-wide max-w-2xl opacity-90 font-serif">
              {personality.role}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 pb-32">
        <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-xl -mt-32 relative z-10 border border-stone-100">
          <div className="mb-12 flex flex-wrap gap-8 items-center text-stone-400 text-sm border-b border-stone-100 pb-8 font-sans">
            <div className="flex items-center gap-2">
              {personality.category === CONFIG.LEGACY_CATEGORIES.FESTIVITIES ? (
                <LucidePartyPopper size={18} className="text-terracotta-600" />
              ) : (
                <LucideUser size={18} className="text-andeansky-700" />
              )}
              <span>{personality.category === CONFIG.LEGACY_CATEGORIES.FESTIVITIES ? 'Festividad de Contumazá' : 'Figura Ilustre de Contumazá'}</span>
            </div>
            <div className="flex items-center gap-2">
              <LucideCalendar size={18} className={personality.category === CONFIG.LEGACY_CATEGORIES.FESTIVITIES ? "text-terracotta-600" : "text-andeansky-700"} />
              <span>{personality.category === CONFIG.LEGACY_CATEGORIES.FESTIVITIES ? 'Calendario Cultural' : 'Memoria Histórica'}</span>
            </div>
          </div>

          <div className="prose prose-stone lg:prose-xl max-w-none">
            <LucideQuote className="text-andeansky-100 mb-6" size={64} />
            <div className="prose prose-stone lg:prose-xl w-full max-w-full overflow-hidden personality-bio break-words font-serif text-stone-700 leading-relaxed [&_*]:break-words [&_*]:max-w-full [&_*]:whitespace-normal">
              <div 
                dangerouslySetInnerHTML={{ __html: personality.description?.replace(/&nbsp;/g, ' ') }} 
              />
            </div>
          </div>

          {/* New Multi-Image Gallery */}
          {personality.images && personality.images.length > 0 && (
            <div className="mt-20 space-y-10">
               <div className="flex items-center gap-4">
                  <div className="h-px bg-stone-100 flex-1"></div>
                  <h3 className="text-xl font-serif text-stone-400 italic">Galería Fotográfica</h3>
                  <div className="h-px bg-stone-100 flex-1"></div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {personality.images.map((img, idx) => {
                    const imageUrl = typeof img === 'string' ? img : img.url;
                    const caption = typeof img === 'string' ? '' : img.caption;
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedImage(img)}
                        className={`relative flex flex-col gap-3 group transition-all duration-500 ${
                          idx === 0 ? 'col-span-2 md:row-span-2' : 'col-span-1'
                        }`}
                      >
                        <div className={`relative overflow-hidden rounded-3xl cursor-zoom-in shadow-sm hover:shadow-xl transition-all ${
                           idx === 0 ? 'h-[300px] md:h-[600px]' : 'h-[180px] md:h-[300px]'
                        }`}>
                          <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={caption || personality.name} />
                          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors flex items-center justify-center">
                            <LucideMaximize2 className="text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all shadow-lg" size={32} />
                          </div>
                        </div>
                        {caption && (
                          <p className="text-xs md:text-sm font-serif italic text-stone-500 px-2 line-clamp-2 leading-relaxed">
                            {caption}
                          </p>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>
          )}

          <div className="mt-20 pt-12 border-t border-stone-100">
             <div className="bg-stone-50 p-10 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-8 border border-stone-100">
                <div>
                   <h3 className="text-2xl font-serif text-stone-900 mb-2">¿Inspirado por nuestra historia?</h3>
                   <p className="text-stone-500 font-serif italic">Descubre cómo llevamos esta tradición a cada tapete.</p>
                </div>
                <button onClick={goHome} className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold hover:bg-andeansky-700 transition shadow-lg flex items-center gap-2 group font-sans">
                   Ver Catálogo <LucideChevronRight className="group-hover:translate-x-1 transition" size={20} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-stone-950/95 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-8 right-8 text-white/70 hover:text-white transition p-2 bg-white/10 rounded-full z-10">
            <LucideX size={32} />
          </button>
          
          <div className="relative max-w-5xl w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <img 
              src={typeof selectedImage === 'string' ? selectedImage : selectedImage.url} 
              className="max-h-[80vh] object-contain shadow-2xl rounded-lg" 
              alt="Fullscreen View"
            />
            {typeof selectedImage !== 'string' && selectedImage.caption && (
               <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/10 max-w-2xl text-center shadow-2xl">
                  <p className="text-white text-lg font-serif italic leading-relaxed">
                    {selectedImage.caption}
                  </p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
