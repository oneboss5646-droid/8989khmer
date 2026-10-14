import React, { useState, useEffect } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  User as UserIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  UserPlus,
  LogIn,
  ChevronDown,
  Search,
  X,
  Check,
} from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { store } from '../services/store';
import { LanguageSelector } from './LanguageSelector';
import { SUPPORTED_COUNTRIES, CountryInfo } from '../data/countries';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: () => void;
}

export const LoginModal: React.FC<Props> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const t = translations[language];

  // Tab: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Country code selector for phone registration (all 22 requested countries)
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(() => {
    return (
      SUPPORTED_COUNTRIES.find((c) => c.langCode === language) ||
      SUPPORTED_COUNTRIES.find((c) => c.code === 'KH') ||
      SUPPORTED_COUNTRIES[0]
    );
  });
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');

  // Captcha code
  const [captchaCode, setCaptchaCode] = useState('3762');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync selected country if user changes language
  useEffect(() => {
    const matching = SUPPORTED_COUNTRIES.find((c) => c.langCode === language);
    if (matching) {
      setSelectedCountry(matching);
    }
  }, [language]);

  const generateCaptcha = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptchaCode(random);
  };

  useEffect(() => {
    generateCaptcha();
  }, [authMode]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (inputCaptcha !== captchaCode) {
      setError(
        language === 'km'
          ? 'លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវទេ'
          : 'Verification captcha code is incorrect.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = store.loginUser(username, password);
      setLoading(false);

      if (res.success) {
        setSuccessMsg(t.loginSuccess);
        setTimeout(() => {
          onLoginSuccess();
        }, 400);
      } else {
        setError(res.message || t.invalidCredentials);
      }
    }, 400);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (inputCaptcha !== captchaCode) {
      setError(
        language === 'km'
          ? 'លេខកូដផ្ទៀងផ្ទាត់មិនត្រឹមត្រូវទេ'
          : 'Verification captcha code is incorrect.'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (regPassword.length < 6) {
      setError(
        language === 'km'
          ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ តួអក្សរ'
          : 'Password must be at least 6 characters.'
      );
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Format phone with selected country dial code
      const fullPhone = regPhone.trim()
        ? `${selectedCountry.dialCode} ${regPhone.trim()}`
        : '';

      const res = store.registerUser({
        username: regUsername,
        fullName: regFullName,
        password: regPassword,
        phone: fullPhone,
        email: regEmail,
      });
      setLoading(false);

      if (res.success) {
        setSuccessMsg(t.registerSuccess);
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setError(res.message || 'Registration failed.');
      }
    }, 400);
  };

  const filteredCountries = SUPPORTED_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countryFilter.toLowerCase()) ||
      c.localName.toLowerCase().includes(countryFilter.toLowerCase()) ||
      c.dialCode.includes(countryFilter)
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0e17] relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Language Switcher at Top */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </div>

      <div className="w-full max-w-sm z-10">
        <div className="bg-[#111726] border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative">
          {/* Logo / Header */}
          <div className="text-center mb-5">
            <div className="inline-flex w-16 h-16 rounded-2xl overflow-hidden shadow-xl shadow-amber-500/20 mb-2 border border-amber-500/40 bg-slate-950 p-1 relative">
              <img
                src="/src/assets/images/quantyield_logo_1791865235637.jpg"
                alt="QuantYield Global Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-[#111726]">
                ₿
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {authMode === 'login'
                ? (language === 'km' ? 'សូមស្វាគមន៍!' : 'Welcome Back!')
                : t.registerTitle}
            </h1>

            {/* Bitcoin Investment Banner */}
            <div className="mt-1.5 inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] text-amber-300 font-semibold">
              <span>₿ Bitcoin (BTC) Investment</span>
              <span className="text-slate-400">•</span>
              <span className="text-emerald-400">USDT Funded</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {authMode === 'login'
                ? (language === 'km'
                    ? 'វិនិយោគលើកាក់ BTC ដោយប្រើប្រាស់ប្រាក់ USDT'
                    : 'Invest in Bitcoin (BTC) coin using USDT currency')
                : t.registerSubtitle}
            </p>
          </div>

          {/* Mode Switcher Tabs: Login vs Register */}
          <div className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setError('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'km' ? 'ចុះឈ្មោះថ្មី' : 'Register'}</span>
            </button>
          </div>

          {/* Status Banners */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-tight">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="leading-tight">{successMsg}</span>
            </div>
          )}

          {/* TAB 1: LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              {/* Account Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះគណនី ឬ អ៊ីមែល' : 'Username / Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t.accountPlaceholder}
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'km' ? 'ពាក្យសម្ងាត់' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2.5 pl-9 pr-10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Verification Captcha Code */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.verifyCodePlaceholder}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={inputCaptcha}
                      onChange={(e) => setInputCaptcha(e.target.value)}
                      placeholder="Enter code"
                      maxLength={4}
                      className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 px-3 text-white text-xs font-mono tracking-widest text-center focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <div
                      onClick={generateCaptcha}
                      title="Click to refresh captcha"
                      className="flex-1 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl py-2 text-center font-bold tracking-widest text-emerald-400 font-mono text-sm cursor-pointer select-none shadow-inner"
                    >
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-2 text-slate-400 hover:text-white transition"
                      title="Refresh"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 transition transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading
                  ? (language === 'km' ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'Logging in...')
                  : t.login.toUpperCase()}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setError('');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-4"
                >
                  {t.noAccountYet}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER FORM (អតិថិជនចុះឈ្មោះដោយខ្លួនឯង) */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              {/* Username */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះគណនី (Username) *' : 'Username *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="trader_vip"
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'km' ? 'ឈ្មោះពេញ (Full Name)' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 px-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Phone with 22 Countries Dropdown Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-300">
                    {language === 'km' ? 'លេខទូរស័ព្ទ (ជ្រើសរើសប្រទេស)' : 'Phone (Select Country)'}
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {selectedCountry.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Country Dial Code Button */}
                  <button
                    type="button"
                    onClick={() => setIsCountryPickerOpen(true)}
                    className="flex items-center gap-1 bg-[#182032] hover:bg-slate-800 border border-slate-700/80 rounded-xl py-2 px-2.5 text-xs text-white transition flex-shrink-0"
                    title="Change Country Code"
                  >
                    <span className="text-base leading-none">{selectedCountry.flag}</span>
                    <span className="font-mono text-xs font-bold text-blue-300">
                      {selectedCountry.dialCode}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                  </button>

                  {/* Phone input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder={selectedCountry.phonePlaceholder}
                      className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 px-3 text-white text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  {language === 'km' ? 'អ៊ីមែល (Email)' : 'Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="investor@crypto.invest"
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 pl-8 pr-2 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {language === 'km' ? 'ពាក្យសម្ងាត់ *' : 'Password *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 pl-9 pr-10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.confirmPasswordPlaceholder} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.verifyCodePlaceholder}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={inputCaptcha}
                      onChange={(e) => setInputCaptcha(e.target.value)}
                      placeholder="Code"
                      maxLength={4}
                      className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 px-3 text-white text-xs font-mono tracking-widest text-center focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-1">
                    <div
                      onClick={generateCaptcha}
                      className="flex-1 bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-xl py-2 text-center font-bold tracking-widest text-emerald-400 font-mono text-sm cursor-pointer select-none shadow-inner"
                    >
                      {captchaCode}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="p-1.5 text-slate-400 hover:text-white transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* KYC Requirement Notice */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 flex items-start gap-1.5">
                <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                <span>
                  {language === 'km'
                    ? "តម្រូវឱ្យផ្ទៀងផ្ទាត់ប័ណ្ណបើកបរ, អត្តសញ្ញាណប័ណ្ណ, ឬលិខិតឆ្លងដែន និងទទួលបានការអនុញ្ញាតពី Admin មុនពេលដាក់ និងដកប្រាក់។"
                    : "KYC verification (Driver's License, National ID, or Passport) with Admin approval is required before deposits and withdrawals."}
                </span>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading
                  ? (language === 'km' ? 'កំពុងចុះឈ្មោះ...' : 'Registering...')
                  : (language === 'km' ? 'បង្កើតគណនីវិនិយោគិន (Register)' : 'Create Account')}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setError('');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition underline underline-offset-4"
                >
                  {t.alreadyHaveAccount}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Country Selection Modal for Phone / Dial Code (22 Countries) */}
      {isCountryPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-sm bg-[#101726] border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white">Select Country Code</h3>
                <p className="text-[10px] text-slate-400">
                  {SUPPORTED_COUNTRIES.length} Countries for Phone Registration
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCountryPickerOpen(false)}
                className="w-7 h-7 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="my-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                placeholder="Search country name or code (+855, +66, +1)..."
                className="w-full bg-[#182032] border border-slate-700/80 rounded-xl py-2 pl-9 pr-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredCountries.map((c) => {
                const isSelected = selectedCountry.code === c.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(c);
                      setIsCountryPickerOpen(false);
                      setCountryFilter('');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left ${
                      isSelected
                        ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{c.flag}</span>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400">({c.localName})</span>
                        </div>
                        <span className="text-[11px] font-mono text-blue-400 font-semibold">
                          {c.dialCode}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
