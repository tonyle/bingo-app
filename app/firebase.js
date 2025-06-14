import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBTEnA5Hnqj95sHDWHFOpOsS6AeIKcTBNI",
    authDomain: "bingo-418ef.firebaseapp.com",
    projectId: "bingo-418ef",
    storageBucket: "bingo-418ef.firebasestorage.app",
    messagingSenderId: "274888802605",
    appId: "1:274888802605:web:8eda22b4ace869315c93a4",
    measurementId: "G-F3SZCCK8BP"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
