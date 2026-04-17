import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Dimensions } from 'react-native';
import { Mail, Lock, ArrowRight, UserCircle, Eye, EyeOff } from 'lucide-react-native';
import { COLORS } from '../theme/colors';
import { login } from '../services/auth';
import { ArtisanEvents } from '../services/analytics';
import { saveSession } from '../services/session';

const { width } = Dimensions.get('window');

export default function LoginScreen({ onNavigate, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor ingrese sus credenciales');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      await saveSession(user);
      ArtisanEvents.LOGIN(user.uid || user.id, user.email);
      onLoginSuccess(user);
    } catch (error) {
      alert(error.message);
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
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.content}>
            <TouchableOpacity onPress={() => onNavigate('Home')} style={styles.backLink}>
              <Text style={styles.backText}>Volver al Inicio</Text>
            </TouchableOpacity>

            <View style={styles.headerArea}>
              <View style={styles.logoCircle}>
                <UserCircle color={COLORS.primary} size={50} />
              </View>
              <Text style={styles.title}>Artesanos y Productores</Text>
              <Text style={styles.subtitle}>Gestione su identidad productiva y catalogue sus obras para el mundo.</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Mail color="#999" size={20} />
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
                <Lock color="#999" size={20} />
                <TextInput
                  placeholder="Contraseña"
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff color="#999" size={20} /> : <Eye color="#999" size={20} />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>¿Olvidó su contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text style={styles.loginBtnText}>Iniciar Sesión</Text>
                <ArrowRight color="white" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Todavía no está registrado?</Text>
              <TouchableOpacity onPress={() => onNavigate('Register')}>
                <Text style={styles.registerLink}>Registrarse como Productor / Artesano</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    paddingTop: 100, // Espacio para el botón de "Volver"
  },
  backLink: {
    position: 'absolute',
    top: 50, // Bajado para evitar el notch
    left: 30,
    padding: 10, // Área de toque más grande
  },
  backText: {
    color: COLORS.secondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
    marginBottom: 10,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  form: {
    gap: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    height: 60,
    borderRadius: 18,
    paddingHorizontal: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    color: '#999',
    fontSize: 13,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: COLORS.secondary,
    height: 65,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
    elevation: 5,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 15,
  }
});
