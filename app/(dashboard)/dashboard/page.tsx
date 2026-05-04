'use client';

import Link from 'next/link';
import { BarChart3, Calendar, CheckCircle, FileText, Plus, Tags, XCircle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { PageHeader } from '@/components/PageHeader';
import { PageLoadingState } from '@/components/LoadingState';
import { AlertMessage } from '@/components/AlertMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/EmptyState';
import { BentoGrid, BentoItem } from '@/components/WorkspaceLayouts';
import { useAuthContext } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { data: analytics, isLoading, error } = useAnalytics();
  const { user } = useAuthContext();

  if (isLoading) {
    return <PageLoadingState />;
  }

  if (error || !analytics) {
    return <AlertMessage variant="error">Failed to load dashboard data. Please try again.</AlertMessage>;
  }

  const interviews = analytics.statusDistribution.INTERVIEW || 0;
  const underReview = (analytics.statusDistribution.APPLIED || 0) + interviews;
  const offers = analytics.statusDistribution.OFFER || 0;
  const rejections = analytics.statusDistribution.REJECTED || 0;
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'there';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <PageHeader
        title={`Welcome back, ${displayName}`}
        description={`You have ${analytics.upcomingInterviews.length} interviews scheduled. Keep the next action visible.`}
        actions={(
          <Button asChild>
            <Link href="/applications">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add application
            </Link>
          </Button>
        )}
      />

      <BentoGrid>
        <BentoItem>
          <StatCard title="Total Applications" value={analytics.totalApplications} icon={FileText} color="blue" helperText="All tracked roles" />
        </BentoItem>
        <BentoItem>
          <StatCard title="Under Review" value={underReview} icon={BarChart3} color="blue" helperText="Applied or interviewing" />
        </BentoItem>
        <BentoItem>
          <StatCard title="Interviews" value={interviews} icon={Calendar} color="amber" helperText="Active interview stages" />
        </BentoItem>
        <BentoItem>
          <StatCard title="Offers" value={offers} icon={CheckCircle} color="green" />
        </BentoItem>

        <BentoItem span="hero">
          <PipelineSummary
            wishlist={analytics.statusDistribution.WISHLIST || 0}
            applied={analytics.statusDistribution.APPLIED || 0}
            interviews={interviews}
            offers={offers}
            closed={rejections + (analytics.statusDistribution.ACCEPTED || 0)}
          />
        </BentoItem>

        <BentoItem span="wide">
          <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Recent Applications</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/applications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {analytics.recentApplications.length > 0 ? (
              <div className="divide-y divide-border">
                {analytics.recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl px-2 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-accent/60"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">{app.jobTitle}</h3>
                      <p className="truncate text-sm text-muted-foreground">{app.company}</p>
                      <p className="mt-1 text-xs font-medium text-muted-foreground">Applied {formatDate(app.applicationDate)}</p>
                    </div>
                    <StatusBadge status={app.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No applications yet"
                description="Add your first application to start building a searchable job pipeline."
                action={<Button asChild><Link href="/applications">Add application</Link></Button>}
              />
            )}
          </CardContent>
          </Card>
        </BentoItem>

        <BentoItem span="wide">
          <Card className="h-full">
          <CardHeader>
            <CardTitle>Upcoming Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.upcomingInterviews.length > 0 ? (
              <div className="divide-y divide-border">
                {analytics.upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-foreground">{interview.stage}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {interview.application.company} - {interview.application.jobTitle}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatDate(interview.date)}</p>
                    {interview.notes ? (
                      <p className="mt-3 rounded-2xl bg-accent/60 p-3 text-sm text-muted-foreground">{interview.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Calendar}
                title="No upcoming interviews"
                description="Scheduled interviews will appear here once they are added to an application."
              />
            )}
          </CardContent>
          </Card>
        </BentoItem>

        <BentoItem>
          <StatCard title="Closed" value={rejections} icon={XCircle} color="red" helperText="Rejected opportunities" />
        </BentoItem>

        <BentoItem>
          <Card className="h-full">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { label: 'Add application', href: '/applications', icon: Plus },
              { label: 'Add interview', href: '/applications', icon: Calendar },
              { label: 'Manage tags', href: '/applications', icon: Tags },
              { label: 'View analytics', href: '/analytics', icon: BarChart3 },
            ].map((action) => (
              <Button key={action.label} asChild variant="outline" className="justify-start">
                <Link href={action.href}>
                  <action.icon className="h-4 w-4" aria-hidden="true" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
          </Card>
        </BentoItem>
      </BentoGrid>
    </>
  );
}

function PipelineSummary({
  wishlist,
  applied,
  interviews,
  offers,
  closed,
}: {
  wishlist: number;
  applied: number;
  interviews: number;
  offers: number;
  closed: number;
}) {
  const stages = [
    { label: 'Saved', count: wishlist },
    { label: 'Applied', count: applied },
    { label: 'Interview', count: interviews },
    { label: 'Offer', count: offers },
    { label: 'Closed', count: closed },
  ];
  const activeIndex = stages.reduce((last, stage, index) => (stage.count > 0 ? index : last), 0);

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Pipeline Summary</CardTitle>
          <p className="mt-1 text-sm font-medium text-muted-foreground">A quick read on where your search is moving.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/analytics">Insights</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative py-4">
          <div className="absolute left-0 right-0 top-[2.35rem] h-1 rounded-full bg-muted" />
          <div
            className="absolute left-0 top-[2.35rem] h-1 rounded-full bg-primary shadow-[0_0_10px_rgba(0,104,95,0.35)]"
            style={{ width: `${Math.max(14, (activeIndex / Math.max(stages.length - 1, 1)) * 100)}%` }}
          />
          <div className="relative z-10 grid grid-cols-5 gap-2">
            {stages.map((stage, index) => {
              const active = index <= activeIndex;
              return (
                <div key={stage.label} className="flex flex-col items-center text-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg ${active ? 'bg-primary text-white shadow-primary/25' : 'bg-white text-muted-foreground ring-1 ring-border'}`}>
                    {active ? <CheckCircle className="h-4 w-4" aria-hidden="true" /> : <span className="text-xs font-bold">{index + 1}</span>}
                  </div>
                  <span className={`mt-3 text-xs font-bold ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{stage.label}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{stage.count} jobs</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
