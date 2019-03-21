const assert = require('assert');

const request = require('supertest');

const utils = require('../src/lib/utils');
const app = require('../src/app')();

describe('utils functions', () => {
  describe('#add()', () => {
    it('should return 2', () => {
      assert.equal(utils.add(1, 1), 2);
    });
  });
});

describe('integration test', () => {
  describe('GET /hello', () => {
    it('shoud return "world"', (done) => {
      request(app.listen())
        .get('/sky/v1/hello')
        .expect(200, { message: 'world' })
        .end((err) => {
          if (err)
            return done(err);
          done();
        })
    });
  });
});