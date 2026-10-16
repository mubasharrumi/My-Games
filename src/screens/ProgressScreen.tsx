import React from 'react';
import {
  Trophy,
  Star,
  CheckCircle,
  Award,
  Sparkles,
  Palette,
  Users,
  Target,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLOCK_THEMES, MASCOTS } from '../data/themesData';
import { LESSONS } from '../data/lessonsData';
import { Mascot } from '../components/Mascot';
import { playPopSound, playFanfareSound } from '../utils/sound';
import { fireCelebrationConfetti } from '../components/ConfettiEffect';

export const ProgressScreen: React.FC = () => {
  const {
    progress,
    setTheme,
    setMascot,
    setScreen,
    currentTheme,
    currentMascot,
  } = useApp();

  const totalAnswered = progress.accuracyStats.totalAnswered;
  const totalCorrect = progress.accuracyStats.totalCorrect;
  const accuracyPercent =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 100;

  const completedLessonCount = Object.keys(progress.completedLessons).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-amber-100 border-2 border-purple-300 rounded-3xl p-5 shadow-sm">
        <Mascot
          message={`Look at how much you've accomplished! You have earned ${progress.stars} shining stars!`}
          mood="cheering"
          size="md"
        />
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-2xl">⭐</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {progress.stars}
          </div>
          <p className="text-xs font-bold text-slate-500">Stars Earned</p>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-2xl">📚</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {completedLessonCount} / {LESSONS.length}
          </div>
          <p className="text-xs font-bold text-slate-500">Lessons Completed</p>
        </div>

        <div className="bg-white border-2 border-emerald-200 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-2xl">🎯</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {accuracyPercent}%
          </div>
          <p className="text-xs font-bold text-slate-500">Accuracy</p>
        </div>

        <div className="bg-white border-2 border-purple-200 rounded-3xl p-4 shadow-sm text-center">
          <span className="text-2xl">🏆</span>
          <div className="text-2xl font-black text-purple-600 mt-1">
            {progress.totalScore}
          </div>
          <p className="text-xs font-bold text-slate-500">Total Points</p>
        </div>
      </div>

      {/* Clock Themes Wardrobe */}
      <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-black text-slate-800">
              Clock Themes & Skins
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Unlock new looks with stars!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLOCK_THEMES.map((theme) => {
            const isUnlocked = progress.unlockedThemes.includes(theme.id);
            const isSelected = progress.selectedTheme === theme.id;

            return (
              <div
                key={theme.id}
                className={`border-3 rounded-2xl p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-300'
                    : isUnlocked
                    ? 'border-slate-200 bg-white hover:border-slate-300'
                    : 'border-slate-200 bg-slate-50 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{theme.icon}</span>
                    {isSelected ? (
                      <span className="bg-amber-400 text-slate-900 font-extrabold text-[11px] px-2.5 py-0.5 rounded-full">
                        Active
                      </span>
                    ) : isUnlocked ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[11px] px-2 py-0.5 rounded-full">
                        Unlocked
                      </span>
                    ) : (
                      <span className="bg-slate-200 text-slate-600 font-bold text-[11px] px-2 py-0.5 rounded-full">
                        🔒 Needs {theme.starsRequired} ⭐
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-black text-slate-800">
                    {theme.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    {theme.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: theme.rimColor }}
                      title="Rim Color"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: theme.hourHandColor }}
                      title="Hour Hand"
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300"
                      style={{ backgroundColor: theme.minuteHandColor }}
                      title="Minute Hand"
                    />
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => setTheme(theme.id)}
                      disabled={isSelected}
                      className={`text-xs font-black px-3.5 py-1.5 rounded-xl transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-900 cursor-default'
                          : 'bg-slate-900 text-white hover:bg-slate-800 cursor-pointer'
                      }`}
                    >
                      {isSelected ? 'Equipped' : 'Equip'}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400">
                      Earn {theme.starsRequired - progress.stars} more ⭐
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mascot Friends Selector */}
      <div className="bg-white border-3 border-purple-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-black text-slate-800">Mascot Buddies</h3>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Pick your learning guide!
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MASCOTS.map((m) => {
            const isUnlocked = progress.unlockedMascots.includes(m.id);
            const isSelected = progress.selectedMascot === m.id;

            return (
              <button
                key={m.id}
                onClick={() => {
                  if (isUnlocked) {
                    setMascot(m.id);
                  }
                }}
                disabled={!isUnlocked}
                className={`text-center p-4 rounded-2xl border-3 transition-all flex flex-col items-center justify-between ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 shadow-md ring-2 ring-purple-300'
                    : isUnlocked
                    ? 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                    : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="w-16 h-16 mb-2">
                  <Mascot size="sm" mood="idle" />
                </div>

                <div className="w-full">
                  <h4 className="font-black text-sm text-slate-800">{m.name}</h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{m.title}</p>
                </div>

                <div className="mt-3 w-full">
                  {isSelected ? (
                    <span className="block text-[11px] font-black bg-purple-600 text-white py-1 rounded-lg">
                      Guide Active
                    </span>
                  ) : isUnlocked ? (
                    <span className="block text-[11px] font-bold bg-slate-100 text-slate-700 py-1 rounded-lg hover:bg-slate-200">
                      Choose
                    </span>
                  ) : (
                    <span className="block text-[10px] font-bold text-slate-400">
                      🔒 {m.starsRequired} ⭐
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Earned Section */}
      <div className="bg-white border-3 border-emerald-200 rounded-3xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-black text-slate-800">Badges & Trophies</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LESSONS.map((l) => {
            const hasBadge = progress.completedLessons[l.id];

            return (
              <div
                key={l.id}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  hasBadge
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="text-3xl mb-1">{hasBadge ? '🏅' : '🔒'}</div>
                <h5 className="font-black text-xs">{l.badgeName}</h5>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  {hasBadge ? 'Mastered!' : `Level ${l.id}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
