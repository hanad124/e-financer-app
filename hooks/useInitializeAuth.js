import { useEffect, useState } from "react";
import { getToken } from "../utils/storage";
import { getUserInfo } from "../apicalls/auth";

const useInitializeAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeStore = async () => {
      try {
        const token = await getToken();
        if (token) {
          const user = await getUserInfo();
          setUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeStore();
  }, []);

  return { user, setUser, isAuthenticated, setIsAuthenticated, isLoading };
};

export default useInitializeAuth;
