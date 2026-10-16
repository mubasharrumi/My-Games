export type AppScreen =
  | 'home'
  | 'live'
  | 'explore'
  | 'lessons'
  | 'lesson-detail'
  | 'games'
  | 'game-play'
  | 'progress'
  | 'parent'
  | 'settings';

export type GameId =
  | 'read-clock'
  | 'set-clock'
  | 'match-time'
  | 'detective'
  | 'daily-routine'
  | 'beat-the-clock'
  | 'time-challenge';

export type ClockThemeId = 'classic' | 'space' | 'safari' | 'candy' | 'ocean';
export type MascotId = 'hootie' | 'pip' | 'bella' | 'leo';

export interface ClockTheme {
  id: ClockThemeId;
  name: string;
  description: string;
  bgColor: string;
  faceColor: string;
  rimColor: string;
  hourHandColor: string;
  minuteHandColor: string;
  secondHandColor: string;
  numberColor: string;
  tickColor: string;
  starsRequired: number;
  icon: string;
}

export interface MascotInfo {
  id: MascotId;
  name: string;
  title: string;
  color: string;
  greeting: string;
  starsRequired: number;
}

export interface LessonSlide {
  title: string;
  explanation: string;
  spokenText: string;
  clockTime: { hours: number; minutes: number };
  highlightParts?: ('hour-hand' | 'minute-hand' | '12' | '6' | '3' | '9' | 'numbers' | 'quarter-slice')[];
  practiceQuestion?: {
    prompt: string;
    targetTime: { hours: number; minutes: number };
    options?: string[];
    correctIndex?: number;
    hint: string;
    mode: 'multiple-choice' | 'interactive-set';
  };
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  badgeName: string;
  recommendedAge: string;
  slides: LessonSlide[];
  color: string;
  iconName: string;
}

export interface UserProgress {
  stars: number;
  totalScore: number;
  completedLessons: Record<number, { starsEarned: number; completedAt: string }>;
  gamesPlayed: Record<GameId, { played: number; highscore: number }>;
  masteredSkills: string[];
  practiceNeeded: string[];
  accuracyStats: {
    totalAnswered: number;
    totalCorrect: number;
  };
  unlockedThemes: ClockThemeId[];
  selectedTheme: ClockThemeId;
  unlockedMascots: MascotId[];
  selectedMascot: MascotId;
  dailyChallengeCompletedDate?: string;
  settings: {
    soundEnabled: boolean;
    speechEnabled: boolean;
    use24Hour: boolean;
    snapTo5Minutes: boolean;
    highContrast: boolean;
    showSecondHand: boolean;
  };
}
