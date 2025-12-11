import './StreakCounter.css';

export function StreakCounter() {
  return (
    <div className="streak-counter">
      <h2>Current Streak</h2>
      <div className="streak-display">
        <div className="streak-number">0</div>
        <div className="streak-label">days</div>
      </div>
      <div className="streak-info">
        <p>Last activity: Not yet recorded</p>
      </div>
    </div>
  );
}
