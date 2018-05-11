const express = require('express')
const Graph = require('node-dijkstra')
const promise = require('../config/promisify')

const router = express.Router()

const graph = new Map()
const safePlace = ['150EMR1', '150EMRL', '155UP']

/**
 * @api - {POST} - /nav/send - Send position and receive shortest path
 * @apiName - SendNav
 * @apiGroup - Navigation
 *
 * @apiParam - {String} code - The Beacon identifier
 */
router.get('/send/:beacon', (req, res, next) => {
  let allNodeCode, nextNode, error, shortestPath
  promise.query('SELECT DISTINCT `code` FROM `node`')
    .then(rows => {
      allNodeCode = rows
      error = false
    }, err => {
      error = err
      return error
    })
    .then(() => {
      allNodeCode.forEach((node, idx, array) => {
        return promise.query('SELECT `code_p1`, `code_p2` FROM `route` WHERE `code_p1` = ? OR `code_p2` = ?', [node.code, node.code])
          .then(rows => {
            nextNode = rows
            error = false
          }, err => {
            error = err
            return error
          }).then(() => {
            if (nextNode.length !== 0) {
              var a = new Map()
              nextNode.forEach(afterNode => {
                if (afterNode.code_p1 !== node.code) {
                  a.set(afterNode.code_p1, 1)
                }
                if (afterNode.code_p2 !== node.code) {
                  a.set(afterNode.code_p2, 1)
                }
              })
              graph.set(node.code, a)
            }

            // Ultima iterazione
            if (idx === array.length - 1) {
              const route = new Graph(graph)

              for (let el of safePlace) {
                var findPath = route.path(req.params.beacon, el)
                if (findPath !== null) {
                  shortestPath = findPath

                  res.json({
                    path: shortestPath
                  })

                  break
                }
              }
            }
          })
      })
    })
})

module.exports = router
