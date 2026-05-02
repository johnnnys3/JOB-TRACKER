'use client';

import { Calendar, CheckCircle, FileText, XCircle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Dashboard() {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8 w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const interviews = analytics.statusDistribution.INTERVIEW || 0;
  const offers = analytics.statusDistribution.OFFER || 0;
  const rejections = analytics.statusDistribution.REJECTED || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-neutral-900 mb-3">
          Your <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-lg text-neutral-600">Track and manage your job applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Applications"
          value={analytics.totalApplications}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Interviews"
          value={interviews}
          icon={Calendar}
          color="yellow"
        />
        <StatCard
          title="Offers"
          value={offers}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Rejections"
          value={rejections}
          icon={XCircle}
          color="red"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Recent Applications</h2>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          {analytics.recentApplications.length > 0 ? (
            analytics.recentApplications.map((app) => (
              <div key={app.id} className="p-4 border-b border-neutral-100 last:border-b-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-neutral-900">{app.jobTitle}</h3>
                    <p className="text-sm text-neutral-600">{app.company}</p>
                    <p className="text-xs text-neutral-500">{formatDate(app.applicationDate)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-sm text-neutral-500">No applications yet.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Upcoming Interviews</h2>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          {analytics.upcomingInterviews.length > 0 ? (
            analytics.upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-4 border-b border-neutral-100 last:border-b-0">
                <div>
                  <h3 className="font-medium text-neutral-900">{interview.stage}</h3>
                  <p className="text-sm text-neutral-600">
                    {interview.application.company} - {interview.application.jobTitle}
                  </p>
                  <p className="text-xs text-neutral-500">{formatDate(interview.date)}</p>
                  {interview.notes && (
                    <p className="text-xs text-neutral-500 mt-1">Notes: {interview.notes}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-sm text-neutral-500">No upcoming interviews.</p>
          )}
        </div>
      </div>
    </div>
  );
}
