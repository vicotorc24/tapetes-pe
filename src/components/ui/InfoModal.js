import React from 'react';
import { LucideX, LucideCheckCircle2, LucideAlertCircle, LucideLoader2 } from 'lucide-react';

export function InfoModal({ type, message, onClose, onConfirm }) { 
  const isFeedback = ['loading', 'success', 'error', 'confirm'].includes(type);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={type !== 'loading' ? onClose : undefined}></div>
      
      {/* Modal Card */}
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {type !== 'loading' && (
          <button onClick={onClose} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900 transition">
            <LucideX size={20} />
          </button>
        )}

        <div className="p-10 text-center">
          {type === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <LucideLoader2 className="text-orange-600 animate-spin" size={40} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">Procesando</h3>
              <p className="text-stone-500 leading-relaxed">{message || 'Estamos conectando con el servidor...'}</p>
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
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <LucideAlertCircle className="text-red-600" size={40} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">¿Confirmar Acción?</h3>
              <p className="text-stone-500 leading-relaxed">{message || 'Esta acción no se puede deshacer.'}</p>
              <div className="flex gap-3 w-full mt-8">
                <button onClick={onClose} className="flex-1 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold hover:bg-stone-200 transition">Cancelar</button>
                <button onClick={() => { onConfirm(); }} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg">Eliminar</button>
              </div>
            </div>
          )}

          {!isFeedback && (
            <div className="text-left">
              <h3 className="text-2xl font-serif font-bold text-stone-900 mb-6 border-b pb-4 capitalize">{type.replace('-', ' ')}</h3>
              <div className="max-h-[60vh] overflow-y-auto pr-2 text-stone-600 space-y-4 text-sm leading-relaxed">
                <p>Bienvenido a la sección de {type}. Aquí encontrarás los detalles legales y términos de uso de nuestra plataforma de artesanas de Contumazá.</p>
                <p>Nuestra misión es conectar el talento local con el mundo, garantizando comercio justo y preservación cultural.</p>
                {/* Agregaremos más contenido real según se requiera */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
}
