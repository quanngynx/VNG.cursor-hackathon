import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDB497hArCzsKGGhH9Nz3YpOQ9-PioYfcQ",
  authDomain: "cursor-hackathon-2e617.firebaseapp.com",
  projectId: "cursor-hackathon-2e617",
  storageBucket: "cursor-hackathon-2e617.firebasestorage.app",
  messagingSenderId: "714919837652",
  appId: "1:714919837652:web:33ca1894e548440cdfa041",
  measurementId: "G-J7MD050YFX"
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { auth, googleProvider }
