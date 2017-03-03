var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);


router.put('/:id', function(req, res){
 pool.connect(function(err, client, done){
   if (err) {
     console.log('Error connecting to DB', err);
     res.sendStatus(500);
     done();
   } else {
     client.query('UPDATE reservations SET points=$3 WHERE id = $1 AND games_id = $2 RETURNING *',
        [req.params.id, req.body.games_id, req.body.points],
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

router.delete('/:id:games_id', function(req, res){
 pool.connect(function(err, client, done){
   if (err) {
     console.log('Error connecting to DB', err);
     res.sendStatus(500);
     done();
   } else {
     client.query('DELETE FROM reservations WHERE id = $1 AND games_id = $2 RETURNING *',
        [req.params.id, req.params.games_id],
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
