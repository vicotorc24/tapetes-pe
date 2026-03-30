"use client";
import React, { useState } from 'react';
import { LucideSearch, LucidePlus, LucideCrown, LucideEdit, LucideTrash2, LucideX, LucideImage, LucideInfo } from 'lucide-react';
import { addProduct, updateProduct, deleteProduct, getProducts } from '../../lib/services/products';
import { ImageUpload } from '../ui/ImageUpload';

export function ProductManager({ products, setProducts, categories, collections, user, setFeedback }) {
  const myProducts = user.role === 'superadmin' ? products : products.filter(p => p.sellerEmail === user.email);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    title: '', 
    price: '', 
    category: categories[0]?.name || '', 
    description: '', 
    stock: 1, 
    isPromoted: false,
    image: '',
    images: [],
    collection: '',
    materials: '',
    technique: '',
    dimensions: '',
    laborDays: '',
    stitchType: ''
  });
  const filteredProducts = myProducts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const refreshProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleEditClick = (product) => { 
    setEditingProduct(product); 
    setFormData({ 
      title: product.title, 
      price: product.price, 
      category: product.category, 
      description: product.description || '', 
      stock: product.stock || 1, 
      isPromoted: product.isPromoted || false,
      image: product.image || '',
      images: product.images || (product.image ? [product.image] : []),
      collection: product.collection || '',
      materials: product.materials || '',
      technique: product.technique || '',
      dimensions: product.dimensions || '',
      laborDays: product.laborDays || '',
      stitchType: product.stitchType || ''
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
        image: formData.images?.[0] || '',
        sellerEmail: user.email,
        sellerName: user.name,
      };

      if (editingProduct) { 
        await updateProduct(editingProduct.id, productPayload);
      } else { 
        await addProduct(productPayload);
      } 
      
      await refreshProducts();
      setIsCreating(false); 
      setFormData({ title: '', price: '', category: categories[0]?.name || '', description: '', stock: 1, isPromoted: false, image: '', images: [], collection: '', materials: '', technique: '', dimensions: '', laborDays: '', stitchType: '' }); 
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

  const handleDelete = (id) => {
    const productToDelete = products.find(p => p.id === id);
    if (!setFeedback) return;

    setFeedback({ 
      type: 'confirm', 
      message: `¿Estás seguro de que deseas eliminar permanentemente el producto "${productToDelete?.title}"?`,
      onConfirm: async () => {
        setFeedback({ type: 'loading', message: 'Eliminando producto...' });
        try {
          await deleteProduct(id);
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
                <label className="text-xs font-bold text-stone-500 uppercase mb-2 block font-sans">Categoría</label>
                <select className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none font-medium text-stone-900" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
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

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Materiales</label>
              <input className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.materials} onChange={e => setFormData({...formData, materials: e.target.value})} placeholder="Ej: Lana de ovino, Algodón" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Técnica Artesanal</label>
              <input className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.technique} onChange={e => setFormData({...formData, technique: e.target.value})} placeholder="Ej: Telar de cintura, Crochet" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Días de Labor / Dedicación</label>
              <input type="number" className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.laborDays} onChange={e => setFormData({...formData, laborDays: e.target.value})} placeholder="Ej: 15" />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Punto Maestro Predominante</label>
              <select className="w-full p-3 bg-stone-50 border rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" value={formData.stitchType} onChange={e => setFormData({...formData, stitchType: e.target.value})}>
                <option value="">(Seleccionar punto)</option>
                <option value="Punto Piña">Punto Piña (Ananá)</option>
                <option value="Punto Garbanzo">Punto Garbanzo / Popcorn</option>
                <option value="Punto Salomón">Punto Salomón</option>
                <option value="Punto Abanico">Punto Abanico / Shell</option>
                <option value="Punto Cruzado">Punto Cruzado</option>
                <option value="Malla / Filet">Malla / Filet</option>
                <option value="Varetas / Punto Alto">Varetas / Punto Alto</option>
                <option value="Punto de Nieve y Piña Concéntrica">Punto de Nieve y Piña Concéntrica (Especialidad)</option>
                <option value="Vórtices / Punto Cruzado en Espiral">Vórtices / Punto Cruzado en Espiral</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <ImageUpload 
              label="Galería del Producto (Máx 5)" 
              value={formData.images} 
              path="products" 
              multiple={true}
              maxFiles={5}
              onChange={urls => setFormData({...formData, images: urls})} 
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
            <input type="checkbox" id="promoted" checked={formData.isPromoted} onChange={e => setFormData({...formData, isPromoted: e.target.checked})} className="w-5 h-5 text-amber-600 rounded cursor-pointer"/>
            <label htmlFor="promoted" className="text-sm font-bold text-amber-800 flex items-center gap-2 cursor-pointer"><LucideCrown size={16}/> Destacar como Producto Premium</label>
          </div>

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
      <div className="flex justify-between items-center mb-6"><div><h2 className="text-2xl font-bold text-stone-900">Mis Productos</h2><p className="text-stone-500 text-sm">Gestiona tu catálogo y stock</p></div><button onClick={() => { setEditingProduct(null); setFormData({ title: '', price: '', category: categories[0]?.name || '', description: '', stock: 1, isPromoted: false, image: '', images: [], collection: '', materials: '', technique: '', dimensions: '' }); setIsCreating(true); }} className="bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-orange-800 transition"><LucidePlus size={18} /> Nuevo</button></div>
      <div className="mb-6 relative max-w-md"><LucideSearch className="absolute left-3 top-2.5 text-stone-400" size={20}/><input type="text" placeholder="Buscar producto..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left"><thead className="bg-stone-50 border-b border-stone-200 text-xs font-bold uppercase text-stone-500"><tr><th className="p-4">Producto</th><th className="p-4">Categoría</th><th className="p-4">Stock</th><th className="p-4">Precio</th><th className="p-4 text-right">Acciones</th></tr></thead>
           <tbody className="divide-y divide-stone-100">{filteredProducts.map(p => (<tr key={p.id} className="hover:bg-stone-50 transition"><td className="p-4"><div className="flex items-center gap-4"><img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-stone-200" alt=""/><div><p className="font-bold text-stone-900 flex items-center gap-2">{p.title} {p.isPromoted && <LucideCrown size={14} className="text-amber-500 fill-amber-500"/>}</p><p className="text-xs text-stone-400">ID: {p.id}</p></div></div></td><td className="p-4"><span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold">{p.category}</span></td><td className="p-4 text-sm font-medium text-stone-600">{p.stock || 1} un.</td><td className="p-4 font-bold text-stone-800">S/ {p.price}</td><td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEditClick(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><LucideEdit size={18}/></button><button onClick={() => handleDelete(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><LucideTrash2 size={18}/></button></div></td></tr>))}</tbody>
        </table>
        {filteredProducts.length === 0 && <div className="p-10 text-center text-stone-400 italic">No se encontraron productos.</div>}
      </div>
    </div>
  );
}
