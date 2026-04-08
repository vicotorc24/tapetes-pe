"use client";
import React, { useState, useRef } from 'react';
import { 
  LucideCamera, 
  LucideUser, 
  LucidePhone, 
  LucideInstagram, 
  LucideFacebook, 
  LucideAward, 
  LucideFileText,
  LucideSave,
  LucideRefreshCcw,
  LucideMail,
  LucideSparkles,
  LucideShield,
  LucideMapPin
} from 'lucide-react';
import { updateUser } from '../../lib/services/users';
import { uploadFile } from '../../lib/services/storage';

export function ProfileManager({ user, sectors = [], onUpdate, setFeedback }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Lógica de migración: Si no tiene firstName, intentamos partir el 'name' antiguo
  const getInitialNames = () => {
    if (user.firstName) return { firstName: user.firstName, lastName: user.lastName || '' };
    
    // Fallback: partir por el último espacio (estilo común en apellidos peruanos)
    const full = user.name || '';
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
    phone: user.phone || '',
    bio: user.bio || '',
    specialty: user.specialty || '',
    brandName: user.brandName || '',
    instagram: user.instagram || '',
    facebook: user.facebook || '',
    photo: user.photo || ''
  });

  // Sincronizar estado si el usuario cambia externamente (ej: post auto-save o navegación)
  React.useEffect(() => {
    const names = getInitialNames();
    setFormData(prev => ({
      ...prev,
      firstName: names.firstName,
      lastName: names.lastName,
      photo: user.photo || prev.photo, // Mantener foto nueva si existe en user
      phone: user.phone || prev.phone,
      bio: user.bio || prev.bio,
      specialty: user.specialty || prev.specialty,
      brandName: user.brandName || prev.brandName,
      instagram: user.instagram || prev.instagram,
      facebook: user.facebook || prev.facebook
    }));
  }, [user.id, user.photo, user.firstName, user.lastName]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'avatars');
      
      // Actualizar estado local
      const updatedData = { ...formData, photo: url, id: user.id };
      setFormData(updatedData);

      // AUTO-SAVE: Guardar solo la foto inmediatamente en la DB
      await updateUser(user.id, { photo: url }, user);
      
      // Refrescar UI global (Pasando el ID para que AdminDashboard sepa a quién actualizar)
      if (onUpdate) await onUpdate(updatedData);

      if (setFeedback) setFeedback({ type: 'success', message: '¡Foto de perfil actualizada y guardada automáticamente!' });
    } catch (error) {
      if (setFeedback) setFeedback({ type: 'error', message: 'Error al subir foto: ' + error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    if (setFeedback) setFeedback({ type: 'loading', message: 'Actualizando perfil...' });

    try {
      // Pasamos el usuario actual como administrador para el log de auditoría
      await updateUser(user.id, formData, user);
      
      // Notificar al padre para refrescar la data global (incluyendo el AuthContext)
      if (onUpdate) await onUpdate({ ...formData, id: user.id });

      if (setFeedback) {
        setFeedback({ 
          type: 'success', 
          message: 'Tu perfil profesional ha sido actualizado correctamente.' 
        });
      }
    } catch (error) {
      if (setFeedback) setFeedback({ type: 'error', message: 'Error al guardar: ' + error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex justify-between items-end mb-8 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <LucideSparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Identidad Digital</span>
          </div>
          <h2 className="text-4xl font-bold text-stone-900 tracking-tight font-serif italic">Mi Ficha de Autor</h2>
          <p className="text-stone-500 max-w-md leading-relaxed">Tu carta de presentación al mundo. Personaliza cómo quieres que el marketplace te descubra.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cabecera Hero Premium */}
        <div className="relative overflow-hidden bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-2xl shadow-stone-200/50 group">
          {/* Fondo decorativo con degradado cálido */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/30 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-orange-200/40 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-stone-100/50 rounded-full -ml-10 -mb-10 blur-2xl"></div>
          
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 z-10">
            <div className="relative">
              {/* Avatar con doble borde y glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-orange-500/20 to-orange-100/50 rounded-full blur-sm"></div>
              <div className={`relative w-40 h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-stone-100 ring-4 ring-orange-50/50 ${isUploading ? 'opacity-50' : ''}`}>
                <img 
                  src={formData.photo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName || 'U'}`} 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" 
                  alt="Avatar"
                />
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 bg-orange-700 text-white p-3 rounded-full shadow-2xl hover:bg-orange-800 transition transform hover:scale-110 active:scale-95 ring-4 ring-white"
              >
                {isUploading ? <LucideRefreshCcw size={18} className="animate-spin" /> : <LucideCamera size={18} />}
              </button>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden" 
                accept="image/*"
              />
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h3 className="text-4xl font-extrabold text-stone-900 tracking-tight">{formData.firstName} {formData.lastName}</h3>
                <div className="flex items-center justify-center md:justify-start gap-2">
                   <LucideShield size={14} className="text-orange-600/60" />
                   <span className="text-xs font-black text-stone-400 uppercase tracking-widest leading-none">
                     {user.role === 'superadmin' ? 'Custodio del Sistema' : (user.role === 'redactor' ? 'Voz de la Cultura' : 'Socio Productor Local')}
                   </span>
                </div>
              </div>

              {/* Sector Badges (Integrados con la nueva data) */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                {(user.sectors || []).length > 0 ? (
                  user.sectors.map(sId => {
                    const s = sectors.find(x => x.id === sId);
                    if (!s) return null;
                    return (
                      <span key={s.id} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-orange-50 text-orange-800 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-orange-100 shadow-sm">
                        <span>{s.icon}</span> {s.name}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[10px] font-bold text-stone-400 italic">Sector no asignado por admin</span>
                )}
                <span className="h-4 w-px bg-stone-200 mx-2 hidden md:block"></span>
                <span className="text-[10px] text-stone-400 font-bold uppercase py-1.5 px-3 border border-stone-100 rounded-xl bg-stone-50/50">Socio 2024</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Información Básica */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8">
            <div className="bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100/50 space-y-8">
              <div className="flex items-center justify-between border-b border-stone-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-50 rounded-2xl text-orange-700">
                     <LucideUser size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-stone-900 uppercase text-[11px] tracking-[0.2em]">Identidad Personal</h4>
                    <p className="text-xs text-stone-400 font-medium">Datos básicos de tu cuenta</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase mb-2 block tracking-[0.15em] px-1">Nombres</label>
                  <input 
                    required
                    value={formData.firstName} 
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-4 bg-stone-50/50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-orange-100/30 focus:border-orange-300 outline-none transition-all font-bold text-stone-800 placeholder-stone-300"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase mb-2 block tracking-[0.15em] px-1">Apellidos</label>
                  <input 
                    required
                    value={formData.lastName} 
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-4 bg-stone-50/50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-orange-100/30 focus:border-orange-300 outline-none transition-all font-bold text-stone-800 placeholder-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase mb-2 block tracking-[0.15em] px-1">WhatsApp Profesional</label>
                  <div className="relative">
                    <LucidePhone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input 
                      placeholder="999 999 999"
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full p-4 pl-12 bg-stone-50/50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-orange-100/30 focus:border-orange-300 outline-none transition-all font-bold text-stone-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-stone-400 uppercase mb-2 block tracking-[0.15em] px-1">E-mail de Acceso</label>
                  <div className="relative">
                    <LucideMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                    <input 
                      readOnly
                      value={user.email} 
                      className="w-full p-4 pl-12 bg-stone-100/30 border border-stone-100 rounded-2xl text-stone-400 cursor-not-allowed font-medium select-none"
                    />
                  </div>
                </div>
              </div>

              {/* Marca & Especialidad */}
              <div className="p-6 bg-orange-50/30 rounded-3xl border border-orange-100/40 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LucideAward size={16} className="text-orange-700" />
                    <h5 className="text-[10px] font-black text-orange-950 uppercase tracking-[0.1em]">Mi Marca Personal</h5>
                  </div>
                  <input 
                    placeholder="Tu emprendimiento"
                    value={formData.brandName} 
                    onChange={e => setFormData({...formData, brandName: e.target.value})}
                    className="w-full p-4 bg-white border border-orange-100 rounded-2xl focus:ring-4 focus:ring-orange-200/20 focus:border-orange-400 outline-none transition-all font-black text-orange-900 placeholder-orange-200"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <LucideSparkles size={16} className="text-orange-400" />
                    <h5 className="text-[10px] font-black text-orange-950 uppercase tracking-[0.1em]">Especialidad</h5>
                  </div>
                  <input 
                    placeholder="Ej: Tejedora a telar"
                    value={formData.specialty} 
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                    className="w-full p-4 bg-white/70 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-orange-100/20 focus:border-orange-300 outline-none transition-all font-medium text-stone-700 placeholder-stone-200"
                  />
                </div>
              </div>
            </div>

            {/* Redes Sociales - Ahora más elegante */}
            <div className="bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-[2rem] border border-stone-100 shadow-xl shadow-stone-100/50 space-y-6">
              <h4 className="font-black text-stone-900 uppercase text-[11px] tracking-[0.2em] mb-4">Presencia en Redes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                    <LucideInstagram size={20} className="text-stone-300 group-focus-within:text-pink-500" />
                  </div>
                  <input 
                    placeholder="@usuario"
                    value={formData.instagram} 
                    onChange={e => setFormData({...formData, instagram: e.target.value})}
                    className="w-full p-4 pl-12 bg-stone-50/50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-pink-100 focus:border-pink-200 outline-none transition-all font-bold text-stone-800"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                    <LucideFacebook size={20} className="text-stone-300 group-focus-within:text-blue-500" />
                  </div>
                  <input 
                    placeholder="Nombre en Facebook"
                    value={formData.facebook} 
                    onChange={e => setFormData({...formData, facebook: e.target.value})}
                    className="w-full p-4 pl-12 bg-stone-50/50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-200 outline-none transition-all font-bold text-stone-800"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biografía Lateral */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col">
            <div className="bg-stone-900 p-8 md:p-10 rounded-[2.5rem] border border-stone-800 shadow-2xl flex flex-col h-full relative overflow-hidden group">
              {/* Decoración abstracta */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-700/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-700 rounded-2xl text-orange-200">
                       <LucideFileText size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase text-[11px] tracking-[0.2em]">Mi Historia</h4>
                      <p className="text-xs text-stone-500 font-medium italic">Tu narrativa en Tapetes.pe</p>
                    </div>
                 </div>
              </div>
              
              <div className="relative flex-1 flex flex-col z-10">
                <textarea 
                  rows="12"
                  placeholder="Aquí es donde ocurre la magia... Cuéntanos tu proceso, tus raíces y qué te inspira cada día."
                  value={formData.bio} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  className="flex-1 w-full p-6 bg-white/5 border border-white/10 rounded-3xl focus:ring-4 focus:ring-orange-700/20 focus:border-orange-700 outline-none transition-all font-serif text-lg text-white placeholder-white/20 leading-relaxed resize-none scrollbar-hide"
                />
                
                <div className="mt-8 flex items-start gap-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-orange-700/30 flex items-center justify-center text-orange-500 shrink-0">
                      <LucideMapPin size={18} />
                   </div>
                   <p className="text-[11px] text-stone-400 font-medium leading-relaxed italic">
                     "Tu historia aparecerá en el catálogo para generar confianza con tus clientes finales."
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button 
            type="submit"
            disabled={isSaving}
            className={`
              bg-orange-700 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-800 transition-all 
              shadow-2xl shadow-orange-200/50 flex items-center justify-center gap-4
              ${isSaving ? 'opacity-80 scale-95' : 'hover:-translate-y-2 hover:shadow-orange-300 hover:scale-105 active:scale-95'}
            `}
          >
            {isSaving ? <LucideRefreshCcw className="animate-spin" size={20} /> : <LucideSave size={20} />}
            {isSaving ? 'Sincronizando...' : 'Publicar Perfil Profesional'}
          </button>
        </div>
      </form>
    </div>
  ); 
}
