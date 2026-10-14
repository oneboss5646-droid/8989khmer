import React, { useState } from 'react';
import { Globe, Check, Search, X, ChevronDown } from 'lucide-react';
import { Language } from '../locales/translations';
import { SUPPORTED_COUNTRIES, CountryInfo } from '../data/countries';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
  buttonVariant?: 'pill' | 'header' | 'compact';
}

export const LanguageSelector: React.FC<Props> = ({
  language,
  onLanguageChange,
  className = '',
  buttonVariant = 'pill',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Find currently active country
  const currentCountry =
    SUPPORTED_COUNTRIES.find((c) => c.langCode === language) ||
    SUPPORTED_COUNTRIES.find((c) => c.langCode === 'km') ||
    SUPPORTED_COUNTRIES[0];

  const filteredCountries = SUPPORTED_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.localName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.dialCode.includes(searchTerm)
  );

  const handleSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs font-semibold shadow-md transition active:scale-95 ${className}`}
        title="Change Country & Language"
      >
        <span className="text-base leading-none">{currentCountry.flag}</span>
        <span className="font-medium text-[11px] max-w-[80px] truncate text-slate-100">
          {currentCountry.localName}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {/* Modal / Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Select Language / Country</h3>
                  <p className="text-[10px] text-slate-400">
                    22 Supported Global Regions ({SUPPORTED_COUNTRIES.length} Countries)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="my-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search country, language, or dial code..."
                className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            {/* Country List (22 Countries) */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredCountries.map((c) => {
                const isSelected = c.langCode === language;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c.langCode as Language)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{c.flag}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1 py-0.2 rounded border border-slate-700/50">
                            {c.dialCode}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{c.localName}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredCountries.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500">
                  No matching country found.
                </div>
              )}
            </div>

            {/* Footer Notice */}
            <div className="pt-3 mt-2 border-t border-slate-800/80 text-center">
              <span className="text-[10px] text-slate-500">
                Translations adapt automatically across all VIP trading interfaces
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
