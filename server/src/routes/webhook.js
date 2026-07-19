const express = require('express')
const { syncTransactions } = require('../sync')

const router = express.Router()

// Plaid webhook receiver — mounted WITHOUT auth (Plaid calls it directly).
// Always answers 200 quickly; work happens in the background.
//
// TODO before production: verify the Plaid-Verification JWT header
// (https://plaid.com/docs/api/webhooks/webhook-verification/).
router.post('/webhook', (req, res) => {
  const { webhook_type: type, webhook_code: code, item_id: itemId } = req.body || {}

  if (type === 'TRANSACTIONS' && code === 'SYNC_UPDATES_AVAILABLE' && itemId) {
    syncTransactions(itemId).catch((err) =>
      console.error('Webhook-triggered sync failed:', err?.response?.data || err.message),
    )
  }

  res.json({ received: true })
})

module.exports = router
