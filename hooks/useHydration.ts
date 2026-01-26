import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import {
  HydrationEntry,
  DailyHydration,
  DRINK_OPTIONS,
  DrinkType,
  DrinkOption,
} from '@/types/hydration';
import { DEFAULT_USER_GOALS } from '@/types/user';
import {
  subscribeToHydration,
  addHydrationEntry,
  addQuickDrink,
  deleteHydrationEntry,
} from '@/services/hydrationService';

interface UseHydrationReturn extends DailyHydration {
  remaining: number;
  isLoading: boolean;
  error: string | null;
  drinkOptions: DrinkOption[];
  addDrink: (drinkOptionId: string) => Promise<void>;
  addCustomDrink: (
    type: DrinkType,
    amount: number,
    name?: string
  ) => Promise<void>;
  removeDrink: (entryId: string) => Promise<void>;
}

export const useHydration = (date?: Date): UseHydrationReturn => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [entries, setEntries] = useState<HydrationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const targetDate = date || new Date();
  const dateString = targetDate.toISOString().split('T')[0];
  const goalMl = profile?.goals?.water || DEFAULT_USER_GOALS.water;

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToHydration(dateString, (newEntries) => {
      setEntries(newEntries);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, dateString]);

  // Calculs
  const totalMl = entries.reduce((acc, e) => acc + e.amount, 0);
  const percentage = Math.min(100, Math.round((totalMl / goalMl) * 100));
  const remaining = Math.max(0, goalMl - totalMl);

  // Actions
  const addDrink = useCallback(async (drinkOptionId: string) => {
    try {
      const result = await addQuickDrink(drinkOptionId);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError("Erreur lors de l'ajout de la boisson");
    }
  }, []);

  const addCustomDrink = useCallback(
    async (type: DrinkType, amount: number, name?: string) => {
      try {
        const result = await addHydrationEntry(type, amount, name);
        if (result.error) {
          setError(result.error);
        }
      } catch (err) {
        setError("Erreur lors de l'ajout de la boisson");
      }
    },
    []
  );

  const removeDrink = useCallback(async (entryId: string) => {
    try {
      const result = await deleteHydrationEntry(entryId);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  }, []);

  return {
    date: dateString,
    totalMl,
    goalMl,
    entries,
    percentage,
    remaining,
    isLoading,
    error,
    drinkOptions: DRINK_OPTIONS,
    addDrink,
    addCustomDrink,
    removeDrink,
  };
};

export default useHydration;
