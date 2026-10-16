import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  getHourAngle,
  getMinuteAngle,
  getSecondAngle,
  calculatePointerAngle,
  minuteAngleToMinutes,
  hourAngleToHours,
} from '../utils/clockUtils';
import { playTickSound } from '../utils/sound';

interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds?: number;
  interactive?: boolean;
  onChangeTime?: (hours: number, minutes: number) => void;
  size?: number; // clock diameter in pixels
  highlightParts?: ('hour-hand' | 'minute-hand' | '12' | '6' | '3' | '9' | 'numbers' | 'quarter-slice')[];
  showOuterMinutes?: boolean;
  showSecondHand?: boolean;
  className?: string;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  hours,
  minutes,
  seconds = 0,
  interactive = false,
  onChangeTime,
  size = 320,
  highlightParts = [],
  showOuterMinutes = true,
  showSecondHand = false,
  className = '',
}) => {
  const { currentTheme, progress } = useApp();
  const clockRef = useRef<SVGSVGElement | null>(null);
  const [activeDragHand, setActiveDragHand] = useState<'hour' | 'minute' | null>(null);

  const hourAngle = getHourAngle(hours, minutes, seconds);
  const minuteAngle = getMinuteAngle(minutes, seconds);
  const secondAngle = getSecondAngle(seconds);

  const center = size / 2;
  const radius = size * 0.42;

  // Handle pointer down on hands or clock face
  const handlePointerDown = (hand: 'hour' | 'minute', e: React.PointerEvent) => {
    if (!interactive || !onChangeTime) return;
    e.preventDefault();
    e.stopPropagation();
    setActiveDragHand(hand);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const updateTimeFromPointer = useCallback(
    (clientX: number, clientY: number, targetHand: 'hour' | 'minute') => {
      if (!clockRef.current || !onChangeTime) return;
      const rect = clockRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const angle = calculatePointerAngle(dx, dy);

      playTickSound(progress.settings.soundEnabled);

      if (targetHand === 'minute') {
        const newMinutes = minuteAngleToMinutes(angle, progress.settings.snapTo5Minutes);
        onChangeTime(hours, newMinutes);
      } else {
        const rawHour = hourAngleToHours(angle);
        onChangeTime(rawHour, minutes);
      }
    },
    [hours, minutes, onChangeTime, progress.settings.snapTo5Minutes, progress.settings.soundEnabled]
  );

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeDragHand) return;
    updateTimeFromPointer(e.clientX, e.clientY, activeDragHand);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeDragHand) {
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
      setActiveDragHand(null);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive || !onChangeTime) return;
    const step = progress.settings.snapTo5Minutes ? 5 : 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const newM = (minutes + step) % 60;
      const newH = minutes + step >= 60 ? (hours % 12) + 1 : hours;
      onChangeTime(newH, newM);
      playTickSound(progress.settings.soundEnabled);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const newM = (minutes - step + 60) % 60;
      const newH = minutes - step < 0 ? (hours - 1 <= 0 ? 12 : hours - 1) : hours;
      onChangeTime(newH, newM);
      playTickSound(progress.settings.soundEnabled);
    }
  };

  // Quarter slice rendering for visual explanation (e.g. 0 to 15 mins)
  const renderQuarterSlice = () => {
    if (!highlightParts.includes('quarter-slice')) return null;
    const wedgeAngle = (minutes / 60) * 360;
    const largeArc = wedgeAngle > 180 ? 1 : 0;
    const rad = ((wedgeAngle - 90) * Math.PI) / 180;
    const endX = center + radius * Math.cos(rad);
    const endY = center + radius * Math.sin(rad);

    return (
      <path
        d={`M ${center} ${center} L ${center} ${center - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`}
        fill="rgba(59, 130, 246, 0.2)"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
    );
  };

  // Hour numerals (1-12)
  const numerals = Array.from({ length: 12 }, (_, i) => i + 1);

  // Minute tick marks (60 ticks)
  const minuteTicks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className={`relative inline-flex flex-col items-center select-none ${className}`}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={handleKeyDown}
      role={interactive ? 'slider' : 'img'}
      aria-label={`Clock showing ${hours}:${minutes.toString().padStart(2, '0')}. ${
        interactive ? 'Use arrow keys or drag hands to change time.' : ''
      }`}
    >
      <svg
        ref={clockRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="touch-none cursor-default drop-shadow-xl overflow-visible"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <defs>
          {/* Subtle 3D shadow for clock rim */}
          <radialGradient id="clockRimGrad" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor={currentTheme.rimColor} />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.4" />
          </radialGradient>
          <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={radius * 1.14}
          fill="url(#clockRimGrad)"
          stroke="#FFFFFF"
          strokeWidth="4"
        />

        {/* Main Clock Face */}
        <circle
          cx={center}
          cy={center}
          r={radius * 1.05}
          fill={currentTheme.faceColor}
          stroke={currentTheme.rimColor}
          strokeWidth="3"
        />

        {/* Quarter slice if highlighted */}
        {renderQuarterSlice()}

        {/* 60 Minute Tick Marks */}
        {minuteTicks.map((tick) => {
          const isFiveMin = tick % 5 === 0;
          const tickRad = ((tick * 6 - 90) * Math.PI) / 180;
          const innerR = radius * (isFiveMin ? 0.94 : 0.98);
          const outerR = radius * 1.02;

          const x1 = center + innerR * Math.cos(tickRad);
          const y1 = center + innerR * Math.sin(tickRad);
          const x2 = center + outerR * Math.cos(tickRad);
          const y2 = center + outerR * Math.sin(tickRad);

          return (
            <line
              key={tick}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isFiveMin ? currentTheme.numberColor : currentTheme.tickColor}
              strokeWidth={isFiveMin ? 2.5 : 1.2}
              strokeLinecap="round"
              opacity={isFiveMin ? 0.8 : 0.5}
            />
          );
        })}

        {/* Outer 5-minute interval badges (00, 05, 10, ... 55) */}
        {showOuterMinutes &&
          numerals.map((num) => {
            const minVal = (num * 5) % 60;
            const minRad = ((num * 30 - 90) * Math.PI) / 180;
            const badgeDist = radius * 1.22;
            const bx = center + badgeDist * Math.cos(minRad);
            const by = center + badgeDist * Math.sin(minRad);

            return (
              <g key={`outer-min-${num}`}>
                <circle
                  cx={bx}
                  cy={by}
                  r={size * 0.042}
                  fill="#F8FAFC"
                  stroke={currentTheme.minuteHandColor}
                  strokeWidth="1.5"
                  className="drop-shadow-sm"
                />
                <text
                  x={bx}
                  y={by + 4}
                  textAnchor="middle"
                  fontSize={size * 0.038}
                  fontWeight="bold"
                  fill={currentTheme.minuteHandColor}
                >
                  {minVal.toString().padStart(2, '0')}
                </text>
              </g>
            );
          })}

        {/* 12 Hour Numerals with friendly circular badges */}
        {numerals.map((num) => {
          const numRad = ((num * 30 - 90) * Math.PI) / 180;
          const numDist = radius * 0.78;
          const nx = center + numDist * Math.cos(numRad);
          const ny = center + numDist * Math.sin(numRad);

          const isHighlighted =
            highlightParts.includes('numbers') ||
            (num === 12 && highlightParts.includes('12')) ||
            (num === 6 && highlightParts.includes('6')) ||
            (num === 3 && highlightParts.includes('3')) ||
            (num === 9 && highlightParts.includes('9'));

          return (
            <g key={num}>
              {isHighlighted && (
                <circle
                  cx={nx}
                  cy={ny}
                  r={size * 0.065}
                  fill="#FEF08A"
                  stroke="#EAB308"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              )}
              <text
                x={nx}
                y={ny + (size * 0.052) / 2.7}
                textAnchor="middle"
                fontSize={size * 0.075}
                fontWeight="800"
                fill={isHighlighted ? '#854D0E' : currentTheme.numberColor}
                className="select-none"
              >
                {num}
              </text>
            </g>
          );
        })}

        {/* Short Blue Hour Hand */}
        <g
          transform={`rotate(${hourAngle} ${center} ${center})`}
          filter="url(#handShadow)"
          className={`transition-transform duration-75 ${
            highlightParts.includes('hour-hand') ? 'opacity-100' : ''
          }`}
        >
          {/* Main Hour Stem */}
          <line
            x1={center}
            y1={center + 12}
            x2={center}
            y2={center - radius * 0.54}
            stroke={currentTheme.hourHandColor}
            strokeWidth={size * 0.032}
            strokeLinecap="round"
          />
          {/* Hour Arrow Tip */}
          <polygon
            points={`${center - size * 0.024},${center - radius * 0.52} ${
              center + size * 0.024
            },${center - radius * 0.52} ${center},${center - radius * 0.62}`}
            fill={currentTheme.hourHandColor}
          />

          {/* Interactive Draggable Handle on Hour Hand */}
          {interactive && (
            <g
              onPointerDown={(e) => handlePointerDown('hour', e)}
              className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            >
              <circle
                cx={center}
                cy={center - radius * 0.58}
                r={size * 0.048}
                fill={currentTheme.hourHandColor}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x={center}
                y={center - radius * 0.58 + 3}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#FFFFFF"
              >
                H
              </text>
            </g>
          )}
        </g>

        {/* Long Red Minute Hand */}
        <g
          transform={`rotate(${minuteAngle} ${center} ${center})`}
          filter="url(#handShadow)"
          className={`transition-transform duration-75 ${
            highlightParts.includes('minute-hand') ? 'opacity-100' : ''
          }`}
        >
          {/* Main Minute Stem */}
          <line
            x1={center}
            y1={center + 18}
            x2={center}
            y2={center - radius * 0.8}
            stroke={currentTheme.minuteHandColor}
            strokeWidth={size * 0.022}
            strokeLinecap="round"
          />
          {/* Minute Arrow Tip */}
          <polygon
            points={`${center - size * 0.02},${center - radius * 0.78} ${
              center + size * 0.02
            },${center - radius * 0.78} ${center},${center - radius * 0.88}`}
            fill={currentTheme.minuteHandColor}
          />

          {/* Interactive Draggable Handle on Minute Hand */}
          {interactive && (
            <g
              onPointerDown={(e) => handlePointerDown('minute', e)}
              className="cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"
            >
              <circle
                cx={center}
                cy={center - radius * 0.84}
                r={size * 0.048}
                fill={currentTheme.minuteHandColor}
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x={center}
                y={center - radius * 0.84 + 3}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#FFFFFF"
              >
                M
              </text>
            </g>
          )}
        </g>

        {/* Second Hand (Optional) */}
        {showSecondHand && (
          <g transform={`rotate(${secondAngle} ${center} ${center})`}>
            <line
              x1={center}
              y1={center + 22}
              x2={center}
              y2={center - radius * 0.88}
              stroke={currentTheme.secondHandColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx={center}
              cy={center - radius * 0.88}
              r="3.5"
              fill={currentTheme.secondHandColor}
            />
          </g>
        )}

        {/* Center Nut / Pivot Pin */}
        <circle
          cx={center}
          cy={center}
          r={size * 0.038}
          fill="#1E293B"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <circle
          cx={center}
          cy={center}
          r={size * 0.015}
          fill={currentTheme.secondHandColor}
        />
      </svg>

      {/* Hand Legend Tags (Hour vs Minute) */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-blue-700">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block"
            style={{ backgroundColor: currentTheme.hourHandColor }}
          />
          <span>Short = Hour Hand</span>
        </div>
        <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold text-rose-700">
          <span
            className="w-3.5 h-3.5 rounded-full inline-block"
            style={{ backgroundColor: currentTheme.minuteHandColor }}
          />
          <span>Long = Minute Hand</span>
        </div>
      </div>
    </div>
  );
};
