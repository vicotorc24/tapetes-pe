"use client";
import React, { useState } from 'react';
import { LucideX, LucideUser, LucidePhone, LucideMail, LucideMapPin, LucideBriefcase, LucideHash, LucideInstagram, LucideFacebook, LucideShield, LucideCamera, LucideCheckCircle2, LucideAlertCircle } from 'lucide-react';
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
    password: '',
    confirmPassword: ''
  });
  
  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = formData.confirmPassword !== '' && !passwordsMatch;
  
  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (formData.password !== formData.confirmPassword) return;
    onSave({ ...user, ...formData }); 
  };
  
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-md" 
        onClick={onClose}
      />
      
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 flex flex-col max-h-full overflow-hidden relative z-[160]">
        {/* Header */}
        <div className="px-10 pt-10 pb-6 border-b border-stone-100 flex justify-between items-start relative shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full">Registro Territorial</span>
               <span className="text-stone-300">•</span>
               <span className="text-[10px] font-bold text-stone-400">Contumazá, Cajamarca</span>
            </div>
            <h3 className="text-3xl font-serif font-black text-stone-900 italic tracking-tight leading-none">
              {user ? 'Editar Identidad' : 'Nueva Alta de Productor'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-900 rounded-2xl transition-all"
          >
            <LucideX size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col px-10 pt-8 pb-32">
            {/* Sección Superior: Perfil & Configuración Crítica */}
            <div className="flex flex-col md:flex-row gap-8 items-center mb-12 bg-stone-50/50 p-6 rounded-[2.5rem] border border-stone-100/50">
               <div className="shrink-0">
                  <ImageUpload 
                    mode="avatar"
                    value={formData.photo} 
                    path="users" 
                    onChange={url => setFormData({...formData, photo: url})} 
                  />
               </div>
               
               <div className="flex-1 w-full space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Rol Operativo</label>
                        <select className="w-full p-3.5 bg-white border-2 border-stone-100 rounded-2xl text-sm font-bold text-stone-700 focus:border-stone-900 transition-all cursor-pointer" value={formData.role} onChange={e=>setFormData({...formData, role:e.target.value})}>
                          <option value="seller">Productor / Artesano</option>
                          <option value="redactor">Redactor de Contenido</option>
                          <option value="superadmin">Gestor Territorial (Admin)</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Estado de Acceso</label>
                        <select className="w-full p-3.5 bg-white border-2 border-stone-100 rounded-2xl text-sm font-bold text-stone-700 focus:border-stone-900 transition-all cursor-pointer" value={formData.status} onChange={e=>setFormData({...formData, status:e.target.value})}>
                          <option value="active">Activo / Visible</option>
                          <option value="inactive">Inactivo / Pausado</option>
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            {/* Gestión de Seguridad (Solo si se está creando o cambiando clave) */}
            {(!user || formData.password !== '') && (
              <div className="mb-12 p-8 bg-blue-50/30 rounded-[2.5rem] border-2 border-blue-100/20 space-y-6 animate-in slide-in-from-top-2">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <LucideShield size={16} />
                    </div>
                    <h4 className="font-serif font-black text-blue-900 italic">Credenciales de Seguridad</h4>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black text-blue-800/60 uppercase tracking-widest block mb-2">Nueva Contraseña</label>
                      <input 
                        required={!user}
                        type="password" 
                        className="w-full p-4 bg-white border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all" 
                        value={formData.password} 
                        onChange={e=>setFormData({...formData, password:e.target.value})}
                        placeholder={user ? "Nueva clave" : "Mínimo 6 caracteres"}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-blue-800/60 uppercase tracking-widest block mb-2">Confirmar Contraseña</label>
                      <div className="relative">
                        <input 
                          required={formData.password !== ''}
                          type="password" 
                          className={`w-full p-4 bg-white border-2 rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none 
                            ${showPasswordError ? 'border-red-500 focus:ring-red-100' : 'border-transparent focus:border-blue-600 focus:ring-blue-100'}
                            ${passwordsMatch && formData.confirmPassword !== '' ? 'border-green-500' : ''}
                          `}
                          value={formData.confirmPassword} 
                          onChange={e=>setFormData({...formData, confirmPassword:e.target.value})}
                          placeholder="Repite la clave"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {showPasswordError && <LucideAlertCircle className="text-red-500 animate-in zoom-in" size={18} />}
                          {passwordsMatch && formData.confirmPassword !== '' && <LucideCheckCircle2 className="text-green-500 animate-in zoom-in" size={18} />}
                        </div>
                      </div>
                    </div>
                 </div>
                 {showPasswordError && (
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter animate-in fade-in">
                     Las contraseñas no coinciden. Por favor, verifica.
                   </p>
                 )}
              </div>
            )}

            {/* Sección: Identidad Personal */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                    <LucideUser size={16} />
                  </div>
                  <h4 className="font-serif font-black text-stone-900 italic">Identidad Personal</h4>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Nombres</label>
                    <input required className="w-full p-4 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all" value={formData.firstName} onChange={e=>setFormData({...formData, firstName:e.target.value})} placeholder="Ej: Maria Elena"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Apellidos</label>
                    <input required className="w-full p-4 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all" value={formData.lastName} onChange={e=>setFormData({...formData, lastName:e.target.value})} placeholder="Ej: Castro Alva"/>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">DNI / Documento</label>
                    <div className="relative">
                      <LucideHash className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <input required maxLength="8" className="w-full p-4 pl-12 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all" value={formData.dni} onChange={e=>setFormData({...formData, dni:e.target.value.replace(/\D/g,'')})} placeholder="DNI de 8 dígitos"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Género</label>
                    <select className="w-full p-4 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all appearance-none cursor-pointer" value={formData.gender} onChange={e=>setFormData({...formData, gender:e.target.value})}>
                      <option value="female">Femenino</option>
                      <option value="male">Masculino</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
               </div>
            </div>

            {/* Sección: Contacto & Territorio */}
            <div className="mb-12">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500">
                    <LucidePhone size={16} />
                  </div>
                  <h4 className="font-serif font-black text-stone-900 italic">Contacto & Territorio</h4>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Correo Electrónico</label>
                    <div className="relative">
                      <LucideMail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <input required type="email" className="w-full p-4 pl-12 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} placeholder="usuario@email.com"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <LucidePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <input required className="w-full p-4 pl-12 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} placeholder="999 999 999"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">Ubicación Actual</label>
                    <div className="relative">
                      <LucideMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={16} />
                      <input className="w-full p-4 pl-12 bg-stone-50 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-stone-900 focus:bg-white transition-all" value={formData.location} onChange={e=>setFormData({...formData, location:e.target.value})} placeholder="Ej: Contumazá, Caserío X..."/>
                    </div>
                  </div>
               </div>
            </div>

            {/* Sección: Marca (Solo para Vendedores) */}
            {formData.role === 'seller' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-8 bg-orange-50/40 rounded-[2rem] border-2 border-orange-100/50 space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                        <LucideBriefcase size={16} />
                      </div>
                      <h4 className="font-serif font-black text-orange-900 italic">Identidad de Producción</h4>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest block mb-3">Rubros Productivos Asociados</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-white/50 border-2 border-orange-100 rounded-2xl min-h-[60px] items-center">
                          {(formData.sectors || []).map(sId => {
                            const s = sectors.find(x => x.id === sId);
                            if (!s) return null;
                            return (
                              <span key={s.id} className="flex items-center gap-1.5 px-3 py-2 bg-orange-600 text-white rounded-xl text-[11px] font-black shadow-md animate-in zoom-in-95">
                                <span>{s.icon}</span>
                                <span>{s.name}</span>
                                <button type="button" onClick={() => setFormData({...formData, sectors: formData.sectors.filter(id => id !== sId)})} className="ml-1 hover:bg-orange-500 rounded-full p-0.5 transition-colors">
                                  <LucideX size={12} />
                                </button>
                              </span>
                            );
                          })}
                          <select 
                            className="bg-transparent text-[11px] font-black text-orange-800/40 outline-none cursor-pointer hover:text-orange-600 transition-colors py-2 px-2"
                            value=""
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val && !formData.sectors.includes(val)) {
                                setFormData({...formData, sectors: [...(formData.sectors || []), val]});
                              }
                            }}
                          >
                            <option value="" disabled>+ Añadir rubro comercial...</option>
                            {sectors.filter(s => !(formData.sectors || []).includes(s.id)).map(s => (
                              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest block mb-2">Nombre de Marca</label>
                          <input className="w-full p-4 bg-white/80 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-orange-500 focus:bg-white transition-all placeholder:text-stone-300" value={formData.brandName} onChange={e=>setFormData({...formData, brandName:e.target.value})} placeholder="Ej: Artesanías del Norte"/>
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest block mb-2">RUC (Opcional)</label>
                          <input maxLength="11" className="w-full p-4 bg-white/80 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-orange-500 focus:bg-white transition-all placeholder:text-stone-300" value={formData.ruc} onChange={e=>setFormData({...formData, ruc:e.target.value.replace(/\D/g,'')})} placeholder="RUC de 11 dígitos"/>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest block mb-2">Especialidad Técnica</label>
                        <input className="w-full p-4 bg-white/80 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-orange-500 focus:bg-white transition-all placeholder:text-stone-300" value={formData.specialty} onChange={e=>setFormData({...formData, specialty:e.target.value})} placeholder="Ej: Tejido a mano, Apicultura orgánica..."/>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-orange-800/60 uppercase tracking-widest block mb-2">Biografía / Narrativa</label>
                        <textarea className="w-full p-4 bg-white/80 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-orange-500 focus:bg-white transition-all placeholder:text-stone-300 resize-none h-32" value={formData.bio} onChange={e=>setFormData({...formData, bio:e.target.value})} placeholder="Cuéntanos la historia detrás de tu labor..."/>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="relative">
                          <LucideInstagram className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                          <input className="w-full p-4 pl-12 bg-white/80 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-orange-500 focus:bg-white transition-all placeholder:text-stone-300" value={formData.instagram} onChange={e=>setFormData({...formData, instagram:e.target.value})} placeholder="@vínculo_instagram"/>
                        </div>
                        <div className="relative">
                          <LucideFacebook className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={16} />
                          <input className="w-full p-4 pl-12 bg-white/80 border-2 border-transparent rounded-2xl text-sm font-bold text-stone-800 focus:border-orange-500 focus:bg-white transition-all placeholder:text-stone-300" value={formData.facebook} onChange={e=>setFormData({...formData, facebook:e.target.value})} placeholder="Link de Facebook"/>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            )}
        </form>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 pb-10 bg-white/80 backdrop-blur-xl border-t border-stone-100 flex justify-end items-center gap-4 z-20">
           <button type="button" onClick={onClose} className="px-8 py-3.5 text-stone-400 font-bold hover:text-stone-900 transition-colors">Cancelar</button>
           <button 
             onClick={handleSubmit}
             disabled={showPasswordError}
             className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-stone-200 hover:bg-stone-800 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale"
           >
             {user ? 'Guardar Cambios' : 'Registrar Productor'}
           </button>
        </div>
      </div>
    </div>
  );
}
