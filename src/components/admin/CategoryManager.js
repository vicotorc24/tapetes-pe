"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LucideTrash2, LucidePlusCircle, LucideTag, LucideEdit, LucideX, LucideCheck, LucideGripVertical, LucideTrendingUp, LucideEye } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export function CategoryManager({ categories, products = [], onAdd, onUpdate, onDelete, onReorder, setFeedback }) {
  const [newCat, setNewCat] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  
  // Refs para scroll y foco
  const editFormRef = useRef(null);
  const nameInputRef = useRef(null);

  const handleAdd = () => {
    if (newCat) {
      onAdd({ name: newCat, description });
      setNewCat('');
      setDescription('');
    }
  };

  const startEditing = (cat) => {
    setEditingId(cat.id);
    setEditFormData({ name: cat.name, description: cat.description || '' });
    
    // El scroll ocurre después de que React renderice el formulario
    setTimeout(() => {
      editFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nameInputRef.current?.focus();
    }, 100);
  };

  const handleSaveEdit = () => {
    onUpdate(editingId, editFormData);
    setEditingId(null);
  };

  const confirmDelete = (cat) => {
    if (!setFeedback) return;
    setFeedback({
      type: 'confirm',
      message: `¿Estás seguro de que deseas eliminar permanentemente la categoría "${cat.name}"? Los productos asociados podrían quedar sin categoría.`,
      onConfirm: () => onDelete(cat.id)
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  // Cálculo de Popularidad por Categoría
  const topCategories = useMemo(() => {
    if (!products.length) return [];
    
    const stats = {};
    products.forEach(p => {
      const cat = p.category || 'Sin Categoría';
      const views = p.stats?.views || 0;
      if (!stats[cat]) stats[cat] = 0;
      stats[cat] += views;
    });

    return Object.entries(stats)
      .map(([name, views]) => ({ name, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }, [products]);

  const maxViews = topCategories.length > 0 ? Math.max(...topCategories.map(c => c.views), 1) : 1;

  return (
    <div className="animate-in fade-in pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-900 font-serif">Gestión de Categorías</h2>
        <p className="text-stone-500 text-sm">Define el orden y las guías para tu catálogo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div ref={editFormRef}>
            {!editingId ? (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm mb-10 transition-all duration-500">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <LucidePlusCircle size={16} /> Nueva Categoría
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1 font-sans">Nombre</label>
                      <input 
                        className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium bg-stone-50/30" 
                        placeholder="Ej: Manteles Litúrgicos" 
                        value={newCat} 
                        onChange={e => setNewCat(e.target.value)}
                      />
                    </div>
                    <button 
                      onClick={handleAdd} 
                      disabled={!newCat}
                      className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-stone-800 transition shadow-lg shadow-stone-100 disabled:opacity-50 disabled:shadow-none"
                    >
                      Agregar Categoría
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1 font-sans">Descripción / Guía</label>
                    <textarea 
                      className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all h-[116px] text-sm resize-none bg-stone-50/30 font-sans" 
                      placeholder="Explica qué tipo de productos van aquí..." 
                      value={description} 
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ... (Edit structure remains similar but within col-span-2) ... */
              <div className="bg-orange-50/50 p-8 rounded-2xl border border-orange-200 shadow-xl mb-10 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-orange-900 uppercase tracking-widest flex items-center gap-2">
                    <LucideEdit size={16} /> Editando: {editFormData.name}
                  </h3>
                  <button onClick={() => setEditingId(null)} className="text-stone-400 hover:text-stone-600">
                    <LucideX size={20} />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1 font-sans">Nombre</label>
                      <input 
                        ref={nameInputRef}
                        className="w-full p-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all font-medium bg-white" 
                        value={editFormData.name} 
                        onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={handleSaveEdit}
                      className="w-full bg-orange-700 text-white py-3.5 rounded-xl font-bold hover:bg-orange-800 transition shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                    >
                      <LucideCheck size={18} /> Guardar Cambios
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1 font-sans">Descripción / Guía</label>
                    <textarea 
                      className="w-full p-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-300 transition-all h-[116px] text-sm resize-none bg-white" 
                      value={editFormData.description} 
                      onChange={e => setEditFormData({...editFormData, description: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 mb-2 font-sans flex justify-between items-center">
              Categorías Registradas 
              <span className="text-[9px] font-normal lowercase italic">Arrastra para reordenar</span>
            </h3>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="categories-list">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="grid gap-3"
                  >
                    {categories.map((cat, index) => (
                      <Draggable key={cat.id} draggableId={cat.id} index={index}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group flex items-center bg-white p-4 rounded-2xl border transition-all duration-200 ${
                              snapshot.isDragging ? 'shadow-2xl border-orange-200 ring-2 ring-orange-50 scale-[1.02] z-50' : 'border-stone-100 shadow-sm hover:shadow-md'
                            }`}
                          >
                            <div 
                              {...provided.dragHandleProps}
                              className="mr-4 text-stone-300 hover:text-stone-500 p-2 cursor-grab active:cursor-grabbing"
                            >
                              <LucideGripVertical size={20} />
                            </div>
                            
                            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  snapshot.isDragging ? 'bg-orange-600 text-white' : 'bg-stone-50 text-stone-400 group-hover:bg-orange-600 group-hover:text-white'
                                }`}>
                                  <LucideTag size={20} />
                                </div>
                                <div>
                                  <span className="font-bold text-stone-900 block mb-0.5 font-serif">{cat.name}</span>
                                  <p className="text-xs text-stone-500 line-clamp-1 font-sans">{cat.description || 'Sin descripción.'}</p>
                                </div>
                              </div>
                              <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditing(cat)} className="text-stone-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"><LucideEdit size={18}/></button>
                                <button onClick={() => confirmDelete(cat)} className="text-stone-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"><LucideTrash2 size={18}/></button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* Sidebar: Popularidad por Categoría */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-3xl border border-stone-200 p-6 sticky top-24 shadow-sm group">
              <div className="flex items-center gap-2 mb-8">
                 <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                    <LucideTrendingUp size={16} />
                 </div>
                 <h3 className="text-sm font-bold text-stone-800 font-serif">Popularidad</h3>
              </div>
              
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-6">Top Impacto por Vistas</p>
              
              <div className="space-y-6">
                 {topCategories.length === 0 ? (
                    <div className="py-10 text-center italic text-stone-300 text-xs">Aún no hay datos de interacción.</div>
                 ) : topCategories.map((item, i) => {
                    const widthLimit = (item.views / maxViews) * 100;
                    return (
                       <div key={i} className="space-y-2 animate-in slide-in-from-right" style={{ animationDelay: `${i * 50}ms` }}>
                          <div className="flex justify-between items-end">
                             <span className="text-[11px] font-serif font-black text-stone-900 leading-none">{item.name}</span>
                             <span className="text-[10px] font-bold text-orange-600 flex items-center gap-1">
                                {item.views} <LucideEye size={10} />
                             </span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden">
                             <div 
                                className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-orange-500' : 'bg-stone-200 group-hover:bg-orange-200'}`}
                                style={{ width: `${Math.max(2, widthLimit)}%` }}
                             ></div>
                          </div>
                       </div>
                    )
                 })}
              </div>

              <div className="mt-10 p-4 bg-stone-50 rounded-2xl border border-stone-100/50">
                 <p className="text-[9px] text-stone-400 font-medium leading-relaxed italic">
                    Este ranking se basa en la suma de visitas a todos los productos pertenecientes a cada categoría.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
