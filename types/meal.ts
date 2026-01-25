export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodSource = 'openFoodFacts' | 'manual' | 'ai';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  emoji: string;
  barcode?: string;
  imageUrl?: string;
  nutritionPer100g: NutritionInfo;
  defaultPortionSize: number;
  category?: string;
  source: FoodSource;
}

export interface Meal {
  id: string;
  userId: string;
  foodItem: FoodItem;
  portionSize: number;
  nutrition: NutritionInfo;
  mealType: MealType;
  date: Date;
  time: string;
  createdAt: Date;
  updatedAt: Date;
  emoji: string;
  name: string;
  calories: number;
}

export interface FoodSearchResult {
  products: FoodItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface AIAnalysisResult {
  foods: FoodItem[];
  confidence: number;
  rawResponse?: string;
}

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: 'Petit-déjeuner',
  lunch: 'Déjeuner',
  snack: 'Collation',
  dinner: 'Dîner',
};

export const MEAL_TYPE_EMOJIS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  snack: '🍎',
  dinner: '🌙',
};
