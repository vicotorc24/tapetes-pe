"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { AnalyticsEvents } from '@/lib/analytics';
import { LucideHeart, LucideGlobe2, LucideUsers, LucideArrowRight, LucideSearch, LucideX, LucidePlus, LucideCrown } from 'lucide-react';
import { getImpactData } from '@/lib/services/impact';

export function HomeView({ products, categories = [], activeCategory, collections = [], activeCollection, onSelectCollection, onSelectCategory, onViewProduct, onAddToCart, onExplore, onCustomOrder, searchTerm = '', onSearch }) {
  const { t } = useTranslation();
  const [impactData, setImpactData] = useState(null);
  
  useEffect(() => {
    getImpactData().then(setImpactData).catch(console.error);
  }, []);
  
  // Lógica de Filtrado Optimizada con Búsqueda
  let filteredProducts = products;
  
  // 1. Filtrar por Colección (Nombre o ID)
  const activeCol = collections.find(c => 
    c.id === activeCollection || 
    c.name.toLowerCase() === activeCollection?.toString().toLowerCase()
  );

  if (activeCol) {
    filteredProducts = filteredProducts.filter(p => 
      p.collectionId === activeCol.id || 
      p.collection === activeCol.name ||
      p.collection === activeCol.id
    );
  } else if (activeCategory && activeCategory !== 'Todos') {
    // 2. Filtrar por Categoría (Robusto: ignora mayúsculas y espacios)
    filteredProducts = filteredProducts.filter(p => 
      p.category?.toString().trim().toLowerCase() === activeCategory.toString().trim().toLowerCase()
    );
  }

  // 3. Filtrar por Término de Búsqueda (Cualquier campo relevante)
  if (searchTerm && searchTerm.trim() !== '') {
    const query = searchTerm.toLowerCase().trim();
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.sellerName && p.sellerName.toLowerCase().includes(query))
    );
  }

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
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
               <button onClick={onExplore} className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-terracotta-600 transition-all duration-300 shadow-2xl transform hover:-translate-y-1">
                 {t('hero.cta')}
               </button>
               <button onClick={() => window.location.href = '/historia'} className="px-12 py-5 rounded-full font-bold text-stone-600 bg-white/50 backdrop-blur-md border border-stone-200 hover:border-stone-900 hover:text-stone-900 transition-all duration-300">
                 {t('hero.heritage')}
               </button>
               {/* Badge de Impacto Permanente en Hero */}
               <div className="flex items-center gap-3 px-6 py-3 bg-andeangreen-50 border border-andeangreen-100 rounded-2xl shadow-sm animate-pulse lg:ml-4">
                  <LucideHeart size={18} className="text-andeangreen-600 fill-andeangreen-600"/>
                  <span className="text-[10px] font-black uppercase tracking-widest text-andeangreen-900">100% Comercio Justo</span>
               </div>
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
              <span className="text-wheat-500 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block animate-in fade-in slide-in-from-left-4 duration-500">{t('catalog.heritage_tag')}</span>
              <h2 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight drop-shadow-md">{t('catalog.heritage_title')}</h2>
              <p className="text-textilemagenta-100 text-lg mb-10 max-w-xl font-light leading-relaxed">
                {t('catalog.heritage_desc')}
              </p>
              <div>
                <button 
                  onClick={() => onSelectCollection?.('Semana Santa')} 
                  className="bg-wheat-500 text-textilemagenta-900 px-12 py-5 rounded-full font-bold hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl"
                >
                  {t('catalog.heritage_cta')}
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
              <span className="text-terracotta-400 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">{t('catalog.impact_tag')}</span>
              <h2 className="text-4xl font-serif font-bold mb-6 italic text-andeansky-100">{t('catalog.impact_title')}</h2>
              <p className="text-stone-400 text-lg font-light leading-relaxed mb-0">
                {t('catalog.impact_desc')}
              </p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.href = '/unete'} 
                className="bg-white text-stone-900 px-10 py-4 rounded-full font-bold hover:bg-terracotta-600 hover:text-white transition-all shadow-xl"
              >
                {t('catalog.impact_cta')}
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

      {/* Reubicando Sección Impacto Social: Mayor Visibilidad antes del Catálogo */}
      {!activeCollection && impactData && (
        <div className="bg-ANDEANGREEN border-y-8 border-terracotta-500 text-stone-800 bg-andeangreen-50 py-24 px-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-andeangreen-200/20 blur-[100px] -z-0"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-andeangreen-700 font-bold text-xs uppercase tracking-widest block mb-2">{impactData.hero?.subtitle || t('impact.section_subtitle')}</span>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-8 tracking-tighter leading-none">{impactData.hero?.title || t('impact.section_title')}</h2>
              <div className="w-24 h-1 bg-andeangreen-300 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">{impactData.hero?.description || t('impact.section_desc')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-10">
              {impactData.stats?.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm text-center border border-andeangreen-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 transform ${idx % 2 === 0 ? 'rotate-3 bg-andeansky-100 text-andeansky-700' : '-rotate-3 bg-terracotta-100 text-terracotta-600'}`}>
                    {idx === 0 && <LucideHeart size={40} />}
                    {idx === 1 && <LucideGlobe2 size={40} />}
                    {idx === 2 && <LucideUsers size={40} />}
                  </div>
                  <h3 className="text-2xl font-bold font-serif mb-4 text-stone-900">{stat.value}</h3>
                  <p className="text-stone-500 leading-relaxed font-light">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
               <button onClick={() => window.location.href = '/impacto'} className="text-andes-neutral-900 font-bold border-b-2 border-andeangreen-300 hover:border-andeangreen-600 transition-all text-sm uppercase tracking-widest pb-1 mt-4">
                  {t('impact.impact_cta') || 'Ver más sobre nuestro compromiso social →'}
               </button>
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
                  {t('hero.origin_btn')}
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

      <div id="catalog-section" className="max-w-6xl mx-auto px-4 py-8 md:py-24 animate-in fade-in duration-700">
        
        {/* Barra de Búsqueda y Navegación de Catálogo */}
        <div className="mb-12 border-b border-stone-100 pb-8">
           <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:max-w-md relative group">
                 <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-terracotta-600 transition-colors" size={20} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => onSearch?.(e.target.value)}
                   placeholder={t('catalog.search_placeholder')} 
                   className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-all text-sm font-medium text-stone-900 placeholder:text-stone-400"
                 />
                 {searchTerm && (
                   <button 
                     onClick={() => onSearch?.('')}
                     className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-200 rounded-full transition-colors text-stone-400"
                   >
                     <LucideX size={16} />
                   </button>
                 )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                 <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mr-2 whitespace-nowrap">{t('catalog.categories_label')}</span>
                 <button 
                    onClick={() => { onSearch?.(''); onSelectCategory?.('Todos'); onSelectCollection?.(null); }} 
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeCategory === 'Todos' && !activeCollection ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 border border-stone-100 hover:border-stone-900 hover:text-stone-900'}`}
                 >
                    {t('catalog.cat_all')}
                 </button>
                 {categories.map(cat => {
                   const isActive = cat.name?.toString().trim().toLowerCase() === activeCategory?.toString().trim().toLowerCase() && !activeCollection;
                   return (
                     <button 
                       key={cat.id} 
                       onClick={() => { onSearch?.(''); onSelectCategory?.(cat.name); onSelectCollection?.(null); }} 
                       className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${isActive ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 border border-stone-100 hover:border-stone-900 hover:text-stone-900'}`}
                     >
                       {cat.name}
                     </button>
                   );
                 })}
              </div>
           </div>
        </div>
        
        {/* Indicadores de Filtros Aplicados (Pills) */}
        {(activeCategory !== 'Todos' || activeCol || searchTerm) && (
          <div className="flex flex-wrap items-center gap-3 mb-8 animate-in slide-in-from-left duration-500">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-2">{t('catalog.filters_label')}</span>
            
            {activeCategory !== 'Todos' && (
              <div className="flex items-center gap-2 bg-stone-100 text-stone-800 px-4 py-2 rounded-full text-xs font-bold border border-stone-200">
                <span className="text-stone-400 uppercase text-[9px] mr-1 font-black">{t('catalog.filter_category')}</span> {activeCategory}
                <button onClick={() => onSelectCategory?.('Todos')} className="hover:text-terracotta-600 transition-colors ml-1">
                  <LucideX size={14} />
                </button>
              </div>
            )}
            
            {activeCol && (
              <div className="flex items-center gap-2 bg-andeansky-50 text-andeansky-900 px-4 py-2 rounded-full text-xs font-bold border border-andeansky-100">
                <span className="text-andeansky-400 uppercase text-[9px] mr-1 font-black">{t('catalog.filter_collection')}</span> {activeCol.name}
                <button onClick={() => onSelectCollection?.(null)} className="hover:text-terracotta-600 transition-colors ml-1">
                  <LucideX size={14} />
                </button>
              </div>
            )}
            
            {searchTerm && (
              <div className="flex items-center gap-2 bg-stone-900 text-stone-100 px-4 py-2 rounded-full text-xs font-bold border border-stone-800">
                <span className="text-stone-500 uppercase text-[9px] mr-1 font-black">{t('catalog.filter_search')}</span> "{searchTerm}"
                <button onClick={() => onSearch?.('')} className="hover:text-terracotta-600 transition-colors ml-1">
                  <LucideX size={14} />
                </button>
              </div>
            )}
            
            {(activeCategory !== 'Todos' || activeCol || searchTerm) && (
              <button 
                onClick={() => { onSelectCategory?.('Todos'); onSelectCollection?.(null); onSearch?.(''); }}
                className="text-[10px] font-bold text-terracotta-600 uppercase tracking-widest hover:underline ml-2"
              >
                {t('catalog.clear_all')}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            {activeCol || searchTerm ? (
              <div className="space-y-4">
                <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  <button onClick={() => { onSelectCollection?.(null); onSearch?.(''); }} className="hover:text-terracotta-600 transition-colors">Catálogo</button>
                  <LucideArrowRight size={10} className="rotate-0" />
                  <span className="text-stone-900">
                    {searchTerm ? `Resultados para: "${searchTerm}"` : `Colección: ${activeCol?.name}`}
                  </span>
                </nav>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight">
                     {searchTerm ? 'Búsqueda' : activeCol?.name}
                   </h2>
                   <span className="text-sm font-bold text-stone-400 italic">({filteredProducts.length} {filteredProducts.length === 1 ? 'piezaúnica' : 'piezas'})</span>
                </div>
                {activeCol && <p className="text-stone-500 max-w-2xl font-light italic text-lg leading-relaxed">{activeCol.description || 'Una selección de piezas exclusivas tejidas con alma por nuestras maestras artesanas.'}</p>}
              </div>
            ) : (
              <>
                <span className="text-andeansky-700 font-bold text-[11px] uppercase tracking-[0.3em] bg-andeansky-50 px-4 py-1.5 rounded-full mb-6 inline-block leading-none border border-andeansky-100 shadow-sm animate-in zoom-in duration-500">
                   {activeCategory === 'Todos' ? 'Nuestra Curaduría' : activeCategory}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 tracking-tighter leading-none mb-4">{t('catalog.title')}</h2>
                <div className="w-24 h-1.5 bg-terracotta-500 rounded-full mb-4"></div>
              </>
            )}
          </div>
          
          {(activeCol || searchTerm) && (
            <button 
               onClick={() => { onSelectCollection?.(null); onSearch?.(''); }}
               className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-terracotta-600 transition-all shadow-xl shadow-stone-900/10 transform active:scale-95 group"
            >
               <LucideX size={18} className="group-hover:rotate-90 transition-transform duration-300" />
               {t('catalog.clear_filters')}
            </button>
          )}
        </div>


        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProducts.map(p => (
              <div key={p.id} className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border flex flex-col h-full relative ${p.isPromoted ? 'border-terracotta-200 ring-4 ring-terracotta-50' : 'border-stone-100 hover:border-terracotta-100'}`} onClick={() => onViewProduct(p)}>
                {p.isPromoted && (
                  <div className="absolute top-4 right-4 z-10 bg-terracotta-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg uppercase tracking-widest">
                    <LucideCrown size={12} fill="white"/> {t('catalog.featured')}
                  </div>
                )}
                <div className="relative aspect-square overflow-hidden bg-stone-50">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" onError={(e) => {e.target.src = 'https://placehold.co/400?text=Tapete'}}/>
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500"></div>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} className="absolute bottom-6 right-6 bg-white text-stone-900 p-4 rounded-2xl shadow-2xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-stone-900 hover:text-white transform active:scale-90">
                    <LucidePlus size={24} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-1 group-hover:text-terracotta-600 transition-colors">{p.title}</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-terracotta-500 rounded-full"></span>
                       {p.sellerName || t('catalog.artisan_default')}
                       <span className="ml-auto flex items-center gap-1 text-[8px] text-andeangreen-600 font-black px-2 py-0.5 bg-andeangreen-50 rounded-full border border-andeangreen-100">
                          <LucideHeart size={8} className="fill-andeangreen-600"/> {t('impact.fair_trade_badge') || 'JUSTO'}
                       </span>
                    </p>
                  </div>
                  <p className="text-sm text-stone-500 line-clamp-2 mb-6 flex-1 font-light leading-relaxed italic">"{p.description}"</p>
                  <div className="flex items-center justify-between pt-6 border-t border-stone-50 mt-auto">
                    <div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">{t('catalog.origin_price')}</p>
                      <span className="text-2xl font-black text-stone-900">S/ {p.price}</span>
                    </div>
                    <span className="text-[10px] text-terracotta-600 font-black uppercase tracking-widest bg-terracotta-50 px-4 py-2 rounded-xl group-hover:bg-terracotta-600 group-hover:text-white transition-all">{t('catalog.view_detail')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
            <div className="w-24 h-24 bg-stone-100 rounded-[2rem] flex items-center justify-center text-stone-300 mb-8 transform -rotate-6">
               <LucidePlus size={48} className="rotate-45" />
            </div>
            <h3 className="text-3xl font-serif font-black text-stone-900 mb-4 italic">
              {searchTerm ? `${t('catalog.no_search')} "${searchTerm}"` : t('catalog.future')}
            </h3>
            <p className="text-stone-500 max-w-md mb-10 font-light text-lg">
              {searchTerm 
                ? 'Intenta con términos más generales como "mantel", "mesa" o busca el nombre de una artesana.' 
                : 'Estamos tejiendo nuevas piezas para esta colección especial. Mientras tanto, te invitamos a explorar nuestra curaduría completa.'}
            </p>
            <button 
              onClick={() => { onSelectCollection?.(null); onSearch?.(''); }}
              className="bg-stone-900 text-white px-12 py-5 rounded-full font-bold hover:bg-terracotta-600 transition-all shadow-2xl flex items-center gap-4 group"
            >
              {searchTerm ? 'Limpiar Búsqueda' : 'Ver Todo el Catálogo'}
              <LucideArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
