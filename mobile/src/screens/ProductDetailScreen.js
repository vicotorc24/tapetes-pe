import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Linking, Share, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, MessageCircle, Share as ShareIcon, Info, Layout, Heart, 
  Clock, Ruler, Box, Palette, Shield, Apple, Tags, ChevronRight 
} from 'lucide-react-native';
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
          <View style={styles.priceRowDetail}>
            <Text style={styles.price}>S/ {product.price}</Text>
            <View style={[styles.stockBadge, { backgroundColor: product.stock > 0 ? '#DCFCE7' : '#FEE2E2' }]}>
              <Text style={[styles.stockText, { color: product.stock > 0 ? '#166534' : '#991B1B' }]}>
                {product.stock > 0 ? `${product.stock} DISPONIBLES` : 'AGOTADO'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* FICHA TÉCNICA ESTILO WEB */}
          <View style={styles.specsSection}>
            <View style={styles.specHeader}>
              <Tags color={COLORS.primary} size={16} />
              <Text style={styles.specHeaderTitle}>ESPECIFICACIONES</Text>
            </View>
            
            <View style={styles.specsGrid}>
              {/* Atributos Legacy / Principales */}
              {product.materials && (
                <View style={styles.specItem}>
                  <View style={styles.specIcon}><Box size={16} color="#A8A29E" /></View>
                  <View>
                    <Text style={styles.specLabel}>MATERIAL</Text>
                    <Text style={styles.specValue}>{product.materials}</Text>
                  </View>
                </View>
              )}
              {product.technique && (
                <View style={styles.specItem}>
                  <View style={styles.specIcon}><Palette size={16} color="#A8A29E" /></View>
                  <View>
                    <Text style={styles.specLabel}>TÉCNICA</Text>
                    <Text style={styles.specValue}>{product.technique}</Text>
                  </View>
                </View>
              )}
              {product.dimensions && (
                <View style={styles.specItem}>
                  <View style={styles.specIcon}><Ruler size={16} color="#A8A29E" /></View>
                  <View>
                    <Text style={styles.specLabel}>TAMAÑO / DIMENSIONES</Text>
                    <Text style={styles.specValue}>{product.dimensions}</Text>
                  </View>
                </View>
              )}
              {product.weight && (
                <View style={styles.specItem}>
                  <View style={styles.specIcon}><Box size={16} color="#A8A29E" /></View>
                  <View>
                    <Text style={styles.specLabel}>PESO / CONTENIDO</Text>
                    <Text style={styles.specValue}>{product.weight}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Sección Agro / Alimentos */}
            {(product.ingredients || product.registroSanitario) && (
              <View style={styles.agroSpecs}>
                {product.ingredients && (
                  <View style={styles.agroItem}>
                    <View style={[styles.specIcon, { backgroundColor: '#FFF7ED' }]}><Apple size={16} color="#EA580C" /></View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.specLabel, { color: '#C2410C' }]}>INGREDIENTES / INSUMOS</Text>
                      <Text style={styles.agroValue}>{product.ingredients}</Text>
                    </View>
                  </View>
                )}
                {product.registroSanitario && (
                  <View style={styles.registryBadge}>
                    <Shield size={14} color="#0369A1" />
                    <Text style={styles.registryText}>REGISTRO SANITARIO: {product.registroSanitario}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Días de Labor */}
            {product.laborDays && (
              <View style={styles.laborCard}>
                <Clock size={20} color="#EA580C" />
                <View>
                  <Text style={styles.laborLabel}>DÍAS DE TRABAJO MANUAL</Text>
                  <Text style={styles.laborValue}>{product.laborDays} días de dedicación artesanal</Text>
                </View>
              </View>
            )}
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
              <View style={{ flex: 1 }}>
                <Text style={styles.sellerName}>{product.sellerName || 'Maestro Artesano'}</Text>
                <Text style={styles.sellerStatus}>Verificado • Contumazá</Text>
              </View>
            </View>
            {product.sellerBio && (
              <Text style={styles.sellerBio} numberOfLines={4}>{product.sellerBio}</Text>
            )}
            <TouchableOpacity style={styles.viewProfileRow}>
              <Text style={styles.viewProfileText}>CONOCER MÁS DEL AUTOR</Text>
              <ChevronRight size={14} color={COLORS.primary} />
            </TouchableOpacity>
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
  priceRowDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  specsSection: {
    backgroundColor: '#FAFAFA',
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  specHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  specHeaderTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 2,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  specItem: {
    width: '45%',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  specIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#A8A29E',
    letterSpacing: 1,
    marginBottom: 2,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.secondary,
  },
  agroSpecs: {
    marginTop: 10,
    gap: 12,
  },
  agroItem: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  agroValue: {
    fontSize: 13,
    color: '#57534E',
    lineHeight: 18,
    fontWeight: '500',
  },
  registryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  registryText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#0369A1',
    letterSpacing: 0.5,
  },
  laborCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF7ED',
    padding: 15,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  laborLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#C2410C',
    letterSpacing: 1,
  },
  laborValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7C2D12',
  },
  sellerBio: {
    fontSize: 13,
    color: '#78716C',
    lineHeight: 20,
    marginTop: 15,
    fontStyle: 'italic',
  },
  viewProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewProfileText: {
    fontSize: 9,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
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
