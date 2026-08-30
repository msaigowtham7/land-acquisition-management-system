'use client';

import { useEffect } from 'react';
import { useDocumentStore, DocumentFilter } from '@/store/documentStore';

export const useDocuments = () => {
  const store = useDocumentStore();

  useEffect(() => {
    store.fetchDocuments();
  }, [store]);

  return {
    documents: store.documents,
    auditLogs: store.auditLogs,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    selectedDocument: store.selectedDocument,
    fetchDocuments: store.fetchDocuments,
    fetchAuditLogs: store.fetchAuditLogs,
    uploadDocument: store.uploadDocument,
    updateDocumentStatus: store.updateDocumentStatus,
    verifyDocument: store.verifyDocument,
    approveDocument: store.approveDocument,
    rejectDocument: store.rejectDocument,
    downloadDocument: store.downloadDocument,
    archiveDocument: store.archiveDocument,
    getDocumentVersions: store.getDocumentVersions,
    searchDocuments: store.searchDocuments,
    setSelectedDocument: store.setSelectedDocument,
    setFilters: store.setFilters,
  };
};
