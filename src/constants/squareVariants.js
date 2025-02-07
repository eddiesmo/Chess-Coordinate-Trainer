export const squareVariants = {
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
    boxShadow: [
      "0 0 0 4px #facc15", // original yellow
      "0 0 0 4px #fde047", // slightly brighter yellow
      "0 0 0 4px #facc15", // back to original yellow
    ],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
}; 