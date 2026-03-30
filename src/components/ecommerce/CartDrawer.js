"use client";
import React, { useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { LucideX, LucideTrash2, LucideShoppingBag, LucidePhone, LucideCreditCard } from 'lucide-react';

export function CartDrawer() {
  const { cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart } = useCart();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState('whatsapp'); 

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (paymentMethod === 'whatsapp') {
      const text = `Hola, deseo adquirir: ${cart.map(i => i.title).join(', ')}. Total: S/${cartTotal}`;
      window.open(`https://wa.me/51999999999?text=${encodeURIComponent(text)}`);
    } else {
      alert("Redirigiendo a pasarela segura de MercadoPago... (Simulado)");
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
       <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
       <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-serif text-stone-800">{t('cart.title')}</h2>
            <button onClick={() => setIsCartOpen(false)}><LucideX/></button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
             {cart.map((item, i) => (
               <div key={i} className="flex gap-4 p-3 border border-stone-100 rounded-lg bg-stone-50">
                 <img src={item.image} className="w-16 h-16 rounded object-cover" alt=""/>
                 <div className="flex-1">
                   <h4 className="font-bold text-sm text-stone-800">{item.title}</h4>
                   <p className="text-andeansky-700 font-bold text-sm font-serif">S/ {item.price}</p>
                 </div>
                 <button onClick={() => removeFromCart(i)} className="text-stone-300 hover:text-red-500 transition-colors">
                   <LucideTrash2 size={16}/>
                 </button>
               </div>
             ))}
             {cart.length === 0 && (
               <div className="text-center py-20 text-stone-400">
                 <LucideShoppingBag size={48} className="mx-auto mb-4 opacity-30 text-andeansky-700"/>
                 <p className="font-serif">{t('cart.empty')}</p>
               </div>
             )}
          </div>
          {cart.length > 0 && (
            <div className="pt-6 border-t border-stone-100">
              <div className="flex justify-between text-lg font-bold text-stone-900 mb-6 font-serif">
                <span>{t('cart.total')}</span>
                <span>S/ {cartTotal.toFixed(2)}</span>
              </div>
              <p className="text-xs font-bold text-stone-500 uppercase mb-3">{t('cart.pay_method')}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                 <button onClick={() => setPaymentMethod('whatsapp')} className={`p-4 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${paymentMethod === 'whatsapp' ? 'border-green-500 bg-green-50 text-green-800 ring-1 ring-green-500' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}><LucidePhone size={24} className="mb-1"/> <span>WhatsApp</span><span className="text-[9px] font-normal opacity-80">{t('cart.wa_desc')}</span></button>
                 <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500' : 'border-stone-200 text-stone-500 hover:bg-stone-50'}`}><LucideCreditCard size={24} className="mb-1"/> <span>Tarjeta</span><span className="text-[9px] font-normal opacity-80">{t('cart.card_desc')}</span></button>
              </div>
              <button onClick={handleCheckout} className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition transform active:scale-[0.98] ${paymentMethod === 'whatsapp' ? 'bg-green-600 hover:bg-green-700' : 'bg-andeansky-700 hover:bg-andeansky-800'}`}>
                {paymentMethod === 'whatsapp' ? <><LucidePhone size={18}/> {t('cart.wa_btn')}</> : <><LucideCreditCard size={18}/> {t('cart.card_btn')}</>}
              </button>
            </div>
          )}
       </div>
    </div>
  );
}
