import { useState, useCallback, useRef } from 'react';
import { getRandomSquare, getNewRandomSquare } from '../utils/chessUtils';

export function useChessGame() {
  const [highlightedSquare, setHighlightedSquare] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [customTime, setCustomTime] = useState('30');
  const [squareEffects, setSquareEffects] = useState({});
  const [isFirstSquareBlinking, setIsFirstSquareBlinking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Number(customTime) || 30);
  const [showHints, setShowHints] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(false);

  const finalScoreRef = useRef(null);

  const startActualGame = useCallback(() => {
    const time = customTime.trim() === '' ? 30 : Number(customTime);
    setScore(0);
    setTimeLeft(time);
    setGameActive(true);
    const firstSquare = getRandomSquare();
    setHighlightedSquare(firstSquare);
    setUserGuess('');
    setGuesses([]);
    setSquareEffects({});
    setIsFirstSquareBlinking(true);
    setHintsUsed(false);
  }, [customTime]);

  const endGame = useCallback(() => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setTimeout(() => {
      finalScoreRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }, [score, highScore]);

  const handleSubmitGuess = useCallback(
    (submittedGuess) => {
      const guess = typeof submittedGuess === 'string' ? submittedGuess : userGuess;
      if (!gameActive) return;
      const trimmed = guess.trim().toLowerCase();
      if (!trimmed) return;

      const isCorrect = trimmed === highlightedSquare;
      setGuesses((prev) => [...prev, { square: highlightedSquare, guess: trimmed, isCorrect }]);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        if (isFirstSquareBlinking) {
          setIsFirstSquareBlinking(false);
        }
        setHighlightedSquare(getNewRandomSquare(highlightedSquare));
      } else {
        setSquareEffects((prev) => ({
          ...prev,
          [highlightedSquare]: 'incorrect',
        }));
        setTimeout(() => {
          setSquareEffects((prev) => ({ ...prev, [highlightedSquare]: null }));
        }, 500);
      }
      setUserGuess('');
    },
    [gameActive, userGuess, highlightedSquare, isFirstSquareBlinking]
  );

  const toggleBoardFlip = useCallback(() => {
    setBoardFlipped((prev) => !prev);
  }, []);

  const toggleHints = useCallback(() => {
    setShowHints((prev) => {
      if (!prev) {
        setHintsUsed(true);
      }
      return !prev;
    });
  }, []);

  const sideLabel = boardFlipped ? 'Playing as Black' : 'Playing as White';

  const getSquareVariant = useCallback(
    (square) => {
      const isHighlighted = square === highlightedSquare;
      const effect = squareEffects[square];
      if (isHighlighted && effect === 'incorrect') {
        return 'incorrect';
      } else if (isHighlighted && isFirstSquareBlinking) {
        return 'firstBlink';
      } else if (isHighlighted) {
        return 'highlighted';
      }
      return 'base';
    },
    [highlightedSquare, squareEffects, isFirstSquareBlinking]
  );

  return {
    highlightedSquare,
    userGuess,
    setUserGuess,
    score,
    highScore,
    gameActive,
    guesses,
    boardFlipped,
    customTime,
    setCustomTime,
    squareEffects,
    isFirstSquareBlinking,
    timeLeft,
    setTimeLeft,
    showHints,
    hintsUsed,
    finalScoreRef,
    startActualGame,
    endGame,
    handleSubmitGuess,
    toggleBoardFlip,
    toggleHints,
    sideLabel,
    getSquareVariant,
  };
}
