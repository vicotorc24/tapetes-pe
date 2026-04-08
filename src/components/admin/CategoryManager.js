"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LucideTrash2, LucidePlusCircle, LucideTag, LucideEdit, LucideX, LucideCheck, LucideGripVertical, LucideTrendingUp, LucideEye, LucidePackage } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CategoryFormModal } from './CategoryFormModal';
import { CONFIG } from '@/lib/config';

export function CategoryManager({ categories, sectors = [], products = [], onAdd, onUpdate, onDelete, onReorder, setFeedback }) {
  const [filterSector, setFilterSector] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  
  // Refs para scroll y foco
  const editFormRef = useRef(null);
  const nameInputRef = useRef(null);

  const handleOpenCreate = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  const handleSave = (data) => {
    if (currentCategory) {
      onUpdate(currentCategory.id, data);
    } else {
      onAdd(data);
    }
    setIsModalOpen(false);
    setCurrentCategory(null);
  };

  const filteredCategories = useMemo(() => {
    // Si no hay filtro, mostrar todo
    if (!filterSector || filterSector === 'all') return categories;
    
    // Encontrar el rubro activo para tener su nombre y otros datos
    const activeSectorObj = sectors.find(s => s.id === filterSector);
    const activeNameRaw = activeSectorObj?.name || '';
    const activeNameNormalized = activeNameRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    return categories.filter(cat => {
      if (!cat) return false;
      
      const catSector = cat.sector;
      const catSectorStr = (catSector || '').toString();
      const catSectorNormalized = catSectorStr.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // 1. Coincidencia exacta por ID
      if (catSector === filterSector) return true;
      
      // 2. Coincidencia por nombre normalizado (Ignora tildes y mayúsculas)
      if (activeNameNormalized && catSectorNormalized === activeNameNormalized) return true;
      
      // 3. Mapeo Legacy (artesania/textile y alimentos/agro/food)
      const isArtesania = activeNameNormalized.includes('artesania') || filterSector === 'textile';
      const isAlimentos = activeNameNormalized.includes('alimento') || activeNameNormalized.includes('agro') || filterSector === 'food';
      
      if (isArtesania && (catSectorNormalized === 'textile' || catSectorNormalized === 'artesania' || catSectorNormalized.includes('artesania'))) return true;
      if (isAlimentos && (catSectorNormalized === 'food' || catSectorNormalized === 'alimentos' || catSectorNormalized.includes('alimento') || catSectorNormalized.includes('agro'))) return true;
      
      return false;
    });
  }, [categories, filterSector, sectors]);

  const startEditing = (cat) => {
    setCurrentCategory(cat);
    setIsModalOpen(true);
  };

  const confirmDelete = (cat) => {
    if (!setFeedback) return;
    setFeedback({
      type: 'confirm',
      message: `¿Estás seguro de que deseas eliminar permanentemente la categoría "${cat.name}"? Los productos asociados podrían quedar sin categoría.`,
      onConfirm: () => {
        setFeedback({ type: 'loading', message: 'Eliminando categoría...' });
        onDelete(cat.id);
      }
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(categories);
    
    if (filterSector === 'all') {
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
    } else {
      // Reordenamiento dentro de un filtro
      const filtered = Array.from(filteredCategories);
      const [movedItem] = filtered.splice(result.source.index, 1);
      filtered.splice(result.destination.index, 0, movedItem);
      
      // Mapear los cambios de vuelta a la lista global
      let filteredIdx = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].sector === filterSector) {
          items[i] = filtered[filteredIdx];
          filteredIdx++;
        }
      }
    }
    
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
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Gestión de Categorías</h2>
          <p className="text-stone-500 text-sm">Define el orden y las guías para tu catálogo.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-stone-800 transition shadow-lg shadow-stone-100"
        >
          <LucidePlusCircle size={18} /> Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 mb-2">
              <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-sans flex items-center gap-2">
                Categorías Registradas 
                <span className="text-[9px] font-normal lowercase italic">Arrastra para reordenar</span>
              </h3>
              
              <div className="flex gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button 
                  onClick={() => setFilterSector('all')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${filterSector === 'all' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  Todos
                </button>
                {sectors.map(sec => (
                  <button 
                    key={sec.id}
                    onClick={() => setFilterSector(sec.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${filterSector === sec.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                  >
                    <span>{sec.icon}</span>
                    <span className="hidden sm:inline">{sec.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="categories-list">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="grid gap-3 min-h-[100px]"
                  >
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((cat, index) => (
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
                                    <div className="flex items-center gap-2 mb-0.5">
                                      <span className="font-bold text-stone-900 font-serif">{cat.name}</span>
                                      {cat.sector && (
                                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${
                                          (() => {
                                            const sector = sectors.find(s => s.id === cat.sector);
                                            const color = sector?.color || 'purple';
                                            const colorMap = {
                                              orange: 'bg-orange-100 text-orange-700 border-orange-200',
                                              blue: 'bg-blue-100 text-blue-700 border-blue-200',
                                              emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                              purple: 'bg-purple-100 text-purple-700 border-purple-200',
                                              amber: 'bg-amber-100 text-amber-700 border-amber-200',
                                              rose: 'bg-rose-100 text-rose-700 border-rose-200',
                                              stone: 'bg-stone-100 text-stone-700 border-stone-200'
                                            };
                                            return colorMap[color] || colorMap.purple;
                                          })()
                                        }`}>
                                          {sectors.find(s => s.id === cat.sector)?.name || cat.sector}
                                        </span>
                                      )}
                                    </div>
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
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 bg-stone-50 rounded-[2.5rem] border-2 border-dashed border-stone-100 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-stone-200 shadow-sm mb-4">
                           <LucidePackage size={32} />
                        </div>
                        <h4 className="text-stone-900 font-serif font-black text-lg mb-1">No hay categorías</h4>
                        <p className="text-stone-400 text-xs max-w-xs mx-auto">
                          {filterSector === 'all' 
                            ? 'Aún no has registrado ninguna categoría en el sistema.' 
                            : 'No se encontraron categorías asociadas a este rubro productivo en particular.'}
                        </p>
                        <button 
                          onClick={handleOpenCreate}
                          className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 hover:text-orange-700 underline"
                        >
                          Crear Primera Categoría
                        </button>
                      </div>
                    )}
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

      {isModalOpen && (
        <CategoryFormModal 
          category={currentCategory}
          sectors={sectors}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
