import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { ShoppingBag, Heart, User, ArrowRight, Layout, Info, Award } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function HomeScreen({ onNavigate, user }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cinematic Header (Styled like Web Hero) */}
        <View style={styles.header}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContent}>
              <View>
                <View style={styles.brandBadge}>
                  <View style={styles.badgeLine} />
                  <Text style={styles.brandTitle}>MADE IN</Text>
                </View>
                <Text style={styles.brandSubtitle}>Contumazá</Text>
              </View>
              <TouchableOpacity style={styles.profileBtn} onPress={() => onNavigate(user ? 'Dashboard' : 'Login')}>
                {user ? (
                  <View style={styles.avatarMini}><Text style={styles.avatarTextMini}>{user.name?.charAt(0)}</Text></View>
                ) : (
                  <User color="white" size={24} />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
              <Text style={styles.heroText}>Tesoros únicos,{"\n"}<Text style={styles.heroItalic}>Hechos a mano</Text></Text>
              <Text style={styles.heroDesc}>Descubre la tradición viva del norte peruano en la palma de tu mano.</Text>
              
              <TouchableOpacity 
                style={styles.exploreBtn}
                onPress={() => onNavigate('Catalog')}
              >
                <Text style={styles.exploreBtnText}>Explorar Catálogo</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content Section */}
        <View style={styles.innerContent}>
          {/* Acciones Rápidas (Editorial Cards) */}
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => onNavigate('Impact')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#F0F9FF' }]}>
                <Award color={COLORS.primary} size={24} />
              </View>
              <Text style={styles.actionTag}>SOCIAL</Text>
              <Text style={styles.actionLabel}>Nuestro Impacto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => onNavigate('Favorites')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FFF1F2' }]}>
                <Heart color="#FF4444" size={24} fill="#FF4444" />
              </View>
              <Text style={styles.actionTag}>PERSONAL</Text>
              <Text style={styles.actionLabel}>Mis Favoritos</Text>
            </TouchableOpacity>
          </View>

          {/* Sección de Identidad - Similar al banner de la web */}
          <View style={styles.identityCard}>
            <View style={styles.impactHeader}>
              <Info color={COLORS.primary} size={24} />
              <Text style={styles.identityBadge}>HERENCIA VIVA</Text>
            </View>
            <Text style={styles.identityTitle}>Tierra del buen trigo y artesanía milenaria</Text>
            <Text style={styles.identityDesc}>
              Cada pieza que adquieres apoya directamente a las familias tejedoras y productores de nuestra provincia.
            </Text>
            <TouchableOpacity style={styles.learnMoreBtn} onPress={() => onNavigate('Legacy')}>
              <Text style={styles.learnMoreText}>EXPLORAR NUESTRO LEGADO</Text>
              <ArrowRight color={COLORS.primary} size={14} />
            </TouchableOpacity>
          </View>

          {/* Banner de Herencia (Acceso Directo al Legado) */}
          <View style={styles.legacyBanner}>
             <View style={styles.legacyContent}>
                <Text style={styles.legacyTag}>NIDO DE CÓNDORES</Text>
                <Text style={styles.legacyTitle}>Descubre la cuna de la intelectualidad</Text>
                <TouchableOpacity 
                  style={styles.legacyBtn}
                  onPress={() => onNavigate('Legacy')}
                >
                  <Text style={styles.legacyBtnText}>VER HISTORIA</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* Acceso Artesanos (Discreto y elegante) */}
          {!user && (
            <TouchableOpacity 
              style={styles.artisanBanner}
              onPress={() => onNavigate('Login')}
            >
              <Text style={styles.artisanText}>¿Eres un productor local? <Text style={styles.artisanLink}>Entrar al Portal</Text></Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 480,
    backgroundColor: COLORS.secondary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingHorizontal: 30,
    paddingTop: 20,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 5,
  },
  badgeLine: {
    width: 20,
    height: 1,
    backgroundColor: COLORS.primary,
  },
  brandTitle: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 4,
  },
  brandSubtitle: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: -1,
  },
  profileBtn: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarMini: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextMini: {
    color: 'white',
    fontWeight: '900',
  },
  heroSection: {
    marginTop: 50,
  },
  heroText: {
    color: '#fff',
    fontSize: 42,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  heroItalic: {
    color: COLORS.accent,
    fontWeight: '300',
    fontStyle: 'italic',
  },
  heroDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 18,
    marginTop: 20,
    lineHeight: 28,
    fontWeight: '300',
    maxWidth: '90%',
  },
  exploreBtn: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingHorizontal: 35,
    paddingVertical: 18,
    borderRadius: 50,
    marginTop: 35,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  exploreBtnText: {
    color: COLORS.secondary,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  innerContent: {
    marginTop: -50,
    paddingHorizontal: 30,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 35,
    padding: 22,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#A8A29E',
    letterSpacing: 2,
    marginBottom: 5,
  },
  actionLabel: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  identityCard: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 30,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 20,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  identityBadge: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 3,
  },
  identityTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  identityDesc: {
    color: '#666',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '300',
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  learnMoreText: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 2,
  },
  artisanBanner: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  legacyBanner: {
    marginTop: 20,
    height: 200,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  legacyContent: {
    gap: 10,
  },
  legacyTag: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 3,
  },
  legacyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    maxWidth: '80%',
  },
  legacyBtn: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  legacyBtnText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  artisanText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  artisanLink: {
    color: COLORS.primary,
    fontWeight: '900',
  }
});
