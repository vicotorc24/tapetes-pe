"use client";
import React, { useState, useMemo } from 'react';
import { LucidePlus, LucideEdit, LucideTrash2, LucideX, LucideImage, LucideLayers, LucideTrendingUp, LucideEye, LucideInfo } from 'lucide-react';
import { ImageUpload } from '../ui/ImageUpload';

export function CollectionManager({ collections, products = [], onAdd, onEdit, onDelete, setFeedback, user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingColl, setEditingColl] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });

  const handleOpenAdd = () => { setEditingColl(null); setFormData({ name: '', description: '', image: '' }); setIsModalOpen(true); };
  const handleOpenEdit = (c) => { 
    setEditingColl(c); 
    setFormData({ name: c.name, description: c.description || '', image: c.image || '' }); 
    setIsModalOpen(true); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingColl) {
      onEdit({ ...editingColl, ...formData });
    } else {
      onAdd(formData);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = (c) => {
    setFeedback({
      type: 'confirm',
      message: `¿Estás seguro de que deseas eliminar la colección "${c.name}"? Los productos asociados dejarán de mostrarla.`,
      onConfirm: () => onDelete(c.id)
    });
  };

  // Cálculo de Popularidad por Colección
  const topCollections = useMemo(() => {
    if (!products.length) return [];
    
    const stats = {};
    products.forEach(p => {
      const coll = p.collection || 'Sin Colección';
      const views = p.stats?.views || 0;
      if (!stats[coll]) stats[coll] = 0;
      stats[coll] += views;
    });

    return Object.entries(stats)
      .map(([id, views]) => {
         const collection = collections.find(c => c.id === id || c.name === id);
         return { 
            name: collection ? collection.name : id, 
            views 
         };
      })
      .filter(item => item.name !== 'Sin Colección')
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [products, collections]);

  const maxViews = topCollections.length > 0 ? Math.max(...topCollections.map(c => c.views), 1) : 1;

  return (
    <div className="animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Colecciones Oficiales</h2>
          <p className="text-stone-500 text-sm">Define los temas globales del marketplace</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-stone-800 transition flex items-center gap-2 shadow-lg shadow-stone-100">
          <LucidePlus size={18}/> Nueva Colección
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collections.map(c => (
              <div key={c.id} className="bg-white border border-stone-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="h-48 bg-stone-50 relative overflow-hidden">
                  {c.image ? (
                    <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={c.name}/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <LucideLayers size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button onClick={() => handleOpenEdit(c)} className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-stone-600 hover:text-blue-600 shadow-xl transition-all hover:scale-110"><LucideEdit size={18}/></button>
                    <button onClick={() => confirmDelete(c)} className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-stone-600 hover:text-red-600 shadow-xl transition-all hover:scale-110"><LucideTrash2 size={18}/></button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-black text-lg text-stone-900 mb-1 leading-tight">{c.name}</h3>
                  <p className="text-xs text-stone-400 line-clamp-2 h-8 leading-relaxed mb-4">{c.description || 'Sin descripción'}</p>
                  
                  {/* Stats Badge */}
                  {products.length > 0 && (
                     <div className="flex items-center gap-4 pt-4 border-t border-stone-50">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                           <LucideEye size={12} />
                           {products.filter(p => p.collection === c.id || p.collection === c.name).reduce((acc, p) => acc + (p.stats?.views || 0), 0)} vistas
                        </div>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {collections.length === 0 && (
            <div className="bg-white border-2 border-dashed border-stone-100 rounded-[3rem] p-24 text-center">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-200">
                <LucideLayers size={40} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-2 font-serif">No hay colecciones creadas</h3>
              <p className="text-stone-400 text-sm max-w-sm mx-auto mb-8 font-sans leading-relaxed">Crea temas globales para agrupar los productos de todas las artesanas y darles una narrativa común.</p>
              <button onClick={handleOpenAdd} className="bg-orange-50 text-orange-700 px-8 py-3 rounded-2xl font-black hover:bg-orange-100 transition-colors">Crear mi primera colección</button>
            </div>
          )}
        </div>

        {/* Sidebar: Popularidad de Colecciones */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-[2.5rem] border border-stone-200 p-8 sticky top-24 shadow-sm group overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-50 rounded-full blur-2xl opacity-50"></div>
              
              <div className="flex items-center gap-3 mb-10 relative z-10">
                 <div className="w-10 h-10 bg-stone-950 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-stone-200">
                    <LucideTrendingUp size={20} />
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-stone-800 font-serif leading-none mb-1">Impacto Viral</h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Temas de Tendencia</p>
                 </div>
              </div>
              
              <div className="space-y-8 relative z-10">
                 {topCollections.length === 0 ? (
                    <div className="py-12 text-center italic text-stone-300 text-xs">Aún no hay interacciones registradas.</div>
                 ) : topCollections.map((item, i) => {
                    const widthLimit = (item.views / maxViews) * 100;
                    return (
                       <div key={i} className="group/item cursor-default animate-in slide-in-from-right" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className="flex justify-between items-end mb-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-stone-200 group-hover/item:text-orange-500 transition-colors">0{i + 1}</span>
                                <span className="text-[11px] font-serif font-black text-stone-800 leading-none">{item.name}</span>
                             </div>
                             <span className="text-[10px] font-black text-stone-400 group-hover/item:text-stone-900 transition-colors">
                                {item.views.toLocaleString()} <span className="text-[8px] font-bold text-stone-300 uppercase ml-0.5">Visitas</span>
                             </span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-stone-950' : 'bg-stone-200 group-hover/item:bg-orange-300'}`}
                                style={{ width: `${Math.max(3, widthLimit)}%` }}
                             ></div>
                          </div>
                       </div>
                    )
                 })}
              </div>

              <div className="mt-12 p-5 bg-stone-50 rounded-2xl border border-stone-100 relative z-10">
                 <div className="flex gap-2">
                    <LucideInfo size={14} className="text-stone-300 shrink-0" />
                    <p className="text-[9px] text-stone-500 font-medium leading-relaxed italic">
                       Este indicador estima el interés institucional basado en la suma de interacciones de todos los productos vinculados a cada colección oficial.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-900">{editingColl ? 'Editar Colección' : 'Nueva Colección'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-50 rounded-full transition"><LucideX/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Nombre de la Colección</label>
                <input required className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-stone-100" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Legado de Contumazá"/>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Descripción</label>
                <textarea className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-stone-100" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Cuenta la historia de esta colección..."/>
              </div>
              <div>
                <ImageUpload 
                  label="Imagen de Portada" 
                  value={formData.image} 
                  path="collections" 
                  onChange={url => setFormData({...formData, image: url})} 
                />
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-stone-500 font-bold">Cancelar</button>
                <button type="submit" className="px-8 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition shadow-lg">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
