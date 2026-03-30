"use client";
import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { LucideArrowRight, LucideCheckCircle, LucidePlus, LucideHeart, LucideStar, LucideZoomIn, LucideX } from 'lucide-react';

export function ProductDetail({ product, allProducts, userInterests, onBack, onAddToCart, onViewProduct }) {
  const { t } = useTranslation();
  const images = product.images || [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };
  const getSuggestions = () => {
    const others = allProducts.filter(p => p.id !== product.id);
    const scoredProducts = others.map(p => {
      let score = 0;
      if (p.category === product.category) score += 10;
      if (userInterests[p.category]) score += (userInterests[p.category] * 2);
      if (p.isPromoted) score += 3;
      return { ...p, score };
    });
    return scoredProducts.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const related = getSuggestions();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-in fade-in">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-stone-500 hover:text-orange-700"><LucideArrowRight className="rotate-180" size={16}/> {t('product.back')}</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-stone-100 mb-16">
        <div>
          <div 
            className={`bg-stone-50 rounded-2xl overflow-hidden aspect-square relative shadow-inner group ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
            onMouseMove={isZoomed ? handleMouseMove : undefined}
            onClick={() => {
              if (window.innerWidth < 768) {
                setLightboxOpen(true);
              } else {
                setIsZoomed(!isZoomed);
              }
            }}
          >
            <img 
              src={images[activeImage]} 
              className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-[2.5]' : 'scale-100 group-hover:scale-105'}`} 
              style={isZoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : {}}
              alt={product.title} 
            />
            {!isZoomed && (
              <div 
                className="absolute bottom-4 right-4 bg-white/90 p-2.5 rounded-full shadow-lg text-stone-600 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-andeansky-700 hover:scale-110"
                onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
              >
                <LucideZoomIn size={22} />
              </div>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => { setActiveImage(idx); setIsZoomed(false); }}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-andeansky-500 shadow-md ring-2 ring-andeansky-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Gallery thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="mb-4"><span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase">{product.category}</span></div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-4">{product.title}</h1>
          <p className="text-3xl font-bold text-orange-700 mb-6">S/ {product.price}</p>
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-4"><LucideCheckCircle size={16}/> {product.stock > 0 ? `${product.stock} ${t('product.stock')}` : "Agotado"}</div>
          <p className="text-stone-600 leading-relaxed mb-8">{product.description}</p>
          {(product.collection || product.materials || product.technique || product.dimensions) && (
            <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-stone-100">
              {product.collection && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Colección</p>
                  <p className="text-sm font-medium text-stone-900 line-clamp-1">{product.collection}</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Dimensiones</p>
                  <p className="text-sm font-medium text-stone-900">{product.dimensions}</p>
                </div>
              )}
              {product.materials && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Materiales</p>
                  <p className="text-sm font-medium text-stone-900">{product.materials}</p>
                </div>
              )}
              {product.technique && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Técnica</p>
                  <p className="text-sm font-medium text-stone-900">{product.technique}</p>
                </div>
              )}
              {product.laborDays && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Dedicación</p>
                  <p className="text-sm font-medium text-stone-900">{product.laborDays} días de labor</p>
                </div>
              )}
              {product.stitchType && (
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Punto Maestro</p>
                  <p className="text-sm font-medium text-stone-900">{product.stitchType}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-andeangreen-50 p-6 rounded-2xl border border-andeangreen-100 mb-8 flex items-center gap-4 shadow-sm animate-in zoom-in-95 duration-500">
             <div className="w-14 h-14 rounded-full bg-white border-2 border-andeangreen-200 overflow-hidden shrink-0 shadow-inner">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName || 'Artesana'}`} alt={product.sellerName} className="w-full h-full object-cover" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-andeangreen-700 uppercase tracking-[0.2em] mb-0.5">Tejido a mano por</p>
                <h4 className="text-lg font-serif font-bold text-stone-900">{product.sellerName || "Artesana Contumacina"}</h4>
                <p className="text-xs text-stone-500 italic leading-snug mt-1">{t('product.support')}</p>
             </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onAddToCart} className="flex-1 bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2"><LucidePlus size={20} /> {t('product.add')}</button>
            <button className="w-14 h-14 flex items-center justify-center border border-stone-200 rounded-xl hover:bg-red-50 hover:text-red-500 transition text-stone-400"><LucideHeart size={24} /></button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-stone-200 pt-12">
          <div className="flex items-center gap-2 mb-8"><LucideStar className="text-orange-500" size={20} /><h3 className="text-2xl font-serif font-bold text-stone-900">{t('product.related')}</h3></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">{related.map(p => (<div key={p.id} onClick={() => onViewProduct(p)} className="bg-white p-4 rounded-xl border border-stone-100 hover:shadow-md transition cursor-pointer flex gap-4 items-center group"><div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0"><img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" alt="" /></div><div><h4 className="font-bold text-stone-800 text-sm line-clamp-1">{p.title}</h4><p className="text-xs text-stone-500 mb-1">{p.category}</p><p className="text-orange-700 font-bold text-sm">S/ {p.price}</p></div></div>))}</div>
        </div>
      )}

      {/* Lightbox Modal para vista expandida */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-wheat-300 bg-white/10 p-2 rounded-full transition-colors"
          >
            <LucideX size={32} />
          </button>
          <img 
            src={images[activeImage]} 
            alt={product.title} 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" 
          />
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 p-3 rounded-2xl backdrop-blur-md flex gap-4 overflow-x-auto max-w-[90vw]">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${activeImage === idx ? 'border-wheat-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
