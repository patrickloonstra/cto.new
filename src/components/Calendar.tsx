import './Calendar.css';

export function Calendar() {
  const days = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="calendar">
      <h2>Activity Calendar</h2>
      <div className="calendar-grid">
        {days.map((day) => (
          <div key={day} className="calendar-day placeholder">
            <span>{day}</span>
          </div>
        ))}
      </div>
      <div className="calendar-legend">
        <p>
          <span className="legend-color neutral"></span> No activity
        </p>
        <p>
          <span className="legend-color warning"></span> Low activity
        </p>
        <p>
          <span className="legend-color active"></span> Active
        </p>
      </div>
    </div>
  );
}
