import React, { useState } from 'react';

const ShareResults = ({ gameHistory, isCorrect, dayNumber, onClose }) => {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const maxGuesses = 3;
    const totalGuesses = gameHistory.length;
    
    let shareText = `Sequence ${dayNumber ? dayNumber : ''} ${isCorrect ? '✅ ' + totalGuesses : '❌'}/${maxGuesses}\n\n`;
    
    // Add each guess as a column (vertical format)
    const numItems = gameHistory[0]?.length || 5;
    
    for (let row = 0; row < numItems; row++) {
      let rowText = '';
      gameHistory.forEach((guess, guessIndex) => {
        const item = guess[row];
        rowText += item.isCorrect ? '🟩' : '⬜';
      });
      shareText += `${rowText}\n`;
    }
    
    // Append promotional/site URL at the bottom
    shareText += `\nwww.thedailysequence.com`;

    return shareText;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {isCorrect ? 'Well done! 🎉' : 'Game Over'}
          </h3>
          <p className="text-gray-600">
            Share your results
          </p>
        </div>

        {/* Results Display */}
        <div className="mb-6">
          {/* Sequence Status */}
          <div className="text-center mb-2">
            <span className="text-sm text-gray-500">
              Sequence {dayNumber ? dayNumber : ''} {isCorrect ? '✅ ' + gameHistory.length : '❌'}/3
            </span>
          </div>
          
          {/* Emoji Grid */}
          <div className="flex justify-center space-x-2 mb-4">
            {gameHistory.map((guess, guessIndex) => (
              <div key={guessIndex} className="flex flex-col space-y-1">
                {guess.map((item, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 flex items-center justify-center text-sm ${
                      item.isCorrect ? 'bg-green-500' : 'bg-gray-300'
                    } rounded`}
                  >
                    {item.isCorrect ? '🟩' : '⬜'}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Site URL under emoji grid */}
          <div className="text-center text-gray-600 text-sm">
            www.thedailysequence.com
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex justify-center">
          <button
            onClick={handleCopy}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            {copied ? 'Copied! ✅' : 'Copy Results'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareResults; 