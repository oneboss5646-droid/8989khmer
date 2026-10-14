import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Copy, CheckCircle, ShieldCheck, AlertCircle, ArrowDownToLine, ExternalLink, Sparkles, Lock } from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { store } from '../services/store';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  language: Language;
  initialAmount?: string;
  onSuccess?: () => void;
}

export const DepositModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  initialAmount,
  onSuccess,
}) => {
  const t = translations[language];
  const config = store.getConfig();

  const [network, setNetwork] = useState<'TRC-20' | 'ERC-20'>('TRC-20');
  const [amount, setAmount] = useState<string>(initialAmount || '500');
  const [txHash, setTxHash] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  React.useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount);
    }
  }, [initialAmount, isOpen]);

  if (!isOpen) return null;

  const currentAddress = network === 'TRC-20' ? config.trc20Address : config.erc20Address;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < config.minDepositUSDT) {
      setError(`${t.minDepositNotice} ${config.minDepositUSDT} USDT`);
      return;
    }

    if (!txHash.trim() || txHash.trim().length < 8) {
      setError(language === 'km' ? 'សូមបញ្ចូលលេខកូដប្រតិបត្តិការ (TxID) អោយបានត្រឹមត្រូវ' : 'Please provide a valid Transaction Hash / TxID.');
      return;
    }

    const tx = store.submitDeposit(currentUser.id, numAmount, network, txHash.trim());
    if (tx) {
      setSubmitted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        setTxHash('');
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{t.depositTitle}</h3>
              <p className="text-xs text-slate-400">USDT Tether (TRC20 / ERC20)</p>
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
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">{t.depositSubmitted}</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'km'
                ? 'សំណើដាក់ប្រាក់របស់អ្នកត្រូវបានបញ្ជូនទៅ Admin។ សមតុល្យនឹងត្រូវបញ្ចូលទៅក្នុងគណនីរបស់អ្នកភ្លាមៗនៅពេល Admin ពិនិត្យឃើញ។'
                : 'Your deposit request has been routed to Admin. Once verified on the blockchain, your balance will be credited instantly.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Institutional Security Escrow Banner */}
            <div className="p-3 bg-gradient-to-r from-blue-950/60 to-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2.5 text-[11px] text-blue-200 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="leading-tight">
                <span className="font-extrabold text-white block">
                  {language === 'km' ? 'ច្រកទ្វារដាក់ប្រាក់សុវត្ថិភាព • ធានាដើមទុន 100%' : 'Institutional Safe Escrow • 100% Capital Protected'}
                </span>
                <span className="text-slate-400 text-[10px]">
                  {language === 'km' ? 'ការពារដោយមូលនិធិ $50M SAFU & ឃ្លាំងត្រជាក់ Fireblocks' : 'Backed by $50,000,000 SAFU Reserve & Fireblocks Cold Vault'}
                </span>
              </div>
            </div>

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                {t.selectNetwork}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNetwork('TRC-20')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    network === 'TRC-20'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  TRC-20 (Tron)
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">Fast</span>
                </button>
                <button
                  type="button"
                  onClick={() => setNetwork('ERC-20')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    network === 'ERC-20'
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                  ERC-20 (ETH)
                </button>
              </div>
            </div>

            {/* QR Code and Wallet Address */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center text-center space-y-2.5">
              <div className="p-2 bg-white rounded-xl shadow-md">
                <QRCodeSVG
                  value={currentAddress}
                  size={140}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <div className="w-full">
                <div className="text-[11px] text-slate-400 mb-1">{t.depositAddress} ({network})</div>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200 break-all select-all">
                  <span className="truncate pr-2">{currentAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-shrink-0 text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-800 transition"
                    title={t.copy}
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-[11px] text-emerald-400 mt-1 font-medium">{t.copied}</p>
                )}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-400">{t.enterDepositAmount}</label>
                <span className="text-[11px] text-slate-500 font-mono">Min: {config.minDepositUSDT} USDT</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={config.minDepositUSDT}
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2 pl-3 pr-16 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                  placeholder="500"
                  required
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">USDT</span>
              </div>
              {/* Quick amount pills */}
              <div className="flex gap-1.5 mt-2">
                {[100, 500, 1000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`flex-1 py-1 text-[11px] font-mono rounded-lg border transition ${
                      parseFloat(amount) === amt
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-bold'
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              {/* Dynamic Estimated Daily Returns Preview */}
              {parseFloat(amount) > 0 && (
                <div className="mt-2.5 p-2.5 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 border border-emerald-500/30 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{language === 'km' ? 'ប្រាក់ចំណេញរំពឹងទុកពេលដាក់ប្រាក់៖' : 'Projected Daily Yield:'}</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-400">
                      +{(parseFloat(amount) * 0.01).toFixed(2)} ~ +{(parseFloat(amount) * 0.03).toFixed(2)} USDT / {language === 'km' ? 'ថ្ងៃ' : 'day'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>{language === 'km' ? 'ប៉ាន់ស្មានចំណេញ 30 ថ្ងៃ' : 'Projected 30-Day Total'}:</span>
                    <span className="text-white font-bold">
                      ≈ +{(parseFloat(amount) * 0.015 * 30).toFixed(2)} USDT
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* TxID Hash Input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                {t.enterTxHash} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                placeholder={network === 'TRC-20' ? 'e.g. 5d84a7... (Tron Tx Hash)' : 'e.g. 0x8a7f... (ETH Tx Hash)'}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-2 px-3 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                {t.depositInstructions}
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {t.submit}
            </button>

            {/* Trust Seals */}
            <div className="grid grid-cols-3 gap-1 pt-0.5 text-center text-[9px] text-slate-400 font-medium">
              <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                <span>256-Bit SSL</span>
              </div>
              <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span>0% Gas Fee</span>
              </div>
              <div className="p-1 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-400" />
                <span>$50M SAFU</span>
              </div>
            </div>

            {/* Telegram 24/7 Support Assistance */}
            <div className="pt-1 text-center">
              <a
                href={config.telegramSupport || 'https://t.me/customerserver1'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium transition bg-sky-950/30 border border-sky-500/20 px-3 py-1.5 rounded-xl"
              >
                <span>{language === 'km' ? 'ត្រូវការជំនួយក្នុងការដាក់ប្រាក់? សេវាកម្មអតិថិជន ២៤/៧ Telegram' : 'Need help with deposit? Telegram 24/7 VIP Support'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
