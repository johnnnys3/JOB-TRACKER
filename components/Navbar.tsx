import Link from 'next/link'

import { AppLogo } from '@/components/AppLogo'

const navItems = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Insights', href: '#insights' },
]

export function Navbar() {
  return (
    <header className="landing-navbar-wrap">
      <nav className="landing-navbar" aria-label="Landing navigation">
        <AppLogo />

        <div className="landing-nav-links">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="landing-nav-actions">
          <Link href="/login" className="landing-login">Log in</Link>
          <Link href="/register" className="landing-start-link">Start tracking</Link>
        </div>
      </nav>
    </header>
  )
}
