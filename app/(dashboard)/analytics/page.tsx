'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { ApplicationStatus } from '@/types';

export default function Analytics() {
  const { data: analyticsData, isLoading: isLoadingAnalytics, error: analyticsError } = useAnalytics();

  if (isLoadingAnalytics) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8 w-48"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load analytics data. Please try again.</p>
        </div>
      </div>
    );
  }

  const analytics = analyticsData || {
    totalApplications: 0,
    totalInterviews: 0,
    applicationsByStatus: [],
    interviewsByStage: [],
    recentApplications: [],
    upcomingInterviews: [],
    statusDistribution: {},
    applicationTrends: [],
    interviewRate: 0,
    offerRate: 0,
    activeApplications: 0,
  };

  const statusData = [
    { status: 'APPLIED', name: 'Applied', color: '#3b82f6' },
    { status: 'INTERVIEW', name: 'Interview', color: '#f59e0b' },
    { status: 'OFFER', name: 'Offer', color: '#10b981' },
    { status: 'REJECTED', name: 'Rejected', color: '#ef4444' },
  ].map(item => ({
    ...item,
    value: analytics.statusDistribution[item.status as ApplicationStatus] || 0,
  }));

  const monthlyData = analytics.applicationTrends.map(item => ({
    month: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Analytics</h1>
        <p className="text-neutral-600">Track your job search progress and insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Application Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Applications */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Monthly Applications</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-neutral-900">{analytics.totalApplications}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Interview Rate</h3>
          <p className="text-3xl font-bold text-neutral-900">
            {analytics.totalApplications > 0 ? Math.round(analytics.interviewRate * 100) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Offer Rate</h3>
          <p className="text-3xl font-bold text-neutral-900">
            {analytics.totalApplications > 0 ? Math.round(analytics.offerRate * 100) : 0}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Active Applications</h3>
          <p className="text-3xl font-bold text-neutral-900">
            {analytics.activeApplications}
          </p>
        </div>
      </div>
    </div>
  );
}
