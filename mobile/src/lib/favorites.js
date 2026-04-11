import AsyncStorage from '@react-native-async-storage/async-storage';

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
    
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
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
