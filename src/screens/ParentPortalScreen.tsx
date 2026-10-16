import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS } from '../data/lessonsData';
import { playPopSound, playCorrectSound, playTryAgainSound } from '../utils/sound';

export const ParentPortalScreen: React.FC = () => {
  const { progress, updateSettings, resetProgress, setScreen } = useApp();

  // Parental Gate Math Challenge
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [numA, setNumA] = useState(7);
  const [numB, setNumB] = useState(8);
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateError, setGateError] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    generateGateChallenge();
  }, []);

  const generateGateChallenge = () => {
    const a = Math.floor(Math.random() * 8) + 6; // 6 to 13
    const b = Math.floor(Math.random() * 8) + 4; // 4 to 11
    setNumA(a);
    setNumB(b);
    setGateAnswer('');
    setGateError(false);
  };

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = numA + numB;
    if (parseInt(gateAnswer.trim(), 10) === expected) {
      playCorrectSound(progress.settings.soundEnabled);
      setIsUnlocked(true);
      setGateError(false);
    } else {
      playTryAgainSound(progress.settings.soundEnabled);
      setGateError(true);
      generateGateChallenge();
    }
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    playPopSound(progress.settings.soundEnabled);
  };

  // If Gate is locked, show parent math verification
  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white border-3 border-purple-200 rounded-3xl p-6 shadow-lg text-center space-y-5">
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mx-auto text-2xl">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-800">
            Parents & Teachers Gate
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-1">
            To keep this dashboard safe for adults, please solve this quick problem:
          </p>
        </div>

        <form onSubmit={handleVerifyGate} className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-lg font-black text-purple-900">
            What is {numA} + {numB} ?
          </div>

          <input
            type="number"
            value={gateAnswer}
            onChange={(e) => setGateAnswer(e.target.value)}
            placeholder="Your answer"
            className="w-full text-center text-xl font-bold py-2.5 px-4 rounded-xl border-2 border-slate-300 focus:border-purple-500 focus:outline-none"
            autoFocus
          />

          {gateError && (
            <p className="text-xs font-bold text-rose-600 animate-wiggle">
              Oops! That wasn't quite right. Try the new problem above!
            </p>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setScreen('home')}
              className="w-1/2 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-md cursor-pointer"
            >
              Unlock Dashboard
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Unlocked Parent & Teacher Dashboard
  const totalAnswered = progress.accuracyStats.totalAnswered;
  const totalCorrect = progress.accuracyStats.totalCorrect;
  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-purple-900 text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-800 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <h2 className="text-xl font-black">Parent & Teacher Dashboard</h2>
            <p className="text-xs text-purple-200 font-medium">
              Learning analytics, mastery radar, difficulty controls & privacy
            </p>
          </div>
        </div>

        <button
          onClick={() => setScreen('home')}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to App</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Overall Accuracy
          </span>
          <div className="text-3xl font-black text-purple-700 mt-1">
            {accuracy}%
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalCorrect} correct of {totalAnswered} questions attempted
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Curriculum Progress
          </span>
          <div className="text-3xl font-black text-blue-700 mt-1">
            {Object.keys(progress.completedLessons).length} of {LESSONS.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Lessons completed with full stars
          </p>
        </div>

        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
            Star Rewards Bank
          </span>
          <div className="text-3xl font-black text-amber-500 mt-1">
            {progress.stars} ⭐
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total earned through quizzes and daily tasks
          </p>
        </div>
      </div>

      {/* Skills Mastery Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mastered Skills */}
        <div className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-black text-slate-800">Skills Mastered</h3>
          </div>
          {progress.masteredSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {progress.masteredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              Start completing practice questions in lessons and games to populate mastered skills.
            </p>
          )}
        </div>

        {/* Needs Practice */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black text-slate-800">
              Recommended Focus Areas
            </h3>
          </div>
          {progress.practiceNeeded.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {progress.practiceNeeded.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  ⚡ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium">
              Great performance! No weak spots detected so far.
            </p>
          )}
        </div>
      </div>

      {/* Settings & Accessibility Controls */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-purple-600" />
          <span>Learning & Accessibility Controls</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Snapping Mode */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-sm text-slate-800">
                Minute Hand Snapping
              </h5>
              <p className="text-xs text-slate-500 font-medium">
                5-minute intervals for beginners vs 1-minute exact
              </p>
            </div>
            <input
              type="checkbox"
              checked={progress.settings.snapTo5Minutes}
              onChange={(e) => updateSettings({ snapTo5Minutes: e.target.checked })}
              className="w-5 h-5 accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Sound FX */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-sm text-slate-800">Sound Effects</h5>
              <p className="text-xs text-slate-500 font-medium">
                Tick-tock, positive chimes and celebration sounds
              </p>
            </div>
            <input
              type="checkbox"
              checked={progress.settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Text-to-Speech Voice */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-sm text-slate-800">
                Spoken Voice Narration
              </h5>
              <p className="text-xs text-slate-500 font-medium">
                Read aloud instructions and clock times for young kids
              </p>
            </div>
            <input
              type="checkbox"
              checked={progress.settings.speechEnabled}
              onChange={(e) => updateSettings({ speechEnabled: e.target.checked })}
              className="w-5 h-5 accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Show Second Hand */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-sm text-slate-800">
                Show Live Second Hand
              </h5>
              <p className="text-xs text-slate-500 font-medium">
                Displays the ticking thin amber second hand
              </p>
            </div>
            <input
              type="checkbox"
              checked={progress.settings.showSecondHand}
              onChange={(e) => updateSettings({ showSecondHand: e.target.checked })}
              className="w-5 h-5 accent-purple-600 cursor-pointer"
            />
          </div>

          {/* 12h vs 24h Clock */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <h5 className="font-bold text-sm text-slate-800">
                24-Hour Digital Clock Mode
              </h5>
              <p className="text-xs text-slate-500 font-medium">
                Show 14:00 instead of 2:00 PM
              </p>
            </div>
            <input
              type="checkbox"
              checked={progress.settings.use24Hour}
              onChange={(e) => updateSettings({ use24Hour: e.target.checked })}
              className="w-5 h-5 accent-purple-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Safety & Privacy Disclosure */}
      <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-sm text-xs text-emerald-900 space-y-1">
        <h4 className="font-black text-sm flex items-center gap-1.5 text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Child Privacy & Safety Guarantee</span>
        </h4>
        <p className="leading-relaxed">
          TimeTastic is 100% ad-free and tracker-free. No personal information or voice recordings are collected or sent to external servers. All progress is saved privately on this device.
        </p>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-black text-rose-900 text-sm">
            Reset Learning Data
          </h4>
          <p className="text-xs text-rose-700">
            Clear all stars, badges, and completed lesson records.
          </p>
        </div>

        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-black bg-rose-600 text-white cursor-pointer hover:bg-rose-700"
            >
              Confirm Reset
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-rose-700 border-2 border-rose-300 hover:bg-rose-100 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        )}
      </div>
    </div>
  );
};
