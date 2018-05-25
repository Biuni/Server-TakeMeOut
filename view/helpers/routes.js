const promisify = require('../../utils/promisify')

const getRoutes = () => promisify.query('SELECT * FROM `route`')

const addRoute = (el) => promisify.query('INSERT INTO `route`(`code_p1`, `code_p2`, `people`, `LOS`, `V`, `R`, `K`, `L`, `pv`, `pr`, `pk`, `pl`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [el.code_p1, el.code_p2, el.people, el.LOS, el.V, el.R, el.K, el.L, el.pv, el.pr, el.pk, el.pl])

const getRouteDetails = (id) => promisify.query('SELECT * FROM `route` WHERE `id` = ?', [id])

const updateRoute = (el) => promisify.query('UPDATE `route` SET `code_p1`= ?, `code_p2`= ?, `people`= ?, `LOS`= ?, `V`= ?, `R`= ?, `K`= ?, `L`= ?, `pv`= ?, `pr`= ?, `pk`= ?, `pl`= ? WHERE `id`= ?', [el.code_p1, el.code_p2, el.people, el.LOS, el.V, el.R, el.K, el.L, el.pv, el.pr, el.pk, el.pl, el.id])

const deleteRoute = (id) => promisify.query('DELETE FROM `route` WHERE `id` = ?', [id])

module.exports = {
  getRoutes,
  addRoute,
  getRouteDetails,
  updateRoute,
  deleteRoute
}
