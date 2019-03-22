module.exports = {
  port: 8080,
  bodyLimit: '100kb',
  corsHeaders: [
    'Link',
  ],
  prefix: '/sky/v1',
  saltRounds: 10,
  jwtAlgorithm: 'RS256',
};
