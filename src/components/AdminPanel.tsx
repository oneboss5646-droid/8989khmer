import React, { useState } from 'react';
import {
  Shield,
  Users,
  ArrowDownToLine,
  ArrowUpRight,
  TrendingUp,
  Settings,
  MessageSquare,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Trash2,
  DollarSign,
  ArrowLeft,
  RefreshCw,
  Copy,
  ExternalLink,
  Sliders,
  Send,
  Eye,
  KeyRound,
  Download,
  Upload,
  Database,
  FileText,
  Edit3,
  Clock,
  AlertCircle,
  Wallet,
  Check,
  Globe,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Camera,
} from 'lucide-react';
import { translations, Language } from '../locales/translations';
import { store } from '../services/store';
import {
  User,
  Transaction,
  InvestmentPlan,
  PlatformConfig,
  ChatMessage,
  KYCSubmission,
  KYCDocumentType,
  KYCStatus,
} from '../types';
import { LanguageSelector } from './LanguageSelector';

interface Props {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSwitchToInvestApp: () => void;
}

export const AdminPanel: React.FC<Props> = ({ language, onLanguageChange, onSwitchToInvestApp }) => {
  const t = translations[language];

  // Admin Auth State
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(store.isAdminLoggedIn());
  const [adminPassword, setAdminPassword] = useState<string>('admin1234');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab in Admin
  const [activeTab, setActiveTab] = useState<'users' | 'deposits' | 'withdrawals' | 'kyc' | 'plans' | 'database' | 'settings' | 'support'>('users');

  // Search queries
  const [userSearch, setUserSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Create User Modal
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newFullName, setNewFullName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('password123');
  const [newInitialBalance, setNewInitialBalance] = useState<string>('10000');
  const [newVipLevel, setNewVipLevel] = useState<string>('3');
  const [newTrc20, setNewTrc20] = useState<string>('');
  const [createUserError, setCreateUserError] = useState<string>('');
  const [createUserSuccess, setCreateUserSuccess] = useState<string>('');

  // Edit User & Balance Modal (កែប្រែចំនួនលុយ និងគ្រប់គ្រងអ្នកប្រើប្រាស់)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState<'exact' | 'delta' | 'profile'>('exact');
  
  // Exact balance mode (both available balance AND total deposited)
  const [exactBalanceInput, setExactBalanceInput] = useState<string>('0');
  const [exactTotalDepositedInput, setExactTotalDepositedInput] = useState<string>('0');
  const [exactBalanceNote, setExactBalanceNote] = useState<string>('Manual balance set by Admin');
  
  // Delta balance mode
  const [adjustAmount, setAdjustAmount] = useState<string>('1000');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustReason, setAdjustReason] = useState<string>('VIP Deposit bonus');

  // Profile edit mode
  const [editFullName, setEditFullName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');
  const [editVipLevel, setEditVipLevel] = useState<number>(1);
  const [editTotalDeposited, setEditTotalDeposited] = useState<string>('0');
  const [editTotalEarned, setEditTotalEarned] = useState<string>('0');
  const [editWalletTRC20, setEditWalletTRC20] = useState<string>('');
  const [editSuccessMsg, setEditSuccessMsg] = useState<string>('');

  // Edit Deposit Transaction Modal (កែចំនួនលុយដែលបានដាក់រួច)
  const [isEditDepositModalOpen, setIsEditDepositModalOpen] = useState<boolean>(false);
  const [selectedDepositTx, setSelectedDepositTx] = useState<Transaction | null>(null);
  const [editDepositAmount, setEditDepositAmount] = useState<string>('0');
  const [editDepositNote, setEditDepositNote] = useState<string>('');
  const [depositEditSuccess, setDepositEditSuccess] = useState<string>('');

  // Manual Deposit Creation Modal (+ បន្ថែមការដាក់ប្រាក់ដោយដៃ)
  const [isAddManualDepositModalOpen, setIsAddManualDepositModalOpen] = useState<boolean>(false);
  const [manualDepositUserId, setManualDepositUserId] = useState<string>('');
  const [manualDepositAmount, setManualDepositAmount] = useState<string>('5000');
  const [manualDepositNetwork, setManualDepositNetwork] = useState<'TRC-20' | 'ERC-20'>('TRC-20');
  const [manualDepositTxHash, setManualDepositTxHash] = useState<string>('');
  const [manualDepositNote, setManualDepositNote] = useState<string>('Manual deposit verified and credited by Admin');
  const [manualDepositSuccess, setManualDepositSuccess] = useState<string>('');

  // Edit Investment Plan Modal (កែប្រែកញ្ចប់វិនីយោគ និងកម្រិតអប្បបរមា)
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [editPlanTitle, setEditPlanTitle] = useState<string>('');
  const [editPlanMinAmount, setEditPlanMinAmount] = useState<string>('100');
  const [editPlanMaxAmount, setEditPlanMaxAmount] = useState<string>('50000');
  const [editPlanDailyRate, setEditPlanDailyRate] = useState<string>('1.00');
  const [editPlanSuccess, setEditPlanSuccess] = useState<string>('');

  // Withdrawal Approval Modal State (អនុម័តការដកប្រាក់ និងកាត់ចេញពីគណនី)
  const [isApproveWithdrawModalOpen, setIsApproveWithdrawModalOpen] = useState<boolean>(false);
  const [selectedWithdrawTx, setSelectedWithdrawTx] = useState<Transaction | null>(null);
  const [approveWithdrawAmount, setApproveWithdrawAmount] = useState<string>('0');
  const [approveWithdrawTxHash, setApproveWithdrawTxHash] = useState<string>('');
  const [approveWithdrawNote, setApproveWithdrawNote] = useState<string>('');
  const [approveWithdrawError, setApproveWithdrawError] = useState<string>('');
  const [approveWithdrawSuccess, setApproveWithdrawSuccess] = useState<string>('');

  // Withdrawal Rejection Modal State (បដិសេធសំណើដកប្រាក់ - មិនកាត់ប្រាក់)
  const [isRejectWithdrawModalOpen, setIsRejectWithdrawModalOpen] = useState<boolean>(false);
  const [rejectWithdrawTx, setRejectWithdrawTx] = useState<Transaction | null>(null);
  const [rejectWithdrawReason, setRejectWithdrawReason] = useState<string>('');
  const [rejectWithdrawSuccess, setRejectWithdrawSuccess] = useState<string>('');

  // Edit Pending Withdrawal Modal State (កែប្រែទិន្នន័យដកប្រាក់មុនអនុម័ត)
  const [isEditWithdrawModalOpen, setIsEditWithdrawModalOpen] = useState<boolean>(false);
  const [editWithdrawTx, setEditWithdrawTx] = useState<Transaction | null>(null);
  const [editWithdrawAmount, setEditWithdrawAmount] = useState<string>('0');
  const [editWithdrawNetwork, setEditWithdrawNetwork] = useState<'TRC-20' | 'ERC-20'>('TRC-20');
  const [editWithdrawAddress, setEditWithdrawAddress] = useState<string>('');
  const [editWithdrawSuccess, setEditWithdrawSuccess] = useState<string>('');

  // Withdrawals tab filter
  const [withdrawFilterStatus, setWithdrawFilterStatus] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  // Platform Config State
  const [config, setConfig] = useState<PlatformConfig>(store.getConfig());
  const [configSaved, setConfigSaved] = useState<boolean>(false);

  // Database Backup & Restore
  const [backupJsonInput, setBackupJsonInput] = useState<string>('');
  const [backupStatusMsg, setBackupStatusMsg] = useState<string>('');

  // Admin reply chat state
  const [adminReplyText, setAdminReplyText] = useState<string>('');

  // Data fetching helpers
  const users = store.getUsers();
  const transactions = store.getTransactions();
  const plans = store.getPlans();
  const allInvestments = store.getAllInvestments();
  const chats = store.getChats();
  const kycSubmissions = store.getKYCSubmissions();
  const pendingKycSubmissions = store.getPendingKYCSubmissions();

  // Metrics
  const totalUserBalance = users.reduce((acc, u) => acc + u.balance, 0);
  const pendingDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

  // KYC Verification States
  const [kycFilter, setKycFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [kycSearch, setKycSearch] = useState<string>('');
  const [selectedKycSub, setSelectedKycSub] = useState<KYCSubmission | null>(null);
  const [isKycInspectModalOpen, setIsKycInspectModalOpen] = useState<boolean>(false);
  const [isKycRejectModalOpen, setIsKycRejectModalOpen] = useState<boolean>(false);
  const [kycRejectReason, setKycRejectReason] = useState<string>('រូបថតឯកសារមិនច្បាស់ សូមថតឡើងវិញ (Document photo is unclear)');
  const [kycActionSuccess, setKycActionSuccess] = useState<string>('');
  const [editKycStatus, setEditKycStatus] = useState<KYCStatus>('unverified');

  const filteredKycSubmissions = kycSubmissions.filter((sub) => {
    if (kycFilter !== 'all' && sub.status !== kycFilter) return false;
    if (kycSearch.trim()) {
      const q = kycSearch.toLowerCase();
      return (
        sub.username.toLowerCase().includes(q) ||
        sub.fullName.toLowerCase().includes(q) ||
        sub.idNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleApproveKYC = (submissionId: string) => {
    const res = store.approveKYC(submissionId, 'Approved by Admin');
    if (res.success) {
      setKycActionSuccess(
        language === 'km'
          ? 'បានអនុម័តការផ្ទៀងផ្ទាត់ KYC ជោគជ័យ! អតិថិជនអាចដាក់ និងដកប្រាក់បានហើយ។'
          : 'KYC verified successfully! Investor can now deposit & withdraw.'
      );
      setIsKycInspectModalOpen(false);
      setTimeout(() => setKycActionSuccess(''), 4000);
    }
  };

  const handleOpenRejectKYC = (sub: KYCSubmission) => {
    setSelectedKycSub(sub);
    setKycRejectReason(
      language === 'km'
        ? 'រូបថតឯកសារមិនច្បាស់ ឬ ព័ត៌មានមិនស៊ីសង្វាក់គ្នា សូមបញ្ជូនសារជាថ្មី'
        : 'Document photo is unclear or information does not match. Please re-submit.'
    );
    setIsKycRejectModalOpen(true);
  };

  const handleConfirmRejectKYC = () => {
    if (selectedKycSub) {
      const res = store.rejectKYC(selectedKycSub.id, kycRejectReason);
      if (res.success) {
        setKycActionSuccess(
          language === 'km' ? 'បានបដិសេធសំណើផ្ទៀងផ្ទាត់ KYC' : 'KYC submission rejected.'
        );
        setIsKycRejectModalOpen(false);
        setIsKycInspectModalOpen(false);
        setTimeout(() => setKycActionSuccess(''), 4000);
      }
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (store.loginAdmin(adminPassword)) {
      setIsAdminAuth(true);
      setAuthError('');
    } else {
      setAuthError(language === 'km' ? 'ពាក្យសម្ងាត់ Admin មិនត្រឹមត្រូវទេ (សាកល្បង: admin1234)' : 'Invalid Admin password (Default: admin1234)');
    }
  };

  const handleAdminLogout = () => {
    store.logoutAdmin();
    setIsAdminAuth(false);
  };

  const handleOpenEditUser = (user: User) => {
    setSelectedUser(user);
    setEditMode('exact');
    setExactBalanceInput(user.balance.toString());
    setExactTotalDepositedInput(user.totalDeposited.toString());
    setExactBalanceNote(language === 'km' ? 'Admin កែប្រែសមតុល្យផ្ទាល់' : 'Admin exact balance update');
    setAdjustAmount('1000');
    setAdjustType('add');
    setAdjustReason('VIP Deposit bonus');
    setEditFullName(user.fullName);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditPassword(user.passwordHash);
    setEditVipLevel(user.vipLevel);
    setEditTotalDeposited(user.totalDeposited.toString());
    setEditTotalEarned(user.totalEarned.toString());
    setEditWalletTRC20(user.walletAddressTRC20 || '');
    setEditKycStatus(user.kycStatus || 'unverified');
    setEditSuccessMsg('');
    setIsEditUserModalOpen(true);
  };

  const handleSaveExactBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const numBalance = parseFloat(exactBalanceInput);
    if (isNaN(numBalance) || numBalance < 0) return;

    store.setExactUserBalance(selectedUser.id, numBalance, exactBalanceNote);

    const numDeposited = parseFloat(exactTotalDepositedInput);
    if (!isNaN(numDeposited) && numDeposited >= 0) {
      store.updateUser(selectedUser.id, { totalDeposited: numDeposited });
    }

    setEditSuccessMsg(
      language === 'km'
        ? `បានកែសមតុល្យ (${numBalance.toLocaleString()} USDT) និងប្រាក់បានដាក់សរុប (${numDeposited.toLocaleString()} USDT) ដោយជោគជ័យ!`
        : `Balance and Total Deposited successfully updated!`
    );
    setTimeout(() => {
      setIsEditUserModalOpen(false);
      setSelectedUser(null);
    }, 1200);
  };

  const handleSaveAdjustBalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const val = parseFloat(adjustAmount);
    if (isNaN(val) || val <= 0) return;

    const delta = adjustType === 'add' ? val : -val;
    store.adjustUserBalance(selectedUser.id, delta, adjustReason);
    setEditSuccessMsg(language === 'km' ? `បានកែសម្រួល ${delta > 0 ? '+' : ''}${delta.toLocaleString()} USDT!` : `Adjusted ${delta > 0 ? '+' : ''}${delta.toLocaleString()} USDT!`);
    setTimeout(() => {
      setIsEditUserModalOpen(false);
      setSelectedUser(null);
    }, 1200);
  };

  const handleSaveProfileEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    store.updateUser(selectedUser.id, {
      fullName: editFullName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      passwordHash: editPassword.trim() || selectedUser.passwordHash,
      vipLevel: editVipLevel,
      totalDeposited: parseFloat(editTotalDeposited) || selectedUser.totalDeposited,
      totalEarned: parseFloat(editTotalEarned) || selectedUser.totalEarned,
      walletAddressTRC20: editWalletTRC20.trim(),
    });

    // Save KYC Status
    store.setUserKYCStatus(selectedUser.id, editKycStatus);

    setEditSuccessMsg(language === 'km' ? 'បានរក្សាទុកព័ត៌មានគណនីដោយជោគជ័យ!' : 'User profile saved successfully!');
    setTimeout(() => {
      setIsEditUserModalOpen(false);
      setSelectedUser(null);
    }, 1200);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateUserError('');
    setCreateUserSuccess('');

    if (!newUsername.trim()) {
      setCreateUserError('Username is required');
      return;
    }

    const res = store.createUser({
      username: newUsername.trim(),
      fullName: newFullName.trim() || newUsername.trim(),
      email: newEmail.trim() || `${newUsername.trim()}@client.com`,
      phone: newPhone.trim(),
      password: newPassword.trim() || 'password123',
      initialBalance: parseFloat(newInitialBalance) || 0,
      vipLevel: parseInt(newVipLevel) || 1,
      walletAddressTRC20: newTrc20.trim(),
    });

    if (res.success) {
      setCreateUserSuccess(t.userCreatedSuccess);
      setTimeout(() => {
        setIsCreateUserModalOpen(false);
        setNewUsername('');
        setNewFullName('');
        setNewEmail('');
        setNewPhone('');
        setNewTrc20('');
        setCreateUserSuccess('');
      }, 1500);
    } else {
      setCreateUserError(res.message || 'Error creating user');
    }
  };

  // Handlers for Deposit Editing & Manual Deposits
  const handleOpenEditDeposit = (tx: Transaction) => {
    setSelectedDepositTx(tx);
    setEditDepositAmount(tx.amount.toString());
    setEditDepositNote(tx.note || (language === 'km' ? 'Admin កែប្រែចំនួនប្រាក់ដាក់' : 'Admin modified deposit amount'));
    setDepositEditSuccess('');
    setIsEditDepositModalOpen(true);
  };

  const handleSaveEditDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepositTx) return;
    const amt = parseFloat(editDepositAmount);
    if (isNaN(amt) || amt <= 0) return;

    const ok = store.editDepositTransaction(selectedDepositTx.id, amt, editDepositNote);
    if (ok) {
      setDepositEditSuccess(
        language === 'km'
          ? `បានកែប្រែចំនួនប្រាក់ដាក់ទៅ ${amt.toLocaleString()} USDT ដោយជោគជ័យ!`
          : `Deposit amount updated to ${amt.toLocaleString()} USDT!`
      );
      setTimeout(() => {
        setIsEditDepositModalOpen(false);
        setSelectedDepositTx(null);
      }, 1200);
    }
  };

  const handleOpenManualDeposit = () => {
    setManualDepositUserId(users[0]?.id || '');
    setManualDepositAmount('5000');
    setManualDepositNetwork('TRC-20');
    setManualDepositTxHash(`MANUAL-${Date.now()}`);
    setManualDepositNote(language === 'km' ? 'Admin បញ្ចូលប្រាក់ដាក់ដោយដៃ' : 'Manual deposit verified by Admin');
    setManualDepositSuccess('');
    setIsAddManualDepositModalOpen(true);
  };

  const handleSaveManualDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualDepositAmount);
    if (isNaN(amt) || amt <= 0 || !manualDepositUserId) return;

    const tx = store.createManualDeposit(manualDepositUserId, amt, manualDepositNetwork, manualDepositTxHash, manualDepositNote);
    if (tx) {
      setManualDepositSuccess(
        language === 'km'
          ? `បានបន្ថែមការដាក់ប្រាក់ ${amt.toLocaleString()} USDT ជូនអ្នកប្រើដោយជោគជ័យ!`
          : `Manual deposit of ${amt.toLocaleString()} USDT added successfully!`
      );
      setTimeout(() => {
        setIsAddManualDepositModalOpen(false);
        setManualDepositSuccess('');
      }, 1200);
    }
  };

  const handleOpenEditPlan = (plan: InvestmentPlan) => {
    setSelectedPlan(plan);
    setEditPlanTitle(plan.title);
    setEditPlanMinAmount(plan.minAmount.toString());
    setEditPlanMaxAmount(plan.maxAmount.toString());
    setEditPlanDailyRate(plan.dailyRate.toString());
    setEditPlanSuccess('');
    setIsEditPlanModalOpen(true);
  };

  const handleSaveEditPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    const minAmt = parseFloat(editPlanMinAmount);
    const maxAmt = parseFloat(editPlanMaxAmount);
    const rate = parseFloat(editPlanDailyRate);
    if (isNaN(minAmt) || minAmt < 0 || isNaN(maxAmt) || isNaN(rate)) return;

    const ok = store.updatePlan(selectedPlan.id, {
      title: editPlanTitle.trim() || selectedPlan.title,
      minAmount: minAmt,
      maxAmount: maxAmt,
      dailyRate: rate,
    });

    if (ok) {
      setEditPlanSuccess(
        language === 'km'
          ? `បានកែប្រែកញ្ចប់ និងកំណត់វិនីយោគអប្បបរមា ${minAmt.toLocaleString()} USDT ដោយជោគជ័យ!`
          : `Plan updated with min investment ${minAmt.toLocaleString()} USDT successfully!`
      );
      setTimeout(() => {
        setIsEditPlanModalOpen(false);
        setSelectedPlan(null);
      }, 1200);
    }
  };

  const handleDownloadBackup = () => {
    const backupStr = store.exportBackup();
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantyield_global_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupStatusMsg(language === 'km' ? 'បានទាញយកទិន្នន័យបម្រុងទុក JSON ដោយជោគជ័យ!' : 'Backup JSON file downloaded successfully!');
    setTimeout(() => setBackupStatusMsg(''), 3000);
  };

  const handleImportBackup = () => {
    if (!backupJsonInput.trim()) {
      alert('Please paste JSON backup contents.');
      return;
    }
    const ok = store.importBackup(backupJsonInput);
    if (ok) {
      setBackupStatusMsg(language === 'km' ? 'បានស្តារទិន្នន័យពី Backup ដោយជោគជ័យ!' : 'Database restored from backup successfully!');
      setBackupJsonInput('');
      setTimeout(() => setBackupStatusMsg(''), 3000);
    } else {
      alert('Invalid JSON backup format. Please verify the content.');
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateConfig(config);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    store.sendChatMessage('admin-operator', 'Platform Administrator', 'admin', adminReplyText.trim());
    setAdminReplyText('');
  };

  // If Admin is not authenticated yet, show dedicated Admin Login Gateway
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
          <button
            onClick={onSwitchToInvestApp}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 text-xs font-bold transition flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'km' ? 'ទៅកាន់គេហទំព័រវិនីយោគ' : 'To Investor Web'}</span>
          </button>
        </div>

        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-red-500 rounded-2xl flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/20">
              <Shield className="w-9 h-9 fill-slate-950" />
            </div>
            <h2 className="text-xl font-black text-white">{t.adminPanel}</h2>
            <p className="text-xs text-slate-400">
              {language === 'km' ? 'គេហទំព័រដាច់ដោយឡែកសម្រាប់គ្រប់គ្រងអ្នកប្រើប្រាស់ និងសមតុល្យ' : 'Standalone Crypto Management & Financial Back-Office'}
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {language === 'km' ? 'ពាក្យសម្ងាត់ Admin Master (Default: admin1234)' : 'Admin Master Key'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  placeholder="admin1234"
                  required
                />
              </div>
            </div>

            {authError && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg transition"
            >
              {language === 'km' ? 'ចូលផ្ទាំងគ្រប់គ្រង Admin' : 'Enter Admin Back-Office'}
            </button>
          </form>

          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 leading-relaxed">
            <span className="text-amber-400 font-bold block mb-0.5">🔒 Standalone Admin Web Portal</span>
            {language === 'km'
              ? 'គេហទំព័រ Admin នេះត្រូវបានញែកដាច់ពីគេហទំព័រវិនីយោគ។ មានតែ Admin ប៉ុណ្ណោះដែលអាចបង្កើតគណនី កែប្រែចំនួនលុយ និងអនុម័តប្រតិបត្តិការបាន។'
              : 'This portal is completely isolated from the investor website. Only authenticated administrators can provision accounts and modify USDT balances.'}
          </div>
        </div>
      </div>
    );
  }

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-16">
      {/* Standalone Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-500/30 shadow-md shadow-amber-500/20 bg-slate-950 flex-shrink-0">
              <img
                src="/src/assets/images/quantyield_logo_1791865235637.jpg"
                alt="QuantYield Global Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white">QuantYield Global Admin Back-Office</h1>
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full">
                  Isolated Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {language === 'km' ? 'គ្រប់គ្រងអ្នកប្រើប្រាស់ • កែចំនួនលុយ • អនុម័តដកដាក់ប្រាក់' : 'User Provisioning • Balance Control • Approvals'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{language === 'km' ? 'ភ្ជាប់ជាមួយគេហទំព័រវិនិយោគផ្ទាល់' : 'Live Sync to Investor Web'}</span>
            </div>

            <LanguageSelector language={language} onLanguageChange={onLanguageChange} />

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = `${window.location.origin}/`;
                  window.open(url, '_blank');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title={language === 'km' ? 'បើកគេហទំព័រវិនិយោគក្នុងផ្ទាំងថ្មី' : 'Open Investor Web in New Tab'}
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">{language === 'km' ? 'បើកគេហទំព័រវិនិយោគ (ផ្ទាំងថ្មី ↗)' : 'Investor Web (New Tab ↗)'}</span>
            </button>

            <button
              onClick={onSwitchToInvestApp}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 hover:bg-blue-600/30 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'km' ? 'ប្តូរទៅគេហទំព័រវិនិយោគ' : 'Switch to Investor App'}</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              title={t.logout}
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Statistics Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t.totalUsers}</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-mono">{users.length}</div>
            <div className="text-[10px] text-emerald-400 mt-1">Total Registered</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t.totalPlatformBalance}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono truncate">
              ${totalUserBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Total user USDT</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t.pendingDeposits}</span>
              <ArrowDownToLine className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
              <span>{pendingDeposits.length}</span>
              {pendingDeposits.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Waiting for approval</div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t.pendingWithdrawals}</span>
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono flex items-center gap-1.5">
              <span>{pendingWithdrawals.length}</span>
              {pendingWithdrawals.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Waiting for payout</div>
          </div>

          {/* Pending KYC Approval Metric */}
          <div
            onClick={() => setActiveTab('kyc')}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 shadow-md cursor-pointer transition group"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{language === 'km' ? 'រង់ចាំ KYC' : 'Pending KYC'}</span>
              <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono flex items-center gap-1.5">
              <span>{pendingKycSubmissions.length}</span>
              {pendingKycSubmissions.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1 flex items-center gap-1">
              <span>ID & Passport</span>
              <span>→</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>{t.activeStakes}</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-purple-400 font-mono">
              {allInvestments.filter(i => i.status === 'active').length}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Active yield plans</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t.adminUsersTab}</span>
            <span className="bg-slate-950/60 px-1.5 py-0.2 rounded text-[10px]">{users.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'deposits'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>{t.adminDepositsTab}</span>
            {pendingDeposits.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black text-[10px]">
                {pendingDeposits.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'withdrawals'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>{t.adminWithdrawalsTab}</span>
            {pendingWithdrawals.length > 0 && (
              <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded font-black text-[10px]">
                {pendingWithdrawals.length}
              </span>
            )}
          </button>

          {/* Dedicated KYC Identity Verification Tab */}
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'kyc'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (KYC)' : 'KYC Verification'}</span>
            {pendingKycSubmissions.length > 0 && (
              <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black text-[10px] animate-pulse">
                {pendingKycSubmissions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'plans'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{t.adminPlansTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{language === 'km' ? 'សុវត្ថិភាព & បម្រុងទុក' : 'Database & Backup'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{t.adminSettingsTab}</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'support'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.adminSupportTab}</span>
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT & BALANCE EDITOR */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={t.search}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl py-2 px-2.5 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="all">{t.all}</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Create User Button */}
              <button
                onClick={() => setIsCreateUserModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{t.createNewUser}</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">VIP Tier</th>
                      <th className="py-3 px-4">Available Balance (USDT)</th>
                      <th className="py-3 px-4">Total Deposited</th>
                      <th className="py-3 px-4">Password</th>
                      <th className="py-3 px-4">{t.status}</th>
                      <th className="py-3 px-4">KYC Status</th>
                      <th className="py-3 px-4 text-right">Balance & Profile Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                              {user.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                <span>{user.username}</span>
                                {user.username === 'mk887' && (
                                  <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 rounded">Primary Demo</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-bold font-mono">
                            VIP {user.vipLevel}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-emerald-400 text-sm">
                            {user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {user.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                          <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {user.passwordHash}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          {user.status === 'active' ? (
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
                              Suspended
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {user.kycStatus === 'verified' && (
                            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                              Verified ✓
                            </span>
                          )}
                          {user.kycStatus === 'pending' && (
                            <button
                              onClick={() => {
                                setActiveTab('kyc');
                                setKycSearch(user.username);
                              }}
                              className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse hover:bg-amber-500/30 transition flex items-center gap-1"
                              title="Click to review KYC submission"
                            >
                              <span>Pending ⏳</span>
                            </button>
                          )}
                          {user.kycStatus === 'rejected' && (
                            <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                              Rejected ✕
                            </span>
                          )}
                          {(!user.kycStatus || user.kycStatus === 'unverified') && (
                            <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full">
                              Unverified
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Primary Edit Balance & User Button */}
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{language === 'km' ? 'កែចំនួនលុយ' : 'Edit Balance'}</span>
                            </button>

                            {/* Toggle Suspend Button */}
                            <button
                              onClick={() => {
                                store.updateUser(user.id, {
                                  status: user.status === 'active' ? 'suspended' : 'active',
                                });
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition"
                              title={user.status === 'active' ? 'Freeze User' : 'Activate User'}
                            >
                              {user.status === 'active' ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                            </button>

                            {/* Delete User */}
                            {user.username !== 'mk887' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete user ${user.username}?`)) {
                                    store.deleteUser(user.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition"
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEPOSIT APPROVALS & TRANSACTION EDITOR */}
        {activeTab === 'deposits' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                  <span>{t.adminDepositsTab}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {language === 'km' ? 'ពិនិត្យ អនុម័ត និងកែប្រែចំនួនប្រាក់ដែលបានដាក់រួច' : 'Review, approve, and directly edit deposited amounts'}
                </p>
              </div>

              {/* Direct Add Manual Deposit Button */}
              <button
                onClick={handleOpenManualDeposit}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'km' ? '+ បន្ថែមការដាក់ប្រាក់ដោយដៃ' : '+ Add Deposit for User'}</span>
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Deposited Amount (USDT)</th>
                      <th className="py-3 px-4">Network</th>
                      <th className="py-3 px-4">TxID / Hash</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">{t.status}</th>
                      <th className="py-3 px-4 text-right">Actions & Edit Deposit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {transactions
                      .filter((tx) => tx.type === 'deposit')
                      .map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-bold text-white">{tx.username}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                            +{tx.amount.toLocaleString()} USDT
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">{tx.network || 'TRC-20'}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            {tx.txHash ? (
                              <div className="flex items-center gap-1 max-w-[150px] truncate" title={tx.txHash}>
                                <span className="truncate">{tx.txHash}</span>
                                <button
                                  onClick={() => navigator.clipboard.writeText(tx.txHash!)}
                                  className="text-slate-500 hover:text-white"
                                  title="Copy Hash"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              'Internal'
                            )}
                          </td>
                          <td className="py-3 px-4 text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            {tx.status === 'approved' && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                                Approved
                              </span>
                            )}
                            {tx.status === 'pending' && (
                              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                                Pending Review
                              </span>
                            )}
                            {tx.status === 'rejected' && (
                              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
                                Rejected
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Direct Edit Deposit Amount Button (User specific request!) */}
                              <button
                                onClick={() => handleOpenEditDeposit(tx)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                title="Edit this deposit amount"
                              >
                                <Edit3 className="w-3 h-3 text-blue-400" />
                                <span>{language === 'km' ? 'កែប្រែចំនួន' : 'Edit Amount'}</span>
                              </button>

                              {/* Pending actions */}
                              {tx.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => store.approveDeposit(tx.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-md transition flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{t.approve}</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt('Reason for rejection:');
                                      store.rejectDeposit(tx.id, reason || undefined);
                                    }}
                                    className="px-2 py-1 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>{t.reject}</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: WITHDRAWAL APPROVALS */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.adminWithdrawalsTab}</h3>
                <p className="text-xs text-slate-400">Authorize user payouts to external USDT wallets</p>
              </div>
              <span className="text-xs bg-slate-800 px-3 py-1 rounded-xl text-slate-300">
                {transactions.filter(t => t.type === 'withdrawal').length} Total Requests
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Amount (USDT)</th>
                      <th className="py-3 px-4">Network</th>
                      <th className="py-3 px-4">Destination Wallet Address</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">{t.status}</th>
                      <th className="py-3 px-4 text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {transactions
                      .filter((tx) => tx.type === 'withdrawal')
                      .map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-bold text-white">{tx.username}</td>
                          <td className="py-3 px-4 font-mono font-bold text-rose-400 text-sm">
                            -{tx.amount.toLocaleString()} USDT
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-300">{tx.network || 'TRC-20'}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            <div className="flex items-center gap-1 max-w-[160px] truncate" title={tx.walletAddress}>
                              <span className="truncate">{tx.walletAddress}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(tx.walletAddress!)}
                                className="text-slate-500 hover:text-white"
                                title="Copy Address"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-[10px] text-slate-400">
                            {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            {tx.status === 'approved' && (
                              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                                Paid / Sent
                              </span>
                            )}
                            {tx.status === 'pending' && (
                              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
                                Pending Payout
                              </span>
                            )}
                            {tx.status === 'rejected' && (
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold">
                                Rejected & Refunded
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {tx.status === 'pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => store.approveWithdrawal(tx.id)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-md transition flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>{t.approve}</span>
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt('Reason for rejection (funds will be refunded):');
                                    store.rejectWithdrawal(tx.id, reason || undefined);
                                  }}
                                  className="px-2 py-1 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>{t.reject}</span>
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-500">Completed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB KYC: IDENTITY DOCUMENT VERIFICATION (KYC) */}
        {activeTab === 'kyc' && (
          <div className="space-y-4">
            {/* Header / Notice */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'km' ? 'ការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ (KYC Document Approvals)' : 'KYC Identity Verification & Approvals'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'km'
                    ? "ត្រួតពិនិត្យ និងអនុម័ត ប័ណ្ណបើកបរ (Driver's License), អត្តសញ្ញាណប័ណ្ណ (National ID) និង លិខិតឆ្លងដែន (Passport)។ អតិថិជនអាចដាក់ និងដកប្រាក់បាន លុះត្រាតែ Admin អនុញ្ញាត។"
                    : "Review and approve investor Driver's License, National ID, and Passport submissions. Users cannot deposit or withdraw until approved."}
                </p>
              </div>

              {pendingKycSubmissions.length > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-2 self-start sm:self-auto">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{pendingKycSubmissions.length} {language === 'km' ? 'សំណើរង់ចាំការអនុម័ត' : 'Awaiting Review'}</span>
                </div>
              )}
            </div>

            {/* Action / Success Banner */}
            {kycActionSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{kycActionSuccess}</span>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={kycSearch}
                    onChange={(e) => setKycSearch(e.target.value)}
                    placeholder={language === 'km' ? 'ស្វែងរកតាមឈ្មោះ, Username ឬ លេខឯកសារ...' : 'Search by username, name, or doc ID...'}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setKycFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      kycFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {language === 'km' ? 'ទាំងអស់' : 'All'} ({kycSubmissions.length})
                  </button>
                  <button
                    onClick={() => setKycFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                      kycFilter === 'pending'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <span>{language === 'km' ? 'រង់ចាំអនុម័ត' : 'Pending'}</span>
                    <span className="bg-amber-400/20 px-1 rounded text-[10px] font-black">
                      {pendingKycSubmissions.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setKycFilter('verified')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      kycFilter === 'verified'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-emerald-400 hover:bg-slate-800'
                    }`}
                  >
                    {language === 'km' ? 'បានអនុម័ត' : 'Verified'}
                  </button>
                  <button
                    onClick={() => setKycFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      kycFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-rose-400 hover:bg-slate-800'
                    }`}
                  >
                    {language === 'km' ? 'បានបដិសេធ' : 'Rejected'}
                  </button>
                </div>
              </div>
            </div>

            {/* KYC Submissions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Investor</th>
                      <th className="py-3 px-4">Document Type</th>
                      <th className="py-3 px-4">ID Number / Details</th>
                      <th className="py-3 px-4">Document Previews</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Verification Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filteredKycSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-500">
                          {language === 'km' ? 'មិនមានទិន្នន័យផ្ទៀងផ្ទាត់នៅក្នុងផ្នែកនេះឡើយ' : 'No KYC submissions found in this category.'}
                        </td>
                      </tr>
                    ) : (
                      filteredKycSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-800/40 transition">
                          {/* User */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                                {sub.username.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{sub.username}</span>
                                </div>
                                <div className="text-[11px] text-slate-300 font-semibold">{sub.fullName}</div>
                              </div>
                            </div>
                          </td>

                          {/* Doc Type */}
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200">
                              {sub.documentType === 'drivers_license' && <span>🚗 Driver's License</span>}
                              {sub.documentType === 'national_id' && <span>🪪 National ID</span>}
                              {sub.documentType === 'passport' && <span>🛂 Passport</span>}
                            </span>
                          </td>

                          {/* ID Number */}
                          <td className="py-3 px-4 font-mono">
                            <div className="font-bold text-white text-xs">{sub.idNumber}</div>
                            <div className="text-[10px] text-slate-400">
                              DOB: {sub.dateOfBirth || '-'} | {sub.nationality || 'Cambodia'}
                            </div>
                          </td>

                          {/* Photos Thumbnails */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {sub.frontImageUrl && (
                                <div
                                  onClick={() => {
                                    setSelectedKycSub(sub);
                                    setIsKycInspectModalOpen(true);
                                  }}
                                  className="w-10 h-7 rounded border border-slate-700 overflow-hidden cursor-pointer hover:border-blue-500 hover:scale-105 transition bg-black relative group"
                                  title="Click to zoom Front"
                                >
                                  <img src={sub.frontImageUrl} alt="Front" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white font-bold">
                                    Front
                                  </div>
                                </div>
                              )}
                              {sub.backImageUrl && (
                                <div
                                  onClick={() => {
                                    setSelectedKycSub(sub);
                                    setIsKycInspectModalOpen(true);
                                  }}
                                  className="w-10 h-7 rounded border border-slate-700 overflow-hidden cursor-pointer hover:border-blue-500 hover:scale-105 transition bg-black relative group"
                                  title="Click to zoom Back"
                                >
                                  <img src={sub.backImageUrl} alt="Back" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[8px] text-white font-bold">
                                    Back
                                  </div>
                                </div>
                              )}
                              {sub.selfieImageUrl && (
                                <div
                                  onClick={() => {
                                    setSelectedKycSub(sub);
                                    setIsKycInspectModalOpen(true);
                                  }}
                                  className="w-8 h-8 rounded-full border border-purple-500/50 overflow-hidden cursor-pointer hover:scale-105 transition bg-black relative group"
                                  title="Selfie"
                                >
                                  <img src={sub.selfieImageUrl} alt="Selfie" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-[10px] text-slate-400 font-mono">
                            {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            {sub.status === 'verified' && (
                              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                                Verified ✓
                              </span>
                            )}
                            {sub.status === 'pending' && (
                              <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                Pending Review ⏳
                              </span>
                            )}
                            {sub.status === 'rejected' && (
                              <span className="text-[10px] bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                                Rejected ✕
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Inspect details button */}
                              <button
                                onClick={() => {
                                  setSelectedKycSub(sub);
                                  setIsKycInspectModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-bold border border-slate-700 transition flex items-center gap-1"
                                title="Inspect Documents"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                <span className="hidden sm:inline">{language === 'km' ? 'ពិនិត្យ' : 'Inspect'}</span>
                              </button>

                              {sub.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveKYC(sub.id)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold shadow-md transition flex items-center gap-1"
                                    title="Approve KYC"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{language === 'km' ? 'អនុម័ត' : 'Approve'}</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenRejectKYC(sub)}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg text-[11px] font-bold transition flex items-center gap-1"
                                    title="Reject KYC"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>{language === 'km' ? 'បដិសេធ' : 'Reject'}</span>
                                  </button>
                                </>
                              )}

                              {sub.status === 'rejected' && (
                                <button
                                  onClick={() => handleApproveKYC(sub.id)}
                                  className="px-2 py-1 bg-slate-800 hover:bg-emerald-950 text-emerald-400 rounded-lg text-[10px] font-semibold border border-slate-700"
                                >
                                  Re-Approve
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INVESTMENT PLANS */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">{t.adminPlansTab}</h3>
                <p className="text-xs text-slate-400">Configure daily interest yield and minimum investment tiers</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {plans.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{p.title}</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      +{p.dailyRate.toFixed(2)}% / Day
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-[10px] block text-slate-500">{t.duration}</span>
                      <span className="font-bold text-white">{p.days} Days</span>
                    </div>
                    <div>
                      <span className="text-[10px] block text-slate-500">{t.minInvestment}</span>
                      <span className="font-bold text-white font-mono">{p.minAmount.toLocaleString()} USDT</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Max: {p.maxAmount.toLocaleString()} USDT</span>
                    <button
                      onClick={() => handleOpenEditPlan(p)}
                      className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{language === 'km' ? 'កែប្រែ' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* All Active User Contracts */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 mt-6">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Active User Staking Contracts ({allInvestments.length})</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Plan</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Daily ROI</th>
                      <th className="py-2.5 px-3">Days</th>
                      <th className="py-2.5 px-3">Profit Paid</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {allInvestments.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-sans font-bold text-white">{inv.username}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-300">{inv.planTitle}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{inv.amount.toLocaleString()} USDT</td>
                        <td className="py-2.5 px-3 text-purple-400">+{inv.dailyRate}%</td>
                        <td className="py-2.5 px-3 text-slate-400">{inv.daysElapsed}/{inv.durationDays}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">+{inv.totalEarned.toFixed(2)} USDT</td>
                        <td className="py-2.5 px-3 font-sans">
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE & BACKUP */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-400" />
                    <span>{language === 'km' ? 'សុវត្ថិភាពទិន្នន័យ និងការបម្រុងទុក (Data Backup & Security)' : 'Data Backup & Security Persistence'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {language === 'km' ? 'ទាញយកទិន្នន័យគណនីទាំងអស់ និងកំណត់ត្រាប្រតិបត្តិការទុកដោយសុវត្ថិភាព' : 'Export and import secure platform state snapshots (Users, Transactions, Balances, Config)'}
                  </p>
                </div>

                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{language === 'km' ? 'ទាញយក JSON Backup' : 'Export Backup JSON'}</span>
                </button>
              </div>

              {backupStatusMsg && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{backupStatusMsg}</span>
                </div>
              )}

              {/* Import / Restore Section */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  {language === 'km' ? 'ស្តារទិន្នន័យឡើងវិញ (Restore / Import Backup JSON)' : 'Restore Database from JSON Content'}
                </label>
                <textarea
                  value={backupJsonInput}
                  onChange={(e) => setBackupJsonInput(e.target.value)}
                  placeholder="Paste your JSON backup text here..."
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={handleImportBackup}
                    disabled={!backupJsonInput.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{language === 'km' ? 'ស្តារទិន្នន័យ' : 'Restore Data'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Transaction Ledger */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>{language === 'km' ? 'កំណត់ត្រាប្រតិបត្តិការសរុបទាំងអស់ (Complete Transaction Ledger)' : 'Immutable Transaction Ledger'}</span>
              </h3>

              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">TxID</th>
                      <th className="py-2.5 px-3">User</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Note</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-[10px] text-slate-500">{tx.id.slice(0, 10)}</td>
                        <td className="py-2 px-3 font-sans font-bold text-white">{tx.username}</td>
                        <td className="py-2 px-3 font-sans text-slate-300 capitalize">{tx.type.replace('_', ' ')}</td>
                        <td className={`py-2 px-3 font-bold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()} USDT
                        </td>
                        <td className="py-2 px-3 font-sans">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                            tx.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : tx.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-sans text-[11px] text-slate-400 max-w-xs truncate">{tx.note || '-'}</td>
                        <td className="py-2 px-3 text-[10px] text-slate-500">{new Date(tx.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SYSTEM & WALLET SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-sm font-bold text-white">{t.adminSettingsTab}</h3>
              <p className="text-xs text-slate-400">Configure platform deposit addresses and platform parameters</p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Platform USDT TRC-20 Receiving Address (Tron Network)
                </label>
                <input
                  type="text"
                  value={config.trc20Address}
                  onChange={(e) => setConfig({ ...config, trc20Address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Platform USDT ERC-20 Receiving Address (Ethereum Network)
                </label>
                <input
                  type="text"
                  value={config.erc20Address}
                  onChange={(e) => setConfig({ ...config, erc20Address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Min Deposit (USDT)</label>
                  <input
                    type="number"
                    value={config.minDepositUSDT}
                    onChange={(e) => setConfig({ ...config, minDepositUSDT: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Min Withdraw (USDT)</label>
                  <input
                    type="number"
                    value={config.minWithdrawUSDT}
                    onChange={(e) => setConfig({ ...config, minWithdrawUSDT: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Withdraw Fee (USDT)</label>
                  <input
                    type="number"
                    value={config.withdrawFeeUSDT}
                    onChange={(e) => setConfig({ ...config, withdrawFeeUSDT: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Official Telegram Support Link (សេវាកម្មអតិថិជន ២៤/៧ Telegram)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.telegramSupport}
                    onChange={(e) => setConfig({ ...config, telegramSupport: e.target.value })}
                    placeholder="https://t.me/customerserver1"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-xs"
                  />
                  <a
                    href={config.telegramSupport?.startsWith('http') ? config.telegramSupport : `https://t.me/${config.telegramSupport}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                  >
                    <span>Test</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {configSaved && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>Platform configuration updated successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition"
                >
                  Save Settings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Reset entire platform database back to initial seed state?')) {
                      store.resetToDefaults();
                      location.reload();
                    }
                  }}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-xl text-xs transition"
                >
                  Reset Demo Data
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 7: SUPPORT CHAT BACK-OFFICE */}
        {activeTab === 'support' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">{t.adminSupportTab}</h3>
              <p className="text-xs text-slate-400">Respond directly to users in the customer service channel</p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-80 overflow-y-auto space-y-2">
              {chats.map((msg) => (
                <div key={msg.id} className="text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800/80">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-blue-400">{msg.senderName} ({msg.role})</span>
                    <span className="font-mono">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-slate-200">{msg.text}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAdminReply} className="flex gap-2">
              <input
                type="text"
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="Type response as Admin to user..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL 1: CREATE NEW USER */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">{t.createNewUser}</h3>
              </div>
              <button
                onClick={() => setIsCreateUserModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-3.5 text-xs max-h-[85vh] overflow-y-auto">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. trader_vip99"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. VIP Investor Alex"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="client@invest.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Phone / Telegram</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+855 12 345 678"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Initial USDT Balance</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={newInitialBalance}
                      onChange={(e) => setNewInitialBalance(e.target.value)}
                      placeholder="5000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-3 pr-10 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-bold">USDT</span>
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">VIP Tier</label>
                  <select
                    value={newVipLevel}
                    onChange={(e) => setNewVipLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-2.5 text-white font-bold focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        VIP {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Client USDT TRC-20 Wallet Address (Optional)</label>
                <input
                  type="text"
                  value={newTrc20}
                  onChange={(e) => setNewTrc20(e.target.value)}
                  placeholder="e.g. T..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {createUserError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  {createUserError}
                </div>
              )}

              {createUserSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{createUserSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition mt-2"
              >
                {t.createNewUser}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COMPLETE BALANCE & USER MANAGER (កែចំនួនលុយ និងគ្រប់គ្រងសមតុល្យ) */}
      {isEditUserModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {language === 'km' ? 'កែចំនួនលុយ & គ្រប់គ្រងគណនី' : 'Edit Money & User Management'}
                  </h3>
                  <p className="text-[10px] text-slate-400">User: <b className="text-white">{selectedUser.username}</b></p>
                </div>
              </div>
              <button
                onClick={() => setIsEditUserModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditMode('exact')}
                className={`flex-1 py-2.5 text-center transition ${
                  editMode === 'exact'
                    ? 'text-emerald-400 border-b-2 border-emerald-500 bg-emerald-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'km' ? 'កំណត់សមតុល្យ & ប្រាក់ដាក់' : 'Set Exact Balance & Deposits'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode('delta')}
                className={`flex-1 py-2.5 text-center transition ${
                  editMode === 'delta'
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'km' ? 'បូក/ដក (+ / - Adjust)' : '+ / - Adjust Balance'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode('profile')}
                className={`flex-1 py-2.5 text-center transition ${
                  editMode === 'profile'
                    ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {language === 'km' ? 'កែទិន្នន័យគណនី' : 'Edit Profile & Stats'}
              </button>
            </div>

            <div className="p-6 text-xs max-h-[75vh] overflow-y-auto space-y-4">
              {/* Balance Summary Header */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Current Available Balance</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {selectedUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Deposited</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {selectedUser.totalDeposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT
                  </span>
                </div>
              </div>

              {/* MODE 1: SET EXACT BALANCE & TOTAL DEPOSITED DIRECTLY */}
              {editMode === 'exact' && (
                <form onSubmit={handleSaveExactBalance} className="space-y-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'km' ? 'កែសមតុល្យដែលអាចប្រើបាន (Available USDT Balance)' : 'Set Available USDT Balance'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={exactBalanceInput}
                        onChange={(e) => setExactBalanceInput(e.target.value)}
                        className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl py-3 pl-3 pr-16 text-white font-mono text-base font-black focus:outline-none focus:border-emerald-400"
                        required
                      />
                      <span className="absolute right-3 top-3.5 font-bold text-slate-400 text-xs">USDT</span>
                    </div>
                  </div>

                  {/* Fast balance presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1000, 10000, 100000, 1000000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setExactBalanceInput(preset.toString())}
                        className="py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-mono text-slate-300 transition"
                      >
                        ${preset >= 1000000 ? `${preset / 1000000}M` : `${preset / 1000}K`}
                      </button>
                    ))}
                  </div>

                  {/* Direct Edit of Total Deposited (ចំនួនលុយដែលបានដាក់រួច) */}
                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'km' ? 'កែប្រែចំនួនលុយដែលបានដាក់រួចសរុប (Total Deposited USDT)' : 'Set Total Deposited USDT'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={exactTotalDepositedInput}
                        onChange={(e) => setExactTotalDepositedInput(e.target.value)}
                        className="w-full bg-slate-950 border border-blue-500/50 rounded-xl py-2.5 pl-3 pr-16 text-white font-mono text-sm font-bold focus:outline-none focus:border-blue-400"
                        required
                      />
                      <span className="absolute right-3 top-3 font-bold text-slate-400 text-xs">USDT</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {language === 'km' ? 'តួលេខនេះនឹងត្រូវបង្ហាញក្នុងទំព័រ My Assets របស់អតិថិជន' : 'This value is displayed as Total Deposited on the user dashboard'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      {language === 'km' ? 'កំណត់ចំណាំ ឬមូលហេតុ (Note / Reason)' : 'Reason / Audit Note'}
                    </label>
                    <input
                      type="text"
                      value={exactBalanceNote}
                      onChange={(e) => setExactBalanceNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {editSuccessMsg && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition"
                  >
                    {language === 'km' ? 'រក្សាទុកចំនួនសមតុល្យ & ប្រាក់ដាក់រួច' : 'Save Balance & Deposited Amount'}
                  </button>
                </form>
              )}

              {/* MODE 2: DELTA ADJUST (+ / -) */}
              {editMode === 'delta' && (
                <form onSubmit={handleSaveAdjustBalance} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAdjustType('add')}
                      className={`py-2 rounded-xl font-bold transition ${
                        adjustType === 'add'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      + {language === 'km' ? 'បន្ថែមលុយ' : 'Credit (+) Balance'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('deduct')}
                      className={`py-2 rounded-xl font-bold transition ${
                        adjustType === 'deduct'
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      - {language === 'km' ? 'កាត់លុយ' : 'Debit (-) Balance'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      {language === 'km' ? 'ចំនួនទឹកប្រាក់ (USDT Amount)' : 'Adjustment Amount (USDT)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      {language === 'km' ? 'មូលហេតុ (Reason)' : 'Adjustment Reason'}
                    </label>
                    <input
                      type="text"
                      value={adjustReason}
                      onChange={(e) => setAdjustReason(e.target.value)}
                      placeholder="e.g. VIP deposit bonus, manual credit"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {editSuccessMsg && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition"
                  >
                    {language === 'km' ? 'បញ្ជាក់ការកែប្រែសមតុល្យ' : 'Apply Balance Adjustment'}
                  </button>
                </form>
              )}

              {/* MODE 3: PROFILE & STATS EDIT */}
              {editMode === 'profile' && (
                <form onSubmit={handleSaveProfileEdit} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">VIP Tier</label>
                      <select
                        value={editVipLevel}
                        onChange={(e) => setEditVipLevel(parseInt(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-2.5 text-white font-bold focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            VIP {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Total Deposited (USDT)</label>
                      <input
                        type="number"
                        step="any"
                        value={editTotalDeposited}
                        onChange={(e) => setEditTotalDeposited(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-medium mb-1">Total Earnings (USDT)</label>
                      <input
                        type="number"
                        step="any"
                        value={editTotalEarned}
                        onChange={(e) => setEditTotalEarned(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">New Password</label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Leave unchanged or type new password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">User USDT TRC-20 Wallet Address</label>
                    <input
                      type="text"
                      value={editWalletTRC20}
                      onChange={(e) => setEditWalletTRC20(e.target.value)}
                      placeholder="T..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* KYC Status Override */}
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      {language === 'km' ? 'ស្ថានភាពផ្ទៀងផ្ទាត់ (KYC Verification Status)' : 'Identity Verification (KYC) Status'}
                    </label>
                    <select
                      value={editKycStatus}
                      onChange={(e) => setEditKycStatus(e.target.value as KYCStatus)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-2.5 text-white font-bold text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="unverified">Unverified (មិនទាន់ផ្ទៀងផ្ទាត់)</option>
                      <option value="pending">Pending Admin Review (រង់ចាំការអនុម័ត ⏳)</option>
                      <option value="verified">Verified ✓ (បានផ្ទៀងផ្ទាត់ - ដោះសោការដាក់/ដកប្រាក់)</option>
                      <option value="rejected">Rejected ✕ (បដិសេធ)</option>
                    </select>
                  </div>

                  {editSuccessMsg && (
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>{editSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg transition"
                  >
                    {language === 'km' ? 'រក្សាទុកទិន្នន័យគណនី' : 'Save Profile Changes'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT DEPOSIT TRANSACTION AMOUNT (កែប្រែចំនួនប្រាក់ដាក់ដែលបានដាក់រួច) */}
      {isEditDepositModalOpen && selectedDepositTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  {language === 'km' ? 'កែប្រែចំនួនប្រាក់ដាក់ (Edit Deposit Amount)' : 'Edit Deposit Transaction'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditDepositModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditDeposit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>User:</span>
                  <span className="font-bold text-white">{selectedDepositTx.username}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tx Status:</span>
                  <span className="font-bold capitalize text-emerald-400">{selectedDepositTx.status}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Current Deposited:</span>
                  <span className="font-mono font-bold text-white">+{selectedDepositTx.amount.toLocaleString()} USDT</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'ចំនួនប្រាក់ដាក់ថ្មី (New Deposit Amount USDT)' : 'New Deposit Amount (USDT)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={editDepositAmount}
                    onChange={(e) => setEditDepositAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl py-2.5 pl-3 pr-16 text-white font-mono text-sm font-bold focus:outline-none focus:border-emerald-400"
                    required
                  />
                  <span className="absolute right-3 top-3 font-bold text-slate-400 text-xs">USDT</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {language === 'km'
                    ? 'ប្រសិនបើប្រតិបត្តិការនេះបាន Approve រួច សមតុល្យអ្នកប្រើប្រាស់នឹងត្រូវកែប្រែដោយស្វ័យប្រវត្តិតាមចំនួនខុសគ្នា។'
                    : 'If already approved, the user balance & total deposited will automatically adjust by the difference.'}
                </span>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {language === 'km' ? 'កំណត់សម្គាល់ (Note)' : 'Reason / Note'}
                </label>
                <input
                  type="text"
                  value={editDepositNote}
                  onChange={(e) => setEditDepositNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {depositEditSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{depositEditSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                {language === 'km' ? 'រក្សាទុកចំនួនប្រាក់ដាក់ថ្មី' : 'Confirm New Deposit Amount'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD MANUAL DEPOSIT (+ បន្ថែមការដាក់ប្រាក់ដោយដៃ) */}
      {isAddManualDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">
                  {language === 'km' ? 'បន្ថែមការដាក់ប្រាក់ជូនអ្នកប្រើ' : 'Add Manual Deposit for User'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddManualDepositModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualDeposit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'km' ? 'ជ្រើសរើសអ្នកប្រើប្រាស់ (Select User)' : 'Target User'} <span className="text-red-400">*</span>
                </label>
                <select
                  value={manualDepositUserId}
                  onChange={(e) => setManualDepositUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-bold focus:outline-none focus:border-blue-500"
                  required
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} (Bal: {u.balance.toLocaleString()} USDT)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {language === 'km' ? 'ចំនួនប្រាក់ដាក់ (Deposit Amount USDT)' : 'Deposit Amount (USDT)'} <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={manualDepositAmount}
                    onChange={(e) => setManualDepositAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-3 pr-16 text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="absolute right-3 top-2.5 font-bold text-slate-400 text-xs">USDT</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Network</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setManualDepositNetwork('TRC-20')}
                    className={`py-1.5 rounded-lg border font-bold transition ${
                      manualDepositNetwork === 'TRC-20' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    TRC-20 (Tron)
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualDepositNetwork('ERC-20')}
                    className={`py-1.5 rounded-lg border font-bold transition ${
                      manualDepositNetwork === 'ERC-20' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    ERC-20 (Ethereum)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">TxID / Hash (Optional)</label>
                <input
                  type="text"
                  value={manualDepositTxHash}
                  onChange={(e) => setManualDepositTxHash(e.target.value)}
                  placeholder="e.g. 5d84a7..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono text-[11px] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {language === 'km' ? 'កំណត់ចំណាំ (Note)' : 'Note'}
                </label>
                <input
                  type="text"
                  value={manualDepositNote}
                  onChange={(e) => setManualDepositNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {manualDepositSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{manualDepositSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                {language === 'km' ? 'បញ្ចូលការដាក់ប្រាក់ភ្លាមៗ' : 'Credit Deposit Immediately'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT INVESTMENT PLAN (កែប្រែកញ្ចប់វិនីយោគ និងចំនួនអប្បបរមា) */}
      {isEditPlanModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {language === 'km' ? 'កែប្រែកញ្ចប់វិនីយោគ' : 'Edit Investment Plan'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedPlan.id} ({selectedPlan.days} Days)</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditPlanModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPlan} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {language === 'km' ? 'ឈ្មោះកញ្ចប់ (Plan Title)' : 'Plan Title'}
                </label>
                <input
                  type="text"
                  value={editPlanTitle}
                  onChange={(e) => setEditPlanTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {language === 'km' ? 'វិនីយោគអប្បបរមា (Min USDT)' : 'Min Investment (USDT)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={editPlanMinAmount}
                    onChange={(e) => setEditPlanMinAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                  <span className="text-[10px] text-emerald-400 mt-0.5 block">
                    {language === 'km' ? 'ចាប់ផ្តើមពី 100 USDT' : 'e.g. 100 USDT'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    {language === 'km' ? 'វិនីយោគអតិបរមា (Max USDT)' : 'Max Investment (USDT)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={editPlanMaxAmount}
                    onChange={(e) => setEditPlanMaxAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  {language === 'km' ? 'ផលចំណេញប្រចាំថ្ងៃ (% / Day ROI)' : 'Daily ROI (% / Day)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={editPlanDailyRate}
                  onChange={(e) => setEditPlanDailyRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-white font-mono focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              {editPlanSuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{editPlanSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
              >
                {language === 'km' ? 'រក្សាទុកការកែប្រែកញ្ចប់' : 'Save Plan Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INSPECT KYC SUBMISSION & DOCUMENTS */}
      {isKycInspectModalOpen && selectedKycSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl relative my-6 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                    <span>{language === 'km' ? 'ពិនិត្យឯកសារផ្ទៀងផ្ទាត់អត្តសញ្ញាណ' : 'Inspect KYC Verification Documents'}</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                      {selectedKycSub.documentType.replace('_', ' ')}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {language === 'km' ? 'សូមត្រួតពិនិត្យរូបថត និងព័ត៌មានមុនពេលសម្រេចអនុម័ត' : 'Verify document authenticity before approving or rejecting'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsKycInspectModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Applicant Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Username</span>
                  <span className="font-bold text-white text-xs font-mono">{selectedKycSub.username}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Full Legal Name</span>
                  <span className="font-bold text-white text-xs">{selectedKycSub.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Document ID Number</span>
                  <span className="font-bold text-emerald-400 text-xs font-mono">{selectedKycSub.idNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Date of Birth / Nat.</span>
                  <span className="font-medium text-slate-300 text-[11px]">
                    {selectedKycSub.dateOfBirth || '-'} ({selectedKycSub.nationality || 'Cambodia'})
                  </span>
                </div>
              </div>

              {/* Status Alert */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Submission Status:</span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedKycSub.status === 'verified'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : selectedKycSub.status === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {selectedKycSub.status.toUpperCase()}
                </span>
              </div>

              {/* Document Images */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-200">
                  {language === 'km' ? 'រូបភាពឯកសារដែលបានបញ្ជូន' : 'Submitted Document Images'}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Front Image */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      {language === 'km' ? 'រូបថតផ្ទៃមុខ (Front Side)' : 'Front Side Photo'}
                    </span>
                    <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video group">
                      <img
                        src={selectedKycSub.frontImageUrl}
                        alt="Front Side"
                        className="w-full h-full object-contain"
                      />
                      <a
                        href={selectedKycSub.frontImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Zoom</span>
                      </a>
                    </div>
                  </div>

                  {/* Back Image (if exists) */}
                  {selectedKycSub.backImageUrl && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-300 block">
                        {language === 'km' ? 'រូបថតផ្ទៃក្រោយ (Back Side)' : 'Back Side Photo'}
                      </span>
                      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video group">
                        <img
                          src={selectedKycSub.backImageUrl}
                          alt="Back Side"
                          className="w-full h-full object-contain"
                        />
                        <a
                          href={selectedKycSub.backImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Zoom</span>
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Selfie Image (if exists) */}
                  {selectedKycSub.selfieImageUrl && (
                    <div className="space-y-1.5 sm:col-span-2">
                      <span className="text-[11px] font-semibold text-slate-300 block">
                        {language === 'km' ? 'រូបថតកាន់ឯកសារផ្ទៀងផ្ទាត់ (Selfie Verification)' : 'Selfie Verification with Document'}
                      </span>
                      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-black h-48 group">
                        <img
                          src={selectedKycSub.selfieImageUrl}
                          alt="Selfie"
                          className="w-full h-full object-contain"
                        />
                        <a
                          href={selectedKycSub.selfieImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black text-white text-[10px] font-semibold flex items-center gap-1 backdrop-blur-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Zoom</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-10">
              <button
                type="button"
                onClick={() => setIsKycInspectModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
              >
                {language === 'km' ? 'បិទ' : 'Close'}
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenRejectKYC(selectedKycSub)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{language === 'km' ? 'បដិសេធ' : 'Reject KYC'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApproveKYC(selectedKycSub.id)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{language === 'km' ? 'អនុម័តការផ្ទៀងផ្ទាត់ (Approve)' : 'Approve KYC'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REJECT KYC WITH REASON */}
      {isKycRejectModalOpen && selectedKycSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  {language === 'km' ? 'បដិសេធការផ្ទៀងផ្ទាត់អត្តសញ្ញាណ' : 'Reject KYC Verification'}
                </h3>
              </div>
              <button
                onClick={() => setIsKycRejectModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Investor:</span>
                  <span className="font-bold text-white">{selectedKycSub.fullName} ({selectedKycSub.username})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Document Type:</span>
                  <span className="font-mono text-slate-300 uppercase">{selectedKycSub.documentType.replace('_', ' ')}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {language === 'km' ? 'មូលហេតុនៃការបដិសេធ (Rejection Reason) *' : 'Rejection Reason *'}
                </label>
                <textarea
                  value={kycRejectReason}
                  onChange={(e) => setKycRejectReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                ></textarea>
              </div>

              {/* Quick Reason Suggestions */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block">
                  {language === 'km' ? 'មូលហេតុរហ័ស:' : 'Quick Presets:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'រូបថតឯកសារមិនច្បាស់ សូមថតឡើងវិញ',
                    'ឈ្មោះមិនត្រូវគ្នានឹងឯកសារ',
                    'ឯកសារផុតកំណត់ ឬមិនត្រឹមត្រូវ',
                  ].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setKycRejectReason(reason)}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded text-[10px] transition"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsKycRejectModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition text-xs"
                >
                  {language === 'km' ? 'ថយក្រោយ' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRejectKYC}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-md shadow-rose-600/30 text-xs"
                >
                  {language === 'km' ? 'បញ្ជាក់ការបដិសេធ' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
