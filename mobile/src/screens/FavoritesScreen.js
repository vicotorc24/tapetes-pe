import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { getProducts } from '../services/products';
import { getFavorites, toggleFavorite } from '../lib/favorites';

export default function FavoritesScreen({ onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const [allProducts, favIds] = await Promise.all([getProducts(), getFavorites()]);
    const filtered = allProducts.filter(p => favIds.includes(p.id));
    setFavoriteProducts(filtered);
    setLoading(false);
  };

  const handleRemoveFavorite = async (productId) => {
    await toggleFavorite(productId);
    setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onNavigate('Detail', item)}
    >
      <Image 
        source={{ uri: item.image || (item.images && item.images[0]?.url) || 'https://via.placeholder.com/150' }} 
        style={styles.image} 
      />
      <View style={styles.cardInfo}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>S/ {item.price}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn} 
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Heart size={20} color="#FF4444" fill="#FF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backBtn}>
          <ArrowLeft color="#1A1A1A" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Favoritos</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Heart size={50} color="#DDD" />
          </View>
          <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
          <Text style={styles.emptyText}>Explora el catálogo y guarda los tesoros que más te gusten.</Text>
          <TouchableOpacity 
            style={styles.exploreBtn}
            onPress={() => onNavigate('Catalog')}
          >
            <Text style={styles.exploreBtnText}>Ir a la Tienda</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteProducts}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 20,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  backBtn: {
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#F8F9FA',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  category: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginVertical: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  removeBtn: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#F8F9FA',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  exploreBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
