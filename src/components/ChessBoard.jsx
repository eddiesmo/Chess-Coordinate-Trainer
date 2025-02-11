import React from 'react';
import { motion } from 'framer-motion';
import { filesDefault, ranksDefault } from '../utils/chessUtils';

function ChessBoard({
  boardFlipped,
  highlightedSquare,
  squareEffects,
  firstSquareBlinking,
  squareVariants,
  getSquareVariant,
}) {
  const renderedRanks = boardFlipped ? [...ranksDefault] : [...ranksDefault].reverse();
  const renderedFiles = boardFlipped ? [...filesDefault].reverse() : filesDefault;

  return (
    <div className="w-full sm:max-w-[30rem] mx-auto">
      <div className="relative grid grid-cols-8 bg-gray-400">
        {renderedRanks.map((rank, rankIndex) => (
          <React.Fragment key={rank}>
            {renderedFiles.map((file, fileIndex) => {
              const square = `${file}${rank}`;
              const bgColor =
                (rankIndex + renderedFiles.indexOf(file)) % 2 === 0 ? 'bg-white' : 'bg-gray-400';

              const isHighlighted = square === highlightedSquare;

              return (
                <motion.div
                  key={square}
                  role="presentation"
                  className={`aspect-square ${bgColor} flex items-center justify-center text-sm font-semibold ${
                    isHighlighted ? 'z-10 relative' : 'relative'
                  }`}
                  style={{
                    margin: 0,
                    borderRight: '0.5px solid #9ca3af',
                    borderBottom: '0.5px solid #9ca3af',
                    borderLeft: fileIndex === 0 ? '0.5px solid #9ca3af' : 'none',
                    borderTop: rankIndex === 0 ? '0.5px solid #9ca3af' : 'none',
                  }}
                  variants={squareVariants}
                  initial="base"
                  animate={getSquareVariant(square)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ChessBoard;
