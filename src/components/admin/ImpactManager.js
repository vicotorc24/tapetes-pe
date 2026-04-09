"use client";
import React, { useState, useEffect } from 'react';
import { 
  LucideSave, 
  LucideImage, 
  LucideType, 
  LucideLayout, 
  LucideBarChart3, 
  LucideRefreshCcw, 
  LucideCheck, 
  LucideExternalLink, 
  LucideHeart, 
  LucideMap, 
  LucideCoins,
  LucideInfo,
  LucideSparkles,
  LucideArrowUpRight,
  LucidePlus,
  LucideTrash2,
  LucideHandshake,
  LucideTrendingUp,
  LucideAward,
  LucideUsers,
  LucideGlobe2
} from 'lucide-react';
import { getImpactData, updateImpactData } from '../../lib/services/impact';
import { ImageUpload } from '../ui/ImageUpload';

export function ImpactManager({ setFeedback }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getImpactData();
        // Inicializar campos faltantes para evitar errores
        const safeData = {
          ...result,
          hero: { subtitle: "Nuestro Propósito", ...result.hero },
          story1: { label: "El Origen", ...result.story1 },
          story2: { label: "La Solución", ...result.story2 },
          settings: { our_response: "Nuestra Respuesta", ...result.settings },
          extraSections: result.extraSections || []
        };
        setData(safeData);
      } catch (e) {
        setFeedback?.({ type: 'error', message: 'No se pudo cargar la configuración de impacto.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [setFeedback]);

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback?.({ type: 'loading', message: 'Publicando narrativa de impacto...' });
    try {
      await updateImpactData(data);
      setFeedback?.({ type: 'success', message: '¡El impacto ha sido actualizado y publicado!' });
    } catch (e) {
      setFeedback?.({ type: 'error', message: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-32 text-stone-400 gap-6">
        <LucideRefreshCcw className="animate-spin text-andeangreen-500" size={48} />
        <span className="text-sm font-black uppercase tracking-[0.4em] animate-pulse">Sincronizando Misión...</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 pb-8 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <LucideSparkles className="text-terracotta-500" size={20} />
             <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Módulo Editorial de Impacto</span>
          </div>
          <h2 className="text-4xl font-black font-serif text-stone-900 tracking-tighter italic">Misión & Propósito Social</h2>
          <p className="text-stone-500 text-sm mt-1">Gestiona el legado de Made In Contumazá ante el mundo.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-stone-50 p-2 rounded-2xl border border-stone-100 shadow-inner">
          <button 
             onClick={() => window.open('/impacto', '_blank')}
             className="flex items-center gap-2 px-6 py-3 text-stone-600 hover:text-stone-900 font-black text-[10px] uppercase tracking-widest transition-all"
          >
             <LucideArrowUpRight size={14} /> Vista Pública
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`flex items-center gap-3 bg-stone-950 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-800 transition shadow-2xl ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? <LucideRefreshCcw size={16} className="animate-spin" /> : <LucideSave size={16} />}
            {isSaving ? 'Publicando...' : 'Publicar Cambios'}
          </button>
        </div>
      </div>

      {/* DASHBOARD DE CAPACIDAD REAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm transition-all hover:shadow-2xl hover:border-pink-100">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700"><LucideHeart size={80} /></div>
           <div className="relative z-10 flex flex-col gap-6">
              <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 border border-pink-100 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-500">
                 <LucideHeart size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-1">Impacto Humano</p>
                 <h4 className="text-3xl font-black text-stone-900 tracking-tighter tabular-nums">+45 Familias</h4>
                 <p className="text-[11px] text-stone-400 font-medium tracking-tight mt-1">Productores y Artesanos activos</p>
              </div>
           </div>
        </div>

        <div className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm transition-all hover:shadow-2xl hover:border-blue-100 text-stone-800">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700"><LucideMap size={80} /></div>
           <div className="relative z-10 flex flex-col gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                 <LucideMap size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-1">Alcance Regional</p>
                 <h4 className="text-3xl font-black text-stone-900 tracking-tighter tabular-nums">8 Barrios</h4>
                 <p className="text-[11px] text-stone-400 font-medium tracking-tight mt-1">Sectores productivos de Contumazá</p>
              </div>
           </div>
        </div>

        <div className="group relative overflow-hidden bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm transition-all hover:shadow-2xl hover:border-andeangreen-100">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 transition-transform duration-700"><LucideCoins size={80} /></div>
           <div className="relative z-10 flex flex-col gap-6">
              <div className="w-14 h-14 bg-andeangreen-50 rounded-2xl flex items-center justify-center text-andeangreen-600 border border-andeangreen-100 group-hover:bg-andeangreen-600 group-hover:text-white transition-colors duration-500">
                 <LucideCoins size={28} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-1">Impacto Económico</p>
                 <h4 className="text-3xl font-black text-stone-900 tracking-tighter tabular-nums">S/ 12.4k</h4>
                 <p className="text-[11px] text-stone-400 font-medium tracking-tight mt-1">Inyección de capital directo mensual</p>
              </div>
           </div>
        </div>
      </div>

      {/* CUERPO EDITORIAL */}
      <div className="grid lg:grid-cols-3 gap-12 pb-32">
        
        <div className="lg:col-span-2 space-y-12">
            
            {/* HERRAMIENTA HERO */}
            <div className="relative bg-stone-50 p-1 rounded-[3rem] border border-stone-100 shadow-xl overflow-hidden group">
               <div className="bg-white p-10 rounded-[2.8rem] border border-stone-100 relative z-10">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-3">
                        <LucideLayout size={16} className="text-andeangreen-600" />
                        Sección Hero (Bienvenida)
                     </h3>
                     <LucideSparkles className="text-stone-100" size={40} />
                  </div>
                  
                  <div className="space-y-10">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Título Principal</label>
                           <input 
                              className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-andeangreen-50 outline-none font-serif text-2xl font-black text-stone-900 transition-all"
                              value={data.hero.title}
                              onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})}
                           />
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Etiqueta (Tag)</label>
                           <input 
                              className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-andeangreen-50 outline-none uppercase tracking-[0.2em] font-black text-[10px] text-andeangreen-700 transition-all"
                              value={data.hero.subtitle}
                              onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})}
                           />
                        </div>
                     </div>
                     
                     <div>
                        <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-3 block">Mensaje Inspirador (Descripción)</label>
                        <textarea 
                           rows="4"
                           className="w-full p-5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-andeangreen-50 outline-none leading-relaxed text-stone-600 text-lg font-light transition-all"
                           value={data.hero.description}
                           onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})}
                        />
                     </div>
                     
                     <div className="p-1 shadow-sm rounded-3xl bg-stone-100">
                        <ImageUpload 
                           label="Fondo Cinematic (Andes)" 
                           value={data.hero.backgroundImage}
                           path="impact"
                           onChange={url => setData({...data, hero: {...data.hero, backgroundImage: url}})}
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* SECCIONES DE HISTORIA STORY 1 & 2 */}
            <div className="grid md:grid-cols-2 gap-10">
               {['story1', 'story2'].map((key, index) => (
                  <div key={key} className="bg-white p-10 rounded-[2.8rem] border border-stone-200 shadow-sm transition-all hover:border-andeangreen-200 hover:shadow-2xl">
                     <h3 className="text-[9px] font-black text-stone-300 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-terracotta-500' : 'bg-andeangreen-500'}`}></span>
                        {index === 0 ? 'Bloque: El Reto' : 'Bloque: La Respuesta'}
                     </h3>
                     
                     <div className="space-y-8">
                        <div>
                           <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Encabezado Sección</label>
                           <input 
                              className="w-full p-4 bg-stone-50 border border-stone-50 rounded-xl focus:ring-2 focus:ring-stone-100 outline-none font-serif text-xl font-black text-stone-900"
                              value={data[key].title}
                              onChange={e => setData({...data, [key]: {...data[key], title: e.target.value}})}
                           />
                        </div>
                        <div>
                           <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Párrafo de Contexto</label>
                           <textarea 
                              rows="5"
                              className="w-full p-4 bg-stone-50 border border-stone-50 rounded-xl focus:ring-2 focus:ring-stone-100 outline-none text-sm leading-relaxed text-stone-600"
                              value={data[key].description1}
                              onChange={e => setData({...data, [key]: {...data[key], description1: e.target.value}})}
                           />
                        </div>
                        <div>
                           <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Cita / Frase Destacada</label>
                           <textarea 
                              rows="3"
                              className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-stone-100 outline-none text-sm italic font-serif text-stone-500 leading-relaxed"
                              value={data[key].description2}
                              onChange={e => setData({...data, [key]: {...data[key], description2: e.target.value}})}
                           />
                        </div>
                        <div className="p-1 rounded-2xl bg-stone-50 opacity-90 hover:opacity-100 transition-opacity">
                           <ImageUpload 
                              label="Imagen Editorial"
                              value={data[key].image}
                              path="impact"
                              onChange={url => setData({...data, [key]: {...data[key], image: url}})}
                           />
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            {/* SECCIONES EXTRA */}
            <div className="bg-white p-10 rounded-[2.8rem] border border-stone-200 shadow-sm relative overflow-hidden group">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] flex items-center gap-3">
                     <LucideLayout size={16} className="text-andeansky-600" />
                     Bloques Dinámicos Adicionales
                  </h3>
                  <button 
                     onClick={() => {
                        const newSection = {
                           id: Date.now(),
                           title: "Nuevo Bloque de Impacto",
                           subtitle: "Subtítulo de bloque",
                           content: "Contenido del bloque...",
                           image: "",
                           imageSide: 'left'
                        };
                        setData({...data, extraSections: [...(data.extraSections || []), newSection]});
                     }}
                     className="bg-andeansky-50 text-andeansky-700 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-andeansky-100 hover:bg-andeansky-600 hover:text-white transition-all shadow-sm flex items-center gap-2"
                  >
                     <LucidePlus size={14} /> Añadir Bloque
                  </button>
               </div>

               <div className="space-y-12">
                  {data.extraSections?.map((section, idx) => (
                     <div key={section.id || idx} className="grid md:grid-cols-12 gap-8 p-6 rounded-3xl bg-stone-50 group/section relative border border-transparent hover:border-stone-200 transition-all">
                        <div className="md:col-span-12 flex justify-between items-center mb-2">
                           <span className="text-[10px] font-black text-stone-300">BLOQUE #{idx + 1}</span>
                           <button 
                              onClick={() => {
                                 const next = data.extraSections.filter((_, i) => i !== idx);
                                 setData({...data, extraSections: next});
                              }}
                              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                           >
                              <LucideTrash2 size={18} />
                           </button>
                        </div>
                        <div className="md:col-span-7 space-y-4">
                           <input 
                              className="w-full p-4 bg-white border border-stone-100 rounded-xl font-bold text-lg outline-none focus:ring-2 focus:ring-andeansky-100"
                              placeholder="Título del bloque"
                              value={section.title}
                              onChange={e => {
                                 const next = [...data.extraSections];
                                 next[idx].title = e.target.value;
                                 setData({...data, extraSections: next});
                              }}
                           />
                           <textarea 
                              rows="4"
                              className="w-full p-4 bg-white border border-stone-100 rounded-xl text-sm leading-relaxed outline-none focus:ring-2 focus:ring-andeansky-100"
                              placeholder="Contenido descriptivo..."
                              value={section.content}
                              onChange={e => {
                                 const next = [...data.extraSections];
                                 next[idx].content = e.target.value;
                                 setData({...data, extraSections: next});
                              }}
                           />
                        </div>
                        <div className="md:col-span-5">
                           <ImageUpload 
                              value={section.image}
                              path="impact/extra"
                              onChange={url => {
                                 const next = [...data.extraSections];
                                 next[idx].image = url;
                                 setData({...data, extraSections: next});
                              }}
                           />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
        </div>

        {/* COLUMNA LATERAL: MÉTRICAS Y AUDITORÍA */}
        <div className="space-y-12">
            <div className="bg-stone-950 p-10 rounded-[3rem] border border-stone-800 shadow-3xl text-white group overflow-hidden relative">
               <div className="absolute -top-20 -right-20 w-48 h-48 bg-andeangreen-600/10 blur-3xl rounded-full group-hover:bg-andeangreen-600/20 transition-all duration-[2000ms]"></div>
               
               <h3 className="text-[9px] font-black text-stone-500 uppercase tracking-[0.5em] mb-12 flex items-center gap-4">
                  <LucideBarChart3 size={18} className="text-andeangreen-400" /> Transparencia
               </h3>
               
               <div className="space-y-12">
                  {data.stats.map((stat, idx) => (
                     <div key={idx} className="space-y-8 pb-8 border-b border-stone-800 last:border-0 relative">
                        <div className="flex items-center justify-between">
                           <label className="text-[9px] font-black text-stone-700 uppercase tracking-widest">KPI Destacado {idx + 1}</label>
                           <LucideCheck size={14} className="text-stone-800 group-hover:text-andeangreen-600 transition-colors" />
                        </div>
                        
                        <div className="flex items-center gap-6">
                           <div className="flex-none">
                              <label className="text-[8px] text-stone-800 uppercase mb-2 block font-black">Valor</label>
                              <input 
                                 className="w-24 p-4 bg-stone-900 border border-stone-800 rounded-2xl text-andeangreen-400 font-serif font-black text-3xl outline-none focus:border-andeangreen-500 transition-all shadow-inner"
                                 value={stat.value}
                                 onChange={e => {
                                    const nextStats = [...data.stats];
                                    nextStats[idx].value = e.target.value;
                                    setData({...data, stats: nextStats});
                                 }}
                              />
                           </div>
                           <div className="flex-1">
                              <label className="text-[8px] text-stone-800 uppercase mb-2 block font-black">Etiqueta</label>
                              <input 
                                 className="w-full p-4 bg-stone-900 border border-stone-800 rounded-2xl text-stone-200 text-xs font-black uppercase tracking-widest outline-none focus:border-andeangreen-500 transition-all shadow-inner"
                                 value={stat.label}
                                 onChange={e => {
                                    const nextStats = [...data.stats];
                                    nextStats[idx].label = e.target.value;
                                    setData({...data, stats: nextStats});
                                 }}
                              />
                           </div>
                        </div>

                        <div>
                           <label className="text-[8px] text-stone-800 uppercase mb-3 block font-black">Iconografía</label>
                           <div className="grid grid-cols-5 gap-3">
                              {[
                                { name: 'Handshake', icon: LucideHandshake },
                                { name: 'TrendingUp', icon: LucideTrendingUp },
                                { name: 'Award', icon: LucideAward },
                                { name: 'Users', icon: LucideUsers },
                                { name: 'Globe', icon: LucideGlobe2 }
                              ].map(item => (
                                 <button
                                    key={item.name}
                                    onClick={() => {
                                       const nextStats = [...data.stats];
                                       nextStats[idx].icon = item.name;
                                       setData({...data, stats: nextStats});
                                    }}
                                    className={`p-3 rounded-xl border flex items-center justify-center transition-all ${stat.icon === item.name ? 'bg-andeangreen-600 border-andeangreen-500 text-white shadow-lg' : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'}`}
                                    title={item.name}
                                 >
                                    <item.icon size={14} /> 
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-14 p-8 bg-andeangreen-950/40 rounded-[2.5rem] border border-andeangreen-900/50 flex gap-5">
                  <div className="bg-andeangreen-500 p-3 rounded-xl text-white h-fit shadow-lg shadow-andeangreen-900/40"><LucideInfo size={20}/></div>
                  <p className="text-[11px] text-andeangreen-300 italic leading-loose">
                     "La transparencia es el pilar de <strong>Made In Contumazá</strong>. Asegúrate que los datos comunicados sean auditables y reales."
                  </p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
