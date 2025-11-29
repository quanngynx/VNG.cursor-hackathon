'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { chatApi, foodLogApi } from '@/lib/api'
import { ChatBubble } from '@/components/ChatBubble'
import { ChatInput } from '@/components/ChatInput'
import { FoodDetailModal } from '@/components/FoodDetailModal'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ChatHistorySidebar } from '@/components/ChatHistorySidebar'
import { FoodSuggestion, ChatResponse } from '@/types/api'
import { toast } from 'sonner'
import { Loader2, Menu, Plus } from 'lucide-react'
import { BottomNav } from '@/components/BottomNav'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  isUser: boolean
  suggestions?: FoodSuggestion[]
}

export default function ChatPage() {
  const { user, guestId, isLoading: userLoading } = useUser()
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFood, setSelectedFood] = useState<FoodSuggestion | null>(null)
  const [isLogging, setIsLogging] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewChat = () => {
    setMessages([])
    toast.success(t.chat.newChatCreated)
  }

  const handleSend = async (text: string) => {
    if ((!user && !guestId) || userLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    }
    setMessages((prev) => [...prev, userMessage])

    setIsLoading(true)

    try {
      const response = await chatApi.sendMessage({
        guestId: guestId || 'guest', // Fallback
        userId: user?.uid,
        message: text,
      })

      if (response.success && response.data) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.data.reply,
          isUser: false,
          suggestions: response.data.suggestions,
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error(response.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error(t.chat.cannotSendMessage)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t.chat.errorOccurred,
        isUser: false,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFoodClick = (food: FoodSuggestion) => {
    setSelectedFood(food)
  }

  const handleEat = async (food: FoodSuggestion) => {
    if (!user && !guestId) return

    setIsLogging(true)

    try {
      // Determine meal type based on current time
      const hour = new Date().getHours()
      let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack'
      if (hour >= 5 && hour < 11) mealType = 'breakfast'
      else if (hour >= 11 && hour < 15) mealType = 'lunch'
      else if (hour >= 17 && hour < 21) mealType = 'dinner'

      const response = await foodLogApi.create({
        guestId: user ? undefined : guestId!,
        userId: user ? user.uid : (guestId || 'guest'), // Required by schema
        foodName: food.name,
        mealType,
        portion: '1 phần',
        nutrition: {
          calories: food.calories,
          protein: food.macros.protein,
          carbs: food.macros.carbs,
          fat: food.macros.fat,
        },
        loggedAt: new Date(),
      })

      if (response.success) {
        toast.success(t.food.loggedSuccess.replace('{name}', food.name))
        setSelectedFood(null)
      } else {
        throw new Error(response.error || 'Failed to log food')
      }
    } catch (error) {
      console.error('Log food error:', error)
      toast.error(t.food.loggedFailed)
    } finally {
      setIsLogging(false)
    }
  }

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        guestId={guestId}
        userId={user?.uid}
        onLoadConversation={(conversationMessages) => {
          // conversationMessages already in Message format
          console.log('Received conversation messages:', conversationMessages)
          const formattedMessages: Message[] = conversationMessages.map((msg, index) => ({
            id: msg.id || `msg-${Date.now()}-${index}`,
            text: msg.text,
            isUser: msg.isUser,
            suggestions: msg.suggestions,
          }))
          setMessages(formattedMessages)
          // Scroll to bottom after a short delay to ensure DOM is updated
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">{t.header.nutrichat}</h1>
              <p className="text-sm text-gray-500">{t.header.aiNutritionAssistant}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.chat.newChat}</span>
            </Button>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">{t.chat.welcome}</p>
              <p className="text-sm">
                {t.chat.welcomeSubtitle}
              </p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <ChatBubble
            key={message.id || `msg-${index}`}
            message={message.text}
            isUser={message.isUser}
            suggestions={message.suggestions}
            onFoodClick={handleFoodClick}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading || (!user && !guestId)} />
      </div>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        open={!!selectedFood}
        onClose={() => setSelectedFood(null)}
        onEat={handleEat}
        isLoading={isLogging}
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
