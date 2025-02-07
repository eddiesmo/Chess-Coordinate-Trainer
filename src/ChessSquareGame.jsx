import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

/**
 * Now we want the "first presented square" to blink continuously until guessed correctly.
 * We'll track a boolean that indicates we're still on the first square.
 * Then we define a "firstBlink" variant that repeats indefinitely.
 * Once the user guesses the first square correctly, we stop the blinking.
 */

const filesDefault = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranksDefault = ["1", "2", "3", "4", "5", "6", "7", "8"];

const squareVariants = {
  base: {
    scale: 1,
    boxShadow: "none",
    transition: { duration: 0 },
  },
  highlighted: {
    scale: 1,
    boxShadow: "0 0 0 4px #facc15",
    transition: { duration: 0 },
  },
  incorrect: {
    scale: [1, 1.2, 1],
    boxShadow: [
      "0 0 0 4px #facc15", // yellow
      "0 0 0 4px #f87171", // red
      "0 0 0 4px #facc15", // back to yellow
    ],
    transition: {
      duration: 0.5,
    },
  },
  firstBlink: {
    scale: [1, 1.05, 1],
    // We'll maintain the yellow ring plus a slight pulsation.
    boxShadow: [
      "0 0 0 4px #facc15", // highlight ring at start
      "0 0 0 4px #fde047", // slightly brighter yellow
      "0 0 0 4px #facc15", // return to original yellow
    ],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

export default function ChessSquareGame() {
  const [highlightedSquare, setHighlightedSquare] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [customTime, setCustomTime] = useState(30);

  // We'll track per-square blink effects: 'incorrect' | null.
  const [squareEffects, setSquareEffects] = useState({});

  // Whether we're still on the first square, to do continuous blinking.
  const [firstSquareBlinking, setFirstSquareBlinking] = useState(false);

  const inputRef = useRef(null);

  const getRandomSquare = useCallback(() => {
    const randomFile =
      filesDefault[Math.floor(Math.random() * filesDefault.length)];
    const randomRank =
      ranksDefault[Math.floor(Math.random() * ranksDefault.length)];
    return `${randomFile}${randomRank}`;
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(customTime);
    setGameActive(true);
    let firstSquare = getRandomSquare();
    setHighlightedSquare(firstSquare);
    setUserGuess("");
    setGuesses([]);
    setSquareEffects({});
    // We'll set this to true so the first square blinks.
    setFirstSquareBlinking(true);
  };

  const endGame = () => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const handleSubmitGuess = () => {
    if (!gameActive) return;
    const trimmed = userGuess.trim().toLowerCase();
    if (!trimmed) return;

    const isCorrect = trimmed === highlightedSquare;

    setGuesses((prev) => [
      ...prev,
      {
        square: highlightedSquare,
        guess: trimmed,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      setScore((prev) => prev + 1);

      // If we're still on the first square, and it's correct, stop blinking.
      if (firstSquareBlinking) {
        setFirstSquareBlinking(false);
      }

      // Never get same square twice in a row.
      let nextSquare = getRandomSquare();
      while (nextSquare === highlightedSquare) {
        nextSquare = getRandomSquare();
      }
      setHighlightedSquare(nextSquare);
    } else {
      // If incorrect, show a quick red blink.
      setSquareEffects((prev) => ({
        ...prev,
        [highlightedSquare]: "incorrect",
      }));
      setTimeout(() => {
        setSquareEffects((prev) => ({ ...prev, [highlightedSquare]: null }));
      }, 500);
    }

    setUserGuess("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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

  useEffect(() => {
    if (gameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameActive]);

  const renderedRanks = boardFlipped
    ? ranksDefault
    : [...ranksDefault].reverse();
  const renderedFiles = boardFlipped
    ? [...filesDefault].reverse()
    : filesDefault;
  const sideLabel = boardFlipped ? "Playing as Black" : "Playing as White";

  // Decide variant. If it's the first square and it's the highlighted one, we do 'firstBlink'.
  const getSquareVariant = (square) => {
    const isHighlighted = square === highlightedSquare;
    const effect = squareEffects[square];

    if (isHighlighted && effect === "incorrect") {
      return "incorrect";
    } else if (isHighlighted && firstSquareBlinking) {
      return "firstBlink";
    } else if (isHighlighted) {
      return "highlighted";
    }
    return "base";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 relative">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Chess Square Naming Game</h1>
        <p className="text-gray-600">
          Identify as many squares as possible before time runs out!
        </p>
      </div>

      {!gameActive && (
        <div className="max-w-md mb-4 px-2 py-2 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-1">How to Play</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 px-1">
            <li>
              Click start game. A square on the board will be highlighted.
            </li>
            <li>Type its name (e.g. e4).</li>
            <li>
              If you guess correctly, you earn a point and a new square is
              highlighted.
            </li>
          </ul>
        </div>
      )}

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
          onTouchEnd={() => setBoardFlipped((prev) => !prev)}
          className="px-3 py-1 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500"
          disabled={gameActive}
        >
          {sideLabel}
        </button>
      </div>

      <div className="w-[80%] max-w-[80%] sm:w-full sm:max-w-[30rem] grid grid-cols-8 gap-1">
        {renderedRanks.map((rank, rankIndex) => (
          <React.Fragment key={rank}>
            {renderedFiles.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const bgColor =
                (rankIndex + fileIndex) % 2 === 0 ? "bg-white" : "bg-gray-400";
              return (
                <motion.div
                  key={square}
                  role="presentation"
                  className={`aspect-square ${bgColor} border-2 border-gray-200 rounded-2xl flex items-center justify-center text-sm font-semibold`}
                  variants={squareVariants}
                  initial="base"
                  animate={getSquareVariant(square)}
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
            inputMode="text"
            pattern="[A-Za-z0-9]*"
            ref={inputRef}
            className="border px-2 py-1 rounded-md"
            placeholder="Enter square e.g. e4"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitGuess();
              }
            }}
          />
        </div>
      )}

      {!gameActive && (
        <button
          onClick={startGame}
          onTouchEnd={startGame}
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
                  Square: <strong>{g.square}</strong>, Your Guess:{" "}
                  <strong>{g.guess}</strong>
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
