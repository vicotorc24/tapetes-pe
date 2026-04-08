"use client";
import React from 'react';
import { LucideClock, LucideLogOut, LucideMessageSquare, LucideShieldCheck } from 'lucide-react';

export function PendingApprovalView({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-stone-200 text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Fondo Decorativo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-andeansky-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-terracotta-50 rounded-full blur-3xl opacity-50"></div>

        <div className="relative">
          {/* Icono de Espera Animado */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-andeansky-50 rounded-3xl flex items-center justify-center text-andeansky-600 animate-pulse">
                <LucideClock size={48} strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-stone-100 flex items-center justify-center text-andeansky-500">
                <LucideShieldCheck size={20} />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold font-serif text-stone-900 mb-4 tracking-tight">Cuenta en Revisión</h1>
          
          <div className="space-y-4 mb-10">
            <p className="text-stone-500 leading-relaxed text-sm">
              Hola, <span className="font-bold text-stone-800">{user?.name || user?.displayName || 'Productor/a'}</span>. 
              Tu solicitud de acceso ha sido recibida y se encuentra actualmente en el **Módulo de Aprobación Municipal**.
            </p>
            <div className="p-4 bg-andeansky-50/50 rounded-2xl border border-andeansky-100 italic text-[11px] text-andeansky-700 leading-snug">
              "En cumplimiento con los protocolos de seguridad de Contumazá, cada perfil es validado manualmente para asegurar la autenticidad de nuestra herencia cultural."
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col gap-3">
             <button 
                onClick={() => window.open('https://wa.me/51934241718', '_blank')}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-stone-800 transition shadow-xl shadow-stone-100 flex items-center justify-center gap-2"
             >
                <LucideMessageSquare size={16} /> Contactar Soporte
             </button>
             
             <button 
                onClick={onLogout}
                className="w-full bg-white text-stone-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-500 transition-colors flex items-center justify-center gap-2"
             >
                <LucideLogOut size={14} /> Cerrar Sesión
             </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-stone-50">
             <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Tapetes.pe - Módulo Institucional 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
