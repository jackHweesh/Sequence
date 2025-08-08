import React from 'react';

const PrivacyPolicy = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
          <div className="prose prose-invert max-w-none">
            <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
            
            <p className="text-sm text-white/80 mb-6">
              <em>Effective date: August 8, 2025</em>
            </p>
            
            <p className="mb-6">
              <strong>TheDailySequence</strong> is committed to respecting your privacy. Because TheDailySequence does not collect, store or share any personal information, this policy is very short:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">No personal data collected.</h3>
                <p className="mb-0">We don't ask for names, emails, phone numbers or any other personal identifiers.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">No analytics or cookies.</h3>
                <p className="mb-0">We don't use tracking, cookies or third-party analytics.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">No data sharing.</h3>
                <p className="mb-0">Since we don't hold any user data, there's nothing to share with anyone.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Children's privacy.</h3>
                <p className="mb-0">We don't knowingly collect data from anyone under 13.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Changes to this policy.</h3>
                <p className="mb-0">If we ever start collecting data, we'll update this page—check back here for the latest version.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 