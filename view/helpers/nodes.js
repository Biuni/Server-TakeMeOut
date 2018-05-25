const promisify = require('../../utils/promisify')

const getNodes = () => promisify.query('SELECT * FROM `node`')

module.exports = {
  getNodes
}
