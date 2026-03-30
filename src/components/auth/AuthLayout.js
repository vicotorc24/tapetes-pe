import React from 'react';

export function AuthLayout({ children, title, subtitle }) { 
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-[#FFFBF7] px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-orange-100 text-center">
        <h2 className="text-2xl font-serif font-bold mb-2">{title}</h2>
        <p className="text-stone-500 text-sm mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  ); 
}
