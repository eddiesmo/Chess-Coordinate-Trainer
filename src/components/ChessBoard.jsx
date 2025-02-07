import React from "react";
import { motion } from "framer-motion";
import { filesDefault, ranksDefault } from "../utils/chessUtils";

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
    <div className="w-[80%] max-w-[80%] sm:w-full sm:max-w-[30rem] grid grid-cols-8 gap-1">
      {renderedRanks.map((rank, rankIndex) => (
        <React.Fragment key={rank}>
          {renderedFiles.map((file) => {
            const square = `${file}${rank}`;
            const bgColor =
              (rankIndex + renderedFiles.indexOf(file)) % 2 === 0 ? "bg-white" : "bg-gray-400";
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
  );
}

export default ChessBoard; 