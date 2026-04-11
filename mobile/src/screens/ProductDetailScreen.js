import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Linking, Share, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft, MessageCircle, Share as ShareIcon, Info, Layout, Heart } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { isProductFavorite, toggleFavorite } from '../lib/favorites';
import { recordInteraction, getProducerIdByEmail } from '../services/interactions';
import ImageViewer from '../components/ImageViewer';

export default function ProductDetailScreen({ product, onNavigate }) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [viewerVisible, setViewerVisible] = React.useState(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  React.useEffect(() => {
    checkFavorite();
    
    // Track product view with ID resolution for legacy products
    const trackView = async () => {
      if (product && product.id) {
        let sid = product.sellerId;
        
        // Fallback: Si no tiene sellerId (producto antiguo), lo buscamos por email
        if (!sid && product.sellerEmail) {
          sid = await getProducerIdByEmail(product.sellerEmail);
        }
        
        recordInteraction(product.id, 'views', sid);
      }
    };
    
    trackView();
  }, []);

  const checkFavorite = async () => {
    const fav = await isProductFavorite(product.id);
    setIsFavorite(fav);
  };

  const handleToggleFavorite = async () => {
    const nowFav = await toggleFavorite(product.id);
    setIsFavorite(nowFav);
  };

  if (!product) return null;

  // Consolidar todas las imágenes en un solo array
  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || []).map(img => typeof img === 'string' ? img : img.url)
  ].filter((img, index, self) => self.indexOf(img) === index); // Eliminar duplicados

  const handleWhatsApp = () => {
    const phoneNumber = '51908513551';
    const message = `¡Hola! Me interesa este tesoro de Contumazá: *${product.title}* (S/ ${product.price}). ¿Podrían darme más información?`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url).then(async (supported) => {
      // Track WhatsApp click with ID resolution
      if (product && product.id) {
        let sid = product.sellerId;
        if (!sid && product.sellerEmail) {
          sid = await getProducerIdByEmail(product.sellerEmail);
        }
        recordInteraction(product.id, 'whatsappClicks', sid);
      }

      if (supported) {
        Linking.openURL(url);
      } else {
        // Fallback para navegador si no tiene app instalada
        Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
      }
    });
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / Dimensions.get('window').width);
    setActiveImageIndex(index);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mira esta increíble pieza artesanal de Contumazá: ${product.title}. ¡Cómpralo en Made In Contumazá!`,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header flotante */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Catalog')} style={styles.roundBtn}>
          <ArrowLeft color="#1A1A1A" size={24} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleToggleFavorite} style={[styles.roundBtn, { marginRight: 10 }]}>
            <Heart
              color={isFavorite ? '#FF4444' : '#1A1A1A'}
              fill={isFavorite ? '#FF4444' : 'transparent'}
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.roundBtn}>
            <ShareIcon color="#1A1A1A" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FlatList
            data={allImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setActiveImageIndex(index);
                  setViewerVisible(true);
                }}
              >
                <Image source={{ uri: item }} style={styles.mainImage} />
              </TouchableOpacity>
            )}
          />

          {allImages.length > 1 && (
            <View style={styles.paginationDots}>
              {allImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeImageIndex === index && styles.activeDot
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Text style={styles.category}>{product.category || 'Artesanía'}</Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>ID: {product.id.slice(-4).toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>S/ {product.price}</Text>

          <View style={styles.divider} />

          {/* Beneficios Rápidos */}
          <View style={styles.benefitsRow}>
            <View style={styles.benefit}>
              <View style={styles.benefitIcon}><Layout color={COLORS.primary} size={20} /></View>
              <Text style={styles.benefitText}>Identidad Viva</Text>
            </View>
            <View style={styles.benefit}>
              <View style={styles.benefitIcon}><Info color={COLORS.secondary} size={20} /></View>
              <Text style={styles.benefitText}>Envío a todo Perú</Text>
            </View>
          </View>

          <Text style={styles.descriptionTitle}>Sobre esta pieza</Text>
          <Text style={styles.description}>
            {product.description || 'Esta es una pieza única elaborada por maestros artesanos de Contumazá. Cada detalle refleja siglos de tradición y cultura viva.'}
          </Text>

          {/* Información del Vendedor */}
          <View style={styles.sellerSection}>
            <Text style={styles.sellerTitle}>Artesano Responsable</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.avatarText}>{product.sellerName?.charAt(0) || 'A'}</Text>
              </View>
              <View>
                <Text style={styles.sellerName}>{product.sellerName || 'Maestro Artesano'}</Text>
                <Text style={styles.sellerStatus}>Verificado • Contumazá</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Botón Flotante Acción Principal */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
          <MessageCircle color="white" size={24} />
          <Text style={styles.whatsappText}>CONSULTAR PRODUCTO</Text>
        </TouchableOpacity>
      </View>

      <ImageViewer
        visible={viewerVisible}
        images={allImages}
        initialIndex={activeImageIndex}
        onClose={() => setViewerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 60, // Bajado para evitar cámaras/notch
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 45,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerRight: {
    flexDirection: 'row',
  },
  imageContainer: {
    height: 450,
    backgroundColor: '#f5f5f5',
  },
  mainImage: {
    width: Dimensions.get('window').width,
    height: 450,
  },
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  content: {
    padding: 25,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -40,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  category: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  idBadge: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  idText: {
    fontSize: 10,
    color: '#999',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  price: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 20,
  },
  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitIcon: {
    width: 35,
    height: 35,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    marginBottom: 30,
  },
  sellerSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    padding: 20,
  },
  sellerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#666',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  sellerStatus: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  whatsappBtn: {
    backgroundColor: COLORS.secondary, // Stone-900 for editorial look
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    elevation: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  whatsappText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  }
});
