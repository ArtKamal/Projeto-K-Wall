import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBJulyPSmaAfe2TXupYShoI_jGXjxq4pio",
  authDomain: "projeto-kwall.firebaseapp.com",
  projectId: "projeto-kwall",
  storageBucket: "projeto-kwall.firebasestorage.app",
  messagingSenderId: "137041334608",
  appId: "1:137041334608:web:678f003788bb77e3089c55",
  baseURL: "https://projeto-kwall-default-rtdb.firebaseio.com/"
};
 
const app = initializeApp(firebaseConfig);
 
// Firebase Authentication
 
// Realtime Database


export const database = getDatabase(app);
export const auth = initializeAuth(app);
export default app