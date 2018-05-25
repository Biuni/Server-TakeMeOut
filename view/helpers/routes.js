const promisify = require('../../utils/promisify')

const getRoutes = () => promisify.query('SELECT * FROM `route`')

module.exports = {
  getRoutes
}
