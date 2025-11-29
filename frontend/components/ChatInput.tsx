'use client'

import { useState, KeyboardEvent, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Send, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useLanguage()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 glass-strong border-t border-border/50">
      <div 
        className={`flex gap-3 items-end p-2 rounded-2xl bg-white dark:bg-gray-800 border-2 transition-all duration-300 ${
          isFocused 
            ? 'border-primary/50 shadow-lg shadow-primary/10' 
            : 'border-border/50 shadow-sm'
        }`}
      >
        {/* Sparkle icon */}
        <div className={`flex-shrink-0 p-2 rounded-xl transition-all duration-300 ${
          isFocused ? 'bg-primary/10' : 'bg-muted'
        }`}>
          <Sparkles className={`h-5 w-5 transition-colors duration-300 ${
            isFocused ? 'text-primary' : 'text-muted-foreground'
          }`} />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={t.chat.placeholder}
          className="flex-1 resize-none bg-transparent px-1 py-2 text-sm focus:outline-none placeholder:text-muted-foreground/60 min-h-[40px] max-h-[120px]"
          rows={1}
          disabled={disabled}
        />

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="icon"
          className={`flex-shrink-0 rounded-xl h-10 w-10 transition-all duration-300 ${
            message.trim() && !disabled
              ? 'bg-gradient-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Send className={`h-4 w-4 transition-transform duration-300 ${
            message.trim() && !disabled ? '-rotate-45' : ''
          }`} />
        </Button>
      </div>

      {/* Helper text */}
      <p className="text-[10px] text-muted-foreground/60 mt-2 text-center">
        {t.chat.pressEnter}
      </p>
    </div>
  )
}
