import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Gamepad2,
  Compass,
  Trophy,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Gift,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Mascot } from '../components/Mascot';
import { AnalogClock } from '../components/AnalogClock';
import { DigitalClock } from '../components/DigitalClock';
import { LESSONS } from '../data/lessonsData';
import { playPopSound } from '../utils/sound';
import { fireCelebrationConfetti } from '../components/ConfettiEffect';

export const HomeScreen: React.FC = () => {
  const {
    setScreen,
    progress,
    currentMascot,
    completeDailyChallenge,
    addStars,
  } = useApp();

  // Real-time live clock state for home screen display
  const [now, setNow] = useState(new Date());
  const [dailyCompleted, setDailyCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const completedCount = Object.keys(progress.completedLessons).length;
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);

  const todayStr = new Date().toISOString().split('T')[0];
  const isChallengeDone = progress.dailyChallengeCompletedDate === todayStr || dailyCompleted;

  const handleClaimDaily = () => {
    if (isChallengeDone) return;
    setDailyCompleted(true);
    completeDailyChallenge();
    fireCelebrationConfetti();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner with Friendly Mascot */}
      <div className="bg-gradient-to-r from-amber-200 via-orange-100 to-yellow-100 border-2 border-amber-300 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <Mascot
          message={`Hello, Time Explorer! I'm ${currentMascot.name}. Ready to explore the magic of clocks today?`}
          mood="cheering"
          size="lg"
          autoSpeak={false}
          className="w-full md:w-auto"
        />

        {/* Lessons Completed Progress Pill */}
        <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-300/80 rounded-2xl p-4 w-full md:w-72 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              Learning Progress
            </span>
            <span className="text-amber-700 font-extrabold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] font-semibold text-slate-500 mt-1.5 text-center">
            {completedCount} of {LESSONS.length} Lessons Finished
          </p>
        </div>
      </div>

      {/* Main Feature: Live Real-World Clock Spotlight */}
      <div className="bg-white border-2 border-blue-200 rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Live Real-World Time
            </span>
          </div>

          <AnalogClock
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            size={240}
            showSecondHand={true}
            interactive={false}
          />
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm space-y-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Your Clock Right Now
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              The clock hands are moving with real device time. Listen to the gentle ticks and see the hands turn!
            </p>
          </div>

          <DigitalClock
            hours={hours}
            minutes={minutes}
            isPM={hours >= 12}
            size="md"
            showWords={true}
          />

          <button
            onClick={() => {
              playPopSound(progress.settings.soundEnabled);
              setScreen('live');
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Clock className="w-5 h-5" />
            <span>Open Fullscreen Live Clock</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 4 Main Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Learn */}
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setScreen('lessons');
          }}
          className="group text-left bg-gradient-to-br from-blue-400 to-indigo-600 text-white p-5 rounded-3xl shadow-lg border-2 border-blue-300 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="bg-white/25 text-xs font-black px-2.5 py-1 rounded-full">
              7 Levels
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white group-hover:underline">
              1. Learn
            </h3>
            <p className="text-xs text-blue-100 font-medium mt-1">
              Step-by-step interactive lessons from basics to minutes and AM/PM.
            </p>
          </div>
        </button>

        {/* 2. Play Games */}
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setScreen('games');
          }}
          className="group text-left bg-gradient-to-br from-amber-400 to-orange-500 text-white p-5 rounded-3xl shadow-lg border-2 border-amber-300 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <span className="bg-white/25 text-xs font-black px-2.5 py-1 rounded-full">
              7 Games
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white group-hover:underline">
              2. Play Games
            </h3>
            <p className="text-xs text-amber-100 font-medium mt-1">
              Read the clock, drag hands, time detective, routine match & challenges!
            </p>
          </div>
        </button>

        {/* 3. Interactive Clock */}
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setScreen('explore');
          }}
          className="group text-left bg-gradient-to-br from-emerald-400 to-teal-600 text-white p-5 rounded-3xl shadow-lg border-2 border-emerald-300 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <span className="bg-white/25 text-xs font-black px-2.5 py-1 rounded-full">
              Playground
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white group-hover:underline">
              3. Play Clock
            </h3>
            <p className="text-xs text-emerald-100 font-medium mt-1">
              Drag hands freely, hear spoken times, and explore how clock gears work.
            </p>
          </div>
        </button>

        {/* 4. My Progress */}
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setScreen('progress');
          }}
          className="group text-left bg-gradient-to-br from-purple-400 to-fuchsia-600 text-white p-5 rounded-3xl shadow-lg border-2 border-purple-300 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48"
        >
          <div className="flex items-center justify-between">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <span className="bg-white/25 text-xs font-black px-2.5 py-1 rounded-full">
              ⭐ {progress.stars} Stars
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white group-hover:underline">
              4. My Progress
            </h3>
            <p className="text-xs text-purple-100 font-medium mt-1">
              Check your badges, star collection, and unlockable clock themes!
            </p>
          </div>
        </button>
      </div>

      {/* Daily Challenge Card */}
      <div className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 border-3 border-amber-400 rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center text-3xl shadow-sm">
            🎁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-800 text-amber-100 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                Daily Mission
              </span>
              <span className="text-xs font-bold text-amber-900">+5 Stars Bonus</span>
            </div>
            <h4 className="text-lg font-black text-slate-900 mt-0.5">
              Practice Time Today!
            </h4>
            <p className="text-xs text-amber-950 font-medium">
              Explore the clock and answer one practice question to claim your daily bonus.
            </p>
          </div>
        </div>

        <button
          onClick={handleClaimDaily}
          disabled={isChallengeDone}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm shadow-md transition-all ${
            isChallengeDone
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-white hover:bg-amber-50 text-amber-900 hover:scale-105 active:scale-95 cursor-pointer'
          }`}
        >
          {isChallengeDone ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Claimed Today!</span>
            </>
          ) : (
            <>
              <Gift className="w-5 h-5 text-amber-600" />
              <span>Claim +5 Stars!</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
