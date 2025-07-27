const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../database/db.db'), {
  timeout: 5000, // wait up to 5 seconds
});

module.exports = db;
