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
  LucideMail
} from 'lucide-react';
import { updateUser } from '../../lib/services/users';
import { uploadFile } from '../../lib/services/storage';

export function ProfileManager({ user, setFeedback }) {
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadFile(file, 'avatars');
      setFormData({ ...formData, photo: url });
      if (setFeedback) setFeedback({ type: 'success', message: '¡Foto cargada! No olvides guardar los cambios.' });
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
      await updateUser(user.id, formData);
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
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight font-serif">Mi Perfil Profesional</h2>
          <p className="text-stone-500 mt-1">Personaliza tu presencia en el marketplace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cabecera de Perfil */}
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-10 hover:shadow-md transition-shadow">
          <div className="relative group">
            <div className={`w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-stone-100 ${isUploading ? 'opacity-50' : ''}`}>
              <img 
                src={formData.photo || 'https://api.dicebear.com/7.x/initials/svg?seed=U'} 
                className="w-full h-full object-cover" 
                alt="Avatar"
              />
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-1 right-1 bg-orange-700 text-white p-2.5 rounded-full shadow-lg hover:bg-orange-800 transition transform hover:scale-110 active:scale-95"
            >
              {isUploading ? <LucideRefreshCcw size={16} className="animate-spin" /> : <LucideCamera size={16} />}
            </button>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden" 
              accept="image/*"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-stone-900 mb-1">{formData.firstName} {formData.lastName}</h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                {user.role === 'superadmin' ? 'Super Admin' : (user.role === 'redactor' ? 'Redactor Cultura' : 'Productor/a Local')}
              </span>
              <span className="text-xs text-stone-400 font-medium">Desde el 2024</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Información Básica */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2">
               <LucideUser size={18} className="text-orange-700" />
               <h4 className="font-bold text-stone-800 uppercase text-[11px] tracking-widest">Información Personal</h4>
            </div>
            
            <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase mb-1.5 block tracking-wider">Nombres</label>
                <input 
                  required
                  value={formData.firstName} 
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase mb-1.5 block tracking-wider">Apellidos</label>
                <input 
                  required
                  value={formData.lastName} 
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full p-3.5 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase mb-1.5 block tracking-wider">Correo Electrónico (Solo Lectura)</label>
              <div className="relative">
                <LucideMail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                <input 
                  readOnly
                  value={user.email} 
                  className="w-full p-3.5 pl-11 bg-stone-100 border border-stone-200 rounded-xl text-stone-500 cursor-not-allowed font-medium select-none"
                />
              </div>
            </div>
              
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase mb-1.5 block tracking-wider">WhatsApp de Contacto</label>
                <div className="relative">
                  <LucidePhone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input 
                    placeholder="Ej: 999 999 999"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3.5 pl-11 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase mb-1.5 block tracking-wider">Nombre de Marca / Emprendimiento (Opcional)</label>
                  <div className="relative">
                    <LucideAward size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-700" />
                    <input 
                      placeholder="Ej: Alva's"
                      value={formData.brandName} 
                      onChange={e => setFormData({...formData, brandName: e.target.value})}
                      className="w-full p-3.5 pl-11 bg-stone-50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-bold text-orange-950"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase mb-1.5 block tracking-wider">Especialidad / Técnica</label>
                  <div className="relative">
                    <LucideAward size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input 
                      placeholder="Ej: Crochet, Telar de Cintura..."
                      value={formData.specialty} 
                      onChange={e => setFormData({...formData, specialty: e.target.value})}
                      className="w-full p-3.5 pl-11 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
               <LucideFileText size={18} className="text-orange-700" />
               <h4 className="font-bold text-stone-800 uppercase text-[11px] tracking-widest">Biografía e Historia</h4>
            </div>
            <textarea 
              rows="8"
              placeholder="Cuéntanos un poco sobre tu historia, tu arte y lo que te inspira..."
              value={formData.bio} 
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="flex-1 w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <h4 className="font-bold text-stone-800 uppercase text-[11px] tracking-widest mb-6">Redes Sociales (Opcional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <LucideInstagram size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                placeholder="Usuario de Instagram (ej: victoria_teje)"
                value={formData.instagram} 
                onChange={e => setFormData({...formData, instagram: e.target.value})}
                className="w-full p-3.5 pl-12 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium"
              />
            </div>
            <div className="relative">
              <LucideFacebook size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                placeholder="Nombre en Facebook"
                value={formData.facebook} 
                onChange={e => setFormData({...formData, facebook: e.target.value})}
                className="w-full p-3.5 pl-12 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-100 focus:border-orange-200 outline-none transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="submit"
            disabled={isSaving}
            className={`
              bg-orange-700 text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-800 transition-all 
              shadow-lg hover:shadow-orange-200 flex items-center justify-center gap-3
              ${isSaving ? 'opacity-80 scale-95' : 'hover:-translate-y-1'}
            `}
          >
            {isSaving ? <LucideRefreshCcw className="animate-spin" size={20} /> : <LucideSave size={20} />}
            {isSaving ? 'Guardando...' : 'Guardar Perfil Profesional'}
          </button>
        </div>
      </form>
    </div>
  ); 
}
