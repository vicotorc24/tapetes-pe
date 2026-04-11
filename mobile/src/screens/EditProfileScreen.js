import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { User, Phone, MapPin, Tag, Briefcase, Save, ArrowLeft } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { updateProfile } from '../services/auth';

export default function EditProfileScreen({ user, onNavigate, onSaveSuccess }) {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [brandName, setBrandName] = useState(user.brandName || '');
  const [sector, setSector] = useState(user.sector || '');
  const [location, setLocation] = useState(user.location || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!firstName || !lastName || !phone) {
      Alert.alert('Error', 'Nombres, Apellidos y Teléfono son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      const updatedData = {
        firstName,
        lastName,
        phone,
        brandName,
        sector,
        location
      };
      
      await updateProfile(user.id, updatedData);
      
      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      onSaveSuccess({ ...user, ...updatedData });
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={styles.backBtn}>
            <ArrowLeft color={COLORS.secondary} size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Editar Perfil</Text>
            <Text style={styles.subtitle}>Gestiona tu identidad como artesano o productor de la red.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Nombres</Text>
                <View style={styles.inputWrapper}>
                  <User color="#999" size={18} />
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Apellidos</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de Marca</Text>
              <View style={styles.inputWrapper}>
                <Tag color={COLORS.primary} size={18} />
                <TextInput
                  style={[styles.input, { color: COLORS.primary, fontWeight: 'bold' }]}
                  value={brandName}
                  onChangeText={setBrandName}
                  placeholder="Tu marca comercial"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono de Contacto</Text>
              <View style={styles.inputWrapper}>
                <Phone color="#999" size={18} />
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ubicación / Taller</Text>
              <View style={styles.inputWrapper}>
                <MapPin color="#999" size={18} />
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Ej: Cascas, Contumazá"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Especialidad / Rubro</Text>
              <View style={styles.inputWrapper}>
                <Briefcase color="#999" size={18} />
                <TextInput
                  style={styles.input}
                  value={sector}
                  onChangeText={setSector}
                  placeholder="Ej: Tejidos en telar"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.saveBtn, loading && styles.disabledBtn]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Save color="white" size={20} />
                  <Text style={styles.saveBtnText}>ACTUALIZAR PERFIL</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  scrollContent: { padding: 25, paddingTop: 50 },
  backBtn: { marginBottom: 20 },
  header: { marginBottom: 30 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.secondary, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 12, fontWeight: '800', color: '#A8A29E', textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    height: 60,
    borderRadius: 15,
    paddingHorizontal: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E7E5E4',
  },
  input: { flex: 1, fontSize: 15, color: '#1C1917' },
  row: { flexDirection: 'row', gap: 15 },
  saveBtn: {
    backgroundColor: COLORS.secondary,
    height: 65,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledBtn: { opacity: 0.7 },
  saveBtnText: { color: 'white', fontSize: 15, fontWeight: '900', letterSpacing: 1 }
});
