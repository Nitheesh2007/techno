# 🥑 Food Expiry Guardian AI

> **"Track Smart. Waste Less. Eat Better."**  
> An intelligent, full-stack food-management ecosystem combining multi-engine OCR scanning, inventory decay prediction, AI recipe generation, macro nutrition analytics, zero-waste meal planning, community food rescue, and interactive culinary assistants.

---

## 🌟 Key Platform Capabilities

### 🎓 1. Interactive Platform Guide & Instructions Module (Dashboard)
- **4-Step Fast Guide Deck**: Embedded right at the top of the Kitchen Dashboard (`/dashboard`) with 1-click action shortcuts:
  1. *Scan or Add Food* (`/scan`)
  2. *Set Expiry Reminder Days* (`/products/add`)
  3. *Cook with 20+ AI Zero-Waste Recipes* (`/recipes`)
  4. *Auto-Restock & 2D Fridge Map* (`/shopping-list` & `/fridge-map`)
- **Collapsible / Expandable**: Easily toggle between showing the full instructions or keeping a compact dashboard view.

### 🌐 2. Complete Multilingual Localization (English ↔ தமிழ் Tamil)
- **1-Click Language Switcher (`🌐 English` ↔ `🌐 தமிழ்`)**: In the Top Bar, dynamically translating all 20 modules, buttons, charts, and entered food items/categories (*e.g. Milk -> பால், Spinach -> கீரை, Produce -> காய்கறி & பழங்கள்*).

### 🔔 3. Customizable Expiry Reminder Lead-Time Selector (`/products/add`)
- Choose how many days before expiration you want to be alerted (*1 day, 2 days [Recommended], 3 days, 5 days, or 7 days*).
- Real-time target alert date calculation (e.g. *“🔔 You will be alerted on August 28, 2026 (2 days before expiry)”*).

### 🍳 4. Smart AI Recipe Generator (20+ International Dishes) (`/recipes`)
- **20+ Zero-Waste Recipes**: Rescues whatever ingredients are currently in your kitchen (*Pasta Primavera, Coconut Curry, Shakshuka, Fried Rice, Skillets, French Toast, Grain Bowls, Minestrone*).
- **Multi-Filter Controls**:
  - **Meal Type**: *All, Breakfast, Lunch, Dinner, ⚡ Quick (< 15 mins)*.
  - **Cuisine**: *Italian, Asian, Mediterranean, Indian, Mexican, American, French, Fusion*.
  - **Dietary**: *High-Protein, Vegetarian, Vegan*.
- **Interactive Guided Cook Mode**: Fullscreen cooking companion with voice narration, step checklist, and interactive countdown timer alarms.

### 📷 5. Multi-Mode Smart Scanner & Barcode Decoder (`/scan`)
- **4 Detection Engines**: Real-time camera viewfinder, photo upload, 1-click test presets, and 13-digit barcode lookup.
- **High-Contrast Barcode Card**: Live rendered SVG zebra bars, exact digits display, and 1-click copy.

### 🛒 6. Smart Shopping List & Auto-Restock (`/shopping-list`)
- **Auto-Restock Intelligence**: Items marked as eaten in inventory automatically transfer here.
- **1-Click Fridge Transfer**: Move purchased items directly into your fridge with auto-calculated shelf-life.
- **Budget Tally & WhatsApp Sharing**.

### 🧊 7. 2D Interactive Fridge Thermal Map (`/fridge-map`)
- Visual 2D schematic of your refrigerator with 7 thermal storage zones and compartment inspection.

### 🥗 8. Nutritional & Macro Horizon (`/nutrition`)
- Real-time macro breakdown (Calories, Protein, Carbs, Fats, Fiber) and Dietitian balance suggestions.

### 📋 9. 3-Minute Kitchen Freshness Audit (`/audit`)
- Guided 4-step wizard (*Cook Urgent*, *Freeze Triage*, *Community Donate*, *Health Summary*) awarding **+150 Quest XP**.

### 📚 10. Food Preservation & Shelf-Life Encyclopedia (`/preservation-guide`)
- The **Ethylene Gas Matrix** (*Emitters vs Sensitive*), storage lifespans across Fridge/Counter/Freezer, and food revival hacks.

### 🌱 11. Food Scrap & Compost Lab (`/compost`)
- Biomass Nitrogen/Carbon ratio meter and recipes for vegetable scrap stock, citrus eco cleaners, and banana plant fertilizer.

### 🏷️ 12. Grocery Deals Radar (`/deals-radar`)
- Surplus grocery markdown tracker (30-50% off) across local supermarkets with 1-click cart addition.

### 🏆 13. Zero-Waste Quests & Eco-Trophies (`/challenges`)
- Weekly missions, Guardian level ranks, daily preservation streaks, and master trophies.

### 🏠 14. Household & Roommate Kitchen (`/household`)
- Shared chore rotation board and food ownership tagger (*Shared vs Personal*).

### 🤝 15. Community Food Rescue (`/community`)
- List surplus food and locate nearby 24/7 Community Fridges and Pantries.

### 📈 16. Sustainability & Waste Analytics (`/analytics`)
- 5-month savings area chart, CO₂ offset, and virtual water footprint tracker.

### 🔔 17. Notifications & Expiry Feed (`/notifications`)
- Real-time alert feed with urgency filters (*Urgent, Warnings, Expired*).

### 🤖 18. FreshBot AI Conversational Assistant
- Voice recognition (Speech-to-Text) and spoken voice (Text-to-Speech) zero-waste assistant.

### ⚙️ 19. Settings & Backup Engine (`/settings`)
- Export & restore inventory in JSON/CSV, toggle synthesizer audio effects, and 100% clean reset.

---

## ⌨️ Spotlight Command Palette (`Ctrl+K` / `Cmd+K`)
Press **`Ctrl+K`** anywhere to search foods or jump between any module instantly.

---

## 🏗️ Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Recharts, Web Audio API, Web Speech API, HTML5 Canvas.
- **Backend**: Python FastAPI, Motor, Pydantic, OpenCV, OCR Engines.
- **Storage Layer**: Hybrid local persistence with 100% clean zero-seed fresh inventory state and sample preset loaders.

---

## 🚀 Getting Started

### 1. Launch Frontend Locally
```bash
npm --prefix frontend install
npm --prefix frontend run dev
```

Open your browser at:
```text
http://127.0.0.1:5173/
```

### 2. Build for Production
```bash
npm --prefix frontend run build
```

---

## 📦 GitHub Repository
- **URL**: [https://github.com/Nitheesh2007/technocultural.git](https://github.com/Nitheesh2007/technocultural.git)
- **Branch**: `main`
