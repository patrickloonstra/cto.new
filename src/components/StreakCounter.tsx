import { useMemo } from 'react';
import { useActivity } from '../context/ActivityContext';
import { calculateStreak } from '../utils/streakEngine';
import './StreakCounter.css';

export function StreakCounter() {
  const { activities } = useActivity();

  const streakData = useMemo(() => {
    return calculateStreak(activities);
  }, [activities]);

  const getStatusColor = () => {
    switch (streakData.status) {
      case 'healthy':
        return 'healthy';
      case 'grace':
        return 'grace';
      case 'broken':
        return 'broken';
      default:
        return 'neutral';
    }
  };

  const getStatusLabel = () => {
    switch (streakData.status) {
      case 'healthy':
        return 'Healthy';
      case 'grace':
        return 'Grace Used';
      case 'broken':
        return 'Broken';
      default:
        return 'No Streak';
    }
  };

  const getStatusMessage = () => {
    if (!streakData.isOnStreak) {
      return 'No current streak. Log activity to start a new streak!';
    }

    if (streakData.status === 'grace') {
      return '⚠️ You used your grace day! Log activity tomorrow to maintain your streak.';
    }

    if (streakData.daysUntilBreak === 1) {
      return '✅ Streak is active! Keep it going with tomorrow\'s activity.';
    }

    return `Great job! You're ${streakData.currentStreak} days into your streak.`;
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="streak-counter">
      <h2>Current Streak</h2>
      
      <div className={`streak-display status-${getStatusColor()}`}>
        <div className={`streak-number ${getStatusColor()}`}>{streakData.currentStreak}</div>
        <div className="streak-label">days</div>
      </div>

      <div className={`streak-status ${getStatusColor()}`}>
        <div className="status-badge">{getStatusLabel()}</div>
      </div>

      <div className="streak-info">
        <div className="info-row">
          <span className="info-label">Last Activity:</span>
          <span className="info-value">{formatDate(streakData.lastActivityDate)}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Max Streak:</span>
          <span className="info-value">{streakData.maxStreak} days</span>
        </div>
        {streakData.isOnStreak && (
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={`status-text ${getStatusColor()}`}>
              {getStatusMessage().split('⚠️').pop()?.split('✅').pop()?.trim() || getStatusMessage()}
            </span>
          </div>
        )}
      </div>

      <div className={`streak-message ${getStatusColor()}`}>
        <p>{getStatusMessage()}</p>
      </div>

      {streakData.status === 'grace' && (
        <div className="warning-panel">
          <div className="warning-icon">⚠️</div>
          <div className="warning-content">
            <h4>Grace Day Active</h4>
            <p>You haven't logged activity yet today, but your grace day is protecting your streak. Log activity before tomorrow to keep your streak alive!</p>
          </div>
        </div>
      )}

      {streakData.status === 'broken' && streakData.currentStreak === 0 && (
        <div className="info-panel">
          <div className="info-icon">ℹ️</div>
          <div className="info-content">
            <h4>Start Your Streak</h4>
            <p>Click on a day in the calendar to mark it as written/published and begin your streak today!</p>
          </div>
        </div>
      )}
    </div>
  );
}
