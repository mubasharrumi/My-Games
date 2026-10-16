import React from 'react';
import {
  Clock,
  BookOpen,
  Gamepad2,
  Trophy,
  Compass,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Lock,
  Home,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppScreen } from '../types';
import { playPopSound } from '../utils/sound';

export const Navbar: React.FC = () => {
  const { screen, setScreen, progress, updateSettings, currentMascot } = useApp();

  const navItems: { id: AppScreen; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'live', label: 'Live Clock', icon: <Clock className="w-5 h-5" /> },
    { id: 'explore', label: 'Play Clock', icon: <Compass className="w-5 h-5" /> },
    { id: 'lessons', label: 'Learn', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'progress', label: 'Rewards', icon: <Trophy className="w-5 h-5" /> },
  ];

  const handleNavClick = (target: AppScreen) => {
    playPopSound(progress.settings.soundEnabled);
    setScreen(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-amber-200/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* App Logo & Branding */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md transform group-hover:rotate-12 transition-transform">
            <Clock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="text-left hidden sm:block">
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>TimeTastic</span>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </h1>
            <p className="text-xs font-semibold text-amber-600 -mt-1">
              Learn to Tell Time!
            </p>
          </div>
        </button>

        {/* Center Navigation Tabs (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-amber-50/80 p-1.5 rounded-2xl border border-amber-200">
          {navItems.map((item) => {
            const isActive =
              screen === item.id ||
              (item.id === 'lessons' && screen === 'lesson-detail') ||
              (item.id === 'games' && screen === 'game-play');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-amber-100/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Stars, Sound, Voice, Parent Portal */}
        <div className="flex items-center gap-2">
          {/* Star Counter */}
          <button
            onClick={() => handleNavClick('progress')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-black px-3 py-1.5 rounded-2xl shadow-sm border border-amber-300 hover:scale-105 transition-transform"
            title="Earn stars by completing lessons and games!"
          >
            <span className="text-base">⭐</span>
            <span className="text-sm md:text-base">{progress.stars}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() =>
              updateSettings({ soundEnabled: !progress.settings.soundEnabled })
            }
            className={`p-2 rounded-xl border transition-colors ${
              progress.settings.soundEnabled
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title={progress.settings.soundEnabled ? 'Sound FX On' : 'Sound FX Muted'}
            aria-label="Toggle Sound Effects"
          >
            {progress.settings.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Speech Voice Narration Toggle */}
          <button
            onClick={() =>
              updateSettings({ speechEnabled: !progress.settings.speechEnabled })
            }
            className={`p-2 rounded-xl border transition-colors ${
              progress.settings.speechEnabled
                ? 'bg-sky-100 border-sky-300 text-sky-800'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title={progress.settings.speechEnabled ? 'Voice Reader On' : 'Voice Reader Off'}
            aria-label="Toggle Voice Reading"
          >
            {progress.settings.speechEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </button>

          {/* Parents & Teachers Area */}
          <button
            onClick={() => handleNavClick('parent')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold text-xs transition-colors ${
              screen === 'parent'
                ? 'bg-purple-600 text-white border-purple-700'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
            title="Parent & Teacher Dashboard (Protected by Gate)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parents</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom/Secondary Navigation Bar */}
      <div className="md:hidden flex items-center justify-around py-1.5 bg-amber-50/90 border-t border-amber-200">
        {navItems.map((item) => {
          const isActive =
            screen === item.id ||
            (item.id === 'lessons' && screen === 'lesson-detail') ||
            (item.id === 'games' && screen === 'game-play');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                isActive ? 'text-amber-800 scale-105' : 'text-slate-500'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl ${
                  isActive ? 'bg-amber-400 text-slate-900 shadow-sm' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
