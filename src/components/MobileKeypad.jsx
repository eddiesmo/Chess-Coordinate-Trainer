import React from 'react';

function MobileKeypad({ userGuess, setUserGuess, handleSubmitGuess }) {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const handleKeyPress = (key) => {
    // Allow letters only when nothing is selected.
    if (/[a-h]/.test(key)) {
      if (userGuess.length === 0) {
        setUserGuess(key);
      }
    }
    // Allow digits only when a letter is already chosen.
    else if (/[1-8]/.test(key)) {
      if (userGuess.length === 1) {
        const newGuess = userGuess + key;
        setUserGuess(newGuess);
        // Auto-submit using the new guess value so we don't rely on the async state update.
        setTimeout(() => {
          handleSubmitGuess(newGuess);
        }, 0);
      }
    }
  };

  return (
    <div className="mt-4 w-full max-w-md">
      {/* Letter buttons */}
      <div className="grid grid-cols-4 gap-2">
        {letters.map((letter) => {
          // A letter is considered selected if it's the first character of userGuess.
          const isSelected = userGuess[0] === letter;
          // Disable all letter buttons once any letter is selected.
          const disabled = userGuess.length > 0;
          return (
            <button
              key={letter}
              onClick={() => handleKeyPress(letter)}
              disabled={disabled}
              className={`px-2 py-1 rounded text-white bg-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isSelected ? 'border-2 border-blue-700' : ''}`}
            >
              {letter.toUpperCase()}
            </button>
          );
        })}
      </div>
      {/* Digit buttons */}
      <div className="grid grid-cols-4 gap-2 mt-2">
        {digits.map((digit) => {
          // A digit is considered selected if it's the second character of userGuess.
          const isSelected = userGuess.length === 2 && userGuess[1] === digit;
          // Only enable digit buttons when exactly one letter has been chosen.
          const disabled = userGuess.length !== 1;
          return (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              disabled={disabled}
              className={`px-2 py-1 rounded text-white bg-blue-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${isSelected ? 'border-2 border-blue-700' : ''}`}
            >
              {digit}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MobileKeypad;
