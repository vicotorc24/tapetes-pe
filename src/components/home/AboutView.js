"use client";
import React from 'react';
import { LucideStar } from 'lucide-react';

export function AboutView({ onContact }) {
  return (
    <div className="pt-20 animate-in fade-in">
      <div className="bg-andeangreen-900 border-b-8 border-terracotta-500 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Nuestra Historia</h1>
        <p className="text-andeangreen-100 max-w-xl mx-auto text-lg">Hilos que unen generaciones al pie de la montaña San Mateo.</p>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
           <div>
            <h2 className="text-2xl font-bold text-stone-900 mb-4 font-serif">La Tradición</h2>
            <p className="text-stone-600 leading-relaxed mb-4">En las alturas de Contumazá, tejer no es solo un oficio, es una forma de preservar la vida. Manos que amasan el famoso pan contumacino al alba y tejen historias entre la neblina por la tarde, siempre bajo la mirada de San Mateo.</p>
            <p className="text-stone-600 leading-relaxed">Cada prenda que vendemos en <strong>Tapetes.pe</strong> lleva horas de dedicación, fe y la esperanza de valientes mujeres emprendedoras del campo que honran sus raíces.</p>
           </div>
           <div className="bg-terracotta-50 rounded-2xl h-64 overflow-hidden shadow-lg rotate-2 border-2 border-terracotta-100">
            <img src="/images/fb_1.jpg" className="w-full h-full object-cover" alt="Manos tejiendo"/>
           </div>
        </div>
        <div className="bg-terracotta-50 p-8 rounded-2xl text-center border border-terracotta-100">
          <LucideStar className="mx-auto text-terracotta-500 mb-4" size={32}/>
          <h3 className="text-xl font-bold text-terracotta-900 mb-2">¿Por qué elegirnos?</h3>
          <p className="text-terracotta-700 max-w-2xl mx-auto mb-6">Comercio Justo real. Trato directo con la artesana, llevando la calidez de su hogar al tuyo.</p>
          <button onClick={onContact} className="bg-andeangreen-700 text-white px-6 py-3 rounded-full font-bold hover:bg-andeangreen-900 transition">Escríbenos por WhatsApp</button>
        </div>
      </div>
    </div>
  );
}
