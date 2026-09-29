import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import httpManager from "../services/HttpManager";
import type { UserStats } from "../types";

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const response = await httpManager.get<{ data: UserStats }>("/auth/me/stats");
      setStats(response.data.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  return { stats, loading, refreshStats: loadStats };
}
