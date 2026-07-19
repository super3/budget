import { LogoLeaf } from './icons'

interface EmptyStateProps {
  title: string
  sub: string
  actionLabel?: string
  onAction?: () => void
}

// Card-sized placeholder shown wherever there is no live data yet.
export function EmptyState({ title, sub, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="card empty-state">
      <div className="empty-state-mark">
        <LogoLeaf size={20} />
      </div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-sub">{sub}</div>
      {actionLabel && onAction && (
        <div className="btn-primary" style={{ marginTop: 18 }} onClick={onAction}>
          {actionLabel}
        </div>
      )}
    </div>
  )
}
