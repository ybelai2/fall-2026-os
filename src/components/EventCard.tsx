import { Check, Clock3, MapPin, Users } from "lucide-react";
import type { RenderableEvent } from "../store/recurrenceEngine";
import {
  courseFor,
  displayTitle,
  eventTime,
  readableLabel,
  toneFor,
} from "../lib/planner";

interface EventCardProps {
  event: RenderableEvent;
  onToggle: () => void;
  onOpen: () => void;
  expanded?: boolean;
}

export function EventCard({
  event,
  onToggle,
  onOpen,
  expanded,
}: EventCardProps) {
  return (
    <article
      className={`event-card tone-${toneFor(event)} ${event.isCompleted ? "is-complete" : ""} ${expanded ? "event-expanded" : ""}`}
    >
      <div className="event-topline">
        <span className="event-label">
          {courseFor(event) || readableLabel(event.category)}
        </span>
        <button
          className={`completion-button ${event.isCompleted ? "is-checked" : ""}`}
          onClick={onToggle}
          aria-label={`Mark ${event.title} ${event.isCompleted ? "incomplete" : "complete"}`}
          aria-pressed={event.isCompleted}
          title={event.isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {event.isCompleted && <Check size={12} strokeWidth={3} />}
        </button>
      </div>
      <button
        className="event-content"
        onClick={onOpen}
        aria-label={`View ${event.title}`}
      >
        <h3>{displayTitle(event)}</h3>
        <span className="event-time">
          <Clock3 size={12} />
          {eventTime(event)}
        </span>
        {expanded && event.location && (
          <span className="event-location">
            <MapPin size={13} />
            {event.location}
          </span>
        )}
        {expanded && event.description && (
          <p className="event-description">{event.description}</p>
        )}
        {(courseFor(event) || event.isGroupWork) && (
          <span className="event-bottomline">
            {courseFor(event) && <span>{readableLabel(event.category)}</span>}
            {event.isGroupWork && (
              <span className="group-label">
                <Users size={12} />
                Group
              </span>
            )}
          </span>
        )}
      </button>
    </article>
  );
}
