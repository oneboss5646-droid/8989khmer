import React, { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Repeat, Award, CheckCircle, TrendingUp, Sparkles, AlertCircle, Clock, DollarSign, X, ShieldCheck, Lock } from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { User, InvestmentPlan, UserInvestment } from '../types';
import { store } from '../services/store';
import { platformFeedRecords } from '../data/mockCrypto';

interface Props {
  currentUser: User;
  language: Language;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onRefreshUser: () => void;
}

export const WalletInvestScreen: React.FC<Props> = ({
  currentUser,
  language,
  onOpenDeposit,
  onOpenWithdraw,
  onRefreshUser,
}) => {
  const t = translations[language];
  const plans = store.getPlans();
  const userInvestments = store.getUserInvestments(currentUser.id);

  // Selected plan tab (7, 14, 30, 60, 90)
  const [selectedPlanDays, setSelectedPlanDays] = useState<number>(7);
  const [stakeModalOpen, setStakeModalOpen] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState<string>('100');
  const [stakeError, setStakeError] = useState<string>('');
  const [stakeSuccess, setStakeSuccess] = useState<string>('');
  const [claimToast, setClaimToast] = useState<string>('');

  const activePlan = plans.find(p => p.days === selectedPlanDays) || plans[0];

  const handleOpenParticipate = () => {
    setStakeAmount(activePlan.minAmount.toString());
    setStakeError('');
    setStakeModalOpen(true);
  };

  const handleConfirmStake = (e: React.FormEvent) => {
    e.preventDefault();
    setStakeError('');

    const amt = parseFloat(stakeAmount);
    if (isNaN(amt) || amt < activePlan.minAmount) {
      setStakeError(`${t.minAmountError} ${activePlan.minAmount} USDT`);
      return;
    }

    if (amt > currentUser.balance) {
      setStakeError(t.insufficientBalance);
      return;
    }

    const res = store.participateInPlan(currentUser.id, activePlan.id, amt);
    if (res.success) {
      setStakeSuccess(t.stakeSuccess);
      onRefreshUser();
      setTimeout(() => {
        setStakeSuccess('');
        setStakeModalOpen(false);
      }, 2000);
    } else {
      setStakeError(res.message || 'Error joining investment');
    }
  };

  const handleClaimYield = (invId: string) => {
    const res = store.claimInvestmentYield(invId);
    if (res.success) {
      setClaimToast(`+${res.earnedAmount.toFixed(2)} USDT ${t.yieldClaimed}`);
      onRefreshUser();
      setTimeout(() => setClaimToast(''), 3000);
    }
  };

  return (
    <div className="pb-28 pt-3 px-3 max-w-md mx-auto space-y-4">
      {/* Toast Notification */}
      {claimToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* Capital Protection Guarantee Card */}
      <div className="p-3 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border border-emerald-500/30 rounded-2xl flex items-center justify-between shadow-md text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-white text-xs block leading-tight">
              {language === 'km' ? 'ធានាដើមទុន 100% ដោយមូលនិធិ $50M SAFU' : '100% Capital Principal Guaranteed'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'km' ? 'ដកប្រាក់ដើម & ការប្រាក់ដោយស្វ័យប្រវត្តគ្មានហានិភ័យ' : 'Zero-risk capital return upon staking contract maturity'}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex-shrink-0">
          INSURED
        </span>
      </div>

      {/* Available Balance Card matching Screen 4 in screenshot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-6 text-white shadow-2xl border border-blue-400/20">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between text-xs text-blue-200 mb-1">
          <span className="font-medium">{t.availableBalance}</span>
          <span className="bg-white/15 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider">
            VIP {currentUser.vipLevel}
          </span>
        </div>

        {/* Large Balance display matching 9682473.00USDT in screenshot */}
        <div className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono my-1">
          {currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          <span className="text-sm font-semibold text-blue-200 ml-1">USDT</span>
        </div>

        {/* Limits matching screenshot */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15 text-[10px] text-blue-100/90 font-mono">
          <div>
            <span className="text-blue-300 block text-[9px] font-sans">{t.dailyLimit}</span>
            <span className="font-bold">2,000,000.00 USDT</span>
          </div>
          <div>
            <span className="text-blue-300 block text-[9px] font-sans">{t.monthlyLimit}</span>
            <span className="font-bold">50,000,000.00 USDT</span>
          </div>
        </div>
      </div>

      {/* 4 Action Buttons matching Screen 4: Deposit, Withdraw, Internal Transfer, Membership Upgrade */}
      <div className="grid grid-cols-4 gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-lg">
        <button
          onClick={onOpenDeposit}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-sm">
            <ArrowDownToLine className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center">{t.quickDeposit}</span>
        </button>

        <button
          onClick={onOpenWithdraw}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-sm">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center">{t.quickWithdraw}</span>
        </button>

        <button
          onClick={() => alert(language === 'km' ? 'មុខងារផ្ទេរផ្ទៃក្នុងកំពុងបើកដំណើរការរវាងគណនី' : 'Internal Transfer available for VIP accounts')}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-sm">
            <Repeat className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center">{t.quickTransfer}</span>
        </button>

        <button
          onClick={() => alert(language === 'km' ? `កម្រិតគណនីបច្ចុប្បន្នរបស់អ្នកគឺ VIP ${currentUser.vipLevel}` : `Current Tier: VIP ${currentUser.vipLevel}`)}
          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-sm">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-semibold text-slate-200 text-center">{t.quickVip}</span>
        </button>
      </div>

      {/* Bitcoin (BTC) High-Yield Investment Card (Funded via USDT) */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* BTC Coin Badge & USDT Currency Indicators */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20">
              ₿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm">Bitcoin (BTC)</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold font-mono">
                  BTC Pool
                </span>
              </div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>{language === 'km' ? 'វិនិយោគកាក់ BTC ដោយប្រើប្រាស់ប្រាក់ USDT' : 'Invest in BTC coin using USDT'}</span>
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full block">
              +{activePlan.dailyRate.toFixed(2)}% Daily
            </span>
            <span className="text-[9px] text-amber-400/90 font-mono">100% Capital SAFU</span>
          </div>
        </div>

        {/* Live BTC Price & Plan Title */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Target Asset:</span>
            <span className="font-bold text-amber-400 font-mono flex items-center gap-1">
              <span>₿ BTC</span>
              <span className="text-[10px] text-slate-400">($81,395.00)</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">Currency:</span>
            <span className="font-bold text-emerald-400 font-mono">USDT</span>
          </div>
        </div>

        {/* Big percentage & Duration display matching Screen 4 */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-3xl font-extrabold text-rose-500 font-mono flex items-baseline gap-1">
              <span>{activePlan.dailyRate.toFixed(2)}%</span>
              <span className="text-xs text-rose-400 font-normal">/ day</span>
            </div>
            <div className="text-[10px] text-slate-400">{t.dailyRate} ({t.btcAssetLabel})</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              {activePlan.days} {t.days}
            </div>
            <div className="text-[10px] text-slate-400">{activePlan.title}</div>
          </div>
        </div>

        {/* Duration Tabs: 7, 14, 30, 60, 90 */}
        <div className="grid grid-cols-5 gap-1.5">
          {plans.map((p) => (
            <button
              key={p.days}
              onClick={() => setSelectedPlanDays(p.days)}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                selectedPlanDays === p.days
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-md shadow-amber-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {p.days}Day
            </button>
          ))}
        </div>

        {/* Min Investment & Participate Now Button */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.minInvestment}:</span>
            <span className="font-bold text-white font-mono">{activePlan.minAmount.toLocaleString()} USDT</span>
          </div>

          <button
            onClick={handleOpenParticipate}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/25 transition transform active:scale-98 flex items-center justify-center gap-2"
          >
            <span className="text-base">₿</span>
            <span>{t.participateNow}</span>
          </button>
        </div>
      </div>

      {/* User Active Staking Orders (if any) */}
      {userInvestments.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>{t.myOrders}</span>
            </h3>
            <span className="text-[10px] text-slate-400">{userInvestments.length} Active</span>
          </div>

          <div className="space-y-2.5">
            {userInvestments.map((inv) => (
              <div
                key={inv.id}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{inv.planTitle}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold">
                    +{inv.dailyRate}% / day
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-400">
                  <div>
                    <span className="text-[9px] block text-slate-500">Staked</span>
                    <span className="font-bold text-white font-mono">{inv.amount.toLocaleString()} USDT</span>
                  </div>
                  <div>
                    <span className="text-[9px] block text-slate-500">{t.daysElapsed}</span>
                    <span className="font-bold text-slate-200">{inv.daysElapsed}/{inv.durationDays} Days</span>
                  </div>
                  <div>
                    <span className="text-[9px] block text-slate-500">{t.accruedProfit}</span>
                    <span className="font-bold text-emerald-400 font-mono">+{inv.totalEarned.toFixed(2)} USDT</span>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => handleClaimYield(inv.id)}
                    className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                  >
                    <DollarSign className="w-3 h-3" />
                    {t.claimYield}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Record Feed matching Screen 4: "Platform Record" */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {t.platformRecord}
          </span>
          <span className="text-[10px] text-slate-500">Live Ticker</span>
        </div>

        <div className="space-y-2">
          {platformFeedRecords.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-xs py-1 px-1 rounded-lg hover:bg-slate-800/40"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-blue-400">
                  {item.action === 'recharge' ? 'D' : item.action === 'withdraw' ? 'W' : 'Y'}
                </div>
                <div>
                  <span className="font-mono text-slate-300 font-semibold">{item.username}</span>
                  <span className="text-[10px] text-slate-500 ml-1.5">
                    {item.action === 'recharge' ? t.recharge : item.action === 'withdraw' ? t.withdrawAction : 'yield bonus'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-emerald-400">
                  {item.amount.toLocaleString()} USDT
                </span>
                <span className="text-[9px] text-slate-500 block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Participate Modal */}
      {stakeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  ₿
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{activePlan.title}</h3>
                  <span className="text-[10px] text-amber-400 font-medium">Bitcoin (BTC) • USDT Funded</span>
                </div>
              </div>
              <button
                onClick={() => setStakeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmStake} className="p-5 space-y-4">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'km' ? 'កាក់វិនិយោគ' : 'Target Asset'}:</span>
                  <span className="font-bold text-amber-400 font-mono">Bitcoin (BTC)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{language === 'km' ? 'រូបិយប័ណ្ណទូទាត់' : 'Payment Currency'}:</span>
                  <span className="font-bold text-emerald-400 font-mono">USDT (Tether)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.duration}:</span>
                  <span className="font-bold text-white">{activePlan.days} {t.days}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.dailyRate}:</span>
                  <span className="font-bold text-emerald-400">+{activePlan.dailyRate.toFixed(2)}% / Day</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{t.availableBalance}:</span>
                  <span className="font-bold text-blue-400 font-mono">{currentUser.balance.toLocaleString()} USDT</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t.stakeAmountPlaceholder}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={activePlan.minAmount}
                    max={currentUser.balance}
                    step="any"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-3 pr-16 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">USDT</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1.5">
                  <span className="font-medium text-emerald-400 font-mono">
                    {t.minInvestment}: {activePlan.minAmount} USDT
                  </span>
                  <span className="text-slate-500 font-mono">
                    {t.availableBalance}: {currentUser.balance.toLocaleString()} USDT
                  </span>
                </div>

                {/* Quick Stake Amount Pills starting from 100 USDT */}
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {[100, 500, 1000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setStakeAmount(amt.toString())}
                      className={`py-1 text-[11px] font-mono rounded-lg border transition ${
                        parseFloat(stakeAmount) === amt
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-bold'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStakeAmount(currentUser.balance.toString())}
                    className="py-1 text-[11px] font-mono font-bold rounded-lg border bg-indigo-600/20 border-indigo-500/50 text-indigo-300 hover:text-white hover:bg-indigo-600/40 transition"
                  >
                    Max
                  </button>
                </div>
              </div>

              {/* Profit preview */}
              {parseFloat(stakeAmount) > 0 && (
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{t.expectedDaily}:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      +{((parseFloat(stakeAmount) * activePlan.dailyRate) / 100).toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>{t.totalExpected}:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      +{(((parseFloat(stakeAmount) * activePlan.dailyRate) / 100) * activePlan.days).toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              )}

              {stakeError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{stakeError}</span>
                </div>
              )}

              {stakeSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{stakeSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition"
              >
                {t.confirm}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
