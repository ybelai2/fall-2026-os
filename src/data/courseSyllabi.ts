import type { CourseSyllabus } from '../types/syllabus';

export const FALL_2026_SYLLABI: CourseSyllabus[] = [
  {
    id: 'cosc-457',
    courseCode: 'COSC 457',
    courseName: 'Database Management Systems',
    section: '101',
    instructor: 'Dr. Sungchul Hong',
    meetingSchedule: 'Monday 4:00 PM–6:40 PM',
    grading: [
      { category: 'Exams (Midterm & Final)', weightPercentage: 45 },
      { category: 'Assignments', weightPercentage: 30 },
      { category: 'Term Project', weightPercentage: 15 },
      { category: 'Class Participation & Attendance', weightPercentage: 10, description: 'Pop quizzes/participation 6%, Attendance 4%' }
    ],
    policies: {
      aiPolicy: 'AI is allowed for the term project but NOT allowed for exams and generally not allowed for assignments except specified problems.',
      lateWork: '20% deduction per day.'
    },
    items: [
      {
        id: 'syllabus-cosc457-class-intro',
        courseCode: 'COSC 457',
        title: 'Introduction & Forming Project Groups',
        type: 'CLASS',
        date: '2026-08-24',
        startTime: '16:00',
        endTime: '18:40',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-hw1',
        courseCode: 'COSC 457',
        title: 'Homework #1 — ERD',
        type: 'HOMEWORK',
        date: '2026-09-21',
        dueTime: '23:59',
        status: 'CONFIRMED',
        latePolicy: '20% deduction per day',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-hw2',
        courseCode: 'COSC 457',
        title: 'Homework #2 — Relational Algebra',
        type: 'HOMEWORK',
        date: '2026-10-05',
        dueTime: '23:59',
        status: 'CONFIRMED',
        latePolicy: '20% deduction per day',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-proj1',
        courseCode: 'COSC 457',
        title: 'Project Report 1',
        type: 'PROJECT MILESTONE',
        date: '2026-10-12',
        dueTime: '23:59',
        isGroupWork: true,
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-hw3',
        courseCode: 'COSC 457',
        title: 'Homework #3 — Schema',
        type: 'HOMEWORK',
        date: '2026-10-12',
        dueTime: '23:59',
        status: 'CONFIRMED',
        latePolicy: '20% deduction per day',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-midterm',
        courseCode: 'COSC 457',
        title: 'Midterm Exam',
        type: 'MIDTERM',
        date: '2026-10-19',
        startTime: '16:00',
        endTime: '18:40',
        status: 'CONFIRMED',
        notes: 'Exams 45% category',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-hw4',
        courseCode: 'COSC 457',
        title: 'Homework #4 — SQL',
        type: 'HOMEWORK',
        date: '2026-10-26',
        dueTime: '23:59',
        status: 'CONFIRMED',
        latePolicy: '20% deduction per day',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-hw5',
        courseCode: 'COSC 457',
        title: 'Homework #5 — Normalization',
        type: 'HOMEWORK',
        date: '2026-11-16',
        dueTime: '23:59',
        status: 'CONFIRMED',
        latePolicy: '20% deduction per day',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-hw6',
        courseCode: 'COSC 457',
        title: 'Homework #6 — SQL & MySQL',
        type: 'HOMEWORK',
        date: '2026-11-23',
        dueTime: '23:59',
        status: 'CONFIRMED',
        latePolicy: '20% deduction per day',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-projpres',
        courseCode: 'COSC 457',
        title: 'Project Presentation',
        type: 'PRESENTATION',
        date: '2026-12-07',
        startTime: '16:00',
        endTime: '18:40',
        isGroupWork: true,
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-proj2',
        courseCode: 'COSC 457',
        title: 'Project Report 2 / Working App',
        type: 'PROJECT',
        date: '2026-12-07',
        dueTime: '23:59',
        isGroupWork: true,
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc457-final',
        courseCode: 'COSC 457',
        title: 'Final Exam',
        type: 'FINAL',
        date: '2026-12-14',
        startTime: '17:15',
        endTime: '19:15',
        location: 'YR0223',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      }
    ]
  },
  {
    id: 'cosc-418',
    courseCode: 'COSC 418',
    courseName: 'Ethical and Societal Concerns of Computer Scientists',
    section: '405',
    instructor: 'Dr. Yuanqiong Wang',
    meetingSchedule: 'Tuesday online, Thursday in-person 12:30 PM–1:45 PM',
    grading: [
      { category: 'Class Participation (In Person & Online)', points: 30 },
      { category: 'Self-Introduction', points: 5 },
      { category: 'Online Homework', points: 30 },
      { category: 'Individual Online Presentation', points: 10 },
      { category: 'Group Facilitation Materials', points: 10 },
      { category: 'Group In-person and Online Execution', points: 15 },
      { category: 'Individual Facilitation Reflection', points: 10 },
      { category: 'Facilitation Session Reviews', points: 40 },
      { category: 'Case Study', points: 30 },
      { category: 'Final Paper', points: 60 }
    ],
    policies: {
      attendance: 'Required. Tuesday online & Thursday in-person. More than 10 unexcused absences results in an F.',
      lateWork: 'Unless announced/pre-approved, late work receives zero.'
    },
    items: [
      {
        id: 'syllabus-cosc418-online-hw',
        courseCode: 'COSC 418',
        title: 'Online Homework (Blackboard)',
        type: 'HOMEWORK',
        status: 'ANNOUNCED_LATER',
        notes: 'Assigned throughout semester at instructor discretion; deadlines in Blackboard.',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc418-facilitation',
        courseCode: 'COSC 418',
        title: 'Group Facilitation & Presentation',
        type: 'PRESENTATION',
        isGroupWork: true,
        status: 'ANNOUNCED_LATER',
        notes: 'Group materials, execution, individual reflection & reviews.',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc418-casestudy-1',
        courseCode: 'COSC 418',
        title: 'Case Study Milestone 1',
        type: 'PROJECT MILESTONE',
        status: 'TBD',
        notes: 'Exact milestone dates TBD in syllabus.',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc418-casestudy-2',
        courseCode: 'COSC 418',
        title: 'Case Study Milestone 2',
        type: 'PROJECT MILESTONE',
        status: 'TBD',
        notes: 'Exact milestone dates TBD in syllabus.',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc418-finalpaper',
        courseCode: 'COSC 418',
        title: 'Final Paper (10–15 pages)',
        type: 'PAPER',
        date: '2026-12-08',
        dueTime: '14:00',
        status: 'CONFIRMED',
        notes: 'Ethical issue related to computer technology.',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc418-drop',
        courseCode: 'COSC 418',
        title: 'Last day to drop with no grade',
        type: 'ADMINISTRATIVE',
        date: '2026-09-01',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc418-withdraw',
        courseCode: 'COSC 418',
        title: 'Last day to withdraw with W',
        type: 'ADMINISTRATIVE',
        date: '2026-11-02',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      }
    ]
  },
  {
    id: 'cosc-350',
    courseCode: 'COSC 350',
    courseName: 'Data Communications and Computer Networks',
    section: '101',
    instructor: 'Dr. Alexander L. Wijesinha',
    meetingSchedule: 'Fall 2026 (Group project 4–5 students)',
    grading: [
      { category: 'Exam 1', weightPercentage: 25 },
      { category: 'Exam 2 (Final)', weightPercentage: 25 },
      { category: 'Computer Assignments (4 total)', weightPercentage: 25 },
      { category: 'Group Paper & Presentation Slides', weightPercentage: 25 }
    ],
    items: [
      {
        id: 'syllabus-cosc350-exam1',
        courseCode: 'COSC 350',
        title: 'Exam 1',
        type: 'EXAM',
        status: 'TBD',
        notes: 'Announced in class approximately two weeks before.',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-ca1',
        courseCode: 'COSC 350',
        title: 'Computer Assignment 1',
        type: 'HOMEWORK',
        status: 'TBD',
        notes: 'Date TBD — Instructor will announce',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-ca2',
        courseCode: 'COSC 350',
        title: 'Computer Assignment 2',
        type: 'HOMEWORK',
        status: 'TBD',
        notes: 'Date TBD — Instructor will announce',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-ca3',
        courseCode: 'COSC 350',
        title: 'Computer Assignment 3',
        type: 'HOMEWORK',
        status: 'TBD',
        notes: 'Date TBD — Instructor will announce',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-ca4',
        courseCode: 'COSC 350',
        title: 'Computer Assignment 4',
        type: 'HOMEWORK',
        status: 'TBD',
        notes: 'Date TBD — Instructor will announce',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-grouppaper',
        courseCode: 'COSC 350',
        title: 'Network Group Paper',
        type: 'PAPER',
        isGroupWork: true,
        status: 'TBD',
        notes: 'Conference-style paper on assigned networking topic',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-presentationslides',
        courseCode: 'COSC 350',
        title: 'Presentation Slides',
        type: 'PRESENTATION',
        isGroupWork: true,
        status: 'TBD',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-grouppresentation',
        courseCode: 'COSC 350',
        title: 'Network Group Presentation',
        type: 'PRESENTATION',
        isGroupWork: true,
        status: 'TBD',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-cosc350-exam2',
        courseCode: 'COSC 350',
        title: 'Exam 2 (Final Exam)',
        type: 'FINAL',
        date: '2026-12-09',
        startTime: '19:30',
        status: 'CONFIRMED',
        notes: 'Determined by Towson University Final Exam Schedule',
        source: 'SYLLABUS'
      }
    ]
  },
  {
    id: 'math-265',
    courseCode: 'MATH 265',
    courseName: 'Elementary Linear Algebra',
    section: '002',
    instructor: 'Dr. Leonid Stern',
    meetingSchedule: 'Monday / Wednesday 12:00 PM–1:50 PM (YR 102)',
    grading: [
      { category: 'Final Exam', weightPercentage: 30 },
      { category: 'Test 1', weightPercentage: 25 },
      { category: 'Test 2', weightPercentage: 25 },
      { category: 'Homework', weightPercentage: 15 },
      { category: 'Attendance', weightPercentage: 5 }
    ],
    policies: {
      lateWork: 'Submitted after Monday 11:00 PM deadline but before Wednesday 11:00 PM: 10% grade deduction. After Wednesday 11:00 PM: Zero.',
      attendance: 'No make-up tests.'
    },
    items: [
      {
        id: 'syllabus-math265-test1',
        courseCode: 'MATH 265',
        title: 'Test 1',
        type: 'EXAM',
        date: '2026-09-28',
        startTime: '12:00',
        endTime: '13:50',
        location: 'YR 102',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-math265-test2',
        courseCode: 'MATH 265',
        title: 'Test 2',
        type: 'EXAM',
        date: '2026-11-18',
        startTime: '12:00',
        endTime: '13:50',
        location: 'YR 102',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      },
      {
        id: 'syllabus-math265-final',
        courseCode: 'MATH 265',
        title: 'Final Exam',
        type: 'FINAL',
        date: '2026-12-12',
        startTime: '10:15',
        endTime: '12:15',
        location: 'YR 219',
        status: 'CONFIRMED',
        source: 'SYLLABUS'
      }
    ]
  }
];
