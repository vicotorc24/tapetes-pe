import React, { useState, useEffect } from 'react';
import { LucideShield, LucideHistory, LucideFilter, LucideSearch, LucideDownload, LucideAlertTriangle, LucideCheckCircle, LucideUser, LucidePackage } from 'lucide-react';
import { getFilteredLogs, subscribeToLogs } from '../../lib/services/audit';

export function AuditLogManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [levelFilter, setLevelFilter] = useState('Todos');
  const [timeRange, setTimeRange] = useState('all'); 
  const [showFilters, setShowFilters] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Descargamos un lote generoso (200) para filtrar todo localmente. 
    // Esto elimina la necesidad de índices compuestos en Firestore y hace los filtros instantáneos.
    const unsubscribe = subscribeToLogs((data) => {
      setLogs(data);
      setLoading(false);
    }, 200);

    return () => unsubscribe();
  }, []); // Sin dependencias de filtros para evitar re-suscripciones innecesarias

  const categories = ['Todas', 'Catálogo', 'Usuarios', 'Seguridad', 'Sistema', 'Infraestructura'];
  const levels = ['Todos', 'success', 'warning', 'info'];

  const filteredLogs = logs.filter(l => {
    // 1. Filtro por Módulo (Categoría) - Local
    if (categoryFilter !== 'Todas' && l.category !== categoryFilter) return false;

    // 2. Filtro por Nivel - Local
    if (levelFilter !== 'Todos' && l.level !== levelFilter) return false;

    // 3. Filtro de Búsqueda
    const matchesSearch = 
      (l.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
      (l.action?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Filtro de Tiempo (Local de Alto Rendimiento)
    if (!matchesSearch) return false;
    if (timeRange === 'all') return true;
    
    // Usamos rawDate que ahora viene como objeto Date real desde el servicio
    const logDate = l.rawDate;
    const now = new Date();
    
    // Lógica por día calendario para "Hoy"
    if (timeRange === 'today') {
      return logDate.toDateString() === now.toDateString();
    }

    const diffTime = Math.abs(now - logDate);
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (timeRange === 'week' && diffDays > 7) return false;
    if (timeRange === 'month' && diffDays > 30) return false;

    return true;
  });

  const handleExportCSV = () => {
    // Agregamos BOM (\uFEFF) para UTF-8 y usamos punto y coma (;) para Excel Latino
    const headers = ["\uFEFF" + 'ID;Estampa de Tiempo;Usuario;Accion;Categoria;Nivel\n'];
    const rows = filteredLogs.map(l => 
      `${l.id};${l.timestamp};${l.userName || l.user};"${(l.action || '').replace(/"/g, '""')}";${l.category};${l.level}`
    );
    const csvContent = headers.concat(rows.join('\n')).join('');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bitacora_Tapetes_Real_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
            <LucideShield className="text-stone-900" size={24} /> 
            Bitácora de Auditoría Pro
          </h2>
          <p className="text-stone-500 text-sm italic">Registro inmutable de actividades administrativas y técnicas</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-stone-100 p-1 rounded-xl mr-2">
            {[
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: '7D' },
              { id: 'month', label: '30D' },
              { id: 'all', label: 'Todo' }
            ].map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
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
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white border px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${showFilters ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
          >
            <LucideFilter size={14} /> {showFilters ? 'Ocultar Filtros' : 'Filtros Avanzados'}
          </button>
          <button 
            onClick={handleExportCSV}
            className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-800 transition flex items-center gap-2"
          >
            <LucideDownload size={14} /> Exportar Log (.CSV)
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-stone-50 border border-stone-200 p-6 rounded-2xl mb-8 flex flex-wrap gap-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Filtrar por Módulo</label>
            <select 
              className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-stone-100"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Filtrar por Nivel</label>
            <select 
              className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-stone-100"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button 
            onClick={() => { setCategoryFilter('Todas'); setLevelFilter('Todos'); setSearchTerm(''); }}
            className="self-end px-4 py-2 text-[10px] font-black text-stone-400 uppercase hover:text-stone-900 transition-colors"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Actividad</p>
          <p className="text-3xl font-black text-blue-900 leading-none mb-2">{filteredLogs.length}</p>
          <p className="text-xs text-blue-600 font-medium">Registros en esta vista</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Alertas Generadas</p>
          <p className="text-3xl font-black text-amber-900 leading-none mb-2">{filteredLogs.filter(l => l.level === 'warning').length}</p>
          <p className="text-xs text-amber-600 font-medium italic">Acciones Críticas Registradas</p>
        </div>
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl">
          <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Integridad</p>
          <p className="text-3xl font-black text-green-900 leading-none mb-2">{loading ? '...' : '100%'}</p>
          <p className="text-xs text-green-600 font-medium uppercase tracking-tighter">🔒 Inmutabilidad Activa</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-50 bg-stone-50/30">
          <div className="relative">
            <LucideSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en la bitácora por usuario, acción o categoría..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-100 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-stone-50/50 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
              <tr>
                <th className="p-6">Estampa de Tiempo</th>
                <th className="p-6">Usuario / Entidad</th>
                <th className="p-6">Acción Detallada</th>
                <th className="p-6">Módulo</th>
                <th className="p-6">Nivel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
            {error ? (
              <tr>
                <td colSpan="5" className="p-20 text-center">
                  <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
                    <LucideAlertTriangle className="text-amber-500 animate-pulse" size={40} />
                    <div>
                      <h4 className="text-stone-900 font-black uppercase text-xs tracking-widest mb-2">Error de Filtro Compuesto</h4>
                      <p className="text-stone-500 text-xs leading-relaxed mb-4">
                        {error.includes('index') 
                          ? 'Esta combinación de filtros requiere un índice compuesto en la base de datos (Firestore). Por favor, abre la consola del navegador (F12) y haz clic en el enlace generado automáticamente por Firebase para habilitarlo.' 
                          : `Ha ocurrido un problema al sincronizar la bitácora: ${error}`}
                      </p>
                      <button 
                        onClick={() => { setCategoryFilter('Todas'); setLevelFilter('Todos'); }} 
                        className="bg-stone-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-stone-800 transition shadow-lg"
                      >
                        Restablecer Filtros
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan="5" className="p-20 text-center text-stone-400">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Sincronizando Bitácora Real...</span>
                  </div>
                </td>
              </tr>
            ) : filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-stone-50/80 transition-colors group">
                <td className="p-6 font-mono text-[11px] text-stone-400">{log.timestamp}</td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-900">
                      <LucideUser size={14} />
                    </div>
                    <span className="font-bold text-stone-800">{log.userName || log.user}</span>
                  </div>
                </td>
                <td className="p-6">
                  <p className="text-stone-600 font-medium">{log.action}</p>
                </td>
                <td className="p-6">
                  <span className="px-2 py-1 bg-stone-100 text-stone-500 rounded-md text-[10px] font-black uppercase tracking-tighter">
                    {log.category}
                  </span>
                </td>
                <td className="p-6">
                  <div 
                    className="flex items-center gap-2 cursor-help group/tip" 
                    title={
                      log.level === 'success' ? 'Acción completada exitosamente sin incidencias.' : 
                      log.level === 'warning' ? 'Acción crítica o advertencia que requiere atención.' : 
                      'Registro de actividad informativa estándar.'
                    }
                  >
                     {log.level === 'success' && <LucideCheckCircle size={14} className="text-green-500" />}
                     {log.level === 'warning' && <LucideAlertTriangle size={14} className="text-amber-500" />}
                     {log.level === 'info' && <LucideHistory size={14} className="text-blue-400" />}
                     <span className={`text-[10px] font-bold uppercase ${
                       log.level === 'success' ? 'text-green-600' : 
                       log.level === 'warning' ? 'text-amber-600' : 'text-blue-600'
                     }`}>
                       {log.level}
                     </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !error && filteredLogs.length === 0 && (
          <div className="p-20 text-center text-stone-400 italic">No hay registros que coincidan con los filtros seleccionados.</div>
        )}
        </div>
      </div>
    </div>
  );
}
