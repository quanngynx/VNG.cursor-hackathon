# 03. UI/UX Flow

## 1. Navigation Structure
The app uses a **Bottom Navigation Bar** (typical for Mobile/Mini Apps) with two main tabs:
1.  **Chat** (Home)
2.  **Dashboard** (Profile/Stats)

## 2. Screen Flows

### Screen 1: Chat Interface (Home)
*   **Header:** "NutriChat" Title + Simple Avatar.
*   **Main Area:** Scrollable Chat History.
    *   *Bot Message:* Left aligned, bubble background.
    *   *User Message:* Right aligned, colored background.
    *   *Suggestion Card:* A horizontal scroll view (Carousel) or stacked cards appearing inside the chat stream after a Bot response.
*   **Footer:** Input field + Send button.

**Interaction - Food Card:**
*   **Visual:** Shows Image (Placeholder), Name, Calories.
*   **Click:** Opens **Food Detail Modal**.

### Screen 2: Food Detail Modal (Overlay)
*   **Header:** Dish Name + Close Button.
*   **Body:**
    *   Large Image (Static).
    *   Description text.
    *   **Nutrition Grid:**
        *   🔥 Calories
        *   🥩 Protein
        *   🍞 Carbs
        *   🥑 Fat
*   **Footer:** Large "Eat this" (Log Food) Button.
    *   *On Click:* Closes modal, shows a "Toast" success message ("Added to your log!"), and updates the Dashboard state.

### Screen 3: Health Dashboard
*   **Header:** "Your Daily Tracker".
*   **Section 1: Calorie Counter**
    *   Progress Bar: [Current / 2000 kcal].
    *   Text: "You have consumed X kcal today."
*   **Section 2: Macro Breakdown**
    *   Pie Chart (Recharts) showing Protein vs Carbs vs Fat.
    *   Legend with gram counts.
*   **Section 3: History**
    *   List of items eaten today.
    *   Each row: "Dish Name" ...... "X kcal".

## 3. Asset Strategy (Static Images)
Since we are not using an Image API, we will map AI categories to local assets in `public/images/`.

| Category | Filename |
| :--- | :--- |
| Noodle | `noodle.png` |
| Rice | `rice.png` |
| Soup | `soup.png` |
| Salad | `salad.png` |
| Fastfood | `fastfood.png` |
| Drink | `drink.png` |
| Other | `default.png` |

*Logic:* The Backend AI will return a `category` field. The Frontend `FoodCard` component will select the image source based on this category.
