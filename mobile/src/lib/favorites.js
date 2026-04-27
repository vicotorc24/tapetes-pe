import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const FAVORITES_KEY = '@contumaza_favorites';

export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error recuperando favoritos:', e);
    return [];
  }
};

export const toggleFavorite = async (productId) => {
  try {
    const favorites = await getFavorites();
    const isFavorite = favorites.includes(productId);
    
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter(id => id !== productId);
    } else {
      newFavorites = [...favorites, productId];
    }
    
    // Guardar localmente para rapidez
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    // Sincronizar con Firestore si el usuario está logueado
    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        favorites: isFavorite ? arrayRemove(productId) : arrayUnion(productId)
      }).catch(err => console.error('Error sincronizando favorito en Firestore:', err));
    }
    
    return !isFavorite;
  } catch (e) {
    console.error('Error alternando favorito:', e);
    return false;
  }
};

export const isProductFavorite = async (productId) => {
  const favorites = await getFavorites();
  return favorites.includes(productId);
};

export const syncFavoritesToCloud = async () => {
  if (!auth.currentUser) return;
  try {
    const favorites = await getFavorites();
    if (favorites.length === 0) return;
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    await updateDoc(userRef, {
      favorites: favorites // Sobrescribe con la lista local
    });
    console.log('Favoritos sincronizados con la nube');
  } catch (e) {
    console.error('Error sincronizando favoritos masivamente:', e);
  }
};
