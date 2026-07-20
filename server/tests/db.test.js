// db.js exercised against an in-memory Postgres (pg-mem), llmjob-style:
// the same SCHEMA that node-pg-migrate applies in production is applied here.
jest.mock('pg', () => {
  const { newDb } = require('pg-mem')
  const mem = newDb()
  const adapters = mem.adapters.createPg()
  return { Pool: adapters.Pool }
})

const db = require('../src/db')

const baseAccount = (overrides = {}) => ({
  account_id: 'acc_1',
  name: 'Everyday Checking',
  official_name: 'Everyday Checking Account',
  mask: '0000',
  type: 'depository',
  subtype: 'checking',
  balances: { current: 100.5, available: 90.25, iso_currency_code: 'USD' },
  ...overrides,
})

const baseTxn = (overrides = {}) => ({
  account_id: 'acc_1',
  transaction_id: 'txn_1',
  date: '2026-07-10',
  authorized_date: '2026-07-09',
  name: 'Green Basket Market',
  merchant_name: 'Green Basket',
  amount: 86.42,
  iso_currency_code: 'USD',
  personal_finance_category: { primary: 'FOOD_AND_DRINK' },
  pending: false,
  ...overrides,
})

beforeAll(async () => {
  await db.pool.query(db.SCHEMA)
})

describe('items', () => {
  test('addItem inserts and is idempotent on item_id', async () => {
    await db.addItem('user_1', 'item_1', 'access-token-1')
    await db.addItem('user_1', 'item_1', 'access-token-other')

    const items = await db.getItemsForUser('user_1')
    expect(items).toHaveLength(1)
    expect(items[0].access_token).toBe('access-token-1')
  })

  test('getItemByItemId returns the item or undefined', async () => {
    const item = await db.getItemByItemId('item_1')
    expect(item.clerk_user_id).toBe('user_1')
    expect(await db.getItemByItemId('missing')).toBeUndefined()
  })

  test('setInstitution stores id and name', async () => {
    await db.setInstitution('item_1', 'ins_109508', 'First Platypus Bank')
    const item = await db.getItemByItemId('item_1')
    expect(item.institution_id).toBe('ins_109508')
    expect(item.institution_name).toBe('First Platypus Bank')
  })

  test('saveCursor persists the sync cursor', async () => {
    await db.saveCursor('item_1', 'cursor-abc')
    const item = await db.getItemByItemId('item_1')
    expect(item.transaction_cursor).toBe('cursor-abc')
  })

  test('getItemsForUser returns empty for unknown user', async () => {
    expect(await db.getItemsForUser('nobody')).toEqual([])
  })
})

describe('accounts', () => {
  test('upsertAccount inserts then updates on conflict', async () => {
    await db.upsertAccount('item_1', baseAccount())
    let accounts = await db.getAccountsForUser('user_1')
    expect(accounts).toHaveLength(1)
    expect(accounts[0].name).toBe('Everyday Checking')
    expect(Number(accounts[0].current_balance)).toBe(100.5)
    expect(accounts[0].institution_name).toBe('First Platypus Bank')

    await db.upsertAccount('item_1', baseAccount({ name: 'Renamed', balances: { current: 42, available: null, iso_currency_code: 'USD' } }))
    accounts = await db.getAccountsForUser('user_1')
    expect(accounts).toHaveLength(1)
    expect(accounts[0].name).toBe('Renamed')
    expect(Number(accounts[0].current_balance)).toBe(42)
    expect(accounts[0].available_balance).toBeNull()
  })

  test('upsertAccount tolerates a missing balances object', async () => {
    await db.upsertAccount('item_1', { ...baseAccount({ account_id: 'acc_2', name: 'No Balances' }), balances: undefined })
    const accounts = await db.getAccountsForUser('user_1')
    const acc2 = accounts.find((a) => a.account_id === 'acc_2')
    expect(acc2.current_balance).toBeNull()
  })
})

describe('transactions', () => {
  test('upsertTransaction inserts then updates on conflict', async () => {
    await db.upsertTransaction(baseTxn())
    let txns = await db.getTransactionsForUser('user_1')
    expect(txns).toHaveLength(1)
    expect(txns[0].personal_finance_category).toBe('FOOD_AND_DRINK')
    expect(txns[0].account_name).toBe('Renamed')

    await db.upsertTransaction(baseTxn({ amount: 90, pending: true }))
    txns = await db.getTransactionsForUser('user_1')
    expect(txns).toHaveLength(1)
    expect(Number(txns[0].amount)).toBe(90)
    expect(txns[0].pending).toBe(true)
  })

  test('upsertTransaction handles a missing personal_finance_category', async () => {
    await db.upsertTransaction(baseTxn({ transaction_id: 'txn_2', personal_finance_category: undefined }))
    const txns = await db.getTransactionsForUser('user_1')
    const txn2 = txns.find((t) => t.transaction_id === 'txn_2')
    expect(txn2.personal_finance_category).toBeNull()
  })

  test('markTransactionRemoved soft-deletes', async () => {
    await db.markTransactionRemoved('txn_2')
    const txns = await db.getTransactionsForUser('user_1')
    expect(txns.map((t) => t.transaction_id)).not.toContain('txn_2')
  })

  test('getTransactionsForUser respects the limit', async () => {
    await db.upsertTransaction(baseTxn({ transaction_id: 'txn_3', date: '2026-07-12' }))
    const txns = await db.getTransactionsForUser('user_1', 1)
    expect(txns).toHaveLength(1)
    expect(txns[0].transaction_id).toBe('txn_3')
  })

  test('getTransactionsForUser returns dates as plain YYYY-MM-DD strings', async () => {
    await db.upsertTransaction(
      baseTxn({ transaction_id: 'txn_4', date: '2026-07-13', authorized_date: undefined }),
    )
    const txns = await db.getTransactionsForUser('user_1')
    const txn4 = txns.find((t) => t.transaction_id === 'txn_4')
    expect(txn4.date).toBe('2026-07-13')
    expect(txn4.authorized_date).toBeNull()
  })
})

describe('toDateString', () => {
  test('serializes JS Dates (how pg returns DATE columns) to YYYY-MM-DD', () => {
    expect(db.toDateString(new Date('2026-07-13T00:00:00Z'))).toBe('2026-07-13')
  })

  test('trims already-string dates and passes nulls through', () => {
    expect(db.toDateString('2026-07-13')).toBe('2026-07-13')
    expect(db.toDateString('2026-07-13T00:00:00.000Z')).toBe('2026-07-13')
    expect(db.toDateString(null)).toBeNull()
  })
})
