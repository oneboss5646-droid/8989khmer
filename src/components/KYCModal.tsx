import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  CreditCard,
  UserCheck,
  Camera,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { Language } from '../locales/translations';
import { store } from '../services/store';
import { User, KYCDocumentType, KYCSubmission } from '../types';
import { SUPPORTED_COUNTRIES } from '../data/countries';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  language: Language;
  onSuccess?: () => void;
}

export const KYCModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  language,
  onSuccess,
}) => {
  // Existing submission
  const existingSub = store.getUserKYC(currentUser.id);
  const status = currentUser.kycStatus || 'unverified';

  // Form State
  const [docType, setDocType] = useState<KYCDocumentType>(
    currentUser.kycDocumentType || 'national_id'
  );
  const [fullName, setFullName] = useState<string>(currentUser.fullName || '');
  const [idNumber, setIdNumber] = useState<string>(currentUser.kycIdNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState<string>('1995-06-15');
  const [nationality, setNationality] = useState<string>('Cambodia');

  // Images (URLs or Base64 data URLs)
  const [frontImage, setFrontImage] = useState<string>('');
  const [backImage, setBackImage] = useState<string>('');
  const [selfieImage, setSelfieImage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isResubmitting, setIsResubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (existingSub) {
      setDocType(existingSub.documentType);
      setFullName(existingSub.fullName);
      setIdNumber(existingSub.idNumber);
      if (existingSub.dateOfBirth) setDateOfBirth(existingSub.dateOfBirth);
      if (existingSub.nationality) setNationality(existingSub.nationality);
      if (existingSub.frontImageUrl) setFrontImage(existingSub.frontImageUrl);
      if (existingSub.backImageUrl) setBackImage(existingSub.backImageUrl);
      if (existingSub.selfieImageUrl) setSelfieImage(existingSub.selfieImageUrl);
    }
  }, [existingSub, isOpen]);

  if (!isOpen) return null;

  // File Upload Handlers (converts uploaded file to Base64)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setError(
          language === 'km'
            ? 'ទំហំរូបភាពមិនត្រូវលើសពី 8MB ឡើយ'
            : 'File size must be under 8MB'
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Documents for one-click testing
  const useSampleDoc = (type: KYCDocumentType) => {
    setDocType(type);
    if (type === 'drivers_license') {
      setIdNumber('DL-8855-2024');
      setFrontImage('https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=600&q=80');
      setBackImage('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
      setSelfieImage('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80');
    } else if (type === 'national_id') {
      setIdNumber('010892789');
      setFrontImage('https://images.unsplash.com/photo-1554415707-9e4466b0a82b?auto=format&fit=crop&w=600&q=80');
      setBackImage('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80');
      setSelfieImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
    } else {
      setIdNumber('N01829472');
      setFrontImage('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80');
      setSelfieImage('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setError(language === 'km' ? 'សូមបញ្ចូលឈ្មោះពេញតាមឯកសារ' : 'Please enter full legal name.');
      return;
    }

    if (!idNumber.trim()) {
      setError(language === 'km' ? 'សូមបញ្ចូលលេខសម្គាល់ឯកសារ' : 'Please enter document ID number.');
      return;
    }

    if (!frontImage) {
      setError(
        language === 'km'
          ? 'សូមផ្ទុករូបថតផ្ទៃខាងមុខនៃឯកសារ'
          : 'Please upload document front photo.'
      );
      return;
    }

    if (docType !== 'passport' && !backImage) {
      setError(
        language === 'km'
          ? 'សូមផ្ទុករូបថតផ្ទៃខាងក្រោយនៃឯកសារ (ប័ណ្ណបើកបរ ឬ អត្តសញ្ញាណប័ណ្ណ)'
          : 'Please upload document back photo.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.submitKYC({
        userId: currentUser.id,
        username: currentUser.username,
        fullName: fullName.trim(),
        documentType: docType,
        idNumber: idNumber.trim(),
        dateOfBirth,
        nationality,
        frontImageUrl: frontImage,
        backImageUrl: backImage,
        selfieImageUrl: selfieImage || frontImage,
      });

      setLoading(false);
      if (res.success) {
        setSuccessMsg(
          language === 'km'
            ? 'បានបញ្ជូនឯកសារផ្ទៀងផ្ទាត់ដោយជោគជ័យ! កំពុងរង់ចាំការអនុម័តពី Admin...'
            : 'KYC documents submitted successfully! Awaiting Admin approval...'
        );
        setIsResubmitting(false);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'Submission failed.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700/80 rounded-3xl w-full max-w-lg shadow-2xl relative my-6 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (KYC)' : 'Identity Verification (KYC)'}</span>
                {status === 'verified' && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    VERIFIED ✓
                  </span>
                )}
                {status === 'pending' && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                    PENDING ⏳
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {language === 'km'
                  ? 'តម្រូវការចាំបាច់មុនពេលដាក់ និងដកប្រាក់'
                  : 'Mandatory before Deposit & Withdrawal'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Institutional Trust Notice */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-500/20 flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-white text-[11px]">
                {language === 'km'
                  ? 'បទប្បញ្ញត្តិសុវត្ថិភាព និងការអនុលោមតាមច្បាប់ AML/CFT'
                  : 'Security & Anti-Money Laundering (AML) Compliance'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {language === 'km'
                  ? 'ដើម្បីធានាសុវត្ថិភាពខ្ពស់បំផុត និងអនុលោមតាមបទប្បញ្ញត្តិអន្តរជាតិ អតិថិជនតម្រូវឱ្យផ្ទៀងផ្ទាត់ ប័ណ្ណបើកបរ (Driver\'s License), អត្តសញ្ញាណប័ណ្ណ (National ID) ឬ លិខិតឆ្លងដែន (Passport) និងទទួលបានការអនុញ្ញាតពី Admin ជាមុនសិន ទើបអាចដំណើរការដាក់ប្រាក់ និងដកប្រាក់បាន។'
                  : 'To ensure institutional security, investors must verify their Driver\'s License, National ID card, or Passport and receive Admin approval before making deposits or withdrawals.'}
              </p>
            </div>
          </div>

          {/* STATUS VIEW 1: VERIFIED */}
          {status === 'verified' && !isResubmitting && (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-white">
                {language === 'km'
                  ? 'អត្តសញ្ញាណរបស់អ្នកត្រូវបានផ្ទៀងផ្ទាត់រួចរាល់!'
                  : 'Your Identity Has Been Fully Verified!'}
              </h4>
              <p className="text-slate-300 text-xs max-w-sm mx-auto">
                {language === 'km'
                  ? 'គណនីរបស់អ្នកត្រូវបាន Admin អនុម័តជាផ្លូវការរួចរាល់ហើយ។ លោកអ្នកអាចដាក់ប្រាក់ និងដកប្រាក់បានដោយសេរី ពេញលេញ និងមានសុវត្ថិភាពខ្ពស់បំផុត។'
                  : 'Your account has been officially approved by Admin. You now have full, unrestricted access to deposit and withdraw funds.'}
              </p>

              <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-left text-[11px]">
                <div className="p-2 bg-slate-900/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Document Type</span>
                  <span className="font-bold text-white capitalize">
                    {currentUser.kycDocumentType?.replace('_', ' ') || 'National ID'}
                  </span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Document ID</span>
                  <span className="font-bold text-emerald-300 font-mono">
                    {currentUser.kycIdNumber || 'Verified'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/30 text-xs"
              >
                {language === 'km' ? 'យល់ព្រម (បិទ)' : 'Done (Close)'}
              </button>
            </div>
          )}

          {/* STATUS VIEW 2: PENDING APPROVAL */}
          {status === 'pending' && !isResubmitting && (
            <div className="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto animate-pulse">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-base font-extrabold text-white">
                {language === 'km'
                  ? 'កំពុងរង់ចាំការអនុញ្ញាតពី Admin Panel...'
                  : 'Awaiting Admin Panel Approval...'}
              </h4>
              <p className="text-slate-300 text-xs max-w-sm mx-auto leading-relaxed">
                {language === 'km'
                  ? 'ឯកសាររបស់អ្នកត្រូវបានបញ្ជូនរួចរាល់ហើយ! ប្រព័ន្ធកំពុងរង់ចាំការត្រួតពិនិត្យ និងអនុម័តពី Admin Panel ជាមុនសិន។ នៅពេល Admin អនុញ្ញាត គណនីរបស់អ្នកនឹងអាចដាក់ប្រាក់ និងដកប្រាក់បានភ្លាមៗ។'
                  : 'Your documents have been submitted! They are currently queued for Admin review and approval. Once verified, deposits and withdrawals will unlock automatically.'}
              </p>

              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-left space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">អ្នកស្នើសុំ:</span>
                  <span className="font-bold text-white">{currentUser.fullName} ({currentUser.username})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ប្រភេទឯកសារ:</span>
                  <span className="font-bold text-amber-300 uppercase">
                    {docType === 'drivers_license'
                      ? "Driver's License (ប័ណ្ណបើកបរ)"
                      : docType === 'national_id'
                      ? "National ID (អត្តសញ្ញាណប័ណ្ណ)"
                      : "Passport (លិខិតឆ្លងដែន)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">លេខសម្គាល់:</span>
                  <span className="font-mono text-white">{idNumber || 'Under Review'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResubmitting(true)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  {language === 'km' ? 'កែប្រែឯកសារ' : 'Edit Documents'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md"
                >
                  {language === 'km' ? 'យល់ព្រម (រង់ចាំ)' : 'Got it'}
                </button>
              </div>
            </div>
          )}

          {/* STATUS VIEW 3: REJECTED NOTICE (allows re-submission) */}
          {status === 'rejected' && !isResubmitting && (
            <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {language === 'km' ? 'ការផ្ទៀងផ្ទាត់មិនត្រូវបានអនុម័ត' : 'Verification Rejected by Admin'}
                  </h4>
                  <p className="text-[11px] text-rose-300 mt-0.5">
                    {currentUser.kycRejectionReason ||
                      (language === 'km'
                        ? 'រូបថតឯកសារមិនច្បាស់ ឬ ព័ត៌មានមិនត្រឹមត្រូវ។ សូមបញ្ជូនសារជាថ្មី។'
                        : 'Document photo was unclear or info did not match. Please re-submit.')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsResubmitting(true)}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition text-xs shadow-md"
              >
                {language === 'km' ? 'បញ្ជូនឯកសារឡើងវិញឥឡូវនេះ' : 'Re-submit Documents Now'}
              </button>
            </div>
          )}

          {/* FORM: UNVERIFIED OR RESUBMITTING */}
          {(status === 'unverified' || isResubmitting) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* STEP 1: SELECT DOCUMENT TYPE */}
              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  1. {language === 'km' ? 'ជ្រើសរើសប្រភេទឯកសារផ្ទៀងផ្ទាត់' : 'Select Verification Document Type'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Driver's License */}
                  <button
                    type="button"
                    onClick={() => setDocType('drivers_license')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 relative ${
                      docType === 'drivers_license'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="text-xl">🚗</div>
                    <div className="font-bold text-[11px] leading-tight">
                      {language === 'km' ? 'ប័ណ្ណបើកបរ' : "Driver's License"}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {language === 'km' ? 'Driver License' : 'All classes'}
                    </div>
                    {docType === 'drivers_license' && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>

                  {/* National ID Card */}
                  <button
                    type="button"
                    onClick={() => setDocType('national_id')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 relative ${
                      docType === 'national_id'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="text-xl">🪪</div>
                    <div className="font-bold text-[11px] leading-tight">
                      {language === 'km' ? 'អត្តសញ្ញាណប័ណ្ណ' : 'National ID'}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {language === 'km' ? 'ID Card' : 'Government issued'}
                    </div>
                    {docType === 'national_id' && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>

                  {/* Passport */}
                  <button
                    type="button"
                    onClick={() => setDocType('passport')}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 relative ${
                      docType === 'passport'
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="text-xl">🛂</div>
                    <div className="font-bold text-[11px] leading-tight">
                      {language === 'km' ? 'លិខិតឆ្លងដែន' : 'Passport'}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {language === 'km' ? 'Passport' : 'International'}
                    </div>
                    {docType === 'passport' && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick sample filler */}
              <div className="flex items-center justify-between text-[11px] px-1">
                <span className="text-slate-400">
                  {language === 'km' ? 'តេស្តសាកល្បងរហ័ស:' : 'Quick Demo Template:'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => useSampleDoc('drivers_license')}
                    className="text-blue-400 hover:text-blue-300 underline font-semibold"
                  >
                    🚗 {language === 'km' ? 'គំរូប័ណ្ណបើកបរ' : "Driver's"}
                  </button>
                  <button
                    type="button"
                    onClick={() => useSampleDoc('national_id')}
                    className="text-emerald-400 hover:text-emerald-300 underline font-semibold"
                  >
                    🪪 {language === 'km' ? 'គំរូអត្តសញ្ញាណប័ណ្ណ' : 'ID Card'}
                  </button>
                  <button
                    type="button"
                    onClick={() => useSampleDoc('passport')}
                    className="text-purple-400 hover:text-purple-300 underline font-semibold"
                  >
                    🛂 {language === 'km' ? 'គំរូលិខិតឆ្លងដែន' : 'Passport'}
                  </button>
                </div>
              </div>

              {/* STEP 2: PERSONAL & DOCUMENT DETAILS */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-white">
                  2. {language === 'km' ? 'ព័ត៌មានលម្អិតនៃឯកសារ' : 'Document & Personal Information'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {language === 'km' ? 'ឈ្មោះពេញ (Full Legal Name) *' : 'Full Legal Name *'}
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. SOK CHANTHA"
                      required
                      className="w-full bg-[#182032] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {docType === 'drivers_license'
                        ? (language === 'km' ? 'លេខប័ណ្ណបើកបរ *' : "Driver's License No. *")
                        : docType === 'national_id'
                        ? (language === 'km' ? 'លេខអត្តសញ្ញាណប័ណ្ណ *' : 'National ID No. *')
                        : (language === 'km' ? 'លេខលិខិតឆ្លងដែន *' : 'Passport No. *')}
                    </label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder={docType === 'passport' ? 'e.g. N01234567' : 'e.g. 010892789'}
                      required
                      className="w-full bg-[#182032] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {language === 'km' ? 'ថ្ងៃខែឆ្នាំកំណើត' : 'Date of Birth'}
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full bg-[#182032] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      {language === 'km' ? 'សញ្ជាតិ (ប្រទេស)' : 'Nationality (Country)'}
                    </label>
                    <select
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="w-full bg-[#182032] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      {SUPPORTED_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name} className="bg-slate-900 text-white">
                          {c.flag} {c.name} ({c.localName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 3: DOCUMENT PHOTOS UPLOAD */}
              <div className="space-y-3 pt-1">
                <label className="block text-xs font-bold text-white">
                  3. {language === 'km' ? 'រូបថតឯកសារផ្ទៀងផ្ទាត់' : 'Upload Document Photos'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Front Photo */}
                  <div className="border border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-3 bg-slate-900/60 transition text-center relative group">
                    <label className="block text-[11px] font-bold text-slate-300 mb-2">
                      {language === 'km' ? 'រូបថតផ្ទៃមុខ (Front Side) *' : 'Front Side Photo *'}
                    </label>

                    {frontImage ? (
                      <div className="relative rounded-xl overflow-hidden h-28 border border-slate-700 bg-black">
                        <img
                          src={frontImage}
                          alt="Front"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFrontImage('')}
                          className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-slate-700 hover:bg-slate-800/40 transition">
                        <Upload className="w-6 h-6 text-blue-400 mb-1 group-hover:scale-110 transition" />
                        <span className="text-[10px] text-slate-400">
                          {language === 'km' ? 'ចុចផ្ទុករូបថតផ្ទៃមុខ' : 'Upload Front Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, setFrontImage)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Back Photo (only for Driver's license and National ID) */}
                  {docType !== 'passport' ? (
                    <div className="border border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-3 bg-slate-900/60 transition text-center relative group">
                      <label className="block text-[11px] font-bold text-slate-300 mb-2">
                        {language === 'km' ? 'រូបថតផ្ទៃក្រោយ (Back Side) *' : 'Back Side Photo *'}
                      </label>

                      {backImage ? (
                        <div className="relative rounded-xl overflow-hidden h-28 border border-slate-700 bg-black">
                          <img
                            src={backImage}
                            alt="Back"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setBackImage('')}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-slate-700 hover:bg-slate-800/40 transition">
                          <Upload className="w-6 h-6 text-indigo-400 mb-1 group-hover:scale-110 transition" />
                          <span className="text-[10px] text-slate-400">
                            {language === 'km' ? 'ចុចផ្ទុករូបថតផ្ទៃក្រោយ' : 'Upload Back Image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setBackImage)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-3 bg-slate-900/60 transition text-center relative group">
                      <label className="block text-[11px] font-bold text-slate-300 mb-2">
                        {language === 'km' ? 'រូបថតកាន់ឯកសារផ្ទាល់ (Selfie)' : 'Selfie with Passport'}
                      </label>

                      {selfieImage ? (
                        <div className="relative rounded-xl overflow-hidden h-28 border border-slate-700 bg-black">
                          <img
                            src={selfieImage}
                            alt="Selfie"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setSelfieImage('')}
                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center justify-center h-28 rounded-xl border border-dashed border-slate-700 hover:bg-slate-800/40 transition">
                          <Camera className="w-6 h-6 text-purple-400 mb-1 group-hover:scale-110 transition" />
                          <span className="text-[10px] text-slate-400">
                            {language === 'km' ? 'ចុចផ្ទុករូបថត Selfie' : 'Upload Selfie'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, setSelfieImage)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Requirement reminder */}
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center gap-2 text-[11px] text-amber-300">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>
                  {language === 'km'
                    ? 'បន្ទាប់ពីចុចបញ្ជូន រាល់សំណើនឹងត្រូវបញ្ជូនទៅកាន់ Admin Panel ដើម្បីត្រួតពិនិត្យ និងផ្តល់ការអនុម័តជាមុនសិន។'
                    : 'After submission, all requests are sent to the Admin Panel for manual review and approval.'}
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-[0.98] disabled:opacity-50 text-xs flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{language === 'km' ? 'កំពុងបញ្ជូនឯកសារ...' : 'Submitting Documents...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {language === 'km'
                        ? 'បញ្ជូនឯកសារស្នើសុំការអនុម័តពី Admin'
                        : 'Submit Documents for Admin Approval'}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
