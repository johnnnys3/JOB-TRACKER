'use client'

import { use, useState } from "react";
import { ArrowLeft, Calendar, User, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Interview, UpdateApplicationDto, CreateInterviewDto, UpdateInterviewDto } from "@/types";
import { useApplication, useUpdateApplication, useDeleteApplication } from "@/hooks/useApplications";
import { useCreateInterview, useUpdateInterview, useDeleteInterview } from "@/hooks/useInterviews";
import Link from "next/link";
import { EditApplicationModal } from "@/components/EditApplicationModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InterviewModal } from "@/components/InterviewModal";
import { TagManager } from "@/components/TagManager";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useRouter } from "next/navigation";

export default function ApplicationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: application, isLoading, error } = useApplication(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isDeleteInterviewDialogOpen, setIsDeleteInterviewDialogOpen] = useState(false);
  
  const updateApplicationMutation = useUpdateApplication();
  const deleteApplicationMutation = useDeleteApplication();
  const createInterviewMutation = useCreateInterview();
  const updateInterviewMutation = useUpdateInterview();
  const deleteInterviewMutation = useDeleteInterview();
  const router = useRouter();

  const handleDeleteApplication = () => {
    if (application) {
      deleteApplicationMutation.mutate(application.id, {
        onSuccess: () => {
          router.push('/dashboard/applications');
        }
      });
    }
  };

  const handleUpdateApplication = (data: UpdateApplicationDto) => {
    if (application) {
      updateApplicationMutation.mutate({ id: application.id, data });
    }
  };

  const handleAddInterview = () => {
    setSelectedInterview(null);
    setIsInterviewModalOpen(true);
  };

  const handleEditInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsInterviewModalOpen(true);
  };

  const handleDeleteInterview = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsDeleteInterviewDialogOpen(true);
  };

  const handleCreateInterview = (data: CreateInterviewDto) => {
    if (application) {
      createInterviewMutation.mutate({ applicationId: application.id, data });
      setIsInterviewModalOpen(false);
    }
  };

  const handleUpdateInterview = (data: UpdateInterviewDto) => {
    if (selectedInterview && application) {
      updateInterviewMutation.mutate({ 
        interviewId: selectedInterview.id, 
        data, 
        applicationId: application.id 
      });
      setIsInterviewModalOpen(false);
    }
  };

  const handleDeleteInterviewConfirm = () => {
    if (selectedInterview && application) {
      deleteInterviewMutation.mutate({ 
        interviewId: selectedInterview.id, 
        applicationId: application.id 
      });
      setIsDeleteInterviewDialogOpen(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-8 w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Failed to load application. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Application Not Found</h1>
          <p className="text-neutral-600">The application you're looking for doesn't exist.</p>
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
            { label: 'Applications', href: '/dashboard/applications' },
            { label: application?.jobTitle || 'Application' }
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/applications">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Applications
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{application.jobTitle}</h1>
            <p className="text-xl text-neutral-600 mb-4">{application.company}</p>
            <div className="flex items-center gap-4">
              <StatusBadge status={application.status} />
              <span className="text-sm text-neutral-500">
                Applied: {formatDate(application.applicationDate)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Job Details</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-neutral-500">Location</span>
                <p className="text-neutral-900">{application.location}</p>
              </div>
              {application.salaryRange && (
                <div>
                  <span className="text-sm font-medium text-neutral-500">Salary Range</span>
                  <p className="text-neutral-900">{application.salaryRange}</p>
                </div>
              )}
              {application.jobLink && (
                <div>
                  <span className="text-sm font-medium text-neutral-500">Job Link</span>
                  <p>
                    <a
                      href={application.jobLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700"
                    >
                      View Job Posting
                    </a>
                  </p>
                </div>
              )}
              {application.notes && (
                <div>
                  <span className="text-sm font-medium text-neutral-500">Notes</span>
                  <p className="text-neutral-900 bg-neutral-50 p-3 rounded-md mt-1">
                    {application.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Interviews */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-900">Interviews</h2>
              <Button size="sm" onClick={handleAddInterview}>
                <Plus className="w-4 h-4 mr-2" />
                Add Interview
              </Button>
            </div>
            {application.interviews && application.interviews.length > 0 ? (
              <div className="space-y-4">
                {application.interviews.map((interview) => (
                  <div key={interview.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-neutral-900">{interview.stage}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(interview.date)}
                          </span>
                          {interview.notes && (
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              Notes
                            </span>
                          )}
                        </div>
                        {interview.notes && (
                          <p className="text-sm text-neutral-600 mt-3 bg-neutral-50 p-3 rounded-md">
                            {interview.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditInterview(interview)}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteInterview(interview)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">No interviews scheduled yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <TagManager
            applicationId={application.id}
            applicationTags={application?.tags || []}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditModalOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAddInterview}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        application={application}
        onSubmit={handleUpdateApplication}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteApplication}
        title="Delete Application"
        description="Are you sure you want to delete this application? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Interview Modal */}
      <InterviewModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        interview={selectedInterview}
        applicationId={id}
        onSubmit={(data) => {
          if (selectedInterview) {
            handleUpdateInterview(data as UpdateInterviewDto);
            return;
          }

          handleCreateInterview(data as CreateInterviewDto);
        }}
      />

      {/* Delete Interview Dialog */}
      <ConfirmDialog
        isOpen={isDeleteInterviewDialogOpen}
        onClose={() => setIsDeleteInterviewDialogOpen(false)}
        onConfirm={handleDeleteInterviewConfirm}
        title="Delete Interview"
        description="Are you sure you want to delete this interview? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
