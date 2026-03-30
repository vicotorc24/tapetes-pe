"use client";
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideCrown, LucidePlus, LucideHeart, LucideGlobe2, LucideUsers, LucideArrowRight, LucideX, History as LucideHistory } from 'lucide-react';

export function HomeView({ products, activeCategory, collections = [], activeCollection, onSelectCollection, onViewProduct, onAddToCart, onExplore, onCustomOrder }) {
  const { t } = useTranslation();
  
  let filteredProducts = products;
  if (activeCollection) {
    filteredProducts = products.filter(p => p.collection === activeCollection || p.collection === activeCollection?.id);
  } else if (activeCategory !== 'Todos') {
    filteredProducts = products.filter(p => p.category === activeCategory);
  }

  const activeCollectionData = collections.find(c => c.id === activeCollection || c.name.toLowerCase().includes(activeCollection?.toLowerCase()));

  return (
    <div>
      {/* Hero Section Auténtico Renovado - Fondo ajustado para contraste con Nav */}
      <div className="relative bg-stone-50 py-24 md:py-36 border-b border-stone-100 overflow-hidden group">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="text-terracotta-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 block drop-shadow-sm">{t('hero.subtitle')}</span>
            <h1 className="text-6xl lg:text-[5.5rem] text-stone-900 font-serif leading-[1.05] mb-8 tracking-tighter">
              {t('hero.title1')} <br/> 
              <span className="text-andeansky-800 italic opacity-90">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl text-stone-500 leading-relaxed mb-12 font-light max-w-xl mx-auto lg:mx-0">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
               <button onClick={onExplore} className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-terracotta-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
                 {t('hero.cta')}
               </button>
               <button onClick={() => window.location.href = '/historia'} className="px-12 py-5 rounded-full font-bold text-stone-600 bg-white/50 backdrop-blur-md border border-stone-200 hover:border-stone-900 hover:text-stone-900 transition-all duration-300">
                 {t('hero.heritage')}
               </button>
            </div>
          </div>
          
          <div className="relative w-full aspect-[4/5] rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden group/hero">
             <div className="absolute inset-0 bg-stone-900/5 z-10 pointer-events-none"></div>
             <img 
               src="/images/hero_authentic.png" 
               className="w-full h-full object-cover origin-center scale-110 group-hover/hero:scale-100 transition-transform duration-[2000ms] ease-out" 
               alt="Crochet artesanal real de Contumazá"
             />
             <div className="absolute bottom-10 left-10 z-20">
                <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20">
                   <p className="text-[10px] text-terracotta-600 font-bold uppercase tracking-widest mb-1">Mano de Obra:</p>
                   <p className="text-sm font-serif text-stone-900 font-bold">100% Auténtico de Contumazá</p>
                </div>
             </div>
          </div>
        </div>
        
        {/* Elemento Decorativo: Blur de color andino sutil */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-andeansky-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-terracotta-50/40 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* Banner de Campaña: Semana Santa (Restaurado por preferencia del usuario) */}
      {!activeCollection && (
        <div className="bg-textilemagenta-900 text-white overflow-hidden relative border-y-8 border-terracotta-500 group">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch justify-between">
            <div className="p-12 md:p-20 flex-1 text-center md:text-left z-10 flex flex-col justify-center">
              <span className="text-wheat-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block animate-in fade-in slide-in-from-left-4 duration-500">Tradición & Fe</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight drop-shadow-md">Colección Semana Santa</h2>
              <p className="text-textilemagenta-100 text-lg mb-10 max-w-xl font-light leading-relaxed">
                Viste tu mesa y tu hogar con nuestra colección especial dedicada a la devoción de nuestro pueblo. Llevemos el arte del tejido a tu celebración santificada.
              </p>
              <div>
                <button 
                  onClick={() => onSelectCollection?.('Semana Santa')} 
                  className="bg-wheat-500 text-textilemagenta-900 px-12 py-5 rounded-full font-bold hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl"
                >
                  Explorar la Colección
                </button>
              </div>
            </div>
            <div className="md:w-1/2 w-full h-[400px] md:h-auto relative overflow-hidden">
              <img 
                src="/images/semanasanta.webp" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                alt="Semana Santa Contumazá Real"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-textilemagenta-900/60 to-textilemagenta-900"></div>
            </div>
          </div>
        </div>
      )}

      {/* Banner de Campaña Secundaria: Herencia Viva */}
      {!activeCollection && (
        <div className="bg-stone-900 text-white overflow-hidden relative border-b-8 border-stone-800 group">
          <div className="max-w-7xl mx-auto px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl">
              <span className="text-terracotta-400 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Legado Contumacino</span>
              <h2 className="text-4xl font-serif font-bold mb-6 italic text-andeansky-100">Tejiendo el Futuro de Nuestra Herencia</h2>
              <p className="text-stone-400 text-lg font-light leading-relaxed mb-0">
                Únete a nuestra misión de preservar el arte del crochet y empoderar a las madres tejedoras del Nido de Cóndores.
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/unete'} 
                className="bg-white text-stone-900 px-10 py-4 rounded-full font-bold hover:bg-terracotta-600 hover:text-white transition-all shadow-xl"
              >
                Postular como Artesana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Colecciones Showcase */}
      {!activeCollection && collections && collections.length > 0 && (
        <div className="bg-stone-50 py-16 border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <span className="text-terracotta-600 font-bold text-xs uppercase tracking-widest block mb-2">Inspiración</span>
                <h2 className="text-3xl font-serif font-bold text-stone-900">Colecciones Oficiales</h2>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar">
              {collections.map(col => (
                <div 
                  key={col.id} 
                  onClick={() => onSelectCollection?.(col.name)}
                  className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition cursor-pointer snap-start group border border-stone-100"
                >
                  <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                    {/* Prioritize DB Image, then Hardcoded Theme Fallback, then Generic T.pe */}
                    {col.image || col.coverImage || col.name.includes('Renacimiento') ? (
                      <img 
                        src={col.image || col.coverImage || (col.name.includes('Renacimiento') ? '/images/renacimiento_authentic.png' : '')} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
                        alt={col.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300 font-serif text-4xl bg-stone-50">T.pe</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-bold text-lg leading-tight mb-1">{col.name}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex justify-between items-center text-sm">
                    <span className="text-stone-500 line-clamp-1 flex-1 pr-4">{col.description || 'Explora esta colección exclusiva'}</span>
                    <LucideArrowRight size={16} className="text-terracotta-500 group-hover:translate-x-1 transition"/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nueva Sección: Gran Banner Herencia de Contumazá (Cinemático & Refinado) */}
      {!activeCollection && (
        <div className="relative h-[700px] md:h-[900px] w-full overflow-hidden flex items-center group bg-stone-900">
          {/* Fondo con Parallax y Gradiente Inteligente */}
          <div className="absolute inset-0 z-0">
             {/* Gradient Overlay for Readability on the Left, Visibility on the Right */}
             <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/40 to-transparent z-10"></div>
             <img 
               src="/images/landmarks/plaza_armas.jpg" 
               className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-[15000ms] ease-out opacity-70" 
               alt="Plaza de Armas de Contumazá Real"
             />
          </div>
          
          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-20 text-white w-full grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-1000">
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[1.5px] w-16 bg-terracotta-500 shadow-[0_0_10px_rgba(202,103,77,0.5)]"></span>
                <span className="text-wheat-400 font-bold tracking-[0.5em] text-xs md:text-sm uppercase drop-shadow-md">Herencia Viva</span>
              </div>
              
              <h2 className="text-7xl md:text-[7.5rem] font-serif font-bold mb-10 leading-[0.95] tracking-tighter text-white">
                El Nido de <br/> 
                <span className="italic text-andeansky-200 font-light drop-shadow-xl underline decoration-terracotta-500/30">Cóndores</span>
              </h2>
              
              <div className="relative p-1 md:p-1.5 mb-12 max-w-xl group/card">
                 {/* Card with Glassmorphism for Depth */}
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-transform duration-700"></div>
                 <div className="relative p-8 md:p-10">
                    <p className="text-xl md:text-2xl text-stone-100 font-light leading-relaxed mb-6">
                      "Bajo el cielo de Contumazá, el tiempo se detiene en cada lazada." Descubre el legado de un pueblo que teje su historia con hilos de sol y niebla.
                    </p>
                    <div className="flex items-center gap-3 text-wheat-500 font-bold uppercase tracking-widest text-[10px] md:text-xs italic">
                       <span className="relative flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wheat-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-wheat-500"></span>
                       </span>
                       Desde la Plaza de Armas hasta el Mirador La Ermita
                    </div>
                 </div>
              </div>

              <div className="flex flex-wrap gap-8">
                <button 
                  onClick={() => window.location.href = '/historia'} 
                  className="bg-stone-50 text-stone-900 px-14 py-6 rounded-full font-bold hover:bg-terracotta-600 hover:text-white transition-all duration-500 transform hover:-translate-y-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-4 group/btn text-lg"
                >
                  Nuestro Origen
                  <LucideArrowRight size={24} className="group-hover/btn:translate-x-3 transition-transform duration-500" />
                </button>
              </div>
            </div>

            {/* Foreground Detail Image Overlay (Suggested by User) */}
            <div className="lg:col-span-5 relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
               <div className="relative aspect-square w-full max-w-[450px] ml-auto">
                  <div className="absolute inset-0 bg-stone-900/20 rounded-[3rem] transform rotate-6 border border-white/10 backdrop-blur-sm -z-10"></div>
                  <img 
                    src="/images/hands.png" 
                    className="w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-700" 
                    alt="Manos artesanas de Contumazá"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-[200px]">
                     <p className="text-[10px] text-terracotta-600 font-bold uppercase tracking-widest mb-1">Mano de Obra</p>
                     <p className="text-sm font-serif text-stone-900 font-bold italic">Arte que trasciende generaciones</p>
                  </div>
               </div>
            </div>
          </div>
          
          {/* Side title with sophisticated opacity mask */}
          <div className="absolute bottom-24 right-0 z-20 hidden xl:block vertical-text select-none pointer-events-none group-hover:translate-x-4 transition-transform duration-1000">
             <div className="text-white/10 text-[160px] font-serif font-black rotate-90 origin-bottom-right uppercase tracking-[0.3em] leading-none">
                CONTUMAZÁ
             </div>
          </div>
        </div>
      )}

      <div id="catalog-section" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          {activeCollection ? (
            <div className="inline-flex items-center gap-4 bg-terracotta-50 px-6 py-3 rounded-2xl mb-4 border border-terracotta-100">
              <div className="text-left">
                <span className="text-terracotta-700 font-bold text-xs uppercase tracking-widest block mb-1">Colección Seleccionada</span>
                <h2 className="text-xl md:text-2xl font-bold text-stone-900 font-serif leading-tight">{activeCollectionData?.name || activeCollection}</h2>
              </div>
              <button 
                onClick={() => onSelectCollection?.(null)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-terracotta-600 hover:bg-terracotta-600 hover:text-white transition shadow-sm ml-4"
                title="Limpiar filtro de colección"
              >
                <LucideX size={20} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-andeansky-700 font-bold text-xs uppercase tracking-widest bg-andeansky-50 px-3 py-1 rounded-full mb-3 inline-block">{activeCategory === 'Todos' ? 'Catálogo General' : activeCategory}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 font-serif">{t('catalog.title')}</h2>
            </>
          )}
        </div>


        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map(p => (
              <div key={p.id} className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer border flex flex-col h-full relative ${p.isPromoted ? 'border-textilemagenta-500 ring-1 ring-textilemagenta-100' : 'border-stone-100'}`} onClick={() => onViewProduct(p)}>
                {p.isPromoted && (
                  <div className="absolute top-3 right-3 z-10 bg-textilemagenta-500 text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <LucideCrown size={12} fill="white"/> {t('catalog.featured')}
                  </div>
                )}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e) => {e.target.src = 'https://placehold.co/400?text=Tapete'}}/>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} className="absolute bottom-3 right-3 bg-white text-andeansky-700 p-3 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition hover:bg-andeansky-700 hover:text-white">
                    <LucidePlus size={20} strokeWidth={3} />
                  </button>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-stone-800 mb-0.5 group-hover:text-andeansky-700 transition">{p.title}</h3>
                  <p className="text-[11px] text-terracotta-600 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                    <LucideUsers size={12} /> Artesana: {p.sellerName || 'Contumazina'}
                  </p>
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4 flex-1 font-light leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-stone-50 mt-auto">
                    <span className="text-xl font-bold text-stone-900">S/ {p.price}</span>
                    <span className="text-xs text-andeansky-700 font-bold bg-andeansky-50 px-2 py-1 rounded-md">{t('catalog.view')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-stone-400">{t('catalog.empty')}</div>
        )}
      </div>

      {/* Sección Impacto Social */}
      <div className="bg-ANDEANGREEN border-t-8 border-terracotta-500 text-stone-800 bg-andeangreen-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-andeangreen-700 font-bold text-xs uppercase tracking-widest block mb-2">Más que una tienda</span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-6 text-andeangreen-900">Tu Compra con Propósito</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">Cada tapete que adquieres en nuestra plataforma digital desencadena una serie de impactos positivos directos en la comunidad de Contumazá.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-andeangreen-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-andeansky-100 text-andeansky-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <LucideHeart size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-andeansky-900">Comercio Justo 100%</h3>
              <p className="text-stone-600">Eliminamos a los intermediarios. Al comprar, tu dinero va directo a las manos de la artesana que dedicó horas a la pieza.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-andeangreen-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-terracotta-100 text-terracotta-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <LucideGlobe2 size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-terracotta-900">Rescate Cultural</h3>
              <p className="text-stone-600">Al darle valor económico internacional al tejido a crochet, incentivamos a que las nuevas generaciones no dejen morir su arte ancestral.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-andeangreen-100 hover:shadow-md transition">
              <div className="w-16 h-16 bg-textilemagenta-100 text-textilemagenta-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <LucideUsers size={32} />
              </div>
              <h3 className="text-xl font-bold font-serif mb-3 text-textilemagenta-900">Empoderamiento</h3>
              <p className="text-stone-600">Generamos independencia económica para decenas de madres rurales que tejen desde sus casas mientras cuidan a sus familias.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
