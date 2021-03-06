const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const fs = require('fs')
const ip = require('./utils/ip').address()
const global = require('./utils/global')

const app = express()
const port = global.PORT || 3000
const hbs = exphbs.create({
  defaultLayout: path.join(__dirname, '/view/layouts/main'),
  partialsDir: path.join(__dirname, '/view/partials/'),
  helpers: require('./view/helpers/helpers')
})
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

const doc = require('./routes/documentation')
const connection = require('./routes/connection')
const user = require('./routes/user')
const navigation = require('./routes/navigation')
const admin = require('./routes/admin')
const notfound = require('./routes/notfound')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))

app.use('/assets', express.static(path.join(__dirname, '/view/static')))

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(require('express-session')({ secret: global.SESSION_KEY, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use(morgan('combined', { stream: logStream }))

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
