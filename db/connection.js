var pg = require('pg');

var pool = new pg.Pool({
  database: 'upsilonaces'
});

module.exports = pool;
