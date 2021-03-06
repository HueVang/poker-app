var router = require('express').Router();
var User = require('../public/models/user');

var pg = require('pg');
var config = {
  user: 'txfsjkkwcnvqcx',
  database: 'd2rohuktrv2324',
  password: '16874f1450d436358f3597ea158d5e69ced2635019f67fa21392951729a3a5fb',
  host: 'ec2-174-129-37-15.compute-1.amazonaws.com',
  port: 5432
};
// var config = {
//   database: 'upsilonaces'
// }

router.post('/', function(req, res){
  User.findByEmail(req.body.email).then(function(user){
    if (user) {
      return User.update(req.body.id,req.body.username, req.body.password, req.body.first_name,
        req.body.last_name, req.body.email, req.body.linkedin, req.body.bio,
        req.body.emailcred).then(function(user){
        console.log('Updating new user');
        req.login(user, function(err){
          if (err) {
            console.log('Error registering user', err);
            return res.sendStatus(500);
          }
        });

        res.sendStatus(201);
      });
    }
    else{
      return User.create(req.body.username, req.body.password, req.body.first_name,
        req.body.last_name, req.body.email, req.body.linkedin, req.body.bio,
        req.body.emailcred).then(function(user){
        console.log('Created new user');
        req.login(user, function(err){
          if (err) {
            console.log('Error logging in newly registered user', err);
            return res.sendStatus(500);
          }
        });

        res.sendStatus(201);
      });
    }
  })
  // .catch(function(err){
  //   console.log('Error creating user, ', err);
  //   res.sendStatus(500);
  // });
});

// router.post('/', function(req, res){
//   return User.create(req.body.username, req.body.password, req.body.first_name,
//             req.body.last_name, req.body.email, req.body.linkedin, req.body.bio,
//             req.body.emailcred).then(function(user){
//       console.log('Created new user');
//       req.login(user, function(err){
//         if (err) {
//           console.log('Error logging in newly registered user', err);
//           return res.sendStatus(500);
//         }
//       });
//
//       res.sendStatus(201);
//     });
//   }).catch(function(err){
//     console.log('Error creating user');
//     res.sendStatus(500);
//   });


module.exports = router;
