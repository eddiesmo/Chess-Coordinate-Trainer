import React, { useState, useEffect, useCallback, useRef } from "react";
import ScoreBoard from "./components/ScoreBoard";
import ChessBoard from "./components/ChessBoard";
import GameControls from "./components/GameControls";
import GameResults from "./components/GameResults";
import { squareVariants } from "./constants/squareVariants";
import { getRandomSquare } from "./utils/chessUtils";

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

  // We'll track per-square effects (e.g. "incorrect") in this object.
  const [squareEffects, setSquareEffects] = useState({});

  // Whether we are still on the first square (to show continuous blinking).
  const [firstSquareBlinking, setFirstSquareBlinking] = useState(false);

  const inputRef = useRef(null);
  const finalScoreRef = useRef(null);

  const startGame = () => {
    const time = customTime.trim() === "" ? 30 : Number(customTime);
    if (customTime.trim() === "") {
      setCustomTime("30");
    }
    setScore(0);
    setTimeLeft(time);
    setGameActive(true);
    const firstSquare = getRandomSquare();
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
        behavior: "smooth",
        block: "center",
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

  const toggleBoardFlip = () => setBoardFlipped((prev) => !prev);
  const sideLabel = boardFlipped ? "Playing as Black" : "Playing as White";

  // Determine the appropriate square animation variant.
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

      <ScoreBoard
        gameActive={gameActive}
        timeLeft={timeLeft}
        score={score}
        boardFlipped={boardFlipped}
        sideLabel={sideLabel}
        customTime={customTime}
        setCustomTime={setCustomTime}
        toggleBoardFlip={toggleBoardFlip}
      />

      <ChessBoard
        boardFlipped={boardFlipped}
        highlightedSquare={highlightedSquare}
        squareEffects={squareEffects}
        firstSquareBlinking={firstSquareBlinking}
        squareVariants={squareVariants}
        getSquareVariant={getSquareVariant}
      />

      <GameControls
        gameActive={gameActive}
        userGuess={userGuess}
        setUserGuess={setUserGuess}
        handleSubmitGuess={handleSubmitGuess}
        inputRef={inputRef}
        startGame={startGame}
        guesses={guesses}
        score={score}
        highScore={highScore}
      />

      {!gameActive && guesses.length > 0 && (
        <GameResults guesses={guesses} finalScoreRef={finalScoreRef} />
      )}
    </div>
  );
}
