"use client";
import React, { useState } from 'react';
import { LucidePlus, LucideEdit, LucideTrash2, LucideX, LucideImage, LucideLayers } from 'lucide-react';
import { ImageUpload } from '../ui/ImageUpload';

export function CollectionManager({ collections, onAdd, onEdit, onDelete, setFeedback }) {
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

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Colecciones Oficiales</h2>
          <p className="text-stone-500 text-sm">Define los temas globales del marketplace</p>
        </div>
        <button onClick={handleOpenAdd} className="bg-stone-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-stone-800 transition flex items-center gap-2 shadow-sm">
          <LucidePlus size={16}/> Nueva Colección
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map(c => (
          <div key={c.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group">
            <div className="h-40 bg-stone-100 relative overflow-hidden">
              {c.image ? (
                <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt={c.name}/>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <LucideLayers size={48}/>
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => handleOpenEdit(c)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-600 hover:text-blue-600 shadow-sm transition"><LucideEdit size={16}/></button>
                <button onClick={() => confirmDelete(c)} className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-stone-600 hover:text-red-600 shadow-sm transition"><LucideTrash2 size={16}/></button>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-stone-900 mb-1">{c.name}</h3>
              <p className="text-xs text-stone-500 line-clamp-2 h-8">{c.description || 'Sin descripción'}</p>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-20 text-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-300">
            <LucideLayers size={32}/>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">No hay colecciones creadas</h3>
          <p className="text-stone-500 text-sm max-w-sm mx-auto mb-6">Crea temas globales para agrupar los productos de todas las artesanas.</p>
          <button onClick={handleOpenAdd} className="text-orange-700 font-bold hover:underline">Crear mi primera colección</button>
        </div>
      )}

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
