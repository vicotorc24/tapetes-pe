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

export default function HomePage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeCollection, setActiveCollection] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const initData = async () => {
      try {
        const firestoreProducts = await getProducts();
        setProducts(firestoreProducts.length > 0 ? firestoreProducts : initialSeedData);
        
        const firestoreCollections = await getCollections();
        setCollectionsData(firestoreCollections);
      } catch (error) {
        console.error("Error initData:", error);
      }
    };
    initData();
  }, []);

  const handleSelectCollection = (collectionId) => {
    setActiveCategory('Todos');
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
      collections={collectionsData}
      activeCollection={activeCollection}
      onSelectCollection={handleSelectCollection}
      onViewProduct={handleViewProduct} 
      onAddToCart={addToCart}
      onExplore={() => {
        setActiveCategory('Todos');
        setActiveCollection(null);
        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
      }} 
      onCustomOrder={() => window.open(`https://wa.me/51999999999?text=Hola,%20me%20gustar%C3%ADa%20hacer%20un%20pedido%20especial.`)}
    />
  );
}