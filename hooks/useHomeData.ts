import { useState, useCallback } from 'react';
import { CalorieData, DailyCalories, MacrosData, Period } from '@/types/home';
import { Meal } from '@/types/meal';

// Mock data
const mockCalorieData = {
  consumed: 1847,
  goal: 2200,
};

const calculatePercentage = (consumed: number, goal: number): number => {
  if (goal <= 0) return 0;
  return Math.round((consumed / goal) * 100);
};

const mockMacrosData: MacrosData = {
  protein: { value: 95, goal: 130 },
  carbs: { value: 180, goal: 280 },
  fat: { value: 65, goal: 75 },
};

const mockWeeklyData: DailyCalories[] = [
  { day: 'L', value: 1650, isToday: false },
  { day: 'M', value: 1890, isToday: false },
  { day: 'M', value: 1720, isToday: false },
  { day: 'J', value: 2100, isToday: false },
  { day: 'V', value: 1800, isToday: false },
  { day: 'S', value: 1950, isToday: false },
  { day: 'D', value: 1847, isToday: true },
];

const mockMealsData: Meal[] = [
  { id: '1', emoji: '🥐', name: 'Petit-déjeuner', calories: 420, time: '08:30', mealType: 'breakfast' },
  { id: '2', emoji: '🥗', name: 'Déjeuner', calories: 650, time: '12:45', mealType: 'lunch' },
  { id: '3', emoji: '🍎', name: 'Collation', calories: 120, time: '16:00', mealType: 'snack' },
  { id: '4', emoji: '🍝', name: 'Dîner', calories: 657, time: '19:30', mealType: 'dinner' },
];

export interface HomeData {
  calorieData: CalorieData;
  macrosData: MacrosData;
  weeklyData: DailyCalories[];
  meals: Meal[];
  waterGlasses: number;
  waterGoal: number;
  selectedDate: Date;
  period: Period;
  addWaterGlass: () => void;
  removeWaterGlass: () => void;
  setSelectedDate: (date: Date) => void;
  setPeriod: (period: Period) => void;
}

const useHomeData = (): HomeData => {
  const [waterGlasses, setWaterGlasses] = useState(5);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [period, setPeriod] = useState<Period>('day');

  const waterGoal = 8;

  const addWaterGlass = useCallback(() => {
    setWaterGlasses((prev) => Math.min(prev + 1, waterGoal));
  }, [waterGoal]);

  const removeWaterGlass = useCallback(() => {
    setWaterGlasses((prev) => Math.max(prev - 1, 0));
  }, []);

  const calorieData: CalorieData = {
    ...mockCalorieData,
    percentage: calculatePercentage(mockCalorieData.consumed, mockCalorieData.goal),
  };

  return {
    calorieData,
    macrosData: mockMacrosData,
    weeklyData: mockWeeklyData,
    meals: mockMealsData,
    waterGlasses,
    waterGoal,
    selectedDate,
    period,
    addWaterGlass,
    removeWaterGlass,
    setSelectedDate,
    setPeriod,
  };
};

export default useHomeData;
