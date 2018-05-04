const express = require('express')
const router = express.Router()

// Controllo connesione al server [ GET ]
router.get('/', (req, res, next) => {
  res.json({
    status: 'connected',
    message: 'Server online!',
    version: '1.0.0'
  })
})

module.exports = router
