import React from 'react';
import { LucideX, LucideCheckCircle2, LucideAlertCircle, LucideLoader2 } from 'lucide-react';

export function InfoModal({ type, message, onClose, onConfirm, confirmText, confirmColor }) { 
  const isFeedback = ['loading', 'success', 'error', 'confirm'].includes(type);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150" onClick={type !== 'loading' ? onClose : undefined}></div>
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-150 ease-out">
        
        {type !== 'loading' && (
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition">
            <LucideX size={20} />
          </button>
        )}

        <div className="p-10 text-center">
          {type === 'loading' && (
            <div className="flex flex-col items-center py-6 bg-gradient-to-b from-orange-50/40 to-transparent">
              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-10 relative shadow-inner overflow-hidden border-2 border-orange-50">
                <div className="absolute inset-0 rounded-full border-[6px] border-stone-100 border-t-orange-600 animate-spin shadow-[0_0_20px_-5px_#ea580c]"></div>
                <div className="absolute inset-4 rounded-full bg-orange-100/40 blur-xl animate-pulse"></div>
                <LucideLoader2 className="text-orange-600 animate-spin relative z-10 drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-2 font-serif tracking-tight drop-shadow-sm">Procesando</h3>
              <p className="text-stone-500 text-sm max-w-[240px] mx-auto leading-relaxed italic font-medium">
                {message || 'Sincronizando con el servidor local...'}
              </p>
              <div className="mt-8 flex gap-1 justify-center opacity-30">
                 <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          {type === 'success' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 pulse-green">
                <LucideCheckCircle2 className="text-green-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">¡Completado!</h3>
              <p className="text-stone-500 leading-relaxed">{message || 'La operación se realizó con éxito.'}</p>
              <button onClick={onClose} className="mt-8 w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition shadow-lg">Entendido</button>
            </div>
          )}

          {type === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <LucideAlertCircle className="text-red-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Algo salió mal</h3>
              <p className="text-stone-500 leading-relaxed">{message || 'No pudimos completar la acción. Inténtalo de nuevo.'}</p>
              <button onClick={onClose} className="mt-8 w-full py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg">Cerrar</button>
            </div>
          )}

          {type === 'confirm' && (
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 ${confirmColor === 'green' ? 'bg-green-50' : confirmColor === 'stone' ? 'bg-stone-50' : 'bg-red-50'} rounded-full flex items-center justify-center mb-6`}>
                <LucideAlertCircle className={confirmColor === 'green' ? 'text-green-600' : confirmColor === 'stone' ? 'text-stone-600' : 'text-red-600'} size={40} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">¿Confirmar Acción?</h3>
              <p className="text-stone-500 leading-relaxed">{message || 'Esta acción no se puede deshacer.'}</p>
              <div className="flex gap-3 w-full mt-8">
                <button onClick={onClose} className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition">Cancelar</button>
                <button 
                  onClick={() => { onConfirm(); }} 
                  className={`flex-1 py-4 text-white rounded-2xl font-bold transition shadow-lg ${
                    confirmColor === 'green' ? 'bg-green-600 hover:bg-green-700' : 
                    confirmColor === 'stone' ? 'bg-stone-900 hover:bg-stone-800' : 
                    'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {confirmText || 'Confirmar'}
                </button>
              </div>
            </div>
          )}

          {!isFeedback && (
            <div className="text-left animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 mb-6 border-b pb-4">
                 <div className="w-10 h-10 bg-stone-50 rounded-xl flex items-center justify-center text-stone-900 border border-stone-100 italic font-serif">?</div>
                 <h3 className="text-2xl font-serif font-bold text-stone-900 capitalize">{type.replace('-', ' ')}</h3>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto pr-2 text-stone-600 space-y-6 text-sm leading-relaxed">
                {type === 'envios' && (
                  <>
                    <div className="bg-andeansky-50/50 p-4 rounded-2xl border border-andeansky-100">
                      <p className="font-bold text-andeansky-900 mb-1">Ruta del Tesoro:</p>
                      <p>Cada pieza viaja directamente desde las manos de la artesana en <strong>Contumazá, Cajamarca</strong> hasta tu hogar.</p>
                    </div>
                    <ul className="space-y-4 list-disc pl-4 opacity-80">
                      <li><strong>Cobertura:</strong> Envíos a todo el Perú vía Olva Courier o Shalom.</li>
                      <li><strong>Tiempo:</strong> Entre 3 a 7 días hábiles según la lejanía del destino.</li>
                      <li><strong>Internacional:</strong> Gestionamos envíos vía Serpost (consultar tiempos).</li>
                    </ul>
                  </>
                )}

                {type === 'cuidado' && (
                  <>
                    <p className="italic bg-stone-50 p-4 rounded-xl border border-stone-100">"Un tapete de Contumazá es una obra de arte que puede durar generaciones con el cuidado adecuado."</p>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-terracotta-500 rounded-full"></div>
                        <span><strong>Lavado:</strong> A mano con agua fría y jabón suave.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-terracotta-500 rounded-full"></div>
                        <span><strong>Secado:</strong> Siempre a la sombra, en superficie plana.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        <span><strong>Natural:</strong> No usar blanqueadores ni secadora.</span>
                      </div>
                    </div>
                  </>
                )}

                {type === 'preguntas' && (
                  <div className="space-y-6">
                    <div className="border-l-2 border-terracotta-200 pl-4">
                      <p className="font-bold text-stone-900 mb-1">¿Cómo realizo el pago?</p>
                      <p>Puedes finalizar tu compra vía WhatsApp para coordinar con la artesana, o usar nuestra pasarela de pago segura con tarjeta.</p>
                    </div>
                    <div className="border-l-2 border-terracotta-200 pl-4">
                      <p className="font-bold text-stone-900 mb-1">¿Recibiré el producto exacto?</p>
                      <p>Sí, cada registro fotográfico corresponde a la pieza única que estás viendo en el catálogo. No son réplicas industriales.</p>
                    </div>
                    <div className="border-l-2 border-terracotta-200 pl-4">
                      <p className="font-bold text-stone-900 mb-1">¿Es comercio justo?</p>
                      <p>Absolutamente. El 100% del valor de venta va directamente a la maestra artesana, sin intermediarios comerciales.</p>
                    </div>
                  </div>
                )}
                
                {!['envios', 'cuidado', 'preguntas'].includes(type) && (
                  <>
                    <p>Bienvenido a la sección de {type}. Aquí encontrarás los detalles legales y términos de uso de nuestra plataforma de artesanas de Contumazá.</p>
                    <p>Nuestra misión es conectar el talento local con el mundo, garantizando comercio justo y preservación cultural.</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
}
