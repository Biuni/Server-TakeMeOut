const express = require('express')
const Graph = require('node-dijkstra')
const Promise = require('bluebird')
const prettyTime = require('pretty-hrtime')
const promisify = require('../utils/promisify')
const isEmergency = require('../utils/emergency')
const weight = require('../utils/weight')

const router = express.Router()
const graph = new Map()

/**
 * @api - {GET} - /nav/send - Send position and receive shortest path
 * @apiName - SendNav
 * @apiGroup - Navigation
 *
 * @apiParam - {String} beacon - The Beacon identifier
 */
router.get('/send/:beacon', (req, res, next) => {
  const startTime = process.hrtime()
  const beaconId = req.params.beacon
  const getAllNodes = 'SELECT DISTINCT `code` FROM `node`'
  const getNextNode = 'SELECT * FROM `route` WHERE `code_p1` = ? OR `code_p2` = ?'
  const getSafePlace = 'SELECT DISTINCT `code` FROM `node` WHERE `secure` = 1'
  const getNodeBeacon = 'SELECT `code` FROM `node` WHERE `beacon` = ?'
  const updateCounter = 'UPDATE `route` SET `people` = `people` + 1 WHERE (`code_p1` = ? AND `code_p2` = ?) OR (`code_p1` = ? AND `code_p2` = ?)'

  let safePlace = null
  let shortestPath = null
  let findShortest = Number.MAX_SAFE_INTEGER

  Promise.map(promisify.query(getAllNodes), node => {
    return Promise.all([
      promisify.query(getNextNode, [node.code, node.code])
        .then(nextNode => {
          if (nextNode.length > 0) {
            let newNodeGraph = new Map()
            nextNode.forEach(next => {
              if (next.code_p1 !== node.code) {
                newNodeGraph.set(
                  next.code_p1,
                  weight(next.people, next.LOS, next.V, next.R, next.K, next.L, next.pv, next.pr, next.pk, next.pl)
                )
              }
              if (next.code_p2 !== node.code) {
                newNodeGraph.set(
                  next.code_p2,
                  weight(next.people, next.LOS, next.V, next.R, next.K, next.L, next.pv, next.pr, next.pk, next.pl)
                )
              }
            })
            graph.set(node.code, newNodeGraph)
          }
        })
    ])
  })
    .then(() => {
      return promisify.query(getSafePlace)
    })
    .then(safeNodes => {
      safePlace = safeNodes
      return promisify.query(getNodeBeacon, [beaconId])
    })
    .then(nodeId => {
      const route = new Graph(graph)
      const node = (nodeId.length > 0) ? nodeId[0].code : 0

      safePlace.forEach(safe => {
        let dijkstraRes = route.path(node, safe.code, { cost: true })
        if (dijkstraRes.cost < findShortest) {
          findShortest = dijkstraRes.cost
          shortestPath = dijkstraRes
        }
      })

      return shortestPath
    })
    .then(shortestPath => {
      res.json({
        status: (shortestPath.path === null) ? 0 : 1,
        message: (shortestPath.path === null) ? 'Safe place or incorrect Beacon ID' : null,
        results: (shortestPath.path === null) ? {} : shortestPath,
        time: (shortestPath.path === null) ? null : prettyTime(process.hrtime(startTime))
      })

      return shortestPath
    })
    .then(shortestPath => {
      isEmergency().then(status => {
        if (shortestPath.path !== null && status[0].emergency === 1) {
          promisify.query(updateCounter, [shortestPath.path[0], shortestPath.path[1], shortestPath.path[1], shortestPath.path[0]])
        }
      })
    })
})

/**
 * @api - {GET} - /nav/path - Send position, arrive node and receive shortest path
 * @apiName - PathSearch
 * @apiGroup - Navigation
 *
 * @apiParam - {String} beacon_start - The start Beacon identifier
 * @apiParam - {String} beacon_end - The arrive Beacon identifier
 */
router.get('/path/:beacon_start/:beacon_end', (req, res, next) => {
  const startTime = process.hrtime()
  const beaconStart = req.params.beacon_start
  const beaconEnd = req.params.beacon_end
  const getAllNodes = 'SELECT DISTINCT `code` FROM `node`'
  const getNextNode = 'SELECT * FROM `route` WHERE `code_p1` = ? OR `code_p2` = ?'
  const getArrivePlace = 'SELECT `code` FROM `node` WHERE `beacon` = ?'
  const getNodeBeacon = 'SELECT `code` FROM `node` WHERE `beacon` = ?'
  const updateCounter = 'UPDATE `route` SET `people` = `people` + 1 WHERE (`code_p1` = ? AND `code_p2` = ?) OR (`code_p1` = ? AND `code_p2` = ?)'

  let safePlace = null

  Promise.map(promisify.query(getAllNodes), node => {
    return Promise.all([
      promisify.query(getNextNode, [node.code, node.code])
        .then(nextNode => {
          if (nextNode.length > 0) {
            let newNodeGraph = new Map()
            nextNode.forEach(next => {
              if (next.code_p1 !== node.code) {
                newNodeGraph.set(
                  next.code_p1,
                  weight(next.people, next.LOS, next.V, next.R, next.K, next.L, next.pv, next.pr, next.pk, next.pl)
                )
              }
              if (next.code_p2 !== node.code) {
                newNodeGraph.set(
                  next.code_p2,
                  weight(next.people, next.LOS, next.V, next.R, next.K, next.L, next.pv, next.pr, next.pk, next.pl)
                )
              }
            })
            graph.set(node.code, newNodeGraph)
          }
        })
    ])
  })
    .then(() => {
      return promisify.query(getArrivePlace, [beaconEnd])
    })
    .then(safeNodes => {
      safePlace = safeNodes
      return promisify.query(getNodeBeacon, [beaconStart])
    })
    .then(nodeId => {
      const route = new Graph(graph)
      const node = (nodeId.length > 0) ? nodeId[0].code : 0

      return route.path(node, safePlace[0].code, { cost: true })
    })
    .then(shortestPath => {
      res.json({
        status: (shortestPath.path === null) ? 0 : 1,
        message: (shortestPath.path === null) ? 'Incorrect Beacon ID or unreachable node.' : null,
        results: (shortestPath.path === null) ? {} : shortestPath,
        time: (shortestPath.path === null) ? null : prettyTime(process.hrtime(startTime))
      })

      return shortestPath
    })
    .then(shortestPath => {
      isEmergency().then(status => {
        if (shortestPath.path !== null && status[0].emergency === 1) {
          promisify.query(updateCounter, [shortestPath.path[0], shortestPath.path[1], shortestPath.path[1], shortestPath.path[0]])
        }
      })
    })
})

module.exports = router
