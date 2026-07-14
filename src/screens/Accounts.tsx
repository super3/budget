import { ACCOUNT_GROUPS, MENUS, SUMMARY, type Account, type AccountGroup, type MenuKey } from '../data'
import { SelectMenu } from '../components/menu'
import { ACCOUNTS_CHART, AreaChart, Avatar, ChartYLabels, Sparkline } from '../components/primitives'
import { GroupChevron } from '../components/icons'

export type GroupId = AccountGroup['id']

export type RefreshState = 'idle' | 'busy' | 'done'

interface AccountsProps {
  menuSel: Record<MenuKey, number>
  onMenuSelect: (key: MenuKey, index: number) => void
  openGroups: Record<GroupId, boolean>
  onToggleGroup: (id: GroupId) => void
  summaryMode: 'totals' | 'percent'
  onSetSummaryMode: (mode: 'totals' | 'percent') => void
  refresh: RefreshState
  onRefresh: () => void
  onOpenAccount: (account: Account) => void
  onAddAccount: () => void
}

const Y_LABELS = [
  { text: '$414K', top: 6 },
  { text: '$409K', top: 56 },
  { text: '$404K', top: 106 },
  { text: '$399K', top: 156 },
]

const REFRESH_LABELS: Record<RefreshState, string> = {
  idle: 'Refresh all',
  busy: 'Refreshing…',
  done: 'Updated just now',
}

function AccountRow({ account, onOpen }: { account: Account; onOpen: () => void }) {
  return (
    <div className="acct-row" onClick={onOpen}>
      <Avatar initials={account.initials} bg={account.avatarBg} fg={account.avatarFg} size={38} fontSize={13.5} />
      <div className="acct-row-main">
        <div className="acct-row-name">{account.name}</div>
        <div className="acct-row-sub">{account.institution}</div>
      </div>
      {account.sparkline && <Sparkline points={account.sparkline} />}
      <div className="acct-row-right">
        <div className="acct-row-balance">{account.balance}</div>
        <div className="acct-row-updated">{account.updated}</div>
      </div>
    </div>
  )
}

interface SummarySectionProps {
  title: string
  total: string
  segments: { label: string; width: string; color: string; amount: string; percent: string }[]
  percentMode: boolean
}

function SummarySection({ title, total, segments, percentMode }: SummarySectionProps) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 15, fontWeight: 650 }}>{title}</span>
        <span className="num" style={{ fontSize: 15.5, fontWeight: 650 }}>
          {total}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 2, height: 10, borderRadius: 999, overflow: 'hidden', marginTop: 10 }}>
        {segments.map((seg) => (
          <div key={seg.label} style={{ width: seg.width, background: seg.color }} />
        ))}
      </div>
      {segments.map((seg, i) => (
        <div
          key={seg.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: i === 0 ? 12 : 10,
            fontSize: 14,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: seg.color }} />
            {seg.label}
          </span>
          <span className="num" style={{ fontWeight: 600 }}>
            {percentMode ? seg.percent : seg.amount}
          </span>
        </div>
      ))}
    </>
  )
}

export function Accounts({
  menuSel,
  onMenuSelect,
  openGroups,
  onToggleGroup,
  summaryMode,
  onSetSummaryMode,
  refresh,
  onRefresh,
  onOpenAccount,
  onAddAccount,
}: AccountsProps) {
  const percentMode = summaryMode === 'percent'

  return (
    <div className="screen">
      <div className="screen-header">
        <span className="screen-title">Accounts</span>
        <div className="screen-actions">
          <div className="btn" onClick={onRefresh}>
            ↻ <span>{REFRESH_LABELS[refresh]}</span>
          </div>
          <div className="btn-primary" onClick={onAddAccount}>
            + <span>Add account</span>
          </div>
        </div>
      </div>
      <div className="screen-body">
        <div className="card" style={{ padding: '22px 26px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <div className="overline">Net worth</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
                <span className="num" style={{ fontSize: 32, fontWeight: 650, letterSpacing: '-0.02em' }}>
                  $412,806.53
                </span>
                <span className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--positive)' }}>
                  ↑ $6,214.30 (1.5%)
                </span>
                <span style={{ fontSize: 13.5, color: 'var(--faint)' }}>1 month change</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <SelectMenu
                id="acctRange"
                options={MENUS.acctRange}
                selected={menuSel.acctRange}
                onSelect={(i) => onMenuSelect('acctRange', i)}
              />
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: 16 }}>
            <ChartYLabels labels={Y_LABELS} />
            <AreaChart spec={ACCOUNTS_CHART} gradientId="nwfill2" style={{ marginLeft: 56 }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 460px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ACCOUNT_GROUPS.map((group) => (
              <div key={group.id} className="card">
                <div className="acct-group-header" onClick={() => onToggleGroup(group.id)}>
                  <GroupChevron open={openGroups[group.id]} />
                  <span className="acct-group-title">{group.label}</span>
                  {group.change && <span className="acct-group-change">{group.change}</span>}
                  <span className="acct-group-note">{group.changeNote}</span>
                  <span className="acct-group-total">{group.total}</span>
                </div>
                {openGroups[group.id] &&
                  group.accounts.map((account) => (
                    <AccountRow key={account.id} account={account} onOpen={() => onOpenAccount(account)} />
                  ))}
              </div>
            ))}
          </div>

          <div
            className="card"
            style={{ flex: '1 1 260px', maxWidth: 360, minWidth: 250, padding: '18px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="card-title">Summary</span>
              <div className="seg">
                <span
                  className={`seg-item${percentMode ? '' : ' active'}`}
                  onClick={() => onSetSummaryMode('totals')}
                >
                  Totals
                </span>
                <span
                  className={`seg-item${percentMode ? ' active' : ''}`}
                  onClick={() => onSetSummaryMode('percent')}
                >
                  Percent
                </span>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <SummarySection
                title="Assets"
                total={SUMMARY.assets.total}
                segments={SUMMARY.assets.segments}
                percentMode={percentMode}
              />
            </div>

            <div style={{ borderTop: '1px solid var(--divider)', marginTop: 18, paddingTop: 16 }}>
              <SummarySection
                title="Liabilities"
                total={SUMMARY.liabilities.total}
                segments={SUMMARY.liabilities.segments}
                percentMode={percentMode}
              />
            </div>

            <div
              style={{
                borderTop: '1px solid var(--divider)',
                marginTop: 18,
                paddingTop: 16,
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 650 }}>Net worth</span>
              <span className="num" style={{ fontSize: 15.5, fontWeight: 650, color: 'var(--positive)' }}>
                {SUMMARY.netWorth}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
