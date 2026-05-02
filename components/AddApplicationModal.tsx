'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Application</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Company name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Title *</label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Job title"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-md resize-none h-24"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Job description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Salary Range</label>
              <Input
                value={formData.salaryRange}
                onChange={(e) => handleChange('salaryRange', e.target.value)}
                placeholder="$80k - $120k"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Application Date *</label>
              <Input
                type="date"
                value={formData.applicationDate}
                onChange={(e) => handleChange('applicationDate', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Link</label>
              <Input
                value={formData.jobLink}
                onChange={(e) => handleChange('jobLink', e.target.value)}
                placeholder="https://example.com/job"
                type="url"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
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
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-md resize-none h-20"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Add Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
