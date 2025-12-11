import './Controls.css';

export function Controls() {
  const handleLogActivity = () => {
    console.log('Log activity clicked');
  };

  const handleReset = () => {
    console.log('Reset streak clicked');
  };

  return (
    <div className="controls">
      <h2>Actions</h2>
      <div className="controls-grid">
        <button className="btn btn-primary" onClick={handleLogActivity}>
          Log Today's Activity
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset Streak
        </button>
      </div>
      <div className="controls-info">
        <p>Track your daily LinkedIn engagement to maintain your streak.</p>
      </div>
    </div>
  );
}
