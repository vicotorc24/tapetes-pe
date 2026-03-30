"use client";
import React from 'react';

export function ProfileManager({ user }) { 
  return (
    <div className="max-w-2xl animate-in fade-in">
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Mi Perfil</h2>
      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-6">
          <img src={user.photo} className="w-24 h-24 rounded-full bg-orange-100 border-4 border-white shadow-md object-cover" alt=""/>
          <div>
            <h3 className="font-bold text-xl text-stone-900">{user.name}</h3>
            <p className="text-stone-500 text-sm">Miembro desde Marzo 2024</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Nombre Público</label>
            <input defaultValue={user.name} className="w-full p-3 bg-stone-50 border rounded-lg"/>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-2 block">WhatsApp</label>
            <input defaultValue="999 999 999" className="w-full p-3 bg-stone-50 border rounded-lg"/>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="bg-orange-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-800 transition">Guardar Cambios</button>
        </div>
      </div>
    </div>
  ); 
}
