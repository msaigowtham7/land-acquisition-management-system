import { create } from 'zustand';

export interface AffectedFamily {
  id: string;
  familyRefId: string;
  projectId: string;
  projectName: string;
  state: string;
  district: string;
  village: string;
  familyHead: string;
  memberCount: number;
  landArea: number;
  acquisitionStatus: 'identified' | 'notified' | 'offered' | 'negotiating' | 'agreed' | 'acquired';
  rrEligibility: boolean;
  rrPackage: RRPackage;
  housingStatus: 'pending' | 'allocated' | 'constructed' | 'handed_over';
  employmentAssistance: EmploymentAssistance;
  financialAssistance: FinancialAssistance;
  resettlementStatus: 'not_started' | 'assessment_pending' | 'eligible' | 'partially_provided' | 'resettled' | 'completed';
  benefitsProvided: string[];
  benefitsPending: string[];
  createdAt: Date;
  updatedAt: Date;
  remarks?: string;
}

export interface RRPackage {
  housingSupportAmount: number;
  employmentAssistanceAmount: number;
  lumpSumAmount: number;
  socialSecurityAmount: number;
  totalPackage: number;
}

export interface EmploymentAssistance {
  status: 'not_started' | 'training_ongoing' | 'job_placement_pending' | 'job_placed' | 'completed';
  trainingType?: string;
  trainingStatus?: string;
  jobPlacementDetails?: string;
  monthlyStipend?: number;
}

export interface FinancialAssistance {
  status: 'pending' | 'assessed' | 'approved' | 'partially_disbursed' | 'fully_disbursed';
  appliedAmount: number;
  approvedAmount: number;
  disburseAmount: number;
  remainingAmount: number;
  disbursementDates: Date[];
}

export interface RRStatistics {
  totalAffectedFamilies: number;
  totalDisplacedFamilies: number;
  rrCompleted: number;
  rrPending: number;
  housesConstructed: number;
  jobsPlaced: number;
  totalCompensationDisbursed: number;
  averageRRDuration: number;
}

interface RRStore {
  families: AffectedFamily[];
  statistics: RRStatistics | null;
  loading: boolean;
  error?: string;
  filters: {
    projectId?: string;
    state?: string;
    resettlementStatus?: string;
  };
  fetchFamilies: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  getFamilyById: (familyId: string) => AffectedFamily | undefined;
  updateFamilyStatus: (familyId: string, status: string) => Promise<void>;
  updateEmploymentAssistance: (familyId: string, assistance: EmploymentAssistance) => Promise<void>;
  updateFinancialAssistance: (familyId: string, assistance: FinancialAssistance) => Promise<void>;
  setFilter: (filterName: string, value: string | undefined) => void;
}

const generateMockFamilies = (): AffectedFamily[] => {
  const statuses: Array<AffectedFamily['resettlementStatus']> = [
    'not_started',
    'assessment_pending',
    'eligible',
    'partially_provided',
    'resettled',
    'completed',
  ];

  return Array.from({ length: 45 }, (_, index) => ({
    id: `FAMILY-${String(index + 1).padStart(5, '0')}`,
    familyRefId: `FAM-${String(index + 1).padStart(6, '0')}`,
    projectId: 'PROJ-2024-001',
    projectName: 'National Highway Expansion - NH-44',
    state: ['Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan'][index % 3],
    district: ['Lucknow', 'Indore', 'Jaipur'][index % 3],
    village: `Village-${index + 1}`,
    familyHead: `Head-${index + 1}`,
    memberCount: 4 + (index % 4),
    landArea: 0.5 + (index % 5) * 0.1,
    acquisitionStatus: (['identified', 'notified', 'agreed', 'acquired'] as const)[index % 4],
    rrEligibility: true,
    rrPackage: {
      housingSupportAmount: 500000,
      employmentAssistanceAmount: 200000,
      lumpSumAmount: 100000,
      socialSecurityAmount: 50000,
      totalPackage: 850000,
    },
    housingStatus: (['pending', 'allocated', 'constructed', 'handed_over'] as const)[index % 4],
    employmentAssistance: {
      status: (['not_started', 'training_ongoing', 'job_placed'] as const)[index % 3],
      trainingType: 'Vocational Training',
      trainingStatus: index % 3 === 1 ? 'In Progress' : 'Completed',
      jobPlacementDetails: index % 3 === 2 ? 'Placed at ABC Company' : undefined,
      monthlyStipend: 5000,
    },
    financialAssistance: {
      status: (['pending', 'approved', 'partially_disbursed', 'fully_disbursed'] as const)[index % 4],
      appliedAmount: 850000,
      approvedAmount: 850000,
      disburseAmount: index % 4 === 3 ? 850000 : (index % 4 * 200000),
      remainingAmount: index % 4 === 3 ? 0 : 850000 - (index % 4 * 200000),
      disbursementDates: [
        new Date(2024, 0, 15),
        ...(index % 2 === 0 ? [new Date(2024, 3, 20)] : []),
      ],
    },
    resettlementStatus: statuses[index % 6],
    benefitsProvided: [
      'Land Notification',
      ...(index % 2 === 0 ? ['Housing Assistance'] : []),
      ...(index % 3 === 0 ? ['Employment Training'] : []),
    ],
    benefitsPending: index % 6 !== 5 ? ['Final Compensation', 'Job Placement', 'Resettlement Certificate'] : [],
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(),
    remarks: index % 5 === 0 ? 'Awaiting final documentation' : undefined,
  }));
};

const calculateStatistics = (families: AffectedFamily[]): RRStatistics => {
  const completed = families.filter(f => f.resettlementStatus === 'completed').length;
  const pending = families.filter(f => f.resettlementStatus !== 'completed').length;
  const displaced = families.filter(f => f.acquisitionStatus === 'acquired').length;

  return {
    totalAffectedFamilies: families.length,
    totalDisplacedFamilies: displaced,
    rrCompleted: completed,
    rrPending: pending,
    housesConstructed: families.filter(f => f.housingStatus === 'handed_over').length,
    jobsPlaced: families.filter(f => f.employmentAssistance.status === 'job_placed').length,
    totalCompensationDisbursed: families.reduce(
      (sum, f) => sum + f.financialAssistance.disburseAmount,
      0
    ),
    averageRRDuration: 180,
  };
};

export const useRRStore = create<RRStore>((set, get) => ({
  families: [],
  statistics: null,
  loading: false,
  error: undefined,
  filters: {},

  fetchFamilies: async () => {
    set({ loading: true, error: undefined });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const families = generateMockFamilies();
      set({ families, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch families' });
    }
  },

  fetchStatistics: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const families = get().families;
      const statistics = calculateStatistics(families);
      set({ statistics, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch statistics' });
    }
  },

  getFamilyById: (familyId: string) => {
    return get().families.find(f => f.id === familyId);
  },

  updateFamilyStatus: async (familyId: string, status: string) => {
    set((state) => ({
      families: state.families.map((f) =>
        f.id === familyId
          ? {
              ...f,
              resettlementStatus: status as any,
              updatedAt: new Date(),
            }
          : f
      ),
    }));
  },

  updateEmploymentAssistance: async (familyId: string, assistance: EmploymentAssistance) => {
    set((state) => ({
      families: state.families.map((f) =>
        f.id === familyId
          ? {
              ...f,
              employmentAssistance: assistance,
              updatedAt: new Date(),
            }
          : f
      ),
    }));
  },

  updateFinancialAssistance: async (familyId: string, assistance: FinancialAssistance) => {
    set((state) => ({
      families: state.families.map((f) =>
        f.id === familyId
          ? {
              ...f,
              financialAssistance: assistance,
              updatedAt: new Date(),
            }
          : f
      ),
    }));
  },

  setFilter: (filterName: string, value: string | undefined) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterName]: value,
      },
    }));
  },
}));
