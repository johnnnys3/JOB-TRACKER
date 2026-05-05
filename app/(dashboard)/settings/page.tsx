'use client';

import { useEffect, useState } from 'react';
import { Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings, useUpdateSettings, UpdateUserSettingsDto } from '@/hooks/useSettings';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/PageHeader';
import { PageLoadingState } from '@/components/LoadingState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertMessage } from '@/components/AlertMessage';
import { useToast } from '@/contexts/ToastContext';

export default function Settings() {
  const { data: settings, isLoading, error } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const [formData, setFormData] = useState<Partial<UpdateUserSettingsDto>>({});
  const { notify } = useToast();

  useEffect(() => {
    if (!settings) return;

    setFormData({
      email: settings.email,
      firstName: settings.firstName || '',
      lastName: settings.lastName || '',
    });
  }, [settings]);

  const handleSave = () => {
    updateSettingsMutation.mutate(formData, {
      onSuccess: () => notify('Settings saved', 'success'),
      onError: () => notify('Settings could not be saved', 'error'),
    });
  };

  const handleFieldChange = (field: keyof UpdateUserSettingsDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return <PageLoadingState />;
  }

  if (error) {
    return <AlertMessage variant="error">Failed to load settings. Please try again.</AlertMessage>;
  }

  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your profile preferences and account security."
        eyebrow={<Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />}
      />

      <div className="settings-layout-grid">
        <aside className="settings-tabs">
          <button type="button" className="is-active">
            <User className="h-4 w-4" aria-hidden="true" />
            Profile
          </button>
        </aside>

        <section className="settings-content-stack">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-white shadow-md">
                    {(formData.firstName || formData.email || 'A').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Update the account details used across your job tracker.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Personal Details</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-bold text-foreground" htmlFor="settings-first-name">First name</label>
                  <Input id="settings-first-name" value={formData.firstName || ''} onChange={(e) => handleFieldChange('firstName', e.target.value)} placeholder="Alex" className="mt-2" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground" htmlFor="settings-last-name">Last name</label>
                  <Input id="settings-last-name" value={formData.lastName || ''} onChange={(e) => handleFieldChange('lastName', e.target.value)} placeholder="Rivera" className="mt-2" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-foreground" htmlFor="settings-email">Email Address</label>
                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input id="settings-email" type="email" value={formData.email || ''} onChange={(e) => handleFieldChange('email', e.target.value)} placeholder="you@example.com" className="pl-11" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pb-12">
            <Button type="button" variant="ghost">Cancel</Button>
            <Button onClick={handleSave} loading={updateSettingsMutation.isPending}>Save Changes</Button>
          </div>
        </section>
      </div>
    </>
  );
}
