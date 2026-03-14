'use client'

import { useState } from "react";
import { ArrowLeft, Calendar, User, FileText, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { mockApplications } from "@/mockData";
import { Application, Interview } from "@/types";

export default function ApplicationDetail({ params }: { params: { id: string } }) {
  const application = mockApplications.find(app => app.id === params.id);
  
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{application.role}</h1>
            <p className="text-xl text-neutral-600 mb-4">{application.company}</p>
            <div className="flex items-center gap-4">
              <StatusBadge status={application.status} />
              <span className="text-sm text-neutral-500">
                Applied: {formatDate(application.appliedDate)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
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
              <Button size="sm">
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
                        <h3 className="font-medium text-neutral-900">{interview.type}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(interview.date)}
                          </span>
                          {interview.interviewer && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {interview.interviewer}
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
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">No interviews scheduled yet.</p>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Timeline</h2>
            {application.timeline && application.timeline.length > 0 ? (
              <div className="space-y-4">
                {application.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                      {index < application.timeline!.length - 1 && (
                        <div className="w-0.5 h-16 bg-neutral-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-neutral-900">{event.event}</h3>
                        <span className="text-sm text-neutral-500">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-center py-8">No timeline events yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {application.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-neutral-100 text-neutral-600 text-sm rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <h3 className="font-semibold text-neutral-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Add Note
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Edit className="w-4 h-4 mr-2" />
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
