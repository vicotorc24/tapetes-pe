import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, Users, Heart, Globe, ShieldCheck, Award, Handshake, TrendingUp, Sparkles, Map, Info, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { getImpactData } from '../services/impact';

const { width } = Dimensions.get('window');

// Mapeador de iconos dinámicos
const ImpactIcon = ({ name, color = COLORS.primary, size = 32 }) => {
  const icons = {
    'Handshake': Handshake,
    'HeartHandshake': Handshake,
    'TrendingUp': TrendingUp,
    'Award': Award,
    'Users': Users,
    'Globe': Globe,
    'Sparkles': Sparkles,
    'Map': Map,
    'Heart': Heart,
    'ShieldCheck': ShieldCheck
  };
  const IconComponent = icons[name] || Heart;
  return <IconComponent color={color} size={size} strokeWidth={1.5} />;
};

export default function ImpactScreen({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const impact = await getImpactData();
      setData(impact);
    } catch (error) {
      console.error("[ERROR] Fallo al cargar impacto:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Conectando con el propósito...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* HERO CINEMÁTICO */}
        <View style={styles.hero}>
          <Image 
            source={{ uri: data.hero?.backgroundImage || "https://images.unsplash.com/photo-1542332101-da79cce02298?auto=format&fit=crop&w=1200&q=80" }} 
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.heroOverlay}>
             <SafeAreaView>
               <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backBtn}>
                 <ArrowLeft color="#fff" size={24} />
               </TouchableOpacity>
             </SafeAreaView>
             
             <View style={styles.heroTextContainer}>
                <View style={styles.tagLine}>
                  <View style={styles.line} />
                  <Text style={styles.heroTag}>{data.hero?.subtitle?.toUpperCase() || "NUESTRO PROPÓSITO"}</Text>
                  <View style={styles.line} />
                </View>
                <Text style={styles.heroTitle}>
                  {(data.hero?.title || "Made In Contumazá").replace(/Tapetes\.pe/g, 'Made In Contumazá')}
                </Text>
                <Text style={styles.heroDesc}>{data.hero?.description}</Text>
             </View>
          </View>
        </View>

        {/* HISTORIA 1: El Reto */}
        <View style={styles.sectionLight}>
            <View style={styles.storyHeader}>
              <Text style={styles.storyTag}>EL RETO</Text>
              <Text style={styles.storyTitle}>{data.story1?.title}</Text>
            </View>
            
            <View style={styles.imageCardContainer}>
               <View style={styles.imageDecoration} />
               <Image source={{ uri: data.story1?.image }} style={styles.storyImage} contentFit="cover" />
            </View>

            <View style={styles.storyTextContainer}>
               <Text style={styles.storyDesc}>{data.story1?.description1}</Text>
               <View style={styles.quoteBlock}>
                  <Text style={styles.quoteText}>"{data.story1?.description2}"</Text>
               </View>
            </View>
        </View>

        {/* MÉTRICAS DE PROPÓSITO */}
        <View style={styles.statsSection}>
            <View style={styles.statsHeader}>
               <Text style={styles.statsSubtitle}>TRANSPARENCIA AUDITABLE</Text>
               <Text style={styles.statsTitle}>Métricas de Propósito</Text>
               <Text style={styles.statsDesc}>Cada cifra cuenta una historia de desarrollo sostenible.</Text>
            </View>

            <View style={styles.statsGrid}>
              {data.stats && data.stats.map((stat, idx) => (
                <View key={idx} style={styles.statCard}>
                   <View style={styles.statIconContainer}>
                      <ImpactIcon name={stat.icon} color="#fff" size={28} />
                   </View>
                   <Text style={styles.statValue}>{stat.value}</Text>
                   <View style={styles.statDivider} />
                   <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
        </View>

        {/* HISTORIA 2: La Solución */}
        <View style={styles.sectionDark}>
            <Image source={{ uri: data.story2?.image }} style={styles.wideImage} contentFit="cover" />
            <View style={styles.darkContent}>
                <Text style={styles.darkTag}>NUESTRA RESPUESTA</Text>
                <Text style={styles.darkTitle}>{data.story2?.title}</Text>
                <Text style={styles.darkDesc}>{data.story2?.description1}</Text>
                
                <View style={styles.benefitList}>
                   {["Comercio Justo Directo", "Preservación Cultural", "Capacitación Tecnológica"].map((item, i) => (
                     <View key={i} style={styles.benefitItem}>
                        <ShieldCheck color={COLORS.primary} size={20} />
                        <Text style={styles.benefitText}>{item}</Text>
                     </View>
                   ))}
                </View>
            </View>
        </View>

        {/* CALL TO ACTION FINAL */}
        <View style={styles.ctaSection}>
           <View style={styles.ctaCard}>
              <View style={styles.infoIconCircle}>
                 <Info color={COLORS.primary} size={32} />
              </View>
              <Text style={styles.ctaTitle}>¿Quieres ser parte del cambio?</Text>
              <Text style={styles.ctaDesc}>Cada compra empodera a una familia y protege una técnica milenaria que nos define.</Text>
              
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => onNavigate('Catalog')}
              >
                <Text style={styles.ctaButtonText}>APOYAR UN ARTESANO</Text>
                <ChevronRight color="white" size={20} />
              </TouchableOpacity>
           </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondary },
  loadingText: { color: '#fff', marginTop: 20, fontWeight: '900', letterSpacing: 1 },
  
  hero: { minHeight: 500, width: width },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', padding: 30, justifyContent: 'space-between' },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  heroTextContainer: { marginBottom: 40 },
  tagLine: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  line: { height: 1.5, width: 25, backgroundColor: COLORS.primary },
  heroTag: { color: COLORS.primary, fontWeight: '900', fontSize: 11, letterSpacing: 4 },
  heroTitle: { color: '#fff', fontSize: 44, fontWeight: '900', lineHeight: 48, marginBottom: 20 },
  heroDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 24, fontStyle: 'italic' },

  sectionLight: { padding: 30, backgroundColor: '#fff' },
  storyHeader: { marginBottom: 30 },
  storyTag: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 3, marginBottom: 10 },
  storyTitle: { fontSize: 32, fontWeight: '900', color: COLORS.secondary, lineHeight: 36 },
  imageCardContainer: { marginVertical: 20 },
  imageDecoration: { position: 'absolute', top: 20, left: 20, right: -20, bottom: -20, backgroundColor: '#F5F5F4', borderRadius: 40, transform: [{rotate: '3deg'}] },
  storyImage: { width: '100%', height: 400, borderRadius: 40, borderWidth: 8, borderColor: '#fff' },
  storyTextContainer: { marginTop: 30 },
  storyDesc: { fontSize: 17, color: '#57534E', lineHeight: 28, fontWeight: '300' },
  quoteBlock: { marginTop: 25, padding: 25, backgroundColor: '#F8F9FA', borderLeftWidth: 4, borderLeftColor: COLORS.primary, borderRadius: 20 },
  quoteText: { fontSize: 16, fontStyle: 'italic', color: COLORS.secondary, lineHeight: 24, fontFamily: 'serif' },

  statsSection: { padding: 35, backgroundColor: COLORS.secondary }, // Stone-900 background
  statsHeader: { alignItems: 'center', marginBottom: 50 },
  statsSubtitle: { color: COLORS.primary, fontSize: 10, fontWeight: '900', letterSpacing: 4, marginBottom: 15 },
  statsTitle: { color: '#fff', fontSize: 36, fontWeight: '900', textAlign: 'center' },
  statsDesc: { color: '#A8A29E', fontSize: 14, textAlign: 'center', marginTop: 10, fontWeight: '300' },
  statsGrid: { gap: 20 },
  statCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 35, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  statIconContainer: { width: 60, height: 60, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  statValue: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: -1 },
  statDivider: { height: 3, width: 30, backgroundColor: COLORS.primary, marginVertical: 15, borderRadius: 2 },
  statLabel: { color: '#A8A29E', fontSize: 10, fontWeight: '900', letterSpacing: 2, textAlign: 'center', textTransform: 'uppercase' },

  sectionDark: { backgroundColor: '#1C1917' },
  wideImage: { width: '100%', height: 250 },
  darkContent: { padding: 35 },
  darkTag: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 3, marginBottom: 10 },
  darkTitle: { fontSize: 32, fontWeight: '900', color: '#fff', lineHeight: 36, marginBottom: 20 },
  darkDesc: { fontSize: 16, color: '#A8A29E', lineHeight: 26, fontWeight: '300', marginBottom: 25 },
  benefitList: { gap: 15 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  ctaSection: { padding: 25, backgroundColor: '#F5F5F4' },
  ctaCard: { backgroundColor: '#fff', borderRadius: 40, padding: 40, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  infoIconCircle: { width: 64, height: 64, backgroundColor: '#FEF2F2', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  ctaTitle: { fontSize: 28, fontWeight: '900', color: COLORS.secondary, textAlign: 'center', lineHeight: 32 },
  ctaDesc: { fontSize: 15, color: '#78716C', textAlign: 'center', marginTop: 15, marginBottom: 30, lineHeight: 22, fontWeight: '300' },
  ctaButton: { backgroundColor: COLORS.secondary, height: 65, paddingHorizontal: 30, borderRadius: 32.5, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, width: '100%' },
  ctaButtonText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 2 }
});
