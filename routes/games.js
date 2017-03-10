var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);

router.get('/hashid', function(req, res) {
  var val1 = req.param('val1');
  var val2 = req.param('val2');

  var hash1 = hashids.encode(val1);
  var hash2 = hashids.encode(val2);

  res.send('val 1: ' + hash1 + ' and val 2: ' + hash2);
}); // end router.get hashid

router.post('/creategame', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO games (date, name, time, count, leagues_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [req.body.date, req.body.name, req.body.time, req.body.count, req.body.leagues_id],
      function(err, result){
        done()
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('result.rows', result.rows);
            var gameid = result.rows[0].id;
            console.log('this is the game id: ', gameid);
            var gamehash = hashids.encode(gameid);
            console.log('Got hashids', gamehash)
            console.log(hashids.decode(gamehash)[0]);
            res.send({'name' : req.body.name, 'time' : req.body.time, 'date' : req.body.date, 'count' : req.body.count, 'gamehash' : gamehash});
          }
        });
    }
  });
});


router.get('/games', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM games WHERE leagues_id = $1',
      [req.body.league_id], function(err, result){
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

router.get('/:leagueId', function(req, res){
  var leagueId = req.params.leagueId;
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM games WHERE leagues_id = $1',
      [leagueId], function(err, result){
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
     client.query('UPDATE games SET name=$2, date=$3, time=$4 WHERE id = $1 RETURNING *',
        [req.params.id, req.body.name, req.body.date, req.body.time],
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
