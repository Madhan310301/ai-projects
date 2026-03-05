import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";

const firebaseEnvVars: Record<string, string | undefined> = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseEnvVars)
  .filter(([, value]) => value === undefined || value === "")
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missing.join(", ")}.\n` +
    "Copy .env.example to .env and fill in your Firebase project credentials."
  );
}

const firebaseConfig = {
  apiKey: firebaseEnvVars.VITE_FIREBASE_API_KEY as string,
  authDomain: firebaseEnvVars.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: firebaseEnvVars.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: firebaseEnvVars.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: firebaseEnvVars.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: firebaseEnvVars.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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