jest.mock('@clerk/express', () => ({ getAuth: jest.fn() }))

const { getAuth } = require('@clerk/express')
const { requireAuth } = require('../src/middleware/auth')

const makeRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

beforeEach(() => jest.clearAllMocks())

test('rejects when getAuth returns nothing', () => {
  getAuth.mockReturnValue(null)
  const res = makeRes()
  const next = jest.fn()

  requireAuth({}, res, next)
  expect(res.status).toHaveBeenCalledWith(401)
  expect(next).not.toHaveBeenCalled()
})

test('rejects when there is no userId', () => {
  getAuth.mockReturnValue({ userId: null })
  const res = makeRes()
  const next = jest.fn()

  requireAuth({}, res, next)
  expect(res.status).toHaveBeenCalledWith(401)
  expect(next).not.toHaveBeenCalled()
})

test('attaches userId and calls next when signed in', () => {
  getAuth.mockReturnValue({ userId: 'user_1' })
  const req = {}
  const res = makeRes()
  const next = jest.fn()

  requireAuth(req, res, next)
  expect(req.userId).toBe('user_1')
  expect(next).toHaveBeenCalled()
  expect(res.status).not.toHaveBeenCalled()
})
