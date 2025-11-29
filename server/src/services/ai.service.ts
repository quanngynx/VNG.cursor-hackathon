import Groq from 'groq-sdk';
import { z } from 'zod/v4';

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
  category: z.enum([
    'noodle',
    'rice',
    'soup',
    'salad',
    'fastfood',
    'drink',
    'other',
  ]),
  ingredients: z.array(z.string()).optional(),
  image_prompt: z
    .string()
    .describe('Short English description for image generation (max 5 words)'),
  image: z.string().optional(),
});

const chatResponseSchema = z.object({
  reply: z.string(),
  suggestions: z.array(foodSuggestionSchema).length(3),
});

// Schema for cooking step
const cookingStepSchema = z.object({
  step: z.number(),
  title: z.string(),
  description: z.string(),
  duration: z.string().optional(),
  tips: z.string().optional(),
  image_prompt: z
    .string()
    .describe('Short English description for step image generation'),
  image: z.string().optional(),
});

// Schema for cooking guide response
const cookingGuideSchema = z.object({
  dishName: z.string(),
  servings: z.number(),
  totalTime: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amount: z.string(),
    }),
  ),
  steps: z.array(cookingStepSchema),
  chefTips: z.array(z.string()).optional(),
});

export type FoodSuggestion = z.infer<typeof foodSuggestionSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;
export type CookingStep = z.infer<typeof cookingStepSchema>;
export type CookingGuide = z.infer<typeof cookingGuideSchema>;

/**
 * AI Service for generating food suggestions using Groq
 */
export class AIService {
  private groq: Groq;
  private model: string;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set in environment variables');
    }

    this.groq = new Groq({
      apiKey,
    });

    // Use model from env or default to llama-3.1-70b-versatile
    this.model = process.env.GROQ_MODEL || 'openai/gpt-oss-20b';
  }

  /**
   * System prompt for the AI assistant
   */
  private getSystemPrompt(): string {
    return `You are a nutritional assistant API. You receive a user message and must return a JSON object. Do not output markdown.

CRITICAL LANGUAGE RULE: You MUST detect the language of the user's message and respond ENTIRELY in that SAME language.
- If the user writes in ENGLISH (e.g., "I want something spicy", "suggest me food") → ALL text fields (reply, name, description, ingredients) MUST be in ENGLISH
- If the user writes in VIETNAMESE (e.g., "Tôi muốn ăn gì đó cay", "gợi ý món ăn") → ALL text fields MUST be in VIETNAMESE
- DO NOT mix languages. If user speaks English, dish names should be English (e.g., "Spicy Chicken Salad", "Korean Spicy Noodles", "Buffalo Wings")

The JSON must contain a 'reply' string (friendly, in the user's language) and a 'suggestions' array of exactly 3 items. Each item must have:
- id: unique identifier (string)
- name: dish name - MUST BE IN THE USER'S LANGUAGE (e.g., English user → "Spicy Chicken Tacos", Vietnamese user → "Gỏi gà cay")
- calories: estimated calories (number)
- macros: object with protein (grams), carbs (grams), fat (grams) as numbers
- description: brief description - MUST BE IN THE USER'S LANGUAGE
- category: one of "noodle", "rice", "soup", "salad", "fastfood", "drink", "other" (string)
- ingredients: optional array of main ingredients - MUST BE IN THE USER'S LANGUAGE
- image_prompt: REQUIRED - short English description (3-5 words) for image generation. This is the ONLY field that should always be in English.

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`;
  }

  /**
   * Generate food suggestions based on user message
   */
  async generateFoodSuggestions(userMessage: string): Promise<ChatResponse> {
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
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from AI');
      }

      // Parse JSON response
      let parsedResponse: unknown;
      try {
        parsedResponse = JSON.parse(content);
      } catch {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      // Validate response structure
      const validated = chatResponseSchema.parse(parsedResponse);

      // Add image URLs to suggestions
      validated.suggestions = validated.suggestions.map((suggestion) => {
        const prompt =
          suggestion.image_prompt || `${suggestion.name} delicious food`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${suggestion.id}`;
        return {
          ...suggestion,
          image: imageUrl,
        };
      });

      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues || [];
        console.error('AI response validation error:', issues);
        throw new Error(
          `Invalid AI response format: ${issues.map((e) => e.message).join(', ')}`,
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Unknown error in AI service');
    }
  }

  /**
   * System prompt for cooking guide generation
   */
  private getCookingGuidePrompt(language?: string): string {
    const languageInstruction = language
      ? `You MUST respond ENTIRELY in ${language}. All text fields must be in ${language}.`
      : `CRITICAL LANGUAGE DETECTION: Analyze the dish name to determine the language, then respond ENTIRELY in that language.

LANGUAGE DETECTION RULES:
- If dish name contains Vietnamese characters (ă, â, đ, ê, ô, ơ, ư, diacritics) OR is clearly Vietnamese (e.g., "Phở", "Bún bò", "Gỏi gà") → Respond in VIETNAMESE
- If dish name is in English alphabet without Vietnamese diacritics AND sounds English (e.g., "Spicy Chicken Salad", "Korean Spicy Noodles", "Buffalo Wings") → Respond in ENGLISH

ALL text fields (dishName, ingredient names, step titles, descriptions, tips, chefTips) MUST be in the detected language. DO NOT mix languages.`;

    return `You are a professional chef assistant API. You will receive a dish name and must return a detailed cooking guide in JSON format.

${languageInstruction}

The JSON must contain:
- dishName: name of the dish (string)
- servings: number of servings (number, default 2-4)
- totalTime: total cooking time (string, e.g., "30 minutes")
- difficulty: one of "easy", "medium", "hard" (string)
- ingredients: array of objects with "name" (string) and "amount" (string)
- steps: array of cooking steps (4-6 steps), each step must have:
  - step: step number (number, starting from 1)
  - title: short title for this step (string)
  - description: detailed instruction for this step (string)
  - duration: optional time for this step (string)
  - tips: optional helpful tips (string)
  - image_prompt: REQUIRED and MUST BE UNIQUE FOR EACH STEP - short English description (8-12 words) for generating a DIFFERENT image for each step. Be VERY SPECIFIC about:
    * The exact cooking action happening (chopping, boiling, frying, mixing, etc.)
    * The specific ingredients visible in that step
    * The cooking equipment being used (pan, pot, cutting board, bowl, etc.)
    * The visual state of food (raw, sizzling, golden brown, steaming, etc.)
    Examples for different steps:
    - Step 1: "Fresh raw beef slices and vegetables on wooden cutting board"
    - Step 2: "Boiling water with noodles in large steel pot steam rising"
    - Step 3: "Sizzling beef strips in hot wok with garlic and oil"
    - Step 4: "Mixing fish sauce and lime in small ceramic bowl"
    - Step 5: "Plated noodle soup topped with herbs and lime wedge"
    EACH STEP MUST HAVE A COMPLETELY DIFFERENT IMAGE_PROMPT describing that specific cooking moment!
- chefTips: optional array of general tips (array of strings)

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`;
  }

  /**
   * Generate cooking guide for a dish
   */
  async generateCookingGuide(
    dishName: string,
    language?: string,
  ): Promise<CookingGuide> {
    try {
      const completion = await this.groq.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: this.getCookingGuidePrompt(language),
          },
          {
            role: 'user',
            content: `Please provide a detailed cooking guide for: ${dishName}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from AI');
      }

      // Parse JSON response
      let parsedResponse: unknown;
      try {
        parsedResponse = JSON.parse(content);
      } catch {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('Failed to parse AI response as JSON');
        }
      }

      // Validate response structure
      const validated = cookingGuideSchema.parse(parsedResponse);

      // Add image URLs to steps - each step gets a unique image based on its prompt
      const timestamp = Date.now();
      validated.steps = validated.steps.map((step) => {
        // Use the step's specific image_prompt to generate a unique image
        const prompt = step.image_prompt || `cooking step ${step.step} for ${dishName}`;
        // Create a unique seed combining timestamp, step number, and prompt hash
        const uniqueSeed = `${timestamp}-step${step.step}-${prompt.slice(0, 20).replace(/\s/g, '')}`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=384&nologo=true&seed=${encodeURIComponent(uniqueSeed)}`;
        return {
          ...step,
          image: imageUrl,
        };
      });

      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues || [];
        console.error('Cooking guide validation error:', issues);
        throw new Error(
          `Invalid cooking guide format: ${issues.map((e) => e.message).join(', ')}`,
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Unknown error in cooking guide generation');
    }
  }
}
