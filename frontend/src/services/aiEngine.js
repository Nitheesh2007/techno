// Smart AI Engine for Recipe Generation, FreshBot Assistant, and OCR Simulation
import { storage } from './storage';

export const aiEngine = {
  // Generate comprehensive, intelligent recipes tailored to expiring items with 20+ diverse culinary dishes
  generateRecipe: async (options = {}) => {
    const products = storage.getProducts();
    const urgentItems = products.filter(p => p.status === 'URGENT' || p.status === 'EXPIRING SOON');
    const safeItems = products.filter(p => p.status === 'SAFE');
    
    // Small artificial delay for realistic AI feel
    await new Promise(r => setTimeout(r, 350));

    const itemNames = urgentItems.map(i => i.product_name).slice(0, 5);
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
        dietary: 'High-Protein',
        matchedIngredients: itemNames.length > 0 ? itemNames : ['Spinach', 'Eggs', 'Sourdough Bread'],
        missingIngredients: ['Olive Oil', 'Crushed Garlic', 'Sea Salt & Pepper'],
        tags: ['Quick & Easy', 'Zero-Waste', 'High Protein'],
        summary: `A chef-curated skillet designed to rescue ${itemNames.join(', ') || 'your fresh ingredients'} before expiry with maximum flavor and zero waste.`,
        instructions: [
          'Preheat a large cast-iron skillet over medium-high heat with 1 tbsp olive oil or butter.',
          `Dice your ingredients: ${itemNames.join(', ') || 'vegetables and proteins'}.`,
          'Sauté aromatics, vegetables, and proteins for 6-8 minutes until tender and caramelized.',
          'Season generously with sea salt, freshly cracked black pepper, and herbs of choice.',
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
        dietary: 'Vegetarian',
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
        dietary: 'Vegan',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Honey or Maple Syrup', 'Chia Seeds or Granola'],
        tags: ['Healthy', 'Breakfast', 'No-Cook', 'Fiber Rich'],
        summary: 'Rescue soft fruits, berries, and yogurt in under 5 minutes with this antioxidant-dense powerhouse breakfast.',
        instructions: [
          'Wash and roughly chop any ripe fruit, berries, or greens.',
          'Combine with Greek yogurt or plant milk in a blender with a drizzle of honey.',
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
        dietary: 'Quick',
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
        dietary: 'Vegetarian',
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
        title: 'Mediterranean Herb-Roasted Protein & Veggie Platter',
        prepTime: '12 mins',
        cookTime: '25 mins',
        difficulty: 'Medium',
        servings: 4,
        calories: 520,
        wasteSavedGrams: 550,
        mealType: 'Dinner',
        cuisine: 'Mediterranean',
        dietary: 'High-Protein',
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
        dietary: 'Vegan',
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
        dietary: 'Quick',
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
      },
      {
        id: 'rec-9',
        title: 'Avocado Lime Green Goddess Grain Bowl',
        prepTime: '8 mins',
        cookTime: '10 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 380,
        wasteSavedGrams: 320,
        mealType: 'Lunch',
        cuisine: 'Mexican',
        dietary: 'Vegan',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Pantry').map(p => p.product_name),
        missingIngredients: ['Cooked Quinoa or Rice', 'Lime Juice', 'Cumin', 'Coriander / Cilantro'],
        tags: ['Superfood', 'Healthy', 'Gluten-Free', 'Vegan'],
        summary: 'A vibrant power bowl packed with grains, creamy diced avocados, greens, and a zesty lime vinaigrette.',
        instructions: [
          'Warm pre-cooked grains (quinoa, brown rice, or couscous) in a bowl.',
          'Dice ripe avocados, tomatoes, cucumbers, and shred fresh leafy greens.',
          'Whisk lime juice, olive oil, minced garlic, cumin, salt, and cilantro for the dressing.',
          'Layer the ingredients in colorful bowls, drizzle generously with dressing, and enjoy!'
        ],
        storageTip: 'Keep dressing separate until ready to serve to keep greens crisp.'
      },
      {
        id: 'rec-10',
        title: 'Creamy Coconut Curry with Wilted Greens & Protein',
        prepTime: '10 mins',
        cookTime: '18 mins',
        difficulty: 'Easy',
        servings: 3,
        calories: 490,
        wasteSavedGrams: 410,
        mealType: 'Dinner',
        cuisine: 'Indian',
        dietary: 'High-Protein',
        matchedIngredients: products.map(p => p.product_name),
        missingIngredients: ['Coconut Milk', 'Curry Powder or Garam Masala', 'Turmeric', 'Ginger'],
        tags: ['Indian Curry', 'Comfort Food', 'Warm & Spiced'],
        summary: 'A rich, golden curry simmering whatever vegetables and proteins you have in aromatic coconut broth.',
        instructions: [
          'Heat oil in a wide pot and sauté diced onions, garlic, and minced ginger for 3 minutes.',
          'Stir in curry powder, turmeric, and cumin until fragrant.',
          'Add your diced vegetables, proteins, and pour in 1 can of coconut milk.',
          'Simmer on medium-low for 15 minutes, tossing in leafy greens in the last 2 minutes until wilted. Serve over basmati rice.'
        ],
        storageTip: 'Curry tastes even better on day 2 as spices meld together!'
      },
      {
        id: 'rec-11',
        title: 'Golden Spinach & Feta Frittata Bake',
        prepTime: '8 mins',
        cookTime: '16 mins',
        difficulty: 'Easy',
        servings: 3,
        calories: 340,
        wasteSavedGrams: 300,
        mealType: 'Breakfast',
        cuisine: 'Mediterranean',
        dietary: 'High-Protein',
        matchedIngredients: products.filter(p => p.category === 'Dairy & Eggs' || p.category === 'Produce').map(p => p.product_name),
        missingIngredients: ['Eggs (4-6)', 'Feta or Cheddar Cheese', 'Olive Oil', 'Black Pepper'],
        tags: ['High-Protein', 'Keto Friendly', 'Easy Brunch'],
        summary: 'A fluffy oven or skillet frittata turning excess eggs and wilting greens into an upscale brunch centerpiece.',
        instructions: [
          'Preheat oven to 190°C (375°F) or heat an oven-safe skillet on the stovetop.',
          'Sauté spinach, peppers, and onions in olive oil until soft and wilted.',
          'Whisk eggs with a splash of milk, salt, pepper, and pour evenly over the vegetables.',
          'Crumble feta cheese on top and bake or cook covered on low for 12-15 minutes until set and puffy.'
        ],
        storageTip: 'Slices can be wrapped in foil and kept in the fridge for up to 4 days for grab-and-go morning protein.'
      },
      {
        id: 'rec-12',
        title: 'Loaded Sweet Potato & Black Bean Burrito Skillet',
        prepTime: '10 mins',
        cookTime: '15 mins',
        difficulty: 'Easy',
        servings: 3,
        calories: 420,
        wasteSavedGrams: 370,
        mealType: 'Dinner',
        cuisine: 'Mexican',
        dietary: 'Vegetarian',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Pantry').map(p => p.product_name),
        missingIngredients: ['Canned Black Beans', 'Salsa', 'Cheddar Cheese', 'Taco Seasoning'],
        tags: ['Tex-Mex', 'One-Pan Meal', 'Family Friendly'],
        summary: 'All the vibrant flavors of a loaded burrito packed into a fast, cheesy one-pan weeknight skillet.',
        instructions: [
          'Dice sweet potatoes or potatoes and microwave for 3 minutes to accelerate cooking.',
          'In a hot skillet with olive oil, sauté the potatoes and vegetables with taco seasoning for 6 minutes.',
          'Fold in rinsed black beans, salsa, and simmer for 4 minutes until bubbling.',
          'Top with shredded cheese, cover with a lid for 2 minutes to melt, and garnish with green onions.'
        ],
        storageTip: 'Great filling for wraps, quesadillas, or over tortilla chips for loaded nachos!'
      },
      {
        id: 'rec-13',
        title: 'Spicy Garlic Sesame Noodles with Crunchy Greens',
        prepTime: '5 mins',
        cookTime: '8 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 390,
        wasteSavedGrams: 260,
        mealType: 'Lunch',
        cuisine: 'Asian',
        dietary: 'Quick',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Pantry').map(p => p.product_name),
        missingIngredients: ['Noodles or Spaghetti', 'Soy Sauce', 'Chili Crisp / Sriracha', 'Sesame Seeds'],
        tags: ['15-Minute Meal', 'Pan-Asian', 'Quick Lunch'],
        summary: 'Slurpable, addictive garlic chili noodles tossed with whatever leftover crisp veggies you need to finish.',
        instructions: [
          'Boil noodles according to package directions; drain and rinse with cold water.',
          'In a bowl, whisk soy sauce, sesame oil, minced garlic, chili crisp, and a pinch of sugar.',
          'In a hot pan, quickly flash-fry sliced cabbage, carrots, or greens for 2 minutes.',
          'Toss noodles, vegetables, and the spicy sauce together over medium heat until glossy and coated.'
        ],
        storageTip: 'Delicious served either piping hot or chilled straight out of the fridge!'
      },
      {
        id: 'rec-14',
        title: 'Crispy Smashed Rosemary Potatoes with Garlic Aioli',
        prepTime: '10 mins',
        cookTime: '20 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 320,
        wasteSavedGrams: 350,
        mealType: 'Lunch',
        cuisine: 'American',
        dietary: 'Vegetarian',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Pantry').map(p => p.product_name),
        missingIngredients: ['Olive Oil', 'Fresh Rosemary or Thyme', 'Sea Salt', 'Mayo & Garlic'],
        tags: ['Crispy Side', 'Snack', 'Comfort Food'],
        summary: 'Boiled and crushed baby potatoes roasted until ultra-crisp and served with a quick lemon garlic dip.',
        instructions: [
          'Boil whole potatoes in salted water for 12 minutes until fork-tender.',
          'Place potatoes on a baking sheet and smash flat using the bottom of a glass cup.',
          'Drizzle generously with olive oil, salt, pepper, and chopped rosemary.',
          'Bake at 220°C (425°F) for 18 minutes until edges are golden brown and crackly.'
        ],
        storageTip: 'Reheat in an air fryer for 3 minutes to regain 100% crispiness.'
      },
      {
        id: 'rec-15',
        title: 'Overripe Banana Walnut Fluffy Oat Pancakes',
        prepTime: '6 mins',
        cookTime: '8 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 350,
        wasteSavedGrams: 280,
        mealType: 'Breakfast',
        cuisine: 'American',
        dietary: 'Vegetarian',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs' || p.category === 'Bakery').map(p => p.product_name),
        missingIngredients: ['Rolled Oats or Flour', 'Baking Powder', 'Cinnamon', 'Maple Syrup'],
        tags: ['Zero Sugar Added', 'Kid Friendly', 'Bakery Rescue'],
        summary: 'Rescue spotted or browning bananas by turning them into naturally sweet, protein-rich fluffy pancakes.',
        instructions: [
          'Mash 2 ripe bananas in a bowl until smooth.',
          'Whisk in 2 eggs, 1 cup oats (blended or rolled), 1 tsp baking powder, and a dash of cinnamon.',
          'Ladle batter onto a buttered non-stick pan over medium heat.',
          'Flip once bubbles appear (about 2 minutes per side) and serve warm with walnuts and maple syrup.'
        ],
        storageTip: 'Freeze cooked pancakes separated by parchment paper; pop into the toaster anytime!'
      },
      {
        id: 'rec-16',
        title: 'Zesty Citrus Herb Chicken Salad with Sourdough Croutons',
        prepTime: '10 mins',
        cookTime: '12 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 440,
        wasteSavedGrams: 390,
        mealType: 'Lunch',
        cuisine: 'Mediterranean',
        dietary: 'High-Protein',
        matchedIngredients: products.filter(p => p.category === 'Meat & Poultry' || p.category === 'Produce' || p.category === 'Bakery').map(p => p.product_name),
        missingIngredients: ['Dijon Mustard', 'Olive Oil', 'Lemon Juice', 'Parmesan'],
        tags: ['High-Protein', 'Fresh Salad', 'Keto Friendly'],
        summary: 'Tender pan-seared chicken breast tossed over crisp greens with toasted homemade garlic croutons.',
        instructions: [
          'Season chicken breast with salt, pepper, and dried oregano; pan-sear for 6 minutes per side until cooked.',
          'Cube leftover bread and toast with olive oil in a skillet until crunchy croutons form.',
          'Whisk olive oil, Dijon mustard, lemon juice, salt, and pepper into a bright vinaigrette.',
          'Slice warm chicken and assemble over greens with croutons, shaved parmesan, and dressing.'
        ],
        storageTip: 'Store grilled chicken in the fridge for easy meal additions throughout the week.'
      },
      {
        id: 'rec-17',
        title: 'Savory Bread & Cheese Strata Casserole',
        prepTime: '12 mins',
        cookTime: '25 mins',
        difficulty: 'Medium',
        servings: 4,
        calories: 480,
        wasteSavedGrams: 520,
        mealType: 'Dinner',
        cuisine: 'Italian',
        dietary: 'Vegetarian',
        matchedIngredients: products.filter(p => p.category === 'Bakery' || p.category === 'Dairy & Eggs' || p.category === 'Produce').map(p => p.product_name),
        missingIngredients: ['Eggs (4)', 'Milk (1 cup)', 'Cheddar / Mozzarella', 'Nutmeg / Herbs'],
        tags: ['Family Dinner', 'Comfort Food', 'Zero-Waste Champion'],
        summary: 'A golden baked Italian strata turning day-old bread, eggs, cheese, and vegetables into a luscious soufflé bake.',
        instructions: [
          'Cube 3-4 slices of day-old bread and arrange in a greased baking dish.',
          'Layer sautéed vegetables (spinach, onions, tomatoes) and shredded cheese between bread cubes.',
          'Whisk eggs, milk, salt, pepper, and a pinch of nutmeg; pour evenly over the dish.',
          'Bake at 180°C (350°F) for 25 minutes until golden, puffed, and set in the center.'
        ],
        storageTip: 'Can be assembled the night before and baked fresh in the morning!'
      },
      {
        id: 'rec-18',
        title: 'Chilled Mango Yogurt Lassi & Chia Seed Bowl',
        prepTime: '5 mins',
        cookTime: '0 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 220,
        wasteSavedGrams: 200,
        mealType: 'Breakfast',
        cuisine: 'Indian',
        dietary: 'Quick',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Cardamom Powder', 'Honey', 'Crushed Pistachios'],
        tags: ['No-Cook', 'Probiotic Boost', 'Refreshing Drink'],
        summary: 'A cool, creamy Indian yogurt drink rescuing ripe mangoes or sweet fruits with aromatic cardamom.',
        instructions: [
          'Peel and dice ripe mango or tropical fruit.',
          'Blend yogurt, fruit, cold water or milk, a dash of ground cardamom, and a spoonful of honey.',
          'Blend until frothy and smooth.',
          'Pour into chilled glasses and garnish with crushed pistachios or mint leaves.'
        ],
        storageTip: 'Keeps refreshing and cold in an insulated flask for up to 24 hours.'
      },
      {
        id: 'rec-19',
        title: 'Smoky Chipotle Shakshuka with Poached Eggs',
        prepTime: '8 mins',
        cookTime: '14 mins',
        difficulty: 'Easy',
        servings: 2,
        calories: 360,
        wasteSavedGrams: 340,
        mealType: 'Breakfast',
        cuisine: 'Mediterranean',
        dietary: 'High-Protein',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Canned Chopped Tomatoes', 'Eggs (3-4)', 'Smoked Paprika', 'Cumin'],
        tags: ['Middle Eastern', 'One-Skillet', 'Spiced Brunch'],
        summary: 'Eggs gently poached in a simmering spiced sauce of tomatoes, bell peppers, garlic, and smoked chili.',
        instructions: [
          'Sauté chopped onions, garlic, and bell peppers in olive oil in a wide skillet for 5 minutes.',
          'Add canned tomatoes, cumin, smoked paprika, salt, and black pepper; simmer until sauce thickens.',
          'Make 3-4 small wells in the sauce and crack whole eggs directly into each well.',
          'Cover with a lid and cook on low heat for 5-7 minutes until egg whites are set but yolks remain runny.',
          'Garnish with fresh parsley and serve with warm bread for dipping.'
        ],
        storageTip: 'Leftover tomato base can be frozen or used as a rich pasta sauce.'
      },
      {
        id: 'rec-20',
        title: 'Crispy Vegetable Fritters with Garlic Herb Dip',
        prepTime: '10 mins',
        cookTime: '10 mins',
        difficulty: 'Easy',
        servings: 3,
        calories: 290,
        wasteSavedGrams: 400,
        mealType: 'Lunch',
        cuisine: 'Fusion',
        dietary: 'Quick',
        matchedIngredients: products.filter(p => p.category === 'Produce' || p.category === 'Dairy & Eggs').map(p => p.product_name),
        missingIngredients: ['Flour (1/2 cup)', 'Baking Powder', 'Egg (1)', 'Yogurt Dip'],
        tags: ['Finger Food', 'Scrap Rescue', 'Crispy Snack'],
        summary: 'Grated zucchini, carrots, potatoes, and greens bound in a light batter and pan-fried until golden crisp.',
        instructions: [
          'Grate or finely shred any surplus vegetables (carrots, potatoes, zucchini, broccoli stems).',
          'Squeeze out excess moisture with a clean kitchen towel.',
          'Mix with 1 egg, 1/2 cup flour, salt, pepper, and herbs until a thick batter forms.',
          'Drop spoonfuls into hot oil in a skillet, flattening slightly, and fry for 3-4 minutes per side until golden brown.',
          'Serve hot with a side of garlic yogurt or spicy mayo dip.'
        ],
        storageTip: 'Fritters reheat to crispy perfection in an oven or air fryer at 200°C for 4 minutes.'
      }
    ];

    return {
      recipes,
      featured: recipes[0]
    };
  },

  // Interactive FreshBot Assistant with Inventory Intelligence (100% Pure Tamil & English)
  chatFreshBot: async (message, lang = 'en') => {
    try {
      const products = storage.getProducts() || [];
      const urgentItems = products.filter(p => p.status === 'URGENT');
      const soonItems = products.filter(p => p.status === 'EXPIRING SOON');
      const msg = (message || '').toLowerCase().trim();

      await new Promise(r => setTimeout(r, 350));

      const isTa = lang === 'ta' || msg.includes('காலாவதி') || msg.includes('அவசரம்') || msg.includes('பிரிட்ஜ்') || msg.includes('வணக்கம்') || msg.includes('சமையல்');

      // 1. Expiry & Inventory Queries
      if (msg.includes('expir') || msg.includes('urgent') || msg.includes('காலாவதி') || msg.includes('அவசரம்') || msg.includes('fridge') || msg.includes('பிரிட்ஜ்') || msg.includes('what do i have')) {
        if (urgentItems.length === 0 && soonItems.length === 0) {
          return {
            reply: isTa
              ? `🎉 மகிழ்ச்சியான செய்தி! அடுத்த 3 நாட்களில் எந்த உணவும் காலாவதியாகவில்லை. உங்கள் ${products.length} உணவுப் பொருட்களும் புத்தம் புதியதாகவும் பாதுகாப்பாகவும் உள்ளன!`
              : `🎉 Great news! You have no urgent items expiring in the next 3 days. All your ${products.length} products are fresh and safe!`,
            suggestedActions: isTa
              ? ['இரவு உணவு செய்முறை தாருங்கள்', 'வெண்ணெய் பழத்தை பாதுகாப்பது எப்படி?', 'சேமிப்பு விவரங்களைக் காட்டு']
              : ['Suggest a dinner recipe', 'How to store avocados', 'Show my savings']
          };
        }
        
        if (isTa) {
          const urgentList = urgentItems.map(i => `• **${i.product_name}** (${i.days_left <= 0 ? 'இன்றே காலாவதியாகிறது' : 'நாளை காலாவதியாகிறது'})`).join('\n');
          const soonList = soonItems.map(i => `• ${i.product_name} (${i.days_left} நாட்களில்)`).join('\n');
          return {
            reply: `⚠️ உங்கள் சமையலறையில் கவனம் செலுத்த வேண்டிய உணவுகள்:\n\n${urgentList ? `**🚨 அவசரம் (அடுத்த 24-48 மணிநேரம்):**\n${urgentList}\n\n` : ''}${soonList ? `**⏳ 2-3 நாட்களில் காலாவதி:**\n${soonList}\n\n` : ''}இவற்றை வைத்து சுவையான பூஜ்ஜிய கழிவு செய்முறையை உருவாக்கவா?`,
            suggestedActions: ['அவசர உணவுகளுக்கான செய்முறை', 'ரொட்டியை பிரீசரில் வைப்பது எப்படி?', '3 நிமிட சமையலறை தணிக்கை']
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
          reply: isTa
            ? `👨‍🍳 உங்கள் குளிர்சாதனப் பெட்டியில் உள்ள **${topItems.join(', ') || 'காய்கறிகள் மற்றும் உணவுகளைக்'}** கொண்டு 20-க்கும் மேற்பட்ட சுவையான சமையல் குறிப்புகள் உருவாக்கப்பட்டுள்ளன!\n\n**AI சமையல் கலைஞர்** பக்கத்திற்கு சென்று உணவு வகை மற்றும் உணவு முறையைத் தேர்ந்தெடுத்து சமைக்கலாம்.`
            : `👨‍🍳 I have generated **20+ Zero-Waste Recipes** including Pasta Primavera, Coconut Curry, Shakshuka, Fried Rice, and Skillets using **${topItems.join(' and ') || 'your available pantry ingredients'}**!\n\nOpen the **AI Recipe Chef** module to filter by cuisine, meal type, and dietary preferences.`,
          suggestedActions: isTa
            ? ['AI சமையல் பக்கத்தை திற', 'காலாவதியாகும் உணவுகள்', 'கீரைகளை சேமிக்கும் முறை']
            : ['Open AI Recipes', 'Show expiring items', 'How to store greens']
        };
      }

      // 3. Storage & Shelf Life Advice
      if (msg.includes('store') || msg.includes('keep') || msg.includes('fresh') || msg.includes('freeze') || msg.includes('shelf') || msg.includes('சேமிப்பு') || msg.includes('பாதுகாப்பு')) {
        return {
          reply: isTa
            ? `💡 **FreshBot உணவுப் பாதுகாப்பு விதிகள்:**\n\n1. **ரொட்டி & பேக்கரி:** குளிர்சாதனப் பெட்டியில் வைக்காதீர்கள்! ரொட்டிப் பெட்டியில் வைக்கவும் அல்லது நறுக்கி பிரீசரில் சேமிக்கவும்.\n2. **ஸ்ட்ராபெர்ரி & பழங்கள்:** சாப்பிடும் வரை கழுவாமல் காற்றுப்புகும் பெட்டியில் வைக்கவும்.\n3. **பால் & தயிர்:** பிரிட்ஜின் நடுப்பகுதியில் வைக்கவும், கதவுப் பகுதியில் வைக்காதீர்கள்.\n4. **பசலைக்கீரை & கீரைகள்:** உலர்ந்த துணி அல்லது காகிதத்தில் சுற்றி காற்றுப்புகா பெட்டியில் வைக்கவும்.\n5. **வாழைப்பழம் & ஆப்பிள்:** எத்திலீன் வாயுவை வெளியிடுவதால் பிற காய்கறிகளிலிருந்து தள்ளி வைக்கவும்.`
            : `💡 **FreshBot Food Preservation Rules:**\n\n1. **Bread & Bakery:** Never refrigerate! Store in a dry bread box or slice and freeze.\n2. **Berries:** Keep unwashed in a breathable container until eating.\n3. **Milk & Dairy:** Keep in the middle/back of the fridge (coldest), never in the door.\n4. **Leafy Greens:** Wrap in a clean dry paper towel inside an airtight container to absorb humidity.\n5. **Bananas & Apples:** Keep separate from greens as they release ripening ethylene gas.`,
          suggestedActions: isTa
            ? ['பாதுகாப்பு வழிகாட்டியை திற', 'விரைவில் காலாவதியாகும் உணவுகள்', 'உர ஆய்வகம்']
            : ['Open Preservation Encyclopedia', 'What is expiring soon?', 'Compost Scrap Guide']
        };
      }

      // 4. Savings & Environmental Sustainability
      if (msg.includes('saving') || msg.includes('waste') || msg.includes('money') || msg.includes('stat') || msg.includes('சேமிப்பு') || msg.includes('பணம்')) {
        const stats = storage.getSavingsStats();
        return {
          reply: isTa
            ? `🌱 **உங்கள் பூஜ்ஜிய கழிவு சுற்றுச்சூழல் சாதனை:**\n\n• 💰 **$${stats.moneySaved}** உணவு வீணாவதைத் தடுத்து சேமித்த பணம்\n• 🥗 **${stats.foodItemsSaved} உணவுப் பொருட்கள்** பாதுகாப்பாக சமைக்கப்பட்டன\n• 🌍 **${stats.co2PreventedKg} கிலோ CO₂** பசுமை இல்ல வாயு உமிழ்வு குறைக்கப்பட்டது\n\nபூமியையும் உங்கள் பணத்தையும் பாதுகாக்கும் அற்புதமான பணிக்கு வாழ்த்துகள்!`
            : `🌱 **Your Zero-Waste Impact Summary:**\n\n• 💰 **$${stats.moneySaved}** saved by preventing grocery spoilage\n• 🥗 **${stats.foodItemsSaved} food items** consumed safely\n• 🌍 **${stats.co2PreventedKg} kg CO₂** greenhouse gas emissions avoided\n\nAwesome work protecting the planet and your wallet!`,
          suggestedActions: isTa
            ? ['கழிவு பகுப்பாய்வு', 'காலாவதி நிலவரம்', 'சுற்றுச்சூழல் சவால்கள்']
            : ['Open Waste Analytics', 'What is expiring soon?', 'View Eco Quests']
        };
      }

      // 5. Greetings & Help
      if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey') || msg.includes('வணக்கம்') || msg.includes('help')) {
        return {
          reply: isTa
            ? `👋 வணக்கம்! நான் FreshBot AI, உங்கள் சமையலறை உணவுப் பாதுகாவலன். உங்கள் உணவுகள் வீணாவதைத் தடுக்க நான் தயாராக உள்ளேன்.\n\nஎன்னிடம் கேளுங்கள்:\n• *"குளிர்சாதனப் பெட்டியில் என்ன காலாவதியாகிறது?"*\n• *"இன்றைய உணவு செய்முறை தாருங்கள்"*\n• *"பழங்களை எவ்வாறு பாதுகாப்பது?"*`
            : `👋 Hello! I am FreshBot AI, your personal zero-waste kitchen assistant. I am actively monitoring your kitchen inventory.\n\nAsk me anything like:\n• *"What is expiring soon?"*\n• *"Suggest a dinner recipe"*\n• *"How do I keep berries fresh?"*`,
          suggestedActions: isTa
            ? ['காலாவதியாகும் உணவுகள்', 'இரவு உணவு செய்முறை', 'உணவு சேமிப்பு முறைகள்']
            : ["What's expiring soon?", 'Generate dinner recipe', 'Kitchen storage tips']
        };
      }

      // Default Intelligent Helper
      return {
        reply: isTa
          ? `🤖 சமையலறை உணவுகளை நிர்வகிக்கவும், கழிவைத் தடுக்கவும், சுவையான செய்முறைகளை உருவாக்கவும் நான் உதவுகிறேன்!\n\nதற்போது உங்கள் சமையலறையில் **${products.length} உணவுகள்** கண்காணிக்கப்படுகின்றன. சமையல் யோசனைகள் அல்லது காலாவதி விவரங்களை எப்போது வேண்டுமானாலும் கேட்கலாம்.`
          : `🤖 I'm here to help you manage food, prevent waste, and discover zero-waste recipes!\n\nCurrently tracking **${products.length} food items** in your kitchen. You can ask me for recipe ideas, shelf-life advice, or expiry checks anytime.`,
        suggestedActions: isTa
          ? ['காலாவதி நிலவரம்', 'விரைவு செய்முறை', '3 நிமிட தணிக்கை']
          : ["What's expiring soon?", 'Generate quick recipe', 'Open 3-Min Audit']
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
