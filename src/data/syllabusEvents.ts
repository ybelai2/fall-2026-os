import { FALL_2026_SYLLABI } from './courseSyllabi';
import type { SyllabusItem } from '../types/syllabus';
import { addDays, format, parseISO, isBefore } from 'date-fns';

export function generateSyllabusEvents(userCustomEdits?: Record<string, Partial<SyllabusItem>>): SyllabusItem[] {
  const allItems: SyllabusItem[] = [];

  FALL_2026_SYLLABI.forEach(course => {
    course.items.forEach(item => {
      const override = userCustomEdits?.[item.id] || {};
      allItems.push({
        ...item,
        ...override
      });
    });
  });

  const semesterEnd = parseISO('2026-12-14');
  let currentMondayDue = parseISO('2026-08-31');
  let weekCounter = 1;

  while (isBefore(currentMondayDue, semesterEnd) || format(currentMondayDue, 'yyyy-MM-dd') === format(semesterEnd, 'yyyy-MM-dd')) {
    const dateStr = format(currentMondayDue, 'yyyy-MM-dd');
    const id = `syllabus-math265-hw-week-${weekCounter}`;
    
    const override = userCustomEdits?.[id] || {};

    allItems.push({
      id,
      courseCode: 'MATH 265',
      title: `Week ${weekCounter} MATH 265 Homework`,
      type: 'HOMEWORK',
      date: dateStr,
      dueTime: '23:00',
      status: 'RECURRING',
      latePolicy: 'Late by Wed 11 PM: 10% deduction. After Wed 11 PM: Zero credit.',
      notes: 'All problems assigned during the previous week are due by Monday 11:00 PM on Blackboard.',
      source: 'SYLLABUS',
      ...override
    });

    currentMondayDue = addDays(currentMondayDue, 7);
    weekCounter++;
  }

  return allItems;
}
