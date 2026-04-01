"use client";
import React, { useState, useRef, useEffect } from 'react';
import { LucideChevronDown, LucideSearch, LucideCheck } from 'lucide-react';

export function Autocomplete({ options = [], value, onChange, placeholder = "Seleccionar..." }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-3 bg-stone-50 border rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ${
          isOpen ? 'ring-2 ring-orange-100 border-orange-200 shadow-sm' : 'border-stone-200 hover:border-stone-300'
        }`}
      >
        <span className={`text-sm truncate ${!value ? 'text-stone-400 font-medium' : 'text-stone-800 font-bold'}`}>
          {value || placeholder}
        </span>
        <LucideChevronDown className={`text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} size={18} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
          <div className="p-3 border-b border-stone-100 bg-stone-50/50 sticky top-0 backdrop-blur-sm">
            <div className="relative">
              <LucideSearch className="absolute left-3 top-2.5 text-stone-400" size={16} />
              <input 
                autoFocus
                type="text" 
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-50 focus:border-orange-200 transition-all font-medium" 
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto overscroll-contain py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between group ${
                    value === option ? 'bg-orange-50 text-orange-900 font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <span className="truncate">{option}</span>
                  {value === option && <LucideCheck size={16} className="text-orange-500" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-xs text-stone-400 italic font-serif">
                No se encontró "{searchTerm}"
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 text-[9px] text-stone-400 uppercase tracking-widest font-bold">
            {filteredOptions.length} opciones disponibles
          </div>
        </div>
      )}
    </div>
  );
}
