import type { Metadata } from 'next'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'NutriChat - AI Nutrition Assistant',
  description: 'AI-powered nutrition assistant that helps you decide what to eat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  )
}
