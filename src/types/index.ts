export type Category = 
  | 'CLASS' 
  | 'CAREER' 
  | 'CS / TECHNICAL' 
  | 'STUDY' 
  | 'PROJECT' 
  | 'PROJECT MILESTONE'
  | 'FAITH' 
  | 'BODY' 
  | 'RELATIONSHIP' 
  | 'COMMUTE' 
  | 'MEAL' 
  | 'RECOVERY' 
  | 'SOCIAL MEDIA' 
  | 'SLEEP' 
  | 'PERSONAL'
  | 'HOMEWORK'
  | 'EXAM'
  | 'MIDTERM'
  | 'FINAL'
  | 'PRESENTATION'
  | 'PAPER'
  | 'ADMINISTRATIVE'
  | 'ACADEMIC CALENDAR' 
  | 'ACADEMIC DEADLINE' 
  | 'UNIVERSITY HOLIDAY' 
  | 'UNIVERSITY BREAK' 
  | 'EXAM PERIOD';

export type DayTier = 'BUSY' | 'MEDIUM' | 'OFF / RECOVERY';

export interface BaseEvent {
  title: string;
  description?: string;
  category: Category;
  startTime?: string; // Optional for deadlines with only dueTime
  endTime?: string;   
  dueTime?: string;   // Added for deadlines (e.g. 23:00)
  dueDate?: string;   // Added for deadlines
  courseCode?: string; // Added to badge course code (e.g. "COSC 457")
  isGroupWork?: boolean;
  status?: string;
  location?: string;
  instructor?: string;
  color?: string;
}

// Represents recurring schedule templates (The Plan)
export interface CalendarEvent extends BaseEvent {
  id: string;
  isRecurring: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'weekdays' | 'custom';
  daysOfWeek?: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  startDate: string;     // Format: "YYYY-MM-DD"
  endDate?: string;      // Format: "YYYY-MM-DD"
}

// Represents overrides and changes to specific dates (The Reality)
export interface EventException {
  id: string;            // Format: `${templateId}_${date}`
  templateId: string;
  date: string;          // Format: "YYYY-MM-DD"
  isCancelled: boolean;
  isCompleted: boolean;
  overrides?: Partial<BaseEvent>;
}

// University Academic Calendar Events
export interface AcademicDate {
  id: string;
  date: string;          // Format: "YYYY-MM-DD"
  endDate?: string;      // Format: "YYYY-MM-DD" (for ranges like Thanksgiving)
  title: string;
  description?: string;
  category: Category;
  noClasses: boolean;
  universityClosed: boolean;
}

// Wallpaper System Types
export interface WeeklyWallpaper {
  weekKey: string;       // Format: "YYYY-MM-DD" (Always a Monday)
  imageUrl: string;
  title?: string;
  quote?: string;
}
