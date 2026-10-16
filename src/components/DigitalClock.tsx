import React from 'react';
import { useApp } from '../context/AppContext';
import { formatDigitalTime, getTimeInWords, getTimeOfDay } from '../utils/clockUtils';

interface DigitalClockProps {
  hours: number;
  minutes: number;
  isPM?: boolean;
  showWords?: boolean;
  showTimeOfDay?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({
  hours,
  minutes,
  isPM,
  showWords = true,
  showTimeOfDay = true,
  size = 'md',
  className = '',
}) => {
  const { progress } = useApp();
  const timeOfDay = getTimeOfDay(hours);

  // If isPM is not explicitly specified, deduce from 24h hours
  const calculatedIsPM = isPM !== undefined ? isPM : hours >= 12;

  const { timeString, period } = formatDigitalTime(
    hours,
    minutes,
    progress.settings.use24Hour,
    calculatedIsPM
  );

  const [hh, mm] = timeString.split(':');
  const words = getTimeInWords(hours, minutes);

  const sizeStyles = {
    sm: {
      box: 'px-4 py-2 rounded-xl',
      digits: 'text-2xl',
      badge: 'text-xs px-2 py-0.5',
      words: 'text-xs',
    },
    md: {
      box: 'px-6 py-3 rounded-2xl',
      digits: 'text-4xl md:text-5xl',
      badge: 'text-sm px-2.5 py-1',
      words: 'text-sm md:text-base',
    },
    lg: {
      box: 'px-8 py-5 rounded-3xl',
      digits: 'text-5xl md:text-6xl',
      badge: 'text-base px-3 py-1.5',
      words: 'text-base md:text-lg',
    },
  }[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Main Digital Clock Card */}
      <div
        className={`bg-slate-900 border-4 border-slate-700 text-white shadow-xl flex items-center justify-center gap-2.5 font-mono font-black tracking-wider ${sizeStyles.box}`}
      >
        {/* Hour (Blue) */}
        <span className="text-blue-400 drop-shadow">{hh}</span>

        {/* Flashing colon */}
        <span className="text-amber-400 animate-pulse">:</span>

        {/* Minute (Red/Rose) */}
        <span className="text-rose-400 drop-shadow">{mm}</span>

        {/* AM / PM Badge */}
        {!progress.settings.use24Hour && (
          <span
            className={`font-sans font-extrabold rounded-lg ml-1 shadow-sm ${
              period === 'AM'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                : 'bg-indigo-500/20 border border-indigo-400 text-indigo-300'
            } ${sizeStyles.badge}`}
          >
            {period}
          </span>
        )}
      </div>

      {/* Spoken words representation */}
      {showWords && (
        <div className="bg-amber-100 border border-amber-300 px-4 py-1.5 rounded-full text-amber-900 font-bold shadow-sm flex items-center gap-2 animate-fadeIn">
          <span>🗣️</span>
          <span className={sizeStyles.words}>"{words}"</span>
        </div>
      )}

      {/* Time of day indicator */}
      {showTimeOfDay && (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <span>{timeOfDay.icon}</span>
          <span>
            {timeOfDay.category} ({period === 'AM' ? 'Morning half' : 'Afternoon/Night half'})
          </span>
        </div>
      )}
    </div>
  );
};
