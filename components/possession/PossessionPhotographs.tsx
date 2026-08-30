'use client';

import { LandParcel, Photograph } from '@/store/possessionStore';
import { formatDateTime } from '@/lib/utils';
import { MapPin, Camera, User, Clock } from 'lucide-react';

interface PossessionPhotographsProps {
  parcel: LandParcel;
}

export function PossessionPhotographs({ parcel }: PossessionPhotographsProps) {
  return (
    <div className="space-y-6">
      {/* Photos Grid */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gov-900 mb-4">Field Photographs</h3>
        
        {parcel.photographs.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No photographs available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parcel.photographs.map((photo) => (
              <div key={photo.id} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition">
                {/* Photo Placeholder */}
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                  <span className="text-gray-500 ml-2">Image: {photo.id}</span>
                </div>

                {/* Photo Details */}
                <div className="p-4 bg-white">
                  <h4 className="font-semibold text-gov-900 mb-3">{photo.caption}</h4>
                  
                  <div className="space-y-2 text-sm">
                    {/* Uploaded By */}
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600">Uploaded by</p>
                        <p className="font-medium text-gov-900">{photo.uploadedBy}</p>
                      </div>
                    </div>

                    {/* Upload Date */}
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-600">Uploaded at</p>
                        <p className="font-medium text-gov-900">{formatDateTime(photo.uploadedAt)}</p>
                      </div>
                    </div>

                    {/* GPS Location */}
                    {photo.gpsLocation && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600">GPS Location</p>
                          <p className="font-medium text-gov-900 text-xs">
                            {photo.gpsLocation.latitude.toFixed(6)}, {photo.gpsLocation.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Field Verification Details */}
      {parcel.fieldVerification && (
        <div className="card p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Field Verification Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-blue-700 font-medium">Verification Officer</p>
              <p className="font-semibold text-blue-900">{parcel.fieldVerification.officerName}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Verification Date</p>
              <p className="font-semibold text-blue-900">{formatDateTime(parcel.fieldVerification.verificationDate)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">GPS Accuracy</p>
              <p className="font-semibold text-blue-900">±{parcel.fieldVerification.gpsLocation.accuracy}m</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-medium">Photos Count</p>
              <p className="font-semibold text-blue-900">{parcel.fieldVerification.photoCount}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-blue-700 font-medium mb-2">Verification Remarks</p>
            <p className="text-blue-900 bg-white p-3 rounded border border-blue-200">
              {parcel.fieldVerification.verificationRemarks}
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm text-blue-700 font-medium">Documentation Status</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
              parcel.fieldVerification.documentationComplete
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}>
              {parcel.fieldVerification.documentationComplete ? 'Complete' : 'Incomplete'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
