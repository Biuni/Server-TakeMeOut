const express = require('express')
const db = require('../config/db')
const global = require('../config/global')

const router = express.Router()

/**
 * @api - {GET} - /conn/info - Check server and database connection
 * @apiName - InfoConnection
 * @apiGroup - Connection
 */
router.get('/info', (req, res, next) => {
  db.query('SELECT 1 AS test', (error, results, fields) => {
    res.json({
      server: 'connected',
      database: (error || results.length === 0) ? 'disconnected' : 'connected',
      version: global.VERSION
    })
  })
})

/**
 * @api - {GET} - /conn/data - Download the last version of database
 * @apiName - DataConnection
 * @apiGroup - Connection
 */
router.get('/data', (req, res, next) => {
  db.query('SELECT * FROM node', (error, results, fields) => {
    res.json({
      status: (error || results.length === 0) ? 0 : 1,
      message: (error || results.length === 0) ? `Error. ${error.sqlMessage}` : null,
      result: results
    })
  })
})

module.exports = router
