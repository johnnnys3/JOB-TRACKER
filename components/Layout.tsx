'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  TrendingUp,
  Settings,
  Menu,
  LogOut,
  Bell,
  Plus,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthContext } from '@/contexts/AuthContext';
import { AppLogo } from '@/components/AppLogo';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Applications', href: '/applications', icon: Briefcase },
  { name: 'Interviews', href: '/interviews', icon: CalendarDays },
  { name: 'Insights', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const pageLabels: Record<string, string> = {
  '/dashboard': 'Overview',
  '/applications': 'Applications',
  '/interviews': 'Interviews',
  '/analytics': 'Insights',
  '/settings': 'Settings',
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuthContext();
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'Account';
  const currentSection =
    Object.entries(pageLabels).find(([href]) => pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`)))?.[1] || 'Workspace';

  const renderNav = () => (
    <nav
      className="grid gap-1"
      aria-label="Primary navigation"
    >
      {navigation.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setMobileMenuOpen(false)}
            className={cn(
              'inline-flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all focus-ring',
              isActive
                ? 'bg-primary text-primary-foreground shadow-lg shadow-teal-600/20'
                : 'text-muted-foreground hover:translate-x-1 hover:bg-white/45 hover:text-primary'
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden="true" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="flex h-full flex-col rounded-2xl border border-white/55 bg-white/62 p-4 shadow-[0_18px_48px_rgba(6,95,84,0.08)] backdrop-blur-xl">
          <div className="px-2 py-2">
            <AppLogo href="/dashboard" />
            <p className="ml-[3.25rem] mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Your Job Concierge</p>
          </div>
          <div className="mt-8">
            {renderNav()}
          </div>
          <div className="mt-auto rounded-2xl border border-white/55 bg-white/55 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button variant="ghost" className="mt-3 w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-inner">
            <Button
              variant="ghost"
              size="icon"
              className="dashboard-menu-button"
              onClick={() => setMobileMenuOpen(open => !open)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="dashboard-current-section">
              <p className="text-xs font-medium text-muted-foreground">Current section</p>
              <p className="text-sm font-semibold text-foreground">{currentSection}</p>
            </div>
            <div className="dashboard-mobile-logo">
              <AppLogo href="/dashboard" />
            </div>
            <div className="dashboard-search">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input className="pl-10" placeholder="Search applications, companies, notes..." aria-label="Search workspace" />
              </div>
            </div>
            <div className="dashboard-header-actions">
              <Button asChild className="dashboard-add-action">
                <Link href="/applications">
                  <Plus className="h-4 w-4" />
                  Add application
                </Link>
              </Button>
              <Button variant="outline" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="dashboard-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>

          {mobileMenuOpen ? (
            <div className="fixed inset-0 z-50">
              <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
              <div className="absolute inset-y-0 left-0 w-[min(22rem,calc(100vw-2rem))] p-3">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-white/95 p-4 shadow-2xl">
                  <div className="flex items-center justify-between">
                    <AppLogo href="/dashboard" />
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-8">{renderNav()}</div>
                  <Button asChild className="mt-6">
                    <Link href="/applications" onClick={() => setMobileMenuOpen(false)}>
                      <Plus className="h-4 w-4" />
                      Add application
                    </Link>
                  </Button>
                  <div className="mt-auto rounded-2xl border border-border bg-accent/70 p-4">
                    <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                    <Button variant="ghost" className="mt-3 w-full justify-start" onClick={logout}>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </header>

        <main className="dashboard-canvas">
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
