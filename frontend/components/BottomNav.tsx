'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare, BarChart3 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    {
      href: '/',
      label: 'Chat',
      icon: MessageSquare,
    },
    {
      href: '/dashboard',
      label: t.header.dashboard,
      icon: BarChart3,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-3 px-8 transition-all duration-300 group ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-primary rounded-full animate-scale-in" />
              )}

              {/* Icon container */}
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10' 
                  : 'group-hover:bg-muted'
              }`}>
                <Icon className={`h-5 w-5 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-105'
                }`} />
                
                {/* Glow effect for active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] font-semibold mt-1 transition-all duration-300 ${
                isActive ? 'text-primary' : ''
              }`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Safe area for iOS */}
      <div className="h-safe-area-inset-bottom bg-transparent" />
    </nav>
  )
}
