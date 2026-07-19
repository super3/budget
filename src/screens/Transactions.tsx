import { MENUS, TRANSACTION_DAYS, type MenuKey, type Transaction, type TransactionDay } from '../data'
import { Menu, MenuCheckItem, MenuOption } from '../components/menu'
import { Avatar } from '../components/primitives'
import { CalendarIcon, FilterIcon, SidebarRightIcon } from '../components/icons'

export interface TxFilters {
  pending: boolean
  income: boolean
  transfers: boolean
}

interface TransactionsProps {
  menuSel: Record<MenuKey, number>
  onMenuSelect: (key: MenuKey, index: number) => void
  filters: TxFilters
  onFlipFilter: (key: keyof TxFilters) => void
  onAddTransaction: () => void
  liveDays?: TransactionDay[] | null
  liveCount?: number
}

function TransactionListRow({ transaction: t }: { transaction: Transaction }) {
  return (
    <div className="tx-row" style={{ padding: '13px 20px' }}>
      <Avatar initials={t.initials} bg={t.avatarBg} fg={t.avatarFg} size={38} fontSize={13.5} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tx-row-name">{t.merchant}</div>
        <div className="tx-row-sub">{t.sub}</div>
      </div>
      <span className="pill" style={{ background: t.category.bg, color: t.category.fg }}>
        {t.category.name}
      </span>
      <span className={`tx-amount${t.positive ? ' positive' : ''}`} style={{ width: 120, textAlign: 'right' }}>
        {t.amount}
      </span>
    </div>
  )
}

export function Transactions({
  menuSel,
  onMenuSelect,
  filters,
  onFlipFilter,
  onAddTransaction,
  liveDays,
  liveCount = 0,
}: TransactionsProps) {
  const live = Boolean(liveDays && liveDays.length > 0)
  const days = live ? liveDays! : TRANSACTION_DAYS
  return (
    <div className="screen">
      <div className="screen-header">
        <span className="screen-title">Transactions</span>
        <div className="screen-actions">
          <Menu
            id="txDate"
            trigger={
              <div className="btn-toolbar">
                <CalendarIcon />
                <span>{MENUS.txDate[menuSel.txDate]}</span>
              </div>
            }
          >
            {MENUS.txDate.map((opt, i) => (
              <MenuOption key={opt} label={opt} onSelect={() => onMenuSelect('txDate', i)} />
            ))}
          </Menu>
          <Menu
            id="txFilters"
            trigger={
              <div className="btn-toolbar">
                <FilterIcon />
                <span>Filters</span>
              </div>
            }
          >
            <MenuCheckItem label="Pending only" checked={filters.pending} onToggle={() => onFlipFilter('pending')} />
            <MenuCheckItem label="Income only" checked={filters.income} onToggle={() => onFlipFilter('income')} />
            <MenuCheckItem
              label="Include transfers"
              checked={filters.transfers}
              onToggle={() => onFlipFilter('transfers')}
            />
          </Menu>
          <div className="toolbar-divider" />
          <div className="btn-primary" onClick={onAddTransaction}>
            + <span>Add</span>
          </div>
          <div className="icon-btn">
            <SidebarRightIcon />
          </div>
        </div>
      </div>
      <div className="screen-body">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <span className="num" style={{ fontSize: 14, color: 'var(--muted)' }}>
            {live ? (
              <>
                {liveCount} transactions · <b style={{ color: 'var(--ink)', fontWeight: 600 }}>Plaid Sandbox</b>
              </>
            ) : (
              <>
                42 transactions this month · <b style={{ color: 'var(--ink)', fontWeight: 600 }}>−$5,032.66</b>
              </>
            )}
          </span>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {days.map((day) => (
            <div key={day.label}>
              <div className="day-header">{day.label}</div>
              {day.transactions.map((t) => (
                <TransactionListRow key={t.merchant + t.amount} transaction={t} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
