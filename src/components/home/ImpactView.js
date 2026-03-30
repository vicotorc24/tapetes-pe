"use client";
import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideHeartHandshake, LucideTrendingUp, LucideAward } from 'lucide-react';

export function ImpactView() {
  const { t } = useTranslation();

  return (
    <div className="pt-20 animate-in fade-in">
      {/* Hero Impacto */}
      <div className="bg-andeangreen-900 border-b-8 border-terracotta-500 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-0"></div>
        <div className="relative z-10">
          <span className="text-terracotta-400 font-bold uppercase tracking-widest text-sm block mb-4">Nuestro Motor de Desarrollo</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">El Impacto de Tapetes.pe</h1>
          <p className="text-andeangreen-100 max-w-2xl mx-auto text-lg leading-relaxed">Conectamos la herencia viva de Contumazá con el mercado digital, generando una economía autosostenible para nuestras mujeres tejedoras.</p>
        </div>
      </div>

      {/* El Problema y Solución */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">El Reto en la Montaña</h2>
            <p className="text-stone-600 leading-relaxed className='mb-4' mb-4">Durante décadas, el increíble talento de las artesanas contumacinas estuvo limitado a mercados físicos locales, lo que reducía el valor de su arte y obligaba a muchas mujeres a abandonar el tejido para dedicarse a otras labores menos rentables.</p>
            <p className="text-stone-600 leading-relaxed">Esta pérdida gradual no solo afectaba sus ingresos, sino que amenazaba con silenciar un legado cultural transmitido de abuelas a madres durante siglos.</p>
          </div>
          <div className="bg-stone-200 rounded-3xl h-80 overflow-hidden shadow-2xl relative border-4 border-wheat-200 rotate-2 hover:-rotate-1 transition-transform">
            <img src="/images/fb_1.jpg" className="w-full h-full object-cover" alt="Manos tejiendo en la montaña" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 bg-stone-200 rounded-3xl h-80 overflow-hidden shadow-2xl relative border-4 border-andeansky-200 -rotate-2 hover:rotate-1 transition-transform">
            <img src="/images/fb_3.jpg" className="w-full h-full object-cover" alt="Tapete terminado" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-6">Nuestra Solución Tecnológica</h2>
            <p className="text-stone-600 leading-relaxed mb-4"><strong>Tapetes.pe</strong> actúa como un puente directo de Comercio Justo entre el consumidor internacional y la mesa de la artesana. Al digitalizar el catálogo, eliminamos por completo a los revendedores intermediarios.</p>
            <p className="text-stone-600 leading-relaxed">El modelo no solo asegura el pago completo del precio de venta directamente a la tejedora, sino que utiliza las ganancias excedentes para reinvertir en herramientas, hilo de mayor calidad y empoderamiento tecnológico.</p>
          </div>
        </div>
      </div>

      {/* Transparencia - Distribución de ganancias */}
      <div className="bg-wheat-50 py-24 border-y border-wheat-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-12">Total Transparencia</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-wheat-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-andeangreen-100 text-andeangreen-700 rounded-full flex items-center justify-center mb-4"><LucideHeartHandshake size={32} /></div>
              <h3 className="text-4xl font-bold text-andeangreen-700 mb-2">100%</h3>
              <p className="text-stone-600 font-medium">Ganancia Directa a la Artesana Creadora</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-wheat-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-andeansky-100 text-andeansky-700 rounded-full flex items-center justify-center mb-4"><LucideTrendingUp size={32} /></div>
              <h3 className="text-4xl font-bold text-andeansky-700 mb-2">+40h</h3>
              <p className="text-stone-600 font-medium">De capacitación digital y negocios por año</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-wheat-100 flex flex-col items-center">
              <div className="w-16 h-16 bg-terracotta-100 text-terracotta-700 rounded-full flex items-center justify-center mb-4"><LucideAward size={32} /></div>
              <h3 className="text-4xl font-bold text-terracotta-700 mb-2">1</h3>
              <p className="text-stone-600 font-medium">Legado Asegurado para Contumazá</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
