import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, ShoppingBag, Award, User, BookOpen } from 'lucide-react-native';
import { COLORS } from './src/theme/colors';

// Pantallas
import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen';
import LoginScreen from './src/screens/LoginScreen';
import ImpactScreen from './src/screens/ImpactScreen';
import LegacyScreen from './src/screens/LegacyScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import LegacyDetailScreen from './src/screens/LegacyDetailScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EditProductScreen from './src/screens/EditProductScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import NewProductScreen from './src/screens/NewProductScreen';
import { getSession } from './src/services/session';
import { updatePushToken } from './src/services/auth';
import { registerForPushNotificationsAsync } from './src/services/notifications';
import * as Notifications from 'expo-notifications';
import { getProductById } from './src/services/products';

const { width } = Dimensions.get('window');

function NavigationOverlay({ currentScreen, navigate, user }) {
  const insets = useSafeAreaInsets();
  
  // Ocultar en pantallas específicas
  const hiddenScreens = ['Detail', 'LegacyDetail', 'Login', 'Register', 'EditProduct', 'EditProfile', 'NewProduct'];
  if (hiddenScreens.includes(currentScreen)) return null;

  const tabs = [
    { id: 'Home', label: 'Inicio', icon: Home },
    { id: 'Catalog', label: 'Tienda', icon: ShoppingBag },
    { id: 'Legacy', label: 'Legado', icon: BookOpen },
    { id: 'Impact', label: 'Impacto', icon: Award },
    { id: user ? 'Dashboard' : 'Login', label: 'Portal', icon: User },
  ];

  return (
    <View style={[styles.navContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.navBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id || (tab.id === 'Login' && currentScreen === 'Dashboard');
          
          return (
            <TouchableOpacity 
              key={tab.id} 
              style={styles.navItem} 
              onPress={() => navigate(tab.id)}
            >
              <Icon 
                size={22} 
                color={isActive ? COLORS.primary : '#A8A29E'} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text style={[styles.navLabel, { color: isActive ? COLORS.secondary : '#A8A29E' }]}>
                {tab.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Restauración automática de sesión al arrancar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = await getSession();
        if (savedUser) {
          console.log("[INIT] Sesión restaurada para:", savedUser.email);
          setUser(savedUser);
          
          // Solicitar y guardar token de notificaciones
          try {
            const token = await registerForPushNotificationsAsync();
            if (token) {
              await updatePushToken(savedUser.id, token);
            }
          } catch (tokenErr) {
            console.error("[INIT] Error con notificaciones:", tokenErr);
          }

          // Si estaba en el portal, volver al dashboard
          if (currentScreen === 'Home') {
            // No cambiamos el screen forzadamente si está en Home para no confundir al usuario,
            // pero el botón Portal ahora llevará al Dashboard.
          }
        }
      } catch (e) {
        console.error("[INIT] Error al restaurar sesión:", e);
      } finally {
        setIsInitializing(false);
      }
    };
    checkSession();
  }, []);

  // Manejo de notificaciones cuando se tocan
  useEffect(() => {
    const handleResponse = async (response) => {
      const data = response?.notification?.request?.content?.data;
      if (data && data.productId && data.route === 'Detail') {
        console.log("[NOTIFY] Redirigiendo a detalle de producto:", data.productId);
        try {
          const product = await getProductById(data.productId);
          if (product) {
            // Un pequeño delay asegura que la navegación esté lista si la app está arrancando
            setTimeout(() => navigate('Detail', product), 500);
          }
        } catch (error) {
          console.error("[NOTIFY] Error redirigiendo:", error);
        }
      }
    };

    // 1. Caso: App cerrada (Cold Start)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response) handleResponse(response);
    });

    // 2. Caso: App abierta o en segundo plano
    const subscription = Notifications.addNotificationResponseReceivedListener(handleResponse);

    return () => subscription.remove();
  }, []);

  // Sistema de Navegación Simple
  const navigate = (screen, data = null) => {
    if ((screen === 'Detail' || screen === 'LegacyDetail' || screen === 'EditProduct') && data) {
      setSelectedProduct(data);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen onNavigate={navigate} user={user} />;
      case 'Catalog':
        return <CatalogScreen onNavigate={navigate} />;
      case 'Login':
        return <LoginScreen onNavigate={navigate} onLoginSuccess={async (u) => { 
          setUser(u); 
          navigate('Dashboard'); 
          try {
            const token = await registerForPushNotificationsAsync();
            if (token) await updatePushToken(u.id, token);
          } catch (e) {
            console.error(e);
          }
        }} />;
      case 'Register':
        return <RegisterScreen onNavigate={navigate} onRegisterSuccess={(u) => { setUser(u); navigate('Dashboard'); }} />;
      case 'Dashboard':
        return <DashboardScreen onNavigate={navigate} user={user} onLogout={() => { setUser(null); navigate('Home'); }} />;
      case 'EditProduct':
        return <EditProductScreen product={selectedProduct} onNavigate={navigate} onSaveSuccess={() => navigate('Dashboard')} />;
      case 'EditProfile':
        return <EditProfileScreen user={user} onNavigate={navigate} onSaveSuccess={(updatedUser) => { setUser(updatedUser); navigate('Dashboard'); }} />;
      case 'NewProduct':
        return <NewProductScreen user={user} onNavigate={navigate} onPublishSuccess={() => navigate('Dashboard')} />;
      case 'Impact':
        return <ImpactScreen onNavigate={navigate} />;
      case 'Legacy':
        return <LegacyScreen onNavigate={navigate} />;
      case 'Favorites':
        return <FavoritesScreen onNavigate={navigate} />;
      case 'Detail':
        return <ProductDetailScreen onNavigate={navigate} product={selectedProduct} />;
      case 'LegacyDetail':
        return <LegacyDetailScreen onNavigate={navigate} item={selectedProduct} />;
      default:
        return <HomeScreen onNavigate={navigate} user={user} />;
    }
  };

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <StatusBar style="dark" />
          <View style={{ flex: 1 }}>
            {renderScreen()}
          </View>
          <NavigationOverlay currentScreen={currentScreen} navigate={navigate} user={user} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F4',
    paddingTop: 12,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    minWidth: 70,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 4,
    position: 'absolute',
    bottom: -8,
  }
});
