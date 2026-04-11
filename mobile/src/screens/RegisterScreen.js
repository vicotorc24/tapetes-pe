import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Mail, Lock, User, Briefcase, ArrowRight, ArrowLeft, Phone, MapPin, Tag, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { register } from '../services/auth';

export default function RegisterScreen({ onNavigate, onRegisterSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [brandName, setBrandName] = useState('');
  const [sector, setSector] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert('Error', 'Por favor complete todos los campos obligatorios.');
      return;
    }

    try {
      setLoading(true);
      await register({
        firstName,
        lastName,
        email,
        password,
        phone,
        brandName,
        sector: sector || 'General'
      });
      
      Alert.alert('Registro Recibido', 'Su solicitud ha sido enviada. Un funcionario municipal validará su identidad para activar su cuenta.', [
        { text: 'Entendido', onPress: () => onNavigate('Home') }
      ]);
    } catch (error) {
      Alert.alert('Error al registrar', error.message);
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
          <TouchableOpacity onPress={() => onNavigate('Login')} style={styles.backBtn}>
            <ArrowLeft color={COLORS.secondary} size={24} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Sé Parte de la Comunidad</Text>
            <Text style={styles.subtitle}>Únete a la red de artesanos y productores de Contumazá para llevar tu arte al mundo.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <User color="#999" size={18} />
                <TextInput
                  placeholder="Nombres"
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  placeholder="Apellidos"
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Tag color={COLORS.primary} size={18} />
              <TextInput
                placeholder="Nombre de Marca / Emprendimiento"
                style={[styles.input, { fontWeight: 'bold', color: COLORS.primary }]}
                value={brandName}
                onChangeText={setBrandName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Mail color="#999" size={18} />
              <TextInput
                placeholder="Correo Electrónico"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock color="#999" size={18} />
              <TextInput
                placeholder="Contraseña"
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff color="#999" size={18} /> : <Eye color="#999" size={18} />}
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <Phone color="#999" size={18} />
                <TextInput
                  placeholder="Teléfono"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <MapPin color="#999" size={18} />
                <TextInput
                  placeholder="Contumazá"
                  style={styles.input}
                  editable={false}
                  value="Contumazá"
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Briefcase color="#999" size={18} />
              <TextInput
                placeholder="Rubro (ej: Textil, Miel, Café)"
                style={styles.input}
                value={sector}
                onChangeText={setSector}
              />
            </View>

            <TouchableOpacity 
              style={[styles.registerBtn, loading && styles.disabledBtn]} 
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Text style={styles.registerBtnText}>ENVIAR SOLICITUD</Text>
                  <ArrowRight color="white" size={20} />
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => onNavigate('Login')}>
              <Text style={styles.loginLink}>Inicia Sesión aquí</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.privacy}>
            Al registrarte adecuas tu perfil a las políticas de fidelidad y comercio justo de la Municipalidad de Contumazá.
          </Text>
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
  header: { marginBottom: 35 },
  title: { fontSize: 30, fontWeight: '900', color: COLORS.secondary, marginBottom: 10, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: '#78716C', lineHeight: 20, fontWeight: '300' },
  form: { gap: 15 },
  row: { flexDirection: 'row', gap: 12 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 15,
    gap: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: { flex: 1, fontSize: 14, color: '#1A1A1A' },
  registerBtn: {
    backgroundColor: COLORS.secondary,
    height: 65,
    borderRadius: 22,
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
  registerBtnText: { color: 'white', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  footer: { marginTop: 30, alignItems: 'center', gap: 8 },
  footerText: { color: '#A8A29E', fontSize: 13 },
  loginLink: { color: COLORS.primary, fontWeight: '900', fontSize: 14 },
  privacy: { fontSize: 10, color: '#A8A29E', textAlign: 'center', marginTop: 30, fontStyle: 'italic', lineHeight: 16 }
});
