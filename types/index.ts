// User and Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  lastLogin?: Date;
  status: 'active' | 'inactive';
}

export type UserRole = 'admin' | 'officer' | 'surveyor' | 'finance' | 'rr_officer' | 'viewer';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error?: string;
}

// Project Types
export interface Project {
  id: string;
  projectCode: string;
  name: string;
  description: string;
  state: string;
  district: string;
  sector: string;
  totalArea: number;
  totalCost: number;
  startDate: Date;
  estimatedCompletionDate: Date;
  status: ProjectStatus;
  progress: number;
  projectOfficer: string;
  contactEmail: string;
  contactPhone: string;
  documentCount: number;
}

export type ProjectStatus = 'proposal' | 'approved' | 'land_acquisition' | 'possession' | 'rr' | 'completed' | 'suspended';

// Land Parcel Types
export interface LandParcel {
  id: string;
  projectId: string;
  surveyNumber: string;
  plotArea: number;
  landUse: LandUseType;
  location: Location;
  owner: Landowner;
  status: ParcelStatus;
  acquisitionCost: number;
  marketValue: number;
  documentationStatus: DocumentStatus;
  lastUpdated: Date;
}

export type LandUseType = 'agricultural' | 'residential' | 'commercial' | 'industrial' | 'forest' | 'water_body';
export type ParcelStatus = 'identified' | 'surveyed' | 'offered' | 'negotiating' | 'agreed' | 'acquired' | 'possessed';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  village: string;
  taluk: string;
  district: string;
}

export interface Landowner {
  id: string;
  name: string;
  fatherName: string;
  aadharNumber?: string;
  panNumber?: string;
  contactNumber: string;
  email?: string;
  address: string;
  ownership: OwnershipType;
}

export type OwnershipType = 'individual' | 'joint' | 'government' | 'institution';

// Compensation Types
export interface Compensation {
  id: string;
  parcelId: string;
  landownerId: string;
  amount: number;
  structure: CompensationStructure;
  status: CompensationStatus;
  dateOffered: Date;
  dateAccepted?: Date;
  datePaymentProcessed?: Date;
  paymentMethod: PaymentMethod;
  bankDetails?: BankDetails;
  chequeNumber?: string;
}

export interface CompensationStructure {
  landCompensation: number;
  soilCompensation: number;
  cropCompensation: number;
  treeCompensation: number;
  otherStructures: number;
  total: number;
}

export type CompensationStatus = 'pending' | 'offered' | 'accepted' | 'processed' | 'paid' | 'disputed';
export type PaymentMethod = 'bank_transfer' | 'cheque' | 'cash';

export interface BankDetails {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

// R&R Types
export interface RehabilitationAndResettlement {
  id: string;
  projectId: string;
  affectedFamilies: number;
  rrCost: number;
  status: RRStatus;
  housingProvided: number;
  employmentGenerated: number;
  infrastructureImproved: number;
  startDate: Date;
  expectedCompletionDate: Date;
  notes?: string;
}

export type RRStatus = 'planning' | 'in_progress' | 'completed' | 'on_hold';

export interface AffectedFamily {
  id: string;
  projectId: string;
  familyName: string;
  headOfFamily: string;
  memberCount: number;
  livelihoods: string[];
  allocatedResources: string[];
  supportStatus: 'pending' | 'active' | 'completed';
}

// Possession Types
export interface Possession {
  id: string;
  parcelId: string;
  projectId: string;
  legalStatus: LegalStatus;
  possessionDate?: Date;
  physicalPossessionDate?: Date;
  documentReference: string;
  status: PossessionStatus;
  notes?: string;
}

export type PossessionStatus = 'pending' | 'under_process' | 'completed' | 'disputed';
export type LegalStatus = 'clear' | 'disputed' | 'encumbered' | 'under_litigation';

// Document Types
export interface Document {
  id: string;
  referenceId: string; // Could be project, parcel, compensation, etc.
  referenceType: DocumentReferenceType;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  uploadedDate: Date;
  uploadedBy: string;
  status: DocumentStatus;
  comments?: string;
  verifiedBy?: string;
  verifiedDate?: Date;
}

export type DocumentReferenceType = 'project' | 'parcel' | 'compensation' | 'rr' | 'possession' | 'user';
export type DocumentType = 'survey_report' | 'land_deed' | 'compensation_offer' | 'rrplan' | 'possession_certificate' | 'affidavit' | 'authority_letter' | 'other';
export type DocumentStatus = 'uploaded' | 'verified' | 'rejected' | 'archived';

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'urgent';

// Dashboard Statistics
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalLandArea: number;
  totalCost: number;
  landAcquired: number;
  compensationPaid: number;
  rrBeneficiaries: number;
  documentsPending: number;
}

// Reports and Analytics
export interface Report {
  id: string;
  name: string;
  reportType: ReportType;
  generatedDate: Date;
  generatedBy: string;
  data: Record<string, any>;
  fileFormat: 'pdf' | 'excel' | 'csv';
}

export type ReportType = 'project_summary' | 'acquisition_progress' | 'financial' | 'rr_status' | 'possession_status' | 'document_audit';

export interface AnalyticsData {
  projectProgress: Array<{ name: string; value: number }>;
  acquisitionByStatus: Array<{ status: string; count: number }>;
  compensationByState: Array<{ state: string; amount: number }>;
  rrProgress: Array<{ metric: string; completed: number; pending: number }>;
  timelineMetrics: Array<{ month: string; acquisitions: number; payments: number }>;
}
