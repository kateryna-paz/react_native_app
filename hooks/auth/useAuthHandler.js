import { useEffect } from "react";
import { router } from "expo-router";
import { authEvents } from "../../services/axiosConfig";

export const useAuthHandler = () => {
  useEffect(() => {
    const unsubscribe = authEvents.subscribe((event) => {
      if (event === "unauthorized") {
        router.push("/auth");
      }
    });

    return unsubscribe;
  }, []);
};
