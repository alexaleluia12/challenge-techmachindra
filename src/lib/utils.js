const fs = require('fs');
const path = require('path');
const { promisify } = require('util');


module.exports = {
  add: (a, b) => a + b,
  errorOutput: message => ({ mensagem: message }),
  readPrivateKey: () => {
    const pRead = promisify(fs.readFile);
    const keyPath = path.join(process.cwd(), 'keystore', 'private.key');

    return pRead(keyPath, 'utf-8');
  },
};
