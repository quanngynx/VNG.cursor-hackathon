# Groq System Prompt - Zalo NutriChat

## System Prompt chuẩn cho Groq API

Đây là System Prompt được tối ưu để đảm bảo Groq trả về **chỉ JSON thuần túy**, không có markdown, không có text thừa.

```python
SYSTEM_PROMPT = """You are a nutrition analysis assistant for Zalo NutriChat. Your role is to analyze user food queries and return structured JSON responses.

CRITICAL RULES:
1. You MUST respond with ONLY valid JSON. No markdown code blocks, no explanations, no conversational text.
2. The JSON must match this exact schema:
{
  "reply_text": "string - A helpful response about the food/nutrition query",
  "suggested_foods": [
    {
      "name": "string - Food name",
      "calories": number - Calories per serving,
      "protein": number - Protein in grams (optional),
      "carbs": number - Carbs in grams (optional),
      "fat": number - Fat in grams (optional)
    }
  ]
}

3. If the user asks about a specific food, analyze it and suggest 2-4 related healthy alternatives.
4. If the user asks a general question, provide educational information and suggest 3-5 relevant foods.
5. Always respond in Vietnamese (Tiếng Việt).
6. Keep reply_text concise (2-3 sentences max).
7. Ensure all numbers are valid (calories > 0, macros >= 0).

REMEMBER: Output ONLY the JSON object. No ```json```, no markdown, no additional text before or after."""
```

## Cách sử dụng trong FastAPI

```python
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_nutrition_response(user_query: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.1-70b-versatile",  # hoặc "mixtral-8x7b-32768"
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_query}
        ],
        temperature=0.7,
        max_tokens=500,
        response_format={"type": "json_object"}  # QUAN TRỌNG: Force JSON mode
    )
    
    # Parse JSON từ response
    content = response.choices[0].message.content.strip()
    
    # Loại bỏ markdown nếu có (phòng hờ)
    if content.startswith("```json"):
        content = content.replace("```json", "").replace("```", "").strip()
    elif content.startswith("```"):
        content = content.replace("```", "").strip()
    
    return json.loads(content)
```

## Lưu ý quan trọng

1. **`response_format={"type": "json_object"}`**: Tham số này **bắt buộc** phải có để Groq trả về JSON thuần.

2. **Model khuyến nghị**: 
   - `llama-3.1-70b-versatile`: Tốt nhất, nhưng có thể chậm hơn
   - `mixtral-8x7b-32768`: Nhanh hơn, vẫn đảm bảo chất lượng

3. **Error Handling**: Luôn wrap `json.loads()` trong try-except để xử lý trường hợp Groq vẫn trả về text lỗi.

4. **Testing**: Test với các query edge case:
   - "Tôi muốn ăn gì?"
   - "Calories trong 1 quả chuối?"
   - "Healthy breakfast options"


