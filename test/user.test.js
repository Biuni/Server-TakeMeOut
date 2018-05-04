/* eslint-env mocha */

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('User', () => {
  it('GET - user info responds with status 200', (done) => {
    chai.request(app)
      .get('/user/get/1')
      .then((res) => {
        expect(res).to.have.status(200)
        done()
      })
      .catch((err) => {
        throw err
      })
  })
  it('GET - user info response is a JSON', (done) => {
    chai.request(app)
      .get('/user/get/1')
      .then((res) => {
        expect(res.body).to.be.an('object')
        done()
      })
      .catch((err) => {
        throw err
      })
  })
  it('POST - send not JSON data to create user responds always a JSON', (done) => {
    chai.request(app)
      .post('/user/register')
      .send('randomData')
      .then((res) => {
        expect(res.body).to.be.an('object')
        done()
      })
      .catch((err) => {
        throw err
      })
  })
})
