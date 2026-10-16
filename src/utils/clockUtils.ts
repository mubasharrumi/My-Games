/**
 * Mathematical calculations and formatting for analog and digital clocks
 */

const NUMBER_WORDS: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
};

export function getHourAngle(hours: number, minutes: number, seconds: number = 0): number {
  const normalizedHour = hours % 12;
  return ((normalizedHour + minutes / 60 + seconds / 3600) * 30) % 360;
}

export function getMinuteAngle(minutes: number, seconds: number = 0): number {
  return ((minutes + seconds / 60) * 6) % 360;
}

export function getSecondAngle(seconds: number): number {
  return (seconds * 6) % 360;
}

/**
 * Calculates angle in degrees [0, 360) from clock center (0,0) to pointer (x,y)
 * 12 o'clock is 0 degrees, 3 o'clock is 90 degrees, 6 o'clock is 180, 9 o'clock is 270
 */
export function calculatePointerAngle(dx: number, dy: number): number {
  const rad = Math.atan2(dy, dx);
  let deg = (rad * 180) / Math.PI + 90;
  if (deg < 0) deg += 360;
  return deg % 360;
}

/**
 * Convert minute hand angle to minutes (0 to 59)
 * If snapTo5 is true, snaps to nearest 5-minute interval
 */
export function minuteAngleToMinutes(angleDeg: number, snapTo5: boolean = true): number {
  if (snapTo5) {
    const rawStep = Math.round(angleDeg / 30);
    return (rawStep * 5) % 60;
  }
  const rawMin = Math.round(angleDeg / 6);
  return rawMin % 60;
}

/**
 * Convert hour hand angle to hour (1 to 12)
 */
export function hourAngleToHours(angleDeg: number): number {
  const rawHour = Math.floor(angleDeg / 30);
  const hour = rawHour === 0 ? 12 : rawHour;
  return hour;
}

/**
 * Format time as standard digital string
 */
export function formatDigitalTime(
  hours: number,
  minutes: number,
  use24Hour: boolean = false,
  isPM: boolean = false
): { timeString: string; period: 'AM' | 'PM'; fullDisplay: string } {
  let displayHours = hours;
  let period: 'AM' | 'PM' = isPM ? 'PM' : 'AM';

  if (!use24Hour) {
    displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;
  } else {
    if (isPM && hours < 12) {
      displayHours = hours + 12;
    } else if (!isPM && hours === 12) {
      displayHours = 0;
    }
  }

  const mm = minutes.toString().padStart(2, '0');
  const hh = use24Hour ? displayHours.toString().padStart(2, '0') : displayHours.toString();
  const timeString = `${hh}:${mm}`;

  return {
    timeString,
    period,
    fullDisplay: use24Hour ? timeString : `${timeString} ${period}`,
  };
}

/**
 * Convert time to natural child-friendly words
 */
export function getTimeInWords(hours: number, minutes: number): string {
  const currentHour12 = hours % 12 === 0 ? 12 : hours % 12;
  const nextHour12 = (currentHour12 % 12) + 1;

  const currentHourWord = NUMBER_WORDS[currentHour12] || currentHour12.toString();
  const nextHourWord = NUMBER_WORDS[nextHour12] || nextHour12.toString();

  if (minutes === 0) {
    return `${capitalize(currentHourWord)} o'clock`;
  }
  if (minutes === 15) {
    return `Quarter past ${currentHourWord}`;
  }
  if (minutes === 30) {
    return `Half past ${currentHourWord}`;
  }
  if (minutes === 45) {
    return `Quarter to ${nextHourWord}`;
  }
  if (minutes === 5) {
    return `Five past ${currentHourWord}`;
  }
  if (minutes === 10) {
    return `Ten past ${currentHourWord}`;
  }
  if (minutes === 20) {
    return `Twenty past ${currentHourWord}`;
  }
  if (minutes === 25) {
    return `Twenty-five past ${currentHourWord}`;
  }
  if (minutes === 35) {
    return `Twenty-five to ${nextHourWord}`;
  }
  if (minutes === 40) {
    return `Twenty to ${nextHourWord}`;
  }
  if (minutes === 50) {
    return `Ten to ${nextHourWord}`;
  }
  if (minutes === 55) {
    return `Five to ${nextHourWord}`;
  }

  if (minutes < 30) {
    return `${minutes} minutes past ${currentHourWord}`;
  } else {
    return `${60 - minutes} minutes to ${nextHourWord}`;
  }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Detailed child-friendly explanation of why hands are positioned where they are
 */
export function getClockExplanation(hours: number, minutes: number): string {
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const nextHour = (hour12 % 12) + 1;

  if (minutes === 0) {
    return `The short hour hand points directly at ${hour12}, and the long minute hand points straight up at 12. That means it is exactly ${hour12} o'clock!`;
  }
  if (minutes === 30) {
    return `The long minute hand has traveled halfway around the circle to 6 (30 minutes). Notice the short hour hand is halfway between ${hour12} and ${nextHour}! That's why we say "Half past ${hour12}".`;
  }
  if (minutes === 15) {
    return `The long minute hand has completed one-quarter of the circle, pointing at 3 (15 minutes). The hour hand is just a little past ${hour12}. That is "Quarter past ${hour12}".`;
  }
  if (minutes === 45) {
    return `The long minute hand has traveled three-quarters of the clock to 9 (45 minutes). There are only 15 minutes left until ${nextHour}! So it is "Quarter to ${nextHour}".`;
  }

  const fraction = (minutes / 60).toFixed(2);
  return `The long minute hand is at ${minutes} minutes. The short hour hand is ${Math.round(
    parseFloat(fraction) * 100
  )}% of the way between ${hour12} and ${nextHour}.`;
}

/**
 * Time of day information with icon and friendly description
 */
export function getTimeOfDay(hours: number): {
  category: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  icon: string;
  description: string;
  greeting: string;
  skyColor: string;
} {
  if (hours >= 5 && hours < 12) {
    return {
      category: 'Morning',
      icon: '🌅',
      description: 'The sun is rising! Time for breakfast and getting ready for the day.',
      greeting: 'Good Morning, Sunshine!',
      skyColor: 'from-amber-100 via-sky-100 to-blue-200',
    };
  } else if (hours >= 12 && hours < 17) {
    return {
      category: 'Afternoon',
      icon: '☀️',
      description: 'The sun is high and bright! Time for lunch, learning, and outdoor play.',
      greeting: 'Good Afternoon, Explorer!',
      skyColor: 'from-sky-200 via-blue-200 to-cyan-100',
    };
  } else if (hours >= 17 && hours < 20) {
    return {
      category: 'Evening',
      icon: '🌇',
      description: 'The sun is setting with golden colors. Time for dinner and relaxing with family.',
      greeting: 'Good Evening!',
      skyColor: 'from-orange-200 via-rose-200 to-indigo-200',
    };
  } else {
    return {
      category: 'Night',
      icon: '🌙',
      description: 'The stars and moon are out! Time for sweet dreams and resting up.',
      greeting: 'Good Night & Sweet Dreams!',
      skyColor: 'from-indigo-900 via-purple-900 to-slate-900',
    };
  }
}
