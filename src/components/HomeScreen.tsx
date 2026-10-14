import React, { useState, useEffect } from 'react';
import {
  ArrowDownToLine,
  ArrowUpRight,
  Repeat,
  Award,
  Zap,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  Lock,
  Sparkles,
  Activity,
  CheckCircle2,
  ExternalLink,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Copy,
  Check,
  X,
  DollarSign
} from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { User, CryptoCoin } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { SecurityModal } from './SecurityModal';

interface Props {
  currentUser: User;
  coins: CryptoCoin[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenDeposit: () => void;
  onOpenDepositWithAmount?: (amount: number) => void;
  onOpenWithdraw: () => void;
  onSelectCoin: (coin: CryptoCoin) => void;
  onNavigateToTab: (tab: 'home' | 'market' | 'wallet' | 'support' | 'account') => void;
}

// Live activity ticker items representing rapid verified platform payouts and withdrawals
const LIVE_TICKER_ITEMS = [
  { type: 'withdraw', amount: 3850, network: 'TRC-20', time: '12s ago', timeKm: '12 វិនាទីមុន', address: 'TK8...7p1', user: 'User ***721', speed: '28s' },
  { type: 'withdraw', amount: 1250, network: 'TRC-20', time: '24s ago', timeKm: '24 វិនាទីមុន', address: 'T9x...4e2', user: 'User ***928', speed: '32s' },
  { type: 'withdraw', amount: 8900, network: 'ERC-20', time: '41s ago', timeKm: '41 វិនាទីមុន', address: '0x3c...d88', user: 'User ***104', speed: '45s' },
  { type: 'yield', amount: 245.50, network: 'Arbitrage', time: '55s ago', timeKm: '55 វិនាទីមុន', address: '0x8b...f1a', user: 'User ***411', speed: 'Instant' },
  { type: 'withdraw', amount: 2450, network: 'TRC-20', time: '1m ago', timeKm: '1 នាទីមុន', address: 'TPq...92z', user: 'User ***658', speed: '21s' },
  { type: 'withdraw', amount: 15400, network: 'TRC-20', time: '1m ago', timeKm: '1 នាទីមុន', address: 'TWv...6x1', user: 'User ***892', speed: '38s' },
  { type: 'withdraw', amount: 6750, network: 'TRC-20', time: '2m ago', timeKm: '2 នាទីមុន', address: 'TXm...3d7', user: 'User ***205', speed: '41s' },
  { type: 'deposit', amount: 5000, network: 'TRC-20', time: '2m ago', timeKm: '2 នាទីមុន', address: '0x7a...9bc', user: 'User ***370', speed: 'Instant' },
  { type: 'withdraw', amount: 920, network: 'BEP-20', time: '3m ago', timeKm: '3 នាទីមុន', address: '0x4f...a12', user: 'User ***516', speed: '19s' },
  { type: 'withdraw', amount: 4100, network: 'ERC-20', time: '3m ago', timeKm: '3 នាទីមុន', address: '0x8b...f1a', user: 'User ***443', speed: '36s' },
];

export interface LiveTxItem {
  id: string;
  type: 'withdraw' | 'deposit' | 'yield';
  user: string;
  vipLevel: number;
  amount: number;
  network: 'TRC-20' | 'ERC-20' | 'BEP-20';
  address: string;
  payoutSpeedSec: number;
  timeLabelKm: string;
  timeLabelEn: string;
  txHash: string;
  isNew?: boolean;
}

// Initial realistic live transaction records prominently featuring successful withdrawals
const INITIAL_LIVE_TRANSACTIONS: LiveTxItem[] = [
  {
    id: 'tx-101',
    type: 'withdraw',
    user: 'User ***721',
    vipLevel: 3,
    amount: 3850,
    network: 'TRC-20',
    address: 'TK8v...7p1a',
    payoutSpeedSec: 28,
    timeLabelKm: '14 វិនាទីមុន',
    timeLabelEn: '14s ago',
    txHash: '0x8f2a64c1b920e8d3571a04bc8d7f',
  },
  {
    id: 'tx-102',
    type: 'withdraw',
    user: 'User ***928',
    vipLevel: 2,
    amount: 1250,
    network: 'TRC-20',
    address: 'T9xM...4e2q',
    payoutSpeedSec: 32,
    timeLabelKm: '28 វិនាទីមុន',
    timeLabelEn: '28s ago',
    txHash: '0x3e1d9a4b2781cf658a90ec1345ab',
  },
  {
    id: 'tx-103',
    type: 'withdraw',
    user: 'User ***104',
    vipLevel: 4,
    amount: 8900,
    network: 'ERC-20',
    address: '0x3c...d88f',
    payoutSpeedSec: 42,
    timeLabelKm: '45 វិនាទីមុន',
    timeLabelEn: '45s ago',
    txHash: '0x7a4c182d3bf9871e05a8d90471ea',
  },
  {
    id: 'tx-104',
    type: 'withdraw',
    user: 'User ***658',
    vipLevel: 1,
    amount: 650,
    network: 'TRC-20',
    address: 'TPqL...92z1',
    payoutSpeedSec: 19,
    timeLabelKm: '1 នាទីមុន',
    timeLabelEn: '1m ago',
    txHash: '0x91eb45f08ca427189da3bc047812',
  },
  {
    id: 'tx-105',
    type: 'withdraw',
    user: 'User ***892',
    vipLevel: 5,
    amount: 15400,
    network: 'TRC-20',
    address: 'TWvK...6x1e',
    payoutSpeedSec: 36,
    timeLabelKm: '1 នាទីមុន',
    timeLabelEn: '1m ago',
    txHash: '0x4d0ae2719a7402685fb9ec813b52',
  },
  {
    id: 'tx-106',
    type: 'deposit',
    user: 'User ***370',
    vipLevel: 3,
    amount: 5000,
    network: 'TRC-20',
    address: '0x7a...9bc8',
    payoutSpeedSec: 12,
    timeLabelKm: '2 នាទីមុន',
    timeLabelEn: '2m ago',
    txHash: '0x6b8299c43ae0982147dbfa03189c',
  },
  {
    id: 'tx-107',
    type: 'withdraw',
    user: 'User ***516',
    vipLevel: 2,
    amount: 2400,
    network: 'BEP-20',
    address: '0x4f...a12b',
    payoutSpeedSec: 24,
    timeLabelKm: '2 នាទីមុន',
    timeLabelEn: '2m ago',
    txHash: '0x1f9488a3b5c702189ae47610dc39',
  },
  {
    id: 'tx-108',
    type: 'withdraw',
    user: 'User ***205',
    vipLevel: 4,
    amount: 6750,
    network: 'TRC-20',
    address: 'TXmZ...3d7p',
    payoutSpeedSec: 39,
    timeLabelKm: '3 នាទីមុន',
    timeLabelEn: '3m ago',
    txHash: '0x5c7131e248ab0957dc16ea9820f1',
  },
  {
    id: 'tx-109',
    type: 'withdraw',
    user: 'User ***443',
    vipLevel: 3,
    amount: 4100,
    network: 'ERC-20',
    address: '0x8b...f1ac',
    payoutSpeedSec: 34,
    timeLabelKm: '3 នាទីមុន',
    timeLabelEn: '3m ago',
    txHash: '0x2e0874b89fca31852d08a5716bc4',
  },
  {
    id: 'tx-110',
    type: 'withdraw',
    user: 'User ***819',
    vipLevel: 2,
    amount: 920,
    network: 'TRC-20',
    address: 'TKqR...11mf',
    payoutSpeedSec: 22,
    timeLabelKm: '4 នាទីមុន',
    timeLabelEn: '4m ago',
    txHash: '0x9a3f12c58e07b4691da74bc28f61',
  },
  {
    id: 'tx-111',
    type: 'withdraw',
    user: 'User ***632',
    vipLevel: 5,
    amount: 22500,
    network: 'ERC-20',
    address: '0x19...fa78',
    payoutSpeedSec: 48,
    timeLabelKm: '4 នាទីមុន',
    timeLabelEn: '4m ago',
    txHash: '0x0cb4819df5a7123985ec019273ba',
  },
  {
    id: 'tx-112',
    type: 'yield',
    user: 'User ***318',
    vipLevel: 3,
    amount: 340.50,
    network: 'TRC-20',
    address: 'TRa...77xz',
    payoutSpeedSec: 5,
    timeLabelKm: '5 នាទីមុន',
    timeLabelEn: '5m ago',
    txHash: '0x88ea3019bc245671ef09a84210bc',
  },
];

// Pool of dynamic new withdrawals to stream in every 3.8 seconds
const DYNAMIC_WITHDRAWAL_POOL = [
  { user: 'User ***382', vip: 3, amount: 2850, network: 'TRC-20' as const, address: 'TW8...3m1', speed: 29 },
  { user: 'User ***591', vip: 2, amount: 1450, network: 'TRC-20' as const, address: 'TLq...9x2', speed: 33 },
  { user: 'User ***744', vip: 4, amount: 7200, network: 'ERC-20' as const, address: '0x9b...17c', speed: 41 },
  { user: 'User ***812', vip: 1, amount: 820, network: 'TRC-20' as const, address: 'TKa...4p8', speed: 22 },
  { user: 'User ***269', vip: 5, amount: 18500, network: 'TRC-20' as const, address: 'TNv...8q4', speed: 37 },
  { user: 'User ***603', vip: 3, amount: 4600, network: 'TRC-20' as const, address: 'TRx...5b2', speed: 30 },
  { user: 'User ***945', vip: 2, amount: 1100, network: 'BEP-20' as const, address: '0x44...9d1', speed: 25 },
  { user: 'User ***128', vip: 4, amount: 9400, network: 'ERC-20' as const, address: '0x2a...88e', speed: 44 },
  { user: 'User ***470', vip: 3, amount: 3300, network: 'TRC-20' as const, address: 'TPm...1v9', speed: 27 },
  { user: 'User ***856', vip: 2, amount: 1950, network: 'TRC-20' as const, address: 'TKk...6a3', speed: 31 },
];

export const HomeScreen: React.FC<Props> = ({
  currentUser,
  coins,
  language,
  onLanguageChange,
  onOpenDeposit,
  onOpenDepositWithAmount,
  onOpenWithdraw,
  onSelectCoin,
  onNavigateToTab,
}) => {
  const t = translations[language];

  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);
  const [calcAmount, setCalcAmount] = useState<number>(500);
  const [liveTickerIndex, setLiveTickerIndex] = useState<number>(0);

  // Live transaction feed state
  const [txFeedTab, setTxFeedTab] = useState<'withdraw' | 'all' | 'deposit'>('withdraw');
  const [liveTransactions, setLiveTransactions] = useState<LiveTxItem[]>(INITIAL_LIVE_TRANSACTIONS);
  const [payoutVolume24h, setPayoutVolume24h] = useState<number>(4892340);
  const [totalWithdrawalsCount, setTotalWithdrawalsCount] = useState<number>(3418);
  const [selectedTxForProof, setSelectedTxForProof] = useState<LiveTxItem | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  // Rotate live activity top ribbon smoothly every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTickerIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Dynamically stream in realistic new withdrawals every 4 seconds to show high user payout activity
  useEffect(() => {
    let poolIndex = 0;
    const streamTimer = setInterval(() => {
      const nextItem = DYNAMIC_WITHDRAWAL_POOL[poolIndex % DYNAMIC_WITHDRAWAL_POOL.length];
      poolIndex++;

      const newTx: LiveTxItem = {
        id: `tx-stream-${Date.now()}-${poolIndex}`,
        type: 'withdraw',
        user: nextItem.user,
        vipLevel: nextItem.vip,
        amount: nextItem.amount,
        network: nextItem.network,
        address: nextItem.address,
        payoutSpeedSec: nextItem.speed,
        timeLabelKm: 'ទើបតែដកប្រាក់',
        timeLabelEn: 'Just now',
        txHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
        isNew: true,
      };

      setLiveTransactions((prev) => [newTx, ...prev.slice(0, 15)]);
      setPayoutVolume24h((prev) => prev + nextItem.amount);
      setTotalWithdrawalsCount((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(streamTimer);
  }, []);

  const currentTicker = LIVE_TICKER_ITEMS[liveTickerIndex];

  // Profit calculation logic (average 1.5% to 3.0% daily)
  const dailyProfit = (calcAmount * 0.015).toFixed(2);
  const weeklyProfit = (calcAmount * 0.015 * 7).toFixed(2);
  const monthlyProfit = (calcAmount * 0.015 * 30).toFixed(2);

  const handleDepositSelectedAmount = () => {
    if (onOpenDepositWithAmount) {
      onOpenDepositWithAmount(calcAmount);
    } else {
      onOpenDeposit();
    }
  };

  const filteredTransactions = liveTransactions.filter((tx) => {
    if (txFeedTab === 'withdraw') return tx.type === 'withdraw';
    if (txFeedTab === 'deposit') return tx.type === 'deposit';
    return true;
  });

  const handleCopyTxHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="pb-24 pt-2.5 px-3.5 max-w-md mx-auto space-y-3.5">
      {/* Top Institutional Trust & Verification Ribbon */}
      <div
        onClick={() => setIsSecurityModalOpen(true)}
        className="w-full py-1.5 px-3 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-blue-950/80 border border-emerald-500/30 rounded-xl flex items-center justify-between text-[10px] text-emerald-300 shadow-md cursor-pointer hover:border-emerald-400 transition group"
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold tracking-tight text-white flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-400 inline" />
            <span>256-Bit SSL</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 font-semibold font-mono">PoR: 104.5% Backed</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full font-bold group-hover:bg-emerald-500/25 transition">
          <ShieldCheck className="w-3 h-3" />
          <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់សុវត្ថិភាព' : 'Verify Security'}</span>
        </div>
      </div>

      {/* Top Bar with Brand Logo and User Profile */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-blue-500/40 shadow-lg shadow-blue-500/25 bg-slate-950 flex-shrink-0">
            <img
              src="/src/assets/images/quantyield_logo_1791865235637.jpg"
              alt="QuantYield Global Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>QuantYield Global</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono font-bold">
                VIP {currentUser.vipLevel}
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span>{currentUser.username}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${currentUser.kycStatus === 'verified' ? 'bg-emerald-400' : currentUser.kycStatus === 'pending' ? 'bg-amber-400 animate-ping' : 'bg-slate-400'}`}></span>
              <span className={`text-[9px] font-semibold ${currentUser.kycStatus === 'verified' ? 'text-emerald-400' : currentUser.kycStatus === 'pending' ? 'text-amber-400' : 'text-slate-400'}`}>
                {currentUser.kycStatus === 'verified'
                  ? (language === 'km' ? 'បានផ្ទៀងផ្ទាត់ ✓' : 'Verified Investor ✓')
                  : currentUser.kycStatus === 'pending'
                  ? (language === 'km' ? 'រង់ចាំអនុម័ត ⏳' : 'KYC Pending Review ⏳')
                  : (language === 'km' ? 'មិនទាន់ផ្ទៀងផ្ទាត់' : 'Unverified Investor')}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
        </div>
      </div>

      {/* KYC Alert Banner if not verified */}
      {currentUser.kycStatus !== 'verified' && (
        <div
          onClick={onOpenDeposit}
          className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:border-amber-400/50 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (KYC)' : 'Identity Verification Required'}</span>
                <span className="text-[9px] bg-amber-500/30 text-amber-300 font-bold px-1.5 py-0.2 rounded font-mono">
                  {currentUser.kycStatus === 'pending' ? 'Pending ⏳' : 'Required'}
                </span>
              </div>
              <p className="text-[10px] text-slate-300">
                {language === 'km'
                  ? "ប័ណ្ណបើកបរ, អត្តសញ្ញាណប័ណ្ណ, លិខិតឆ្លងដែន មុនពេលដាក់ និងដកប្រាក់"
                  : "Driver's License, National ID, or Passport required"}
              </p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow-sm flex items-center gap-1 group-hover:scale-105 transition flex-shrink-0">
            <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់' : 'Verify'}</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Live On-Chain Activity Ribbon: Fast Instant Withdrawals Highlighted */}
      <div className="p-2 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between text-xs shadow-inner">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
            {currentTicker.type === 'deposit' ? (
              <ArrowDownToLine className="w-3.5 h-3.5" />
            ) : currentTicker.type === 'yield' ? (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <div className="truncate">
            <span className="text-[11px] font-bold text-white mr-1.5">
              {currentTicker.type === 'deposit'
                ? (language === 'km' ? 'បានដាក់ប្រាក់:' : 'Deposit:')
                : currentTicker.type === 'yield'
                ? (language === 'km' ? 'បានចែកការប្រាក់:' : 'Yield Paid:')
                : (language === 'km' ? 'បានដកប្រាក់ជោគជ័យ:' : 'Withdrawal Completed:')}
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400">
              +{currentTicker.amount.toLocaleString()} USDT
            </span>
            <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
              ({currentTicker.user} • {currentTicker.network})
            </span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-2">
          {language === 'km' ? currentTicker.timeKm : currentTicker.time}
        </span>
      </div>

      {/* High-Conversion Institutional Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-900 to-slate-950 p-5 text-white shadow-2xl shadow-blue-900/40 border border-blue-400/30">
        <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Guarantee Pill */}
        <div className="relative z-10 flex items-center justify-between mb-2.5">
          <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-400/30 text-[10px] font-bold text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'km' ? 'ធានាដើមទុន 100% ដោយមូលនិធិ $50M SAFU' : '100% Principal Protected by $50M SAFU'}</span>
          </div>

          <div className="flex items-center gap-1 bg-amber-400/20 border border-amber-400/30 px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-300">
            <Zap className="w-3 h-3 fill-current" />
            <span>1.0% - 3.0%/day</span>
          </div>
        </div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              ₿
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
              BTC Coin • USDT Currency
            </span>
          </div>
          <h2 className="text-lg font-black tracking-tight leading-snug text-white">
            {language === 'km'
              ? 'វិនិយោគលើកាក់ BTC ដោយប្រើប្រាស់ប្រាក់ USDT'
              : 'Invest in Bitcoin (BTC) Coin Using USDT Funds'}
          </h2>
          <p className="text-[11px] text-blue-100/90 leading-relaxed">
            {language === 'km'
              ? 'វិនិយោគលើកាក់ Bitcoin (BTC) តាមរយៈលុយ USDT • ទទួលបានការប្រាក់ 1.0% - 3.0% ប្រចាំថ្ងៃ • ធានាដើមទុន 100%'
              : 'Institutional Bitcoin (BTC) Cloud Mining & Hashrate Yield • Daily returns paid in USDT • 100% Capital SAFU'}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={onOpenDeposit}
              className="flex-1 py-2.5 px-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'km' ? 'ដាក់ប្រាក់វិនីយោគភ្លាមៗ' : 'Deposit & Start Earning'}</span>
            </button>
            <button
              onClick={() => setIsSecurityModalOpen(true)}
              className="py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center justify-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span>{language === 'km' ? 'របាយការណ៍សុវត្ថិភាព' : 'Security Proof'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Capital Safety */}
      <div className="grid grid-cols-3 gap-2">
        <div
          onClick={() => setIsSecurityModalOpen(true)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer text-center space-y-1 shadow-sm"
        >
          <div className="w-7 h-7 mx-auto rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-[11px] block leading-tight">
            {language === 'km' ? 'ឃ្លាំងត្រជាក់ Multi-Sig' : 'Cold Vaults'}
          </span>
          <span className="text-[9px] text-slate-400 block">Fireblocks 98%</span>
        </div>

        <div
          onClick={() => setIsSecurityModalOpen(true)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer text-center space-y-1 shadow-sm"
        >
          <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-[11px] block leading-tight">
            {language === 'km' ? 'ទុនការពារ $50M' : '$50M SAFU'}
          </span>
          <span className="text-[9px] text-emerald-400 block font-semibold">1:1 Backed</span>
        </div>

        <div
          onClick={() => onNavigateToTab('support')}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition cursor-pointer text-center space-y-1 shadow-sm"
        >
          <div className="w-7 h-7 mx-auto rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-[11px] block leading-tight">
            {language === 'km' ? 'កម្រៃសេវា 0%' : '0% Gas Fee'}
          </span>
          <span className="text-[9px] text-slate-400 block">Instant Credit</span>
        </div>
      </div>

      {/* Interactive Live Profit Calculator & Deposit Motivation Widget */}
      <div className="p-4 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/70 border border-blue-500/30 rounded-2xl shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-xs">
                {language === 'km' ? 'គណនាប្រាក់ចំណេញអកម្មប្រចាំថ្ងៃពីកាក់ BTC (ទូទាត់ជា USDT)' : 'Calculate Daily BTC Yield (Funded in USDT)'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'km' ? 'ជ្រើសរើសចំនួនប្រាក់ USDT ដើម្បីមើលការប្រាក់កាក់ BTC រំពឹងទុក' : 'Select USDT deposit amount to preview Bitcoin (BTC) returns'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            ~1.5%/day
          </span>
        </div>

        {/* Amount Selector Pills */}
        <div className="grid grid-cols-5 gap-1.5">
          {[100, 500, 1000, 5000, 10000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setCalcAmount(amt)}
              className={`py-1.5 text-xs font-mono font-bold rounded-xl border transition ${
                calcAmount === amt
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-600/30 font-black'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        {/* Dynamic Returns Output Cards */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">
              {language === 'km' ? 'ចំណូលប្រចាំថ្ងៃ' : 'Daily Profit'}
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-400">
              +${dailyProfit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">
              {language === 'km' ? 'ចំណូល 7 ថ្ងៃ' : '7-Day Profit'}
            </span>
            <span className="text-xs sm:text-sm font-black text-white">
              +${weeklyProfit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-sans">
              {language === 'km' ? 'ចំណូល 30 ថ្ងៃ' : '30-Day Total'}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              +${monthlyProfit}
            </span>
          </div>
        </div>

        {/* Direct Action Deposit Button */}
        <button
          onClick={handleDepositSelectedAmount}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition transform active:scale-98 flex items-center justify-center gap-2"
        >
          <ArrowDownToLine className="w-4 h-4 stroke-[2.5]" />
          <span>
            {language === 'km'
              ? `ដាក់ប្រាក់ ${calcAmount.toLocaleString()} USDT ដើម្បីចាប់ផ្តើមចំណេញ`
              : `Deposit ${calcAmount.toLocaleString()} USDT & Start Earning`}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Action Navigation Grid (Deposit, Withdraw, Transfer, VIP Upgrade) */}
      <div className="grid grid-cols-4 gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <button
          onClick={onOpenDeposit}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition shadow-sm">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight">
            {t.quickDeposit}
          </span>
        </button>

        <button
          onClick={onOpenWithdraw}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition shadow-sm">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight">
            {t.quickWithdraw}
          </span>
        </button>

        <button
          onClick={() => onNavigateToTab('wallet')}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-105 transition shadow-sm">
            <Repeat className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight">
            {t.quickTransfer}
          </span>
        </button>

        <button
          onClick={() => onNavigateToTab('account')}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800/80 transition group"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center leading-tight">
            {t.quickVip}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* កំណត់ត្រាប្រតិបត្តិការផ្ទាល់លើប្រព័ន្ធ (Live System Transaction Records / Payout Stream) */}
      {/* High-Impact Social Proof displaying frequent, high-volume successful withdrawals */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-3">
        {/* Section Header with Live Streaming Pulse */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-xs tracking-tight">
                  {language === 'km' ? 'កំណត់ត្រាប្រតិបត្តិការផ្ទាល់លើប្រព័ន្ធ' : 'Live System Transaction Records'}
                </h3>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-extrabold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{language === 'km' ? 'ផ្ទាល់' : 'LIVE'}</span>
                </span>
              </div>
              <p className="text-[9px] text-slate-400">
                {language === 'km'
                  ? 'ការដកប្រាក់ចេញ និងការទូទាត់ចំណេញដោយស្វ័យប្រវត្ត 24/7'
                  : 'Automated 24/7 liquidity releases & instant investor payouts'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSecurityModalOpen(true)}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
          >
            <span>{language === 'km' ? 'សវនកម្ម PoR' : 'PoR Audit'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 24-Hour Payout Statistics Bar */}
        <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/90 text-center font-mono">
          <div>
            <span className="text-[9px] text-slate-400 block font-sans">
              {language === 'km' ? 'ទំហំដកប្រាក់ 24h សរុប' : '24h Payout Volume'}
            </span>
            <span className="text-xs font-black text-emerald-400">
              ${payoutVolume24h.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-sans">
              {language === 'km' ? 'ប្រតិបត្តិការដកជោគជ័យ' : 'Withdrawal Count'}
            </span>
            <span className="text-xs font-black text-white">
              {totalWithdrawalsCount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block font-sans">
              {language === 'km' ? 'ល្បឿនទូទាត់ជាមធ្យម' : 'Avg Payout Speed'}
            </span>
            <span className="text-xs font-black text-sky-400">
              ~32s <span className="text-[9px] font-sans text-emerald-400 font-semibold">Auto</span>
            </span>
          </div>
        </div>

        {/* Filter Tabs: Withdrawals (Active Default to show people withdrawing money!) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800/60">
          <button
            onClick={() => setTxFeedTab('withdraw')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              txFeedTab === 'withdraw'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'km' ? 'ការដកប្រាក់ផ្ទាល់ (Withdrawals)' : 'Live Withdrawals'}</span>
          </button>

          <button
            onClick={() => setTxFeedTab('all')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              txFeedTab === 'all'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'km' ? 'ទាំងអស់ (All)' : 'All Activity'}</span>
          </button>

          <button
            onClick={() => setTxFeedTab('deposit')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 ${
              txFeedTab === 'deposit'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'km' ? 'ការដាក់ប្រាក់ (Deposits)' : 'Deposits'}</span>
          </button>
        </div>

        {/* Live Transaction Stream List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5 scrollbar-thin scrollbar-thumb-slate-800">
          {filteredTransactions.slice(0, 8).map((tx) => {
            const isWithdraw = tx.type === 'withdraw';
            const isDeposit = tx.type === 'deposit';

            return (
              <div
                key={tx.id}
                onClick={() => setSelectedTxForProof(tx)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  tx.isNew
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                {/* Left: User & Type Info */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isWithdraw
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : isDeposit
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isWithdraw ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : isDeposit ? (
                      <ArrowDownToLine className="w-4 h-4" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white font-mono">
                        {tx.user}
                      </span>
                      <span className="text-[9px] bg-slate-800 text-amber-300 font-bold px-1.5 py-0.2 rounded font-mono border border-slate-700">
                        VIP {tx.vipLevel}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {tx.network}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="text-emerald-400 font-medium">
                        {isWithdraw
                          ? (language === 'km' ? `ដកប្រាក់ជោគជ័យ (${tx.payoutSpeedSec}វិនាទី)` : `Paid in ${tx.payoutSpeedSec}s`)
                          : isDeposit
                          ? (language === 'km' ? 'បានបញ្ចូលជោគជ័យ' : 'Credited')
                          : (language === 'km' ? 'បានចែកការប្រាក់' : 'Distributed')}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 font-mono text-[9px]">
                        {language === 'km' ? tx.timeLabelKm : tx.timeLabelEn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & TxHash Badge */}
                <div className="text-right flex flex-col items-end">
                  <div
                    className={`font-mono font-extrabold text-xs sm:text-sm ${
                      isWithdraw
                        ? 'text-emerald-400'
                        : isDeposit
                        ? 'text-blue-400'
                        : 'text-amber-400'
                    }`}
                  >
                    +{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-[10px] ml-0.5 font-sans font-semibold">USDT</span>
                  </div>

                  <span className="inline-flex items-center gap-0.5 text-[9px] text-blue-400 font-mono hover:underline mt-0.5">
                    <span>{tx.address}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Immediate Liquidity Reassurance & CTAs */}
        <div className="p-2.5 bg-gradient-to-r from-emerald-950/50 via-slate-950 to-blue-950/40 rounded-xl border border-emerald-500/25 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              {language === 'km'
                ? 'ធានាសាច់ប្រាក់ 100%៖ អ្នកវិនិយោគទាំងអស់អាចដកប្រាក់ចំណេញ និងដើមទុនបានគ្រប់ពេលវេលា ដោយគ្មានការពន្យារពេលឡើយ។'
                : '100% Guaranteed Liquidity: Withdraw your principal capital and daily returns anytime without restrictions.'}
            </span>
          </div>

          <div className="flex items-center gap-2 pt-0.5">
            <button
              onClick={onOpenWithdraw}
              className="flex-1 py-1.5 px-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 font-bold text-[11px] rounded-lg transition flex items-center justify-center gap-1"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-300" />
              <span>{language === 'km' ? 'សាកល្បងដកប្រាក់' : 'Withdraw Funds'}</span>
            </button>
            <button
              onClick={onOpenDeposit}
              className="flex-1 py-1.5 px-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] rounded-lg shadow-sm transition flex items-center justify-center gap-1"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ដាក់ប្រាក់ដើម្បីទទួលបានផល' : 'Deposit & Earn'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Security Partners & Audit Badges */}
      <div
        onClick={() => setIsSecurityModalOpen(true)}
        className="p-3 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 cursor-pointer hover:border-blue-500/40 transition shadow-lg"
      >
        <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
          <span className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'km' ? 'ដៃគូសុវត្ថិភាព & វិញ្ញាបនបត្រស្ថាប័ន' : 'Security Architecture & Audits'}</span>
          </span>
          <span className="text-[10px] text-blue-400 flex items-center gap-0.5">
            <span>{language === 'km' ? 'ព័ត៌មានលម្អិត' : 'View Audit'}</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono">
          <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] font-bold text-slate-300 block">Fireblocks</span>
            <span className="text-[8px] text-emerald-400 font-sans">Multi-Sig</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] font-bold text-slate-300 block">CertiK</span>
            <span className="text-[8px] text-emerald-400 font-sans">Audited</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] font-bold text-slate-300 block">FinCEN</span>
            <span className="text-[8px] text-blue-400 font-sans">MSB Standard</span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80">
            <span className="text-[9px] font-bold text-slate-300 block">ISO 27001</span>
            <span className="text-[8px] text-emerald-400 font-sans">Certified</span>
          </div>
        </div>
      </div>

      {/* Mini Ticker Carousel matching Screen 2 row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {coins.slice(0, 4).map((coin) => {
          const isUp = coin.change24h >= 0;
          return (
            <div
              key={coin.symbol}
              onClick={() => {
                onSelectCoin(coin);
                onNavigateToTab('market');
              }}
              className="flex-shrink-0 min-w-[105px] p-2.5 bg-slate-900 border border-slate-800/90 rounded-xl hover:border-blue-500/50 transition cursor-pointer"
            >
              <div className="text-[10px] text-slate-400 font-medium">{coin.pair}</div>
              <div className="text-xs font-bold text-white mt-0.5">
                ${coin.price > 10 ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : coin.price.toFixed(4)}
              </div>
              <div className={`text-[10px] font-bold mt-0.5 flex items-center gap-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                <span>{isUp ? '+' : ''}{coin.change24h.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hot Currencies List matching Screen 2 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {t.currency}
          </span>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>{t.latestPrice}</span>
            <span className="w-16 text-right">{t.change24h}</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          {coins.map((coin) => {
            const isUp = coin.change24h >= 0;
            return (
              <div
                key={coin.symbol}
                onClick={() => {
                  onSelectCoin(coin);
                  onNavigateToTab('market');
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-800/50 px-1 rounded-xl transition cursor-pointer"
              >
                {/* Left: Coin Icon and Name */}
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full ${coin.iconBg} text-white font-black text-xs flex items-center justify-center shadow-md`}>
                    {coin.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1">
                      <span>{coin.symbol}</span>
                      <span className="text-[10px] text-slate-400 font-normal">/USDT</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{coin.name}</div>
                  </div>
                </div>

                {/* Right: Price and Change Pill */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-100 font-mono">
                      {coin.price > 10
                        ? coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : coin.price.toFixed(5)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      ≈ ${(coin.price * 1).toFixed(2)}
                    </div>
                  </div>

                  <div
                    className={`w-16 py-1 px-1.5 rounded-lg text-center text-[11px] font-bold font-mono shadow-sm ${
                      isUp
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {isUp ? '+' : ''}{coin.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Staking Callout */}
      <div
        onClick={() => onNavigateToTab('wallet')}
        className="p-3.5 bg-gradient-to-r from-slate-900 to-blue-950/80 border border-blue-500/30 rounded-2xl flex items-center justify-between cursor-pointer hover:border-blue-400 transition shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{language === 'km' ? 'កញ្ចប់សន្សំប្រាក់ USDT' : 'USDT Fixed Term Yield'}</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">1.0% - 3.0%/day</span>
            </div>
            <div className="text-[10px] text-slate-400">
              {language === 'km' ? 'ទទួលបានប្រាក់ចំណេញរាល់ថ្ងៃ ដកប្រាក់បានយ៉ាងងាយ' : 'Earn guaranteed daily passive returns'}
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* On-Chain Transaction Verification Modal */}
      {selectedTxForProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'km' ? 'វិញ្ញាបនបត្រប្រតិបត្តិការ On-Chain' : 'On-Chain Payout Verification'}
                  </h4>
                  <p className="text-[10px] text-emerald-400 font-medium">
                    {language === 'km' ? 'ទូទាត់ជោគជ័យ 100% លើ Blockchain' : '100% Confirmed & Settled'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTxForProof(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transaction Details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono">
                <span className="text-[10px] text-slate-400 font-sans block">
                  {language === 'km' ? 'ចំនួនទឹកប្រាក់ដែលបានដក' : 'Withdrawal Amount'}
                </span>
                <span className="text-xl font-black text-emerald-400">
                  +{selectedTxForProof.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT
                </span>
                <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-slate-400 font-sans">
                  <span>{selectedTxForProof.network}</span>
                  <span>•</span>
                  <span>{selectedTxForProof.user} (VIP {selectedTxForProof.vipLevel})</span>
                </div>
              </div>

              <div className="space-y-1.5 p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-sans">{language === 'km' ? 'ស្ថានភាពប្រតិបត្តិការ' : 'Status'}:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'km' ? 'បានផ្ទេរជោគជ័យ' : 'Success (Confirmed)'}</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-sans">{language === 'km' ? 'ល្បឿនទូទាត់' : 'Processing Speed'}:</span>
                  <span className="text-white font-bold">{selectedTxForProof.payoutSpeedSec} seconds (Instant)</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-sans">{language === 'km' ? 'ប្លុកផ្ទៀងផ្ទាត់' : 'Block Confirmations'}:</span>
                  <span className="text-sky-400 font-bold">20/20 Confirmations</span>
                </div>

                <div className="flex justify-between items-center text-slate-400">
                  <span className="font-sans">{language === 'km' ? 'កម្រៃសេវា Network' : 'Network Fee'}:</span>
                  <span className="text-emerald-400 font-bold">0.00 USDT (QuantYield Sponsored)</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="font-sans text-[10px] text-slate-400 block">Transaction Hash (TxID):</span>
                  <div className="flex items-center justify-between p-1.5 bg-slate-900 rounded-lg text-[10px] text-slate-300">
                    <span className="truncate mr-2 font-mono text-blue-300">{selectedTxForProof.txHash}</span>
                    <button
                      onClick={() => handleCopyTxHash(selectedTxForProof.txHash)}
                      className="p-1 hover:text-white text-slate-400 transition"
                      title="Copy Hash"
                    >
                      {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setSelectedTxForProof(null);
                  onOpenWithdraw();
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                {language === 'km' ? 'ដកប្រាក់ផ្ទាល់ខ្លួន' : 'Withdraw Now'}
              </button>
              <button
                onClick={() => setSelectedTxForProof(null)}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                {language === 'km' ? 'បិទ' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Institutional Security & Proof Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        language={language}
      />
    </div>
  );
};
