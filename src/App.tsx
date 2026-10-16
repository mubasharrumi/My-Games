import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './screens/HomeScreen';
import { LiveClockScreen } from './screens/LiveClockScreen';
import { ExploreClockScreen } from './screens/ExploreClockScreen';
import { LessonsScreen } from './screens/LessonsScreen';
import { GamesScreen } from './screens/GamesScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ParentPortalScreen } from './screens/ParentPortalScreen';

const MainContent: React.FC = () => {
  const { screen, currentTheme } = useApp();

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen />;
      case 'live':
        return <LiveClockScreen />;
      case 'explore':
        return <ExploreClockScreen />;
      case 'lessons':
      case 'lesson-detail':
        return <LessonsScreen />;
      case 'games':
      case 'game-play':
        return <GamesScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'parent':
      case 'settings':
        return <ParentPortalScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentTheme.bgColor} text-slate-800 transition-colors duration-500 font-sans`}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {renderScreen()}
      </main>

      <footer className="py-6 border-t border-amber-200/40 text-center text-xs font-semibold text-slate-500">
        <p>TimeTastic – Learn to Tell Time • Designed with love for young explorers</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
