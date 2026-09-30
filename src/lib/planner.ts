import type { BaseEvent } from "../types";

export const COURSES = [
  { code: "COSC 457", name: "Database Management", tone: "blue" },
  { code: "COSC 418", name: "Ethics & Society", tone: "amber" },
  { code: "COSC 350", name: "Data & Networking", tone: "violet" },
  { code: "MATH 265", name: "Linear Algebra", tone: "teal" },
] as const;

// Older saved class blocks keep their course code in the title.
export function courseFor(event: BaseEvent) {
  return (
    event.courseCode ||
    COURSES.find((course) => event.title.includes(course.code))?.code
  );
}

export function toneFor(event: BaseEvent) {
  return (
    COURSES.find((course) => course.code === courseFor(event))?.tone ||
    (["CAREER", "PROJECT", "CS / TECHNICAL", "STUDY"].includes(event.category)
      ? "green"
      : "neutral")
  );
}

export function readableLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
}

export function displayTitle(event: BaseEvent) {
  const title = event.title.replace(/^(COSC|MATH) \d+\s*-\s*/, "");
  return title === title.toUpperCase() ? readableLabel(title) : title;
}

export function formatTime(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return value;
  return `${hour % 12 || 12}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

export function eventTime(event: BaseEvent) {
  if (event.startTime)
    return `${formatTime(event.startTime)}${event.endTime ? ` – ${formatTime(event.endTime)}` : ""}`;
  return event.dueTime ? `Due ${formatTime(event.dueTime)}` : "All day";
}

export function isDeadline(event: BaseEvent) {
  return (
    Boolean(event.dueTime) ||
    [
      "HOMEWORK",
      "EXAM",
      "MIDTERM",
      "FINAL",
      "PRESENTATION",
      "PAPER",
      "PROJECT MILESTONE",
    ].includes(event.category)
  );
}
