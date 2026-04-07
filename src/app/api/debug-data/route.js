import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const sectorsSnapshot = await getDocs(collection(db, 'sectors'));
    
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      sector: doc.data().sector,
      category: doc.data().category
    }));

    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      sector: doc.data().sector
    }));
    
    const sectors = sectorsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    
    return NextResponse.json({ 
      timestamp: new Date().toISOString(),
      productsCount: products.length,
      categoriesCount: categories.length,
      sectorsCount: sectors.length,
      availableSectors: sectors,
      sampleCategories: categories.slice(0, 30),
      sampleProducts: products.slice(0, 50)
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
