import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpRight,
  Repeat,
  Award,
  History,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Send,
} from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { User, Transaction } from '../types';
import { store } from '../services/store';

interface Props {
  currentUser: User;
  language: Language;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onLogout: () => void;
  onOpenSupport: () => void;
  onOpenKYC?: () => void;
}

export const AccountScreen: React.FC<Props> = ({
  currentUser,
  language,
  onOpenDeposit,
  onOpenWithdraw,
  onLogout,
  onOpenSupport,
  onOpenKYC,
}) => {
  const t = translations[language];
  const transactions = store.getUserTransactions(currentUser.id);
  const kycStatus = currentUser.kycStatus || 'unverified';

  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTx = transactions.filter((tx) => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  return (
    <div className="pb-28 pt-3 px-3 max-w-md mx-auto space-y-4">
      {/* Profile Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
            {currentUser.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{currentUser.username}</h2>
              <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded-full font-mono">
                VIP {currentUser.vipLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">{currentUser.email || 'Investor Account'}</p>
          </div>
        </div>

        {/* Dynamic KYC Status Badge */}
        <button
          type="button"
          onClick={onOpenKYC}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
            kycStatus === 'verified'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : kycStatus === 'pending'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 animate-pulse'
              : kycStatus === 'rejected'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
              : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={language === 'km' ? 'ចុចដើម្បីផ្ទៀងផ្ទាត់អត្តសញ្ញាណ' : 'Click to verify identity'}
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">
            {kycStatus === 'verified'
              ? (language === 'km' ? 'បានផ្ទៀងផ្ទាត់ ✓' : 'Verified ✓')
              : kycStatus === 'pending'
              ? (language === 'km' ? 'រង់ចាំអនុម័ត ⏳' : 'Pending ⏳')
              : kycStatus === 'rejected'
              ? (language === 'km' ? 'បដិសេធ ✕' : 'Rejected ✕')
              : (language === 'km' ? 'មិនទាន់ផ្ទៀងផ្ទាត់' : 'Unverified')}
          </span>
        </button>
      </div>

      {/* My Assets Card matching Screen 5 (My Assets (USDT) 9682473.00, Deposit(USDT) 1041500) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-5 text-white shadow-xl border border-blue-400/20">
        <div className="text-xs text-blue-200 font-medium mb-1">
          {t.myAssets}
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mb-3">
          {currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/20 text-xs">
          <div>
            <span className="text-[10px] text-blue-200 block">Deposit (USDT)</span>
            <span className="font-bold font-mono text-sm">
              {currentUser.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-blue-200 block">{t.totalProfit}</span>
            <span className="font-bold font-mono text-sm text-emerald-300">
              +{currentUser.totalEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Actions matching Screen 5 */}
      <div className="grid grid-cols-4 gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={onOpenDeposit}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ArrowDownToLine className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-300">{t.quickDeposit}</span>
        </button>

        <button
          onClick={onOpenWithdraw}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-300">{t.quickWithdraw}</span>
        </button>

        <button
          onClick={() => setActiveTab(activeTab === 'history' ? 'overview' : 'history')}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-300">{language === 'km' ? 'ប្រវត្តិ' : 'History'}</span>
        </button>

        <button
          onClick={onOpenSupport}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-semibold text-slate-300">VIP</span>
        </button>
      </div>

      {/* Tab Switcher: Overview vs Transaction Ledger */}
      {activeTab === 'overview' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 shadow-md">
          {/* Message Notification */}
          <div
            onClick={onOpenSupport}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">{t.messageNotice}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Transaction History Menu Item */}
          <div
            onClick={() => setActiveTab('history')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">{t.transactionHistory}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400">{transactions.length} records</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Help Center */}
          <div
            onClick={onOpenSupport}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">{t.helpCenter}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          {/* Telegram 24/7 Customer Service Direct Row */}
          <a
            href={store.getConfig().telegramSupport || 'https://t.me/customerserver1'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center group-hover:scale-105 transition">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {language === 'km' ? 'សេវាកម្មអតិថិជន ២៤/៧ Telegram' : 'Telegram 24/7 Customer Support'}
                </span>
                <span className="text-[10px] text-sky-400 font-mono">
                  {store.getConfig().telegramSupport || 'https://t.me/customerserver1'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-sky-300 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                {language === 'km' ? 'ទាក់ទង' : 'Online'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-300 transition" />
            </div>
          </a>

          {/* KYC Identity Verification (Driver's license, National ID, Passport) */}
          <div
            onClick={onOpenKYC}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {language === 'km' ? 'ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (KYC)' : 'Identity Verification (KYC)'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {language === 'km'
                    ? "ប័ណ្ណបើកបរ, អត្តសញ្ញាណប័ណ្ណ, លិខិតឆ្លងដែន"
                    : "Driver's license, National ID, Passport"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  kycStatus === 'verified'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : kycStatus === 'pending'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                    : kycStatus === 'rejected'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {kycStatus === 'verified'
                  ? (language === 'km' ? 'បានផ្ទៀងផ្ទាត់ ✓' : 'Verified')
                  : kycStatus === 'pending'
                  ? (language === 'km' ? 'រង់ចាំអនុម័ត' : 'Pending')
                  : kycStatus === 'rejected'
                  ? (language === 'km' ? 'បដិសេធ' : 'Rejected')
                  : (language === 'km' ? 'មិនទាន់ផ្ទៀងផ្ទាត់' : 'Verify Now')}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition" />
            </div>
          </div>

          {/* Security & PIN */}
          <div
            onClick={() => alert(language === 'km' ? 'គណនីរបស់អ្នកត្រូវបានការពារដោយសុវត្ថិភាពខ្ពស់ 2FA' : 'Your account is secured with 2FA.')}
            className="p-3.5 flex items-center justify-between hover:bg-slate-800/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-200">{t.securitySettings}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Active</span>
          </div>

          {/* Official QuantYield Global Brand Card */}
          <div className="p-3.5 bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 flex items-center justify-between border-t border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-blue-500/30 shadow-md bg-slate-950 flex-shrink-0">
                <img
                  src="/src/assets/images/quantyield_logo_1791865235637.jpg"
                  alt="QuantYield Global Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">QuantYield Global</span>
                <span className="text-[10px] text-slate-400">Institutional Quant Yield & Staking</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              Official
            </span>
          </div>
        </div>
      ) : (
        /* Transaction History View */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <History className="w-4 h-4 text-blue-400" />
              <span>{t.transactionHistory}</span>
            </h3>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-[11px] text-blue-400 hover:underline"
            >
              {language === 'km' ? 'ថយក្រោយ' : 'Back'}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 text-[10px] overflow-x-auto pb-1 scrollbar-none">
            {['all', 'deposit', 'withdrawal', 'investment_yield'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg transition font-medium capitalize ${
                  filterType === type ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {type === 'all' ? t.all : type.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Transactions List */}
          {filteredTx.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              {language === 'km' ? 'មិនមានប្រវត្តិប្រតិបត្តិការនៅឡើយទេ' : 'No transactions recorded yet.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredTx.map((tx) => {
                const isPositive = tx.type === 'deposit' || tx.type === 'investment_yield' || (tx.type === 'admin_adjustment' && tx.amount > 0);
                return (
                  <div
                    key={tx.id}
                    className="p-2.5 bg-slate-950/70 border border-slate-800/90 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200 capitalize">
                          {tx.type.replace('_', ' ')}
                        </span>
                        {tx.network && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded">
                            {tx.network}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {tx.note && (
                        <div className="text-[9px] text-slate-400 truncate max-w-[180px]">{tx.note}</div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()} USDT
                      </div>
                      <div className="mt-0.5 flex items-center justify-end gap-1">
                        {tx.status === 'approved' && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/20">
                            <CheckCircle className="w-2.5 h-2.5" />
                            {tx.type === 'withdrawal'
                              ? (language === 'km' ? 'បានអនុម័ត (កាត់ប្រាក់រួច)' : 'Approved & Deducted')
                              : (language === 'km' ? 'បានអនុម័ត' : 'Approved')}
                          </span>
                        )}
                        {tx.status === 'pending' && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded font-semibold border border-amber-500/30">
                            <Clock className="w-2.5 h-2.5 animate-spin" />
                            {tx.type === 'withdrawal'
                              ? (language === 'km' ? 'រង់ចាំអនុម័ត (មិនទាន់កាត់)' : 'Pending (Not Deducted)')
                              : (language === 'km' ? 'រង់ចាំពិនិត្យ' : 'Pending')}
                          </span>
                        )}
                        {tx.status === 'rejected' && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-semibold border border-rose-500/20">
                            <XCircle className="w-2.5 h-2.5" />
                            {tx.type === 'withdrawal'
                              ? (language === 'km' ? 'បដិសេធ (មិនកាត់ប្រាក់)' : 'Rejected (Not Deducted)')
                              : (language === 'km' ? 'បានបដិសេធ' : 'Rejected')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Logout Button matching Screen 5 */}
      <button
        onClick={onLogout}
        className="w-full py-3 bg-slate-900 hover:bg-rose-950/40 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-900/60 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
      >
        <LogOut className="w-4 h-4" />
        <span>{t.logout.toUpperCase()}</span>
      </button>
    </div>
  );
};
