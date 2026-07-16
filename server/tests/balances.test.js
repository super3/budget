jest.mock('../src/db')
jest.mock('../src/plaid', () => ({ plaidClient: { accountsBalanceGet: jest.fn() } }))

const request = require('supertest')
const db = require('../src/db')
const { plaidClient } = require('../src/plaid')
const balancesRouter = require('../src/routes/balances')
const { makeApp } = require('./helpers/app')

const app = makeApp(balancesRouter)

beforeEach(() => jest.clearAllMocks())

test('returns normalized balances across all items', async () => {
  db.getItemsForUser.mockResolvedValue([
    { item_id: 'item_1', access_token: 'token-1', institution_name: 'First Platypus Bank' },
    { item_id: 'item_2', access_token: 'token-2', institution_name: 'Tattersall Federal' },
  ])
  plaidClient.accountsBalanceGet
    .mockResolvedValueOnce({
      data: {
        accounts: [
          {
            account_id: 'acc_1',
            name: 'Checking',
            official_name: 'Plaid Checking',
            mask: '0000',
            type: 'depository',
            subtype: 'checking',
            balances: { available: 100, current: 110, iso_currency_code: 'USD' },
          },
        ],
      },
    })
    .mockResolvedValueOnce({
      data: {
        accounts: [
          {
            account_id: 'acc_2',
            name: 'Credit Card',
            official_name: null,
            mask: '3333',
            type: 'credit',
            subtype: 'credit card',
            balances: { available: null, current: 410, iso_currency_code: 'USD' },
          },
        ],
      },
    })

  const res = await request(app).get('/api/plaid/balances')
  expect(res.status).toBe(200)
  expect(res.body.accounts).toHaveLength(2)
  expect(res.body.accounts[0]).toEqual({
    account_id: 'acc_1',
    name: 'Checking',
    official_name: 'Plaid Checking',
    mask: '0000',
    type: 'depository',
    subtype: 'checking',
    balances: { available: 100, current: 110, iso_currency_code: 'USD' },
    institution_name: 'First Platypus Bank',
  })
  expect(res.body.accounts[1].institution_name).toBe('Tattersall Federal')
  expect(db.upsertAccount).toHaveBeenCalledTimes(2)
})

test('returns an empty list when the user has no items', async () => {
  db.getItemsForUser.mockResolvedValue([])
  const res = await request(app).get('/api/plaid/balances')
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ accounts: [] })
  expect(plaidClient.accountsBalanceGet).not.toHaveBeenCalled()
})

test('surfaces Plaid failures as 500', async () => {
  db.getItemsForUser.mockResolvedValue([{ item_id: 'item_1', access_token: 'token-1' }])
  plaidClient.accountsBalanceGet.mockRejectedValue(new Error('ITEM_LOGIN_REQUIRED'))
  const res = await request(app).get('/api/plaid/balances')
  expect(res.status).toBe(500)
})
