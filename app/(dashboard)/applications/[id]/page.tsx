'use client'

import { use, useState } from "react";
import { ArrowLeft, Calendar, CheckCircle2, Edit, ExternalLink, FileText, MapPin, Plus, Trash2, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ApplicationStatus, Interview, UpdateApplicationDto, CreateInterviewDto, UpdateInterviewDto } from "@/types";
import { useApplication, useUpdateApplication, useDeleteApplication } from "@/hooks/useApplications";
import { useCreateInterview, useUpdateInterview, useDeleteInterview } from "@/hooks/useInterviews";
import { EditApplicationModal } from "@/components/EditApplicationModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { InterviewModal } from "@/components/InterviewModal";
import { TagManager } from "@/components/TagManager";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHeader } from "@/components/PageHeader";
import { PageLoadingState } from "@/components/LoadingState";
import { AlertMessage } from "@/components/AlertMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { ThreePaneLayout } from "@/components/WorkspaceLayouts";

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
        onSuccess: () => router.push('/applications'),
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
    return <PageLoadingState />;
  }

  if (error) {
    return <AlertMessage variant="error">Failed to load application. Please try again.</AlertMessage>;
  }

  if (!application) {
    return (
      <EmptyState
        icon={FileText}
        title="Application not found"
        description="The application you're looking for does not exist or is no longer available."
        action={<Button asChild><Link href="/applications">Back to applications</Link></Button>}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={application.jobTitle}
        description={application.company}
        eyebrow={(
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Applications', href: '/applications' },
              { label: application.jobTitle },
            ]}
          />
        )}
        actions={(
          <>
            <Button asChild variant="outline">
              <Link href="/applications">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4" aria-hidden="true" />
              Edit
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          </>
        )}
      />

      <ThreePaneLayout
        className="three-pane-detail"
        left={(
          <Card className="mint-glow overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex min-w-0 gap-4 xl:block">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-foreground">
                  {application.company.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 xl:mt-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-foreground">{application.company}</h2>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
                    <span className="rounded-full border border-border bg-white/70 px-3 py-1">Applied {formatDate(application.applicationDate)}</span>
                    {application.location ? <span className="rounded-full border border-border bg-white/70 px-3 py-1">{application.location}</span> : null}
                    {application.salaryRange ? <span className="rounded-full border border-border bg-white/70 px-3 py-1">{application.salaryRange}</span> : null}
                  </div>
                </div>
              </div>
              <StatusTimeline status={application.status} applicationDate={application.applicationDate} />
            </CardContent>
          </Card>
        )}
        center={(
          <div className="space-y-6">
          <ApplicationTimeline
            status={application.status}
            applicationDate={application.applicationDate}
            interviews={application.interviews || []}
          />

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DetailItem icon={MapPin} label="Location" value={application.location || 'Not specified'} />
                <DetailItem icon={FileText} label="Salary Range" value={application.salaryRange || 'Not specified'} />
              </div>
              {application.jobLink ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Link</p>
                  <a
                    href={application.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    View job posting
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              ) : null}
              {application.description ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="mt-2 whitespace-pre-wrap rounded-3xl bg-accent/60 p-4 text-sm leading-6 text-foreground">{application.description}</p>
                </div>
              ) : null}
              {application.notes ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="mt-2 whitespace-pre-wrap rounded-3xl bg-accent/60 p-4 text-sm leading-6 text-foreground">{application.notes}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>Interviews</CardTitle>
              <Button size="sm" onClick={handleAddInterview}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add interview
              </Button>
            </CardHeader>
            <CardContent>
              {application.interviews && application.interviews.length > 0 ? (
                <div className="space-y-3">
                  {application.interviews.map((interview) => (
                    <div key={interview.id} className="rounded-3xl border border-border bg-white/72 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{interview.stage}</h3>
                          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" aria-hidden="true" />
                            {formatDate(interview.date)}
                          </p>
                          {interview.notes ? (
                            <p className="mt-3 rounded-2xl bg-accent/60 p-3 text-sm leading-6 text-muted-foreground">
                              {interview.notes}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setSelectedInterview(interview);
                            setIsInterviewModalOpen(true);
                          }}>
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {
                            setSelectedInterview(interview);
                            setIsDeleteInterviewDialogOpen(true);
                          }}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Calendar}
                  title="No interviews scheduled"
                  description="Add recruiter calls, technical rounds, and final interviews as they happen."
                  action={<Button onClick={handleAddInterview}>Add interview</Button>}
                />
              )}
            </CardContent>
          </Card>
          </div>
        )}

        right={(
          <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <TagManager applicationId={application.id} applicationTags={application.tags || []} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditModalOpen(true)}>
                <FileText className="h-4 w-4" aria-hidden="true" />
                Add note
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAddInterview}>
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Schedule interview
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-4 w-4" aria-hidden="true" />
                Update status
              </Button>
            </CardContent>
          </Card>
          </div>
        )}
      />

      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        application={application}
        onSubmit={handleUpdateApplication}
      />

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
    </>
  );
}

function StatusTimeline({ status, applicationDate }: { status: ApplicationStatus; applicationDate: string }) {
  const statuses: { label: string; matches: ApplicationStatus[] }[] = [
    { label: 'Saved', matches: ['WISHLIST'] },
    { label: 'Applied', matches: ['APPLIED'] },
    { label: 'Under Review', matches: ['INTERVIEW'] },
    { label: 'Offer', matches: ['OFFER', 'ACCEPTED'] },
    { label: 'Closed', matches: ['REJECTED'] },
  ];
  const activeIndex = Math.max(0, statuses.findIndex((step) => step.matches.includes(status)));

  return (
    <div className="mt-6 grid gap-3 md:grid-cols-5">
      {statuses.map((step, index) => {
        const complete = index <= activeIndex;
        return (
          <div key={step.label} className="flex gap-3 md:block">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${complete ? 'bg-primary text-primary-foreground' : 'bg-white/70 text-muted-foreground'}`}>
              {complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <span className="text-xs font-bold">{index + 1}</span>}
            </div>
            <div className="md:mt-2">
              <p className={`text-sm font-semibold ${complete ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</p>
              <p className="text-xs text-muted-foreground">{index === 1 ? new Date(applicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : complete ? 'In progress' : 'Pending'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-border bg-white/72 p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ApplicationTimeline({
  status,
  applicationDate,
  interviews,
}: {
  status: ApplicationStatus;
  applicationDate: string;
  interviews: Interview[];
}) {
  const sortedInterviews = [...interviews].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestInterview = sortedInterviews[0];
  const statusIsClosed = status === 'REJECTED' || status === 'ACCEPTED';
  const items = [
    {
      label: 'Submitted',
      date: applicationDate,
      body: 'Application added to your CareerFlow pipeline.',
      state: 'complete' as const,
    },
    {
      label: status === 'WISHLIST' ? 'Saved' : 'Review',
      date: applicationDate,
      body: status === 'WISHLIST' ? 'Saved for a future application decision.' : 'Resume and application materials are under review.',
      state: status === 'WISHLIST' ? 'current' as const : 'complete' as const,
    },
    {
      label: 'Interview',
      date: latestInterview?.date,
      body: latestInterview ? latestInterview.stage : 'Schedule recruiter calls, technical screens, and final rounds here.',
      state: status === 'INTERVIEW' || latestInterview ? 'current' as const : 'pending' as const,
    },
    {
      label: statusIsClosed ? 'Closed' : 'Offer',
      date: status === 'OFFER' || statusIsClosed ? applicationDate : undefined,
      body: statusIsClosed ? 'This opportunity is no longer active.' : 'Offer details and negotiation notes will appear here.',
      state: status === 'OFFER' || statusIsClosed ? 'current' as const : 'pending' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-9">
          <div className="absolute bottom-4 left-[1rem] top-4 w-0.5 rounded-full bg-secondary/20" />
          {items.map((item) => (
            <div key={item.label} className={`relative pb-8 last:pb-0 ${item.state === 'pending' ? 'opacity-55' : ''}`}>
              <div className={`absolute -left-9 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${
                item.state === 'complete'
                  ? 'bg-primary text-white'
                  : item.state === 'current'
                    ? 'border-2 border-primary bg-white text-primary shadow-[0_0_15px_rgba(0,104,95,0.2)]'
                    : 'bg-muted text-muted-foreground'
              }`}>
                {item.state === 'complete' ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <span className="h-2.5 w-2.5 rounded-full bg-current" />}
              </div>
              <h3 className={`text-sm font-bold ${item.state === 'current' ? 'text-primary' : 'text-foreground'}`}>{item.label}</h3>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                {item.date ? formatTimelineDate(item.date) : 'Pending'}
              </p>
              <div className={`mt-3 rounded-2xl border p-3 text-sm leading-6 ${
                item.state === 'current'
                  ? 'border-primary/20 bg-primary text-primary-foreground shadow-lg shadow-teal-900/10'
                  : 'border-teal-100/60 bg-teal-50/45 text-foreground'
              }`}>
                {item.body}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimelineDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
