import React, { useState } from 'react';
import {
  Globe,
  Shield,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  X,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { Language, translations } from '../locales/translations';

interface Props {
  currentSite: 'invest' | 'admin';
  onSwitchSite: (site: 'invest' | 'admin') => void;
  language: Language;
}

export const PortalSwitcherDock: React.FC<Props> = ({
  currentSite,
  onSwitchSite,
  language,
}) => {
  const t = translations[language];
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Helper to open portal in a new tab/window
  const openPortalInNewTab = (site: 'invest' | 'admin') => {
    if (typeof window !== 'undefined') {
      const targetHash = site === 'admin' ? '#/admin' : '#/invest';
      const url = `${window.location.origin}${window.location.pathname}${targetHash}`;
      window.open(url, '_blank');
    }
  };

  if (isHidden) {
    return (
      <button
        onClick={() => setIsHidden(false)}
        className="fixed bottom-3 right-3 z-50 px-2.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white shadow-xl text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-md transition hover:scale-105"
        title={language === 'km' ? 'បង្ហាញផ្ទាំងប្តូរគេហទំព័រ' : 'Show Portal Switcher'}
      >
        <Layers className="w-3.5 h-3.5 text-blue-400" />
        <span>{language === 'km' ? 'ប្តូរគេហទំព័រ (Portals)' : 'Switch Portals'}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm transition-all duration-300">
      <div className="bg-slate-950/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden p-3 text-white ring-1 ring-white/10">
        {/* Top Header of Dock */}
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-extrabold text-[11px] text-slate-200">
              {language === 'km' ? 'ប្រព័ន្ធប្តូរគេហទំព័រទាំងពីរ' : 'QuantYield Dual Portals'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:text-white rounded hover:bg-slate-800 transition"
              title={isMinimized ? 'Expand' : 'Collapse'}
            >
              {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsHidden(true)}
              className="p-1 hover:text-white rounded hover:bg-slate-800 transition"
              title={language === 'km' ? 'លាក់ផ្ទាំងនេះ' : 'Hide Dock'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {!isMinimized ? (
          <div className="pt-2.5 space-y-2">
            {/* Quick Switch Buttons */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {/* Button 1: Investor Web */}
              <button
                type="button"
                onClick={() => onSwitchSite('invest')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  currentSite === 'invest'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="truncate">
                  {language === 'km' ? 'Investor Web' : 'Investor Web'}
                </span>
                {currentSite === 'invest' && (
                  <CheckCircle2 className="w-3 h-3 text-blue-200 flex-shrink-0" />
                )}
              </button>

              {/* Button 2: Admin Portal */}
              <button
                type="button"
                onClick={() => onSwitchSite('admin')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  currentSite === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5 fill-current" />
                <span className="truncate">
                  {language === 'km' ? 'Admin Portal' : 'Admin Portal'}
                </span>
                {currentSite === 'admin' && (
                  <CheckCircle2 className="w-3 h-3 text-slate-950 flex-shrink-0" />
                )}
              </button>
            </div>

            {/* Launch in New Tab actions */}
            <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>{language === 'km' ? 'បើកផ្ទាំងដាច់ដោយឡែក៖' : 'Open in New Tab:'}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openPortalInNewTab('invest')}
                  className="hover:text-blue-400 flex items-center gap-0.5 underline underline-offset-2"
                >
                  <span>Investor Web</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => openPortalInNewTab('admin')}
                  className="hover:text-amber-400 flex items-center gap-0.5 underline underline-offset-2"
                >
                  <span>Admin</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Realtime Sync status */}
            <div className="text-[10px] bg-slate-900/60 border border-slate-800/80 rounded-lg p-1.5 flex items-center justify-between text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Sync: Active</span>
              </span>
              <span className="text-[9px] text-slate-500">
                {currentSite === 'invest' ? 'Route: /invest' : 'Route: /admin'}
              </span>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex items-center justify-between text-xs font-semibold">
            <span className="text-[11px] text-slate-300">
              {currentSite === 'admin' ? '🛡️ Admin Portal' : '🌐 Investor Web'}
            </span>
            <button
              onClick={() => onSwitchSite(currentSite === 'admin' ? 'invest' : 'admin')}
              className="text-[10px] text-blue-400 hover:text-blue-300 underline font-bold"
            >
              {currentSite === 'admin' ? 'Switch to Investor' : 'Switch to Admin'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
