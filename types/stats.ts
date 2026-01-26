export interface DailyStats {
  date: string;
  calories: {
    consumed: number;
    goal: number;
    percentage: number;
  };
  macros: {
    protein: { value: number; goal: number };
    carbs: { value: number; goal: number };
    fat: { value: number; goal: number };
  };
  water: {
    consumed: number; // ml
    goal: number; // ml
    percentage: number;
  };
  mealsCount: number;
}

export interface WeeklyStats {
  days: {
    date: string;
    dayName: string;
    calories: number;
    isToday: boolean;
  }[];
  averageCalories: number;
  totalMeals: number;
}
