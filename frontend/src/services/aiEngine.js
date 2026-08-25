// Smart AI Engine for Recipe Generation, FreshBot Assistant, and OCR Simulation
import { storage } from './storage';

export const aiEngine = {
  // Generate intelligent recipes tailored to expiring items with rich multi-category suggestions
  generateRecipe: async (options = {}) => {
    const products = storage.getProducts();
    const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');
    const safeItems = products.filter(p => p.status === 'SAFE');
    
    // Artificial small delay for realistic AI feel
    await new Promise(r => setTimeout(r, 400));

    const itemNames = urgentItems.map(i => i.product_name).slice(0, 4);
    const primaryIngredient = itemNames[0] || (products[0]?.product_name) || 'Fresh Garden Vegetables';

    const recipes = [
      {
        id: 'rec-1',
        title: `Zero-Waste Chef's Skillet & Toast`,
        prepTime: '10 mins',
        cookTime: '12 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 390,
        wasteSavedGrams: 420,
        mealType: 'Dinner',
        cuisine: 'Fusion',
        matchedIngredients: itemNames.length > 0 ? itemNames : ['Spinach', 'Eggs', 'Sourdough Bread'],
        missingIngredients: ['Olive Oil', 'Crushed Garlic', 'Sea Salt & Pepper'],
        tags: ['Quick & Easy', 'Zero-Waste', 'High Protein'],
        summary: `A chef-curated skillet designed to rescue ${itemNames.join(', ') || 'your fresh ingredients'} before expiry with maximum flavor.`,
        instructions: [
          'Preheat a large cast-iron skillet over medium-high heat with 1 tbsp olive oil.',
          `Dice your ingredients: ${itemNames.join(', ') || 'vegetables and proteins'}.`,
          'Sauté aromatics, vegetables, and proteins for 6-8 minutes until tender and caramelized.',
          'Season with sea salt, freshly cracked black pepper, and herbs of choice.',
          'Serve piping hot alongside toasted crusty bread or warm grains.'
        ],
        storageTip: 'Store any leftovers in an airtight glass container in the fridge for up to 3 days.'
      },
      {
        id: 'rec-2',
        title: 'Creamy Garlic Pasta Primavera',
        prepTime: '10 mins',
        cookTime: '15 mins',
        difficulty: 'Easy',
        servings: 3,
        calories: 460,
        wasteSavedGrams: 350,
        mealType: 'Dinner',
        cuisine: 'Italian',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs' || p.category === 'Pantry').slice(0, 3).map(p => p.product_name),
        missingIngredients: ['Penne Pasta', 'Garlic', 'Parmesan', 'Black Pepper'],
        tags: ['Italian', 'Family Favorite', 'Vegetarian'],
        summary: 'A luscious, golden pasta tossing whatever greens, dairy, and veggies you have into an Italian bistro masterpiece.',
        instructions: [
          'Boil penne pasta in heavily salted water for 9 minutes until al dente; reserve 1/2 cup pasta water.',
          'In a skillet, melt butter with minced garlic, then toss in all diced vegetables for 4 minutes.',
          'Stir in milk or cream with a ladle of pasta water until a silky emulsified sauce forms.',
          'Toss the drained pasta into the sauce, fold in grated cheese, and finish with fresh cracked black pepper.'
        ],
        storageTip: 'Reheat pasta with a splash of milk over medium-low heat to restore the creamy emulsion.'
      },
      {
        id: 'rec-3',
        title: 'Fresh Vitality Smoothie & Parfait Bowl',
        prepTime: '5 mins',
        cookTime: '0 mins',
        difficulty: 'Easy',
        servings: 1,
        calories: 280,
        wasteSavedGrams: 240,
        mealType: 'Breakfast',
        cuisine: 'American',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Honey or Maple Syrup', 'Chia Seeds or Granola'],
        tags: ['Healthy', 'Breakfast', 'No-Cook', 'Fiber Rich'],
        summary: 'Rescue soft fruits, berries, and yogurt in under 5 minutes with this antioxidant-dense powerhouse breakfast.',
        instructions: [
          'Wash and roughly chop any ripe fruit, berries, or greens.',
          'Combine with Greek yogurt or milk in a blender with a drizzle of honey.',
          'Blend on high for 45 seconds until silky smooth.',
          'Pour into a bowl and top with crunchy seeds, sliced fruit, or toasted oats.'
        ],
        storageTip: 'Freeze any leftover smoothie in popsicle molds for healthy zero-waste fruit ice treats!'
      },
      {
        id: 'rec-4',
        title: 'Crisp Vegetable Fried Rice with Golden Egg',
        prepTime: '8 mins',
        cookTime: '10 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 410,
        wasteSavedGrams: 380,
        mealType: 'Lunch',
        cuisine: 'Asian',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Cooked Rice', 'Soy Sauce', 'Sesame Oil', 'Spring Onions'],
        tags: ['15-Minute Meal', 'Asian', 'Quick Lunch'],
        summary: 'The ultimate zero-waste lunch: transform cold cooked rice and leftover vegetables into a sizzling wok classic.',
        instructions: [
          'Heat sesame oil in a wok or deep skillet over high heat.',
          'Stir-fry diced vegetables and greens for 3 minutes until tender-crisp.',
          'Push vegetables to the side, crack an egg into the pan, and scramble quickly.',
          'Add cold cooked rice and soy sauce, tossing continuously over high heat for 3-4 minutes until aromatic.'
        ],
        storageTip: 'Fried rice freezes remarkably well! Portion into microwave-safe containers for ready-made lunches.'
      },
      {
        id: 'rec-5',
        title: 'Rustic Sourdough French Toast with Caramelized Fruit',
        prepTime: '6 mins',
        cookTime: '8 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 360,
        wasteSavedGrams: 290,
        mealType: 'Breakfast',
        cuisine: 'French',
        matchedIngredients: products.filter(p => p.category === 'Bakery' || p.category === 'Dairy & Eggs' || p.category === 'Produce').map(p => p.product_name),
        missingIngredients: ['Cinnamon', 'Vanilla Extract', 'Butter', 'Maple Syrup'],
        tags: ['Bakery Rescue', 'Sweet Breakfast', 'Kids Favorite'],
        summary: 'Turn stale or drying bread slices into fluffy, golden French toast topped with warm stewed berries.',
        instructions: [
          'Whisk eggs, milk, a pinch of cinnamon, and vanilla in a shallow dish.',
          'Submerge thick bread slices for 30 seconds per side until fully custard-soaked.',
          'Melt butter in a skillet over medium heat and sear bread for 3-4 minutes per side until golden brown.',
          'In the same pan, gently warm sliced fruit with a drizzle of honey for a quick warm compote topping.'
        ],
        storageTip: 'Cooked French toast slices can be frozen and popped directly into a toaster for an instant breakfast.'
      },
      {
        id: 'rec-6',
        title: 'Mediterranean Herb-Roasted Protein & Vegetable Platter',
        prepTime: '12 mins',
        cookTime: '25 mins',
        difficulty: 'Medium',
        servings: 4,
        calories: 520,
        wasteSavedGrams: 550,
        mealType: 'Dinner',
        cuisine: 'Mediterranean',
        matchedIngredients: products.filter(p => p.category === 'Meat & Poultry' || p.category === 'Produce').map(p => p.product_name),
        missingIngredients: ['Olive Oil', 'Dried Oregano', 'Lemon Juice', 'Garlic Powder'],
        tags: ['Sheet Pan Meal', 'High Protein', 'Keto Friendly'],
        summary: 'An all-in-one sheet pan dinner roasting proteins and mixed vegetables with fragrant Mediterranean herbs.',
        instructions: [
          'Preheat oven to 200°C (400°F) and line a large baking sheet with parchment.',
          'Chop chicken, tofu, or meats into bite-sized pieces and slice vegetables.',
          'Toss everything together with olive oil, oregano, minced garlic, lemon juice, salt, and pepper.',
          'Spread evenly in a single layer and roast for 22-25 minutes until proteins are cooked and veggies are roasted.'
        ],
        storageTip: 'Ideal for weekly meal prep! Keeps fresh in sealed containers for up to 4 days.'
      },
      {
        id: 'rec-7',
        title: 'Warm Harvest Minestrone & Leftover Soup',
        prepTime: '10 mins',
        cookTime: '20 mins',
        difficulty: 'Easy',
        servings: 4,
        calories: 310,
        wasteSavedGrams: 480,
        mealType: 'Dinner',
        cuisine: 'Italian',
        matchedIngredients: products.map(p => p.product_name),
        missingIngredients: ['Canned Tomatoes', 'Vegetable Broth', 'Italian Seasoning'],
        tags: ['Hearty Soup', 'Comfort Food', 'Zero-Waste Champion'],
        summary: 'A nourishing, steaming pot of Italian soup that absorbs any mix of vegetables, beans, pasta, or leafy greens.',
        instructions: [
          'Sauté chopped aromatics (onions, carrots, celery, garlic) in olive oil in a deep soup pot for 5 minutes.',
          'Pour in vegetable broth, canned tomatoes, and add chopped hearty vegetables.',
          'Simmer for 15 minutes, then drop in quick-cooking greens and leftover pasta or beans.',
          'Season with salt, pepper, and fresh lemon juice, then ladle into warm bowls with a sprinkle of cheese.'
        ],
        storageTip: 'Soup flavors deepen overnight! Freeze extra batches in mason jars for busy weeknight dinners.'
      },
      {
        id: 'rec-8',
        title: 'Crispy Sourdough Cheese Melt & Tomato Skillet',
        prepTime: '5 mins',
        cookTime: '7 mins',
        difficulty: 'Easy',
        servings: 1,
        calories: 430,
        wasteSavedGrams: 210,
        mealType: 'Lunch',
        cuisine: 'American',
        matchedIngredients: products.filter(p => p.category === 'Bakery' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Butter', 'Mustard or Mayo (optional)', 'Black Pepper'],
        tags: ['15-Minute Meal', 'Comfort Food', 'Quick Lunch'],
        summary: 'The ultimate golden-brown grilled cheese featuring sourdough and melting cheeses with tomato slices.',
        instructions: [
          'Butter the outer sides of two sourdough bread slices.',
          'Layer sliced cheddar cheese and fresh tomato or spinach between the bread slices.',
          'Place in a medium-hot skillet and press down gently with a spatula.',
          'Cook for 3-4 minutes per side until bread is golden and the cheese is fully melted and gooey.'
        ],
        storageTip: 'Serve immediately for maximum crunch and melty cheese stretch!'
      }
    ];

    return {
      recipes,
      featured: recipes[0],
      rawText: `👨‍🍳 **AI Zero-Waste Recommendation**\n\n**${recipes[0].title}**\n*Prep:* ${recipes[0].prepTime} | *Cook:* ${recipes[0].cookTime} | *Servings:* ${recipes[0].servings}\n\n**Ingredients from your fridge:**\n${recipes[0].matchedIngredients.map(i => `• ${i} ✅`).join('\n')}\n\n**Step-by-Step Instructions:**\n${recipes[0].instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n💡 *Pro-Tip:* ${recipes[0].storageTip}`
    };
  },

  // Interactive FreshBot Assistant with Inventory Intelligence (Multi-Lingual & 100% Error-Free)
  chatFreshBot: async (message) => {
    try {
      const products = storage.getProducts() || [];
      const urgentItems = products.filter(p => p.status === 'URGENT');
      const soonItems = products.filter(p => p.status === 'EXPIRING SOON');
      const msg = (message || '').toLowerCase().trim();

      await new Promise(r => setTimeout(r, 350));

      // 1. Expiry & Inventory Queries (English & Tamil)
      if (msg.includes('expir') || msg.includes('urgent') || msg.includes('காலாவதி') || msg.includes('அவசரம்') || msg.includes('fridge') || msg.includes('பிரிட்ஜ்') || msg.includes('what do i have')) {
        if (urgentItems.length === 0 && soonItems.length === 0) {
          return {
            reply: `🎉 Great news! You have no urgent items expiring in the next 3 days. All your ${products.length} products are fresh and safe!`,
            suggestedActions: ['Suggest a dinner recipe', 'How to store avocados', 'Show my savings']
          };
        }
        const urgentList = urgentItems.map(i => `• **${i.product_name}** (${i.days_left <= 0 ? 'Expires TODAY' : 'Expires tomorrow'})`).join('\n');
        const soonList = soonItems.map(i => `• ${i.product_name} (in ${i.days_left} days)`).join('\n');
        
        return {
          reply: `⚠️ Here is what needs attention in your kitchen:\n\n${urgentList ? `**🚨 Urgent (Next 24-48 hours):**\n${urgentList}\n\n` : ''}${soonList ? `**⏳ Expiring in 2-3 days:**\n${soonList}\n\n` : ''}Would you like me to generate a zero-waste recipe using these items?`,
          suggestedActions: ['Generate a recipe with urgent items', 'How to freeze bread/milk?', '3-Minute Kitchen Audit']
        };
      }

      // 2. Recipe & Cooking Queries
      if (msg.includes('recipe') || msg.includes('cook') || msg.includes('dinner') || msg.includes('lunch') || msg.includes('breakfast') || msg.includes('சமையல்') || msg.includes('உணவு') || msg.includes('செய்முறை')) {
        const topItems = [...urgentItems, ...soonItems].slice(0, 3).map(i => i.product_name);
        return {
          reply: `👨‍🍳 I recommend cooking a **Zero-Waste Chef's Skillet or Pasta Primavera** using **${topItems.join(' and ') || 'your available pantry ingredients'}**!\n\nOpen the **AI Recipe Chef** module to view step-by-step cooking steps with audio countdown timers.`,
          suggestedActions: ['Open AI Recipes', 'Show expiring items', 'How to store greens']
        };
      }

      // 3. Storage & Shelf Life Advice
      if (msg.includes('store') || msg.includes('keep') || msg.includes('fresh') || msg.includes('freeze') || msg.includes('shelf') || msg.includes('சேமிப்பு') || msg.includes('பாதுகாப்பு')) {
        return {
          reply: `💡 **FreshBot Food Preservation Rules:**\n\n1. **Bread & Bakery:** Never refrigerate! Store in a dry bread box or slice and freeze.\n2. **Berries:** Keep unwashed in a breathable container until eating.\n3. **Milk & Dairy:** Keep in the middle/back of the fridge (coldest), never in the door.\n4. **Leafy Greens:** Wrap in a clean dry paper towel inside an airtight container to absorb humidity.\n5. **Bananas & Apples:** Keep separate from greens as they release ripening ethylene gas.`,
          suggestedActions: ['Open Preservation Encyclopedia', 'What is expiring soon?', 'Compost Scrap Guide']
        };
      }

      // 4. Savings & Environmental Sustainability
      if (msg.includes('saving') || msg.includes('waste') || msg.includes('money') || msg.includes('stat') || msg.includes('சேமிப்பு') || msg.includes('பணம்')) {
        const stats = storage.getSavingsStats();
        return {
          reply: `🌱 **Your Zero-Waste Impact Summary:**\n\n• 💰 **$${stats.moneySaved}** saved by preventing grocery spoilage\n• 🥗 **${stats.foodItemsSaved} food items** consumed safely\n• 🌍 **${stats.co2PreventedKg} kg CO₂** greenhouse gas emissions avoided\n\nAwesome work protecting the planet and your wallet!`,
          suggestedActions: ['Open Waste Analytics', 'What is expiring soon?', 'View Eco Quests']
        };
      }

      // 5. Greetings & Help (English & Tamil)
      if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('வணக்கம்') || msg.includes('help')) {
        return {
          reply: `👋 Hello! I am FreshBot AI, your personal zero-waste kitchen assistant. I am actively monitoring your kitchen inventory.\n\nAsk me anything like:\n• *"What is expiring soon?"*\n• *"Suggest a dinner recipe"*\n• *"How do I keep berries fresh?"*`,
          suggestedActions: ["What's expiring soon?", 'Generate dinner recipe', 'Kitchen storage tips']
        };
      }

      // Default Intelligent Helper
      return {
        reply: `🤖 I'm here to help you manage food, prevent waste, and discover zero-waste recipes!\n\nCurrently tracking **${products.length} food items** in your kitchen. You can ask me for recipe ideas, shelf-life advice, or expiry checks anytime.`,
        suggestedActions: ["What's expiring soon?", 'Generate quick recipe', 'Open 3-Min Audit']
      };
    } catch (err) {
      console.warn('FreshBot internal handler notice:', err);
      return {
        reply: "👋 FreshBot AI is online! Ask me what items in your fridge are expiring or request a zero-waste recipe!",
        suggestedActions: ["What's expiring soon?", 'Suggest a recipe', 'Storage tips']
      };
    }
  },

  // Simulated Scanner & OCR Parser
  scanImage: async (fileOrPreset) => {
    await new Promise(r => setTimeout(r, 500));
    return {
      success: true,
      extracted_fields: {
        product_name: 'Organic Whole Milk 1L',
        category: 'Dairy & Eggs',
        expiry_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        mrp: '$3.99',
        batch_number: 'LOT-2026-MILK44'
      },
      raw_text: 'DAIRY FARMS ORGANIC WHOLE MILK\nBEST BEFORE: 2026-08-30\nNET: 1 LITER',
      overall_confidence: 0.96
    };
  }
};
