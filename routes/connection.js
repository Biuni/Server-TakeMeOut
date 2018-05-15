const express = require('express')
const db = require('../utils/db')
const promisify = require('../utils/promisify')
const global = require('../utils/global')

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
 * @api - {GET} - /conn/data - Download the latest version of database
 * @apiName - DataConnection
 * @apiGroup - Connection
 */
router.get('/data', (req, res, next) => {
  let nodeDb, routeDb, error
  promisify.query('SELECT * FROM `node`')
    .then(rows => {
      nodeDb = rows
      error = false
      return promisify.query('SELECT * FROM `route`')
    }, err => {
      error = err
      return error
    })
    .then(rows => {
      routeDb = rows
      error = false
    }, err => {
      error = err
      return error
    })
    .then(() => {
      res.json({
        status: (error) ? 0 : 1,
        message: (error) ? `Error! Somethings goes wrong!` : null,
        results: {
          node: nodeDb,
          route: routeDb
        }
      })
    })
})

module.exports = router
