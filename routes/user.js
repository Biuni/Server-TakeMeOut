const express = require('express')
const router = express.Router()

// Informazioni sull'utente [ GET ]
router.get('/:id', (req, res, next) => {
  res.json({
    user_id: req.params.id,
    mail: 'example@mail.com',
    name: 'Jhon Wayne'
  })
})

module.exports = router
