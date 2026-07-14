import { useEffect, useRef, useState } from 'react'
import {
  DEFAULT_ACCOUNT,
  type Account,
  type MenuKey,
  type ModalKind,
  type Screen,
  type SettingsSection,
} from './data'
import { MenuProvider } from './components/menu'
import { Sidebar } from './components/Sidebar'
import { ModalHost } from './components/Modals'
import { Dashboard, type DashCards } from './screens/Dashboard'
import { Accounts, type GroupId, type RefreshState } from './screens/Accounts'
import { AccountDetail } from './screens/AccountDetail'
import { Transactions, type TxFilters } from './screens/Transactions'
import { Settings, type NotifPrefs } from './screens/Settings'

export default function App() {
  return (
    <MenuProvider>
      <AppShell />
    </MenuProvider>
  )
}

function AppShell() {
  const [screen, setScreen] = useState<Screen>('dashboard')
  const [selectedAccount, setSelectedAccount] = useState<Account>(DEFAULT_ACCOUNT)
  const [modal, setModal] = useState<ModalKind | null>(null)

  const [menuSel, setMenuSel] = useState<Record<MenuKey, number>>({ nwPerf: 0, nwRange: 0, acctRange: 0, txDate: 0 })
  const [dashCards, setDashCards] = useState<DashCards>({ networth: true, recent: true, cashflow: true })
  const [txFilters, setTxFilters] = useState<TxFilters>({ pending: false, income: false, transfers: true })
  const [summaryMode, setSummaryMode] = useState<'totals' | 'percent'>('totals')
  const [openGroups, setOpenGroups] = useState<Record<GroupId, boolean>>({
    cash: true,
    credit: true,
    invest: true,
    property: true,
    loans: true,
  })
  const [notif, setNotif] = useState<NotifPrefs>({ weekly: true, budget: true, large: false, updates: false })
  const [settingsSection, setSettingsSection] = useState<SettingsSection>('general')

  const [refresh, setRefresh] = useState<RefreshState>('idle')
  const refreshTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => () => refreshTimers.current.forEach(clearTimeout), [])

  const doRefresh = () => {
    if (refresh !== 'idle') return
    setRefresh('busy')
    refreshTimers.current.push(setTimeout(() => setRefresh('done'), 900))
    refreshTimers.current.push(setTimeout(() => setRefresh('idle'), 3200))
  }

  const selectMenu = (key: MenuKey, index: number) => setMenuSel((s) => ({ ...s, [key]: index }))

  const openAccount = (account: Account) => {
    setSelectedAccount(account)
    setScreen('accountDetail')
  }

  return (
    <div className="app">
      <Sidebar screen={screen} onNavigate={setScreen} />

      <div className="main">
        {screen === 'dashboard' && (
          <Dashboard
            menuSel={menuSel}
            onMenuSelect={selectMenu}
            cards={dashCards}
            onFlipCard={(key) => setDashCards((s) => ({ ...s, [key]: !s[key] }))}
            onViewTransactions={() => setScreen('transactions')}
          />
        )}

        {screen === 'accounts' && (
          <Accounts
            menuSel={menuSel}
            onMenuSelect={selectMenu}
            openGroups={openGroups}
            onToggleGroup={(id) => setOpenGroups((s) => ({ ...s, [id]: !s[id] }))}
            summaryMode={summaryMode}
            onSetSummaryMode={setSummaryMode}
            refresh={refresh}
            onRefresh={doRefresh}
            onOpenAccount={openAccount}
            onAddAccount={() => setModal('addAccount')}
          />
        )}

        {screen === 'accountDetail' && (
          <AccountDetail
            account={selectedAccount}
            onBack={() => setScreen('accounts')}
            onViewTransactions={() => setScreen('transactions')}
          />
        )}

        {screen === 'transactions' && (
          <Transactions
            menuSel={menuSel}
            onMenuSelect={selectMenu}
            filters={txFilters}
            onFlipFilter={(key) => setTxFilters((s) => ({ ...s, [key]: !s[key] }))}
            onAddTransaction={() => setModal('addTransaction')}
          />
        )}

        {screen === 'settings' && (
          <Settings
            section={settingsSection}
            onSetSection={setSettingsSection}
            notif={notif}
            onFlipNotif={(key) => setNotif((s) => ({ ...s, [key]: !s[key] }))}
            onEditProfile={() => setModal('editProfile')}
          />
        )}
      </div>

      <ModalHost modal={modal} onClose={() => setModal(null)} />
    </div>
  )
}
