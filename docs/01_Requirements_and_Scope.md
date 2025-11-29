# 01. Requirements and Scope

## 1. Project Overview
**Product Name:** NutriChat
**Platform:** Web Application (Mobile-First Design), optimized for future Zalo Mini App integration.
**Core Value:** An AI-powered nutrition assistant that helps users decide what to eat and tracks their daily nutrition intake through a conversational interface.

## 2. User Personas
*   **The Indecisive Eater:** Wants quick suggestions for meals based on vague cravings (e.g., "something hot and spicy").
*   **The Health Conscious:** Wants to track calories and macros roughly without tedious manual entry.

## 3. Functional Requirements

### 3.1. Authentication & User Profile
*   **Guest Mode (MVP):**
    *   Users do not need to sign in.
    *   User identity is maintained via a generated `guestId` stored in the browser's `LocalStorage`.
    *   All data (chat history, food logs) is associated with this `guestId`.
    *   *Note:* If the user clears cache or changes devices, data is lost (Acceptable for Hackathon MVP).

### 3.2. AI Nutrition Chat (Core Feature)
*   **Input:** User types natural language queries (Vietnamese).
    *   *Examples:* "Sáng nay ăn gì cho healthy?", "Đang mưa lạnh, thèm món nước nóng."
*   **Processing:**
    *   System sends input to Backend -> AI (Groq).
    *   AI analyzes intent and context.
    *   AI returns a structured list of 3 Vietnamese dish suggestions.
*   **Output:**
    *   Chat interface displays a "Bot Message" containing text and a carousel/list of **Food Cards**.
    *   **Food Card Content:**
        *   Dish Name (e.g., "Phở Bò").
        *   Estimated Calories (e.g., "450 kcal").
        *   Image: A static placeholder image based on category (e.g., Noodle, Rice, Vegan).

### 3.3. Food Details & Logging
*   **Interaction:** User clicks on a Food Card.
*   **Detail View (Modal/Sheet):**
    *   Shows detailed macros: Protein (g), Carbs (g), Fat (g).
    *   Shows a brief list of main ingredients.
*   **Action:** "Eat this" button.
    *   Clicking adds the item to the user's **Daily Log**.
    *   Updates the local "Today's Intake" counters.

### 3.4. Health Dashboard
*   **Overview:** A dedicated tab/screen to view consumption stats.
*   **Metrics:**
    *   **Total Calories:** Progress bar vs. a default target (e.g., 2000 kcal).
    *   **Macro Distribution:** A Pie Chart showing the ratio of Protein/Carbs/Fat.
*   **History Log:** A simple list of items eaten "Today".
    *   *Format:* [Time] - [Dish Name] - [Calories].

## 4. Non-Functional Requirements
*   **Performance:** Chat response time should be under 3 seconds (leveraging Groq's speed).
*   **Responsiveness:** UI must look native on mobile screens (iPhone/Android dimensions) to simulate Zalo Mini App experience.
*   **Data Persistence:** Data stored in Firebase Firestore, linked by `guestId`.

## 5. Constraints & Assumptions
*   **Images:** We will use a static set of assets (e.g., 5-10 generic food images) to avoid complexity with image search APIs.
*   **Accuracy:** Nutritional values are AI-estimates, not medically verified data.
