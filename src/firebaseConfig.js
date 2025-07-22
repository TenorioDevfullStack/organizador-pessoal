// Firebase SDK import
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyANwsO2-u-Bw2pQjqi1pgI1AHrN2lMrI6Q",
  authDomain: "organizador-financeiro-107a5.firebaseapp.com",
  projectId: "organizador-financeiro-107a5",
  storageBucket: "organizador-financeiro-107a5.firebasestorage.app",
  messagingSenderId: "1056247324476",
  appId: "1:1056247324476:web:ba88709ef0fa565a3bc839"
};

// Inicializa e exporta o app Firebase
const app = initializeApp(firebaseConfig);
export default app;
