const express = require('express')
const db = require('../config/db')
const global = require('../config/global')

const router = express.Router()

// Check the server and database connection [ GET ]
router.get('/info', (req, res, next) => {
  db.query('SELECT 1 AS test', (error, results, fields) => {
    res.json({
      server: 'connected',
      database: (error || results.length === 0) ? 'disconnected' : 'connected',
      version: global.VERSION
    })
  })
})

// Download the updated version of database [ GET ]
router.get('/data', (req, res, next) => {
  db.query('SELECT * FROM node', (error, results, fields) => {
    res.json({
      status: (error || results.length === 0) ? 0 : 1,
      db: (error || results.length === 0) ? 'Error! Try Again.' : results
    })
  })
})

module.exports = router
