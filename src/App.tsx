import { CalendarView, DayStatus } from './components/CalendarView';
import { StreakCounter } from './components/StreakCounter';
import { ActivityProvider } from './context/ActivityContext';
import './App.css';

function App() {
  const mockDayStatuses: DayStatus[] = [
    { date: new Date(2024, 0, 5), written: true, published: false },
    { date: new Date(2024, 0, 8), written: true, published: true },
    { date: new Date(2024, 0, 12), written: false, published: true },
    { date: new Date(2024, 0, 15), written: true, published: false },
    { date: new Date(2024, 0, 18), written: true, published: true },
    { date: new Date(2024, 0, 22), written: true, published: false },
    { date: new Date(2024, 0, 25), written: false, published: true },
    { date: new Date(2024, 0, 28), written: true, published: true },
  ];

  return (
    <ActivityProvider>
      <div className="app">
        <header className="app-header">
          <h1>LinkedIn Streak Tracker</h1>
          <p className="app-subtitle">Track your daily LinkedIn engagement streak</p>
        </header>
        
        <main className="app-main">
          <div className="layout-grid">
            <section className="section streak-section">
              <StreakCounter />
            </section>

            <section className="section calendar-section">
              <CalendarView dayStatuses={mockDayStatuses} />
            </section>
          </div>
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 LinkedIn Streak Tracker. All rights reserved.</p>
        </footer>
      </div>
    </ActivityProvider>
  );
}

export default App;
