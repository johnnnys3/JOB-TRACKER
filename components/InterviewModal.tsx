'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
      <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel mx-4 max-w-md" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>
            {isEditing ? 'Edit interview' : 'Add interview'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close interview modal">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="form-label">Interview stage</label>
              <Input
                value={formData.stage}
                onChange={(e) => handleChange('stage', e.target.value)}
                required
                placeholder="e.g., Technical Interview, Phone Screen"
              />
            </div>

            <div>
              <label className="form-label">Date and time</label>
              <Input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Notes</label>
              <Textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Interview notes, questions asked, etc."
              />
            </div>
          </div>

          <div className="modal-footer -mx-6 -mb-6 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update interview' : 'Add interview'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
