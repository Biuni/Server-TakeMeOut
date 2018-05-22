const promisify = require('./promisify')

module.exports = () => promisify.query('SELECT `emergency` FROM `status` ORDER BY `id` DESC LIMIT 1')
