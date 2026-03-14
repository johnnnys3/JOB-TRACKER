import { useParams, Link } from "react-router";
import { ArrowLeft, ExternalLink, MapPin, Calendar, DollarSign, Edit } from "lucide-react";
import { Button } from "../components/ui/button";
import { StatusBadge } from "../components/StatusBadge";
import { mockApplications } from "../data/mockData";
import { useState } from "react";
import { ApplicationStatus } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export function ApplicationDetail() {
  const { id } = useParams();
  const application = mockApplications.find((app) => app.id === id);
  const [status, setStatus] = useState(application?.status || "applied");

  if (!application) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <p className="text-neutral-600 mb-4">Application not found</p>
          <Link to="/applications">
            <Button variant="outline">Back to Applications</Button>
          </Link>
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
      {/* Back Button */}
      <Link to="/applications" className="inline-flex items-center gap-2 text-neutral-600 hover:text-teal-600 mb-8 font-medium transition-colors">
        <ArrowLeft className="w-5 h-5" />
        Back to Applications
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-white to-teal-50/30 rounded-3xl border border-neutral-200/50 p-8 mb-8 shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-3">{application.role}</h1>
            <p className="text-2xl text-neutral-600">{application.company}</p>
          </div>
          <StatusBadge status={status as ApplicationStatus} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {application.location && (
            <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wide">Location</p>
                <p className="font-semibold text-neutral-900">{application.location}</p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wide">Applied Date</p>
              <p className="font-semibold text-neutral-900">{formatDate(application.appliedDate)}</p>
            </div>
          </div>
          {application.salaryRange && (
            <div className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wide">Salary Range</p>
                <p className="font-semibold text-neutral-900">{application.salaryRange}</p>
              </div>
            </div>
          )}
        </div>

        {application.jobLink && (
          <div className="mt-6 pt-6 border-t border-neutral-200/50">
            <a
              href={application.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition-colors"
            >
              View Job Posting
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Update */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-8 shadow-lg">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Update Status</h2>
            <div className="flex items-center gap-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-64 h-12 rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" className="rounded-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 text-white shadow-lg shadow-teal-500/30 px-8 font-bold">
                Save
              </Button>
            </div>
          </div>

          {/* Timeline */}
          {application.timeline && application.timeline.length > 0 && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-8 shadow-lg">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Timeline</h2>
              <div className="space-y-6">
                {application.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-lg shadow-teal-500/30"></div>
                      {index < application.timeline!.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-teal-400/50 to-neutral-200 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className="font-bold text-neutral-900 text-lg">{event.event}</p>
                      <p className="text-sm text-neutral-500 mt-1 font-medium">
                        {formatDate(event.date)}
                      </p>
                      {event.description && (
                        <p className="text-neutral-600 mt-3 bg-neutral-50 p-3 rounded-xl">{event.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-neutral-200/50 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-neutral-900">Notes</h2>
                <Button variant="ghost" size="sm" className="rounded-full hover:bg-teal-50 hover:text-teal-600">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-neutral-600 leading-relaxed">{application.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Tags */}
          {application.tags && application.tags.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-1">Tags</h2>
                <p className="text-white/80 text-sm">Skills & Categories</p>
              </div>
              <div className="bg-white rounded-t-3xl p-6">
                <div className="flex flex-wrap gap-2">
                  {application.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-800 font-semibold rounded-full border border-neutral-200 hover:shadow-md transition-shadow"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interviews */}
          {application.interviews && application.interviews.length > 0 && (
            <div className="bg-gradient-to-br from-teal-400 to-teal-600 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-1">Interviews</h2>
                <p className="text-white/80 text-sm">{application.interviews.length} scheduled</p>
              </div>
              <div className="bg-white rounded-t-3xl p-6">
                <div className="space-y-4">
                  {application.interviews.map((interview) => (
                    <div key={interview.id} className="border-l-4 border-teal-500 pl-5 py-2 bg-teal-50/50 rounded-r-xl">
                      <p className="font-bold text-neutral-900 text-lg">{interview.type}</p>
                      <p className="text-neutral-600 mt-1 font-medium">
                        {formatDate(interview.date)}
                      </p>
                      {interview.interviewer && (
                        <p className="text-sm text-neutral-500 mt-2">
                          with {interview.interviewer}
                        </p>
                      )}
                      {interview.notes && (
                        <p className="text-sm text-neutral-600 mt-3 bg-white p-3 rounded-lg">
                          {interview.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}