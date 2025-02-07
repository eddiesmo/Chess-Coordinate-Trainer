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
  const [customTime, setCustomTime] = useState("30");

  // We'll track per-square blink effects: 'incorrect' | null.
  const [squareEffects, setSquareEffects] = useState({});

  // Whether we're still on the first square, to do continuous blinking.
  const [firstSquareBlinking, setFirstSquareBlinking] = useState(false);

  const inputRef = useRef(null);
  const finalScoreRef = useRef(null);

  const getRandomSquare = useCallback(() => {
    const randomFile =
      filesDefault[Math.floor(Math.random() * filesDefault.length)];
    const randomRank =
      ranksDefault[Math.floor(Math.random() * ranksDefault.length)];
    return `${randomFile}${randomRank}`;
  }, []);

  const startGame = () => {
    // If customTime is empty, use the default of 30 seconds.
    const time = customTime.trim() === "" ? 30 : Number(customTime);
    // If it's empty, update the input state back to "30".
    if (customTime.trim() === "") {
      setCustomTime("30");
    }
    setScore(0);
    setTimeLeft(time);
    setGameActive(true);
    let firstSquare = getRandomSquare();
    setHighlightedSquare(firstSquare);
    setUserGuess("");
    setGuesses([]);
    setSquareEffects({});
    setFirstSquareBlinking(true);
  };

  const endGame = () => {
    setGameActive(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setTimeout(() => {
      finalScoreRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
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
      if (firstSquareBlinking) {
        setFirstSquareBlinking(false);
      }
      let nextSquare = getRandomSquare();
      while (nextSquare === highlightedSquare) {
        nextSquare = getRandomSquare();
      }
      setHighlightedSquare(nextSquare);
    } else {
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

  const renderedRanks = boardFlipped ? ranksDefault : [...ranksDefault].reverse();
  const renderedFiles = boardFlipped ? [...filesDefault].reverse() : filesDefault;
  const sideLabel = boardFlipped ? "Playing as Black" : "Playing as White";

  // Determine which variant to use on each square.
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 relative">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Chess Square Naming Game</h1>
        <p className="text-gray-600">
          Identify as many squares as possible before time runs out!
        </p>
      </div>

      {/* Scoreboard */}
      <div className="mb-4 text-center min-h-[80px] flex items-center justify-center">
        {gameActive ? (
          <div className="flex flex-col items-center space-y-1">
            <motion.h2
              className="text-2xl font-bold"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Time Left: {timeLeft}s
            </motion.h2>
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-600"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ 
                  duration: timeLeft,
                  ease: "linear"
                }}
              />
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Score: {score}</p>
              <span className={`${
                boardFlipped 
                  ? "text-gray-800 font-medium" 
                  : "text-gray-600"
              }`}>
                {sideLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center space-x-2">
            <label className="flex items-center space-x-2">
              <span className="font-semibold">Time Limit:</span>
              <input
                type="number"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                onBlur={() => {
                  if (customTime.trim() === "") {
                    setCustomTime("30");
                  }
                }}
                className="border px-2 py-1 rounded-md w-20"
                min={5}
                max={600}
                disabled={gameActive}
              />
            </label>
            <button
              onClick={() => setBoardFlipped((prev) => !prev)}
              onTouchEnd={() => setBoardFlipped((prev) => !prev)}
              className={`px-3 py-1 rounded-2xl w-40 whitespace-nowrap ${
                boardFlipped 
                  ? "bg-gray-800 text-gray-100 hover:bg-gray-700" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={gameActive}
            >
              {sideLabel}
            </button>
          </div>
        )}
      </div>

      {/* Chess board grid */}
      <div className="w-[80%] max-w-[80%] sm:w-full sm:max-w-[30rem] grid grid-cols-8 gap-1">
        {renderedRanks.map((rank, rankIndex) => (
          <React.Fragment key={rank}>
            {renderedFiles.map((file) => {
              const square = `${file}${rank}`;
              const bgColor = (rankIndex + renderedFiles.indexOf(file)) % 2 === 0 ? "bg-white" : "bg-gray-400";
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

      {/* Bottom control area – always reserves the same space */}
      <div className="w-full max-w-md mt-4 min-h-[120px]">
        {gameActive ? (
          // When a game is active, show the input field.
          <div className="flex justify-center">
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
        ) : (
          // When no game is active, show the Start Game button and either "How to Play" (if no game has been played)
          // or the final score if at least one game has been played.
          <div className="text-center">
            <button
              onClick={startGame}
              onTouchEnd={startGame}
              className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-500"
            >
              Start Game
            </button>
            {guesses.length === 0 ? (
              <div className="mt-4">
                <div className="max-w-md px-2 py-2 bg-white rounded-2xl shadow text-left">
                  <h2 className="text-lg font-semibold mb-1">How to Play</h2>
                  <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 px-1">
                    <li>Click start game. A square on the board will be highlighted.</li>
                    <li>Type its name (e.g. e4).</li>
                    <li>
                      If you guess correctly, you earn a point and a new square is highlighted.
                    </li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="mt-2">
                <h2 className="text-xl font-semibold">Your Final Score: {score}</h2>
                <p className="text-gray-600">High Score: {highScore}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results – shown only after a game has been played */}
      {!gameActive && guesses.length > 0 && (
        <div 
          ref={finalScoreRef}
          className="mt-2 w-full max-w-md mx-auto bg-white p-4 rounded-2xl shadow-md"
        >
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
