import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Linking, Share, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { 
  ArrowLeft, MessageCircle, Share as ShareIcon, Info, Layout, Heart, 
  Clock, Ruler, Box, Palette, Shield, Apple, Tags, ChevronRight, LucideShoppingCart 
} from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { isProductFavorite, toggleFavorite } from '../lib/favorites';
import { recordInteraction, getProducerIdByEmail } from '../services/interactions';
import ImageViewer from '../components/ImageViewer';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ product, onNavigate }) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [viewerVisible, setViewerVisible] = React.useState(false);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const { cart, addToCart, setIsCartOpen } = useCart();

  React.useEffect(() => {
    checkFavorite();
    const trackView = async () => {
      if (product && product.id) {
        let sid = product.sellerId;
        if (!sid && product.sellerEmail) {
          sid = await getProducerIdByEmail(product.sellerEmail);
        }
        recordInteraction(product.id, 'views', sid);
      }
    };
    trackView();
  }, []);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const checkFavorite = async () => {
    const fav = await isProductFavorite(product.id);
    setIsFavorite(fav);
  };

  const handleToggleFavorite = async () => {
    const nowFav = await toggleFavorite(product.id);
    setIsFavorite(nowFav);
  };

  const handleWhatsApp = () => {
    const phoneNumber = '51908513551';
    const message = `¡Hola! Me interesa este tesoro de Contumazá: *${product.title}* (S/ ${product.price}). ¿Podrían darme más información? %0A %0A Ver producto: https://tapetes-pe.vercel.app/producto/${product.id}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    Linking.canOpenURL(url).then(async (supported) => {
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
        Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`);
      }
    });
  };

  if (!product) return null;

  const allImages = [
    ...(product.image ? [product.image] : []),
    ...(product.images || []).map(img => typeof img === 'string' ? img : img.url)
  ].filter((img, index, self) => self.indexOf(img) === index);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Catalog')} style={styles.roundBtn}>
          <ArrowLeft color="#1A1A1A" size={24} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setIsCartOpen(true)} style={[styles.roundBtn, { marginRight: 10 }]}>
            <LucideShoppingCart color="#1A1A1A" size={24} />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
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

          <View style={styles.specsSection}>
            <View style={styles.specHeader}>
              <Tags color={COLORS.primary} size={16} />
              <Text style={styles.specHeaderTitle}>ESPECIFICACIONES DEL PRODUCTO</Text>
            </View>
            
            <View style={styles.specsGrid}>
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
          </View>

          <Text style={styles.descriptionTitle}>Sobre esta pieza</Text>
          <Text style={styles.description}>
            {product.description || 'Esta es una pieza única elaborada por maestros artesanos de Contumazá.'}
          </Text>

          <View style={{ height: 180 }} />
        </View>
      </ScrollView>

      {/* Footer Estilo Web Premium */}
      <View style={styles.footer}>
        <View style={styles.actionRow}>
          <View style={styles.buttonsColumn}>
            <TouchableOpacity 
              style={[styles.mainActionBtn, styles.waConsultBtn]} 
              onPress={handleWhatsApp}
            >
              <MessageCircle color="white" size={20} />
              <Text style={styles.waConsultText}>CONSULTAR POR WHATSAPP</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.mainActionBtn, styles.cartAddBtn]} 
              onPress={handleAddToCart}
            >
              <Text style={styles.cartAddText}>+ CARRITO</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favCircle}>
            <Heart
              color={isFavorite ? '#FF4444' : '#1A1A1A'}
              fill={isFavorite ? '#FF4444' : 'transparent'}
              size={24}
            />
          </TouchableOpacity>
        </View>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    position: 'absolute',
    top: 50,
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
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerRight: { flexDirection: 'row' },
  imageContainer: { height: 450, backgroundColor: '#f5f5f5' },
  mainImage: { width: width, height: 450 },
  paginationDots: { flexDirection: 'row', position: 'absolute', bottom: 60, alignSelf: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeDot: { backgroundColor: '#fff', width: 20 },
  content: { padding: 25, backgroundColor: '#fff', borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -40 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  category: { fontSize: 10, fontWeight: '900', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 3 },
  idBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  idText: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', marginBottom: 5 },
  price: { fontSize: 26, fontWeight: '900', color: COLORS.primary },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 20 },
  priceRowDetail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  stockBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  stockText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  specsSection: { backgroundColor: '#FAFAFA', borderRadius: 30, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#F3F4F6' },
  specHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  specHeaderTitle: { fontSize: 10, fontWeight: '900', color: COLORS.secondary, letterSpacing: 2 },
  specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  specItem: { width: '45%', flexDirection: 'row', gap: 10, marginBottom: 15 },
  specIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center' },
  specLabel: { fontSize: 8, fontWeight: '900', color: '#A8A29E', letterSpacing: 1, marginBottom: 2 },
  specValue: { fontSize: 13, fontWeight: '700', color: COLORS.secondary },
  descriptionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  description: { fontSize: 15, color: '#555', lineHeight: 24, marginBottom: 30 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 45, // Un poco más de espacio para la barra de Android
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  buttonsColumn: {
    flex: 1,
    gap: 12,
  },
  mainActionBtn: {
    height: 60, // Aumentado para mejor impacto
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  waConsultBtn: {
    backgroundColor: '#25D366',
  },
  cartAddBtn: {
    backgroundColor: '#1A1A1A',
  },
  waConsultText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  cartAddText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  favCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  }
});
