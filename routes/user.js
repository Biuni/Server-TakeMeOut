const uuid = require('uuid/v1')
const crypto = require('crypto')
const express = require('express')
const db = require('../utils/db')

const router = express.Router()

/**
 * @api - {GET} - /user/get/:uuid - Request user information
 * @apiName - GetUser
 * @apiGroup - User
 *
 * @apiParam - {String} uuid - Users unique ID.
 */
router.get('/get/:uuid', (req, res, next) => {
  db.query('SELECT `mail`, `name`, `uuid` FROM `user` WHERE `uuid` = ? AND `id` <> 1', [req.params.uuid], (error, results, fields) => {
    res.json({
      status: (error || results.length === 0) ? 0 : 1,
      message: (error || results.length === 0) ? `Error. ${(error) ? error.sqlMessage : 'No user with this UUID'}` : null,
      result: results
    })
  })
})

/**
 * @api - {POST} - /user/login - User authentication
 * @apiName - LoginUser
 * @apiGroup - User
 *
 * @apiParam - {String} pwd   - User password.
 * @apiParam - {String} mail  - User registration mail.
 */
router.post('/login', (req, res, next) => {
  if (req.body.pwd === '' || req.body.pwd === undefined ||
      req.body.mail === '' || req.body.mail === undefined) {
    return res.json({
      status: 0,
      message: 'Error! Try again.'
    })
  }
  var logUser = {
    mail: req.body.mail,
    password: crypto.createHash('sha256').update(req.body.pwd).digest('hex')
  }
  db.query('SELECT `mail`, `name`, `uuid` FROM `user` WHERE `mail` = ? AND `password` = ?', [logUser.mail, logUser.password], (error, results, fields) => {
    res.json({
      status: (error || results.length === 0) ? 0 : 1,
      message: (error || results.length === 0) ? `Error. ${(error) ? error.sqlMessage : 'Incorrect mail or password'}` : null,
      result: results
    })
  })
})

/**
 * @api - {POST} - /user/register - User registration
 * @apiName - RegisterUser
 * @apiGroup - User
 *
 * @apiParam - {String} pwd   - User password.
 * @apiParam - {String} mail  - User mail.
 * @apiParam - {String} name  - User name and surname.
 */
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
  db.query('INSERT INTO `user` SET ?', newUser, (error, results, fields) => {
    res.json({
      status: (error) ? 0 : 1,
      message: (error) ? `Error! ${error.sqlMessage}` : null,
      result: (error) ? `User not registered` : 'User registered'
    })
  })
})

/**
 * @api - {POST} - /user/position - Store user position
 * @apiName - UserPosition
 * @apiGroup - User
 *
 * @apiParam - {String} position      - Beacon ID (mac address).
 * @apiParam - {String} beacon_data   - Beacon information.
 */
router.post('/position', (req, res, next) => {
  if (req.body.uuid === '' || req.body.uuid === undefined ||
    req.body.position === '' || req.body.position === undefined ||
    req.body.beacon_data === '' || req.body.beacon_data === undefined) {
    return res.json({
      status: 0,
      message: 'Error. Try again!'
    })
  }
  db.query('UPDATE `user` SET `position` = ?, `beacon_data` = ? WHERE `uuid` = ?',
    [req.body.position, req.body.beacon_data, req.body.uuid],
    (error, results, fields) => {
      res.json({
        status: (error) ? 0 : 1,
        message: (error) ? `Error! ${error.sqlMessage}` : null,
        result: (error) ? `Position not registered` : 'Position registered'
      })
    })
})
module.exports = router
