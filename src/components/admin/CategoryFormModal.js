"use client";
import React, { useState, useEffect } from 'react';
import { LucideX, LucideTag, LucidePlusCircle, LucideEdit, LucideCheck } from 'lucide-react';

export function CategoryFormModal({ category, sectors, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    sector: category?.sector || sectors[0]?.id || 'textile'
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        sector: category.sector || sectors[0]?.id || 'textile'
      });
    }
  }, [category, sectors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.sector) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center p-8 border-b border-stone-50">
          <h3 className="text-xl font-bold text-stone-900 font-serif italic flex items-center gap-3">
            {category ? <LucideEdit size={24} className="text-orange-600" /> : <LucidePlusCircle size={24} className="text-orange-600" />}
            {category ? `Editando: ${category.name}` : 'Nueva Categoría'}
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            Cerrar <LucideX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-4 font-sans">1. Sector Vinculado</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {sectors.map(sec => {
                    const isSelected = formData.sector === sec.id;
                    return (
                        <button
                        key={sec.id}
                        type="button"
                        onClick={() => setFormData({...formData, sector: sec.id})}
                        className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                            isSelected 
                            ? 'bg-stone-900 text-white border-stone-900 shadow-xl scale-105' 
                            : 'bg-stone-50 text-stone-400 border-stone-100 hover:bg-stone-100'
                        }`}
                        >
                        <span className="text-2xl">{sec.icon}</span>
                        <span className="line-clamp-1">{sec.name}</span>
                        {isSelected && <div className="w-1 h-1 bg-orange-500 rounded-full"></div>}
                        </button>
                    );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 font-sans">2. Nombre de la Categoría</label>
                <div className="relative">
                    <LucideTag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input 
                    required
                    autoFocus
                    className="w-full p-4 pl-12 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all font-bold text-stone-900 bg-stone-50/30" 
                    placeholder="Ej: Textiles de Cintura, Miel Silvestre..." 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2 font-sans">3. Descripción / Guía de Productos</label>
                <textarea 
                  className="w-full p-4 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-50 focus:border-orange-200 transition-all h-[120px] text-sm resize-none bg-stone-50/30 font-sans leading-relaxed" 
                  placeholder="Explica a los productores qué tipo de productos deben ir en esta categoría..." 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-stone-500 hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={!formData.name}
              className="flex-[2] bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition shadow-xl shadow-stone-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {category ? <LucideCheck size={20} /> : <LucidePlusCircle size={20} />}
              {category ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
