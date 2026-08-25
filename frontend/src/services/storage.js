// Intelligent Local Engine for Food Expiry Guardian AI - 100% Fresh Clean State

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

// Clean Fresh State: 0 initial items in inventory
const INITIAL_PRODUCTS = [];

// Sample items available on-demand only if user clicks "Load Samples"
const SAMPLE_PRODUCTS_PRESET = [
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
    expiry_date: getFutureDate(0),
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
  }
];

const INITIAL_SHOPPING_LIST = [];
const INITIAL_DONATIONS = [];

const INITIAL_CHALLENGES = {
  xp: 450,
  level: 2,
  levelTitle: 'Eco Guardian Novice',
  currentStreakDays: 1,
  bestStreakDays: 7,
  quests: [
    { id: 'q-1', title: 'Zero-Waste First Scan', desc: 'Scan your first food item using the OCR scanner.', xpReward: 200, progress: 0, target: 1, completed: false, badge: '📷' },
    { id: 'q-2', title: 'Fresh Fridge Setup', desc: 'Add 3 fresh grocery items to your inventory.', xpReward: 150, progress: 0, target: 3, completed: false, badge: '🥗' },
    { id: 'q-3', title: 'Guided Chef Cooking', desc: 'Cook a recipe with your ingredients.', xpReward: 250, progress: 0, target: 1, completed: false, badge: '👨‍🍳' }
  ],
  trophies: [
    { id: 't-1', title: 'First Food Saved', desc: 'Logged your first zero-waste meal.', unlocked: false, icon: '🌱' },
    { id: 't-2', title: 'Centurion Saver', desc: 'Saved over $100 in prevented food waste.', unlocked: false, icon: '💰' },
    { id: 't-3', title: 'Community Hero', desc: 'Donated an item to a community food fridge.', unlocked: false, icon: '❤️' },
    { id: 't-4', title: 'Master Chef Zero', desc: 'Cooked 10 AI zero-waste recipes.', unlocked: false, icon: '👨‍🍳' }
  ]
};

const INITIAL_HOUSEHOLD = {
  name: 'Maplewood Suite 4B',
  members: [
    { id: 'mem-1', name: 'Alex Rivera', role: 'Kitchen Admin', avatar: '🥑', color: 'bg-emerald-500' },
    { id: 'mem-2', name: 'Maya Lin', role: 'Roommate', avatar: '🍓', color: 'bg-rose-500' }
  ],
  chores: [],
  feed: []
};

const INITIAL_COMPOST = {
  greensKg: 0.0,
  brownsKg: 0.0,
  lastTurned: 'Today',
  moistureLevel: 'Fresh & Clean (Ready for Scraps)',
  totalCompostHarvestedKg: 0.0,
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
  language: 'en',
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
  // Products CRUD - Clean Fresh Default
  getProducts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
        return [];
      }
      const parsed = JSON.parse(data);
      return parsed.map(p => ({
        ...p,
        status: computeStatus(p.expiry_date),
        days_left: getDaysRemaining(p.expiry_date)
      }));
    } catch {
      return [];
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

  clearAllProducts: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    return [];
  },

  loadSamplePresetData: () => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS_PRESET));
    storage.generateNotifications();
    return storage.getProducts();
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
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    return [];
  },

  // Savings & Sustainability Metrics
  getSavingsStats: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    if (saved) return JSON.parse(saved);
    const initialStats = {
      moneySaved: 0.0,
      foodItemsSaved: 0,
      itemsWasted: 0,
      co2PreventedKg: 0.0,
      history: [
        { month: 'Apr', saved: 0, wasted: 0 },
        { month: 'May', saved: 0, wasted: 0 },
        { month: 'Jun', saved: 0, wasted: 0 },
        { month: 'Jul', saved: 0, wasted: 0 },
        { month: 'Aug', saved: 0, wasted: 0 }
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
      wasteScore: (savings.foodItemsSaved + savings.itemsWasted) === 0 ? 100 : Math.round((savings.foodItemsSaved / (savings.foodItemsSaved + savings.itemsWasted)) * 100)
    };
  },

  // Shopping List
  getShoppingList: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify([]));
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
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

  // Eco-Challenges
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

  // Household
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
      Monday: { breakfast: '', lunch: '', dinner: '' },
      Tuesday: { breakfast: '', lunch: '', dinner: '' },
      Wednesday: { breakfast: '', lunch: '', dinner: '' },
      Thursday: { breakfast: '', lunch: '', dinner: '' },
      Friday: { breakfast: '', lunch: '', dinner: '' },
      Saturday: { breakfast: '', lunch: '', dinner: '' },
      Sunday: { breakfast: '', lunch: '', dinner: '' }
    };
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(initialPlan));
    return initialPlan;
  },

  saveMealPlan: (plan) => {
    localStorage.setItem(STORAGE_KEYS.MEAL_PLAN, JSON.stringify(plan));
  }
};
