const promisify = require('../../utils/promisify')
const Promise = require('bluebird')

const nodes = () => promisify.query('SELECT COUNT(*) AS `nodes` FROM `node`')
const routes = () => promisify.query('SELECT COUNT(*) AS `routes` FROM `route`')
const members = () => promisify.query('SELECT COUNT(*) AS `users` FROM `user`')
const emergency = () => promisify.query('SELECT COUNT(*) AS `emergency` FROM `status` WHERE `emergency` = 1')
const lastMembers = () => promisify.query('SELECT `mail`, `name`, `id` FROM `user` WHERE `id` <> 1 ORDER BY `id` DESC LIMIT 5')
const lastEmergency = () => promisify.query('SELECT `time` FROM `status` WHERE `time` >= DATE_SUB(NOW(),INTERVAL 1 YEAR) AND `emergency` = 1 ORDER BY `time` DESC')

module.exports = () => Promise.all([nodes(), routes(), members(), emergency(), lastMembers(), lastEmergency()])
