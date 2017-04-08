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
var Hashids = require('hashids');
var hashids = new Hashids('', 10);


var pg = require(
router.get('/', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM digests ORDER BY date asc', function(err, result){
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


router.post('/', function(req, res){
  var date = new Date();
  var games_id = Number(hashids.decode(req.body.gameid));
  console.log('this is the games_id: ', games_id);

  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO digests (entry, date, games_id) VALUES ($1, $2, $3) RETURNING *;',
      [req.body.entry, date, games_id],
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
  }); // end router.post


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
