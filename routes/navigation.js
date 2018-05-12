const express = require('express')
const Graph = require('node-dijkstra')
const Promise = require('bluebird')
const promisify = require('../config/promisify')

const router = express.Router()
const graph = new Map()

/**
 * @api - {POST} - /nav/send - Send position and receive shortest path
 * @apiName - SendNav
 * @apiGroup - Navigation
 *
 * @apiParam - {String} code - The Beacon identifier
 */
router.get('/send/:beacon', (req, res, next) => {
  const getAllNodes = 'SELECT DISTINCT `code` FROM `node`'
  const getNextNode = 'SELECT `code_p1`, `code_p2` FROM `route` WHERE `code_p1` = ? OR `code_p2` = ?'
  const getSafePlace = 'SELECT DISTINCT `code` FROM `node` WHERE `secure` = 1'

  Promise.map(promisify.query(getAllNodes), node => {
    return Promise.all([
      promisify.query(getNextNode, [node.code, node.code])
        .then(nextNode => {
          if (nextNode.length > 0) {
            let newNodeGraph = new Map()
            nextNode.forEach(next => {
              if (next.code_p1 !== node.code) {
                newNodeGraph.set(next.code_p1, 1)
              }
              if (next.code_p2 !== node.code) {
                newNodeGraph.set(next.code_p2, 1)
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
    .then(safePlace => {
      const route = new Graph(graph)
      const beaconId = req.params.beacon

      let shortestPath
      let findShortest = 1000

      safePlace.forEach(safe => {
        let dijkstraRes = route.path(beaconId, safe.code, { cost: true })
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
        route: (shortestPath.path === null) ? {} : shortestPath
      })
    })
})

module.exports = router
