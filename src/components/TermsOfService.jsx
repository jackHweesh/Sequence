import React from 'react';

const TermsOfService = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
            
            <p className="text-sm text-white/80 mb-6">
              <em>Last updated: August 8, 2025</em>
            </p>
            
            <p className="mb-6">
              Welcome to <strong>TheDailySequence</strong>. By accessing or using our web app, you agree to these terms:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Use of the Service</h3>
                <p className="mb-0">You may use TheDailySequence for personal, non-commercial entertainment or learning.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">License</h3>
                <p className="mb-0">We grant you a limited, non-exclusive, non-transferable right to use TheDailySequence in accordance with these terms.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Prohibited Conduct</h3>
                <ul className="list-disc list-inside space-y-1 mb-0">
                  <li>Don't hack, scrape, reverse-engineer or otherwise tamper with the app.</li>
                  <li>Don't use TheDailySequence to post illegal or harmful content.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Intellectual Property</h3>
                <p className="mb-2">All designs, code, text and graphics in TheDailySequence are owned by us (or our licensors) and are protected by copyright and other laws.</p>
                <p className="mb-0">You agree not to copy, distribute or create derivative works without permission.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Disclaimer of Warranties</h3>
                <ul className="list-disc list-inside space-y-1 mb-0">
                  <li>TheDailySequence is provided "as-is," without any warranty of any kind.</li>
                  <li>We make no promises that it will be uninterrupted, error-free or fit for any particular purpose.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                <p className="mb-0">To the fullest extent permitted by law, we won't be liable for any indirect, special or consequential damages arising out of your use of TheDailySequence.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Indemnification</h3>
                <p className="mb-0">You agree to indemnify and hold us harmless from any claims or losses arising from your misuse of the app.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Modifications</h3>
                <p className="mb-0">We may change these terms at any time by posting an updated version here. Your continued use after changes means you accept the new terms.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Governing Law</h3>
                <p className="mb-0">These terms are governed by the laws of the United States, without regard to conflict-of-law principles.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-white/70 text-xs">© 2025 BlueOak Enterprises. All rights reserved.</div>
      </div>
    </div>
  );
};

export default TermsOfService; 