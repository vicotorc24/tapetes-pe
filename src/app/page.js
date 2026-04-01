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
import { CONFIG } from '../lib/config';
import { AnalyticsEvents } from '../lib/analytics';

export default function HomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCollection, setActiveCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const initData = async () => {
      try {
        const firestoreProducts = await getProducts();
        setProducts(firestoreProducts.length > 0 ? firestoreProducts : initialSeedData);
        
        const [col, cat] = await Promise.all([
          getCollections(),
          getCategories()
        ]);
        setCollectionsData(col);
        setCategoriesData(cat);
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
      collections={collectionsData}
      activeCollection={activeCollection}
      onSelectCollection={handleSelectCollection}
      onSelectCategory={setActiveCategory}
      searchTerm={searchTerm}
      onSearch={setSearchTerm}
      onViewProduct={handleViewProduct} 
      onAddToCart={(p) => {
        AnalyticsEvents.ADD_TO_CART(p);
        addToCart(p);
      }}
      onExplore={() => {
        setActiveCategory('Todos');
        setActiveCollection(null);
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      }} 
      onCustomOrder={() => window.open(`https://wa.me/${CONFIG.CONTACT.WHATSAPP.replace(/\s+/g, '')}?text=Hola,%20me%20gustar%C3%ADa%20hacer%20un%20pedido%20especial.`)}
    />
  );
}