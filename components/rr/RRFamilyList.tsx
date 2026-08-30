'use client';

import { AffectedFamily } from '@/store/rrStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface RRFamilyListProps {
  families: AffectedFamily[];
  loading: boolean;
  onFamilyClick?: (family: AffectedFamily) => void;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'resettled':
      return <CheckCircle className="w-5 h-5 text-blue-600" />;
    case 'eligible':
      return <Clock className="w-5 h-5 text-yellow-600" />;
    default:
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'resettled':
      return 'bg-blue-100 text-blue-800';
    case 'eligible':
      return 'bg-yellow-100 text-yellow-800';
    case 'partially_provided':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function RRFamilyList({ families, loading, onFamilyClick }: RRFamilyListProps) {
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
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Family ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Family Head</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Location</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Housing</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Package</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gov-800">Disbursed</th>
          </tr>
        </thead>
        <tbody>
          {families.map((family) => (
            <tr
              key={family.id}
              onClick={() => onFamilyClick?.(family)}
              className="border-b border-gov-200 hover:bg-gov-50 transition cursor-pointer"
            >
              <td className="px-4 py-3 text-sm font-medium text-gov-900">{family.familyRefId}</td>
              <td className="px-4 py-3 text-sm text-gov-700">{family.familyHead}</td>
              <td className="px-4 py-3 text-sm text-gov-700">
                {family.village}, {family.district}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(family.resettlementStatus)}
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(family.resettlementStatus)}`}>
                    {family.resettlementStatus.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
                  {family.housingStatus.replace(/_/g, ' ').toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gov-900">
                {formatCurrency(family.rrPackage.totalPackage)}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-green-600">
                {formatCurrency(family.financialAssistance.disburseAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
