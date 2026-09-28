import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import httpManager from '../services/HttpManager';

interface UserStats {
  total_visits: number;
  total_colonies: number;
  most_visited: { name: string; count: number } | null;
  last_visit: { date: string; colony: string } | null;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const response = await httpManager.get<{ data: UserStats }>('/auth/me/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
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
