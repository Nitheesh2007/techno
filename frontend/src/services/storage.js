// Comprehensive SaaS Storage Engine for Food Expiry Guardian AI
import { 
  calculateDaysRemaining, 
  getExpiryStatus, 
  calculateWasteRiskScore, 
  STATUS_TYPES 
} from '../utils/statusEngine';

const STORAGE_KEYS = {
  PRODUCTS: 'feg_products',
  ARCHIVED_PRODUCTS: 'feg_archived_products',
  USER: 'feg_user',
  TOKEN: 'token',
  NOTIFICATIONS: 'feg_notifications',
  WASTE_RECORDS: 'feg_waste_records',
  ACTIVITY_LOGS: 'feg_activity_logs',
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

const DEFAULT_SETTINGS = {
  currency: '$',
  currencyCode: 'USD',
  language: 'en',
  theme: 'system',
  soundEffects: true,
  leadTimeDays: 3,
  notificationsEmail: true,
  notificationsBrowser: true,
  notifyIntervals: [30, 14, 7, 3, 1, 0],
  ecoGoalMonthlyKg: 50
};

export const storage = {
  // --- Products CRUD & Lifecycle ---
  getProducts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
        return [];
      }
      const parsed = JSON.parse(data);
      return parsed.map(p => {
        const days = calculateDaysRemaining(p.expiry_date);
        const status = getExpiryStatus(p.expiry_date);
        const waste_risk = calculateWasteRiskScore(p);
        return {
          ...p,
          days_left: days !== null ? days : 999,
          status,
          waste_risk
        };
      });
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
      brand: product.brand || '',
      batch_number: product.batch_number || '',
      mfg_date: product.mfg_date || '',
      purchase_date: product.purchase_date || new Date().toISOString().split('T')[0],
      quantity: Math.max(1, Number(product.quantity) || 1),
      unit: product.unit || 'pcs',
      estimated_price: Math.max(0, Number(product.estimated_price || product.price) || 3.50),
      location: product.location || 'Fridge Crisper Drawer',
      barcode: product.barcode || '',
      notes: product.notes || '',
      ocr_confidence: product.ocr_confidence || 1.0,
      ownership: product.ownership || 'Shared',
      created_at: product.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    storage.saveProducts(products);
    storage.addActivityLog('ADDED', { name: newProduct.product_name, category: newProduct.category });
    storage.generateNotifications();
    return {
      ...newProduct,
      days_left: calculateDaysRemaining(newProduct.expiry_date),
      status: getExpiryStatus(newProduct.expiry_date),
      waste_risk: calculateWasteRiskScore(newProduct)
    };
  },

  updateProduct: (id, updatedFields) => {
    const products = storage.getProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        ...updatedFields,
        updated_at: new Date().toISOString()
      };
      storage.saveProducts(products);
      storage.addActivityLog('UPDATED', { name: products[idx].product_name });
      storage.generateNotifications();
      return {
        ...products[idx],
        days_left: calculateDaysRemaining(products[idx].expiry_date),
        status: getExpiryStatus(products[idx].expiry_date),
        waste_risk: calculateWasteRiskScore(products[idx])
      };
    }
    return null;
  },

  deleteProduct: (id) => {
    const products = storage.getProducts();
    const target = products.find(p => p.id === id);
    const filtered = products.filter(p => p.id !== id);
    storage.saveProducts(filtered);
    if (target) {
      storage.addActivityLog('DELETED', { name: target.product_name });
    }
    storage.generateNotifications();
    return true;
  },

  duplicateProduct: (id) => {
    const products = storage.getProducts();
    const target = products.find(p => p.id === id);
    if (!target) return null;
    const duplicated = {
      ...target,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      product_name: `${target.product_name} (Copy)`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    products.unshift(duplicated);
    storage.saveProducts(products);
    storage.addActivityLog('DUPLICATED', { name: target.product_name });
    storage.generateNotifications();
    return duplicated;
  },

  archiveProduct: (id) => {
    const products = storage.getProducts();
    const target = products.find(p => p.id === id);
    if (!target) return false;
    const filtered = products.filter(p => p.id !== id);
    storage.saveProducts(filtered);

    const archived = storage.getArchivedProducts();
    archived.unshift({ ...target, archived_at: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.ARCHIVED_PRODUCTS, JSON.stringify(archived));
    storage.addActivityLog('ARCHIVED', { name: target.product_name });
    storage.generateNotifications();
    return true;
  },

  restoreProduct: (id) => {
    const archived = storage.getArchivedProducts();
    const target = archived.find(p => p.id === id);
    if (!target) return false;
    const filtered = archived.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.ARCHIVED_PRODUCTS, JSON.stringify(filtered));

    const products = storage.getProducts();
    products.unshift({ ...target, updated_at: new Date().toISOString() });
    storage.saveProducts(products);
    storage.addActivityLog('RESTORED', { name: target.product_name });
    storage.generateNotifications();
    return true;
  },

  getArchivedProducts: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ARCHIVED_PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // --- Waste Tracking (Consumed vs Discarded vs Donated) ---
  markAsConsumed: (id, rating = 5, notes = '') => {
    const products = storage.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return null;

    const value = (Number(product.estimated_price) || 3.50) * (Number(product.quantity) || 1);
    
    // Save to waste records
    storage.addWasteRecord({
      product_id: product.id,
      product_name: product.product_name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      action: 'CONSUMED',
      value_saved: value,
      value_lost: 0,
      rating,
      notes,
      timestamp: new Date().toISOString()
    });

    storage.recordSavings(value, product.product_name, 'consumed');
    storage.suggestAutoRestock(product.product_name, product.category, product.unit, product.estimated_price);
    storage.addActivityLog('CONSUMED', { name: product.product_name, value });
    storage.addQuestXP(50);

    const filtered = products.filter(p => p.id !== id);
    storage.saveProducts(filtered);
    storage.generateNotifications();
    return product;
  },

  markAsDiscarded: (id, reason = 'Past Expiry Date', discardedQty = null, notes = '') => {
    const products = storage.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return null;

    const qty = discardedQty !== null ? Number(discardedQty) : Number(product.quantity) || 1;
    const unitPrice = Number(product.estimated_price) || 3.50;
    const lossValue = +(unitPrice * qty).toFixed(2);

    storage.addWasteRecord({
      product_id: product.id,
      product_name: product.product_name,
      category: product.category,
      quantity: qty,
      unit: product.unit,
      action: 'DISCARDED',
      reason,
      value_saved: 0,
      value_lost: lossValue,
      notes,
      timestamp: new Date().toISOString()
    });

    storage.recordSavings(lossValue, product.product_name, 'wasted');
    storage.addActivityLog('DISCARDED', { name: product.product_name, loss: lossValue, reason });

    const filtered = products.filter(p => p.id !== id);
    storage.saveProducts(filtered);
    storage.generateNotifications();
    return product;
  },

  markAsDonated: (id, recipient = 'Community Fridge') => {
    const products = storage.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) return null;

    const value = (Number(product.estimated_price) || 3.50) * (Number(product.quantity) || 1);

    storage.addWasteRecord({
      product_id: product.id,
      product_name: product.product_name,
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      action: 'DONATED',
      recipient,
      value_saved: value,
      value_lost: 0,
      timestamp: new Date().toISOString()
    });

    storage.addActivityLog('DONATED', { name: product.product_name, recipient });
    storage.addQuestXP(75);

    const filtered = products.filter(p => p.id !== id);
    storage.saveProducts(filtered);
    storage.generateNotifications();
    return product;
  },

  getWasteRecords: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WASTE_RECORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addWasteRecord: (record) => {
    const records = storage.getWasteRecords();
    records.unshift({
      id: `wrec-${Date.now()}`,
      ...record
    });
    localStorage.setItem(STORAGE_KEYS.WASTE_RECORDS, JSON.stringify(records));
  },

  // --- Real Activity Logs ---
  getActivityLogs: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addActivityLog: (type, details = {}) => {
    const logs = storage.getActivityLogs();
    logs.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      details,
      timestamp: new Date().toISOString()
    });
    // Keep last 50 activity items
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 50)));
  },

  // --- KPI & Real Analytics Calculations ---
  getDashboardStats: () => {
    const products = storage.getProducts();
    const wasteRecords = storage.getWasteRecords();
    
    let safeCount = 0;
    let expiringSoonCount = 0;
    let criticalCount = 0;
    let expiredCount = 0;
    let totalQuantity = 0;
    let potentialWasteLoss = 0;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    let addedThisMonth = 0;

    products.forEach(p => {
      totalQuantity += Number(p.quantity) || 1;
      const status = p.status;
      if (status === STATUS_TYPES.SAFE) safeCount++;
      else if (status === STATUS_TYPES.EXPIRING_SOON) expiringSoonCount++;
      else if (status === STATUS_TYPES.CRITICAL) criticalCount++;
      else if (status === STATUS_TYPES.EXPIRED) {
        expiredCount++;
        potentialWasteLoss += (Number(p.estimated_price) || 3.50) * (Number(p.quantity) || 1);
      }

      if (p.created_at) {
        const cDate = new Date(p.created_at);
        if (cDate.getMonth() === currentMonth && cDate.getFullYear() === currentYear) {
          addedThisMonth++;
        }
      }
    });

    // Calculate real waste loss & saved from waste records
    let actualFinancialWaste = 0;
    let actualValueSaved = 0;
    let consumedCount = 0;
    let discardedCount = 0;

    wasteRecords.forEach(w => {
      if (w.action === 'DISCARDED') {
        actualFinancialWaste += Number(w.value_lost) || 0;
        discardedCount += Number(w.quantity) || 1;
      } else if (w.action === 'CONSUMED' || w.action === 'DONATED') {
        actualValueSaved += Number(w.value_saved) || 0;
        consumedCount += Number(w.quantity) || 1;
      }
    });

    const totalHandled = consumedCount + discardedCount;
    const wasteScore = totalHandled === 0 ? 100 : Math.round((consumedCount / totalHandled) * 100);

    return {
      total_products: products.length,
      safe_products: safeCount,
      expiring_soon: expiringSoonCount,
      critical_products: criticalCount,
      expired_products: expiredCount,
      total_quantity: totalQuantity,
      potential_waste_loss: +potentialWasteLoss.toFixed(2),
      actual_financial_waste: +actualFinancialWaste.toFixed(2),
      moneySaved: +actualValueSaved.toFixed(2),
      foodItemsSaved: consumedCount,
      itemsWasted: discardedCount,
      addedThisMonth,
      wasteScore,
      co2PreventedKg: +(actualValueSaved * 0.35).toFixed(1)
    };
  },

  // --- Real Multi-Interval Notification Engine ---
  getNotifications: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (!data) return storage.generateNotifications();
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  generateNotifications: () => {
    const products = storage.getProducts();
    const currentNotifs = storage.getNotifications();
    const existingIds = new Set(currentNotifs.map(n => n.id));
    const newNotifs = [...currentNotifs];

    products.forEach(p => {
      const days = calculateDaysRemaining(p.expiry_date);
      if (days === null) return;

      let notifType = null;
      let title = '';
      let message = '';
      let notifId = '';

      if (days < 0) {
        notifId = `notif-exp-${p.id}`;
        notifType = 'EXPIRED';
        title = `Expired: ${p.product_name}`;
        message = `${p.product_name} expired ${Math.abs(days)} day(s) ago. Check freshness or discard.`;
      } else if (days === 0) {
        notifId = `notif-0d-${p.id}`;
        notifType = 'CRITICAL';
        title = `Expires Today: ${p.product_name}`;
        message = `Use ${p.product_name} today to prevent waste!`;
      } else if (days === 1) {
        notifId = `notif-1d-${p.id}`;
        notifType = 'CRITICAL';
        title = `Expires Tomorrow: ${p.product_name}`;
        message = `${p.product_name} expires tomorrow. Plan a meal or freeze it!`;
      } else if (days === 3) {
        notifId = `notif-3d-${p.id}`;
        notifType = 'WARNING';
        title = `3 Days Left: ${p.product_name}`;
        message = `${p.product_name} will expire in 3 days.`;
      } else if (days === 7) {
        notifId = `notif-7d-${p.id}`;
        notifType = 'WARNING';
        title = `7 Days Left: ${p.product_name}`;
        message = `${p.product_name} will expire in 1 week.`;
      } else if (days === 14) {
        notifId = `notif-14d-${p.id}`;
        notifType = 'INFO';
        title = `14 Days Notice: ${p.product_name}`;
        message = `${p.product_name} will expire in 2 weeks.`;
      } else if (days === 30) {
        notifId = `notif-30d-${p.id}`;
        notifType = 'INFO';
        title = `30 Days Notice: ${p.product_name}`;
        message = `${p.product_name} will expire in 1 month.`;
      }

      if (notifType && !existingIds.has(notifId)) {
        newNotifs.unshift({
          id: notifId,
          product_id: p.id,
          product_name: p.product_name,
          title,
          message,
          type: notifType,
          days_left: days,
          read: false,
          created_at: new Date().toISOString()
        });
        existingIds.add(notifId);
      }
    });

    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newNotifs));
    return newNotifs;
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

  deleteNotification: (id) => {
    const notifs = storage.getNotifications();
    const filtered = notifs.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
    return filtered;
  },

  clearAllNotifications: () => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    return [];
  },

  // --- Shopping List, Restock, Eco Quests, Settings ---
  getShoppingList: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST);
      return data ? JSON.parse(data) : [];
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

  getSavingsStats: () => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    if (saved) return JSON.parse(saved);
    const initialStats = {
      moneySaved: 0.0,
      foodItemsSaved: 0,
      itemsWasted: 0,
      co2PreventedKg: 0.0
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

  getSettings: () => {
    const s = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (s) return JSON.parse(s);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  saveSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getChallenges: () => {
    const c = localStorage.getItem(STORAGE_KEYS.CHALLENGES);
    if (c) return JSON.parse(c);
    const initC = {
      xp: 450,
      level: 2,
      levelTitle: 'Eco Guardian Novice',
      quests: [
        { id: 'q-1', title: 'Zero-Waste First Scan', desc: 'Scan your first food item using the OCR scanner.', xpReward: 200, progress: 0, target: 1, completed: false, badge: '📷' },
        { id: 'q-2', title: 'Fresh Fridge Setup', desc: 'Add 3 fresh grocery items to your inventory.', xpReward: 150, progress: 0, target: 3, completed: false, badge: '🥗' },
        { id: 'q-3', title: 'Guided Chef Cooking', desc: 'Cook a recipe with your ingredients.', xpReward: 250, progress: 0, target: 1, completed: false, badge: '👨‍🍳' }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(initC));
    return initC;
  },

  addQuestXP: (xpAmount) => {
    const c = storage.getChallenges();
    c.xp += xpAmount;
    c.level = Math.floor(c.xp / 400) + 1;
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(c));
    return c;
  },

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
