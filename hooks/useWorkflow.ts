'use client';

import { useEffect } from 'react';
import { useWorkflowStore } from '@/store/workflowStore';

export const useWorkflow = (projectId: string) => {
  const store = useWorkflowStore();

  useEffect(() => {
    if (projectId) {
      store.fetchWorkflowStages(projectId);
      store.fetchAlerts(projectId);
    }
  }, [projectId, store]);

  return {
    stages: store.stages,
    alerts: store.alerts,
    loading: store.loading,
    error: store.error,
    updateStageStatus: store.updateStageStatus,
    addRemark: store.addRemark,
    resolveAlert: store.resolveAlert,
  };
};
