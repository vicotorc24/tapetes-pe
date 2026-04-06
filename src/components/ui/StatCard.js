import React from 'react';
import { LucideTrendingUp, LucideTrendingDown } from 'lucide-react';

export function StatCard({ title, value, label, trend, trendUp, icon: Icon, color = 'stone' }) {
  // Mapeo de colores para consistencia visual "Pro"
  const colorMap = {
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    stone: 'bg-stone-50 text-stone-600 border-stone-100'
  };

  const colorClasses = colorMap[color] || colorMap.stone;

  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-start justify-between hover:shadow-md transition-all duration-300 group">
      <div>
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <p className="text-2xl font-black text-stone-900 leading-none">{value}</p>
        {label && <p className="text-[10px] text-stone-400 font-bold mt-1 uppercase tracking-tighter">{label}</p>}
        <div className={`flex items-center gap-1 text-[10px] font-bold mt-3 ${trendUp ? 'text-green-600' : 'text-stone-500'}`}>
          {trendUp ? <LucideTrendingUp size={12}/> : <LucideTrendingDown size={12}/>} {trend} 
          <span className="text-stone-300 font-normal ml-1">vs mes anterior</span>
        </div>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110 ${colorClasses}`}>
        {React.isValidElement(Icon) ? Icon : <Icon size={22} />}
      </div>
    </div>
  );
}
