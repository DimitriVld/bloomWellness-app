import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '@/types/user';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/services/userService';

export const useNotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const savedSettings = await getNotificationSettings(user.uid);
      if (savedSettings) {
        setSettings(savedSettings);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, [user]);

  const updateSettings = useCallback(
    async (newSettings: Partial<NotificationSettings>) => {
      if (!user) return { success: false, error: 'Non authentifié' };

      const updated = { ...settings, ...newSettings };
      setSettings(updated);

      const result = await updateNotificationSettings(user.uid, updated);
      if (result.error) {
        setError(result.error);
      }
      return result;
    },
    [user, settings]
  );

  return { settings, isLoading, error, updateSettings };
};

export default useNotificationSettings;
