import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import path from 'path';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;
let firestoreDb: Firestore;

export const initializeFirebase = (): void => {
  try {
    // Path to your Firebase service account key
    // File should be in the server directory or root directory
    const serviceAccountPath = path.join(
      process.cwd(),
      'cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json',
    );

    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });

      firestoreDb = admin.firestore();

      // Configure Firestore settings
      firestoreDb.settings({
        ignoreUndefinedProperties: true,
      });

      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
    throw error;
  }
};

export const getFirestore = (): Firestore => {
  if (!firestoreDb) {
    throw new Error(
      'Firestore has not been initialized. Call initializeFirebase() first.',
    );
  }
  return firestoreDb;
};

export const getFirebaseApp = (): admin.app.App => {
  if (!firebaseApp) {
    throw new Error(
      'Firebase app has not been initialized. Call initializeFirebase() first.',
    );
  }
  return firebaseApp;
};
