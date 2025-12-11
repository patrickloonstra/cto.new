# Calendar Grid View

A React TypeScript component that renders a calendar with visual indicators for tracking writing and publishing status.

## Features

- **Month Grid View**: Displays the current month with weekday headers and one cell per day
- **Visual Indicators**: Each day cell contains two indicator dots (written/published)
- **Status States**: Four distinct visual states:
  - None: No activity (white background)
  - Written only: Blue themed (light blue background)
  - Published only: Green themed (light green background)
  - Both: Gradient combining blue and green
- **Month Navigation**: Previous/Next buttons to navigate between months
- **Interactive Legend**: Explains all indicators and status states
- **Accessible**: Includes ARIA labels, keyboard navigation support, and high contrast mode support
- **Responsive**: Adapts to different screen sizes

## Usage

```tsx
import { CalendarView, DayStatus } from './components/CalendarView';

const dayStatuses: DayStatus[] = [
  { date: new Date(2024, 0, 5), written: true, published: false },
  { date: new Date(2024, 0, 8), written: true, published: true },
  { date: new Date(2024, 0, 12), written: false, published: true },
];

function App() {
  return <CalendarView dayStatuses={dayStatuses} />;
}
```

## Props

### CalendarViewProps

- `dayStatuses` (optional): Array of `DayStatus` objects representing the status for each day

### DayStatus

- `date`: JavaScript Date object
- `written`: Boolean indicating if content was written on this day
- `published`: Boolean indicating if content was published on this day

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build
```

## Accessibility Features

- Semantic HTML structure
- ARIA labels for navigation buttons and indicators
- Keyboard navigation support
- High contrast mode support
- Reduced motion support for users with motion sensitivity
- Focus indicators for interactive elements

## Browser Support

Works in all modern browsers that support ES2020 and CSS Grid.
