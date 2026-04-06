"use client";
import React, { useState } from 'react';
import { LucideSearch, LucidePlus, LucideCheckCircle, LucideXCircle, LucideEye, LucideEdit, LucideTrash2 } from 'lucide-react';
import { UserFormModal } from './UserFormModal';

export function UserManager({ users, onImpersonate, onAdd, onEdit, onDelete, setFeedback }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'pending'
  
  const handleOpenAdd = () => { setEditingUser(null); setIsModalOpen(true); };
  const handleOpenEdit = (u) => { setEditingUser(u); setIsModalOpen(true); };
  
  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsersList = users.filter(u => u.status !== 'pending');

  const usersToShow = activeTab === 'active' ? activeUsersList : pendingUsers;

  const filteredUsers = usersToShow.filter(u => {
    const fullName = u.firstName ? `${u.firstName} ${u.lastName}` : (u.name || '');
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           u.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleApprove = (u) => {
    if (setFeedback) {
      const uName = u.firstName ? `${u.firstName} ${u.lastName}` : (u.name || '');
      setFeedback({
        type: 'confirm',
        message: `¿Deseas dar de alta a ${uName}? Una vez activa, podrá acceder a su taller y subir productos.`,
        onConfirm: () => onEdit({ ...u, status: 'active' }),
        confirmText: 'Dar de Alta',
        confirmColor: 'green'
      });
    }
  };

  const getWhatsAppLink = (u) => {
    if (!u.phone) return '#';
    const number = u.phone.replace(/\D/g, '');
    const uName = u.firstName || u.name || 'Artesana';
    const message = encodeURIComponent(`Hola ${uName}, te escribo de la Municipalidad respecto a tu solicitud en Tapetes.pe. ¿Podemos coordinar la validación de tu taller?`);
    return `https://wa.me/${number}?text=${message}`;
  };

  return (
    <div className="animate-in fade-in">
      <div className="flex justify-between items-center mb-6">
        <div><h2 className="text-2xl font-bold text-stone-900">Gestión de Usuarios</h2><p className="text-stone-500 text-sm">Administra accesos y solicitudes de artesanas</p></div>
        <button onClick={handleOpenAdd} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"><LucidePlus size={16}/> Nuevo Usuario</button>
      </div>

      <div className="flex gap-4 mb-6 border-b border-stone-200">
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'active' ? 'border-purple-600 text-purple-700' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Usuarios Activos ({activeUsersList.length})
        </button>
        <button 
          onClick={() => setActiveTab('pending')}
          className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 relative ${activeTab === 'pending' ? 'border-purple-600 text-purple-700' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Solicitudes Pendientes ({pendingUsers.length})
          {pendingUsers.length > 0 && <span className="absolute top-0 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
        </button>
      </div>

      <div className="mb-6 relative">
        <LucideSearch className="absolute left-3 top-2.5 text-stone-400" size={20}/>
        <input type="text" placeholder="Buscar por nombre o correo..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-100" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-xs border-b border-stone-100">
            <tr><th className="p-4">Usuario / DNI</th><th className="p-4">Rol</th><th className="p-4">Contacto</th><th className="p-4 text-right">Acciones</th></tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-stone-50 transition">
                <td className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={u.photo || `https://api.dicebear.com/7.x/notionists/svg?seed=${u.firstName || u.name || (u.id?.slice(0,5))}`} 
                      className="w-10 h-10 rounded-full border border-stone-200 object-cover bg-stone-50" 
                      alt=""
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${u.status === 'active' ? 'bg-green-500' : u.status === 'pending' ? 'bg-orange-400 animate-pulse' : 'bg-red-400'}`}></div>
                  </div>
                  <div>
                    <p className="font-bold text-stone-900">{u.firstName ? `${u.firstName} ${u.lastName}` : (u.name || 'Sin nombre')}</p>
                    <p className="text-[11px] text-stone-500">{u.email}</p>
                    {u.status === 'pending' && u.specialty && (
                      <p className="text-[10px] text-purple-600 font-medium italic mt-0.5">Especialidad: {u.specialty}</p>
                    )}
                    {u.dni && <p className="text-[10px] bg-stone-100 text-stone-600 px-1 inline-block mt-0.5 rounded">DNI: {u.dni}</p>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5 max-w-[150px]">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border ${
                      u.role === 'superadmin' ? 'bg-purple-100 text-purple-700 border-purple-200' : 
                      u.role === 'redactor' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                      'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      {u.role === 'superadmin' ? 'Super Admin' : u.role === 'redactor' ? 'Redactor' : 'Artesana'}
                    </span>
                    {u.role === 'superadmin' && (
                      <>
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-stone-100 text-stone-500 border border-stone-200 uppercase tracking-tighter">Auditoría Full</span>
                        <span className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-stone-100 text-stone-500 border border-stone-200 uppercase tracking-tighter">Config. Sistema</span>
                      </>
                    )}
                    {(u.role === 'superadmin' || u.role === 'redactor') && (
                      <span className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-stone-100 text-stone-500 border border-stone-200 uppercase tracking-tighter">Gestión Contenido</span>
                    )}
                    {u.role === 'seller' && (
                      <span className="px-2 py-0.5 rounded-md text-[8px] font-bold bg-stone-100 text-stone-500 border border-stone-200 uppercase tracking-tighter">Solo Catálogo</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-stone-800">{u.phone || '-'}</p>
                    <p className="text-[10px] text-stone-400 truncate max-w-[120px]">{u.location || 'Contumazá'}</p>
                    {u.status === 'pending' && u.phone && (
                      <a 
                        href={getWhatsAppLink(u)} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[10px] text-green-600 font-bold hover:underline flex items-center gap-1 mt-1"
                      >
                         <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-2.32 0-4.519.905-6.16 2.547-3.33 3.33-3.33 8.771 0 12.101 1.632 1.632 3.84 2.533 6.16 2.533 2.321 0 4.519-.901 6.161-2.533 3.331-3.33 3.331-8.771 0-12.101-1.632-1.632-3.84-2.533-6.161-2.547zm0 15.653c-1.954 0-3.818-.761-5.228-2.171-2.883-2.883-2.883-7.574 0-10.457 1.412-1.411 3.276-2.172 5.228-2.172 1.953 0 3.818.761 5.229 2.172 2.883 2.883 2.883 7.574 0 10.457-1.411 1.41-3.276 2.171-5.229 2.171z"/></svg> 
                         Validar por WhatsApp
                      </a>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {u.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(u)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-2 transition shadow-sm animate-pulse-gentle"><LucideCheckCircle size={14}/> Dar de Alta</button>
                        <button 
                          onClick={() => {
                            if (setFeedback) {
                              const uName = u.firstName ? `${u.firstName} ${u.lastName}` : (u.name || '');
                              setFeedback({
                                type: 'confirm',
                                message: `¿Deseas rechazar la solicitud de ${uName}? Esta acción eliminará su registro.`,
                                onConfirm: () => onDelete(u.id),
                                confirmText: 'Rechazar Solicitud',
                                confirmColor: 'red'
                              });
                            }
                          }}
                          className="text-stone-400 bg-stone-100 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                       u.role !== 'superadmin' && <button onClick={() => onImpersonate(u)} className="text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-purple-100 flex items-center gap-2 transition"><LucideEye size={14}/> Ver Como</button>
                    )}
                    <button onClick={() => handleOpenEdit(u)} className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"><LucideEdit size={18}/></button>
                    {u.role !== 'superadmin' && (
                      <button 
                        onClick={() => { 
                          if (setFeedback) {
                            setFeedback({
                              type: 'confirm',
                              message: `¿Estás seguro de que deseas eliminar a ${u.name}? Esta acción no se puede deshacer.`,
                              onConfirm: () => onDelete(u.id),
                              confirmText: 'Eliminar Usuario',
                              confirmColor: 'red'
                            });
                          } else {
                            if(confirm('¿Eliminar usuario?')) onDelete(u.id);
                          }
                        }} 
                        className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <LucideTrash2 size={18}/>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && <div className="p-8 text-center text-stone-400">No se encontraron usuarios.</div>}
      </div>
      {isModalOpen && <UserFormModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={(u) => { editingUser ? onEdit(u) : onAdd(u); setIsModalOpen(false); }} />}
    </div>
  );
}
