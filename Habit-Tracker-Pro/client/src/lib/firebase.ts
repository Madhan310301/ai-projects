import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS8KYPYC5fvXg5DvUQvgu_IsdeimtgDjo",
  authDomain: "progress-tracker-ai-e80c3.firebaseapp.com",
  projectId: "progress-tracker-ai-e80c3",
  storageBucket: "progress-tracker-ai-e80c3.firebasestorage.app",
  messagingSenderId: "646435360273",
  appId: "1:646435360273:web:65181a67c94fb0c7862bb0",
  measurementId: "G-LMEZZMK849"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutFirebase() {
  await signOut(auth);
}

export { onAuthStateChanged, type User };