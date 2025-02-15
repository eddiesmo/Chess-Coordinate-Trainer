import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { normalizeTime } from '../utils/timeUtils';
import lightBulbIcon from '../assets/lightbulb_2_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24.svg';

function ScoreBoard({
  gameActive,
  timeLeft,
  score,
  boardFlipped,
  sideLabel,
  customTime,
  setCustomTime,
  toggleBoardFlip,
  showHints,
  toggleShowHints,
}) {
  const progressControls = useAnimation();
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (gameActive && !startTimeRef.current) {
      startTimeRef.current = Date.now();
      progressControls.set({ width: '100%' });
      progressControls.start({
        width: '0%',
        transition: {
          duration: Number(customTime),
          ease: 'linear',
        },
      });
    }

    if (!gameActive) {
      startTimeRef.current = null;
      progressControls.stop();
    }
  }, [gameActive, customTime, progressControls]);

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
              animate={progressControls}
            />
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Score: {score}</p>
            <span className="flex items-center">
              <span className={boardFlipped ? 'text-gray-800 font-medium' : 'text-gray-600'}>
                {sideLabel}
              </span>
              <button
                onClick={toggleShowHints}
                title="Toggle Hints"
                className="cursor-pointer focus:outline-none"
              >
                <img
                  src={lightBulbIcon}
                  alt="Toggle Hints"
                  className={`w-6 h-6 ${showHints ? 'opacity-100' : 'opacity-40'}`}
                />
              </button>
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
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleBoardFlip}
              className={`px-3 py-1 rounded-2xl w-36 whitespace-nowrap ${
                boardFlipped
                  ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {sideLabel}
            </button>
            <button
              onClick={toggleShowHints}
              title="Toggle Hints"
              className="cursor-pointer focus:outline-none"
            >
              <img
                src={lightBulbIcon}
                alt="Toggle Hints"
                className={`w-6 h-6 ${showHints ? 'opacity-100' : 'opacity-40'}`}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScoreBoard;
