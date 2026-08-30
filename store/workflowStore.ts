import { create } from 'zustand';
import { Project } from '@/types';

export interface WorkflowStage {
  id: string;
  projectId: string;
  stage: number;
  stageName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  startDate?: Date;
  targetDate: Date;
  completionDate?: Date;
  responsibleDepartment: string;
  responsibleOfficer: string;
  pendingActions: string[];
  documents: string[];
  remarks?: string;
  daysPending: number;
  daysRemaining: number;
  delayDuration: number;
}

export interface WorkflowAlert {
  id: string;
  projectId: string;
  type: 'approval_pending' | 'deadline_approaching' | 'deadline_exceeded' | 'compensation_pending' | 'possession_pending' | 'rr_pending';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  resolved: boolean;
}

interface WorkflowStore {
  stages: WorkflowStage[];
  alerts: WorkflowAlert[];
  loading: boolean;
  error?: string;
  fetchWorkflowStages: (projectId: string) => Promise<void>;
  fetchAlerts: (projectId: string) => Promise<void>;
  updateStageStatus: (stageId: string, status: string) => Promise<void>;
  addRemark: (stageId: string, remark: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
}

const WORKFLOW_STAGES_TEMPLATE = [
  {
    stage: 1,
    stageName: 'Project Proposal',
    responsibleDepartment: 'Ministry/Department',
    targetDays: 30,
  },
  {
    stage: 2,
    stageName: 'Preliminary Scrutiny',
    responsibleDepartment: 'Land Acquisition Authority',
    targetDays: 30,
  },
  {
    stage: 3,
    stageName: 'Land Identification',
    responsibleDepartment: 'Revenue Department',
    targetDays: 60,
  },
  {
    stage: 4,
    stageName: 'Land Verification',
    responsibleDepartment: 'Survey Department',
    targetDays: 45,
  },
  {
    stage: 5,
    stageName: 'Notification',
    responsibleDepartment: 'Land Acquisition Authority',
    targetDays: 30,
  },
  {
    stage: 6,
    stageName: 'Objection/Claim Processing',
    responsibleDepartment: 'Collector\'s Office',
    targetDays: 60,
  },
  {
    stage: 7,
    stageName: 'Award Declaration',
    responsibleDepartment: 'Collector\'s Office',
    targetDays: 30,
  },
  {
    stage: 8,
    stageName: 'Compensation Assessment',
    responsibleDepartment: 'Finance Department',
    targetDays: 45,
  },
  {
    stage: 9,
    stageName: 'Compensation Disbursement',
    responsibleDepartment: 'Finance Department',
    targetDays: 60,
  },
  {
    stage: 10,
    stageName: 'Possession',
    responsibleDepartment: 'Collector\'s Office',
    targetDays: 45,
  },
  {
    stage: 11,
    stageName: 'Rehabilitation & Resettlement',
    responsibleDepartment: 'R&R Cell',
    targetDays: 180,
  },
  {
    stage: 12,
    stageName: 'Acquisition Completed',
    responsibleDepartment: 'Project Authority',
    targetDays: 30,
  },
];

const generateMockStages = (projectId: string): WorkflowStage[] => {
  const today = new Date();
  return WORKFLOW_STAGES_TEMPLATE.map((template, index) => {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (index * 40));
    
    const targetDate = new Date(startDate);
    targetDate.setDate(targetDate.getDate() + template.targetDays);
    
    let status: 'pending' | 'in_progress' | 'completed' | 'delayed' = 'pending';
    let completionDate: Date | undefined;
    let daysPending = 0;
    let daysRemaining = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let delayDuration = 0;

    if (index < 3) {
      status = 'completed';
      completionDate = new Date(startDate);
      completionDate.setDate(completionDate.getDate() + (template.targetDays - 10));
      daysPending = 0;
      daysRemaining = 0;
    } else if (index < 5) {
      status = 'in_progress';
      daysPending = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysRemaining < 0) {
        status = 'delayed';
        delayDuration = Math.abs(daysRemaining);
        daysRemaining = 0;
      }
    }

    return {
      id: `STAGE-${projectId}-${template.stage}`,
      projectId,
      stage: template.stage,
      stageName: template.stageName,
      status,
      startDate,
      targetDate,
      completionDate,
      responsibleDepartment: template.responsibleDepartment,
      responsibleOfficer: `Officer-${template.stage}`,
      pendingActions: status !== 'completed' ? [`Complete ${template.stageName}`] : [],
      documents: ['Document-1', 'Document-2'],
      remarks: status === 'delayed' ? 'Under review - legal clearance pending' : undefined,
      daysPending,
      daysRemaining,
      delayDuration,
    };
  });
};

const generateMockAlerts = (projectId: string): WorkflowAlert[] => [
  {
    id: `ALERT-${projectId}-1`,
    projectId,
    type: 'deadline_approaching',
    message: 'Land Verification stage deadline approaching in 5 days',
    severity: 'medium',
    createdAt: new Date(),
    resolved: false,
  },
  {
    id: `ALERT-${projectId}-2`,
    projectId,
    type: 'compensation_pending',
    message: 'Compensation assessment pending for 15 land parcels',
    severity: 'high',
    createdAt: new Date(),
    resolved: false,
  },
  {
    id: `ALERT-${projectId}-3`,
    projectId,
    type: 'rr_pending',
    message: 'R&R implementation status needs update',
    severity: 'medium',
    createdAt: new Date(),
    resolved: false,
  },
];

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  stages: [],
  alerts: [],
  loading: false,
  error: undefined,

  fetchWorkflowStages: async (projectId: string) => {
    set({ loading: true, error: undefined });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      set({ stages: generateMockStages(projectId), loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch workflow stages' });
    }
  },

  fetchAlerts: async (projectId: string) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      set({ alerts: generateMockAlerts(projectId), loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch alerts' });
    }
  },

  updateStageStatus: async (stageId: string, status: string) => {
    set((state) => ({
      stages: state.stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              status: status as any,
              completionDate: status === 'completed' ? new Date() : stage.completionDate,
            }
          : stage
      ),
    }));
  },

  addRemark: async (stageId: string, remark: string) => {
    set((state) => ({
      stages: state.stages.map((stage) =>
        stage.id === stageId ? { ...stage, remarks: remark } : stage
      ),
    }));
  },

  resolveAlert: async (alertId: string) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      ),
    }));
  },
}));
