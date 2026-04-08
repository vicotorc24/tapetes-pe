"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Context & Data
import { useCart } from '../context/CartContext';
import { initialSeedData } from '../lib/data';

// Components
import { HomeView } from '../components/home/HomeView';

// Services
import { getProducts } from '../lib/services/products';
import { getCollections } from '../lib/services/collections';
import { getCategories } from '../lib/services/categories';
import { getSectors } from '../lib/services/sectors';
import { getUsers } from '../lib/services/users';
import { CONFIG } from '../lib/config';
import { AnalyticsEvents } from '../lib/analytics';

export default function HomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [sectorsData, setSectorsData] = useState([]);
  const [brandsData, setBrandsData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCollection, setActiveCollection] = useState(null);
  const [activeSector, setActiveSector] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const initData = async () => {
      try {
        const firestoreProducts = await getProducts();
        setProducts(firestoreProducts.length > 0 ? firestoreProducts : initialSeedData);
        
        const [col, cat, sec, users] = await Promise.all([
          getCollections(),
          getCategories(),
          getSectors(),
          getUsers('active')
        ]);
        setCollectionsData(col);
        setCategoriesData(cat);
        setSectorsData(sec);
        // Filtrar marcas reales para el showcase
        const brands = (users || []).filter(u => u.brandName && (u.role === 'seller' || u.role === 'artisan'));
        setBrandsData(brands);
      } catch (error) {
        console.error("Error initData:", error);
      }
    };
    initData();
  }, []);

  // Tracking de Búsqueda y Filtros
  useEffect(() => {
    if (searchTerm.length > 2) {
      const timer = setTimeout(() => {
        AnalyticsEvents.SEARCH(searchTerm);
      }, 1500); // Debounce para no saturar GA
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (activeCategory !== 'Todos' || activeCollection) {
      AnalyticsEvents.FILTER(activeCategory, activeCollection);
    }
  }, [activeCategory, activeCollection]);

  const handleSelectCollection = (collectionId) => {
    // Solo resetear categoría si realmente estamos seleccionando una colección
    if (collectionId) {
       setActiveCategory('Todos');
    }
    setActiveCollection(collectionId);
    setTimeout(() => { document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' }); }, 100); 
  };

  const handleViewProduct = (p) => {
    router.push(`/producto/${p.id}`);
  };

  return (
    <HomeView 
      products={products} 
      activeCategory={activeCategory}
      categories={categoriesData}
      sectors={sectorsData}
      brands={brandsData}
      activeSector={activeSector}
      onSelectCategory={setActiveCategory}
      onSelectSector={setActiveSector}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      onViewProduct={handleViewProduct} 
      onAddToCart={(p) => {
        AnalyticsEvents.ADD_TO_CART(p);
        addToCart(p);
      }}
      onExplore={() => {
        setActiveCategory('Todos');
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      }} 
      onCustomOrder={() => window.open(`https://wa.me/${CONFIG.CONTACT.WHATSAPP.replace(/\s+/g, '')}?text=Hola,%20me%20gustar%C3%ADa%20hacer%20un%20pedido%20especial.`)}
    />
  );
}