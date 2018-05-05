const express = require('express')
const router = express.Router()

/**
 * @api - {GET} - / - Get the API documentation
 * @apiName - GetDocumentation
 * @apiGroup - Documentation
 */
router.get('/', (req, res, next) => {
  res.json({
    title: 'TakeMeOut Server',
    description: 'RESTful API used by TakeMeOut application.',
    authors: [
      'Gianluca Bonifazi <info.gianlucabonifazi@gmail.com> (http://biuni.it)',
      'Gianpio Sozzo <sozzogianpio@gmail.com>',
      'Emanuele Longheu <longheu.emanuele@gmail.com>',
      'Mattia Campeggi <campeggi92@gmail.com>',
      'Luca Sanchioni <lucasan1211@gmail.com>'
    ],
    repository: 'https://github.com/Biuni/Server-TakeMeOut.git',
    api: {
      connection: [{
        type: 'GET',
        path: '/conn/info',
        info: 'Get information about the server and the database connection',
        params: null
      }, {
        type: 'GET',
        path: '/conn/data',
        info: 'Get the database table with node information',
        params: null
      }],
      user: [{
        type: 'GET',
        path: '/user/get/:uuid',
        info: 'Get user information',
        params: [{
          name: 'uuid',
          type: 'String'
        }]
      }, {
        type: 'POST',
        path: '/user/register',
        info: 'Register a new user',
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
        info: 'Login an user',
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
