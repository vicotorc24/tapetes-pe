"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideMapPin, LucideSend, LucideCheckCircle } from 'lucide-react';
import { Navbar } from '../layout/Navbar';

export function RegisterView() {
  const { register } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: 'Contumazá, Cajamarca',
    specialty: '',
    role: 'seller',
    status: 'pending' // Estado crucial para la evaluación del admin
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await register(formData.email, formData.password, formData);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || 'Ocurrió un error al enviar tu solicitud.');
      }
    } catch (e) {
      setError('Error de conexión. Inténtalo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-stone-100 animate-in zoom-in duration-700">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <LucideCheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">¡Solicitud Enviada!</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              Gracias {formData.name}, tu solicitud para unirte como artesana ha sido recibida correctamente. 
              Nuestro administrador evaluará tu perfil y te contactará pronto vía email o WhatsApp.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-terracotta-600 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16 items-center">
        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-12 bg-terracotta-500"></span>
            <span className="text-terracotta-600 font-bold tracking-widest text-xs uppercase">Únete al Legado</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-8 leading-tight">
            Teje con nosotras <br/>el futuro de <span className="italic text-terracotta-600 font-light underline decoration-terracotta-200">Contumazá</span>
          </h1>
          <p className="text-xl text-stone-600 font-light leading-relaxed mb-10">
            Buscamos manos talentosas que deseen compartir su arte con el mundo. Al registrarte, entrarás en un proceso de validación para asegurar la autenticidad de nuestra comunidad.
          </p>
          <div className="space-y-6">
            <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-terracotta-200 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-terracotta-600">
                <LucideSend size={20} />
              </div>
              <div>
                <p className="font-bold text-stone-900">Evaluación Directa</p>
                <p className="text-sm text-stone-500">Revisamos cada solicitud individualmente para mantener la calidad premium.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-right-8 duration-1000">
           {/* Decorativo */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

           <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Formulario de Solicitud</h3>
                <p className="text-stone-400 text-sm">Completa tus datos para iniciar el proceso</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <LucideUser className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder="Nombre Completo"
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <LucideMail className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder="Correo Electrónico"
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <LucideLock className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="password" 
                    placeholder="Crear Contraseña"
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <LucidePhone className="absolute left-4 top-4 text-stone-500" size={18} />
                    <input 
                      required 
                      type="text" 
                      placeholder="Teléfono"
                      className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <LucideMapPin className="absolute left-4 top-4 text-stone-500" size={18} />
                    <input 
                      required 
                      type="text" 
                      placeholder="Ubicación"
                      className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <textarea 
                    placeholder="Cuéntanos sobre tu especialidad (ej: Tapetes circulares, crochet...)"
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all resize-none h-24"
                    value={formData.specialty}
                    onChange={e => setFormData({...formData, specialty: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-terracotta-600 text-white py-4 rounded-2xl font-bold hover:bg-terracotta-500 transition-all shadow-xl shadow-terracotta-900/40 relative overflow-hidden disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>

              <p className="text-[11px] text-stone-500 text-center px-4">
                Al enviar tus datos, aceptas que Tapetes.pe guarde tu información para el proceso de selección artesanal.
              </p>
           </form>
        </div>
      </div>
    </div>
  );
}
