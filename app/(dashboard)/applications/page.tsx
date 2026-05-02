'use client'

import { useState } from "react";
import { Search, Filter, Plus, ExternalLink, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Application, ApplicationStatus, CreateApplicationDto } from "@/types";
import { useApplications, useCreateApplication } from "@/hooks/useApplications";
import { AddApplicationModal } from "@/components/AddApplicationModal";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { data: applicationsData, isLoading, error } = useApplications({
    page,
    limit: 12,
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const createApplicationMutation = useCreateApplication();
  
  const applications = applicationsData?.data || [];
  const totalPages = applicationsData?.totalPages || 1;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8 w-48"></div>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 h-10 bg-gray-200 rounded"></div>
            <div className="w-48 h-10 bg-gray-200 rounded"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load applications. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Applications' }
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-3">
            Your <span className="bg-gradient-to-r from-teal-400 to-teal-600 bg-clip-text text-transparent">Applications</span>
          </h1>
          <p className="text-lg text-neutral-600">Track and manage your job applications</p>
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
              placeholder="Search by company or job title..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={(value: ApplicationStatus | "all") => {
          setStatusFilter(value);
          setPage(1);
        }}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 text-sm sm:text-base">{app.jobTitle}</h3>
                <p className="text-neutral-600 text-sm">{app.company}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            
            <div className="space-y-2 text-sm text-neutral-600">
              <p className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Applied:</span>
                {formatDate(app.applicationDate)}
              </p>
              {app.location && (
                <p className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span className="hidden sm:inline">Location:</span>
                  {app.location}
                </p>
              )}
              {app.jobLink && (
                <a
                  href={app.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-teal-600 hover:text-teal-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">View Job</span>
                  <span className="sm:hidden">Job</span>
                </a>
              )}
            </div>
            {app.notes && (
              <p className="text-sm text-neutral-600 mt-3 bg-neutral-50 p-3 rounded-md">
                {app.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600">No applications match the current filters.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setPage(currentPage => Math.max(currentPage - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-neutral-600">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(currentPage => Math.min(currentPage + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data: CreateApplicationDto) => {
          createApplicationMutation.mutate(data);
        }}
      />
    </div>
  );
}
