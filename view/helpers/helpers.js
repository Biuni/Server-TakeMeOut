const moment = require('moment')

const getInitials = (name) => name.split(' ').map((n) => n[0]).join('').toUpperCase()

const getTime = (date) => moment(date).format('HH:mm')

const getDate = (date) => moment(date).format('DD-MM-YYYY')

const getEmergencyGraph = (dates) => {
  const allEmergency = JSON.parse(dates)
  let allMonth = []

  allEmergency.forEach(element => {
    allMonth.push(moment(element.time).format('MM'))
  })

  return [
    'data1',
    allMonth.filter(x => x === '01').length,
    allMonth.filter(x => x === '02').length,
    allMonth.filter(x => x === '03').length,
    allMonth.filter(x => x === '04').length,
    allMonth.filter(x => x === '05').length,
    allMonth.filter(x => x === '06').length,
    allMonth.filter(x => x === '07').length,
    allMonth.filter(x => x === '08').length,
    allMonth.filter(x => x === '09').length,
    allMonth.filter(x => x === '10').length,
    allMonth.filter(x => x === '11').length,
    allMonth.filter(x => x === '12').length
  ]
}

const formatDate = (date) => {
  return moment(date).format('DD-MM-YYYY / HH:mm')
}

const safePlace = (value) => {
  return (value === 1) ? 'success' : 'warning'
}

const switchOn = (safe) => (safe === 1) ? 'checked' : ''

module.exports = {
  getInitials,
  getTime,
  getDate,
  getEmergencyGraph,
  formatDate,
  safePlace,
  switchOn
}
