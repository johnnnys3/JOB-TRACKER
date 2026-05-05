import Link from 'next/link'
import { ArrowRight, BarChart3, CalendarCheck, CheckCircle2, Search, Sparkles } from 'lucide-react'

import { Navbar } from '@/components/Navbar'

const previewApplications = [
  { company: 'Northstar Labs', initial: 'N', role: 'Product Designer', status: 'Interview', tone: 'interview' },
  { company: 'Atlas Cloud', initial: 'A', role: 'Frontend Engineer', status: 'Applied', tone: 'applied' },
  { company: 'Bright Finance', initial: 'B', role: 'Data Analyst', status: 'Offer', tone: 'offer' },
]

const progressSteps = [
  { label: 'Saved', complete: true },
  { label: 'Applied', complete: true },
  { label: 'Under review', complete: true },
  { label: 'Interview', complete: false },
  { label: 'Offer', complete: false },
]

export function HeroSection() {
  return (
    <section className="landing-shell">
      <Navbar />

      <div className="landing-container">
        <div className="landing-hero-grid">
          <div className="landing-hero-copy">
            <div className="landing-badge">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI-powered job tracking
            </div>

            <h1 className="landing-title">Organizing your job search with <span>AI-driven focus</span></h1>
            <p className="landing-subtitle">
              CareerFlow turns scattered applications, interviews, notes, and follow-ups into one calm workspace built for serious job seekers.
            </p>

            <div className="landing-cta-row">
              <Link href="/register" className="landing-cta landing-cta-primary">
                Start tracking
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/login" className="landing-cta landing-cta-secondary">
                View demo
              </Link>
            </div>

            <div className="landing-trust-row" aria-label="Customer activity">
              <div className="landing-avatar-stack">
                {['AR', 'MC', 'JL'].map((initials) => (
                  <span key={initials}>{initials}</span>
                ))}
              </div>
              <p>Joined by 2,000+ professionals this month</p>
            </div>
          </div>

          <div className="preview-card" aria-label="CareerFlow dashboard preview">
          <div className="preview-topbar">
            <div>
              <p className="preview-title">Weekly Progress</p>
              <p className="preview-subtitle">You're in the top 5% of active seekers</p>
            </div>
            <div className="preview-active-pill">12 active</div>
          </div>

          <div className="preview-body">
            <div className="preview-list">
              {previewApplications.map((application, index) => (
                <div key={application.company} className={`preview-job-card ${index === 0 ? 'is-active' : ''}`}>
                  <div className="preview-job-main">
                    <div className="preview-avatar">{application.initial}</div>
                    <div>
                      <p className="preview-job-title">{application.role}</p>
                      <p className="preview-company">{application.company}</p>
                    </div>
                  </div>
                  <span className={`preview-status ${application.tone}`}>{application.status}</span>
                </div>
              ))}
            </div>

            <div className="preview-progress">
              <p className="preview-panel-title">Application progress</p>
              <div className="preview-timeline">
                {progressSteps.map((step, index) => (
                  <div key={step.label} className={`preview-step ${step.complete ? 'complete' : ''}`}>
                    <div className="preview-step-dot">
                      {step.complete ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : index + 1}
                    </div>
                    <span className="preview-step-label">{step.label}</span>
                  </div>
                ))}
              </div>

              <div className="preview-interview">
                <p className="preview-interview-title">Upcoming interview</p>
                <p className="preview-interview-copy">Technical screen tomorrow at 10:30</p>
              </div>
            </div>
          </div>

          <div className="preview-stats">
            {[
              { icon: Search, label: 'Searchable', value: '48' },
              { icon: CalendarCheck, label: 'Interviews', value: '9' },
              { icon: BarChart3, label: 'Offers', value: '3' },
            ].map((item) => (
              <div key={item.label} className="preview-stat">
                <item.icon className="mx-auto h-4 w-4 text-primary" aria-hidden="true" />
                <p className="preview-stat-value">{item.value}</p>
                <p className="preview-stat-label">{item.label}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
