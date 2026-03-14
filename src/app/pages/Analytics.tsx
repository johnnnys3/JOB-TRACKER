import { mockApplications } from "../data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, Target, Clock } from "lucide-react";
import { StatCard } from "../components/StatCard";

export function Analytics() {
  // Calculate status distribution
  const statusData = [
    {
      name: "Applied",
      value: mockApplications.filter(app => app.status === "applied").length,
      color: "#3b82f6"
    },
    {
      name: "Interview",
      value: mockApplications.filter(app => app.status === "interview").length,
      color: "#facc15"
    },
    {
      name: "Offer",
      value: mockApplications.filter(app => app.status === "offer").length,
      color: "#22c55e"
    },
    {
      name: "Rejected",
      value: mockApplications.filter(app => app.status === "rejected").length,
      color: "#ef4444"
    },
  ];

  // Calculate applications by month
  const monthlyData: Record<string, number> = {};
  mockApplications.forEach(app => {
    const date = new Date(app.appliedDate);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
  });

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    applications: count
  }));

  // Calculate metrics
  const totalInterviews = mockApplications.reduce((acc, app) => 
    acc + (app.interviews?.length || 0), 0
  );
  
  const interviewRate = ((mockApplications.filter(app => 
    app.status === "interview" || app.status === "offer"
  ).length / mockApplications.length) * 100).toFixed(1);

  const offerRate = ((mockApplications.filter(app => 
    app.status === "offer"
  ).length / mockApplications.length) * 100).toFixed(1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-bold text-neutral-900 mb-3">
          <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Analytics</span>
        </h1>
        <p className="text-lg text-neutral-600">Track your application progress and success rates</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Interview Rate"
          value={`${interviewRate}%`}
          icon={TrendingUp}
          gradient="from-teal-400 to-teal-600"
        />
        <StatCard
          title="Offer Rate"
          value={`${offerRate}%`}
          icon={Target}
          gradient="from-green-400 to-green-600"
        />
        <StatCard
          title="Total Interviews"
          value={totalInterviews}
          icon={Clock}
          gradient="from-yellow-400 to-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applications by Month */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-8 shadow-xl">
          <h2 className="text-xl font-bold text-neutral-900 mb-8">Applications by Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontWeight: 600
                }}
              />
              <Bar dataKey="applications" fill="url(#colorGradient)" radius={[12, 12, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-8 shadow-xl">
          <h2 className="text-xl font-bold text-neutral-900 mb-8">Applications by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontWeight: 600
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Company Breakdown */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-8 mt-8 shadow-xl">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Top Companies</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-neutral-50 to-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/50">
              {mockApplications.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-transparent transition-all">
                  <td className="px-6 py-4 font-bold text-neutral-900">{app.company}</td>
                  <td className="px-6 py-4 text-neutral-600 font-semibold">1</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold shadow-lg ${
                      app.status === 'offer' ? 'bg-green-500 text-white shadow-green-500/30' :
                      app.status === 'interview' ? 'bg-yellow-400 text-neutral-900 shadow-yellow-400/30' :
                      app.status === 'rejected' ? 'bg-red-500 text-white shadow-red-500/30' :
                      'bg-blue-500 text-white shadow-blue-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}