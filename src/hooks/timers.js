import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialCount) {
  const [count, setCount] = useState(null);
  const [onComplete, setOnComplete] = useState(null);

  useEffect(() => {
    if (count === null || !onComplete) return;
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

  const startCountdown = useCallback((callback) => {
    setCount(initialCount);
    setOnComplete(() => callback);
  }, [initialCount]);

  return [count, startCountdown];
}

export function useGameTimer(timeLeft, isActive, onTimeUp, setTimeLeft) {
  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp, setTimeLeft]);
} 