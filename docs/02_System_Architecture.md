# 02. System Architecture

## 1. High-Level Architecture

```mermaid
graph TD
    User[User (Mobile Web)]
    FE[Frontend: Next.js 14]
    BE[Backend: Node.js Express]
    DB[(Database: Firebase Firestore)]
    AI[AI Engine: Groq Cloud]

    User <-->|Interacts| FE
    FE <-->|REST API| BE
    BE <-->|Read/Write| DB
    BE <-->|Prompt & Completion| AI
```

## 2. Tech Stack Details

### Frontend (Client)
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Shadcn/UI (Components)
*   **State Management:** React Context API (for managing `guestId` and global loading states).
*   **HTTP Client:** Axios or Fetch API.
*   **Charts:** Recharts (for the Macro Pie Chart).

### Backend (Server)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Validation:** Zod (for request body validation).
*   **AI SDK:** `groq-sdk` (Official Node.js library for Groq).

### Database (Firebase)
*   **Service:** Cloud Firestore.
*   **Structure:** NoSQL Document Store.

## 3. Database Schema (Firestore)

### Collection: `users`
*   *Document ID:* `guestId` (UUID generated on client)
*   *Fields:*
    *   `createdAt`: Timestamp
    *   `lastActive`: Timestamp
    *   `preferences`: Object (Optional - e.g., { "allergies": ["peanut"] })

### Collection: `daily_logs`
*   *Document ID:* Auto-generated
*   *Fields:*
    *   `userId`: String (Reference to `users.guestId`)
    *   `date`: String (Format "YYYY-MM-DD")
    *   `items`: Array of Objects
        *   `foodName`: String
        *   `calories`: Number
        *   `protein`: Number
        *   `carbs`: Number
        *   `fat`: Number
        *   `timestamp`: Timestamp

## 4. API Specification (Node.js Express)

### 4.1. Chat & Suggestion
**Endpoint:** `POST /api/chat`
*   **Description:** Processes user message and returns food suggestions.
*   **Request Body:**
    ```json
    {
      "userId": "guest-123",
      "message": "I want something low carb for dinner."
    }
    ```
*   **Response:**
    ```json
    {
      "reply": "Here are some low-carb options for you:",
      "suggestions": [
        {
          "id": "food_01",
          "name": "Grilled Chicken Salad",
          "calories": 350,
          "macros": { "protein": 40, "carbs": 10, "fat": 15 },
          "description": "Fresh greens with grilled chicken breast.",
          "category": "salad" // Used to map static image
        }
      ]
    }
    ```

### 4.2. Log Food
**Endpoint:** `POST /api/log`
*   **Description:** Saves a selected food item to the user's daily log.
*   **Request Body:**
    ```json
    {
      "userId": "guest-123",
      "date": "2023-11-29",
      "foodItem": {
        "name": "Grilled Chicken Salad",
        "calories": 350,
        "protein": 40,
        "carbs": 10,
        "fat": 15
      }
    }
    ```
*   **Response:** `{ "success": true, "message": "Logged successfully" }`

### 4.3. Get Daily Summary
**Endpoint:** `GET /api/summary`
*   **Query Params:** `?userId=guest-123&date=2023-11-29`
*   **Response:**
    ```json
    {
      "totalCalories": 350,
      "totalMacros": { "protein": 40, "carbs": 10, "fat": 15 },
      "history": [ ...list of items... ]
    }
    ```

## 5. AI Prompt Engineering Strategy
*   **System Prompt:**
    > "You are a nutritional assistant API. You receive a user message and must return a JSON object. Do not output markdown. The JSON must contain a 'reply' string (friendly, Vietnamese) and a 'suggestions' array of 3 items. Each item must have name, calories, macros (protein, carbs, fat), description, and a broad category (noodle, rice, soup, salad, fastfood, drink, other)."
*   **Model:** `llama3-70b-8192` (via Groq) for best balance of Vietnamese understanding and JSON instruction following.
