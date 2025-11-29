'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, X, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { chatApi } from '@/lib/api'

interface ChatHistoryItem {
  id: string
  message: string
  role: 'user' | 'assistant'
  createdAt: string | Date
  metadata?: any
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
  const [history, setHistory] = useState<ChatHistoryItem[]>([])
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
        // Log first few items to check metadata
        console.log('History API Response (first 3):', (response.data as any[]).slice(0, 3))

        // Transform API response to ChatHistoryItem format
        const items = (response.data as any[]).map((item: any) => ({
          id: item.id || item.messageId || Date.now().toString(),
          message: item.message || item.text || '',
          role: item.role || 'user',
          createdAt: item.createdAt || item.timestamp || new Date(),
          metadata: item.metadata,
        }))
        console.log('Transformed History Items (with metadata):', items.filter(i => i.role === 'assistant' && i.metadata?.suggestions))
        
        setHistory(items)
        
        // Group messages into conversations
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

  // Group messages into conversations based on time gaps
  const groupMessagesIntoConversations = (messages: ChatHistoryItem[]): Conversation[] => {
    if (messages.length === 0) return []

    const conversations: Conversation[] = []
    let currentConversation: ChatHistoryItem[] = []
    // Reduce gap to 5 minutes to better separate sessions
    // Ideally we should store conversationId in DB, but for now time-based is a fallback
    const CONVERSATION_GAP_MS = 5 * 60 * 1000 

    // Process messages in chronological order (oldest first)
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      const prevMsg = messages[i - 1]

      if (prevMsg) {
        const msgTime = new Date(msg.createdAt).getTime()
        const prevTime = new Date(prevMsg.createdAt).getTime()
        const gap = Math.abs(msgTime - prevTime)

        // If gap is too large, start a new conversation
        if (gap > CONVERSATION_GAP_MS) {
          if (currentConversation.length > 0) {
            conversations.push(createConversation(currentConversation))
            currentConversation = []
          }
        }
      }

      currentConversation.push(msg)
    }

    // Add the last conversation
    if (currentConversation.length > 0) {
      conversations.push(createConversation(currentConversation))
    }

    // Sort conversations by most recent first
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
      // Transform conversation messages to Message format for main chat
      const chatMessages: ConversationMessage[] = conversation.messages.map((msg, index) => ({
        id: msg.id || `msg-${Date.now()}-${index}`,
        text: msg.message || '',
        isUser: msg.role === 'user',
        suggestions: msg.metadata?.suggestions, // Get suggestions from metadata if available
      }))
      console.log('Loading conversation:', conversation.id, 'with', chatMessages.length, 'messages', chatMessages)
      onLoadConversation(chatMessages)
      onClose() // Close sidebar on mobile after selecting
    } else {
      console.warn('Cannot load conversation: no messages or callback missing', conversation)
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <h2 className="font-semibold text-lg">{t.chat.history}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.chat.noHistory}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-orange-500" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          {truncateMessage(conversation.firstMessage, 30)}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatDate(conversation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {truncateMessage(conversation.lastMessage, 50)}
                      </p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
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

