"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { AnalyticsEvents } from '@/lib/analytics';
import { LucideHeart, LucideGlobe2, LucideUsers, LucideArrowRight, LucideSearch, LucideX, LucidePlus, LucideCrown, LucidePalette, LucideSprout, LucideMountain } from 'lucide-react';
import { getImpactData } from '@/lib/services/impact';
import { IconTurismo, IconAlimentos, IconArtesania, IconTodos } from './TerritoryIcons';

export function HomeView({ 
  products, 
  categories = [], 
  activeCategory, 
  sectors = [], 
  brands = [], 
  activeSector, 
  onSelectSector, 
  onSelectCategory, 
  onViewProduct, 
  onAddToCart, 
  onExplore, 
  onCustomOrder, 
  searchTerm = '', 
  onSearch 
}) {
  const { t } = useTranslation();
  const [impactData, setImpactData] = useState(null);
  
  useEffect(() => {
    getImpactData().then(setImpactData).catch(console.error);
    
    // Intersection Observer para Scroll Reveals Premium
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
  
  // Lógica de Filtrado Optimizada con Búsqueda
  let filteredProducts = products;
  
  // 1. Filtrar por Sector (Omni-Filtro Resiliente)
  if (activeSector) {
    const activeSectorObj = sectors.find(s => s.id === activeSector);
    const activeName = activeSectorObj?.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '';
    
    filteredProducts = filteredProducts.filter(p => {
      // Detección de formato del sector en el producto (String, ID o Objeto)
      const pSector = p.sector;
      const pSectorId = typeof pSector === 'object' ? pSector.id : pSector;
      const pSectorName = typeof pSector === 'object' ? pSector.name : pSector?.toString();
      
      const pSectorStrNormalized = pSectorName?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || '';
      
      // 1. Coincidencia por ID técnico
      if (pSectorId === activeSector) return true;
      
      // 2. Coincidencia por Nombre Normalizado
      if (pSectorStrNormalized === activeName) return true;
      
      // 3. Soporte Legacy Especial
      if (activeName.includes('artesania') && (pSectorStrNormalized === 'textile' || pSectorId === 'textile')) return true;
      if ((activeName.includes('alimento') || activeName.includes('agro')) && (pSectorStrNormalized === 'food' || pSectorId === 'food')) return true;
      
      return false;
    });
  }

  // 2. Filtrar por Categoría (Robusto)
  if (activeCategory && activeCategory !== 'Todos') {
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
      <div className="relative min-h-[90vh] flex items-center bg-stone-900 overflow-hidden group">
        {/* Background Layer with Soft Parallax & Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900 z-10"></div>
          <img 
            src="/images/hero_real.jpg" 
            className="w-full h-full object-cover origin-center scale-110 group-hover:scale-105 transition-transform duration-[10000ms] ease-out opacity-80" 
            alt="Cerro El Calvario Contumazá Real"
          />
        </div>

        <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-20 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 animate-reveal-up">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
               <span className="h-[1px] w-12 bg-terracotta-500"></span>
               <span className="text-terracotta-400 font-bold text-[10px] md:text-xs uppercase tracking-widest-plus block drop-shadow-sm">{t('hero.subtitle')}</span>
            </div>
            
            <h1 className="text-7xl lg:text-[6.5rem] text-white font-serif leading-[0.9] mb-10 tracking-tighter text-balance">
              {t('hero.title1')} <br/> 
              <span className="text-andeansky-200 italic font-light opacity-95">{t('hero.title2')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-stone-200 leading-relaxed mb-14 font-light max-w-xl mx-auto lg:mx-0 opacity-80">
              {t('hero.desc')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center">
               <button onClick={onExplore} className="bg-white text-stone-900 px-14 py-6 rounded-full font-bold hover:bg-terracotta-600 hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:-translate-y-2 hover:scale-105 active:scale-95 text-lg">
                 {t('hero.cta')}
               </button>
               
               <button onClick={() => window.location.href = '/historia'} className="group flex items-center gap-4 text-white font-bold tracking-widest text-xs uppercase hover:text-terracotta-400 transition-all">
                 <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-terracotta-500 transition-all">
                    <LucideArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </span>
                 {t('hero.heritage')}
               </button>
            </div>
          </div>

          {/* Floating Artisan Detail - Depth Element */}
          <div className="relative hidden lg:block animate-reveal-up delay-300">
             <div className="relative aspect-[4/5] w-full max-w-[450px] ml-auto rounded-[4rem] overflow-hidden shadow-soft-2xl border border-white/10 group/card">
                <div className="absolute inset-0 bg-stone-900/20 z-10 group-hover/card:bg-stone-900/0 transition-all duration-700"></div>
                <img 
                  src="/images/showcase_hero.png" 
                  className="w-full h-full object-cover scale-110 group-hover/card:scale-100 transition-transform duration-[3000ms] ease-out" 
                  alt="Vitrina de productos de Contumazá"
                />
                
                {/* Rotating Quality Seal 🎖️ */}
                <div className="absolute -top-12 -right-12 w-48 h-48 z-20 animate-spin-slow pointer-events-none opacity-90">
                   <svg viewBox="0 0 200 200" className="w-full h-full">
                      <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0 " fill="transparent"/>
                      <text className="fill-white/80 font-bold uppercase tracking-[0.2em] text-[13px]">
                         <textPath xlinkHref="#circlePath">
                            Original de Contumazá • Tradición Viva • 100% Hecho a Mano • 
                         </textPath>
                      </text>
                   </svg>
                </div>

                <div className="absolute bottom-10 left-10 z-20">
                   <div className="glass-premium px-8 py-6 rounded-3xl">
                      <p className="text-[10px] text-terracotta-400 font-bold uppercase tracking-widest-plus mb-2">{t('hero.showcase_label')}</p>
                      <p className="text-lg font-serif text-white font-bold leading-none">{t('hero.showcase_desc')}</p>
                   </div>
                </div>
             </div>
             
             {/* Decorative Elements */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-terracotta-500/20 blur-[80px] -z-10"></div>
          </div>
        </div>
        
        {/* Cinematic Blur Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-andeansky-500/10 rounded-full blur-[150px] -z-0"></div>
      </div>

      {/* Banner de Campaña Secundaria: Herencia Viva */}
      {!activeCategory && (
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

      {/* Sección Impacto Social: Versión Compacta & Narrativa */}
      {impactData && (
        <div className="bg-andeangreen-50/40 py-8 md:py-12 px-4 overflow-hidden relative border-y border-andeangreen-100/30">
          {/* Acentos de luz sutiles */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-andeangreen-200/20 rounded-full blur-[100px] -z-0"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 box-border">
            <div className="text-center mb-6 md:mb-8">
              <div className="flex items-center justify-center gap-3 mb-3">
                 <span className="h-[1px] w-6 bg-andeangreen-300"></span>
                 <span className="text-andeangreen-800 font-black text-[9px] md:text-xs uppercase tracking-[0.3em] opacity-70">{t('impact.section_subtitle')}</span>
                 <span className="h-[1px] w-6 bg-andeangreen-300"></span>
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-black text-stone-900 mb-4 tracking-tighter leading-none">
                {t('impact.section_title')}
              </h2>
              <p className="text-base text-stone-600 max-w-2xl mx-auto font-light leading-relaxed mb-0">
                {t('impact.section_desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {impactData.stats?.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="group relative">
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-lg shadow-andeangreen-200/10 -z-10 group-hover:bg-white transition-all duration-700"></div>
                  
                  <div className="p-8 md:p-10 text-center h-full flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-andeangreen-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-andeangreen-600 group-hover:text-white transition-all duration-500 transform rotate-2 group-hover:rotate-0 border border-andeangreen-100 shadow-sm text-andeangreen-700">
                      {idx === 0 && <LucideHeart size={28} strokeWidth={1.5} />}
                      {idx === 1 && <LucideGlobe2 size={28} strokeWidth={1.5} />}
                      {idx === 2 && <LucideUsers size={28} strokeWidth={1.5} />}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tighter tabular-nums mb-1">
                        {stat.value}
                      </h3>
                      <div className="w-8 h-1 bg-andeangreen-300 mx-auto rounded-full group-hover:w-12 group-hover:bg-andeangreen-600 transition-all duration-700"></div>
                      <p className="text-stone-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] leading-[1.4] pt-1">
                        {t(`impact.stat${idx + 1}_label`) || stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 md:mt-10 text-center">
               <button 
                onClick={() => window.location.href = '/impacto'} 
                className="group inline-flex items-center gap-4 text-stone-900 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all py-3 px-8 border border-stone-200 rounded-full hover:bg-andeangreen-600 hover:border-andeangreen-600 active:scale-95 shadow-sm"
               >
                  {t('impact.impact_cta') || 'Ver Compromiso Social'}
                  <LucideArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
               </button>
            </div>
          </div>
        </div>
      )}

      {/* NUEVA SECCIÓN: Tierra del Buen Trigo (Orgullo Agrícola) */}
      <div className="relative h-[650px] md:h-[800px] w-full overflow-hidden flex items-center group bg-stone-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent z-10 transition-opacity duration-1000 group-hover:opacity-60"></div>
          <img 
            src="/images/trilla_contumaza_real.png" 
            className="w-full h-full object-cover object-center scale-110 group-hover:scale-100 transition-transform duration-[15000ms] ease-out opacity-90" 
            alt="Auténtica Trilla en las Eras de Contumazá"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-20 text-white w-full text-center">
          <div className="flex flex-col items-center reveal-on-scroll">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-8 bg-wheat-500"></span>
              <span className="text-wheat-400 font-bold tracking-widest-plus text-[10px] md:text-xs uppercase bg-stone-950/50 backdrop-blur-md px-6 py-2 rounded-full border border-wheat-500/30">
                {t('banner.wheat_badge')}
              </span>
              <span className="h-[1px] w-8 bg-wheat-500"></span>
            </div>
            
            <h2 className="text-6xl md:text-[7.5rem] font-serif font-black mb-8 leading-none tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              {t('banner.wheat_title')}
            </h2>
            
            <p className="text-xl md:text-2xl text-stone-100 font-light leading-relaxed mb-12 max-w-3xl mx-auto drop-shadow-lg italic">
              {t('banner.wheat_desc')}
            </p>
            
            <div className="glass-premium px-10 py-6 rounded-[2rem] inline-flex items-center gap-6 animate-float">
               <div className="p-3 bg-wheat-500/20 rounded-2xl">
                  <LucideSprout size={32} className="text-wheat-400" />
               </div>
               <div className="text-left">
                  <p className="text-[10px] text-wheat-500 font-black uppercase tracking-widest mb-1">{t('banner.wheat_label')}</p>
                  <p className="text-lg font-serif text-white font-bold leading-none italic">Contumazá, Cajamarca</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nueva Sección: Gran Banner Herencia de Contumazá (Cinemático & Refinado) */}
      { (
        <div className="relative h-[700px] md:h-[950px] w-full overflow-hidden flex items-center group bg-stone-950">
          {/* Fondo con Parallax y Gradiente Inteligente */}
          <div className="absolute inset-0 z-0">
             {/* Gradient Overlay for Readability on the Left, Visibility on the Right */}
             <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/60 to-transparent z-10 transition-opacity duration-1000 group-hover:opacity-80"></div>
             <img 
               src="/images/plaza_real.jpg" 
               className="w-full h-full object-cover object-center scale-115 group-hover:scale-105 transition-transform duration-[20000ms] ease-out opacity-60" 
               alt="Plaza de Armas de Contumazá Real"
             />
          </div>
          
          <div className="max-w-7xl mx-auto px-8 lg:px-16 relative z-20 text-white w-full grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 reveal-on-scroll">
              <div className="flex items-center gap-6 mb-10">
                <span className="h-[2px] w-20 bg-terracotta-500 shadow-[0_0_15px_rgba(202,103,77,0.8)] animate-pulse"></span>
                <span className="text-wheat-300 font-bold tracking-widest-plus text-xs md:text-sm uppercase drop-shadow-lg">{t('banner.heritage_badge')}</span>
              </div>
              
              <h2 className="text-7xl md:text-[8.5rem] font-serif font-bold mb-12 leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
                {t('banner.title_nest')} <br/> 
                <span className="italic text-andeansky-200 font-light underline decoration-terracotta-500/40 decoration-4 underline-offset-8">{t('banner.title_condors')}</span>
              </h2>
              
              <div className="relative p-1 md:p-1.5 mb-12 max-w-xl group/card">
                 {/* Card with Glassmorphism for Depth */}
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl transition-transform duration-700"></div>
                 <div className="relative p-8 md:p-10">
                    <p className="text-xl md:text-2xl text-stone-100 font-light leading-relaxed mb-6">
                      {t('banner.desc')}
                    </p>
                    <div className="flex items-center gap-3 text-wheat-500 font-bold uppercase tracking-widest text-[10px] md:text-xs italic">
                       <span className="relative flex h-3 w-3">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wheat-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-3 w-3 bg-wheat-500"></span>
                       </span>
                       {t('banner.location_badge')}
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
            <div className="lg:col-span-5 relative hidden lg:block reveal-on-scroll delay-500">
               <div className="relative aspect-square w-full max-w-[500px] ml-auto">
                  <div className="absolute inset-0 bg-stone-900/30 rounded-[4rem] transform rotate-6 border border-white/10 backdrop-blur-md shadow-2xl -z-10"></div>
                  <img 
                    src="/images/ermita_real.jpg" 
                    className="w-full h-full object-cover rounded-[4rem] shadow-2xl border-2 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-1000 ease-in-out cursor-crosshair" 
                    alt="Paisaje Real de Contumazá"
                  />
                  <div className="absolute -bottom-10 -left-10 glass-premium p-8 rounded-3xl shadow-soft-2xl max-w-[240px] animate-float">
                     <p className="text-[10px] text-terracotta-400 font-bold uppercase tracking-widest mb-2">{t('banner.hands_label')}</p>
                     <p className="text-lg font-serif text-white font-bold italic leading-tight">{t('banner.hands_desc')}</p>
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

      {/* NUEVA SECCIÓN: Marcador de Marcas con Propósito */}
      {brands && brands.length > 0 && (
        <div className="bg-stone-50 py-20 overflow-hidden border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="text-terracotta-600 font-bold text-[10px] uppercase tracking-[0.3em] mb-2 block">{t('catalog.brands_title')}</span>
                <h2 className="text-3xl md:text-4xl font-serif font-black text-stone-900 leading-none">Identidades locales</h2>
              </div>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar snap-x">
              {brands.map((brand, idx) => (
                <div key={brand.id || idx} className="min-w-[280px] bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm hover:shadow-xl transition-all group snap-start cursor-pointer" onClick={() => onSearch?.(brand.brandName)}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-50 border-2 border-white shadow-md">
                      <img 
                        src={brand.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${brand.brandName}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt={brand.brandName}
                      />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-xl text-stone-900 leading-none mb-1">{brand.brandName}</h4>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">{brand.location || 'Contumazá'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-stone-500 italic line-clamp-2 mb-6">
                    {brand.bio || "Productor destacado de la región de Contumazá."}
                  </p>
                  <button className="text-andeansky-700 font-black text-[10px] uppercase tracking-widest border-b border-andeansky-100 group-hover:border-andeansky-700 transition-all pb-1">
                    Ver Catálogo de Marca →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div id="catalog-section" className="max-w-6xl mx-auto px-4 py-8 md:py-24 ">
        
          {/* NUEVO: Sector Explorer Bar (Navegación Territorial) */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-[1px] w-12 bg-stone-200"></span>
              <span className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.4em]">{t('catalog.explore_sectors')}</span>
            </div>
            
            {/* Skeleton mientras cargan los sectores */}
            {sectors.length === 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-8 rounded-[3.2rem] bg-stone-100 animate-pulse flex flex-col items-center gap-5">
                    <div className="w-20 h-20 rounded-3xl bg-stone-200" />
                    <div className="h-3 w-20 rounded-full bg-stone-200" />
                  </div>
                ))}
              </div>
            )}

            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500 ${sectors.length === 0 ? 'hidden' : ''}`}>
              <button 
                onClick={() => { onSelectSector?.(null); onSelectCategory?.('Todos'); onSearch?.(''); }}
                className={`group p-8 rounded-[3.2rem] border-2 transition-all duration-700 flex flex-col items-center text-center relative overflow-hidden ${!activeSector ? 'bg-stone-900 border-stone-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] scale-105 z-10' : 'bg-white/60 backdrop-blur-md border-stone-100/50 hover:border-stone-200 hover:bg-white shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
              >
                {!activeSector && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 animate-pulse transition-opacity" />}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-700 ${!activeSector ? 'bg-white/10 text-white shadow-inner scale-110' : 'bg-stone-50 text-stone-300 group-hover:text-stone-900 group-hover:bg-stone-100 group-hover:rotate-12'}`}>
                  <IconTodos className="w-12 h-12" color={!activeSector ? '#FFF' : '#A8A29E'} />
                </div>
                <span className={`text-[12px] font-black uppercase tracking-[0.3em] transition-colors ${!activeSector ? 'text-white' : 'text-stone-400 group-hover:text-stone-900'}`}>{t('catalog.cat_all')}</span>
                <div className={`absolute bottom-4 w-12 h-1 rounded-full transition-all duration-500 ${!activeSector ? 'bg-terracotta-500' : 'bg-transparent'}`} />
              </button>
              
              {sectors.map(sec => {
                const isActive = activeSector?.toLowerCase() === sec.id?.toLowerCase() || activeSector === sec.name;
                
                // Mapeo serio de Colores (Sincronizado con Admin SectorManager)
                const getSectorHex = (colorName) => {
                  const map = {
                    'stone': '#57534e',   // Stone-600
                    'orange': '#ea580c',  // Orange-600
                    'purple': '#9333ea',  // Purple-600
                    'emerald': '#059669', // Emerald-600
                    'blue': '#2563eb',    // Blue-600
                    'rose': '#e11d48',    // Rose-600
                    'terracotta': '#a32a18' // Especial: Color de Marca Base
                  };
                  // Si el color ya es un Hexadecimal (empieza con #), lo usamos directamente
                  if (colorName?.startsWith('#')) return colorName;
                  return map[colorName?.toLowerCase()] || '#8b5e3c';
                };

                const currentHex = getSectorHex(sec.color);

                // Mapeo serio de Iconos Territoriales (Súper Robusto)
                const getTerritorialIcon = (secName) => {
                  const normalizedName = (secName || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const iconColor = isActive ? currentHex : '#A8A29E';
                  
                  if (normalizedName.includes('artesania') || normalizedName.includes('tejido')) 
                    return <IconArtesania className="w-10 h-10" color={iconColor} />;
                  if (normalizedName.includes('alimento') || normalizedName.includes('agro') || normalizedName.includes('dulce') || normalizedName.includes('miel')) 
                    return <IconAlimentos className="w-10 h-10" color={iconColor} />;
                  if (normalizedName.includes('turismo') || normalizedName.includes('hotel') || normalizedName.includes('viaje')) 
                    return <IconTurismo className="w-10 h-10" color={iconColor} />;
                    
                  return sec.icon || '📦';
                };

                return (
                  <button 
                    key={sec.id}
                    onClick={() => { onSelectSector?.(sec.id); onSelectCategory?.('Todos'); onSearch?.(''); }}
                    className={`group p-8 rounded-[3.2rem] border-2 transition-all duration-700 flex flex-col items-center text-center relative overflow-hidden ${isActive ? 'bg-white shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] scale-105 z-10 ring-8 ring-stone-900/5' : 'bg-white/60 backdrop-blur-md border-stone-100/50 hover:border-stone-200 hover:bg-white shadow-sm hover:shadow-xl hover:-translate-y-1'}`}
                    style={{ borderColor: isActive ? currentHex : '' }}
                  >
                    {isActive && <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12 opacity-10 animate-pulse" style={{ backgroundColor: currentHex }} />}
                    <div 
                      className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-700 ${isActive ? 'shadow-xl scale-110' : 'bg-stone-50 text-stone-300 group-hover:text-stone-900'}`}
                      style={{ backgroundColor: isActive ? `${currentHex}15` : '' }}
                    >
                      {getTerritorialIcon(sec.name)}
                    </div>
                    <span className={`text-[12px] font-black uppercase tracking-[0.3em] transition-colors ${isActive ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-900'}`}>{sec.name}</span>
                    <div className="absolute bottom-4 w-12 h-1 rounded-full transition-all duration-500 scale-x-0 group-hover:scale-x-100" style={{ backgroundColor: currentHex, opacity: isActive ? 1 : 0.3 }} />
                  </button>
                );
              })}
            </div>
          </div>

        {/* Barra de Búsqueda y Navegación de Catálogo */}
        <div className="mb-12 border-b border-stone-100 pb-8">
           <div className="flex flex-col gap-4">
              <div className="w-full md:max-w-xl relative group">
                 <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-terracotta-600 transition-colors" size={20} />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => onSearch?.(e.target.value)}
                   placeholder={t('catalog.search_placeholder')} 
                                       className="w-full pl-14 pr-12 py-5 bg-stone-50 border-2 border-stone-100 rounded-[2.5rem] focus:outline-none focus:ring-8 focus:ring-stone-900/5 focus:border-stone-900 transition-all duration-500 text-base font-medium text-stone-900 placeholder:text-stone-300 shadow-sm focus:shadow-2xl"

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
              <div className="flex items-center flex-wrap gap-1.5 w-full">
                 <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mr-2 whitespace-nowrap">{t('catalog.categories_label')}</span>
                 <button 
                    onClick={() => { onSearch?.(''); onSelectCategory?.('Todos'); }} 
                    className={`px-5 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-500 whitespace-nowrap uppercase ${activeCategory === 'Todos' ? 'bg-stone-900 text-white border border-transparent shadow-md' : 'bg-white text-stone-400 border border-stone-100 hover:border-stone-900 hover:text-stone-900'}`}
                 >
                    {t('catalog.cat_all')}
                 </button>
                 {categories.filter(cat => !activeSector || cat.sector === activeSector || cat.sector?.toLowerCase() === activeSector.toLowerCase()).map(cat => {
                   const isActive = cat.name?.toString().trim().toLowerCase() === activeCategory?.toString().trim().toLowerCase();
                   return (
                     <button 
                       key={cat.id} 
                       onClick={() => { onSearch?.(''); onSelectCategory?.(cat.name); }} 
                       className={`px-5 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-500 whitespace-nowrap uppercase ${isActive ? 'bg-stone-900 text-white border border-transparent shadow-md' : 'bg-white text-stone-400 border border-stone-100 hover:border-stone-900 hover:text-stone-900'}`}
                     >
                       {cat.name}
                     </button>
                   );
                 })}
              </div>
           </div>
        </div>
        
        {/* Indicadores de Filtros Aplicados (Pills) */}
        {(activeCategory !== 'Todos' || searchTerm) && (
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
            
            {searchTerm && (
              <div className="flex items-center gap-2 bg-stone-900 text-stone-100 px-4 py-2 rounded-full text-xs font-bold border border-stone-800">
                <span className="text-stone-500 uppercase text-[9px] mr-1 font-black">{t('catalog.filter_search')}</span> "{searchTerm}"
                <button onClick={() => onSearch?.('')} className="hover:text-terracotta-600 transition-colors ml-1">
                  <LucideX size={14} />
                </button>
              </div>
            )}
            
            {(activeCategory !== 'Todos' || searchTerm) && (
              <button 
                onClick={() => { onSelectCategory?.('Todos'); onSearch?.(''); }}
                className="text-[10px] font-bold text-terracotta-600 uppercase tracking-widest hover:underline ml-2"
              >
                {t('catalog.clear_all')}
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            {searchTerm ? (
              <div className="space-y-4">
                <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-stone-400">
                  <button onClick={() => { onSearch?.(''); }} className="hover:text-terracotta-600 transition-colors">Catálogo</button>
                  <LucideArrowRight size={10} className="rotate-0" />
                  <span className="text-stone-900">
                    Resultados para: "{searchTerm}"
                  </span>
                </nav>
                <div className="flex items-baseline gap-4">
                   <h2 className="text-4xl md:text-5xl font-serif font-black text-stone-900 tracking-tight">
                     Búsqueda
                   </h2>
                   <span className="text-sm font-bold text-stone-400 italic">({filteredProducts.length} {filteredProducts.length === 1 ? 'piezaúnica' : 'piezas'})</span>
                </div>
              </div>
            ) : (
              <>
                <span className="text-andeansky-700 font-bold text-[11px] uppercase tracking-[0.3em] bg-andeansky-50 px-4 py-1.5 rounded-full mb-6 inline-block leading-none border border-andeansky-100 shadow-sm transition-all duration-300">
                   {activeCategory === 'Todos' ? 'Nuestra Curaduría' : activeCategory}
                </span>
                <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 tracking-tighter leading-none mb-4">{t('catalog.title')}</h2>
                <div className="w-24 h-1.5 bg-terracotta-500 rounded-full mb-4"></div>
              </>
            )}
          </div>
          
          {searchTerm && (
            <button 
               onClick={() => { onSearch?.(''); }}
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
              <div key={p.id} className={`group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-soft-2xl transition-shadow duration-300 cursor-pointer border flex flex-col h-full relative ${p.isPromoted ? 'border-terracotta-200 ring-8 ring-terracotta-50/50' : 'border-stone-100 hover:border-terracotta-100'}`} onClick={() => onViewProduct(p)}>
                {p.isPromoted && (
                  <div className="absolute top-6 right-6 z-10 bg-terracotta-600 text-white text-[10px] font-black px-5 py-2 rounded-full flex items-center gap-2 shadow-xl uppercase tracking-widest-plus animate-pulse">
                    <LucideCrown size={12} fill="white"/> {t('catalog.featured')}
                  </div>
                )}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-opacity duration-300" onError={(e) => {e.target.src = 'https://placehold.co/400?text=Producto'}}/>
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-all duration-700"></div>
                  
                  {/* Floating Action Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div onClick={(e) => { e.stopPropagation(); onAddToCart(p); }} className="bg-white text-stone-900 w-14 h-14 rounded-2xl shadow-soft-22xl flex items-center justify-center hover:bg-terracotta-600 hover:text-white transition-all transform hover:rotate-12 active:scale-90">
                        <LucidePlus size={28} strokeWidth={2.5} />
                      </div>
                  </div>
                </div>
                
                <div className="p-10 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2 group-hover:text-terracotta-600 transition-colors leading-tight">{p.title}</h3>
                    <div className="flex items-center gap-2">
                       <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest-plus flex items-center gap-2">
                          <span className="w-2 h-[1px] bg-terracotta-500"></span>
                          {p.brandName || p.sellerName || t('catalog.artisan_default')}
                       </p>
                       <span className="ml-auto flex items-center gap-1.5 text-[8px] text-andeangreen-600 font-black px-3 py-1 bg-andeangreen-50 rounded-lg border border-andeangreen-100 shadow-sm uppercase tracking-tighter">
                          <LucideHeart size={10} className="fill-andeangreen-600"/> {t('impact.fair_trade_badge') || 'ORIGINAL'}
                       </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-stone-500 line-clamp-2 mb-8 flex-1 font-light leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">"{p.description}"</p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-stone-100 mt-auto">
                    <div>
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest-plus mb-1">{t('catalog.origin_price')}</p>
                      <span className="text-3xl font-black text-stone-900 tracking-tighter">S/ {p.price}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                       <LucideArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
            <div className="w-32 h-32 bg-stone-50 rounded-[3rem] flex items-center justify-center mb-8 transform -rotate-6 shadow-inner border border-stone-100">
               <div className="text-stone-400 opacity-20">
                 {(() => {
                   const sec = sectors.find(s => s.id === activeSector || s.name === activeSector);
                   const normalizedName = (sec?.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                   const colorFallback = '#A8A29E';
                   if (normalizedName.includes('artesania')) return <IconArtesania className="w-24 h-24" color={colorFallback} />;
                   if (normalizedName.includes('alimento') || normalizedName.includes('agro')) return <IconAlimentos className="w-24 h-24" color={colorFallback} />;
                   if (normalizedName.includes('turismo') || normalizedName.includes('hotel')) return <IconTurismo className="w-24 h-24" color={colorFallback} />;
                   return <LucidePlus size={64} strokeWidth={1} />;
                 })()}
               </div>
            </div>
            <h3 className="text-4xl font-serif font-black text-stone-900 mb-4 tracking-tighter">
              {searchTerm ? `${t('catalog.no_search')} "${searchTerm}"` : t('catalog.coming_soon')}
            </h3>
            <p className="text-stone-400 max-w-sm mb-12 font-light text-xl leading-relaxed italic">
              {searchTerm 
                ? 'Intenta con términos más generales como "miel", "mermelada" o busca el nombre de una marca.' 
                : t('catalog.coming_soon_desc')}
            </p>
            <button 
              onClick={() => { onSelectSector?.(null); onSelectCollection?.(null); onSearch?.(''); }}
              className="bg-stone-900 text-white px-14 py-6 rounded-full font-bold hover:bg-terracotta-600 transition-all shadow-2xl flex items-center gap-4 group text-lg"
            >
              {searchTerm ? 'Limpiar Búsqueda' : 'Ver otros tesoros'}
              <LucideArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
