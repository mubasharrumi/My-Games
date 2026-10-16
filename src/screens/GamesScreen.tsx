import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Trophy,
  Star,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Volume2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GameId } from '../types';
import { AnalogClock } from '../components/AnalogClock';
import { DigitalClock } from '../components/DigitalClock';
import { Mascot } from '../components/Mascot';
import {
  formatDigitalTime,
  getTimeInWords,
  getClockExplanation,
} from '../utils/clockUtils';
import {
  playCorrectSound,
  playTryAgainSound,
  playPopSound,
  playFanfareSound,
} from '../utils/sound';
import { speakText } from '../utils/speech';
import { fireCelebrationConfetti } from '../components/ConfettiEffect';

export const GamesScreen: React.FC = () => {
  const {
    progress,
    activeGameId,
    setActiveGameId,
    recordAnswer,
    recordGameScore,
    addStars,
  } = useApp();

  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  // Shared game state
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [currentFeedback, setCurrentFeedback] = useState<{
    correct: boolean;
    text: string;
    hint?: string;
  } | null>(null);

  // --- GAME 1: READ THE CLOCK ---
  const [readClockTime, setReadClockTime] = useState({ hours: 4, minutes: 0 });
  const [readClockOptions, setReadClockOptions] = useState<string[]>([]);
  const [readClockCorrectIdx, setReadClockCorrectIdx] = useState(0);

  const generateReadClockQuestion = () => {
    const h = Math.floor(Math.random() * 12) + 1;
    const m = Math.floor(Math.random() * 12) * 5;
    setReadClockTime({ hours: h, minutes: m });

    const correctStr = `${h}:${m.toString().padStart(2, '0')}`;
    const wrong1 = `${(h % 12) + 1}:${m.toString().padStart(2, '0')}`;
    const wrong2 = `${h}:${((m + 15) % 60).toString().padStart(2, '0')}`;
    const wrong3 = `${h === 1 ? 12 : h - 1}:${m.toString().padStart(2, '0')}`;

    const opts = [correctStr, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5);
    setReadClockOptions(opts);
    setReadClockCorrectIdx(opts.indexOf(correctStr));
    setCurrentFeedback(null);
  };

  // --- GAME 2: SET THE CLOCK ---
  const [targetSetTime, setTargetSetTime] = useState({ hours: 3, minutes: 15 });
  const [currentSetTime, setCurrentSetTime] = useState({ hours: 12, minutes: 0 });

  const generateSetClockQuestion = () => {
    const h = Math.floor(Math.random() * 12) + 1;
    const m = [0, 15, 30, 45, 10, 20, 40, 50][Math.floor(Math.random() * 8)];
    setTargetSetTime({ hours: h, minutes: m });
    setCurrentSetTime({ hours: 12, minutes: 0 });
    setCurrentFeedback(null);
  };

  const checkSetClock = () => {
    const isCorrect =
      currentSetTime.hours === targetSetTime.hours &&
      currentSetTime.minutes === targetSetTime.minutes;

    if (isCorrect) {
      setScore((s) => s + 10);
      addStars(1);
      recordAnswer(true, 'Setting Analog Clock');
      setCurrentFeedback({
        correct: true,
        text: `Spot on! You set the hands perfectly to ${targetSetTime.hours}:${targetSetTime.minutes.toString().padStart(2, '0')}! ⭐`,
      });
      fireCelebrationConfetti();
    } else {
      recordAnswer(false, 'Setting Analog Clock');
      playTryAgainSound(progress.settings.soundEnabled);
      setCurrentFeedback({
        correct: false,
        text: `Almost! The hour hand should point towards ${targetSetTime.hours}, and the minute hand towards ${targetSetTime.minutes} minutes. Keep turning!`,
      });
    }
  };

  // --- GAME 3: MATCH THE TIME ---
  interface MatchCard {
    id: string;
    pairId: number;
    type: 'analog' | 'digital';
    time: { hours: number; minutes: number };
    matched: boolean;
  }
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCard[]>([]);

  const setupMatchGame = () => {
    const times = [
      { hours: 2, minutes: 0 },
      { hours: 5, minutes: 30 },
      { hours: 9, minutes: 15 },
      { hours: 11, minutes: 45 },
    ];
    const cards: MatchCard[] = [];
    times.forEach((t, i) => {
      cards.push({
        id: `analog-${i}`,
        pairId: i,
        type: 'analog',
        time: t,
        matched: false,
      });
      cards.push({
        id: `digital-${i}`,
        pairId: i,
        type: 'digital',
        time: t,
        matched: false,
      });
    });
    setMatchCards(cards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setCurrentFeedback(null);
  };

  const handleCardClick = (card: MatchCard) => {
    if (card.matched || selectedCards.find((c) => c.id === card.id) || selectedCards.length === 2)
      return;

    playPopSound(progress.settings.soundEnabled);
    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      if (
        newSelected[0].pairId === newSelected[1].pairId &&
        newSelected[0].type !== newSelected[1].type
      ) {
        playCorrectSound(progress.settings.soundEnabled);
        setMatchCards((prev) =>
          prev.map((c) => (c.pairId === newSelected[0].pairId ? { ...c, matched: true } : c))
        );
        setSelectedCards([]);
        setScore((s) => s + 10);
        addStars(1);
        recordAnswer(true, 'Matching Analog & Digital');
      } else {
        playTryAgainSound(progress.settings.soundEnabled);
        setTimeout(() => setSelectedCards([]), 900);
      }
    }
  };

  // --- GAME 4: TIME DETECTIVE ---
  interface DetectiveClue {
    time: { hours: number; minutes: number };
    clues: string[];
    options: string[];
    correctIndex: number;
  }
  const [detectiveCase, setDetectiveCase] = useState<DetectiveClue | null>(null);

  const generateDetectiveCase = () => {
    const cases: DetectiveClue[] = [
      {
        time: { hours: 3, minutes: 30 },
        clues: [
          'Clue 1: The short hour hand is resting halfway between 3 and 4.',
          'Clue 2: The long minute hand points straight down at the number 6.',
          'Clue 3: It is half past the third hour!',
        ],
        options: ['3:30 (Half past 3)', '4:30', '3:00', '6:15'],
        correctIndex: 0,
      },
      {
        time: { hours: 8, minutes: 15 },
        clues: [
          'Clue 1: The minute hand points at 3, completing one quarter of the circle.',
          'Clue 2: Exactly 15 minutes have passed since 8 o’clock.',
          'Clue 3: It is "Quarter past 8".',
        ],
        options: ['8:15 (Quarter past 8)', '8:45', '3:40', '9:15'],
        correctIndex: 0,
      },
      {
        time: { hours: 1, minutes: 0 },
        clues: [
          'Clue 1: The minute hand points straight UP at 12.',
          'Clue 2: It is an exact hour.',
          'Clue 3: The hour hand points at 1.',
        ],
        options: ['1:00 (1 o’clock)', '12:05', '1:30', '12:00'],
        correctIndex: 0,
      },
      {
        time: { hours: 6, minutes: 45 },
        clues: [
          'Clue 1: The minute hand points to 9 (45 minutes).',
          'Clue 2: There is only one quarter left until 7 o’clock.',
          'Clue 3: We call this "Quarter to 7"!',
        ],
        options: ['6:45 (Quarter to 7)', '7:45', '6:15', '9:30'],
        correctIndex: 0,
      },
    ];

    const pick = cases[Math.floor(Math.random() * cases.length)];
    setDetectiveCase(pick);
    setCurrentFeedback(null);
  };

  // --- GAME 5: DAILY ROUTINE ---
  interface RoutineItem {
    id: number;
    title: string;
    timeStr: string;
    icon: string;
    order: number;
  }
  const defaultRoutine: RoutineItem[] = [
    { id: 1, title: 'Wake up & Brush Teeth', timeStr: '7:00 AM', icon: '🌅', order: 1 },
    { id: 2, title: 'Eat Breakfast', timeStr: '7:30 AM', icon: '🥣', order: 2 },
    { id: 3, title: 'School Bell Rings', timeStr: '8:30 AM', icon: '🎒', order: 3 },
    { id: 4, title: 'Lunch & Recess', timeStr: '12:00 PM', icon: '🥪', order: 4 },
    { id: 5, title: 'Play in the Park', timeStr: '4:00 PM', icon: '⚽', order: 5 },
    { id: 6, title: 'Bedtime Story', timeStr: '8:00 PM', icon: '🌙', order: 6 },
  ];
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);

  const setupRoutineGame = () => {
    setRoutineItems([...defaultRoutine].sort(() => Math.random() - 0.5));
    setCurrentFeedback(null);
  };

  const moveRoutineItem = (index: number, direction: 'up' | 'down') => {
    playPopSound(progress.settings.soundEnabled);
    const newItems = [...routineItems];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setRoutineItems(newItems);
  };

  const checkRoutineOrder = () => {
    const isSorted = routineItems.every((item, idx) => item.order === idx + 1);
    if (isSorted) {
      setScore((s) => s + 20);
      addStars(2);
      recordAnswer(true, 'Daily Routine Sequencing');
      setCurrentFeedback({
        correct: true,
        text: 'Master Detective! Your daily routine is ordered perfectly from morning to night! 🌟',
      });
      fireCelebrationConfetti();
    } else {
      recordAnswer(false, 'Daily Routine Sequencing');
      playTryAgainSound(progress.settings.soundEnabled);
      setCurrentFeedback({
        correct: false,
        text: 'Check the times carefully! Remember: morning AM comes before afternoon PM.',
      });
    }
  };

  // --- GAME 6: BEAT THE CLOCK (SPEED QUIZ) ---
  const [beatTimer, setBeatTimer] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isUntimed, setIsUntimed] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeGame === 'beat-the-clock' && timerRunning && !isUntimed && beatTimer > 0) {
      interval = setInterval(() => {
        setBeatTimer((t) => {
          if (t <= 1) {
            setTimerRunning(false);
            playFanfareSound(progress.settings.soundEnabled);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGame, timerRunning, isUntimed, beatTimer]);

  const startBeatTheClock = () => {
    setBeatTimer(60);
    setTimerRunning(true);
    setScore(0);
    generateReadClockQuestion();
  };

  // Switch between games
  const selectGame = (gameId: GameId) => {
    playPopSound(progress.settings.soundEnabled);
    setActiveGame(gameId);
    setScore(0);
    setQuestionCount(0);
    setCurrentFeedback(null);

    if (gameId === 'read-clock') generateReadClockQuestion();
    if (gameId === 'set-clock') generateSetClockQuestion();
    if (gameId === 'match-time') setupMatchGame();
    if (gameId === 'detective') generateDetectiveCase();
    if (gameId === 'daily-routine') setupRoutineGame();
    if (gameId === 'beat-the-clock') startBeatTheClock();
    if (gameId === 'time-challenge') generateReadClockQuestion();
  };

  // Handle multiple-choice answers in Read the Clock
  const handleReadClockAnswer = (idx: number) => {
    const isCorrect = idx === readClockCorrectIdx;
    setQuestionCount((c) => c + 1);

    if (isCorrect) {
      setScore((s) => s + 10);
      addStars(1);
      recordAnswer(true, 'Reading Analog Clock');
      setCurrentFeedback({
        correct: true,
        text: 'Awesome job! You read the clock correctly! ⭐',
      });
      fireCelebrationConfetti();
    } else {
      recordAnswer(false, 'Reading Analog Clock');
      playTryAgainSound(progress.settings.soundEnabled);
      setCurrentFeedback({
        correct: false,
        text: `Look closely: Short blue hand is at ${readClockTime.hours}, and long red hand is at ${readClockTime.minutes} minutes.`,
      });
    }
  };

  // Menu of 7 games
  const gamesList: {
    id: GameId;
    title: string;
    description: string;
    icon: string;
    color: string;
  }[] = [
    {
      id: 'read-clock',
      title: '1. Read the Clock',
      description: 'Look at the analog clock and pick the correct digital time.',
      icon: '👀',
      color: 'from-blue-400 to-indigo-500',
    },
    {
      id: 'set-clock',
      title: '2. Set the Clock',
      description: 'Drag the hands to match the target digital time!',
      icon: '🖐️',
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'match-time',
      title: '3. Match the Time',
      description: 'Find matching pairs between analog faces and digital cards.',
      icon: '🃏',
      color: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'detective',
      title: '4. Time Detective',
      description: 'Solve mysteries using clues about hands, numbers, and quarters.',
      icon: '🕵️',
      color: 'from-purple-400 to-violet-600',
    },
    {
      id: 'daily-routine',
      title: '5. Daily Routine',
      description: 'Put morning, school, play, and bedtime in chronological order.',
      icon: '📅',
      color: 'from-rose-400 to-pink-500',
    },
    {
      id: 'beat-the-clock',
      title: '6. Beat the Clock',
      description: 'Speed challenge! Answer as many times as you can in 60s.',
      icon: '⚡',
      color: 'from-yellow-400 to-amber-600',
    },
    {
      id: 'time-challenge',
      title: '7. Time Master Challenge',
      description: 'Climb the progressive difficulty ladder to earn master crowns!',
      icon: '👑',
      color: 'from-cyan-400 to-blue-600',
    },
  ];

  // If no game selected, render Game Hub menu
  if (!activeGame) {
    return (
      <div className="space-y-6 pb-12">
        <div className="bg-gradient-to-r from-amber-200 via-orange-100 to-yellow-100 border-2 border-amber-300 rounded-3xl p-5 shadow-sm">
          <Mascot
            message="Welcome to the Game Arcade! Choose a game to play, have fun, and collect shining stars!"
            mood="cheering"
            size="md"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamesList.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGame(g.id)}
              className="text-left bg-white border-3 border-amber-200 hover:border-amber-400 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-3xl mb-3">{g.icon}</div>
                <h3 className="text-lg font-black text-slate-800 mb-1">{g.title}</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {g.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-bold text-amber-700">Play Now</span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-xl">
                  Play ▶
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active Game View
  return (
    <div className="space-y-6 pb-12">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-sm">
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setActiveGame(null);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
        >
          <span>◀ All Games</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-xl font-black text-amber-900 text-sm">
            <span>Score:</span>
            <span>{score}</span>
          </div>

          <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-xl font-bold text-yellow-900 text-sm">
            <span>⭐</span>
            <span>{progress.stars} Stars</span>
          </div>
        </div>
      </div>

      {/* Render selected game interface */}
      <div className="bg-white border-3 border-amber-200 rounded-3xl p-6 shadow-md">
        {/* GAME 1: READ THE CLOCK */}
        {(activeGame === 'read-clock' || activeGame === 'time-challenge') && (
          <div className="flex flex-col items-center space-y-6">
            <h3 className="text-xl font-black text-slate-800">
              What digital time does this clock show?
            </h3>

            <AnalogClock
              hours={readClockTime.hours}
              minutes={readClockTime.minutes}
              size={260}
              interactive={false}
              showOuterMinutes={true}
            />

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {readClockOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleReadClockAnswer(idx)}
                  className="bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-slate-900 text-lg font-black py-3 rounded-2xl shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>

            {currentFeedback && (
              <div
                className={`p-4 rounded-2xl text-sm font-bold w-full max-w-md text-center ${
                  currentFeedback.correct
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                <p>{currentFeedback.text}</p>
                {currentFeedback.correct && (
                  <button
                    onClick={generateReadClockQuestion}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME 2: SET THE CLOCK */}
        {activeGame === 'set-clock' && (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Target Time to Set
              </span>
              <div className="bg-slate-900 text-amber-400 font-mono text-4xl font-black px-6 py-2 rounded-2xl mt-1 shadow-md inline-block">
                {targetSetTime.hours}:{targetSetTime.minutes.toString().padStart(2, '0')}
              </div>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                "{getTimeInWords(targetSetTime.hours, targetSetTime.minutes)}"
              </p>
            </div>

            <AnalogClock
              hours={currentSetTime.hours}
              minutes={currentSetTime.minutes}
              size={270}
              interactive={true}
              onChangeTime={(h, m) => setCurrentSetTime({ hours: h, minutes: m })}
              showOuterMinutes={true}
            />

            <div className="flex items-center gap-3">
              <button
                onClick={checkSetClock}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-3 rounded-2xl shadow-md text-base transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Check My Clock! ✓
              </button>
              <button
                onClick={generateSetClockQuestion}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-3 rounded-2xl text-xs cursor-pointer"
              >
                New Target Time
              </button>
            </div>

            {currentFeedback && (
              <div
                className={`p-4 rounded-2xl text-sm font-bold w-full max-w-md text-center ${
                  currentFeedback.correct
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {currentFeedback.text}
              </div>
            )}
          </div>
        )}

        {/* GAME 3: MATCH THE TIME */}
        {activeGame === 'match-time' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-800">
                Match Analog Clocks with Digital Times!
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tap an analog clock, then tap its matching digital card.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {matchCards.map((card) => {
                const isSelected = selectedCards.find((c) => c.id === card.id);

                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    disabled={card.matched}
                    className={`aspect-square rounded-2xl border-3 p-3 flex flex-col items-center justify-center transition-all ${
                      card.matched
                        ? 'bg-emerald-100 border-emerald-400 opacity-60 cursor-default'
                        : isSelected
                        ? 'bg-amber-100 border-amber-500 scale-105 shadow-md'
                        : 'bg-slate-50 hover:bg-white border-slate-200 shadow-sm cursor-pointer'
                    }`}
                  >
                    {card.type === 'analog' ? (
                      <AnalogClock
                        hours={card.time.hours}
                        minutes={card.time.minutes}
                        size={110}
                        showOuterMinutes={false}
                        interactive={false}
                      />
                    ) : (
                      <div className="bg-slate-900 text-white font-mono text-xl font-black px-3 py-1.5 rounded-xl shadow-inner">
                        {card.time.hours}:{card.time.minutes.toString().padStart(2, '0')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-center pt-4">
              <button
                onClick={setupMatchGame}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shuffle New Match Cards</span>
              </button>
            </div>
          </div>
        )}

        {/* GAME 4: TIME DETECTIVE */}
        {activeGame === 'detective' && detectiveCase && (
          <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center">
              <span className="text-3xl">🕵️‍♂️</span>
              <h3 className="text-xl font-black text-slate-800 mt-1">
                Mystery Clue Case!
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Read the detective clues to deduce the mystery time!
              </p>
            </div>

            {/* Clues Box */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2">
              {detectiveCase.clues.map((clue, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-amber-950 font-bold">
                  <span>🔍</span>
                  <span>{clue}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {detectiveCase.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const isCorrect = idx === detectiveCase.correctIndex;
                    if (isCorrect) {
                      setScore((s) => s + 15);
                      addStars(1);
                      recordAnswer(true, 'Time Detective Clues');
                      setCurrentFeedback({
                        correct: true,
                        text: 'Brilliant deduction, Detective! You cracked the case! 🔍⭐',
                      });
                      fireCelebrationConfetti();
                    } else {
                      recordAnswer(false, 'Time Detective Clues');
                      playTryAgainSound(progress.settings.soundEnabled);
                      setCurrentFeedback({
                        correct: false,
                        text: 'Not quite! Re-read clue 1 and clue 2 carefully.',
                      });
                    }
                  }}
                  className="bg-white hover:bg-amber-50 border-2 border-amber-200 text-slate-800 font-black py-3 px-2 rounded-2xl text-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm text-center"
                >
                  {opt}
                </button>
              ))}
            </div>

            {currentFeedback && (
              <div
                className={`p-4 rounded-2xl text-sm font-bold text-center ${
                  currentFeedback.correct
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                <p>{currentFeedback.text}</p>
                {currentFeedback.correct && (
                  <button
                    onClick={generateDetectiveCase}
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl text-xs cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Next Mystery Case</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME 5: DAILY ROUTINE */}
        {activeGame === 'daily-routine' && (
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="text-center">
              <h3 className="text-xl font-black text-slate-800">
                Put Daily Routine in Order!
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Use the Up and Down arrows to sort events from earliest morning to night.
              </p>
            </div>

            <div className="space-y-2">
              {routineItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-amber-50/80 border-2 border-amber-200 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-black text-slate-800">{item.title}</p>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        {item.timeStr}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveRoutineItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer font-bold text-xs"
                      title="Move earlier"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveRoutineItem(idx, 'down')}
                      disabled={idx === routineItems.length - 1}
                      className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer font-bold text-xs"
                      title="Move later"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-3">
              <button
                onClick={checkRoutineOrder}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-3 rounded-2xl shadow-md text-base transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Check My Routine! ✓
              </button>
            </div>

            {currentFeedback && (
              <div
                className={`p-4 rounded-2xl text-sm font-bold text-center ${
                  currentFeedback.correct
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}
              >
                {currentFeedback.text}
              </div>
            )}
          </div>
        )}

        {/* GAME 6: BEAT THE CLOCK */}
        {activeGame === 'beat-the-clock' && (
          <div className="space-y-6 flex flex-col items-center">
            {/* Countdown timer & Score */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-rose-50 border-2 border-rose-300 px-4 py-2 rounded-2xl font-black text-rose-700 text-lg">
                <Flame className="w-5 h-5 text-rose-500" />
                <span>{isUntimed ? 'Untimed Practice' : `${beatTimer}s Remaining`}</span>
              </div>

              <button
                onClick={() => setIsUntimed(!isUntimed)}
                className="text-xs font-bold text-slate-500 underline cursor-pointer"
              >
                {isUntimed ? 'Switch to 60s Timer' : 'Play Without Timer'}
              </button>
            </div>

            {beatTimer > 0 || isUntimed ? (
              <div className="flex flex-col items-center space-y-4">
                <AnalogClock
                  hours={readClockTime.hours}
                  minutes={readClockTime.minutes}
                  size={240}
                  interactive={false}
                  showOuterMinutes={true}
                />

                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  {readClockOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const isCorrect = idx === readClockCorrectIdx;
                        if (isCorrect) {
                          setScore((s) => s + 10);
                          addStars(1);
                          playCorrectSound(progress.settings.soundEnabled);
                          generateReadClockQuestion();
                        } else {
                          playTryAgainSound(progress.settings.soundEnabled);
                        }
                      }}
                      className="bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 text-slate-900 text-base font-black py-3 rounded-2xl shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 py-6">
                <span className="text-4xl">🎉</span>
                <h3 className="text-2xl font-black text-slate-800">Time's Up!</h3>
                <p className="text-base text-slate-600 font-bold">
                  You scored <span className="text-amber-600 text-xl">{score} points</span>!
                </p>
                <button
                  onClick={startBeatTheClock}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black px-6 py-3 rounded-2xl shadow-md cursor-pointer"
                >
                  Play Again! ⚡
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
