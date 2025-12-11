import './App.css';
import { Calendar } from './components/Calendar';
import { StreakCounter } from './components/StreakCounter';
import { Controls } from './components/Controls';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>LinkedIn Streak Tracker</h1>
        <p className="app-subtitle">
          Track your daily LinkedIn engagement streak
        </p>
      </header>

      <main className="app-main">
        <div className="layout-grid">
          <section className="section streak-section">
            <StreakCounter />
          </section>

          <section className="section calendar-section">
            <Calendar />
          </section>

          <section className="section controls-section">
            <Controls />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 LinkedIn Streak Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
