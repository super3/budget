jest.mock('../src/sync', () => ({ syncTransactions: jest.fn() }))

const request = require('supertest')
const { syncTransactions } = require('../src/sync')
const webhookRouter = require('../src/routes/webhook')
const { makeApp } = require('./helpers/app')

const flush = () => new Promise(setImmediate)
const app = makeApp(webhookRouter, { userId: null })

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  syncTransactions.mockResolvedValue({ added: 0, modified: 0, removed: 0 })
})

afterEach(() => {
  console.error.mockRestore()
})

test('SYNC_UPDATES_AVAILABLE triggers a background sync', async () => {
  const res = await request(app).post('/api/plaid/webhook').send({
    webhook_type: 'TRANSACTIONS',
    webhook_code: 'SYNC_UPDATES_AVAILABLE',
    item_id: 'item_1',
  })
  expect(res.status).toBe(200)
  expect(res.body).toEqual({ received: true })
  expect(syncTransactions).toHaveBeenCalledWith('item_1')
})

test('logs but still succeeds when the sync fails', async () => {
  const err = new Error('sync failed')
  syncTransactions.mockRejectedValue(err)

  const res = await request(app).post('/api/plaid/webhook').send({
    webhook_type: 'TRANSACTIONS',
    webhook_code: 'SYNC_UPDATES_AVAILABLE',
    item_id: 'item_1',
  })
  expect(res.status).toBe(200)
  await flush()
  expect(console.error).toHaveBeenCalledWith('Webhook-triggered sync failed:', 'sync failed')
})

test('ignores other webhook types', async () => {
  const res = await request(app).post('/api/plaid/webhook').send({
    webhook_type: 'ITEM',
    webhook_code: 'ERROR',
    item_id: 'item_1',
  })
  expect(res.status).toBe(200)
  expect(syncTransactions).not.toHaveBeenCalled()
})

test('ignores other transaction webhook codes', async () => {
  const res = await request(app).post('/api/plaid/webhook').send({
    webhook_type: 'TRANSACTIONS',
    webhook_code: 'RECURRING_TRANSACTIONS_UPDATE',
    item_id: 'item_1',
  })
  expect(res.status).toBe(200)
  expect(syncTransactions).not.toHaveBeenCalled()
})

test('ignores payloads without an item_id', async () => {
  const res = await request(app).post('/api/plaid/webhook').send({
    webhook_type: 'TRANSACTIONS',
    webhook_code: 'SYNC_UPDATES_AVAILABLE',
  })
  expect(res.status).toBe(200)
  expect(syncTransactions).not.toHaveBeenCalled()
})

test('tolerates an empty body', async () => {
  const res = await request(app).post('/api/plaid/webhook')
  expect(res.status).toBe(200)
  expect(syncTransactions).not.toHaveBeenCalled()
})
