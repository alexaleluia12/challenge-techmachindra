const http = require('http');

const morgan = require('morgan');

const config = require('./config.js');
const appBuilder = require('./app');

// list of middlewares used on main thread (not good for test runing)
const middlewares = [
  morgan('dev'),
];

appBuilder(middlewares)
  .then((app) => {
    app.server = http.createServer(app);

    const port = process.env.PORT || config.port;
    app.server.listen(port, () => {
      console.log(`Server running on ${port}`);
    });

    process.on('SIGINT', function handlerSignTerm() {
      app.deps.db.closeConnection()
        .then(() => {
          console.log('Finish server');
          process.exit(1);
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        })
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
