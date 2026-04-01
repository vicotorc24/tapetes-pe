"use client";
import React from 'react';
import { StatCard } from '../ui/StatCard';
import { SimpleBarChart } from '../ui/SimpleBarChart';
import { LucideShoppingBag, LucidePackage, LucideEye, LucideStar, LucideAlertTriangle, LucideRotateCcw } from 'lucide-react';

export function DashboardOverview({ products, user }) {
  // Cálculos reales basados en la data del usuario
  const activeProductsCount = products.length;
  const profileViews = user.profileViews || 0;
  const whatsappClicks = user.whatsappClicks || 0;
  
  // Estimación de ventas (puedes ajustar el ticket medio)
  const estimatedRevenue = whatsappClicks * 150; // Ejemplo: S/ 150 por clic como intención

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-serif italic">Resumen del Taller</h2>
          <p className="text-sm text-stone-500">Estadísticas reales de tu presencia digital</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Intención de Venta" 
          value={`${whatsappClicks} Clics`} 
          trend="WhatsApp" 
          trendUp={true} 
          icon={LucideShoppingBag} 
          color="bg-green-100 text-green-700" 
        />
        <StatCard 
          title="Productos Activos" 
          value={activeProductsCount} 
          trend="+ Catálogo" 
          trendUp={true} 
          icon={LucidePackage} 
          color="bg-blue-100 text-blue-700" 
        />
        <StatCard 
          title="Visitas al Perfil" 
          value={profileViews} 
          trend="Alcance Real" 
          trendUp={profileViews > 0} 
          icon={LucideEye} 
          color="bg-purple-100 text-purple-700" 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"><SimpleBarChart /></div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
           <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
             <LucideStar size={18} className="text-yellow-500"/> Top Productos
           </h3>
           <div className="space-y-4">
             {products.slice(0,4).map((p, i) => (
               <div key={p.id} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <span className="text-xs font-bold text-stone-400 w-4">#{i+1}</span>
                   <img src={p.image} className="w-8 h-8 rounded-md object-cover" alt=""/>
                   <div className="text-xs font-medium text-stone-800 max-w-[100px] truncate">{p.title}</div>
                 </div>
                 <div className="flex items-center gap-2 w-24">
                   <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                     <div className="h-full bg-orange-400 rounded-full" style={{ width: `${100 - (i*20)}%` }}></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
