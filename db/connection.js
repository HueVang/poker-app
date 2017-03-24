var pg = require('pg');

var pool = new pg.Pool({
  database: 'd2rohuktrv2324'
});

module.exports = pool;
