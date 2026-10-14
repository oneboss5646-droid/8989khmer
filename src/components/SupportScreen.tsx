import React, { useState, useEffect, useRef } from 'react';
import { Send, Headphones, CheckCheck, MessageSquare, ExternalLink, HelpCircle, ShieldCheck, Copy, Check, Send as TelegramIcon } from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { store } from '../services/store';
import { User, ChatMessage } from '../types';

interface Props {
  currentUser: User;
  language: Language;
}

export const SupportScreen: React.FC<Props> = ({ currentUser, language }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>(store.getChats());
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const config = store.getConfig();
  const telegramLink = config.telegramSupport?.startsWith('http')
    ? config.telegramSupport
    : (config.telegramSupport?.startsWith('@')
        ? `https://t.me/${config.telegramSupport.substring(1)}`
        : 'https://t.me/customerserver1');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopyTelegram = () => {
    navigator.clipboard.writeText(telegramLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Send user message
    store.sendChatMessage(currentUser.id, currentUser.username, 'user', text);
    setMessages(store.getChats());
    if (!textToSend) setInputText('');

    // Simulate online specialist reply
    setIsTyping(true);
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();
      if (lower.includes('deposit') || lower.includes('ដាក់ប្រាក់')) {
        reply = language === 'km'
          ? `សម្រាប់ការដាក់ប្រាក់ USDT (TRC-20 ឬ ERC-20) សូមចូលទៅកាន់ទំព័រ "ដាក់ប្រាក់" រួចផ្ទេរទៅអាសយដ្ឋានកាបូបដែលបានកំណត់។ បន្ទាប់មកសូមបញ្ចូលលេខកូដ TxID ដើម្បីអោយ Admin ត្រួតពិនិត្យនិងបញ្ចូលលុយជូន។ ប្រសិនបើត្រូវការជំនួយបន្ទាន់ សូមទាក់ទង Telegram 24/7: ${telegramLink}`
          : `To deposit USDT (TRC-20 / ERC-20), please click "Deposit", transfer to the official platform address, and enter your transaction TxID. For urgent assistance, contact Telegram 24/7: ${telegramLink}`;
      } else if (lower.includes('withdraw') || lower.includes('ដកប្រាក់')) {
        reply = language === 'km'
          ? `ការដកប្រាក់ USDT ត្រូវបានដំណើរការក្នុងរយៈពេល 5-15 នាទីបន្ទាប់ពី Admin ត្រួតពិនិត្យ។ សូមប្រាកដថាអាសយដ្ឋានកាបូប TRC-20 របស់អ្នកត្រឹមត្រូវ។ ជំនួយបន្ទាន់ Telegram 24/7: ${telegramLink}`
          : `Withdrawals are processed within 5-15 minutes following Admin authorization. For 24/7 Telegram support: ${telegramLink}`;
      } else if (lower.includes('yield') || lower.includes('interest') || lower.includes('ការប្រាក់') || lower.includes('វិនីយោគ')) {
        reply = language === 'km'
          ? 'កញ្ចប់វិនីយោគ USDT របស់យើងផ្តល់ផលចំណេញចាប់ពី 1.00% ដល់ 3.00% ក្នុងមួយថ្ងៃ ដោយគិតការប្រាក់រាល់ 24 ម៉ោងម្តង។ អ្នកអាចចុច "បើកយកប្រាក់ចំណេញ" បានគ្រប់ពេល។'
          : 'USDT Staking packages generate 1.00% - 3.00% daily returns calculated every 24 hours. You can collect your accrued yield directly to your available balance.';
      } else {
        reply = language === 'km'
          ? `សូមអរគុណលោក ${currentUser.username}។ ក្រុមការងារជំនាញ Admin កំពុងពិនិត្យសំណើរបស់អ្នក។ អ្នកក៏អាចទាក់ទងមក Telegram ផ្ទាល់របស់សេវាកម្មអតិថិជន ២៤/៧៖ ${telegramLink}`
          : `Thank you for reaching out, ${currentUser.username}. Our 24/7 dedicated crypto specialist is ready. You can also reach our 24/7 Telegram directly at ${telegramLink}`;
      }

      store.sendChatMessage('support-agent', 'Specialist Agent #4', 'admin', reply);
      setMessages(store.getChats());
      setIsTyping(false);
    }, 1200);
  };

  const quickQuestions = [
    { label: language === 'km' ? 'របៀបដាក់ប្រាក់ USDT' : 'How to deposit USDT?', query: 'How to deposit USDT?' },
    { label: language === 'km' ? 'តើការដកប្រាក់ត្រូវចំណាយពេលប៉ុន្មាន?' : 'Withdrawal processing time?', query: 'How long do withdrawals take?' },
    { label: language === 'km' ? 'ការប្រាក់វិនីយោគប្រចាំថ្ងៃ' : 'Daily staking interest?', query: 'How does daily staking yield work?' },
    { label: language === 'km' ? 'ដំឡើងគណនី VIP' : 'VIP Membership upgrade', query: 'How to upgrade VIP tier?' },
  ];

  return (
    <div className="pb-24 pt-3 px-3 max-w-md mx-auto flex flex-col h-[85vh]">
      {/* Header with 24/7 Status & Quick Telegram Link */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-md flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white">{t.supportTitle}</h2>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">Online 24/7</span>
            </div>
            <p className="text-[10px] text-slate-400">{t.supportSubtitle}</p>
          </div>
        </div>

        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-sky-300 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition shadow-sm active:scale-95"
        >
          <span>Telegram</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Prominent Telegram 24/7 Customer Service Card */}
      <div className="bg-gradient-to-r from-sky-950/70 via-blue-950/60 to-slate-900 border border-sky-500/30 rounded-2xl p-3 mb-2 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 flex items-center justify-center font-bold shadow-inner">
              <TelegramIcon className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{language === 'km' ? 'សេវាកម្មអតិថិជន ២៤/៧ Telegram' : '24/7 Telegram Customer Service'}</span>
                <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-md font-semibold">Active</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                {language === 'km'
                  ? 'ងាយស្រួលទាក់ទងពេលត្រូវការជំនួយ ឆ្លើយតបភ្លាមៗ ២៤ ម៉ោង'
                  : 'Instant support 24 hours / 7 days for deposits, withdrawals & inquiries'}
              </p>
            </div>
          </div>
        </div>

        {/* Telegram Direct Link Display & Quick Action Buttons */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2 flex items-center justify-between gap-2">
          <div className="truncate flex-1">
            <span className="text-[10px] text-slate-400 block font-medium">
              {language === 'km' ? 'តំណភ្ជាប់ផ្លូវការ (Official Link):' : 'Official Telegram Link:'}
            </span>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-300 hover:text-sky-200 font-mono font-semibold underline underline-offset-2 truncate block"
            >
              {telegramLink}
            </a>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyTelegram}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] rounded-lg font-medium flex items-center gap-1 transition"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedLink ? (language === 'km' ? 'បានចម្លង' : 'Copied') : (language === 'km' ? 'ចម្លង' : 'Copy')}</span>
            </button>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 text-[10px] font-black rounded-lg flex items-center gap-1 transition shadow-md shadow-sky-500/20"
            >
              <span>{language === 'km' ? 'ទាក់ទង' : 'Open'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 overflow-y-auto space-y-3 mb-2 shadow-inner">
        {/* Welcome prompt banner */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Crypto Service Notice</span>
          </div>
          <p className="text-slate-400">
            {language === 'km'
              ? `សូមស្វាគមន៍! ប្រសិនបើអ្នកត្រូវការជំនួយរហ័ស សូមទាក់ទងមក Telegram ផ្លូវការរបស់យើងខ្ញុំ ${telegramLink} ឬផ្ញើឈ្មោះគណនី និងលេខកូដប្រតិបត្តិការ (TxID) មកកាន់ទីនេះ ដើម្បីអោយ Admin ជួយត្រួតពិនិត្យជូន។`
              : `Hello, how can I help you? For instant 24/7 help, reach our official Telegram ${telegramLink} or supply your username and deposit screenshot/TxID here.`}
          </p>
        </div>

        {/* Quick FAQ Pills */}
        <div className="space-y-1.5">
          <div className="text-[10px] text-slate-500 font-bold px-1 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            <span>{t.faqQuick}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q.query)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-blue-300 rounded-full text-[10px] font-medium transition"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isUser = msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[9px] text-slate-500 mb-0.5 px-1 font-mono">
                {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] px-2 py-1">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
            <span>Support agent is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-md"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.typeMessage}
          className="flex-1 bg-transparent px-3 py-2 text-white text-xs placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
