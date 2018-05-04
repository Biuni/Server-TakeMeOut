/* eslint-env mocha */

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../index')

const expect = chai.expect
chai.use(chaiHttp)

describe('Connection', () => {
  it('Server responds with status 200', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        if (err) return
        expect(res).to.have.status(200)
        done()
      })
  })
})
