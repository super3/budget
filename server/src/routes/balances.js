const express = require('express')
const db = require('../db')
const { plaidClient } = require('../plaid')

const router = express.Router()

// Real-time balances across all of the user's connected items via
// /accounts/balance/get (fresh fetch from the institution), updating the
// stored copies as a side effect.
router.get('/balances', async (req, res, next) => {
  try {
    const items = await db.getItemsForUser(req.userId)
    const accounts = []

    for (const item of items) {
      const response = await plaidClient.accountsBalanceGet({ access_token: item.access_token })
      for (const account of response.data.accounts) {
        await db.upsertAccount(item.item_id, account)
        accounts.push({
          account_id: account.account_id,
          name: account.name,
          official_name: account.official_name,
          mask: account.mask,
          type: account.type,
          subtype: account.subtype,
          balances: {
            available: account.balances.available,
            current: account.balances.current,
            iso_currency_code: account.balances.iso_currency_code,
          },
          institution_name: item.institution_name,
        })
      }
    }

    res.json({ accounts })
  } catch (err) {
    next(err)
  }
})

module.exports = router
