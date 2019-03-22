const http = require('http');

const morgan = require('morgan');

const config = require('./config.js');
const appBuilder = require('./app');

const middlewares = [
  morgan('dev'),
];
// const app = appBuilder(middlewares);
// app.server = http.createServer(app);

// const port = process.env.PORT || config.port;
// app.server.listen(port, () => {
//   console.log(`Server running on ${port}`);
// });

//
appBuilder(middlewares)
  .then((app) => {
    app.server = http.createServer(app);

    const port = process.env.PORT || config.port;
    app.server.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
