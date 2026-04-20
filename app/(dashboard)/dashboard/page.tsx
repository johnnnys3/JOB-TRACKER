import { FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/types";

export default function Dashboard() {
  const { data: applicationsData, isLoading, error } = useApplications({ limit: 100 });

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

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    );
  }

  const applications = applicationsData?.data || [];
  
  const totalApplications = applications.length;
  const interviews = applications.filter(app => app.status === "interview").length;
  const offers = applications.filter(app => app.status === "offer").length;
  const rejections = applications.filter(app => app.status === "rejected").length;

  // Get recent applications (last 5)
  const recentApplications = [...applications]
    .sort((a: Application, b: Application) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  // Get upcoming interviews
  const upcomingInterviews = applications
    .filter(app => app.interviews && app.interviews.length > 0)
    .flatMap(app => 
      app.interviews!.map(interview => ({
        ...interview,
        company: app.company,
        role: app.role,
        applicationId: app.id
      }))
    )
    .filter(interview => new Date(interview.date) >= new Date())
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-neutral-900 mb-3">
          Your <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Dashboard</span>
        </h1>
        <p className="text-lg text-neutral-600">Track and manage your job applications</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Applications"
          value={totalApplications}
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

      {/* Recent Applications */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Recent Applications</h2>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          {recentApplications.map((app) => (
            <div key={app.id} className="p-4 border-b border-neutral-100 last:border-b-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">{app.role}</h3>
                  <p className="text-sm text-neutral-600">{app.company}</p>
                  <p className="text-xs text-neutral-500">{formatDate(app.appliedDate)}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Upcoming Interviews</h2>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-4 border-b border-neutral-100 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-neutral-900">{interview.type}</h3>
                    <p className="text-sm text-neutral-600">{interview.company} - {interview.role}</p>
                    <p className="text-xs text-neutral-500">{formatDate(interview.date)}</p>
                    {interview.interviewer && (
                      <p className="text-xs text-neutral-500">Interviewer: {interview.interviewer}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
