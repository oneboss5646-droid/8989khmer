import React, { useState } from 'react';
import { X, ArrowUpRight, AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { store } from '../services/store';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  language: Language;
  onSuccess?: () => void;
}

export const WithdrawModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onSuccess,
}) => {
  const t = translations[language];
  const config = store.getConfig();

  const [network, setNetwork] = useState<'TRC-20' | 'ERC-20'>('TRC-20');
  const [address, setAddress] = useState<string>(currentUser.walletAddressTRC20 || '');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const fee = config.withdrawFeeUSDT;
  const actualReceived = Math.max(0, numAmount - fee);

  const handleMax = () => {
    setAmount(currentUser.balance.toFixed(2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim() || address.trim().length < 15) {
      setError(language === 'km' ? 'សូមបញ្ចូលអាសយដ្ឋានកាបូប USDT អោយបានត្រឹមត្រូវ' : 'Please provide a valid USDT destination address.');
      return;
    }

    if (numAmount < config.minWithdrawUSDT) {
      setError(`${t.minAmountError} ${config.minWithdrawUSDT} USDT`);
      return;
    }

    if (numAmount > currentUser.balance) {
      setError(t.insufficientBalance);
      return;
    }

    const res = store.submitWithdrawal(currentUser.id, numAmount, network, address.trim());
    if (res.success) {
      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setAmount('');
        onClose();
      }, 2500);
    } else {
      setError(res.message || 'Error submitting withdrawal');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.withdrawTitle}</h3>
              <p className="text-xs text-slate-400">USDT (TRC-20 / ERC-20)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">{t.withdrawSubmitted}</h4>
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left text-xs text-amber-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-200">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{language === 'km' ? 'ព័ត៌មានអំពីការកាត់ប្រាក់៖' : 'Account Deduction Notice:'}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {language === 'km'
                  ? 'សំណើដកប្រាក់របស់អ្នកត្រូវបានបញ្ជូនទៅ Admin Panel។ ទាល់តែមានការអនុម័តពី Admin Panel ជាមុនសិន ទើបអាចកាត់ចេញពីគណនីក្នុង website វិនីយោគបាន!'
                  : 'Your withdrawal request has been submitted to Admin Panel. Funds will only be deducted from your investment account once approved by Admin!'}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Balance Status Card */}
            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">{t.availableBalance}</span>
                <span className="text-lg font-extrabold text-emerald-400">
                  {currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">VIP Level</span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  VIP {currentUser.vipLevel}
                </span>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                {t.selectNetwork}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNetwork('TRC-20');
                    if (currentUser.walletAddressTRC20) setAddress(currentUser.walletAddressTRC20);
                  }}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition ${
                    network === 'TRC-20'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  TRC-20 (Tron)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNetwork('ERC-20');
                    if (currentUser.walletAddressERC20) setAddress(currentUser.walletAddressERC20);
                  }}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition ${
                    network === 'ERC-20'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  ERC-20 (Ethereum)
                </button>
              </div>
            </div>

            {/* Target Wallet Address */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t.withdrawAddress} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t.withdrawAddressPlaceholder}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 px-3 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-slate-400">{t.withdrawAmount}</label>
                <span className="text-[11px] text-slate-500">Min: {config.minWithdrawUSDT} USDT</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={config.minWithdrawUSDT}
                  max={currentUser.balance}
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2.5 pl-3 pr-20 text-white text-sm focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  required
                />
                <button
                  type="button"
                  onClick={handleMax}
                  className="absolute right-2 top-2 px-2.5 py-1 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded border border-blue-500/20"
                >
                  {t.maxAvailable}
                </button>
              </div>
            </div>

            {/* Fee and Actual Output */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{t.networkFee}:</span>
                <span className="text-slate-200">{fee.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-slate-800/80 pt-1.5 text-slate-300">
                <span>{t.actualReceived}:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  {actualReceived > 0 ? actualReceived.toFixed(2) : '0.00'} USDT
                </span>
              </div>
            </div>

            {/* Requirement Notice: Deduction only happens after Admin Panel approval */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold block text-amber-200">
                  {language === 'km' ? 'លក្ខខណ្ឌកាត់ប្រាក់៖' : 'Deduction Rule:'}
                </span>
                <span className="text-[11px] text-slate-300">
                  {language === 'km'
                    ? 'ទាល់មានការ អនុម័តពី admin panel ជាមុនសិនទើបអាចកាត់ចេញពីគណនីក្នុង website វិនីយោគបាន។ សមតុល្យរបស់អ្នកមិនទាន់កាត់ភ្លាមៗទេ។'
                    : 'Requires approval from the Admin Panel first before funds are deducted from your account. Your balance will remain safe until approved.'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={currentUser.balance < config.minWithdrawUSDT}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              {t.submit}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
