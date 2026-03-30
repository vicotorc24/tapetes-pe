import React from 'react';
import { LucideTrendingUp, LucideTrendingDown } from 'lucide-react';

export function StatCard({ title, value, trend, trendUp, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-stone-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</p>
        <p className="text-2xl font-bold text-stone-900 mb-2">{value}</p>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
          {trendUp ? <LucideTrendingUp size={14}/> : <LucideTrendingDown size={14}/>} {trend} 
          <span className="text-stone-400 font-normal ml-1">vs mes anterior</span>
        </div>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
    </div>
  );
}
