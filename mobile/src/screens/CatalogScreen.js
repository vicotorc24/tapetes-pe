import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Search, X, ChevronRight, Layout, ShoppingBag, BookOpen, User, Home as HomeIcon, LucideShoppingCart } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/products';
import { getSectors } from '../services/sectors';
import { getCategories } from '../services/categories';
import { normalizeText, isSectorMatch } from '../utils/text';

const { width } = Dimensions.get('window');

const getTerritorialIcon = (secName, color = '#A8A29E') => {
  const normalizedName = (secName || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (normalizedName.includes('artesania') || normalizedName.includes('tejido')) return <ShoppingBag size={24} color={color} />;
  if (normalizedName.includes('alimento') || normalizedName.includes('agro') || normalizedName.includes('miel')) return <ShoppingBag size={24} color={color} />;
  if (normalizedName.includes('turismo') || normalizedName.includes('viaje')) return <ShoppingBag size={24} color={color} />;
  return <ShoppingBag size={24} color={color} />;
};

export default function CatalogScreen({ onNavigate }) {
  const { cart, setIsCartOpen } = useCart();
  const [products, setProducts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [activeSector, setActiveSector] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatalogData();
  }, []);

  const loadCatalogData = async () => {
    try {
      setLoading(true);
      const [prodData, sectData, catData] = await Promise.all([
        getProducts(),
        getSectors(),
        getCategories()
      ]);
      setProducts(prodData);
      setSectors(sectData);
      setCategories(catData);
    } catch (error) {
      console.error("[ERROR] Fallo al cargar catálogo dinámico:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => {
    if (!activeSector) return true;
    const activeSectorObj = sectors.find(s => s.id === activeSector || s.name === activeSector);
    return isSectorMatch(cat.sector, activeSectorObj?.id, activeSectorObj?.name);
  });

  const filteredProducts = products.filter(p => {
    if (activeSector) {
      const activeSectorObj = sectors.find(s => s.id === activeSector || s.name === activeSector);
      if (!isSectorMatch(p.sector, activeSectorObj?.id, activeSectorObj?.name)) return false;
    }
    if (activeCategory !== 'Todos') {
      if (normalizeText(p.category) !== normalizeText(activeCategory)) return false;
    }
    if (searchQuery) {
      const queryNorm = normalizeText(searchQuery);
      return (
        normalizeText(p.title).includes(queryNorm) ||
        normalizeText(p.category).includes(queryNorm) ||
        normalizeText(p.brandName).includes(queryNorm)
      );
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.searchBar}>
            <Search color={COLORS.secondary} size={20} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Buscar tesoros..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#A8A29E"
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X color={COLORS.secondary} size={20} />
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.cartHeaderBtn} 
            onPress={() => setIsCartOpen(true)}
          >
            <LucideShoppingCart color={COLORS.secondary} size={24} />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sectores Productivos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sectorList}>
            <TouchableOpacity 
              style={[styles.sectorCard, !activeSector && styles.sectorCardActive]}
              onPress={() => { setActiveSector(null); setActiveCategory('Todos'); }}
            >
              <Layout color={!activeSector ? COLORS.primary : '#A8A29E'} size={24} />
              <Text style={[styles.sectorLabel, !activeSector && styles.sectorLabelActive]}>Todos</Text>
            </TouchableOpacity>

            {sectors.map(sec => {
              const isActive = activeSector === sec.id || activeSector === sec.name;
              const colorValue = String(sec.color || '');
              const sectorColor = colorValue.startsWith('#') ? sec.color : COLORS.primary;
              
              return (
                <TouchableOpacity 
                  key={sec.id} 
                  style={[styles.sectorCard, isActive && { borderColor: sectorColor, backgroundColor: '#fff' }]}
                  onPress={() => { setActiveSector(sec.id); setActiveCategory('Todos'); }}
                >
                  <View style={[styles.iconContainer, isActive && { backgroundColor: `${sectorColor}10` }]}>
                    {getTerritorialIcon(sec.name, isActive ? sectorColor : '#A8A29E')}
                  </View>
                  <Text style={[styles.sectorLabel, isActive && { color: COLORS.secondary, fontWeight: '900' }]}>{sec.name}</Text>
                  {isActive && <View style={[styles.activeDot, { backgroundColor: sectorColor }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            <TouchableOpacity 
              style={[styles.catPill, activeCategory === 'Todos' && styles.catPillActive]}
              onPress={() => setActiveCategory('Todos')}
            >
              <Text style={[styles.catText, activeCategory === 'Todos' && styles.catTextActive]}>Todos</Text>
            </TouchableOpacity>

            {filteredCategories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.catPill, activeCategory === cat.name && styles.catPillActive]}
                onPress={() => setActiveCategory(cat.name)}
              >
                <Text style={[styles.catText, activeCategory === cat.name && styles.catTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.productsGrid}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={COLORS.primary} size="large" />
              <Text style={styles.loadingText}>Sincronizando catálogo...</Text>
            </View>
          ) : filteredProducts.length > 0 ? (
            <View style={styles.grid}>
              {filteredProducts.map(product => (
                <TouchableOpacity 
                  key={product.id} 
                  style={styles.productCard}
                  onPress={() => onNavigate('Detail', product)}
                >
                  <Image 
                    source={{ uri: product.image }} 
                    style={styles.productImage}
                    contentFit="cover"
                    transition={500}
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productBrand}>{product.brandName || 'Productor Local'}</Text>
                    <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.productPrice}>S/ {product.price}</Text>
                      <ChevronRight size={16} color={COLORS.primary} />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <ShoppingBag size={48} color="#E7E5E4" />
              <Text style={styles.emptyText}>No encontramos productos en esta búsqueda.</Text>
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { padding: 50, alignItems: 'center' },
  header: { padding: 20, paddingTop: 35 },
  searchBar: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 30, 
    paddingHorizontal: 20, 
    height: 60, 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8 
  },
  cartHeaderBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8 
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.secondary, fontWeight: '500' },
  sectionContainer: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '900', color: COLORS.secondary, marginLeft: 25, marginBottom: 15, textTransform: 'uppercase', letterSpacing: 1 },
  sectorList: { paddingLeft: 25, paddingRight: 10, gap: 12 },
  sectorCard: { width: 100, height: 120, backgroundColor: '#FAFAFA', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F5F5F4' },
  sectorCardActive: { backgroundColor: '#fff', borderColor: COLORS.primary, shadowColor: COLORS.primary, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  iconContainer: { marginBottom: 10, padding: 10, borderRadius: 12 },
  sectorLabel: { fontSize: 10, fontWeight: '700', color: '#A8A29E', textAlign: 'center' },
  sectorLabelActive: { color: COLORS.secondary, fontWeight: '900' },
  activeDot: { width: 6, height: 6, borderRadius: 3, position: 'absolute', bottom: 12 },
  categoryContainer: { marginBottom: 25 },
  categoryList: { paddingLeft: 25, paddingRight: 10, gap: 10 },
  catPill: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, backgroundColor: '#F5F5F4', borderWidth: 1, borderColor: 'transparent' },
  catPillActive: { backgroundColor: COLORS.secondary },
  catText: { fontSize: 13, fontWeight: '700', color: '#78716C' },
  catTextActive: { color: '#fff' },
  productsGrid: { paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  productCard: { width: (width - 55) / 2, backgroundColor: '#fff', borderRadius: 25, overflow: 'hidden', borderWidth: 1, borderColor: '#F5F5F4' },
  productImage: { width: '100%', height: 160 },
  productInfo: { padding: 15 },
  productBrand: { fontSize: 9, fontWeight: '900', color: COLORS.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  productTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.secondary, marginBottom: 8 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productPrice: { fontSize: 16, fontWeight: '900', color: COLORS.secondary },
  loadingText: { marginTop: 15, color: COLORS.secondary, fontWeight: '600' },
  emptyState: { padding: 80, alignItems: 'center' },
  emptyText: { marginTop: 20, textAlign: 'center', color: '#A8A29E', fontSize: 14, fontWeight: '500' }
});
