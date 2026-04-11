import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Share } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, Share as ShareIcon, Bookmark } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { cleanHtml } from '../utils/textUtils';

const { width } = Dimensions.get('window');

export default function LegacyDetailScreen({ item, onNavigate }) {
  if (!item) return null;

  const handleShare = async () => {
    try {
      const shareUrl = `madeincontumaza://legacy/${item.id}`;
      await Share.share({
        title: item.name,
        message: `Descubre la historia de ${item.name} (${item.role || 'Legado'}) en Made In Contumazá. Mira el detalle aquí: ${shareUrl} #NidoDeCóndores`,
        url: shareUrl 
      });
    } catch (error) {
      console.error("[ERROR] Fallo al compartir:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen Hero */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/800' }} 
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.headerOverlay}>
            <SafeAreaView>
              <View style={styles.headerActions}>
                <TouchableOpacity onPress={() => onNavigate('Legacy')} style={styles.iconBtn}>
                  <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
                      <ShareIcon color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </View>
          <View style={styles.gradient} />
        </View>

        {/* Contenido (Lectura) */}
        <View style={styles.content}>
           <View style={styles.titleSection}>
              <Text style={styles.category}>{item.category || item.role}</Text>
              <Text style={styles.title}>{item.name}</Text>
              {item.role && <Text style={styles.role}>{item.role}</Text>}
              <View style={styles.divider} />
           </View>

           <View style={styles.descriptionSection}>
              <Text style={styles.description}>
                {cleanHtml(item.description)}
              </Text>
           </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón Flotante Inferior */}
      <View style={styles.footer}>
         <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onNavigate('Legacy')}
         >
            <Text style={styles.backButtonText}>VOLVER AL LEGADO</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 450,
    width: width,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  iconBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(28, 25, 23, 0.4)', // Difuminado suave
  },
  content: {
    marginTop: -30,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  titleSection: {
    marginBottom: 30,
  },
  category: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.secondary,
    lineHeight: 42,
  },
  role: {
    fontSize: 16,
    color: '#A8A29E',
    marginTop: 5,
    fontStyle: 'italic',
  },
  divider: {
    width: 50,
    height: 3,
    backgroundColor: COLORS.primary,
    marginTop: 25,
  },
  descriptionSection: {
    paddingBottom: 40,
  },
  description: {
    fontSize: 18,
    lineHeight: 30,
    color: '#444',
    textAlign: 'justify',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  backButton: {
    backgroundColor: COLORS.secondary,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  }
});
