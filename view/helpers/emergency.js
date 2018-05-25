const promisify = require('../../utils/promisify')

let resetCron

const isEmergency = () => promisify.query('SELECT `emergency` FROM `status` ORDER BY `id` DESC LIMIT 1')

const setEmergency = () => promisify.query('INSERT INTO `status`(`emergency`, `time`) VALUES (?,?)', [1, new Date()])

const stopEmergency = () => promisify.query('INSERT INTO `status`(`emergency`, `time`) VALUES (?,?)', [0, new Date()])

const resetPeopleRecord = () => {
  resetCron = setInterval(() => console.log('Reset people =>', new Date()), 1000)
}

const stopResetPeople = () => clearInterval(resetCron)

module.exports = {
  isEmergency,
  setEmergency,
  stopEmergency,
  resetPeopleRecord,
  stopResetPeople
}
