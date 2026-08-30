'use client';

import { Document, DocumentStatus } from '@/store/documentStore';
import { formatDate, formatFileSize } from '@/lib/utils';
import { FileText, Download, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  onDownload?: (documentId: string) => void;
  onPreview?: (document: Document) => void;
  onVerify?: (documentId: string) => void;
  onApprove?: (documentId: string) => void;
}

const getStatusIcon = (status: DocumentStatus) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'verified':
      return <CheckCircle className="w-5 h-5 text-blue-600" />;
    case 'pending_verification':
      return <Clock className="w-5 h-5 text-yellow-600" />;
    case 'rejected':
      return <AlertCircle className="w-5 h-5 text-red-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-400" />;
  }
};

const getStatusColor = (status: DocumentStatus) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'verified':
      return 'bg-blue-100 text-blue-800';
    case 'pending_verification':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

export function DocumentList({
  documents,
  loading,
  onDownload,
  onPreview,
  onVerify,
  onApprove,
}: DocumentListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="card p-4 h-20 animate-pulse bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gov-100 border-b-2 border-gov-300">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Document</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Category</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Size</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Uploaded By</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} className="border-b border-gov-200 hover:bg-gov-50 transition">
              <td className="px-4 py-3 text-sm font-medium text-gov-900">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>{document.fileName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gov-700 capitalize">
                {document.category.replace(/_/g, ' ')}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(document.status)}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(document.status)}`}>
                    {document.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gov-700">
                {formatFileSize(document.fileSize)}
              </td>
              <td className="px-4 py-3 text-sm text-gov-700">{document.uploadedBy}</td>
              <td className="px-4 py-3 text-sm text-gov-700">{formatDate(document.uploadedDate)}</td>
              <td className="px-4 py-3 text-sm space-x-2">
                <button
                  onClick={() => onPreview?.(document)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDownload?.(document.id)}
                  className="p-1 text-green-600 hover:bg-green-100 rounded transition"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                {document.status === 'uploaded' && (
                  <button
                    onClick={() => onVerify?.(document.id)}
                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition"
                  >
                    Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
