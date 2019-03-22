const mongoose = require('mongoose');

/**
 * Database abstraction
 *  start and close a database connection
 */
class Database {
  constructor() {
    this.db = null;
  }

  /**
   * @returns Promise
   */
  startConnection() {
    return new Promise((resolve, reject) => {
      const {
        DB_USER, DB_NAME, DB_HOST, DB_PASS,
      } = process.env;
      // make sure all Database env variables are defined
      if (!(DB_USER && DB_NAME && DB_HOST && DB_PASS)) {
        return reject(new Error('Database env variables is not set properly'));
      }
      const strConn = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}`;
      mongoose.connect(strConn, { useNewUrlParser: true });

      this.db = mongoose.connection;
      this.db.on('error', reject);

      this.db.once('open', () => {
        resolve(true);
      });
    });
  }

  /**
   * @returns Promise
   */
  closeConnection() {
    return mongoose.disconnect();
  }
}

module.exports = Database;
