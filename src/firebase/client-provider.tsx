'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { auth, firestore, firebaseApp } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This provider now simply takes the already-initialized services
// from firebase/index.ts and provides them to the React tree.
// This avoids any logic that could differ between server and client.
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
