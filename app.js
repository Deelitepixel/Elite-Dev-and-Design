/**
 * NutriTrack — Modern Calorie & Macro Tracker
 * Vanilla JavaScript (Zero External Dependencies, Pure Canvas 2D Charts)
 */

(function () {
  'use strict';

  // ==========================================
  // 1. CONSTANTS & DEFAULT FOOD / EXERCISE DATA
  // ==========================================

  const STORAGE_KEYS = {
    SETTINGS: 'nutritrack_settings',
    LOGS: 'nutritrack_logs',
    INITIALIZED: 'nutritrack_init_flag'
  };

  const DEFAULT_SETTINGS = {
    dailyCalories: 2000,
    protein: 140, // grams
    carbs: 220,   // grams
    fat: 60,      // grams
    waterGoal: 2500 // ml
  };

  const MEAL_COLORS = {
    breakfast: '#38bdf8', // sky blue
    lunch: '#10b981',     // emerald
    dinner: '#f59e0b',    // amber
    snacks: '#a855f7'     // purple
  };

  const COMMON_FOODS = [
    // Proteins
    { name: 'Grilled Chicken Breast', category: 'protein', serving: '150g (1 breast)', calories: 247, protein: 46, carbs: 0, fat: 5 },
    { name: 'Eggs (Whole, Boiled/Fried)', category: 'protein', serving: '2 large eggs', calories: 144, protein: 12.6, carbs: 0.8, fat: 9.8 },
    { name: 'Egg Whites', category: 'protein', serving: '4 egg whites (130g)', calories: 68, protein: 14.4, carbs: 0.9, fat: 0.2 },
    { name: 'Atlantic Salmon Fillet', category: 'protein', serving: '150g fillet', calories: 312, protein: 30, carbs: 0, fat: 20 },
    { name: 'Greek Yogurt (Plain 0%)', category: 'protein', serving: '200g (1 cup)', calories: 118, protein: 20.6, carbs: 7.2, fat: 0.4 },
    { name: 'Whey Protein Powder', category: 'protein', serving: '1 scoop (30g)', calories: 120, protein: 24, carbs: 2, fat: 1.5 },
    { name: 'Canned Tuna in Water', category: 'protein', serving: '1 can drained (120g)', calories: 132, protein: 29, carbs: 0, fat: 1 },
    { name: 'Lean Beef Mince (95/5)', category: 'protein', serving: '150g', calories: 205, protein: 32, carbs: 0, fat: 7.5 },
    { name: 'Firm Tofu', category: 'protein', serving: '150g', calories: 125, protein: 13.5, carbs: 2.8, fat: 6.8 },
    { name: 'Cottage Cheese (Low Fat)', category: 'protein', serving: '150g', calories: 123, protein: 17, carbs: 5.2, fat: 3.5 },

    // Carbs & Grains
    { name: 'Rolled Oatmeal', category: 'carbs', serving: '60g dry (1/2 cup)', calories: 227, protein: 8, carbs: 40, fat: 4 },
    { name: 'Jasmine White Rice (Cooked)', category: 'carbs', serving: '150g (1 cup)', calories: 195, protein: 4, carbs: 43, fat: 0.4 },
    { name: 'Brown Rice (Cooked)', category: 'carbs', serving: '150g (1 cup)', calories: 165, protein: 3.5, carbs: 35, fat: 1.4 },
    { name: 'Whole Wheat Bread', category: 'carbs', serving: '2 slices (70g)', calories: 160, protein: 7, carbs: 28, fat: 2 },
    { name: 'Baked Sweet Potato', category: 'carbs', serving: '150g medium', calories: 135, protein: 3, carbs: 31, fat: 0.2 },
    { name: 'Penne / Spaghetti (Cooked)', category: 'carbs', serving: '150g (1 cup)', calories: 220, protein: 8, carbs: 44, fat: 1.2 },
    { name: 'Quinoa (Cooked)', category: 'carbs', serving: '150g (1 cup)', calories: 180, protein: 6.5, carbs: 32, fat: 2.8 },
    { name: 'Whole Grain Tortilla Wrap', category: 'carbs', serving: '1 wrap (60g)', calories: 170, protein: 5, carbs: 26, fat: 4 },

    // Fruits & Veg
    { name: 'Banana', category: 'produce', serving: '1 medium (118g)', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 },
    { name: 'Apple (Honeycrisp/Gala)', category: 'produce', serving: '1 medium (180g)', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    { name: 'Fresh Blueberries', category: 'produce', serving: '100g (1 cup)', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
    { name: 'Avocado', category: 'produce', serving: '1/2 medium (75g)', calories: 120, protein: 1.5, carbs: 6, fat: 11 },
    { name: 'Steamed Broccoli', category: 'produce', serving: '150g (1 cup)', calories: 52, protein: 4.2, carbs: 10, fat: 0.6 },
    { name: 'Baby Spinach (Raw)', category: 'produce', serving: '100g (huge bowl)', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    { name: 'Orange', category: 'produce', serving: '1 medium (130g)', calories: 62, protein: 1.2, carbs: 15.4, fat: 0.2 },

    // Dairy & Healthy Fats
    { name: 'Whole Cow Milk', category: 'dairy', serving: '250ml (1 glass)', calories: 152, protein: 8.2, carbs: 12, fat: 8 },
    { name: 'Unsweetened Almond Milk', category: 'dairy', serving: '250ml (1 glass)', calories: 35, protein: 1.2, carbs: 1.5, fat: 2.8 },
    { name: 'Raw Almonds', category: 'dairy', serving: '28g (approx 23 nuts)', calories: 164, protein: 6, carbs: 6, fat: 14 },
    { name: 'Natural Peanut Butter', category: 'dairy', serving: '32g (2 tbsp)', calories: 190, protein: 8, carbs: 7, fat: 16 },
    { name: 'Extra Virgin Olive Oil', category: 'dairy', serving: '14g (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 13.5 },
    { name: 'Cheddar Cheese', category: 'dairy', serving: '30g slice', calories: 120, protein: 7.2, carbs: 0.4, fat: 9.8 },

    // Beverages
    { name: 'Black Coffee (Espresso/Drip)', category: 'beverages', serving: '1 cup / mug', calories: 2, protein: 0.2, carbs: 0, fat: 0 },
    { name: 'Matcha / Green Tea', category: 'beverages', serving: '1 mug', calories: 3, protein: 0.3, carbs: 0.4, fat: 0 },
    { name: 'Pure Coconut Water', category: 'beverages', serving: '250ml', calories: 45, protein: 0.5, carbs: 11, fat: 0.2 }
  ];

  const COMMON_EXERCISES = [
    { name: 'Outdoor Running (8 km/h)', duration: 30, calories: 280 },
    { name: 'Brisk Walking (5 km/h)', duration: 40, calories: 160 },
    { name: 'Cycling / Spin Class', duration: 45, calories: 350 },
    { name: 'Weightlifting / Strength', duration: 50, calories: 220 },
    { name: 'HIIT Circuit Workout', duration: 25, calories: 260 },
    { name: 'Swimming (Freestyle)', duration: 30, calories: 250 },
    { name: 'Jump Rope Session', duration: 20, calories: 210 },
    { name: 'Vinyasa Yoga / Stretch', duration: 40, calories: 140 }
  ];

  // ==========================================
  // 2. STATE MANAGEMENT
  // ==========================================

  let state = {
    selectedDate: getTodayString(),
    settings: loadSettings(),
    logs: loadLogs(),
    activeFilterCategory: 'all'
  };

  function getTodayString() {
    const today = new Date();
    return formatDateKey(today);
  }

  function formatDateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to parse settings, using defaults', e);
    }
    return { ...DEFAULT_SETTINGS };
  }

  function saveSettings(newSettings) {
    state.settings = { ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  }

  function loadLogs() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse logs, initializing empty', e);
    }
    return {};
  }

  function saveLogs() {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(state.logs));
  }

  function getOrCreateDayLog(dateKey) {
    if (!state.logs[dateKey]) {
      state.logs[dateKey] = {
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        exercises: [],
        water: 0,
        weight: null
      };
    }
    return state.logs[dateKey];
  }

  // ==========================================
  // 3. SEED REALISTIC DEMO DATA (ON FIRST RUN)
  // ==========================================

  function checkAndSeedSampleData() {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      seedDemoWeek();
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  function seedDemoWeek() {
    const baseDate = new Date();

    // 7 days history
    const sampleDays = [
      {
        offset: -6,
        water: 2500,
        weight: 75.8,
        breakfast: [
          { id: 'sb_1', name: 'Rolled Oatmeal', serving: '60g with water', calories: 227, protein: 8, carbs: 40, fat: 4 },
          { id: 'sb_2', name: 'Whey Protein Powder', serving: '1 scoop', calories: 120, protein: 24, carbs: 2, fat: 1.5 }
        ],
        lunch: [
          { id: 'sl_1', name: 'Grilled Chicken Breast', serving: '150g', calories: 247, protein: 46, carbs: 0, fat: 5 },
          { id: 'sl_2', name: 'Jasmine White Rice (Cooked)', serving: '150g', calories: 195, protein: 4, carbs: 43, fat: 0.4 },
          { id: 'sl_3', name: 'Steamed Broccoli', serving: '150g', calories: 52, protein: 4.2, carbs: 10, fat: 0.6 }
        ],
        dinner: [
          { id: 'sd_1', name: 'Atlantic Salmon Fillet', serving: '150g', calories: 312, protein: 30, carbs: 0, fat: 20 },
          { id: 'sd_2', name: 'Baked Sweet Potato', serving: '150g', calories: 135, protein: 3, carbs: 31, fat: 0.2 }
        ],
        snacks: [
          { id: 'ss_1', name: 'Apple (Honeycrisp/Gala)', serving: '1 medium', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
        ],
        exercises: [
          { id: 'se_1', name: 'Outdoor Running (8 km/h)', duration: 30, calories: 280 }
        ]
      },
      {
        offset: -5,
        water: 2250,
        weight: 75.6,
        breakfast: [
          { id: 'sb2_1', name: 'Eggs (Whole, Boiled/Fried)', serving: '2 large eggs', calories: 144, protein: 12.6, carbs: 0.8, fat: 9.8 },
          { id: 'sb2_2', name: 'Whole Wheat Bread', serving: '2 slices', calories: 160, protein: 7, carbs: 28, fat: 2 }
        ],
        lunch: [
          { id: 'sl2_1', name: 'Canned Tuna in Water', serving: '1 can', calories: 132, protein: 29, carbs: 0, fat: 1 },
          { id: 'sl2_2', name: 'Quinoa (Cooked)', serving: '150g', calories: 180, protein: 6.5, carbs: 32, fat: 2.8 }
        ],
        dinner: [
          { id: 'sd2_1', name: 'Lean Beef Mince (95/5)', serving: '150g', calories: 205, protein: 32, carbs: 0, fat: 7.5 },
          { id: 'sd2_2', name: 'Penne / Spaghetti (Cooked)', serving: '150g', calories: 220, protein: 8, carbs: 44, fat: 1.2 }
        ],
        snacks: [
          { id: 'ss2_1', name: 'Greek Yogurt (Plain 0%)', serving: '200g', calories: 118, protein: 20.6, carbs: 7.2, fat: 0.4 }
        ],
        exercises: [
          { id: 'se2_1', name: 'Weightlifting / Strength', duration: 45, calories: 220 }
        ]
      },
      {
        offset: -4,
        water: 2750,
        weight: 75.4,
        breakfast: [
          { id: 'sb3_1', name: 'Rolled Oatmeal', serving: '60g', calories: 227, protein: 8, carbs: 40, fat: 4 },
          { id: 'sb3_2', name: 'Banana', serving: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
        ],
        lunch: [
          { id: 'sl3_1', name: 'Grilled Chicken Breast', serving: '180g', calories: 296, protein: 55, carbs: 0, fat: 6 },
          { id: 'sl3_2', name: 'Brown Rice (Cooked)', serving: '150g', calories: 165, protein: 3.5, carbs: 35, fat: 1.4 }
        ],
        dinner: [
          { id: 'sd3_1', name: 'Firm Tofu', serving: '150g', calories: 125, protein: 13.5, carbs: 2.8, fat: 6.8 },
          { id: 'sd3_2', name: 'Jasmine White Rice (Cooked)', serving: '150g', calories: 195, protein: 4, carbs: 43, fat: 0.4 }
        ],
        snacks: [
          { id: 'ss3_1', name: 'Raw Almonds', serving: '28g', calories: 164, protein: 6, carbs: 6, fat: 14 }
        ],
        exercises: [
          { id: 'se3_1', name: 'Cycling / Spin Class', duration: 40, calories: 310 }
        ]
      },
      {
        offset: -3,
        water: 2500,
        weight: 75.2,
        breakfast: [
          { id: 'sb4_1', name: 'Greek Yogurt (Plain 0%)', serving: '200g', calories: 118, protein: 20.6, carbs: 7.2, fat: 0.4 },
          { id: 'sb4_2', name: 'Fresh Blueberries', serving: '100g', calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 }
        ],
        lunch: [
          { id: 'sl4_1', name: 'Atlantic Salmon Fillet', serving: '150g', calories: 312, protein: 30, carbs: 0, fat: 20 },
          { id: 'sl4_2', name: 'Baked Sweet Potato', serving: '150g', calories: 135, protein: 3, carbs: 31, fat: 0.2 }
        ],
        dinner: [
          { id: 'sd4_1', name: 'Grilled Chicken Breast', serving: '150g', calories: 247, protein: 46, carbs: 0, fat: 5 },
          { id: 'sd4_2', name: 'Whole Grain Tortilla Wrap', serving: '1 wrap', calories: 170, protein: 5, carbs: 26, fat: 4 }
        ],
        snacks: [
          { id: 'ss4_1', name: 'Natural Peanut Butter', serving: '1 tbsp (16g)', calories: 95, protein: 4, carbs: 3.5, fat: 8 }
        ],
        exercises: [
          { id: 'se4_1', name: 'HIIT Circuit Workout', duration: 25, calories: 260 }
        ]
      },
      {
        offset: -2,
        water: 2000,
        weight: 75.0,
        breakfast: [
          { id: 'sb5_1', name: 'Eggs (Whole, Boiled/Fried)', serving: '2 eggs', calories: 144, protein: 12.6, carbs: 0.8, fat: 9.8 },
          { id: 'sb5_2', name: 'Whole Wheat Bread', serving: '2 slices', calories: 160, protein: 7, carbs: 28, fat: 2 }
        ],
        lunch: [
          { id: 'sl5_1', name: 'Grilled Chicken Breast', serving: '160g', calories: 263, protein: 49, carbs: 0, fat: 5.3 },
          { id: 'sl5_2', name: 'Jasmine White Rice (Cooked)', serving: '150g', calories: 195, protein: 4, carbs: 43, fat: 0.4 }
        ],
        dinner: [
          { id: 'sd5_1', name: 'Lean Beef Mince (95/5)', serving: '150g', calories: 205, protein: 32, carbs: 0, fat: 7.5 },
          { id: 'sd5_2', name: 'Steamed Broccoli', serving: '150g', calories: 52, protein: 4.2, carbs: 10, fat: 0.6 }
        ],
        snacks: [
          { id: 'ss5_1', name: 'Whey Protein Powder', serving: '1 scoop', calories: 120, protein: 24, carbs: 2, fat: 1.5 }
        ],
        exercises: [
          { id: 'se5_1', name: 'Brisk Walking (5 km/h)', duration: 45, calories: 180 }
        ]
      },
      {
        offset: -1,
        water: 2250,
        weight: 74.9,
        breakfast: [
          { id: 'sb6_1', name: 'Rolled Oatmeal', serving: '60g', calories: 227, protein: 8, carbs: 40, fat: 4 },
          { id: 'sb6_2', name: 'Whey Protein Powder', serving: '1 scoop', calories: 120, protein: 24, carbs: 2, fat: 1.5 }
        ],
        lunch: [
          { id: 'sl6_1', name: 'Canned Tuna in Water', serving: '1 can', calories: 132, protein: 29, carbs: 0, fat: 1 },
          { id: 'sl6_2', name: 'Quinoa (Cooked)', serving: '150g', calories: 180, protein: 6.5, carbs: 32, fat: 2.8 }
        ],
        dinner: [
          { id: 'sd6_1', name: 'Atlantic Salmon Fillet', serving: '150g', calories: 312, protein: 30, carbs: 0, fat: 20 },
          { id: 'sd6_2', name: 'Baked Sweet Potato', serving: '150g', calories: 135, protein: 3, carbs: 31, fat: 0.2 }
        ],
        snacks: [
          { id: 'ss6_1', name: 'Banana', serving: '1 medium', calories: 105, protein: 1.3, carbs: 27, fat: 0.3 }
        ],
        exercises: [
          { id: 'se6_1', name: 'Weightlifting / Strength', duration: 50, calories: 230 }
        ]
      },
      {
        offset: 0, // Today!
        water: 1750,
        weight: 74.8,
        breakfast: [
          { id: 't_b1', name: 'Rolled Oatmeal with Blueberries', serving: '60g oats + 50g berries', calories: 255, protein: 8.5, carbs: 47, fat: 4.2 },
          { id: 't_b2', name: 'Whey Protein Powder', serving: '1 scoop in water', calories: 120, protein: 24, carbs: 2, fat: 1.5 }
        ],
        lunch: [
          { id: 't_l1', name: 'Grilled Chicken Breast', serving: '160g', calories: 263, protein: 49, carbs: 0, fat: 5.3 },
          { id: 't_l2', name: 'Jasmine White Rice (Cooked)', serving: '150g (1 cup)', calories: 195, protein: 4, carbs: 43, fat: 0.4 },
          { id: 't_l3', name: 'Steamed Broccoli', serving: '150g with olive oil', calories: 110, protein: 4.2, carbs: 10, fat: 7 }
        ],
        dinner: [
          { id: 't_d1', name: 'Atlantic Salmon Fillet', serving: '150g fillet', calories: 312, protein: 30, carbs: 0, fat: 20 },
          { id: 't_d2', name: 'Baked Sweet Potato', serving: '150g', calories: 135, protein: 3, carbs: 31, fat: 0.2 }
        ],
        snacks: [
          { id: 't_s1', name: 'Greek Yogurt (Plain 0%)', serving: '150g', calories: 88, protein: 15.5, carbs: 5.4, fat: 0.3 }
        ],
        exercises: [
          { id: 't_e1', name: 'Outdoor Running (8 km/h)', duration: 30, calories: 280 }
        ]
      }
    ];

    sampleDays.forEach(day => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + day.offset);
      const key = formatDateKey(d);

      state.logs[key] = {
        meals: {
          breakfast: [...day.breakfast],
          lunch: [...day.lunch],
          dinner: [...day.dinner],
          snacks: [...day.snacks]
        },
        exercises: [...day.exercises],
        water: day.water,
        weight: day.weight
      };
    });

    saveLogs();
  }

  // ==========================================
  // 4. DOM REFERENCES
  // ==========================================

  const dom = {
    // Header & Date Nav
    prevDateBtn: document.getElementById('prevDateBtn'),
    nextDateBtn: document.getElementById('nextDateBtn'),
    todayBtn: document.getElementById('todayBtn'),
    dateLabel: document.getElementById('dateLabel'),
    datePicker: document.getElementById('datePicker'),
    openTdeeBtn: document.getElementById('openTdeeBtn'),
    openSettingsBtn: document.getElementById('openSettingsBtn'),
    openDataModalBtn: document.getElementById('openDataModalBtn'),

    // Calorie Summary
    netCalorieBadge: document.getElementById('netCalorieBadge'),
    statGoalCalories: document.getElementById('statGoalCalories'),
    statFoodCalories: document.getElementById('statFoodCalories'),
    statBurnedCalories: document.getElementById('statBurnedCalories'),
    statRemainingCalories: document.getElementById('statRemainingCalories'),
    calorieProgressBar: document.getElementById('calorieProgressBar'),
    consumedPercentText: document.getElementById('consumedPercentText'),
    netCaloriesSubtext: document.getElementById('netCaloriesSubtext'),

    // Macros
    macroTotalKcal: document.getElementById('macroTotalKcal'),
    proteinCurrent: document.getElementById('proteinCurrent'),
    proteinGoal: document.getElementById('proteinGoal'),
    proteinPercent: document.getElementById('proteinPercent'),
    proteinProgressBar: document.getElementById('proteinProgressBar'),
    carbsCurrent: document.getElementById('carbsCurrent'),
    carbsGoal: document.getElementById('carbsGoal'),
    carbsPercent: document.getElementById('carbsPercent'),
    carbsProgressBar: document.getElementById('carbsProgressBar'),
    fatCurrent: document.getElementById('fatCurrent'),
    fatGoal: document.getElementById('fatGoal'),
    fatPercent: document.getElementById('fatPercent'),
    fatProgressBar: document.getElementById('fatProgressBar'),

    // Wellness (Water & Weight)
    waterCurrentText: document.getElementById('waterCurrentText'),
    waterGoalText: document.getElementById('waterGoalText'),
    waterGlassesContainer: document.getElementById('waterGlassesContainer'),
    resetWaterBtn: document.getElementById('resetWaterBtn'),
    dailyWeightInput: document.getElementById('dailyWeightInput'),
    saveWeightBtn: document.getElementById('saveWeightBtn'),

    // Meal summaries & lists
    breakfastSummary: document.getElementById('breakfastSummary'),
    breakfastItems: document.getElementById('breakfastItems'),
    lunchSummary: document.getElementById('lunchSummary'),
    lunchItems: document.getElementById('lunchItems'),
    dinnerSummary: document.getElementById('dinnerSummary'),
    dinnerItems: document.getElementById('dinnerItems'),
    snacksSummary: document.getElementById('snacksSummary'),
    snacksItems: document.getElementById('snacksItems'),
    exerciseSummary: document.getElementById('exerciseSummary'),
    exerciseItems: document.getElementById('exerciseItems'),
    openExerciseBtn: document.getElementById('openExerciseBtn'),

    // Charts
    weeklyCanvas: document.getElementById('weeklyHistoryCanvas'),
    mealCanvas: document.getElementById('mealDistributionCanvas'),
    mealDistributionLegend: document.getElementById('mealDistributionLegend'),
    insightsContainer: document.getElementById('insightsContainer'),

    // Quick Data tools
    loadSampleDataBtn: document.getElementById('loadSampleDataBtn'),
    clearTodayBtn: document.getElementById('clearTodayBtn'),

    // Food Modal
    foodModal: document.getElementById('foodModal'),
    foodModalTitle: document.getElementById('foodModalTitle'),
    tabSearchPreset: document.getElementById('tabSearchPreset'),
    tabCustomFood: document.getElementById('tabCustomFood'),
    panelPreset: document.getElementById('panelPreset'),
    foodForm: document.getElementById('foodForm'),
    foodSearchInput: document.getElementById('foodSearchInput'),
    presetCategoryChips: document.getElementById('presetCategoryChips'),
    presetFoodGrid: document.getElementById('presetFoodGrid'),
    editFoodIndex: document.getElementById('editFoodIndex'),
    editFoodMealType: document.getElementById('editFoodMealType'),
    foodMealSelect: document.getElementById('foodMealSelect'),
    foodNameInput: document.getElementById('foodNameInput'),
    foodServingInput: document.getElementById('foodServingInput'),
    foodCaloriesInput: document.getElementById('foodCaloriesInput'),
    foodProteinInput: document.getElementById('foodProteinInput'),
    foodCarbsInput: document.getElementById('foodCarbsInput'),
    foodFatInput: document.getElementById('foodFatInput'),

    // Exercise Modal
    exerciseModal: document.getElementById('exerciseModal'),
    exercisePresetsGrid: document.getElementById('exercisePresetsGrid'),
    exerciseForm: document.getElementById('exerciseForm'),
    exerciseNameInput: document.getElementById('exerciseNameInput'),
    exerciseDurationInput: document.getElementById('exerciseDurationInput'),
    exerciseCaloriesInput: document.getElementById('exerciseCaloriesInput'),

    // TDEE Modal
    tdeeModal: document.getElementById('tdeeModal'),
    tdeeForm: document.getElementById('tdeeForm'),
    calcGender: document.getElementById('calcGender'),
    calcAge: document.getElementById('calcAge'),
    calcHeight: document.getElementById('calcHeight'),
    calcWeight: document.getElementById('calcWeight'),
    calcActivity: document.getElementById('calcActivity'),
    calcGoal: document.getElementById('calcGoal'),
    computeTdeeBtn: document.getElementById('computeTdeeBtn'),
    tdeeResultsBox: document.getElementById('tdeeResultsBox'),
    bmrResult: document.getElementById('bmrResult'),
    tdeeResult: document.getElementById('tdeeResult'),
    targetCaloriesResult: document.getElementById('targetCaloriesResult'),
    recProtein: document.getElementById('recProtein'),
    recCarbs: document.getElementById('recCarbs'),
    recFat: document.getElementById('recFat'),
    applyTdeeGoalsBtn: document.getElementById('applyTdeeGoalsBtn'),

    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    settingsForm: document.getElementById('settingsForm'),
    goalCaloriesInput: document.getElementById('goalCaloriesInput'),
    goalProteinInput: document.getElementById('goalProteinInput'),
    goalCarbsInput: document.getElementById('goalCarbsInput'),
    goalFatInput: document.getElementById('goalFatInput'),
    goalWaterInput: document.getElementById('goalWaterInput'),

    // Data Backup Modal
    dataModal: document.getElementById('dataModal'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    importJsonInput: document.getElementById('importJsonInput'),
    wipeAllDataBtn: document.getElementById('wipeAllDataBtn'),

    // Toast
    toastContainer: document.getElementById('toastContainer')
  };

  // Temp calculation cache for TDEE apply
  let calculatedRecommendations = null;

  // ==========================================
  // 5. TOAST NOTIFICATIONS
  // ==========================================

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // ==========================================
  // 6. DATE FORMATTING & NAVIGATION
  // ==========================================

  function updateDateDisplay() {
    const todayStr = getTodayString();
    dom.datePicker.value = state.selectedDate;

    if (state.selectedDate === todayStr) {
      dom.dateLabel.textContent = 'Today';
    } else {
      const parts = state.selectedDate.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      dom.dateLabel.textContent = d.toLocaleDateString(undefined, options);
    }
  }

  function shiftSelectedDate(days) {
    const parts = state.selectedDate.split('-');
    const current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    current.setDate(current.getDate() + days);
    state.selectedDate = formatDateKey(current);
    renderApp();
  }

  // ==========================================
  // 7. RENDERING ENGINE
  // ==========================================

  function renderApp() {
    updateDateDisplay();
    const currentDay = getOrCreateDayLog(state.selectedDate);

    // 1. Calculate totals for current day
    let totalFoodCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    const mealCategories = ['breakfast', 'lunch', 'dinner', 'snacks'];
    const mealTotals = {
      breakfast: { cal: 0, p: 0, c: 0, f: 0 },
      lunch: { cal: 0, p: 0, c: 0, f: 0 },
      dinner: { cal: 0, p: 0, c: 0, f: 0 },
      snacks: { cal: 0, p: 0, c: 0, f: 0 }
    };

    mealCategories.forEach(meal => {
      const items = currentDay.meals[meal] || [];
      items.forEach(item => {
        const cal = Number(item.calories) || 0;
        const p = Number(item.protein) || 0;
        const c = Number(item.carbs) || 0;
        const f = Number(item.fat) || 0;

        totalFoodCalories += cal;
        totalProtein += p;
        totalCarbs += c;
        totalFat += f;

        mealTotals[meal].cal += cal;
        mealTotals[meal].p += p;
        mealTotals[meal].c += c;
        mealTotals[meal].f += f;
      });
    });

    let totalBurned = 0;
    (currentDay.exercises || []).forEach(ex => {
      totalBurned += Number(ex.calories) || 0;
    });

    const goalCalories = Number(state.settings.dailyCalories) || 2000;
    const remainingCalories = goalCalories - totalFoodCalories + totalBurned;
    const netCalories = totalFoodCalories - totalBurned;

    // 2. Render Calorie Summary Card
    dom.statGoalCalories.textContent = formatNumber(goalCalories);
    dom.statFoodCalories.textContent = formatNumber(totalFoodCalories);
    dom.statBurnedCalories.textContent = formatNumber(totalBurned);
    dom.statRemainingCalories.textContent = formatNumber(remainingCalories);

    const consumedPct = Math.round((totalFoodCalories / goalCalories) * 100);
    dom.calorieProgressBar.style.width = `${Math.min(consumedPct, 100)}%`;

    dom.consumedPercentText.textContent = `${consumedPct}% of daily budget eaten`;
    dom.netCaloriesSubtext.textContent = `Net: ${formatNumber(netCalories)} kcal`;

    // Status badge
    if (remainingCalories >= 0) {
      dom.netCalorieBadge.className = 'badge badge-normal';
      dom.netCalorieBadge.textContent = 'On Track';
      dom.calorieProgressBar.className = 'progress-bar-fill';
      dom.statRemainingCalories.className = 'metric-val text-primary';
    } else {
      dom.netCalorieBadge.className = 'badge badge-danger';
      dom.netCalorieBadge.textContent = `Over by ${formatNumber(Math.abs(remainingCalories))} kcal`;
      dom.calorieProgressBar.className = 'progress-bar-fill bar-over';
      dom.statRemainingCalories.className = 'metric-val text-rose';
    }

    // 3. Render Macronutrients
    renderMacroRow('protein', totalProtein, state.settings.protein, dom.proteinCurrent, dom.proteinGoal, dom.proteinPercent, dom.proteinProgressBar);
    renderMacroRow('carbs', totalCarbs, state.settings.carbs, dom.carbsCurrent, dom.carbsGoal, dom.carbsPercent, dom.carbsProgressBar);
    renderMacroRow('fat', totalFat, state.settings.fat, dom.fatCurrent, dom.fatGoal, dom.fatPercent, dom.fatProgressBar);

    const macroKcalSum = Math.round(totalProtein * 4 + totalCarbs * 4 + totalFat * 9);
    dom.macroTotalKcal.textContent = `${formatNumber(macroKcalSum)} kcal from macros`;

    // 4. Render Wellness (Water & Weight)
    renderWater(currentDay.water || 0, state.settings.waterGoal || 2500);
    dom.dailyWeightInput.value = currentDay.weight !== null && currentDay.weight !== undefined ? currentDay.weight : '';

    // 5. Render Meal Blocks
    mealCategories.forEach(meal => {
      renderMealBlock(meal, currentDay.meals[meal] || [], mealTotals[meal]);
    });

    // 6. Render Exercises
    renderExerciseBlock(currentDay.exercises || [], totalBurned);

    // 7. Render Charts
    renderWeeklyCanvas();
    renderMealDistributionCanvas(mealTotals, totalFoodCalories);

    // 8. Render Insights
    renderInsights(totalFoodCalories, goalCalories, totalProtein, state.settings.protein, currentDay.water || 0, state.settings.waterGoal, totalBurned);
  }

  function renderMacroRow(name, current, goal, curEl, goalEl, pctEl, barEl) {
    const curVal = Math.round(current * 10) / 10;
    const goalVal = Math.round(goal);
    const pct = goalVal > 0 ? Math.round((curVal / goalVal) * 100) : 0;

    curEl.textContent = `${curVal}g`;
    goalEl.textContent = `${goalVal}g`;
    pctEl.textContent = `${pct}%`;
    barEl.style.width = `${Math.min(pct, 100)}%`;
  }

  function renderWater(current, goal) {
    dom.waterCurrentText.textContent = formatNumber(current);
    dom.waterGoalText.textContent = formatNumber(goal);

    // Draw 8-10 glass representations (each 250ml)
    const glassSize = 250;
    const totalGlasses = Math.max(8, Math.ceil(goal / glassSize));
    const filledGlasses = Math.floor(current / glassSize);

    dom.waterGlassesContainer.innerHTML = '';
    for (let i = 0; i < totalGlasses; i++) {
      const glass = document.createElement('div');
      glass.className = `glass-item ${i < filledGlasses ? 'filled' : ''}`;
      glass.title = `${(i + 1) * glassSize} ml`;
      glass.innerHTML = '💧';
      glass.addEventListener('click', () => {
        const newWater = (i + 1) * glassSize;
        setWater(newWater);
      });
      dom.waterGlassesContainer.appendChild(glass);
    }
  }

  function setWater(amount) {
    const day = getOrCreateDayLog(state.selectedDate);
    day.water = Math.max(0, amount);
    saveLogs();
    renderApp();
  }

  function adjustWater(delta) {
    const day = getOrCreateDayLog(state.selectedDate);
    const current = Number(day.water) || 0;
    day.water = Math.max(0, current + delta);
    saveLogs();
    renderApp();
    showToast(`${delta > 0 ? '+' : ''}${delta} ml water logged`, 'info');
  }

  // ==========================================
  // 8. MEAL & EXERCISE LIST RENDERING
  // ==========================================

  function renderMealBlock(mealType, items, totals) {
    const container = document.getElementById(`${mealType}Items`);
    const summary = document.getElementById(`${mealType}Summary`);

    summary.textContent = `${formatNumber(totals.cal)} kcal · ${Math.round(totals.c)}g C · ${Math.round(totals.p)}g P · ${Math.round(totals.f)}g F`;

    if (!items || items.length === 0) {
      container.innerHTML = `<div class="empty-meal-state">No foods logged for ${mealType} yet.</div>`;
      return;
    }

    container.innerHTML = '';
    items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'food-item-row';
      row.innerHTML = `
        <div class="food-item-details">
          <div class="food-name">${escapeHtml(item.name)}</div>
          <div class="food-meta">
            <span>${escapeHtml(item.serving || '1 serving')}</span>
            <span>•</span>
            <span class="macro-tag carb-tag">C: ${item.carbs || 0}g</span>
            <span class="macro-tag pro-tag">P: ${item.protein || 0}g</span>
            <span class="macro-tag fat-tag">F: ${item.fat || 0}g</span>
          </div>
        </div>
        <div class="food-item-right">
          <span class="food-calories-badge">${formatNumber(item.calories)} kcal</span>
          <button class="food-action-btn edit-btn" title="Edit Item" data-meal="${mealType}" data-index="${index}">✏️</button>
          <button class="food-action-btn delete-btn" title="Delete Item" data-meal="${mealType}" data-index="${index}">🗑️</button>
        </div>
      `;

      // Event listeners for edit & delete
      row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteFoodItem(mealType, index);
      });

      row.querySelector('.edit-btn').addEventListener('click', () => {
        openEditFoodModal(mealType, index);
      });

      container.appendChild(row);
    });
  }

  function renderExerciseBlock(exercises, totalBurned) {
    dom.exerciseSummary.textContent = `${formatNumber(totalBurned)} kcal burned`;

    if (!exercises || exercises.length === 0) {
      dom.exerciseItems.innerHTML = '<div class="empty-meal-state">No exercises logged for today.</div>';
      return;
    }

    dom.exerciseItems.innerHTML = '';
    exercises.forEach((ex, index) => {
      const row = document.createElement('div');
      row.className = 'food-item-row';
      row.innerHTML = `
        <div class="food-item-details">
          <div class="food-name">${escapeHtml(ex.name)}</div>
          <div class="food-meta">
            <span>⏱️ ${ex.duration || 0} minutes</span>
          </div>
        </div>
        <div class="food-item-right">
          <span class="food-calories-badge text-emerald">-${formatNumber(ex.calories)} kcal</span>
          <button class="food-action-btn delete-btn" title="Delete Exercise" data-index="${index}">🗑️</button>
        </div>
      `;

      row.querySelector('.delete-btn').addEventListener('click', () => {
        deleteExercise(index);
      });

      dom.exerciseItems.appendChild(row);
    });
  }

  function deleteFoodItem(mealType, index) {
    const day = getOrCreateDayLog(state.selectedDate);
    if (day.meals[mealType] && day.meals[mealType][index]) {
      const removed = day.meals[mealType].splice(index, 1);
      saveLogs();
      renderApp();
      showToast(`Removed "${removed[0]?.name || 'Item'}"`, 'info');
    }
  }

  function deleteExercise(index) {
    const day = getOrCreateDayLog(state.selectedDate);
    if (day.exercises && day.exercises[index]) {
      const removed = day.exercises.splice(index, 1);
      saveLogs();
      renderApp();
      showToast(`Removed "${removed[0]?.name || 'Exercise'}"`, 'info');
    }
  }

  // ==========================================
  // 9. CANVAS CHART 1: 7-DAY INTAKE TREND
  // ==========================================

  function renderWeeklyCanvas() {
    const canvas = dom.weeklyCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle Retina / HiDPI crispness
    const dpr = window.devicePixelRatio || 1;
    const width = 360;
    const height = 220;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Compute last 7 days ending at state.selectedDate
    const parts = state.selectedDate.split('-');
    const endDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));

    const daysData = [];
    const goal = Number(state.settings.dailyCalories) || 2000;
    let maxCal = goal * 1.25;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(endDate);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const dayLog = state.logs[key];

      let foodCal = 0;
      if (dayLog && dayLog.meals) {
        ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(m => {
          (dayLog.meals[m] || []).forEach(it => {
            foodCal += Number(it.calories) || 0;
          });
        });
      }

      if (foodCal > maxCal) maxCal = foodCal * 1.15;

      const dayName = d.toLocaleDateString(undefined, { weekday: 'narrow' });
      const dateNum = d.getDate();
      const isSelected = (key === state.selectedDate);

      daysData.push({
        key,
        label: `${dayName} ${dateNum}`,
        calories: foodCal,
        isSelected
      });
    }

    // Chart dimensions
    const padTop = 30;
    const padBottom = 35;
    const padLeft = 20;
    const padRight = 20;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Draw Calorie Target Goal Line
    const goalY = padTop + chartH - (goal / maxCal) * chartH;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.moveTo(padLeft, goalY);
    ctx.lineTo(width - padRight, goalY);
    ctx.stroke();

    // Goal text label
    ctx.fillStyle = '#f87171';
    ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Target: ${formatNumber(goal)}`, width - padRight, goalY - 4);
    ctx.restore();

    // Draw Bars
    const barCount = daysData.length;
    const barWidth = 26;
    const step = chartW / barCount;

    daysData.forEach((item, idx) => {
      const x = padLeft + idx * step + (step - barWidth) / 2;
      const barH = (item.calories / maxCal) * chartH;
      const y = padTop + chartH - barH;

      // Color selection
      let barFill = '#38bdf8'; // Blue
      if (item.calories > goal) {
        barFill = '#f87171'; // Red/Over
      } else if (item.calories === 0) {
        barFill = '#1e293b'; // Empty
      }

      if (item.isSelected) {
        // Highlight active day
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 2, y - 2, barWidth + 4, barH + 4);
      }

      // Rounded Bar top
      ctx.fillStyle = barFill;
      drawRoundedRect(ctx, x, y, barWidth, Math.max(barH, 3), 4);
      ctx.fill();

      // Top label (Calories)
      if (item.calories > 0) {
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(formatNumber(item.calories), x + barWidth / 2, y - 5);
      }

      // Bottom label (Day name)
      ctx.fillStyle = item.isSelected ? '#38bdf8' : '#94a3b8';
      ctx.font = item.isSelected ? 'bold 11px -apple-system, sans-serif' : '10px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barWidth / 2, height - 12);
    });
  }

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // ==========================================
  // 10. CANVAS CHART 2: CALORIES BY MEAL (DONUT)
  // ==========================================

  function renderMealDistributionCanvas(mealTotals, totalFoodCalories) {
    const canvas = dom.mealCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const width = 360;
    const height = 180;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadius = 70;
    const innerRadius = 45;

    // Legend container
    dom.mealDistributionLegend.innerHTML = '';

    const meals = [
      { key: 'breakfast', name: 'Breakfast', cal: mealTotals.breakfast.cal, color: MEAL_COLORS.breakfast },
      { key: 'lunch', name: 'Lunch', cal: mealTotals.lunch.cal, color: MEAL_COLORS.lunch },
      { key: 'dinner', name: 'Dinner', cal: mealTotals.dinner.cal, color: MEAL_COLORS.dinner },
      { key: 'snacks', name: 'Snacks', cal: mealTotals.snacks.cal, color: MEAL_COLORS.snacks }
    ];

    // Build Legend
    meals.forEach(m => {
      const pct = totalFoodCalories > 0 ? Math.round((m.cal / totalFoodCalories) * 100) : 0;
      const item = document.createElement('span');
      item.className = 'meal-legend-badge';
      item.innerHTML = `<span style="width:10px;height:10px;border-radius:50%;background-color:${m.color};display:inline-block;"></span> ${m.name}: ${pct}%`;
      dom.mealDistributionLegend.appendChild(item);
    });

    if (totalFoodCalories === 0) {
      // Empty grey ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, innerRadius, 2 * Math.PI, 0, true);
      ctx.fillStyle = '#1e293b';
      ctx.fill();

      ctx.fillStyle = '#64748b';
      ctx.font = '12px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No Meals Logged', centerX, centerY);
      return;
    }

    // Draw arcs
    let startAngle = -0.5 * Math.PI;

    meals.forEach(m => {
      if (m.cal <= 0) return;
      const sliceAngle = (m.cal / totalFoodCalories) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = m.color;
      ctx.fill();

      // Border between slices
      ctx.strokeStyle = '#161f30';
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle = endAngle;
    });

    // Donut center text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${formatNumber(totalFoodCalories)}`, centerX, centerY - 6);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px -apple-system, sans-serif';
    ctx.fillText('kcal eaten', centerX, centerY + 12);
  }

  // ==========================================
  // 11. DYNAMIC NUTRITION COACH INSIGHTS
  // ==========================================

  function renderInsights(foodCal, goalCal, currentPro, goalPro, water, waterGoal, burned) {
    const list = dom.insightsContainer;
    list.innerHTML = '';

    const insights = [];

    // 1. Calorie Deficit / Surplus
    const remaining = goalCal - foodCal + burned;
    if (foodCal === 0) {
      insights.push({
        type: 'info',
        icon: '🥑',
        text: 'Begin your day by logging your breakfast or a glass of water.'
      });
    } else if (remaining >= 0 && remaining <= 250) {
      insights.push({
        type: 'positive',
        icon: '🎯',
        text: `Spot on! You have ${formatNumber(remaining)} kcal remaining, ideal for hitting your daily target.`
      });
    } else if (remaining > 250) {
      insights.push({
        type: 'info',
        icon: '🥗',
        text: `You have ${formatNumber(remaining)} kcal remaining in your daily budget.`
      });
    } else {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        text: `You have exceeded your daily calorie target by ${formatNumber(Math.abs(remaining))} kcal.`
      });
    }

    // 2. Protein Check
    const proDiff = goalPro - currentPro;
    if (currentPro >= goalPro) {
      insights.push({
        type: 'positive',
        icon: '💪',
        text: `Protein goal reached! You've logged ${Math.round(currentPro)}g (${Math.round((currentPro / goalPro) * 100)}% of goal).`
      });
    } else if (proDiff > 0) {
      insights.push({
        type: 'info',
        icon: '🍗',
        text: `You are ${Math.round(proDiff)}g short of your daily protein target. Consider chicken, eggs, or Greek yogurt.`
      });
    }

    // 3. Hydration Check
    if (water >= waterGoal) {
      insights.push({
        type: 'positive',
        icon: '💧',
        text: `Optimal hydration! You reached your ${formatNumber(waterGoal)} ml goal today.`
      });
    } else {
      const waterLeft = waterGoal - water;
      insights.push({
        type: 'info',
        icon: '💧',
        text: `${formatNumber(waterLeft)} ml remaining to reach your hydration goal.`
      });
    }

    // 4. Exercise Insight
    if (burned > 0) {
      insights.push({
        type: 'positive',
        icon: '🔥',
        text: `Active day! Burned ${formatNumber(burned)} kcal from exercise, expanding your daily energy budget.`
      });
    }

    insights.forEach(item => {
      const el = document.createElement('div');
      el.className = `insight-item ${item.type}`;
      el.innerHTML = `<span class="insight-icon">${item.icon}</span> <span>${item.text}</span>`;
      list.appendChild(el);
    });
  }

  // ==========================================
  // 12. PRESET FOOD LIBRARY SEARCH & CHIPS
  // ==========================================

  function renderPresetFoodGrid(searchTerm = '', category = 'all') {
    dom.presetFoodGrid.innerHTML = '';
    const term = searchTerm.trim().toLowerCase();

    const filtered = COMMON_FOODS.filter(food => {
      const matchesCategory = (category === 'all' || food.category === category);
      const matchesSearch = (!term || food.name.toLowerCase().includes(term));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      dom.presetFoodGrid.innerHTML = '<div class="empty-meal-state" style="grid-column: 1 / -1;">No matching foods found in library. Switch to "Custom Entry" tab to add any food.</div>';
      return;
    }

    filtered.forEach(food => {
      const card = document.createElement('div');
      card.className = 'preset-food-card';
      card.innerHTML = `
        <div class="preset-card-top">
          <div>
            <div class="preset-card-title">${escapeHtml(food.name)}</div>
            <div class="preset-card-serving">${escapeHtml(food.serving)}</div>
          </div>
          <div class="preset-card-cal">${formatNumber(food.calories)} kcal</div>
        </div>
        <div class="preset-card-macros">
          <span class="macro-tag carb-tag">C: ${food.carbs}g</span>
          <span class="macro-tag pro-tag">P: ${food.protein}g</span>
          <span class="macro-tag fat-tag">F: ${food.fat}g</span>
        </div>
        <button class="preset-add-btn">+ Quick Log</button>
      `;

      card.querySelector('.preset-add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        quickLogPreset(food);
      });

      card.addEventListener('click', () => {
        // Pre-fill custom form for adjustments
        fillCustomFoodForm(food);
        switchFoodModalTab('custom');
      });

      dom.presetFoodGrid.appendChild(card);
    });
  }

  function quickLogPreset(food) {
    const meal = dom.foodMealSelect.value || 'breakfast';
    const day = getOrCreateDayLog(state.selectedDate);

    const newItem = {
      id: generateId(),
      name: food.name,
      serving: food.serving,
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0
    };

    day.meals[meal].push(newItem);
    saveLogs();
    renderApp();
    closeAllModals();
    showToast(`Added "${food.name}" to ${capitalize(meal)}`, 'success');
  }

  function fillCustomFoodForm(food) {
    dom.foodNameInput.value = food.name;
    dom.foodServingInput.value = food.serving;
    dom.foodCaloriesInput.value = food.calories;
    dom.foodProteinInput.value = food.protein;
    dom.foodCarbsInput.value = food.carbs;
    dom.foodFatInput.value = food.fat;
  }

  // ==========================================
  // 13. PRESET EXERCISES
  // ==========================================

  function renderExercisePresets() {
    dom.exercisePresetsGrid.innerHTML = '';
    COMMON_EXERCISES.forEach(ex => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'exercise-preset-chip';
      chip.textContent = ex.name;
      chip.addEventListener('click', () => {
        dom.exerciseNameInput.value = ex.name;
        dom.exerciseDurationInput.value = ex.duration;
        dom.exerciseCaloriesInput.value = ex.calories;
      });
      dom.exercisePresetsGrid.appendChild(chip);
    });
  }

  // ==========================================
  // 14. MODAL INTERACTIONS & TAB SWITCHING
  // ==========================================

  function openAddFoodModal(mealType = 'breakfast') {
    dom.foodModalTitle.textContent = `Add Food to ${capitalize(mealType)}`;
    dom.foodMealSelect.value = mealType;
    dom.editFoodIndex.value = '-1';
    dom.editFoodMealType.value = mealType;

    // Reset inputs
    dom.foodNameInput.value = '';
    dom.foodServingInput.value = '1 serving';
    dom.foodCaloriesInput.value = '';
    dom.foodProteinInput.value = '0';
    dom.foodCarbsInput.value = '0';
    dom.foodFatInput.value = '0';
    dom.foodSearchInput.value = '';

    switchFoodModalTab('preset');
    renderPresetFoodGrid('', state.activeFilterCategory);
    openModal(dom.foodModal);
  }

  function openEditFoodModal(mealType, index) {
    const day = getOrCreateDayLog(state.selectedDate);
    const item = day.meals[mealType][index];
    if (!item) return;

    dom.foodModalTitle.textContent = `Edit Food in ${capitalize(mealType)}`;
    dom.foodMealSelect.value = mealType;
    dom.editFoodIndex.value = String(index);
    dom.editFoodMealType.value = mealType;

    dom.foodNameInput.value = item.name || '';
    dom.foodServingInput.value = item.serving || '1 serving';
    dom.foodCaloriesInput.value = item.calories || 0;
    dom.foodProteinInput.value = item.protein || 0;
    dom.foodCarbsInput.value = item.carbs || 0;
    dom.foodFatInput.value = item.fat || 0;

    switchFoodModalTab('custom');
    openModal(dom.foodModal);
  }

  function switchFoodModalTab(target) {
    if (target === 'preset') {
      dom.tabSearchPreset.classList.add('active');
      dom.tabCustomFood.classList.remove('active');
      dom.panelPreset.classList.add('active');
      dom.foodForm.classList.remove('active');
    } else {
      dom.tabSearchPreset.classList.remove('active');
      dom.tabCustomFood.classList.add('active');
      dom.panelPreset.classList.remove('active');
      dom.foodForm.classList.add('active');
    }
  }

  function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.add('hidden');
    });
    document.body.style.overflow = '';
  }

  // ==========================================
  // 15. TDEE & BMR CALCULATOR LOGIC
  // ==========================================

  function calculateTDEE() {
    const gender = dom.calcGender.value;
    const age = parseFloat(dom.calcAge.value) || 28;
    const height = parseFloat(dom.calcHeight.value) || 175;
    const weight = parseFloat(dom.calcWeight.value) || 75;
    const activityMult = parseFloat(dom.calcActivity.value) || 1.375;
    const goalDelta = parseFloat(dom.calcGoal.value) || 0;

    // Mifflin-St Jeor Formula
    let bmr = 0;
    if (gender === 'male') {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    const tdee = bmr * activityMult;
    const targetCalories = Math.max(1200, Math.round(tdee + goalDelta));

    // Balanced Macro Split Recommendations:
    // Protein: 2.0g per kg of body weight
    const recProteinGrams = Math.round(weight * 2.0);
    const proteinCalories = recProteinGrams * 4;

    // Fat: 25% of total target calories
    const fatCalories = targetCalories * 0.25;
    const recFatGrams = Math.round(fatCalories / 9);

    // Carbs: Remaining calories
    const carbsCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const recCarbsGrams = Math.round(carbsCalories / 4);

    calculatedRecommendations = {
      dailyCalories: targetCalories,
      protein: recProteinGrams,
      carbs: recCarbsGrams,
      fat: recFatGrams,
      waterGoal: Math.round(weight * 35) // standard 35ml per kg
    };

    dom.bmrResult.textContent = formatNumber(Math.round(bmr));
    dom.tdeeResult.textContent = formatNumber(Math.round(tdee));
    dom.targetCaloriesResult.textContent = formatNumber(targetCalories);

    dom.recProtein.textContent = `${recProteinGrams}g`;
    dom.recCarbs.textContent = `${recCarbsGrams}g`;
    dom.recFat.textContent = `${recFatGrams}g`;

    dom.tdeeResultsBox.classList.remove('hidden');
  }

  // ==========================================
  // 16. DATA IMPORT & EXPORT
  // ==========================================

  function exportDataAsJSON() {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: state.settings,
      logs: state.logs
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutritrack-backup-${state.selectedDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Backup JSON exported successfully', 'success');
  }

  function handleImportJSON(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (parsed && parsed.settings && parsed.logs) {
          state.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
          state.logs = parsed.logs;
          saveSettings(state.settings);
          saveLogs();
          renderApp();
          closeAllModals();
          showToast('Data restored successfully!', 'success');
        } else {
          showToast('Invalid backup file format', 'error');
        }
      } catch (err) {
        console.error('Import parse error:', err);
        showToast('Error parsing JSON backup file', 'error');
      }
    };
    reader.readAsText(file);
  }

  // ==========================================
  // 17. EVENT LISTENERS SETUP
  // ==========================================

  function attachEventListeners() {
    // Date Navigation
    dom.prevDateBtn.addEventListener('click', () => shiftSelectedDate(-1));
    dom.nextDateBtn.addEventListener('click', () => shiftSelectedDate(1));
    dom.todayBtn.addEventListener('click', () => {
      state.selectedDate = getTodayString();
      renderApp();
    });

    dom.datePicker.addEventListener('change', (e) => {
      if (e.target.value) {
        state.selectedDate = e.target.value;
        renderApp();
      }
    });

    // Add Food buttons on Meal Blocks
    document.querySelectorAll('.add-food-btn[data-meal]').forEach(btn => {
      btn.addEventListener('click', () => {
        openAddFoodModal(btn.dataset.meal);
      });
    });

    // Food Modal Tabs
    dom.tabSearchPreset.addEventListener('click', () => switchFoodModalTab('preset'));
    dom.tabCustomFood.addEventListener('click', () => switchFoodModalTab('custom'));

    // Food Search & Filter Chips
    dom.foodSearchInput.addEventListener('input', (e) => {
      renderPresetFoodGrid(e.target.value, state.activeFilterCategory);
    });

    dom.presetCategoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      dom.presetCategoryChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.activeFilterCategory = chip.dataset.category;
      renderPresetFoodGrid(dom.foodSearchInput.value, state.activeFilterCategory);
    });

    // Custom Food Form Submit
    dom.foodForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const meal = dom.foodMealSelect.value;
      const index = parseInt(dom.editFoodIndex.value, 10);
      const originalMeal = dom.editFoodMealType.value;

      const item = {
        id: generateId(),
        name: dom.foodNameInput.value.trim(),
        serving: dom.foodServingInput.value.trim() || '1 serving',
        calories: Math.max(0, parseFloat(dom.foodCaloriesInput.value) || 0),
        protein: Math.max(0, parseFloat(dom.foodProteinInput.value) || 0),
        carbs: Math.max(0, parseFloat(dom.foodCarbsInput.value) || 0),
        fat: Math.max(0, parseFloat(dom.foodFatInput.value) || 0)
      };

      const day = getOrCreateDayLog(state.selectedDate);

      if (index >= 0) {
        // Editing existing item
        if (originalMeal === meal) {
          day.meals[meal][index] = item;
        } else {
          day.meals[originalMeal].splice(index, 1);
          day.meals[meal].push(item);
        }
        showToast(`Updated "${item.name}"`, 'success');
      } else {
        // Adding new item
        day.meals[meal].push(item);
        showToast(`Added "${item.name}" to ${capitalize(meal)}`, 'success');
      }

      saveLogs();
      renderApp();
      closeAllModals();
    });

    // Exercise Button & Form
    dom.openExerciseBtn.addEventListener('click', () => {
      dom.exerciseNameInput.value = '';
      dom.exerciseDurationInput.value = '30';
      dom.exerciseCaloriesInput.value = '250';
      renderExercisePresets();
      openModal(dom.exerciseModal);
    });

    dom.exerciseForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ex = {
        id: generateId(),
        name: dom.exerciseNameInput.value.trim(),
        duration: Math.max(1, parseInt(dom.exerciseDurationInput.value, 10) || 30),
        calories: Math.max(1, parseInt(dom.exerciseCaloriesInput.value, 10) || 100)
      };

      const day = getOrCreateDayLog(state.selectedDate);
      day.exercises.push(ex);
      saveLogs();
      renderApp();
      closeAllModals();
      showToast(`Logged workout: ${ex.name} (-${ex.calories} kcal)`, 'success');
    });

    // Water Action Buttons
    document.querySelectorAll('.water-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = parseInt(btn.dataset.amount, 10) || 250;
        adjustWater(amt);
      });
    });

    document.querySelectorAll('.water-sub-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amt = parseInt(btn.dataset.amount, 10) || 250;
        adjustWater(-amt);
      });
    });

    dom.resetWaterBtn.addEventListener('click', () => {
      setWater(0);
      showToast('Water reset to 0 ml', 'info');
    });

    // Weight Save
    dom.saveWeightBtn.addEventListener('click', () => {
      const val = parseFloat(dom.dailyWeightInput.value);
      const day = getOrCreateDayLog(state.selectedDate);
      if (!isNaN(val) && val > 0) {
        day.weight = val;
        saveLogs();
        renderApp();
        showToast(`Weight saved: ${val} kg`, 'success');
      } else {
        day.weight = null;
        saveLogs();
        renderApp();
        showToast('Weight cleared', 'info');
      }
    });

    // TDEE Calculator Modal
    dom.openTdeeBtn.addEventListener('click', () => {
      // Pre-fill weight from today's log if available
      const day = getOrCreateDayLog(state.selectedDate);
      if (day.weight) {
        dom.calcWeight.value = day.weight;
      }
      openModal(dom.tdeeModal);
    });

    dom.computeTdeeBtn.addEventListener('click', calculateTDEE);

    dom.applyTdeeGoalsBtn.addEventListener('click', () => {
      if (calculatedRecommendations) {
        saveSettings({
          ...state.settings,
          ...calculatedRecommendations
        });
        renderApp();
        closeAllModals();
        showToast('New calorie and macro targets applied!', 'success');
      }
    });

    // Settings Modal
    dom.openSettingsBtn.addEventListener('click', () => {
      dom.goalCaloriesInput.value = state.settings.dailyCalories;
      dom.goalProteinInput.value = state.settings.protein;
      dom.goalCarbsInput.value = state.settings.carbs;
      dom.goalFatInput.value = state.settings.fat;
      dom.goalWaterInput.value = state.settings.waterGoal;
      openModal(dom.settingsModal);
    });

    dom.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSettings({
        dailyCalories: Math.max(500, parseInt(dom.goalCaloriesInput.value, 10) || 2000),
        protein: Math.max(0, parseInt(dom.goalProteinInput.value, 10) || 140),
        carbs: Math.max(0, parseInt(dom.goalCarbsInput.value, 10) || 220),
        fat: Math.max(0, parseInt(dom.goalFatInput.value, 10) || 60),
        waterGoal: Math.max(500, parseInt(dom.goalWaterInput.value, 10) || 2500)
      });
      renderApp();
      closeAllModals();
      showToast('Daily nutrition goals updated!', 'success');
    });

    // Backup & Restore Modal
    dom.openDataModalBtn.addEventListener('click', () => openModal(dom.dataModal));
    dom.exportJsonBtn.addEventListener('click', exportDataAsJSON);

    dom.importJsonInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleImportJSON(e.target.files[0]);
      }
    });

    dom.wipeAllDataBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all data? This will clear all tracked meals and goals.')) {
        localStorage.clear();
        state.settings = { ...DEFAULT_SETTINGS };
        state.logs = {};
        renderApp();
        closeAllModals();
        showToast('Factory reset complete. All data cleared.', 'info');
      }
    });

    // Quick Data Tools on Sidebar
    dom.loadSampleDataBtn.addEventListener('click', () => {
      seedDemoWeek();
      renderApp();
      showToast('Demo 7-day data loaded!', 'success');
    });

    dom.clearTodayBtn.addEventListener('click', () => {
      if (confirm(`Clear all meal and workout entries for ${state.selectedDate}?`)) {
        delete state.logs[state.selectedDate];
        saveLogs();
        renderApp();
        showToast('Today\'s entries cleared.', 'info');
      }
    });

    // Generic Modal Close Buttons & Backdrop Clicks
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', closeAllModals);
    });

    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          closeAllModals();
        }
      });
    });

    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    });

    // Resize event to re-render charts accurately on screen resize
    window.addEventListener('resize', () => {
      renderWeeklyCanvas();
      const day = getOrCreateDayLog(state.selectedDate);
      let totalCal = 0;
      const mealTotals = {
        breakfast: { cal: 0 }, lunch: { cal: 0 }, dinner: { cal: 0 }, snacks: { cal: 0 }
      };
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(m => {
        (day.meals[m] || []).forEach(it => {
          const c = Number(it.calories) || 0;
          totalCal += c;
          mealTotals[m].cal += c;
        });
      });
      renderMealDistributionCanvas(mealTotals, totalCal);
    });
  }

  // ==========================================
  // 18. UTILITY HELPERS
  // ==========================================

  function formatNumber(num) {
    if (isNaN(num)) return '0';
    return Number(num).toLocaleString();
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateId() {
    return 'id_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  // ==========================================
  // 19. INITIALIZATION
  // ==========================================

  function init() {
    checkAndSeedSampleData();
    attachEventListeners();
    renderApp();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

