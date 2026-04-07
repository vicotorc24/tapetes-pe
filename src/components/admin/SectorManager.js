"use client";
import React, { useState, useRef } from 'react';
import { 
  LucideLayoutGrid, 
  LucidePlusCircle, 
  LucideEdit, 
  LucideTrash2, 
  LucideX, 
  LucideCheck, 
  LucideInfo,
  LucidePackage
} from 'lucide-react';

export function SectorManager({ sectors, onAdd, onUpdate, onDelete, setFeedback }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', icon: '📦', color: 'stone', description: '' });
  
  const COLORS = [
    { id: 'stone', bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200' },
    { id: 'orange', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    { id: 'purple', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    { id: 'emerald', bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    { id: 'blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    { id: 'rose', bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  ];

  const handleStartCreate = () => {
    setEditingId(null);
    setFormData({ name: '', icon: '📦', color: 'stone', description: '' });
    setIsCreating(true);
  };

  const handleStartEdit = (sector) => {
    setEditingId(sector.id);
    setFormData({ 
      name: sector.name, 
      icon: sector.icon || '📦', 
      color: sector.color || 'stone',
      description: sector.description || ''
    });
    setIsCreating(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
    } else {
      onAdd(formData);
    }
    setIsCreating(false);
    setEditingId(null);
  };

  const confirmDelete = (sector) => {
    if (!setFeedback) return;
    setFeedback({
      type: 'confirm',
      message: `¿Estás seguro de que deseas eliminar el sector "${sector.name}"? Esto podría afectar la visualización de categorías vinculadas.`,
      onConfirm: () => onDelete(sector.id, sector.name)
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif italic">Mantenimiento de Sectores</h2>
          <p className="text-stone-500 text-sm">Gestiona los rubros productivos de Made In Contumazá.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={handleStartCreate}
            className="bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-stone-800 transition shadow-lg shadow-stone-100"
          >
            <LucidePlusCircle size={18} /> Nuevo Sector
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl mb-10 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-stone-50">
            <h3 className="text-lg font-bold text-stone-900 font-serif italic flex items-center gap-2">
              {editingId ? <LucideEdit size={20} /> : <LucidePlusCircle size={20} />}
              {editingId ? `Editando Sector: ${formData.name}` : 'Crear Nuevo Sector'}
            </h3>
            <button onClick={() => setIsCreating(false)} className="text-stone-400 hover:text-stone-900">
              <LucideX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 font-sans">Nombre del Sector</label>
                  <input 
                    required
                    className="w-full p-4 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-stone-100 transition-all font-bold text-stone-900 bg-stone-50/30" 
                    placeholder="Ej: Agroindustria, Turismo..." 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 font-sans">Descripción / Propósito</label>
                  <textarea 
                    className="w-full p-4 border border-stone-200 rounded-2xl outline-none focus:ring-2 focus:ring-stone-100 transition-all h-[120px] text-sm resize-none bg-stone-50/30 font-sans" 
                    placeholder="Describe el alcance de este sector en la provincia..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 font-sans">Icono Identificador</label>
                  <div className="grid grid-cols-6 gap-2">
                    {['📦', '🧶', '🐝', '🧀', '🏺', '🏔️', '☕', '🍗', '🧺', '🎨', '👜', '🌿'].map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({...formData, icon: emoji})}
                        className={`w-full aspect-square rounded-xl text-xl flex items-center justify-center transition-all ${
                          formData.icon === emoji ? 'bg-stone-900 scale-110 shadow-lg ring-4 ring-stone-100' : 'bg-stone-50 hover:bg-stone-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 font-sans">Color de Marca</label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFormData({...formData, color: c.id})}
                        className={`w-8 h-8 rounded-full ${c.bg} border-2 transition-all ${
                          formData.color === c.id ? 'scale-125 border-stone-900 shadow-lg' : 'border-transparent hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 flex justify-end">
              <button 
                type="submit"
                className="bg-stone-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-stone-800 transition shadow-xl"
              >
                {editingId ? 'Guardar Cambios' : 'Registrar Sector'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectors.length === 0 ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-stone-200 rounded-3xl">
             <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
                <LucideLayoutGrid size={32} />
             </div>
             <p className="text-stone-400 font-medium italic">No hay sectores registrados aún.</p>
          </div>
        ) : sectors.map((sector) => {
          const colorSet = COLORS.find(c => c.id === sector.color) || COLORS[0];
          return (
            <div key={sector.id} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${colorSet.bg} flex items-center justify-center text-3xl shadow-inner`}>
                  {sector.icon || '📦'}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleStartEdit(sector)} className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-all"><LucideEdit size={18}/></button>
                  <button onClick={() => confirmDelete(sector)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><LucideTrash2 size={18}/></button>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-stone-900 mb-2 font-serif">{sector.name}</h4>
              <p className="text-xs text-stone-500 leading-relaxed mb-6 font-medium line-clamp-2">
                {sector.description || 'Sin descripción detallada para este sector.'}
              </p>

              <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Activo</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-300">
                   <LucidePackage size={14} />
                   <span className="text-[10px] font-bold italic">Sector Territorial</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-stone-50 p-6 rounded-3xl border border-stone-100 flex gap-4 items-start">
         <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-stone-400 shrink-0">
            <LucideInfo size={20} />
         </div>
         <div>
            <p className="text-xs font-bold text-stone-900 mb-1">Guía del Gestor de Sectores</p>
            <p className="text-xs text-stone-500 leading-relaxed font-light">
              Los sectores permiten organizar el marketplace por rubros productivos. Al eliminar un sector, las categorías que dependan de él podrían perder su vinculación. Se recomienda editar en lugar de eliminar si ya existen productos registrados.
            </p>
         </div>
      </div>
    </div>
  );
}
