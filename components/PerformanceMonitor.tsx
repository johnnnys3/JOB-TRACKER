'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function PerformanceMonitor() {
  useReportWebVitals(metric => {
    if (process.env.NODE_ENV === 'production') {
      console.info('[web-vitals]', metric.name, Math.round(metric.value));
    }
  });

  return null;
}
