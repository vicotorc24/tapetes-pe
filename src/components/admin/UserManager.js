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

  const filteredUsers = usersToShow.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (u) => {
    if (setFeedback) {
      setFeedback({
        type: 'confirm',
        message: `¿Deseas dar de alta a ${u.name}? Una vez activa, podrá acceder a su taller y subir productos.`,
        onConfirm: () => onEdit({ ...u, status: 'active' })
      });
    }
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
                    <img src={u.photo} className="w-10 h-10 rounded-full border border-stone-200" alt=""/>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${u.status === 'active' ? 'bg-green-500' : u.status === 'pending' ? 'bg-orange-400 animate-pulse' : 'bg-red-400'}`}></div>
                  </div>
                  <div><p className="font-bold text-stone-900">{u.name}</p><p className="text-[11px] text-stone-500">{u.email}</p>{u.dni && <p className="text-[10px] bg-stone-100 text-stone-600 px-1 inline-block mt-0.5 rounded">DNI: {u.dni}</p>}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    u.role === 'superadmin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                    u.role === 'redactor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                    'bg-orange-50 text-orange-700 border-orange-100'
                  }`}>
                    {u.role === 'superadmin' ? 'Super Admin' : u.role === 'redactor' ? 'Redactor' : 'Artesana'}
                  </span>
                </td>
                <td className="p-4">
                  <p className="text-xs font-bold text-stone-800">{u.phone || '-'}</p>
                  <p className="text-[10px] text-stone-400 truncate max-w-[120px]">{u.location || 'Contumazá'}</p>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {u.status === 'pending' ? (
                       <button onClick={() => handleApprove(u)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 flex items-center gap-2 transition shadow-sm"><LucideCheckCircle size={14}/> Dar de Alta</button>
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
                              onConfirm: () => onDelete(u.id)
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
