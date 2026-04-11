import React from 'react';
import { LucideSmartphone, LucideQrCode, LucideCheckCircle, LucideArrowRight } from 'lucide-react';

export function AppPromotion() {
  const downloadUrl = "https://expo.dev/accounts/gvnarro/projects/madeincontumaza/builds/4b6addad-a596-4d19-9c0e-802ec69b5040";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(downloadUrl)}`;

  return (
    <div className="bg-stone-50 py-24 overflow-hidden border-y border-stone-100 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-terracotta-500/5 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-andeansky-500/5 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Content */}
          <div className="reveal-on-scroll">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 bg-terracotta-500"></span>
              <span className="text-terracotta-600 font-bold text-[10px] uppercase tracking-[0.4em] block">Tecnología para el campo</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif font-black text-stone-900 mb-8 tracking-tighter leading-tight">
              Lleva el Portal en <br/>
              <span className="italic text-terracotta-600">tu Bolsillo</span>
            </h2>
            
            <p className="text-xl text-stone-600 font-light leading-relaxed mb-10 max-w-xl">
              Gestiona tus productos, monitorea tus ventas y conecta con compradores de todo el mundo directamente desde tu celular. Una herramienta diseñada por y para los productores de Contumazá.
            </p>

            <ul className="space-y-4 mb-12">
              {[
                "Fotografía y publicación instantánea",
                "Métricas de impacto y visitas en tiempo real",
                "Gestión de perfil y marca institucional",
                "Comunicación directa vía WhatsApp"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4 text-stone-700 font-medium">
                  <div className="w-6 h-6 rounded-full bg-andeangreen-100 flex items-center justify-center text-andeangreen-700">
                    <LucideCheckCircle size={16} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a 
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-stone-900 text-white px-10 py-5 rounded-full font-bold hover:bg-terracotta-600 transition-all shadow-xl flex items-center gap-3 group"
              >
                <LucideSmartphone size={20} />
                Descargar APK (Beta)
                <LucideArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </a>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest max-w-[150px] leading-tight">
                * Versión provisional para Android
              </span>
            </div>
          </div>

          {/* Right Side: Visuals (QR & Icon) */}
          <div className="relative reveal-on-scroll delay-300">
            <div className="relative z-10 bg-white p-10 md:p-14 rounded-[4rem] shadow-soft-2xl border border-stone-100 flex flex-col items-center text-center">
              
              {/* App Icon Bubble */}
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl p-4 border border-stone-50 animate-float">
                <img 
                  src="/images/app-icon.png" 
                  alt="App Icon" 
                  className="w-full h-full object-contain rounded-2xl"
                  onError={(e) => {
                    // Fallback to a placeholder or the actual path if /assets/icon.png doesn't work directly in standard web public folder
                    e.target.src = "https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=a32a18";
                  }}
                />
              </div>

              <div className="mb-10">
                <div className="bg-stone-50 p-6 rounded-3xl inline-block mb-6 border border-stone-100">
                  <LucideQrCode size={48} className="text-stone-900" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2 italic">Escanea para Instalar</h3>
                <p className="text-sm text-stone-400 font-medium tracking-wide">Apunta tu cámara y descarga directamente</p>
              </div>

              {/* The Actual QR Code from API */}
              <div className="bg-stone-900 p-4 rounded-3xl shadow-inner mb-8 transition-transform hover:scale-105 duration-500">
                <img 
                  src={qrUrl} 
                  alt="QR Code para descarga" 
                  className="w-48 h-48 md:w-64 md:h-64 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 text-terracotta-600 font-bold text-[10px] uppercase tracking-widest leading-none">
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-600"></span>
                 </span>
                 Lanzamiento Oficial 2026
              </div>
            </div>

            {/* Decorative Splotch */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-terracotta-500/10 rounded-full blur-[60px] -z-0"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
