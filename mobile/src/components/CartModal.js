import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, Modal, TouchableOpacity, 
  FlatList, SafeAreaView, Linking, Platform, ScrollView, Alert 
} from 'react-native';
import { Image } from 'expo-image';
import { LucideX, LucideTrash2, LucideShoppingBag, LucidePhone, LucideCreditCard, LucideMinus, LucidePlus } from 'lucide-react-native';
import { useCart } from '../context/CartContext';
import { COLORS } from '../theme/colors';

export function CartModal() {
  const { cart, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('whatsapp');

  const handleCheckout = (sellerName, items) => {
    if (paymentMethod === 'whatsapp') {
      const sellerPhone = items[0]?.sellerPhone || '51908513551';
      
      const text = `¡Hola *${sellerName}*! 👋 Deseo adquirir estos productos de tu catálogo en *Made In Contumazá*:\n\n` +
        items.map(i => 
          `📦 *(${i.quantity || 1}x) ${i.title}* - S/${(Number(i.price) * (i.quantity || 1)).toFixed(2)}\n` +
          `🔗 https://tapetes-pe.vercel.app/producto/${i.id}`
        ).join('\n\n') +
        ` \n\n----------------------------------\n` +
        `💳 *SUBTOTAL: S/${items.reduce((sum, i) => sum + (Number(i.price) * (i.quantity || 1)), 0).toFixed(2)}*\n\n` +
        `¿Me confirmas disponibilidad? 🙏`;
        
      const url = `whatsapp://send?phone=${sellerPhone}&text=${encodeURIComponent(text)}`;
      
      Linking.canOpenURL(url).then(supported => {
        if (supported) Linking.openURL(url);
        else Linking.openURL(`https://wa.me/${sellerPhone}?text=${encodeURIComponent(text)}`);
      });
    } else {
      alert("Redirigiendo a pasarela segura... (Simulado)");
    }
  };

  if (!isCartOpen) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isCartOpen}
      onRequestClose={() => setIsCartOpen(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <View style={styles.iconContainer}>
                <LucideShoppingBag size={20} color="#1A1A1A" />
              </View>
              <Text style={styles.headerTitle}>Tu Pedido</Text>
            </View>
            <TouchableOpacity onPress={() => setIsCartOpen(false)} style={styles.closeBtn}>
              <LucideX size={24} color="#999" />
            </TouchableOpacity>
          </View>

          {/* List grouped by Seller */}
          <ScrollView contentContainerStyle={styles.list}>
            {Object.entries(
              cart.reduce((acc, item) => {
                const seller = item.sellerName || 'Productor Local';
                if (!acc[seller]) acc[seller] = [];
                acc[seller].push(item);
                return acc;
              }, {})
            ).map(([seller, items]) => (
              <View key={seller} style={styles.sellerGroup}>
                <View style={styles.sellerHeader}>
                  <Text style={styles.sellerHeaderText}>👨‍🌾 {seller}</Text>
                </View>
                {items.map(item => (
                  <View key={item.cartId} style={styles.itemCard}>
                    <Image 
                      source={{ uri: item.image || (item.images && item.images[0]?.url) }} 
                      style={styles.itemImage} 
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.itemPrice}>S/ {item.price}</Text>
                      
                      <View style={styles.quantityContainer}>
                        <TouchableOpacity 
                          onPress={() => updateQuantity(item.cartId, -1)}
                          style={styles.qtyBtn}
                        >
                          <LucideMinus size={14} color="#666" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity || 1}</Text>
                        <TouchableOpacity 
                          onPress={() => updateQuantity(item.cartId, 1)}
                          style={styles.qtyBtn}
                        >
                          <LucidePlus size={14} color="#666" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.cartId)} style={styles.removeBtn}>
                      <LucideTrash2 size={18} color="#DDD" />
                    </TouchableOpacity>
                  </View>
                ))}
                
                {paymentMethod === 'whatsapp' && (
                  <TouchableOpacity 
                    style={styles.sellerCheckoutBtn}
                    onPress={() => handleCheckout(seller, items)}
                  >
                    <LucidePhone size={18} color="white" />
                    <Text style={styles.sellerCheckoutText}>Enviar pedido a {seller}</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {cart.length === 0 && (
              <View style={styles.empty}>
                <LucideShoppingBag size={48} color="#EEE" />
                <Text style={styles.emptyText}>Tu carrito está vacío</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          {cart.length > 0 && (
            <View style={styles.footer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Carrito</Text>
                <Text style={styles.totalValue}>S/ {cartTotal.toFixed(2)}</Text>
              </View>

              <Text style={styles.paymentLabel}>MÉTODO DE CONTACTO:</Text>
              <View style={styles.paymentGrid}>
                <TouchableOpacity 
                  onPress={() => setPaymentMethod('whatsapp')}
                  style={[styles.paymentBtn, paymentMethod === 'whatsapp' && styles.paymentBtnActive]}
                >
                  <LucidePhone size={24} color={paymentMethod === 'whatsapp' ? '#25D366' : '#999'} />
                  <Text style={[styles.paymentBtnTitle, paymentMethod === 'whatsapp' && styles.paymentBtnTitleActive]}>WhatsApp</Text>
                  <Text style={styles.paymentBtnSub}>Directo al artesano</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setPaymentMethod('card')}
                  style={[styles.paymentBtn, paymentMethod === 'card' && styles.paymentBtnActive]}
                >
                  <LucideCreditCard size={24} color={paymentMethod === 'card' ? '#1A1A1A' : '#999'} />
                  <Text style={[styles.paymentBtnTitle, paymentMethod === 'card' && styles.paymentBtnTitleActive]}>Tarjeta</Text>
                  <Text style={styles.paymentBtnSub}>Pago seguro</Text>
                </TouchableOpacity>
              </View>

              {paymentMethod === 'card' && (
                <TouchableOpacity 
                  style={[styles.checkoutBtn, { backgroundColor: '#007AFF' }]} 
                  onPress={() => Alert.alert('Pago con Tarjeta', 'Redirigiendo a pasarela segura de MercadoPago... (Funcionalidad en desarrollo)')}
                >
                  <LucideCreditCard size={20} color="white" />
                  <Text style={styles.checkoutBtnText}>Pagar Carrito Completo</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: '90%',
    padding: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  closeBtn: {
    padding: 5,
  },
  list: {
    paddingBottom: 20,
  },
  sellerGroup: {
    marginBottom: 20,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingBottom: 5,
  },
  sellerHeaderText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#991B1B', // Un rojo más elegante para el nombre del artesano
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  // ... itemImage, itemInfo, itemTitle, itemPrice ...
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: '#f9f9f9',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 10,
  },
  // ... quantityContainer, qtyBtn, qtyText ...
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    alignSelf: 'flex-start',
    padding: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  qtyText: {
    paddingHorizontal: 15,
    fontSize: 15,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  sellerCheckoutBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 18,
    gap: 8,
    marginTop: 8,
    marginHorizontal: 5,
    elevation: 2,
  },
  sellerCheckoutText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  removeBtn: {
    padding: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
    paddingBottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingHorizontal: 5,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  paymentLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#999',
    marginBottom: 15,
    letterSpacing: 1,
  },
  paymentGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 25,
  },
  paymentBtn: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    gap: 6,
  },
  paymentBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF8F6',
  },
  paymentBtnTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#999',
  },
  paymentBtnTitleActive: {
    color: COLORS.primary,
  },
  paymentBtnSub: {
    fontSize: 10,
    color: '#999',
  },
  checkoutBtn: {
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#CCC',
    marginTop: 10,
    fontSize: 16,
  }
});
