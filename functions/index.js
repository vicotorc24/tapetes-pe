const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
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

    // 4. Analizar los tickets para detectar tokens inválidos y limpiarlos
    const tokensToDelete = [];
    tickets.forEach((ticket, index) => {
      if (ticket.status === 'error') {
        const token = messages[index].to;
        console.error(`[NOTIFY] Error en ticket para ${token}: ${ticket.message}`);
        
        if (ticket.details && ticket.details.error === 'DeviceNotRegistered') {
          tokensToDelete.push(token);
        }
      }
    });

    // 5. Limpiar tokens inválidos en la base de datos
    if (tokensToDelete.length > 0) {
      console.log(`[NOTIFY] Limpiando ${tokensToDelete.length} tokens inválidos...`);
      for (const token of tokensToDelete) {
        const expiredUsers = await db.collection("users").where("pushToken", "==", token).get();
        const batch = db.batch();
        expiredUsers.forEach(doc => {
          batch.update(doc.ref, { 
            pushToken: null, 
            tokenError: 'DeviceNotRegistered',
            lastTokenErrorAt: new Date().toISOString()
          });
        });
        await batch.commit();
      }
    }

    console.log("[NOTIFY] Proceso de notificación finalizado.");

  } catch (error) {
    console.error("[NOTIFY] Error crítico procesando la notificación:", error);
  }
});
/**
 * Trigger que se ejecuta cada vez que un producto se actualiza (especialmente para cambios de precio)
 */
exports.notifyPriceChange = onDocumentUpdated("products/{productId}", async (event) => {
  const beforeData = event.data.before.data();
  const afterData = event.data.after.data();

  if (!beforeData || !afterData) return;

  // Solo actuamos si el precio ha cambiado (y si ha bajado, opcionalmente)
  const oldPrice = parseFloat(beforeData.price);
  const newPrice = parseFloat(afterData.price);

  if (oldPrice === newPrice || isNaN(newPrice)) return;

  const isPriceDrop = newPrice < oldPrice;
  const title = afterData.title || "Un producto que te gusta";
  
  console.log(`[PRICE] Cambio de precio detectado en ${title}: ${oldPrice} -> ${newPrice}`);

  try {
    // 1. Buscar usuarios que tengan este producto en sus favoritos
    // (Asumimos que guardamos los IDs de favoritos en un array llamado "favorites" en el doc del usuario)
    const usersSnapshot = await db.collection("users")
      .where("favorites", "array-contains", event.params.productId)
      .where("pushToken", "!=", null)
      .get();

    if (usersSnapshot.empty) {
      console.log("[PRICE] No hay usuarios con este producto en favoritos.");
      return;
    }

    let messages = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const pushToken = userData.pushToken;

      if (!Expo.isExpoPushToken(pushToken)) return;

      messages.push({
        to: pushToken,
        sound: 'default',
        title: isPriceDrop ? "¡Bajó de precio! 📉" : "Actualización de precio",
        body: isPriceDrop 
          ? `El producto "${title}" que tienes en favoritos ahora cuesta S/ ${newPrice}. ¡Aprovecha!`
          : `El precio de "${title}" ha cambiado a S/ ${newPrice}.`,
        data: { productId: event.params.productId, route: 'Detail' },
      });
    });

    if (messages.length === 0) return;

    // 2. Enviar notificaciones
    console.log(`[PRICE] Enviando ${messages.length} alertas de precio...`);
    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }

    console.log("[PRICE] Alertas enviadas con éxito.");

  } catch (error) {
    console.error("[PRICE] Error procesando alerta de precio:", error);
  }
});
