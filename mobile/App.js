import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');

function NavigationOverlay({ currentScreen, navigate, user }) {
  const insets = useSafeAreaInsets();
  
  // Ocultar en pantallas específicas
  const hiddenScreens = ['Detail', 'LegacyDetail', 'Login'];
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

  // Sistema de Navegación Simple
  const navigate = (screen, data = null) => {
    if ((screen === 'Detail' || screen === 'LegacyDetail') && data) {
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
        return <LoginScreen onNavigate={navigate} onLoginSuccess={(u) => { setUser(u); navigate('Dashboard'); }} />;
      case 'Dashboard':
        return <DashboardScreen onNavigate={navigate} user={user} onLogout={() => { setUser(null); navigate('Home'); }} />;
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
