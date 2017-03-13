var router = require('express').Router();
var User = require('../public/models/user');

var pg = require('pg');
var pool = new pg.Pool({ database: "upsilon_aces" });

router.post('/', function(req, res){
  User.findByUsername(req.body.username).then(function(user){
    if (user) {
      return res.status(400).send('Username already taken');
    }

    return User.create(req.body.username, req.body.password, req.body.first_name,
      req.body.last_name, req.body.email, req.body.linkedin, req.body.bio,
      req.body.photourl).then(function(user){
      console.log('Created new user');
      req.login(user, function(err){
        if (err) {
          console.log('Error logging in newly registered user', err);
          return res.sendStatus(500);
        }
      });

      res.sendStatus(201);
    });
  }).catch(function(err){
    console.log('Error creating user');
    res.sendStatus(500);
  });
});

module.exports = router;
