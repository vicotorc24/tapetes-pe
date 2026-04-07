"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideMapPin, LucideSend, LucideCheckCircle, LucideTag } from 'lucide-react';
import { useTranslation } from '@/context/LanguageContext';
import { Navbar } from '../layout/Navbar';
import { AnalyticsEvents } from '@/lib/analytics';

export function RegisterView() {
  const { register } = useAuth();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: 'Contumazá, Cajamarca',
    specialty: '',
    brandName: '',
    role: 'seller',
    status: 'pending' // Estado crucial para la evaluación del admin
  });

  // Tracking de vista del formulario
  React.useEffect(() => {
    AnalyticsEvents.JOIN_INTERACTION('form_view');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('unete.pass_mismatch'));
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...dataToSave } = formData;
      const result = await register(formData.email, formData.password, dataToSave);
      if (result.success) {
        AnalyticsEvents.JOIN_INTERACTION('form_success');
        setIsSubmitted(true);
      } else {
        AnalyticsEvents.JOIN_INTERACTION('form_failure');
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
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">{t('unete.success_title')}</h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              {t('unete.success_desc').replace('{name}', formData.firstName)}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-stone-900 text-white px-10 py-4 rounded-full font-bold hover:bg-terracotta-600 transition-colors"
            >
              {t('unete.back_btn')}
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
            <span className="text-terracotta-600 font-bold tracking-widest text-xs uppercase">{t('unete.tag')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-8 leading-tight" dangerouslySetInnerHTML={{ __html: t('unete.title').replace('Contumazá', '<span class="italic text-terracotta-600 font-light underline decoration-terracotta-200">Contumazá</span>') }}>
          </h1>
          <p className="text-xl text-stone-600 font-light leading-relaxed mb-10">
            {t('unete.desc')}
          </p>
          <div className="space-y-6">
            <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-terracotta-200 transition-colors">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-terracotta-600">
                <LucideSend size={20} />
              </div>
              <div>
                <p className="font-bold text-stone-900">{t('unete.benefit_title')}</p>
                <p className="text-sm text-stone-500">{t('unete.benefit_desc')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-stone-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-right-8 duration-1000">
           {/* Decorativo */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

           <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{t('unete.form_title')}</h3>
                <p className="text-stone-400 text-sm">{t('unete.form_subtitle')}</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <LucideUser className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder={t('unete.firstName_placeholder')}
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all font-medium"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="relative">
                  <LucideUser className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder={t('unete.lastName_placeholder')}
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all font-medium"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="relative">
                <LucideTag className="absolute left-4 top-4 text-stone-500" size={18} />
                <input 
                  type="text" 
                  placeholder={t('unete.brandName_placeholder')}
                  className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all font-bold text-orange-400 placeholder:font-normal"
                  value={formData.brandName}
                  onChange={e => setFormData({...formData, brandName: e.target.value})}
                />
              </div>

                <div className="relative">
                  <LucideMail className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder={t('unete.email_placeholder')}
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
                    placeholder={t('unete.pass_placeholder')}
                    className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <LucideLock className="absolute left-4 top-4 text-stone-500" size={18} />
                  <input 
                    required 
                    type="password" 
                    placeholder={t('unete.pass_confirm_placeholder')}
                    className={`w-full bg-stone-800/50 border rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'border-red-500/50 focus:ring-red-500' 
                        : 'border-stone-700/50 focus:ring-terracotta-500'
                    }`}
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <LucidePhone className="absolute left-4 top-4 text-stone-500" size={18} />
                    <input 
                      required 
                      type="text" 
                      placeholder={t('unete.phone_placeholder')}
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
                      placeholder={t('unete.location_placeholder')}
                      className="w-full bg-stone-800/50 border border-stone-700/50 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-all"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <textarea 
                    placeholder={t('unete.specialty_placeholder')}
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
                {loading ? t('unete.loading_btn') : t('unete.submit_btn')}
              </button>

              <p className="text-[11px] text-stone-500 text-center px-4">
                {t('unete.privacy')}
              </p>
           </form>
        </div>
      </div>
    </div>
  );
}
