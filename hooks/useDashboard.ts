import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export const useDashboard = () => {
  const store = useDashboardStore();

  useEffect(() => {
    store.fetchDashboardData();
  }, [store]);

  return {
    stats: store.stats,
    stateData: store.stateData,
    delayedProjects: store.delayedProjects,
    monthlyTrends: store.monthlyTrends,
    loading: store.loading,
    error: store.error,
  };
};
