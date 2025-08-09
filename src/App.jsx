import React, { useState } from 'react';
import SequenceGame from './components/SequenceGame';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
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
      {/* Settings Dropdown - hide on the game's welcome screen */}
      {(currentPage !== 'game' || !isWelcome) && (
        <div className="fixed top-4 right-4 z-50" style={{ zIndex: 9999 }}>
          <SettingsDropdown onNavigate={handleNavigate} />
        </div>
      )}
      
      {renderPage()}
    </div>
  );
}

export default App; 