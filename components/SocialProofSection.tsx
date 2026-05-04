import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Filter,
  MessageSquareText,
  Sparkles,
  Tags,
} from 'lucide-react'

const features = [
  {
    icon: BriefcaseBusiness,
    title: 'Track every opportunity',
    description:
      'Capture role details, company context, salary range, links, notes, and the exact stage without turning your search into spreadsheet work.',
    featured: true,
  },
  {
    icon: CalendarDays,
    title: 'Interview-ready',
    description: 'Keep upcoming calls, preparation notes, and next actions attached to the application record.',
  },
  {
    icon: Tags,
    title: 'Flexible tagging',
    description: 'Group roles by stack, priority, industry, company type, remote preference, or custom labels.',
  },
  {
    icon: Filter,
    title: 'Focused pipeline',
    description: 'Filter active, stalled, closed, and high-priority applications in a few clicks.',
  },
  {
    icon: BarChart3,
    title: 'Clear analytics',
    description: 'See conversion rates, status mix, recent activity, and where your search is gaining traction.',
  },
]

const workflow = [
  ['01', 'Capture', 'Add the job, source link, compensation range, notes, tags, and first follow-up in one calm form.'],
  ['02', 'Progress', 'Move each role through wishlist, applied, interview, offer, rejected, and accepted stages.'],
  ['03', 'Review', 'Use the dashboard and analytics view to understand what is moving and what needs attention.'],
]

const insights = [
  ['Active pipeline', '12', 'Open roles with a meaningful next step'],
  ['Interview rate', '38%', 'Applications converting into calls'],
  ['Follow-ups due', '5', 'Items that should be handled this week'],
]

export function SocialProofSection() {
  return (
    <section className="landing-detail-section">
      <div className="landing-detail-container">
        <div className="landing-section-heading">
          <p className="landing-section-kicker">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Product workflow
          </p>
          <h2>Everything a serious job search needs, organized into one workspace.</h2>
          <p>
            Job Tracker is designed around daily use: fast capture, clear priorities, clean follow-up loops,
            and enough context to prepare confidently for each hiring step.
          </p>
        </div>

        <div id="features" className="feature-bento">
          {features.map((feature) => (
            <article key={feature.title} className={feature.featured ? 'feature-card feature-card-large' : 'feature-card'}>
              <div className="feature-icon">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              {feature.featured ? (
                <div className="feature-mini-stack" aria-label="Opportunity details preview">
                  {['Product Designer at Northstar Labs', 'Frontend Engineer at Atlas Cloud', 'Data Analyst at Bright Finance'].map(
                    (item, index) => (
                      <div key={item} className="feature-mini-row">
                        <span>{String.fromCharCode(65 + index)}</span>
                        <div>
                          <strong>{item.split(' at ')[0]}</strong>
                          <small>{item.split(' at ')[1]}</small>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : null}
            </article>
          ))}
        </div>

        <div id="workflow" className="workflow-band">
          <div className="workflow-intro">
            <p className="landing-section-kicker">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Daily rhythm
            </p>
            <h2>From saved role to signed offer.</h2>
            <p>
              The app keeps the search process visible without forcing you into a rigid CRM. Add context once,
              then move quickly through the next decision.
            </p>
          </div>

          <div className="workflow-steps">
            {workflow.map(([number, title, description]) => (
              <article key={title} className="workflow-card">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div id="insights" className="insights-panel">
          <div className="insights-copy">
            <div className="insights-icon">
              <MessageSquareText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h2>Insights that make the next action obvious.</h2>
            <p>
              Replace guesswork with a concise read on what is active, what is converting, and what needs a
              follow-up before the opportunity goes cold.
            </p>
          </div>

          <div className="insights-grid">
            {insights.map(([label, value, description]) => (
              <article key={label} className="insight-card">
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
