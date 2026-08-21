import { format, getDay } from 'date-fns';
import type { CalendarEvent, EventException, AcademicDate } from '../types';

export interface RenderableEvent extends CalendarEvent {
  instanceId: string; // Unique ID for this specific day's block
  isCompleted: boolean;
  isModified: boolean;
  originalDate: string;
}

export function compileDay(
  date: Date,
  templates: CalendarEvent[],
  exceptions: Record<string, EventException>,
  academicDates: AcademicDate[]
): RenderableEvent[] {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayOfWeek = getDay(date); 
  
  // 1. Determine Holiday Status
  const holiday = academicDates.find(h => {
    if (h.endDate) {
      return dateStr >= h.date && dateStr <= h.endDate;
    }
    return h.date === dateStr;
  });

  const suppressClasses = holiday?.noClasses === true;
  const renderable: RenderableEvent[] = [];

  // 2. Process Templates
  templates.forEach(template => {
    
    // FIX: If it is a one-off event (not recurring), it MUST match today's date exactly.
    if (!template.isRecurring && dateStr !== template.startDate) {
      return;
    }

    // Check start and end date boundaries
    if (dateStr < template.startDate) return;
    if (template.endDate && dateStr > template.endDate) return;

    // Check if this recurring event happens on this day of the week
    if (template.isRecurring && template.daysOfWeek && !template.daysOfWeek.includes(dayOfWeek)) {
      return;
    }

    // Holiday suppression for classes (Leaves non-class events alone)
    if (suppressClasses && template.category === 'CLASS') {
      return; 
    }

    const instanceId = `${template.id}_${dateStr}`;
    const exception = exceptions[instanceId];

    // Reality check: Was this deleted or moved off this day entirely?
    if (exception?.isCancelled) {
      return;
    }

    // Apply Reality Overrides
    renderable.push({
      ...template,
      ...(exception?.overrides || {}),
      instanceId,
      isCompleted: exception?.isCompleted || false,
      isModified: !!exception?.overrides,
      originalDate: dateStr
    });
  });

  // 3. Sort chronologically by start time
  return renderable.sort((a, b) => a.startTime.localeCompare(b.startTime));
}