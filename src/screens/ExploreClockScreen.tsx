import React, { useState } from 'react';
import {
  Volume2,
  Sliders,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Shuffle,
  Plus,
  Minus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AnalogClock } from '../components/AnalogClock';
import { DigitalClock } from '../components/DigitalClock';
import { Mascot } from '../components/Mascot';
import {
  getClockExplanation,
  getTimeInWords,
  formatDigitalTime,
} from '../utils/clockUtils';
import { speakText } from '../utils/speech';
import { playPopSound } from '../utils/sound';

export const ExploreClockScreen: React.FC = () => {
  const { progress, updateSettings, currentMascot } = useApp();

  // Interactive time state
  const [hours, setHours] = useState(3);
  const [minutes, setMinutes] = useState(0);
  const [isPM, setIsPM] = useState(false);
  const [highlightMode, setHighlightMode] = useState<
    'none' | 'numbers' | 'hour-hand' | 'minute-hand' | 'quarter-slice'
  >('none');

  const explanation = getClockExplanation(hours, minutes);
  const words = getTimeInWords(hours, minutes);

  const handleTimeChange = (newH: number, newM: number) => {
    setHours(newH);
    setMinutes(newM);
  };

  const handleSpeakExplanation = () => {
    playPopSound(progress.settings.soundEnabled);
    const textToSpeak = `It is ${words}! ${explanation}`;
    speakText(textToSpeak, true);
  };

  const setPreset = (h: number, m: number) => {
    playPopSound(progress.settings.soundEnabled);
    setHours(h);
    setMinutes(m);
  };

  const setRandomTime = () => {
    playPopSound(progress.settings.soundEnabled);
    const randomH = Math.floor(Math.random() * 12) + 1;
    const randomM = progress.settings.snapTo5Minutes
      ? Math.floor(Math.random() * 12) * 5
      : Math.floor(Math.random() * 60);
    setHours(randomH);
    setMinutes(randomM);
  };

  const addMinutes = (amount: number) => {
    playPopSound(progress.settings.soundEnabled);
    let total = hours * 60 + minutes + amount;
    if (total < 0) total += 12 * 60;
    const newH = Math.floor(total / 60) % 12 || 12;
    const newM = total % 60;
    setHours(newH);
    setMinutes(newM);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Mascot Guide */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-50 to-sky-100 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm">
        <Mascot
          message={`Drag the clock hands with your finger or mouse! Watch the digital clock change like magic!`}
          mood="happy"
          size="md"
        />
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Big Interactive Analog Clock */}
        <div className="lg:col-span-7 bg-white border-3 border-emerald-200 rounded-3xl p-6 shadow-md flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Interactive Clock Playground
            </span>

            {/* Snap Toggle (5-min vs 1-min) */}
            <button
              onClick={() =>
                updateSettings({ snapTo5Minutes: !progress.settings.snapTo5Minutes })
              }
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                progress.settings.snapTo5Minutes
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-indigo-100 border-indigo-300 text-indigo-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>
                {progress.settings.snapTo5Minutes ? '5-Min Snapping (Easy)' : '1-Min Exact (Advanced)'}
              </span>
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium mb-3 text-center">
            Tap and drag the circular handles labeled <strong className="text-blue-600">H</strong> and <strong className="text-rose-600">M</strong>!
          </p>

          <AnalogClock
            hours={hours}
            minutes={minutes}
            interactive={true}
            onChangeTime={handleTimeChange}
            size={310}
            highlightParts={
              highlightMode === 'none'
                ? []
                : [highlightMode]
            }
            showOuterMinutes={true}
          />

          {/* Quick Step Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <button
              onClick={() => addMinutes(-15)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95 cursor-pointer"
            >
              -15 Min
            </button>
            <button
              onClick={() => addMinutes(-5)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95 cursor-pointer"
            >
              -5 Min
            </button>
            <button
              onClick={() => addMinutes(5)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95 cursor-pointer"
            >
              +5 Min
            </button>
            <button
              onClick={() => addMinutes(15)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95 cursor-pointer"
            >
              +15 Min
            </button>
            <button
              onClick={setRandomTime}
              className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random</span>
            </button>
          </div>
        </div>

        {/* Right Column: Digital Display, Educational Explainer & Highlights */}
        <div className="lg:col-span-5 space-y-4">
          {/* Corresponding Digital Time */}
          <div className="bg-white border-2 border-emerald-200 rounded-3xl p-5 shadow-sm flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Matching Digital Time
            </span>

            <DigitalClock
              hours={hours}
              minutes={minutes}
              isPM={isPM}
              size="md"
              showWords={true}
            />

            {/* AM / PM Toggle Button */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => setIsPM(false)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  !isPM
                    ? 'bg-amber-400 text-slate-900 shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                AM (Morning)
              </button>
              <button
                onClick={() => setIsPM(true)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isPM
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                PM (Evening/Night)
              </button>
            </div>
          </div>

          {/* Educational Explainer Box */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-amber-950 flex items-center gap-1.5 text-base">
                <span>💡 Why are the hands here?</span>
              </h3>
              <button
                onClick={handleSpeakExplanation}
                className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
                title="Hear this explanation out loud"
              >
                <Volume2 className="w-4 h-4" />
                <span>Hear It</span>
              </button>
            </div>

            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              {explanation}
            </p>
          </div>

          {/* Quick Presets for Learning Concepts */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-2">
            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block">
              Try Classic Clock Benchmarks
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPreset(3, 0)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold p-2.5 rounded-xl border border-blue-200 text-left transition-colors cursor-pointer"
              >
                🎯 <strong>3:00</strong> (O’Clock)
              </button>
              <button
                onClick={() => setPreset(4, 30)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold p-2.5 rounded-xl border border-emerald-200 text-left transition-colors cursor-pointer"
              >
                🌓 <strong>4:30</strong> (Half Past)
              </button>
              <button
                onClick={() => setPreset(2, 15)}
                className="bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold p-2.5 rounded-xl border border-purple-200 text-left transition-colors cursor-pointer"
              >
                🍕 <strong>2:15</strong> (Quarter Past)
              </button>
              <button
                onClick={() => setPreset(6, 45)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold p-2.5 rounded-xl border border-rose-200 text-left transition-colors cursor-pointer"
              >
                ⌛ <strong>6:45</strong> (Quarter To)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
