'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface UserContextType {
  guestId: string | null
  isLoading: boolean
  setGuestId: (id: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const GUEST_ID_KEY = 'nutrichat_guest_id'

function generateGuestId(): string {
  return `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [guestId, setGuestIdState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing guestId
    const stored = localStorage.getItem(GUEST_ID_KEY)
    if (stored) {
      setGuestIdState(stored)
    } else {
      // Generate new guestId
      const newGuestId = generateGuestId()
      localStorage.setItem(GUEST_ID_KEY, newGuestId)
      setGuestIdState(newGuestId)
    }
    setIsLoading(false)
  }, [])

  const setGuestId = (id: string) => {
    localStorage.setItem(GUEST_ID_KEY, id)
    setGuestIdState(id)
  }

  return (
    <UserContext.Provider value={{ guestId, isLoading, setGuestId }}>
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

