const express = require('express')
const ensureLogin = require('connect-ensure-login').ensureLoggedIn('/admin/login')
const passport = require('../utils/auth')
const router = express.Router()

router.get('/', ensureLogin, (req, res) => {
  res.render('../view/admin', {
    emergencyStatus: false
  })
})

router.get('/login', (req, res) => {
  res.render('../view/login', { layout: false })
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), (req, res) => {
  res.redirect('/admin')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/admin/login')
})

module.exports = router
