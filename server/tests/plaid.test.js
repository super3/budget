describe('plaid client configuration', () => {
  afterEach(() => {
    jest.resetModules()
    delete process.env.PLAID_ENV
  })

  test('defaults to the sandbox environment', () => {
    delete process.env.PLAID_ENV
    jest.isolateModules(() => {
      const { PLAID_ENV, plaidClient } = require('../src/plaid')
      expect(PLAID_ENV).toBe('sandbox')
      expect(plaidClient).toBeDefined()
    })
  })

  test('honors PLAID_ENV when set', () => {
    process.env.PLAID_ENV = 'production'
    jest.isolateModules(() => {
      const { PLAID_ENV } = require('../src/plaid')
      expect(PLAID_ENV).toBe('production')
    })
  })
})
