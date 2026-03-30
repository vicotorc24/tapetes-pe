"use client";
import React from 'react';
import { LucideStar } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AboutPage() {
  const { addToCart } = useCart();

  const handleContact = () => {
    window.open(`https://wa.me/51999999999?text=Hola,%20quisiera%20saber%20m%C3%A1s%20sobre%20su%20historia.`);
  };

  return (
    <div className="animate-in fade-in pb-20">
      <div className="bg-stone-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Nuestra Historia</h1>
        <p className="text-stone-400 max-w-xl mx-auto">Hilos que unen generaciones en Contumazá.</p>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
             <h2 className="text-2xl font-bold text-stone-900 mb-4 font-serif">La Tradición</h2>
             <p className="text-stone-600 leading-relaxed mb-4">
               En las alturas de Contumazá, tejer no es solo un oficio, es una forma de contar historias. Desde niñas, aprendemos a entrelazar hilos mirando la neblina bajar por el cerro El Calvario.
             </p>
             <p className="text-stone-600 leading-relaxed">
               Cada prenda que vendemos en <strong>Tapetes.pe</strong> lleva horas de dedicación, risas y la esperanza de mujeres emprendedoras que buscan sacar adelante a sus familias sin abandonar su tierra.
             </p>
           </div>
           <div className="bg-stone-200 rounded-2xl h-64 overflow-hidden shadow-lg rotate-2">
             <img src="/images/474092271_1292160221951744_5829842415072255331_n (1).jpg" className="w-full h-full object-cover" alt="Manos tejiendo"/>
           </div>
        </div>
        
        <div className="bg-orange-50 p-8 rounded-2xl text-center border border-orange-100">
           <LucideStar className="mx-auto text-orange-400 mb-4" size={32}/>
           <h3 className="text-xl font-bold text-stone-900 mb-2">¿Por qué elegirnos?</h3>
           <p className="text-stone-600 max-w-2xl mx-auto mb-6">
             Al comprar aquí, tratas directamente con la artesana. Sin intermediarios industriales. Comercio Justo real.
           </p>
           <button onClick={handleContact} className="bg-stone-900 text-white px-6 py-3 rounded-full font-bold hover:bg-stone-800 transition">
             Escríbenos por WhatsApp
           </button>
        </div>
      </div>
    </div>
  );
}
