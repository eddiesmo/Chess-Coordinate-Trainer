import React, { useState, useEffect } from "react";
import MobileKeypad from "./MobileKeypad";
import { useAutoFocus } from "../hooks/useAutoFocus";

function GameControls({
  gameActive,
  countdown,
  userGuess,
  setUserGuess,
  handleSubmitGuess,
  inputRef,
  startGame,
  guesses,
  score,
  highScore,
  hintsUsed,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Replace the existing focus effect with useAutoFocus
  useAutoFocus(inputRef, !isMobile && countdown !== null);

  return (
    <div className="w-full max-w-md mt-4 min-h-[120px]">
      {(gameActive || countdown !== null) ? (
        <div className="flex flex-col items-center">
          {!isMobile ? (
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
            <MobileKeypad
              userGuess={userGuess}
              setUserGuess={setUserGuess}
              handleSubmitGuess={handleSubmitGuess}
            />
          )}
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={startGame}
            className="px-4 py-2 bg-green-600 text-white rounded-2xl hover:bg-green-500"
          >
            Start Game
          </button>
          {guesses.length === 0 ? (
            <div className="mt-4">
              <div className="max-w-md px-2 py-2 bg-white rounded-2xl shadow text-left">
                <h2 className="text-lg font-semibold mb-1">How to Play</h2>
                <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 px-1">
                  <li>
                    Click start game. A square on the board will be highlighted.
                  </li>
                  <li>Type its name (e.g. e4).</li>
                  <li>
                    If you guess correctly, you earn a point and a new square is
                    highlighted.
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <h2 className="text-xl font-semibold">
                Your Final Score: {score} {hintsUsed ? "(with hints)" : ""}
              </h2>
              <p className="text-gray-600">High Score: {highScore}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GameControls; 