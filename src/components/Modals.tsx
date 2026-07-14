import type { ModalKind } from '../data'
import { Avatar } from './primitives'
import { SearchIcon } from './icons'

interface ModalHostProps {
  modal: ModalKind | null
  onClose: () => void
}

const TITLES: Record<ModalKind, string> = {
  addAccount: 'Add account',
  addTransaction: 'Add transaction',
  editProfile: 'Edit profile',
}

const PRIMARY_LABELS: Record<ModalKind, string> = {
  addAccount: 'Done',
  addTransaction: 'Save transaction',
  editProfile: 'Save changes',
}

const INSTITUTION_OPTIONS = [
  { initials: 'FN', bg: 'oklch(0.95 0.04 250)', fg: 'oklch(0.42 0.09 250)', name: 'First National Bank' },
  { initials: 'MS', bg: 'oklch(0.95 0.04 145)', fg: 'oklch(0.42 0.09 145)', name: 'Meridian Savings' },
  { initials: 'SC', bg: 'oklch(0.95 0.05 85)', fg: 'oklch(0.45 0.09 85)', name: 'Summit Card Co.' },
  { initials: 'VF', bg: 'oklch(0.95 0.04 165)', fg: 'oklch(0.4 0.09 165)', name: 'Vertex Funds' },
  { initials: '＋', bg: '#F0EEE8', fg: '#5B5F56', name: 'Add manual account' },
]

export function ModalHost({ modal, onClose }: ModalHostProps) {
  if (!modal) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{TITLES[modal]}</span>
          <div className="modal-close" onClick={onClose}>
            ✕
          </div>
        </div>
        <div className="modal-body">
          {modal === 'addAccount' && (
            <>
              <div className="search-box">
                <SearchIcon />
                <input placeholder="Search 13,000+ institutions" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {INSTITUTION_OPTIONS.map((inst) => (
                  <div key={inst.name} className="institution-row" onClick={onClose}>
                    <Avatar initials={inst.initials} bg={inst.bg} fg={inst.fg} size={34} fontSize={12.5} />
                    <span className="institution-name">{inst.name}</span>
                    <span style={{ color: 'var(--fainter)' }}>›</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {modal === 'addTransaction' && (
            <>
              <div>
                <label className="field-label">Merchant</label>
                <input className="field-input" placeholder="e.g. Green Basket Market" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Amount</label>
                  <input className="field-input" placeholder="$0.00" />
                </div>
                <div>
                  <label className="field-label">Date</label>
                  <input className="field-input" defaultValue="Jul 12, 2026" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="field-label">Account</label>
                  <div className="field-select">
                    <span>Everyday Checking</span>
                    <span className="select-caret">▾</span>
                  </div>
                </div>
                <div>
                  <label className="field-label">Category</label>
                  <div className="field-select">
                    <span>Groceries</span>
                    <span className="select-caret">▾</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {modal === 'editProfile' && (
            <>
              <div>
                <label className="field-label">Full name</label>
                <input className="field-input" defaultValue="Alex Morgan" />
              </div>
              <div>
                <label className="field-label">Email</label>
                <input className="field-input" defaultValue="alex@fern.money" />
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <div className="modal-btn" onClick={onClose}>
            Cancel
          </div>
          <div className="modal-btn-primary" onClick={onClose}>
            {PRIMARY_LABELS[modal]}
          </div>
        </div>
      </div>
    </div>
  )
}
