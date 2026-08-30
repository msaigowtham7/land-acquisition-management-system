'use client';

import { useEffect } from 'react';
import { useRRStore } from '@/store/rrStore';

export const useRR = () => {
  const store = useRRStore();

  useEffect(() => {
    store.fetchFamilies();
    store.fetchStatistics();
  }, [store]);

  return {
    families: store.families,
    statistics: store.statistics,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    getFamilyById: store.getFamilyById,
    updateFamilyStatus: store.updateFamilyStatus,
    updateEmploymentAssistance: store.updateEmploymentAssistance,
    updateFinancialAssistance: store.updateFinancialAssistance,
    setFilter: store.setFilter,
  };
};
