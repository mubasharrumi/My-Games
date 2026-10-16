import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Star,
  Trophy,
  Volume2,
  Sparkles,
  Lock,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LESSONS } from '../data/lessonsData';
import { Lesson, LessonSlide } from '../types';
import { AnalogClock } from '../components/AnalogClock';
import { DigitalClock } from '../components/DigitalClock';
import { Mascot } from '../components/Mascot';
import { speakText, stopSpeaking } from '../utils/speech';
import { playCorrectSound, playTryAgainSound, playPopSound } from '../utils/sound';
import { fireCelebrationConfetti } from '../components/ConfettiEffect';

export const LessonsScreen: React.FC = () => {
  const {
    progress,
    activeLessonId,
    setActiveLessonId,
    completeLesson,
    recordAnswer,
    setScreen,
  } = useApp();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [inLessonMode, setInLessonMode] = useState(false);

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];
  const slide = activeLesson.slides[currentSlideIndex] || activeLesson.slides[0];
  const isLastSlide = currentSlideIndex === activeLesson.slides.length - 1;

  const startLesson = (lessonId: number) => {
    playPopSound(progress.settings.soundEnabled);
    setActiveLessonId(lessonId);
    setCurrentSlideIndex(0);
    setSelectedOption(null);
    setAnsweredState('idle');
    setShowHint(false);
    setInLessonMode(true);
  };

  const nextSlide = () => {
    playPopSound(progress.settings.soundEnabled);
    setSelectedOption(null);
    setAnsweredState('idle');
    setShowHint(false);
    if (!isLastSlide) {
      setCurrentSlideIndex((prev) => prev + 1);
    } else {
      // Finish lesson with 3 stars!
      completeLesson(activeLesson.id, 3);
      fireCelebrationConfetti();
      setInLessonMode(false);
    }
  };

  const prevSlide = () => {
    playPopSound(progress.settings.soundEnabled);
    setSelectedOption(null);
    setAnsweredState('idle');
    setShowHint(false);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (answeredState === 'correct') return;
    setSelectedOption(idx);
    setShowHint(false);

    const question = slide.practiceQuestion;
    if (!question) return;

    if (idx === question.correctIndex) {
      setAnsweredState('correct');
      recordAnswer(true, activeLesson.title);
      playCorrectSound(progress.settings.soundEnabled);
    } else {
      setAnsweredState('wrong');
      recordAnswer(false, activeLesson.title);
      playTryAgainSound(progress.settings.soundEnabled);
      setShowHint(true);
    }
  };

  const handleReadSlideAloud = () => {
    playPopSound(progress.settings.soundEnabled);
    const spoken = slide.spokenText || slide.explanation;
    speakText(spoken, true);
  };

  // If in list view: show all 7 levels
  if (!inLessonMode) {
    return (
      <div className="space-y-6 pb-12">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 border-2 border-blue-300 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <Mascot
            message="Choose a lesson below to start learning! We go step-by-step from zero to hero!"
            mood="happy"
            size="md"
          />
        </div>

        {/* Lesson Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LESSONS.map((lesson, idx) => {
            const completed = progress.completedLessons[lesson.id];
            const isUnlocked = idx === 0 || progress.completedLessons[LESSONS[idx - 1].id];

            return (
              <div
                key={lesson.id}
                className={`relative bg-white border-3 rounded-3xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between ${
                  completed
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : isUnlocked
                    ? 'border-blue-200 hover:border-blue-400 hover:shadow-md'
                    : 'border-slate-200 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                        completed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      Level {lesson.id}
                    </span>

                    {/* Star ratings or badge */}
                    {completed ? (
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <span>⭐ ⭐ ⭐</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">
                        {lesson.recommendedAge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-slate-800 mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {lesson.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>Badge: {lesson.badgeName}</span>
                  </div>

                  <button
                    onClick={() => startLesson(lesson.id)}
                    className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold px-4 py-2 rounded-xl text-sm shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{completed ? 'Review' : 'Start'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Inside Active Lesson Viewer
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header / Progress in Lesson */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => {
            playPopSound(progress.settings.soundEnabled);
            setInLessonMode(false);
          }}
          className="flex items-center gap-1.5 bg-white border-2 border-slate-200 hover:bg-slate-50 px-3.5 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Lessons</span>
        </button>

        {/* Slide Dots / Step Indicator */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-600 mr-2">
            Step {currentSlideIndex + 1} of {activeLesson.slides.length}
          </span>
          {activeLesson.slides.map((_, sIdx) => (
            <span
              key={sIdx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                sIdx === currentSlideIndex
                  ? 'bg-blue-500 w-5'
                  : sIdx < currentSlideIndex
                  ? 'bg-emerald-400'
                  : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Lesson Stage Card */}
      <div className="bg-white border-3 border-blue-200 rounded-3xl p-6 md:p-8 shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
          {/* Visual Clock Display */}
          <div className="flex flex-col items-center">
            <AnalogClock
              hours={slide.clockTime.hours}
              minutes={slide.clockTime.minutes}
              size={270}
              highlightParts={slide.highlightParts}
              showOuterMinutes={true}
              interactive={false}
            />
            <div className="mt-4">
              <DigitalClock
                hours={slide.clockTime.hours}
                minutes={slide.clockTime.minutes}
                size="sm"
                showWords={false}
                showTimeOfDay={false}
              />
            </div>
          </div>

          {/* Explanation & Practice Content */}
          <div className="flex-1 max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {activeLesson.title}
              </span>

              {/* Read Aloud Button */}
              <button
                onClick={handleReadSlideAloud}
                className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl transition-transform active:scale-95 cursor-pointer"
                title="Hear this slide read aloud"
              >
                <Volume2 className="w-4 h-4" />
                <span>Read to Me</span>
              </button>
            </div>

            <h2 className="text-2xl font-black text-slate-800">
              {slide.title}
            </h2>

            <p className="text-base text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {slide.explanation}
            </p>

            {/* Interactive Practice Question (if present on slide) */}
            {slide.practiceQuestion && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 mt-4">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Question: {slide.practiceQuestion.prompt}</span>
                </div>

                <div className="space-y-2">
                  {slide.practiceQuestion.options?.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === slide.practiceQuestion?.correctIndex;

                    let btnStyle =
                      'bg-white border-2 border-amber-200 text-slate-800 hover:bg-amber-100/60';
                    if (isSelected && answeredState === 'correct') {
                      btnStyle = 'bg-emerald-500 border-emerald-600 text-white font-extrabold';
                    } else if (isSelected && answeredState === 'wrong') {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-800 font-bold';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback message */}
                {answeredState === 'correct' && (
                  <div className="bg-emerald-100 text-emerald-900 text-xs font-bold p-3 rounded-xl border border-emerald-300 flex items-center gap-2 animate-bounce">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Hooray! That is completely correct! You're a natural! 🎉</span>
                  </div>
                )}

                {showHint && (
                  <div className="bg-sky-100 text-sky-900 text-xs font-medium p-3 rounded-xl border border-sky-300 flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                    <span>💡 Hint: {slide.practiceQuestion.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              currentSlideIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Next or Finish Button */}
          <button
            onClick={nextSlide}
            disabled={slide.practiceQuestion && answeredState !== 'correct'}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm shadow-md transition-all ${
              slide.practiceQuestion && answeredState !== 'correct'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-500 text-slate-900 hover:scale-105 active:scale-95 cursor-pointer'
            }`}
          >
            <span>{isLastSlide ? 'Finish & Win 3 Stars! ⭐' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
