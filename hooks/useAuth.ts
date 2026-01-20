import { onAuthStateChanged } from "@/services/authService";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
};

export default useAuth;