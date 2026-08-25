import axios from 'axios';
import { storage } from './storage';
import { aiEngine } from './aiEngine';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 3000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Hybrid API wrapper
export const api = {
  // Direct Axios Passthrough if needed
  get: async (url, config) => {
    try {
      return await axiosInstance.get(url, config);
    } catch (err) {
      return api.fallbackGet(url);
    }
  },

  post: async (url, data, config) => {
    try {
      return await axiosInstance.post(url, data, config);
    } catch (err) {
      return api.fallbackPost(url, data);
    }
  },

  put: async (url, data, config) => {
    try {
      return await axiosInstance.put(url, data, config);
    } catch (err) {
      return api.fallbackPut(url, data);
    }
  },

  delete: async (url, config) => {
    try {
      return await axiosInstance.delete(url, config);
    } catch (err) {
      return api.fallbackDelete(url);
    }
  },

  // Fallback GET Handler
  fallbackGet: async (url) => {
    if (url === '/dashboard/stats') {
      return { data: storage.getDashboardStats() };
    }
    if (url === '/products' || url.startsWith('/products')) {
      return { data: storage.getProducts() };
    }
    if (url === '/notifications' || url.startsWith('/notifications')) {
      return { data: storage.getNotifications() };
    }
    if (url === '/meal-plan') {
      return { data: storage.getMealPlan() };
    }
    if (url === '/auth/me') {
      const user = localStorage.getItem('feg_user');
      return { data: user ? JSON.parse(user) : { id: 'usr-1', name: 'Demo Guardian', email: 'demo@foodguardian.ai' } };
    }
    return { data: {} };
  },

  // Fallback POST Handler
  fallbackPost: async (url, data) => {
    if (url === '/auth/login') {
      const email = data instanceof URLSearchParams ? data.get('username') : data.email || 'demo@foodguardian.ai';
      const user = { id: 'usr-1', name: email.split('@')[0] || 'Demo Guardian', email: email };
      localStorage.setItem('feg_user', JSON.stringify(user));
      return { data: { access_token: 'mock-jwt-token-food-guardian', token_type: 'bearer', user } };
    }
    if (url === '/auth/register') {
      const user = { id: `usr-${Date.now()}`, name: data.name || 'Food Guardian', email: data.email };
      localStorage.setItem('feg_user', JSON.stringify(user));
      return { data: { access_token: 'mock-jwt-token-food-guardian', token_type: 'bearer', user } };
    }
    if (url === '/products') {
      const created = storage.addProduct(data);
      return { data: created };
    }
    if (url === '/ai/chat') {
      const res = await aiEngine.chat(data.message || '');
      return { data: res };
    }
    if (url === '/ai/recipe') {
      const res = await aiEngine.generateRecipe(data);
      return { data: { recipe: res.rawText, structured: res.recipes, featured: res.featured } };
    }
    if (url === '/scanner/ocr') {
      const res = await aiEngine.scanImage(data?.preset || 'general');
      return { data: res };
    }
    if (url === '/notifications/read-all') {
      return { data: storage.markAllNotificationsRead() };
    }
    return { data: { status: 'ok' } };
  },

  fallbackPut: async (url, data) => {
    if (url.startsWith('/products/')) {
      const id = url.split('/').pop();
      const updated = storage.updateProduct(id, data);
      return { data: updated };
    }
    if (url === '/meal-plan') {
      storage.saveMealPlan(data);
      return { data };
    }
    return { data: { status: 'ok' } };
  },

  fallbackDelete: async (url) => {
    if (url.startsWith('/products/')) {
      const id = url.split('/').pop();
      storage.deleteProduct(id);
      return { data: { status: 'deleted', id } };
    }
    return { data: { status: 'ok' } };
  },

  // High-Level Domain Methods
  consumeProduct: (id) => storage.consumeProduct(id),
  markWasted: (id) => storage.markWasted(id),
  resetData: () => storage.resetSampleData(),
  lookupBarcode: (code) => aiEngine.lookupBarcode(code)
};

export default api;
