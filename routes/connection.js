const express = require('express')
const db = require('../config/db')
const global = require('../config/global')

const router = express.Router()

// Controllo la connessione al server [ GET ]
router.get('/', (req, res, next) => {
  db.query('SELECT 1 AS test', function (error, results, fields) {
    res.json({
      server: 'connected',
      database: (error || results.length === 0) ? 'disconnected' : 'connected',
      version: global.VERSION
    })
  })
})

module.exports = router
