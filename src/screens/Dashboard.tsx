import { MENUS, RECENT_TRANSACTIONS, type MenuKey } from '../data'
import { Menu, MenuCheckItem, SelectMenu } from '../components/menu'
import { AreaChart, ChartYLabels, DASHBOARD_CHART } from '../components/primitives'
import { TransactionRow } from '../components/TransactionRow'
import { SlidersIcon } from '../components/icons'

export interface DashCards {
  networth: boolean
  recent: boolean
  cashflow: boolean
}

interface DashboardProps {
  menuSel: Record<MenuKey, number>
  onMenuSelect: (key: MenuKey, index: number) => void
  cards: DashCards
  onFlipCard: (key: keyof DashCards) => void
  onViewTransactions: () => void
}

const Y_LABELS = [
  { text: '$414K', top: 12 },
  { text: '$409K', top: 72 },
  { text: '$404K', top: 132 },
  { text: '$399K', top: 192 },
  { text: '$394K', top: 252 },
]

export function Dashboard({ menuSel, onMenuSelect, cards, onFlipCard, onViewTransactions }: DashboardProps) {
  return (
    <div className="screen">
      <div className="screen-header">
        <span className="screen-title">Dashboard</span>
        <div className="screen-actions">
          <Menu
            id="customize"
            trigger={
              <div className="btn" style={{ gap: 7 }}>
                <SlidersIcon />
                <span>Customize</span>
              </div>
            }
          >
            <div className="menu-section-label">Show on dashboard</div>
            <MenuCheckItem label="Net worth" checked={cards.networth} onToggle={() => onFlipCard('networth')} />
            <MenuCheckItem label="Recent transactions" checked={cards.recent} onToggle={() => onFlipCard('recent')} />
            <MenuCheckItem label="Cash flow" checked={cards.cashflow} onToggle={() => onFlipCard('cashflow')} />
          </Menu>
        </div>
      </div>
      <div className="screen-body">
        {cards.networth && (
          <div className="card" style={{ padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div className="overline">Net worth</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="num" style={{ fontSize: 38, fontWeight: 650, letterSpacing: '-0.02em' }}>
                    $412,806.53
                  </span>
                  <span className="num" style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--positive)' }}>
                    ↑ $6,214.30 (1.5%)
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--faint)' }}>1 month change</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <SelectMenu
                  id="nwPerf"
                  options={MENUS.nwPerf}
                  selected={menuSel.nwPerf}
                  onSelect={(i) => onMenuSelect('nwPerf', i)}
                />
                <SelectMenu
                  id="nwRange"
                  options={MENUS.nwRange}
                  selected={menuSel.nwRange}
                  onSelect={(i) => onMenuSelect('nwRange', i)}
                />
              </div>
            </div>
            <div style={{ position: 'relative', marginTop: 18 }}>
              <ChartYLabels labels={Y_LABELS} />
              <AreaChart spec={DASHBOARD_CHART} gradientId="nwfill" style={{ marginLeft: 56 }} />
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, marginTop: 16, alignItems: 'start' }}>
          {cards.recent && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent transactions</span>
                <span className="view-all" onClick={onViewTransactions}>
                  View all →
                </span>
              </div>
              {RECENT_TRANSACTIONS.map((t) => (
                <TransactionRow key={t.merchant + t.amount} transaction={t} />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cards.cashflow && (
              <div className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="card-title">Cash flow · July</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, marginTop: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>Income</span>
                  <span className="num" style={{ fontWeight: 600 }}>
                    $8,650.00
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#EFEDE6', marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '100%', borderRadius: 999, background: 'oklch(0.62 0.12 160)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14.5, marginTop: 12 }}>
                  <span style={{ color: 'var(--muted)' }}>Spending</span>
                  <span className="num" style={{ fontWeight: 600 }}>
                    $5,032.66
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#EFEDE6', marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '58%', borderRadius: 999, background: '#8A8E85' }} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--divider)',
                    marginTop: 14,
                    paddingTop: 12,
                    fontSize: 14.5,
                  }}
                >
                  <span style={{ color: 'var(--muted)' }}>Net saved</span>
                  <span className="num" style={{ fontWeight: 650, color: 'var(--positive)' }}>
                    +$3,617.34
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
