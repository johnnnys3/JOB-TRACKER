import { FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { mockApplications } from "../data/mockData";
import { Link } from "react-router";
import { Application } from "../types";

export function Dashboard() {
  const totalApplications = mockApplications.length;
  const interviews = mockApplications.filter(app => app.status === "interview").length;
  const offers = mockApplications.filter(app => app.status === "offer").length;
  const rejections = mockApplications.filter(app => app.status === "rejected").length;

  // Get recent applications (last 5)
  const recentApplications = [...mockApplications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 5);

  // Get upcoming interviews
  const upcomingInterviews = mockApplications
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
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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
          trend={{ value: "12% from last month", isPositive: true }}
          gradient="from-teal-400 to-teal-600"
        />
        <StatCard
          title="Interviews"
          value={interviews}
          icon={Calendar}
          trend={{ value: "3 upcoming", isPositive: true }}
          gradient="from-yellow-400 to-orange-500"
        />
        <StatCard
          title="Offers"
          value={offers}
          icon={CheckCircle}
          gradient="from-green-400 to-green-600"
        />
        <StatCard
          title="Rejections"
          value={rejections}
          icon={XCircle}
          gradient="from-pink-400 to-pink-600"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 overflow-hidden shadow-xl">
            <div className="px-8 py-6 border-b border-neutral-200/50 flex items-center justify-between bg-gradient-to-r from-neutral-50 to-white">
              <h2 className="text-xl font-bold text-neutral-900">Recent Applications</h2>
              <Link to="/applications" className="text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-neutral-200/50">
              {recentApplications.map((app) => (
                <Link
                  key={app.id}
                  to={`/applications/${app.id}`}
                  className="block px-8 py-5 hover:bg-gradient-to-r hover:from-teal-50/50 hover:to-transparent transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-neutral-900 text-lg">{app.role}</h3>
                      <p className="text-neutral-600 mt-1">{app.company}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span className="font-medium">{app.location}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                    <span>Applied {formatDate(app.appliedDate)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-6">
              <h2 className="text-xl font-bold text-white mb-1">Upcoming Interviews</h2>
              <p className="text-white/80 text-sm">Don't miss these!</p>
            </div>
            <div className="bg-white rounded-t-3xl p-6 min-h-[300px]">
              {upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map((interview) => (
                    <Link
                      key={interview.id}
                      to={`/applications/${interview.applicationId}`}
                      className="block p-5 rounded-2xl border-2 border-neutral-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-200 bg-gradient-to-br from-white to-yellow-50/30"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-neutral-900 truncate">
                            {interview.company}
                          </p>
                          <p className="text-sm text-neutral-600 truncate">{interview.type}</p>
                          <p className="text-sm text-neutral-500 mt-2 font-medium">
                            {formatDate(interview.date)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500 font-medium">No upcoming interviews</p>
                  <p className="text-sm text-neutral-400 mt-1">Keep applying!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}