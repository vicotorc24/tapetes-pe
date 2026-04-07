"use client";
import React, { useState } from 'react';
import { LucideX } from 'lucide-react';
import { ImageUpload } from '../ui/ImageUpload';

export function UserFormModal({ user, sectors = [], onClose, onSave }) {
  const getInitialNames = () => {
    if (user?.firstName) return { firstName: user.firstName, lastName: user.lastName || '' };
    const full = user?.name || '';
    const lastSpace = full.lastIndexOf(' ');
    if (lastSpace === -1) return { firstName: full, lastName: '' };
    return {
      firstName: full.substring(0, lastSpace).trim(),
      lastName: full.substring(lastSpace).trim()
    };
  };

  const initialNames = getInitialNames();

  const [formData, setFormData] = useState({ 
    firstName: initialNames.firstName,
    lastName: initialNames.lastName,
    email: user?.email || '', 
    dni: user?.dni || '',
    phone: user?.phone || '',
    ruc: user?.ruc || '',
    specialty: user?.specialty || '',
    location: user?.location || 'Contumazá, Cajamarca',
    gender: user?.gender || 'female',
    role: user?.role || 'seller', 
    status: user?.status || 'active',
    sectors: Array.isArray(user?.sectors) ? user?.sectors : (user?.sector ? [user.sector] : []), // Handle both array and legacy string
    photo: user?.photo || '',
    bio: user?.bio || '',
    brandName: user?.brandName || '',
    instagram: user?.instagram || '',
    facebook: user?.facebook || '',
    password: ''
  });
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    onSave({ ...user, ...formData }); 
  };
  
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-900/50 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-xl p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[95vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-stone-900 border-b pb-4 w-full">{user ? 'Editar Perfil Local' : 'Nuevo Productor/a de Contumazá'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition absolute top-8 right-8"><LucideX/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-6 border-b pb-6">
              <div className="w-40">
                <ImageUpload 
                  label="Foto de Perfil" 
                  value={formData.photo} 
                  path="users" 
                  onChange={url => setFormData({...formData, photo: url})} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Nombres</label><input required className="w-full p-3 border rounded-lg" value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})}/></div>
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Apellidos</label><input required className="w-full p-3 border rounded-lg" value={formData.lastName} onChange={e=>setFormData({...formData, lastName:e.target.value})}/></div>
            </div>
           <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Email</label><input required type="email" className="w-full p-3 border rounded-lg" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})}/></div>
            
            {!user && (
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase block mb-1">Contraseña Inicial</label>
                <input 
                  required 
                  type="password" 
                  className="w-full p-3 border rounded-lg bg-stone-50 focus:bg-white border-purple-100" 
                  value={formData.password} 
                  onChange={e=>setFormData({...formData, password:e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">DNI (8 dígitos)</label><input required maxLength="8" className="w-full p-3 border rounded-lg" value={formData.dni} onChange={e=>setFormData({...formData, dni:e.target.value.replace(/\D/g,'')})}/></div>
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Teléfono / WhatsApp</label><input required className="w-full p-3 border rounded-lg" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} placeholder="999 999 999"/></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">RUC (Opcional)</label><input maxLength="11" className="w-full p-3 border rounded-lg bg-stone-50" value={formData.ruc} onChange={e=>setFormData({...formData, ruc:e.target.value.replace(/\D/g,'')})} placeholder="10..."/></div>
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Ubicación / Producción</label><input className="w-full p-3 border rounded-lg" value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})}/></div>
            </div>

            {formData.role === 'seller' && (
              <>
                <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50 space-y-4">
                  <h4 className="text-[10px] font-black text-orange-900/50 uppercase tracking-widest px-1">Información de Marca & Rubro</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-xs font-bold text-stone-500 uppercase block mb-3">Rubros Productivos Asociados</label>
                      <div className="flex flex-wrap gap-2 p-3 bg-stone-50 border-2 border-stone-100 rounded-2xl min-h-[52px] items-center">
                        {/* Tags selected */}
                        {(formData.sectors || []).map(sId => {
                          const s = sectors.find(x => x.id === sId);
                          if (!s) return null;
                          return (
                            <span 
                              key={s.id} 
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white rounded-xl text-[11px] font-black shadow-sm animate-in zoom-in-95"
                            >
                              <span>{s.icon}</span>
                              <span>{s.name}</span>
                              <button 
                                type="button" 
                                onClick={() => {
                                  setFormData({...formData, sectors: formData.sectors.filter(id => id !== sId)});
                                }}
                                className="ml-1 hover:bg-orange-500 rounded-full p-0.5 transition-colors"
                              >
                                <LucideX size={12} />
                              </button>
                            </span>
                          );
                        })}
                        
                        {/* Add more selector */}
                        <div className="relative flex-1 min-w-[120px]">
                          <select 
                            className="w-full bg-transparent text-xs font-bold text-stone-400 outline-none cursor-pointer hover:text-orange-600 transition-colors py-1 pl-1"
                            value=""
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val && !formData.sectors.includes(val)) {
                                setFormData({...formData, sectors: [...(formData.sectors || []), val]});
                              }
                            }}
                          >
                            <option value="" disabled>+ Añadir rubro...</option>
                            {sectors.filter(s => !(formData.sectors || []).includes(s.id)).map(s => (
                              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {formData.sectors?.length === 0 && (
                        <p className="text-[10px] text-orange-600/70 mt-2 italic px-1 font-bold">
                          * Es obligatorio seleccionar al menos un rubro para productores.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Nombre de Marca</label><input className="w-full p-3 border rounded-lg border-orange-200" value={formData.brandName} onChange={e=>setFormData({...formData, brandName:e.target.value})} placeholder="Ej: Alva's"/></div>
                    <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Especialidad Técnica</label><input className="w-full p-3 border rounded-lg border-orange-200" value={formData.specialty} onChange={e=>setFormData({...formData, specialty:e.target.value})} placeholder="Ej: Apicultura, Tejidos a crochet..."/></div>
                  </div>

                  <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Biografía Breve (Narrativa)</label>
                    <textarea 
                      className="w-full p-3 border rounded-lg resize-none h-24 text-sm border-orange-200" 
                      placeholder="Cuéntanos un poco sobre tu historia o inspiración..."
                      value={formData.bio}
                      onChange={e=>setFormData({...formData, bio:e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Instagram</label><input className="w-full p-3 border rounded-lg border-orange-100" value={formData.instagram} onChange={e=>setFormData({...formData, instagram:e.target.value})} placeholder="@usuario"/></div>
                    <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Facebook</label><input className="w-full p-3 border rounded-lg border-orange-100" value={formData.facebook} onChange={e=>setFormData({...formData, facebook:e.target.value})} placeholder="Nombre en FB"/></div>
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Género</label>
                <select className="w-full p-3 border rounded-lg bg-white" value={formData.gender} onChange={e=>setFormData({...formData, gender:e.target.value})}>
                  <option value="female">Mujer</option>
                  <option value="male">Hombre</option>
                  <option value="other">Otro / No especificado</option>
                </select>
              </div>
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Rol</label>
                <select className="w-full p-3 border rounded-lg bg-white" value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})}>
                  <option value="seller">Productor/a</option>
                  <option value="redactor">Redactor</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div><label className="text-xs font-bold text-stone-500 uppercase block mb-1">Estado</label>
                <select className="w-full p-3 border rounded-lg bg-white" value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})}>
                  <option value="active">Activo</option><option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
           <div className="flex justify-end gap-3 pt-4 border-t mt-6">
             <button type="button" onClick={onClose} className="px-4 py-2 text-stone-500">Cancelar</button>
             <button type="submit" className="px-6 py-2 bg-stone-900 text-white rounded-lg font-bold">Guardar</button>
           </div>
        </form>
      </div>
    </div>
  );
}
