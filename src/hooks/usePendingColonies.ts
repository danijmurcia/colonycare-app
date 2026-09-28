import { useState, useCallback } from 'react';
import { coloniesService, Colony } from '../services/coloniesService';

export function usePendingColonies() {
  const [dailyPending, setDailyPending] = useState<Colony[]>([]);
  const [overduePending, setOverduePending] = useState<Colony[]>([]);
  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingOverdue, setLoadingOverdue] = useState(false);

  // Colonies without visit for exactly 1 day
  const fetchDaily = useCallback(async () => {
    try {
      setLoadingDaily(true);
      const daily = await coloniesService.getPending(1, 1);
      setDailyPending(daily);
    } catch (error) {
      console.error('Error fetching daily pending:', error);
    } finally {
      setLoadingDaily(false);
    }
  }, []);

  // Colonies without visit for 2+ days (no upper limit)
  const fetchOverdue = useCallback(async () => {
    try {
      setLoadingOverdue(true);
      const overdue = await coloniesService.getPending(2);
      setOverduePending(overdue);
    } catch (error) {
      console.error('Error fetching overdue pending:', error);
    } finally {
      setLoadingOverdue(false);
    }
  }, []);

  return { dailyPending, overduePending, loadingDaily, loadingOverdue, fetchDaily, fetchOverdue };
}
