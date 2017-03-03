var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);


router.post('/', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO games (date, name, time, league_id, hashgameid) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      [req.body.date, req.body.name, req.body.time, req.body.league_id, req.body.hashgameid],
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


module.exports = router;
