import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Package, TrendingUp, MessageSquare, Plus, Settings, LogOut, ChevronRight, MapPin, Edit3, Award, Eye, DollarSign } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { getProducts } from '../services/products';
import { ArtisanEvents } from '../services/analytics';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ user, onNavigate, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
    ArtisanEvents.DASHBOARD_VIEW(user.uid);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const allProducts = await getProducts();
      const filtered = allProducts.filter(p => 
        p.sellerEmail?.toLowerCase().trim() === user.email?.toLowerCase().trim()
      );
      setMyProducts(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos de métricas reales sincronizados con la lógica Web
  const metrics = useMemo(() => {
    const profileViews = user.profileViews || 0;
    const profileClicks = user.whatsappClicks || 0;
    
    const productViews = myProducts.reduce((acc, p) => acc + (p.stats?.views || 0), 0);
    const productClicks = myProducts.reduce((acc, p) => acc + (p.stats?.whatsappClicks || 0), 0);
    
    const totalViews = productViews + profileViews;
    const totalClicks = productClicks + profileClicks;
    
    const avgPrice = myProducts.length > 0 
      ? myProducts.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0) / myProducts.length 
      : 0;

    const estimatedRevenue = totalClicks * avgPrice;

    return {
      totalViews,
      totalClicks,
      estimatedRevenue,
      productCount: myProducts.length
    };
  }, [myProducts, user]);

  const renderStat = (icon, label, value, color, unit = '') => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        {React.cloneElement(icon, { color: color, size: 20 })}
      </View>
      <View>
        <Text style={styles.statValue}>{unit}{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Institucional con Perfil */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTag}>CENTRO DE CONTROL</Text>
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <LogOut size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.firstName?.charAt(0) || user.name?.charAt(0) || 'A'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>¡Hola, {user.firstName || user.name}!</Text>
              <Text style={styles.brandName}>{user.brandName || 'Productor Independiente'}</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="rgba(255,255,255,0.6)" />
                <Text style={styles.locationText}>{user.location || 'Contumazá, Cajamarca'}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editProfileBtn} 
              onPress={() => onNavigate('EditProfile', user)}
            >
              <Edit3 size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Proyección Económica (Nueva Sección) */}
        <View style={styles.revenueCard}>
          <View style={styles.revenueInfo}>
            <Text style={styles.revenueLabel}>INTENCIÓN DE VENTA PROYECTADA</Text>
            <Text style={styles.revenueValue}>S/ {Math.round(metrics.estimatedRevenue).toLocaleString()}</Text>
            <View style={styles.revenueTrend}>
              <TrendingUp size={14} color={COLORS.success} />
              <Text style={styles.trendText}>Calculado según interés comercial</Text>
            </View>
          </View>
          <View style={styles.revenueIcon}>
            <Award size={40} color="rgba(255,255,255,0.2)" />
          </View>
        </View>

        {/* Estadísticas Cuadriculadas */}
        <View style={styles.statsGrid}>
          {renderStat(<Eye />, 'Vistos', metrics.totalViews, '#8B5CF6')}
          {renderStat(<MessageSquare />, 'Consultas', metrics.totalClicks, '#10B981')}
          {renderStat(<Package />, 'En Línea', metrics.productCount, COLORS.primary)}
        </View>

        {/* Lista de Productos con Edición */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mi Catálogo Digital</Text>
            <TouchableOpacity onPress={loadDashboardData}>
              <Text style={styles.refreshText}>Actualizar</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 40 }} />
          ) : myProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Package size={60} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>Sin productos activos</Text>
              <Text style={styles.emptyText}>Usa el botón de abajo para publicar tu primer producto.</Text>
            </View>
          ) : (
            myProducts.map(product => (
              <View key={product.id} style={styles.productCard}>
                <Image 
                  source={{ uri: product.image || (product.images && product.images[0]?.url) || 'https://via.placeholder.com/100' }} 
                  style={styles.productImg} 
                />
                <View style={styles.productInfoText}>
                  <Text style={styles.productTitle} numberOfLines={1}>{product.title}</Text>
                  <Text style={styles.productPrice}>S/ {product.price}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.stockLabel}>Stock: {product.stock || 0}</Text>
                    <View style={[styles.statusDot, { backgroundColor: (product.stock > 0 ? COLORS.success : '#EF4444') }]} />
                  </View>
                </View>
                <View style={styles.cardActions}>
                   <TouchableOpacity 
                    style={styles.editCardBtn}
                    onPress={() => {
                      ArtisanEvents.PRODUCT_EDIT_START(user.uid, product.id);
                      onNavigate('EditProduct', product);
                    }}
                   >
                     <Edit3 size={16} color={COLORS.secondary} />
                     <Text style={styles.editBtnText}>Editar</Text>
                   </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => onNavigate('NewProduct')}
          >
            <Plus color="white" size={24} />
            <Text style={styles.actionBtnText}>Publicar Nuevo Producto</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    backgroundColor: COLORS.secondary,
    paddingTop: 50,
    paddingBottom: 35,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTag: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  welcomeText: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600' },
  brandName: { color: '#fff', fontSize: 20, fontWeight: '900', marginVertical: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  editProfileBtn: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },
  logoutBtn: { padding: 5 },
  revenueCard: {
    marginHorizontal: 25,
    marginTop: -30,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  revenueInfo: { flex: 1 },
  revenueLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  revenueValue: { color: '#fff', fontSize: 32, fontWeight: '900', marginVertical: 4 },
  revenueTrend: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trendText: { color: '#fff', fontSize: 11, fontWeight: '600', opacity: 0.9 },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 25,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: { fontSize: 17, fontWeight: '900', color: '#1A1A1A' },
  statLabel: { fontSize: 9, color: '#999', fontWeight: '800', textTransform: 'uppercase' },
  section: { padding: 25 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.secondary },
  refreshText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0EFEB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  productImg: { width: 65, height: 65, borderRadius: 15, backgroundColor: '#F8F9FA' },
  productInfoText: { flex: 1, marginLeft: 15 },
  productTitle: { fontSize: 15, fontWeight: '900', color: '#1C1917' },
  productPrice: { fontSize: 17, fontWeight: '900', color: COLORS.primary, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  stockLabel: { fontSize: 11, color: '#A8A29E', fontWeight: '700' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  cardActions: { marginLeft: 10 },
  editCardBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  editBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.secondary },
  emptyContainer: { alignItems: 'center', paddingVertical: 50, opacity: 0.5 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 15 },
  emptyText: { fontSize: 12, textAlign: 'center', marginTop: 5, paddingHorizontal: 30 },
  quickActions: { paddingHorizontal: 25 },
  actionBtn: {
    backgroundColor: COLORS.secondary,
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
