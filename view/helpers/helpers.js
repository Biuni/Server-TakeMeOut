const getInitials = (name) => name.split(' ').map((n) => n[0]).join('')

const getTime = (date) => date.split(' ')[1]

const getDate = (date) => date.split(' ')[0]

const getEmergencyGraph = (dates) => {
  const allEmergency = JSON.parse(dates)
  let allMonth = []

  allEmergency.forEach(element => {
    allMonth.push(element.time.split(' ')[0].split('-')[1])
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

module.exports = {
  getInitials,
  getTime,
  getDate,
  getEmergencyGraph
}
