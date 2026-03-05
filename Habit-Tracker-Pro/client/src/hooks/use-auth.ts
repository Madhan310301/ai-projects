import { useState, useEffect, useCallback } from "react";
import { auth, loginWithGoogle, logoutFirebase, onAuthStateChanged, type User } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async () => {
    await loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    await logoutFirebase();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
