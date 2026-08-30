import { create } from 'zustand';

export interface LandParcel {
  id: string;
  parcelId: string;
  projectId: string;
  projectName: string;
  surveyNumber: string;
  area: number;
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  acquisitionStatus: 'identified' | 'notified' | 'offered' | 'negotiating' | 'agreed' | 'acquired';
  awardStatus: 'pending' | 'declared' | 'challenged' | 'finalized';
  compensationStatus: 'pending' | 'assessed' | 'approved' | 'disbursed';
  possessionStatus: 'pending' | 'notice_issued' | 'compensation_pending' | 'ready_for_possession' | 'possession_taken' | 'disputed';
  possessionDate?: Date;
  possessionOfficer?: string;
  fieldVerification?: FieldVerification;
  documents: PossessionDocument[];
  photographs: Photograph[];
  createdAt: Date;
  updatedAt: Date;
  remarks?: string;
}

export interface FieldVerification {
  id: string;
  parcelId: string;
  verificationDate: Date;
  officerId: string;
  officerName: string;
  gpsLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  verificationRemarks: string;
  status: 'pending' | 'verified' | 'disputed';
  documentationComplete: boolean;
  photoCount: number;
}

export interface Photograph {
  id: string;
  parcelId: string;
  url: string;
  caption: string;
  uploadedBy: string;
  uploadedAt: Date;
  gpsLocation?: {
    latitude: number;
    longitude: number;
  };
  metadata?: {
    cameraType?: string;
    timestamp?: Date;
  };
}

export interface PossessionDocument {
  id: string;
  parcelId: string;
  documentType: 'survey_report' | 'award_certificate' | 'compensation_certificate' | 'possession_certificate' | 'field_report' | 'other';
  documentName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedDate: Date;
  status: 'pending' | 'verified' | 'approved';
}

export interface PossessionTimeline {
  id: string;
  parcelId: string;
  stage: number;
  stageName: string;
  status: 'pending' | 'completed' | 'delayed';
  scheduledDate: Date;
  completionDate?: Date;
  remarks?: string;
}

export interface PossessionStatistics {
  totalParcels: number;
  possessionCompleted: number;
  possessionPending: number;
  disputedParcels: number;
  noticeIssued: number;
  compensationPending: number;
  readyForPossession: number;
  completionPercentage: number;
  averageDaysForPossession: number;
}

interface PossessionStore {
  parcels: LandParcel[];
  statistics: PossessionStatistics | null;
  loading: boolean;
  error?: string;
  filters: {
    projectId?: string;
    state?: string;
    possessionStatus?: string;
  };
  fetchParcels: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  getParcelById: (parcelId: string) => LandParcel | undefined;
  updatePossessionStatus: (parcelId: string, status: string) => Promise<void>;
  addFieldVerification: (parcelId: string, verification: FieldVerification) => Promise<void>;
  addPhotograph: (parcelId: string, photograph: Photograph) => Promise<void>;
  addDocument: (parcelId: string, document: PossessionDocument) => Promise<void>;
  getPossessionTimeline: (parcelId: string) => PossessionTimeline[];
  setFilter: (filterName: string, value: string | undefined) => void;
}

const POSSESSION_TIMELINE_STAGES: PossessionTimeline[] = [
  { id: '1', parcelId: '', stage: 1, stageName: 'Award Declaration', status: 'completed', scheduledDate: new Date(2024, 0, 15), completionDate: new Date(2024, 0, 20) },
  { id: '2', parcelId: '', stage: 2, stageName: 'Compensation Assessment', status: 'completed', scheduledDate: new Date(2024, 1, 1), completionDate: new Date(2024, 1, 15) },
  { id: '3', parcelId: '', stage: 3, stageName: 'Notice Issuance', status: 'completed', scheduledDate: new Date(2024, 2, 1), completionDate: new Date(2024, 2, 5) },
  { id: '4', parcelId: '', stage: 4, stageName: 'Compensation Disbursement', status: 'pending', scheduledDate: new Date(2024, 3, 1) },
  { id: '5', parcelId: '', stage: 5, stageName: 'Final Verification', status: 'pending', scheduledDate: new Date(2024, 3, 20) },
  { id: '6', parcelId: '', stage: 6, stageName: 'Physical Possession', status: 'pending', scheduledDate: new Date(2024, 4, 1) },
];

const generateMockParcels = (): LandParcel[] => {
  const statuses: Array<LandParcel['possessionStatus']> = [
    'pending',
    'notice_issued',
    'compensation_pending',
    'ready_for_possession',
    'possession_taken',
    'disputed',
  ];

  return Array.from({ length: 50 }, (_, index) => ({
    id: `PARCEL-${String(index + 1).padStart(5, '0')}`,
    parcelId: `PR-${String(index + 1).padStart(6, '0')}`,
    projectId: 'PROJ-2024-001',
    projectName: 'National Highway Expansion - NH-44',
    surveyNumber: `SN-${String(index + 1).padStart(4, '0')}`,
    area: 0.5 + (index % 10) * 0.1,
    state: ['Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan'][index % 3],
    district: ['Lucknow', 'Indore', 'Jaipur'][index % 3],
    village: `Village-${index + 1}`,
    latitude: 26.8124 + (index % 10) * 0.01,
    longitude: 75.7137 + (index % 10) * 0.01,
    acquisitionStatus: (['identified', 'notified', 'agreed', 'acquired'] as const)[index % 4],
    awardStatus: (['pending', 'declared', 'finalized'] as const)[index % 3],
    compensationStatus: (['pending', 'assessed', 'approved', 'disbursed'] as const)[index % 4],
    possessionStatus: statuses[index % 6],
    possessionDate: index % 6 === 4 ? new Date(2024, 2, 15 + (index % 14)) : undefined,
    possessionOfficer: index % 6 === 4 ? `Officer-${index % 3 + 1}` : undefined,
    fieldVerification: index % 2 === 0 ? {
      id: `VER-${index + 1}`,
      parcelId: `PARCEL-${String(index + 1).padStart(5, '0')}`,
      verificationDate: new Date(2024, 2, 10),
      officerId: `OFF-${index % 3 + 1}`,
      officerName: `Officer-${index % 3 + 1}`,
      gpsLocation: {
        latitude: 26.8124 + (index % 10) * 0.01,
        longitude: 75.7137 + (index % 10) * 0.01,
        accuracy: 5 + (index % 10),
      },
      verificationRemarks: index % 3 === 0 ? 'Boundary verified and marked' : 'Field verification pending dispute resolution',
      status: index % 3 === 0 ? 'verified' : 'disputed',
      documentationComplete: index % 2 === 0,
      photoCount: 3 + (index % 5),
    } : undefined,
    documents: [
      {
        id: `DOC-${index}-1`,
        parcelId: `PARCEL-${String(index + 1).padStart(5, '0')}`,
        documentType: 'survey_report',
        documentName: 'Survey Report',
        fileUrl: `/documents/survey-${index + 1}.pdf`,
        uploadedBy: 'Survey Officer',
        uploadedDate: new Date(2024, 0, 15),
        status: 'approved',
      },
      ...(index % 2 === 0 ? [{
        id: `DOC-${index}-2`,
        parcelId: `PARCEL-${String(index + 1).padStart(5, '0')}`,
        documentType: 'award_certificate',
        documentName: 'Award Certificate',
        fileUrl: `/documents/award-${index + 1}.pdf`,
        uploadedBy: 'Collector Office',
        uploadedDate: new Date(2024, 1, 10),
        status: 'approved',
      }] : []),
    ],
    photographs: index % 2 === 0 ? [
      {
        id: `PHOTO-${index}-1`,
        parcelId: `PARCEL-${String(index + 1).padStart(5, '0')}`,
        url: `/images/parcel-${index + 1}-1.jpg`,
        caption: 'Parcel boundary marking',
        uploadedBy: `Officer-${index % 3 + 1}`,
        uploadedAt: new Date(2024, 2, 12),
        gpsLocation: {
          latitude: 26.8124 + (index % 10) * 0.01,
          longitude: 75.7137 + (index % 10) * 0.01,
        },
      },
      {
        id: `PHOTO-${index}-2`,
        parcelId: `PARCEL-${String(index + 1).padStart(5, '0')}`,
        url: `/images/parcel-${index + 1}-2.jpg`,
        caption: 'Overall land view',
        uploadedBy: `Officer-${index % 3 + 1}`,
        uploadedAt: new Date(2024, 2, 12),
      },
    ] : [],
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(),
    remarks: index % 5 === 0 ? 'Boundary dispute under resolution' : undefined,
  }));
};

const calculateStatistics = (parcels: LandParcel[]): PossessionStatistics => {
  const completed = parcels.filter(p => p.possessionStatus === 'possession_taken').length;
  const pending = parcels.filter(p => p.possessionStatus !== 'possession_taken' && p.possessionStatus !== 'disputed').length;
  const disputed = parcels.filter(p => p.possessionStatus === 'disputed').length;
  const noticeIssued = parcels.filter(p => p.possessionStatus === 'notice_issued').length;
  const compensationPending = parcels.filter(p => p.possessionStatus === 'compensation_pending').length;
  const readyForPossession = parcels.filter(p => p.possessionStatus === 'ready_for_possession').length;

  return {
    totalParcels: parcels.length,
    possessionCompleted: completed,
    possessionPending: pending,
    disputedParcels: disputed,
    noticeIssued,
    compensationPending,
    readyForPossession,
    completionPercentage: Math.round((completed / parcels.length) * 100),
    averageDaysForPossession: 45,
  };
};

export const usePossessionStore = create<PossessionStore>((set, get) => ({
  parcels: [],
  statistics: null,
  loading: false,
  error: undefined,
  filters: {},

  fetchParcels: async () => {
    set({ loading: true, error: undefined });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const parcels = generateMockParcels();
      set({ parcels, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch parcels' });
    }
  },

  fetchStatistics: async () => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const parcels = get().parcels;
      const statistics = calculateStatistics(parcels);
      set({ statistics, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch statistics' });
    }
  },

  getParcelById: (parcelId: string) => {
    return get().parcels.find(p => p.id === parcelId);
  },

  updatePossessionStatus: async (parcelId: string, status: string) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              possessionStatus: status as any,
              possessionDate: status === 'possession_taken' ? new Date() : p.possessionDate,
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  addFieldVerification: async (parcelId: string, verification: FieldVerification) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              fieldVerification: verification,
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  addPhotograph: async (parcelId: string, photograph: Photograph) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              photographs: [...p.photographs, photograph],
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  addDocument: async (parcelId: string, document: PossessionDocument) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId
          ? {
              ...p,
              documents: [...p.documents, document],
              updatedAt: new Date(),
            }
          : p
      ),
    }));
  },

  getPossessionTimeline: (parcelId: string) => {
    return POSSESSION_TIMELINE_STAGES.map(stage => ({
      ...stage,
      parcelId,
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
