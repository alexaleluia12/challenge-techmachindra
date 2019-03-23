# TechMahindra Challenge
Position: Back-end Developer

# Improve TODO
- manager key/jwt expiration
- fix all lint messages, not just ignore then
- better test case, clean database for each test, use a library like `faker`
- test coverage 100%
- add swagger

# Run
```sh
git clone https://github.com/alexaleluia12/challenge-techmachindra.git techMahindra
cd techMahindra
npm i
# difine mongoDB information: user, name, password, host
cp template.env .env
# load env variables
export $(cat .env)
# generate keys for JWT (https://gist.github.com/ygotthilf/baa58da5c3dd1f69fae9)
cd keystore
ssh-keygen -t rsa -b 4096 -m PEM -f private.key
# Don't add passphrase
openssl rsa -in private.key -pubout -outform PEM -out public.key

# lint
npm run lint
# tests
npm run test
# test coverage
npm run test-coverage
# run server
npm run dev
```

# Notes
- Teste Coverage +80%
