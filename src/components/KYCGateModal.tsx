import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRight,
  X,
  Lock,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { Language } from '../locales/translations';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  language: Language;
  intent: 'deposit' | 'withdraw';
  onOpenKYCForm: () => void;
}

export const KYCGateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  intent,
  onOpenKYCForm,
}) => {
  if (!isOpen) return null;

  const status = currentUser.kycStatus || 'unverified';
  const actionTextKm = intent === 'deposit' ? 'ដាក់ប្រាក់' : 'ដកប្រាក់';
  const actionTextEn = intent === 'deposit' ? 'Deposit' : 'Withdrawal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f172a] border border-amber-500/30 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-scaleIn">
        {/* Top Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center space-y-4">
          {/* Animated Security Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-amber-500/30 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            {status === 'pending' ? (
              <Clock className="w-8 h-8 animate-pulse text-amber-400" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              {language === 'km'
                ? `តម្រូវឱ្យផ្ទៀងផ្ទាត់អត្តសញ្ញាណមុនពេល${actionTextKm}`
                : `Identity Verification Required Before ${actionTextEn}`}
            </h3>
            <p className="text-[11px] text-amber-400/90 font-medium mt-1">
              {language === 'km'
                ? 'អនុលោមតាមបទប្បញ្ញត្តិសុវត្ថិភាព និងការអនុញ្ញាតពី Admin'
                : 'Security Compliance & Admin Approval Required'}
            </p>
          </div>

          {/* Explanation Text */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left text-xs text-slate-300 space-y-2 leading-relaxed">
            {status === 'pending' ? (
              <p className="text-amber-300 text-[11px]">
                {language === 'km'
                  ? 'ឯកសារផ្ទៀងផ្ទាត់របស់អ្នកត្រូវបានបញ្ជូនរួចរាល់ហើយ និងកំពុងស្ថិតក្រោមការត្រួតពិនិត្យដោយ Admin Panel (Pending Approval)។ សូមរង់ចាំការអនុញ្ញាតពី Admin ជាមុនសិន ទើបអាចដំណើរការដាក់ និងដកប្រាក់បាន។'
                  : 'Your verification documents have been submitted and are currently awaiting review by the Admin Panel. Deposits and withdrawals will be unlocked once approved.'}
              </p>
            ) : (
              <>
                <p className="text-[11px]">
                  {language === 'km'
                    ? `ដើម្បីការពារទ្រព្យសម្បត្តិរបស់អ្នកវិនិយោគ និងអនុលោមតាមច្បាប់ AML/KYC លោកអ្នកតម្រូវឱ្យផ្ទៀងផ្ទាត់៖`
                    : `To protect investor funds and comply with AML regulations, please verify your identity using:`}
                </p>
                <div className="grid grid-cols-1 gap-1 text-[11px] font-semibold text-slate-200 pl-1">
                  <div className="flex items-center gap-1.5">
                    <span>🚗</span>
                    <span>{language === 'km' ? "ប័ណ្ណបើកបរ (Driver's License)" : "Driver's License"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🪪</span>
                    <span>{language === 'km' ? "អត្តសញ្ញាណប័ណ្ណ (National ID Card)" : "National ID Card"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🛂</span>
                    <span>{language === 'km' ? "លិខិតឆ្លងដែន (Passport)" : "Passport"}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                  {language === 'km'
                    ? '* រាល់ការផ្ទៀងផ្ទាត់ត្រូវមានការអនុម័តពី Admin Panel ជាមុនសិន។'
                    : '* Submissions require Admin Panel approval before transactions are unlocked.'}
                </p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            {status === 'pending' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenKYCForm();
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition"
              >
                {language === 'km' ? 'ពិនិត្យមើលស្ថានភាពឯកសារ' : 'Check Document Status'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenKYCForm();
                }}
                className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 transform active:scale-98"
              >
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់អត្តសញ្ញាណឥឡូវនេះ' : 'Verify Identity Now'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs transition"
            >
              {language === 'km' ? 'បិទផ្ទាំងនេះ' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
