const express = require('express')
const bodyParser = require('body-parser')
const ip = require('ip').address()
const global = require('./config/global')

const app = express()
const port = global.PORT || 3000

const connection = require('./routes/connection')
const user = require('./routes/user')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

// Routing
app.use('/conn', connection)
app.use('/user', user)

app.listen(port, ip, () => {
  console.log('Live on => ' + ip + ':3000\n')
})

module.exports = app
