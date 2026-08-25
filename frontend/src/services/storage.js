// Intelligent Local Engine for Food Expiry Guardian AI

const STORAGE_KEYS = {
  PRODUCTS: 'feg_products',
  USER: 'feg_user',
  TOKEN: 'token',
  NOTIFICATIONS: 'feg_notifications',
  MEAL_PLAN: 'feg_meal_plan',
  SAVINGS: 'feg_savings_stats',
  THEME: 'feg_theme',
  SHOPPING_LIST: 'feg_shopping_list',
  SETTINGS: 'feg_settings',
  DONATIONS: 'feg_donations',
  CHALLENGES: 'feg_challenges',
  HOUSEHOLD: 'feg_household',
  COMPOST: 'feg_compost'
};

const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    product_name: 'Organic Whole Milk',
    category: 'Dairy & Eggs',
    expiry_date: getFutureDate(1),
    quantity: 1,
    unit: 'Bottle (1L)',
    barcode: '8901030383011',
    estimated_price: 3.89,
    location: 'Fridge Top Shelf',
    notes: 'Opened 3 days ago',
    ocr_confidence: 0.94,
    calories: 620,
    protein: 32,
    carbs: 48,
    fat: 34,
    fiber: 0,
    ownership: 'Shared'
  },
  {
    id: 'prod-2',
    product_name: 'Fresh Strawberries',
    category: 'Produce',
    expiry_date: getFutureDate(0), // Today
    quantity: 2,
    unit: 'Punnets (250g)',
    barcode: '8901030383022',
    estimated_price: 4.50,
    location: 'Fridge Crisper Drawer',
    notes: 'Sweet and ripe, use quickly',
    ocr_confidence: 0.98,
    calories: 160,
    protein: 3,
    carbs: 38,
    fat: 1,
    fiber: 10,
    ownership: 'Shared'
  },
  {
    id: 'prod-3',
    product_name: 'Greek Yogurt Plain',
    category: 'Dairy & Eggs',
    expiry_date: getFutureDate(3),
    quantity: 1,
    unit: 'Tub (500g)',
    barcode: '8901030383033',
    estimated_price: 4.20,
    location: 'Fridge Door',
    notes: 'Great for smoothies or parfaits',
    ocr_confidence: 0.91,
    calories: 380,
    protein: 50,
    carbs: 18,
    fat: 10,
    fiber: 0,
    ownership: 'Personal (Alex)'
  },
  {
    id: 'prod-4',
    product_name: 'Artisan Sourdough Bread',
    category: 'Bakery',
    expiry_date: getFutureDate(2),
    quantity: 1,
    unit: 'Loaf',
    barcode: '8901030383044',
    estimated_price: 5.50,
    location: 'Bread Box',
    notes: 'Freeze half if not consumed soon',
    ocr_confidence: 0.89,
    calories: 1200,
    protein: 42,
    carbs: 230,
    fat: 8,
    fiber: 14,
    ownership: 'Shared'
  },
  {
    id: 'prod-5',
    product_name: 'Organic Baby Spinach',
    category: 'Produce',
    expiry_date: getFutureDate(2),
    quantity: 1,
    unit: 'Bag (200g)',
    barcode: '8901030383055',
    estimated_price: 2.99,
    location: 'Fridge Crisper Drawer',
    notes: 'Tender leaves',
    ocr_confidence: 0.95,
    calories: 46,
    protein: 6,
    carbs: 7,
    fat: 1,
    fiber: 5,
    ownership: 'Shared'
  },
  {
    id: 'prod-6',
    product_name: 'Free-Range Eggs (Large)',
    category: 'Dairy & Eggs',
    expiry_date: getFutureDate(14),
    quantity: 12,
    unit: 'Pack of 12',
    barcode: '8901030383066',
    estimated_price: 4.99,
    location: 'Fridge Middle Shelf',
    notes: 'Grade A organic',
    ocr_confidence: 0.99,
    calories: 840,
    protein: 72,
    carbs: 4,
    fat: 60,
    fiber: 0,
    ownership: 'Shared'
  },
  {
    id: 'prod-7',
    product_name: 'Boneless Chicken Breast',
    category: 'Meat & Poultry',
    expiry_date: getFutureDate(1),
    quantity: 2,
    unit: 'Packs (600g)',
    barcode: '8901030383077',
    estimated_price: 9.40,
    location: 'Fridge Bottom Shelf',
    notes: 'Keep chilled or freeze today',
    ocr_confidence: 0.96,
    calories: 990,
    protein: 186,
    carbs: 0,
    fat: 22,
    fiber: 0,
    ownership: 'Shared'
  },
  {
    id: 'prod-8',
    product_name: 'Sharp Cheddar Cheese Block',
    category: 'Dairy & Eggs',
    expiry_date: getFutureDate(25),
    quantity: 1,
    unit: 'Block (400g)',
    barcode: '8901030383088',
    estimated_price: 6.20,
    location: 'Fridge Middle Shelf',
    notes: 'Aged 12 months',
    ocr_confidence: 0.92,
    calories: 1600,
    protein: 100,
    carbs: 6,
    fat: 132,
    fiber: 0,
    ownership: 'Shared'
  },
  {
    id: 'prod-9',
    product_name: 'Italian Penne Rigate',
    category: 'Pantry',
    expiry_date: getFutureDate(180),
    quantity: 2,
    unit: 'Boxes (500g)',
    barcode: '8901030383099',
    estimated_price: 2.50,
    location: 'Pantry Shelf 1',
    notes: 'Dry staple',
    ocr_confidence: 0.99,
    calories: 1750,
    protein: 60,
    carbs: 360,
    fat: 8,
    fiber: 16,
    ownership: 'Shared'
  }
];

const INITIAL_SHOPPING_LIST = [
  { id: 'shop-1', name: 'Avocados (Hass)', category: 'Produce', quantity: 3, unit: 'pcs', estimatedPrice: 3.50, checked: false, addedFrom: 'restock' },
  { id: 'shop-2', name: 'Almond Milk (Unsweetened)', category: 'Dairy & Eggs', quantity: 1, unit: 'Carton', estimatedPrice: 3.20, checked: false, addedFrom: 'manual' },
  { id: 'shop-3', name: 'Olive Oil Extra Virgin', category: 'Pantry', quantity: 1, unit: 'Bottle (500ml)', estimatedPrice: 8.90, checked: true, addedFrom: 'manual' },
  { id: 'shop-4', name: 'Whole Wheat Tortillas', category: 'Bakery', quantity: 1, unit: 'Pack of 8', estimatedPrice: 2.80, checked: false, addedFrom: 'recipe' }
];

const INITIAL_DONATIONS = [
  { id: 'don-1', name: 'Unopened Canned Diced Tomatoes', category: 'Pantry', quantity: 4, bestBefore: getFutureDate(120), status: 'Available', donor: 'Alex Rivera', location: 'Downtown Community Fridge #2' },
  { id: 'don-2', name: 'Sealed Whole Oats (1kg)', category: 'Pantry', quantity: 2, bestBefore: getFutureDate(90), status: 'Claimed', donor: 'Alex Rivera', location: 'St. Mary Food Pantry' },
  { id: 'don-3', name: 'Organic Apples (Bag of 6)', category: 'Produce', quantity: 1, bestBefore: getFutureDate(5), status: 'Available', donor: 'Sarah Jenkins', location: 'West End Fridge Hub' }
];

const INITIAL_CHALLENGES = {
  xp: 1250,
  level: 4,
  levelTitle: 'Waste Reduction Champion',
  currentStreakDays: 6,
  bestStreakDays: 14,
  quests: [
    { id: 'q-1', title: 'Zero-Waste Weekend', desc: 'Cook 3 consecutive meals using only existing fridge items without buying takeout.', xpReward: 300, progress: 2, target: 3, completed: false, badge: '🍳' },
    { id: 'q-2', title: 'Leafy Green Rescue', desc: 'Consume a bag of fresh greens within 48 hours of purchase.', xpReward: 200, progress: 1, target: 1, completed: true, badge: '🥬' },
    { id: 'q-3', title: 'Freezer Reset Master', desc: 'Thaw and eat 2 pre-frozen meals this week.', xpReward: 250, progress: 1, target: 2, completed: false, badge: '🧊' },
    { id: 'q-4', title: 'Smart Scanner Pro', desc: 'Scan 5 items with OCR or barcode detector.', xpReward: 150, progress: 5, target: 5, completed: true, badge: '📷' }
  ],
  trophies: [
    { id: 't-1', title: 'First Food Saved', desc: 'Logged your first zero-waste meal.', unlocked: true, icon: '🌱' },
    { id: 't-2', title: 'Centurion Saver', desc: 'Saved over $100 in prevented food waste.', unlocked: true, icon: '💰' },
    { id: 't-3', title: 'Community Hero', desc: 'Donated an item to a community food fridge.', unlocked: true, icon: '❤️' },
    { id: 't-4', title: 'Master Chef Zero', desc: 'Cooked 10 AI zero-waste recipes.', unlocked: false, icon: '👨‍🍳' }
  ]
};

const INITIAL_HOUSEHOLD = {
  name: 'Maplewood Suite 4B',
  members: [
    { id: 'mem-1', name: 'Alex Rivera', role: 'Kitchen Admin', avatar: '🥑', color: 'bg-emerald-500' },
    { id: 'mem-2', name: 'Maya Lin', role: 'Roommate', avatar: '🍓', color: 'bg-rose-500' },
    { id: 'mem-3', name: 'Sam Chen', role: 'Roommate', avatar: '🥕', color: 'bg-amber-500' }
  ],
  chores: [
    { id: 'ch-1', chore: 'Fridge Wipe-down & Reset', assignedTo: 'Maya Lin', due: 'Saturday', status: 'Pending' },
    { id: 'ch-2', chore: 'Mid-week Expiry Audit', assignedTo: 'Alex Rivera', due: 'Wednesday', status: 'Completed' },
    { id: 'ch-3', chore: 'Grocery Restock Trip', assignedTo: 'Sam Chen', due: 'Sunday', status: 'Pending' }
  ],
  feed: [
    { id: 'f-1', user: 'Alex Rivera', action: 'cooked Zero-Waste Skillet & rescued Whole Milk', time: '2 hours ago' },
    { id: 'f-2', user: 'Maya Lin', action: 'added Greek Yogurt to Shared Fridge Door', time: 'Yesterday' },
    { id: 'f-3', user: 'Sam Chen', action: 'transferred 4 items from Shopping List to Fridge', time: '2 days ago' }
  ]
};

const INITIAL_COMPOST = {
  greensKg: 4.8, // Nitrogen (scraps, fruit peels, greens)
  brownsKg: 5.2, // Carbon (paper towel, cardboard, dry leaves)
  lastTurned: '3 days ago',
  moistureLevel: 'Optimal (55%)',
  totalCompostHarvestedKg: 28.5,
  scrapsSaved: [
    { id: 'sc-1', item: 'Coffee Grounds', bestUse: 'Soil Nitrogen Booster & Natural Deodorizer', category: 'Garden' },
    { id: 'sc-2', item: 'Vegetable Peels (Carrot, Onion, Celery)', bestUse: 'Simmer into Golden Homemade Vegetable Scrap Broth', category: 'Broth' },
    { id: 'sc-3', item: 'Citrus Peels (Orange, Lemon)', bestUse: 'Infuse in white vinegar for eco all-purpose cleaner spray', category: 'Cleaning' },
    { id: 'sc-4', item: 'Eggshells (Crushed)', bestUse: 'Calcium supplement for tomato plants & natural pest deterrent', category: 'Garden' },
    { id: 'sc-5', item: 'Banana Peels', bestUse: 'Soak in water for 48h to make organic potassium plant fertilizer', category: 'Liquid Fertilizer' }
  ]
};

const DEFAULT_SETTINGS = {
  currency: '$',
  currencyCode: 'USD',
  dietaryPreference: 'All (No Restrictions)',
  soundEffects: true,
  leadTimeDays: 3,
  notificationsEmail: true,
  ecoGoalMonthlyKg: 50
};

export const computeStatus = (expiryDateStr) => {
  if (!expiryDateStr) return 'SAFE';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'EXPIRED';
  if (diffDays <= 1) return 'URGENT';
  if (diffDays <= 3) return 'EXPIRING SOON';
  return 'SAFE';
};

export const getDaysRemaining = (expiryDateStr) => {
  if (!expiryDateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const storage = {
  // Products CRUD
  getProducts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS.map(p => ({ ...p, status: computeStatus(p.expiry_date), days_left: getDaysRemaining(p.expiry_date) }));
      }
      const parsed = JSON.parse(data);
      return parsed.map(p => ({
        ...p,
        status: computeStatus(p.expiry_date),
        days_left: getDaysRemaining(p.expiry_date)
      }));
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts: (products) => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  addProduct: (product) => {
    const products = storage.getProducts();
    const newProduct = {
      ...product,
      id: product.id || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      quantity: Number(product.quantity) || 1,
      estimated_price: Number(product.estimated_price) || 3.50,
      calories: Number(product.calories) || 250,
      protein: Number(product.protein) || 10,
      carbs: Number(product.carbs) || 20,
      fat: Number(product.fat) || 5,
      fiber: Number(product.fiber) || 2,
      ownership: product.ownership || 'Shared',
      created_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    storage.saveProducts(products);
    storage.generateNotifications();
    return { ...newProduct, status: computeStatus(newProduct.expiry_date), days_left: getDaysRemaining(newProduct.expiry_date) };
  },

  updateProduct: (id, updatedFields) => {
    const products = storage.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedFields };
      storage.saveProducts(products);
      storage.generateNotifications();
      return { ...products[idx], status: computeStatus(products[idx].expiry_date), days_left: getDaysRemaining(products[idx].expiry_date) };
    }
    return null;
  },

  deleteProduct: (id) => {
    const products = storage.getProducts();
    const filtered = products.filter(p => p.id !== id);
    storage.saveProducts(filtered);
    storage.generateNotifications();
    return true;
  },

  consumeProduct: (id) => {
    const products = storage.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      storage.recordSavings(product.estimated_price || 4.0, product.product_name, 'consumed');
      storage.suggestAutoRestock(product.product_name, product.category, product.unit, product.estimated_price);
      storage.addQuestXP(50);
      const filtered = products.filter(p => p.id !== id);
      storage.saveProducts(filtered);
      storage.generateNotifications();
      return product;
    }
    return null;
  },

  markWasted: (id) => {
    const products = storage.getProducts();
    const product = products.find(p => p.id === id);
    if (product) {
      storage.recordSavings(product.estimated_price || 4.0, product.product_name, 'wasted');
      const filtered = products.filter(p => p.id !== id);
      storage.saveProducts(filtered);
      storage.generateNotifications();
      return product;
    }
    return null;
  },

  resetSampleData: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLD, JSON.stringify(INITIAL_HOUSEHOLD));
    localStorage.setItem(STORAGE_KEYS.COMPOST, JSON.stringify(INITIAL_COMPOST));
    storage.generateNotifications();
    return storage.getProducts();
  },

  // Savings & Sustainability Metrics
  getSavingsStats: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    if (saved) return JSON.parse(saved);
    const initialStats = {
      moneySaved: 148.75,
      foodItemsSaved: 38,
      itemsWasted: 3,
      co2PreventedKg: 42.6,
      history: [
        { month: 'Apr', saved: 95, wasted: 18 },
        { month: 'May', saved: 120, wasted: 12 },
        { month: 'Jun', saved: 135, wasted: 10 },
        { month: 'Jul', saved: 142, wasted: 8 },
        { month: 'Aug', saved: 148.75, wasted: 6 }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(initialStats));
    return initialStats;
  },

  recordSavings: (amount, itemName, type) => {
    const stats = storage.getSavingsStats();
    if (type === 'consumed') {
      stats.moneySaved = +(stats.moneySaved + amount).toFixed(2);
      stats.foodItemsSaved += 1;
      stats.co2PreventedKg = +(stats.co2PreventedKg + (amount * 0.35)).toFixed(1);
    } else {
      stats.itemsWasted += 1;
    }
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(stats));
  },

  // Dashboard Summary
  getDashboardStats: () => {
    const products = storage.getProducts();
    const stats = {
      total_products: products.length,
      safe_products: 0,
      expiring_soon: 0,
      urgent_products: 0,
      expired_products: 0
    };

    products.forEach(p => {
      const s = computeStatus(p.expiry_date);
      if (s === 'SAFE') stats.safe_products++;
      else if (s === 'EXPIRING SOON') stats.expiring_soon++;
      else if (s === 'URGENT') stats.urgent_products++;
      else if (s === 'EXPIRED') stats.expired_products++;
    });

    const savings = storage.getSavingsStats();

    return {
      ...stats,
      moneySaved: savings.moneySaved,
      foodItemsSaved: savings.foodItemsSaved,
      co2PreventedKg: savings.co2PreventedKg,
      wasteScore: Math.round((savings.foodItemsSaved / (savings.foodItemsSaved + savings.itemsWasted || 1)) * 100)
    };
  },

  // Shopping List
  getShoppingList: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(INITIAL_SHOPPING_LIST));
        return INITIAL_SHOPPING_LIST;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SHOPPING_LIST;
    }
  },

  saveShoppingList: (list) => {
    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(list));
  },

  addShoppingItem: (item) => {
    const list = storage.getShoppingList();
    const newItem = {
      id: `shop-${Date.now()}`,
      name: item.name,
      category: item.category || 'General',
      quantity: Number(item.quantity) || 1,
      unit: item.unit || 'pcs',
      estimatedPrice: Number(item.estimatedPrice) || 2.99,
      checked: false,
      addedFrom: item.addedFrom || 'manual'
    };
    list.unshift(newItem);
    storage.saveShoppingList(list);
    return newItem;
  },

  toggleShoppingItem: (id) => {
    const list = storage.getShoppingList();
    const updated = list.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    storage.saveShoppingList(updated);
    return updated;
  },

  deleteShoppingItem: (id) => {
    const list = storage.getShoppingList();
    const filtered = list.filter(item => item.id !== id);
    storage.saveShoppingList(filtered);
    return filtered;
  },

  suggestAutoRestock: (name, category, unit, price) => {
    const list = storage.getShoppingList();
    const exists = list.some(item => item.name.toLowerCase() === name.toLowerCase());
    if (!exists) {
      storage.addShoppingItem({
        name,
        category: category || 'Pantry',
        quantity: 1,
        unit: unit || 'unit',
        estimatedPrice: price || 3.50,
        addedFrom: 'restock'
      });
    }
  },

  transferCheckedToInventory: () => {
    const list = storage.getShoppingList();
    const checkedItems = list.filter(i => i.checked);
    if (checkedItems.length === 0) return { transferred: 0, items: [] };

    const shelfLifeDays = {
      'Produce': 5,
      'Dairy & Eggs': 10,
      'Meat & Poultry': 3,
      'Bakery': 4,
      'Pantry': 120,
      'Frozen': 90,
      'Beverages': 14,
      'Snacks': 60
    };

    const addedProducts = [];
    checkedItems.forEach(item => {
      const days = shelfLifeDays[item.category] || 7;
      const newProduct = storage.addProduct({
        product_name: item.name,
        category: item.category,
        expiry_date: getFutureDate(days),
        quantity: item.quantity,
        unit: item.unit,
        estimated_price: item.estimatedPrice,
        location: item.category === 'Produce' ? 'Fridge Crisper Drawer' :
                  item.category === 'Meat & Poultry' ? 'Fridge Bottom Shelf' :
                  item.category === 'Dairy & Eggs' ? 'Fridge Middle Shelf' :
                  item.category === 'Bakery' ? 'Bread Box' : 'Pantry Shelf 1'
      });
      addedProducts.push(newProduct);
    });

    const remaining = list.filter(i => !i.checked);
    storage.saveShoppingList(remaining);

    return { transferred: addedProducts.length, items: addedProducts };
  },

  // Eco-Challenges & Gamification
  getChallenges: () => {
    const c = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (c) return JSON.parse(c);
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    return INITIAL_CHALLENGES;
  },

  addQuestXP: (xpAmount) => {
    const c = storage.getChallenges();
    c.xp += xpAmount;
    c.level = Math.floor(c.xp / 400) + 1;
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(c));
    return c;
  },

  completeQuest: (questId) => {
    const c = storage.getChallenges();
    const q = c.quests.find(x => x.id === questId);
    if (q && !q.completed) {
      q.completed = true;
      q.progress = q.target;
      c.xp += q.xpReward;
      c.level = Math.floor(c.xp / 400) + 1;
      localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(c));
      return { success: true, xpEarned: q.xpReward, challenges: c };
    }
    return { success: false, challenges: c };
  },

  // Household Management
  getHousehold: () => {
    const h = localStorage.getItem(STORAGE_KEYS.HOUSEHOLD);
    if (h) return JSON.parse(h);
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLD, JSON.stringify(INITIAL_HOUSEHOLD));
    return INITIAL_HOUSEHOLD;
  },

  addHouseholdChore: (choreText, memberName, dueDay) => {
    const h = storage.getHousehold();
    h.chores.unshift({
      id: `ch-${Date.now()}`,
      chore: choreText,
      assignedTo: memberName,
      due: dueDay,
      status: 'Pending'
    });
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLD, JSON.stringify(h));
    return h;
  },

  toggleChoreStatus: (choreId) => {
    const h = storage.getHousehold();
    h.chores = h.chores.map(c => c.id === choreId ? { ...c, status: c.status === 'Completed' ? 'Pending' : 'Completed' } : c);
    localStorage.setItem(STORAGE_KEYS.HOUSEHOLD, JSON.stringify(h));
    return h;
  },

  // Compost Lab
  getCompostData: () => {
    const c = localStorage.getItem(STORAGE_KEYS.COMPOST);
    if (c) return JSON.parse(c);
    localStorage.setItem(STORAGE_KEYS.COMPOST, JSON.stringify(INITIAL_COMPOST));
    return INITIAL_COMPOST;
  },

  addCompostScrap: (type, weightKg) => {
    const c = storage.getCompostData();
    if (type === 'greens') c.greensKg = +(c.greensKg + weightKg).toFixed(1);
    else c.brownsKg = +(c.brownsKg + weightKg).toFixed(1);
    localStorage.setItem(STORAGE_KEYS.COMPOST, JSON.stringify(c));
    return c;
  },

  // Donations
  getDonations: () => {
    const d = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    if (d) return JSON.parse(d);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    return INITIAL_DONATIONS;
  },

  addDonation: (donation) => {
    const list = storage.getDonations();
    const newDonation = {
      id: `don-${Date.now()}`,
      ...donation,
      status: 'Available',
      created_at: new Date().toISOString()
    };
    list.unshift(newDonation);
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(list));
    return newDonation;
  },

  // Settings
  getSettings: () => {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (s) return JSON.parse(s);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Notifications
  getNotifications: () => {
    const n = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (n) return JSON.parse(n);
    return storage.generateNotifications();
  },

  generateNotifications: () => {
    const products = storage.getProducts();
    const notifications = [];
    
    products.forEach(p => {
      const days = getDaysRemaining(p.expiry_date);
      if (days < 0) {
        notifications.push({
          id: `notif-exp-${p.id}`,
          title: `Expired: ${p.product_name}`,
          message: `${p.product_name} expired ${Math.abs(days)} day(s) ago. Check freshness before cooking.`,
          type: 'expired',
          product_id: p.id,
          created_at: new Date().toISOString(),
          read: false
        });
      } else if (days === 0) {
        notifications.push({
          id: `notif-urg-${p.id}`,
          title: `Expires Today: ${p.product_name}`,
          message: `Use ${p.product_name} today to prevent waste! Tap for quick recipe ideas.`,
          type: 'urgent',
          product_id: p.id,
          created_at: new Date().toISOString(),
          read: false
        });
      } else if (days === 1) {
        notifications.push({
          id: `notif-urg-${p.id}`,
          title: `Expires Tomorrow: ${p.product_name}`,
          message: `${p.product_name} expires tomorrow. Plan a meal or freeze it!`,
          type: 'urgent',
          product_id: p.id,
          created_at: new Date().toISOString(),
          read: false
        });
      } else if (days <= 3) {
        notifications.push({
          id: `notif-soon-${p.id}`,
          title: `Expiring Soon: ${p.product_name}`,
          message: `${p.product_name} expires in ${days} days.`,
          type: 'warning',
          product_id: p.id,
          created_at: new Date().toISOString(),
          read: false
        });
      }
    });

    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return notifications;
  },

  markNotificationRead: (id) => {
    const notifs = storage.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markAllNotificationsRead: () => {
    const notifs = storage.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  // Meal Planner
  getMealPlan: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEAL_PLAN);
    if (saved) return JSON.parse(saved);
    const initialPlan = {
      Monday: { breakfast: 'Strawberry & Greek Yogurt Parfait', lunch: 'Chicken & Spinach Toasted Sandwich', dinner: 'Creamy Garlic Penne with Spinach' },
      Tuesday: { breakfast: 'French Toast with Fresh Strawberries', lunch: 'Grilled Cheddar & Sourdough Melt', dinner: 'Herb-Roasted Chicken Breast & Greens' },
      Wednesday: { breakfast: 'Scrambled Eggs on Buttered Sourdough', lunch: 'Leftover Penne Pasta Bowl', dinner: 'Spinach & Cheddar Omelette with Salad' },
      Thursday: { breakfast: 'Berry Yogurt Smoothie Bowl', lunch: 'Chicken Caesar Style Wrap', dinner: 'Baked Penne with Melted Cheddar' },
      Friday: { breakfast: 'Classic 2-Egg Breakfast with Toast', lunch: 'Crispy Sourdough Bruschetta', dinner: 'AI Chef Zero-Waste Stir Fry' },
      Saturday: { breakfast: 'Fluffy Strawberry Pancakes', lunch: 'Artisan Grilled Cheese & Soup', dinner: 'Family Zero-Waste Feast' },
      Sunday: { breakfast: 'Sunday Egg Scramble Special', lunch: 'Pantry Pasta Primavera', dinner: 'Weekly Fridge Reset Soup' }
    };
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(initialPlan));
    return initialPlan;
  },

  saveMealPlan: (plan) => {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(plan));
  }
};
