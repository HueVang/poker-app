var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);


router.get('/', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM digests', function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows)
            res.send(result.rows);
          }
        });
      }
    });
  });


router.post('/', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO digests (entry, date, games_id) VALUES ($1, $2, $3) RETURNING *;',
      [req.body.entry, req.body.date, req.body.games_id],
      function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows)
            res.send(result.rows);
          }
        });
      }
    });
  });


  router.put('/:id', function(req, res){
   pool.connect(function(err, client, done){
     if (err) {
       console.log('Error connecting to DB', err);
       res.sendStatus(500);
       done();
     } else {
       client.query('UPDATE digests SET entry=$2, date=$3, games_id=$4 WHERE id = $1 RETURNING *',
          [req.params.id, req.body.entry, req.body.date, req.body.games_id],
          function(err, result){
            done();
          if (err) {
            console.log('Error updating users', err);
            res.sendStatus(500);
          } else {
            res.send(result.rows);
          }
        });
     }
   });
  });




module.exports = router;
