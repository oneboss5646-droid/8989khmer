import {
  User,
  Transaction,
  InvestmentPlan,
  UserInvestment,
  ChatMessage,
  PlatformConfig,
  KYCSubmission,
  KYCDocumentType,
  KYCStatus,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'cryptovest_users',
  TRANSACTIONS: 'cryptovest_transactions',
  PLANS: 'cryptovest_plans',
  INVESTMENTS: 'cryptovest_investments',
  CHATS: 'cryptovest_chats',
  CONFIG: 'cryptovest_config',
  CURRENT_USER: 'cryptovest_current_user',
  ADMIN_LOGGED_IN: 'cryptovest_admin_logged_in',
  KYC: 'cryptovest_kyc_submissions',
};

// Default platform configuration matching user uploaded wallet
const defaultConfig: PlatformConfig = {
  trc20Address: 'TDJwikTF1gA7SEkp3yxcKMNtNS5vk2AJtV',
  erc20Address: '0x71C8360f38bB1D65bA1889De9965B796bF95368a',
  minDepositUSDT: 0.01,
  minWithdrawUSDT: 20,
  withdrawFeeUSDT: 1,
  telegramSupport: 'https://t.me/customerserver1',
  onlineServiceHours: '24/7 Mon-Sun',
};

// Default investment packages: Investing in BTC Coin using USDT currency
const defaultPlans: InvestmentPlan[] = [
  {
    id: 'plan-7d',
    title: '7-Day BTC Mining Node',
    days: 7,
    dailyRate: 1.00,
    minAmount: 100, // Starts from 100 USDT as requested
    maxAmount: 50000,
    featured: true,
    coin: 'BTC',
    settlementCurrency: 'USDT',
    description: 'Bitcoin cloud mining node. Daily return calculated in USDT.',
  },
  {
    id: 'plan-14d',
    title: '14-Day BTC Hashrate Pool',
    days: 14,
    dailyRate: 1.30,
    minAmount: 1000,
    maxAmount: 100000,
    coin: 'BTC',
    settlementCurrency: 'USDT',
    description: 'Bitcoin quantitative hashrate pool with daily USDT distribution.',
  },
  {
    id: 'plan-30d',
    title: '30-Day BTC VIP Staking',
    days: 30,
    dailyRate: 1.80,
    minAmount: 3000,
    maxAmount: 300000,
    coin: 'BTC',
    settlementCurrency: 'USDT',
    description: 'Institutional Bitcoin staking contract funded via USDT.',
  },
  {
    id: 'plan-60d',
    title: '60-Day BTC ASIC Mining Cluster',
    days: 60,
    dailyRate: 2.20,
    minAmount: 10000,
    maxAmount: 1000000,
    coin: 'BTC',
    settlementCurrency: 'USDT',
    description: 'High-power Bitcoin ASIC cluster yielding daily USDT returns.',
  },
  {
    id: 'plan-90d',
    title: '90-Day BTC Institutional Super-Node',
    days: 90,
    dailyRate: 3.00,
    minAmount: 25000,
    maxAmount: 5000000,
    coin: 'BTC',
    settlementCurrency: 'USDT',
    description: 'Premier Bitcoin tier super-node with maximum daily yield in USDT.',
  },
];

// Seeded users: Admin and VIP users
const defaultUsers: User[] = [
  {
    id: 'user-mk887',
    username: 'mk887',
    fullName: 'VIP Trader mk887',
    email: 'mk887@crypto.invest',
    phone: '+855 12 887 999',
    passwordHash: 'password123',
    balance: 9682473.00, // Matches screenshot available balance
    totalDeposited: 1041500.00, // Matches screenshot deposit field
    totalWithdrawn: 120000.00,
    totalEarned: 245900.00,
    vipLevel: 6,
    status: 'active',
    createdAt: '2026-09-01T10:00:00Z',
    walletAddressTRC20: 'TXYZ1234567890abcdefTRC20mk887',
    walletAddressERC20: '0x887abcdef12345678901234567890ERC20',
    kycStatus: 'verified',
    kycDocumentType: 'national_id',
    kycIdNumber: '010892789',
    kycVerifiedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'user-alex',
    username: 'trader_alex',
    fullName: 'Alex Sovann',
    email: 'alex@crypto.invest',
    phone: '+855 88 555 1234',
    passwordHash: 'user1234',
    balance: 15500.00,
    totalDeposited: 20000.00,
    totalWithdrawn: 6000.00,
    totalEarned: 1500.00,
    vipLevel: 2,
    status: 'active',
    createdAt: '2026-09-15T14:30:00Z',
    walletAddressTRC20: 'TAlexTRC20Wallet77889900112233',
    kycStatus: 'pending',
    kycDocumentType: 'drivers_license',
    kycIdNumber: 'DL-8855-2024',
  },
];

// Seeded KYC submissions for verification queue in Admin Panel
const defaultKYCSubmissions: KYCSubmission[] = [
  {
    id: 'kyc-sub-001',
    userId: 'user-alex',
    username: 'trader_alex',
    fullName: 'Alex Sovann',
    documentType: 'drivers_license',
    idNumber: 'DL-8855-2024',
    dateOfBirth: '1992-05-18',
    nationality: 'Cambodia',
    frontImageUrl: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=600&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    selfieImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    status: 'pending',
    submittedAt: '2026-10-14T03:15:00Z',
  },
  {
    id: 'kyc-sub-002',
    userId: 'user-mk887',
    username: 'mk887',
    fullName: 'VIP Trader mk887',
    documentType: 'national_id',
    idNumber: '010892789',
    dateOfBirth: '1988-11-23',
    nationality: 'Cambodia',
    frontImageUrl: 'https://images.unsplash.com/photo-1554415707-9e4466b0a82b?auto=format&fit=crop&w=600&q=80',
    backImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    status: 'verified',
    submittedAt: '2026-09-01T14:00:00Z',
    reviewedAt: '2026-09-02T10:00:00Z',
    reviewedBy: 'Admin (System)',
    adminNotes: 'Documents fully verified and authentic.',
  },
];

const defaultInvestments: UserInvestment[] = [
  {
    id: 'inv-1',
    userId: 'user-mk887',
    username: 'mk887',
    planId: 'plan-7d',
    planTitle: '7-Day USDT Growth',
    amount: 50000,
    dailyRate: 1.00,
    durationDays: 7,
    daysElapsed: 3,
    totalEarned: 1500,
    startDate: '2026-10-09T08:00:00Z',
    endDate: '2026-10-16T08:00:00Z',
    status: 'active',
    lastYieldClaimDate: '2026-10-12T00:00:00Z',
  },
];

const defaultTransactions: Transaction[] = [
  {
    id: 'tx-dep-101',
    userId: 'user-mk887',
    username: 'mk887',
    type: 'deposit',
    amount: 27400,
    network: 'TRC-20',
    walletAddress: 'TYDzm9QpKmR2U3c7jNxk9WbPxH9cEa83vL',
    txHash: 'e7f4c51b69828d082fa1839e5518b108874ca9938f71295b21',
    status: 'approved',
    note: 'USDT TRC20 Deposit confirmed by Admin',
    createdAt: '2026-10-12T07:15:00Z',
    processedAt: '2026-10-12T07:18:00Z',
  },
  {
    id: 'tx-dep-102',
    userId: 'user-alex',
    username: 'trader_alex',
    type: 'deposit',
    amount: 5000,
    network: 'TRC-20',
    walletAddress: 'TYDzm9QpKmR2U3c7jNxk9WbPxH9cEa83vL',
    txHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    status: 'pending',
    note: 'Waiting for Admin review',
    createdAt: '2026-10-12T18:40:00Z',
  },
  {
    id: 'tx-wd-201',
    userId: 'user-alex',
    username: 'trader_alex',
    type: 'withdrawal',
    amount: 1200,
    network: 'TRC-20',
    walletAddress: 'TAlexTRC20Wallet77889900112233',
    status: 'pending',
    note: 'USDT Withdrawal Request',
    createdAt: '2026-10-12T19:00:00Z',
  },
];

const defaultChats: ChatMessage[] = [
  {
    id: 'chat-1',
    senderId: 'system',
    senderName: 'Customer Support VIP',
    role: 'admin',
    text: 'Hello, welcome to QuantYield Global VIP Support! How can I assist you with your deposit, withdrawal, or staking investment today?',
    timestamp: '2026-10-12T18:00:00Z',
  },
];

type Listener = () => void;

class PlatformStore {
  private listeners: Listener[] = [];
  private syncChannel: BroadcastChannel | null = null;

  constructor() {
    this.init();
    this.setupCrossTabSync();
  }

  private setupCrossTabSync() {
    if (typeof window !== 'undefined') {
      // Listen to native window storage events across tabs
      window.addEventListener('storage', () => {
        this.notifyLocal();
      });

      // BroadcastChannel for instant inter-tab communication
      if ('BroadcastChannel' in window) {
        try {
          this.syncChannel = new BroadcastChannel('quantyield_store_sync');
          this.syncChannel.onmessage = (event) => {
            if (event.data?.type === 'STORE_MUTATION') {
              this.notifyLocal();
            }
          };
        } catch {
          this.syncChannel = null;
        }
      }
    }
  }

  private init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLANS)) {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(defaultPlans));
    } else {
      // Ensure investment plans reflect Bitcoin (BTC) coin and USDT currency
      try {
        const storedPlans: InvestmentPlan[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANS)!);
        let updated = false;
        storedPlans.forEach((p) => {
          if (!p.coin || p.coin !== 'BTC' || !p.title.includes('BTC')) {
            const def = defaultPlans.find(dp => dp.id === p.id);
            if (def) {
              p.title = def.title;
              p.coin = 'BTC';
              p.settlementCurrency = 'USDT';
              p.description = def.description;
              updated = true;
            }
          }
          if (p.id === 'plan-7d' && p.minAmount !== 100) {
            p.minAmount = 100;
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(storedPlans));
        }
      } catch {
        localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(defaultPlans));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVESTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(defaultInvestments));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(defaultTransactions));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(defaultChats));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(defaultConfig));
    } else {
      // Ensure the official wallet matches the user's latest provided address and Telegram support
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)!);
        stored.trc20Address = 'TDJwikTF1gA7SEkp3yxcKMNtNS5vk2AJtV';
        stored.minDepositUSDT = 0.01;
        stored.telegramSupport = 'https://t.me/customerserver1';
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(stored));
      } catch {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(defaultConfig));
      }
    }
    // Initialize KYC Submissions storage
    if (!localStorage.getItem(STORAGE_KEYS.KYC)) {
      localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(defaultKYCSubmissions));
    }

    // REQUIRE SCREEN 1 (LOGIN / SELF-REGISTRATION) FOR CUSTOMERS:
    // Do NOT auto-login demo accounts. If a demo account (mk887 or alex) was previously persisted in session,
    // clear it so users always see the personal Login & Self-Registration screen first as requested.
    const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedCurrentUser) {
      try {
        const u = JSON.parse(storedCurrentUser);
        if (u.id === 'user-mk887' || u.id === 'user-alex') {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyLocal() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (err) {
        console.error('Store listener error:', err);
      }
    });
  }

  private notify() {
    this.notifyLocal();
    if (this.syncChannel) {
      try {
        this.syncChannel.postMessage({ type: 'STORE_MUTATION', timestamp: Date.now() });
      } catch {
        // channel error ignore
      }
    }
  }

  // --- CONFIG ---
  public getConfig(): PlatformConfig {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    return raw ? JSON.parse(raw) : defaultConfig;
  }

  public updateConfig(newConfig: Partial<PlatformConfig>) {
    const current = this.getConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    this.notify();
  }

  // --- USERS ---
  public getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : defaultUsers;
  }

  public getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  public getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username.toLowerCase() === username.toLowerCase().trim());
  }

  // Admin creates new user account (Crucial requirement)
  public createUser(userData: {
    username: string;
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    initialBalance: number;
    vipLevel: number;
    walletAddressTRC20?: string;
    walletAddressERC20?: string;
  }): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    const existing = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase().trim());
    if (existing) {
      return { success: false, message: 'Username already exists in the system.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username.trim(),
      fullName: userData.fullName.trim() || userData.username,
      email: userData.email.trim(),
      phone: userData.phone?.trim() || '',
      passwordHash: userData.password,
      balance: Number(userData.initialBalance) || 0,
      totalDeposited: Number(userData.initialBalance) || 0,
      totalWithdrawn: 0,
      totalEarned: 0,
      vipLevel: Number(userData.vipLevel) || 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      walletAddressTRC20: userData.walletAddressTRC20 || '',
      walletAddressERC20: userData.walletAddressERC20 || '',
      kycStatus: 'unverified',
    };

    users.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // If initial balance > 0, log an initial deposit transaction
    if (userData.initialBalance > 0) {
      this.addTransaction({
        userId: newUser.id,
        username: newUser.username,
        type: 'deposit',
        amount: userData.initialBalance,
        network: 'TRC-20',
        status: 'approved',
        note: 'Initial account credit provisioned by Admin',
      });
    }

    this.notify();
    return { success: true, user: newUser };
  }

  // Client Self-Registration (អតិថិជនចុះឈ្មោះគណនីដោយខ្លួនឯង)
  public registerUser(userData: {
    username: string;
    fullName?: string;
    password: string;
    email?: string;
    phone?: string;
  }): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    const cleanUsername = userData.username.trim();
    if (!cleanUsername) {
      return { success: false, message: 'សូមបញ្ចូលឈ្មោះគណនី (Username required).' };
    }

    const existing = users.find(u => u.username.toLowerCase() === cleanUsername.toLowerCase());
    if (existing) {
      return { success: false, message: 'ឈ្មោះគណនីនេះត្រូវបានប្រើប្រាស់រួចហើយ សូមជ្រើសរើសឈ្មោះផ្សេង (Username already taken).' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      fullName: userData.fullName?.trim() || cleanUsername,
      email: userData.email?.trim() || `${cleanUsername}@crypto.invest`,
      phone: userData.phone?.trim() || '',
      passwordHash: userData.password,
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      totalEarned: 0,
      vipLevel: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
      walletAddressTRC20: '',
      walletAddressERC20: '',
      kycStatus: 'unverified',
    };

    users.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    this.notify();
    return { success: true, user: newUser };
  }

  // Admin modifies balance (Credit or Debit)
  public adjustUserBalance(userId: string, amountDelta: number, note: string): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    const user = users[index];
    const newBalance = Math.max(0, user.balance + amountDelta);
    user.balance = newBalance;
    if (amountDelta > 0) {
      user.totalDeposited += amountDelta;
    }

    users[index] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Log admin adjustment transaction
    this.addTransaction({
      userId: user.id,
      username: user.username,
      type: 'admin_adjustment',
      amount: amountDelta,
      status: 'approved',
      note: note || `Admin balance adjustment (${amountDelta > 0 ? '+' : ''}${amountDelta} USDT)`,
    });

    // Update current user session if it is this user
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    this.notify();
    return true;
  }

  // Admin directly sets exact balance (កែប្រែចំនួនលុយផ្ទាល់)
  public setExactUserBalance(userId: string, newBalance: number, note: string): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    const user = users[index];
    const oldBalance = user.balance;
    const delta = newBalance - oldBalance;
    user.balance = Math.max(0, newBalance);

    users[index] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    this.addTransaction({
      userId: user.id,
      username: user.username,
      type: 'admin_adjustment',
      amount: delta,
      status: 'approved',
      note: note || `Admin set exact balance to ${newBalance} USDT (was ${oldBalance} USDT)`,
    });

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }

    this.notify();
    return true;
  }

  // Admin updates user details
  public updateUser(userId: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return false;

    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
    }

    this.notify();
    return true;
  }

  // Admin deletes user
  public deleteUser(userId: string): boolean {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.logoutUser();
    }

    this.notify();
    return true;
  }

  // --- AUTHENTICATION ---
  public loginUser(usernameOrEmail: string, password: string): { success: boolean; message?: string; user?: User } {
    const users = this.getUsers();
    const query = usernameOrEmail.trim().toLowerCase();
    const user = users.find(u => u.username.toLowerCase() === query || u.email.toLowerCase() === query);

    if (!user) {
      return { success: false, message: 'Account not found. Accounts must be provisioned by Admin first.' };
    }

    if (user.passwordHash !== password) {
      return { success: false, message: 'Invalid password. Please check your credentials.' };
    }

    if (user.status === 'suspended') {
      return { success: false, message: 'Account has been temporarily suspended by Admin.' };
    }

    user.lastLogin = new Date().toISOString();
    this.updateUser(user.id, { lastLogin: user.lastLogin });
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notify();
    return { success: true, user };
  }

  public getCurrentUser(): User | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      // Re-fetch fresh data from stored users
      const fresh = this.getUserById(parsed.id);
      return fresh || parsed;
    } catch {
      return null;
    }
  }

  public logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.notify();
  }

  // Admin login check
  public isAdminLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
  }

  public loginAdmin(password: string): boolean {
    if (password === 'admin1234') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
      this.notify();
      return true;
    }
    return false;
  }

  public logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    this.notify();
  }

  // --- TRANSACTIONS ---
  public getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return raw ? JSON.parse(raw) : defaultTransactions;
  }

  public getUserTransactions(userId: string): Transaction[] {
    return this.getTransactions().filter(t => t.userId === userId);
  }

  public addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    const transactions = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    this.notify();
    return newTx;
  }

  // User submits USDT Deposit
  public submitDeposit(userId: string, amount: number, network: 'TRC-20' | 'ERC-20', txHash: string): Transaction | null {
    const user = this.getUserById(userId);
    if (!user) return null;

    const tx = this.addTransaction({
      userId,
      username: user.username,
      type: 'deposit',
      amount,
      network,
      walletAddress: network === 'TRC-20' ? this.getConfig().trc20Address : this.getConfig().erc20Address,
      txHash,
      status: 'pending',
      note: `Pending Admin verification for ${network} USDT deposit`,
    });
    return tx;
  }

  // User submits USDT Withdrawal
  // REQUIREMENT: Balance is NOT deducted upon submission.
  // Funds are ONLY deducted from the investor account after approval in the Admin Panel website!
  public submitWithdrawal(userId: string, amount: number, network: 'TRC-20' | 'ERC-20', walletAddress: string): { success: boolean; message?: string; tx?: Transaction } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found' };

    const config = this.getConfig();
    if (amount < config.minWithdrawUSDT) {
      return { success: false, message: `Minimum withdrawal is ${config.minWithdrawUSDT} USDT` };
    }

    if (user.balance < amount) {
      return { success: false, message: 'Insufficient available USDT balance' };
    }

    // Do NOT deduct balance here. Record pending withdrawal transaction waiting for Admin approval.
    const tx = this.addTransaction({
      userId,
      username: user.username,
      type: 'withdrawal',
      amount,
      network,
      walletAddress,
      status: 'pending',
      note: `សំណើដកប្រាក់ ${amount} USDT (រង់ចាំការអនុម័តពី Admin Panel ជាមុនសិន ទើបកាត់ចេញពីគណនី)`,
    });

    return { success: true, tx };
  }

  // Admin approves deposit (optional custom amount override)
  public approveDeposit(txId: string, customAmount?: number): boolean {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'deposit' || tx.status !== 'pending') return false;

    const finalAmount = customAmount !== undefined && customAmount > 0 ? customAmount : tx.amount;
    tx.amount = finalAmount;
    tx.status = 'approved';
    tx.processedAt = new Date().toISOString();
    tx.note = customAmount && customAmount !== tx.amount 
      ? `Deposit approved by Admin with adjusted amount: ${finalAmount} USDT`
      : 'Deposit approved by Admin. Funds added to balance.';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

    // Credit user balance and totalDeposited
    const user = this.getUserById(tx.userId);
    if (user) {
      user.balance += finalAmount;
      user.totalDeposited += finalAmount;
      this.updateUser(user.id, { balance: user.balance, totalDeposited: user.totalDeposited });
    }

    this.notify();
    return true;
  }

  // Admin edits the deposit amount of any deposit transaction (already approved or pending)
  public editDepositTransaction(txId: string, newAmount: number, note?: string): boolean {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'deposit') return false;

    const oldAmount = tx.amount;
    const delta = newAmount - oldAmount;
    tx.amount = newAmount;
    if (note) tx.note = note;

    const user = this.getUserById(tx.userId);
    // If this deposit was already approved, adjust the user's balance and totalDeposited by the difference
    if (tx.status === 'approved' && user) {
      user.balance = Math.max(0, user.balance + delta);
      user.totalDeposited = Math.max(0, user.totalDeposited + delta);
      this.updateUser(user.id, { balance: user.balance, totalDeposited: user.totalDeposited });
    }

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    this.notify();
    return true;
  }

  // Admin directly creates a manual deposit for a user
  public createManualDeposit(
    userId: string,
    amount: number,
    network: 'TRC-20' | 'ERC-20' = 'TRC-20',
    txHash: string = '',
    note: string = 'Manual deposit added by Admin'
  ): Transaction | null {
    const user = this.getUserById(userId);
    if (!user || amount <= 0) return null;

    const tx = this.addTransaction({
      userId: user.id,
      username: user.username,
      type: 'deposit',
      amount,
      network,
      txHash: txHash || `MANUAL-${Date.now()}`,
      status: 'approved',
      note,
      processedAt: new Date().toISOString(),
    });

    user.balance += amount;
    user.totalDeposited += amount;
    this.updateUser(user.id, { balance: user.balance, totalDeposited: user.totalDeposited });

    this.notify();
    return tx;
  }

  // Admin rejects deposit
  public rejectDeposit(txId: string, reason?: string): boolean {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'deposit' || tx.status !== 'pending') return false;

    tx.status = 'rejected';
    tx.processedAt = new Date().toISOString();
    tx.note = reason ? `Rejected by Admin: ${reason}` : 'Deposit rejected by Admin.';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

    this.notify();
    return true;
  }

  // Admin approves withdrawal: DEDUCTS balance from investor account and marks transaction approved
  public approveWithdrawal(
    txId: string,
    options?: {
      customAmount?: number;
      txHash?: string;
      adminNote?: string;
    }
  ): { success: boolean; message: string; deductedAmount?: number; newBalance?: number } {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'withdrawal') {
      return { success: false, message: 'Transaction not found or not a withdrawal' };
    }
    if (tx.status !== 'pending') {
      return { success: false, message: 'This withdrawal has already been processed' };
    }

    const user = this.getUserById(tx.userId);
    if (!user) {
      return { success: false, message: 'Associated investor account not found' };
    }

    const finalAmount = options?.customAmount !== undefined && options.customAmount > 0
      ? options.customAmount
      : tx.amount;

    if (user.balance < finalAmount) {
      return {
        success: false,
        message: `សមតុល្យគណនី ${user.username} មិនគ្រប់គ្រាន់ (មានតែ ${user.balance.toFixed(2)} USDT, ត្រូវការកាត់ ${finalAmount.toFixed(2)} USDT)`,
      };
    }

    // DEDUCT FROM INVESTOR ACCOUNT UPON ADMIN APPROVAL
    const oldBalance = user.balance;
    user.balance = Math.max(0, user.balance - finalAmount);
    user.totalWithdrawn += finalAmount;
    this.updateUser(user.id, { balance: user.balance, totalWithdrawn: user.totalWithdrawn });

    tx.amount = finalAmount;
    tx.status = 'approved';
    tx.processedAt = new Date().toISOString();
    if (options?.txHash) {
      tx.txHash = options.txHash;
    }
    tx.note = options?.adminNote || `បានអនុម័តដោយ Admin Panel និងកាត់ប្រាក់ចេញពីគណនីចំនួន -${finalAmount} USDT ដោយជោគជ័យ (សមតុល្យចាស់: ${oldBalance.toFixed(2)} USDT -> សមតុល្យថ្មី: ${user.balance.toFixed(2)} USDT)`;

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    this.notify();

    return {
      success: true,
      message: `បានអនុម័ត និងកាត់ប្រាក់ចំនួន ${finalAmount.toLocaleString()} USDT ចេញពីគណនី ${user.username} ដោយជោគជ័យ!`,
      deductedAmount: finalAmount,
      newBalance: user.balance,
    };
  }

  // Admin edits pending withdrawal transaction details before approving
  public editWithdrawalTransaction(
    txId: string,
    updates: {
      amount?: number;
      network?: 'TRC-20' | 'ERC-20';
      walletAddress?: string;
      note?: string;
    }
  ): boolean {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'withdrawal') return false;

    if (updates.amount !== undefined && updates.amount > 0) tx.amount = updates.amount;
    if (updates.network) tx.network = updates.network;
    if (updates.walletAddress) tx.walletAddress = updates.walletAddress;
    if (updates.note) tx.note = updates.note;

    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    this.notify();
    return true;
  }

  // Admin rejects withdrawal: NO balance deducted
  public rejectWithdrawal(txId: string, reason?: string): boolean {
    const transactions = this.getTransactions();
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.type !== 'withdrawal' || tx.status !== 'pending') return false;

    tx.status = 'rejected';
    tx.processedAt = new Date().toISOString();
    tx.note = reason
      ? `បដិសេធដោយ Admin: ${reason} (មិនមានការកាត់ប្រាក់ចេញពីគណនីឡើយ)`
      : 'ការដកប្រាក់ត្រូវបានបដិសេធដោយ Admin Panel (មិនមានការកាត់ប្រាក់ចេញពីគណនីឡើយ)';
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));

    this.notify();
    return true;
  }

  // --- INVESTMENT PLANS & STAKING ---
  public getPlans(): InvestmentPlan[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANS);
    return raw ? JSON.parse(raw) : defaultPlans;
  }

  public updatePlans(plans: InvestmentPlan[]) {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
    this.notify();
  }

  public updatePlan(planId: string, updates: Partial<InvestmentPlan>): boolean {
    const plans = this.getPlans();
    const index = plans.findIndex(p => p.id === planId);
    if (index === -1) return false;
    plans[index] = { ...plans[index], ...updates };
    this.updatePlans(plans);
    return true;
  }

  public getUserInvestments(userId: string): UserInvestment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    const list: UserInvestment[] = raw ? JSON.parse(raw) : defaultInvestments;
    return list.filter(i => i.userId === userId);
  }

  public getAllInvestments(): UserInvestment[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    return raw ? JSON.parse(raw) : defaultInvestments;
  }

  // Participate in staking investment
  public participateInPlan(userId: string, planId: string, amount: number): { success: boolean; message?: string; investment?: UserInvestment } {
    const user = this.getUserById(userId);
    if (!user) return { success: false, message: 'User not found' };

    const plans = this.getPlans();
    const plan = plans.find(p => p.id === planId);
    if (!plan) return { success: false, message: 'Plan not found' };

    if (amount < plan.minAmount) {
      return { success: false, message: `Minimum investment is ${plan.minAmount} USDT` };
    }
    if (amount > plan.maxAmount) {
      return { success: false, message: `Maximum investment is ${plan.maxAmount} USDT` };
    }
    if (user.balance < amount) {
      return { success: false, message: 'Insufficient available USDT balance' };
    }

    // Deduct principal from user balance
    user.balance -= amount;
    this.updateUser(user.id, { balance: user.balance });

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.days * 24 * 60 * 60 * 1000);

    const newInvestment: UserInvestment = {
      id: `inv-${Date.now()}`,
      userId: user.id,
      username: user.username,
      planId: plan.id,
      planTitle: plan.title,
      amount,
      dailyRate: plan.dailyRate,
      durationDays: plan.days,
      daysElapsed: 0,
      totalEarned: 0,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'active',
      lastYieldClaimDate: startDate.toISOString(),
    };

    const raw = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    const list: UserInvestment[] = raw ? JSON.parse(raw) : defaultInvestments;
    list.unshift(newInvestment);
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(list));

    // Log transaction
    this.addTransaction({
      userId: user.id,
      username: user.username,
      type: 'investment_principal',
      amount,
      status: 'approved',
      note: `Staked in ${plan.title} (${plan.days} Days @ ${plan.dailyRate}% daily)`,
    });

    this.notify();
    return { success: true, investment: newInvestment };
  }

  // Claim accrued yield
  public claimInvestmentYield(investmentId: string): { success: boolean; earnedAmount: number } {
    const raw = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    const list: UserInvestment[] = raw ? JSON.parse(raw) : defaultInvestments;
    const item = list.find(i => i.id === investmentId);
    if (!item || item.status !== 'active') return { success: false, earnedAmount: 0 };

    // Calculate accrued return (for demo, calculate 1 daily yield tick)
    const dailyIncome = (item.amount * item.dailyRate) / 100;
    item.daysElapsed = Math.min(item.durationDays, item.daysElapsed + 1);
    item.totalEarned += dailyIncome;
    if (item.daysElapsed >= item.durationDays) {
      item.status = 'completed';
    }

    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(list));

    // Credit user available balance
    const user = this.getUserById(item.userId);
    if (user) {
      user.balance += dailyIncome;
      user.totalEarned += dailyIncome;
      this.updateUser(user.id, { balance: user.balance, totalEarned: user.totalEarned });
    }

    // Record yield transaction
    this.addTransaction({
      userId: item.userId,
      username: item.username,
      type: 'investment_yield',
      amount: dailyIncome,
      status: 'approved',
      note: `Daily yield collected from ${item.planTitle}`,
    });

    this.notify();
    return { success: true, earnedAmount: dailyIncome };
  }

  // --- SUPPORT CHAT ---
  public getChats(): ChatMessage[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CHATS);
    return raw ? JSON.parse(raw) : defaultChats;
  }

  public sendChatMessage(senderId: string, senderName: string, role: 'user' | 'admin' | 'bot', text: string): ChatMessage {
    const chats = this.getChats();
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      role,
      text,
      timestamp: new Date().toISOString(),
    };
    chats.push(msg);
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    this.notify();
    return msg;
  }

  // --- KYC IDENTIFICATION & VERIFICATION ---
  public getKYCSubmissions(): KYCSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.KYC);
    return raw ? JSON.parse(raw) : [];
  }

  public getPendingKYCSubmissions(): KYCSubmission[] {
    return this.getKYCSubmissions().filter(k => k.status === 'pending');
  }

  public getUserKYC(userId: string): KYCSubmission | undefined {
    return this.getKYCSubmissions().find(k => k.userId === userId);
  }

  public submitKYC(data: {
    userId: string;
    username: string;
    fullName: string;
    documentType: KYCDocumentType;
    idNumber: string;
    dateOfBirth?: string;
    nationality?: string;
    frontImageUrl: string;
    backImageUrl?: string;
    selfieImageUrl?: string;
  }): { success: boolean; message?: string; submission?: KYCSubmission } {
    const submissions = this.getKYCSubmissions();
    const existingIndex = submissions.findIndex(s => s.userId === data.userId);

    const newSub: KYCSubmission = {
      id: `kyc-${Date.now()}`,
      userId: data.userId,
      username: data.username,
      fullName: data.fullName,
      documentType: data.documentType,
      idNumber: data.idNumber,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      frontImageUrl: data.frontImageUrl,
      backImageUrl: data.backImageUrl,
      selfieImageUrl: data.selfieImageUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      submissions[existingIndex] = newSub;
    } else {
      submissions.unshift(newSub);
    }
    localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(submissions));

    // Update user record: set to pending
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === data.userId);
    if (userIndex >= 0) {
      users[userIndex].kycStatus = 'pending';
      users[userIndex].kycSubmissionId = newSub.id;
      users[userIndex].kycDocumentType = data.documentType;
      users[userIndex].kycIdNumber = data.idNumber;
      delete users[userIndex].kycRejectionReason;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === data.userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
      }
    }

    this.notify();
    return { success: true, submission: newSub };
  }

  public approveKYC(submissionId: string, adminNotes?: string): { success: boolean; message?: string } {
    const submissions = this.getKYCSubmissions();
    const subIndex = submissions.findIndex(s => s.id === submissionId);
    if (subIndex === -1) {
      return { success: false, message: 'KYC submission not found.' };
    }

    const sub = submissions[subIndex];
    sub.status = 'verified';
    sub.reviewedAt = new Date().toISOString();
    sub.reviewedBy = 'Admin';
    if (adminNotes) sub.adminNotes = adminNotes;
    delete sub.rejectionReason;
    submissions[subIndex] = sub;
    localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(submissions));

    // Update user record
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === sub.userId);
    if (userIndex >= 0) {
      users[userIndex].kycStatus = 'verified';
      users[userIndex].kycVerifiedAt = sub.reviewedAt;
      users[userIndex].kycDocumentType = sub.documentType;
      users[userIndex].kycIdNumber = sub.idNumber;
      delete users[userIndex].kycRejectionReason;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === sub.userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
      }
    }

    this.notify();
    return { success: true, message: 'KYC Approved successfully. User can now deposit and withdraw.' };
  }

  public rejectKYC(submissionId: string, reason: string): { success: boolean; message?: string } {
    const submissions = this.getKYCSubmissions();
    const subIndex = submissions.findIndex(s => s.id === submissionId);
    if (subIndex === -1) {
      return { success: false, message: 'KYC submission not found.' };
    }

    const sub = submissions[subIndex];
    sub.status = 'rejected';
    sub.reviewedAt = new Date().toISOString();
    sub.reviewedBy = 'Admin';
    sub.rejectionReason = reason || 'Document image is unclear or information does not match.';
    submissions[subIndex] = sub;
    localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(submissions));

    // Update user record
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === sub.userId);
    if (userIndex >= 0) {
      users[userIndex].kycStatus = 'rejected';
      users[userIndex].kycRejectionReason = sub.rejectionReason;
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === sub.userId) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
      }
    }

    this.notify();
    return { success: true, message: 'KYC rejected.' };
  }

  public setUserKYCStatus(userId: string, status: KYCStatus, reason?: string): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    users[userIndex].kycStatus = status;
    if (status === 'verified') {
      users[userIndex].kycVerifiedAt = new Date().toISOString();
      delete users[userIndex].kycRejectionReason;
    } else if (status === 'rejected') {
      users[userIndex].kycRejectionReason = reason || 'Rejected by Admin';
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[userIndex]));
    }

    this.notify();
    return true;
  }

  // Export all platform data for secure backup
  public exportBackup(): string {
    const backup = {
      users: this.getUsers(),
      transactions: this.getTransactions(),
      plans: this.getPlans(),
      investments: this.getAllInvestments(),
      config: this.getConfig(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  }

  // Restore platform data from secure backup
  public importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.users && Array.isArray(data.users)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      }
      if (data.transactions && Array.isArray(data.transactions)) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
      }
      if (data.plans && Array.isArray(data.plans)) {
        localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(data.plans));
      }
      if (data.investments && Array.isArray(data.investments)) {
        localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(data.investments));
      }
      if (data.config) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(data.config));
      }
      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  // Reset to default seed data if needed
  public resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(defaultPlans));
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(defaultInvestments));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(defaultTransactions));
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(defaultChats));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(defaultConfig));
    this.notify();
  }
}

export const store = new PlatformStore();
