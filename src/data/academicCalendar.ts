import type { AcademicDate } from '../types';

export const academicCalendar: AcademicDate[] = [
  { id: 'acad-1', date: '2026-08-24', title: 'Classes & Change of Schedule begins', category: 'ACADEMIC CALENDAR', noClasses: false, universityClosed: false },
  { id: 'acad-2', date: '2026-08-27', title: 'Last day to drop/add 1st 7-week courses', category: 'ACADEMIC DEADLINE', noClasses: false, universityClosed: false },
  { id: 'acad-3', date: '2026-09-01', title: 'Last day to add/drop full semester courses', category: 'ACADEMIC DEADLINE', noClasses: false, universityClosed: false },
  { id: 'acad-4', date: '2026-09-07', title: 'LABOR DAY HOLIDAY', category: 'UNIVERSITY HOLIDAY', noClasses: true, universityClosed: true },
  { id: 'acad-5', date: '2026-09-24', title: 'Last day to withdraw 1st 7-week courses', category: 'ACADEMIC DEADLINE', noClasses: false, universityClosed: false },
  { id: 'acad-6', date: '2026-10-13', title: 'End of 1st 7-week courses', category: 'ACADEMIC CALENDAR', noClasses: false, universityClosed: false },
  { id: 'acad-7', date: '2026-10-14', title: '2nd 7-week courses begin', category: 'ACADEMIC CALENDAR', noClasses: false, universityClosed: false },
  { id: 'acad-8', date: '2026-10-19', title: 'Last day to add/drop 2nd 7-week courses', category: 'ACADEMIC DEADLINE', noClasses: false, universityClosed: false },
  { id: 'acad-9', date: '2026-10-23', title: 'FALL BREAK', category: 'UNIVERSITY BREAK', noClasses: true, universityClosed: false },
  { id: 'acad-10', date: '2026-11-02', title: 'Last day to withdraw full semester courses', category: 'ACADEMIC DEADLINE', noClasses: false, universityClosed: false },
  { id: 'acad-11', date: '2026-11-13', title: 'Last day to withdraw 2nd 7-week courses', category: 'ACADEMIC DEADLINE', noClasses: false, universityClosed: false },
  { id: 'acad-12', date: '2026-11-25', endDate: '2026-11-29', title: 'THANKSGIVING HOLIDAY', category: 'UNIVERSITY HOLIDAY', noClasses: true, universityClosed: true },
  { id: 'acad-13', date: '2026-12-07', title: 'Last day of classes', category: 'ACADEMIC CALENDAR', noClasses: false, universityClosed: false },
  { id: 'acad-14', date: '2026-12-08', endDate: '2026-12-14', title: 'FINAL EXAMINATIONS BEGIN', category: 'EXAM PERIOD', noClasses: false, universityClosed: false },
  { id: 'acad-15', date: '2026-12-14', title: 'End of semester', category: 'ACADEMIC CALENDAR', noClasses: false, universityClosed: false }
];