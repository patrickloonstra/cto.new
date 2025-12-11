import { useState } from 'react';
import { useActivity } from '../context/ActivityContext';
import './CalendarView.css';

export interface DayStatus {
  date: Date;
  written: boolean;
  published: boolean;
}

export interface CalendarViewProps {
  dayStatuses?: DayStatus[];
  onDayClick?: (date: Date) => void;
}

export function CalendarView({ dayStatuses = [], onDayClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayPanel, setShowDayPanel] = useState(false);
  const { getActivity, updateActivity, clearActivity } = useActivity();

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getStatusForDate = (date: Date) => {
    const activity = getActivity(date);
    if (activity) {
      return {
        written: activity.written,
        published: activity.published,
      };
    }

    // Fall back to prop-based statuses if provided
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const status = dayStatuses.find(s => {
      const sDate = new Date(s.date.getFullYear(), s.date.getMonth(), s.date.getDate());
      return sDate.getTime() === normalizedDate.getTime();
    });
    return status || { written: false, published: false };
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowDayPanel(true);
    onDayClick?.(date);
  };

  const toggleWritten = () => {
    if (selectedDate) {
      const current = getActivity(selectedDate);
      updateActivity(selectedDate, !current?.written, current?.published);
    }
  };

  const togglePublished = () => {
    if (selectedDate) {
      const current = getActivity(selectedDate);
      updateActivity(selectedDate, current?.written, !current?.published);
    }
  };

  const handleClear = () => {
    if (selectedDate) {
      clearActivity(selectedDate);
    }
  };

  const handleBothToggle = () => {
    if (selectedDate) {
      const current = getActivity(selectedDate);
      const bothActive = current?.written && current?.published;
      if (bothActive) {
        clearActivity(selectedDate);
      } else {
        updateActivity(selectedDate, true, true);
      }
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day calendar-day-empty" />
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const { written, published } = getStatusForDate(date);
      
      let statusClass = 'status-none';
      if (written && published) {
        statusClass = 'status-both';
      } else if (published) {
        statusClass = 'status-published';
      } else if (written) {
        statusClass = 'status-written';
      }

      const isSelected = selectedDate && 
        selectedDate.getFullYear() === date.getFullYear() &&
        selectedDate.getMonth() === date.getMonth() &&
        selectedDate.getDate() === date.getDate();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${statusClass} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(date)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleDayClick(date);
            }
          }}
        >
          <div className="day-number">{day}</div>
          <div className="indicators">
            <div 
              className={`indicator indicator-written ${written ? 'active' : ''}`}
              aria-label={written ? 'Written' : 'Not written'}
            />
            <div 
              className={`indicator indicator-published ${published ? 'active' : ''}`}
              aria-label={published ? 'Published' : 'Not published'}
            />
          </div>
        </div>
      );
    }

    return days;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedStatus = selectedDate ? getStatusForDate(selectedDate) : null;
  const selectedDateStr = selectedDate 
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button 
          onClick={() => navigateMonth(-1)} 
          className="nav-button"
          aria-label="Previous month"
        >
          &#8249;
        </button>
        <h2 className="month-title">{getMonthName(currentDate)}</h2>
        <button 
          onClick={() => navigateMonth(1)} 
          className="nav-button"
          aria-label="Next month"
        >
          &#8250;
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekdays.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {renderCalendarDays()}
      </div>

      {showDayPanel && selectedDate && selectedStatus && (
        <div className="day-panel">
          <div className="panel-header">
            <h3>Edit Activity</h3>
            <button 
              className="close-btn" 
              onClick={() => setShowDayPanel(false)}
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            <p className="selected-date">{selectedDateStr}</p>
            
            <div className="activity-controls">
              <button
                className={`toggle-btn ${selectedStatus.written ? 'active' : ''}`}
                onClick={toggleWritten}
              >
                <span className="indicator indicator-written"></span>
                Toggle Written
              </button>
              <button
                className={`toggle-btn ${selectedStatus.published ? 'active' : ''}`}
                onClick={togglePublished}
              >
                <span className="indicator indicator-published"></span>
                Toggle Published
              </button>
              <button
                className={`toggle-btn both ${selectedStatus.written && selectedStatus.published ? 'active' : ''}`}
                onClick={handleBothToggle}
              >
                Both
              </button>
            </div>

            {(selectedStatus.written || selectedStatus.published) && (
              <button
                className="clear-btn"
                onClick={handleClear}
              >
                Clear Activity
              </button>
            )}
          </div>
        </div>
      )}

      <div className="calendar-legend">
        <h3 className="legend-title">Legend</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="indicator indicator-written active" />
            <span>Written</span>
          </div>
          <div className="legend-item">
            <div className="indicator indicator-published active" />
            <span>Published</span>
          </div>
          <div className="legend-item">
            <div className="status-box status-none" />
            <span>No activity</span>
          </div>
          <div className="legend-item">
            <div className="status-box status-written" />
            <span>Written only</span>
          </div>
          <div className="legend-item">
            <div className="status-box status-published" />
            <span>Published only</span>
          </div>
          <div className="legend-item">
            <div className="status-box status-both" />
            <span>Both</span>
          </div>
        </div>
      </div>
    </div>
  );
}
