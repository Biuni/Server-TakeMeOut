const express = require('express')
const path = require('path')
const ensureLogin = require('connect-ensure-login').ensureLoggedIn('/admin/login')
const passport = require('../utils/auth')
const router = express.Router()

router.get('/', ensureLogin, (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '/../view') })
})

router.get('/login', (req, res) => {
  res.sendFile('login.html', { root: path.join(__dirname, '/../view') })
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), (req, res) => {
  res.redirect('/admin')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/admin/login')
})

module.exports = router
