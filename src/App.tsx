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
import { Landing } from './screens/Landing'
import { getClerk } from './clerk'
import type { SidebarUser } from './components/Sidebar'

// The landing page is the homepage; the app lives at #app so direct links
// work on GitHub Pages without any server-side routing. Other hashes
// (#features, #waitlist) are in-page anchors on the landing page.
const pageFromHash = () => (window.location.hash === '#app' ? 'app' : 'landing')

export default function App() {
  const [page, setPage] = useState<'landing' | 'app'>(pageFromHash)

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (page === 'app') window.scrollTo(0, 0)
  }, [page])

  const signOut = () => {
    const finish = () => {
      window.location.hash = ''
      history.replaceState(null, '', window.location.pathname + window.location.search)
      setPage('landing')
    }
    // If a Clerk session exists, end it for real before returning home.
    if (window.Clerk?.user) window.Clerk.signOut().then(finish, finish)
    else finish()
  }

  if (page === 'landing') return <Landing />

  return (
    <MenuProvider>
      <AppShell onSignOut={signOut} />
    </MenuProvider>
  )
}

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/)
  const letters = words.length >= 2 ? [words[0][0], words[1][0]] : [name[0], name[1] ?? '']
  return letters.join('').toUpperCase()
}

function AppShell({ onSignOut }: { onSignOut: () => void }) {
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

  // Show the signed-in Clerk user in the sidebar when there is one; the demo
  // persona stays in place for signed-out visitors (or if Clerk isn't set up).
  const [clerkUser, setClerkUser] = useState<SidebarUser | null>(null)
  useEffect(() => {
    let cancelled = false
    getClerk()
      .then((clerk) => {
        const u = clerk.user
        if (cancelled || !u) return
        const email = u.primaryEmailAddress?.emailAddress ?? ''
        const name = u.fullName || u.firstName || email || 'Account'
        setClerkUser({ name, email, initials: initialsOf(name) })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

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
      <Sidebar screen={screen} onNavigate={setScreen} onSignOut={onSignOut} user={clerkUser} />

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
