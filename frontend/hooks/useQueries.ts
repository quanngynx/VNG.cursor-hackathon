'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { foodLogApi, userApi, chatApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-client'
import { useUser } from '@/contexts/UserContext'
import type { 
  DailySummary, 
  UserHealthData, 
  CreateFoodLogRequest,
  UpdateUserHealthRequest,
  CookingGuide
} from '@/types/api'

/**
 * Hook to get user ID and guest status
 */
function useUserIdentity() {
  const { user, guestId } = useUser()
  const id = user?.uid ?? guestId ?? ''
  const isGuest = !user
  return { id, isGuest }
}

/**
 * Fetch daily summary with caching
 */
export function useDailySummary(date: string) {
  const { id, isGuest } = useUserIdentity()
  
  return useQuery({
    queryKey: queryKeys.summary(id, date),
    queryFn: async () => {
      const response = await foodLogApi.getSummary(id, date, isGuest)
      if (!response.success) throw new Error(response.error)
      return response.data as DailySummary
    },
    enabled: !!id,
    // Summary data can be stale for 2 minutes
    staleTime: 2 * 60 * 1000,
  })
}

/**
 * Fetch user health data with caching
 */
export function useHealthData() {
  const { id, isGuest } = useUserIdentity()
  
  return useQuery({
    queryKey: queryKeys.healthData(id),
    queryFn: async () => {
      const response = await userApi.getHealthData(id, isGuest)
      if (!response.success) throw new Error(response.error)
      return response.data as UserHealthData
    },
    enabled: !!id,
    // Health data rarely changes, cache for 10 minutes
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Mutation to update health data
 */
export function useUpdateHealthData() {
  const { id, isGuest } = useUserIdentity()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateUserHealthRequest) => {
      const response = await userApi.updateHealthData(id, data, isGuest)
      if (!response.success) throw new Error(response.error)
      return response.data as UserHealthData
    },
    onSuccess: (data) => {
      // Update cache immediately with new data
      queryClient.setQueryData(queryKeys.healthData(id), data)
    },
  })
}

/**
 * Mutation to create food log
 */
export function useCreateFoodLog() {
  const { id, isGuest } = useUserIdentity()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Omit<CreateFoodLogRequest, 'userId' | 'guestId'>) => {
      const request = {
        ...data,
        userId: id,
        guestId: isGuest ? id : (id || 'guest'),
      } as CreateFoodLogRequest
      const response = await foodLogApi.create(request)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: () => {
      // Invalidate summary to refetch with new food log
      queryClient.invalidateQueries({ 
        queryKey: ['summary', id],
        exact: false 
      })
    },
  })
}

/**
 * Mutation to update food log
 */
export function useUpdateFoodLog() {
  const { id } = useUserIdentity()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ logId, data }: { logId: string; data: Partial<CreateFoodLogRequest> }) => {
      const response = await foodLogApi.update(logId, data)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['summary', id],
        exact: false 
      })
    },
  })
}

/**
 * Mutation to delete food log
 */
export function useDeleteFoodLog() {
  const { id } = useUserIdentity()
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (logId: string) => {
      const response = await foodLogApi.delete(logId)
      if (!response.success) throw new Error(response.error)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['summary', id],
        exact: false 
      })
    },
  })
}

/**
 * Fetch cooking guide history with caching
 */
export function useCookingGuideHistory() {
  const { id, isGuest } = useUserIdentity()
  
  return useQuery({
    queryKey: queryKeys.cookingGuideHistory(id),
    queryFn: async () => {
      const response = await chatApi.getCookingGuideHistory(id, 50, isGuest)
      if (!response.success) throw new Error(response.error)
      return response.data as CookingGuide[]
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Fetch single cooking guide by ID
 */
export function useCookingGuide(guideId: string) {
  return useQuery({
    queryKey: queryKeys.cookingGuide(guideId),
    queryFn: async () => {
      const response = await chatApi.getCookingGuideById(guideId)
      if (!response.success) throw new Error(response.error)
      return response.data as CookingGuide
    },
    enabled: !!guideId,
    // Cooking guides don't change, cache for longer
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * Chat history item type
 */
export interface ChatHistoryItem {
  id: string
  message: string
  role: 'user' | 'assistant'
  createdAt: string | Date
  metadata?: unknown
}

/**
 * Grouped conversation type
 */
export interface Conversation {
  id: string
  firstMessage: string
  lastMessage: string
  timestamp: Date
  messageCount: number
  messages: ChatHistoryItem[]
}

/**
 * Group messages into conversations based on time gap
 */
function groupMessagesIntoConversations(messages: ChatHistoryItem[]): Conversation[] {
  if (messages.length === 0) return []

  const conversations: Conversation[] = []
  let currentConversation: ChatHistoryItem[] = []
  const CONVERSATION_GAP_MS = 5 * 60 * 1000 // 5 minutes

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

function createConversation(messages: ChatHistoryItem[]): Conversation {
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

/**
 * Fetch chat history with caching - auto fetches on mount
 * Limited to 10 most recent conversations
 */
export function useChatHistory(limit = 100) {
  const { id, isGuest } = useUserIdentity()
  
  return useQuery({
    queryKey: queryKeys.chatHistory(id),
    queryFn: async () => {
      const response = await chatApi.getHistory(id, limit, isGuest)
      if (!response.success) throw new Error(response.error)
      
      const items = (response.data as ChatHistoryItem[]).map((item) => ({
        id: item.id || Date.now().toString(),
        message: item.message || '',
        role: item.role || 'user',
        createdAt: item.createdAt || new Date(),
        metadata: item.metadata,
      }))
      
      // Group into conversations and limit to 10
      const conversations = groupMessagesIntoConversations(items)
      return conversations.slice(0, 10)
    },
    enabled: !!id,
    // Chat history can be stale for 1 minute
    staleTime: 1 * 60 * 1000,
  })
}

