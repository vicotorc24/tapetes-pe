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
                  <span className="text-[10px] font-black uppercase tracking-widest text-andeangreen-900">{t('hero.fair_trade_badge')}</span>
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
                   <p className="text-[10px] text-terracotta-600 font-bold uppercase tracking-widest mb-1">{t('hero.workforce_label')}</p>
                   <p className="text-sm font-serif text-stone-900 font-bold">{t('hero.authentic_label')}</p>
                </div>
             </div>
          </div>
        </div>
        
        {/* Elemento Decorativo: Blur de color andino sutil */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-andeansky-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-terracotta-50/40 rounded-full blur-[100px] pointer-events-none"></div>
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

      {/* Reubicando Sección Impacto Social: Mayor Visibilidad antes del Catálogo */}
      {impactData && (
        <div className="bg-ANDEANGREEN border-y-8 border-terracotta-500 text-stone-800 bg-andeangreen-50 py-24 px-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-andeangreen-200/20 blur-[100px] -z-0"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-andeangreen-700 font-bold text-xs uppercase tracking-widest block mb-2">{t('impact.section_subtitle')}</span>
              <h2 className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-8 tracking-tighter leading-none">{t('impact.section_title')}</h2>
              <div className="w-24 h-1 bg-andeangreen-300 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-stone-600 max-w-2xl mx-auto font-light leading-relaxed">{t('impact.section_desc')}</p>
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
                  <p className="text-stone-500 leading-relaxed font-light">{t(`impact.stat${idx + 1}_label`) || stat.label}</p>
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
      { (
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
                <span className="text-wheat-400 font-bold tracking-[0.5em] text-xs md:text-sm uppercase drop-shadow-md">{t('banner.heritage_badge')}</span>
              </div>
              
              <h2 className="text-7xl md:text-[7.5rem] font-serif font-bold mb-10 leading-[0.95] tracking-tighter text-white">
                {t('banner.title_nest')} <br/> 
                <span className="italic text-andeansky-200 font-light drop-shadow-xl underline decoration-terracotta-500/30">{t('banner.title_condors')}</span>
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
            <div className="lg:col-span-5 relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-300">
               <div className="relative aspect-square w-full max-w-[450px] ml-auto">
                  <div className="absolute inset-0 bg-stone-900/20 rounded-[3rem] transform rotate-6 border border-white/10 backdrop-blur-sm -z-10"></div>
                  <img 
                    src="/images/hands.png" 
                    className="w-full h-full object-cover rounded-[3rem] shadow-2xl border-4 border-white/20 transform -rotate-3 hover:rotate-0 transition-transform duration-700" 
                    alt="Manos artesanas de Contumazá"
                  />
                  <div className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 max-w-[200px]">
                     <p className="text-[10px] text-terracotta-600 font-bold uppercase tracking-widest mb-1">{t('banner.hands_label')}</p>
                     <p className="text-sm font-serif text-stone-900 font-bold italic">{t('banner.hands_desc')}</p>
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

      <div id="catalog-section" className="max-w-6xl mx-auto px-4 py-8 md:py-24 animate-in fade-in duration-700">
        
          {/* NUEVO: Sector Explorer Bar (Navegación Territorial) */}
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-[1px] w-12 bg-stone-200"></span>
              <span className="text-stone-400 font-bold text-[10px] uppercase tracking-[0.4em]">{t('catalog.explore_sectors')}</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Opción Todos */}
              <button 
                onClick={() => { onSelectSector?.(null); onSelectCategory?.('Todos'); onSearch?.(''); }}
                className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden ${!activeSector ? 'bg-stone-900 border-stone-900 shadow-2xl scale-105' : 'bg-white border-stone-50 hover:border-stone-200 shadow-sm'}`}
              >
                {!activeSector && <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 animate-pulse" />}
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 transition-all duration-500 ${!activeSector ? 'bg-white/10 text-white shadow-inner' : 'bg-stone-50 text-stone-300 group-hover:text-stone-900 group-hover:bg-stone-100'}`}>
                  <IconTodos className="w-10 h-10" color={!activeSector ? '#FFF' : '#A8A29E'} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${!activeSector ? 'text-white' : 'text-stone-400 group-hover:text-stone-900'}`}>{t('catalog.cat_all')}</span>
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
                    className={`group p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden ${isActive ? 'bg-white shadow-2xl scale-105 ring-4 ring-stone-900/5' : 'bg-white border-stone-50 hover:border-stone-200 shadow-sm'}`}
                    style={{ borderColor: isActive ? currentHex : '' }}
                  >
                    {isActive && <div className="absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-5" style={{ backgroundColor: currentHex }} />}
                    <div 
                      className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-5 transition-all duration-500 ${isActive ? 'shadow-lg scale-110' : 'bg-stone-50 text-stone-300 group-hover:text-stone-900'}`}
                      style={{ backgroundColor: isActive ? `${currentHex}20` : '' }}
                    >
                      {getTerritorialIcon(sec.name)}
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-stone-900' : 'text-stone-400 group-hover:text-stone-900'}`}>{sec.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

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
                    onClick={() => { onSearch?.(''); onSelectCategory?.('Todos'); }} 
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeCategory === 'Todos' ? 'bg-stone-900 text-white shadow-lg' : 'bg-white text-stone-500 border border-stone-100 hover:border-stone-900 hover:text-stone-900'}`}
                 >
                    {t('catalog.cat_all')}
                 </button>
                 {categories.filter(cat => !activeSector || cat.sector === activeSector || cat.sector?.toLowerCase() === activeSector.toLowerCase()).map(cat => {
                   const isActive = cat.name?.toString().trim().toLowerCase() === activeCategory?.toString().trim().toLowerCase();
                   return (
                     <button 
                       key={cat.id} 
                       onClick={() => { onSearch?.(''); onSelectCategory?.(cat.name); }} 
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
                <span className="text-andeansky-700 font-bold text-[11px] uppercase tracking-[0.3em] bg-andeansky-50 px-4 py-1.5 rounded-full mb-6 inline-block leading-none border border-andeansky-100 shadow-sm animate-in zoom-in duration-500">
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
                       {p.brandName && <span className="text-stone-300 mx-1">/</span>}
                       {p.brandName && <span className="text-stone-600 font-black">{p.brandName}</span>}
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
