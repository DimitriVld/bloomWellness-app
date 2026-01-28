import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import useUserProfile from './useUserProfile';
import { UserStats } from '@/types/user';
import { getUserStats } from '@/services/statsService';

export const useUserStats = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user || !profile?.goals?.calories) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const { data, error: fetchError } = await getUserStats(
      user.uid,
      profile.goals.calories
    );

    setStats(data);
    setError(fetchError);
    setIsLoading(false);
  }, [user, profile?.goals?.calories]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
};

export default useUserStats;
