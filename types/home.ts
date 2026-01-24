export interface DailyCalories {
  day: string;
  value: number;
  isToday?: boolean;
}

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface CalorieData {
  consumed: number;
  goal: number;
  percentage: number;
}

export interface MacroData {
  value: number;
  goal: number;
}

export interface MacrosData {
  protein: MacroData;
  carbs: MacroData;
  fat: MacroData;
}

export type Period = 'day' | 'week' | 'month';
