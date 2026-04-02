import React, { useState, useEffect } from 'react';
import { StatCard } from '../ui/StatCard';
import { SimpleBarChart } from '../ui/SimpleBarChart';
import { LucideShoppingBag, LucidePackage, LucideEye, LucideStar, LucideAlertTriangle, LucideRotateCcw, LucideInfo, LucideGlobe, LucideMapPin, LucideMessageSquare } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export function DashboardOverview({ products: allProducts, user }) {
  // Filtramos los productos según el rol del usuario para que el dashboard sea personal
  const products = user.role === 'superadmin'
    ? allProducts
    : allProducts.filter(p => p.sellerEmail?.toLowerCase().trim() === user.email?.toLowerCase().trim());

  // Cálculos reales basados en el catálogo filtrado (el del propio artesano)
  const activeProductsCount = products.length;

  // Sumamos las estadísticas de los productos filtrados para métricas individuales
  const totalViews = products.reduce((acc, p) => acc + (p.stats?.views || 0), 0) + (user.profileViews || 0);
  const totalWhatsappClicks = products.reduce((acc, p) => acc + (p.stats?.whatsappClicks || 0), 0) + (user.whatsappClicks || 0);

  // Estimación de ventas basada en el valor REAL de los productos del artesano
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

  // Seguimiento Geográfico en Tiempo Real
  const [geoStats, setGeoStats] = useState({ countries: {}, cities: {} });

  useEffect(() => {
    // Si es superadmin, vemos stats globales. Si no, las de su taller.
    // Usamos uid o id para mayor compatibilidad entre sesiones y suplantaciones
    const userId = user.uid || user.id;
    const statsPath = user.role === 'superadmin'
      ? doc(db, 'stats', 'locations')
      : doc(db, 'users', userId, 'stats', 'locations');

    const unsubscribe = onSnapshot(statsPath, (doc) => {
      if (doc.exists()) {
        setGeoStats(doc.data());
      }
    });

    return () => unsubscribe();
  }, [user.uid, user.id, user.role]);

  // Procesamiento de datos geográficos para el ranking (ordenado por clicks + vistas)
  const topCities = Object.entries(geoStats.cities || {})
    .sort(([, a], [, b]) => {
      const scoreA = (a.views || 0) + (a.clicks || 0) * 2;
      const scoreB = (b.views || 0) + (b.clicks || 0) * 2;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  const totalGeoViews = Object.values(geoStats.cities || {}).reduce((acc, val) => acc + (val.views || 0), 0) || 1;
  const totalGeoClicks = Object.values(geoStats.cities || {}).reduce((acc, val) => acc + (val.clicks || 0), 0) || 1;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight font-serif italic">¡Hola, {user.name?.split(' ')[0]}! 🏮</h2>
          <p className="text-sm text-stone-500">
            {user.role === 'superadmin'
              ? 'Estas son las estadísticas generales de la plataforma'
              : `Aquí tienes el resumen de actividad de tu taller artesanal`}
          </p>
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
              <LucideStar size={18} className="text-yellow-500" /> Top Productos
            </div>
            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest flex items-center gap-1 group relative cursor-help">
              Popularidad
              <LucideInfo size={12} />
              <div className="absolute bottom-full right-0 mb-2 w-48 p-4 bg-stone-900 text-white text-[9px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 leading-relaxed font-medium normal-case tracking-normal border border-white/10">
                <p className="font-bold mb-2 border-b border-white/10 pb-1 text-orange-400">¿Cómo se calcula?</p>
                <div className="space-y-1">
                  <p>• **Vistas:** 1 punto</p>
                  <p>• **Clics WhatsApp:** 2 puntos</p>
                  <p className="mt-2 text-stone-400 italic">El producto #1 marca el 100%. Los demás muestran su rendimiento relativo al líder.</p>
                </div>
              </div>
            </span>
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
                      <span className="text-[10px] font-black text-stone-400 w-4">#{i + 1}</span>
                      <img src={p.image} className="w-10 h-10 rounded-lg object-cover shadow-sm group-hover:scale-110 transition-transform" alt="" />
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

        {/* Nueva Sección: Alcance Geográfico */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-stone-800 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LucideGlobe size={18} className="text-blue-500" /> Alcance Geográfico
            </div>
            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Top Ciudades</span>
          </h3>

            <div className="space-y-6 flex-1">
               {topCities.length === 0 ? (
                 <div className="py-20 text-center flex flex-col items-center gap-3">
                   <div className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center text-stone-200">
                     <LucideMapPin size={20} />
                   </div>
                   <p className="italic text-stone-300 text-[10px]">Aún no tenemos datos de ubicación.</p>
                 </div>
               ) : (
                 topCities.map(([city, stats], idx) => {
                   const viewPerc = ((stats.views || 0) / totalGeoViews) * 100;
                   const clickPerc = ((stats.clicks || 0) / (totalGeoClicks || 1)) * 100; // Ajustado a clics relativos
                   
                   return (
                     <div key={city} className="space-y-2 animate-in slide-in-from-right" style={{ animationDelay: `${idx * 100}ms` }}>
                       <div className="flex justify-between items-end text-[10px] uppercase tracking-wider font-black">
                         <span className="text-stone-800 flex items-center gap-2">
                           <span className="text-stone-300">#{idx + 1}</span> {city}
                         </span>
                         <div className="flex gap-3 text-[9px]">
                            <span className="text-purple-400 flex items-center gap-1"><LucideEye size={10}/> {stats.views || 0}</span>
                            <span className="text-green-500 flex items-center gap-1"><LucideMessageSquare size={10}/> {stats.clicks || 0}</span>
                         </div>
                       </div>
                       
                       <div className="space-y-1">
                          {/* Barra de Vistas */}
                          <div className="h-1 w-full bg-stone-50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-200 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.max(2, viewPerc)}%` }}
                            ></div>
                          </div>
                          {/* Barra de Clics (Solo se muestra si hay clics) */}
                          {(stats.clicks > 0) && (
                            <div className="h-1 w-full bg-stone-50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-400 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.max(2, (stats.clicks / (stats.views || 1)) * 100)}%` }}
                              ></div>
                            </div>
                          )}
                       </div>
                     </div>
                   )
                 })
               )}
            </div>

          <div className="mt-8 pt-6 border-t border-stone-50 flex items-center justify-between">
            <div className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Países Activos</div>
            <div className="flex -space-x-2">
              {Object.keys(geoStats.countries || {}).slice(0, 3).map((code) => (
                <div key={code} className="w-6 h-6 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-stone-600" title={code}>
                  {code.substring(0, 2)}
                </div>
              ))}
              {Object.keys(geoStats.countries || {}).length > 3 && (
                <div className="w-6 h-6 rounded-full bg-stone-900 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                  +{Object.keys(geoStats.countries || {}).length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
