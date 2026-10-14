import React, { useState, useEffect } from 'react';
import { AdminPanel } from './components/AdminPanel';
import { Language } from './locales/translations';
import { store } from './services/store';

export default function AdminApp() {
  const [language, setLanguage] = useState<Language>('km');

  useEffect(() => {
    document.title =
      language === 'km'
        ? 'QuantYield Global | ផ្ទាំងគ្រប់គ្រង Admin (Admin Portal)'
        : 'QuantYield Global | Admin Management Portal';
  }, [language]);

  const handleOpenInvestorWebsite = () => {
    if (typeof window !== 'undefined') {
      // Open the independent Investor Website in a new browser tab/window
      const url = `${window.location.origin}/`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans">
      <AdminPanel
        language={language}
        onLanguageChange={setLanguage}
        onSwitchToInvestApp={handleOpenInvestorWebsite}
      />
    </div>
  );
}
