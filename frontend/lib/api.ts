import axios from 'axios'
import type {
  ChatRequest,
  ChatResponse,
  CreateFoodLogRequest,
  DailySummary,
  ApiResponse,
  FoodSuggestion,
  UserHealthData,
  UpdateUserHealthRequest,
  CookingGuide,
  CookingGuideRequest
} from '@/types/api'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_SERVER || 'http://localhost:3002'

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Chat API
export const chatApi = {
  sendMessage: async (
    request: ChatRequest,
  ): Promise<ApiResponse<ChatResponse>> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>(
      '/chat',
      request,
    )
    return response.data
  },

  getHistory: async (
    id: string,
    limit = 50,
    isGuest = true,
  ): Promise<ApiResponse<unknown[]>> => {
    const params: Record<string, unknown> = { limit }
    if (isGuest) {
      params.guestId = id
    } else {
      params.userId = id
    }
    
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      '/chat/history',
      { params },
    )
    return response.data
  },

  getCookingGuide: async (
    request: CookingGuideRequest,
  ): Promise<ApiResponse<CookingGuide>> => {
    const response = await apiClient.post<ApiResponse<CookingGuide>>(
      '/chat/cooking-guide',
      request,
    )
    return response.data
  },

  getCookingGuideById: async (
    id: string,
  ): Promise<ApiResponse<CookingGuide>> => {
    const response = await apiClient.get<ApiResponse<CookingGuide>>(
      `/chat/cooking-guide/${id}`,
    )
    return response.data
  },

  getCookingGuideHistory: async (
    id: string,
    limit = 50,
    isGuest = true,
  ): Promise<ApiResponse<CookingGuide[]>> => {
    const params: Record<string, unknown> = { limit }
    if (isGuest) {
      params.guestId = id
    } else {
      params.userId = id
    }

    const response = await apiClient.get<ApiResponse<CookingGuide[]>>(
      '/chat/cooking-guide/history',
      { params },
    )
    return response.data
  },
}

// Food Log API
export const foodLogApi = {
  create: async (
    request: CreateFoodLogRequest,
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.post<ApiResponse<unknown>>(
      '/food-logs',
      request,
    )
    return response.data
  },

  getSummary: async (
    id: string,
    date?: string,
    isGuest = true
  ): Promise<ApiResponse<DailySummary>> => {
    const params: Record<string, unknown> = { date }
    if (isGuest) {
      params.guestId = id
    } else {
      params.userId = id
    }
    
    const response = await apiClient.get<ApiResponse<DailySummary>>(
      '/summary',
      { params },
    )
    return response.data
  },

  update: async (
    id: string,
    data: Partial<CreateFoodLogRequest>
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.put<ApiResponse<unknown>>(
      `/food-logs/${id}`,
      data
    )
    return response.data
  },

  delete: async (
    id: string
  ): Promise<ApiResponse<unknown>> => {
    const response = await apiClient.delete<ApiResponse<unknown>>(
      `/food-logs/${id}`
    )
    return response.data
  }
}

// User API
export const userApi = {
  getHealthData: async (
    id: string,
    isGuest = true
  ): Promise<ApiResponse<UserHealthData>> => {
    const params: Record<string, unknown> = {}
    if (isGuest) {
      params.guestId = id
    } else {
      params.userId = id
    }
    
    const response = await apiClient.get<ApiResponse<UserHealthData>>(
      '/user/health',
      { params }
    )
    return response.data
  },

  updateHealthData: async (
    id: string,
    data: UpdateUserHealthRequest,
    isGuest = true
  ): Promise<ApiResponse<UserHealthData>> => {
    const params: Record<string, unknown> = {}
    if (isGuest) {
      params.guestId = id
    } else {
      params.userId = id
    }
    
    const response = await apiClient.put<ApiResponse<UserHealthData>>(
      '/user/health',
      data,
      { params }
    )
    return response.data
  },
}

export default apiClient
