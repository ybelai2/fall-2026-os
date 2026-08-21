import React, { useState } from 'react';
import type { Category, CalendarEvent } from '../types';

interface EventModalProps {
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  defaultDate: string;
  existingEvent?: CalendarEvent | null;
}

const CATEGORIES: Category[] = ['CLASS', 'CAREER', 'CS / TECHNICAL', 'STUDY', 'PROJECT', 'FAITH', 'BODY', 'PERSONAL', 'COMMUTE', 'MEAL', 'RECOVERY', 'SOCIAL MEDIA', 'SLEEP'];

export function EventModal({ onClose, onSave, defaultDate, existingEvent }: EventModalProps) {
  const [title, setTitle] = useState(existingEvent?.title || '');
  const [category, setCategory] = useState<Category>(existingEvent?.category || 'STUDY');
  const [selectedDate, setSelectedDate] = useState(existingEvent?.startDate || defaultDate);
  const [startTime, setStartTime] = useState(existingEvent?.startTime || '12:00');
  const [endTime, setEndTime] = useState(existingEvent?.endTime || '13:00');
  const [isRecurring, setIsRecurring] = useState(existingEvent?.isRecurring || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dayOfWeek = new Date(selectedDate + 'T12:00:00').getDay();

    onSave({
      title,
      category,
      startTime,
      endTime,
      isRecurring,
      startDate: selectedDate,
      daysOfWeek: isRecurring ? [dayOfWeek] : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{existingEvent ? 'EDIT BLOCK' : 'ADD BLOCK'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-mono text-muted mb-1">TITLE</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none transition-colors" placeholder="e.g. Deep Study" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1">DATE</label>
              <input required type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">CATEGORY</label>
              <select value={category} onChange={e => setCategory(e.target.value as Category)} className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1">START TIME</label>
              <input required type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">END TIME</label>
              <input required type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-primary focus:border-primary outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="recurring" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} className="accent-primary" />
            <label htmlFor="recurring" className="text-sm">Repeat every week on this day</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-border">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-muted hover:text-primary transition-colors">CANCEL</button>
            <button type="submit" className="bg-primary text-background px-4 py-2 text-sm font-bold rounded hover:bg-gray-200 transition-colors">
              {existingEvent ? 'SAVE CHANGES' : 'SAVE BLOCK'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}