# 04. Implementation Plan

## Phase 1: Project Setup & Boilerplate
1.  **Repository Setup:**
    *   Initialize Monorepo structure (optional) or separate folders: `/frontend` and `/backend`.
2.  **Backend (Node.js/Express):**
    *   `npm init`
    *   Install: `express`, `cors`, `dotenv`, `zod`, `groq-sdk`, `firebase-admin`.
    *   Setup TypeScript config (`tsconfig.json`).
    *   Create basic server entry point (`index.ts`).
3.  **Frontend (Next.js):**
    *   `npx create-next-app@latest` (TS, Tailwind, App Router).
    *   Install UI Libs: `shadcn-ui`, `lucide-react`, `axios`, `recharts`.
    *   Setup `components/` folder structure.

## Phase 2: Backend Logic & AI
1.  **Firebase Setup:**
    *   Create Firebase Project.
    *   Download Service Account Key.
    *   Initialize `firebase-admin` in Node.js.
2.  **Groq Integration:**
    *   Get API Key.
    *   Create `services/aiService.ts`.
    *   Implement `generateFoodSuggestions(userMessage)` function with the System Prompt.
3.  **API Endpoints:**
    *   Implement `POST /chat`: Connects AI Service -> Returns JSON.
    *   Implement `POST /log`: Writes to Firestore `daily_logs`.
    *   Implement `GET /summary`: Aggregates Firestore data for a specific date/user.

## Phase 3: Frontend Implementation
1.  **State Management:**
    *   Create `UserContext` to handle `guestId` (check LocalStorage on mount, generate if missing).
2.  **Chat UI:**
    *   Build `ChatBubble` component.
    *   Build `FoodCard` component.
    *   Implement Chat Logic: Send message -> Loading State -> Render Response.
3.  **Food Detail & Logging:**
    *   Build `FoodDetailModal` (using Dialog/Modal component).
    *   Connect "Eat this" button to `POST /log` API.
4.  **Dashboard:**
    *   Fetch data from `GET /summary` on mount.
    *   Render Recharts Pie Chart.
    *   Render History List.

## Phase 4: Polish & Zalo Prep
1.  **Static Assets:**
    *   Collect 5-7 generic food images and place in `public/images`.
    *   Implement mapping logic in `FoodCard`.
2.  **Responsive Check:**
    *   Test on Chrome DevTools (iPhone SE / iPhone 12 dimensions).
3.  **Deployment:**
    *   Deploy Backend (e.g., Render/Railway).
    *   Deploy Frontend (Vercel).
    *   Update Frontend environment variables to point to live Backend URL.
