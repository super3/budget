export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div className="toggle" style={{ background: on ? 'var(--accent)' : 'var(--toggle-off)' }} onClick={onToggle}>
      <div className="toggle-knob" style={{ left: on ? 19 : 3 }} />
    </div>
  )
}

interface AvatarProps {
  initials: string
  bg: string
  fg: string
  size: number
  fontSize: number
}

export function Avatar({ initials, bg, fg, size, fontSize }: AvatarProps) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: bg, color: fg, fontSize }}>
      {initials}
    </div>
  )
}

export function Sparkline({ points }: { points: string }) {
  return (
    <svg
      width="90"
      height="26"
      viewBox="0 0 90 26"
      preserveAspectRatio="none"
      fill="none"
      style={{ flex: '0 1 90px', minWidth: 0 }}
    >
      <polyline points={points} stroke="var(--sparkline)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
