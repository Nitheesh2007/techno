// Comprehensive Multilingual Translation Engine (100% Pure English & 100% Pure தமிழ் Tamil)

export const translations = {
  en: {
    // Brand
    brandName: 'Food Guardian',
    brandTagline: 'Track Smart • Waste Less',
    
    // Navigation
    navDashboard: 'Dashboard',
    navProducts: 'Food Inventory',
    navAddProduct: 'Add Product',
    navScan: 'Smart Scanner',
    navRecipes: 'AI Recipe Chef',
    navMealPlan: 'Meal Planner',
    navShoppingList: 'Shopping List',
    navFridgeMap: 'Fridge 2D Map',
    navNutrition: 'Nutritional Horizon',
    navAudit: '3-Min Kitchen Audit',
    navPreservation: 'Preservation Guide',
    navCompost: 'Scrap & Compost Lab',
    navDeals: 'Grocery Deals Radar',
    navChallenges: 'Eco Quests & XP',
    navHousehold: 'Household Kitchen',
    navCommunity: 'Community Sharing',
    navAnalytics: 'Waste Analytics',
    navAlerts: 'Alerts',
    navSettings: 'Settings',

    // TopBar
    greeting: 'Good day',
    assistantActive: 'Zero-Waste AI Assistant is Active',
    quickScan: 'Quick Scan',
    addItem: 'Add Item',
    searchPlaceholder: 'Search anything or press',
    alertsTitle: 'Alerts & Expiries',
    markAllRead: 'Mark all read',
    noAlerts: 'No alerts right now! Kitchen is fresh ✨',
    viewAllAlerts: 'View All Notification History →',
    signOut: 'Sign Out',

    // Statuses
    statusSafe: 'Safe',
    statusSoon: 'Expiring Soon',
    statusUrgent: 'Urgent',
    statusExpired: 'Expired',
    expiresToday: 'Expires TODAY',
    expiresTomorrow: 'Expires Tomorrow',
    daysLeft: '{days}d left',

    // Dashboard
    dashboardTitle: 'Kitchen Dashboard',
    dashboardSub: "Welcome back, {name}. Here is your real-time freshness summary.",
    totalProducts: 'Total Products',
    freshSafe: 'Fresh & Safe',
    expiringSoon: 'Expiring Soon',
    urgentExpired: 'Urgent / Expired',
    trackedInInv: 'Tracked in inventory',
    goodShelfLife: 'Good shelf life',
    next3Days: 'Next 3 days',
    needsImmediate: 'Needs immediate use',
    actionNeeded: 'Action Needed',
    sustainabilityMilestone: 'Sustainability Milestone',
    ecoImpact: '🌱 Eco Impact',
    preventedBanner: "You've prevented {count} food items from being wasted!",
    savedDetails: "Saved approximately ${saved} and reduced {co2} kg of greenhouse gas emissions.",
    moneySaved: 'Money Saved',
    wasteFreeScore: 'Waste-Free Score',
    urgentHeading: 'Urgent Items Needing Cooking / Attention',
    cookRecipeWithThese: 'Cook Recipe with These',
    iAteThis: 'I Ate / Used This',
    findRecipe: 'Find Recipe',
    expiryTimelineStatus: 'Expiry Timeline Status',
    itemsByShelf: 'Items categorized by shelf life',
    categoryBreakdown: 'Food Category Breakdown',
    spreadAcrossDepts: 'Inventory spread across departments',
    noItemsInInventory: 'Your kitchen inventory is clean and fresh! Add or scan items to start tracking.',
    addNewProductBtn: 'Add First Food Item',
    scanLabelBtn: 'Scan Food Package',

    // Scanner
    multiEngineBadge: 'Multi-Engine AI Scanner',
    scannerTitle: 'Smart Barcode & OCR Scanner',
    presetsTab: '1-Click Presets',
    cameraTab: 'Live Camera',
    uploadTab: 'Upload Photo',
    barcodeTab: 'Barcode Lookup',
    instantTestLabels: 'Instant Test Packaging Presets',
    capturePhotoBtn: 'Capture & Extract Barcode',
    confidenceLabel: '{pct}% OCR Confidence',
    detectedProduct: 'Detected Food Name',
    parsedExpiry: 'Parsed Expiry Date',
    categoryGroup: 'Food Category',
    scanAnother: 'Scan Another Item',
    confirmAndSave: 'Confirm & Save to Inventory ➔',

    // Add Product Form
    addProductTitle: 'Add New Food Item',
    addProductSub: 'Enter food details manually or verify OCR scanned fields before saving.',
    productNameLabel: 'Product / Food Name',
    productNamePlaceholder: 'e.g., Organic Whole Milk, Spinach...',
    categoryLabel: 'Category Group',
    expiryDateLabel: 'Expiry / Best-Before Date',
    quantityLabel: 'Quantity',
    unitLabel: 'Unit / Packaging',
    unitPlaceholder: 'e.g., Bottle (1L), Bag (200g), pcs...',
    locationLabel: 'Storage Compartment',
    estimatedPriceLabel: 'Estimated Price ($)',
    notesLabel: 'Notes / Opened Status',
    notesPlaceholder: 'e.g., Opened 2 days ago, keep chilled...',
    saveProductBtn: 'Save to Kitchen Inventory',
    quickPresetsTitle: 'Quick Expiry Helpers',
    addDaysBtn: '+{days} Days',
    addWeeksBtn: '+{weeks} Weeks',

    // Reminder Preference
    reminderHeading: '🔔 Expiry Reminder Alert Preference',
    reminderQuestion: 'How many days before expiry should we alert you?',
    reminder1Day: '1 Day Before',
    reminder2Days: '2 Days Before (Recommended)',
    reminder3Days: '3 Days Before',
    reminder5Days: '5 Days Before',
    reminder7Days: '7 Days Before',
    reminderTargetDate: 'Target Alert Date:',
    reminderWillAlertOn: 'You will receive an automatic notification on',

    // Shopping List
    shoppingTitle: 'Smart Shopping List & Auto-Restock',
    shoppingSub: 'Groceries you consume are automatically added here. Buy and transfer directly back to fridge with 1 click!',
    autoRestockBadge: 'Auto-Restock Intelligence Active',
    cartTotal: 'Cart Estimated Total',
    unboughtItems: 'Items to Buy',
    transferBoughtBtn: 'Transfer Checked to Fridge ➔',
    addItemToShop: 'Add Grocery Item',
    itemNamePlaceholder: 'Enter item name (e.g., Oat Milk)...',
    noShopItems: 'Shopping list is empty! Items you consume will automatically appear here.',
    boughtBadge: 'Purchased',
    unboughtBadge: 'Need to Buy',

    // Fridge 2D Map
    fridgeMapTitle: 'Kitchen Storage & 2D Fridge Map',
    fridgeMapSub: 'Visual map of your refrigerator shelves, crisper, freezer, and pantry with thermal guidelines.',
    topShelfTitle: 'Top Shelf (4°C - 5°C)',
    topShelfDesc: 'Best for leftovers, prepared meals, opened dairy, and ready-to-eat foods.',
    middleShelfTitle: 'Middle Shelf (3°C - 4°C)',
    middleShelfDesc: 'Optimal for eggs, cheese blocks, deli meats, and yogurts.',
    bottomShelfTitle: 'Bottom Shelf (Coldest 2°C)',
    bottomShelfDesc: 'Safest zone for raw poultry, meat, and seafood to prevent drips.',
    crisperTitle: 'Crisper Humidity Drawer (4°C)',
    crisperDesc: 'High humidity zone for fresh leafy greens, herbs, berries, and vegetables.',
    doorTitle: 'Door Bins (Warmest 6°C - 8°C)',
    doorDesc: 'Ideal for condiments, salad dressings, jams, and pasteurized juices.',
    freezerTitle: 'Deep Freezer (-18°C)',
    freezerDesc: 'Pauses decay completely for bread, batch meals, and frozen produce.',
    pantryTitle: 'Dry Pantry (Room Temp)',
    pantryDesc: 'Dry grains, pasta boxes, canned goods, and sealed snacks.',
    noItemsInZone: 'No items stored in this zone currently.',

    // Recipes
    recipesTitle: 'Smart AI Recipe Generator',
    recipesSub: 'Chef recommendations crafted specifically from your expiring fridge ingredients.',
    aiCulinaryBadge: 'AI Zero-Waste Culinary Engine',
    regenerateBtn: 'Regenerate Recipes',
    suggestedDishes: 'Suggested Dishes',
    startGuidedCooking: 'Start Guided Cooking',
    markConsumed: 'Mark Consumed',
    prepCook: 'Prep / Cook',
    calories: 'Calories',
    servings: 'Servings',
    wasteSaved: 'Waste Saved',
    ingredientsNeeded: 'Ingredients Needed',
    inFridgeBadge: 'in fridge',
    pantryStaple: 'pantry staple',
    cookingSteps: 'Cooking Steps',
    storageTipHeading: 'Leftover & Storage Tip:',
    iMadeThisMeal: 'I Made This Meal!',

    // Nutrition
    nutritionTitle: 'Nutritional & Macro Horizon',
    nutritionSub: 'Live macro breakdown of your stocked food items and AI dietary balance advisor.',
    totalKcal: 'Total Stocked kcal',
    totalProtein: 'Total Protein',
    totalCarbs: 'Complex Carbs',
    totalFats: 'Healthy Fats',
    totalFiber: 'Dietary Fiber',
    macroDistribution: 'Macro Proportion Distribution',
    topNutrientDense: 'Top Nutrient-Dense Food in Stock',

    // Kitchen Audit
    auditTitle: '3-Minute Kitchen Freshness Audit',
    auditSub: 'A quick interactive checklist to triage urgent items, freeze what can be saved, and ensure zero food waste.',
    auditStep1: 'Step 1: Items to Cook Today / Tomorrow',
    auditStep2: 'Step 2: Move to Freezer to Pause Decay',
    auditStep3: 'Step 3: Unopened Staples for Community Pantries',
    auditStep4: 'Step 4: Audit Summary & Freshness Score',
    completeAuditBtn: 'Complete Audit & Apply Triage 🎉',

    // Preservation Guide
    preservationTitle: 'Food Preservation & Shelf-Life Encyclopedia',
    preservationSub: 'Search storage rules, ethylene gas compatibility, and anti-waste food revival hacks.',
    ethyleneGasTitle: 'The Ethylene Gas Rule',
    ethyleneGasDesc: 'Certain fruits release ethylene gas which accelerates ripening in sensitive neighbors.',
    emittersTitle: 'Ethylene Emitters (Store Separately)',
    sensitiveTitle: 'Ethylene Sensitive (Keep Away)',
    revivalHacksTitle: 'Anti-Waste Food Revival Hacks',

    // Scrap & Compost
    compostTitle: 'Food Scrap Repurposing & Compost Lab',
    compostSub: 'Turn inedible kitchen trimmings into delicious stocks, non-toxic cleaners, and organic plant fertilizer.',
    compostMonitorTitle: 'Live Compost Biomass Status',
    addGreensBtn: '+0.5kg Kitchen Scraps',
    addBrownsBtn: '+0.5kg Dry Paper/Leaves',
    scrapRecipesTitle: '5 Creative Kitchen Scrap Upcycling Guides',

    // Deals Radar
    dealsTitle: 'Grocery Deals & Markdown Radar',
    dealsSub: 'Find discounted near-expiry & surplus groceries at nearby markets (30%-50% off) and add straight to your cart.',
    allStoresTab: '🏬 All Nearby Stores',
    addToShoppingListBtn: 'Add to Shopping List',

    // Eco Challenges
    challengesTitle: 'Zero-Waste Quests & Achievements',
    challengesSub: 'Complete sustainability quests, maintain daily preservation streaks, and unlock master eco-trophies.',
    levelRank: 'Guardian Rank',
    streakTitle: 'Zero-Waste Streak 🔥',
    activeQuestsTitle: 'Active Weekly Quests',
    claimXpBtn: 'Claim +{xp} XP',
    completedBadge: 'Completed ✓',
    trophiesTitle: 'Master Eco-Trophies',

    // Household
    householdTitle: 'Household & Roommate Kitchen Manager',
    householdSub: 'Organize food ownership between roommates, rotate kitchen chores, and share grocery responsibilities.',
    kitchenSpaceTitle: 'Kitchen Space',
    sharedChoreRotation: 'Shared Kitchen Chore Rotation',
    foodOwnershipTagger: 'Food Ownership Tagger',
    sharedWithHouse: '🤝 Shared with House',
    personalItem: '🔒 Personal Item',
    assignChoreBtn: 'Assign',

    // Community
    communityTitle: 'Community Food Rescue & Sharing',
    communitySub: 'Donate surplus food to local 24/7 Community Fridges and connect with neighborhood food rescue programs.',
    donateFoodBtn: 'Donate Food Item',
    availableSurplus: 'Available Community Surplus Food',
    nearbyFridges: 'Nearby 24/7 Community Fridges & Food Banks',

    // Analytics
    analyticsTitle: 'Sustainability & Waste Analytics',
    analyticsSub: 'Track monthly grocery savings, environmental impact offsets, and predictive spoilage risks.',
    monthlySavingsTrend: 'Monthly Savings & Prevented Waste Trend',
    moneySavedArea: 'Money Saved ($)',
    wastedArea: 'Wasted ($)',
    decayRiskMatrix: 'Predictive Decay Risk Matrix',

    // Notifications
    notificationsTitle: 'Alerts & Expiry Notifications',
    notificationsSub: 'Stay updated on items nearing expiration and take timely zero-waste actions.',
    allAlertsTab: 'All Alerts',
    urgentAlertsTab: 'Urgent',
    warningAlertsTab: 'Warnings',
    expiredAlertsTab: 'Expired',

    // Settings
    settingsTitle: 'Settings & Preferences',
    settingsSub: 'Customize culinary dietary rules, currency, language, audio feedback, and backup your kitchen inventory.',
    languageSetting: 'Display Language',
    dietarySetting: 'Dietary Preference (Customizes AI Recipes)',
    currencySetting: 'Display Currency',
    soundSetting: 'Synthesizer Sound Effects & Voice',
    soundDesc: 'Chimes for scan, cooking timers, and speech narration',
    leadTimeSetting: 'Expiry Alert Lead Time',
    exportJsonBtn: 'Export Full Backup (JSON)',
    exportCsvBtn: 'Export Inventory (CSV)',
    restoreBackupBtn: 'Restore Backup File',
    clearFreshBtn: 'Clear All Data (Start 100% Fresh)',

    // FreshBot
    askFreshBot: 'Ask FreshBot Assistant',
    freshBotTitle: 'FreshBot AI Kitchen Voice Assistant',
    freshBotLive: 'Zero-Waste Culinary Companion',
    listening: 'Listening... Speak now',
    askAnything: 'Ask anything about cooking or expiries...'
  },

  ta: {
    // Brand
    brandName: 'உணவு பாதுகாவலன்',
    brandTagline: 'ஸ்மார்ட்டாக கண்காணிக்கவும் • வீணாவதை முற்றிலும் குறைக்கவும்',
    
    // Navigation
    navDashboard: 'முகப்பு பலகை',
    navProducts: 'உணவு இருப்புப் பட்டியல்',
    navAddProduct: 'புதிய உணவு சேர்',
    navScan: 'ஸ்மார்ட் ஸ்கேனர்',
    navRecipes: 'AI சமையல் கலைஞர்',
    navMealPlan: 'வாராந்திர உணவுத் திட்டம்',
    navShoppingList: 'மளிகைப் பொருட்கள் பட்டியல்',
    navFridgeMap: 'குளிர்சாதனப் பெட்டி வரைபடம்',
    navNutrition: 'ஊட்டச்சத்து & கலோரி மேலோட்டம்',
    navAudit: '3 நிமிட சமையலறை தணிக்கை',
    navPreservation: 'உணவுப் பாதுகாப்பு வழிகாட்டி',
    navCompost: 'கழிவு மறுசுழற்சி & இயற்கை உரம்',
    navDeals: 'மளிகை சிறப்பு தள்ளுபடிகள்',
    navChallenges: 'சுற்றுச்சூழல் சவால்கள் & பதக்கங்கள்',
    navHousehold: 'வீட்டு சமையலறை பொறுப்புகள்',
    navCommunity: 'சமூக உணவுப் பகிர்வு',
    navAnalytics: 'கழிவு & சேமிப்பு பகுப்பாய்வு',
    navAlerts: 'காலாவதி எச்சரிக்கைகள்',
    navSettings: 'அமைப்புகள் & விருப்பங்கள்',

    // TopBar
    greeting: 'இனிய வணக்கம்',
    assistantActive: 'பூஜ்ஜிய கழிவு AI குரல் உதவியாளர் செயலில் உள்ளது',
    quickScan: 'விரைவு ஸ்கேன்',
    addItem: 'உணவைச் சேர்',
    searchPlaceholder: 'எதையும் தேட அல்லது தட்டச்சு செய்க...',
    alertsTitle: 'எச்சரிக்கைகள் & காலாவதிகள்',
    markAllRead: 'அனைத்தையும் படித்ததாகக் குறி',
    noAlerts: 'தற்போது எந்த எச்சரிக்கைகளும் இல்லை! சமையலறை புத்தம் புதியது ✨',
    viewAllAlerts: 'அனைத்து எச்சரிக்கை வரலாற்றையும் காண்க →',
    signOut: 'வெளியேறு',

    // Statuses
    statusSafe: 'பாதுகாப்பானது',
    statusSoon: 'விரைவில் காலாவதியாகும்',
    statusUrgent: 'உடனடி பயன்பாடு தேவை',
    statusExpired: 'காலாவதியானது',
    expiresToday: 'இன்றே காலாவதியாகிறது',
    expiresTomorrow: 'நாளை காலாவதியாகிறது',
    daysLeft: '{days} நாட்கள் மீதம்',

    // Dashboard
    dashboardTitle: 'சமையலறை முகப்பு',
    dashboardSub: 'வணக்கம், {name}. உங்கள் சமையலறையின் நேரடி புத்துணர்ச்சி நிலவரம் இதோ.',
    totalProducts: 'மொத்த உணவுப் பொருட்கள்',
    freshSafe: 'புதியவை & பாதுகாப்பானவை',
    expiringSoon: 'விரைவில் காலாவதி',
    urgentExpired: 'அவசரம் / காலாவதி',
    trackedInInv: 'இருப்பில் உள்ளவை',
    goodShelfLife: 'நல்ல அடுக்கு வாழ்க்கை',
    next3Days: 'அடுத்த 3 நாட்கள்',
    needsImmediate: 'உடனடி சமையல் தேவை',
    actionNeeded: 'கவனம் தேவை',
    sustainabilityMilestone: 'சுற்றுச்சூழல் சாதனை',
    ecoImpact: '🌱 சுற்றுச்சூழல் நன்மை',
    preventedBanner: '{count} உணவுப் பொருட்கள் வீணாவதை நீங்கள் வெற்றிகரமாக தடுத்துள்ளீர்கள்!',
    savedDetails: 'தோராயமாக ${saved} சேமிக்கப்பட்டு, {co2} கிலோ பசுமை இல்ல வாயு உமிழ்வு குறைக்கப்பட்டது.',
    moneySaved: 'சேமிக்கப்பட்ட பணம்',
    wasteFreeScore: 'பூஜ்ஜிய கழிவு மதிப்பெண்',
    urgentHeading: 'உடனடியாக சமைக்க வேண்டிய முக்கிய உணவுகள்',
    cookRecipeWithThese: 'இவற்றை வைத்து சமைக்கவும்',
    iAteThis: 'பயன்படுத்திவிட்டேன் / சாப்பிட்டேன்',
    findRecipe: 'செய்முறையைக் கண்டுபிடி',
    expiryTimelineStatus: 'காலாவதி காலவரிசை நிலை',
    itemsByShelf: 'அடுக்கு வாழ்க்கை அடிப்படையில் பிரிப்பு',
    categoryBreakdown: 'உணவு வகை வாரியான பட்டியல்',
    spreadAcrossDepts: 'பிரிவுகள் வாரியாக உள்ள இருப்பு',
    noItemsInInventory: 'உங்கள் சமையலறை புத்தம் புதியதாக உள்ளது! உணவுகளைச் சேர்க்கவும் அல்லது ஸ்கேன் செய்யவும்.',
    addNewProductBtn: 'முதல் உணவுப் பொருளைச் சேர்',
    scanLabelBtn: 'உணவுப் பொதியை ஸ்கேன் செய்',

    // Scanner
    multiEngineBadge: 'மல்டி-இன்ஜின் AI ஸ்கேனர்',
    scannerTitle: 'ஸ்மார்ட் பார்கோடு & OCR ஸ்கேனர்',
    presetsTab: '1-கிளிக் மாதிரிகள்',
    cameraTab: 'நேரடி கேமரா',
    uploadTab: 'புகைப்படம் பதிவேற்று',
    barcodeTab: 'பார்கோடு தேடல்',
    instantTestLabels: 'உடனடி சோதனை பேக்கேஜிங் மாதிரிகள்',
    capturePhotoBtn: 'புகைப்படம் எடுத்து பார்கோடைப் பிரித்தெடு',
    confidenceLabel: '{pct}% OCR துல்லியம்',
    detectedProduct: 'கண்டறியப்பட்ட உணவுப் பெயர்',
    parsedExpiry: 'பிரித்தெடுக்கப்பட்ட காலாவதி தேதி',
    categoryGroup: 'உணவுப் பிரிவு',
    scanAnother: 'மற்றொரு உணவை ஸ்கேன் செய்',
    confirmAndSave: 'சரிபார்த்து இருப்பில் சேமிக்கவும் ➔',

    // Add Product Form
    addProductTitle: 'புதிய உணவைச் சேர்த்தல்',
    addProductSub: 'உணவு விவரங்களை உள்ளிடவும் அல்லது ஸ்கேன் செய்யப்பட்ட விவரங்களை சரிபார்த்து இருப்பில் சேமிக்கவும்.',
    productNameLabel: 'உணவின் பெயர்',
    productNamePlaceholder: 'எ.கா., ஆர்கானிக் பசும்பால், பசலைக்கீரை, தயிர்...',
    categoryLabel: 'உணவுப் பிரிவு',
    expiryDateLabel: 'காலாவதி தேதி / பயன்பாட்டு இறுதி நாள்',
    quantityLabel: 'அளவு / எண்ணிக்கை',
    unitLabel: 'அலகு / பேக்கிங் முறை',
    unitPlaceholder: 'எ.கா., பாட்டில், பை, பெட்டி, எண்ணிக்கை...',
    locationLabel: 'சேமிப்பு அறை / அலமாரி',
    estimatedPriceLabel: 'மதிப்பிடப்பட்ட விலை ($)',
    notesLabel: 'குறிப்புகள் / திறக்கப்பட்ட நிலை',
    notesPlaceholder: 'எ.கா., 2 நாட்களுக்கு முன் திறக்கப்பட்டது, குளிரூட்டவும்...',
    saveProductBtn: 'சமையலறை இருப்பில் சேமிக்கவும்',
    quickPresetsTitle: 'விரைவு காலாவதி தேதி தேர்வுகள்',
    addDaysBtn: '+{days} நாட்கள்',
    addWeeksBtn: '+{weeks} வாரங்கள்',

    // Reminder Preference
    reminderHeading: '🔔 காலாவதி நினைவூட்டல் எச்சரிக்கை விருப்பம்',
    reminderQuestion: 'காலாவதிக்கு எத்தனை நாட்களுக்கு முன்பு நாங்கள் உங்களுக்கு நினைவூட்ட வேண்டும்?',
    reminder1Day: '1 நாளுக்கு முன்பு',
    reminder2Days: '2 நாட்களுக்கு முன்பு (சிறந்தது)',
    reminder3Days: '3 நாட்களுக்கு முன்பு',
    reminder5Days: '5 நாட்களுக்கு முன்பு',
    reminder7Days: '7 நாட்களுக்கு முன்பு',
    reminderTargetDate: 'நினைவூட்டல் எச்சரிக்கை தேதி:',
    reminderWillAlertOn: 'தானியங்கி எச்சரிக்கை அனுப்பப்படும் தேதி',

    // Shopping List
    shoppingTitle: 'ஸ்மார்ட் மளிகைப் பட்டியல் & தானியங்கி மறுஇருப்பு',
    shoppingSub: 'நீங்கள் சமைத்து முடிக்கும் உணவுகள் தானாக இங்கே சேர்க்கப்படும். வாங்கி 1-கிளிக்கில் மீண்டும் பிரிட்ஜிற்கு மாற்றலாம்!',
    autoRestockBadge: 'தானியங்கி மறுஇருப்பு நுண்ணறிவு செயலில் உள்ளது',
    cartTotal: 'வண்டியின் மதிப்பிடப்பட்ட மொத்தம்',
    unboughtItems: 'வாங்க வேண்டிய பொருட்கள்',
    transferBoughtBtn: 'வாங்கியவற்றை குளிர்சாதனப் பெட்டிக்கு மாற்று ➔',
    addItemToShop: 'புதிய மளிகைப் பொருளைச் சேர்',
    itemNamePlaceholder: 'பொருளின் பெயரை உள்ளிடவும்...',
    noShopItems: 'மளிகைப் பட்டியல் காலியாக உள்ளது! நீங்கள் சமைக்கும் பொருட்கள் தானாக இங்கே வரும்.',
    boughtBadge: 'வாங்கப்பட்டது',
    unboughtBadge: 'வாங்க வேண்டும்',

    // Fridge 2D Map
    fridgeMapTitle: 'சமையலறை சேமிப்பு & குளிர்சாதன பெட்டி 2D வரைபடம்',
    fridgeMapSub: 'பிரிட்ஜ் தட்டுகள், காய்கறி டிராயர், பிரீசர் மற்றும் சரக்கறையின் விரிவான வெப்ப நிலை வரைபடம்.',
    topShelfTitle: 'மேல் தட்டு (4°C - 5°C)',
    topShelfDesc: 'மிச்ச உணவுகள், சமைத்த உணவுகள் மற்றும் தயார் உணவுகளுக்கு மிகவும் சிறந்தது.',
    middleShelfTitle: 'நடு தட்டு (3°C - 4°C)',
    middleShelfDesc: 'முட்டைகள், சீஸ் கட்டிகள், தயிர் மற்றும் பால் பொருட்களுக்கு உகந்தது.',
    bottomShelfTitle: 'கீழ் தட்டு (மிகக் குளிர் 2°C)',
    bottomShelfDesc: 'இறைச்சி, கோழி மற்றும் கடல் உணவுகளுக்கு பாதுகாப்பான குளிர்ப்பகுதி.',
    crisperTitle: 'காய்கறி ஈரப்பத டிராயர் (4°C)',
    crisperDesc: 'புதிய கீரைகள், மூலிகைகள் மற்றும் காய்கறிகளுக்கான பிரத்யேக பகுதி.',
    doorTitle: 'கதவு அலமாரிகள் (6°C - 8°C)',
    doorDesc: 'சாஸ்கள், ஜாம்கள், ஊறுகாய் மற்றும் பழச்சாறுகளுக்கு ஏற்றது.',
    freezerTitle: 'டீப் பிரீசர் (-18°C)',
    freezerDesc: 'ரொட்டி மற்றும் உறைந்த உணவுகளின் கெடுதலை முற்றிலும் நிறுத்துகிறது.',
    pantryTitle: 'உலர் சரக்கறை (அறை வெப்பநிலை)',
    pantryDesc: 'பருப்பு வகைகள், பாஸ்தா, அரிசி மற்றும் உலர் தின்பண்டங்கள்.',
    noItemsInZone: 'இந்த பகுதியில் தற்போது எந்த உணவும் வைக்கப்படவில்லை.',

    // Recipes
    recipesTitle: 'ஸ்மார்ட் AI சமையல் கலைஞர்',
    recipesSub: 'உங்கள் சமையலறையில் உள்ள காலாவதியாகும் பொருட்களிலிருந்து பிரத்யேகமாக உருவாக்கப்பட்ட சுவையான சமையல் குறிப்புகள்.',
    aiCulinaryBadge: 'AI பூஜ்ஜிய கழிவு சமையல் இன்ஜின்',
    regenerateBtn: 'புதிய செய்முறைகளை உருவாக்கு',
    suggestedDishes: 'பரிந்துரைக்கப்பட்ட சுவையான உணவுகள்',
    startGuidedCooking: 'குரல் வழிகாட்டுதலுடன் சமைக்கத் தொடங்கு',
    markConsumed: 'சமைத்து முடித்ததாகக் குறி',
    prepCook: 'தயாரிப்பு / சமையல் நேரம்',
    calories: 'கலோரிகள்',
    servings: 'பரிமாறல்கள்',
    wasteSaved: 'தடுக்கப்பட்ட கழிவு',
    ingredientsNeeded: 'தேவையான உணவுப் பொருட்கள்',
    inFridgeBadge: 'பிரிட்ஜில் உள்ளது',
    pantryStaple: 'அத்தியாவசியப் பொருள்',
    cookingSteps: 'சமையல் படிகள்',
    storageTipHeading: 'மிச்ச உணவைச் சேமிக்கும் குறிப்பு:',
    iMadeThisMeal: 'நான் இந்த உணவை சமைத்து முடித்தேன்!',

    // Nutrition
    nutritionTitle: 'ஊட்டச்சத்து & கலோரி மேலோட்டம்',
    nutritionSub: 'உங்கள் இருப்பு உணவுகளின் நேரடி ஊட்டச்சத்து விவரங்கள் மற்றும் AI உணவு ஆலோசகர்.',
    totalKcal: 'மொத்த கலோரிகள் (kcal)',
    totalProtein: 'மொத்த புரதச்சத்து (Protein)',
    totalCarbs: 'கார்போஹைட்ரேட்டுகள் (Carbs)',
    totalFats: 'ஆரோக்கியமான கொழுப்புகள் (Fats)',
    totalFiber: 'நார்ச்சத்து (Fiber)',
    macroDistribution: 'ஊட்டச்சத்து விகிதப் பகிர்வு',
    topNutrientDense: 'அதிக ஊட்டச்சத்து நிறைந்த உணவுகள்',

    // Kitchen Audit
    auditTitle: '3 நிமிட சமையலறை புத்துணர்ச்சி தணிக்கை',
    auditSub: 'உடனடி உணவுகளை சமைக்கவும், பிரீசரில் சேமிக்கவும், கழிவைத் தவிர்க்கவும் எளிய வழிகாட்டி.',
    auditStep1: 'படி 1: இன்று அல்லது நாளை சமைக்க வேண்டிய பொருட்கள்',
    auditStep2: 'படி 2: பிரீசருக்கு மாற்றி கெடுதலைத் தடுத்தல்',
    auditStep3: 'படி 3: சமூக உணவுக் கூடத்திற்கு தானம் செய்தல்',
    auditStep4: 'படி 4: தணிக்கை சுருக்கம் & ஆரோக்கிய மதிப்பெண்',
    completeAuditBtn: 'தணிக்கையை முடித்து செயல்படுத்தவும் 🎉',

    // Preservation Guide
    preservationTitle: 'உணவுப் பாதுகாப்பு & அடுக்கு வாழ்க்கை கலைக்களஞ்சியம்',
    preservationSub: 'சேமிப்பு விதிகள், எத்திலீன் வாயு விதிகள் மற்றும் உணவு மீட்புக் குறிப்புகள்.',
    ethyleneGasTitle: 'எத்திலீன் வாயு விதி',
    ethyleneGasDesc: 'சில பழங்கள் எத்திலீன் வாயுவை வெளியிடுகின்றன, இது அருகில் உள்ள காய்கறிகளை வேகமாக பழுக்க வைக்கிறது.',
    emittersTitle: 'எத்திலீன் வாயு வெளியிடுபவை (தனியாக வைக்கவும்)',
    sensitiveTitle: 'எத்திலீனால் பாதிக்கப்படுபவை (தள்ளி வைக்கவும்)',
    revivalHacksTitle: 'உணவு வீணாவதைத் தடுக்கும் மீட்பு முறைகள்',

    // Scrap & Compost
    compostTitle: 'உணவுக் கழிவு மறுபயன்பாடு & இயற்கை உர ஆய்வகம்',
    compostSub: 'சாப்பிட முடியாத காய்கறித் தோல்களை சத்து சூப், இயற்கை கிளீனர் மற்றும் தாவர உரமாக மாற்றவும்.',
    compostMonitorTitle: 'நேரடி உரக் குவியல் நிலை',
    addGreensBtn: '+0.5kg காய்கறிக் கழிவுகள் சேர்',
    addBrownsBtn: '+0.5kg காய்ந்த இலைகள் சேர்',
    scrapRecipesTitle: '5 ஆக்கப்பூர்வமான உணவுக் கழிவு மறுபயன்பாட்டு வழிகாட்டிகள்',

    // Deals Radar
    dealsTitle: 'மளிகை சலுகைகள் & தள்ளுபடி ரேடார்',
    dealsSub: 'அருகிலுள்ள கடைகளில் உள்ள தள்ளுபடி (30%-50%) உபரி உணவுகளைக் கண்டறிந்து வண்டியில் சேர்க்கவும்.',
    allStoresTab: '🏬 அனைத்து அருகிலுள்ள கடைகள்',
    addToShoppingListBtn: 'ஷாப்பிங் பட்டியலில் சேர்',

    // Eco Challenges
    challengesTitle: 'பூஜ்ஜிய கழிவு சவால்கள் & சாதனைகள்',
    challengesSub: 'சுற்றுச்சூழல் பணிகளை முடித்து, தினசரி சாதனைகளை அடைந்து பதக்கங்களை வெல்லுங்கள்.',
    levelRank: 'பாதுகாவலர் தகுதி நிலை',
    streakTitle: 'தொடர் கழிவு இல்லா சாதனை 🔥',
    activeQuestsTitle: 'செயலில் உள்ள வாராந்திர சவால்கள்',
    claimXpBtn: '+{xp} XP புள்ளிகளைப் பெறுக',
    completedBadge: 'முடிக்கப்பட்டது ✓',
    trophiesTitle: 'முதன்மை சுற்றுச்சூழல் கோப்பைகள்',

    // Household
    householdTitle: 'வீட்டு சமையலறை & அறை நண்பர்கள் மேலாளர்',
    householdSub: 'உணவு உரிமையை நிர்வகித்தல், சமையலறை வேலைகளைப் பகிர்ந்து கொள்ளுதல்.',
    kitchenSpaceTitle: 'சமையலறை இடம்',
    sharedChoreRotation: 'பகிரப்பட்ட சமையலறை வேலைகள்',
    foodOwnershipTagger: 'உணவு உரிமை குறிப்பான்',
    sharedWithHouse: '🤝 அனைவருக்கும் பொதுவான உணவு',
    personalItem: '🔒 தனிப்பட்ட உணவுப் பொருள்',
    assignChoreBtn: 'ஒதுக்கு',

    // Community
    communityTitle: 'சமூக உணவு மீட்பு & பகிர்வு',
    communitySub: 'உபரி உணவை அருகிலுள்ள 24/7 சமூக குளிர்சாதன பெட்டிகளுக்கு தானம் செய்யுங்கள்.',
    donateFoodBtn: 'உணவுப் பொருளைத் தானம் செய்',
    availableSurplus: 'கிடைக்கக்கூடிய சமூக உபரி உணவுகள்',
    nearbyFridges: 'அருகிலுள்ள 24/7 சமூக குளிர்சாதன பெட்டிகள் & உணவு வங்கிகள்',

    // Analytics
    analyticsTitle: 'சுற்றுச்சூழல் & கழிவு பகுப்பாய்வு',
    analyticsSub: 'மாதாந்திர பண சேமிப்பு, சுற்றுச்சூழல் தாக்கம் மற்றும் கெடுதல் அபாயங்களைக் கண்காணிக்கவும்.',
    monthlySavingsTrend: 'மாதாந்திர சேமிப்பு & கழிவு தடுப்பு போக்கு',
    moneySavedArea: 'சேமித்த பணம் ($)',
    wastedArea: 'வீணான தொகை ($)',
    decayRiskMatrix: 'கெடுதல் முன்கணிப்பு அணி',

    // Notifications
    notificationsTitle: 'எச்சரிக்கைகள் & காலாவதி அறிவிப்புகள்',
    notificationsSub: 'காலாவதியாகும் பொருட்களை முன்கூட்டியே அறிந்து உடனடியாகப் பயன்படுத்துங்கள்.',
    allAlertsTab: 'அனைத்து எச்சரிக்கைகள்',
    urgentAlertsTab: 'அவசரம்',
    warningAlertsTab: 'எச்சரிக்கைகள்',
    expiredAlertsTab: 'காலாவதியானவை',

    // Recipe Titles & Summaries (Top ones)
    'Paneer Butter Masala with Warm Naan': 'பன்னீர் பட்டர் மசாலா மற்றும் நான்',
    'A velvety, rich restaurant-style paneer curry simmered in a spiced buttery tomato cashew gravy.': 'வெண்ணெய் மற்றும் முந்திரி தக்காளி கிரேவியில் சமைக்கப்பட்ட ரெஸ்டாரண்ட் ஸ்டைல் பன்னீர் கறி.',
    'Homestyle Yellow Dal Tadka with Jeera Rice': 'வீட்டு முறை பருப்பு தட்கா மற்றும் சீரக சாதம்',
    'A comforting, protein-packed lentil stew infused with a sizzling tempered ghee, cumin, and garlic tadka.': 'நெய், சீரகம் மற்றும் பூண்டு தாளிப்புடன் கூடிய புரதச்சத்து நிறைந்த ஆரோக்கியமான பருப்பு குழம்பு.',
    'South Indian Sambar & Vegetable Medley': 'தென்னிந்திய சாம்பார் & காய்கறி கலவை',
    'The quintessential South Indian tangy stew rescuing whatever vegetables you have in a spiced tamarind broth.': 'உங்கள் வீட்டில் உள்ள காய்கறிகளை வைத்து புளிப்புச் சுவையுடன் தயாரிக்கப்படும் பாரம்பரிய தென்னிந்திய சாம்பார்.',


    // Settings
    settingsTitle: 'அமைப்புகள் & விருப்பத்தேர்வுகள்',
    settingsSub: 'சமையல் உணவு விதிகள், நாணயம், மொழி, ஆடியோ மற்றும் தரவு காப்புப்பிரதியைத் தனிப்பயனாக்குங்கள்.',
    languageSetting: 'காட்சி மொழி',
    dietarySetting: 'உணவு விருப்பத்தேர்வு (AI சமையல் குறிப்புகளை மாற்றும்)',
    currencySetting: 'காட்சி நாணயம்',
    soundSetting: 'ஒலி மற்றும் குரல் விளைவுகள்',
    soundDesc: 'ஸ்கேன், சமையல் வழிகாட்டி மற்றும் குரல் ஒலிகள்',
    leadTimeSetting: 'காலாவதி எச்சரிக்கை முன்னறிவிப்பு நேரம்',
    exportJsonBtn: 'முழு காப்புப்பிரதியை பதிவிறக்குக (JSON கோப்பு)',
    exportCsvBtn: 'இருப்புப் பட்டியலை பதிவிறக்குக (CSV கோப்பு)',
    restoreBackupBtn: 'காப்புப் பிரதி கோப்பை மீட்டமை',
    clearFreshBtn: 'அனைத்து தரவையும் அழித்து புத்தம் புதியதாகத் தொடங்கு',

    // FreshBot
    askFreshBot: 'FreshBot உதவியாளரிடம் கேளுங்கள்',
    freshBotTitle: 'FreshBot AI குரல் உதவியாளர்',
    freshBotLive: 'பூஜ்ஜிய கழிவு சமையலறை வழிகாட்டி',
    listening: 'கேட்கிறது... பேசுங்கள்',
    askAnything: 'சமையல் அல்லது காலாவதி பற்றி கேளுங்கள்...'
  }
};

// Extensive 100% Pure Food Dictionary (No English in Tamil mode)
const FOOD_TRANSLATIONS = {
  // Dairy & Alternatives
  'milk': 'பசும்பால்',
  'organic whole milk': 'ஆர்கானிக் பசும்பால்',
  'organic whole milk 1l': 'ஆர்கானிக் பசும்பால் 1L',
  'whole milk': 'முழு கொழுப்புப் பால்',
  'skim milk': 'கொழுப்பு நீக்கிய பால்',
  'almond milk': 'பாதாம் பால்',
  'oat milk': 'ஓட்ஸ் பால்',
  'soy milk': 'சோயா பால்',
  'coconut milk': 'தேங்காய்ப் பால்',
  'eggs': 'நாட்டுக்கோழி முட்டைகள்',
  'free-range eggs': 'பண்ணை நாட்டுக்கோழி முட்டைகள்',
  'organic eggs': 'ஆர்கானிக் முட்டைகள்',
  'yogurt': 'தயிர்',
  'greek yogurt': 'கிரேக்க தயிர்',
  'greek yogurt (plain 500g)': 'கிரேக்க கெட்டித் தயிர் 500 கிராம்',
  'cheese': 'பாலாடைக்கட்டி (சீஸ்)',
  'cheddar cheese': 'செடார் சீஸ்',
  'mozzarella': 'மொஸரெல்லா சீஸ்',
  'parmesan': 'பர்மேசன் சீஸ்',
  'paneer': 'பன்னீர் கட்டி',
  'butter': 'வெண்ணெய்',
  'heavy cream': 'கெட்டி கிரீம்',
  'sour cream': 'புளிப்பு கிரீம்',
  'ghee': 'சுத்தமான நெய்',

  // Produce - Vegetables
  'spinach': 'பசலைக்கீரை',
  'baby spinach': 'இளம் பசலைக்கீரை',
  'organic baby spinach': 'ஆர்கானிக் பசலைக்கீரை',
  'organic baby spinach (300g)': 'ஆர்கானிக் பசலைக்கீரை 300 கிராம்',
  'tomatoes': 'நாட்டுத் தக்காளி',
  'cherry tomatoes': 'செர்ரி தக்காளி',
  'roma tomatoes': 'ரோமா தக்காளி',
  'potatoes': 'உருளைக்கிழங்கு',
  'sweet potatoes': 'சர்க்கரைவள்ளிக் கிழங்கு',
  'onions': 'பெரிய வெங்காயம்',
  'red onions': 'சிவப்பு வெங்காயம்',
  'garlic': 'பூண்டு',
  'ginger': 'இஞ்சி',
  'carrots': 'கேரட் கிழங்கு',
  'broccoli': 'ப்ரோக்கோலி பூக்கோசு',
  'cauliflower': 'காலிஃபிளவர் பூக்கோசு',
  'bell pepper': 'குடைமிளகாய்',
  'bell peppers': 'குடைமிளகாய்கள்',
  'capsicum': 'பச்சை குடைமிளகாய்',
  'mushrooms': 'காளான்',
  'cabbage': 'முட்டைக்கோஸ்',
  'cucumbers': 'வெள்ளரிக்காய்',
  'cucumber': 'வெள்ளரிக்காய்',
  'zucchini': 'சுரைக்காய் ஜூச்சினி',
  'lettuce': 'லெட்யூஸ் இலைகள்',
  'kale': 'கேல் கீரை',
  'cilantro': 'கொத்தமல்லித் தழை',
  'coriander': 'கொத்தமல்லி',
  'mint': 'புதினா தழை',
  'green chilies': 'பச்சை மிளகாய்',
  'green beans': 'பீன்ஸ் காய்',
  'peas': 'பச்சை பட்டாணி',
  'corn': 'மக்காச்சோளம்',

  // Produce - Fruits
  'strawberries': 'ஸ்ட்ராபெர்ரி பழங்கள்',
  'fresh strawberries': 'புதிய ஸ்ட்ராபெர்ரி பழங்கள்',
  'fresh strawberries punnet': 'புதிய ஸ்ட்ராபெர்ரி பழப்பெட்டி',
  'blueberries': 'ப்ளூபெர்ரி பழங்கள்',
  'raspberries': 'ராஸ்பெர்ரி பழங்கள்',
  'apples': 'ஆப்பிள் பழங்கள்',
  'gala apples': 'காலா ஆப்பிள்',
  'bananas': 'வாழைப்பழங்கள்',
  'organic bananas': 'ஆர்கானிக் வாழைப்பழம்',
  'avocados': 'வெண்ணெய் பழங்கள்',
  'avocado': 'வெண்ணெய் பழம்',
  'lemons': 'எலுமிச்சம்பழம்',
  'lemon': 'எலுமிச்சை',
  'limes': 'பச்சை எலுமிச்சை',
  'oranges': 'ஆரஞ்சு பழங்கள்',
  'mangoes': 'மாம்பழங்கள்',
  'grapes': 'திராட்சைப் பழங்கள்',
  'watermelon': 'தர்பூசணி பழம்',
  'pineapple': 'அன்னாசிப்பழம்',
  'papaya': 'பப்பாளிப் பழம்',
  'pomegranate': 'மாதுளம்பழம்',

  // Bakery & Grains
  'bread': 'ரொட்டி',
  'sourdough bread': 'புளிப்பு ரொட்டி',
  'artisan sourdough': 'கைவினை புளிப்பு ரொட்டி',
  'artisan sourdough loaf': 'கைவினை புளிப்பு ரொட்டி',
  'whole wheat bread': 'கோதுமை ரொட்டி',
  'white bread': 'வெள்ளை ரொட்டி',
  'bagels': 'பேகல் ரொட்டி',
  'croissant': 'குரோசண்ட் பேஸ்ட்ரி',
  'tortillas': 'டோர்ட்டில்லா ரொட்டி',
  'pita bread': 'பீட்டா ரொட்டி',
  'pasta': 'பாஸ்தா',
  'penne': 'பென்னே பாஸ்தா',
  'spaghetti': 'ஸ்பாகெட்டி நூடுல்ஸ்',
  'macaroni': 'மேக்ரோனி',
  'rice': 'அரிசி',
  'basmati rice': 'பாசுமதி அரிசி',
  'brown rice': 'கைக்குத்தல் பழுப்பு அரிசி',
  'jasmine rice': 'ஜாஸ்மின் அரிசி',
  'quinoa': 'கினோவா தானியம்',
  'oats': 'ஓட்ஸ் தானியம்',
  'rolled oats': 'உருட்டப்பட்ட ஓட்ஸ்',
  'flour': 'கோதுமை மாவு',
  'wheat flour': 'முழு கோதுமை மாவு',
  'all-purpose flour': 'மைதா மாவு',
  'noodles': 'நூடுல்ஸ்',

  // Meat, Poultry & Seafood
  'chicken': 'கோழி இறைச்சி',
  'chicken breast': 'கோழி மார்பு இறைச்சி',
  'fresh chicken breast (600g)': 'புதிய கோழி மார்பு இறைச்சி 600 கிராம்',
  'chicken thighs': 'கோழி தொடை இறைச்சி',
  'ground chicken': 'கொத்து கோழி இறைச்சி',
  'beef': 'மாட்டிறைச்சி',
  'ground beef': 'கொத்து மாட்டிறைச்சி',
  'pork': 'பன்றி இறைச்சி',
  'mutton': 'ஆட்டிறைச்சி',
  'lamb': 'செம்மறி ஆட்டிறைச்சி',
  'fish': 'மீன்',
  'salmon': 'சால்மன் மீன்',
  'tuna': 'சூரை மீன்',
  'canned tuna': 'டின் சூரை மீன்',
  'shrimp': 'இறால்',
  'prawns': 'இறால் மீன்',
  'tofu': 'டோஃபு சோயா கட்டி',
  'bacon': 'பேக்கன் இறைச்சித் துண்டு',
  'sausages': 'சாசேஜ் இறைச்சி உருளை',

  // Pantry, Oils, Condiments & Spices
  'olive oil': 'ஆலிவ் எண்ணெய்',
  'extra virgin olive oil': 'தூய ஆலிவ் எண்ணெய்',
  'vegetable oil': 'சமையல் எண்ணெய்',
  'coconut oil': 'தேங்காய் எண்ணெய்',
  'sesame oil': 'நல்லெண்ணெய்',
  'soy sauce': 'சோயா சாஸ்',
  'tomato sauce': 'தக்காளி சாஸ்',
  'ketchup': 'தக்காளி கெட்சப்',
  'mayonnaise': 'மயோனைஸ்',
  'mustard': 'கடுகு சாஸ்',
  'honey': 'சுத்தமான தேன்',
  'maple syrup': 'மேப்பிள் மரப்பாகு',
  'peanut butter': 'வேர்க்கடலை வெண்ணெய்',
  'jam': 'பழக்கூழ் ஜாம்',
  'salt': 'உப்பு',
  'black pepper': 'கருப்பு மிளகுத்தூள்',
  'sugar': 'சர்க்கரை',
  'chickpeas': 'கொண்டைக்கடலை',
  'black beans': 'கருப்பு பீன்ஸ் பயறு',
  'lentils': 'துவரம் பருப்பு',
  'red lentils': 'மசூர் பருப்பு',
  'coffee': 'காபித்தூள்',
  'tea': 'தேயிலைத்தூள்',
  'dark chocolate': 'டார்க் சாக்லேட்'
};

const CATEGORY_TRANSLATIONS = {
  'Produce': 'காய்கறி & பழங்கள்',
  'Dairy & Eggs': 'பால் & முட்டை',
  'Meat & Poultry': 'இறைச்சி & கோழி',
  'Bakery': 'ரொட்டி & பேக்கரி',
  'Pantry': 'சரக்கறை தானியங்கள்',
  'Frozen': 'உறைந்த உணவுகள்',
  'Beverages': 'குளிர்பானங்கள்',
  'Snacks': 'தின்பண்டங்கள்',
  'General': 'பொதுவான உணவுகள்'
};

const LOCATION_TRANSLATIONS = {
  'Fridge Top Shelf': 'பிரிட்ஜ் மேல் தட்டு',
  'Fridge Middle Shelf': 'பிரிட்ஜ் நடு தட்டு',
  'Fridge Bottom Shelf': 'பிரிட்ஜ் கீழ் தட்டு',
  'Fridge Crisper Drawer': 'காய்கறி ஈரப்பத டிராயர்',
  'Fridge Door': 'பிரிட்ஜ் கதவு அலமாரி',
  'Freezer Basket': 'பிரீசர் கூடை',
  'Deep Freezer': 'டீப் பிரீசர்',
  'Bread Box': 'ரொட்டி பெட்டி',
  'Pantry Shelf 1': 'சரக்கறை தட்டு 1',
  'Pantry Shelf 2': 'சரக்கறை தட்டு 2',
  'Fridge': 'குளிர்சாதனப் பெட்டி',
  'Freezer': 'பிரீசர்',
  'Pantry': 'சரக்கறை'
};

const UNIT_TRANSLATIONS = {
  'pcs': 'எண்ணிக்கை',
  'piece': 'எண்ணிக்கை',
  'pieces': 'எண்ணிக்கை',
  'bottle': 'பாட்டில்',
  'bottles': 'பாட்டில்கள்',
  'bag': 'பை',
  'bags': 'பைகள்',
  'box': 'பெட்டி',
  'boxes': 'பெட்டிகள்',
  'pack': 'பேக்',
  'packs': 'பேக்குகள்',
  'can': 'டின்',
  'cans': 'டின்கள்',
  'kg': 'கிலோ',
  'g': 'கிராம்',
  'L': 'லிட்டர்',
  'ml': 'மில்லிலிட்டர்',
  'bunch': 'கட்டு',
  'bunches': 'கட்டுகள்',
  'slices': 'துண்டுகள்',
  'jar': 'ஜாடி',
  'carton': 'அட்டைப்பெட்டி',
  'punnet': 'பெட்டி',
  'tub': 'டப்'
};

const DAY_TRANSLATIONS = {
  'Monday': 'திங்கட்கிழமை',
  'Tuesday': 'செவ்வாய்க்கிழமை',
  'Wednesday': 'புதன்கிழமை',
  'Thursday': 'வியாழக்கிழமை',
  'Friday': 'வெள்ளிக்கிழமை',
  'Saturday': 'சனிக்கிழமை',
  'Sunday': 'ஞாயிற்றுக்கிழமை'
};

const MEAL_TRANSLATIONS = {
  'Breakfast': 'காலை உணவு',
  'Lunch': 'மதிய உணவு',
  'Dinner': 'இரவு உணவு',
  'Snack': 'சிற்றுண்டி'
};

const CUISINE_TRANSLATIONS = {
  'Italian': 'இத்தாலிய உணவு',
  'Asian': 'ஆசிய உணவு',
  'Mediterranean': 'மத்திய தரைக்கடல் உணவு',
  'Indian': 'பாரம்பரிய இந்திய உணவு',
  'Mexican': 'மெக்சிகன் உணவு',
  'American': 'அமெரிக்கன் உணவு',
  'French': 'பிரெஞ்சு உணவு',
  'Fusion': 'கலவை உணவு'
};

const DIET_TRANSLATIONS = {
  'High-Protein': 'அதிக புரதம்',
  'Vegetarian': 'சைவ உணவு',
  'Vegan': 'முழு தாவர உணவு',
  'Keto': 'கீட்டோ உணவு',
  'Pescatarian': 'மீன் உணவு',
  'Omnivore': 'அனைத்துணவு',
  'Gluten-Free': 'பசையம் இல்லாத உணவு'
};

const STATUS_TRANSLATIONS = {
  'SAFE': 'பாதுகாப்பானது',
  'EXPIRING SOON': 'விரைவில் காலாவதி',
  'URGENT': 'உடனடி பயன்பாடு',
  'EXPIRED': 'காலாவதியானது'
};

export const translateFood = (name, lang = 'en') => {
  if (!name || lang === 'en') return name;
  const lower = name.toLowerCase().trim();
  for (const [key, val] of Object.entries(FOOD_TRANSLATIONS)) {
    if (lower === key || lower.includes(key)) {
      return val;
    }
  }
  return name;
};

export const translateCategory = (category, lang = 'en') => {
  if (!category || lang === 'en') return category;
  return CATEGORY_TRANSLATIONS[category] || category;
};

export const translateLocation = (location, lang = 'en') => {
  if (!location || lang === 'en') return location;
  return LOCATION_TRANSLATIONS[location] || location;
};

export const translateUnit = (unit, lang = 'en') => {
  if (!unit || lang === 'en') return unit;
  return UNIT_TRANSLATIONS[unit.toLowerCase()] || unit;
};

export const translateDay = (day, lang = 'en') => {
  if (!day || lang === 'en') return day;
  return DAY_TRANSLATIONS[day] || day;
};

export const translateMealType = (meal, lang = 'en') => {
  if (!meal || lang === 'en') return meal;
  return MEAL_TRANSLATIONS[meal] || meal;
};

export const translateCuisine = (cuisine, lang = 'en') => {
  if (!cuisine || lang === 'en') return cuisine;
  return CUISINE_TRANSLATIONS[cuisine] || cuisine;
};

export const translateDiet = (diet, lang = 'en') => {
  if (!diet || lang === 'en') return diet;
  return DIET_TRANSLATIONS[diet] || diet;
};

export const translateStatus = (status, lang = 'en') => {
  if (!status || lang === 'en') return status;
  return STATUS_TRANSLATIONS[status] || status;
};
