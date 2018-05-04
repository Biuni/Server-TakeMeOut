const express = require('express')
const router = express.Router()

// Controllo la connessione al server [ GET ]
router.get('/', (req, res, next) => {
  res.json({
    api: {
      connection: [{
        type: 'GET',
        path: '/conn/info',
        params: null
      }],
      user: [{
        type: 'GET',
        path: '/user/get/:uuid',
        params: [{
          name: 'uuid',
          type: 'String'
        }]
      }, {
        type: 'POST',
        path: '/user/register',
        params: [{
          name: 'mail',
          type: 'String'
        }, {
          name: 'pwd',
          type: 'String'
        }, {
          name: 'name',
          type: 'String'
        }]
      }, {
        type: 'POST',
        path: '/user/login',
        params: [{
          name: 'mail',
          type: 'String'
        }, {
          name: 'pwd',
          type: 'String'
        }]
      }]
    }
  })
})

module.exports = router
