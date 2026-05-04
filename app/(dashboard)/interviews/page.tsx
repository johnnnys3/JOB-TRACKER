'use client';

import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, FileText, Plus, Search, Video, User, type LucideIcon } from 'lucide-react';

import { AlertMessage } from '@/components/AlertMessage';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { PageLoadingState } from '@/components/LoadingState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';

const calendarDays = Array.from({ length: 35 }, (_, index) => index - 5);

export default function InterviewsPage() {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return <PageLoadingState />;
  }

  if (error || !analytics) {
    return <AlertMessage variant="error">Failed to load interviews. Please try again.</AlertMessage>;
  }

  const upcoming = analytics.upcomingInterviews;
  const first = upcoming[0];
  const second = upcoming[1];

  return (
    <>
      <PageHeader
        title="Upcoming Interviews"
        description="Review your calendar, prep notes, and interview funnel from one focused view."
        actions={(
          <Button asChild>
            <Link href="/applications">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add Interview
            </Link>
          </Button>
        )}
      />

      <div className="interviews-grid">
        <section className="interviews-main">
          <Card>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Button type="button" variant="outline" size="icon" aria-label="Previous month">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </Button>
                <h2 className="text-2xl font-extrabold text-primary">October 2026</h2>
                <Button type="button" variant="outline" size="icon" aria-label="Next month">
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
              <div className="flex rounded-xl bg-muted p-1">
                {['Month', 'Week', 'Day'].map((item, index) => (
                  <button key={item} type="button" className={index === 0 ? 'rounded-lg bg-white px-4 py-1.5 text-xs font-bold text-primary shadow-sm' : 'px-4 py-1.5 text-xs font-bold text-muted-foreground'}>
                    {item}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-7 border-b border-slate-100">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                  <div key={day} className="py-3 text-center text-xs font-bold text-slate-400">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-slate-100">
                {calendarDays.map((dayNumber, index) => {
                  const day = dayNumber < 1 ? 25 + index : dayNumber;
                  const muted = dayNumber < 1 || day > 29;
                  const event = index === 8 ? first : index === 10 ? second : undefined;
                  return (
                    <div key={`${day}-${index}`} className={`min-h-[7.5rem] bg-white/70 p-2 transition-colors hover:bg-white ${muted ? 'text-slate-300' : 'text-slate-800'}`}>
                      <span className="text-xs font-bold">{day}</span>
                      {event ? (
                        <Link href={`/applications/${event.application.id}`} className="mt-2 block rounded-r-lg border-l-4 border-primary bg-primary/10 p-2 shadow-sm">
                          <p className="truncate text-[10px] font-bold text-primary">{formatTime(event.date)} - {event.application.company}</p>
                          <p className="truncate text-[9px] font-semibold text-teal-800">{event.application.jobTitle}</p>
                        </Link>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="interviews-side">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
              <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
              Today's Schedule
            </h3>
            <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>

          {upcoming.length > 0 ? (
            <div className="grid gap-4">
              {upcoming.slice(0, 3).map((interview, index) => (
                <InterviewBrief
                  key={interview.id}
                  applicationId={interview.application.id}
                  company={interview.application.company}
                  title={interview.application.jobTitle}
                  stage={interview.stage}
                  date={interview.date}
                  tone={index === 0 ? 'primary' : 'secondary'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="No interviews scheduled"
              description="Interview cards will appear here after you add them to applications."
              action={<Button asChild><Link href="/applications">Open applications</Link></Button>}
            />
          )}

          <Card className="bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-xl shadow-teal-900/10">
            <CardContent className="pt-6">
              <h4 className="mb-4 text-sm font-bold opacity-85">Interview Funnel</h4>
              <div className="space-y-4">
                <Progress label="Prep Modules" value="85%" width="85%" />
                <Progress label="Mock Sessions" value="60%" width="60%" />
                <Progress label="Follow-ups" value="40%" width="40%" />
              </div>
              <p className="mt-5 text-xs italic text-white/70">You have completed 12/14 prep modules for this week's interviews.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

function InterviewBrief({ applicationId, company, title, stage, date, tone }: { applicationId: string; company: string; title: string; stage: string; date: string; tone: 'primary' | 'secondary' }) {
  return (
    <Card className={`border-l-4 ${tone === 'primary' ? 'border-l-primary' : 'border-l-teal-300'}`}>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm">
              {company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-bold text-foreground">{title}</h4>
              <p className="text-sm text-muted-foreground">{company} - {stage}</p>
            </div>
          </div>
          <div className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Live</div>
        </div>
        <div className="mb-5 space-y-3">
          <MetaRow icon={CalendarDays}>{formatInterviewDate(date)}</MetaRow>
          <MetaRow icon={User}>Hiring team</MetaRow>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button asChild size="sm">
            <Link href={`/applications/${applicationId}`}>
              <Video className="h-4 w-4" aria-hidden="true" />
              Join
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/applications/${applicationId}`}>
              <FileText className="h-4 w-4" aria-hidden="true" />
              Prep
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function MetaRow({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
      {children}
    </div>
  );
}

function Progress({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] font-bold uppercase opacity-90">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
        <div className="h-full rounded-full bg-teal-200 shadow-[0_0_8px_rgba(98,250,227,0.5)]" style={{ width }} />
      </div>
    </div>
  );
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatInterviewDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}
