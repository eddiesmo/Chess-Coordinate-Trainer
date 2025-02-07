import React from 'react';
import BuyMeACoffee from './BuyMeACoffee';

function GameResults({ guesses, finalScoreRef }) {
  if (!guesses || guesses.length === 0) return null;

  return (
    <div
      ref={finalScoreRef}
      className="mt-2 w-full max-w-md mx-auto bg-white p-4 rounded-2xl shadow-md"
    >
      <h3 className="text-lg font-bold mb-2">Results</h3>
      <ul className="space-y-1">
        {guesses.map((g, idx) => (
          <li key={idx} className="flex justify-between items-center">
            <span>
              Square: <strong>{g.square}</strong>, Your Guess: <strong>{g.guess}</strong>
            </span>
            {g.isCorrect ? (
              <span className="text-green-600 font-semibold">Correct</span>
            ) : (
              <span className="text-red-600 font-semibold">Incorrect</span>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center">
        <BuyMeACoffee />
      </div>
    </div>
  );
}

export default GameResults;
