

export const getFirebaseConfig = () => {
    const firebaseConfig = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
      };

      if (!firebaseConfig.apiKey) {
        // This log is helpful for debugging build issues.
        console.error("Firebase API key is missing. Make sure NEXT_PUBLIC_FIREBASE_API_KEY environment variable is set.");
      }
      
      return firebaseConfig;
}
