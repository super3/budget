import { INSTITUTIONS, type SettingsSection } from '../data'
import { Avatar, Toggle } from '../components/primitives'

export interface NotifPrefs {
  weekly: boolean
  budget: boolean
  large: boolean
  updates: boolean
}

interface SettingsProps {
  section: SettingsSection
  onSetSection: (section: SettingsSection) => void
  notif: NotifPrefs
  onFlipNotif: (key: keyof NotifPrefs) => void
  onEditProfile: () => void
}

const SECTIONS: { id: SettingsSection; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'security', label: 'Security' },
  { id: 'connected', label: 'Connected accounts' },
]

const NOTIF_ROWS: { key: keyof NotifPrefs; title: string; sub: string }[] = [
  { key: 'weekly', title: 'Weekly summary', sub: 'A Sunday-evening recap of your week' },
  { key: 'budget', title: 'Budget alerts', sub: 'When a category passes 90% of its target' },
  { key: 'large', title: 'Large transactions', sub: 'Anything over $500 in one charge' },
  { key: 'updates', title: 'Product updates', sub: 'Occasional news about new features' },
]

const CONNECTED_PILL = { background: 'oklch(0.95 0.04 165)', color: 'oklch(0.4 0.09 165)' }
const RECONNECT_PILL = { background: 'oklch(0.96 0.05 85)', color: 'oklch(0.5 0.11 70)' }

export function Settings({ section, onSetSection, notif, onFlipNotif, onEditProfile }: SettingsProps) {
  return (
    <div className="screen">
      <div className="screen-header">
        <span className="screen-title">Settings</span>
      </div>
      <div className="screen-body">
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                className={`settings-nav-item${section === s.id ? ' active' : ''}`}
                onClick={() => onSetSection(s.id)}
              >
                {s.label}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0, maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {section === 'general' && (
              <>
                <div className="card">
                  <div style={{ padding: '15px 20px', fontSize: 16.5, fontWeight: 650 }}>Profile</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 20px',
                      borderTop: '1px solid var(--divider)',
                    }}
                  >
                    <Avatar initials="AM" bg="oklch(0.85 0.05 165)" fg="oklch(0.35 0.08 165)" size={44} fontSize={15} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>Alex Morgan</div>
                      <div style={{ fontSize: 13.5, color: 'var(--faint)' }}>alex@aldermoney.com</div>
                    </div>
                    <div className="btn-small" onClick={onEditProfile}>
                      Edit profile
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div style={{ padding: '15px 20px', fontSize: 16.5, fontWeight: 650 }}>Preferences</div>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row-title">Currency</div>
                      <div className="settings-row-sub">Used for all balances and budgets</div>
                    </div>
                    <div className="select-btn">
                      <span>USD $</span>
                      <span className="select-caret">▾</span>
                    </div>
                  </div>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row-title">Month starts on</div>
                      <div className="settings-row-sub">First day of your budget cycle</div>
                    </div>
                    <div className="select-btn">
                      <span>1st of the month</span>
                      <span className="select-caret">▾</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {section === 'notifications' && (
              <div className="card">
                <div style={{ padding: '15px 20px', fontSize: 16.5, fontWeight: 650 }}>Notifications</div>
                {NOTIF_ROWS.map((row) => (
                  <div key={row.key} className="settings-row">
                    <div>
                      <div className="settings-row-title">{row.title}</div>
                      <div className="settings-row-sub">{row.sub}</div>
                    </div>
                    <Toggle on={notif[row.key]} onToggle={() => onFlipNotif(row.key)} />
                  </div>
                ))}
              </div>
            )}

            {section === 'security' && (
              <>
                <div className="card">
                  <div style={{ padding: '15px 20px', fontSize: 16.5, fontWeight: 650 }}>Security</div>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row-title">Password</div>
                      <div className="settings-row-sub">Last changed 4 months ago</div>
                    </div>
                    <div className="btn-small">Change</div>
                  </div>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row-title">Two-factor authentication</div>
                      <div className="settings-row-sub">Authenticator app</div>
                    </div>
                    <span className="status-pill" style={CONNECTED_PILL}>
                      Enabled
                    </span>
                  </div>
                  <div className="settings-row">
                    <div>
                      <div className="settings-row-title">Active sessions</div>
                      <div className="settings-row-sub">MacBook Pro · iPhone 15</div>
                    </div>
                    <div className="btn-small">Manage</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)', cursor: 'pointer' }}>Sign out</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'oklch(0.5 0.16 25)', cursor: 'pointer' }}>
                    Delete account…
                  </span>
                </div>
              </>
            )}

            {section === 'connected' && (
              <div className="card">
                <div style={{ padding: '15px 20px', fontSize: 16.5, fontWeight: 650 }}>Connected accounts</div>
                {INSTITUTIONS.map((inst) => (
                  <div
                    key={inst.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 13,
                      padding: '13px 20px',
                      borderTop: '1px solid var(--divider)',
                    }}
                  >
                    <Avatar initials={inst.initials} bg={inst.avatarBg} fg={inst.avatarFg} size={36} fontSize={13} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{inst.name}</div>
                      <div style={{ fontSize: 13.5, color: 'var(--faint)' }}>{inst.sub}</div>
                    </div>
                    <span className="status-pill" style={inst.status === 'connected' ? CONNECTED_PILL : RECONNECT_PILL}>
                      {inst.status === 'connected' ? 'Connected' : 'Reconnect'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
