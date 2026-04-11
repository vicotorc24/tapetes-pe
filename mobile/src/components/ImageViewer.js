import React, { useRef, useEffect } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Dimensions, SafeAreaView, FlatList, Text } from 'react-native';
import { Image } from 'expo-image';
import { X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

/**
 * Visor de imágenes premium con soporte para galería (swipe)
 */
export default function ImageViewer({ visible, images = [], initialIndex = 0, onClose }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  // Sincronizar el índice inicial cuando se abre el modal
  useEffect(() => {
    if (visible && flatListRef.current) {
      // Pequeño delay para asegurar que el FlatList esté listo
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
        setCurrentIndex(initialIndex);
      }, 50);
    }
  }, [visible, initialIndex]);

  if (!images || images.length === 0) return null;

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <SafeAreaView style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.indexBadge}>
              <Text style={styles.indexText}>{currentIndex + 1} / {images.length}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="white" size={30} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: item.url || item }} 
                style={styles.image}
                contentFit="contain"
                transition={300}
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  indexBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
  },
  indexText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 10,
    marginTop: 20,
  },
  imageContainer: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height * 0.85,
  }
});
