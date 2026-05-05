'use client'

import { BarChart3, Calendar, Clock, MessageSquare, Send, Star, type LucideIcon } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { PageHeader } from '@/components/PageHeader';
import { PageLoadingState } from '@/components/LoadingState';
import { AlertMessage } from '@/components/AlertMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Analytics() {
  const { data: analyticsData, isLoading: isLoadingAnalytics, error: analyticsError } = useAnalytics();

  if (isLoadingAnalytics) {
    return <PageLoadingState />;
  }

  if (analyticsError) {
    return <AlertMessage variant="error">Failed to load analytics data. Please try again.</AlertMessage>;
  }

  const analytics = analyticsData || {
    totalApplications: 0,
    totalInterviews: 0,
    applicationsByStatus: [],
    interviewsByStage: [],
    recentApplications: [],
    upcomingInterviews: [],
    statusDistribution: {},
    applicationTrends: [],
    interviewRate: 0,
    offerRate: 0,
    activeApplications: 0,
  };

  const trendData = analytics.applicationTrends.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: item.count,
  }));
  const interviews = analytics.totalInterviews || analytics.statusDistribution.INTERVIEW || 0;
  const offers = analytics.statusDistribution.OFFER || 0;
  const applied = analytics.statusDistribution.APPLIED || 0;
  const total = Math.max(analytics.totalApplications, 1);

  return (
    <>
      <PageHeader
        title="Performance Insights"
        description="Analyzing your journey from application to offer."
        actions={(
          <div className="inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-white/70 px-4 py-2 text-sm font-bold text-foreground shadow-sm backdrop-blur-md">
            <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
            Last 6 Months
          </div>
        )}
      />

      {analytics.totalApplications === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Not enough data yet"
          description="Track a few applications to unlock analytics about your search."
          action={<Button asChild><Link href="/applications">Add application</Link></Button>}
        />
      ) : null}

      <div className="analytics-shell-grid">
        <InsightMetric title="Total Apps" value={analytics.totalApplications} detail="+12% vs last mo" icon={Send} tone="teal" />
        <InsightMetric title="Interviews" value={interviews} detail={`${Math.round(analytics.interviewRate * 100)}% conversion`} icon={MessageSquare} tone="blue" />
        <InsightMetric title="Avg Response" value="5.2d" detail="-2 days vs avg" icon={Clock} tone="amber" />
        <InsightMetric title="Profile Score" value="94" detail="Top 5% user" icon={Star} tone="purple" />

        <Card className="analytics-velocity-card">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Application Velocity</CardTitle>
            <div className="flex gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Line</span>
              <span className="rounded-full border border-teal-100 px-3 py-1 text-xs font-bold text-muted-foreground">Bar</span>
            </div>
          </CardHeader>
          <CardContent>
            <VelocityChart data={trendData} />
          </CardContent>
        </Card>

        <Card className="analytics-source-card">
          <CardHeader>
            <CardTitle>Top Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <SourceDonut />
          </CardContent>
        </Card>

        <Card className="analytics-funnel-card">
          <CardHeader>
            <CardTitle>Pipeline Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelRows
              rows={[
                ['Applications', analytics.totalApplications, 100],
                ['Screening', applied + interviews, Math.round(((applied + interviews) / total) * 100)],
                ['Technical', interviews, Math.round((interviews / total) * 100)],
                ['Final Stage', offers, Math.round((offers / total) * 100)],
                ['Offers', offers, Math.round((offers / total) * 100)],
              ]}
            />
          </CardContent>
        </Card>

        <Card className="analytics-skill-card">
          <CardHeader>
            <CardTitle>Skill Proficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillPanel />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function InsightMetric({ title, value, detail, icon: Icon, tone }: { title: string; value: number | string; detail: string; icon: LucideIcon; tone: 'teal' | 'blue' | 'amber' | 'purple' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
    purple: 'bg-violet-50 text-violet-700',
  };
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-2 ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className={`text-xs font-bold ${tones[tone]} rounded-full px-2 py-1`}>{detail}</span>
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{title}</p>
      <h3 className="mt-1 text-4xl font-extrabold text-primary">{value}</h3>
    </Card>
  );
}

function VelocityChart({ data }: { data: { date: string; count: number }[] }) {
  const labels = data.length > 0 ? data.slice(-6).map((item) => item.date) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return (
    <div className="relative h-72 overflow-hidden rounded-2xl bg-white/35 p-4">
      <div className="absolute inset-4 flex flex-col justify-between">
        {[0, 1, 2, 3].map((line) => <div key={line} className="border-b border-slate-100" />)}
      </div>
      <svg className="absolute inset-4 h-[calc(100%-4rem)] w-[calc(100%-2rem)]" preserveAspectRatio="none" viewBox="0 0 1000 220">
        <defs>
          <linearGradient id="velocityGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6bd8cb" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6bd8cb" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,165 Q110,135 220,150 T440,110 T660,70 T840,90 T1000,48 L1000,220 L0,220 Z" fill="url(#velocityGradient)" />
        <path d="M0,165 Q110,135 220,150 T440,110 T660,70 T840,90 T1000,48" fill="none" stroke="#00685f" strokeLinecap="round" strokeWidth="5" />
      </svg>
      <div className="absolute inset-x-4 bottom-4 flex justify-between text-xs font-bold text-slate-400">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}

function SourceDonut() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-8 h-48 w-48">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e7eeff" strokeWidth="4" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00685f" strokeDasharray="45 55" strokeWidth="4" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6bd8cb" strokeDasharray="25 75" strokeDashoffset="-45" strokeWidth="4" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#d8e5e2" strokeDasharray="30 70" strokeDashoffset="-70" strokeWidth="4" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-primary">LinkedIn</span>
          <span className="text-xs font-semibold text-muted-foreground">45% total</span>
        </div>
      </div>
      <div className="w-full space-y-3">
        {[
          ['LinkedIn', '45%', 'bg-primary'],
          ['Indeed', '25%', 'bg-teal-300'],
          ['Referrals', '30%', 'bg-secondary/40'],
        ].map(([label, value, dot]) => (
          <div key={label} className="flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center"><span className={`mr-2 h-3 w-3 rounded-full ${dot}`} />{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelRows({ rows }: { rows: [string, number, number][] }) {
  return (
    <div className="space-y-4">
      {rows.map(([label, count, percent], index) => (
        <div key={label}>
          <div className="mb-1 flex items-end justify-between">
            <span className="text-sm font-bold text-primary">{label}</span>
            <span className="text-sm font-bold">{count}{index > 0 ? ` (${percent}%)` : ''}</span>
          </div>
          <div className="h-10 rounded-lg bg-teal-50">
            <div className="flex h-full items-center rounded-lg bg-primary px-4 opacity-100" style={{ width: `${Math.max(14, Math.min(100, percent))}%` }}>
              <div className="h-1 w-full rounded bg-white/25" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillPanel() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-5">
        {[
          ['Technical Knowledge', 88],
          ['Communication', 94],
          ['Problem Solving', 76],
        ].map(([label, value]) => (
          <div key={label as string}>
            <div className="mb-2 flex justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">{label}</span>
              <span className="text-xs font-bold text-primary">{value}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-teal-50">
              <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex min-h-48 items-center justify-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-teal-50">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-teal-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-teal-200">
              <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-teal-600/40" />
            </div>
          </div>
        </div>
        <span className="absolute top-2 text-[10px] font-black text-primary">CODE</span>
        <span className="absolute bottom-2 text-[10px] font-black text-primary">DESIGN</span>
        <span className="absolute left-3 text-[10px] font-black text-primary">UX</span>
        <span className="absolute right-3 text-[10px] font-black text-primary">DATA</span>
      </div>
    </div>
  );
}
