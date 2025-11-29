'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { chatApi, foodLogApi } from '@/lib/api'
import { ChatBubble, TypingIndicator } from '@/components/ChatBubble'
import { ChatInput } from '@/components/ChatInput'
import { FoodDetailModal } from '@/components/FoodDetailModal'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ChatHistorySidebar } from '@/components/ChatHistorySidebar'
import { FoodSuggestion } from '@/types/api'
import { toast } from 'sonner'
import { Loader2, Menu, Plus, Sparkles, Utensils } from 'lucide-react'
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
        guestId: guestId || 'guest',
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
      const hour = new Date().getHours()
      let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'snack'
      if (hour >= 5 && hour < 11) mealType = 'breakfast'
      else if (hour >= 11 && hour < 15) mealType = 'lunch'
      else if (hour >= 17 && hour < 21) mealType = 'dinner'

      const response = await foodLogApi.create({
        guestId: user ? undefined : guestId!,
        userId: user ? user.uid : (guestId || 'guest'),
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-warm">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-xl shadow-primary/30 animate-bounce-subtle">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-warm pb-20">
      {/* Chat History Sidebar */}
      <ChatHistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        guestId={guestId}
        userId={user?.uid}
        onLoadConversation={(conversationMessages) => {
          const formattedMessages: Message[] = conversationMessages.map((msg, index) => ({
            id: msg.id || `msg-${Date.now()}-${index}`,
            text: msg.text,
            isUser: msg.isUser,
            suggestions: msg.suggestions as FoodSuggestion[] | undefined,
          }))
          setMessages(formattedMessages)
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        }}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="glass-strong border-b border-border/50 px-4 py-3 flex justify-between items-center animate-slide-up">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="lg:hidden rounded-xl hover:bg-primary/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">{t.header.nutrichat}</h1>
                <p className="text-xs text-muted-foreground">{t.header.aiNutritionAssistant}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="flex items-center gap-2 rounded-xl hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.chat.newChat}</span>
            </Button>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar bg-gradient-chat">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center animate-fade-in">
                {/* Welcome illustration */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-primary flex items-center justify-center shadow-2xl shadow-primary/30 animate-float">
                    <Sparkles className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/10 rounded-full blur-sm" />
                </div>
                
                <h2 className="text-2xl font-bold text-gradient mb-2">{t.chat.welcome}</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  {t.chat.welcomeSubtitle}
                </p>

                {/* Quick suggestions */}
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {['Hôm nay ăn gì?', 'Món healthy', 'Phở bò'].map((suggestion, index) => (
                    <button
                      key={suggestion}
                      onClick={() => handleSend(suggestion)}
                      className={`px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 card-hover animate-slide-up stagger-${index + 1}`}
                      style={{ opacity: 0 }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              suggestions={message.suggestions}
              onFoodClick={handleFoodClick}
            />
          ))}

          {isLoading && <TypingIndicator />}

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
