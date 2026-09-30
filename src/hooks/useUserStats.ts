import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { authService } from "../services/authService";
import type { UserStats } from "../types";

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const data = await authService.getStats();
      setStats(data);
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
