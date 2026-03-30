"use client";
import React, { useState } from 'react';

export function LoginForm({ onLogin }) { 
  const [email, setEmail] = useState('victoria@tapetes.pe'); 
  return ( 
    <form onSubmit={(e) => onLogin(e, email)} className="space-y-4">
      <div>
        <label className="text-xs font-bold text-stone-500 uppercase">Correo</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"/>
      </div>
      <div>
        <label className="text-xs font-bold text-stone-500 uppercase">Contraseña</label>
        <input type="password" defaultValue="123456" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"/>
      </div>
      <button className="w-full bg-orange-700 text-white py-3 rounded-lg font-bold hover:bg-orange-800 transition">Ingresar</button>
      <div className="text-center text-xs text-stone-400 mt-4 border-t pt-4">
        <p className="mb-2">Cuentas Demo:</p>
        <button type="button" onClick={() => setEmail('admin@tapetes.pe')} className="text-stone-600 underline mr-3">Super Admin</button>
        <button type="button" onClick={() => setEmail('victoria@tapetes.pe')} className="text-stone-600 underline">Artesana</button>
      </div>
    </form> 
  ); 
}
