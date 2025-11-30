'use client'

import { MessageSquare, X, Loader2, Clock, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { useLanguage } from '@/contexts/LanguageContext'
import { useChatHistory, type Conversation, type ChatHistoryItem } from '@/hooks/useQueries'

interface ConversationMessage {
  id: string
  text: string
  isUser: boolean
  suggestions?: unknown
}

interface ChatHistorySidebarProps {
  isOpen: boolean
  onClose: () => void
  onLoadConversation?: (messages: ConversationMessage[]) => void
  /** @deprecated No longer needed - hook uses UserContext */
  guestId?: string | null
  /** @deprecated No longer needed - hook uses UserContext */
  userId?: string | null
}

export function ChatHistorySidebar({
  isOpen,
  onClose,
  onLoadConversation,
}: ChatHistorySidebarProps) {
  const { t, language } = useLanguage()
  
  // Auto-fetch chat history on mount with caching (limited to 10 conversations)
  const { 
    data: conversations = [], 
    isLoading, 
    isFetching,
    refetch 
  } = useChatHistory(100)

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

  const handleConversationClick = (conversation: Conversation) => {
    if (onLoadConversation && conversation.messages.length > 0) {
      const chatMessages: ConversationMessage[] = conversation.messages.map((msg: ChatHistoryItem, index: number) => ({
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
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">{t.chat.history}</h2>
              {isFetching && !isLoading && (
                <RefreshCw className="h-3 w-3 animate-spin text-primary" />
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl hover:bg-muted h-8 w-8"
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden rounded-xl hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
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
