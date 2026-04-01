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
import { InfoModal } from '@/components/ui/InfoModal';
import { ImpersonationBanner } from '@/components/layout/ImpersonationBanner';

// Services
import { getProducts } from '@/lib/services/products';
import { getUsers, addUser, updateUser, deleteUser } from '@/lib/services/users';
import { getCollections, addCollection, updateCollection, deleteCollection } from '@/lib/services/collections';
import { getCategories, addCategory, deleteCategory } from '@/lib/services/categories';
import { initialUsersData } from '@/lib/data';

// Firestore Direct (for quick updates)
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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

  const setFeedback = ({type, message, onConfirm}) => {
    setInfoModal(type);
    setInfoMessage(message);
    setOnConfirmAction(() => onConfirm);
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
      setInfoModal('success');
    } catch (e) { 
      setInfoModal('error'); 
      setInfoMessage(e.message); 
    }
  };

  const handleEditUser = async (userData) => {
    setInfoModal('loading');
    try {
      await updateUser(userData.id, userData);
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
      await deleteUser(id);
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
      <DashboardLayout 
        user={effectiveUser} 
        currentView={dashboardView} 
        setView={setDashboardView} 
        onLogout={logout} 
        onHome={() => router.push('/')}
      >
        {dashboardView === 'overview' && <DashboardOverview products={products} user={effectiveUser} />}
        {dashboardView === 'products' && (
          <ProductManager 
            products={products} 
            setProducts={setProducts} 
            categories={categoriesData} 
            collections={collectionsData} 
            user={effectiveUser} 
            users={usersList}
            setFeedback={setFeedback} 
          />
        )}
        {dashboardView === 'categories' && (
          <CategoryManager 
            categories={categoriesData} 
            onAdd={handleAddCategory} 
            onUpdate={handleUpdateCategory}
            onDelete={handleDeleteCategory} 
            onReorder={handleReorderCategories}
            setFeedback={setFeedback}
          />
        )}
        {dashboardView === 'collections' && (
          <CollectionManager 
            collections={collectionsData} 
            onAdd={addCollection} 
            onEdit={updateCollection} 
            onDelete={deleteCollection} 
            setFeedback={setFeedback} 
          />
        )}
        {dashboardView === 'profile' && <ProfileManager user={effectiveUser} setFeedback={setFeedback} />}
        {dashboardView === 'legacy' && (effectiveUser.role === 'superadmin' || effectiveUser.role === 'redactor') && (
           <LegacyManager setFeedback={setFeedback} />
        )}
        {dashboardView === 'users' && effectiveUser.role === 'superadmin' && (
           <UserManager 
              users={usersList} 
              onAdd={handleAddUser} 
              onEdit={handleEditUser} 
              onDelete={handleDeleteUser} 
              onImpersonate={startImpersonating}
              setFeedback={setFeedback}
           />
        )}
      </DashboardLayout>

      {infoModal && (
        <InfoModal 
          type={infoModal} 
          message={infoMessage} 
          onClose={() => setInfoModal(null)} 
          onConfirm={onConfirmAction} 
        />
      )}
    </div>
  );
}