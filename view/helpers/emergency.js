const promisify = require('../../utils/promisify')

let resetCron

const isEmergency = () => promisify.query('SELECT `emergency` FROM `status` ORDER BY `id` DESC LIMIT 1')

const setEmergency = () => promisify.query('INSERT INTO `status`(`emergency`, `time`) VALUES (?,?)', [1, new Date()])

const stopEmergency = () => promisify.query('INSERT INTO `status`(`emergency`, `time`) VALUES (?,?)', [0, new Date()])

const resetPeopleRecord = () => {
  resetCron = setInterval(() => {
    promisify.query('UPDATE `route` SET `people`= 0')
  }, 30000)
}

const stopResetPeople = () => {
  clearInterval(resetCron)
  promisify.query('UPDATE `route` SET `people`= 0')
}

module.exports = {
  isEmergency,
  setEmergency,
  stopEmergency,
  resetPeopleRecord,
  stopResetPeople
}
