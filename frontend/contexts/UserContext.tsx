'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

interface UserContextType {
  user: User | null
  guestId: string | null
  isLoading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const GUEST_ID_KEY = 'nutrichat_guest_id'

function generateGuestId(): string {
  return `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guestId, setGuestIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize guest ID
    const storedGuestId = localStorage.getItem(GUEST_ID_KEY)
    if (storedGuestId) {
      setGuestIdState(storedGuestId)
    } else {
      const newGuestId = generateGuestId()
      localStorage.setItem(GUEST_ID_KEY, newGuestId)
      setGuestIdState(newGuestId)
    }

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider value={{ user, guestId, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
