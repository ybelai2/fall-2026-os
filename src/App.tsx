================================================
FILE: src/App.tsx
================================================
import { useState } from 'react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { CheckCircle2, Circle, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from './store/useCalendarStore';
import { useWallpaperStore } from './store/useWallpaperStore';
import { compileDay } from './store/recurrenceEngine';
import { academicCalendar } from './data/academicCalendar';
import { EventModal } from './components/EventModal';
import { WallpaperManager } from './components/WallpaperManager';
import type { CalendarEvent } from './types';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  const { events, exceptions, notes, toggleCompletion, addEvent, deleteEvent, editEvent, updateNote } = useCalendarStore();
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

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-primary isolate">
      {/* --- WALLPAPER SYSTEM --- */}
      <div className="fixed inset-0 bg-background -z-20" />
      <div 
        className="fixed inset-0 bg-cover bg-center -z-10 opacity-20 transition-all duration-700 ease-in-out"
        style={{ backgroundImage: `url('${currentWallpaper.imageUrl}')` }}
      />
      {/* Ambient quote display on desktop */}
      {currentWallpaper.quote && (
        <div className="fixed bottom-6 right-8 text-right -z-10 hidden md:flex flex-col items-end opacity-40 max-w-md pointer-events-none transition-opacity duration-700">
          {currentWallpaper.title && <h3 className="font-bold text-lg tracking-widest">{currentWallpaper.title}</h3>}
          <p className="font-mono text-sm italic">"{currentWallpaper.quote}"</p>
        </div>
      )}

      {/* --- RESPONSIVE HEADER --- */}
      <header className="border-b border-border bg-surface/90 backdrop-blur px-4 md:px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">FALL 2026 OS</h1>
          <p className="text-xs text-muted font-mono tracking-widest mt-1">FOCUS. DISCIPLINE. FINISH STRONG.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-background/80 border border-border rounded-lg overflow-hidden shrink-0 backdrop-blur">
            <button onClick={handlePrevWeek} className="p-2 hover:bg-border transition-colors text-muted hover:text-primary">
              <ChevronLeft size={18} />
            </button>
            <button onClick={handleToday} className="px-4 py-2 text-xs font-bold border-x border-border hover:bg-border transition-colors text-muted hover:text-primary">
              TODAY
            </button>
            <button onClick={handleNextWeek} className="p-2 hover:bg-border transition-colors text-muted hover:text-primary">
              <ChevronRight size={18} />
            </button>
          </div>

          <span className="text-sm font-mono text-muted text-right hidden sm:block">
            Week of {format(weekStart, 'MMM d, yyyy')}
          </span>
          
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsWallpaperModalOpen(true)}
              className="bg-surface border border-border text-primary px-3 py-2 text-sm font-bold rounded hover:bg-border transition-colors"
              title="Manage Wallpaper"
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
        {/* RESPONSIVE GRID */}
        <div className="flex md:grid md:grid-cols-7 overflow-x-auto md:overflow-visible gap-4 flex-1 min-h-0 snap-x snap-mandatory pb-2 md:pb-0 hide-scrollbar">
          {weekDays.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dailyEvents = compileDay(date, events, exceptions, academicCalendar);

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
                      className={`group p-2 rounded border text-sm flex flex-col gap-2 transition-colors ${
                        event.isCompleted 
                          ? 'border-border bg-background/80 text-muted opacity-60'
                          : event.category === 'CAREER' 
                            ? 'border-career bg-career/10 text-blue-100'
                            : event.category === 'CLASS'
                              ? 'border-class bg-class/10 text-yellow-100'
                              : 'border-border bg-background/90'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold leading-tight">{event.title}</span>
                        <div className="flex gap-2 shrink-0 opacity-40 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              const baseEvent = events.find(e => e.id === event.id);
                              if (baseEvent) {
                                setEditingEvent(baseEvent);
                                setIsModalOpen(true);
                              }
                            }}
                            className="text-muted hover:text-blue-400 transition-colors"
                            title="Edit Block"
                          >
                            <Edit2 size={14} />
                          </button>
                          
                          <button 
                            onClick={() => deleteEvent(event.id)}
                            className="text-muted hover:text-red-500 transition-colors"
                            title="Delete Block"
                          >
                            <Trash2 size={14} />
                          </button>
                          
                          <button 
                            onClick={() => toggleCompletion(event.instanceId, event.id, dateStr)}
                            className="text-muted hover:text-white transition-colors"
                            title="Mark Complete"
                          >
                            {event.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                          </button>
                        </div>
                      </div>
                      <span className="text-xs font-mono opacity-80">
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* WEEKLY NOTES / INSPIRATION BOX */}
        <div className="shrink-0 h-32 border border-border rounded-lg bg-surface/95 backdrop-blur-sm flex flex-col overflow-hidden focus-within:border-primary transition-colors shadow-lg">
          <div className="bg-[#1e1e20]/90 border-b border-border px-4 py-2 text-xs font-bold text-muted tracking-wider">
            WEEKLY FOCUS & VERSE
          </div>
          <textarea 
            value={notes[currentWeekKey] || ''}
            onChange={(e) => updateNote(currentWeekKey, e.target.value)}
            placeholder="Enter a Bible verse or inspirational quote for this week..."
            className="flex-1 bg-transparent p-4 text-sm text-primary resize-none outline-none leading-relaxed"
          />
        </div>
      </main>

      {isModalOpen && (
        <EventModal 
          defaultDate={format(currentDate, 'yyyy-MM-dd')}
          existingEvent={editingEvent}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
          onSave={(newEventData) => {
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
          onSave={(data) => updateWallpaper(currentWeekKey, data)}
          onReset={() => resetWallpaper(currentWeekKey)}
        />
      )}
    </div>
  );
}