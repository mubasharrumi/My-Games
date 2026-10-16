import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppScreen,
  GameId,
  ClockThemeId,
  MascotId,
  UserProgress,
  ClockTheme,
  MascotInfo,
} from '../types';
import { CLOCK_THEMES, MASCOTS } from '../data/themesData';
import { playCorrectSound, playFanfareSound, playPopSound } from '../utils/sound';

interface AppContextType {
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;
  activeLessonId: number;
  setActiveLessonId: (id: number) => void;
  activeGameId: GameId;
  setActiveGameId: (id: GameId) => void;
  progress: UserProgress;
  currentTheme: ClockTheme;
  currentMascot: MascotInfo;
  addStars: (amount: number) => void;
  recordAnswer: (isCorrect: boolean, skillName?: string) => void;
  completeLesson: (lessonId: number, starsEarned: number) => void;
  recordGameScore: (gameId: GameId, score: number) => void;
  setTheme: (themeId: ClockThemeId) => void;
  unlockTheme: (themeId: ClockThemeId) => void;
  setMascot: (mascotId: MascotId) => void;
  unlockMascot: (mascotId: MascotId) => void;
  updateSettings: (newSettings: Partial<UserProgress['settings']>) => void;
  resetProgress: () => void;
  completeDailyChallenge: () => void;
}

const STORAGE_KEY = 'timetastic_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  stars: 3, // Starter stars for encouragement!
  totalScore: 0,
  completedLessons: {},
  gamesPlayed: {
    'read-clock': { played: 0, highscore: 0 },
    'set-clock': { played: 0, highscore: 0 },
    'match-time': { played: 0, highscore: 0 },
    detective: { played: 0, highscore: 0 },
    'daily-routine': { played: 0, highscore: 0 },
    'beat-the-clock': { played: 0, highscore: 0 },
    'time-challenge': { played: 0, highscore: 0 },
  },
  masteredSkills: [],
  practiceNeeded: [],
  accuracyStats: {
    totalAnswered: 0,
    totalCorrect: 0,
  },
  unlockedThemes: ['classic'],
  selectedTheme: 'classic',
  unlockedMascots: ['hootie'],
  selectedMascot: 'hootie',
  settings: {
    soundEnabled: true,
    speechEnabled: true,
    use24Hour: false,
    snapTo5Minutes: true,
    highContrast: false,
    showSecondHand: true,
  },
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [activeGameId, setActiveGameId] = useState<GameId>('read-clock');

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed,
          gamesPlayed: { ...DEFAULT_PROGRESS.gamesPlayed, ...parsed.gamesPlayed },
          settings: { ...DEFAULT_PROGRESS.settings, ...parsed.settings },
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Check and auto-unlock themes/mascots based on stars earned
  useEffect(() => {
    CLOCK_THEMES.forEach((theme) => {
      if (progress.stars >= theme.starsRequired && !progress.unlockedThemes.includes(theme.id)) {
        unlockTheme(theme.id);
      }
    });

    MASCOTS.forEach((mascot) => {
      if (progress.stars >= mascot.starsRequired && !progress.unlockedMascots.includes(mascot.id)) {
        unlockMascot(mascot.id);
      }
    });
  }, [progress.stars]);

  const addStars = (amount: number) => {
    playFanfareSound(progress.settings.soundEnabled);
    setProgress((prev) => ({
      ...prev,
      stars: prev.stars + amount,
      totalScore: prev.totalScore + amount * 10,
    }));
  };

  const recordAnswer = (isCorrect: boolean, skillName?: string) => {
    if (isCorrect) {
      playCorrectSound(progress.settings.soundEnabled);
    }
    setProgress((prev) => {
      const totalAnswered = prev.accuracyStats.totalAnswered + 1;
      const totalCorrect = prev.accuracyStats.totalCorrect + (isCorrect ? 1 : 0);

      const mastered = new Set(prev.masteredSkills);
      const practice = new Set(prev.practiceNeeded);

      if (skillName) {
        if (isCorrect) {
          mastered.add(skillName);
          practice.delete(skillName);
        } else {
          practice.add(skillName);
        }
      }

      return {
        ...prev,
        totalScore: prev.totalScore + (isCorrect ? 10 : 0),
        accuracyStats: { totalAnswered, totalCorrect },
        masteredSkills: Array.from(mastered),
        practiceNeeded: Array.from(practice),
      };
    });
  };

  const completeLesson = (lessonId: number, starsEarned: number) => {
    playFanfareSound(progress.settings.soundEnabled);
    setProgress((prev) => {
      const existing = prev.completedLessons[lessonId]?.starsEarned || 0;
      const newStarsDiff = Math.max(0, starsEarned - existing);

      return {
        ...prev,
        stars: prev.stars + newStarsDiff,
        totalScore: prev.totalScore + starsEarned * 20,
        completedLessons: {
          ...prev.completedLessons,
          [lessonId]: {
            starsEarned: Math.max(existing, starsEarned),
            completedAt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const recordGameScore = (gameId: GameId, score: number) => {
    setProgress((prev) => {
      const prevStats = prev.gamesPlayed[gameId] || { played: 0, highscore: 0 };
      const newHigh = Math.max(prevStats.highscore, score);
      return {
        ...prev,
        gamesPlayed: {
          ...prev.gamesPlayed,
          [gameId]: {
            played: prevStats.played + 1,
            highscore: newHigh,
          },
        },
      };
    });
  };

  const setTheme = (themeId: ClockThemeId) => {
    playPopSound(progress.settings.soundEnabled);
    setProgress((prev) => ({ ...prev, selectedTheme: themeId }));
  };

  const unlockTheme = (themeId: ClockThemeId) => {
    setProgress((prev) => {
      if (prev.unlockedThemes.includes(themeId)) return prev;
      return { ...prev, unlockedThemes: [...prev.unlockedThemes, themeId] };
    });
  };

  const setMascot = (mascotId: MascotId) => {
    playPopSound(progress.settings.soundEnabled);
    setProgress((prev) => ({ ...prev, selectedMascot: mascotId }));
  };

  const unlockMascot = (mascotId: MascotId) => {
    setProgress((prev) => {
      if (prev.unlockedMascots.includes(mascotId)) return prev;
      return { ...prev, unlockedMascots: [...prev.unlockedMascots, mascotId] };
    });
  };

  const updateSettings = (newSettings: Partial<UserProgress['settings']>) => {
    setProgress((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
  };

  const completeDailyChallenge = () => {
    const today = new Date().toISOString().split('T')[0];
    if (progress.dailyChallengeCompletedDate !== today) {
      addStars(5);
      setProgress((prev) => ({
        ...prev,
        dailyChallengeCompletedDate: today,
      }));
    }
  };

  const currentTheme =
    CLOCK_THEMES.find((t) => t.id === progress.selectedTheme) || CLOCK_THEMES[0];

  const currentMascot =
    MASCOTS.find((m) => m.id === progress.selectedMascot) || MASCOTS[0];

  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        activeLessonId,
        setActiveLessonId,
        activeGameId,
        setActiveGameId,
        progress,
        currentTheme,
        currentMascot,
        addStars,
        recordAnswer,
        completeLesson,
        recordGameScore,
        setTheme,
        unlockTheme,
        setMascot,
        unlockMascot,
        updateSettings,
        resetProgress,
        completeDailyChallenge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
