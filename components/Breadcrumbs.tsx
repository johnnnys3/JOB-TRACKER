'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="inline-flex flex-wrap items-center gap-1 rounded-full border border-border bg-white/72 px-3 py-1.5 text-sm font-semibold text-muted-foreground shadow-sm backdrop-blur-md">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-1">
          {item.href ? (
            <Link 
              href={item.href}
              className="rounded-lg font-medium transition-colors hover:text-primary focus-ring"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-primary">{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      ))}
    </nav>
  );
}
