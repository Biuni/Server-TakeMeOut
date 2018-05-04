const uuid = require('uuid/v1')
const crypto = require('crypto')
const express = require('express')
const db = require('../config/db')

const router = express.Router()

// Informazioni sull'utente [ GET ]
router.get('/get/:uuid', (req, res, next) => {
  db.query('SELECT `mail`, `name`, `uuid` FROM `user` WHERE `uuid` = ?', [req.params.uuid], function (error, results, fields) {
    res.json({
      status: (error || results.length === 0) ? 0 : 1,
      message: (error || results.length === 0) ? 'Error. Try again!' : results[0]
    })
  })
})

// Login dell'utente [ POST ]
router.post('/login', (req, res, next) => {
  if (req.body.pwd === '' || req.body.pwd === undefined ||
      req.body.mail === '' || req.body.mail === undefined) {
    return res.json({
      status: 0,
      message: 'Error. Try again!'
    })
  }
  var logUser = {
    mail: req.body.mail,
    password: crypto.createHash('sha256').update(req.body.pwd).digest('hex')
  }
  db.query('SELECT `mail`, `name`, `uuid` FROM `user` WHERE `mail` = ? AND `password` = ?', [logUser.mail, logUser.password], function (error, results, fields) {
    res.json({
      status: (error || results.length === 0) ? 0 : 1,
      message: (error || results.length === 0) ? 'Wrong email or password!' : results[0]
    })
  })
})

// Registrazione di un nuovo utente [ POST ]
router.post('/register', (req, res, next) => {
  if (req.body.pwd === '' || req.body.pwd === undefined ||
      req.body.mail === '' || req.body.mail === undefined ||
      req.body.name === '' || req.body.name === undefined) {
    return res.json({
      status: 0,
      message: 'Error. Try again!'
    })
  }
  var newUser = {
    uuid: uuid(),
    mail: req.body.mail,
    password: crypto.createHash('sha256').update(req.body.pwd).digest('hex'),
    name: req.body.name,
    date: new Date().toJSON()
  }

  db.query('INSERT INTO user SET ?', newUser, function (error, results, fields) {
    res.json({
      status: (error) ? 0 : 1,
      message: (error) ? 'Error. Try again!' : 'User registered!'
    })
  })
})

module.exports = router
