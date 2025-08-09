import React, { useState } from 'react';
import SequenceGame from './components/SequenceGame';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import HowToPlay from './components/HowToPlay';
import SettingsDropdown from './components/SettingsDropdown';

function App() {
  const [currentPage, setCurrentPage] = useState('game');
  const [isWelcome, setIsWelcome] = useState(true);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('game');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'howtoplay':
        return <HowToPlay onBack={handleBack} />;
      case 'privacy':
        return <PrivacyPolicy onBack={handleBack} />;
      case 'terms':
        return <TermsOfService onBack={handleBack} />;
      default:
        return <SequenceGame onWelcomeChange={setIsWelcome} />;
    }
  };

  return (
    <div className="App">
      {/* Settings Dropdown - hide on the game's welcome screen; use absolute so it stays only at the top */}
      {(currentPage !== 'game' || !isWelcome) && (
        <div className="absolute top-4 right-4 z-50">
          <SettingsDropdown onNavigate={handleNavigate} />
        </div>
      )}
      
      {renderPage()}
    </div>
  );
}

export default App; 