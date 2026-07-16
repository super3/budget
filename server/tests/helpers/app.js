const express = require('express')

// Build a minimal app around a router, mirroring index.js wiring: JSON body
// parsing, an injected authenticated user, and the central error handler.
function makeApp(router, { userId = 'user_1' } = {}) {
  const app = express()
  app.use(express.json())
  app.use((req, res, next) => {
    if (userId) req.userId = userId
    next()
  })
  app.use('/api/plaid', router)
  app.use((err, req, res, _next) => {
    res.status(500).json({ error: 'Internal error' })
  })
  return app
}

module.exports = { makeApp }
