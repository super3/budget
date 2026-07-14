import type { CSSProperties } from 'react'

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

export interface ChartSpec {
  height: number
  gridYs: number[]
  linePath: string
  areaPath: string
  dotTop: number
  xLabels: string[]
}

const dashboardLine =
  'M0,226 C60,220 90,224 140,214 C190,204 220,208 270,198 C320,188 350,192 400,182 C450,172 480,176 530,164 C580,152 610,156 660,144 C710,132 740,136 790,124 C840,112 870,116 920,98 C960,84 1000,56 1040,38'

const accountsLine =
  'M0,162 C60,158 90,161 140,154 C190,147 220,150 270,143 C320,136 350,139 400,132 C450,125 480,128 530,119 C580,110 610,113 660,104 C710,95 740,98 790,89 C840,80 870,83 920,70 C960,60 1000,40 1040,27'

const detailLine =
  'M0,146 C60,142 90,145 140,138 C190,131 220,134 270,128 C320,122 350,125 400,118 C450,111 480,114 530,106 C580,98 610,101 660,93 C710,85 740,88 790,80 C840,72 870,75 920,63 C960,54 1000,36 1040,24'

const monthLabels = ['Jun 12', 'Jun 16', 'Jun 20', 'Jun 24', 'Jun 28', 'Jul 2', 'Jul 6', 'Jul 10']

export const DASHBOARD_CHART: ChartSpec = {
  height: 280,
  gridYs: [20, 80, 140, 200, 260],
  linePath: dashboardLine,
  areaPath: `${dashboardLine} L1040,280 L0,280 Z`,
  dotTop: 33,
  xLabels: monthLabels,
}

export const ACCOUNTS_CHART: ChartSpec = {
  height: 200,
  gridYs: [14, 64, 114, 164],
  linePath: accountsLine,
  areaPath: `${accountsLine} L1040,200 L0,200 Z`,
  dotTop: 22,
  xLabels: monthLabels,
}

export const DETAIL_CHART: ChartSpec = {
  height: 180,
  gridYs: [10, 55, 100, 145],
  linePath: detailLine,
  areaPath: `${detailLine} L1040,180 L0,180 Z`,
  dotTop: 16,
  xLabels: ['Jun 12', 'Jun 20', 'Jun 28', 'Jul 6', 'Jul 12'],
}

interface AreaChartProps {
  spec: ChartSpec
  gradientId: string
  style?: CSSProperties
}

export function AreaChart({ spec, gradientId, style }: AreaChartProps) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <svg
        width="100%"
        height={spec.height}
        viewBox={`0 0 1040 ${spec.height}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.11 165 / 0.22)" />
            <stop offset="100%" stopColor="oklch(0.62 0.11 165 / 0)" />
          </linearGradient>
        </defs>
        {spec.gridYs.map((y) => (
          <line key={y} x1="0" y1={y} x2="1040" y2={y} stroke="#F0EEE8" strokeWidth="1" />
        ))}
        <path d={spec.areaPath} fill={`url(#${gradientId})`} />
        <path
          d={spec.linePath}
          fill="none"
          stroke="oklch(0.55 0.11 165)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          right: -4,
          top: spec.dotTop,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'oklch(0.55 0.11 165)',
          border: '2px solid #FFFFFF',
          boxShadow: '0 1px 3px rgba(20,22,18,0.25)',
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--fainter)' }}>
        {spec.xLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}

export function ChartYLabels({ labels }: { labels: { text: string; top: number }[] }) {
  return (
    <>
      {labels.map(({ text, top }) => (
        <div
          key={text}
          className="num"
          style={{ position: 'absolute', left: 0, top, fontSize: 12, color: 'var(--fainter)' }}
        >
          {text}
        </div>
      ))}
    </>
  )
}
