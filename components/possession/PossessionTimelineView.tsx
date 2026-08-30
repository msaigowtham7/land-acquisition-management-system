'use client';

import { LandParcel, PossessionTimeline } from '@/store/possessionStore';
import { formatDate, formatDateTime } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PossessionTimelineProps {
  parcel: LandParcel;
  timeline: PossessionTimeline[];
}

const getStageIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    case 'pending':
      return <Clock className="w-6 h-6 text-blue-600" />;
    default:
      return <AlertCircle className="w-6 h-6 text-gray-400" />;
  }
};

export function PossessionTimelineView({ parcel, timeline }: PossessionTimelineProps) {
  return (
    <div className="space-y-6">
      {/* Parcel Info */}
      <div className="card p-6 bg-gov-50">
        <h3 className="text-xl font-bold text-gov-900 mb-4">Parcel: {parcel.parcelId}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gov-600">Survey Number</p>
            <p className="font-semibold text-gov-900">{parcel.surveyNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gov-600">Area</p>
            <p className="font-semibold text-gov-900">{parcel.area} hectares</p>
          </div>
          <div>
            <p className="text-sm text-gov-600">Location</p>
            <p className="font-semibold text-gov-900">{parcel.village}, {parcel.district}</p>
          </div>
          <div>
            <p className="text-sm text-gov-600">Status</p>
            <p className="font-semibold text-gov-900 capitalize">{parcel.possessionStatus.replace(/_/g, ' ')}</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gov-900 mb-6">Possession Timeline</h3>
        <div className="space-y-4">
          {timeline.map((stage, index) => (
            <div key={stage.id}>
              <div className="flex gap-4">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-current">
                    {getStageIcon(stage.status)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-1 h-12 bg-gray-300 mt-2" />
                  )}
                </div>

                {/* Stage Details */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gov-900">
                      {stage.stage}. {stage.stageName}
                    </h4>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stage.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {stage.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <p className="text-gray-600">Scheduled Date:</p>
                      <p className="font-medium text-gov-900">{formatDate(stage.scheduledDate)}</p>
                    </div>
                    {stage.completionDate && (
                      <div>
                        <p className="text-gray-600">Completed Date:</p>
                        <p className="font-medium text-green-600">{formatDate(stage.completionDate)}</p>
                      </div>
                    )}
                  </div>

                  {stage.remarks && (
                    <p className="text-sm text-gray-600 mt-2 italic">Remarks: {stage.remarks}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
