import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, FileText, ExternalLink, Activity, Award, HelpCircle } from 'lucide-react';
import { Language } from '../locales/translations';
import { store } from '../services/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SecurityModal: React.FC<Props> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

  const config = store.getConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f172a] border border-blue-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-tight flex items-center gap-1.5">
                <span>{language === 'km' ? 'សុវត្ថិភាពស្ថាប័ន & ទុនបម្រុង' : 'Institutional Security & PoR'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-full font-mono font-bold">
                  VERIFIED
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">QuantYield Global Multi-Tier Protection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-300">
          {/* Proof of Reserves Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/60 border border-blue-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-white text-xs flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                {language === 'km' ? 'របាយការណ៍ទុនបម្រុង (Proof of Reserves)' : 'Live Proof of Reserves (PoR)'}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                104.5% Backed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">
                  {language === 'km' ? 'ទ្រព្យសកម្មអ្នកប្រើប្រាស់' : 'User Liabilities:'}
                </span>
                <span className="text-white font-bold">$142,500,000 USDT</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-sans">
                  {language === 'km' ? 'ទុនបម្រុងក្នុងឃ្លាំង' : 'Cold Vault Reserves:'}
                </span>
                <span className="text-emerald-400 font-bold">$148,912,500 USDT</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              {language === 'km'
                ? 'ទ្រព្យសម្បត្តិទាំងអស់របស់វិនិយោគិនត្រូវបានធានា 1:1 ដោយទុនបម្រុងជាក់ស្តែង គ្មានការខ្ចីប្រាក់ឆ្លងដែន និងបានត្រួតពិនិត្យដោយប្រព័ន្ធ Merkle Tree On-Chain Audit។'
                : 'All investor funds are backed 1:1 by verifiable on-chain reserves. No cross-collateralization or rehypothecation.'}
            </p>
          </div>

          {/* SAFU $50,000,000 Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{language === 'km' ? 'មូលនិធិធានាសុវត្ថិភាព $50M SAFU Fund' : '$50,000,000 SAFU Protection Fund'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'km'
                ? 'មូលនិធិការពារហានិភ័យត្រូវបានបង្កើតឡើងដើម្បីការពារដើមទុនរបស់វិនិយោគិន 100% ប្រឆាំងនឹងការប្រែប្រួលនៃទីផ្សារ ឬឧប្បត្តិហេតុបច្ចេកវិទ្យា។'
                : 'A dedicated emergency insurance reserve funded with $50M liquid assets to ensure 100% of investor capital remains secure.'}
            </p>
          </div>

          {/* 4 Pillars of Architecture */}
          <div className="space-y-2">
            <span className="font-bold text-white text-xs block">
              {language === 'km' ? 'ប្រព័ន្ធការពារសុវត្ថិភាព ៤ ជាន់' : '4-Layer Security Architecture'}
            </span>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">
                  {language === 'km' ? '1. ឃ្លាំងត្រជាក់ Multi-Sig (Cold Storage)' : '1. Multi-Sig Cold Storage'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? '98% នៃរូបិយប័ណ្ណត្រូវបានរក្សាទុកក្រៅបណ្តាញអ៊ីនធឺណិត ដោយប្រើប្រាស់ Fireblocks & Ledger Enterprise MPC។'
                    : '98% of client digital assets remain in offline cold storage vaults powered by Fireblocks MPC architecture.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">
                  {language === 'km' ? '2. ការដាក់ប្រាក់ស្វ័យប្រវត្ត & គ្មានកម្រៃសេវា' : '2. Instant Automated Deposit & 0% Fees'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? 'ប្រព័ន្ធស្គាល់ការផ្ញើប្រាក់ On-Chain ភ្លាមៗ គ្មានការកាត់កម្រៃសេវា ធានាទឹកប្រាក់ចូលគណនីពេញលេញ។'
                    : 'Automated on-chain confirmation across TRC-20 and ERC-20 with zero platform handling fees.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">
                  {language === 'km' ? '3. ការការពារទិន្នន័យ 256-Bit SSL & DDoS' : '3. 256-Bit EV-SSL & DDoS Defense'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? 'បច្ចេកវិទ្យាការពារទិន្នន័យស្តង់ដារធនាគារអន្តរជាតិ ការពារការជ្រៀតចូល និងធានាសុវត្ថិភាព 24/7។'
                    : 'Enterprise Cloudflare DDoS mitigation, end-to-end encryption, and ISO/IEC 27001 certified protocols.'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white text-xs block">
                  {language === 'km' ? '4. ដកប្រាក់បានយ៉ាងងាយ និងទាន់ចិត្ត' : '4. Flexible Anytime Withdrawals'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {language === 'km'
                    ? 'ដើមទុន និងការប្រាក់អាចដកចេញបានយ៉ាងរលូនទៅកាន់កាបូបផ្ទាល់ខ្លួនរបស់អ្នក គ្មានលក្ខខណ្ឌស្មុគស្មាញ។'
                    : 'Full principal protection with seamless automated payouts straight to your external USDT wallet.'}
                </span>
              </div>
            </div>
          </div>

          {/* 24/7 Human Telegram Support Guarantee */}
          <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-sky-200 text-xs block">
                {language === 'km' ? 'ជំនួយការផ្ទាល់ខ្លួន VIP ២៤/៧' : 'Dedicated VIP Concierge 24/7'}
              </span>
              <span className="text-[10px] text-slate-400">
                {language === 'km' ? 'ការឆ្លើយតបក្នុងរយៈពេល < 1 នាទី' : 'Response time: < 1 minute'}
              </span>
            </div>
            <a
              href={config.telegramSupport || 'https://t.me/customerserver1'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-md shadow-sky-500/20"
            >
              <span>Telegram</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audited & Certified by CertiK</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            {language === 'km' ? 'យល់ព្រម' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};
