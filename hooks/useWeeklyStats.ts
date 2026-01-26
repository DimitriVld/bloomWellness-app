import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';
import { WeeklyStats } from '@/types/stats';
import { DEFAULT_USER_GOALS } from '@/types/user';
import { getWeeklyStats } from '@/services/statsService';

interface UseWeeklyStatsReturn {
  stats: WeeklyStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWeeklyStats = (): UseWeeklyStatsReturn => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const goals = profile?.goals || DEFAULT_USER_GOALS;
      const result = await getWeeklyStats(goals);

      if (result.error) {
        setError(result.error);
      } else {
        setStats(result.data);
      }
    } catch (err) {
      setError('Erreur lors de la récupération des statistiques');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user, profile?.goals]);

  return { stats, isLoading, error, refetch: fetchStats };
};

export default useWeeklyStats;
