const { getAuth } = require('@clerk/express')

// Requires a signed-in Clerk user. The app-wide clerkMiddleware() (see
// index.js) parses and verifies the Bearer token; this middleware just
// enforces its presence and exposes the user id.
//
// Note: llmjob uses @clerk/clerk-sdk-node v4 for the same job — that package
// is deprecated by Clerk, so this server uses its successor, @clerk/express.
function requireAuth(req, res, next) {
  const auth = getAuth(req)
  if (!auth || !auth.userId) {
    return res.status(401).json({ error: 'No authorization token provided' })
  }
  req.userId = auth.userId
  next()
}

module.exports = { requireAuth }
