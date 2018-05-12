/* eslint-env mocha */

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('Navigation', () => {
  it('GET - navigation request responds with status 200', (done) => {
    chai.request(app)
      .get('/nav/send/1')
      .then((res) => {
        expect(res).to.have.status(200)
        done()
      })
      .catch((err) => {
        throw err
      })
  })
  it('GET - navigation request response is a JSON', (done) => {
    chai.request(app)
      .get('/nav/send/1')
      .then((res) => {
        expect(res.body).to.be.an('object')
        done()
      })
      .catch((err) => {
        throw err
      })
  })
  it('GET - sending wrong beacon id to calculate shortest path responds with an error', (done) => {
    chai.request(app)
      .get('/nav/send/1')
      .then((res) => {
        expect(res.body.status).to.equal(0)
        done()
      })
      .catch((err) => {
        throw err
      })
  })
})
