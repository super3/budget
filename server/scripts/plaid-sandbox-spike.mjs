// Phase 1 spike: prove the Plaid Sandbox keys work and show real response
// shapes, without any UI. Uses /sandbox/public_token/create to skip Link.
//
// Run from server/:  npm run spike
// Requires server/.env with PLAID_CLIENT_ID and PLAID_SECRET.

const BASE = 'https://sandbox.plaid.com'
const { PLAID_CLIENT_ID, PLAID_SECRET } = process.env

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.error('Missing PLAID_CLIENT_ID / PLAID_SECRET — put them in server/.env (see .env.example).')
  process.exit(1)
}

async function plaid(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: PLAID_CLIENT_ID, secret: PLAID_SECRET, ...body }),
  })
  const data = await res.json()
  if (!res.ok) {
    console.error(`\n${path} failed:`, JSON.stringify(data, null, 2))
    process.exit(1)
  }
  return data
}

const money = (n, ccy) => (n == null ? '—' : `${n.toFixed(2)} ${ccy ?? ''}`)

// 1. Sandbox-only shortcut: mint a public token without the Link UI.
//    ins_109508 = First Platypus Bank (standard sandbox institution).
console.log('1/4  /sandbox/public_token/create (ins_109508)…')
const pub = await plaid('/sandbox/public_token/create', {
  institution_id: 'ins_109508',
  initial_products: ['transactions'],
})

// 2. Exchange for a permanent access token (same call the server makes).
console.log('2/4  /item/public_token/exchange…')
const exchange = await plaid('/item/public_token/exchange', { public_token: pub.public_token })
console.log(`     item_id: ${exchange.item_id}`)

// 3. Real-time balances.
console.log('3/4  /accounts/balance/get…')
const bal = await plaid('/accounts/balance/get', { access_token: exchange.access_token })
console.log(`     ${bal.accounts.length} accounts:`)
for (const a of bal.accounts) {
  console.log(
    `       ${a.name} (…${a.mask}) [${a.type}/${a.subtype}]  current=${money(a.balances.current, a.balances.iso_currency_code)}  available=${money(a.balances.available, a.balances.iso_currency_code)}`,
  )
}

// 4. One /transactions/sync pass with cursor pagination.
console.log('4/4  /transactions/sync…')
let cursor
let added = 0
let hasMore = true
let sample = null
while (hasMore) {
  const page = await plaid('/transactions/sync', {
    access_token: exchange.access_token,
    ...(cursor ? { cursor } : {}),
  })
  added += page.added.length
  if (!sample && page.added.length) sample = page.added[0]
  cursor = page.next_cursor
  hasMore = page.has_more
}
console.log(`     ${added} transactions synced (cursor saved for next pass)`)
if (sample) {
  console.log(
    `     sample: ${sample.date}  ${sample.name}  ${money(sample.amount, sample.iso_currency_code)}  category=${sample.personal_finance_category?.primary ?? '—'}  pending=${sample.pending}`,
  )
}

console.log('\nSandbox spike complete — keys work end to end.')
