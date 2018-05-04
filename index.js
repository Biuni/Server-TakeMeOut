const express = require('express')
const ip = require('ip').address()

const app = express()
const port = process.env.PORT || 3000

const connection = require('./routes/connection')
const user = require('./routes/user')

app.use('/', connection)
app.use('/user', user)

app.listen(port, ip, () => {
  console.log('Live on: ' + ip + ':3000')
})