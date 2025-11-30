import admin from 'firebase-admin'
import { Firestore } from '@google-cloud/firestore'
import path from 'path'

// Initialize Firebase Admin SDK
let firebaseApp: admin.app.App
let firestoreDb: Firestore

/**
 * Get Firebase credential from environment variables or file
 * 
 * For Vercel/Production: Set these env variables:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_CLIENT_EMAIL  
 * - FIREBASE_PRIVATE_KEY (replace \n with actual newlines in Vercel dashboard)
 * 
 * For Local Development: Use the JSON file
 */
const getFirebaseCredential = (): admin.credential.Credential => {
  // Check if env variables are set (for Vercel/Production)
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (projectId && clientEmail && privateKey) {
    console.log('🔑 Using Firebase credentials from environment variables')
    return admin.credential.cert({
      projectId,
      clientEmail,
      // Handle escaped newlines from env variable
      privateKey: privateKey.replace(/\\n/g, '\n'),
    })
  }

  // Fallback to JSON file (for local development)
  console.log('📁 Using Firebase credentials from JSON file')
  const serviceAccountFileName =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    'cursor-hackathon-2e617-firebase-adminsdk-fbsvc-93b16413db.json'
  const serviceAccountPath = path.join(
    process.cwd(),
    '..',
    serviceAccountFileName,
  )
  return admin.credential.cert(serviceAccountPath)
}

export const initializeFirebase = (): void => {
  try {
    if (!admin.apps.length) {
      firebaseApp = admin.initializeApp({
        credential: getFirebaseCredential(),
      })

      // Explicitly use default settings without custom grpc setup unless needed
      firestoreDb = admin.firestore()

      firestoreDb.settings({
        ignoreUndefinedProperties: true,
        // Add explicit empty config to avoid auto-detection issues in some environments
        databaseId: '(default)',
      })

      console.log('✅ Firebase Admin SDK initialized successfully')
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error)
    throw error
  }
}

export const getFirestore = (): Firestore => {
  if (!firestoreDb) {
    // If accessed before explicit init (unlikely but safe fallback), try to init
    try {
      initializeFirebase()
    } catch (e) {
      // Ignore error here, let the original error propagate if needed
    }

    if (!firestoreDb) {
      throw new Error(
        'Firestore has not been initialized. Call initializeFirebase() first.',
      )
    }
  }
  return firestoreDb
}

export const getFirebaseApp = (): admin.app.App => {
  if (!firebaseApp) {
    throw new Error(
      'Firebase app has not been initialized. Call initializeFirebase() first.',
    )
  }
  return firebaseApp
}

