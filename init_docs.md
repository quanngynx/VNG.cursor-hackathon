📂 PROJECT DOCUMENTATION: ZALO NUTRICHAT
1. Project Overview
Zalo NutriChat is a web application (optimized for Zalo Mini App integration or Mobile Web) that acts as an AI-powered Nutrition Assistant. It helps users decide what to eat based on nutritional needs, weather, or preferences, and tracks their daily intake using Generative AI.
2. Tech Stack
Frontend (Client)
Framework: Next.js 14 (App Router).
Styling: Tailwind CSS + Shadcn/UI (for Cards, Modals, Charts).
State Management: React Context API or Zustand.
Icons: Lucide-react.
Networking: Axios.
Backend (Server)
Framework: Node.js (Express.js) with TypeScript.
AI Engine: Groq Cloud API (Recommended models: llama3-70b-8192 or mixtral-8x7b-32768 for low latency).
Database (Hackathon MVP): Firebase
Authenticate: Guest Mode (LocalStorage for MVP)
Validation: Zod.

3. System Architecture & Data Flow
Code snippet
graph LR
    User[User (Zalo/Mobile)] -->|Interaction| FE[Next.js Frontend]
    FE -->|REST API (JSON)| BE[FastAPI Backend]
    BE -->|Prompting| AI[Groq AI]
    AI -->|Structured JSON| BE
    BE -->|Response| FE
    FE -->|Store Data| LocalStorage[Browser Storage] (MVP)



4. Feature Specifications
Feature A: AI Nutrition Chat (Core)
UI: Chat interface similar to ChatGPT/Zalo.
Input: Natural language text (e.g., "I want a soup dish, under 500 calories, spicy").
Process:
Frontend sends text to Backend.
Backend wraps the input with a System Prompt enforcing JSON Array output.
AI analyzes the request -> Suggests suitable Vietnamese dishes -> Estimates nutrition.
Output: A list of interactive Food Cards (Image placeholder, Name, Estimated Calories).
Feature B: Food Detail & Tracking
UI: Modal/Bottom Sheet.
Trigger: User clicks on a specific Food Card.
Display:
Ingredients list.
Macros: Protein, Carbs, Fat.
Action Button: "Eat this" (Add to Daily Log).
Feature C: Health Dashboard
UI: Separate Dashboard Tab.
Display:
Total Calories consumed today.
Macro distribution Pie Chart (Protein/Carb/Fat).
History list of selected foods.

5. API Documentation (FastAPI)
5.1. Pydantic Models
Python
# schemas.py

from pydantic import BaseModel
from typing import List, Optional

class UserQuery(BaseModel):
    message: str
    user_context: Optional[str] = None # e.g., "dieting", "allergic to shrimp"

class NutritionInfo(BaseModel):
    calories: int
    protein: float # grams
    carbs: float # grams
    fat: float # grams

class FoodItem(BaseModel):
    id: str
    name: str
    description: str
    nutrition: NutritionInfo
    ingredients: List[str]
    reason_for_suggestion: str

class ChatResponse(BaseModel):
    reply_text: str # Short conversational intro from AI
    suggested_foods: List[FoodItem]


5.2. Endpoints
POST /api/chat
Description: Receives a natural language query and returns structured food suggestions.
Payload: UserQuery
Response: ChatResponse
AI System Prompt Strategy:
"You are a professional Nutritionist API. You do not return conversational filler. You ONLY return a valid JSON object containing a brief reply and a list of 3 suggested Vietnamese dishes based on the user's request. Estimate nutrition facts accurately."
GET /api/user/summary (Optional for MVP)
Description: Retrieves the daily nutrition summary.
Response: JSON object with total calories and macros.

6. Frontend Structure (Next.js)
Plaintext
/app
  /layout.tsx       # Global layout (Bottom Navigation Bar)
  /page.tsx         # Chat Interface (Main Screen)
  /dashboard
    /page.tsx       # Health Dashboard (Charts & Stats)
  /components
    /ChatBubble.tsx # Renders user/bot messages
    /FoodCard.tsx   # Horizontal scrollable card for suggestions
    /FoodModal.tsx  # Detailed view with "Add" button
    /NutriChart.tsx # Pie chart using Recharts or Chart.js
/lib
  /api.ts           # Axios instance configuration
  /types.ts         # TypeScript interfaces mirroring Pydantic models
  /store.ts         # State management (store selected foods)



7. Implementation Roadmap (Hackathon Strategy)
Phase 1: Backend Core (45 mins)
Initialize FastAPI & Groq Client.
Crucial: Refine the System Prompt to ensure the AI always returns valid JSON (otherwise the Frontend will break).
Test the /chat endpoint using Postman/Swagger.
Phase 2: Frontend Chat UI (60 mins)
Build the Chat UI layout.
Implement FoodCard component.
Integrate Axios to call /chat.
Phase 3: Dashboard & State (45 mins)
Implement logic to save selected foods to localStorage or Global State.
Build the Dashboard page to visualize this data.
Phase 4: UI Polish (30 mins)
Style components to match Zalo's Design System (Blue/White theme).
Ensure mobile responsiveness.

8. Environment Variables
Create a .env file:
Code snippet
# Backend
GROQ_API_KEY=gsk_...
ALLOWED_ORIGINS=*

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000 # Replace with ngrok URL for Zalo integration



