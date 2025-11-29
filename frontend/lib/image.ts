import { FoodSuggestion } from '@/types/api'

export const getFoodImageUrl = (food: FoodSuggestion, size: { width: number; height: number } = { width: 512, height: 512 }) => {
  // If we have a stored image URL, use it
  if (food.image) {
    return food.image
  }

  // Use image_prompt from AI if available, otherwise fallback to food name
  const prompt = food.image_prompt || `${food.name} delicious food`
  
  // We use the food.id as the seed to ensure the same food always generates the same image
  // We keep nologo=true to remove watermarks
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${size.width}&height=${size.height}&nologo=true&seed=${food.id}`
}
