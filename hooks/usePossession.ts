'use client';

import { useEffect } from 'react';
import { usePossessionStore } from '@/store/possessionStore';

export const usePossession = () => {
  const store = usePossessionStore();

  useEffect(() => {
    store.fetchParcels();
    store.fetchStatistics();
  }, [store]);

  return {
    parcels: store.parcels,
    statistics: store.statistics,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    getParcelById: store.getParcelById,
    updatePossessionStatus: store.updatePossessionStatus,
    addFieldVerification: store.addFieldVerification,
    addPhotograph: store.addPhotograph,
    addDocument: store.addDocument,
    getPossessionTimeline: store.getPossessionTimeline,
    setFilter: store.setFilter,
  };
};
