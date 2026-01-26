import { useMemo } from 'react';
import { useUserProfile } from './useUserProfile';
import { useDailyMeals } from './useDailyMeals';
import { useHydration } from './useHydration';
import { DailyStats } from '@/types/stats';
import { DEFAULT_USER_GOALS } from '@/types/user';
import { calculateDailyStats } from '@/services/statsService';

interface UseDailyStatsReturn {
  stats: DailyStats | null;
  isLoading: boolean;
  error: string | null;
}

export const useDailyStats = (date?: Date): UseDailyStatsReturn => {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { meals, isLoading: mealsLoading, error: mealsError } = useDailyMeals(date);
  const {
    entries: hydrationEntries,
    isLoading: hydrationLoading,
    error: hydrationError,
  } = useHydration(date);

  const isLoading = profileLoading || mealsLoading || hydrationLoading;
  const error = mealsError || hydrationError;

  const stats: DailyStats | null = useMemo(() => {
    const goals = profile?.goals || DEFAULT_USER_GOALS;
    return calculateDailyStats(meals, hydrationEntries, goals);
  }, [meals, hydrationEntries, profile?.goals]);

  return { stats, isLoading, error };
};

export default useDailyStats;
