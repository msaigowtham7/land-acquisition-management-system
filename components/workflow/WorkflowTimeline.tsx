'use client';

import { AlertCircle, CheckCircle, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { WorkflowStage } from '@/store/workflowStore';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface WorkflowTimelineProps {
  stages: WorkflowStage[];
  onStageClick?: (stage: WorkflowStage) => void;
}

export function WorkflowTimeline({ stages, onStageClick }: WorkflowTimelineProps) {
  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-6 h-6 text-blue-600 animate-spin" />;
      case 'delayed':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 border-blue-300';
      case 'delayed':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.id}>
          {/* Timeline Item */}
          <div
            onClick={() => onStageClick?.(stage)}
            className={cn(
              'card p-4 cursor-pointer transition hover:shadow-lg',
              getStatusColor(stage.status)
            )}
          >
            <div className="flex gap-4">
              {/* Timeline Icon */}
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-current">
                {getStageIcon(stage.status)}
              </div>

              {/* Stage Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gov-900 text-lg">
                      {stage.stage}. {stage.stageName}
                    </h3>
                    <p className="text-sm text-gov-600 mt-1">
                      {stage.responsibleDepartment} | {stage.responsibleOfficer}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <span className={cn(
                      'inline-block px-3 py-1 rounded-full font-semibold',
                      stage.status === 'completed' && 'bg-green-200 text-green-800',
                      stage.status === 'in_progress' && 'bg-blue-200 text-blue-800',
                      stage.status === 'delayed' && 'bg-red-200 text-red-800',
                      stage.status === 'pending' && 'bg-gray-200 text-gray-800',
                    )}>
                      {stage.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Timeline Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start Date</span>
                    <p className="font-medium">{stage.startDate ? formatDate(stage.startDate) : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Target Date</span>
                    <p className="font-medium">{formatDate(stage.targetDate)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Completion Date</span>
                    <p className="font-medium">{stage.completionDate ? formatDate(stage.completionDate) : 'Pending'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Days Status</span>
                    <p className={cn(
                      'font-medium',
                      stage.delayDuration > 0 ? 'text-red-600' : 'text-green-600'
                    )}>
                      {stage.delayDuration > 0 ? `${stage.delayDuration} days delayed` : `${stage.daysRemaining} days remaining`}
                    </p>
                  </div>
                </div>

                {/* Pending Actions */}
                {stage.pendingActions.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gov-900 mb-1">Pending Actions:</p>
                    <ul className="text-sm text-gov-700 list-disc list-inside">
                      {stage.pendingActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Remarks */}
                {stage.remarks && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                    <strong>Remarks:</strong> {stage.remarks}
                  </div>
                )}
              </div>

              {/* Expand Icon */}
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 self-center" />
            </div>
          </div>

          {/* Connector Line */}
          {index < stages.length - 1 && (
            <div className="flex justify-center py-1">
              <div className="w-1 h-6 bg-grad-neutral-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
