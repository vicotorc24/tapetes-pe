const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");

admin.initializeApp();
const db = admin.firestore();
const expo = new Expo();

/**
 * Trigger que se ejecuta cada vez que se crea un documento en la colección "products"
 */
exports.notifyNewProduct = onDocumentCreated("products/{productId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const productData = snapshot.data();
  const title = productData.title || "Nuevo tesoro artesanal";
  const brandName = productData.brandName || "Productores locales";
  
  console.log(`[NOTIFY] Detectado nuevo producto: ${title} de ${brandName}`);

  try {
    // 1. Obtener todos los usuarios que tienen un pushToken registrado
    const usersSnapshot = await db.collection("users").where("pushToken", "!=", null).get();
    
    if (usersSnapshot.empty) {
      console.log("[NOTIFY] No se encontraron usuarios con pushToken.");
      return;
    }

    // 2. Extraer y validar los tokens
    let messages = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const pushToken = userData.pushToken;

      // Verificar que el token sea válido para Expo
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`[NOTIFY] Token inválido para usuario ${doc.id}: ${pushToken}`);
        return;
      }

      // No notificar al propio creador del producto (opcional, ajustando según necesidad)
      if (userData.email && productData.sellerEmail && userData.email === productData.sellerEmail) {
         return; 
      }

      // Preparar el mensaje
      const price = productData.price ? `S/ ${productData.price}` : "";
      messages.push({
        to: pushToken,
        sound: 'default',
        title: "¡Nuevo producto publicado! 🎉",
        body: price 
          ? `${brandName} acaba de publicar: ${title} por ${price}. ¡Entra para verlo!`
          : `${brandName} acaba de publicar: ${title}. ¡Entra para descubrirlo!`,
        data: { productId: event.params.productId, route: 'Detail' },
      });
    });

    if (messages.length === 0) {
      console.log("[NOTIFY] No hay mensajes válidos para enviar.");
      return;
    }

    // 3. Enviar las notificaciones usando el SDK de Expo (se hace en chunks/bloques)
    console.log(`[NOTIFY] Intentando enviar ${messages.length} notificaciones...`);
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("[NOTIFY] Error enviando bloque de notificaciones:", error);
      }
    }

    console.log("[NOTIFY] Proceso completado con éxito.");

  } catch (error) {
    console.error("[NOTIFY] Error crítico procesando la notificación:", error);
  }
});
