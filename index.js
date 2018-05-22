const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const ip = require('./utils/ip').address()
const global = require('./utils/global')

const app = express()
const port = global.PORT || 3000

const doc = require('./routes/documentation')
const connection = require('./routes/connection')
const user = require('./routes/user')
const navigation = require('./routes/navigation')
const admin = require('./routes/admin')
const notfound = require('./routes/notfound')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

app.use('/assets', express.static(path.join(__dirname, '/static')))

app.use(require('express-session')({ secret: global.KEY, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Routing
app.use('/', doc)
app.use('/conn', connection)
app.use('/user', user)
app.use('/nav', navigation)
app.use('/admin', admin)
app.use(notfound)

app.listen(port, ip, () => {
  console.log(`Live on => ${ip}:3000\n`)
})

module.exports = app
