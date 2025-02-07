import { useState, useEffect, useCallback } from 'react';

export function useCountdown(initialCount) {
  const [count, setCount] = useState(null);
  const [onCompleteCallback, setOnCompleteCallback] = useState(null);

  useEffect(() => {
    if (count === null || !onCompleteCallback) return;
    
    if (count > 1) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 1) {
      const timer = setTimeout(() => {
        onCompleteCallback();
        setCount(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count, onCompleteCallback]);

  const startCountdown = useCallback((callback) => {
    setCount(initialCount);
    setOnCompleteCallback(() => callback);
  }, [initialCount]);

  return [count, startCountdown];
}

export function useGameTimer(initialTime, isActive, onTimeUp, setTimeLeft) {
  useEffect(() => {
    if (!isActive) return;
    if (initialTime <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [initialTime, isActive, onTimeUp, setTimeLeft]);
} 