const request = require('supertest');
const chai = require('chai');

const utils = require('../src/lib/utils');
const appBuilder = require('../src/app');


const expect = chai.expect;
// FIXME:
// this is not the best way to test
const fakeUser = {
  "nome": "Alex Dias",
  "email": "alex" + Math.floor(Math.random() * 10000) + "@gmail.com",
  "senha": "pass1234",
  "telefones": [
    {
      "numero": "987209245",
      "ddd": "19"
    }
  ]
};

describe('utils functions', () => {
  describe('generate error message - #errorOutput()', () => {
    it('should return an object', () => {
      expect(utils.errorOutput('code is 123')).to.eql({ mensagem: 'code is 123' });
    });
  });

  describe('extract token from Authentication value - #extractToken()', () => {
    it('should return the token', () => {
      const token = '389388Secret28822'
      const bearerToken = 'Bearer ' + token;
      expect(utils.extractToken(bearerToken)).to.equal(token);
    });

    it('should throw an Error', () => {
      const token = '389388Secret28822'
      const bearerToken = 'BeareR ' + token;
      expect(utils.extractToken.bind(utils, bearerToken)).to.throw('Bad token format value');
    });
  });
});

describe('integration test', () => {
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

  describe('POST /user/signin', () => {
    it('shoud signin the user from email/password', (done) => {
      appBuilder()
        .then(app => {
          request(app.listen())
            .post('/sky/v1/user/signin')
            .send({ email: fakeUser.email, senha: fakeUser.senha })
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

    it('shoud return 404 from wrong email', (done) => {
      appBuilder()
        .then(app => {
          request(app.listen())
            .post('/sky/v1/user/signin')
            .send({ email: fakeUser.email + 'A', senha: fakeUser.senha })
            .end((err, res) => {
              if (err)
                return done(err);
              expect(res.statusCode).to.equal(404);
              expect(res.body).to.eql({ mensagem: 'Usuário e/ou senha inválidos' });
              done();
            });
        })
        .catch(err => done(err));
    });

    it('shoud return 401 from wrong password', (done) => {
      appBuilder()
        .then(app => {
          request(app.listen())
            .post('/sky/v1/user/signin')
            .send({ email: fakeUser.email, senha: fakeUser.senha + 'A' })
            .end((err, res) => {
              if (err)
                return done(err);
              expect(res.statusCode).to.equal(401);
              expect(res.body).to.eql({ mensagem: 'Usuário e/ou senha inválidos' });
              done();
            });
        })
        .catch(err => done(err));
    });
  });

  describe('GET /user/:user_id', () => {
    it('seach an user after signin', (done) => {
      appBuilder()
        .then(app => {
          const server = app.listen();
          request(server)
            .post('/sky/v1/user/signin')
            .send({ email: fakeUser.email, senha: fakeUser.senha })
            .end((err, res) => {
              if (err)
                return done(err);
              expect(res.statusCode).to.equal(200);
              // require signin to get token and id
              request(server)
                .get('/sky/v1/user/' + res.body.id)
                .set('Authorization', 'Bearer ' + res.body.token)
                .end((err, res) => {
                  if (err)
                    return done(err);
                  expect(res.statusCode).to.equal(200);
                  done();
                });
            });
        })
        .catch(err => done(err));
    });
  });

});

