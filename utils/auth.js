const passport = require('passport')
const Strategy = require('passport-local').Strategy
const crypto = require('crypto')
const db = require('./db')

passport.use(new Strategy((username, password, cb) => {
  db.query('SELECT `uuid`, `name`, `password` FROM `user` WHERE `id` = 1', (error, results, fields) => {
    if (error) { return cb(error) }
    if (results[0].password !== crypto.createHash('sha256').update(password).digest('hex')) { return cb(null, false) }
    return cb(null, results[0])
  })
}))

passport.serializeUser((user, cb) => {
  cb(null, user.uuid)
})

passport.deserializeUser((id, cb) => {
  db.query('SELECT `uuid`, `name`, `password` FROM `user` WHERE `uuid` = ?', [id], (error, results, fields) => {
    if (error) { return cb(error) }
    cb(null, results[0])
  })
})

module.exports = passport
