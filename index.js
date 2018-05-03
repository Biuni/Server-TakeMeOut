const express = require('express')
const ip = require('ip').address()

const app = express()
const port = process.env.PORT || 3000

app.listen(port, ip, () => {
  console.log('Live on: ' + ip + ':3000')
})