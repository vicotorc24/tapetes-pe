"use client";
import React, { useState, useEffect, use } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  LucideArrowRight, 
  LucideCheckCircle, 
  LucideHeart, 
  LucidePlus, 
  LucideClock, 
  LucideRuler, 
  LucideBox, 
  LucidePalette, 
  LucideLayers,
  LucideChevronLeft,
  LucideChevronRight,
  LucideTags,
  LucideMessageCircle,
  LucideMaximize2,
  LucideX
} from 'lucide-react';
import Link from 'next/link';
import { getProductById } from '@/lib/services/products';
import { getUserByEmail } from '@/lib/services/users';
import { AnalyticsEvents } from '@/lib/analytics';
import { recordProfileView, recordWhatsappClick } from '@/lib/services/interactions';

export default function ProductPage({ params }) {
  const { addToCart } = useCart();
  const { id: productId } = use(params);
  
  const [product, setProduct] = useState(null);
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - (left + window.scrollX)) / width) * 100;
    const y = ((e.pageY - (top + window.scrollY)) / height) * 100;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const fetchProductAndArtisan = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
        
        if (productData?.sellerEmail) {
          const artisanData = await getUserByEmail(productData.sellerEmail);
          setArtisan(artisanData);
        }
      } catch (e) {
        console.error("Error cargando página de producto:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndArtisan();
  }, [productId]);

  const viewRecorded = React.useRef(false);

  // Registro de Visita de Producto (Analíticas Internas + GA4)
  // Esperamos a que la artesana esté cargada para que el dato llegue a su dashboard personal
  useEffect(() => {
    if (product?.id && artisan?.id && !viewRecorded.current) {
      AnalyticsEvents.PRODUCT_VIEW(product, artisan);
      viewRecorded.current = true;
    }
  }, [product?.id, artisan?.id]);

  // Registro de Visita de Perfil de Artesana
  useEffect(() => {
    if (artisan?.id) {
      recordProfileView(artisan.id);
      AnalyticsEvents.PROFILE_VIEW(artisan);
    }
  }, [artisan?.id]);

  const handleWhatsappAction = () => {
    if (product && artisan) {
      AnalyticsEvents.WHATSAPP_CLICK(product, artisan);
      if (artisan.id) recordWhatsappClick(artisan.id);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      AnalyticsEvents.ADD_TO_CART(product);
      addToCart(product);
    }
  };

  // Manejo de Gestos Táctiles para Lightbox
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (diff > 50) { // Swipe Left (Siguiente)
      setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1);
    } else if (diff < -50) { // Swipe Right (Anterior)
      setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1);
    }
    setTouchStart(null);
  };

  // Manejo de Teclado (Esc para cerrar)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    if (isLightboxOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isLightboxOpen]);

  const getWhatsAppLink = () => {
    if (!artisan?.whatsapp && !artisan?.phone) return '#';
    const number = artisan?.whatsapp || artisan?.phone || '51999999999';
    const message = encodeURIComponent(`Hola ${artisan?.name || 'Artesana'}, vengo de Tapetes.pe y me interesa adquirir tu pieza "${product?.title}". ¿Está disponible?`);
    return `https://wa.me/${number.replace(/\D/g, '')}?text=${message}`;
  };

  if (loading) return (
    <div className="pt-40 text-center animate-in fade-in">
       <div className="w-16 h-16 border-4 border-andeansky-100 border-t-andeansky-700 rounded-full animate-spin mx-auto mb-6"></div>
       <p className="text-stone-500 font-serif text-2xl animate-pulse">Cargando tesoro artesanal...</p>
    </div>
  );

  if (!product) return (
    <div className="pt-40 text-center px-4">
      <div className="bg-red-50 text-red-700 p-8 rounded-3xl border border-red-100 max-w-md mx-auto shadow-sm">
        <h2 className="text-2xl font-serif font-black mb-4">¡Oh no!</h2>
        <p className="mb-6 opacity-80 italic">No hemos podido encontrar el registro de este producto en el catálogo de Contumazá.</p>
        <div className="flex flex-col gap-3">
          <Link href="/#catalog-section" className="bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition">
            Volver al Catálogo
          </Link>
          <button onClick={() => window.location.reload()} className="text-stone-400 text-xs underline hover:text-stone-600">
            Intentar nuevamente (Recargar)
          </button>
        </div>
      </div>
    </div>
  );

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 animate-in fade-in pb-24 font-sans">
      {/* Navegación superior */}
      <nav className="mb-6 flex items-center justify-between">
        <Link href="/#catalog-section" className="flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors group text-sm font-medium">
          <LucideArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={14}/> 
          Volver al Catálogo
        </Link>
        <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold hidden md:block">
          Arte de Contumazá &gt; {product.category}
        </span>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* COLUMNA IZQUIERDA: Galería + Artesana */}
        <div className="lg:col-span-7 space-y-10">
          <div 
            className="bg-white rounded-[2.5rem] overflow-hidden aspect-square relative shadow-2xl shadow-stone-200 border border-stone-100 group cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
             {product.isPremium && (
               <div className="absolute top-6 left-6 z-20 bg-andeansky-700 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
                 ⚡ Destacado
               </div>
             )}

             <button 
               onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
               className="absolute top-6 right-6 z-20 bg-white/90 backdrop-blur-md text-stone-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 active:scale-95"
               title="Ver a pantalla completa"
             >
               <LucideMaximize2 size={18} />
             </button>
             
             <div className="w-full h-full relative overflow-hidden">
                <img 
                  src={typeof images[activeImage] === 'string' ? images[activeImage] : images[activeImage]?.url} 
                  className={`w-full h-full object-cover transition-transform duration-300 pointer-events-none ${
                    isZoomed ? 'scale-[2.5]' : 'scale-100'
                  }`}
                  style={{ 
                    transformOrigin: isZoomed ? `${mousePos.x}% ${mousePos.y}%` : 'center center' 
                  }}
                  alt={product.title} 
                />
             </div>
             
             {!isZoomed && (
               <div className="absolute bottom-6 right-6 z-10 bg-white/40 backdrop-blur-sm text-stone-900 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                 Pasa el mouse para zoom
               </div>
             )}

             {images.length > 1 && (
               <>
                 <button 
                   onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                   className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-stone-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <LucideChevronLeft size={20} />
                 </button>
                 <button 
                   onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-stone-900 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                 >
                   <LucideChevronRight size={20} />
                 </button>
               </>
             )}
          </div>
          
          {/* Miniaturas */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === idx ? 'border-andeansky-700 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={typeof img === 'string' ? img : img?.url} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}

          {/* CARD DE LA ARTESANA (Lado Izquierdo) */}
          <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-100/40 relative overflow-hidden group">
            <div className="absolute -bottom-4 -right-4 w-40 h-40 opacity-[0.05] grayscale pointer-events-none group-hover:opacity-[0.08] transition-opacity">
              <img src="/images/andean_weaver.png" className="w-full h-full object-contain" alt="" />
            </div>
            
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-50 shrink-0 border-2 border-white shadow-md">
                  <img 
                    src={artisan?.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${artisan?.name || product?.sellerEmail || 'weaver'}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={artisan?.name} 
                  />
                </div>
                <div>
                  <span className="text-[9px] font-black text-andeansky-600 uppercase tracking-[0.2em] mb-1 block">Tu Maestra Artesana</span>
                  <h4 className="text-xl font-serif font-black text-stone-900 leading-none">{artisan?.name || 'Artesana de Contumazá'}</h4>
                  <p className="text-[10px] text-stone-400 mt-1 font-bold">{artisan?.location || 'Contumazá, Cajamarca'}</p>
                </div>
              </div>

              <p className="text-sm text-stone-500 italic leading-relaxed mb-8 border-l-2 border-andeansky-100 pl-4 py-1">
                {artisan?.bio || '"Con cada nudo y cada punto, tejemos la historia y el corazón de nuestro querido Contumazá."'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0"><LucideMessageCircle size={16}/></div>
                  <div className="overflow-hidden">
                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                    <p className="text-xs font-black text-stone-800 truncate">{artisan?.whatsapp || artisan?.phone || 'Disponible'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-andeansky-50 flex items-center justify-center text-andeansky-600 shrink-0"><LucideCheckCircle size={16}/></div>
                  <div className="overflow-hidden">
                    <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest leading-none mb-1">Correo</p>
                    <p className="text-xs font-black text-stone-800 truncate">{artisan?.email || 'ventas@tapetes.pe'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* COLUMNA DERECHA: Datos + Compra + Ficha */}
        <div className="lg:col-span-5 flex flex-col pt-2">
          <div className="mb-2">
            <span className="text-andeansky-600 font-black text-[10px] uppercase tracking-[0.2em]">
               Colección: {product.collection || 'Artesanía Local'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-900 mb-6 leading-tight">{product.title}</h1>
          
          <div className="flex items-baseline gap-4 mb-8">
            <p className="text-4xl font-black text-stone-900 font-serif">S/ {product.price}</p>
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
              product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.stock > 0 ? `${product.stock} DISPONIBLES` : 'AGOTADO'}
            </div>
          </div>
          
          <p className="text-stone-500 leading-relaxed mb-8 text-lg font-sans italic">
            {product.description}
          </p>
          
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 mb-12">
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsappAction}
              className="flex-1 bg-[#25D366] text-white py-4 px-6 rounded-2xl font-black text-xs hover:bg-[#128C7E] transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 active:scale-95"
            >
              <LucideMessageCircle size={20} className="shrink-0" /> 
              <span className="tracking-tight uppercase">CONSULTAR POR WHATSAPP</span>
            </a>
            <div className="flex gap-4 flex-1">
               <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-stone-900 text-white py-4 px-4 rounded-2xl font-black text-xs hover:bg-andeansky-700 transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <LucidePlus size={18} /> CARRITO
              </button>
              <button className="w-14 h-14 flex items-center justify-center border border-stone-200 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all text-stone-300 shrink-0">
                <LucideHeart size={20} />
              </button>
            </div>
          </div>

          {/* FICHA TÉCNICA (Regresada a la Derecha) */}
          <div className="bg-stone-50/50 p-8 rounded-[2.5rem] space-y-7 border border-stone-100/50 shadow-sm relative overflow-hidden">
            <h3 className="text-stone-900 font-black text-[10px] uppercase tracking-[0.25em] flex items-center gap-3 border-b border-stone-200/50 pb-4">
              <LucideTags size={14} className="text-andeansky-500"/> Especificaciones Técnicas
            </h3>
          
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 shrink-0"><LucidePalette size={16} /></div>
                <div><p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Técnica</p><p className="text-sm font-bold text-stone-700">{product.technique || 'Crochet'}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 shrink-0"><LucideLayers size={16} /></div>
                <div><p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Punto</p><p className="text-sm font-bold text-stone-700">{product.stitchType || 'Artesanal'}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 shrink-0"><LucideBox size={16} /></div>
                <div><p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Material</p><p className="text-sm font-bold text-stone-700">{product.materials || 'Fibras'}</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-400 shrink-0"><LucideRuler size={16} /></div>
                <div><p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-0.5">Tamaño</p><p className="text-sm font-bold text-stone-700">{product.dimensions || 'Estándar'}</p></div>
              </div>
            </div>

            <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 mt-4 relative overflow-hidden group">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><LucideClock size={20} /></div>
                <div>
                  <p className="text-[8px] font-black text-orange-900/50 uppercase tracking-widest leading-none mb-1">Días de labor</p>
                  <p className="text-sm font-serif font-bold text-orange-900">{product.laborDays || 'X'} días de trabajo manual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-stone-950/98 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Botón de Cierre */}
          <button 
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-all p-3 bg-white/5 rounded-full z-10 hover:rotate-90"
            onClick={() => setIsLightboxOpen(false)}
          >
            <LucideX size={24} className="md:w-8 md:h-8" />
          </button>
          
          {/* Contenido Principal del Lightbox */}
          <div className="relative max-w-6xl w-full flex flex-col items-center gap-6 md:gap-8 animate-in zoom-in-95 duration-500" onClick={(e) => e.stopPropagation()}>
            <div className="relative group/modal w-full flex items-center justify-center">
              <img 
                src={typeof images[activeImage] === 'string' ? images[activeImage] : images[activeImage]?.url} 
                className="max-h-[70vh] md:max-h-[75vh] w-auto object-contain shadow-2xl rounded-2xl border border-white/10 select-none" 
                alt={product.title}
                draggable="false"
              />

              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 rounded-full hidden md:flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"
                  >
                    <LucideChevronLeft size={32} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/10 rounded-full hidden md:flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5"
                  >
                    <LucideChevronRight size={32} />
                  </button>
                </>
              )}
            </div>

            {/* Información Inferior */}
            <div className="flex flex-col items-center text-center max-w-2xl px-6">
               <h3 className="text-white text-xl md:text-2xl font-serif mb-2">{product.title}</h3>
               {typeof images[activeImage] !== 'string' && images[activeImage]?.caption ? (
                  <p className="text-wheat-200/70 text-sm md:text-lg font-serif italic leading-relaxed">
                    {images[activeImage].caption}
                  </p>
               ) : (
                  <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                    Imagen {activeImage + 1} de {images.length}
                    <span className="md:hidden ml-2 opacity-50">• Desliza para navegar</span>
                  </p>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
