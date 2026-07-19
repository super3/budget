import { useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import type { ModalKind } from '../data'
import { api } from '../api'
import { Avatar } from './primitives'
import { LogoLeaf, SearchIcon } from './icons'

interface ModalHostProps {
  modal: ModalKind | null
  onClose: () => void
  onBankConnected?: () => void
}

// Opens Plaid Link as soon as the token is ready (Link renders its own UI).
function PlaidLinkOpener({
  token,
  onSuccess,
  onExit,
}: {
  token: string
  onSuccess: (publicToken: string) => void
  onExit: () => void
}) {
  const { open, ready } = usePlaidLink({
    token,
    onSuccess: (publicToken) => onSuccess(publicToken),
    onExit: () => onExit(),
  })
  useEffect(() => {
    if (ready) open()
  }, [ready, open])
  return null
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

export function ModalHost({ modal, onClose, onBankConnected }: ModalHostProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState<string | null>(null)

  // Reset the Plaid Link flow whenever the modal opens/closes.
  useEffect(() => {
    setLinkToken(null)
    setConnecting(false)
    setConnectError(null)
  }, [modal])

  if (!modal) return null

  const connectBank = async () => {
    if (connecting) return
    setConnectError(null)
    setConnecting(true)
    try {
      const { link_token: token } = await api.createLinkToken()
      setLinkToken(token)
    } catch (err) {
      setConnectError(
        (err as Error).message === 'Not signed in'
          ? 'Log in first to connect a bank.'
          : 'Could not reach the Alder API — try again in a moment.',
      )
      setConnecting(false)
    }
  }

  const handleLinkSuccess = async (publicToken: string) => {
    try {
      await api.exchangePublicToken(publicToken)
      onBankConnected?.()
      onClose()
    } catch {
      setConnectError('Connecting the bank failed — try again.')
    } finally {
      setLinkToken(null)
      setConnecting(false)
    }
  }

  const handleLinkExit = () => {
    setLinkToken(null)
    setConnecting(false)
  }

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
              {linkToken && (
                <PlaidLinkOpener token={linkToken} onSuccess={handleLinkSuccess} onExit={handleLinkExit} />
              )}
              <div className="search-box">
                <SearchIcon />
                <input placeholder="Search 13,000+ institutions" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div className="institution-row" onClick={connectBank}>
                  <div
                    className="avatar"
                    style={{ width: 34, height: 34, background: 'var(--accent)', flexShrink: 0 }}
                  >
                    <LogoLeaf size={16} />
                  </div>
                  <span className="institution-name">
                    {connecting ? 'Opening Plaid Link…' : 'Connect a bank with Plaid'}
                  </span>
                  <span style={{ color: 'var(--fainter)' }}>›</span>
                </div>
                {connectError && (
                  <div style={{ padding: '2px 12px 6px 12px', fontSize: 13.5, color: 'oklch(0.5 0.16 25)' }}>
                    {connectError}
                  </div>
                )}
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
                <input className="field-input" defaultValue="alex@aldermoney.com" />
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
