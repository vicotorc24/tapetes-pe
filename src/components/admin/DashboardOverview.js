"use client";
import React from 'react';
import { StatCard } from '../ui/StatCard';
import { SimpleBarChart } from '../ui/SimpleBarChart';
import { LucideShoppingBag, LucidePackage, LucideEye, LucideStar, LucideAlertTriangle, LucideRotateCcw } from 'lucide-react';

export function DashboardOverview({ products, user }) {
  // Cálculos reales basados en el catálogo completo
  const activeProductsCount = products.length;
  
  // Sumamos las estadísticas de todos los productos para métricas globales
  const totalViews = products.reduce((acc, p) => acc + (p.stats?.views || 0), 0) + (user.profileViews || 0);
  const totalWhatsappClicks = products.reduce((acc, p) => acc + (p.stats?.whatsappClicks || 0), 0) + (user.whatsappClicks || 0);
  
  // Estimación de ventas basada en el valor REAL de los productos con los que interactúan
  const estimatedRevenue = products.reduce((acc, p) => {
    const price = parseFloat(p.price) || 0;
    const clicks = p.stats?.whatsappClicks || 0;
    return acc + (price * clicks);
  }, 0); 

  // Ordenamos productos por popularidad (vistas + clics) para el TOP REAL
  const sortedProducts = [...products].sort((a, b) => {
    const scoreA = (a.stats?.views || 0) + (a.stats?.whatsappClicks || 0) * 2; // El clic vale doble que la vista
    const scoreB = (b.stats?.views || 0) + (b.stats?.whatsappClicks || 0) * 2;
    return scoreB - scoreA;
  });

  const topProducts = sortedProducts.slice(0, 10);
  const maxScore = topProducts.length > 0 
    ? (topProducts[0].stats?.views || 0) + (topProducts[0].stats?.whatsappClicks || 0) * 2 
    : 1;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-serif italic">Resumen del Taller</h2>
          <p className="text-sm text-stone-500">Inteligencia de mercado basada en datos reales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Intención de Venta" 
          value={`${totalWhatsappClicks} Clics`} 
          trend="WhatsApp" 
          trendUp={totalWhatsappClicks > 0} 
          icon={LucideShoppingBag} 
          color="bg-green-100 text-green-700" 
        />
        <StatCard 
          title="Productos Activos" 
          value={activeProductsCount} 
          trend="+ Catálogo" 
          trendUp={activeProductsCount > 0} 
          icon={LucidePackage} 
          color="bg-blue-100 text-blue-700" 
        />
        <StatCard 
          title="Interés Total" 
          value={`${totalViews} Vistas`} 
          trend="Alcance Real" 
          trendUp={totalViews > 0} 
          icon={LucideEye} 
          color="bg-purple-100 text-purple-700" 
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                 <h3 className="font-bold text-stone-800 mb-2">Proyección de Impacto</h3>
                 <p className="text-xs text-stone-400 mb-6">Basado en el valor REAL de los productos cliqueados</p>
              </div>
              <div className="py-10 text-center">
                 <span className="text-stone-300 text-6xl font-black block mb-2 opacity-20">S/ {estimatedRevenue.toLocaleString()}</span>
                 <p className="text-xs uppercase tracking-widest font-bold text-stone-400">Intención de Negocio Generada</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg text-stone-500 text-[10px]">
                 <LucideAlertTriangle size={14} className="text-amber-500" />
                 Esta cifra estima el valor del interés captado a través de clics en WhatsApp.
              </div>
           </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
           <h3 className="font-bold text-stone-800 mb-4 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <LucideStar size={18} className="text-yellow-500"/> Top Productos
             </div>
             <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">Popularidad</span>
           </h3>
           <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {topProducts.length === 0 && (
                <div className="py-20 text-center italic text-stone-300 text-xs">
                   Aún no hay interacciones registradas.
                </div>
              )}
              {topProducts.map((p, i) => {
                const currentScore = (p.stats?.views || 0) + (p.stats?.whatsappClicks || 0) * 2;
                const progressWidth = Math.max(10, (currentScore / maxScore) * 100);
                
                return (
                   <div key={p.id} className="flex flex-col gap-2 group cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-stone-400 w-4">#{i+1}</span>
                          <img src={p.image} className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-110 transition-transform" alt=""/>
                          <div className="flex flex-col">
                             <div className="text-[11px] font-bold text-stone-800 max-w-[120px] truncate leading-none mb-1">{p.title}</div>
                             <div className="text-[9px] text-stone-400 font-medium">{p.stats?.views || 0} vistas • {p.stats?.whatsappClicks || 0} clics</div>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-stone-900">{Math.round(progressWidth)}%</div>
                      </div>
                      <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${i === 0 ? 'bg-orange-500' : 'bg-stone-300'}`}
                          style={{ width: `${progressWidth}%` }}
                        ></div>
                      </div>
                   </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
