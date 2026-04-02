"use client";
import React, { useState, useEffect } from 'react';
import { LucideSave, LucideImage, LucideType, LucideLayout, LucideBarChart3, LucideRefreshCcw, LucideCheck, LucideExternalLink, LucideTrash2, LucidePlus, LucideAlertCircle } from 'lucide-react';
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
        setData(result);
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
    setFeedback?.({ type: 'loading', message: 'Guardando configuración de impacto...' });
    try {
      await updateImpactData(data);
      setFeedback?.({ type: 'success', message: 'El impacto se ha actualizado correctamente.' });
    } catch (e) {
      setFeedback?.({ type: 'error', message: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-stone-400 gap-4">
        <LucideRefreshCcw className="animate-spin" size={32} />
        <span className="text-sm font-bold uppercase tracking-widest">Cargando Misión...</span>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-serif text-stone-900">Misión & Impacto Social</h2>
          <p className="text-stone-500 text-sm">Gestiona la narrativa y las métricas de transparencia de Tapetes.pe</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => {
                if (isSaving) return;
                handleSave().then(() => window.open('/impacto', '_blank'));
             }}
             className="flex items-center gap-2 px-4 py-2 text-andeangreen-700 bg-andeangreen-50 hover:bg-andeangreen-100 rounded-lg transition text-xs font-black uppercase tracking-widest border border-andeangreen-200"
          >
             <LucideExternalLink size={16} /> Guardar y Ver Preview
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`flex items-center gap-2 bg-stone-900 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-stone-800 transition shadow-lg ${isSaving ? 'opacity-50' : ''}`}
          >
            {isSaving ? <LucideRefreshCcw size={18} className="animate-spin" /> : <LucideSave size={18} />}
            {isSaving ? 'Guardando...' : 'Publicar Cambios'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 p-3 bg-amber-50 rounded-xl border border-amber-100 animate-pulse">
         <LucideAlertCircle size={16} className="text-amber-600" />
         <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
            Recuerda hacer clic en "Publicar" para que los nuevos bloques aparezcan en la página pública.
         </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pb-20">
        
        {/* LENGÜETA 1: HERO CINEMATIC */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><LucideLayout size={60} /></div>
              <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                 <span className="w-2 h-2 bg-andeangreen-500 rounded-full"></span> 
                 Hero Cinematic Section
              </h3>
              
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                       <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 block">Título Principal</label>
                       <input 
                          className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-andeangreen-100 outline-none font-serif text-lg font-bold"
                          value={data.hero.title}
                          onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})}
                       />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                       <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 block">Subtítulo (Highlight)</label>
                       <input 
                          className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-andeangreen-100 outline-none uppercase tracking-widest font-bold text-xs text-andeangreen-700"
                          value={data.hero.subtitle}
                          onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})}
                       />
                    </div>
                 </div>
                 
                 <div>
                    <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 block">Descripción Hero</label>
                    <textarea 
                       rows="3"
                       className="w-full p-4 bg-stone-50 border border-stone-100 rounded-xl focus:ring-2 focus:ring-andeangreen-100 outline-none leading-relaxed text-stone-600"
                       value={data.hero.description}
                       onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})}
                    />
                 </div>
                 
                 <div>
                    <ImageUpload 
                       label="Imagen de Fondo Cinematic (Landscape)" 
                       value={data.hero.backgroundImage}
                       path="impact"
                       onChange={url => setData({...data, hero: {...data.hero, backgroundImage: url}})}
                    />
                 </div>
              </div>
           </div>

           {/* NARRATIVA: STORY 1 & 2 */}
           <div className="grid md:grid-cols-2 gap-8">
              {['story1', 'story2'].map((key, index) => (
                 <div key={key} className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm transition-all hover:border-andeangreen-100">
                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-terracotta-500' : 'bg-andeansky-500'}`}></span>
                       {index === 0 ? 'El Reto en la Montaña' : 'Nuestra Solución'}
                    </h3>
                    <div className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 block">Título Sección</label>
                          <input 
                             className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-1 focus:ring-stone-200 outline-none font-serif text-md font-bold"
                             value={data[key].title}
                             onChange={e => setData({...data, [key]: {...data[key], title: e.target.value}})}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 block">Párrafo 1 (Gancho)</label>
                          <textarea 
                             rows="4"
                             className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-1 focus:ring-stone-200 outline-none text-sm leading-relaxed"
                             value={data[key].description1}
                             onChange={e => setData({...data, [key]: {...data[key], description1: e.target.value}})}
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-2 block">Párrafo 2 (Detalle)</label>
                          <textarea 
                             rows="4"
                             className="w-full p-3 bg-stone-50 border border-stone-100 rounded-xl focus:ring-1 focus:ring-stone-200 outline-none text-sm leading-relaxed"
                             value={data[key].description2}
                             onChange={e => setData({...data, [key]: {...data[key], description2: e.target.value}})}
                          />
                       </div>
                       <ImageUpload 
                          label="Fotografía Social"
                          value={data[key].image}
                          path="impact"
                          onChange={url => setData({...data, [key]: {...data[key], image: url}})}
                       />
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* COLUMNA LATERAL: STATS & DASHBOARD */}
        <div className="space-y-8">
           <div className="bg-stone-900 p-8 rounded-3xl border border-stone-800 shadow-2xl text-white">
              <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                 <LucideBarChart3 size={14} className="text-andeangreen-400" /> Cifras de Transparencia
              </h3>
              
              <div className="space-y-10">
                 {data.stats.map((stat, idx) => (
                    <div key={idx} className="space-y-4 p-4 rounded-2xl bg-stone-800/50 border border-stone-800 group hover:bg-stone-800 transition-colors">
                       <div className="flex items-center justify-between">
                          <label className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Métrica {idx + 1}</label>
                          <span className="text-[10px] text-andeangreen-400 font-bold group-hover:scale-110 transition-transform"><LucideCheck size={14}/></span>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="text-[8px] text-stone-600 uppercase mb-1 block">Valor</label>
                             <input 
                                className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-andeangreen-400 font-bold text-xl outline-none focus:border-andeangreen-500"
                                value={stat.value}
                                onChange={e => {
                                   const nextStats = [...data.stats];
                                   nextStats[idx].value = e.target.value;
                                   setData({...data, stats: nextStats});
                                }}
                             />
                          </div>
                          <div>
                             <label className="text-[8px] text-stone-600 uppercase mb-1 block">Icono</label>
                             <select 
                                className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-300 text-xs font-bold outline-none"
                                value={stat.icon}
                                onChange={e => {
                                   const nextStats = [...data.stats];
                                   nextStats[idx].icon = e.target.value;
                                   setData({...data, stats: nextStats});
                                }}
                             >
                                <option value="HeartHandshake">Corazón / Ayuda</option>
                                <option value="TrendingUp">Crecimiento</option>
                                <option value="Award">Logro / Diploma</option>
                                <option value="Users">Comunidad</option>
                                <option value="Globe">Mundo</option>
                             </select>
                          </div>
                       </div>
                       
                       <div>
                          <label className="text-[8px] text-stone-600 uppercase mb-1 block">Etiqueta Explicativa</label>
                          <input 
                             className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-stone-200 text-xs font-medium outline-none focus:border-andeangreen-500"
                             value={stat.label}
                             onChange={e => {
                                const nextStats = [...data.stats];
                                nextStats[idx].label = e.target.value;
                                setData({...data, stats: nextStats});
                             }}
                          />
                       </div>
                    </div>
                 ))}
              </div>

              <div className="mt-12 p-6 bg-andeangreen-900/40 rounded-2xl border border-andeangreen-900 flex gap-4">
                 <div className="bg-andeangreen-500 p-2 rounded-lg text-white h-fit"><LucideInfo size={16}/></div>
                 <p className="text-[10px] text-andeangreen-100 italic leading-relaxed">
                    "Estos datos son cruciales para el **Comercio Justo**. Asegúrate de que las cifras reflejen el impacto real en Contumazá."
                 </p>
              </div>
           </div>
        </div>

      </div>

      {/* SECCIONES ADICIONALES (BLOQUES FLEXIBLES) */}
      <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm mb-20 animate-in fade-in duration-1000">
         <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-50">
            <div>
               <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <span className="w-2 h-2 bg-andeansky-500 rounded-full"></span> 
                  Bloques Dinámicos de Información (Futuro)
               </h3>
               <p className="text-[10px] text-stone-400 mt-1 italic">Agrega nuevas secciones de contenido a medida que el proyecto crezca.</p>
            </div>
            <button 
               onClick={() => {
                  const newSection = {
                     id: Date.now(),
                     title: "Nueva Sección de Impacto",
                     subtitle: "Subtítulo opcional",
                     content: "Describe aquí el nuevo hito o información social...",
                     image: "",
                     imageSide: (data.extraSections?.length || 0) % 2 === 0 ? 'left' : 'right'
                  };
                  setData({...data, extraSections: [...(data.extraSections || []), newSection]});
               }}
               className="bg-andeansky-50 text-andeansky-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-andeansky-200 hover:bg-andeansky-900 hover:text-white transition-all flex items-center gap-2 shadow-sm"
            >
               <LucidePlus size={14} /> Añadir Bloque
            </button>
         </div>

         <div className="space-y-12">
            {(!data.extraSections || data.extraSections.length === 0) && (
               <div className="py-20 text-center border-2 border-dashed border-stone-100 rounded-[2rem]">
                  <p className="text-sm font-serif italic text-stone-300">No hay secciones adicionales aún. Haz clic en "+ Añadir Bloque" para comenzar.</p>
               </div>
            )}
            
            {data.extraSections?.map((section, idx) => (
               <div key={section.id || idx} className="grid md:grid-cols-12 gap-8 items-start p-6 rounded-[2.5rem] bg-stone-50/50 hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                  <div className="md:col-span-1 flex flex-col items-center gap-4">
                     <span className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                     <button 
                        onClick={() => {
                           const next = (data.extraSections || []).filter((_, i) => i !== idx);
                           setData({...data, extraSections: next});
                        }}
                        className="text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all p-2"
                        title="Eliminar bloque"
                     >
                        <LucideTrash2 size={18} />
                     </button>
                  </div>
                  
                  <div className="md:col-span-7 space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Título</label>
                           <input 
                              className="w-full p-3 bg-white border border-stone-100 rounded-xl font-bold text-sm outline-none focus:ring-1 focus:ring-stone-200"
                              value={section.title}
                              onChange={e => {
                                 const next = [...data.extraSections];
                                 next[idx].title = e.target.value;
                                 setData({...data, extraSections: next});
                              }}
                           />
                        </div>
                        <div>
                           <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Subtítulo</label>
                           <input 
                              className="w-full p-3 bg-white border border-stone-100 rounded-xl text-xs outline-none focus:ring-1 focus:ring-stone-200"
                              value={section.subtitle}
                              onChange={e => {
                                 const next = [...data.extraSections];
                                 next[idx].subtitle = e.target.value;
                                 setData({...data, extraSections: next});
                              }}
                           />
                        </div>
                     </div>
                     <div>
                        <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Contenido / Texto</label>
                        <textarea 
                           rows="3"
                           className="w-full p-3 bg-white border border-stone-100 rounded-xl text-xs leading-relaxed outline-none focus:ring-1 focus:ring-stone-200"
                           value={section.content}
                           onChange={e => {
                              const next = [...data.extraSections];
                              next[idx].content = e.target.value;
                              setData({...data, extraSections: next});
                           }}
                        />
                     </div>
                     <div>
                        <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Imagen del Bloque</label>
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

                  <div className="md:col-span-4 space-y-4">
                     <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-2 block">Disposición (Desktop)</label>
                     <div className="grid grid-cols-2 gap-2">
                        <button 
                           onClick={() => {
                              const next = [...data.extraSections];
                              next[idx].imageSide = 'left';
                              setData({...data, extraSections: next});
                           }}
                           className={`p-3 rounded-xl text-[10px] font-bold border transition-all ${section.imageSide === 'left' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100'}`}
                        >
                           Imagen Izq.
                        </button>
                        <button 
                           onClick={() => {
                              const next = [...data.extraSections];
                              next[idx].imageSide = 'right';
                              setData({...data, extraSections: next});
                           }}
                           className={`p-3 rounded-xl text-[10px] font-bold border transition-all ${section.imageSide === 'right' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-400 border-stone-100'}`}
                        >
                           Imagen Der.
                        </button>
                     </div>
                     <div className={`mt-4 aspect-video rounded-xl border-2 border-dashed border-stone-200 flex items-center justify-center bg-stone-100/50`}>
                        <div className={`flex items-center gap-2 ${section.imageSide === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                           <div className="w-12 h-8 bg-stone-300 rounded shadow-inner"></div>
                           <div className="space-y-1">
                              <div className="w-8 h-1.5 bg-stone-200 rounded"></div>
                              <div className="w-10 h-1.5 bg-stone-200 rounded"></div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
}

// Icon helper for preview
function LucideInfo({ size }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>; }
