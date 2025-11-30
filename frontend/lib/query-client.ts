import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
      // Retry failed requests 2 times
      retry: 2,
      // Refetch on window focus (when user returns to tab)
      refetchOnWindowFocus: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Query keys for type-safe cache management
export const queryKeys = {
  summary: (id: string, date: string) => ['summary', id, date] as const,
  healthData: (id: string) => ['healthData', id] as const,
  chatHistory: (id: string) => ['chatHistory', id] as const,
  cookingGuide: (id: string) => ['cookingGuide', id] as const,
  cookingGuideHistory: (id: string) => ['cookingGuideHistory', id] as const,
}

