const express = require('express')
const ensureLogin = require('connect-ensure-login').ensureLoggedIn('/admin/login')
const passport = require('../view/helpers/auth')
const emergency = require('../view/helpers/emergency')
const statsCounter = require('../view/helpers/stats')
const users = require('../view/helpers/users')
const routes = require('../view/helpers/routes')
const nodes = require('../view/helpers/nodes')
const router = express.Router()

let emergencyStatus
const checkEmergency = () => {
  emergency.isEmergency()
    .then(status => {
      emergencyStatus = status[0].emergency === 1
    })
}

// Stats Page
router.get('/', ensureLogin, (req, res) => {
  checkEmergency()
  statsCounter()
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
  checkEmergency()
  res.render('../view/password', {
    emergencyStatus: emergencyStatus,
    result: {
      display: req.query.res !== undefined,
      update: req.query.res === 'ok'
    }
  })
})

// View Users Page
router.get('/view-users', ensureLogin, (req, res) => {
  checkEmergency()
  users.getUsers()
    .then(allUsers => {
      res.render('../view/users', {
        emergencyStatus: emergencyStatus,
        users: allUsers
      })
    })
})

// View Routes Page
router.get('/view-routes', ensureLogin, (req, res) => {
  checkEmergency()
  routes.getRoutes()
    .then(allRoutes => {
      res.render('../view/routes', {
        emergencyStatus: emergencyStatus,
        routes: allRoutes
      })
    })
})

// View Nodes Page
router.get('/view-nodes', ensureLogin, (req, res) => {
  checkEmergency()
  nodes.getNodes()
    .then(allNodes => {
      res.render('../view/nodes', {
        emergencyStatus: emergencyStatus,
        nodes: allNodes
      })
    })
})

// Add Node Page -------------------------------------
router.get('/add-node', ensureLogin, (req, res) => {
  res.render('../view/addnode')
})

// Add Route Page -------------------------------------
router.get('/add-route', ensureLogin, (req, res) => {
  res.render('../view/addroute')
})

// Modify Node Page -------------------------------------
router.get('/mod-node', ensureLogin, (req, res) => {
  console.log(req.query.id)
  res.render('../view/modnode')
})

// Modify Route Page -------------------------------------
router.get('/mod-route', ensureLogin, (req, res) => {
  console.log(req.query.id)
  res.render('../view/modroute')
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

// Emergency Start -------------------------------------
router.get('/emergency', ensureLogin, (req, res) => {
  // Send push notification to all users
  emergency.setEmergency()
  emergency.resetPeopleRecord()
  res.redirect('/admin')
})

// Emergency Stop -------------------------------------
router.get('/emergency-stop', ensureLogin, (req, res) => {
  emergency.stopEmergency()
  emergency.stopResetPeople()
  res.redirect('/admin')
})

// Delete User
router.get('/delete-user/:id', ensureLogin, (req, res) => {
  users.deleteUser(req.params.id)
    .then(result => {
      res.redirect('/admin/view-users')
    })
})

// Change Password
router.post('/password', ensureLogin, (req, res) => {
  const oldPwd = req.body.old_pwd
  const newPwd = req.body.new_pwd
  const repPwd = req.body.rep_pwd

  if (oldPwd === '' || oldPwd === undefined || newPwd === '' || newPwd === undefined || repPwd === '' || repPwd === undefined || newPwd !== repPwd) {
    res.redirect(`/admin/password?res=ko`)
  } else {
    users.changePwd(oldPwd, newPwd).then(changed => {
      let result = (changed) ? 'ok' : 'ko'
      res.redirect(`/admin/password?res=${result}`)
    })
  }
})

module.exports = router
