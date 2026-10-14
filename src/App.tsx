/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { User, CryptoCoin } from './types';
import { initialCoins } from './data/mockCrypto';
import { Language } from './locales/translations';
import { LoginModal } from './components/LoginModal';
import { HomeScreen } from './components/HomeScreen';
import { MarketScreen } from './components/MarketScreen';
import { WalletInvestScreen } from './components/WalletInvestScreen';
import { AccountScreen } from './components/AccountScreen';
import { SupportScreen } from './components/SupportScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { DepositModal } from './components/DepositModal';
import { WithdrawModal } from './components/WithdrawModal';
import { KYCModal } from './components/KYCModal';
import { KYCGateModal } from './components/KYCGateModal';
import { AdminPanel } from './components/AdminPanel';

export default function App() {
  // Global Language state (Default: Khmer 'km' as requested)
  const [language, setLanguage] = useState<Language>('km');

  // Multi-Site Routing: 'invest' (Investor Web) vs 'admin' (Admin Portal Web)
  const [currentSite, setCurrentSite] = useState<'invest' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const search = window.location.search;
      if (
        path.includes('/admin') ||
        hash.includes('/admin') ||
        search.includes('site=admin') ||
        search.includes('portal=admin')
      ) {
        return 'admin';
      }
    }
    return 'invest';
  });

  // User Auth & View state for Investor Website
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Modals for Investor Website
  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [depositInitialAmount, setDepositInitialAmount] = useState<string>('500');
  const [isWithdrawOpen, setIsWithdrawOpen] = useState<boolean>(false);

  // Identity Verification (KYC) Modals & Gating
  const [isKycOpen, setIsKycOpen] = useState<boolean>(false);
  const [isKycGateOpen, setIsKycGateOpen] = useState<boolean>(false);
  const [kycGateIntent, setKycGateIntent] = useState<'deposit' | 'withdraw'>('deposit');

  const handleOpenDeposit = () => {
    if (!currentUser || currentUser.kycStatus !== 'verified') {
      setKycGateIntent('deposit');
      setIsKycGateOpen(true);
      return;
    }
    setIsDepositOpen(true);
  };

  const handleOpenDepositWithAmount = (amount: number) => {
    if (!currentUser || currentUser.kycStatus !== 'verified') {
      setKycGateIntent('deposit');
      setIsKycGateOpen(true);
      return;
    }
    setDepositInitialAmount(amount.toString());
    setIsDepositOpen(true);
  };

  const handleOpenWithdraw = () => {
    if (!currentUser || currentUser.kycStatus !== 'verified') {
      setKycGateIntent('withdraw');
      setIsKycGateOpen(true);
      return;
    }
    setIsWithdrawOpen(true);
  };

  // Crypto coins and market state
  const [coins, setCoins] = useState<CryptoCoin[]>(initialCoins);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCoin>(initialCoins[0]);

  // Sync hash routing and update document title according to active website
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('/admin')) {
        setCurrentSite('admin');
      } else if (hash.includes('/invest') || hash === '' || hash === '#/') {
        setCurrentSite('invest');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update browser document title based on active website
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (currentSite === 'admin') {
        document.title =
          language === 'km'
            ? 'QuantYield Global | ផ្ទាំងគ្រប់គ្រង Admin (Admin Portal)'
            : 'QuantYield Global | Admin Management Portal';
      } else {
        document.title =
          language === 'km'
            ? 'QuantYield VIP | គេហទំព័រវិនិយោគគ្រីបតូ (Investor Web)'
            : 'QuantYield VIP | Crypto Investment & Yield Staking';
      }
    }
  }, [currentSite, language]);

  const switchSite = (site: 'invest' | 'admin') => {
    setCurrentSite(site);
    if (typeof window !== 'undefined') {
      window.location.hash = site === 'admin' ? '#/admin' : '#/invest';
    }
  };

  // Subscribe to store updates for real-time reactivity (across components and cross-tab broadcasts)
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const user = store.getCurrentUser();
      setCurrentUser(user ? { ...user } : null);
    });
    return () => unsubscribe();
  }, []);

  // Real-time crypto price ticker simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          const deltaPct = (Math.random() - 0.49) * 0.4; // +/- 0.2%
          const newPrice = Math.max(0.0001, coin.price * (1 + deltaPct / 100));
          const newChange = coin.change24h + (deltaPct > 0 ? 0.05 : -0.05);

          const updatedCoin = {
            ...coin,
            price: newPrice,
            change24h: Number(newChange.toFixed(2)),
          };

          if (selectedCoin.symbol === coin.symbol) {
            setSelectedCoin(updatedCoin);
          }

          return updatedCoin;
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedCoin.symbol]);

  const handleLoginSuccess = () => {
    setCurrentUser(store.getCurrentUser());
  };

  const handleLogout = () => {
    store.logoutUser();
    setCurrentUser(null);
    setActiveTab('home');
  };

  const refreshUserData = () => {
    const user = store.getCurrentUser();
    if (user) {
      setCurrentUser({ ...user });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans relative">
      {/* RENDER SELECTED WEBSITE: INVESTOR WEB OR ADMIN PORTAL */}
      {currentSite === 'admin' ? (
        /* ============================================================ */
        /* WEBSITE 2: STANDALONE ADMIN MANAGEMENT PORTAL (/admin)       */
        /* ============================================================ */
        <div className="flex-1 w-full">
          <AdminPanel
            language={language}
            onLanguageChange={setLanguage}
            onSwitchToInvestApp={() => switchSite('invest')}
          />
        </div>
      ) : (
        /* ============================================================ */
        /* WEBSITE 1: STANDALONE INVESTOR CRYPTO WEBSITE (/)            */
        /* ============================================================ */
        <div className="flex-1 flex justify-center selection:bg-blue-600 selection:text-white relative">
          {/* Background ambient lighting */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]"></div>
          </div>

          {/* User App Shell */}
          {!currentUser ? (
            /* Screen 1: Login & Self-Registration Screen */
            <LoginModal
              language={language}
              onLanguageChange={setLanguage}
              onLoginSuccess={handleLoginSuccess}
            />
          ) : (
            /* Main Investor App Container */
            <div className="w-full max-w-md min-h-screen bg-[#0c1220] border-x border-slate-800/80 shadow-2xl relative flex flex-col">
              {/* Dynamic Screen View based on activeTab */}
              <div className="flex-1">
                {activeTab === 'home' && (
                  <HomeScreen
                    currentUser={currentUser}
                    coins={coins}
                    language={language}
                    onLanguageChange={setLanguage}
                    onOpenDeposit={handleOpenDeposit}
                    onOpenDepositWithAmount={handleOpenDepositWithAmount}
                    onOpenWithdraw={handleOpenWithdraw}
                    onSelectCoin={(coin) => setSelectedCoin(coin)}
                    onNavigateToTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'market' && (
                  <MarketScreen
                    selectedCoin={selectedCoin}
                    onSelectCoin={setSelectedCoin}
                    allCoins={coins}
                    currentUser={currentUser}
                    language={language}
                  />
                )}

                {activeTab === 'wallet' && (
                  <WalletInvestScreen
                    currentUser={currentUser}
                    language={language}
                    onOpenDeposit={handleOpenDeposit}
                    onOpenWithdraw={handleOpenWithdraw}
                    onRefreshUser={refreshUserData}
                  />
                )}

                {activeTab === 'support' && (
                  <SupportScreen
                    currentUser={currentUser}
                    language={language}
                  />
                )}

                {activeTab === 'account' && (
                  <AccountScreen
                    currentUser={currentUser}
                    language={language}
                    onOpenDeposit={handleOpenDeposit}
                    onOpenWithdraw={handleOpenWithdraw}
                    onOpenKYC={() => setIsKycOpen(true)}
                    onLogout={handleLogout}
                    onOpenSupport={() => setActiveTab('support')}
                  />
                )}
              </div>

              {/* Bottom Navigation */}
              <BottomNav
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
                language={language}
              />

              {/* Deposit Modal */}
              <DepositModal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                currentUser={currentUser}
                language={language}
                initialAmount={depositInitialAmount}
                onSuccess={refreshUserData}
              />

              {/* Withdraw Modal */}
              <WithdrawModal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                currentUser={currentUser}
                language={language}
                onSuccess={refreshUserData}
              />

              {/* KYC Verification Form Modal */}
              <KYCModal
                isOpen={isKycOpen}
                onClose={() => setIsKycOpen(false)}
                currentUser={currentUser}
                language={language}
                onSuccess={refreshUserData}
              />

              {/* KYC Gate Modal before Deposit / Withdraw */}
              <KYCGateModal
                isOpen={isKycGateOpen}
                onClose={() => setIsKycGateOpen(false)}
                currentUser={currentUser}
                language={language}
                intent={kycGateIntent}
                onOpenKYCForm={() => {
                  setIsKycGateOpen(false);
                  setIsKycOpen(true);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
