import { format, getDay } from 'date-fns';
import type { CalendarEvent, EventException, AcademicDate } from '../types';
import { generateSyllabusEvents } from '../data/syllabusEvents';

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

  // 2. Convert Syllabus Items into Calendar Events dynamically
  const syllabusItems = generateSyllabusEvents();
  const syllabusAsTemplates: CalendarEvent[] = syllabusItems
    .filter(item => item.date === dateStr && item.status !== 'TBD') // Show confirmed/recurring dates for this day
    .map(item => ({
      id: item.id,
      title: item.title,
      category: item.type as any,
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      dueTime: item.dueTime,
      dueDate: item.date,
      courseCode: item.courseCode,
      isGroupWork: item.isGroupWork,
      status: item.status,
      location: item.location,
      description: item.notes || item.latePolicy,
      isRecurring: item.status === 'RECURRING',
      startDate: item.date || dateStr
    }));

  // Combine user default schedule with syllabus items for this day
  const combinedTemplates = [...templates, ...syllabusAsTemplates];

  // 3. Process Templates
  combinedTemplates.forEach(template => {
    // If it is a one-off event (not recurring), it MUST match today's date exactly.
    if (!template.isRecurring && dateStr !== template.startDate && dateStr !== template.dueDate) {
      return;
    }

    // Check start and end date boundaries
    if (template.startDate && dateStr < template.startDate) return;
    if (template.endDate && dateStr > template.endDate) return;

    // Check if this recurring event happens on this day of the week
    if (template.isRecurring && template.daysOfWeek && !template.daysOfWeek.includes(dayOfWeek)) {
      return;
    }

    // Holiday suppression for classes
    if (suppressClasses && template.category === 'CLASS') {
      return; 
    }

    const instanceId = `${template.id}_${dateStr}`;
    const exception = exceptions[instanceId];

    // Reality check: Was this deleted or moved off this day entirely?
    if (exception?.isCancelled) {
      return;
    }

    renderable.push({
      ...template,
      ...(exception?.overrides || {}),
      instanceId,
      isCompleted: exception?.isCompleted || false,
      isModified: !!exception?.overrides,
      originalDate: dateStr
    });
  });

  // 4. Sort chronologically by startTime or dueTime
  return renderable.sort((a, b) => {
    const timeA = a.startTime || a.dueTime || '00:00';
    const timeB = b.startTime || b.dueTime || '00:00';
    return timeA.localeCompare(timeB);
  });
}
