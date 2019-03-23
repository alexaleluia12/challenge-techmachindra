const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const utilsPrototype = {
  errorOutput: message => ({ mensagem: message }),
  readKey: (keyName) => {
    const pRead = promisify(fs.readFile);
    const keyPath = path.join(process.cwd(), 'keystore', keyName);

    return pRead(keyPath, 'utf-8');
  },
  extractToken: (bearerToken) => {
    const searchKey = 'Bearer ';
    const index = bearerToken.indexOf(searchKey);
    if (index === -1) {
      throw new Error('Bad token format value');
    }

    return bearerToken.substring(searchKey.length);
  },
};

utilsPrototype.readPrivateKey = () => utilsPrototype.readKey('private.key');

utilsPrototype.readPublicKey = () => utilsPrototype.readKey('public.key');

module.exports = utilsPrototype;
