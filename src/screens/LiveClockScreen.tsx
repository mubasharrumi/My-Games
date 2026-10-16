import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  ArrowLeft,
  LayoutGrid,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnalogClock } from '../components/AnalogClock';
import { DigitalClock } from '../components/DigitalClock';
import { getTimeInWords, getTimeOfDay, formatDigitalTime } from '../utils/clockUtils';
import { speakText } from '../utils/speech';
import { playPopSound } from '../utils/sound';

export const LiveClockScreen: React.FC = () => {
  const { setScreen, progress, currentMascot } = useApp();
  const [now, setNow] = useState(new Date());
  const [displayMode, setDisplayMode] = useState<'both' | 'analog' | 'digital'>('both');

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const isPM = hours >= 12;

  const timeOfDay = getTimeOfDay(hours);
  const words = getTimeInWords(hours, minutes);
  const digital = formatDigitalTime(hours, minutes, progress.settings.use24Hour, isPM);

  const handleSpeakTime = () => {
    playPopSound(progress.settings.soundEnabled);
    const spoken = `The current time is ${words}, ${digital.period}. ${timeOfDay.description}`;
    speakText(spoken, true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setScreen('home');
          }}
          className="flex items-center gap-2 bg-white border-2 border-amber-200 hover:bg-amber-50 px-4 py-2 rounded-2xl font-bold text-slate-700 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        {/* Display Mode Toggles: Both / Analog Only / Digital Only */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-amber-200 shadow-sm">
          <button
            onClick={() => setDisplayMode('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              displayMode === 'both'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Both Clocks
          </button>
          <button
            onClick={() => setDisplayMode('analog')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              displayMode === 'analog'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Analog Only
          </button>
          <button
            onClick={() => setDisplayMode('digital')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              displayMode === 'digital'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Digital Only
          </button>
        </div>
      </div>

      {/* Hero Time Capsule Card with Day/Night Sky Theme */}
      <div
        className={`relative overflow-hidden bg-gradient-to-b ${timeOfDay.skyColor} border-3 border-amber-300 rounded-3xl p-6 md:p-8 shadow-xl text-slate-900 flex flex-col items-center text-center`}
      >
        {/* Floating clouds/stars backdrop illustration */}
        <div className="absolute top-4 left-6 text-3xl opacity-80 animate-gentle-bounce">
          ☁️
        </div>
        <div className="absolute top-6 right-8 text-3xl opacity-80 animate-gentle-bounce" style={{ animationDelay: '1s' }}>
          ✨
        </div>

        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm text-xs font-black text-slate-800 mb-4 border border-white">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-World Clock (Updating Every Second)</span>
        </div>

        {/* Clocks Container */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 my-4">
          {(displayMode === 'both' || displayMode === 'analog') && (
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border-2 border-white/60 shadow-lg">
              <AnalogClock
                hours={hours}
                minutes={minutes}
                seconds={seconds}
                size={290}
                showSecondHand={progress.settings.showSecondHand}
                interactive={false}
              />
            </div>
          )}

          {(displayMode === 'both' || displayMode === 'digital') && (
            <div className="bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-3xl border-2 border-white/60 shadow-lg flex flex-col items-center justify-center space-y-4 max-w-sm">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Digital Time
              </span>

              <DigitalClock
                hours={hours}
                minutes={minutes}
                isPM={isPM}
                size="lg"
                showWords={false}
              />

              <div className="bg-amber-100/90 border border-amber-300 px-4 py-2 rounded-2xl text-amber-900 text-sm font-bold shadow-sm">
                "{words}"
              </div>

              {/* Hear Time Spoken Button */}
              <button
                onClick={handleSpeakTime}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-3 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>Hear Clock Out Loud</span>
              </button>
            </div>
          )}
        </div>

        {/* AM / PM and Time of Day Explanation */}
        <div className="mt-4 max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl p-5 border-2 border-amber-200/80 shadow-md text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{timeOfDay.icon}</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                {timeOfDay.greeting}
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                It is currently <span className="text-amber-700 font-bold">{digital.period}</span> ({timeOfDay.category})
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {timeOfDay.description}
          </p>

          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              <span className="font-extrabold text-amber-900">AM (Morning):</span>{' '}
              <span className="text-amber-800">Midnight (12:00 AM) to Noon (11:59 AM)</span>
            </div>
            <div className="bg-indigo-50 p-2.5 rounded-xl border border-indigo-200">
              <span className="font-extrabold text-indigo-900">PM (Afternoon/Night):</span>{' '}
              <span className="text-indigo-800">Noon (12:00 PM) to Midnight (11:59 PM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
