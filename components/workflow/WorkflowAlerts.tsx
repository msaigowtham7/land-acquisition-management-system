'use client';

import { AlertCircle, AlertTriangle, Clock, CheckCircle, X } from 'lucide-react';
import { WorkflowAlert } from '@/store/workflowStore';
import { formatDateTime } from '@/lib/utils';

interface WorkflowAlertsProps {
  alerts: WorkflowAlert[];
  onResolve?: (alertId: string) => void;
}

export function WorkflowAlerts({ alerts, onResolve }: WorkflowAlertsProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline_exceeded':
      case 'deadline_approaching':
        return <AlertTriangle className="w-5 h-5" />;
      case 'approval_pending':
      case 'compensation_pending':
      case 'possession_pending':
      case 'rr_pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);

  if (unresolvedAlerts.length === 0) {
    return (
      <div className="card p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <p className="text-gov-700 font-medium">No pending alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {unresolvedAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`card p-4 border-l-4 flex items-start gap-3 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold capitalize">
              {alert.type.replace(/_/g, ' ')}
            </h4>
            <p className="text-sm mt-1">{alert.message}</p>
            <p className="text-xs opacity-70 mt-1">{formatDateTime(alert.createdAt)}</p>
          </div>
          <button
            onClick={() => onResolve?.(alert.id)}
            className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition"
            title="Resolve alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
