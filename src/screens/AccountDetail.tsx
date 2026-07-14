import { ACCOUNT_ACTIVITY, type Account } from '../data'
import { AreaChart, Avatar, DETAIL_CHART } from '../components/primitives'
import { TransactionRow } from '../components/TransactionRow'

interface AccountDetailProps {
  account: Account
  onBack: () => void
  onViewTransactions: () => void
}

export function AccountDetail({ account, onBack, onViewTransactions }: AccountDetailProps) {
  return (
    <div className="screen">
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="back-btn" onClick={onBack}>
            ‹
          </div>
          <span style={{ fontSize: 14.5, fontWeight: 500, color: 'var(--faint)', cursor: 'pointer' }} onClick={onBack}>
            Accounts
          </span>
          <span style={{ fontSize: 14.5, color: '#C9C6BC' }}>/</span>
          <span className="screen-title">{account.name}</span>
        </div>
        <div className="screen-actions">
          <div className="btn">Edit</div>
        </div>
      </div>
      <div className="screen-body">
        <div className="card" style={{ padding: '22px 26px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <Avatar initials={account.initials} bg={account.avatarBg} fg={account.avatarFg} size={44} fontSize={15} />
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 19, fontWeight: 650 }}>{account.name}</div>
              <div style={{ fontSize: 14, color: 'var(--faint)', marginTop: 2 }}>{account.institution}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="num" style={{ fontSize: 30, fontWeight: 650, letterSpacing: '-0.02em' }}>
                {account.balance}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fainter)', marginTop: 2 }}>Updated {account.updated}</div>
            </div>
          </div>
          <AreaChart spec={DETAIL_CHART} gradientId="adfill" style={{ marginTop: 20 }} />
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent activity</span>
            <span className="view-all" onClick={onViewTransactions}>
              View all →
            </span>
          </div>
          {ACCOUNT_ACTIVITY.map((t) => (
            <TransactionRow key={t.merchant + t.amount} transaction={t} />
          ))}
        </div>
      </div>
    </div>
  )
}
