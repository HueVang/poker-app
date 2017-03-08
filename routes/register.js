var router = require('express').Router();
var User = require('../models/user');
//things added for multer
var pg = require('pg');
var multer = require('multer');

var pool = new pg.Pool({ database: "upsilon_aces" });


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/ahkillahdavis/company_project/public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, username + '.jpg');
  }
});

var upload = multer({ storage: storage });




router.post('/image', upload.any(), function(req, res, next) {
  console.log('This is username: ', typeof username);
  console.log('This is the req.file: ', req.files);
  console.log(req.body);
  res.redirect('back');
});
router.get("/players", function(req, res) {
  pool.connect(function(err, client, done) {
    try {
      if (err) {
        console.log("Error connecting to DB", err);
        res.status(500).send(err);
      } else {
        client.query("SELECT * FROM users ", function(err, results) {
          if (err) {
            console.log("Error getting users", err);
            res.status(500).send(err);
          } else {
            res.send(results.rows);
          }
        });
      }
    } finally {
      done();
    }
  });
});
router.get("/playerinfo", function(req, res) {
  console.log('player id from user table', req.user.id);
    pool.connect(function(err,client,done){
      if(err){
        console.log('error connecting to DB',err);
        res.sendStatus(500);
        done();
      } else {
       client.query(
         'SELECT * from users WHERE id=$1;',[req.user.id],
        function(err,result){
          done();
          if(err){
            console.log('error querying db',err);
            res.sendStatus(500);
          } else {
            console.log('get info from db',result.rows);
            res.send(result.rows);
          }
        });
      }
    });
  }); // end of get playerinfo
//end of things added for multer


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
