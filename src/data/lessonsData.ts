import { Lesson } from '../types';

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Meet the Clock!',
    subtitle: 'Discover the face, numbers 1 to 12, and the magic hands',
    badgeName: 'Clock Friend',
    recommendedAge: 'Ages 4-6',
    color: 'from-blue-400 to-indigo-500',
    iconName: 'Smile',
    slides: [
      {
        title: 'The Clock Face & Numbers',
        explanation:
          'Welcome to the clock! A clock face is a circle with 12 magical numbers arranged around the edge: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, and 12 at the very top!',
        spokenText:
          'Welcome to the clock! The numbers 1 through 12 live on the clock face, with 12 at the very top.',
        clockTime: { hours: 12, minutes: 0 },
        highlightParts: ['numbers', '12'],
      },
      {
        title: 'The Short Hour Hand',
        explanation:
          'Look at the short blue hand. This is the Hour Hand! It moves slow and steady. Wherever it points tells us which hour of the day it is.',
        spokenText:
          'The short blue hand is the Hour Hand. It moves slowly and points to the hour.',
        clockTime: { hours: 3, minutes: 0 },
        highlightParts: ['hour-hand'],
      },
      {
        title: 'The Long Minute Hand',
        explanation:
          'Look at the long ruby-red hand! This is the Minute Hand. It travels all the way around the clock face once every hour, counting minutes.',
        spokenText:
          'The long red hand is the Minute Hand. It travels around the clock counting minutes.',
        clockTime: { hours: 3, minutes: 0 },
        highlightParts: ['minute-hand'],
      },
      {
        title: 'Clockwise Movement!',
        explanation:
          'Clock hands always turn in the same direction: from 12 to 1, 2, 3, 4... and so on. We call this direction "clockwise"!',
        spokenText:
          'Clock hands always move in the same direction, from 12 to 1, 2, 3 and around. This is called clockwise!',
        clockTime: { hours: 6, minutes: 0 },
        highlightParts: ['numbers'],
      },
      {
        title: 'Quick Check: Which hand is the Hour Hand?',
        explanation:
          'Test what you learned! Look closely at the two hands on the clock.',
        spokenText: 'Which hand is the hour hand? Is it the short hand or the long hand?',
        clockTime: { hours: 4, minutes: 0 },
        practiceQuestion: {
          prompt: 'Which hand tells us the hour?',
          options: ['The Short Hand (Blue)', 'The Long Hand (Red)', 'Both hands are the same'],
          correctIndex: 0,
          hint: 'Remember: The short hand is the Hour Hand! Short word = short hand.',
          mode: 'multiple-choice',
          targetTime: { hours: 4, minutes: 0 },
        },
      },
    ],
  },
  {
    id: 2,
    title: 'Learn the Hours (O’Clock)',
    subtitle: 'When the minute hand points straight up at 12',
    badgeName: 'Hour Hero',
    recommendedAge: 'Ages 4-7',
    color: 'from-amber-400 to-orange-500',
    iconName: 'Sun',
    slides: [
      {
        title: 'What does "O’Clock" mean?',
        explanation:
          'Whenever the long minute hand points straight UP to 12, it is an exact hour! We say "o’clock", which is short for "of the clock".',
        spokenText:
          'When the long minute hand points straight up to 12, it is an exact hour. We say o’clock!',
        clockTime: { hours: 1, minutes: 0 },
        highlightParts: ['12', 'minute-hand'],
      },
      {
        title: 'Reading 3:00',
        explanation:
          'Look at this clock: The short blue hand points directly to 3, and the minute hand points to 12. That means it is 3 o’clock! In digital numbers, we write 3:00.',
        spokenText:
          'The short hand is at 3, and the long hand is at 12. It is 3 o’clock!',
        clockTime: { hours: 3, minutes: 0 },
        highlightParts: ['hour-hand', '12'],
      },
      {
        title: 'Reading 8:00',
        explanation:
          'Now the short hand points to 8, and the long hand is still at 12. It is 8 o’clock! Dinner or storytime!',
        spokenText: 'The short hand points to 8 and the long hand is at 12. That is 8 o’clock!',
        clockTime: { hours: 8, minutes: 0 },
        highlightParts: ['hour-hand', 'minute-hand'],
      },
      {
        title: 'Practice Time!',
        explanation: 'What time is this clock showing right now?',
        spokenText: 'What time does this clock show? Look where the short hand is pointing.',
        clockTime: { hours: 5, minutes: 0 },
        practiceQuestion: {
          prompt: 'What time is showing on this clock?',
          options: ['5:00 (5 o’clock)', '12:05', '6:00 (6 o’clock)', '12:00'],
          correctIndex: 0,
          hint: 'The short hand points at 5 and the long hand is at 12. That is 5 o’clock!',
          mode: 'multiple-choice',
          targetTime: { hours: 5, minutes: 0 },
        },
      },
    ],
  },
  {
    id: 3,
    title: 'Half Past (30 Minutes)',
    subtitle: 'When the minute hand travels halfway around to 6',
    badgeName: 'Half-Past Master',
    recommendedAge: 'Ages 5-8',
    color: 'from-emerald-400 to-teal-500',
    iconName: 'Compass',
    slides: [
      {
        title: 'Halfway Around the Circle',
        explanation:
          'An hour has 60 minutes. Half of 60 is 30 minutes! When 30 minutes pass, the long minute hand points straight DOWN to the number 6.',
        spokenText:
          'An hour has 60 minutes, and half of 60 is 30! At 30 minutes, the minute hand points straight down to 6.',
        clockTime: { hours: 2, minutes: 30 },
        highlightParts: ['6', 'minute-hand'],
      },
      {
        title: 'Watch the Hour Hand Move!',
        explanation:
          'Notice something cool: Because half the hour has passed, the short hour hand is not pointing directly at 2 anymore. It is halfway between 2 and 3! We call this "Half past 2" (or 2:30).',
        spokenText:
          'Notice how the short hour hand is halfway between 2 and 3! We call this Half past 2.',
        clockTime: { hours: 2, minutes: 30 },
        highlightParts: ['hour-hand', '6'],
      },
      {
        title: 'Example: 7:30',
        explanation:
          'Here is 7:30. The hour hand is halfway between 7 and 8, and the minute hand points to 6. This is Half past 7!',
        spokenText:
          'This is 7:30. The hour hand is between 7 and 8, and the minute hand points at 6. Half past 7!',
        clockTime: { hours: 7, minutes: 30 },
        highlightParts: ['hour-hand', 'minute-hand'],
      },
      {
        title: 'Practice: Spot Half Past',
        explanation: 'Look at the clock hands carefully. What time is it?',
        spokenText: 'What time is this clock showing? Look at the hour hand between two numbers.',
        clockTime: { hours: 10, minutes: 30 },
        practiceQuestion: {
          prompt: 'What time is shown on this clock?',
          options: ['Half past 10 (10:30)', 'Half past 11 (11:30)', '10 o’clock (10:00)', '6:10'],
          correctIndex: 0,
          hint: 'The hour hand has passed 10 and is heading towards 11. Minute hand is at 6. It is 10:30!',
          mode: 'multiple-choice',
          targetTime: { hours: 10, minutes: 30 },
        },
      },
    ],
  },
  {
    id: 4,
    title: 'Quarter Past & Quarter To',
    subtitle: 'Splitting the clock into four pizza slices',
    badgeName: 'Quarter Champ',
    recommendedAge: 'Ages 6-9',
    color: 'from-pink-400 to-rose-500',
    iconName: 'PieChart',
    slides: [
      {
        title: 'Four Equal Slices',
        explanation:
          'Imagine cutting a round pizza into 4 equal slices! Each slice is one quarter (15 minutes). 60 divided by 4 is 15!',
        spokenText:
          'Imagine cutting a clock into four slices like a pizza! Each quarter slice is 15 minutes.',
        clockTime: { hours: 4, minutes: 15 },
        highlightParts: ['quarter-slice', '3'],
      },
      {
        title: 'Quarter Past (15 Minutes)',
        explanation:
          'When the minute hand points to 3, exactly 15 minutes have passed. We call this "Quarter Past"! At 4:15, it is "Quarter past 4".',
        spokenText:
          'When the minute hand points to 3, 15 minutes have passed. That is quarter past!',
        clockTime: { hours: 4, minutes: 15 },
        highlightParts: ['3', 'minute-hand'],
      },
      {
        title: 'Quarter To (45 Minutes)',
        explanation:
          'When the minute hand points to 9, it is 45 minutes past the hour. But look! There is only one quarter left before the next hour. So we say "Quarter To"! For 4:45, it is "Quarter to 5"!',
        spokenText:
          'When the minute hand points to 9, there is only one quarter slice left until the next hour. That is quarter to 5!',
        clockTime: { hours: 4, minutes: 45 },
        highlightParts: ['9', 'minute-hand'],
      },
      {
        title: 'Practice: Quarter Test',
        explanation: 'Can you tell what time this shows?',
        spokenText: 'Can you tell what time this clock shows?',
        clockTime: { hours: 9, minutes: 15 },
        practiceQuestion: {
          prompt: 'What time is this clock displaying?',
          options: ['Quarter past 9 (9:15)', 'Quarter to 9 (8:45)', '9:03', 'Half past 9 (9:30)'],
          correctIndex: 0,
          hint: 'The minute hand points at 3, which is 15 minutes. That is Quarter past 9!',
          mode: 'multiple-choice',
          targetTime: { hours: 9, minutes: 15 },
        },
      },
    ],
  },
  {
    id: 5,
    title: 'Counting Minutes by 5s',
    subtitle: 'The secret code: each number means 5 minutes!',
    badgeName: 'Minute Magician',
    recommendedAge: 'Ages 6-9',
    color: 'from-cyan-400 to-blue-500',
    iconName: 'Zap',
    slides: [
      {
        title: 'The Secret 5s Pattern',
        explanation:
          'Here is the big secret of the clock: When the minute hand points to a number, count by 5s! 1 means 5, 2 means 10, 3 means 15, 4 means 20, and 5 means 25!',
        spokenText:
          'For the minute hand, each big number is 5 minutes! Count by 5s: 5, 10, 15, 20, 25, 30.',
        clockTime: { hours: 1, minutes: 20 },
        highlightParts: ['numbers'],
      },
      {
        title: 'Continuing the Count',
        explanation:
          'Let’s keep counting around the clock: 6 is 30, 7 is 35, 8 is 40, 9 is 45, 10 is 50, and 11 is 55! When we reach 12, that is 60 minutes (a fresh new hour: :00)!',
        spokenText:
          '6 is 30, 7 is 35, 8 is 40, 9 is 45, 10 is 50, and 11 is 55 minutes.',
        clockTime: { hours: 6, minutes: 40 },
        highlightParts: ['minute-hand'],
      },
      {
        title: 'Tiny Little Tick Marks',
        explanation:
          'Between the big numbers, there are 4 tiny little tick marks. Each tick is 1 single minute. So from 12 to 1 is 1, 2, 3, 4, 5 minutes!',
        spokenText:
          'Between the big numbers are tiny tick marks for individual minutes.',
        clockTime: { hours: 8, minutes: 7 },
        highlightParts: ['minute-hand'],
      },
      {
        title: 'Practice: 5s Multiplication',
        explanation: 'If the long minute hand points right at the number 4, how many minutes is that?',
        spokenText: 'If the long minute hand points at 4, how many minutes have passed?',
        clockTime: { hours: 2, minutes: 20 },
        practiceQuestion: {
          prompt: 'Minute hand on 4 = how many minutes?',
          options: ['20 minutes (4 x 5)', '4 minutes', '15 minutes', '40 minutes'],
          correctIndex: 0,
          hint: 'Multiply the number by 5: 4 times 5 equals 20 minutes!',
          mode: 'multiple-choice',
          targetTime: { hours: 2, minutes: 20 },
        },
      },
    ],
  },
  {
    id: 6,
    title: 'Digital Clocks & AM / PM',
    subtitle: 'Connecting the hands to numbers and understanding day vs night',
    badgeName: 'Digital Detective',
    recommendedAge: 'Ages 6-10',
    color: 'from-purple-400 to-violet-600',
    iconName: 'Tv',
    slides: [
      {
        title: 'How Digital Clocks Work',
        explanation:
          'Digital clocks show time using digits separated by two dots called a colon (:). The number on the left is the Hour. The numbers on the right are the Minutes!',
        spokenText:
          'Digital clocks show the hour on the left and the minutes on the right, separated by a colon.',
        clockTime: { hours: 10, minutes: 15 },
        highlightParts: ['numbers'],
      },
      {
        title: 'What does AM mean?',
        explanation:
          'A whole day has 24 hours. The clock goes around twice! AM means the morning half of the day: from midnight while you sleep, until midday noon (lunchtime)!',
        spokenText:
          'AM is for morning, from midnight until lunchtime at noon.',
        clockTime: { hours: 9, minutes: 0 },
      },
      {
        title: 'What does PM mean?',
        explanation:
          'PM starts at 12:00 noon and continues through the afternoon, evening, and bedtime up until midnight! 2:00 PM is afternoon play; 8:00 PM is bedtime.',
        spokenText:
          'PM starts at noon and covers the afternoon, evening, and nighttime.',
        clockTime: { hours: 2, minutes: 0 },
      },
      {
        title: 'Practice: AM or PM?',
        explanation: 'You eat delicious breakfast at 7:30 in the morning. Is that AM or PM?',
        spokenText: 'When you eat breakfast at 7:30 in the morning, is that AM or PM?',
        clockTime: { hours: 7, minutes: 30 },
        practiceQuestion: {
          prompt: 'Breakfast in the morning at 7:30 is:',
          options: ['7:30 AM (Morning)', '7:30 PM (Evening)', '7:30 Night'],
          correctIndex: 0,
          hint: 'Morning time before noon is always AM!',
          mode: 'multiple-choice',
          targetTime: { hours: 7, minutes: 30 },
        },
      },
    ],
  },
  {
    id: 7,
    title: 'Real-Life Daily Routine',
    subtitle: 'Connecting time to meals, school, play, and bedtime',
    badgeName: 'Daily Routine Pro',
    recommendedAge: 'Ages 5-10',
    color: 'from-yellow-400 to-amber-600',
    iconName: 'Calendar',
    slides: [
      {
        title: 'Your Day Follows the Clock!',
        explanation:
          'Clocks help the whole world know when it is time to wake up, go to school, eat delicious meals, play with friends, and sleep.',
        spokenText:
          'Clocks help us organize our day, from waking up in the morning to bedtime at night.',
        clockTime: { hours: 7, minutes: 0 },
      },
      {
        title: '7:00 AM - Rise and Shine!',
        explanation:
          'The alarm clock chirps! It’s 7:00 AM. Time to wash your face, brush your teeth, and put on your favorite clothes.',
        spokenText: '7:00 AM is waking up time for a bright new day.',
        clockTime: { hours: 7, minutes: 0 },
      },
      {
        title: '12:00 PM - Yummy Lunchtime!',
        explanation:
          'When both hands point straight up at 12 together, it is 12:00 PM (Noon)! Time for lunch and recess on the playground.',
        spokenText: '12:00 PM noon is lunchtime when both hands point straight up together.',
        clockTime: { hours: 12, minutes: 0 },
      },
      {
        title: '8:30 PM - Bedtime Stories & Sleep',
        explanation:
          'After dinner and reading stories, 8:30 PM is time to tuck in so your brain and body can grow big and strong!',
        spokenText: '8:30 PM is bedtime story and resting time.',
        clockTime: { hours: 8, minutes: 30 },
      },
      {
        title: 'Practice: Routine Detective',
        explanation: 'At 12:30 PM in the afternoon, what are kids usually doing?',
        spokenText: 'At 12:30 PM, what are kids usually doing?',
        clockTime: { hours: 12, minutes: 30 },
        practiceQuestion: {
          prompt: 'What activity fits 12:30 PM?',
          options: ['Eating lunch & playing at school', 'Sleeping deep at night', 'Waking up to brush teeth'],
          correctIndex: 0,
          hint: '12:30 PM is right around lunchtime!',
          mode: 'multiple-choice',
          targetTime: { hours: 12, minutes: 30 },
        },
      },
    ],
  },
];
