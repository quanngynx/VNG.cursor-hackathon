import axios from 'axios'
import type {
  ChatRequest,
  ChatResponse,
  CreateFoodLogRequest,
  DailySummary,
  ApiResponse,
  FoodSuggestion
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
    guestId: string,
    limit = 50,
  ): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(
      '/chat/history',
      {
        params: { guestId, limit },
      },
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
    const params: any = { date }
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

export default apiClient
