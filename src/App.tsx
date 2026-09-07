import { useState } from 'react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { useCalendarStore } from './store/useCalendarStore';
import { useWallpaperStore } from './store/useWallpaperStore';
import { compileDay } from './store/recurrenceEngine';
import { academicCalendar } from './data/academicCalendar';
import { generateSyllabusEvents } from './data/syllabusEvents';
import { EventModal } from './components/EventModal';
import { WallpaperManager } from './components/WallpaperManager';
import type { CalendarEvent, WeeklyWallpaper } from './types';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('ALL');
  const [showTbdModal, setShowTbdModal] = useState(false);
  
  const { events, exceptions, notes, toggleCompletion, addEvent, editEvent, updateNote } = useCalendarStore();
  const { getWallpaper, updateWallpaper, resetWallpaper } = useWallpaperStore();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  const currentWeekKey = format(weekStart, 'yyyy-MM-dd');
  
  const currentWallpaper = getWallpaper(currentWeekKey);

  const handlePrevWeek = () => setCurrentDate(prev => subDays(prev, 7));
  const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));
  const handleToday = () => setCurrentDate(new Date());

  const openNewEventModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const tbdSyllabusItems = generateSyllabusEvents().filter(item => item.status === 'TBD' || item.status === 'ANNOUNCED_LATER');

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-primary isolate">
      {/* --- WALLPAPER SYSTEM --- */}
      <div className="fixed inset-0 bg-background -z-20" />
      <div 
        className="fixed inset-0 bg-cover bg-center -z-10 opacity-20 transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url('${currentWallpaper.imageUrl}')` }}
      />
      {currentWallpaper.quote && (
        <div className="fixed bottom-6 right-8 text-right -z-10 hidden md:flex flex-col items-end opacity-40 max-w-md pointer-events-none transition-opacity duration-700">
          {currentWallpaper.title && <h3 className="font-bold text-lg tracking-widest">{currentWallpaper.title}</h3>}
          <p className="font-mono text-sm italic">"{currentWallpaper.quote}"</p>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="border-b border-border bg-surface/90 backdrop-blur px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            FALL 2026 OS <span className="text-xs font-mono px-2 py-0.5 rounded bg-class/20 text-yellow-300 border border-class/30">Syllabus Active</span>
          </h1>
          <p className="text-xs text-muted font-mono tracking-widest mt-1">COSC 457 • COSC 418 • COSC 350 • MATH 265</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-background/80 border border-border rounded-lg p-1 text-xs font-mono">
            {['ALL', 'COSC 457', 'COSC 418', 'COSC 350', 'MATH 265'].map(course => (
              <button
                key={course}
                onClick={() => setSelectedCourseFilter(course)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  selectedCourseFilter === course ? 'bg-primary text-background font-bold' : 'text-muted hover:text-primary'
                }`}
              >
                {course}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-background/80 border border-border rounded-lg overflow-hidden shrink-0 backdrop-blur">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-border transition-colors text-muted hover:text-primary">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleToday} className="px-3 py-2 text-xs font-bold border-x border-border hover:bg-border transition-colors text-muted hover:text-primary">
              TODAY
            </button>
            <button onClick={handleNextWeek} className="p-2 hover:bg-border transition-colors text-muted hover:text-primary">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setShowTbdModal(true)}
              className="bg-surface border border-border text-yellow-400 px-3 py-2 text-xs font-bold rounded hover:bg-border transition-colors flex items-center gap-1.5"
              title="View TBD / Unscheduled Obligations"
            >
              <span title="TBD Obligations"><Clock size={14} /></span> TBD ({tbdSyllabusItems.length})
            </button>
            <button 
              onClick={() => setIsWallpaperModalOpen(true)}
              className="bg-surface border border-border text-primary px-3 py-2 text-sm font-bold rounded hover:bg-border transition-colors"
            >
              WALLPAPER
            </button>
            <button 
              onClick={openNewEventModal}
              className="bg-primary text-background px-4 py-2 text-sm font-bold rounded hover:bg-gray-200 transition-colors"
            >
              + ADD BLOCK
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col gap-6">
        <div className="flex md:grid md:grid-cols-7 overflow-x-auto md:overflow-visible gap-4 flex-1 min-h-0 snap-x snap-mandatory pb-2 md:pb-0 hide-scrollbar">
          {weekDays.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            let dailyEvents = compileDay(date, events, exceptions, academicCalendar);

            if (selectedCourseFilter !== 'ALL') {
              dailyEvents = dailyEvents.filter(e => e.courseCode === selectedCourseFilter || e.category === selectedCourseFilter);
            }

            return (
              <div 
                key={dateStr} 
                className="w-[85vw] sm:w-[300px] md:w-auto shrink-0 snap-center border border-border rounded-lg bg-surface/95 backdrop-blur-sm flex flex-col overflow-hidden shadow-lg"
              >
                <div className="p-3 border-b border-border bg-[#1e1e20]/90 flex justify-between items-center shrink-0">
                  <span className="font-bold">{format(date, 'EEE').toUpperCase()}</span>
                  <span className="text-muted text-sm font-mono">{format(date, 'd')}</span>
                </div>
                
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {dailyEvents.length === 0 && (
                    <div className="text-xs text-muted text-center p-4">No events scheduled.</div>
                  )}
                  {dailyEvents.map(event => (
                    <div 
                      key={event.instanceId}
                      className={`group p-2.5 rounded border text-sm flex flex-col gap-1.5 transition-colors ${
                        event.isCompleted 
                          ? 'border-border bg-background/80 text-muted opacity-60 line-through' 
                          : event.courseCode === 'COSC 457'
                            ? 'border-blue-500/40 bg-blue-500/10 text-blue-100'
                            : event.courseCode === 'MATH 265'
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                              : event.courseCode === 'COSC 350'
                                ? 'border-purple-500/40 bg-purple-500/10 text-purple-100'
                                : event.courseCode === 'COSC 418'
                                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-100'
                                  : 'border-border bg-background/90'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex flex-col">
                          {event.courseCode && (
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-80 flex items-center gap-1">
                              {event.courseCode} {event.isGroupWork && <span title="Group Work"><Users size={10} className="text-yellow-400" /></span>}
                            </span>
                          )}
                          <span className="font-bold leading-tight">{event.title}</span>
                        </div>
                        <div className="flex gap-1.5 shrink-0 opacity-60 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => toggleCompletion(event.instanceId, event.id, dateStr)}
                            className="text-muted hover:text-white transition-colors p-0.5"
                            title={event.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                          >
                            {event.isCompleted ? <CheckCircle2 size={16} className="text-green-400" /> : <Circle size={16} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] font-mono opacity-80 pt-1 border-t border-white/5">
                        <span>{event.startTime ? `${event.startTime} - ${event.endTime}` : event.dueTime ? `Due: ${event.dueTime}` : 'All Day'}</span>
                        <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-black/30">{event.category}</span>
                      </div>
                      {event.description && (
                        <p className="text-[10px] opacity-70 italic truncate mt-0.5" title={event.description}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* WEEKLY NOTES */}
        <div className="shrink-0 h-28 border border-border rounded-lg bg-surface/95 backdrop-blur-sm flex flex-col overflow-hidden focus-within:border-primary transition-colors shadow-lg">
          <div className="bg-[#1e1e20]/90 border-b border-border px-4 py-1.5 text-xs font-bold text-muted tracking-wider flex items-center justify-between">
            <span>WEEKLY FOCUS & VERSE</span>
            <span className="font-mono text-[10px]">Week of {format(weekStart, 'MMM d, yyyy')}</span>
          </div>
          <textarea 
            value={notes[currentWeekKey] || ''}
            onChange={(e) => updateNote(currentWeekKey, e.target.value)}
            placeholder="Enter semester goals, weekly focus, or Bible verse..."
            className="flex-1 bg-transparent p-3 text-sm text-primary resize-none outline-none leading-relaxed"
          />
        </div>
      </main>

      {/* TBD MODAL */}
      {showTbdModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-lg w-full max-w-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="text-yellow-400" size={20} /> TBD & UNCONFIRMED SYLLABUS OBLIGATIONS
                </h2>
                <p className="text-xs text-muted font-mono mt-0.5">Obligations from syllabi awaiting instructor announcement or Blackboard dates.</p>
              </div>
              <button onClick={() => setShowTbdModal(false)} className="text-muted hover:text-primary font-mono text-sm px-2 py-1">CLOSE</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {tbdSyllabusItems.map(item => (
                <div key={item.id} className="p-3 border border-border rounded bg-background/60 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-surface border border-border">{item.courseCode}</span>
                    <span className="text-xs font-mono text-yellow-400 font-bold">{item.status}</span>
                  </div>
                  <h4 className="font-bold text-sm mt-1">{item.title}</h4>
                  {item.notes && <p className="text-xs text-muted">{item.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <EventModal 
          defaultDate={format(currentDate, 'yyyy-MM-dd')}
          existingEvent={editingEvent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={(newEventData: Omit<CalendarEvent, 'id'>) => {
            if (editingEvent) {
              editEvent(editingEvent.id, newEventData);
            } else {
              addEvent(newEventData);
            }
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      )}

      {isWallpaperModalOpen && (
        <WallpaperManager 
          currentWallpaper={currentWallpaper}
          onClose={() => setIsWallpaperModalOpen(false)}
          onSave={(data: Partial<WeeklyWallpaper>) => updateWallpaper(currentWeekKey, data)}
          onReset={() => resetWallpaper(currentWeekKey)}
        />
      )}
    </div>
  );
}
