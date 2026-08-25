// Centralized Expiry Status & Waste Risk Engine
// Ensures 100% consistent status calculation across Dashboard, Products, Calendar, Notifications, AI, and Analytics

export const STATUS_TYPES = {
  SAFE: 'SAFE',
  EXPIRING_SOON: 'EXPIRING SOON',
  CRITICAL: 'CRITICAL',
  EXPIRED: 'EXPIRED',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Calculates remaining days from today until target date.
 * Returns integer (negative if expired, 0 if expires today).
 */
export function calculateDaysRemaining(dateString) {
  if (!dateString) return null;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(dateString);
    if (isNaN(target.getTime())) return null;
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  } catch (e) {
    return null;
  }
}

/**
 * Standard Status Rules:
 * - SAFE: > 30 days remaining
 * - EXPIRING SOON: 7 to 30 days remaining
 * - CRITICAL: 1 to 6 days remaining (or expires today: 0)
 * - EXPIRED: < 0 days (past due)
 * - UNKNOWN: missing/invalid date
 */
export function getExpiryStatus(expiryDate) {
  const days = calculateDaysRemaining(expiryDate);
  if (days === null) return STATUS_TYPES.UNKNOWN;
  if (days < 0) return STATUS_TYPES.EXPIRED;
  if (days <= 6) return STATUS_TYPES.CRITICAL;
  if (days <= 30) return STATUS_TYPES.EXPIRING_SOON;
  return STATUS_TYPES.SAFE;
}

/**
 * Visual styling & bilingual labels for status badges
 */
export function getStatusBadgeInfo(status, language = 'en') {
  const isTa = language === 'ta';
  switch (status) {
    case STATUS_TYPES.SAFE:
      return {
        label: isTa ? 'பாதுகாப்பானது' : 'Safe',
        bg: 'bg-emerald-50 dark:bg-emerald-950/60',
        text: 'text-emerald-700 dark:text-emerald-300',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
        icon: '🛡️'
      };
    case STATUS_TYPES.EXPIRING_SOON:
      return {
        label: isTa ? 'விரைவில் காலாவதி' : 'Expiring Soon',
        bg: 'bg-amber-50 dark:bg-amber-950/60',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
        icon: '⏳'
      };
    case STATUS_TYPES.CRITICAL:
      return {
        label: isTa ? 'அவசரம் (1-6 நாட்கள்)' : 'Critical (1-6d)',
        bg: 'bg-orange-50 dark:bg-orange-950/60',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-200 dark:border-orange-800',
        dot: 'bg-orange-500',
        icon: '🚨'
      };
    case STATUS_TYPES.EXPIRED:
      return {
        label: isTa ? 'காலாவதியானது' : 'Expired',
        bg: 'bg-rose-50 dark:bg-rose-950/60',
        text: 'text-rose-700 dark:text-rose-300',
        border: 'border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
        icon: '⛔'
      };
    default:
      return {
        label: isTa ? 'தெரியவில்லை' : 'Unknown',
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-400',
        icon: '❓'
      };
  }
}

/**
 * Waste Risk Score (0-100)
 * Evaluates days remaining, product category perishability, quantity, and price.
 */
export function calculateWasteRiskScore(product) {
  if (!product) return 0;
  const days = calculateDaysRemaining(product.expiry_date);
  if (days === null) return 50;
  if (days < 0) return 100; // Already expired

  let score = 0;

  // 1. Time urgency (max 50 pts)
  if (days === 0) score += 50;
  else if (days <= 2) score += 45;
  else if (days <= 5) score += 35;
  else if (days <= 10) score += 25;
  else if (days <= 20) score += 15;
  else if (days <= 30) score += 8;
  else score += 2;

  // 2. Category perishability weight (max 25 pts)
  const cat = (product.category || '').toLowerCase();
  if (cat.includes('dairy') || cat.includes('milk') || cat.includes('yogurt')) score += 25;
  else if (cat.includes('meat') || cat.includes('poultry') || cat.includes('fish') || cat.includes('seafood')) score += 25;
  else if (cat.includes('produce') || cat.includes('fruit') || cat.includes('vegetable') || cat.includes('bakery')) score += 20;
  else if (cat.includes('prepared') || cat.includes('meal') || cat.includes('leftover')) score += 22;
  else if (cat.includes('frozen')) score += 8;
  else if (cat.includes('pantry') || cat.includes('grain') || cat.includes('canned')) score += 4;
  else score += 10;

  // 3. Quantity weight (max 15 pts)
  const qty = Number(product.quantity) || 1;
  if (qty > 3) score += 15;
  else if (qty > 1) score += 8;
  else score += 4;

  // 4. Financial impact (max 10 pts)
  const price = Number(product.estimated_price || product.price) || 3;
  if (price >= 10) score += 10;
  else if (price >= 5) score += 6;
  else score += 3;

  return Math.min(100, Math.max(0, score));
}

/**
 * Returns actionable zero-waste recommendation for a product
 */
export function getWasteRecommendation(product, language = 'en') {
  const days = calculateDaysRemaining(product?.expiry_date);
  const isTa = language === 'ta';
  const risk = calculateWasteRiskScore(product);

  if (days === null) {
    return isTa ? 'காலாவதி தேதியை சரிபார்க்கவும்.' : 'Check and record valid expiry date.';
  }
  if (days < 0) {
    return isTa 
      ? 'காலாவதியானது! உரமாக்க அல்லது அகற்றி குப்பையாக பதிவு செய்யவும்.'
      : 'Past expiry. Discard safely or add to Compost Lab.';
  }
  if (days <= 2) {
    return isTa
      ? '🚨 உடனடியாக இன்றே சமைக்கவும் அல்லது உறைவிப்பான் (Freezer) பெட்டியில் பாதுகாக்கவும்.'
      : '🚨 Consume today or freeze immediately to preserve.';
  }
  if (days <= 6) {
    return isTa
      ? '⏳ இந்த வார உணவுத் திட்டத்தில் (Meal Plan) சேர்த்து முன்கூட்டியே சமைக்கவும்.'
      : '⏳ Prioritize in this week’s meal plan before newer items.';
  }
  if (risk > 60) {
    return isTa
      ? '💡 அதிக அளவு உள்ளதால் அடுத்த முறை குறைவாக வாங்கவும்.'
      : '💡 Large quantity nearing expiry. Consider sharing or batch cooking.';
  }
  return isTa ? '✨ உகந்த நிலையில் உள்ளது. முறையாக சேமிக்கவும்.' : '✨ Good condition. Maintain ideal storage temperature.';
}
