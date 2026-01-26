import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Meal, MealType } from '@/types/meal';
import { subscribeToMeals } from '@/services/mealService';

interface MealsByType {
  breakfast: Meal[];
  lunch: Meal[];
  snack: Meal[];
  dinner: Meal[];
}

interface UseDailyMealsReturn {
  meals: Meal[];
  mealsByType: MealsByType;
  isLoading: boolean;
  error: string | null;
}

export const useDailyMeals = (date?: Date): UseDailyMealsReturn => {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date();

  useEffect(() => {
    if (!user) {
      setMeals([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Souscrire aux changements en temps réel
    const unsubscribe = subscribeToMeals(targetDate, (newMeals) => {
      setMeals(newMeals);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, targetDate.toDateString()]);

  // Grouper par type de repas
  const mealsByType: MealsByType = {
    breakfast: meals.filter((m) => m.mealType === 'breakfast'),
    lunch: meals.filter((m) => m.mealType === 'lunch'),
    snack: meals.filter((m) => m.mealType === 'snack'),
    dinner: meals.filter((m) => m.mealType === 'dinner'),
  };

  return { meals, mealsByType, isLoading, error };
};

export default useDailyMeals;
