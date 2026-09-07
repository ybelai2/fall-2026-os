export type CourseCode = 'COSC 457' | 'COSC 418' | 'COSC 350' | 'MATH 265';

export type EventStatus = 'CONFIRMED' | 'TBD' | 'RECURRING' | 'ANNOUNCED_LATER';

export type AcademicEventType = 
  | 'CLASS' 
  | 'HOMEWORK' 
  | 'EXAM' 
  | 'MIDTERM' 
  | 'FINAL' 
  | 'PROJECT' 
  | 'PROJECT MILESTONE' 
  | 'PRESENTATION' 
  | 'GROUP' 
  | 'PAPER' 
  | 'STUDY' 
  | 'ADMINISTRATIVE';

export interface GradingComponent {
  category: string;
  weightPercentage?: number;
  points?: number;
  description?: string;
}

export interface SyllabusItem {
  id: string;
  courseCode: CourseCode;
  title: string;
  type: AcademicEventType;
  date?: string;        // YYYY-MM-DD format
  dueTime?: string;     // e.g., "23:00", "14:00"
  startTime?: string;   // e.g., "16:00"
  endTime?: string;     // e.g., "18:40"
  location?: string;
  isGroupWork?: boolean;
  status: EventStatus;
  notes?: string;
  latePolicy?: string;
  source: 'SYLLABUS';
  completed?: boolean;
}

export interface CourseSyllabus {
  id: string;
  courseCode: CourseCode;
  courseName: string;
  section: string;
  instructor: string;
  meetingSchedule: string;
  grading: GradingComponent[];
  items: SyllabusItem[];
  policies?: {
    attendance?: string;
    lateWork?: string;
    aiPolicy?: string;
  };
}
