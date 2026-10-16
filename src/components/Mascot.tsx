import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speakText, stopSpeaking } from '../utils/speech';

interface MascotProps {
  message?: string;
  mood?: 'idle' | 'happy' | 'thinking' | 'cheering' | 'encouraging';
  autoSpeak?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  message,
  mood = 'idle',
  autoSpeak = false,
  size = 'md',
  className = '',
}) => {
  const { currentMascot, progress } = useApp();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (message && autoSpeak && progress.settings.speechEnabled) {
      handleSpeak();
    }
    return () => {
      stopSpeaking();
      setSpeaking(false);
    };
  }, [message, autoSpeak, progress.settings.speechEnabled]);

  const handleSpeak = () => {
    if (!message) return;
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speakText(message, true, () => setSpeaking(false));
    }
  };

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  }[size];

  // SVG representation for each mascot
  const renderMascotSvg = () => {
    switch (currentMascot.id) {
      case 'pip':
        // Penguin
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Body */}
            <ellipse cx="50" cy="55" rx="32" ry="38" fill="#1E293B" />
            {/* Belly */}
            <ellipse cx="50" cy="58" rx="22" ry="28" fill="#F8FAFC" />
            {/* Flippers */}
            <path
              d="M18 55 C12 65 15 78 24 72 C22 64 22 58 18 55 Z"
              fill="#0F172A"
              className={speaking ? 'animate-wiggle' : ''}
            />
            <path
              d="M82 55 C88 65 85 78 76 72 C78 64 78 58 82 55 Z"
              fill="#0F172A"
              className={speaking ? 'animate-wiggle' : ''}
            />
            {/* Feet */}
            <ellipse cx="38" cy="92" rx="10" ry="5" fill="#F97316" />
            <ellipse cx="62" cy="92" rx="10" ry="5" fill="#F97316" />
            {/* Eyes */}
            <circle cx="40" cy="38" r="6" fill="#0F172A" />
            <circle cx="60" cy="38" r="6" fill="#0F172A" />
            <circle cx="38" cy="36" r="2.5" fill="#FFFFFF" />
            <circle cx="58" cy="36" r="2.5" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="32" cy="44" r="4" fill="#FCA5A5" opacity="0.6" />
            <circle cx="68" cy="44" r="4" fill="#FCA5A5" opacity="0.6" />
            {/* Beak */}
            <polygon points="44,43 56,43 50,54" fill="#EA580C" />
            {/* Red winter scarf */}
            <path
              d="M28 50 Q50 60 72 50 C70 55 30 55 28 50 Z"
              fill="#EF4444"
            />
            <rect x="58" y="52" width="9" height="18" rx="3" fill="#DC2626" />
          </svg>
        );

      case 'bella':
        // Bunny
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Ears */}
            <ellipse
              cx="36"
              cy="22"
              rx="9"
              ry="22"
              fill="#F472B6"
              transform="rotate(-8 36 22)"
              className="animate-gentle-bounce"
            />
            <ellipse
              cx="36"
              cy="22"
              rx="5"
              ry="16"
              fill="#FCE7F3"
              transform="rotate(-8 36 22)"
            />
            <ellipse
              cx="64"
              cy="22"
              rx="9"
              ry="22"
              fill="#F472B6"
              transform="rotate(8 64 22)"
              className="animate-gentle-bounce"
            />
            <ellipse
              cx="64"
              cy="22"
              rx="5"
              ry="16"
              fill="#FCE7F3"
              transform="rotate(8 64 22)"
            />
            {/* Head & Body */}
            <ellipse cx="50" cy="62" rx="30" ry="28" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2.5" />
            {/* Eyes */}
            <ellipse cx="38" cy="56" rx="5" ry="6" fill="#831843" />
            <ellipse cx="62" cy="56" rx="5" ry="6" fill="#831843" />
            <circle cx="36" cy="54" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="54" r="2" fill="#FFFFFF" />
            {/* Nose & Mouth */}
            <polygon points="47,65 53,65 50,68" fill="#EC4899" />
            <path d="M46 70 Q50 74 54 70" stroke="#DB2777" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="22" y1="64" x2="35" y2="66" stroke="#F472B6" strokeWidth="1.5" />
            <line x1="22" y1="70" x2="35" y2="69" stroke="#F472B6" strokeWidth="1.5" />
            <line x1="78" y1="64" x2="65" y2="66" stroke="#F472B6" strokeWidth="1.5" />
            <line x1="78" y1="70" x2="65" y2="69" stroke="#F472B6" strokeWidth="1.5" />
            {/* Cheeks */}
            <circle cx="32" cy="64" r="4.5" fill="#F472B6" opacity="0.4" />
            <circle cx="68" cy="64" r="4.5" fill="#F472B6" opacity="0.4" />
          </svg>
        );

      case 'leo':
        // Lion Cub
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Mane */}
            <circle cx="50" cy="52" r="38" fill="#D97706" />
            {/* Ears */}
            <circle cx="28" cy="28" r="9" fill="#B45309" />
            <circle cx="28" cy="28" r="5" fill="#FDE68A" />
            <circle cx="72" cy="28" r="9" fill="#B45309" />
            <circle cx="72" cy="28" r="5" fill="#FDE68A" />
            {/* Face */}
            <circle cx="50" cy="54" r="28" fill="#FBBF24" />
            {/* Eyes */}
            <circle cx="38" cy="48" r="5" fill="#451A03" />
            <circle cx="62" cy="48" r="5" fill="#451A03" />
            <circle cx="36" cy="46" r="2" fill="#FFFFFF" />
            <circle cx="60" cy="46" r="2" fill="#FFFFFF" />
            {/* Cheeks & Muzzle */}
            <ellipse cx="50" cy="62" rx="14" ry="10" fill="#FEF3C7" />
            <polygon points="46,57 54,57 50,62" fill="#78350F" />
            <path d="M46 64 Q50 67 54 64" stroke="#78350F" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            {/* Whiskers */}
            <circle cx="44" cy="61" r="1" fill="#78350F" />
            <circle cx="41" cy="63" r="1" fill="#78350F" />
            <circle cx="56" cy="61" r="1" fill="#78350F" />
            <circle cx="59" cy="63" r="1" fill="#78350F" />
          </svg>
        );

      case 'hootie':
      default:
        // Wise Owl
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Ears/Horns */}
            <polygon points="26,16 38,30 20,38" fill="#6B21A8" />
            <polygon points="74,16 62,30 80,38" fill="#6B21A8" />
            {/* Body */}
            <ellipse cx="50" cy="56" rx="34" ry="36" fill="#7E22CE" />
            {/* Belly feathers */}
            <ellipse cx="50" cy="62" rx="22" ry="24" fill="#FAF5FF" />
            <path d="M42 54 Q50 58 58 54 M40 62 Q50 66 60 62 M42 70 Q50 74 58 70" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Wings */}
            <ellipse
              cx="20"
              cy="58"
              rx="8"
              ry="20"
              fill="#581C87"
              className={speaking ? 'animate-wiggle' : ''}
            />
            <ellipse
              cx="80"
              cy="58"
              rx="8"
              ry="20"
              fill="#581C87"
              className={speaking ? 'animate-wiggle' : ''}
            />
            {/* Big friendly owl eyes */}
            <circle cx="36" cy="40" r="14" fill="#FFFFFF" stroke="#FBBF24" strokeWidth="3" />
            <circle cx="64" cy="40" r="14" fill="#FFFFFF" stroke="#FBBF24" strokeWidth="3" />
            <circle cx="38" cy="40" r="7" fill="#1E1B4B" />
            <circle cx="62" cy="40" r="7" fill="#1E1B4B" />
            <circle cx="35" cy="37" r="2.5" fill="#FFFFFF" />
            <circle cx="59" cy="37" r="2.5" fill="#FFFFFF" />
            {/* Golden Beak */}
            <polygon points="44,45 56,45 50,56" fill="#F59E0B" />
            {/* Feet */}
            <ellipse cx="40" cy="91" rx="6" ry="3" fill="#F59E0B" />
            <ellipse cx="60" cy="91" rx="6" ry="3" fill="#F59E0B" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Mascot Avatar with floating animation */}
      <div
        className={`relative ${sizeClasses} flex-shrink-0 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 ${
          mood === 'cheering' ? 'animate-gentle-bounce' : ''
        }`}
        onClick={handleSpeak}
        title={`Click to hear ${currentMascot.name} speak!`}
      >
        {renderMascotSvg()}
        {mood === 'cheering' && (
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 animate-spin" />
        )}
      </div>

      {/* Speech Bubble */}
      {message && (
        <div className="relative bg-white/95 backdrop-blur-sm border-2 border-amber-200 rounded-2xl px-4 py-2.5 shadow-md flex items-center gap-2 max-w-sm md:max-w-md">
          {/* Bubble tail pointing towards mascot */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-amber-200" />
          <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-7 border-y-transparent border-r-7 border-r-white" />

          <p className="text-slate-800 text-sm md:text-base font-medium leading-snug flex-1">
            {message}
          </p>

          {/* Voice button */}
          <button
            onClick={handleSpeak}
            aria-label={speaking ? 'Stop speaking' : 'Speak message aloud'}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
              speaking
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
            }`}
          >
            {speaking ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
