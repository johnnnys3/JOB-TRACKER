import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

run('component primitives expose accessible loading and empty states', () => {
  const button = read('components/ui/button.tsx');
  const emptyState = read('components/EmptyState.tsx');

  assert.match(button, /Loader2/);
  assert.match(button, /disabled=\{disabled \|\| loading\}/);
  assert.match(emptyState, /description/);
});

run('dashboard pages use backend-backed hooks instead of mock data', () => {
  const dashboard = read('app/(dashboard)/dashboard/page.tsx');
  const applications = read('app/(dashboard)/applications/page.tsx');
  const analytics = read('app/(dashboard)/analytics/page.tsx');

  assert.match(dashboard, /useAnalytics/);
  assert.match(applications, /useApplications/);
  assert.match(analytics, /useAnalytics/);
  assert.doesNotMatch(`${dashboard}\n${applications}\n${analytics}`, /mockData/);
});

run('custom hooks define cache keys and mutation invalidation', () => {
  const applicationsHook = read('hooks/useApplications.ts');
  const authHook = read('hooks/useAuth.ts');
  const interviewsHook = read('hooks/useInterviews.ts');

  assert.match(applicationsHook, /queryKey: \['applications'/);
  assert.match(applicationsHook, /invalidateQueries/);
  assert.match(authHook, /queryKey: \['user'\]/);
  assert.match(interviewsHook, /queryKey: \['interviews'/);
});

run('critical user flows have error and offline fallbacks', () => {
  assert.match(read('app/error.tsx'), /Try Again/);
  assert.match(read('app/not-found.tsx'), /Back/);
  assert.match(read('components/NetworkStatusBanner.tsx'), /offline/);
  assert.match(read('contexts/ToastContext.tsx'), /role="status"/);
});

function run(name, assertion) {
  try {
    assertion();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}
