import React, { useState } from 'react';
import SequenceGame from './components/SequenceGame';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import HowToPlay from './components/HowToPlay';
import SettingsDropdown from './components/SettingsDropdown';

function App() {
  const [currentPage, setCurrentPage] = useState('game');

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
        return <SequenceGame />;
    }
  };

  return (
    <div className="App">
      {/* Settings Dropdown - show on all pages */}
      <div className="fixed top-4 right-4 z-50">
        <SettingsDropdown onNavigate={handleNavigate} />
      </div>
      
      {renderPage()}
    </div>
  );
}

export default App; 