var pg = require('pg');

var pool = new pg.Pool({
  database: 'upsilon_aces'
});

module.exports = pool;
