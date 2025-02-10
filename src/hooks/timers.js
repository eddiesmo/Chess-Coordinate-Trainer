import { useState, useEffect, useCallback, useRef } from 'react';

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

  const startCountdown = useCallback(
    (callback) => {
      setCount(initialCount);
      setOnComplete(() => callback);
    },
    [initialCount]
  );

  return [count, startCountdown];
}

export function useGameTimer(timeLeft, isActive, onTimeUp, setTimeLeft) {
  const startTimeRef = useRef(null);
  const initialTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
      startTimeRef.current = null;
      initialTimeRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      return;
    }

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    // Initialize start time and initial time when game becomes active
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      initialTimeRef.current = timeLeft;
    }

    timerRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, initialTimeRef.current - elapsedSeconds);
      
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(timerRef.current);
        onTimeUp();
      }
    }, 100); // Update frequently to stay in sync

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, isActive, onTimeUp, setTimeLeft]);
}
