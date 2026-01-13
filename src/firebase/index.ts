'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// This function is now designed to be robust and safe to call anywhere.
export function initializeFirebase() {
  // If apps are already initialized, return the existing SDKs.
  if (getApps().length) {
    return getSdks(getApp());
  }

  // If no apps are initialized, initialize a new one with the config.
  // This config is populated by environment variables, which works for
  // local dev, Vercel builds, and client-side rendering.
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
