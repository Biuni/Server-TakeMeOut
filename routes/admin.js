const express = require('express')
const ensureLogin = require('connect-ensure-login').ensureLoggedIn('/admin/login')
const passport = require('../view/helpers/auth')
const isEmergency = require('../utils/emergency')
const statsCounter = require('../view/helpers/stats')
const router = express.Router()

// Stats Page
router.get('/', ensureLogin, (req, res) => {
  let emergencyStatus = false

  isEmergency()
    .then(status => {
      if (status[0].emergency === 1) {
        emergencyStatus = true
      }
    })
    .then(() => {
      return statsCounter
    })
    .then(stats => {
      res.render('../view/admin', {
        emergencyStatus: emergencyStatus,
        nodes: stats[0][0].nodes,
        routes: stats[1][0].routes,
        users: stats[2][0].users,
        emergency: stats[3][0].emergency,
        lastMember: stats[4],
        lastEmergency: stats[5],
        emergencyGraph: JSON.stringify(stats[5])
      })
    })
})

// Login Page
router.get('/login', (req, res) => {
  res.render('../view/login', { layout: false })
})

// Change Password Page
router.get('/password', ensureLogin, (req, res) => {
  res.render('../view/password')
})

// View Users Page
router.get('/view-users', ensureLogin, (req, res) => {
  res.render('../view/users')
})

// View Routes Page
router.get('/view-routes', ensureLogin, (req, res) => {
  res.render('../view/routes')
})

// View Nodes Page
router.get('/view-nodes', ensureLogin, (req, res) => {
  res.render('../view/nodes')
})

// Add Node Page
router.get('/add-node', ensureLogin, (req, res) => {
  res.render('../view/addnode')
})

// Add Route Page
router.get('/add-route', ensureLogin, (req, res) => {
  res.render('../view/addroute')
})

// Login
router.post('/login', passport.authenticate('local', { failureRedirect: '/admin/login' }), (req, res) => {
  res.redirect('/admin')
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/admin/login')
})

// Emergency Start
router.get('/emergency', ensureLogin, (req, res) => {
  // Send push notification to all users
  res.redirect('/admin')
})

// Emergency Stop
router.get('/emergency-stop', ensureLogin, (req, res) => {
  // Reset all people field into database
  res.redirect('/admin')
})

// Delete User
router.get('/delete-user/{id}', ensureLogin, (req, res) => {
  res.redirect('/admin')
})

module.exports = router
