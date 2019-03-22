const assert = require('assert');

const request = require('supertest');
const chai = require('chai');

const utils = require('../src/lib/utils');
const appBuilder = require('../src/app');


const expect = chai.expect;
// FIXME:
// this is not the best way to test
const fakeUser = {
  "nome": "Alex Dias",
  "email": "alex" + Math.floor(Math.random() * 1000) + "@gmail.com",
  "senha": "pass1234",
  "telefones": [
    {
      "numero": "987402245",
      "ddd": "19"
    }
  ]
};

describe('utils functions', () => {
  describe('#add()', () => {
    it('should return 2', () => {
      assert.equal(utils.add(1, 1), 2);
    });
  });

  describe('generate error message - #errorOutput', () => {
    it('should return an object', () => {
      assert.deepEqual(utils.errorOutput('code is 123'), { mensagem: 'code is 123' });
    })
  })
});

describe('integration test', () => {
  describe('GET /hello', () => {
    it('shoud return "world"', (done) => {
      appBuilder()
        .then(app => {
          request(app.listen())
            .get('/sky/v1/hello')
            .expect(200, { message: 'world' })
            .end((err) => {
              if (err)
                return done(err);
              done();
            });
        })
        .catch(err => done(err));
    });
  });

  describe('POST /user/signup', () => {
    it('shoud create and return a user', (done) => {
      appBuilder()
        .then(app => {
          request(app.listen())
            .post('/sky/v1/user/signup')
            .send(fakeUser)
            .end((err, res) => {
              if (err)
                return done(err);
              expect(res.statusCode).to.equal(200);
              expect(res.body)
                .to.have.all.keys(
                  'id', 'nome', 'email', 'senha', 'telefones', 'data_criacao',
                  'data_atualizacao', 'ultimo_login', 'token',
                );
              done();
            });
        })
        .catch(err => done(err));
    });
  });
});

