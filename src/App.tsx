import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  differenceInCalendarWeeks,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
} from "date-fns";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  EyeOff,
  Flag,
  Image,
  LayoutGrid,
  List,
  MapPin,
  NotebookPen,
  Plus,
  Search,
  SlidersHorizontal,
  Sprout,
  Sun,
  Users,
  X,
} from "lucide-react";
import { useCalendarStore } from "./store/useCalendarStore";
import { useWallpaperStore } from "./store/useWallpaperStore";
import { compileDay, type RenderableEvent } from "./store/recurrenceEngine";
import { academicCalendar } from "./data/academicCalendar";
import { generateSyllabusEvents } from "./data/syllabusEvents";
import { EventModal } from "./components/EventModal";
import { EventCard } from "./components/EventCard";
import { WallpaperManager } from "./components/WallpaperManager";
import { Dialog } from "./components/Dialog";
import {
  COURSES,
  courseFor,
  displayTitle,
  eventTime,
  isDeadline,
  readableLabel,
  toneFor,
} from "./lib/planner";
import type { CalendarEvent } from "./types";

type View = "week" | "day" | "deadlines";
const unscheduledItems = generateSyllabusEvents().filter(
  (item) => item.status === "TBD" || item.status === "ANNOUNCED_LATER",
);

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>(() =>
    window.matchMedia("(max-width: 700px)").matches ? "day" : "week",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [blockDate, setBlockDate] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("ALL");
  const [showTbdModal, setShowTbdModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<RenderableEvent | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [notice, setNotice] = useState("");
  const [failedWallpaper, setFailedWallpaper] = useState("");

  const {
    events,
    exceptions,
    notes,
    toggleCompletion,
    addEvent,
    editEvent,
    updateNote,
  } = useCalendarStore();
  const { getWallpaper, updateWallpaper, resetWallpaper } = useWallpaperStore();
  const currentWeekKey = format(
    startOfWeek(currentDate, { weekStartsOn: 1 }),
    "yyyy-MM-dd",
  );
  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(parseISO(currentWeekKey), index);
        return {
          date,
          dateStr: format(date, "yyyy-MM-dd"),
          events: compileDay(date, events, exceptions, academicCalendar),
        };
      }),
    [currentWeekKey, events, exceptions],
  );
  const weekStart = days[0].date;
  const weekEnd = days[6].date;
  const currentWallpaper = getWallpaper(currentWeekKey);
  const semesterWeek =
    differenceInCalendarWeeks(weekStart, parseISO("2026-08-24"), {
      weekStartsOn: 1,
    }) + 1;
  const courseEvents = days
    .flatMap((day) => day.events)
    .filter(
      (event) =>
        selectedCourseFilter === "ALL" ||
        courseFor(event) === selectedCourseFilter,
    );
  const completed = courseEvents.filter((event) => event.isCompleted).length;
  const completionPercent = courseEvents.length
    ? Math.round((completed / courseEvents.length) * 100)
    : 0;
  const deadlines = courseEvents.filter(isDeadline);
  const remainingDeadlines = deadlines.filter(
    (event) => !event.isCompleted,
  ).length;
  const dateRange = `${format(weekStart, "MMM d")} – ${format(weekEnd, weekStart.getMonth() === weekEnd.getMonth() ? "d, yyyy" : "MMM d, yyyy")}`;
  const query = search.trim().toLowerCase();
  const filteredDays = days.map((day) => ({
    ...day,
    events: day.events.filter(
      (event) =>
        (selectedCourseFilter === "ALL" ||
          courseFor(event) === selectedCourseFilter) &&
        (!hideCompleted || !event.isCompleted) &&
        (!query ||
          [
            event.title,
            event.category,
            courseFor(event),
            event.description,
            event.location,
          ].some((value) => value?.toLowerCase().includes(query))) &&
        (view !== "deadlines" || isDeadline(event)),
    ),
  }));
  const selectedDay =
    filteredDays.find((day) => isSameDay(day.date, currentDate)) ||
    filteredDays[0];
  const visibleCount = (view === "day" ? [selectedDay] : filteredDays).reduce(
    (total, day) => total + day.events.length,
    0,
  );
  const activeFilters = Boolean(
    search || hideCompleted || selectedCourseFilter !== "ALL",
  );
  const selectedEventCompleted = selectedEvent
    ? Boolean(exceptions[selectedEvent.instanceId]?.isCompleted)
    : false;

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const resetFilters = () => {
    setSearch("");
    setHideCompleted(false);
    setSelectedCourseFilter("ALL");
  };
  const openNewBlock = (date = format(currentDate, "yyyy-MM-dd")) => {
    setBlockDate(date);
    setEditingEvent(null);
    setIsModalOpen(true);
  };
  const renderEvent = (event: RenderableEvent, expanded = false) => (
    <EventCard
      key={event.instanceId}
      event={event}
      expanded={expanded}
      onOpen={() => setSelectedEvent(event)}
      onToggle={() =>
        toggleCompletion(event.instanceId, event.id, event.originalDate)
      }
    />
  );

  return (
    <div className="app-shell">
      <a className="skip-link" href="#planner">
        Skip to planner
      </a>
      <aside className="sidebar" aria-label="Workspace navigation">
        <a href="#planner" className="brand">
          <span className="brand-mark">
            <Sprout size={24} />
          </span>
          <span>
            fall<span className="brand-os">OS</span>
            <small>A little more intentional.</small>
          </span>
        </a>
        <div className="semester-badge">
          <span className="status-dot" />
          Fall semester <span>2026</span>
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav className="primary-nav" aria-label="Planner views">
          <button
            className={view === "week" ? "nav-item active" : "nav-item"}
            onClick={() => setView("week")}
            aria-current={view === "week" ? "page" : undefined}
          >
            <LayoutGrid size={18} />
            Weekly planner
            <span className="nav-active-dot" />
          </button>
          <button
            className={view === "day" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setCurrentDate(new Date());
              setView("day");
            }}
            aria-current={view === "day" ? "page" : undefined}
          >
            <Sun size={19} />
            Today’s focus
          </button>
          <button
            className={view === "deadlines" ? "nav-item active" : "nav-item"}
            onClick={() => setView("deadlines")}
            aria-current={view === "deadlines" ? "page" : undefined}
          >
            <Flag size={18} />
            Deadlines<span className="nav-count">{remainingDeadlines}</span>
          </button>
          <button className="nav-item" onClick={() => setShowTbdModal(true)}>
            <Clock3 size={18} />
            Unscheduled
            <span className="nav-count">{unscheduledItems.length}</span>
          </button>
        </nav>
        <div className="nav-section-title">
          <p className="nav-label">MY COURSES</p>
          <span>04</span>
        </div>
        <nav className="course-nav" aria-label="Filter by course">
          <button
            className={`course-nav-item ${selectedCourseFilter === "ALL" ? "selected" : ""}`}
            onClick={() => setSelectedCourseFilter("ALL")}
            aria-pressed={selectedCourseFilter === "ALL"}
          >
            <BookOpen size={16} />
            <span>All courses & life</span>
            {selectedCourseFilter === "ALL" && <Check size={14} />}
          </button>
          {COURSES.map((course) => (
            <button
              key={course.code}
              className={`course-nav-item tone-${course.tone} ${selectedCourseFilter === course.code ? "selected" : ""}`}
              onClick={() => setSelectedCourseFilter(course.code)}
              aria-pressed={selectedCourseFilter === course.code}
            >
              <span className="course-dot" />
              <span>
                <strong>{course.code}</strong>
                <small>{course.name}</small>
              </span>
              {selectedCourseFilter === course.code && <Check size={14} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Sprout size={23} />
            <p>
              Small steps.
              <br />
              <strong>A meaningful semester.</strong>
            </p>
          </div>
          <button
            className="nav-item"
            onClick={() => setIsWallpaperModalOpen(true)}
          >
            <Image size={18} />
            Personalize your space
            <ArrowUpRight size={15} />
          </button>
          <div className="sidebar-footer">
            <span className="status-dot" />
            Your plan. Your pace.
          </div>
        </div>
      </aside>

      <div className="main-shell">
        {currentWallpaper.imageUrl &&
          currentWallpaper.imageUrl !== failedWallpaper && (
            <img
              className="workspace-wallpaper"
              src={currentWallpaper.imageUrl}
              alt=""
              onError={() => setFailedWallpaper(currentWallpaper.imageUrl)}
            />
          )}
        <header className="topbar">
          <div className="breadcrumb">
            <span className="mobile-brand">
              <Sprout size={21} />
              fallOS
            </span>
            <span className="desktop-breadcrumb">
              My workspace <ChevronRight size={13} />
            </span>
            <span className="breadcrumb-current">
              {view === "day"
                ? "Daily focus"
                : view === "deadlines"
                  ? "Deadlines"
                  : "Weekly planner"}
            </span>
          </div>
          <div className="topbar-right">
            <span className="today-date">
              <CalendarDays size={15} />
              {format(new Date(), "EEE, MMM d")}
            </span>
            <button
              className="icon-button"
              onClick={() => setShowTbdModal(true)}
              aria-label={`View ${unscheduledItems.length} unscheduled obligations`}
              title="Unscheduled obligations"
            >
              <Clock3 size={18} />
            </button>
            <button
              className="icon-button"
              onClick={() => setIsWallpaperModalOpen(true)}
              aria-label="Customize wallpaper"
              title="Customize wallpaper"
            >
              <SlidersHorizontal size={18} />
            </button>
            <span className="workspace-avatar" aria-label="Personal workspace">
              YB
            </span>
          </div>
        </header>

        <main id="planner" className="workspace" tabIndex={-1}>
          <section className="page-heading">
            <div>
              <p className="eyebrow">
                <span className="status-dot" />
                FALL 2026
                {semesterWeek > 0 && semesterWeek <= 17 && (
                  <>
                    <span className="eyebrow-divider">/</span>WEEK{" "}
                    {String(semesterWeek).padStart(2, "0")}
                  </>
                )}
              </p>
              <h1>
                {view === "day"
                  ? "One day at a time."
                  : view === "deadlines"
                    ? "A little ahead of the deadline."
                    : "Your week, in focus."}
              </h1>
              <p className="page-description">
                A little structure for everything that matters.
              </p>
            </div>
            <button
              className="button button-primary add-block-button"
              onClick={() => openNewBlock()}
            >
              <Plus size={17} />
              Add block
            </button>
          </section>

          <section className="summary-grid" aria-label="Selected week overview">
            <div className="summary-card">
              <div>
                <p>On your calendar</p>
                <div className="summary-value">
                  {courseEvents.length}
                  <span>blocks this week</span>
                </div>
                <span className="summary-caption">
                  {selectedCourseFilter === "ALL"
                    ? "Classes, goals, and time for you"
                    : selectedCourseFilter}
                </span>
              </div>
              <span className="summary-icon">
                <CalendarDays size={21} />
              </span>
            </div>
            <div className="summary-card">
              <div>
                <p>Making progress</p>
                <div className="summary-value">
                  {completed}
                  <span>of {courseEvents.length} complete</span>
                </div>
                <span className="summary-caption">
                  {completionPercent === 100
                    ? "A week well spent. Take a breath."
                    : completed
                      ? "One small win at a time"
                      : "Every small step counts"}
                </span>
              </div>
              <div
                className="progress-ring"
                role="img"
                aria-label={`${completionPercent}% complete`}
              >
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <circle cx="24" cy="24" r="20" />
                  <circle
                    className="progress-ring-fill"
                    cx="24"
                    cy="24"
                    r="20"
                    pathLength="100"
                    strokeDasharray={`${completionPercent} 100`}
                  />
                </svg>
                <span>{completionPercent}%</span>
              </div>
            </div>
            <button
              className="summary-card deadline-summary"
              onClick={() => setView("deadlines")}
            >
              <div>
                <p>Keep on your radar</p>
                <div className="summary-value">
                  {remainingDeadlines}
                  <span>deadlines left this week</span>
                </div>
                <span className="summary-caption">
                  View your due dates <ArrowUpRight size={13} />
                </span>
              </div>
              <span className="summary-icon amber-icon">
                <Flag size={21} />
              </span>
            </button>
          </section>

          <section className="calendar-panel" aria-label="Calendar">
            <div className="calendar-toolbar">
              <div className="calendar-title">
                <span className="calendar-title-icon">
                  <CalendarDays size={19} />
                </span>
                <div>
                  <h2>
                    {view === "day"
                      ? format(currentDate, "EEEE, MMMM d")
                      : dateRange}
                  </h2>
                  <p>
                    {selectedCourseFilter === "ALL"
                      ? "Your semester, with room for life."
                      : `${selectedCourseFilter} · ${COURSES.find((course) => course.code === selectedCourseFilter)?.name}`}
                  </p>
                </div>
              </div>
              <div className="calendar-controls">
                <div className="date-navigation">
                  <button
                    className="icon-button"
                    aria-label="Previous week"
                    onClick={() => setCurrentDate((date) => addDays(date, -7))}
                  >
                    <ChevronLeft size={17} />
                  </button>
                  <button
                    className="today-button"
                    onClick={() => setCurrentDate(new Date())}
                  >
                    Today
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Next week"
                    onClick={() => setCurrentDate((date) => addDays(date, 7))}
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>
                <div
                  className="view-switch"
                  role="group"
                  aria-label="Calendar view"
                >
                  {(["week", "day", "deadlines"] as const).map((item) => (
                    <button
                      key={item}
                      aria-pressed={view === item}
                      className={view === item ? "selected" : ""}
                      onClick={() => setView(item)}
                    >
                      {item === "week" ? (
                        <LayoutGrid size={14} />
                      ) : item === "day" ? (
                        <List size={14} />
                      ) : (
                        <Flag size={14} />
                      )}
                      {item === "deadlines" ? "Due" : readableLabel(item)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="filter-toolbar">
              <label className="search-field">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Find a block…"
                  aria-label="Search calendar blocks"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <div className="filter-actions">
                <select
                  className="course-select"
                  aria-label="Filter by course"
                  value={selectedCourseFilter}
                  onChange={(event) =>
                    setSelectedCourseFilter(event.target.value)
                  }
                >
                  <option value="ALL">All courses & life</option>
                  {COURSES.map((course) => (
                    <option key={course.code}>{course.code}</option>
                  ))}
                </select>
                <button
                  className={`filter-button ${hideCompleted ? "enabled" : ""}`}
                  onClick={() => setHideCompleted((value) => !value)}
                  aria-pressed={hideCompleted}
                >
                  <EyeOff size={15} />
                  <span>Hide completed</span>
                </button>
                {activeFilters && (
                  <button
                    className="clear-filter"
                    onClick={resetFilters}
                    aria-label="Clear filters"
                    title="Clear filters"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {view === "week" ? (
              <div
                className="week-scroll"
                tabIndex={0}
                role="region"
                aria-label="Weekly calendar, scroll horizontally to see all days"
              >
                <div className="week-grid">
                  {filteredDays.map((day) => (
                    <section
                      key={day.dateStr}
                      className={`day-column ${isToday(day.date) ? "is-today" : ""} ${day.date.getDay() === 0 || day.date.getDay() === 6 ? "is-weekend" : ""}`}
                      aria-label={format(day.date, "EEEE, MMMM d")}
                    >
                      <button
                        className="day-heading"
                        onClick={() => {
                          setCurrentDate(day.date);
                          setView("day");
                        }}
                        aria-label={`Open ${format(day.date, "EEEE, MMMM d")}`}
                      >
                        <span>
                          {format(day.date, "EEE")}
                          <span className="day-count">
                            {day.events.length}{" "}
                            {day.events.length === 1 ? "block" : "blocks"}
                          </span>
                        </span>
                        <span className="day-number">
                          {format(day.date, "d")}
                        </span>
                      </button>
                      <div className="day-events">
                        {day.events.map((event) => renderEvent(event))}
                        {day.events.length === 0 && (
                          <div className="day-empty">
                            <span className="empty-dash" />
                            {activeFilters
                              ? "No matching blocks"
                              : "A little breathing room"}
                          </div>
                        )}
                        <button
                          className="day-add"
                          onClick={() => openNewBlock(day.dateStr)}
                          aria-label={`Add block on ${format(day.date, "EEEE, MMMM d")}`}
                        >
                          <Plus size={14} />
                          Add block
                        </button>
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : (
              <div className="agenda-panel">
                {view === "day" && (
                  <div
                    className="day-picker"
                    role="group"
                    aria-label="Select a day"
                  >
                    {days.map((day) => (
                      <button
                        key={day.dateStr}
                        className={`${isSameDay(day.date, currentDate) ? "selected" : ""} ${isToday(day.date) ? "picker-today" : ""}`}
                        onClick={() => setCurrentDate(day.date)}
                        aria-pressed={isSameDay(day.date, currentDate)}
                        aria-label={format(day.date, "EEEE, MMMM d")}
                      >
                        <span>{format(day.date, "EEE")}</span>
                        <strong>{format(day.date, "d")}</strong>
                      </button>
                    ))}
                  </div>
                )}
                {visibleCount === 0 ? (
                  <div className="agenda-empty">
                    <span>
                      <Sun size={27} />
                    </span>
                    <h3>
                      {activeFilters
                        ? "Nothing matches just yet."
                        : view === "deadlines"
                          ? "Room to breathe."
                          : "A little open space."}
                    </h3>
                    <p>
                      {activeFilters
                        ? "Try another search or clear your filters."
                        : view === "deadlines"
                          ? "No deadlines scheduled for this week."
                          : "Make time for something that matters to you."}
                    </p>
                    <button
                      className="button button-secondary"
                      onClick={() =>
                        activeFilters ? resetFilters() : openNewBlock()
                      }
                    >
                      {activeFilters ? "Clear filters" : "Add a block"}
                      <Plus size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="agenda-list">
                    {(view === "day"
                      ? [selectedDay]
                      : filteredDays.filter((day) => day.events.length)
                    ).map((day) => (
                      <section key={day.dateStr} className="agenda-day">
                        <div className="agenda-day-label">
                          <span>{format(day.date, "EEE")}</span>
                          <strong>{format(day.date, "d")}</strong>
                          <small>{format(day.date, "MMM")}</small>
                        </div>
                        <div className="agenda-events">
                          {day.events.map((event) => renderEvent(event, true))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="calendar-footer">
              <span>
                <span className="status-dot" />
                Syllabus included <span className="footer-divider">·</span>{" "}
                {visibleCount} {visibleCount === 1 ? "block" : "blocks"} shown
              </span>
              <span className="calendar-hint">
                <CircleCheck size={13} />
                Check off a block. Keep moving.
              </span>
            </div>
          </section>

          <section className="reflection-grid" aria-label="Weekly reflections">
            <div className="notes-panel">
              <div className="notes-heading">
                <h2>
                  <NotebookPen size={18} />A focus for the week
                </h2>
                <span>
                  <CheckCheck size={14} />
                  Saved on this device
                </span>
              </div>
              <label className="sr-only" htmlFor="weekly-notes">
                Weekly focus and verse
              </label>
              <textarea
                id="weekly-notes"
                value={notes[currentWeekKey] || ""}
                onChange={(event) =>
                  updateNote(currentWeekKey, event.target.value)
                }
                placeholder="What matters most this week? A goal, a reminder, or a verse to carry with you…"
              />
              <div className="notes-footer">
                <span>WEEK OF {format(weekStart, "MMM d").toUpperCase()}</span>
                <span>A clear mind starts here.</span>
              </div>
            </div>
            <div className="inspiration-card">
              {currentWallpaper.imageUrl &&
                currentWallpaper.imageUrl !== failedWallpaper && (
                  <img
                    className="inspiration-image"
                    src={currentWallpaper.imageUrl}
                    alt=""
                    onError={() =>
                      setFailedWallpaper(currentWallpaper.imageUrl)
                    }
                  />
                )}
              <div className="inspiration-content">
                <div className="inspiration-heading">
                  <span>
                    <Sprout size={15} />A MOMENT TO RECENTER
                  </span>
                  <button
                    className="inspiration-edit"
                    onClick={() => setIsWallpaperModalOpen(true)}
                    aria-label="Edit weekly inspiration"
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </div>
                <blockquote>
                  {currentWallpaper.quote ||
                    "Make a little space for what matters."}
                </blockquote>
                <p>{currentWallpaper.title || "YOUR WEEKLY REMINDER"}</p>
              </div>
            </div>
          </section>
          <footer className="workspace-footer">
            <span>Designed around your days.</span>
            <span>
              One block at a time.
              <ArrowDown size={12} />
            </span>
          </footer>
        </main>
      </div>

      {notice && (
        <div className="toast" role="status">
          <CircleCheck size={17} />
          {notice}
        </div>
      )}
      {showTbdModal && (
        <Dialog
          wide
          title="On the horizon."
          description="Syllabus obligations waiting for a date. Check your instructor’s announcements or Blackboard for updates."
          onClose={() => setShowTbdModal(false)}
        >
          <div className="unscheduled-list">
            {unscheduledItems.map((item) => (
              <article
                className={`unscheduled-item tone-${toneFor({ ...item, category: "PERSONAL" })}`}
                key={item.id}
              >
                <div>
                  <span className="course-pill">{item.courseCode}</span>
                  <span className="pending-pill">
                    <Clock3 size={12} />
                    {item.status === "TBD" ? "Date TBD" : "Announced later"}
                  </span>
                </div>
                <h3>{item.title}</h3>
                {item.notes && <p>{item.notes}</p>}
              </article>
            ))}
          </div>
        </Dialog>
      )}
      {selectedEvent && (
        <Dialog
          title={displayTitle(selectedEvent)}
          description={format(
            parseISO(selectedEvent.originalDate),
            "EEEE, MMMM d, yyyy",
          )}
          onClose={() => setSelectedEvent(null)}
        >
          <div className="event-detail">
            <div className="detail-badges">
              <span className={`course-pill tone-${toneFor(selectedEvent)}`}>
                {courseFor(selectedEvent) ||
                  readableLabel(selectedEvent.category)}
              </span>
              {courseFor(selectedEvent) && (
                <span className="neutral-pill">
                  {readableLabel(selectedEvent.category)}
                </span>
              )}
              {selectedEvent.isGroupWork && (
                <span className="neutral-pill">
                  <Users size={13} />
                  Group work
                </span>
              )}
            </div>
            <p>
              <Clock3 size={17} />
              {eventTime(selectedEvent)}
            </p>
            {selectedEvent.location && (
              <p>
                <MapPin size={17} />
                {selectedEvent.location}
              </p>
            )}
            {selectedEvent.instructor && (
              <p>
                <BookOpen size={17} />
                {selectedEvent.instructor}
              </p>
            )}
            {selectedEvent.description && (
              <div className="detail-description">
                {selectedEvent.description}
              </div>
            )}
            <div className="dialog-actions actions-split">
              {selectedEvent.id.startsWith("user_") ? (
                <button
                  className="button button-secondary"
                  onClick={() => {
                    setEditingEvent(
                      events.find((event) => event.id === selectedEvent.id) ||
                        null,
                    );
                    setSelectedEvent(null);
                    setIsModalOpen(true);
                  }}
                >
                  Edit block
                </button>
              ) : (
                <span />
              )}
              <button
                className="button button-primary"
                onClick={() =>
                  toggleCompletion(
                    selectedEvent.instanceId,
                    selectedEvent.id,
                    selectedEvent.originalDate,
                  )
                }
              >
                <Check size={16} />
                {selectedEventCompleted ? "Mark incomplete" : "Mark complete"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
      {isModalOpen && (
        <EventModal
          defaultDate={blockDate || format(currentDate, "yyyy-MM-dd")}
          existingEvent={editingEvent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={(event) => {
            if (editingEvent) editEvent(editingEvent.id, event);
            else addEvent(event);
            setNotice(
              editingEvent
                ? "Block updated. You’re all set."
                : "A little time, well planned. Block added.",
            );
          }}
        />
      )}
      {isWallpaperModalOpen && (
        <WallpaperManager
          currentWallpaper={currentWallpaper}
          onClose={() => setIsWallpaperModalOpen(false)}
          onSave={(data) => {
            updateWallpaper(currentWeekKey, data);
            setFailedWallpaper("");
            setNotice("Your space, refreshed.");
          }}
          onReset={() => {
            resetWallpaper(currentWeekKey);
            setFailedWallpaper("");
            setNotice("Default wallpaper restored.");
          }}
        />
      )}
    </div>
  );
}
