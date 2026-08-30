import { create } from 'zustand';

export type DocumentCategory =
  | 'project_proposal'
  | 'land_records'
  | 'survey_documents'
  | 'notifications'
  | 'awards'
  | 'compensation_documents'
  | 'possession_documents'
  | 'rr_documents'
  | 'legal_documents'
  | 'field_verification';

export type DocumentStatus = 'uploaded' | 'pending_verification' | 'verified' | 'approved' | 'rejected' | 'archived';

export interface Document {
  id: string;
  documentId: string;
  projectId: string;
  parcelId?: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: DocumentStatus;
  version: number;
  uploadedBy: string;
  uploadedDate: Date;
  verifiedBy?: string;
  verificationDate?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  s3Key?: string;
  description?: string;
  tags?: string[];
  metadata?: {
    pageCount?: number;
    resolution?: string;
    duration?: number;
  };
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  s3Key: string;
  uploadedBy: string;
  uploadedDate: Date;
  fileSize: number;
  changeLog?: string;
}

export interface AuditLog {
  id: string;
  documentId: string;
  action: 'uploaded' | 'verified' | 'approved' | 'rejected' | 'downloaded' | 'archived' | 'restored';
  performedBy: string;
  performedDate: Date;
  remarks?: string;
  ipAddress?: string;
}

export interface DocumentFilter {
  projectId?: string;
  parcelId?: string;
  category?: DocumentCategory;
  status?: DocumentStatus;
  uploadedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  searchQuery?: string;
}

interface DocumentStore {
  documents: Document[];
  auditLogs: AuditLog[];
  loading: boolean;
  error?: string;
  filters: DocumentFilter;
  selectedDocument: Document | null;
  fetchDocuments: (filters?: DocumentFilter) => Promise<void>;
  fetchAuditLogs: (documentId: string) => Promise<void>;
  uploadDocument: (file: File, metadata: Partial<Document>) => Promise<Document>;
  updateDocumentStatus: (documentId: string, status: DocumentStatus, remarks?: string) => Promise<void>;
  verifyDocument: (documentId: string, remarks?: string) => Promise<void>;
  approveDocument: (documentId: string, remarks?: string) => Promise<void>;
  rejectDocument: (documentId: string, remarks: string) => Promise<void>;
  downloadDocument: (documentId: string) => Promise<void>;
  archiveDocument: (documentId: string) => Promise<void>;
  getDocumentVersions: (documentId: string) => Promise<DocumentVersion[]>;
  searchDocuments: (query: string, filters?: DocumentFilter) => Promise<void>;
  setSelectedDocument: (document: Document | null) => void;
  setFilters: (filters: DocumentFilter) => void;
}

const generateMockDocuments = (): Document[] => {
  const categories: DocumentCategory[] = [
    'project_proposal',
    'land_records',
    'survey_documents',
    'notifications',
    'awards',
    'compensation_documents',
    'possession_documents',
    'rr_documents',
    'legal_documents',
    'field_verification',
  ];

  const statuses: DocumentStatus[] = ['uploaded', 'pending_verification', 'verified', 'approved', 'rejected', 'archived'];

  return Array.from({ length: 40 }, (_, index) => ({
    id: `DOC-${String(index + 1).padStart(5, '0')}`,
    documentId: `DOC-ID-${String(index + 1).padStart(6, '0')}`,
    projectId: 'PROJ-2024-001',
    parcelId: index % 3 === 0 ? `PARCEL-${String((index % 10) + 1).padStart(5, '0')}` : undefined,
    category: categories[index % categories.length],
    fileName: `document-${index + 1}.pdf`,
    fileSize: 500000 + Math.random() * 5000000,
    fileType: 'application/pdf',
    status: statuses[index % statuses.length],
    version: 1 + (index % 3),
    uploadedBy: `Officer-${(index % 5) + 1}`,
    uploadedDate: new Date(2024, 0, 1 + (index % 30)),
    verifiedBy: index % 2 === 0 ? `Verifier-${(index % 3) + 1}` : undefined,
    verificationDate: index % 2 === 0 ? new Date(2024, 0, 5 + (index % 25)) : undefined,
    approvedBy: index % 4 === 0 ? `Approver-${(index % 2) + 1}` : undefined,
    approvalDate: index % 4 === 0 ? new Date(2024, 0, 10 + (index % 20)) : undefined,
    s3Key: `documents/PROJ-2024-001/document-${index + 1}.pdf`,
    description: `Document related to land acquisition project - ${categories[index % categories.length].replace(/_/g, ' ')}`,
    tags: [
      categories[index % categories.length],
      'verification_pending' === statuses[index % statuses.length] ? 'pending' : 'processed',
      `priority-${(index % 3) + 1}`,
    ],
    metadata: {
      pageCount: 5 + (index % 20),
      resolution: '300 DPI',
    },
  }));
};

const generateMockAuditLogs = (documentId: string): AuditLog[] => {
  const actions: AuditLog['action'][] = ['uploaded', 'verified', 'approved', 'downloaded', 'archived'];
  const today = new Date();

  return [
    {
      id: `AUDIT-${documentId}-1`,
      documentId,
      action: 'uploaded',
      performedBy: 'Officer-1',
      performedDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      remarks: 'Document uploaded for verification',
      ipAddress: '192.168.1.100',
    },
    {
      id: `AUDIT-${documentId}-2`,
      documentId,
      action: 'verified',
      performedBy: 'Verifier-1',
      performedDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      remarks: 'Document verified and approved for processing',
      ipAddress: '192.168.1.101',
    },
    {
      id: `AUDIT-${documentId}-3`,
      documentId,
      action: 'approved',
      performedBy: 'Approver-1',
      performedDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      remarks: 'Officially approved by authority',
      ipAddress: '192.168.1.102',
    },
    {
      id: `AUDIT-${documentId}-4`,
      documentId,
      action: 'downloaded',
      performedBy: 'Officer-2',
      performedDate: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.103',
    },
  ];
};

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  auditLogs: [],
  loading: false,
  error: undefined,
  filters: {},
  selectedDocument: null,

  fetchDocuments: async (filters?: DocumentFilter) => {
    set({ loading: true, error: undefined });
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      let documents = generateMockDocuments();

      if (filters) {
        if (filters.projectId) {
          documents = documents.filter(d => d.projectId === filters.projectId);
        }
        if (filters.category) {
          documents = documents.filter(d => d.category === filters.category);
        }
        if (filters.status) {
          documents = documents.filter(d => d.status === filters.status);
        }
        if (filters.searchQuery) {
          documents = documents.filter(
            d => d.fileName.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
                 d.description?.toLowerCase().includes(filters.searchQuery!.toLowerCase())
          );
        }
      }

      set({ documents, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch documents' });
    }
  },

  fetchAuditLogs: async (documentId: string) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const auditLogs = generateMockAuditLogs(documentId);
      set({ auditLogs, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Failed to fetch audit logs' });
    }
  },

  uploadDocument: async (file: File, metadata: Partial<Document>) => {
    const now = new Date();
    const newDocument: Document = {
      id: `DOC-${String(Math.random() * 100000).padStart(5, '0')}`,
      documentId: `DOC-ID-${String(Math.random() * 1000000).padStart(6, '0')}`,
      projectId: metadata.projectId || 'PROJ-2024-001',
      parcelId: metadata.parcelId,
      category: metadata.category || 'legal_documents',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      status: 'uploaded',
      version: 1,
      uploadedBy: metadata.uploadedBy || 'Current User',
      uploadedDate: now,
      s3Key: `documents/${metadata.projectId}/v1/${file.name}`,
      description: metadata.description,
      tags: metadata.tags,
    };

    set((state) => ({
      documents: [...state.documents, newDocument],
    }));

    return newDocument;
  },

  updateDocumentStatus: async (documentId: string, status: DocumentStatus, remarks?: string) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId ? { ...d, status } : d
      ),
    }));
  },

  verifyDocument: async (documentId: string, remarks?: string) => {
    set((state) => {
      const document = state.documents.find(d => d.id === documentId);
      if (!document) return state;

      return {
        documents: state.documents.map((d) =>
          d.id === documentId
            ? {
                ...d,
                status: 'verified',
                verifiedBy: 'Current Verifier',
                verificationDate: new Date(),
              }
            : d
        ),
        auditLogs: [
          ...state.auditLogs,
          {
            id: `AUDIT-${documentId}-${Date.now()}`,
            documentId,
            action: 'verified',
            performedBy: 'Current Verifier',
            performedDate: new Date(),
            remarks,
          },
        ],
      };
    });
  },

  approveDocument: async (documentId: string, remarks?: string) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? {
              ...d,
              status: 'approved',
              approvedBy: 'Current Approver',
              approvalDate: new Date(),
            }
          : d
      ),
      auditLogs: [
        ...state.auditLogs,
        {
          id: `AUDIT-${documentId}-${Date.now()}`,
          documentId,
          action: 'approved',
          performedBy: 'Current Approver',
          performedDate: new Date(),
          remarks,
        },
      ],
    }));
  },

  rejectDocument: async (documentId: string, remarks: string) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId ? { ...d, status: 'rejected' } : d
      ),
      auditLogs: [
        ...state.auditLogs,
        {
          id: `AUDIT-${documentId}-${Date.now()}`,
          documentId,
          action: 'rejected',
          performedBy: 'Current User',
          performedDate: new Date(),
          remarks,
        },
      ],
    }));
  },

  downloadDocument: async (documentId: string) => {
    const document = get().documents.find(d => d.id === documentId);
    if (!document) throw new Error('Document not found');

    set((state) => ({
      auditLogs: [
        ...state.auditLogs,
        {
          id: `AUDIT-${documentId}-${Date.now()}`,
          documentId,
          action: 'downloaded',
          performedBy: 'Current User',
          performedDate: new Date(),
        },
      ],
    }));
  },

  archiveDocument: async (documentId: string) => {
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId ? { ...d, status: 'archived' } : d
      ),
    }));
  },

  getDocumentVersions: async (documentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: `VER-${documentId}-1`,
        documentId,
        version: 1,
        s3Key: `documents/version-1.pdf`,
        uploadedBy: 'Officer-1',
        uploadedDate: new Date(2024, 0, 1),
        fileSize: 500000,
        changeLog: 'Initial upload',
      },
      {
        id: `VER-${documentId}-2`,
        documentId,
        version: 2,
        s3Key: `documents/version-2.pdf`,
        uploadedBy: 'Officer-2',
        uploadedDate: new Date(2024, 0, 10),
        fileSize: 520000,
        changeLog: 'Updated with corrections',
      },
    ];
  },

  searchDocuments: async (query: string, filters?: DocumentFilter) => {
    set({ loading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      let documents = generateMockDocuments();
      documents = documents.filter(
        d =>
          d.fileName.toLowerCase().includes(query.toLowerCase()) ||
          d.description?.toLowerCase().includes(query.toLowerCase()) ||
          d.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

      if (filters) {
        if (filters.projectId) documents = documents.filter(d => d.projectId === filters.projectId);
        if (filters.category) documents = documents.filter(d => d.category === filters.category);
        if (filters.status) documents = documents.filter(d => d.status === filters.status);
      }

      set({ documents, loading: false });
    } catch (error) {
      set({ loading: false, error: 'Search failed' });
    }
  },

  setSelectedDocument: (document: Document | null) => {
    set({ selectedDocument: document });
  },

  setFilters: (filters: DocumentFilter) => {
    set({ filters });
  },
}));
