import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, BookOpen, Layout, User, Feather, Mountain, History as HistoryIcon } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { getPersonalities } from '../services/personalities';
import { cleanHtml } from '../utils/textUtils';

const { width } = Dimensions.get('window');

export default function LegacyScreen({ onNavigate }) {
  const [personalities, setPersonalities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getPersonalities();
      setPersonalities(data || []);
    } catch (error) {
      console.error("[ERROR] Fallo al cargar herencia:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupedData = personalities.reduce((acc, item) => {
    const category = item.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const getIconForCategory = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('poeta') || cat.includes('ilustre') || cat.includes('hijo')) return <User size={20} color={COLORS.primary} />;
    if (cat.includes('turismo') || cat.includes('sitio') || cat.includes('lugar')) return <Layout size={20} color={COLORS.primary} />;
    if (cat.includes('historia')) return <HistoryIcon size={20} color={COLORS.primary} />;
    if (cat.includes('festival') || cat.includes('tradicion')) return <Feather size={20} color={COLORS.primary} />;
    return <Mountain size={20} color={COLORS.primary} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Conectando con la historia...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backBtn}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.hero}>
            <Image 
              source={{ uri: personalities.find(p => p.isPromoted)?.image || "https://images.unsplash.com/photo-1542332101-da79cce02298?auto=format&fit=crop&w=800&q=80" }} 
              style={styles.heroImage}
              contentFit="cover"
            />
            <View style={styles.heroOverlay}>
               <Text style={styles.heroSubtitle}>HERENCIA Y TRADICIÓN</Text>
               <Text style={styles.heroTitle}>Nido de Cóndores</Text>
               <View style={styles.line} />
               <Text style={styles.heroDesc}>
                 Descubre el alma de Contumazá a través de sus hijos ilustres y su historia milenaria.
               </Text>
            </View>
          </View>

          <View style={styles.content}>
            {Object.keys(groupedData).map((category) => (
              <View key={category} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.iconCircle}>{getIconForCategory(category)}</View>
                  <Text style={styles.sectionTitle}>{category}</Text>
                </View>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardList}
                >
                  {groupedData[category].map((item, idx) => (
                    <TouchableOpacity 
                      key={item.id || idx} 
                      style={styles.card}
                      activeOpacity={0.9}
                      onPress={() => onNavigate('LegacyDetail', item)}
                    >
                      {item.image && (
                        <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" transition={500} />
                      )}
                      <Text style={styles.cardRole}>{item.role || category}</Text>
                      <Text style={styles.cardName}>{item.name}</Text>
                      <Text style={styles.cardDesc} numberOfLines={3}>
                         {cleanHtml(item.description) || "Sin descripción disponible."}
                      </Text>
                      <View style={styles.readMore}>
                         <Text style={styles.readMoreText}>LEER HISTORIA</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}

            <View style={styles.identityBanner}>
               <BookOpen color={COLORS.primary} size={32} />
               <Text style={styles.identityTitle}>Cuna de la intelectualidad</Text>
               <Text style={styles.identityText}>
                 Cada rincón de nuestra provincia guarda una historia de resistencia y arte que ha pasado de generación en generación.
               </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondary },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.secondary },
  loadingText: { color: '#fff', marginTop: 20, fontWeight: 'bold', letterSpacing: 1 },
  header: { position: 'absolute', top: 60, left: 20, zIndex: 10 },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  hero: { minHeight: 400, width: width },
  heroImage: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  heroOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, backgroundColor: 'rgba(28, 25, 23, 0.4)' },
  heroSubtitle: { fontSize: 10, fontWeight: '900', color: COLORS.primary, letterSpacing: 4, marginBottom: 10 },
  heroTitle: { fontSize: 48, fontWeight: 'bold', color: '#fff', textAlign: 'center', lineHeight: 52 },
  line: { width: 40, height: 3, backgroundColor: COLORS.primary, marginVertical: 25 },
  heroDesc: { fontSize: 16, color: '#E7E5E4', textAlign: 'center', lineHeight: 24, fontWeight: '300' },
  content: { marginTop: -40, backgroundColor: COLORS.background, borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingTop: 40 },
  section: { marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginBottom: 20, gap: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFF7ED', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FFEDD5' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: COLORS.secondary, letterSpacing: 1, textTransform: 'uppercase' },
  cardList: { paddingLeft: 25, paddingRight: 10, gap: 15 },
  card: { width: 280, backgroundColor: '#fff', borderRadius: 30, padding: 0, borderWidth: 1, borderColor: '#F5F5F4', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3, overflow: 'hidden' },
  cardImage: { width: '100%', height: 160 },
  cardRole: { fontSize: 9, fontWeight: '900', color: COLORS.primary, letterSpacing: 2, marginHorizontal: 20, marginTop: 15, textTransform: 'uppercase' },
  cardName: { fontSize: 20, fontWeight: 'bold', color: COLORS.secondary, marginHorizontal: 20, marginTop: 5 },
  cardDesc: { fontSize: 13, color: '#57534e', lineHeight: 18, fontWeight: '400', marginHorizontal: 20, marginVertical: 15 },
  readMore: { marginHorizontal: 20, marginBottom: 20, alignSelf: 'flex-start', borderBottomWidth: 1.5, borderBottomColor: COLORS.primary, paddingBottom: 2 },
  readMoreText: { fontSize: 9, fontWeight: '900', color: COLORS.primary, letterSpacing: 1 },
  identityBanner: { marginHorizontal: 25, marginTop: 20, padding: 35, backgroundColor: '#1c1917', borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  identityTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 20, marginBottom: 15 },
  identityText: { fontSize: 14, color: '#A8A29E', textAlign: 'center', lineHeight: 22 }
});
