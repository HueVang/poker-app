var pg = require('pg');

var pool = new pg.Pool({
  user: 'txfsjkkwcnvqcx',
  database: 'd2rohuktrv2324',
  password: '16874f1450d436358f3597ea158d5e69ced2635019f67fa21392951729a3a5fb',
  host: 'ec2-174-129-37-15.compute-1.amazonaws.com',
  port: 5432
});

// var pool = new pg.Pool({
//   database: 'upsilonaces'
// });

module.exports = pool;
