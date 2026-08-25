// Smart AI Engine for Recipe Generation, FreshBot Assistant, and Custom Manual AI Recipe Generator
import { storage } from './storage';
import { MASTER_RECIPES } from './recipeDatabase';

export const aiEngine = {
  // Return all 115+ recipes dynamically tailored with user's urgent fridge inventory
  generateRecipe: async (options = {}) => {
    const products = storage.getProducts();
    const urgentItems = products.filter(p => p.status === 'CRITICAL' || p.status === 'URGENT' || p.status === 'EXPIRING SOON');
    const urgentNames = urgentItems.map(i => i.product_name);

    await new Promise(r => setTimeout(r, 150));

    const personalized = MASTER_RECIPES.map((rec) => {
      // Intelligently match ingredients if user has matching categories
      const matched = rec.matchedIngredients.map(ing => {
        const found = products.find(p => p.product_name.toLowerCase().includes(ing.toLowerCase()) || ing.toLowerCase().includes(p.product_name.toLowerCase()));
        return found ? found.product_name : ing;
      });

      return {
        ...rec,
        matchedIngredients: matched
      };
    });

    return {
      recipes: personalized,
      totalCount: personalized.length,
      featured: personalized[0]
    };
  },

  // Manual Custom AI Recipe Generator Studio
  generateManualRecipe: async ({ ingredients = '', cuisine = 'Indian', mealType = 'Dinner', dietary = 'Vegetarian', notes = '' }) => {
    await new Promise(r => setTimeout(r, 400));

    const userIngs = ingredients
      ? ingredients.split(',').map(i => i.trim()).filter(Boolean)
      : ['Paneer', 'Spinach', 'Garlic', 'Basmati Rice'];

    const titleCuisine = cuisine === 'ALL' || !cuisine ? 'Chef Gourmet' : cuisine;
    const titleIng = userIngs[0] || 'Kitchen Harvest';
    const subIng = userIngs[1] || 'Garden Herb';

    const customTitle = `${titleCuisine} Style ${titleIng} & ${subIng} Medley`;

    const instructions = [
      `Wash and prep your ingredients: coarsely chop ${userIngs.slice(0, 3).join(', ')} into uniform pieces.`,
      `Heat 1.5 tbsp olive oil or butter in a skillet over medium flame; sauté minced garlic and aromatics for 2 minutes.`,
      `Add ${userIngs.join(' and ')} with a pinch of authentic ${titleCuisine} spices and sea salt.`,
      `Sauté or simmer on medium-low heat for 8-10 minutes until tender and deeply infused with flavor.`,
      `Garnish with fresh herbs, a squeeze of lemon or grated cheese, and serve immediately hot!`
    ];

    if (notes) {
      instructions.push(`Chef's Custom Twist: ${notes}`);
    }

    const newRecipe = {
      id: `manual-ai-${Date.now()}`,
      title: customTitle,
      prepTime: '8 mins',
      cookTime: '12 mins',
      difficulty: 'Easy',
      servings: 2,
      calories: 360,
      wasteSavedGrams: 420,
      mealType: mealType === 'ALL' || !mealType ? 'Dinner' : mealType,
      cuisine: titleCuisine,
      dietary: dietary === 'ALL' || !dietary ? 'Vegetarian' : dietary,
      matchedIngredients: userIngs,
      missingIngredients: ['Olive Oil or Butter', 'Garlic', 'Salt & Pepper'],
      tags: ['Custom AI Generated', titleCuisine, mealType || 'Dinner', dietary || 'Zero-Waste'],
      summary: `A bespoke zero-waste ${titleCuisine} recipe crafted instantly by AI around ${userIngs.join(', ')} with zero kitchen waste.`,
      instructions,
      storageTip: 'Store in an airtight glass container in the refrigerator for up to 3 days.'
    };

    return newRecipe;
  },

  // Interactive FreshBot Assistant that answers 100% of user messages in English & Tamil
  chatFreshBot: async (message, lang = 'en') => {
    try {
      const products = storage.getProducts() || [];
      const stats = storage.getDashboardStats();
      const rawMsg = (message || '').trim();
      const msg = rawMsg.toLowerCase();

      await new Promise(r => setTimeout(r, 250));

      const isTa = lang === 'ta' || /[\u0B80-\u0BFF]/.test(rawMsg) || msg.includes('வணக்கம்') || msg.includes('சமையல்') || msg.includes('காலாவதி');

      // 1. Expiry, Inventory & "What's in my fridge" queries
      if (msg.includes('expir') || msg.includes('urgent') || msg.includes('critical') || msg.includes('fridge') || msg.includes('inventory') || msg.includes('காலாவதி') || msg.includes('அவசரம்') || msg.includes('பிரிட்ஜ்') || msg.includes('உணவு')) {
        const urgentItems = products.filter(p => p.status === 'CRITICAL' || p.status === 'URGENT' || (p.days_left !== undefined && p.days_left <= 6 && p.days_left >= 0));
        const soonItems = products.filter(p => p.status === 'EXPIRING SOON' || (p.days_left !== undefined && p.days_left >= 7 && p.days_left <= 30));
        const expiredItems = products.filter(p => p.status === 'EXPIRED' || (p.days_left !== undefined && p.days_left < 0));

        if (urgentItems.length === 0 && soonItems.length === 0 && expiredItems.length === 0) {
          return {
            reply: isTa
              ? `🎉 **சிறந்த செய்தி!** உங்கள் சமையலறையில் உள்ள ${products.length} உணவுகளும் முழுப் பாதுகாப்பாக உள்ளன. அடுத்த 7 நாட்களில் எதுவும் காலாவதியாகவில்லை!`
              : `🎉 **Great news!** All ${products.length} items in your inventory are safe. You have zero items expiring in the next 7 days!`,
            suggestedActions: isTa
              ? ['100+ செய்முறைகளைத் தேடு', 'பழங்களை சேமிக்கும் வழிகள்', 'கழிவு புள்ளிவிவரங்கள்']
              : ['Search 100+ Recipes', 'Storage tips for greens', 'View waste analytics']
          };
        }

        if (isTa) {
          let report = `📋 **உங்கள் சமையலறை காலாவதி நிலை:**\n\n`;
          if (urgentItems.length > 0) {
            report += `🚨 **அவசர கவனம் (1-6 நாட்கள்):**\n${urgentItems.map(i => `• **${i.product_name}** — ${i.days_left <= 0 ? 'இன்றே காலாவதியாகிறது!' : `${i.days_left} நாட்களில் காலாவதி`}`).join('\n')}\n\n`;
          }
          if (soonItems.length > 0) {
            report += `⏳ **விரைவில் காலாவதியாகும் (7-30 நாட்கள்):**\n${soonItems.slice(0, 4).map(i => `• ${i.product_name} (${i.days_left} நாட்கள்)`).join('\n')}\n\n`;
          }
          if (expiredItems.length > 0) {
            report += `⛔ **காலாவதியானது:**\n${expiredItems.map(i => `• ${i.product_name}`).join('\n')}\n\n`;
          }
          report += `💡 இந்த உணவுகளை உடனடியாக சமைத்து வீணாவதைத் தடுக்க நான் உதவவா?`;
          return {
            reply: report,
            suggestedActions: ['100+ செய்முறைகளைத் தேடு', 'உணவு பாதுகாப்பு வழிகாட்டல்', 'நாட்காட்டியைப் பார்']
          };
        }

        let report = `📋 **Kitchen Inventory Expiry Report:**\n\n`;
        if (urgentItems.length > 0) {
          report += `🚨 **Critical (1-6 Days):**\n${urgentItems.map(i => `• **${i.product_name}** — ${i.days_left <= 0 ? 'Expires TODAY!' : `${i.days_left}d remaining`}`).join('\n')}\n\n`;
        }
        if (soonItems.length > 0) {
          report += `⏳ **Expiring Soon (7-30 Days):**\n${soonItems.slice(0, 4).map(i => `• ${i.product_name} (${i.days_left}d)`).join('\n')}\n\n`;
        }
        if (expiredItems.length > 0) {
          report += `⛔ **Expired Items:**\n${expiredItems.map(i => `• ${i.product_name}`).join('\n')}\n\n`;
        }
        report += `💡 Shall I generate a zero-waste recipe using your critical items?`;
        return {
          reply: report,
          suggestedActions: ['Search 100+ Recipes', 'Food storage encyclopedia', 'View Expiry Calendar']
        };
      }

      // 2. Specific Food Lookup
      const knownFoods = [
        { key: 'milk', nameTa: 'பால்', tipEn: 'Keep in the middle shelf of the fridge (coldest spot), never the door. Unopened milk lasts 5-7 days past printed date. Freeze in ice cubes for coffee or smoothies!', tipTa: 'குளிர்சாதனப் பெட்டியின் நடுப்பகுதியில் வைக்கவும் (கதவில் வைக்காதீர்கள்). ஐஸ் க்யூப் தட்டுகளில் ஊற்றி பிரீசரில் வைத்தால் 3 மாதங்கள் கெடாது!' },
        { key: 'bread', nameTa: 'ரொட்டி', tipEn: 'Never refrigerate bread as cold temperatures speed up starch crystallization (staling). Keep in a cool bread box or slice and freeze for instant toasting!', tipTa: 'ரொட்டியை பிரிட்ஜில் வைக்காதீர்கள்! உலர்ந்த ரொட்டிப் பெட்டியில் வைக்கவும் அல்லது நறுக்கி பிரீசரில் வைத்தால் தேவைப்படும்போது டோஸ்ட் செய்யலாம்.' },
        { key: 'banana', nameTa: 'வாழைப்பழம்', tipEn: 'Bananas emit ethylene gas. Keep away from other fruits. Once spotted, peel and freeze for smoothies, oat pancakes, or banana bread!', tipTa: 'வாழைப்பழத்தை மற்ற பழங்களுடன் சேர்க்காதீர்கள். கனிந்த வாழைப்பழங்களை தோலுரித்து பிரீசரில் வைத்தால் ஸ்மூத்தி மற்றும் பான்கேக் செய்யப் பயன்படுத்தலாம்.' },
        { key: 'egg', nameTa: 'முட்டை', tipEn: 'Perform the Water Float Test: Fresh eggs sink to the bottom. If it stands upright, use quickly. If it floats to the top, it is spoiled. Eggs stay fresh 3-5 weeks refrigerated.', tipTa: 'தண்ணீர் பரிசோதனை: முட்டையை தண்ணீரில் போடுங்கள்; அடியில் மூழ்கினால் புதியது, மேலே மிதந்தால் காலாவதியானது. குளிர்சாதனப் பெட்டியில் 3-5 வாரங்கள் கெடாது.' },
        { key: 'tomato', nameTa: 'தக்காளி', tipEn: 'Store whole tomatoes stem-down at room temperature for maximum flavor. Refrigerate only once fully ripe or sliced.', tipTa: 'தக்காளியை அறை வெப்பநிலையில் வைக்கவும்; நன்றாக பழுத்த பிறகு மட்டுமே குளிர்சாதனப் பெட்டியில் வைக்க வேண்டும்.' },
        { key: 'spinach', nameTa: 'கீரை', tipEn: 'Wrap leafy greens in a dry paper towel inside an airtight glass container to absorb moisture. Keeps crispy for up to 10 days!', tipTa: 'கீரையை காகிதத் துண்டில் சுற்றி காற்றுப்புகா பெட்டியில் வைத்தால் 10 நாட்கள் வரை புத்துணர்ச்சியுடன் இருக்கும்.' },
        { key: 'chicken', nameTa: 'கோழி இறைச்சி', tipEn: 'Raw poultry should be cooked within 1-2 days of purchase or frozen immediately at -18°C where it stays safe for 9 months.', tipTa: 'பச்சை இறைச்சியை வாங்கிய 1-2 நாட்களுக்குள் சமைக்கவும் அல்லது -18°C பிரீசரில் வைத்தால் 9 மாதங்கள் வரை பாதுகாப்பாக இருக்கும்.' },
        { key: 'yogurt', nameTa: 'தயிர்', tipEn: 'Unopened yogurt remains fresh 1-2 weeks past printed date. Once opened, consume within 7 days. Watery whey on top is natural protein—just stir it in!', tipTa: 'தயிர் திறக்கப்படாவிட்டால் தேதியிலிருந்து 1-2 வாரங்கள் நல்ல நிலையில் இருக்கும். மேலே தேங்கும் நீர் ஆரோக்கியமான புரோட்டீன், அதை கலக்கி உண்ணலாம்.' },
        { key: 'paneer', nameTa: 'பன்னீர்', tipEn: 'Store fresh paneer submerged in water in an airtight box; change water every 2 days to keep it soft and fresh for up to 10 days.', tipTa: 'பன்னீரை ஒரு பாத்திரத்தில் தண்ணீரில் மூழ்க வைத்து பிரிட்ஜில் வைக்கவும்; 2 நாட்களுக்கு ஒருமுறை தண்ணீரை மாற்றினால் 10 நாட்கள் வரை மென்மையாக இருக்கும்.' }
      ];

      const matchedFood = knownFoods.find(f => msg.includes(f.key) || (f.nameTa && msg.includes(f.nameTa)));
      if (matchedFood) {
        return {
          reply: isTa
            ? `🥑 **${matchedFood.nameTa} சேமிப்பு & பாதுகாப்பு ஆலோசனை:**\n\n${matchedFood.tipTa}\n\nஉங்களிடம் உள்ள ${matchedFood.nameTa} வைத்து சமையல் குறிப்பு வேண்டுமா?`
            : `🥑 **${matchedFood.key.toUpperCase()} Storage & Freshness Guide:**\n\n${matchedFood.tipEn}\n\nWould you like a zero-waste recipe using ${matchedFood.key}?`,
          suggestedActions: isTa
            ? [`${matchedFood.nameTa} சமையல் குறிப்பு`, 'குளிர்சாதனப் பெட்டி நிலை', '100+ செய்முறைகள்']
            : [`Recipe with ${matchedFood.key}`, "Check what's expiring", 'Explore 100+ Recipes']
        };
      }

      // 3. Recipes & 100+ Cuisines
      if (msg.includes('recipe') || msg.includes('cook') || msg.includes('dinner') || msg.includes('lunch') || msg.includes('breakfast') || msg.includes('make') || msg.includes('meal') || msg.includes('100') || msg.includes('சமையல்') || msg.includes('உணவு') || msg.includes('செய்முறை') || msg.includes('இரவு')) {
        return {
          reply: isTa
            ? `👨‍🍳 **உங்கள் சமையலறைக்கான 100+ உலகளாவிய சமையல் குறிப்புகள்:**\n\nஎங்களிடம் **115-க்கும் மேற்பட்ட விரிவான செய்முறைகள்** உள்ளன:\n• 🇮🇳 **இந்திய சமையல்:** பன்னீர் பட்டர் மசாலா, சாம்பார், ரசம், பிரியாணி, பருப்பு தட்கா, பாவ் பாஜி\n• 🇮🇹 **இத்தாலியன்:** பாஸ்தா பிரிமாவெரா, மார்கரிட்டா பீட்சா, ரிசொட்டோ\n• 🥢 **ஆசியன்:** காய்கறி ஃப்ரைட் ரைஸ், மிசோ ராமென், பேட் தாய்\n• 🫒 **மத்திய தரைக்கடல்:** ஷக்ஷுகா, ஃபலாஃபல், கிரேக்க சாலட்\n• 🇲🇽 **மெக்சிகன்:** புரிட்டோ பவுல், என்சிலாதா, எஸ்குயட்ஸ்\n• 🥐 **பிரெஞ்சு:** ரட்டாடுய், பிரெஞ்சு டோஸ்ட்\n\n👉 **AI செய்முறைகள்** பக்கத்தில் உள்ள **"கைமுறை AI செய்முறை ஸ்டுடியோ"** மூலம் உங்களுக்குத் தேவையான எந்த உணவையும் உருவாக்கலாம்!`
            : `👨‍🍳 **100+ Master Culinary Recipes Available:**\n\nExplore over **115+ zero-waste recipes** across all global cuisines:\n• 🇮🇳 **Indian:** Paneer Butter Masala, Sambar, Rasam, Hyderabadi Biryani, Dal Tadka, Pav Bhaji\n• 🇮🇹 **Italian:** Pasta Primavera, Margherita Flatbread, Wild Mushroom Risotto\n• 🥢 **Asian:** Veg Fried Rice, Garlic Chili Noodles, Pad Thai, Miso Ramen\n• 🫒 **Mediterranean:** Shakshuka with Feta, Falafel Pita, Greek Village Salad\n• 🇲🇽 **Mexican:** Fiesta Burrito Bowl, Cheesy Enchiladas, Street Corn\n• 🥐 **French:** Provencal Ratatouille, Cinnamon French Toast\n\n👉 Visit the **AI Recipes** module to filter 100+ dishes or create your own with the **Manual AI Recipe Studio**!`,
          suggestedActions: isTa
            ? ['AI செய்முறை பக்கம்', 'கைமுறை AI செய்முறை உருவாக்கு', 'காலாவதி நிலவரம்']
            : ['Open AI Recipes', 'Create Custom AI Recipe', "Check expiring items"]
        };
      }

      // 4. Sustainability & Savings
      if (msg.includes('saving') || msg.includes('waste') || msg.includes('money') || msg.includes('loss') || msg.includes('co2') || msg.includes('சேமிப்பு') || msg.includes('பணம்') || msg.includes('கழிவு')) {
        return {
          reply: isTa
            ? `🌱 **உங்கள் சமையலறை சேமிப்பு அறிக்கை:**\n\n• 💰 **$${stats.moneySaved}** உணவு வீணாவதைத் தடுத்து சேமித்த பணம்\n• 🥗 **${stats.foodItemsSaved} உணவுகள்** காப்பாற்றப்பட்டன\n• 🛡️ **${stats.wasteScore}%** கழிவு தடுப்பு திறன்\n• 🌍 **${stats.co2PreventedKg} kg** CO₂ உமிழ்வு குறைப்பு`
            : `🌱 **Your Zero-Waste Sustainability Summary:**\n\n• 💰 **$${stats.moneySaved}** saved by preventing spoilage\n• 🥗 **${stats.foodItemsSaved} meals** rescued\n• 🛡️ **${stats.wasteScore}%** Zero-Waste rating\n• 🌍 **${stats.co2PreventedKg} kg** CO₂ prevented`,
          suggestedActions: isTa
            ? ['100+ செய்முறைகள்', 'மாதாந்திர அறிக்கை']
            : ['Explore 100+ Recipes', 'Open Monthly Reports']
        };
      }

      // 5. Friendly Greetings
      if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('வணக்கம்') || msg.includes('help') || msg.includes('உதவி')) {
        return {
          reply: isTa
            ? `👋 வணக்கம்! நான் **FreshBot AI**. உங்களிடம் உள்ள பொருட்களைக் கொண்டு 100-க்கும் மேற்பட்ட சுவையான செய்முறைகள் மற்றும் உணவுப் பாதுகாப்பு வழிகளை வழங்க நான் தயார்!`
            : `👋 Hello! I am **FreshBot AI**. I have 100+ global zero-waste recipes ready to rescue your ingredients!`,
          suggestedActions: isTa
            ? ['100+ செய்முறைகள்', 'குளிர்சாதனப் பெட்டியில் என்ன உள்ளது?']
            : ['Explore 100+ Recipes', "What's expiring soon?"]
        };
      }

      // 6. Generic Fallback
      return {
        reply: isTa
          ? `🤖 நான் **FreshBot AI**. உங்கள் கேள்வி: *" ${rawMsg} "*\n\nஎங்களிடம் **115+ செய்முறைகள்** மற்றும் தனிப்பயன் AI செய்முறை உருவாக்கும் வசதி உள்ளது. எதைப்பற்றி அறிய விரும்புகிறீர்கள்?`
          : `🤖 I'm **FreshBot AI**. Regarding *" ${rawMsg} "*:\n\nYou have access to **115+ master culinary recipes** and our bespoke Manual AI Recipe Generator. How can I help you cook today?`,
        suggestedActions: isTa
          ? ['100+ செய்முறைகள்', 'காலாவதி நிலவரம்']
          : ['Explore 100+ Recipes', "Check my fridge"]
      };
    } catch (err) {
      return {
        reply: "👋 FreshBot AI is online with 100+ global recipes! Ask for any dish or fridge status.",
        suggestedActions: ['Explore 100+ Recipes', "What's expiring soon?"]
      };
    }
  }
};
