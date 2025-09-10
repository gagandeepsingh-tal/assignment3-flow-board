import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { useBoardDispatch } from "../../state/context";
import { MAX_TITLE_LENGTH, validateTitle } from "../../state/types";

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
  const dispatch = useBoardDispatch();
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const validation = validateTitle(title);
  const isValid = validation.ok;

  function submit() {
    if (!isValid) {
      setError(validation.error ?? "Invalid title");
      return;
    }
    dispatch({ type: "ADD_TASK", payload: { title: validation.value!, column: "todo" } });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Task">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm text-gray-700" htmlFor="task-title">Title</label>
          <input
            ref={inputRef}
            id="task-title"
            type="text"
            className="w-full px-3 py-2 border rounded-md text-sm"
            placeholder="Describe the task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValid) {
                e.preventDefault();
                submit();
              }
            }}
            maxLength={MAX_TITLE_LENGTH + 5}
          />
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">{title.trim().length}/{MAX_TITLE_LENGTH}</span>
            {!isValid && title.length > 0 ? (
              <span className="text-xs text-red-600">{validation.error}</span>
            ) : null}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={onClose}>Cancel</button>
          <button
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm disabled:opacity-50"
            onClick={submit}
            disabled={!isValid}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
}


