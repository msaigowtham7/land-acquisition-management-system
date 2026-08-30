'use client';

import { AuditLog } from '@/store/documentStore';
import { formatDateTime } from '@/lib/utils';
import { User, Clock, MessageSquare, Globe } from 'lucide-react';

interface DocumentAuditProps {
  auditLogs: AuditLog[];
  loading: boolean;
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'uploaded':
      return 'bg-blue-100 text-blue-800';
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'downloaded':
      return 'bg-purple-100 text-purple-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

export function DocumentAudit({ auditLogs, loading }: DocumentAuditProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 h-16 animate-pulse bg-gray-200" />
        ))}
      </div>
    );
  }

  if (auditLogs.length === 0) {
    return (
      <div className="card p-8 text-center">
        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 font-medium">No audit logs available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {auditLogs.map((log, index) => (
        <div key={log.id} className="card p-4 border-l-4 border-gov-accent">
          <div className="flex gap-4 items-start">
            {/* Timeline */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gov-accent text-white flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              {index < auditLogs.length - 1 && (
                <div className="w-0.5 h-8 bg-gray-300 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getActionColor(log.action)}`}>
                  {log.action.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className="text-xs text-gray-600">{formatDateTime(log.performedDate)}</span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gov-900 font-medium">{log.performedBy}</span>
                </div>

                {log.remarks && (
                  <div className="flex gap-2 mt-2 pl-6">
                    <MessageSquare className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 italic">{log.remarks}</p>
                  </div>
                )}

                {log.ipAddress && (
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Globe className="w-3 h-3" />
                    <span>{log.ipAddress}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
