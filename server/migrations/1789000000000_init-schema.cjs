/* eslint-disable camelcase */
// Initial schema for the Alder backend. The canonical DDL lives in
// server/src/db.js (SCHEMA) so the same definition is applied both by
// node-pg-migrate in production and by any test database — same pattern
// as llmjob.
const { SCHEMA } = require('../src/db')

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.sql(SCHEMA)
}

exports.down = (pgm) => {
  pgm.sql('DROP TABLE IF EXISTS transactions, accounts, items CASCADE;')
}
