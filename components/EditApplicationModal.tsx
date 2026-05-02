'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      <div className="fixed inset-0 bg-gray-600/75" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Edit Application</h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close edit application modal">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  required
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <Input
                  value={formData.jobTitle}
                  onChange={(e) => handleChange('jobTitle', e.target.value)}
                  required
                  placeholder="Job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Job location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <Input
                  value={formData.salaryRange}
                  onChange={(e) => handleChange('salaryRange', e.target.value)}
                  placeholder="e.g., $80k-$120k"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
                <Input
                  value={formData.jobLink}
                  onChange={(e) => handleChange('jobLink', e.target.value)}
                  placeholder="URL to job posting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Date</label>
                <Input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => handleChange('applicationDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Job description"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Personal notes about this application"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
