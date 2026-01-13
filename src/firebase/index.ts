'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// This is the correct, fail-safe way to configure Firebase in a Next.js app.
// The config is directly embedded, ensuring it's always available during build and on the client.
const firebaseConfig = {
  apiKey: "AIzaSyBFsWkjDCnq0dwCA182YW8HIw8V-s-_D20",
  authDomain: "studio-2322173444-3d6ba.firebaseapp.com",
  projectId: "studio-2322173444-3d6ba",
  storageBucket: "studio-2322173444-3d6ba.appspot.com",
  messagingSenderId: "1062085732383",
  appId: "1:1062085732383:web:014c2d46a815a513c1c4f5",
  measurementId: "G-9T4V5G43P9"
};

// Initialize Firebase safely
const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, firestore, storage, initializeFirebase }; // Exporting initializeFirebase for consistency, though it's now self-contained.

// This is a dummy function now, as initialization happens above.
// Kept for any other part of the code that might be calling it, but it just returns the existing services.
function initializeFirebase() {
  return { firebaseApp, auth, firestore, storage };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
