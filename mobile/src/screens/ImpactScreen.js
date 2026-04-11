import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { ArrowLeft, Users, Heart, Globe, ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function ImpactScreen({ onNavigate }) {
  const impactData = [
    {
      title: "Mujeres Tejedoras",
      desc: "Empoderamos a más de 50 madres de familia, preservando la técnica milenaria del telar de pedal.",
      icon: <Users color={COLORS.primary} size={30} />,
      image: "https://images.unsplash.com/photo-1590736704177-3e11765c9f55?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Comercio Justo",
      desc: "El 100% de tu compra llega directamente a manos del artesano, sin intermediarios que inflen los precios.",
      icon: <ShieldCheck color={COLORS.secondary} size={30} />,
      image: "https://images.unsplash.com/photo-1488459739036-edc10483497e?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Identidad Viva",
      desc: "Cada patrón y color cuenta la historia de Contumazá, desde sus valles hasta sus cumbres sagradas.",
      icon: <Globe color={COLORS.accent} size={30} />,
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nuestro Impacto</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Hero */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1000&auto=format&fit=crop' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>TRADICIÓN Y PROPÓSITO</Text>
            <Text style={styles.heroTitle}>Transformando Vidas a través del Arte</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.introText}>
            En Contumazá, cada hilo es un vínculo con el pasado y una promesa para el futuro. 
            Nuestra plataforma no solo vende productos, construye puentes de desarrollo.
          </Text>

          {/* Tarjetas de Impacto */}
          {impactData.map((item, index) => (
            <View key={index} style={styles.impactCard}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <View style={styles.iconCircle}>{item.icon}</View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}

          {/* Estadísticas de Misión */}
          <View style={styles.statsSection}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>+50</Text>
              <Text style={styles.statLabel}>Artesanas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>100%</Text>
              <Text style={styles.statLabel}>Justo</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>2024</Text>
              <Text style={styles.statLabel}>Misión</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.ctaBtn}
            onPress={() => onNavigate('Catalog')}
          >
            <Text style={styles.ctaText}>Apoya a un Artesano</Text>
            <Heart color="white" size={18} fill="white" />
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: COLORS.secondary, // Stone-900 cinematic
    paddingTop: 55,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: 300,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 25,
  },
  heroTag: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },
  content: {
    padding: 25,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontStyle: 'italic',
    marginBottom: 30,
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardInfo: {
    padding: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#F8F9FA',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 10,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    padding: 25,
    marginVertical: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  ctaBtn: {
    backgroundColor: COLORS.secondary,
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 30,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  ctaText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  }
});
