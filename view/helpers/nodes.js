const promisify = require('../../utils/promisify')

const getNodes = () => promisify.query('SELECT * FROM `node`')

const addNode = (el) => promisify.query('INSERT INTO `node`(`code`, `beacon`, `x`, `y`, `altitude`, `width`, `secure`) values (?,?,?,?,?,?,?)', [el.code, el.beacon, el.x, el.y, el.altitude, el.width, el.secure])

const getNodeDetails = (id) => promisify.query('SELECT * FROM `node` WHERE `id` = ?', [id])

const updateNode = (el) => promisify.query('UPDATE `node` SET `code`= ?, `beacon`= ?, `x`= ?, `y`= ?, `altitude`= ?, `width`= ?, `secure`= ? WHERE `id` = ?', [el.code, el.beacon, el.x, el.y, el.altitude, el.width, el.secure, el.id])

const deleteNode = (id) => promisify.query('DELETE FROM `node` WHERE `id` = ?', [id])

module.exports = {
  getNodes,
  addNode,
  updateNode,
  getNodeDetails,
  deleteNode
}
