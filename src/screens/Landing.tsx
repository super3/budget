import { useState } from 'react'
import '../landing.css'
import { LogoDiamond } from '../components/icons'
import { Avatar } from '../components/primitives'

function CheckBadgeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="9" fill="oklch(0.62 0.12 160)" />
      <polyline
        points="6,10 9,13 14.5,7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const JOINED_MESSAGE = "You're on the list — we'll email your invite soon."

const HERO_STATS = [
  { value: '2,400+', label: 'People on the waitlist' },
  { value: '13,000+', label: 'Banks & institutions supported' },
  { value: '$1.2B', label: 'Tracked by members every month' },
  { value: '5 min', label: 'From sign-up to first budget' },
]

const PREVIEW_TILES = [
  { label: 'Budget remaining', value: '$617.34' },
  { label: 'Net saved · July', value: '+$3,617.34', green: true },
  { label: 'Accounts synced', value: '9' },
]

const ACCOUNT_ROWS = [
  { initials: 'FN', bg: 'oklch(0.95 0.04 250)', fg: 'oklch(0.42 0.09 250)', name: 'Everyday Checking', sub: 'Synced 2 hours ago', amount: '$4,912.34' },
  { initials: 'MS', bg: 'oklch(0.95 0.04 145)', fg: 'oklch(0.42 0.09 145)', name: 'High-Yield Savings', sub: 'Synced 2 hours ago', amount: '$18,499.75' },
  { initials: 'VF', bg: 'oklch(0.95 0.04 165)', fg: 'oklch(0.4 0.09 165)', name: 'Retirement 401(k)', sub: 'Synced 1 day ago', amount: '$180,336.73' },
]

const BUDGET_ROWS = [
  { name: 'Groceries', amount: '$512 of $600', width: '85%', color: 'oklch(0.62 0.12 160)' },
  { name: 'Dining out', amount: '$287 of $320', width: '90%', color: 'oklch(0.72 0.14 70)' },
  { name: 'Shopping', amount: '$188 of $250', width: '75%', color: 'oklch(0.62 0.12 160)' },
  { name: 'Entertainment', amount: '$65 of $120', width: '54%', color: 'oklch(0.62 0.12 160)' },
]

const RECURRING_ROWS = [
  { initials: 'PP', bg: 'oklch(0.95 0.05 85)', fg: 'oklch(0.45 0.09 85)', name: 'Rent — Parkview Property', sub: 'Tue, Jul 15 · Monthly', amount: '$2,200.00' },
  { initials: 'S+', bg: 'oklch(0.95 0.05 330)', fg: 'oklch(0.44 0.1 330)', name: 'Streamline+', sub: 'Wed, Jul 16 · Monthly', amount: '$15.99' },
  { initials: 'IF', bg: 'oklch(0.95 0.04 145)', fg: 'oklch(0.42 0.09 145)', name: 'Ironworks Fitness', sub: 'Fri, Jul 18 · Monthly', amount: '$42.00' },
]

// Cash flow bar chart: [income bar x/y/height, spending bar x/y/height] pairs per month
const CASHFLOW_BARS = [
  { month: 'Jan', tx: 41, income: [14, 42, 108], spending: [36, 70, 80] },
  { month: 'Feb', tx: 107, income: [80, 42, 108], spending: [102, 76, 74] },
  { month: 'Mar', tx: 173, income: [146, 33, 117], spending: [168, 62, 88] },
  { month: 'Apr', tx: 239, income: [212, 42, 108], spending: [234, 71, 79] },
  { month: 'May', tx: 305, income: [278, 39, 111], spending: [300, 68, 82] },
  { month: 'Jun', tx: 371, income: [344, 42, 108], spending: [366, 53, 97] },
  { month: 'Jul', tx: 437, income: [410, 38, 112], spending: [432, 85, 65] },
]

const NW_LINE =
  'M0,226 C60,220 90,224 140,214 C190,204 220,208 270,198 C320,188 350,192 400,182 C450,172 480,176 530,164 C580,152 610,156 660,144 C710,132 740,136 790,124 C840,112 870,116 920,98 C960,84 1000,56 1040,38'

interface FeatureTextProps {
  eyebrow: string
  title: string
  body: string
  link: string
  order?: number
}

function FeatureText({ eyebrow, title, body, link, order }: FeatureTextProps) {
  return (
    <div style={order ? { order } : undefined}>
      <div className="eyebrow">{eyebrow}</div>
      <h3 className="twb" style={{ margin: '10px 0 0 0', fontSize: 29, lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {title}
      </h3>
      <p className="twp" style={{ margin: '14px 0 0 0', fontSize: 16, lineHeight: 1.6, color: 'var(--muted)' }}>
        {body}
      </p>
      <a href="#app" style={{ display: 'inline-block', marginTop: 16, fontSize: 15, fontWeight: 650 }}>
        {link}
      </a>
    </div>
  )
}

export function Landing() {
  const [joined, setJoined] = useState(false)

  return (
    <div className="landing">
      {/* Nav */}
      <div className="landing-nav">
        <div className="landing-nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div className="sidebar-logo-mark">
              <LogoDiamond />
            </div>
            <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>Alder</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <a href="#features" style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink-soft)' }}>
              Features
            </a>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="#app" className="demo-btn">
              See the demo
            </a>
            <a href="#waitlist" className="waitlist-nav-btn">
              Join the waitlist
            </a>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 32px 0 32px', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#FFFFFF',
            border: '1px solid var(--card-border)',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 13.5,
            fontWeight: 600,
            color: 'var(--icon)',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'oklch(0.62 0.12 160)' }} />
          The calm alternative to spreadsheet budgeting
        </div>
        <h1
          className="twb"
          style={{ margin: '22px auto 0 auto', maxWidth: 780, fontSize: 60, lineHeight: 1.04, fontWeight: 750, letterSpacing: '-0.032em' }}
        >
          Know where every dollar lives.
        </h1>
        <p className="twp" style={{ margin: '22px auto 0 auto', maxWidth: 560, fontSize: 19, lineHeight: 1.55, color: 'var(--muted)' }}>
          Alder brings your accounts, budget, and cash flow into one calm view — so you can spend with confidence and
          save without thinking about it.
        </p>
        <div id="waitlist" style={{ marginTop: 30 }}>
          {joined ? (
            <div className="joined-pill">
              <CheckBadgeIcon />
              {JOINED_MESSAGE}
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <input placeholder="you@email.com" className="hero-input" />
              <div className="join-btn" onClick={() => setJoined(true)}>
                Join the waitlist
              </div>
            </div>
          )}
        </div>
        <div style={{ marginTop: 14, fontSize: 14, color: 'var(--fainter)' }}>
          Invites roll out weekly ·{' '}
          <a href="#app" style={{ fontWeight: 600 }}>
            Or see the demo →
          </a>
        </div>

        {/* Product preview */}
        <div
          style={{
            maxWidth: 980,
            margin: '56px auto 0 auto',
            background: '#FFFFFF',
            border: '1px solid var(--card-border)',
            borderRadius: 16,
            boxShadow: '0 2px 4px rgba(20,22,18,0.05), 0 32px 64px -32px rgba(20,22,18,0.18)',
            overflow: 'hidden',
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 18px',
              borderBottom: '1px solid var(--divider)',
              background: '#FBFAF8',
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E5E2DA' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E5E2DA' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E5E2DA' }} />
            <span
              style={{
                margin: '0 auto',
                fontSize: 12.5,
                color: 'var(--fainter)',
                background: 'var(--divider)',
                borderRadius: 6,
                padding: '3px 14px',
              }}
            >
              app.aldermoney.com
            </span>
            <span style={{ width: 38 }} />
          </div>
          <div style={{ padding: '24px 28px 26px 28px' }}>
            <div style={{ fontSize: 12, letterSpacing: '0.08em', fontWeight: 650, color: 'var(--faint)', textTransform: 'uppercase' }}>
              Net worth
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 5, flexWrap: 'wrap' }}>
              <span className="num" style={{ fontSize: 30, fontWeight: 650, letterSpacing: '-0.02em' }}>
                $412,806.53
              </span>
              <span className="num" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--positive)' }}>
                ↑ $6,214.30 (1.5%)
              </span>
              <span style={{ fontSize: 13, color: 'var(--faint)' }}>1 month change</span>
            </div>
            <div style={{ position: 'relative', marginTop: 16 }}>
              <svg width="100%" height="210" viewBox="0 0 1040 280" preserveAspectRatio="none" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="lgfill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.11 165 / 0.22)" />
                    <stop offset="100%" stopColor="oklch(0.62 0.11 165 / 0)" />
                  </linearGradient>
                </defs>
                {[20, 80, 140, 200, 260].map((y) => (
                  <line key={y} x1="0" y1={y} x2="1040" y2={y} stroke="#F0EEE8" strokeWidth="1" />
                ))}
                <path d={`${NW_LINE} L1040,280 L0,280 Z`} fill="url(#lgfill)" />
                <path
                  d={NW_LINE}
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
                  top: 24,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'oklch(0.55 0.11 165)',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 1px 3px rgba(20,22,18,0.25)',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
              {PREVIEW_TILES.map((tile) => (
                <div
                  key={tile.label}
                  style={{
                    flex: '1 1 160px',
                    background: 'var(--bg)',
                    border: '1px solid var(--divider)',
                    borderRadius: 10,
                    padding: '12px 16px',
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: '0.07em', fontWeight: 650, color: 'var(--faint)', textTransform: 'uppercase' }}>
                    {tile.label}
                  </div>
                  <div
                    className="num"
                    style={{ fontSize: 18, fontWeight: 650, marginTop: 3, color: tile.green ? 'var(--positive)' : undefined }}
                  >
                    {tile.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 56,
            flexWrap: 'wrap',
            marginTop: 52,
            padding: '26px 20px',
            borderTop: '1px solid var(--card-border)',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          {HERO_STATS.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: 'var(--faint)', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature rows */}
      <div id="features" style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px 0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="eyebrow">Why Alder</div>
          <h2
            className="twb"
            style={{ margin: '12px auto 0 auto', maxWidth: 600, fontSize: 40, lineHeight: 1.08, fontWeight: 720, letterSpacing: '-0.025em' }}
          >
            One calm view of your money.
          </h2>
          <p className="twp" style={{ margin: '16px auto 0 auto', maxWidth: 520, fontSize: 17, lineHeight: 1.55, color: 'var(--muted)' }}>
            Most money apps shout at you. Alder quietly keeps everything organized, so five minutes a week is all it
            takes.
          </p>
        </div>

        {/* Row 1: Accounts */}
        <div className="feature-grid" style={{ marginBottom: 88 }}>
          <FeatureText
            eyebrow="Accounts"
            title="Every account, one clean view."
            body="Checking, cards, loans, and investments sync automatically into a single timeline. Net worth updates itself — no more tab-hopping between five bank logins."
            link="Explore accounts →"
          />
          <div className="feature-card" style={{ padding: '8px 0' }}>
            {ACCOUNT_ROWS.map((row, i) => (
              <div
                key={row.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '13px 20px',
                  borderTop: i === 0 ? undefined : '1px solid var(--divider)',
                }}
              >
                <Avatar initials={row.initials} bg={row.bg} fg={row.fg} size={36} fontSize={13} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{row.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--faint)' }}>{row.sub}</div>
                </div>
                <span className="num" style={{ fontSize: 15, fontWeight: 600 }}>
                  {row.amount}
                </span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 20px',
                borderTop: '1px solid var(--divider)',
                background: '#FBFAF8',
                borderRadius: '0 0 14px 14px',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 650 }}>Net worth</span>
              <span className="num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--positive)' }}>
                $412,806.53
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Budget */}
        <div className="feature-grid" style={{ marginBottom: 88 }}>
          <FeatureText
            eyebrow="Budget"
            title="Budgets that breathe."
            body="Alder drafts your first budget from real spending, then fills each category in as the month goes. Gentle nudges when you're close — never guilt trips."
            link="Explore budgets →"
            order={2}
          />
          <div className="feature-card" style={{ order: 1, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 15, fontWeight: 650 }}>July budget</span>
              <span className="num" style={{ fontSize: 13.5, color: 'var(--muted)' }}>
                <b style={{ color: 'var(--ink)', fontWeight: 650 }}>$617.34</b> left
              </span>
            </div>
            {BUDGET_ROWS.map((row, i) => (
              <div key={row.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginTop: i === 0 ? 18 : 13 }}>
                  <span style={{ fontWeight: 500 }}>{row.name}</span>
                  <span className="num" style={{ color: 'var(--muted)' }}>
                    {row.amount}
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: '#EFEDE6', marginTop: 6, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: row.width, borderRadius: 999, background: row.color }} />
                </div>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 18,
                padding: '10px 13px',
                background: 'oklch(0.96 0.02 165)',
                border: '1px solid oklch(0.9 0.03 165)',
                borderRadius: 9,
              }}
            >
              <svg width="13" height="13" viewBox="0 0 20 20">
                <polygon points="10,2.5 17.5,10 10,17.5 2.5,10" fill="oklch(0.5 0.1 165)" />
              </svg>
              <span style={{ fontSize: 13, color: '#3E4A42' }}>
                <b style={{ fontWeight: 650 }}>On track.</b> Spending is 6% below plan this month.
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Recurring */}
        <div className="feature-grid" style={{ marginBottom: 88 }}>
          <FeatureText
            eyebrow="Recurring"
            title="No more subscription surprises."
            body="Alder spots every recurring charge automatically and shows what's due before it hits — so the gym you forgot about doesn't hide in your statement."
            link="Explore recurring →"
          />
          <div className="feature-card" style={{ padding: '8px 0' }}>
            <div
              style={{
                padding: '12px 20px 6px 20px',
                fontSize: 11.5,
                letterSpacing: '0.07em',
                fontWeight: 650,
                color: 'var(--faint)',
                textTransform: 'uppercase',
              }}
            >
              Next 7 days · $2,257.99
            </div>
            {RECURRING_ROWS.map((row) => (
              <div
                key={row.name}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--divider)' }}
              >
                <Avatar initials={row.initials} bg={row.bg} fg={row.fg} size={36} fontSize={13} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{row.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--faint)' }}>{row.sub}</div>
                </div>
                <span className="num" style={{ fontSize: 15, fontWeight: 600 }}>
                  {row.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4: Cash flow */}
        <div className="feature-grid">
          <FeatureText
            eyebrow="Cash flow"
            title="Watch your savings rate climb."
            body="Income against spending, every month, at a glance. When saving is the default — not the leftover — the trend line takes care of itself."
            link="Explore cash flow →"
            order={2}
          />
          <div className="feature-card" style={{ order: 1, padding: '20px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 650 }}>Net saved · July</span>
              <span className="num" style={{ fontSize: 15, fontWeight: 700, color: 'var(--positive)' }}>
                +$3,617.34
              </span>
            </div>
            <svg width="100%" viewBox="0 0 460 170" style={{ display: 'block' }}>
              <line x1="0" y1="150" x2="460" y2="150" stroke="#E9E6DF" strokeWidth="1" />
              {CASHFLOW_BARS.map((bar) => (
                <g key={bar.month}>
                  <rect x={bar.income[0]} y={bar.income[1]} width="18" height={bar.income[2]} rx="3" fill="oklch(0.62 0.11 165)" />
                  <rect x={bar.spending[0]} y={bar.spending[1]} width="18" height={bar.spending[2]} rx="3" fill="#464B43" />
                  <text
                    x={bar.tx}
                    y="164"
                    textAnchor="middle"
                    fontSize="10.5"
                    fill="#9A9D92"
                    fontFamily="Hanken Grotesk, Helvetica, sans-serif"
                  >
                    {bar.month}
                  </text>
                </g>
              ))}
            </svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12.5, color: 'var(--muted)', marginTop: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: 'oklch(0.62 0.11 165)' }} />
                Income
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: 3, background: '#464B43' }} />
                Spending
              </span>
              <span style={{ marginLeft: 'auto', fontWeight: 650, color: 'var(--ink)' }}>41.8% savings rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '88px 32px' }}>
        <div style={{ background: 'oklch(0.32 0.06 170)', borderRadius: 18, padding: '64px 40px', textAlign: 'center' }}>
          <h2
            className="twb"
            style={{ margin: '0 auto', maxWidth: 520, fontSize: 36, lineHeight: 1.1, fontWeight: 720, letterSpacing: '-0.025em', color: '#FFFFFF' }}
          >
            Be first in line.
          </h2>
          <p
            className="twp"
            style={{ margin: '14px auto 0 auto', maxWidth: 440, fontSize: 16.5, lineHeight: 1.5, color: 'oklch(0.85 0.03 170)' }}
          >
            We invite new members from the waitlist every week. Add your email and we'll save your spot.
          </p>
          <div style={{ marginTop: 28 }}>
            {joined ? (
              <div className="joined-pill-dark">
                <CheckBadgeIcon />
                {JOINED_MESSAGE}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                <input placeholder="you@email.com" className="cta-input-dark" />
                <div className="join-btn-dark" onClick={() => setJoined(true)}>
                  Join the waitlist
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--card-border)', background: 'var(--hover)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 32px 30px 32px' }}>
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 20 20">
                    <polygon points="10,2.5 17.5,10 10,17.5 2.5,10" fill="#FFFFFF" />
                  </svg>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Alder</span>
              </div>
              <p style={{ margin: '12px 0 0 0', fontSize: 13.5, lineHeight: 1.55, color: 'var(--faint)', maxWidth: 220 }}>
                The calm home for your money. Accounts, budget, and cash flow — one view.
              </p>
            </div>
            <div>
              <div className="footer-col-label">Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14 }}>
                <a href="#app" className="footer-link">Dashboard</a>
                <a href="#app" className="footer-link">Budget</a>
                <a href="#app" className="footer-link">Transactions</a>
                <a href="#app" className="footer-link">Cash Flow</a>
                <a href="#app" className="footer-link">Recurring</a>
              </div>
            </div>
            <div>
              <div className="footer-col-label">Company</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14 }}>
                <a href="#features" className="footer-link">About</a>
              </div>
            </div>
            <div>
              <div className="footer-col-label">Support</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 14 }}>
                <a href="#" className="footer-link">Help center</a>
                <a href="#" className="footer-link">Privacy</a>
                <a href="#" className="footer-link">Terms</a>
                <a href="#" className="footer-link">Security</a>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              flexWrap: 'wrap',
              borderTop: '1px solid #E5E2DA',
              marginTop: 36,
              paddingTop: 20,
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--fainter)' }}>© 2026 Alder Money, Inc. · Made for calmer money</span>
            <span style={{ fontSize: 13, color: 'var(--fainter)' }}>Bank-grade 256-bit encryption · Read-only connections</span>
          </div>
        </div>
      </div>
    </div>
  )
}
