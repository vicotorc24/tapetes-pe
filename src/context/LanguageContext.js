"use client";
import React, { useState, useEffect, createContext, useContext } from 'react';
import { translations } from '../lib/i18n';

const LanguageContext = createContext();

export const useTranslation = () => useContext(LanguageContext);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es');
  
  // Se fuerza que la carga inicial sea siempre en español (ES) por defecto, 
  // independientemente del idioma del navegador.

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    keys.forEach(k => { value = value ? value[k] : key });
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
