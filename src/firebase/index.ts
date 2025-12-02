
'use client';

import {
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
};

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function initializeFirebase(): FirebaseServices {
  if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
        const app = initializeApp(firebaseConfig);
        // Only assign to globals after initialization
        firebaseApp = app;
        auth = getAuth(app);
        db = getFirestore(app);
    } else {
        if (!firebaseApp) {
            firebaseApp = getApps()[0];
            auth = getAuth(firebaseApp);
            db = getFirestore(firebaseApp);
        }
    }
  }
  
  if (!firebaseApp || !auth || !db) {
    // This case handles server-side rendering or an initialization error.
    // It's better to throw an error or handle it gracefully than return nulls.
    // However, given the app's structure with 'use client', we provide a safe-guard.
    // In a real-world SSR scenario, you'd initialize a server-side admin app here.
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    return {
      app: app,
      auth: getAuth(app),
      db: getFirestore(app)
    };
  }

  return { app: firebaseApp, auth: auth, db: db };
}

export * from './provider';
export * from './use-collection';
export * from './use-doc';
export * from './use-user';
export { initializeFirebase };
