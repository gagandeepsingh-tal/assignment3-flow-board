import Modal from "./Modal";

interface ConfirmDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ open, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title="Delete Task">
      <div className="space-y-4">
        <p className="text-sm text-gray-700">Are you sure you want to delete this task? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={onCancel}>Cancel</button>
          <button className="px-3 py-1.5 rounded-md bg-red-600 text-white text-sm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </Modal>
  );
}


