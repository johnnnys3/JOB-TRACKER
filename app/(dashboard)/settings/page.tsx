'use client';

import { useEffect, useState } from 'react';
import { Bell, Camera, CreditCard, FileText, Globe, Link as LinkIcon, Mail, Shield, User, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSettings, useUpdateSettings, UpdateUserSettingsDto } from '@/hooks/useSettings';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/PageHeader';
import { PageLoadingState } from '@/components/LoadingState';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertMessage } from '@/components/AlertMessage';

export default function Settings() {
  const { data: settings, isLoading, error } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const [formData, setFormData] = useState<Partial<UpdateUserSettingsDto>>({});

  useEffect(() => {
    if (!settings) return;

    setFormData({
      email: settings.email,
      firstName: settings.firstName || '',
      lastName: settings.lastName || '',
    });
  }, [settings]);

  const handleSave = () => {
    updateSettingsMutation.mutate(formData);
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
          {[
            { label: 'Profile', icon: User, active: true },
            { label: 'Notifications', icon: Bell },
            { label: 'Security', icon: Shield },
            { label: 'Billing', icon: CreditCard },
          ].map((item) => (
            <button key={item.label} type="button" className={item.active ? 'is-active' : ''}>
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </aside>

        <section className="settings-content-stack">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary text-3xl font-black text-white shadow-md">
                    {(formData.firstName || formData.email || 'A').charAt(0).toUpperCase()}
                  </div>
                  <button type="button" className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-lg">
                    <Camera className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">Update your photo and personal details.</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="button" size="sm">Upload New</Button>
                    <Button type="button" variant="outline" size="sm">Remove</Button>
                  </div>
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

          <Card>
            <CardHeader>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Professional Links</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfessionalLink icon={LinkIcon} label="LinkedIn Profile" value="linkedin.com/in/your-profile" />
              <ProfessionalLink icon={Globe} label="Portfolio Website" value="yourportfolio.com" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="mb-1 block text-xs font-bold text-muted-foreground">Resume / CV</label>
                  <div className="flex gap-2">
                    <span className="flex min-h-10 flex-1 items-center rounded-xl bg-teal-50 px-4 text-sm font-bold text-primary">resume_latest.pdf</span>
                    <Button type="button" variant="ghost">Update</Button>
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

function ProfessionalLink({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <label className="mb-1 block text-xs font-bold text-muted-foreground">{label}</label>
        <Input defaultValue={value} />
      </div>
    </div>
  );
}
