import { db } from './src/lib/firebase.js';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

async function addHoneyProduct() {
  try {
    // 1. Ensure the 'food' sector exists or get its ID
    const sectorsRef = collection(db, 'sectors');
    const qSec = query(sectorsRef, where('id', '==', 'food'));
    const secSnap = await getDocs(qSec);
    
    // 2. Create Category "Miel y Derivados"
    const catRef = collection(db, 'categories');
    const qCat = query(catRef, where('name', '==', 'Miel y Derivados'));
    const catSnap = await getDocs(qCat);
    
    let categoryName = "Miel y Derivados";
    if (catSnap.empty) {
      await addDoc(catRef, {
        name: categoryName,
        description: "Miel pura de abeja, polen y derivados apícolas de la provincia de Contumazá.",
        sector: "food",
        order: 10,
        createdAt: new Date().toISOString()
      });
      console.log("Categoría 'Miel y Derivados' creada.");
    }

    // 3. Create Product
    const productsRef = collection(db, 'products');
    const honeyProduct = {
      title: "Miel de Abeja Castillo - 100% Pura",
      price: 25.0,
      description: "Miel de abeja 100% natural, sin aditivos ni preservantes. Cosechada en el distrito de Guzmango, Contumazá. Producto de Apicultura Sin Fronteras.",
      category: categoryName,
      sector: "food",
      weight: "500 gr.",
      stock: 20,
      sellerName: "Apicultura Sin Fronteras",
      sellerEmail: "admin@madeincontumaza.pe", // Placeholder or from info
      location: "Guzmango, Contumazá",
      harvestDate: "2026-03-15",
      isPromoted: true,
      image: "", // We can use the screenshot path if we rotate it, but for now placeholder
      createdAt: new Date().toISOString()
    };

    await addDoc(productsRef, honeyProduct);
    console.log("Producto 'Miel de Abeja Castillo' creado exitosamente.");

  } catch (error) {
    console.error("Error al crear producto:", error);
  }
}

addHoneyProduct();
