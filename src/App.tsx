import { useState } from 'react';
import { format, addDays, subDays, startOfWeek } from 'date-fns';
import { CheckCircle2, Circle, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCalendarStore } from './store/useCalendarStore';
import { compileDay } from './store/recurrenceEngine';
import { academicCalendar } from './data/academicCalendar';
import { EventModal } from './components/EventModal';
import type { CalendarEvent } from './types';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  
  // Destructure the new notes data and update function
  const { events, exceptions, notes, toggleCompletion, addEvent, deleteEvent, editEvent, updateNote } = useCalendarStore();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
  
  // Unique key for this specific week's notes
  const currentWeekKey = format(weekStart, 'yyyy-MM-dd');

  const handlePrevWeek = () => setCurrentDate(prev => subDays(prev, 7));
  const handleNextWeek = () => setCurrentDate(prev => addDays(prev, 7));
  const handleToday = () => setCurrentDate(new Date());

  const openNewEventModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-primary">
      <header className="border-b border-border bg-surface px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">FALL 2026 OS</h1>
          <p className="text-xs text-muted font-mono tracking-widest mt-1">FOCUS. DISCIPLINE. FINISH STRONG.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden">
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

          <span className="text-sm font-mono text-muted w-36 text-right">
            Week of {format(weekStart, 'MMM d, yyyy')}
          </span>
          
          <button 
            onClick={openNewEventModal}
            className="bg-primary text-background px-4 py-2 text-sm font-bold rounded hover:bg-gray-200 transition-colors ml-4"
          >
            + ADD BLOCK
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-hidden flex flex-col gap-6">
        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-4 flex-1 min-h-0">
          {weekDays.map(date => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const dailyEvents = compileDay(date, events, exceptions, academicCalendar);

            return (
              <div key={dateStr} className="border border-border rounded-lg bg-surface flex flex-col overflow-hidden">
                <div className="p-3 border-b border-border bg-[#1e1e20] flex justify-between items-center shrink-0">
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
                      /* FIX: Added the "group" class here so hover states work! */
                      className={`group p-2 rounded border text-sm flex flex-col gap-2 transition-colors ${
                        event.isCompleted 
                          ? 'border-border bg-background text-muted opacity-60'
                          : event.category === 'CAREER' 
                            ? 'border-career bg-career/10 text-blue-100'
                            : event.category === 'CLASS'
                              ? 'border-class bg-class/10 text-yellow-100'
                              : 'border-border bg-background'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold leading-tight">{event.title}</span>
                        
                        {/* FIX: Now uses group-hover to appear smoothly */}
                        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          
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
        <div className="shrink-0 h-32 border border-border rounded-lg bg-surface flex flex-col overflow-hidden focus-within:border-primary transition-colors">
          <div className="bg-[#1e1e20] border-b border-border px-4 py-2 text-xs font-bold text-muted tracking-wider">
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
    </div>
  );
}