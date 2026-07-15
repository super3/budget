export type Screen = 'dashboard' | 'accounts' | 'accountDetail' | 'transactions' | 'settings'

export type ModalKind = 'addAccount' | 'addTransaction' | 'editProfile'

export type SettingsSection = 'general' | 'notifications' | 'security' | 'connected'

export interface Account {
  id: string
  name: string
  institution: string
  balance: string
  initials: string
  avatarBg: string
  avatarFg: string
  updated: string
  sparkline?: string
}

export interface AccountGroup {
  id: 'cash' | 'credit' | 'invest' | 'property' | 'loans'
  label: string
  change?: string
  changeNote: string
  total: string
  accounts: Account[]
}

// Sparkline point sets shared across account rows
const SPARK_A = '0,16 9,13 18,17 27,11 36,14 45,9 54,12 63,8 72,11 81,6 90,9'
const SPARK_B = '0,18 9,15 18,16 27,12 36,13 45,10 54,11 63,7 72,9 81,5 90,6'
const SPARK_C = '0,10 9,13 18,9 27,14 36,11 45,15 54,10 63,13 72,9 81,12 90,8'
const SPARK_D = '0,6 9,7 18,9 27,10 36,12 45,13 54,15 63,16 72,17 81,19 90,20'

export const ACCOUNT_GROUPS: AccountGroup[] = [
  {
    id: 'cash',
    label: 'Cash',
    change: '↑ $326.40 (1.4%)',
    changeNote: '1 month change',
    total: '$23,412.09',
    accounts: [
      {
        id: 'everydayChecking',
        name: 'Everyday Checking',
        institution: 'First National Bank · Checking',
        balance: '$4,912.34',
        initials: 'FN',
        avatarBg: 'oklch(0.95 0.04 250)',
        avatarFg: 'oklch(0.42 0.09 250)',
        updated: '2 hours ago',
        sparkline: SPARK_A,
      },
      {
        id: 'highYield',
        name: 'High-Yield Savings',
        institution: 'Meridian Savings · Savings',
        balance: '$18,499.75',
        initials: 'MS',
        avatarBg: 'oklch(0.95 0.04 145)',
        avatarFg: 'oklch(0.42 0.09 145)',
        updated: '2 hours ago',
        sparkline: SPARK_B,
      },
    ],
  },
  {
    id: 'credit',
    label: 'Credit cards',
    change: '↓ $63.03 (3.3%)',
    changeNote: '1 month change',
    total: '$1,842.76',
    accounts: [
      {
        id: 'goldCard',
        name: 'Gold Rewards Card',
        institution: 'Summit Card Co. · Credit card',
        balance: '$1,842.76',
        initials: 'SC',
        avatarBg: 'oklch(0.95 0.05 85)',
        avatarFg: 'oklch(0.45 0.09 85)',
        updated: '2 hours ago',
        sparkline: SPARK_C,
      },
    ],
  },
  {
    id: 'invest',
    label: 'Investments',
    change: '↑ $5,102.88 (1.8%)',
    changeNote: '1 month change',
    total: '$284,631.20',
    accounts: [
      {
        id: 'k401',
        name: 'Retirement 401(k)',
        institution: 'Vertex Funds · Retirement',
        balance: '$180,336.73',
        initials: 'VF',
        avatarBg: 'oklch(0.95 0.04 165)',
        avatarFg: 'oklch(0.4 0.09 165)',
        updated: '1 day ago',
        sparkline: SPARK_B,
      },
      {
        id: 'rothIra',
        name: 'Roth IRA',
        institution: 'Vertex Funds · Retirement',
        balance: '$61,208.11',
        initials: 'VF',
        avatarBg: 'oklch(0.95 0.04 165)',
        avatarFg: 'oklch(0.4 0.09 165)',
        updated: '1 day ago',
        sparkline: SPARK_A,
      },
      {
        id: 'brokerage',
        name: 'Brokerage',
        institution: 'Aspen Invest · Taxable',
        balance: '$43,086.36',
        initials: 'AI',
        avatarBg: 'oklch(0.95 0.04 300)',
        avatarFg: 'oklch(0.42 0.09 300)',
        updated: '1 day ago',
        sparkline: SPARK_C,
      },
    ],
  },
  {
    id: 'property',
    label: 'Property',
    changeNote: 'No change this month',
    total: '$124,256.00',
    accounts: [
      {
        id: 'maple',
        name: '742 Maple Ave (equity)',
        institution: 'Real estate · Manual',
        balance: '$110,150.00',
        initials: 'RE',
        avatarBg: 'oklch(0.95 0.04 250)',
        avatarFg: 'oklch(0.42 0.09 250)',
        updated: '3 weeks ago',
      },
      {
        id: 'subaru',
        name: '2022 Subaru Outback',
        institution: 'Vehicle · Manual',
        balance: '$14,106.00',
        initials: 'SO',
        avatarBg: 'oklch(0.95 0.05 25)',
        avatarFg: 'oklch(0.45 0.11 25)',
        updated: '3 weeks ago',
      },
    ],
  },
  {
    id: 'loans',
    label: 'Loans',
    change: '↓ $410.00 (2.3%)',
    changeNote: '1 month change',
    total: '$17,650.00',
    accounts: [
      {
        id: 'studentLoan',
        name: 'Student Loan',
        institution: 'Lumen Lending · Loan',
        balance: '$17,650.00',
        initials: 'LL',
        avatarBg: 'oklch(0.95 0.04 300)',
        avatarFg: 'oklch(0.42 0.09 300)',
        updated: '5 hours ago',
        sparkline: SPARK_D,
      },
    ],
  },
]

export const DEFAULT_ACCOUNT = ACCOUNT_GROUPS[0].accounts[0]

export interface Category {
  name: string
  bg: string
  fg: string
}

export const CATEGORIES: Record<string, Category> = {
  groceries: { name: 'Groceries', bg: 'oklch(0.95 0.04 145)', fg: 'oklch(0.42 0.09 145)' },
  dining: { name: 'Dining out', bg: 'oklch(0.95 0.05 45)', fg: 'oklch(0.45 0.1 45)' },
  income: { name: 'Income', bg: 'oklch(0.95 0.04 165)', fg: 'oklch(0.4 0.09 165)' },
  transport: { name: 'Transport', bg: 'oklch(0.95 0.04 250)', fg: 'oklch(0.42 0.09 250)' },
  entertainment: { name: 'Entertainment', bg: 'oklch(0.95 0.05 330)', fg: 'oklch(0.44 0.1 330)' },
  shopping: { name: 'Shopping', bg: 'oklch(0.95 0.05 25)', fg: 'oklch(0.45 0.11 25)' },
  utilities: { name: 'Utilities', bg: 'oklch(0.95 0.04 210)', fg: 'oklch(0.42 0.08 210)' },
  transfer: { name: 'Transfer', bg: '#F0EEE8', fg: '#5B5F56' },
}

export interface Transaction {
  merchant: string
  sub: string
  category: Category
  amount: string
  positive?: boolean
  initials: string
  avatarBg: string
  avatarFg: string
}

const tx = (
  merchant: string,
  sub: string,
  category: Category,
  amount: string,
  initials: string,
  avatarBg: string,
  avatarFg: string,
  positive = false,
): Transaction => ({ merchant, sub, category, amount, positive, initials, avatarBg, avatarFg })

export const RECENT_TRANSACTIONS: Transaction[] = [
  tx('Green Basket Market', 'Jul 12 · Groceries', CATEGORIES.groceries, '−$86.42', 'GB', 'oklch(0.95 0.04 145)', 'oklch(0.42 0.09 145)'),
  tx('Lyra Coffee', 'Jul 12 · Dining out', CATEGORIES.dining, '−$6.75', 'LC', 'oklch(0.95 0.05 60)', 'oklch(0.45 0.1 60)'),
  tx('Acme Co. Payroll', 'Jul 11 · Income', CATEGORIES.income, '+$4,250.00', 'AC', 'oklch(0.95 0.04 165)', 'oklch(0.4 0.09 165)', true),
  tx('City Transit', 'Jul 11 · Transport', CATEGORIES.transport, '−$2.90', 'CT', 'oklch(0.95 0.04 250)', 'oklch(0.42 0.09 250)'),
  tx('Nimbus Cloud', 'Jul 11 · Entertainment', CATEGORIES.entertainment, '−$9.99', 'NC', 'oklch(0.95 0.04 300)', 'oklch(0.42 0.09 300)'),
]

export const ACCOUNT_ACTIVITY: Transaction[] = [
  tx('Acme Co. Payroll', 'Jul 11 · Income', CATEGORIES.income, '+$4,250.00', 'AC', 'oklch(0.95 0.04 165)', 'oklch(0.4 0.09 165)', true),
  tx('PowerGrid Utilities', 'Jul 9 · Utilities', CATEGORIES.utilities, '−$128.34', 'PU', 'oklch(0.95 0.04 210)', 'oklch(0.42 0.08 210)'),
  tx('Transfer to High-Yield Savings', 'Jul 8 · Transfer', CATEGORIES.transfer, '−$500.00', 'HS', '#F0EEE8', '#5B5F56'),
]

export interface TransactionDay {
  label: string
  transactions: Transaction[]
}

export const TRANSACTION_DAYS: TransactionDay[] = [
  {
    label: 'Today · Sat, Jul 12',
    transactions: [
      tx('Green Basket Market', 'Everyday Checking', CATEGORIES.groceries, '−$86.42', 'GB', 'oklch(0.95 0.04 145)', 'oklch(0.42 0.09 145)'),
      tx('Lyra Coffee', 'Everyday Checking', CATEGORIES.dining, '−$6.75', 'LC', 'oklch(0.95 0.05 60)', 'oklch(0.45 0.1 60)'),
    ],
  },
  {
    label: 'Yesterday · Fri, Jul 11',
    transactions: [
      tx('Acme Co. Payroll', 'Everyday Checking', CATEGORIES.income, '+$4,250.00', 'AC', 'oklch(0.95 0.04 165)', 'oklch(0.4 0.09 165)', true),
      tx('City Transit', 'Everyday Checking', CATEGORIES.transport, '−$2.90', 'CT', 'oklch(0.95 0.04 250)', 'oklch(0.42 0.09 250)'),
      tx('Nimbus Cloud', 'Gold Rewards Card', CATEGORIES.entertainment, '−$9.99', 'NC', 'oklch(0.95 0.04 300)', 'oklch(0.42 0.09 300)'),
    ],
  },
  {
    label: 'Thu, Jul 10',
    transactions: [
      tx('Basil & Vine', 'Gold Rewards Card', CATEGORIES.dining, '−$72.60', 'BV', 'oklch(0.95 0.05 60)', 'oklch(0.45 0.1 60)'),
      tx('Orchard Hardware', 'Gold Rewards Card', CATEGORIES.shopping, '−$54.18', 'OH', 'oklch(0.95 0.05 25)', 'oklch(0.45 0.11 25)'),
    ],
  },
  {
    label: 'Wed, Jul 9',
    transactions: [
      tx('PowerGrid Utilities', 'Everyday Checking', CATEGORIES.utilities, '−$128.34', 'PU', 'oklch(0.95 0.04 210)', 'oklch(0.42 0.08 210)'),
      tx('Streamline+', 'Gold Rewards Card', CATEGORIES.entertainment, '−$15.99', 'S+', 'oklch(0.95 0.05 330)', 'oklch(0.44 0.1 330)'),
    ],
  },
  {
    label: 'Tue, Jul 8',
    transactions: [
      tx('Fresh Fields Market', 'Gold Rewards Card', CATEGORIES.groceries, '−$112.07', 'FF', 'oklch(0.95 0.04 145)', 'oklch(0.42 0.09 145)'),
      tx('Windmill Books', 'Gold Rewards Card', CATEGORIES.shopping, '−$28.50', 'WB', 'oklch(0.95 0.05 25)', 'oklch(0.45 0.11 25)'),
      tx('Transfer to High-Yield Savings', 'Everyday Checking', CATEGORIES.transfer, '−$500.00', 'HS', '#F0EEE8', '#5B5F56'),
    ],
  },
]

export interface Institution {
  name: string
  sub: string
  initials: string
  avatarBg: string
  avatarFg: string
  status: 'connected' | 'reconnect'
}

export const INSTITUTIONS: Institution[] = [
  { name: 'First National Bank', sub: '1 account · Synced 2 hours ago', initials: 'FN', avatarBg: 'oklch(0.95 0.04 250)', avatarFg: 'oklch(0.42 0.09 250)', status: 'connected' },
  { name: 'Meridian Savings', sub: '1 account · Synced 2 hours ago', initials: 'MS', avatarBg: 'oklch(0.95 0.04 145)', avatarFg: 'oklch(0.42 0.09 145)', status: 'connected' },
  { name: 'Summit Card Co.', sub: '1 account · Sync paused', initials: 'SC', avatarBg: 'oklch(0.95 0.05 85)', avatarFg: 'oklch(0.45 0.09 85)', status: 'reconnect' },
  { name: 'Vertex Funds', sub: '2 accounts · Synced 1 day ago', initials: 'VF', avatarBg: 'oklch(0.95 0.04 165)', avatarFg: 'oklch(0.4 0.09 165)', status: 'connected' },
  { name: 'Aspen Invest', sub: '1 account · Synced 1 day ago', initials: 'AI', avatarBg: 'oklch(0.95 0.04 300)', avatarFg: 'oklch(0.42 0.09 300)', status: 'connected' },
]

export const MENUS = {
  nwPerf: ['Net worth performance', 'Assets only', 'Liabilities only'],
  nwRange: ['1 month', '3 months', '6 months', '1 year'],
  acctRange: ['1 month', '3 months', '6 months', '1 year'],
  txDate: ['This month', 'Last month', 'Last 3 months', 'Year to date'],
} as const

export type MenuKey = keyof typeof MENUS

export const SUMMARY = {
  assets: {
    total: '$432,299.29',
    segments: [
      { label: 'Investments', width: '65.8%', color: 'oklch(0.62 0.12 165)', amount: '$284,631.20', percent: '65.8%' },
      { label: 'Real estate', width: '25.5%', color: 'oklch(0.62 0.12 250)', amount: '$110,150.00', percent: '25.5%' },
      { label: 'Cash', width: '5.4%', color: 'oklch(0.62 0.12 85)', amount: '$23,412.09', percent: '5.4%' },
      { label: 'Vehicles', width: '3.3%', color: 'oklch(0.62 0.12 25)', amount: '$14,106.00', percent: '3.3%' },
    ],
  },
  liabilities: {
    total: '$19,492.76',
    segments: [
      { label: 'Loans', width: '90.6%', color: 'oklch(0.62 0.12 300)', amount: '$17,650.00', percent: '90.6%' },
      { label: 'Credit cards', width: '9.4%', color: 'oklch(0.62 0.12 330)', amount: '$1,842.76', percent: '9.4%' },
    ],
  },
  netWorth: '$412,806.53',
}
