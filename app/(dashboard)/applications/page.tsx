'use client'

import { useState } from "react";
import { Plus, Search, Filter, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { AddApplicationModal } from "@/components/AddApplicationModal";
import { mockApplications } from "@/mockData";
import { Application, ApplicationStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Applications() {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Applications</h1>
          <p className="text-neutral-600 mt-1">Manage your job applications</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Application
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <Input
              placeholder="Search by company, role, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={(value: ApplicationStatus | "all") => setStatusFilter(value)}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="withdrawn">Withdrawn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
        {filteredApplications.map((app) => (
          <div key={app.id} className="p-6 border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-neutral-900">{app.role}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-neutral-600 mb-1">{app.company}</p>
                <p className="text-sm text-neutral-500 mb-3">{app.location}</p>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <span>Applied: {formatDate(app.appliedDate)}</span>
                  {app.salaryRange && <span>• {app.salaryRange}</span>}
                  {app.jobLink && (
                    <a
                      href={app.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Job Link
                    </a>
                  )}
                </div>
                {app.notes && (
                  <p className="text-sm text-neutral-600 mt-3 bg-neutral-50 p-3 rounded-md">
                    {app.notes}
                  </p>
                )}
                {app.tags && app.tags.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplication={(newApp) => {
          setApplications([newApp, ...applications]);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
}
