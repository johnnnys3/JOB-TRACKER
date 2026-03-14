import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Filter, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { StatusBadge } from "../components/StatusBadge";
import { AddApplicationModal } from "../components/AddApplicationModal";
import { mockApplications } from "../data/mockData";
import { Application, ApplicationStatus } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function Applications() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddApplication = (newApp: Application) => {
    setApplications([newApp, ...applications]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-3">
            <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Applications</span>
          </h1>
          <p className="text-lg text-neutral-600">{filteredApplications.length} total applications</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30 rounded-full px-6 py-6 text-base font-bold">
          <Plus className="w-5 h-5" />
          Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-6 mb-6 shadow-lg">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              type="search"
              placeholder="Search by company, role, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full border-neutral-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}>
            <SelectTrigger className="w-64 h-12 rounded-full border-neutral-200">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-neutral-50 to-white border-b border-neutral-200/50">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-8 py-4 text-left text-xs font-bold text-neutral-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/50">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gradient-to-r hover:from-teal-50/30 hover:to-transparent transition-all duration-200">
                    <td className="px-8 py-5">
                      <div className="font-bold text-neutral-900">{app.company}</div>
                      {app.tags && app.tags.length > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          {app.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="inline-block px-2.5 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-medium text-neutral-900">{app.role}</div>
                      {app.salaryRange && (
                        <div className="text-sm text-neutral-500 mt-1">{app.salaryRange}</div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-neutral-600">{app.location}</td>
                    <td className="px-8 py-5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-8 py-5 text-neutral-600">{formatDate(app.appliedDate)}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <Link to={`/applications/${app.id}`}>
                          <Button variant="outline" size="sm" className="rounded-full font-semibold hover:bg-teal-50 hover:text-teal-600 hover:border-teal-300">
                            View
                          </Button>
                        </Link>
                        {app.jobLink && (
                          <a
                            href={app.jobLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-teal-600 transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <div className="text-neutral-400">
                      <p className="text-xl font-bold mb-2">No applications found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Application Modal */}
      <AddApplicationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddApplication}
      />
    </div>
  );
}