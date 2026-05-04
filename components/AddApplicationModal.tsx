'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ApplicationStatus, CreateApplicationDto, statusOptions } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApplicationDto) => void;
}

export function AddApplicationModal({ isOpen, onClose, onSubmit }: AddApplicationModalProps) {
  const [formData, setFormData] = useState<CreateApplicationDto>({
    company: '',
    jobTitle: '',
    description: '',
    location: '',
    jobLink: '',
    salaryRange: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'APPLIED',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      company: '',
      jobTitle: '',
      description: '',
      location: '',
      jobLink: '',
      salaryRange: '',
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'APPLIED',
      notes: ''
    });
    onClose();
  };

  const handleChange = (field: keyof CreateApplicationDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel mx-4 max-h-[90vh] max-w-2xl overflow-y-auto" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Add application</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close add application modal">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="form-label">Job title *</label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Job title"
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Job description"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Location"
              />
            </div>
            <div>
              <label className="form-label">Salary range</label>
              <Input
                value={formData.salaryRange}
                onChange={(e) => handleChange('salaryRange', e.target.value)}
                placeholder="$80k - $120k"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="form-label">Application date *</label>
              <Input
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleChange('applicationDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Job link</label>
              <Input
                value={formData.jobLink}
                onChange={(e) => handleChange('jobLink', e.target.value)}
                placeholder="https://example.com/job"
                type="url"
              />
            </div>
          </div>

          <div>
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

          <div>
            <label className="form-label">Notes</label>
            <Textarea
              className="min-h-20"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <div className="modal-footer -mx-6 -mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
