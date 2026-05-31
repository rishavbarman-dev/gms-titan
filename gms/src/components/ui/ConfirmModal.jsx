import React from 'react';
import { Modal } from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.", 
  confirmText = "Delete", 
  loading = false 
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertTriangle size={24} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide">Warning</h4>
            <p className="text-xs text-white/70 mt-1">{message}</p>
          </div>
        </div>
        
        <div className="flex gap-3 justify-end pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="brand" onClick={onConfirm} isLoading={loading} className="bg-red-600 hover:bg-red-700 text-white border-red-600/20">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
