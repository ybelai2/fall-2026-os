import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { CalendarEvent, EventException } from '../types';
import { defaultSchedule } from '../data/defaultSchedule';

export function useCalendarStore() {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('fall2026_events');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });

  const [exceptions, setExceptions] = useState<Record<string, EventException>>(() => {
    const saved = localStorage.getItem('fall2026_exceptions');
    return saved ? JSON.parse(saved) : {};
  });

  // NEW: State for weekly notes
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('fall2026_notes');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('fall2026_events', JSON.stringify(events));
    localStorage.setItem('fall2026_exceptions', JSON.stringify(exceptions));
    localStorage.setItem('fall2026_notes', JSON.stringify(notes)); // Save notes
  }, [events, exceptions, notes]);

  const toggleCompletion = useCallback((instanceId: string, templateId: string, date: string) => {
    setExceptions(prev => {
      const existing = prev[instanceId];
      return {
        ...prev,
        [instanceId]: {
          id: instanceId,
          templateId,
          date,
          isCancelled: existing?.isCancelled || false,
          isCompleted: !(existing?.isCompleted || false),
          overrides: existing?.overrides
        }
      };
    });
  }, []);

  const addEvent = useCallback((newEvent: Omit<CalendarEvent, 'id'>) => {
    const event: CalendarEvent = { ...newEvent, id: `user_${uuidv4()}` };
    setEvents(prev => [...prev, event]);
  }, []);

  const editEvent = useCallback((eventId: string, updatedEvent: Omit<CalendarEvent, 'id'>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...updatedEvent, id: eventId } : e));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  }, []);

  // NEW: Action to update a note for a specific week
  const updateNote = useCallback((weekKey: string, text: string) => {
    setNotes(prev => ({ ...prev, [weekKey]: text }));
  }, []);

  return {
    events,
    exceptions,
    notes,
    toggleCompletion,
    addEvent,
    editEvent,
    deleteEvent,
    updateNote,
  };
}