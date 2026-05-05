'use client';

import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description, 
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel mx-4 max-w-md" role="dialog" aria-modal="true">
        <div className="p-6">
          <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
          <p className="mb-6 text-sm font-medium leading-6 text-muted-foreground">{description}</p>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button 
              type="button"
              onClick={handleConfirm}
              variant={variant === 'danger' ? 'destructive' : 'default'}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
