// Smart AI Engine for Recipe Generation, FreshBot Assistant, and OCR Simulation
import { storage } from './storage';

export const aiEngine = {
  // Generate intelligent recipes tailored to expiring items
  generateRecipe: async (options = {}) => {
    const products = storage.getProducts();
    const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');
    const safeItems = products.filter(p => p.status === 'SAFE');
    
    // Artificial small delay for realistic AI feel
    await new Promise(r => setTimeout(r, 600));

    const itemNames = urgentItems.map(i => i.product_name).slice(0, 4);
    const primaryIngredient = itemNames[0] || 'Fresh Ingredients';

    const recipes = [
      {
        id: 'rec-1',
        title: `Zero-Waste Chef's Special: ${primaryIngredient} Skillet & Toast`,
        prepTime: '15 mins',
        cookTime: '15 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 420,
        wasteSavedGrams: 450,
        matchedIngredients: urgentItems.map(p => p.product_name),
        missingIngredients: ['Olive Oil', 'Salt & Pepper', 'Garlic (optional)'],
        tags: ['High Protein', 'Quick & Easy', 'Zero-Waste Champion'],
        summary: `A delicious, chef-curated recipe designed specifically to rescue ${itemNames.join(', ') || 'your fresh ingredients'} before expiry.`,
        instructions: [
          'Preheat a large skillet over medium-high heat with 1 tbsp olive oil or butter.',
          `Dice and prepare your expiring ingredients: ${itemNames.join(', ')}.`,
          'Sauté any aromatics and meat/vegetables for 5-7 minutes until lightly golden and fragrant.',
          'Season generously with sea salt, freshly cracked black pepper, and herbs of choice.',
          'Plate alongside toasted artisan bread or tossed pasta. Garnish with cheese or herbs and serve hot!'
        ],
        storageTip: 'Any cooked leftovers can be sealed in an airtight container for up to 3 days in the fridge.'
      },
      {
        id: 'rec-2',
        title: 'Creamy Pan-Seared Medley with Sourdough Croutons',
        prepTime: '10 mins',
        cookTime: '20 mins',
        difficulty: 'Medium',
        servings: 3,
        calories: 480,
        wasteSavedGrams: 380,
        matchedIngredients: products.slice(0, 3).map(p => p.product_name),
        missingIngredients: ['Butter', 'Italian Herbs', 'Parmesan'],
        tags: ['Comfort Food', 'Family Favorite'],
        summary: 'Rich, warming, and packed with flavor, this dish turns dairy and bread into a restaurant-quality meal.',
        instructions: [
          'Cube any leftover bread and toast with olive oil in an oven at 190°C (375°F) for 8 minutes until golden croutons form.',
          'In a saucepan, gently warm dairy/sauce ingredients with garlic and herbs on medium-low.',
          'Combine with cooked proteins or sauteed vegetables and simmer until thick and luscious.',
          'Fold in grated cheese, top with crunchy homemade croutons, and enjoy immediately.'
        ],
        storageTip: 'Keep croutons in a dry zip lock bag to maintain crunch for up to a week.'
      },
      {
        id: 'rec-3',
        title: 'Fresh Vitality Smoothie & Parfait Bowl',
        prepTime: '5 mins',
        cookTime: '0 mins',
        difficulty: 'Easy',
        servings: 1,
        calories: 290,
        wasteSavedGrams: 220,
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy').map(p => p.product_name),
        missingIngredients: ['Honey or Maple Syrup', 'Chia Seeds (Optional)'],
        tags: ['Healthy', 'No-Cook', 'Breakfast Boost'],
        summary: 'Rescue ripe fruits and dairy in under 5 minutes with this nutrient-dense breakfast bowl.',
        instructions: [
          'Wash and trim any soft or ripe fruit.',
          'Layer Greek yogurt or milk in a blender with fruit and a drizzle of honey.',
          'Blend until silky smooth, or layer in a glass as a layered breakfast parfait.',
          'Top with seeds, nuts, or crushed biscuits for satisfying texture.'
        ],
        storageTip: 'Freeze any leftover blended smoothie in popsicle molds for a healthy frozen treat!'
      }
    ];

    return {
      recipes,
      featured: recipes[0],
      rawText: `👨‍🍳 **AI Zero-Waste Recommendation**\n\n**${recipes[0].title}**\n*Prep:* ${recipes[0].prepTime} | *Cook:* ${recipes[0].cookTime} | *Servings:* ${recipes[0].servings}\n\n**Ingredients from your fridge:**\n${recipes[0].matchedIngredients.map(i => `• ${i} ✅`).join('\n')}\n\n**Step-by-Step Instructions:**\n${recipes[0].instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}\n\n💡 *Pro-Tip:* ${recipes[0].storageTip}`
    };
  },

  // Interactive FreshBot Assistant with Inventory Intelligence
  chat: async (message) => {
    const products = storage.getProducts();
    const urgentItems = products.filter(p => p.status === 'URGENT');
    const soonItems = products.filter(p => p.status === 'EXPIRING SOON');
    const msg = message.toLowerCase();

    await new Promise(r => setTimeout(r, 450));

    if (msg.includes('expir') || msg.includes('urgent') || msg.includes('what is about to expire') || msg.includes('what do i have')) {
      if (urgentItems.length === 0 && soonItems.length === 0) {
        return {
          reply: `🎉 Great news! You have no urgent items expiring in the next 3 days. All your ${products.length} products are fresh and safe!`,
          suggestions: ['Suggest a dinner recipe', 'How to store avocados', 'Show my savings']
        };
      }
      const urgentList = urgentItems.map(i => `• **${i.product_name}** (${i.days_left <= 0 ? 'Expires TODAY' : 'Expires tomorrow'})`).join('\n');
      const soonList = soonItems.map(i => `• ${i.product_name} (in ${i.days_left} days)`).join('\n');
      
      return {
        reply: `⚠️ Here is what needs attention soon:\n\n${urgentList ? `**Urgent (Next 24-48 hours):**\n${urgentList}\n\n` : ''}${soonList ? `**Expiring in 2-3 days:**\n${soonList}\n\n` : ''}Would you like me to generate a zero-waste recipe using these items?`,
        suggestions: ['Generate a recipe with urgent items', 'How do I freeze milk/bread?', 'Plan this week\'s meals']
      };
    }

    if (msg.includes('recipe') || msg.includes('cook') || msg.includes('dinner') || msg.includes('lunch') || msg.includes('breakfast')) {
      const topItems = [...urgentItems, ...soonItems].slice(0, 3).map(i => i.product_name);
      return {
        reply: `🍳 I recommend making a **Zero-Waste Skillet or Parfait** using **${topItems.join(' and ') || 'your current inventory'}**!\n\nCheck out the **AI Recipe** tab in the sidebar to view complete step-by-step instructions and nutritional breakdown.`,
        suggestions: ['Go to AI Recipes', 'Show expiring items', 'How to extend bread shelf life']
      };
    }

    if (msg.includes('saving') || msg.includes('waste') || msg.includes('money') || msg.includes('stat')) {
      const stats = storage.getSavingsStats();
      return {
        reply: `🌱 You are doing amazing! Here are your environmental & financial impact stats:\n\n• 💰 **$${stats.moneySaved}** saved by preventing food waste\n• 📦 **${stats.foodItemsSaved} items** eaten before expiry\n• 🌍 **${stats.co2PreventedKg} kg CO₂** emissions prevented\n\nKeep it up!`,
        suggestions: ['What items are expiring soon?', 'Give me storage tips', 'Generate a recipe']
      };
    }

    if (msg.includes('store') || msg.includes('keep') || msg.includes('fresh') || msg.includes('freeze') || msg.includes('shelf life')) {
      return {
        reply: `💡 **FreshBot Smart Storage Tips:**\n\n1. **Bread:** Never store in the fridge! Keep at room temperature in a bread box or slice and freeze.\n2. **Berries:** Do not wash until ready to eat. Store with a paper towel in a breathable container.\n3. **Milk:** Keep in the coldest middle/back part of fridge, never in the door where temperature fluctuates.\n4. **Leafy Greens:** Wrap with a dry paper towel in an airtight container to absorb moisture.`,
        suggestions: ['How to freeze dairy?', 'What items are expiring soon?', 'Create a meal plan']
      };
    }

    // Default friendly response
    return {
      reply: `Hello! I'm FreshBot AI, your personal food guardian. I'm actively tracking **${products.length} food items** in your kitchen.\n\nYou have **${urgentItems.length} urgent item(s)** that should be cooked soon. Ask me anything like:\n• *"What is expiring soon?"*\n• *"Give me a recipe for dinner"*\n• *"How much money have I saved?"*`,
      suggestions: ['What is expiring soon?', 'Generate a zero-waste recipe', 'Food storage guide']
    };
  },

  // Simulated Instant Scanner & OCR Parser with Presets
  scanImage: async (fileOrPreset) => {
    await new Promise(r => setTimeout(r, 800));

    const presets = {
      'milk': {
        product_name: 'Organic Whole Milk 1L',
        category: 'Dairy',
        expiry_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        mrp: '$3.99',
        batch_number: 'LOT-2026-MILK44',
        overall_confidence: 0.96,
        detected_text: 'DAIRY FARMS ORGANIC WHOLE MILK\nBEST BEFORE: ' + new Date(Date.now() + 86400000 * 2).toLocaleDateString() + '\nNET: 1 LITER | LOT# MILK44'
      },
      'yogurt': {
        product_name: 'Greek Style Plain Yogurt 500g',
        category: 'Dairy',
        expiry_date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        mrp: '$4.49',
        batch_number: 'YG-88210',
        overall_confidence: 0.94,
        detected_text: 'AUTHENTIC GREEK YOGURT\nEXP DATE: ' + new Date(Date.now() + 86400000 * 4).toLocaleDateString() + '\nBATCH: YG-88210'
      },
      'bread': {
        product_name: 'Rustic Sourdough Loaf',
        category: 'Bakery',
        expiry_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        mrp: '$5.20',
        batch_number: 'BKR-0941',
        overall_confidence: 0.92,
        detected_text: 'ARTISAN BAKERY SOURDOUGH\nUSE BY: ' + new Date(Date.now() + 86400000 * 3).toLocaleDateString() + '\nBAKED FRESH DAILY'
      },
      'chicken': {
        product_name: 'Fresh Chicken Breast Fillets',
        category: 'Meat & Poultry',
        expiry_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        mrp: '$8.99',
        batch_number: 'CHK-99120',
        overall_confidence: 0.97,
        detected_text: 'PRIME CUTS FRESH CHICKEN BREAST\nPACKED ON: TODAY\nUSE OR FREEZE BY: ' + new Date(Date.now() + 86400000 * 2).toLocaleDateString()
      },
      'berries': {
        product_name: 'Sweet Strawberries 250g',
        category: 'Produce',
        expiry_date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
        mrp: '$3.75',
        batch_number: 'BER-3011',
        overall_confidence: 0.95,
        detected_text: 'FARM FRESH SWEET STRAWBERRIES\nBEST CONSUMED BY: ' + new Date(Date.now() + 86400000 * 1).toLocaleDateString()
      }
    };

    if (typeof fileOrPreset === 'string' && presets[fileOrPreset]) {
      const p = presets[fileOrPreset];
      return {
        success: true,
        extracted_fields: {
          product_name: p.product_name,
          category: p.category,
          expiry_date: p.expiry_date,
          mrp: p.mrp,
          batch_number: p.batch_number
        },
        raw_text: p.detected_text,
        overall_confidence: p.overall_confidence
      };
    }

    // Default dynamic scan extraction for uploaded file
    const expDate = new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0];
    return {
      success: true,
      extracted_fields: {
        product_name: 'Scanned Food Item',
        category: 'Pantry',
        expiry_date: expDate,
        mrp: '$4.99',
        batch_number: `BATCH-${Math.floor(Math.random() * 90000 + 10000)}`
      },
      raw_text: `FOOD PACKAGE OCR SCAN\nBEST BEFORE: ${expDate}\nNET WT: 400g\nCONFIDENCE: HIGH`,
      overall_confidence: 0.91
    };
  },

  // Barcode Lookup simulation
  lookupBarcode: async (barcode) => {
    await new Promise(r => setTimeout(r, 400));
    const barcodeMap = {
      '8901030383011': { name: 'Organic Whole Milk', category: 'Dairy', shelfDays: 7 },
      '8901030383022': { name: 'Fresh Strawberries', category: 'Produce', shelfDays: 3 },
      '8901030383033': { name: 'Greek Yogurt Plain', category: 'Dairy', shelfDays: 14 },
      '8901030383044': { name: 'Artisan Sourdough Bread', category: 'Bakery', shelfDays: 5 },
      '8901030383055': { name: 'Organic Baby Spinach', category: 'Produce', shelfDays: 6 },
      '8901030383066': { name: 'Free-Range Eggs', category: 'Dairy & Eggs', shelfDays: 21 },
      '8901030383077': { name: 'Boneless Chicken Breast', category: 'Meat & Poultry', shelfDays: 3 },
      '8901030383088': { name: 'Sharp Cheddar Cheese', category: 'Dairy', shelfDays: 30 },
      '8901030383099': { name: 'Italian Penne Rigate', category: 'Pantry', shelfDays: 365 }
    };

    if (barcodeMap[barcode]) {
      const item = barcodeMap[barcode];
      const expiry = new Date(Date.now() + 86400000 * item.shelfDays).toISOString().split('T')[0];
      return {
        found: true,
        product_name: item.name,
        category: item.category,
        expiry_date: expiry
      };
    }

    return {
      found: true,
      product_name: `Product (${barcode.slice(-4)})`,
      category: 'General',
      expiry_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0]
    };
  }
};
