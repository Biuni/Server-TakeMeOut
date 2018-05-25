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

// Add Node Page
router.get('/add-node', ensureLogin, (req, res) => {
  checkEmergency()
  res.render('../view/addnode', {
    emergencyStatus: emergencyStatus,
    result: {
      display: req.query.res !== undefined,
      save: req.query.res === 'ok'
    }
  })
})

// Add Route Page
router.get('/add-route', ensureLogin, (req, res) => {
  checkEmergency()
  res.render('../view/addroute', {
    emergencyStatus: emergencyStatus,
    result: {
      display: req.query.res !== undefined,
      save: req.query.res === 'ok'
    }
  })
})

// Modify Node Page
router.get('/mod-node', ensureLogin, (req, res) => {
  checkEmergency()
  nodes.getNodeDetails(req.query.id)
    .then(nodeInfo => {
      res.render('../view/modnode', {
        emergencyStatus: emergencyStatus,
        node: nodeInfo[0],
        result: {
          display: req.query.res !== undefined,
          save: req.query.res === 'ok'
        }
      })
    })
})

// Modify Route Page
router.get('/mod-route', ensureLogin, (req, res) => {
  checkEmergency()
  routes.getRouteDetails(req.query.id)
    .then(routeInfo => {
      res.render('../view/modroute', {
        emergencyStatus: emergencyStatus,
        route: routeInfo[0],
        result: {
          display: req.query.res !== undefined,
          save: req.query.res === 'ok'
        }
      })
    })
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
  // TODO: Send push notification to all users
  emergency.setEmergency()
  emergency.resetPeopleRecord()
  res.redirect('/admin')
})

// Emergency Stop
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

// Delete Route
router.get('/delete-route/:id', ensureLogin, (req, res) => {
  routes.deleteRoute(req.params.id)
    .then(result => {
      res.redirect('/admin/view-routes')
    })
})

// Delete Node
router.get('/delete-node/:id', ensureLogin, (req, res) => {
  nodes.deleteNode(req.params.id)
    .then(result => {
      res.redirect('/admin/view-nodes')
    })
})

// Add Node
router.post('/add-node', ensureLogin, (req, res) => {
  const newNode = {
    code: req.body.code,
    beacon: req.body.beacon,
    x: req.body.x.replace(/,/g, '.'),
    y: req.body.y.replace(/,/g, '.'),
    altitude: req.body.altitude.replace(/,/g, '.'),
    width: req.body.width.replace(/,/g, '.'),
    secure: (req.body.secure === 'on') ? 1 : 0
  }
  if (newNode.code === undefined || newNode.beacon === undefined || newNode.code === '' || newNode.beacon === '') {
    res.redirect('/admin/add-node?res=ko')
  } else {
    nodes.addNode(newNode)
      .then(() => {
        res.redirect('/admin/add-node?res=ok')
      })
  }
})

// Modify Node
router.post('/mod-node', ensureLogin, (req, res) => {
  const updatedNode = {
    id: req.body.id,
    code: req.body.code,
    beacon: req.body.beacon,
    x: req.body.x.replace(/,/g, '.'),
    y: req.body.y.replace(/,/g, '.'),
    altitude: req.body.altitude.replace(/,/g, '.'),
    width: req.body.width.replace(/,/g, '.'),
    secure: (req.body.secure === 'on') ? 1 : 0
  }
  if (updatedNode.code === undefined || updatedNode.beacon === undefined || updatedNode.code === '' || updatedNode.beacon === '') {
    res.redirect(`/admin/mod-node?id=${updatedNode.id}&res=ko`)
  } else {
    nodes.updateNode(updatedNode)
      .then(() => {
        res.redirect(`/admin/mod-node?id=${updatedNode.id}&res=ok`)
      })
  }
})

// Add Route
router.post('/add-route', ensureLogin, (req, res) => {
  const newRoute = {
    code_p1: req.body.code_p1,
    code_p2: req.body.code_p2,
    people: 0,
    LOS: (req.body.LOS === '') ? 0 : req.body.LOS.replace(/,/g, '.'),
    V: (req.body.V === '') ? 0 : req.body.V.replace(/,/g, '.'),
    R: (req.body.R === '') ? 0 : req.body.R.replace(/,/g, '.'),
    K: (req.body.K === '') ? 0 : req.body.K.replace(/,/g, '.'),
    L: (req.body.L === '') ? 0 : req.body.L.replace(/,/g, '.'),
    pv: (req.body.pv === '') ? 0 : req.body.pv.replace(/,/g, '.'),
    pr: (req.body.pr === '') ? 0 : req.body.pr.replace(/,/g, '.'),
    pk: (req.body.pk === '') ? 0 : req.body.pk.replace(/,/g, '.'),
    pl: (req.body.pl === '') ? 0 : req.body.pl.replace(/,/g, '.')
  }
  if (newRoute.code_p1 === undefined || newRoute.code_p2 === undefined || newRoute.code_1 === '' || newRoute.code_p2 === '') {
    res.redirect('/admin/add-route?res=ko')
  } else {
    routes.addRoute(newRoute)
      .then(() => {
        res.redirect('/admin/add-route?res=ok')
      })
  }
})

// Modify Node
router.post('/mod-route', ensureLogin, (req, res) => {
  const updatedRoute = {
    id: req.body.id,
    code_p1: req.body.code_p1,
    code_p2: req.body.code_p2,
    people: 0,
    LOS: (req.body.LOS === '') ? 0 : req.body.LOS.replace(/,/g, '.'),
    V: (req.body.V === '') ? 0 : req.body.V.replace(/,/g, '.'),
    R: (req.body.R === '') ? 0 : req.body.R.replace(/,/g, '.'),
    K: (req.body.K === '') ? 0 : req.body.K.replace(/,/g, '.'),
    L: (req.body.L === '') ? 0 : req.body.L.replace(/,/g, '.'),
    pv: (req.body.pv === '') ? 0 : req.body.pv.replace(/,/g, '.'),
    pr: (req.body.pr === '') ? 0 : req.body.pr.replace(/,/g, '.'),
    pk: (req.body.pk === '') ? 0 : req.body.pk.replace(/,/g, '.'),
    pl: (req.body.pl === '') ? 0 : req.body.pl.replace(/,/g, '.')
  }
  if (updatedRoute.code_p1 === undefined || updatedRoute.code_p2 === undefined || updatedRoute.code_1 === '' || updatedRoute.code_p2 === '') {
    res.redirect(`/admin/mod-route?id=${updatedRoute.id}&res=ko`)
  } else {
    routes.updateRoute(updatedRoute)
      .then(() => {
        res.redirect(`/admin/mod-route?id=${updatedRoute.id}&res=ok`)
      })
  }
})

// Change Password
router.post('/password', ensureLogin, (req, res) => {
  const oldPwd = req.body.old_pwd
  const newPwd = req.body.new_pwd
  const repPwd = req.body.rep_pwd

  if (oldPwd === '' || oldPwd === undefined || newPwd === '' || newPwd === undefined || repPwd === '' || repPwd === undefined || newPwd !== repPwd) {
    res.redirect(`/admin/password?res=ko`)
  } else {
    users.changePwd(oldPwd, newPwd)
      .then(changed => {
        let result = (changed) ? 'ok' : 'ko'
        res.redirect(`/admin/password?res=${result}`)
      })
  }
})

module.exports = router
