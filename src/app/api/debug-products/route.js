import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const productsRef = collection(db, 'products');
    const snap = await getDocs(productsRef);
    const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json({ 
      count: products.length,
      products: products.map(p => ({
        title: p.title,
        seller: p.sellerEmail,
        sector: p.sector,
        category: p.category,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
