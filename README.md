# LinkedIn Streak Tracker

A lightweight frontend application built with Vite, React, and TypeScript to track daily LinkedIn engagement streaks.

## Project Structure

```
src/
├── components/
│   ├── Calendar.tsx       # Calendar view for activity tracking
│   ├── Controls.tsx       # Action buttons and controls
│   ├── StreakCounter.tsx  # Current streak display
│   └── index.ts           # Component exports
├── App.tsx                # Main application component with layout
├── App.css                # Application styles
├── index.css              # Global styles and color palette
└── main.tsx               # Application entry point

public/
└── vite.svg               # Vite logo asset

Configuration Files:
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── .eslintrc.cjs          # ESLint configuration
├── .prettierrc.json       # Prettier formatting configuration
└── package.json           # Project dependencies and scripts
```

## Color Palette

The application uses a professional LinkedIn-inspired color palette defined in `src/index.css`:

- **Primary**: `#0a66c2` (LinkedIn Blue)
- **Streak Active**: `#31a24c` (Green)
- **Streak Warning**: `#ff9500` (Orange)
- **Streak Danger**: `#c5222b` (Red)
- **Streak Neutral**: `#8a8d91` (Gray)

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will open automatically at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist/` directory.

### Linting

Check code quality:

```bash
npm run lint
```

### Formatting

Format code with Prettier:

```bash
npm run format
```

## Components

### StreakCounter

Displays the current streak count and last activity date. This is a placeholder component that will be enhanced in subsequent tickets.

### Calendar

Shows a grid view of activity days with a color-coded legend for different streak states (active, warning, neutral). Currently displays placeholder data.

### Controls

Provides action buttons for logging daily activity and resetting the streak. Functions are currently stubs ready for implementation.

## Next Steps

This is the bootstrap phase. Subsequent tickets should focus on:

1. Backend API integration for streak data
2. Real calendar implementation with actual data
3. Streak logic and persistence
4. User authentication
5. Additional features and optimizations
