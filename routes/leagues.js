var router = require('express').Router();
var pg = require('pg');
var config = {
  user: 'txfsjkkwcnvqcx',
  database: 'd2rohuktrv2324',
  password: '16874f1450d436358f3597ea158d5e69ced2635019f67fa21392951729a3a5fb',
  host: 'ec2-174-129-37-15.compute-1.amazonaws.com',
  port: 5432
};
var pool = new pg.Pool(config);

router.get('/', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM leagues;',
      function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
}); // end router.get

router.get('/:id', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM leagues WHERE id=$1;',
      [req.params.id],
      function(err, result){
        done();
        if (err){
          console.log('Error getting league by ID', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
}); // end router.get


router.post('/', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO leagues (name, start_date, end_date) VALUES ($1, $2, $3) RETURNING *;',
      [req.body.name, req.body.start_date, req.body.end_date],
      function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
});

router.get('/getCurrent/leagues', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM leagues ORDER BY id DESC limit 2', function(err, result){
        done();
        if (err){
          console.log('Error getting current leagues', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows)
            res.send(result.rows);
          }
        });
    }
  });
});


module.exports = router;
