import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    const count = 120;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#FFD700', '#FFA500', '#FF4500'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#00C9FF', '#92FE9D', '#3B82F6'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#FF69B4', '#DA70D6', '#FF1493'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#FACC15', '#4ADE80', '#60A5FA'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // ignore
  }
}
