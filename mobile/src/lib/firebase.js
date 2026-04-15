import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración extraída de .env
const firebaseConfig = {
  apiKey: "AIzaSyDa9ZHlXv_4H0cJ9ec2eX-xnvfc21KKSTs",
  authDomain: "tapetespe-prod.firebaseapp.com",
  projectId: "tapetespe-prod",
  storageBucket: "tapetespe-prod.appspot.com",
  messagingSenderId: "403347149122",
  appId: "1:403347149122:web:5ca41e4d9d004aa86e38db",
  measurementId: "G-XYPXX39BRD"
};

// Inicializamos la App en entorno móvil
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
