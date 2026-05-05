'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Application, ApplicationStatus, statusOptions, UpdateApplicationDto } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSubmit: (data: UpdateApplicationDto) => void;
}

const emptyForm: UpdateApplicationDto = {
  company: '',
  jobTitle: '',
  description: '',
  location: '',
  jobLink: '',
  salaryRange: '',
  applicationDate: '',
  status: 'APPLIED',
  notes: '',
};

export function EditApplicationModal({ isOpen, onClose, application, onSubmit }: EditApplicationModalProps) {
  const [formData, setFormData] = useState<UpdateApplicationDto>(emptyForm);

  useEffect(() => {
    if (!application) return;

    setFormData({
      company: application.company,
      jobTitle: application.jobTitle,
      description: application.description || '',
      location: application.location || '',
      jobLink: application.jobLink || '',
      salaryRange: application.salaryRange || '',
      applicationDate: application.applicationDate,
      status: application.status,
      notes: application.notes || '',
    });
  }, [application]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof UpdateApplicationDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="modal-panel max-h-[90vh] max-w-2xl overflow-y-auto" role="dialog" aria-modal="true">
          <div className="modal-header">
            <h2>Edit application</h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close edit application modal">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="form-label">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  required
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="form-label">Job title</label>
                <Input
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  required
                  placeholder="Job title"
                />
              </div>

              <div>
                <label className="form-label">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Job location"
                />
              </div>

              <div>
                <label className="form-label">Salary range</label>
                <Input
                  value={formData.salaryRange}
                  onChange={(e) => handleChange('salaryRange', e.target.value)}
                  placeholder="e.g., $80k-$120k"
                />
              </div>

              <div>
                <label className="form-label">Job link</label>
                <Input
                  value={formData.jobLink}
                  onChange={(e) => handleChange('jobLink', e.target.value)}
                  placeholder="URL to job posting"
                />
              </div>

              <div>
                <label className="form-label">Application date</label>
                <Input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => handleChange('applicationDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="form-label">Status</label>
              <Select value={formData.status} onValueChange={(value: ApplicationStatus) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <label className="form-label">Description</label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Job description"
              />
            </div>

            <div className="mt-4">
              <label className="form-label">Notes</label>
              <Textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Personal notes about this application"
              />
            </div>

            <div className="modal-footer -mx-6 -mb-6 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
