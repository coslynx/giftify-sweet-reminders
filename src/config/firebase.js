// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Firebase Configuration ---
// Read environment variables provided by Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// --- Validation ---
// Check for missing *required* configuration values
const requiredConfigKeys = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
];
const missingKeys = requiredConfigKeys.filter(
  (key) => !firebaseConfig[key] || typeof firebaseConfig[key] !== 'string' || firebaseConfig[key].trim() === '' || firebaseConfig[key].includes('YOUR_')
);

let app;
let authInstance;
let dbInstance;

if (missingKeys.length > 0) {
  const errorMsg = `Firebase configuration error: The following required environment variables are missing or invalid in your .env file: ${missingKeys
    .map((key) => `VITE_FIREBASE_${key.toUpperCase()}`)
    .join(', ')}. Please ensure they are correctly set. Application cannot start.`;
  console.error(errorMsg);
  // Throwing an error prevents the app from continuing with invalid config
  throw new Error(errorMsg);
} else {
  // --- Initialization ---
  // Initialize Firebase only if all required configs are present
  try {
    app = initializeApp(firebaseConfig);

    // --- Service Instantiation ---
    /**
     * Firebase Authentication service instance.
     * @type {import("firebase/auth").Auth}
     */
    authInstance = getAuth(app);

    /**
     * Firebase Firestore database service instance.
     * @type {import("firebase/firestore").Firestore}
     */
    dbInstance = getFirestore(app);

    console.info("Firebase initialized successfully.");

  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    throw new Error("Firebase initialization failed. Check console for details.");
  }
}

// --- Exports ---
// Export the initialized services as singletons
export const auth = authInstance;
export const db = dbInstance;