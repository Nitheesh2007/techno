# 🥑 Food Expiry Guardian AI

> **"Track Smart. Waste Less. Eat Better."**  
> An intelligent, full-stack food-management ecosystem combining multi-engine OCR scanning, inventory decay prediction, AI recipe generation, macro nutrition analytics, zero-waste meal planning, community food rescue, and interactive culinary assistants.

---

## 🌟 20 Integrated Modules & Features

### 🍳 1. AI Culinary & Freshness Engines
1. **Interactive Kitchen Dashboard (`/dashboard`)**: Visual freshness horizons, Recharts expiry distribution bar chart, category donut chart, urgent action triggers, and real-time sustainability savings tracker.
2. **Food Inventory Manager (`/products`)**: Real-time searching, multi-status filters (*Safe*, *Soon*, *Urgent*, *Expired*), sorting, and celebratory waste prevention logging.
3. **Add Product & Autofill (`/products/add`)**: Barcode lookup, storage zone assignment, and shelf-life preset accelerators (`+2d`, `+5d`, `+2w`).
4. **Multi-Mode AI Food Scanner (`/scan`)**: Live camera feed (`navigator.mediaDevices.getUserMedia`), image upload, **1-Click Test Presets** (Milk, Yogurt, Bread, Chicken, Berries), and barcode lookups.
5. **AI Recipe Chef (`/recipes`)**: Recipes matched to expiring items + **Guided Step-by-Step Cooking Mode** with audio countdown timers and voice narration.
6. **Zero-Waste Meal Planner (`/meal-plan`)**: 7-day breakfast/lunch/dinner matrix with **1-Click Auto-Plan** prioritizing expiring ingredients.

### 🛒 2. Grocery & Storage Intelligence
7. **Smart Shopping List & Auto-Restock (`/shopping-list`)**: **Auto-Restock Engine** (items you eat auto-populate here), department grouping, budget tally, and **1-Click Transfer Bought Items to Fridge** with auto-calculated shelf-life.
8. **Fridge 2D Storage Map (`/fridge-map`)**: Interactive 2D schematic of fridge shelves, crisper drawer, freezer, and pantry with thermal guidelines and shelf urgency heatmap dots.
9. **Food Preservation Encyclopedia (`/preservation-guide`)**: Searchable guide of 50+ ingredients, **The Ethylene Gas Rule** (emitters vs sensitive foods), and anti-waste revival hacks (ice-water crisping, herb freezing).
10. **Grocery Deals Radar (`/deals-radar`)**: Markdown & surplus produce tracker across Aldi, Trader Joe's, Whole Foods, and Walmart with 1-click add to cart.
11. **Printable QR Label Maker (`/barcode-hub`)**: Canvas QR code generator for leftovers and meal prep containers with 1-click printable sticker cards.

### 🥗 3. Health & Sustainability Labs
12. **Nutritional & Macro Horizon (`/nutrition`)**: Live macro breakdown (Protein, Carbs, Fats, Fiber, Calories) of your kitchen inventory and AI Dietitian Advisor.
13. **3-Minute Kitchen Freshness Audit (`/audit`)**: Step-by-step triage wizard (*Cook Today*, *Freeze*, *Donate*, *Compost*) with Kitchen Health Index scoring (0-100%).
14. **Scrap Repurposing & Compost Lab (`/compost`)**: Inedible scrap recipes (Veggie Scrap Stock, Citrus Eco Cleaner, Banana Plant Tea) and Nitrogen/Carbon compost balance meter.
15. **Sustainability & Waste Analytics (`/analytics`)**: Monthly savings area charts, water footprint savings, and predictive decay risk matrices.

### 🏆 4. Community, Gamification & Household
16. **Eco Quests & XP Streaks (`/challenges`)**: Zero-waste challenges (*Zero-Waste Weekend*, *Freezer Reset*), level progression, daily streak counter, and achievement trophies.
17. **Household & Roommate Kitchen (`/household`)**: Shared community vs personal item labeling, roommate chore rotation, and live activity feeds.
18. **Community Food Rescue (`/community`)**: Donate surplus food to nearby 24/7 Community Fridges and Pantries.
19. **FreshBot AI Conversational Assistant**: Voice Recognition (Speech-to-Text) and Spoken Voice (Text-to-Speech) assistant.
20. **Settings & Backup Engine (`/settings`)**: Dietary customization (Vegetarian, Vegan, Keto, Gluten-Free), currency switcher (`$`, `€`, `£`, `₹`), and full JSON/CSV export & restore.

---

## ⌨️ Spotlight Command Palette (`Ctrl+K` / `Cmd+K`)
Press **`Ctrl+K`** (or click the search button in the top bar) to open the spotlight command palette to jump between all 20 modules or search across all food in your fridge.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, Lucide Icons, Recharts, Web Audio API, Web Speech API, HTML5 Canvas.
- **Backend (Optional / Standalone Hybrid Adapter)**: Python FastAPI, Motor, Pydantic, OpenCV, OCR Engines.
- **Client Storage Engine**: Hybrid localStorage persistence layer with instant 1-click demo guest login and fallback intelligence.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (Node 24 recommended)
- **npm**: v9+

### 2. Frontend Setup & Launch
```bash
cd frontend
npm install
npm run dev
```

Open your browser at:
```text
http://127.0.0.1:5173/
```

### 3. Production Build
```bash
npm --prefix frontend run build
```

---

## 📄 License
MIT License. Built for zero food waste and smart culinary living.
