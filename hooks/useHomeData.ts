import { useState, useCallback, useMemo } from 'react';
import { CalorieData, DailyCalories, MacrosData, Period } from '@/types/home';
import { Meal } from '@/types/meal';
import { HydrationEntry, DrinkOption, DrinkType } from '@/types/hydration';
import { DEFAULT_USER_GOALS } from '@/types/user';
import { useDailyMeals } from './useDailyMeals';
import { useDailyStats } from './useDailyStats';
import { useHydration } from './useHydration';
import { useWeeklyStats } from './useWeeklyStats';
import { useUserProfile } from './useUserProfile';

export interface HomeData {
  calorieData: CalorieData;
  macrosData: MacrosData;
  weeklyData: DailyCalories[];
  meals: Meal[];
  waterGlasses: number;
  waterGoal: number;
  selectedDate: Date;
  period: Period;
  isLoading: boolean;
  // Hydration data
  hydrationMl: number;
  hydrationGoalMl: number;
  hydrationPercentage: number;
  hydrationEntries: HydrationEntry[];
  drinkOptions: DrinkOption[];
  // Actions
  addWaterGlass: () => void;
  removeWaterGlass: () => void;
  addDrink: (drinkOptionId: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  setPeriod: (period: Period) => void;
}

const useHomeData = (): HomeData => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [period, setPeriod] = useState<Period>('day');

  // Hooks réels avec données Firestore
  const { profile } = useUserProfile();
  const { meals, isLoading: mealsLoading } = useDailyMeals(selectedDate);
  const { stats, isLoading: statsLoading } = useDailyStats(selectedDate);
  const {
    totalMl,
    goalMl,
    percentage: hydrationPercentage,
    entries: hydrationEntries,
    addDrink,
    addCustomDrink,
    drinkOptions,
    isLoading: hydrationLoading,
  } = useHydration(selectedDate);
  const { stats: weeklyStats, isLoading: weeklyLoading } = useWeeklyStats();

  const goals = profile?.goals || DEFAULT_USER_GOALS;
  const isLoading =
    mealsLoading || statsLoading || hydrationLoading || weeklyLoading;

  // Compatibilité avec l'ancien système de verres d'eau
  const waterGlasses = Math.round(totalMl / 250); // 250ml = 1 verre
  const waterGoal = Math.round(goalMl / 250);

  const addWaterGlass = useCallback(async () => {
    // Ajouter un verre d'eau (250ml)
    await addCustomDrink('water' as DrinkType, 250, "Verre d'eau");
  }, [addCustomDrink]);

  const removeWaterGlass = useCallback(() => {
    // Pour la compatibilité, on ne fait rien (la suppression se fait via l'écran hydratation)
  }, []);

  // Données calories depuis les stats calculées
  const calorieData: CalorieData = useMemo(() => {
    if (stats) {
      return {
        consumed: stats.calories.consumed,
        goal: stats.calories.goal,
        percentage: stats.calories.percentage,
      };
    }
    return {
      consumed: 0,
      goal: goals.calories,
      percentage: 0,
    };
  }, [stats, goals.calories]);

  // Données macros depuis les stats calculées
  const macrosData: MacrosData = useMemo(() => {
    if (stats) {
      return {
        protein: stats.macros.protein,
        carbs: stats.macros.carbs,
        fat: stats.macros.fat,
      };
    }
    return {
      protein: { value: 0, goal: goals.protein },
      carbs: { value: 0, goal: goals.carbs },
      fat: { value: 0, goal: goals.fat },
    };
  }, [stats, goals]);

  // Données hebdomadaires pour le graphique
  const weeklyData: DailyCalories[] = useMemo(() => {
    if (weeklyStats?.days) {
      return weeklyStats.days.map((day) => ({
        day: day.dayName,
        value: day.calories,
        isToday: day.isToday,
      }));
    }
    // Données vides par défaut
    return ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => ({
      day,
      value: 0,
      isToday: index === 6,
    }));
  }, [weeklyStats]);

  return {
    calorieData,
    macrosData,
    weeklyData,
    meals,
    waterGlasses,
    waterGoal,
    selectedDate,
    period,
    isLoading,
    // Hydration data
    hydrationMl: totalMl,
    hydrationGoalMl: goalMl,
    hydrationPercentage,
    hydrationEntries,
    drinkOptions,
    // Actions
    addWaterGlass,
    removeWaterGlass,
    addDrink,
    setSelectedDate,
    setPeriod,
  };
};

export default useHomeData;
