import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/user";
import { useCallback, useEffect, useState } from "react";

export const useUserProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const { profile: userProfile, error: fetchError } = await getUserProfile(user.uid);
    setProfile(userProfile);
    setError(fetchError);
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchProfile();
    }
  }, [authLoading, fetchProfile]);

  return {
    profile,
    isLoading: authLoading || isLoading,
    error,
    refetch: fetchProfile,
  };
};

export default useUserProfile;
