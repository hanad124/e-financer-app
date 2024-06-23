// src/hooks/useAuthRedirect.js
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth";

const useAuthRedirect = () => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // 1st chech the router pathname and then check the isAuthenticated state
    if (router.pathname === "/sign-in" && isAuthenticated) {
      router.push("/home");
      return null;
    } else if (router.pathname === "/home" && !isAuthenticated) {
      router.push("/sign-in");
    }
  }, [isAuthenticated]);
};

export default useAuthRedirect;
