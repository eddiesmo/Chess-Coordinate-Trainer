export const squareVariants = {
  base: {
    scale: 1,
    outline: 'none',
    outlineOffset: 0,
    zIndex: 1,
    transition: { duration: 0 },
  },
  highlighted: {
    scale: 1,
    outline: '5px solid #facc15',
    outlineOffset: '-1px',
    zIndex: 10,
    transition: { duration: 0 },
  },
  incorrect: {
    scale: [1, 1.2, 1],
    outline: [
      '5px solid #facc15', // yellow
      '5px solid #f87171', // red
      '5px solid #facc15', // back to yellow
    ],
    outlineOffset: '-1px',
    zIndex: 10,
    transition: {
      duration: 0.5,
    },
  },
  firstBlink: {
    scale: [1, 1.05, 1],
    outline: [
      '5px solid #facc15', // original yellow
      '5px solid #fde047', // slightly brighter yellow
      '5px solid #facc15', // back to original yellow
    ],
    outlineOffset: '-1px',
    zIndex: 10,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};
