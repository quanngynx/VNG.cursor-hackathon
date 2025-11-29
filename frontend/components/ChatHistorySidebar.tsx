'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, X, Loader2, Clock } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { chatApi } from '@/lib/api'

interface ChatHistoryItem {
  id: string
  message: string
  role: 'user' | 'assistant'
  createdAt: string | Date
  metadata?: unknown
}

interface Conversation {
  id: string
  firstMessage: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  messages: ChatHistoryItem[]
}

interface ConversationMessage {
  id: string
  text: string
  isUser: boolean
  suggestions?: unknown
}

interface ChatHistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  guestId: string | null
  userId?: string | null
  onLoadConversation?: (messages: ConversationMessage[]) => void
}

export function ChatHistorySidebar({
  isOpen,
  onClose,
  guestId,
  userId,
  onLoadConversation,
}: ChatHistorySidebarProps) {
  const { t, language } = useLanguage()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && (guestId || userId)) {
      loadHistory()
    }
  }, [isOpen, guestId, userId])

  const loadHistory = async () => {
    if (!guestId && !userId) return

    setIsLoading(true)
    try {
      const id = userId || guestId!
      const isGuest = !!guestId && !userId
      const response = await chatApi.getHistory(id, 200, isGuest)
      if (response.success && response.data) {
        const items = (response.data as ChatHistoryItem[]).map((item) => ({
          id: item.id || Date.now().toString(),
          message: item.message || '',
          role: item.role || 'user',
          createdAt: item.createdAt || new Date(),
          metadata: item.metadata,
        }))
        
        const grouped = groupMessagesIntoConversations(items)
        setConversations(grouped)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

    if (messageDate.getTime() === today.getTime()) {
      return d.toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.getTime() === yesterday.getTime()) {
      return t.chat.yesterday
    }

    return d.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { 
      day: 'numeric', 
      month: 'short' 
    })
  }

  const truncateMessage = (text: string, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const groupMessagesIntoConversations = (messages: ChatHistoryItem[]): Conversation[] => {
    if (messages.length === 0) return []

    const conversations: Conversation[] = []
    let currentConversation: ChatHistoryItem[] = []
    const CONVERSATION_GAP_MS = 5 * 60 * 1000 

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      const prevMsg = messages[i - 1]

      if (prevMsg) {
        const msgTime = new Date(msg.createdAt).getTime()
        const prevTime = new Date(prevMsg.createdAt).getTime()
        const gap = Math.abs(msgTime - prevTime)

        if (gap > CONVERSATION_GAP_MS) {
          if (currentConversation.length > 0) {
            conversations.push(createConversation(currentConversation))
            currentConversation = []
          }
        }
      }

      currentConversation.push(msg)
    }

    if (currentConversation.length > 0) {
      conversations.push(createConversation(currentConversation))
    }

    return conversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const createConversation = (messages: ChatHistoryItem[]): Conversation => {
    const firstUserMessage = messages.find(m => m.role === 'user')
    const lastMessage = messages[messages.length - 1]
    
    return {
      id: `conv-${messages[0].id}`,
      firstMessage: firstUserMessage?.message || messages[0].message,
      lastMessage: lastMessage.message,
      timestamp: new Date(messages[0].createdAt),
      messageCount: messages.length,
      messages: messages,
    }
  }

  const handleConversationClick = (conversation: Conversation) => {
    if (onLoadConversation && conversation.messages.length > 0) {
      const chatMessages: ConversationMessage[] = conversation.messages.map((msg, index) => ({
        id: msg.id || `msg-${Date.now()}-${index}`,
        text: msg.message || '',
        isUser: msg.role === 'user',
        suggestions: (msg.metadata as { suggestions?: unknown } | undefined)?.suggestions,
      }))
      onLoadConversation(chatMessages)
      onClose()
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 glass-strong border-r border-border/50
          transform transition-all duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <h2 className="font-bold text-lg">{t.chat.history}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden rounded-xl hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm">{t.common.loading}</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">{t.chat.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation, index) => (
                <Card
                  key={conversation.id}
                  className={`p-3 cursor-pointer border border-border/50 bg-white/50 dark:bg-gray-800/50 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 card-hover animate-slide-up stagger-${Math.min(index + 1, 5)}`}
                  style={{ opacity: 0 }}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-gradient-primary shadow-sm shadow-primary/30" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground line-clamp-1">
                          {truncateMessage(conversation.firstMessage, 28)}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground/60 shrink-0 ml-2">
                          <Clock className="w-3 h-3" />
                          <span className="text-[10px]">
                            {formatDate(conversation.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {truncateMessage(conversation.lastMessage, 45)}
                      </p>
                      <span className="text-[10px] text-muted-foreground/60 mt-1.5 block">
                        {conversation.messageCount} {conversation.messageCount === 1 ? t.chat.message : t.chat.messages}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
