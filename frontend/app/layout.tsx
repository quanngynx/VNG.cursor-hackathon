import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/contexts/UserContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { QueryProvider } from '@/components/QueryProvider'
import { Toaster } from '@/components/ui/sonner'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
})

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
    <html lang="vi" className={plusJakartaSans.variable}>
      <body className="antialiased font-sans">
        <QueryProvider>
          <LanguageProvider>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
