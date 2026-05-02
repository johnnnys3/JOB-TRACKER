'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CreateInterviewDto, Interview, UpdateInterviewDto } from '@/types';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview | null;
  applicationId: string;
  onSubmit: (data: CreateInterviewDto | UpdateInterviewDto) => void;
}

const emptyForm: CreateInterviewDto = {
  stage: '',
  date: '',
  notes: '',
};

export function InterviewModal({ isOpen, onClose, interview, onSubmit }: InterviewModalProps) {
  const [formData, setFormData] = useState<CreateInterviewDto>(emptyForm);
  const isEditing = !!interview;

  useEffect(() => {
    if (!interview) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      stage: interview.stage,
      date: interview.date,
      notes: interview.notes || '',
    });
  }, [interview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof CreateInterviewDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-600/75" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Interview' : 'Add Interview'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close interview modal">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Stage</label>
              <Input
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                required
                placeholder="e.g., Technical Interview, Phone Screen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Interview notes, questions asked, etc."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              {isEditing ? 'Update Interview' : 'Add Interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
