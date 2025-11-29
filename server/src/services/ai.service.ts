import Groq from 'groq-sdk'
import { z } from 'zod/v4'

// Schema for food suggestion response
const foodSuggestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  calories: z.number(),
  macros: z.object({
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  description: z.string(),
  category: z.enum(['noodle', 'rice', 'soup', 'salad', 'fastfood', 'drink', 'other']),
  ingredients: z.array(z.string()).optional(),
})

const chatResponseSchema = z.object({
  reply: z.string(),
  suggestions: z.array(foodSuggestionSchema).length(3),
})

export type FoodSuggestion = z.infer<typeof foodSuggestionSchema>
export type ChatResponse = z.infer<typeof chatResponseSchema>

/**
 * AI Service for generating food suggestions using Groq
 */
export class AIService {
  private groq: Groq
  private model: string

  constructor() {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set in environment variables')
    }

    this.groq = new Groq({
      apiKey,
    })

    // Use model from env or default to llama-3.1-70b-versatile
    this.model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b'
  }

  /**
   * System prompt for the AI assistant
   */
  private getSystemPrompt(): string {
    return `You are a nutritional assistant API. You receive a user message and must return a JSON object. Do not output markdown. The JSON must contain a 'reply' string (friendly, Vietnamese) and a 'suggestions' array of exactly 3 items. Each item must have:
- id: unique identifier (string)
- name: dish name in Vietnamese (string)
- calories: estimated calories (number)
- macros: object with protein (grams), carbs (grams), fat (grams) as numbers
- description: brief description in Vietnamese (string)
- category: one of "noodle", "rice", "soup", "salad", "fastfood", "drink", "other" (string)
- ingredients: optional array of main ingredients (array of strings)

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`
  }

  /**
   * Generate food suggestions based on user message
   */
  async generateFoodSuggestions(
    userMessage: string,
  ): Promise<ChatResponse> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(),
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      })

      const content = completion.choices[0]?.message?.content

      if (!content) {
        throw new Error('No response from AI')
      }

      // Parse JSON response
      let parsedResponse: unknown
      try {
        parsedResponse = JSON.parse(content)
      } catch (error) {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[1])
        } else {
          throw new Error('Failed to parse AI response as JSON')
        }
      }

      // Validate response structure
      const validated = chatResponseSchema.parse(parsedResponse)

      return validated
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('AI response validation error:', error.errors)
        throw new Error(
          `Invalid AI response format: ${error.errors.map((e) => e.message).join(', ')}`,
        )
      }

      if (error instanceof Error) {
        throw error
      }

      throw new Error('Unknown error in AI service')
    }
  }
}

