import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Package, TrendingUp, Users, Plus, Settings, LogOut, ChevronRight, MapPin } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { getProducts } from '../services/products';

export default function DashboardScreen({ user, onNavigate, onLogout }) {
  const [loading, setLoading] = useState(true);
  const [myProducts, setMyProducts] = useState([]);

  useEffect(() => {
    loadMyProducts();
  }, []);

  const loadMyProducts = async () => {
    setLoading(true);
    const allProducts = await getProducts();
    // Filtramos por el email del usuario logueado
    const filtered = allProducts.filter(p => 
      p.sellerEmail?.toLowerCase().trim() === user.email?.toLowerCase().trim()
    );
    setMyProducts(filtered);
    setLoading(false);
  };

  const renderStat = (icon, label, value, color) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        {React.cloneElement(icon, { color: color, size: 24 })}
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header con Perfil */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name?.charAt(0) || 'A'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.welcomeText}>Panel del Artesano</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={12} color="#999" />
                <Text style={styles.locationText}>Contumazá, Cajamarca</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <LogOut size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Estadísticas Rápidas */}
        <View style={styles.statsGrid}>
          {renderStat(<Package />, 'Productos', myProducts.length, COLORS.primary)}
          {renderStat(<TrendingUp />, 'Vistas', (myProducts.length * 42), COLORS.secondary)}
          {renderStat(<Users />, 'Consultas', (myProducts.length * 15), COLORS.success)}
        </View>

        {/* Mis Productos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mis Productos Publicados</Text>
            <TouchableOpacity onPress={loadMyProducts}>
              <Text style={styles.refreshText}>Actualizar</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 40 }} />
          ) : myProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Package size={60} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>Aún no tienes productos</Text>
              <Text style={styles.emptyText}>Usa el portal web para subir tus primeras creaciones artesanas.</Text>
            </View>
          ) : (
            myProducts.map(product => (
              <TouchableOpacity 
                key={product.id} 
                style={styles.productCard}
                onPress={() => onNavigate('Detail', product)}
              >
                <Image 
                  source={{ uri: product.image || (product.images && product.images[0]?.url) || 'https://via.placeholder.com/100' }} 
                  style={styles.productImg} 
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>{product.title}</Text>
                  <Text style={styles.productPrice}>S/ {product.price}</Text>
                  <View style={styles.stockRow}>
                    <Text style={styles.stockLabel}>Stock: {product.stock || 1}</Text>
                    <View style={[styles.statusDot, { backgroundColor: (product.stock > 0 ? COLORS.success : '#FF4444') }]} />
                  </View>
                </View>
                <ChevronRight size={20} color="#CCC" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Acciones Rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionBtn}>
            <Plus color="white" size={24} />
            <Text style={styles.actionBtnText}>Añadir Nuevo Producto</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.secondary, // Cinematic Stone-900
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  userRole: {
    color: COLORS.primary, // Terracotta
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '700',
  },
  section: {
    padding: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  refreshText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 2,
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  stockLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 5,
  },
  quickActions: {
    paddingHorizontal: 25,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
