import React from "react";
import { motion } from "framer-motion";
import { normalizeTime } from "../utils/timeUtils";

function ScoreBoard({
  gameActive,
  timeLeft,
  score,
  boardFlipped,
  sideLabel,
  customTime,
  setCustomTime,
  toggleBoardFlip,
}) {
  return (
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
                duration: Number(customTime),
                ease: "linear",
              }}
            />
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Score: {score}</p>
            <span
              className={`${
                boardFlipped ? "text-gray-800 font-medium" : "text-gray-600"
              }`}
            >
              {sideLabel}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center space-x-4">
          <label className="flex items-center space-x-2">
            <span className="font-semibold">Time:</span>
            <input
              type="number"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              onBlur={() => setCustomTime(normalizeTime(customTime))}
              className="border px-2 py-1 rounded-md w-14"
              min={5}
              max={600}
            />
          </label>
          <button
            onClick={toggleBoardFlip}
            className={`px-3 py-1 rounded-2xl w-36 whitespace-nowrap ${
              boardFlipped
                ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {sideLabel}
          </button>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard; 