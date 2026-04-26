import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuración global para cuando la app está abierta (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permisos y obtiene el token de Expo Push
 * @returns {Promise<string|null>} Token único del dispositivo o null si falla
 */
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Fallo al obtener permisos de notificaciones push.');
      return null;
    }
    
    // El project ID debe coincidir con el app.json (expo.dev)
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("[PUSH TOKEN]:", token);
    } catch (error) {
      console.error("Error obteniendo el push token:", error);
    }
  } else {
    console.log('Las notificaciones push requieren un dispositivo físico.');
  }

  return token;
}
