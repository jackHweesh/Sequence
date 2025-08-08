import React from 'react';

const HowToPlay = ({ onBack }) => {
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-white/80 hover:text-white transition-colors duration-200"
            aria-label="Back to game"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-white">How to Play</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-2xl font-bold mb-6">How to Play</h1>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Daily Challenge</h3>
                <p className="mb-0">Each day brings a brand-new question with five items to order.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Your Mission</h3>
                <p className="mb-0">Arrange those five answers in their correct sequence.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Three Tries</h3>
                <p className="mb-0">You have three attempts to get it right—use them wisely!</p>
              </div>

              <div className="text-center pt-4">
                <p className="text-lg font-semibold text-yellow-300">Good luck!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white/70 text-xs">© 2025 BlueOak Enterprises. All rights reserved.</div>
      </div>
    </div>
  );
};

export default HowToPlay; 