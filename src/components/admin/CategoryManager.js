"use client";
import React, { useState, useRef, useEffect } from 'react';
import { LucideTrash2, LucidePlusCircle, LucideTag, LucideEdit, LucideX, LucideCheck, LucideGripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export function CategoryManager({ categories, onAdd, onUpdate, onDelete, onReorder, setFeedback }) {
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

  return (
    <div className="max-w-4xl animate-in fade-in pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-stone-900 font-serif">Gestión de Categorías</h2>
        <p className="text-stone-500 text-sm">Define el orden y las guías para tu catálogo.</p>
      </div>

      <div ref={editFormRef}>
        {!editingId ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm mb-10 transition-all duration-500">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <LucidePlusCircle size={16} /> Nueva Categoría
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Nombre</label>
                  <input 
                    className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all font-medium" 
                    placeholder="Ej: Manteles Litúrgicos" 
                    value={newCat} 
                    onChange={e => setNewCat(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleAdd} 
                  disabled={!newCat}
                  className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-stone-800 transition shadow-lg shadow-stone-200 disabled:opacity-50 disabled:shadow-none"
                >
                  Agregar Categoría
                </button>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Descripción / Guía</label>
                <textarea 
                  className="w-full p-3 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all h-[116px] text-sm resize-none" 
                  placeholder="Explica qué tipo de productos van aquí..." 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        ) : (
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
                            <button 
                              onClick={() => startEditing(cat)} 
                              className="text-stone-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <LucideEdit size={18}/>
                            </button>
                            <button 
                              onClick={() => confirmDelete(cat)} 
                              className="text-stone-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <LucideTrash2 size={18}/>
                            </button>
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
  );
}
