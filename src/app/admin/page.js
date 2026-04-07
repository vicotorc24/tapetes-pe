"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LucideShield } from 'lucide-react';

// Components
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { ProductManager } from '@/components/admin/ProductManager';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { ProfileManager } from '@/components/admin/ProfileManager';
import { UserManager } from '@/components/admin/UserManager';
import { LegacyManager } from '@/components/admin/LegacyManager';
import { CollectionManager } from '@/components/admin/CollectionManager';
import { ImpactManager } from '@/components/admin/ImpactManager';
import { InfoModal } from '@/components/ui/InfoModal';
import { AuditLogManager } from '@/components/admin/AuditLogManager';
import { ImpersonationBanner } from '@/components/layout/ImpersonationBanner';
import { PendingApprovalView } from '@/components/admin/PendingApprovalView';

// Services
import { getProducts } from '@/lib/services/products';
import { getUsers, addUser, updateUser, deleteUser } from '@/lib/services/users';
import { getCollections, addCollection, updateCollection, deleteCollection } from '@/lib/services/collections';
import { getCategories, addCategory, deleteCategory } from '@/lib/services/categories';
import { initialUsersData } from '@/lib/data';

// Firestore Direct (for quick updates)
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { logAction } from '@/lib/services/audit';

export default function AdminDashboard() {
  const { user, effectiveUser, impersonatedUser, loading, logout, register, startImpersonating } = useAuth();
  const router = useRouter();
  
  // States
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [dashboardView, setDashboardView] = useState('overview');
  const [infoModal, setInfoModal] = useState(null);
  const [infoMessage, setInfoMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [confirmColor, setConfirmColor] = useState('');

  // Centralized feedback handler for all managers
  const handleFeedback = (data) => {
    if (!data) {
      setInfoModal(null);
      return;
    }
    if (typeof data === 'string') {
      setInfoModal(data);
    } else {
      setInfoModal(data.type);
      setInfoMessage(data.message || '');
      if (data.onConfirm) setOnConfirmAction(() => data.onConfirm);
      if (data.confirmText) setConfirmText(data.confirmText);
      if (data.confirmColor) setConfirmColor(data.confirmColor);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const [p, u, col, cat] = await Promise.all([
          getProducts(),
          getUsers(),
          getCollections(),
          getCategories()
        ]);
        setProducts(p);
        setUsersList(u.length > 0 ? u : initialUsersData);
        setCollectionsData(col);
        setCategoriesData(cat);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      }
    };
    loadData();
  }, [user]);

  // Si empezamos a suplantar, volvemos al resumen para ver el estado del nuevo usuario
  useEffect(() => {
    if (impersonatedUser) {
      setDashboardView('overview');
    }
  }, [impersonatedUser]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-andeansky-700"></div>
      </div>
    );
  }

  // Handlers (Migrated from old page.js)
  const handleAddCategory = async ({ name, description }) => {
    setInfoModal('loading');
    try {
      await addCategory({ name, description });
      const data = await getCategories();
      setCategoriesData(data);
      setInfoMessage('Categoría agregada con éxito.');
      logAction(effectiveUser, `Creó la categoría "${name}"`, 'Catálogo', 'success');
      setInfoModal('success');
    } catch (e) { setInfoModal('error'); setInfoMessage(e.message); }
  };

  const handleUpdateCategory = async (id, data) => {
    setInfoModal('loading');
    try {
      await updateDoc(doc(db, 'categories', id), data);
      const updated = await getCategories();
      setCategoriesData(updated);
      setInfoMessage('La categoría ha sido actualizada.');
      logAction(effectiveUser, `Actualizó la categoría "${data.name || id}"`, 'Catálogo', 'info');
      setInfoModal('success');
    } catch (e) { setInfoModal('error'); setInfoMessage(e.message); }
  };

  const handleDeleteCategory = async (id) => {
    // La confirmación se manejará dentro del componente o aquí
    setInfoModal('loading');
    try {
      await deleteCategory(id);
      const data = await getCategories();
      setCategoriesData(data);
      setInfoMessage('Categoría eliminada con éxito.');
      logAction(effectiveUser, `Eliminó la categoría ID: ${id}`, 'Catálogo', 'warning');
      setInfoModal('success');
    } catch (e) { setInfoModal('error'); setInfoMessage(e.message); }
  };

  const handleReorderCategories = async (newOrder) => {
    // Actualizamos localmente primero para UX instantánea
    setCategoriesData(newOrder);
    try {
      // Actualizamos en Firebase cada documento con su nuevo order
      const promises = newOrder.map((cat, index) => 
        updateDoc(doc(db, 'categories', cat.id), { order: index })
      );
      await Promise.all(promises);
    } catch (e) {
      console.error("Error reordenando:", e);
      // Opcional: revertir si falla
      const original = await getCategories();
      setCategoriesData(original);
    }
  };

  const setFeedback = ({type, message, onConfirm, confirmText, confirmColor}) => {
    setInfoModal(type);
    setInfoMessage(message);
    setOnConfirmAction(() => onConfirm);
    setConfirmText(confirmText || '');
    setConfirmColor(confirmColor || '');
  };

  const handleAddUser = async (userData) => {
    const { password, ...otherData } = userData;
    setInfoModal('loading');
    try {
      if (password) {
        // Modo Admin: Crea en Auth + Firestore
        const result = await register(userData.email, password, { 
          ...otherData, 
          status: 'active' // Los creados por admin nacen activos
        });
        
        if (!result.success) throw new Error(result.error);
        setInfoMessage(`Usuario ${userData.name} creado con éxito.`);
      } else {
        // Fallback or request mode
        await addUser({ ...otherData, status: 'active' });
        setInfoMessage(`Perfil para ${userData.name} creado.`);
      }
      
      const updated = await getUsers();
      setUsersList(updated);
      // El logAction ya ocurre dentro de addUser/register si implementamos bien los servicios
      setInfoModal('success');
    } catch (e) { 
      setInfoModal('error'); 
      setInfoMessage(e.message); 
    }
  };

  const handleEditUser = async (userData) => {
    setInfoModal('loading');
    try {
      await updateUser(userData.id, userData, effectiveUser);
      const updated = await getUsers();
      setUsersList(updated);
      setInfoMessage('Usuario actualizado con éxito.');
      setInfoModal('success');
    } catch (e) {
      setInfoModal('error');
      setInfoMessage(e.message);
    }
  };

  const handleDeleteUser = async (id) => {
    setInfoModal('loading');
    try {
      await deleteUser(id, effectiveUser);
      const updated = await getUsers();
      setUsersList(updated);
      setInfoMessage('Usuario eliminado del sistema.');
      setInfoModal('success');
    } catch (e) {
      setInfoModal('error');
      setInfoMessage(e.message);
    }
  };


  return (
    <div className={`bg-stone-50 min-h-screen animate-in fade-in ${impersonatedUser ? 'pt-14' : ''}`}>
      <ImpersonationBanner />
      
      {/* Bloqueo de Seguridad Institucional */}
      {effectiveUser.status !== 'active' && effectiveUser.role !== 'superadmin' ? (
        <PendingApprovalView 
          user={effectiveUser} 
          onLogout={logout} 
        />
      ) : (
        <DashboardLayout 
          user={effectiveUser} 
          currentView={dashboardView} 
          setView={setDashboardView} 
          onLogout={logout} 
          onHome={() => router.push('/')}
        >
          {dashboardView === 'overview' && (
             <DashboardOverview 
               products={products} 
               user={effectiveUser} 
               users={usersList}
               setView={setDashboardView}
             />
          )}
          {dashboardView === 'products' && (
             <ProductManager 
               products={products} 
               setProducts={setProducts} 
               categories={categoriesData} 
               collections={collectionsData}
               user={effectiveUser} 
               users={usersList}
               setFeedback={handleFeedback}
             />
          )}
          {dashboardView === 'categories' && (
             <CategoryManager 
               categories={categoriesData} 
               onAdd={handleAddCategory} 
               onDelete={handleDeleteCategory}
             />
          )}
          {dashboardView === 'users' && effectiveUser.role === 'superadmin' && (
             <UserManager 
                users={usersList} 
                onAdd={handleAddUser}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onImpersonate={startImpersonating}
                setFeedback={handleFeedback}
                adminUser={effectiveUser}
             />
          )}
          {dashboardView === 'collections' && (
             <CollectionManager 
                collections={collectionsData}
                onAdd={addCollection}
                onUpdate={updateCollection}
                onDelete={deleteCollection}
                setFeedback={handleFeedback}
                user={effectiveUser}
             />
          )}
          {dashboardView === 'impact' && (effectiveUser.role === 'superadmin' || effectiveUser.role === 'redactor') && (
             <ImpactManager setFeedback={handleFeedback} />
          )}
          {dashboardView === 'legacy' && (effectiveUser.role === 'superadmin' || effectiveUser.role === 'redactor') && (
             <LegacyManager setFeedback={handleFeedback} />
          )}
          {dashboardView === 'audit' && effectiveUser.role === 'superadmin' && (
             <AuditLogManager />
          )}
          {dashboardView === 'profile' && (
             <ProfileManager 
                user={effectiveUser} 
                onUpdate={handleEditUser} 
                setFeedback={handleFeedback}
             />
          )}
        </DashboardLayout>
      )}

      {infoModal && (
        <InfoModal 
          type={infoModal} 
          message={infoMessage} 
          onClose={() => setInfoModal(null)} 
          onConfirm={onConfirmAction} 
          confirmText={confirmText}
          confirmColor={confirmColor}
        />
      )}
    </div>
  );
}