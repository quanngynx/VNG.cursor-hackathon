import admin from 'firebase-admin';
import { Firestore } from '@google-cloud/firestore';
import path from 'path';

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App;
let firestoreDb: Firestore;

export const initializeFirebase = (): void => {
  try {
    // Path to your Firebase service account key
    // File is located in the project root directory (parent of server)
    const serviceAccountFileName =
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
      'cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json';
    const serviceAccountPath = path.join(
      process.cwd(),
      '..',
      serviceAccountFileName,
    );

    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });

      // Explicitly use default settings without custom grpc setup unless needed
      firestoreDb = admin.firestore();

      firestoreDb.settings({
        ignoreUndefinedProperties: true,
        // Add explicit empty config to avoid auto-detection issues in some environments
        databaseId: '(default)',
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
    // If accessed before explicit init (unlikely but safe fallback), try to init
    try {
      initializeFirebase();
    } catch (e) {
      // Ignore error here, let the original error propagate if needed
    }

    if (!firestoreDb) {
      throw new Error(
        'Firestore has not been initialized. Call initializeFirebase() first.',
      );
    }
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
