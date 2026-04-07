"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { LucideSearch, LucidePlus, LucideCrown, LucideEdit, LucideTrash2, LucideX, LucideImage, LucideInfo, LucideGripVertical, LucideShield, LucideCheckCircle, LucidePackage } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { addProduct, updateProduct, deleteProduct, getProducts } from '../../lib/services/products';
import { ImageUpload } from '../ui/ImageUpload';
import { CONFIG } from '@/lib/config';

export function ProductManager({ products, setProducts, categories, collections, sectors = [], user, users, setFeedback }) {
  const myProducts = user.role === 'superadmin' ? products : products.filter(p => p.sellerEmail?.toLowerCase().trim() === user.email?.toLowerCase().trim());
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    price: '', 
    category: categories[0]?.name || '', 
    sector: 'textile', // New field: textile, food
    description: '', 
    stock: 1, 
    isPromoted: false,
    image: '',
    images: [],
    collection: '',
    // Textile specific
    materials: '',
    technique: '',
    dimensions: '',
    laborDays: '',
    stitchType: [],
    // Food specific
    weight: '',
    harvestDate: '',
    expirationDate: '',
    sellerEmail: '',
    sellerName: ''
  });
  
  const STITCH_OPTIONS = [
    { id: 'jersey', name: 'Punto Jersey', desc: 'Clásico del tejido a dos agujas.' },
    { id: 'santa_clara', name: 'Punto Santa Clara', desc: 'Punto bobo o musgo.' },
    { id: 'arroz', name: 'Punto Arroz', desc: 'Textura granulada elegante.' },
    { id: 'pina', name: 'Punto Piña', desc: 'Formas de ananá en relieve.' },
    { id: 'garbanzo', name: 'Punto Garbanzo', desc: 'Puntos popcorn con volumen.' },
    { id: 'salomon', name: 'Punto Salomón', desc: 'Encaje abierto y ligero.' },
    { id: 'abanico', name: 'Punto Abanico', desc: 'Bordes en forma de concha.' },
    { id: 'cruzado', name: 'Punto Cruzado', desc: 'Líneas que se entrelazan.' },
    { id: 'filet', name: 'Malla / Filet', desc: 'Ideal para diseños figurativos.' },
    { id: 'varetas', name: 'Varetas / Pto. Alto', desc: 'Básico y versátil.' },
    { id: 'nieve', name: 'Punto de Nieve', desc: 'Especialidad concéntrica.' },
    { id: 'vortices', name: 'Vórtices', desc: 'Espirales en relieve.' },
    { id: 'ingles', name: 'Punto Inglés', desc: 'Punto con relieve y elasticidad.' },
    { id: 'trenza', name: 'Punto de Ocho / Trenza', desc: 'Entrelazados clásicos de abrigo.' },
    { id: 'calado', name: 'Punto Calado', desc: 'Diseños con huecos y transparencias.' },
    { id: 'panal', name: 'Punto Panal', desc: 'Textura hexagonal elegante.' },
    { id: 'elastico', name: 'Punto Elástico', desc: 'Ideal para puños y cuellos.' }
  ];
  const [stitchType, setStitchType] = useState(''); // Just for context, line 31 is filter

  // 1. Filtramos categorías por el sector seleccionado
  const filteredCategories = useMemo(() => {
    return categories.filter(c => !c.sector || c.sector === formData.sector);
  }, [categories, formData.sector]);

  // Aseguramos que la categoría seleccionada sea válida para el sector
  useEffect(() => {
    const isValid = filteredCategories.some(c => c.name === formData.category);
    if (!isValid && filteredCategories.length > 0) {
      setFormData(prev => ({ ...prev, category: filteredCategories[0].name }));
    }
  }, [formData.sector, filteredCategories]);
  const filteredProducts = myProducts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const canManage = (p) => {
    const isOwner = p.sellerEmail?.toLowerCase().trim() === user.email?.toLowerCase().trim();
    // Permitir si es dueño o si es un producto huérfano y soy superadmin (legacy)
    return isOwner || (user.role === 'superadmin' && !p.sellerEmail);
  };

  const refreshProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleEditClick = (product) => { 
    setEditingProduct(product); 
    setFormData({ 
      title: product.title || '', 
      price: product.price || '', 
      category: product.category || '', 
      sector: product.sector || 'textile',
      description: product.description || '', 
      stock: product.stock || 1, 
      isPromoted: product.isPromoted || false,
      image: product.image || '',
      images: Array.isArray(product.images) ? product.images.map(img => typeof img === 'string' ? { url: img, caption: '' } : img) : (product.image ? [{ url: product.image, caption: '' }] : []),
      collection: product.collection || '',
      materials: product.materials || '',
      technique: product.technique || '',
      dimensions: product.dimensions || '', 
      laborDays: product.laborDays || '', 
      stitchType: Array.isArray(product.stitchType) ? product.stitchType : (product.stitchType ? [product.stitchType] : []),
      weight: product.weight || '',
      harvestDate: product.harvestDate || '',
      expirationDate: product.expirationDate || '',
      sellerEmail: product.sellerEmail || '',
      sellerName: product.sellerName || ''
    }); 
    setIsCreating(true); 
  };
  
  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setIsSaving(true);
    try {
      if (setFeedback) {
        setFeedback({ 
          type: 'loading', 
          message: `${editingProduct ? 'Actualizando' : 'Publicando'} ${formData.title}...` 
        });
      }

      const productPayload = {
        ...formData,
        image: typeof formData.images?.[0] === 'string' ? formData.images[0] : (formData.images?.[0]?.url || ''),
        sellerEmail: user.role === 'superadmin' ? (formData.sellerEmail || user.email) : user.email,
        sellerName: user.role === 'superadmin' ? (formData.sellerName || user.name) : user.name,
      };

      if (editingProduct) { 
        await updateProduct(editingProduct.id, productPayload, user);
      } else { 
        await addProduct(productPayload, user);
      } 
      
      await refreshProducts();
      setIsCreating(false); 
      setFormData({ 
        title: '', price: '', category: categories[0]?.name || '', sector: 'textile',
        description: '', stock: 1, isPromoted: false, image: '', images: [], 
        collection: '', materials: '', technique: '', dimensions: '', 
        laborDays: '', stitchType: [], weight: '', harvestDate: '', expirationDate: '' 
      }); 
      setEditingProduct(null);

      if (setFeedback) {
        setFeedback({ 
          type: 'success', 
          message: `El producto "${formData.title}" ha sido guardado exitosamente.` 
        });
      }
    } catch (error) {
      if (setFeedback) {
        setFeedback({ type: 'error', message: error.message });
      } else {
        alert("Error al guardar producto: " + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(formData.images || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setFormData({ ...formData, images: items });
  };

  const handleDelete = (id) => {
    const productToDelete = products.find(p => p.id === id);
    if (!setFeedback) return;

    setFeedback({ 
      type: 'confirm', 
      message: `¿Estás seguro de que deseas eliminar permanentemente el producto "${productToDelete?.title}"?`,
      onConfirm: async () => {
        setFeedback({ type: 'loading', message: 'Eliminando producto...' });
        try {
          await deleteProduct(id, user);
          await refreshProducts();
          setFeedback({ type: 'success', message: 'Producto eliminado del catálogo.' });
        } catch (error) {
          setFeedback({ type: 'error', message: error.message });
        }
      }
    });
  };

  if (isCreating) {
    return (
      <div className="max-w-2xl bg-white p-8 rounded-xl border border-stone-200 shadow-sm animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-stone-900">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2><button onClick={() => setIsCreating(false)}><LucideX/></button></div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Nombre</label>
                <input required className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Precio (S/)</label>
                <input required type="number" step="0.01" className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Descripción</label>
            <textarea required className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block font-sans">Sector Productivo</label>
                <div className="flex gap-2">
                  {sectors.map(sec => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setFormData({...formData, sector: sec.id})}
                      className={`flex-1 p-3 rounded-xl border text-sm font-bold transition-all duration-300 ${
                        formData.sector === sec.id 
                          ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-[1.02]' 
                          : 'bg-stone-50 text-stone-500 border-stone-100 hover:bg-stone-100'
                      }`}
                    >
                      <span className="mr-2">{sec.icon}</span>
                      {sec.name}
                    </button>
                  ))}
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block font-sans">Categoría</label>
                <select className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none font-medium text-stone-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {filteredCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
            </div>
            {/* Guía de Categorización */}
            <div className="col-span-2">
                {categories.find(c => c.name === formData.category) && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-1">
                    <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center shrink-0">
                      <LucideInfo size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-1">Guía de Categorización</p>
                      <p className="text-sm text-blue-900 leading-snug">
                        {categories.find(c => c.name === formData.category)?.description || 'Esta categoría no tiene una descripción guía aún.'}
                      </p>
                    </div>
                  </div>
                )}
            </div>
            <div>
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Stock Disponible</label>
                <input required type="number" className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Colección Oficial</label>
              <select className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none appearance-none" value={formData.collection} onChange={e => setFormData({...formData, collection: e.target.value})}>
                <option value="">(Ninguna)</option>
                {collections.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Dimensiones / Medidas</label>
              <input className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.dimensions} onChange={e => setFormData({...formData, dimensions: e.target.value})} placeholder="Ej: 40cm x 40cm" />
            </div>
          </div>

          <div className="bg-stone-50/50 p-6 rounded-3xl border border-stone-100 space-y-6">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Detalles de {formData.sector === 'textile' ? 'Artesanía' : 'Producción'}</h4>
            
            {formData.sector === 'textile' ? (
              <>
                <div className="grid grid-cols-2 gap-6 scale-in-95 animate-in duration-500">
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Materiales</label>
                    <input className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none" value={formData.materials} onChange={e => setFormData({...formData, materials: e.target.value})} placeholder="Ej: Lana de ovino" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Técnica</label>
                    <input className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none" value={formData.technique} onChange={e => setFormData({...formData, technique: e.target.value})} placeholder="Ej: Telar de cintura" />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <label className="text-xs font-bold text-stone-500 uppercase mb-3 block">Puntos Maestros Predominantes</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STITCH_OPTIONS.map(opt => {
                      const isSelected = (formData.stitchType || []).includes(opt.name);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            const current = Array.isArray(formData.stitchType) ? formData.stitchType : [];
                            const next = isSelected 
                              ? current.filter(s => s !== opt.name)
                              : [...current, opt.name];
                            setFormData({ ...formData, stitchType: next });
                          }}
                          className={`p-2 rounded-lg border text-left transition-all text-[10px] font-bold ${
                            isSelected ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-stone-100 text-stone-600 hover:border-stone-200'
                          }`}
                        >
                          {opt.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-6 scale-in-95 animate-in duration-500">
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Contenido / Peso</label>
                    <input className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="Ej: 500g, 1 Litro" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Fecha de Cosecha / Prod.</label>
                    <input type="date" className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none text-sm" value={formData.harvestDate} onChange={e => setFormData({...formData, harvestDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Fecha de Vencimiento (Aprox)</label>
                    <input type="date" className="w-full p-3 bg-white border border-stone-200 rounded-lg outline-none text-sm" value={formData.expirationDate} onChange={e => setFormData({...formData, expirationDate: e.target.value})} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <ImageUpload 
              label="Galería del Producto (Máx 5)" 
              value={(formData.images || []).map(img => typeof img === 'string' ? img : img.url)} 
              path="products" 
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
                 <Droppable droppableId="product-images-list">
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
                                   placeholder="Breve detalle (ej: Vista frontal, detalle del punto...)"
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

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <input type="checkbox" id="promoted" checked={formData.isPromoted} onChange={e => setFormData({...formData, isPromoted: e.target.checked})} className="w-5 h-5 text-amber-600 rounded cursor-pointer"/>
            <label htmlFor="promoted" className="text-sm font-bold text-amber-800 flex items-center gap-2 cursor-pointer"><LucideCrown size={16}/> Destacar como Producto Premium</label>
          </div>
          
          {user.role === 'superadmin' && (
            <div className="p-6 bg-stone-900 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
              <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <LucideShield size={14} className="text-purple-400" /> Control de Propiedad (Admin)
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase mb-2 block">Asignar a Productor/a (Vendedor)</label>
                  <select 
                    className="w-full p-2.5 text-sm bg-stone-800 border border-stone-700 text-white rounded-lg outline-none focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer"
                    value={formData.sellerEmail || ''}
                    onChange={e => {
                      const selectedUser = (users || []).find(u => u.email === e.target.value);
                      if (selectedUser) {
                        setFormData({
                          ...formData, 
                          sellerEmail: selectedUser.email,
                          sellerName: selectedUser.name
                        });
                      } else {
                        // Si selecciona el vacío, vuelve al admin por defecto o queda vacío
                        setFormData({
                          ...formData,
                          sellerEmail: '',
                          sellerName: ''
                        });
                      }
                    }}
                  >
                    <option value="">Seleccionar Productor/a...</option>
                    {(users || []).filter(u => u.role === 'seller' || u.role === 'artisan').map(u => (
                      <option key={u.id} value={u.email}>
                        {u.name} — {u.email}
                      </option>
                    ))}
                    <option value="divider" disabled>──────────</option>
                    <option value="admin@tapetes.pe">Admin (Self)</option>
                  </select>
                </div>
              </div>
              {formData.sellerEmail && (
                <div className="flex items-center gap-2 text-[10px] text-purple-300 bg-purple-900/30 p-2 rounded-lg border border-purple-800/50">
                  <LucideCheckCircle size={12} />
                  <span>Se asignará a: <strong>{formData.sellerName}</strong> ({formData.sellerEmail})</span>
                </div>
              )}
              <p className="text-[9px] text-stone-500 italic mt-2">
                * Cambiar estos valores transferirá el producto al taller de la artesana seleccionada.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 text-stone-600 font-bold hover:bg-stone-100 rounded-lg transition" disabled={isSaving}>Cancelar</button>
            <button 
              type="submit" 
              disabled={isSaving}
              className={`flex-1 max-w-[200px] py-4 bg-orange-700 text-white font-bold rounded-2xl hover:bg-orange-800 transition shadow-lg flex items-center justify-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </>
              ) : (
                editingProduct ? 'Actualizar' : 'Publicar'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Made In Contumazá</h2>
          <p className="text-stone-500 text-sm">Gestiona el catálogo territorial y stock</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditingProduct(null); setFormData({ title: '', price: '', category: categories[0]?.name || '', description: '', stock: 1, isPromoted: false, image: '', images: [], collection: '', materials: '', technique: '', dimensions: '' }); setIsCreating(true); }} className="bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-800 transition"><LucidePlus size={18} /> Nuevo</button>
        </div>
      </div>
      <div className="mb-6 relative max-w-md"><LucideSearch className="absolute left-3 top-2.5 text-stone-400" size={20}/><input type="text" placeholder="Buscar producto..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-stone-500">
            <tr>
              <th className="p-4">Producto</th>
              {user.role === 'superadmin' && <th className="p-4">Vendedor</th>}
              <th className="p-4">Categoría</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Precio</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredProducts.map(p => (
              <tr key={p.id} className="hover:bg-stone-50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm transition-transform hover:scale-110">
                      {p.image ? (
                        <img src={p.image} className="w-full h-full object-cover" alt=""/>
                      ) : (
                        <LucidePackage className="text-stone-300" size={18} />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 flex items-center gap-2">
                        {p.title} {p.isPromoted && <LucideCrown size={14} className="text-amber-500 fill-amber-500"/>}
                      </p>
                      <p className="text-xs text-stone-400">ID: {p.id}</p>
                    </div>
                  </div>
                </td>
                {user.role === 'superadmin' && (
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-stone-800 text-sm">{p.sellerName || 'Sin nombre'}</span>
                      <span className="text-[10px] text-stone-400 italic">{p.sellerEmail}</span>
                    </div>
                  </td>
                )}
                <td className="p-4">
                  <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold">{p.category}</span>
                </td>
                <td className="p-4 text-sm font-medium text-stone-600">{p.stock || 1} un.</td>
                <td className="p-4 font-bold text-stone-800">S/ {p.price}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {!canManage(p) && (
                      <div className="group relative">
                        <LucideInfo size={14} className="text-amber-500 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-stone-900 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          Solo lectura: Debes usar "Ver como" para editar este producto.
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={() => handleEditClick(p)} 
                      disabled={!canManage(p)}
                      className={`p-2 rounded-lg transition ${
                        canManage(p) 
                          ? 'text-blue-600 hover:bg-blue-50' 
                          : 'text-stone-300 cursor-not-allowed'
                      }`}
                      title={canManage(p) ? "Editar producto" : "Acceso restringido"}
                    >
                      <LucideEdit size={18}/>
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      disabled={!canManage(p)}
                      className={`p-2 rounded-lg transition ${
                        canManage(p) 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-stone-300 cursor-not-allowed'
                      }`}
                      title={canManage(p) ? "Eliminar producto" : "Acceso restringido"}
                    >
                      <LucideTrash2 size={18}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && <div className="p-10 text-center text-stone-400 italic">No se encontraron productos.</div>}
      </div>
    </div>
  );
}
