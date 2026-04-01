"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LucideEye, LucideUserCheck, LucideLogOut, LucideShield } from 'lucide-react';

export function ImpersonationBanner() {
  const { impersonatedUser, stopImpersonating } = useAuth();

  if (!impersonatedUser) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[9999] animate-in slide-in-from-top duration-500">
      <div className="bg-purple-900 border-b border-purple-700 shadow-2xl overflow-hidden">
        {/* Animated glow background */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,#c084fc,transparent)] animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4 text-white">
            <div className="bg-amber-400 p-1.5 rounded-lg shadow-lg flex items-center justify-center animate-bounce">
              <LucideEye size={18} className="text-purple-900" />
            </div>
            
            <div className="flex flex-col">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-200 opacity-80 leading-none mb-1">
                Modo Suplantación Activado
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  Viendo como: <span className="text-amber-300 underline decoration-amber-400/30 underline-offset-4">{impersonatedUser.name}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-[9px] font-bold uppercase tracking-widest text-purple-100">
                  {impersonatedUser.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/60 mr-4">
                <LucideShield size={14} className="text-amber-400/60" />
                <span className="text-[10px] font-medium tracking-wide">Tu sesión real está protegida</span>
             </div>

             <button 
                onClick={stopImpersonating}
                className="group flex items-center gap-2 bg-white text-purple-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all duration-300 shadow-lg active:scale-95 border-b-4 border-stone-200 hover:border-amber-200"
              >
                <LucideLogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                <span>Regresar a mi sesión</span>
              </button>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient overlay below the banner */}
      <div className="h-4 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>
    </div>
  );
}
