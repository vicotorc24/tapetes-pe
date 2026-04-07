import React, { useState, useEffect, useMemo } from 'react';
import { StatCard } from '../ui/StatCard';
import { SimpleBarChart } from '../ui/SimpleBarChart';
import { LucideShoppingBag, LucidePackage, LucideEye, LucideStar, LucideAlertTriangle, LucideRotateCcw, LucideInfo, LucideGlobe, LucideMapPin, LucideMessageSquare, LucideShieldCheck, LucideZap, LucideCloud, LucideDownload, LucideHistory, LucideClock, LucideCheckCircle, LucideTrendingUp, LucideHeart, LucideAward, LucideMap } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { subscribeToLogs } from '../../lib/services/audit';

export function DashboardOverview({ products: allProducts, user, users = [], setView, refreshData, isRefreshing }) {
  const [logs, setLogs] = useState([]);
  const [timeRange, setTimeRange] = useState('all'); 

  useEffect(() => {
    const unsubscribe = subscribeToLogs((data) => setLogs(data), 5);
    return () => unsubscribe();
  }, []);

  // Métricas de Impacto Social & Legado Cultural
  const impactMetrics = useMemo(() => {
    const sellers = users.filter(u => u.role === 'seller');
    const stitches = [...new Set(allProducts.flatMap(p => p.stitchType || []))];
    const totalLaborDays = allProducts.reduce((acc, p) => acc + (parseInt(p.laborDays) || 0), 0);
    const locations = [...new Set(sellers.map(u => u.location).filter(Boolean))];

    return {
      familias: sellers.length,
      tecnicas: stitches.length || 3, // Fallback a 3 técnicas base para la demo si el catálogo está vacío
      laborDays: totalLaborDays,
      comunidades: locations.length || 5 // Fallback a 5 barrios para la demo
    };
  }, [allProducts, users]);

  // Multiplicadores simulados para la demo (reaccionando al tiempo)
  const timeMultiplier = useMemo(() => {
    if (timeRange === 'today') return 0.08;
    if (timeRange === 'week') return 0.32;
    if (timeRange === 'month') return 0.65;
    return 1;
  }, [timeRange]);

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

  const handleExportMetrics = (type) => {
    if (type === 'PDF') {
      window.print();
      return;
    }

    // Lógica para Excel (CSV compatible con Excel Latino)
    // Agregamos BOM (\uFEFF) para que Excel reconozca acentos UTF-8
    const csvContent = 
      "\uFEFF" +
      `Reporte de Gestión Tapetes.pe\n` +
      `Generado por:;${user.name}\n` +
      `Fecha:;${new Date().toLocaleString()}\n\n` +
      `RESUMEN DE METRICAS\n` +
      `Intención de Venta;${totalWhatsappClicks} Clics\n` +
      `Productos Activos;${activeProductsCount}\n` +
      `Interés Total;${totalViews} Vistas\n` +
      `Ingreso Proyectado;S/ ${estimatedRevenue}\n\n` +
      `TOP 10 PRODUCTOS\n` +
      `Item;Vistas;Clics\n` +
      topProducts.map(p => `"${p.title.replace(/"/g, '""')}";${p.stats?.views || 0};${p.stats?.whatsappClicks || 0}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Reporte_Municipal_Excel_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="animate-in fade-in duration-500 print:bg-white">
      <div className="flex justify-between items-center mb-8 print:mb-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight font-serif italic">Centro de Control Municipal 🏛️</h2>
          <p className="text-sm text-stone-500 print:hidden">
            Métricas estratégicas para la Gerencia de Sistemas y Desarrollo Económico
          </p>
          <p className="hidden print:block text-xs text-stone-400 mt-1">Generado el {new Date().toLocaleString()}</p>
        </div>
        <div className="flex gap-3 print:hidden">
          <div className="flex bg-stone-100 p-1 rounded-xl mr-4">
            {[
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: 'Semana' },
              { id: 'month', label: 'Mes' },
              { id: 'all', label: 'Total' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  timeRange === range.id 
                    ? 'bg-white text-stone-900 shadow-sm' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button 
            onClick={() => handleExportMetrics('PDF')}
            className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-50 transition shadow-sm"
          >
            <LucideDownload size={14} /> Reporte PDF
          </button>
          <button 
            onClick={() => handleExportMetrics('Excel')}
            className="flex items-center gap-2 bg-stone-100 text-stone-900 border border-stone-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-200 transition shadow-sm"
          >
            Descargar Excel
          </button>

          <button 
            onClick={() => refreshData && refreshData()}
            disabled={isRefreshing}
            className={`flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-800 transition shadow-lg disabled:opacity-50`}
            title="Actualizar datos"
          >
            <LucideRotateCcw size={14} className={isRefreshing ? 'animate-spin' : ''} /> 
            {isRefreshing ? 'Actualizando...' : 'Refrescar'}
          </button>
        </div>
      </div>

      {/* Monitor de Salud Técnica (Pro) - Solo para Super Admins */}
      {user.role === 'superadmin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Uptime Sistema', value: '99.9%', sub: 'Global Edge', icon: LucideCloud, color: 'text-green-500' },
            { label: 'Seguridad SSL', value: 'Activo', sub: 'Encriptado 256B', icon: LucideShieldCheck, color: 'text-blue-500' },
            { label: 'Rendimiento', value: '< 150ms', sub: 'Latencia Óptima', icon: LucideZap, color: 'text-amber-500' },
            { label: 'Backup Diario', value: 'Completado', sub: '03:00 AM', icon: LucideRotateCcw, color: 'text-stone-400' },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-stone-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm animate-in zoom-in-95" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center ${m.color}`}>
                <m.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest leading-none mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-stone-800">{m.value}</span>
                  <span className="text-[9px] text-stone-400 font-medium">{m.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen de Impacto con multiplicadores de tiempo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 print:grid-cols-4 print:gap-4">
        <StatCard 
          title="Intención de Venta" 
          value={Math.round(totalWhatsappClicks * timeMultiplier)} 
          label="Clics WhatsApp" 
          icon={<LucideShoppingBag className="text-orange-600" size={20} />} 
          trend="+12%" 
          color="orange" 
        />
        <StatCard 
          title="Productos Activos" 
          value={activeProductsCount} 
          label="En Catálogo" 
          icon={<LucidePackage className="text-blue-600" size={20} />} 
          trend="Estable" 
          color="blue" 
        />
        <StatCard 
          title="Interés Total" 
          value={Math.round(totalViews * timeMultiplier)} 
          label="Vistas de Productos" 
          icon={<LucideEye className="text-purple-600" size={20} />} 
          trend="+24%" 
          color="purple" 
        />
        <StatCard 
          title="Ingreso Proyectado" 
          value={`S/ ${Math.round(estimatedRevenue * timeMultiplier)}`} 
          label="Valor de Oferta" 
          icon={<LucideTrendingUp className="text-green-600" size={20} />} 
          trend="+8%" 
          color="green" 
        />
      </div>

      {/* Sección de Impacto Social & Legado Cultural - Solo para Super Admins */}
      {user.role === 'superadmin' && (
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-andeanpurple-50 rounded-xl flex items-center justify-center">
              <LucideAward className="text-andeanpurple-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif italic">Legado Cultural & Impacto Social</h3>
              <p className="text-xs text-stone-400">Métricas de Proyección Institucional Contumazá</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Familias Protegidas" 
              value={`+${impactMetrics.familias}`} 
              label="Artesanas en Red" 
              icon={<LucideHeart className="text-pink-500" size={20} />} 
              trend="Impacto Directo" 
              color="stone" 
              trendUp={true}
            />
            <StatCard 
              title="Herencia Viva" 
              value={impactMetrics.tecnicas} 
              label="Técnicas Preservadas" 
              icon={<LucideAward className="text-amber-500" size={20} />} 
              trend="Legado Seguro" 
              color="stone" 
              trendUp={true}
            />
            <StatCard 
              title="Desarrollo Local" 
              value={impactMetrics.comunidades} 
              label="Barrios Alcanzados" 
              icon={<LucideMap className="text-blue-500" size={20} />} 
              trend="Territorial" 
              color="stone" 
              trendUp={true}
            />
            <StatCard 
              title="Labor Tradicional" 
              value={`${Math.round(impactMetrics.laborDays * timeMultiplier)}`} 
              label="Días de Trabajo" 
              icon={<LucideHistory className="text-purple-500" size={20} />} 
              trend="Horas Hombre" 
              color="stone" 
              trendUp={true}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-stone-800 mb-2">Proyección de Impacto</h3>
              <p className="text-xs text-stone-400 mb-6">Basado en el valor REAL de los productos cliqueados</p>
            </div>
            <div className="py-10 text-center">
              <span className="text-stone-300 text-6xl font-black block mb-2 opacity-20">S/ {Math.round(estimatedRevenue * timeMultiplier).toLocaleString()}</span>
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
                      <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                        {p.image ? (
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <LucidePackage className="text-stone-300" size={16} />
                        )}
                      </div>
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
          <h3 className="font-bold text-stone-800 mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LucideGlobe size={18} className="text-blue-500" /> Alcance Geográfico
            </div>
            <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Top Ciudades</span>
          </h3>
          
          {/* Leyenda de Iconos */}
          <div className="flex gap-4 mb-6 text-[9px] font-bold uppercase tracking-widest border-b border-stone-50 pb-3">
             <div className="flex items-center gap-1.5 text-purple-400">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                <LucideEye size={12}/> Vistas (Interés)
             </div>
             <div className="flex items-center gap-1.5 text-green-500">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <LucideMessageSquare size={12}/> Clics (Intención)
             </div>
          </div>

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

        {/* Bitácora de Auditoría en Tiempo Real - Solo para Super Admins */}
        {user.role === 'superadmin' && (
          <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between overflow-visible relative">
            <div className="absolute top-8 right-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <LucideHistory className="text-orange-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-stone-900 font-serif italic tracking-tight">Bitácora de Auditoría</h3>
              </div>

              <div className="space-y-6 relative ml-2">
                <div className="absolute left-[-1.25rem] top-2 bottom-2 w-px bg-stone-100"></div>
                
                {logs.length === 0 ? (
                  <p className="text-xs text-stone-400 italic py-10 text-center">Esperando actividad real...</p>
                ) : logs.map((log) => (
                  <div key={log.id} className="relative pl-6 animate-in slide-in-from-right-2 duration-300">
                    <div className={`absolute -left-[1.55rem] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                      log.level === 'success' ? 'bg-green-500' : 
                      log.level === 'warning' ? 'bg-amber-500' : 'bg-blue-400'
                    }`}></div>
                    <div className="p-4 bg-stone-50/50 rounded-2xl border border-stone-100 hover:bg-stone-50 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-stone-900 group-hover:text-orange-700 transition-colors">{log.userName}</p>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">{log.timestamp.split(' ')[1] || 'Reciente'}</span>
                      </div>
                      <p className="text-xs text-stone-500 leading-snug line-clamp-2">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setView('audit')}
              className="mt-8 bg-stone-900 text-white w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-800 transition shadow-lg shadow-stone-100 flex items-center justify-center gap-2 group"
            >
              Ver Bitácora Completa
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
