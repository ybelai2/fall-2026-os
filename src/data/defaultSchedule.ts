import type { CalendarEvent } from '../types';

export const defaultSchedule: CalendarEvent[] = [
  // --- CLASSES ---
  { id: 'class-1', title: 'MATH 265 - Elementary Linear Algebra', category: 'CLASS', startTime: '12:00', endTime: '13:50', location: 'YR0102 MATH COSC Excl Lab', instructor: 'Leonid Stern', isRecurring: true, daysOfWeek: [1, 3], startDate: '2026-08-24', endDate: '2026-12-07', color: 'class' },
  { id: 'class-2', title: 'COSC 457 - Database Management Systems', category: 'CLASS', startTime: '16:00', endTime: '18:40', location: 'YR0223 COSC AIT Excl Lab', instructor: 'Sung-Chul Hong', isRecurring: true, daysOfWeek: [1], startDate: '2026-08-24', endDate: '2026-12-07', color: 'class' },
  { id: 'class-3', title: 'COSC 418 - Ethical & Societal COSC (Online)', category: 'CLASS', startTime: '12:30', endTime: '13:45', location: 'Online Course Work', instructor: 'Yuqianqiong Wang', isRecurring: true, daysOfWeek: [2], startDate: '2026-08-24', endDate: '2026-12-07', color: 'class' },
  { id: 'class-4', title: 'COSC 418 - Ethical & Societal COSC', category: 'CLASS', startTime: '12:30', endTime: '13:45', location: 'YR0414 COSC Excl Open Comp Lab', instructor: 'Yuqianqiong Wang', isRecurring: true, daysOfWeek: [4], startDate: '2026-08-24', endDate: '2026-12-07', color: 'class' },
  { id: 'class-5', title: 'COSC 350 - Data Comm & Networking', category: 'CLASS', startTime: '19:30', endTime: '22:10', location: 'YR0222 COSC AIT Excl Lab', instructor: 'Alexander Wijesinha', isRecurring: true, daysOfWeek: [3], startDate: '2026-08-24', endDate: '2026-12-07', color: 'class' },

  // --- CORE SYSTEMS ---
  { id: 'sys-commute-m-1', title: 'Commute to campus', category: 'COMMUTE', startTime: '07:30', endTime: '08:30', isRecurring: true, daysOfWeek: [1, 3], startDate: '2026-08-24' },
  { id: 'sys-commute-th-1', title: 'Commute to campus', category: 'COMMUTE', startTime: '11:15', endTime: '12:15', isRecurring: true, daysOfWeek: [4], startDate: '2026-08-24' },
  
  { id: 'sys-career-1', title: 'CAREER POWER BLOCK', description: 'Job applications, resume tailoring, recruiter outreach', category: 'CAREER', startTime: '14:00', endTime: '15:30', isRecurring: true, daysOfWeek: [2], startDate: '2026-08-24', color: 'career' },
  { id: 'sys-career-2', title: 'CAREER POWER BLOCK', category: 'CAREER', startTime: '15:30', endTime: '17:00', isRecurring: true, daysOfWeek: [4], startDate: '2026-08-24', color: 'career' },
  { id: 'sys-career-3', title: 'CAREER POWER BLOCK', category: 'CAREER', startTime: '08:00', endTime: '10:00', isRecurring: true, daysOfWeek: [5], startDate: '2026-08-24', color: 'career' },
  
  { id: 'sys-leetcode-1', title: 'LeetCode / Tech Interview Prep', category: 'CS / TECHNICAL', startTime: '16:00', endTime: '17:00', isRecurring: true, daysOfWeek: [2], startDate: '2026-08-24' },
  { id: 'sys-leetcode-2', title: 'LeetCode / Tech Interview Prep', category: 'CS / TECHNICAL', startTime: '17:30', endTime: '18:30', isRecurring: true, daysOfWeek: [4], startDate: '2026-08-24' },
  
  { id: 'sys-project-1', title: 'PROJECT BLOCK', description: 'BUILD SOFTWARE. Priority: GitHub Developer Insights Dashboard.', category: 'PROJECT', startTime: '09:00', endTime: '11:00', isRecurring: true, daysOfWeek: [6], startDate: '2026-08-24' },
  
  { id: 'sys-review', title: 'WEEKLY REVIEW', description: 'Review Career, School, Technical, Body, Faith, Relationships', category: 'PERSONAL', startTime: '19:00', endTime: '19:45', isRecurring: true, daysOfWeek: [0], startDate: '2026-08-24' },
];