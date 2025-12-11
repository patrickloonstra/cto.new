import { useDayStatuses } from './hooks/useDayStatuses';
import { formatDateKey } from './models/DayStatus';

export function DayStatusExample() {
  const {
    statuses,
    getStatus,
    setStatus,
    createStatus,
    deleteStatus,
    clearAll,
    hasStorage,
  } = useDayStatuses();

  const today = formatDateKey(new Date());
  const todayStatus = getStatus(today);

  const handleToggleWritten = () => {
    if (todayStatus) {
      setStatus(today, { written: !todayStatus.written });
    } else {
      createStatus(today, true, false);
    }
  };

  const handleTogglePublished = () => {
    if (todayStatus) {
      setStatus(today, { published: !todayStatus.published });
    } else {
      createStatus(today, false, true);
    }
  };

  const handleClearToday = () => {
    deleteStatus(today);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Day Status Tracker</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Storage Available: {hasStorage ? '✅' : '❌'}</p>
        <p>Total Days Tracked: {Object.keys(statuses).length}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Today ({today})</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={todayStatus?.written ?? false}
              onChange={handleToggleWritten}
            />
            {' '}Written
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={todayStatus?.published ?? false}
              onChange={handleTogglePublished}
            />
            {' '}Published
          </label>
        </div>
        <button onClick={handleClearToday} disabled={!todayStatus}>
          Clear Today
        </button>
      </div>

      <div>
        <h2>All Statuses</h2>
        {Object.keys(statuses).length === 0 ? (
          <p>No statuses recorded yet.</p>
        ) : (
          <div>
            {Object.entries(statuses)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, status]) => (
                <div
                  key={date}
                  style={{
                    padding: '10px',
                    marginBottom: '5px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '3px',
                  }}
                >
                  <strong>{date}</strong>
                  {' - '}
                  Written: {status.written ? '✅' : '❌'}
                  {' | '}
                  Published: {status.published ? '✅' : '❌'}
                  <button
                    onClick={() => deleteStatus(date)}
                    style={{ marginLeft: '10px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={clearAll}
          style={{
            backgroundColor: '#ff4444',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          disabled={Object.keys(statuses).length === 0}
        >
          Clear All Statuses
        </button>
      </div>
    </div>
  );
}
