import React, { useState, useEffect, useCallback, useRef } from "react";
import ScoreBoard from "./components/ScoreBoard";
import ChessBoard from "./components/ChessBoard";
import GameControls from "./components/GameControls";
import GameResults from "./components/GameResults";
import { squareVariants } from "./constants/squareVariants";
import { getRandomSquare } from "./utils/chessUtils";
import { useCountdown, useGameTimer } from "./hooks/useGameTimers";
import { useAutoFocus } from "./hooks/useAutoFocus";

export default function ChessSquareGame() {
  // State declarations
  const [highlightedSquare, setHighlightedSquare] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [guesses, setGuesses] = useState([]);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [customTime, setCustomTime] = useState("30");
  const [squareEffects, setSquareEffects] = useState({});
  const [firstSquareBlinking, setFirstSquareBlinking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Number(customTime) || 30);

  const inputRef = useRef(null);
  const finalScoreRef = useRef(null);

  const endGame = useCallback(() => {
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
  }, [score, highScore]);

  const startActualGame = useCallback(() => {
    const time = customTime.trim() === "" ? 30 : Number(customTime);
    setScore(0);
    setTimeLeft(time);
    setGameActive(true);
    const firstSquare = getRandomSquare();
    setHighlightedSquare(firstSquare);
    setUserGuess("");
    setGuesses([]);
    setSquareEffects({});
    setFirstSquareBlinking(true);
  }, [customTime]);

  // Initialize countdown hook
  const [countdown, startCountdown] = useCountdown(3);
  
  // Initialize game timer hook
  useGameTimer(timeLeft, gameActive, endGame, setTimeLeft);
  
  // Auto focus management
  useAutoFocus(inputRef, gameActive);

  // Start game function
  const startGame = useCallback(() => {
    startCountdown(startActualGame);
  }, [startCountdown, startActualGame]);

  const handleSubmitGuess = (submittedGuess) => {
    // Use the passed guess if available; otherwise, fall back to current state.
    const guess = typeof submittedGuess === "string" ? submittedGuess : userGuess;
    if (!gameActive) return;
    const trimmed = guess.trim().toLowerCase();
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
      <div className="mb-4 text-center max-w-sm sm:max-w-none px-2">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Chess Square Trainer</h1>
        <p className="text-sm sm:text-base text-gray-600">
          How fast can you identify chess squares?
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

      {/* Wrap the ChessBoard in a relative container */}
      <div className="relative w-full max-w-[30rem] mx-auto">
        <ChessBoard
          boardFlipped={boardFlipped}
          highlightedSquare={highlightedSquare}
          squareEffects={squareEffects}
          firstSquareBlinking={firstSquareBlinking}
          squareVariants={squareVariants}
          getSquareVariant={getSquareVariant}
        />
        {countdown !== null && (
          <div
            className="absolute z-10 flex items-center justify-center rounded-lg bg-white bg-opacity-60 backdrop-blur-sm"
            style={{
              width: "calc((100% / 8) * 2)",
              height: "calc((100% / 8) * 2)",
              top: "calc(50% - (100% / 8))",
              left: "calc(50% - (100% / 8))"
            }}
          >
            <div className="text-6xl font-bold text-gray-800">
              {countdown}
            </div>
          </div>
        )}
      </div>

      <GameControls
        gameActive={gameActive}
        countdown={countdown}
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
