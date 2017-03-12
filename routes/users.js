var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);


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
            res.send(users);
          }
        });
    }
  });
});

router.get('/users', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users',
       function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            var users = [];
            result.rows.forEach(function(x){
              x.password = '';
              users.push(x);
            });
            console.log('Got info from DB', result.rows)
            res.send(result.rows);
          }
        });
    }
  });
});

router.get('/regulars', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users WHERE regular = $1',
      [true],
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

router.get('/allusers', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users',
       function(err, result){
        done();
        if (err){
          console.log('Error querying DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows)
            var usersinfo = [];
            result.rows.forEach(function(object) {
              var obj = {};
              var key = hashids.encode(object.id);
              obj[key] = object.email;
              obj['name'] = object.first_name + ' ' + object.last_name;
              obj['regular'] = object.regular;
              usersinfo.push(obj);
            });
            res.send(usersinfo);
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
                  'regular=$8, linkedin=$9, bio=$10, photourl=$11 WHERE id = $1 RETURNING *',
                  [req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, req.body.password,
                  req.body.admin, req.body.regular, req.body.linkedin, req.body.bio, req.body.photourl],
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

router.get('/adminstatus', function(req, res){
  var adminstatus;
  console.log(req.user);
  var user = req.user;
  if(user.admin == null || user.admin == false){
    adminstatus = false;
  }else{
    adminstatus = true;
  }
  res.send(adminstatus);
});


module.exports = router;
