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
    <nav className="flex items-center space-x-2 text-sm text-neutral-600">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.href ? (
            <Link 
              href={item.href}
              className="hover:text-neutral-900 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-500">{item.label}</span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          )}
        </div>
      ))}
    </nav>
  );
}
