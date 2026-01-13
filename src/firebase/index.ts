'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Hardcoded Firebase configuration to ensure availability in all environments.
const firebaseConfig = {
  apiKey: "AIzaSyBFsWkjDCnq0dwCA182YW8HIw8V-s-_D20",
  authDomain: "studio-2322173444-3d6ba.firebaseapp.com",
  projectId: "studio-2322173444-3d6ba",
  storageBucket: "studio-2322173444-3d6ba.appspot.com",
  messagingSenderId: "1062085732383",
  appId: "1:1062085732383:web:014c2d46a815a513c1c4f5",
  measurementId: "G-9T4V5G43P9"
};


export function initializeFirebase() {
  if (getApps().length) {
    return getSdks(getApp());
  }
  
  const firebaseApp = initializeApp(firebaseConfig);
  return getSdks(firebaseApp);
}


export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
