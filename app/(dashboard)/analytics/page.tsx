'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockApplications } from '@/mockData';

export default function Analytics() {
  const statusData = [
    { name: 'Applied', value: mockApplications.filter(app => app.status === 'applied').length, color: '#3b82f6' },
    { name: 'Interview', value: mockApplications.filter(app => app.status === 'interview').length, color: '#f59e0b' },
    { name: 'Offer', value: mockApplications.filter(app => app.status === 'offer').length, color: '#10b981' },
    { name: 'Rejected', value: mockApplications.filter(app => app.status === 'rejected').length, color: '#ef4444' },
  ];

  const monthlyData = mockApplications.reduce((acc: any[], app) => {
    const date = new Date(app.appliedDate);
    const month = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ month, count: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

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
          <p className="text-3xl font-bold text-neutral-900">{mockApplications.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Interview Rate</h3>
          <p className="text-3xl font-bold text-neutral-900">
            {Math.round((statusData.find(s => s.name === 'Interview')?.value || 0) / mockApplications.length * 100)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Offer Rate</h3>
          <p className="text-3xl font-bold text-neutral-900">
            {Math.round((statusData.find(s => s.name === 'Offer')?.value || 0) / mockApplications.length * 100)}%
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 className="text-sm font-medium text-neutral-500 mb-2">Active Applications</h3>
          <p className="text-3xl font-bold text-neutral-900">
            {statusData.find(s => s.name === 'Applied')?.value || 0 + statusData.find(s => s.name === 'Interview')?.value || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
