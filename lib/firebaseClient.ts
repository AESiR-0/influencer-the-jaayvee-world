import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type FirebaseStorage, getStorage } from "firebase/storage";

// Only initialize Firebase on the client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  };

  // Check if all required environment variables are present
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    console.error("Missing Firebase environment variables:", missingVars);
    console.error(
      "Please check your .env.local file and ensure all Firebase config variables are set.",
    );
  } else {
    try {
      app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
      auth = getAuth(app);
      storage = getStorage(app);
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
}

export { app, auth, storage };
