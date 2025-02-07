import { useState, useEffect } from 'react';

export function useCountdown(initialCount, onComplete) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    if (count === null) return;
    if (count > 1) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 1) {
      const timer = setTimeout(() => {
        onComplete();
        setCount(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onComplete]);

  return [count, setCount];
}

export function useGameTimer(initialTime, isActive, onTimeUp) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  return [timeLeft, setTimeLeft];
}
