import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

const filesDefault = ['a','b','c','d','e','f','g','h'];
const ranksDefault = ['1','2','3','4','5','6','7','8'];

export default function ChessSquareGame() {
  const [highlightedSquare, setHighlightedSquare] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [guesses, setGuesses] = useState([]); // { square: string, guess: string, isCorrect: boolean }[]
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [customTime, setCustomTime] = useState(30);

  // We'll track per-square blink effects: 'incorrect' | null.
  const [squareEffects, setSquareEffects] = useState({});

  const inputRef = useRef(null);

  // Generate a random square notation, e.g. "d5".
  const getRandomSquare = useCallback(() => {
    const randomFile = filesDefault[Math.floor(Math.random() * filesDefault.length)];
    const randomRank = ranksDefault[Math.floor(Math.random() * ranksDefault.length)];
    return `${randomFile}${randomRank}`;
  }, []);

  // Start the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(customTime);
    setGameActive(true);
    setHighlightedSquare(getRandomSquare());
    setUserGuess('');
    setGuesses([]);
    setSquareEffects({});
  };

  // End the game
  const endGame = () => {
    setGameActive(false);
    // Check if we have a new high score
    if (score > highScore) {
      setHighScore(score);
    }
  };

  // Handle user guess
  const handleSubmitGuess = () => {
    if (!gameActive) return;
    const trimmed = userGuess.trim().toLowerCase();
    if (!trimmed) return; // ignore empty guess

    const isCorrect = trimmed === highlightedSquare;

    // store guess record
    setGuesses((prev) => [
      ...prev,
      {
        square: highlightedSquare,
        guess: trimmed,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      // Immediately switch to the next square if correct.
      setScore((prev) => prev + 1);
      setHighlightedSquare(getRandomSquare());
    } else {
      // If incorrect, show a quick red blink.
      setSquareEffects((prev) => ({
        ...prev,
        [highlightedSquare]: 'incorrect',
      }));
      // Clear blink after half a second.
      setTimeout(() => {
        setSquareEffects((prev) => ({
          ...prev,
          [highlightedSquare]: null,
        }));
      }, 500);
    }

    setUserGuess('');
  };

  // Countdown logic
  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      endGame();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameActive]);

  // Focus the input box when the game starts
  useEffect(() => {
    if (gameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameActive]);

  // Decide how to render the board visually based on boardFlipped.
  // If not flipped: ranks go 8->1 top to bottom, files go a->h left to right.
  // If flipped: ranks go 1->8 top to bottom, files go h->a left to right.
  const renderedRanks = boardFlipped ? ranksDefault : [...ranksDefault].reverse();
  const renderedFiles = boardFlipped ? [...filesDefault].reverse() : filesDefault;

  // We'll rename the button text based on boardFlipped. If flipped, you're playing as Black.
  const sideLabel = boardFlipped ? 'Playing as Black' : 'Playing as White';

  // We'll define variants for squares using framer-motion.
  // We'll highlight in yellow for normal highlight, or blink red if incorrect.
  // We remove any transition or scale for highlight to be instant.
  const squareVariants = {
    base: {
      scale: 1,
      boxShadow: 'none',
    },
    highlighted: {
      scale: 1,
      boxShadow: '0 0 0 4px #facc15',
      transition: { duration: 0 },
    },
    incorrect: {
      scale: [1, 1.1, 1],
      boxShadow: [
        '0 0 0 4px #facc15', // yellow
        '0 0 0 4px #f87171', // red-400
        '0 0 0 4px #facc15',
      ],
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 relative">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Chess Square Naming Game</h1>
        <p className="text-gray-600">Test your chessboard knowledge!</p>
      </div>

      {gameActive && (
        <div className="mb-4 text-center">
          <motion.h2
            className="text-2xl font-bold"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Time Left: {timeLeft}s
          </motion.h2>
          <p className="text-gray-600 mt-2">Score: {score}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center space-x-2 mb-4">
        <label className="flex items-center space-x-2">
          <span className="font-semibold">Time Limit:</span>
          <input
            type="number"
            value={customTime}
            onChange={(e) => setCustomTime(Number(e.target.value))}
            className="border px-2 py-1 rounded-md w-20"
            min={5}
            max={600}
            disabled={gameActive}
          />
        </label>
        <button
          onClick={() => setBoardFlipped((prev) => !prev)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500"
          disabled={gameActive}
        >
          {sideLabel}
        </button>
      </div>

      <div className="grid grid-cols-8 gap-1">
        {renderedRanks.map((rank, rankIndex) => (
          <React.Fragment key={rank}>
            {renderedFiles.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const isHighlighted = square === highlightedSquare;
              const effect = squareEffects[square]; // 'incorrect' | null

              // Light/dark background color (checker pattern)
              const bgColor = (rankIndex + fileIndex) % 2 === 0 ? 'bg-white' : 'bg-gray-400';

              let variant = 'base';
              if (isHighlighted && effect === 'incorrect') {
                variant = 'incorrect';
              } else if (isHighlighted) {
                variant = 'highlighted';
              }

              return (
                <motion.div
                  key={square}
                  className={`relative w-12 h-12 flex items-center justify-center text-sm font-semibold ${bgColor} border-2 border-gray-200 rounded-2xl`}
                  variants={squareVariants}
                  initial="base"
                  animate={variant}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {gameActive && (
        <div className="mt-4 space-x-2">
          <input
            type="text"
            ref={inputRef}
            className="border px-2 py-1 rounded-md"
            placeholder="Enter square e.g. e4"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitGuess();
              }
            }}
          />
          <button
            onClick={handleSubmitGuess}
            className="px-3 py-1 bg-blue-600 text-white rounded-2xl hover:bg-blue-500"
          >
            Submit
          </button>
        </div>
      )}

      {!gameActive && (
        <button
          onClick={startGame}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-500"
        >
          Start Game
        </button>
      )}

      {!gameActive && (
        <div className="mt-4 text-center">
          <h2 className="text-xl font-semibold">Your Final Score: {score}</h2>
          <p className="text-gray-600">High Score: {highScore}</p>
        </div>
      )}

      {!gameActive && guesses.length > 0 && (
        <div className="mt-4 w-full max-w-md mx-auto bg-white p-4 rounded-2xl shadow-md">
          <h3 className="text-lg font-bold mb-2">Results</h3>
          <ul className="space-y-1">
            {guesses.map((g, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>
                  Square: <strong>{g.square}</strong>, Your Guess: <strong>{g.guess}</strong>
                </span>
                {g.isCorrect ? (
                  <span className="text-green-600 font-semibold">Correct</span>
                ) : (
                  <span className="text-red-600 font-semibold">Incorrect</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
