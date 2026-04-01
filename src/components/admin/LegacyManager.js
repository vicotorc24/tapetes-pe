"use client";
import React, { useState, useEffect } from 'react';
import { LucideSearch, LucidePlus, LucideEdit, LucideTrash2, LucideX, LucideUser, LucideCheckCircle, LucidePartyPopper, LucideGripVertical, LucideImage } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getPersonalities, addPersonality, updatePersonality, deletePersonality } from '../../lib/services/personalities';
import RichTextEditor from '../ui/RichTextEditor';
import { ImageUpload } from '../ui/ImageUpload';
import { Autocomplete } from '../ui/Autocomplete';
import { CONFIG } from '../../lib/config';

export function LegacyManager({ setFeedback }) {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    role: '', 
    category: CONFIG.LEGACY_CATEGORIES.HISTORY, 
    description: '', 
    image: '', 
    images: [],
    slug: '',
    isPromoted: false 
  });

  useEffect(() => {
    loadPersonalities();
  }, []);

  const loadPersonalities = async () => {
    setLoading(true);
    const data = await getPersonalities();
    setPersonalities(data);
    setLoading(false);
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({ 
      ...formData, 
      name, 
      slug: editingPersonality ? formData.slug : generateSlug(name) 
    });
  };

  const handleEditClick = (p) => { 
    setEditingPersonality(p); 
    setFormData({ 
      name: p.name, 
      role: p.role, 
      category: p.category || CONFIG.LEGACY_CATEGORIES.HISTORY, 
      description: p.description || '', 
      image: p.image || '', 
      images: Array.isArray(p.images) ? p.images.map(img => typeof img === 'string' ? { url: img, caption: '' } : img) : (p.image ? [{ url: p.image, caption: '' }] : []),
      slug: p.slug,
      isPromoted: p.isPromoted || false 
    }); 
    setIsCreating(true); 
  };
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (setFeedback) {
      setFeedback({ 
        type: 'loading', 
        message: `${editingPersonality ? 'Actualizando' : 'Guardando'} historia de ${formData.name}...` 
      });
    }
    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        image: formData.images?.[0]?.url || formData.image || ''
      };
      
      if (editingPersonality) { 
        await updatePersonality(editingPersonality.id, payload);
      } else { 
        await addPersonality(payload);
      } 
      setIsCreating(false); 
      setEditingPersonality(null);
      
      if (setFeedback) {
        setFeedback({ 
          type: 'success', 
          message: `El registro "${formData.name}" se ha guardado correctamente.` 
        });
      }

      setFormData({ name: '', role: '', category: CONFIG.LEGACY_CATEGORIES.HISTORY, description: '', image: '', images: [], slug: '', isPromoted: false }); 
      loadPersonalities();
    } catch (error) {
      if (setFeedback) {
        setFeedback({ type: 'error', message: error.message });
      } else {
        alert("Error al guardar: " + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    const pToDelete = personalities.find(p => p.id === id);
    if (!setFeedback) return;

    setFeedback({ 
      type: 'confirm', 
      message: `¿Estás seguro de que deseas eliminar permanentemente a "${pToDelete?.name}"? Esta acción no se puede deshacer.`,
      onConfirm: async () => {
        setFeedback({ type: 'loading', message: 'Eliminando del registro...' });
        try {
          await deletePersonality(id);
          await loadPersonalities();
          setFeedback({ type: 'success', message: 'El registro ha sido eliminado correctamente.' });
        } catch (error) {
          setFeedback({ type: 'error', message: error.message });
        }
      }
    });
  };

  const filteredPersonalities = personalities.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.images || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({ ...formData, images: items });
  };

  if (isCreating) {
    return (
      <div className="max-w-3xl bg-white p-8 rounded-xl border border-stone-200 shadow-sm animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-900">{editingPersonality ? 'Editar Registro' : 'Nuevo Registro Histórico'}</h2>
          <button onClick={() => setIsCreating(false)} className="text-stone-400 hover:text-stone-600"><LucideX/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Nombre (Personaje o Sitio)</label>
              <input required className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" 
                value={formData.name} onChange={handleNameChange} placeholder="Ej: Pozo Kuan o Walter Alva" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">
                {formData.category === CONFIG.LEGACY_CATEGORIES.POETS ? 'Ocupación / Rol' :
                 formData.category === CONFIG.LEGACY_CATEGORIES.TOURISM ? 'Ubicación' :
                 formData.category === CONFIG.LEGACY_CATEGORIES.FESTIVITIES ? 'Fecha de celebración' :
                 formData.category === CONFIG.LEGACY_CATEGORIES.HISTORY ? 'Periodo / Contexto' :
                 'Referencia / Ubicación'}
              </label>
              <input required className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" 
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                placeholder={
                  formData.category === CONFIG.LEGACY_CATEGORIES.POETS ? 'Ej: Poeta y Escritor' :
                  formData.category === CONFIG.LEGACY_CATEGORIES.TOURISM ? 'Ej: A 5km de la ciudad' :
                  formData.category === CONFIG.LEGACY_CATEGORIES.FESTIVITIES ? 'Ej: Marzo / Abril o Setiembre' :
                  'Ej: Caserío La Herencia'
                } 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Categoría</label>
              <Autocomplete 
                options={Object.values(CONFIG.LEGACY_CATEGORIES)} 
                value={formData.category} 
                onChange={val => setFormData({...formData, category: val})} 
                placeholder="Seleccionar categoría..."
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Slug (URL)</label>
              <input required className="w-full p-3 bg-stone-100 border rounded-lg font-mono text-sm" 
                value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} placeholder="ej-walter-alva" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Biografía / Descripción (Rich Text)</label>
            <RichTextEditor 
              value={formData.description} 
              onChange={val => setFormData({...formData, description: val})} 
              placeholder="Escribe aquí la historia de este personaje..." />
          </div>

          <div>
            <ImageUpload 
              label="Galería (Máx 5 imágenes)" 
              value={(formData.images || []).map(img => typeof img === 'string' ? img : img.url)} 
              path="personalities" 
              multiple={true}
              maxFiles={5}
              onChange={urls => {
                const newImages = urls.map(url => {
                  const existing = (formData.images || []).find(img => (typeof img === 'string' ? img : img.url) === url);
                  return existing ? (typeof existing === 'string' ? { url: existing, caption: '' } : existing) : { url, caption: '' };
                });
                setFormData({...formData, images: newImages});
              }} 
            />
          </div>

          {(formData.images || []).length > 0 && (
            <div className="space-y-4 p-6 bg-stone-50 rounded-2xl border border-stone-200">
               <div className="flex justify-between items-center mb-2">
                 <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                   <LucideImage size={14} /> Pies de Foto / Orden de Galería
                 </h4>
                 <span className="text-[9px] text-stone-400 italic">Arrastra para elegir la portada</span>
               </div>
               
               <DragDropContext onDragEnd={onDragEnd}>
                 <Droppable droppableId="images-list">
                   {(provided) => (
                     <div 
                       {...provided.droppableProps} 
                       ref={provided.innerRef}
                       className="space-y-3"
                     >
                       {(formData.images || []).map((img, idx) => (
                         <Draggable key={`${idx}-${typeof img === 'string' ? img : img.url}`} draggableId={`${idx}-${typeof img === 'string' ? img : img.url}`} index={idx}>
                           {(provided, snapshot) => (
                             <div 
                               ref={provided.innerRef}
                               {...provided.draggableProps}
                               className={`flex gap-4 items-center bg-white p-3 rounded-xl border transition-all duration-200 ${
                                 snapshot.isDragging ? 'shadow-xl border-orange-200 ring-2 ring-orange-50 z-50' : 'border-stone-100 shadow-sm'
                               }`}
                             >
                               <div 
                                 {...provided.dragHandleProps}
                                 className="text-stone-300 hover:text-stone-500 cursor-grab active:cursor-grabbing p-1"
                               >
                                 <LucideGripVertical size={18} />
                               </div>
                               
                               <div className="relative group/thumb">
                                 <img src={typeof img === 'string' ? img : img.url} className="w-12 h-12 rounded-lg object-cover bg-stone-100 shadow-inner" alt="" />
                                 {idx === 0 && (
                                   <div className="absolute -top-1 -left-1 bg-orange-600 text-[8px] text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm whitespace-nowrap">
                                     Portada
                                   </div>
                                 )}
                               </div>

                               <div className="flex-1">
                                 <input 
                                   className="w-full p-2.5 text-sm bg-stone-50/50 border border-transparent focus:border-stone-200 focus:bg-white rounded-lg outline-none transition-all font-medium text-stone-700"
                                   placeholder="Contexto o descripción de la imagen..."
                                   value={typeof img === 'string' ? '' : img.caption}
                                   onChange={e => {
                                     const nextImages = [...(formData.images || [])];
                                     if (typeof nextImages[idx] === 'string') {
                                       nextImages[idx] = { url: nextImages[idx], caption: e.target.value };
                                     } else {
                                       nextImages[idx] = { ...nextImages[idx], caption: e.target.value };
                                     }
                                     setFormData({...formData, images: nextImages});
                                   }}
                                 />
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
          )}

          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <input type="checkbox" id="promoted" checked={formData.isPromoted} 
              onChange={e => setFormData({...formData, isPromoted: e.target.checked})} 
              className="w-5 h-5 text-orange-600 rounded cursor-pointer" />
            <label htmlFor="promoted" className="text-sm font-bold text-orange-800 cursor-pointer">Destacar en la página principal de Historia</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-lg transition">Cancelar</button>
            <button 
                type="submit" 
                disabled={isSaving}
                className={`flex-1 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition shadow-lg flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </>
                ) : (
                  editingPersonality ? 'Actualizar' : 'Publicar Registro'
                )}
              </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Legado Cultural</h2>
          <p className="text-stone-500 text-sm">Administra los personajes ilustres y la historia de Contumazá</p>
        </div>
        <button onClick={() => { 
          setEditingPersonality(null); 
          setFormData({ name: '', role: '', category: CONFIG.LEGACY_CATEGORIES.HISTORY, description: '', image: '', images: [], slug: '', isPromoted: false }); 
          setIsCreating(true); 
        }} className="bg-stone-900 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-stone-800 transition shadow-md">
          <LucidePlus size={18} /> Nuevo Registro
        </button>
      </div>

      <div className="mb-8 relative max-w-md">
        <LucideSearch className="absolute left-3 top-2.5 text-stone-400" size={20}/>
        <input type="text" placeholder="Buscar por nombre o rol..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-100 transition shadow-sm" 
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-400 animate-pulse">Cargando personajes...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPersonalities.map(p => (
            <div key={p.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition group overflow-hidden relative">
              <div className="flex gap-5">
                <div className="w-24 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-50">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                    alt={p.name} onError={(e) => { e.target.src = 'https://placehold.co/200x300?text=' + p.name}} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-stone-900 truncate flex items-center gap-2">
                        {p.name} 
                        {p.isPromoted && <LucideCheckCircle size={14} className="text-orange-500" />}
                      </h3>
                      <p className="text-xs text-stone-400 font-medium uppercase tracking-wider">{p.role}</p>
                    </div>
                    <div className="bg-stone-50 px-2 py-1 rounded text-[10px] font-bold text-stone-500">{p.category}</div>
                  </div>
                  <div 
                    className="text-sm text-stone-500 line-clamp-3 mb-4 leading-relaxed prose prose-stone prose-sm max-w-none personality-bio"
                    dangerouslySetInnerHTML={{ __html: p.description?.replace(/&nbsp;/g, ' ') }} 
                  />
                  <div className="flex justify-between items-center pt-4 border-t border-stone-50">
                    <span className="text-[10px] font-mono text-stone-400">/{p.slug}</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditClick(p)} className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><LucideEdit size={16}/></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><LucideTrash2 size={16}/></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filteredPersonalities.length === 0 && (
            <div className="col-span-full p-20 text-center text-stone-400 italic bg-stone-50/50 rounded-2xl border-2 border-dashed border-stone-100">
              No se encontraron personajes registrados.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
