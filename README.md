# Fall 2026 OS

**A semester planner built with React, TypeScript, and Vite.**

[Live app](https://fall-2026-os.vercel.app/)

Fall 2026 OS combines a weekly class schedule, syllabus-derived dates, and personal planning blocks in one calendar. It was built for a specific semester at Towson University rather than as a general-purpose scheduling SaaS.

## Features

- **Weekly calendar:** navigate between weeks, jump to today, and filter by course.
- **Recurring events:** generate dated instances from templates, with academic-calendar rules that can suppress class events on no-class days.
- **Course obligations:** display dated syllabus items and a separate list of items without confirmed dates.
- **Personal planning:** add or edit blocks, mark individual event instances complete, and maintain week-specific notes.
- **Customization:** change week-specific wallpapers and quotes.
- **Local persistence:** browser `localStorage` stores events, exceptions, notes, and preferences.

## Technical design

The frontend uses **React + TypeScript**, **date-fns** for calendar calculations, **Tailwind CSS** for styling, and **Vite** for development and builds.

- `src/store/recurrenceEngine.ts` converts schedule templates and syllabus entries into the day's visible events, applies exceptions, and orders the results.
- `src/store/useCalendarStore.ts` manages calendar state and persists it locally.
- `src/data/` contains the semester-specific academic calendar, syllabi, and default schedule.
- `src/components/` holds event editing and wallpaper controls.

## Run locally

Requires a recent Node.js release and npm.

```bash
npm ci
npm run dev
```

To check and build:

```bash
npm run lint
npm run build
```

## Scope and limitations

This is a **client-side, single-user planner**. It does not implement accounts, cloud sync, shared calendars, or external-calendar integration. The shipped schedule is specific to Fall 2026; its dates should not be treated as current university guidance. Data is specific to the browser and may be lost when site storage is cleared.

The app demonstrates state modeling, recurrence rules, and UI implementation; the presence of build and lint scripts is not itself a claim of automated test coverage.
