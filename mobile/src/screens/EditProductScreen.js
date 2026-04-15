import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Switch } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Package, Tag, DollarSign, List, Briefcase, Save, ArrowLeft, Crown, History, Layers, Info, Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { updateProduct } from '../services/products';
import { uploadImage } from '../services/storage';
import { ArtisanEvents } from '../services/analytics';
import { getCategories } from '../services/categories';
import { getSectors } from '../services/sectors';

const STITCH_OPTIONS = [
  'Punto Jersey', 'Punto Santa Clara', 'Punto Arroz', 'Punto Piña', 
  'Punto Garbanzo', 'Punto Salomón', 'Punto Abanico', 'Punto Cruzado', 
  'Punto de Nieve', 'Punto Inglés', 'Trenza', 'Punto Calado', 'Punto Panal'
];

export default function EditProductScreen({ product, onNavigate, onSaveSuccess }) {
  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // --- Estados del Formulario (Null-Safe) ---
  const [title, setTitle] = useState((product && product.title) || '');
  const [price, setPrice] = useState((product && product.price) ? product.price.toString() : '');
  const [description, setDescription] = useState((product && product.description) || '');
  const [stock, setStock] = useState((product && product.stock) ? product.stock.toString() : '1');
  const [category, setCategory] = useState((product && product.category) || '');
  const [sectorId, setSectorId] = useState((product && product.sector) || '');
  const [isPromoted, setIsPromoted] = useState(!!(product && product.isPromoted));
  
  // --- Gestión de Imágenes (Múltiples Fotos) ---
  const initialImages = useMemo(() => {
    if (product && Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map(img => (typeof img === 'string' ? img : img.url));
    }
    return (product && product.image) ? [product.image] : [];
  }, [product]);

  const [imageList, setImageList] = useState(initialImages);
  const [removedImages, setRemovedImages] = useState([]);
  const [newImages, setNewImages] = useState([]); // Almacena URIs locales para subir
 
  // Campos Legacy (Compatibilidad)
  const [materials, setMaterials] = useState((product && product.materials) || '');
  const [technique, setTechnique] = useState((product && product.technique) || '');
  const [dimensions, setDimensions] = useState((product && product.dimensions) || '');
  const [stitchType, setStitchType] = useState((product && Array.isArray(product.stitchType)) ? product.stitchType : []);
  
  // Campos Agro Legacy
  const [weight, setWeight] = useState((product && product.weight) || '');
 
  // --- Campos Dinámicos (Atributos) ---
  const [attributes, setAttributes] = useState((product && product.attributes) || {});

  // Metadata
  const [loading, setLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allSectors, setAllSectors] = useState([]);

  useEffect(() => {
    loadMetaData();
  }, []);

  const loadMetaData = async () => {
    const [cats, secs] = await Promise.all([getCategories(), getSectors()]);
    setAllCategories(cats);
    setAllSectors(secs);
  };

  // Sector Actual Seleccionado
  const currentSector = useMemo(() => {
    return allSectors.find(s => s.id === sectorId);
  }, [allSectors, sectorId]);

  const filteredCategories = useMemo(() => {
    if (!sectorId) return [];
    return allCategories.filter(c => !c.sector || c.sector === sectorId);
  }, [allCategories, sectorId]);

  // Manejo de Atributos Dinámicos
  // Seleccionar Imagen (Cámara o Galería)
  const pickImage = async (useCamera = false) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync() 
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permisos necesarios", "Se requiere acceso a la cámara o galería para subir fotos.");
      return;
    }

    const result = useCamera 
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 });

    if (!result.canceled) {
      const newUri = result.assets[0].uri;
      setNewImages(prev => [...prev, newUri]);
      setImageList(prev => [...prev, newUri]);
      ArtisanEvents.PHOTO_UPLOAD(product.sellerId || '', 'product_edit_add');
    }
  };

  const removePhoto = (uri, index) => {
    setImageList(prev => prev.filter((_, i) => i !== index));
    if (newImages.includes(uri)) {
      setNewImages(prev => prev.filter(item => item !== uri));
    } else {
      setRemovedImages(prev => [...prev, uri]);
    }
  };

  const handleUpdateAttribute = (label, value) => {
    setAttributes(prev => ({
      ...prev,
      [label]: value
    }));
  };

  const toggleStitch = (stitch) => {
    setStitchType(prev => 
      prev.includes(stitch) ? prev.filter(s => s !== stitch) : [...prev, stitch]
    );
  };

  const handleSave = async () => {
    if (!title || !price || !sectorId) {
      Alert.alert('Incompleto', 'El Título, Precio y Rubro son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      
      // Subir solo las imágenes nuevas
      const uploadedUrls = await Promise.all(
        newImages.map(uri => uploadImage(uri, 'products'))
      );

      // Filtrar las imágenes eliminadas de las originales y añadir las nuevas subidas
      const finalImages = imageList
        .filter(img => !newImages.includes(img)) // Mantener las originales que no borramos
        .concat(uploadedUrls);

      const payload = {
        title,
        price: parseFloat(price),
        description,
        stock: parseInt(stock),
        category,
        sector: sectorId,
        isPromoted,
        attributes,
        image: finalImages[0] || '', // Imagen principal (primera de la lista)
        images: finalImages,
        materials,
        technique,
        dimensions,
        stitchType,
        weight
      };
      
      await updateProduct(product.id, payload);
      ArtisanEvents.PRODUCT_UPDATED(product.sellerId || '', product.id);
      Alert.alert('¡Éxito!', 'Producto actualizado correctamente.');
      onSaveSuccess();
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const renderLabel = (text) => <Text style={styles.label}>{text}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={styles.backBtn}>
            <ArrowLeft color={COLORS.secondary} size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Refinar Producto</Text>
            <Text style={styles.subtitle}>Gestión dinámica de inventario para el catálogo oficial.</Text>
          </View>

          {/* Gestión de Galería de Fotos */}
          <View style={styles.gallerySection}>
            <View style={styles.cardHeader}>
              <Camera size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Galería de Fotos ({imageList.length})</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
               {imageList.map((uri, index) => (
                 <View key={index} style={styles.galleryItem}>
                    <Image source={{ uri }} style={styles.galleryImage} contentFit="cover" />
                    <TouchableOpacity 
                      style={styles.deletePhotoBtn} 
                      onPress={() => removePhoto(uri, index)}
                    >
                      <X color="#fff" size={14} />
                    </TouchableOpacity>
                    {index === 0 && (
                      <View style={styles.mainPhotoBadge}>
                        <Text style={styles.mainPhotoText}>PRINCIPAL</Text>
                      </View>
                    )}
                 </View>
               ))}
               
               <View style={styles.addPhotoActions}>
                  <TouchableOpacity style={styles.addPhotoBtn} onPress={() => pickImage(true)}>
                    <Camera color={COLORS.primary} size={22} />
                    <Text style={styles.addPhotoText}>Cámara</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addPhotoBtn} onPress={() => pickImage(false)}>
                    <ImageIcon color={COLORS.secondary} size={22} />
                    <Text style={styles.addPhotoText}>Galería</Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
          </View>

          {/* 1. Información General */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Package size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Base de Datos</Text>
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Nombre de la Obra')}
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Tapete de Contumazá" />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1.5 }]}>
                {renderLabel('Precio (S/)')}
                <View style={styles.inputIconWrapper}>
                  <DollarSign size={16} color="#999" />
                  <TextInput style={styles.flexInput} value={price} onChangeText={setPrice} keyboardType="numeric" />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                {renderLabel('Stock')}
                <TextInput style={styles.input} value={stock} onChangeText={setStock} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Descripción')}
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={description} 
                onChangeText={setDescription} 
                multiline 
                placeholder="Detalle los materiales y el origen..." 
              />
            </View>
          </View>

          {/* 2. Configuración de Rubro y Categoría */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Layers size={16} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Clasificación Territorial</Text>
            </View>

            {renderLabel('Sector Productivo')}
            <View style={styles.chipsWrapper}>
              {allSectors.map(sec => (
                <TouchableOpacity 
                  key={sec.id} 
                  onPress={() => setSectorId(sec.id)}
                  style={[styles.bigChip, sectorId === sec.id && styles.bigChipActive]}
                >
                  <Text style={[styles.bigChipText, sectorId === sec.id && styles.bigChipTextActive]}>
                    {sec.icon} {sec.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              {renderLabel('Categoría del Sector')}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.miniChipsRow}>
                {filteredCategories.map(cat => (
                  <TouchableOpacity 
                    key={cat.id} 
                    onPress={() => setCategory(cat.name)}
                    style={[styles.miniChip, category === cat.name && styles.miniChipActive]}
                  >
                    <Text style={[styles.miniChipText, category === cat.name && styles.miniChipTextActive]}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* 3. Campos Dinámicos (Esquema de la Web) */}
          {currentSector && currentSector.fields && currentSector.fields.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Info size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Atributos de {currentSector.name}</Text>
              </View>

              {currentSector.fields.map(field => (
                <View key={field.id} style={styles.inputGroup}>
                  {renderLabel(field.label)}
                  {field.type === 'textarea' ? (
                    <TextInput 
                      style={[styles.input, styles.textArea]}
                      value={attributes[field.label] || ''}
                      onChangeText={val => handleUpdateAttribute(field.label, val)}
                      multiline
                      placeholder="Escriba aquí..."
                    />
                  ) : field.type === 'checkbox' ? (
                    <View style={styles.switchWrapper}>
                      <Text style={styles.switchLabel}>¿Incluye {field.label.toLowerCase()}?</Text>
                      <Switch 
                        value={attributes[field.label] || false}
                        onValueChange={val => handleUpdateAttribute(field.label, val)}
                        trackColor={{ true: COLORS.primary }}
                      />
                    </View>
                  ) : (
                    <TextInput 
                      style={styles.input}
                      value={attributes[field.label] || ''}
                      onChangeText={val => handleUpdateAttribute(field.label, val)}
                      placeholder={field.label}
                      keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                    />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* 4. Campos Legacy Especializados (Artesanía) */}
          {(currentSector?.name?.toLowerCase().includes('artesania') || sectorId === 'textile') && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <History size={16} color={COLORS.primary} />
                <Text style={styles.cardTitle}>Detalle Técnico (Puntos)</Text>
              </View>

              <View style={styles.inputGroup}>
                {renderLabel('Seleccione Puntos Maestros')}
                <View style={styles.chipsWrapper}>
                  {STITCH_OPTIONS.map(opt => (
                    <TouchableOpacity 
                      key={opt} 
                      onPress={() => toggleStitch(opt)}
                      style={[styles.smallChip, stitchType.includes(opt) && styles.smallChipActive]}
                    >
                      <Text style={[styles.smallChipText, stitchType.includes(opt) && styles.smallChipTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  {renderLabel('Dimensiones')}
                  <TextInput style={styles.input} value={dimensions} onChangeText={setDimensions} placeholder="Ej: 40x40cm" />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  {renderLabel('Técnica')}
                  <TextInput style={styles.input} value={technique} onChangeText={setTechnique} placeholder="Ej: Telar" />
                </View>
              </View>
            </View>
          )}

          {/* 5. Destacar Producto */}
          <TouchableOpacity 
            style={[styles.promoCard, isPromoted && styles.promoCardActive]} 
            onPress={() => setIsPromoted(!isPromoted)}
          >
            <Crown size={22} color={isPromoted ? '#fff' : COLORS.primary} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.promoTitle, isPromoted && styles.promoTextActive]}>Prioridad en Catálogo</Text>
              <Text style={[styles.promoSubtitle, isPromoted && styles.promoTextActive]}>Marcar como producto Premium destacado.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.saveBtn, loading && styles.disabledBtn]} onPress={handleSave} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>GUARDAR DATOS</Text>}
          </TouchableOpacity>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flex: { flex: 1 },
  scrollContent: { padding: 25, paddingTop: 60 },
  backBtn: { marginBottom: 20 },
  header: { marginBottom: 35 },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.secondary, letterSpacing: -1 },
  subtitle: { fontSize: 13, color: '#6B7280', lineHeight: 20 },
  
  // Estilos de Galería (Mejorados)
  gallerySection: { marginBottom: 25 },
  galleryScroll: { flexDirection: 'row', marginTop: 10 },
  galleryItem: { position: 'relative', marginRight: 15 },
  galleryImage: { width: 120, height: 120, borderRadius: 20, backgroundColor: '#F3F4F6' },
  deletePhotoBtn: { position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', padding: 6, borderRadius: 12, borderWidth: 2, borderColor: '#fff' },
  mainPhotoBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  mainPhotoText: { color: '#fff', fontSize: 8, fontWeight: '900' },
  addPhotoActions: { flexDirection: 'row', gap: 10 },
  addPhotoBtn: { width: 100, height: 120, borderRadius: 20, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed' },
  addPhotoText: { marginTop: 8, fontSize: 10, fontWeight: '800', color: '#6B7280', textTransform: 'uppercase' },


  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E7E5E4',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  cardTitle: { fontSize: 14, fontWeight: '900', color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: 1.5 },
  label: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  inputGroup: { marginBottom: 20 },
  input: {
    backgroundColor: '#F3F4F6',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: { height: 100, paddingTop: 15, textAlignVertical: 'top' },
  inputIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  flexInput: { flex: 1, fontSize: 15, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 15 },
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  bigChip: { 
    paddingHorizontal: 15, 
    paddingVertical: 12, 
    backgroundColor: '#fff', 
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#E5E7EB'
  },
  bigChipActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  bigChipText: { fontSize: 13, fontWeight: '700', color: '#4B5563' },
  bigChipTextActive: { color: '#fff' },
  miniChipsRow: { marginBottom: 10 },
  miniChip: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#fff', borderRadius: 30, borderWidth: 1, borderColor: '#D1D5DB', marginRight: 8 },
  miniChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  miniChipText: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  miniChipTextActive: { color: '#fff' },
  smallChip: { paddingHorizontal: 10, paddingVertical: 7, backgroundColor: '#F9FAFB', borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  smallChipActive: { backgroundColor: COLORS.primary + '20', borderColor: COLORS.primary },
  smallChipText: { fontSize: 11, fontWeight: '700', color: '#6B7280' },
  smallChipTextActive: { color: COLORS.primary },
  switchWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 15 },
  switchLabel: { fontSize: 13, fontWeight: '600', color: '#4B5563' },
  promoCard: { flexDirection: 'row', alignItems: 'center', gap: 15, padding: 20, backgroundColor: '#fff', borderRadius: 25, borderWidth: 2, borderColor: '#E5E7EB', marginBottom: 25 },
  promoCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  promoTitle: { fontSize: 15, fontWeight: '900', color: COLORS.secondary },
  promoSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 2 },
  promoTextActive: { color: '#fff' },
  saveBtn: { backgroundColor: COLORS.secondary, height: 75, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.secondary, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '900', letterSpacing: 2 },
  disabledBtn: { opacity: 0.6 }
});
