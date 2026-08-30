import { create } from 'zustand';
import { Project, LandParcel, Compensation, RehabilitationAndResettlement, DashboardStats } from '@/types';

interface DashboardStore {
  stats: DashboardStats;
  projects: Project[];
  parcels: LandParcel[];
  compensations: Compensation[];
  rrData: RehabilitationAndResettlement[];
  stateData: StateMetrics[];
  delayedProjects: DelayedProjectMetric[];
  monthlyTrends: MonthlyTrendData[];
  loading: boolean;
  error?: string;
  fetchDashboardData: () => Promise<void>;
}

export interface StateMetrics {
  state: string;
  totalProjects: number;
  totalArea: number;
  landAcquired: number;
  acquisitionPercentage: number;
  compensationDisbursed: number;
  familiesRehabilitated: number;
  delayedProjects: number;
}

export interface DelayedProjectMetric {
  projectId: string;
  projectName: string;
  state: string;
  delayDays: number;
  reason: string;
  status: string;
  expectedCompletion: Date;
}

export interface MonthlyTrendData {
  month: string;
  landNotified: number;
  landAcquired: number;
  compensationAssessed: number;
  compensationDisbursed: number;
}

// Mock dashboard data
const mockStats: DashboardStats = {
  totalProjects: 487,
  activeProjects: 312,
  totalLandArea: 145230,
  totalCost: 52500000000,
  landAcquired: 98450,
  compensationPaid: 34200000000,
  rrBeneficiaries: 125000,
  documentsPending: 234,
};

const mockStateData: StateMetrics[] = [
  {
    state: 'Andhra Pradesh',
    totalProjects: 45,
    totalArea: 12450,
    landAcquired: 8950,
    acquisitionPercentage: 72,
    compensationDisbursed: 3200000000,
    familiesRehabilitated: 12500,
    delayedProjects: 3,
  },
  {
    state: 'Bihar',
    totalProjects: 38,
    totalArea: 8230,
    landAcquired: 5120,
    acquisitionPercentage: 62,
    compensationDisbursed: 1800000000,
    familiesRehabilitated: 8900,
    delayedProjects: 5,
  },
  {
    state: 'Gujarat',
    totalProjects: 52,
    totalArea: 15670,
    landAcquired: 12340,
    acquisitionPercentage: 79,
    compensationDisbursed: 4100000000,
    familiesRehabilitated: 16200,
    delayedProjects: 2,
  },
  {
    state: 'Karnataka',
    totalProjects: 41,
    totalArea: 10890,
    landAcquired: 7654,
    acquisitionPercentage: 70,
    compensationDisbursed: 2900000000,
    familiesRehabilitated: 11200,
    delayedProjects: 4,
  },
  {
    state: 'Madhya Pradesh',
    totalProjects: 48,
    totalArea: 14230,
    landAcquired: 9870,
    acquisitionPercentage: 69,
    compensationDisbursed: 3500000000,
    familiesRehabilitated: 13400,
    delayedProjects: 6,
  },
  {
    state: 'Maharashtra',
    totalProjects: 56,
    totalArea: 16540,
    landAcquired: 13450,
    acquisitionPercentage: 81,
    compensationDisbursed: 4500000000,
    familiesRehabilitated: 17600,
    delayedProjects: 1,
  },
  {
    state: 'Odisha',
    totalProjects: 35,
    totalArea: 9120,
    landAcquired: 6890,
    acquisitionPercentage: 75,
    compensationDisbursed: 2400000000,
    familiesRehabilitated: 10100,
    delayedProjects: 2,
  },
  {
    state: 'Rajasthan',
    totalProjects: 44,
    totalArea: 12340,
    landAcquired: 8560,
    acquisitionPercentage: 69,
    compensationDisbursed: 2800000000,
    familiesRehabilitated: 11900,
    delayedProjects: 7,
  },
  {
    state: 'Tamil Nadu',
    totalProjects: 39,
    totalArea: 10670,
    landAcquired: 8234,
    acquisitionPercentage: 77,
    compensationDisbursed: 3100000000,
    familiesRehabilitated: 12300,
    delayedProjects: 1,
  },
  {
    state: 'Uttar Pradesh',
    totalProjects: 49,
    totalArea: 13890,
    landAcquired: 9876,
    acquisitionPercentage: 71,
    compensationDisbursed: 3600000000,
    familiesRehabilitated: 13900,
    delayedProjects: 8,
  },
];

const mockDelayedProjects: DelayedProjectMetric[] = [
  {
    projectId: 'PROJ-2024-001',
    projectName: 'National Highway Expansion - NH-44 Segment',
    state: 'Uttar Pradesh',
    delayDays: 145,
    reason: 'Legal dispute on land ownership',
    status: 'On Hold',
    expectedCompletion: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  },
  {
    projectId: 'PROJ-2024-002',
    projectName: 'Railway Corridor Development - Delhi-Chennai',
    state: 'Rajasthan',
    delayDays: 98,
    reason: 'Delayed R&R implementation',
    status: 'In Progress',
    expectedCompletion: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  },
  {
    projectId: 'PROJ-2024-003',
    projectName: 'Smart City Infrastructure - Kanpur',
    state: 'Uttar Pradesh',
    delayDays: 87,
    reason: 'Environmental clearance pending',
    status: 'On Hold',
    expectedCompletion: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
  },
  {
    projectId: 'PROJ-2024-004',
    projectName: 'Airport Expansion - Lucknow',
    state: 'Uttar Pradesh',
    delayDays: 156,
    reason: 'Compensation dispute resolution in court',
    status: 'Disputed',
    expectedCompletion: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
  {
    projectId: 'PROJ-2024-005',
    projectName: 'Industrial Corridor - Madhya Pradesh',
    state: 'Madhya Pradesh',
    delayDays: 112,
    reason: 'Affected families relocation delayed',
    status: 'In Progress',
    expectedCompletion: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
  },
];

const mockMonthlyTrends: MonthlyTrendData[] = [
  { month: 'Jan', landNotified: 2340, landAcquired: 1890, compensationAssessed: 450000000, compensationDisbursed: 320000000 },
  { month: 'Feb', landNotified: 2890, landAcquired: 2340, compensationAssessed: 580000000, compensationDisbursed: 420000000 },
  { month: 'Mar', landNotified: 3120, landAcquired: 2670, compensationAssessed: 650000000, compensationDisbursed: 520000000 },
  { month: 'Apr', landNotified: 2750, landAcquired: 2100, compensationAssessed: 520000000, compensationDisbursed: 380000000 },
  { month: 'May', landNotified: 3450, landAcquired: 2980, compensationAssessed: 720000000, compensationDisbursed: 580000000 },
  { month: 'Jun', landNotified: 3890, landAcquired: 3420, compensationAssessed: 840000000, compensationDisbursed: 680000000 },
  { month: 'Jul', landNotified: 3670, landAcquired: 3150, compensationAssessed: 780000000, compensationDisbursed: 620000000 },
  { month: 'Aug', landNotified: 4120, landAcquired: 3680, compensationAssessed: 920000000, compensationDisbursed: 750000000 },
];

export const useDashboardStore = create<DashboardStore>((set) => ({
  stats: mockStats,
  projects: [],
  parcels: [],
  compensations: [],
  rrData: [],
  stateData: mockStateData,
  delayedProjects: mockDelayedProjects,
  monthlyTrends: mockMonthlyTrends,
  loading: false,
  error: undefined,

  fetchDashboardData: async () => {
    set({ loading: true, error: undefined });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      set({
        loading: false,
        stats: mockStats,
        stateData: mockStateData,
        delayedProjects: mockDelayedProjects,
        monthlyTrends: mockMonthlyTrends,
      });
    } catch (error) {
      set({
        loading: false,
        error: 'Failed to fetch dashboard data',
      });
    }
  },
}));
