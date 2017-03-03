var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);


router.get('/user', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users WHERE username = $1',
      [req.body.username], function(err, result){
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



router.get('/userhash', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users', function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows)
            var regulars= [];
            var players= [];
            result.rows.forEach(function(user){
              user.hashUserId; //psuedocode
              if(user.regular == true){
                regulars.push(i);
              }else{
                players.push(i);
              }
            });
            res.send(regulars, players);
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
     client.query('UPDATE users SET first_name=$2, last_name=$3, email=$4, username=$5, password=$6, admin=$7,'+
                  'regular=$8, linkedin=$9, bio=$10, photourl=$11, league_id=$12 WHERE id = $1 RETURNING *',
                  [req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.password,
                  req.body.admin, req.body.regular, req.body.linkedin, req.body.bio, req.body.photourl,
                  req.body.league_id],
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

router.post('/newuser', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO users (email) VALUES ($1) RETURNING *;',
      [req.body.email],
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
