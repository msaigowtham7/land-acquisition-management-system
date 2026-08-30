'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PossessionStatistics } from '@/store/possessionStore';
import { CheckCircle, AlertCircle, Clock, AlertTriangle } from 'lucide-react';

interface PossessionStatisticsCardProps {
  statistics: PossessionStatistics | null;
  loading: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function PossessionStatisticsCard({ statistics, loading }: PossessionStatisticsCardProps) {
  if (loading || !statistics) {
    return <div className="card p-6 h-96 animate-pulse bg-gray-200" />;
  }

  const statusData = [
    {
      name: 'Completed',
      value: statistics.possessionCompleted,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      color: 'bg-green-100 border-green-300',
    },
    {
      name: 'Pending',
      value: statistics.possessionPending,
      icon: <Clock className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-100 border-blue-300',
    },
    {
      name: 'Notice Issued',
      value: statistics.noticeIssued,
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      color: 'bg-yellow-100 border-yellow-300',
    },
    {
      name: 'Disputed',
      value: statistics.disputedParcels,
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      color: 'bg-red-100 border-red-300',
    },
  ];

  const chartData = [
    { name: 'Completed', value: statistics.possessionCompleted },
    { name: 'Pending', value: statistics.possessionPending },
    { name: 'Disputed', value: statistics.disputedParcels },
  ];

  const stageData = [
    { name: 'Notice Issued', value: statistics.noticeIssued },
    { name: 'Ready for Possession', value: statistics.readyForPossession },
    { name: 'Compensation Pending', value: statistics.compensationPending },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusData.map((item, index) => (
          <div key={index} className={`card p-4 border-l-4 ${item.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{item.value}</p>
              </div>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gov-900">Overall Possession Progress</h3>
          <span className="text-2xl font-bold text-gov-900">{statistics.completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500"
            style={{ width: `${statistics.completionPercentage}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          {statistics.possessionCompleted} out of {statistics.totalParcels} parcels possess taken
        </p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution Pie Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-gov-900 mb-4">Possession Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stage Progress Bar Chart */}
        <div className="card p-6">
          <h3 className="font-semibold text-gov-900 mb-4">Possession Pipeline Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4 bg-purple-50 border-purple-200">
          <p className="text-sm text-purple-700 font-medium">Average Days for Possession</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{statistics.averageDaysForPossession} days</p>
        </div>
        <div className="card p-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-700 font-medium">Completion Rate</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{statistics.completionPercentage}%</p>
        </div>
        <div className="card p-4 bg-orange-50 border-orange-200">
          <p className="text-sm text-orange-700 font-medium">Total Parcels</p>
          <p className="text-2xl font-bold text-orange-900 mt-1">{statistics.totalParcels}</p>
        </div>
      </div>
    </div>
  );
}
