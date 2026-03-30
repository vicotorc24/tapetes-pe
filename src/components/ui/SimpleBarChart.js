import React from 'react';
import { LucideBarChart3 } from 'lucide-react';

export function SimpleBarChart() {
  const data = [ 
    { day: 'Lun', value: 40 }, 
    { day: 'Mar', value: 65 }, 
    { day: 'Mié', value: 30 }, 
    { day: 'Jue', value: 85 }, 
    { day: 'Vie', value: 50 }, 
    { day: 'Sáb', value: 95 }, 
    { day: 'Dom', value: 60 } 
  ];
  return (
    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-stone-800 flex items-center gap-2">
          <LucideBarChart3 size={18} className="text-stone-400"/> Rendimiento Semanal
        </h3>
      </div>
      <div className="flex items-end justify-between h-48 gap-2 mt-4 px-2">
        {data.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
            <div className="relative w-full flex justify-center h-full items-end">
              <div className="absolute bottom-full mb-2 bg-stone-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition z-10">{item.label}</div>
              <div className="w-full max-w-[30px] bg-orange-100 rounded-t-md group-hover:bg-orange-400 transition-all duration-300 relative overflow-hidden" style={{ height: `${item.value}%` }}>
                <div className="absolute bottom-0 w-full bg-orange-200 h-1 opacity-50"></div>
              </div>
            </div>
            <span className="text-xs text-stone-400 font-medium">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
