import React, { useRef, useCallback } from "react";
import ScoreBoard from "./components/ScoreBoard";
import ChessBoard from "./components/ChessBoard";
import GameControls from "./components/GameControls";
import GameResults from "./components/GameResults";
import { squareVariants } from "./constants/squareVariants";
import { filesDefault, ranksDefault } from "./utils/chessUtils";
import { useChessGame } from "./hooks/useChessGame";
import { useCountdown, useGameTimer } from "./hooks/timers";
import { useAutoFocus } from "./hooks/useAutoFocus";
import { COUNTDOWN_OVERLAY_STYLE } from "./constants/styles";

export default function ChessSquareGame() {
  const {
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
  } = useChessGame();

  const inputRef = useRef(null);

  // Consolidated timer hooks
  const [countdown, startCountdown] = useCountdown(3);
  useGameTimer(timeLeft, gameActive, endGame, setTimeLeft);

  // Auto-focus handling stays the same
  useAutoFocus(inputRef, gameActive);

  const startGame = useCallback(() => {
    startCountdown(startActualGame);
  }, [startCountdown, startActualGame]);

  // Determine overlay hints based on board orientation
  const renderedFilesForOverlay = boardFlipped
    ? [...filesDefault].reverse()
    : filesDefault;
  const renderedRanksForOverlay = boardFlipped
    ? [...ranksDefault]
    : [...ranksDefault].reverse();

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
        showHints={showHints}
        toggleShowHints={toggleHints}
      />

      {/* ChessBoard with optional rank/file hints */}
      <div className="relative w-full max-w-[30rem] mx-auto">
        <ChessBoard
          boardFlipped={boardFlipped}
          highlightedSquare={highlightedSquare}
          squareEffects={squareEffects}
          firstSquareBlinking={isFirstSquareBlinking}
          squareVariants={squareVariants}
          getSquareVariant={getSquareVariant}
        />
        {showHints && (
          <>
            {/* File hints along the bottom */}
            <div className="absolute bottom-[-1rem] left-0 w-full grid grid-cols-8">
              {renderedFilesForOverlay.map((file) => (
                <span key={file} className="text-center text-xs text-gray-500">
                  {file.toUpperCase()}
                </span>
              ))}
            </div>
            {/* Rank hints along the left side */}
            <div className="absolute left-[-1.25rem] top-0 w-[1.5rem] h-full grid grid-rows-8">
              {renderedRanksForOverlay.map((rank) => (
                <span key={rank} className="text-center text-xs text-gray-500 self-center">
                  {rank}
                </span>
              ))}
            </div>
          </>
        )}
        {countdown !== null && (
          <div
            className="absolute z-10 flex items-center justify-center rounded-lg bg-white bg-opacity-60 backdrop-blur-sm"
            style={COUNTDOWN_OVERLAY_STYLE}
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
        hintsUsed={hintsUsed}
        showHints={showHints}
      />

      {!gameActive && guesses.length > 0 && (
        <GameResults guesses={guesses} finalScoreRef={finalScoreRef} />
      )}
    </div>
  );
}
