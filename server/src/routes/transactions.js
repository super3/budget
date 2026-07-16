const express = require('express')
const db = require('../db')
const { syncTransactions } = require('../sync')

const router = express.Router()

// Sync all of the user's items now (the webhook also does this per item).
router.post('/sync', async (req, res, next) => {
  try {
    const items = await db.getItemsForUser(req.userId)
    const results = []
    for (const item of items) {
      const counts = await syncTransactions(item.item_id)
      results.push({ item_id: item.item_id, ...counts })
    }
    res.json({ results })
  } catch (err) {
    next(err)
  }
})

// Read synced transactions from the database (most recent first).
router.get('/transactions', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 100, 500)
    const transactions = await db.getTransactionsForUser(req.userId, limit)
    res.json({ transactions })
  } catch (err) {
    next(err)
  }
})

module.exports = router
