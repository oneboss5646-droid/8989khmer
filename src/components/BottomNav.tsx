import React from 'react';
import { Home, TrendingUp, Wallet, Headphones, User as UserIcon } from 'lucide-react';
import { translations, Language } from '../locales/translations';

export type TabType = 'home' | 'market' | 'wallet' | 'support' | 'account';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onTabChange, language }) => {
  const t = translations[language];

  const items = [
    {
      id: 'home' as TabType,
      label: t.home,
      icon: Home,
    },
    {
      id: 'market' as TabType,
      label: t.market,
      icon: TrendingUp,
    },
    {
      id: 'wallet' as TabType,
      label: language === 'km' ? 'វិនីយោគ' : 'Invest',
      icon: Wallet,
    },
    {
      id: 'support' as TabType,
      label: language === 'km' ? 'ជំនួយ' : 'Support',
      icon: Headphones,
    },
    {
      id: 'account' as TabType,
      label: t.myAccount,
      icon: UserIcon,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-2 max-w-md mx-auto shadow-2xl">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition relative ${
                isActive ? 'text-blue-500 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-[65px] ${isActive ? 'font-bold text-blue-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
