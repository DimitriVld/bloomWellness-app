export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  emoji: string;
  name: string;
  calories: number;
  time: string;
  mealType: MealType;
}
