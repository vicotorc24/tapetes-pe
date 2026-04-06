"use client";
import React from 'react';
import { 
  LucideLayoutDashboard, 
  LucidePackage, 
  LucideUsers, 
  LucideTags, 
  LucideLayers, 
  LucideSettings, 
  LucideLogOut, 
  LucideExternalLink, 
  LucideUserCircle,
  LucideLibrary,
  LucideMenu,
  LucideX,
  LucideHeartHandshake,
  LucideShield
} from 'lucide-react';
import { useState } from 'react';

export function DashboardLayout({ children, user, currentView, setView, onLogout, onHome }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleSetView = (viewId) => {
    setView(viewId);
    setMobileMenuOpen(false);
  };

  const menuSections = [
    {
      title: 'Dashboard',
      items: [
        { id: 'overview', label: 'Resumen General', icon: LucideLayoutDashboard, roles: ['superadmin', 'seller'] },
      ]
    },
    {
      title: 'Taller y Catálogo',
      items: [
        { id: 'products', label: 'Mis Productos', icon: LucidePackage, roles: ['superadmin', 'seller'] },
        { id: 'categories', label: 'Categorías', icon: LucideTags, roles: ['superadmin'] },
        { id: 'collections', label: 'Colecciones', icon: LucideLayers, roles: ['superadmin'] },
      ]
    },
    {
      title: 'Cultura y Equipo',
      items: [
        { id: 'legacy', label: 'Legado Cultural', icon: LucideLibrary, roles: ['superadmin', 'redactor'] }, 
        { id: 'impact', label: 'Impacto Social', icon: LucideHeartHandshake, roles: ['superadmin', 'redactor'] }, 
        { id: 'users', label: 'Gestión Usuarios', icon: LucideUsers, roles: ['superadmin'] }, 
      ]
    },
    {
      title: 'Sistema',
      items: [
        { id: 'profile', label: 'Mi Perfil', icon: LucideUserCircle, roles: ['superadmin', 'seller', 'redactor'] },
        { id: 'audit', label: 'Auditoría Técnica', icon: LucideShield, roles: ['superadmin'] },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] font-sans text-stone-800">
      {/* Sidebar Privado */}
      {/* Sidebar Overlay (Mobile) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[110] lg:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Dashboard */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-stone-200 z-[120] 
        flex flex-col shadow-2xl lg:shadow-sm transition-transform duration-300 ease-in-out
        print:hidden
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center justify-between px-8 border-b border-stone-100 bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-bold font-serif">T</div>
            <span className="text-xl font-bold font-serif text-stone-900 tracking-tight">Tapetes Admin</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-2 text-stone-400 hover:text-stone-900">
             <LucideX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-4">
          {menuSections.map((section, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <p className="px-4 text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-4">{section.title}</p>
              <nav className="space-y-1">
                {section.items.filter(item => item.roles.includes(user.role)).map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => handleSetView(item.id)} 
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${currentView === item.id ? 'bg-stone-900 text-white shadow-lg shadow-stone-200 translate-x-1' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
                  >
                    <item.icon size={18} className={currentView === item.id ? 'text-wheat-500' : ''} /> 
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-stone-100 bg-stone-50/30 flex-shrink-0">
          <button onClick={onHome} className="w-full flex items-center gap-3 px-4 py-3 text-stone-500 hover:text-andeansky-700 text-sm font-medium transition-colors mb-2 rounded-xl hover:bg-white border border-transparent hover:border-stone-100">
            <LucideExternalLink size={18} /> Ir al Sitio Público
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-600 text-sm font-medium transition-colors rounded-xl hover:bg-red-50">
            <LucideLogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Area de Contenido Privado */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Header Superior del Dashboard */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-[100] px-6 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setMobileMenuOpen(true)}
               className="lg:hidden p-2 -ml-2 text-stone-900 hover:bg-stone-50 rounded-xl transition-colors"
             >
               <LucideMenu size={24} />
             </button>
             <div>
                <h4 className="text-stone-400 text-[10px] md:text-xs font-medium font-serif italic mb-0.5">Bienvenido de vuelta,</h4>
                <p className="text-stone-900 font-bold text-sm tracking-tight">
                  {user.firstName ? `${user.firstName} ${user.lastName}` : (user.name || 'Usuario')}
                </p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 
                  user.role === 'redactor' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-50 text-orange-600'
                }`}>
                  {user.role === 'superadmin' ? 'Super Usuario' : 
                   user.role === 'redactor' ? 'Redactor' : 
                   'Artesana'}
                </span>
             </div>
             <div className="w-10 h-10 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shadow-inner">
                <img src={user.photo || 'https://placehold.co/100?text=U'} className="w-full h-full object-cover" alt=""/>
             </div>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="p-8 md:p-12 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
