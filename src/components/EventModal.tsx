import { useState, type FormEvent } from "react";
import { Plus, Repeat2 } from "lucide-react";
import type { Category, CalendarEvent } from "../types";
import { Dialog } from "./Dialog";
import { readableLabel } from "../lib/planner";

interface EventModalProps {
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  defaultDate: string;
  existingEvent?: CalendarEvent | null;
}

const CATEGORIES: Category[] = [
  "CLASS",
  "CAREER",
  "CS / TECHNICAL",
  "STUDY",
  "PROJECT",
  "FAITH",
  "BODY",
  "PERSONAL",
  "COMMUTE",
  "MEAL",
  "RECOVERY",
  "SOCIAL MEDIA",
  "SLEEP",
];

export function EventModal({
  onClose,
  onSave,
  defaultDate,
  existingEvent,
}: EventModalProps) {
  const [title, setTitle] = useState(existingEvent?.title || "");
  const [category, setCategory] = useState<Category>(
    existingEvent?.category || "STUDY",
  );
  const [selectedDate, setSelectedDate] = useState(
    existingEvent?.startDate || defaultDate,
  );
  const [startTime, setStartTime] = useState(
    existingEvent?.startTime || "12:00",
  );
  const [endTime, setEndTime] = useState(existingEvent?.endTime || "13:00");
  const [isRecurring, setIsRecurring] = useState(
    existingEvent?.isRecurring || false,
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const dayOfWeek = new Date(`${selectedDate}T12:00:00`).getDay();
    onSave({
      ...existingEvent,
      title: title.trim(),
      category,
      startTime,
      endTime,
      isRecurring,
      startDate: selectedDate,
      daysOfWeek: isRecurring
        ? existingEvent?.startDate === selectedDate
          ? existingEvent.daysOfWeek || [dayOfWeek]
          : [dayOfWeek]
        : undefined,
    });
    onClose();
  };

  return (
    <Dialog
      title={existingEvent ? "Edit your block" : "Make time for something."}
      description="A class, a goal, or a little time for yourself."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="form-stack">
        <div className="field">
          <label htmlFor="block-title">Block title</label>
          <input
            id="block-title"
            required
            maxLength={200}
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Deep study, gym, or catch up with a friend"
          />
        </div>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="block-date">Date</label>
            <input
              id="block-date"
              required
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="block-category">Category</label>
            <select
              id="block-category"
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {readableLabel(item)}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="block-start">Start time</label>
            <input
              id="block-start"
              required
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="block-end">End time</label>
            <input
              id="block-end"
              required
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
            />
          </div>
        </div>
        <label className="repeat-option">
          <Repeat2 size={19} />
          <span>
            <strong>Make it a routine</strong>
            <small>Repeat every week on this day</small>
          </span>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(event) => setIsRecurring(event.target.checked)}
          />
        </label>
        <div className="dialog-actions">
          <button
            type="button"
            onClick={onClose}
            className="button button-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="button button-primary"
          >
            <Plus size={16} />
            {existingEvent ? "Save changes" : "Add block"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
