'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { RRStatistics } from '@/store/rrStore';
import { formatCurrency } from '@/lib/utils';

interface RRStatisticsCardProps {
  statistics: RRStatistics | null;
  loading: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export function RRStatisticsCard({ statistics, loading }: RRStatisticsCardProps) {
  if (loading || !statistics) {
    return <div className="card p-6 h-96 animate-pulse bg-gray-200" />;
  }

  const progressData = [
    {
      name: 'R&R Completed',
      value: statistics.rrCompleted,
      percentage: Math.round((statistics.rrCompleted / statistics.totalAffectedFamilies) * 100),
    },
    {
      name: 'R&R Pending',
      value: statistics.rrPending,
      percentage: Math.round((statistics.rrPending / statistics.totalAffectedFamilies) * 100),
    },
  ];

  const assistanceData = [
    { name: 'Houses Constructed', value: statistics.housesConstructed },
    { name: 'Jobs Placed', value: statistics.jobsPlaced },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <p className="text-sm font-medium text-blue-700">Total Affected Families</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">{statistics.totalAffectedFamilies}</p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <p className="text-sm font-medium text-green-700">R&R Completed</p>
          <p className="text-3xl font-bold text-green-900 mt-2">{statistics.rrCompleted}</p>
          <p className="text-xs text-green-700 mt-1">
            {Math.round((statistics.rrCompleted / statistics.totalAffectedFamilies) * 100)}% complete
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <p className="text-sm font-medium text-orange-700">Compensation Disbursed</p>
          <p className="text-xl font-bold text-orange-900 mt-2">
            {formatCurrency(statistics.totalCompensationDisbursed)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Progress Pie Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-gov-900 mb-4">R&R Progress</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={progressData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Assistance Bar Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-gov-900 mb-4">Assistance Provided</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={assistanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-4 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-700 font-medium">Total Displaced Families</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{statistics.totalDisplacedFamilies}</p>
        </div>
        <div className="card p-4 bg-purple-50 border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Average R&R Duration</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{statistics.averageRRDuration} days</p>
        </div>
      </div>
    </div>
  );
}
