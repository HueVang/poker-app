var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);

// http://localhost:3000/reservations/users?id=l4zbq2dprO&game=7LDdwRb1YK

// test path to add users into our reservations table with hased values
router.get('/users', function(req, res) {
  console.log('Hashed user id: ' + req.param('id') + ' hashed game id: ' + req.param('game'));
  var user_id = Number(hashids.decode(req.param('id')));
  var game_id = Number(hashids.decode(req.param('game')));
  var date = new Date();
  console.log('Unhashed user id: ' + user_id + ' Unhashed game id: ' + game_id);
  // res.send('User id: ' + user_id + ' and game id: ' + game_id);
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO reservations (timestamp, points, games_id, users_id) VALUES ($1, $2, $3, $4) RETURNING *',
         [date, 0, game_id, user_id],
         function(err, result){
           done();
         if (err) {
           console.log('Error updating reservations', err);
           res.sendStatus(500);
         } else {
           res.send(result.rows);
         }
       });
    }
  });
}); // end router.get /users

//test path to add users to reservation table with unhashed values
router.get('/usersnohash', function(req, res) {
  var user_id = req.param('id');
  var game_id = req.param('game');
  var date = new Date();
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO reservations (timestamp, points, games_id, users_id) VALUES ($1, $2, $3, $4) RETURNING *',
         [date, 0, game_id, user_id],
         function(err, result){
           done();
         if (err) {
           console.log('Error updating reservations', err);
           res.sendStatus(500);
         } else {
           res.send(result.rows);
         }
       });
    }
  });
}); // end router.get /users

//test path to sort list of users in specified game by earliest rsvp
router.get('/sortusers', function(req, res) {
  var user_id = req.param('id');
  var game_id = req.param('game');
  var date = new Date();
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT users_id FROM reservations WHERE games_id=10 ORDER BY timestamp ASC',
         function(err, result){
           done();
         if (err) {
           console.log('Error updating reservations', err);
           res.sendStatus(500);
         } else {
           res.send(result.rows);
         }
       });
    }
  });
}); // end router.get /users





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
