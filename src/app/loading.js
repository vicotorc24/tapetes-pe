"use client";
import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 min-h-screen bg-stone-50 z-[100] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="relative mb-8">
        {/* Animated logo silhouette or spinner */}
        <div className="w-20 h-20 border-4 border-stone-200 border-t-orange-500 rounded-full animate-spin shadow-xl"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-stone-900 rounded-lg transform rotate-45 animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-serif text-stone-900 animate-pulse">Cargando Made In Contumazá</h2>
        <p className="text-stone-400 font-medium tracking-[0.2em] uppercase text-xs animate-bounce delay-150">Artesanía de Contumazá</p>
      </div>
      
      {/* Decorative progress bar */}
      <div className="max-w-xs w-full mt-12 h-1 bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 via-terracotta-500 to-andeansky-500 w-1/2 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
