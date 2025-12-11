import { CalendarView, DayStatus } from './components/CalendarView';
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
    <div className="app">
      <header className="app-header">
        <h1>Calendar Grid View</h1>
        <p>Track your writing and publishing activity</p>
      </header>
      <main>
        <CalendarView dayStatuses={mockDayStatuses} />
      </main>
    </div>
  );
}

export default App;
