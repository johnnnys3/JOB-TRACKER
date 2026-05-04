'use client'

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Filter, LayoutGrid, List, MapPin, Plus, Search, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { Application, ApplicationStatus, CreateApplicationDto, statusOptions } from "@/types";
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
import { PageHeader } from "@/components/PageHeader";
import { PageLoadingState } from "@/components/LoadingState";
import { AlertMessage } from "@/components/AlertMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { ThreePaneLayout } from "@/components/WorkspaceLayouts";

export default function Applications() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const { data: applicationsData, isLoading, error } = useApplications({
    page,
    limit: 12,
    search: searchQuery || undefined,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const createApplicationMutation = useCreateApplication();

  const applications = useMemo(() => applicationsData?.data || [], [applicationsData?.data]);
  const totalPages = applicationsData?.totalPages || 1;
  const selectedApplication = applications.find((app) => app.id === selectedApplicationId) || applications[0];

  useEffect(() => {
    if (!applications.length) {
      setSelectedApplicationId(null);
      return;
    }

    if (!selectedApplicationId || !applications.some((app) => app.id === selectedApplicationId)) {
      setSelectedApplicationId(applications[0].id);
    }
  }, [applications, selectedApplicationId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPage(1);
  };

  if (isLoading) {
    return <PageLoadingState variant="table" />;
  }

  if (error) {
    return <AlertMessage variant="error" title="Applications could not load">Failed to load applications. Please try again.</AlertMessage>;
  }

  return (
    <>
      <PageHeader
        title="Applications"
        description="Filter, review, and maintain every opportunity in your active job-search pipeline."
        eyebrow={<Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Applications' }]} />}
        actions={(
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add application
          </Button>
        )}
      />

      <ThreePaneLayout
        className="three-pane-wide"
        left={(
          <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="text-base">Filter</CardTitle>
            <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground" htmlFor="application-search">Company or role</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="application-search"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Status</label>
              <Select value={statusFilter} onValueChange={(value: ApplicationStatus | "all") => {
                setStatusFilter(value);
                setPage(1);
              }}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">Job location</label>
              <div className="space-y-2">
                {['Remote', 'On-site', 'Hybrid'].map((location, index) => (
                  <label key={location} className="flex cursor-pointer items-center gap-3 rounded-xl px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                    <input type="checkbox" defaultChecked={index === 0} className="h-4 w-4 rounded border-teal-200 text-primary focus:ring-primary/20" />
                    {location}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">Employment type</label>
              <div className="flex flex-wrap gap-2">
                {['Full-time', 'Contract', 'Freelance'].map((type, index) => (
                  <button
                    key={type}
                    type="button"
                    className={index === 0
                      ? 'rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white'
                      : 'rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-teal-100'}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-teal-800 p-4 text-white shadow-lg shadow-teal-900/10">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Career Coach AI
              </div>
              <p className="mt-2 text-sm leading-6 text-white/82">
                Get targeted prompts for your next follow-up or interview prep.
              </p>
              <Button type="button" variant="outline" size="sm" className="mt-4 border-white/25 bg-white/15 text-white hover:bg-white/25">
                Start coaching
              </Button>
            </div>
          </CardContent>
          </Card>
        )}
        center={(
          <>
          {applications.length > 0 ? (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Active Applications</h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Tracking {applicationsData?.total || applications.length} ongoing opportunities</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" aria-label="Grid view">
                    <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" aria-label="List view">
                    <List className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {applications.map((app) => (
                  <ApplicationListCard
                    key={app.id}
                    application={app}
                    isSelected={selectedApplication?.id === app.id}
                    formatDate={formatDate}
                    onSelect={() => setSelectedApplicationId(app.id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No applications found"
              description="Adjust your search or filters, or add a new application to your pipeline."
              action={<Button onClick={() => setIsAddModalOpen(true)}>Add application</Button>}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <span className="text-sm font-medium text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(currentPage => Math.max(currentPage - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(currentPage => Math.min(currentPage + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          </>
        )}
        right={(
          <ApplicationPreview application={selectedApplication} formatDate={formatDate} />
        )}
      />

      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data: CreateApplicationDto) => {
          createApplicationMutation.mutate(data);
        }}
      />
    </>
  );
}

function ApplicationListCard({
  application,
  isSelected,
  formatDate,
  onSelect,
}: {
  application: Application;
  isSelected: boolean;
  formatDate: (dateString: string) => string;
  onSelect: () => void;
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect();
        }
      }}
      className={`rounded-3xl border p-5 shadow-[0_10px_30px_rgba(6,95,84,0.07)] transition-all focus-ring ${
        isSelected
          ? 'border-primary/45 bg-gradient-to-br from-white via-emerald-50 to-teal-50'
          : 'border-border bg-white/86 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white'
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
            {application.company.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-foreground">{application.jobTitle}</h3>
            <p className="mt-1 truncate text-sm font-medium text-muted-foreground">{application.company}</p>
          </div>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
        <MetaPill icon={Calendar}>Applied {formatDate(application.applicationDate)}</MetaPill>
        {application.location ? <MetaPill icon={MapPin}>{application.location}</MetaPill> : null}
        {application.salaryRange ? <span className="rounded-full border border-border bg-white/75 px-3 py-1">{application.salaryRange}</span> : null}
      </div>

      {application.notes ? (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">{application.notes}</p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {(application.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
          ))}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={`/applications/${application.id}`}>View details</Link>
        </Button>
      </div>
    </article>
  );
}

function ApplicationPreview({ application, formatDate }: { application?: Application; formatDate: (dateString: string) => string }) {
  if (!application) {
    return (
      <EmptyState
        icon={Search}
        title="Select an application"
        description="Choose a role from the list to preview status, notes, tags, and next actions."
      />
    );
  }

  return (
    <Card className="sticky top-24 overflow-hidden">
      <CardHeader className="mint-glow border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground">
              {application.company.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate">{application.jobTitle}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{application.company}</p>
            </div>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-muted-foreground">
          {application.location ? <MetaPill icon={MapPin}>{application.location}</MetaPill> : null}
          {application.salaryRange ? <span className="rounded-full border border-border bg-white/75 px-3 py-1">{application.salaryRange}</span> : null}
          <MetaPill icon={Calendar}>{formatDate(application.applicationDate)}</MetaPill>
        </div>

        <StatusTimeline status={application.status} />

        <div>
          <h3 className="text-sm font-semibold text-foreground">Summary</h3>
          <p className="mt-2 line-clamp-5 text-sm leading-6 text-muted-foreground">
            {application.description || application.notes || 'Add notes or a description to keep context close to this opportunity.'}
          </p>
        </div>

        {(application.tags || []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {(application.tags || []).map((tag) => (
              <span key={tag} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">{tag}</span>
            ))}
          </div>
        ) : null}

        <div className="grid gap-2">
          <Button asChild>
            <Link href={`/applications/${application.id}`}>View full details</Link>
          </Button>
          {application.jobLink ? (
            <Button asChild variant="outline">
              <a href={application.jobLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Open job post
              </a>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusTimeline({ status }: { status: ApplicationStatus }) {
  const steps: { label: string; statuses: ApplicationStatus[] }[] = [
    { label: 'Saved', statuses: ['WISHLIST'] },
    { label: 'Applied', statuses: ['APPLIED'] },
    { label: 'Review', statuses: ['INTERVIEW'] },
    { label: 'Offer', statuses: ['OFFER', 'ACCEPTED'] },
  ];
  const activeIndex = Math.max(0, steps.findIndex((step) => step.statuses.includes(status)));

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Status timeline</h3>
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const complete = index <= activeIndex;
          return (
            <div key={step.label}>
              <div className={`h-2 rounded-full ${complete ? 'bg-primary' : 'bg-muted'}`} />
              <p className={`mt-2 text-xs font-semibold ${complete ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetaPill({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/75 px-3 py-1">
      <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      {children}
    </span>
  );
}
