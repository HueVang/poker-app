var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);
const nodemailer = require('nodemailer');
//adding this from register.js
var multer = require('multer');
var username = "";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
cb(null,  __dirname +'/../public/uploads/'+username);
},

  filename: function (req, file, cb) {
    cb(req.file, file.fieldname.trim()+'.jpg' , username.trim()+'.jpg');
    // cb(null, file.fieldname+'.jpg');
  }
});

var upload = multer({ storage: storage });

router.post('/user/addToGame/:username', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE users SET regular=$2 WHERE username=$1 RETURNING *',
      [req.params.username, true], function(err, result){
        done();
        if (err){
          console.log('Error updating user as regular', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
});

router.post('/user/revertStatus/:username', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE users SET regular=$2 WHERE username=$1 RETURNING *',
      [req.params.username, false], function(err, result){
        done();
        if (err){
          console.log('Error reverting user\'s regular status', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
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
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
});
//
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
            console.log('Got info from DB', result.rows);
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
            console.log('Got info from DB', result.rows);
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
            console.log('Got info from DB', result.rows);
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
 var hashPassword = hashids.encode(req.body.password);
 pool.connect(function(err, client, done){
   if (err) {
     console.log('Error connecting to DB', err);
     res.sendStatus(500);
     done();
   } else {
     client.query('UPDATE users SET first_name=$2, last_name=$3, email=$4, username=$5, password=$6, admin=$7,'+
                  'regular=$8, linkedin=$9, bio=$10, photourl=$11 WHERE id = $1 RETURNING *',
                  [req.params.id, req.body.first_name, req.body.last_name, req.body.email, req.body.username, hashPassword,
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
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
});
//adding from the other.player.js
// router.get('/otherplayer',function(req,res){
//   console.log('user id?::',req.user.id);
//   username = req.user.username;
//   pool.connect(function(err,client,done){
//     if(err){
//       console.log('error connecting to DB',err);
//       res.sendStatus(500);
//       done();
//     } else {
//      client.query(
//        'SELECT * from users;',
//       function(err,result){
//         done();
//         if(err){
//           console.log('error querying db',err);
//           res.sendStatus(500);
//         } else {
//           console.log('get info from db',result.rows);
//           res.send(result.rows);
//         }
//       });
//     }
//   });
// });//end of get otherplayer

//commenting this out from what was
router.get('/playerToShow/:id',function(req,res){
  pool.connect(function(err,client,done){
    if(err){
      console.log('error connecting to DB',err);
      res.sendStatus(500);
      done();
    } else {
     client.query('SELECT * from users WHERE id=$1;',
     [req.params.id],
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
});//end of get otherplayer

//trying this
// router.get('/playerToShow/:id',function(req,res){
//   pool.connect(function(err,client,done){
//     if(err){
//       console.log('error connecting to DB',err);
//       res.sendStatus(500);
//       done();
//     } else{
//      client.query(
//        'SELECT * from users WHERE id=$1 SET username =$2;',
//        [req.params.id, req.body.username],
//       function(err,result){
//         done();
//         if(err){
//           console.log('error querying db',err);
//           res.sendStatus(500);
//         } else {
//           console.log('get info from db',result.rows);
//           res.send(result.rows);
//         }
//       });
//     }
//   });
// });

//adding
// router.get('/editPlayerProfile/:id',function(req,res){
//   pool.connect(function(err,client,done){
//     if(err){
//       console.log('error connecting to DB',err);
//       res.sendStatus(500);
//       done();
//     } else {
//      client.query(
//        'SELECT * from users WHERE id=$1;',[req.params.id],
//       function(err,result){
//         done();
//         if(err){
//           console.log('error querying db',err);
//           res.sendStatus(500);
//         } else {
//           console.log('get info from db',result.rows);
//           res.send(result.rows);
//         }
//       });
//     }
//   });
// });
router.get('/players', function(req, res){
  console.log('username?::', req.user.username);
  pool.connect(function(err,client,done){
    if(err){
      console.log('error connecting to DB',err);
      res.sendStatus(500);
      done();
    } else {
     client.query(
       'SELECT * from users;',
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

router.get('/currentUser', function(req, res){
  var adminstatus;
  console.log(req.user);
  var currentUser = req.user;
  if(currentUser.admin == null || currentUser.admin == false){
    adminstatus = false;
  }else{
    adminstatus = true;
  }
  var toSend = {user: currentUser,admin: adminstatus}
  res.send(toSend);
});

router.post('/image', upload.any(), function(req, res, next) {
  console.log('This is username: ', typeof username);
  console.log('req.files: ', req.files);
  console.log(req.body);
  res.redirect('/edit.profile');
  // res.redirect('back');


});

//added
router.get('/image', function(req, res){
  console.log('user id?::', req.user.id);
  pool.connect(function(err,client,done){
    if(err){
      console.log('error connecting to DB',err);
      res.sendStatus(500);
      done();
    } else {
     client.query(
       'SELECT image from users WHERE id=$1;',
       [req.user.id],
      function(err,result){
        done();
        if(err){
          console.log('error querying db',err);
          res.sendStatus(500);
        } else {
          console.log('get posted info from db',result.rows);
          res.send(result.rows);
        }
      });
    }
  });
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

  router.get('/users', function(req, res){
    console.log('in users get route');
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
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
});

router.get('/user/getUserByUsername/:username', function(req, res){
  console.log('in users get route');
pool.connect(function(err, client, done){
  if(err){
    console.log('Error connecting to the DB', err);
    res.sendStatus(500);
    done();
  } else {
    client.query('SELECT * FROM users WHERE username=$1',
    [req.params.username],
     function(err, result){
      done();
      if (err){
        console.log('Error getting user by username', err);
        res.sendStatus(500);
        }else{
          console.log('Got info from DB', result.rows);
          res.send(result.rows);
        }
      });
  }
});
}); // end router.get getUserByUsername


router.post("/users", function(req, res) {
  console.log('in users post route');
  pool.connect(function(err, client, done) {
    if (err) {
      console.log("Error connecting to DB", err);
      res.sendStatus(500);
      done();
    } else {
      client.query(
        "INSERT INTO users (first_name, last_name, username, email) VALUES ($1,$2,$3,$4) RETURNING *;",
        [req.body.first_name, req.body.last_name, req.body.username, req.body.email],
        function(err, result) {
          done();
          if (err) {
            console.log("Error querying DB", err);
            res.sendStatus(500);
          } else {
            console.log("Got info from DB", result.rows);
            res.send(result.rows);
          }
        }
      );
    }
  });
});

router.get('/newPlayer/:id', function(req, res){
  var id = hashids.decode(req.params.id);
  id = Number(id);
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to the DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM users WHERE id = $1',
      [id], function(err, result){
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
});

router.post('/newPlayer', function(req, res) {
  console.log('This is the req.user: ', req.user);
  // console.log('This is the req.body:', req.body);
  var useremail = req.body.email;
  var email = req.user.email;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: email,
          pass: 'PrimeDevsUpsilonAces'
      }
  });

  console.log('these are the req.body ', useremail);
    pool.connect(function(err, client, done){
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      } else {
        client.query('INSERT INTO users (email) VALUES ($1) RETURNING *;',
           [useremail],
           function(err, result){
             done();
           if (err) {
             console.log('Error posting to users: ', err);
             res.sendStatus(500);
           } else {
             var newUserId = result.rows[0].id;
             console.log('This is the userId: ', newUserId);
             // console.log('These are the keys: ', key);
             // console.log('These are the values: ', person[key]);
             var reshashid = hashids.encode(newUserId);
             console.log('This is hash id of user: ', reshashid);
             console.log('This is hash id type of user: ', typeof reshashid);
             var text = '<p>Hello!<br /> You have been added to Poker Registration Application!<br /> Click on the link to edit your profile!<br />'+'http://localhost:3000/users/?id='+ reshashid +'</p>'
             // setup email data with unicode symbols
             let mailOptions = {
                 from: '"Prime Devs" <' + email + '>', // sender address
                 to: useremail, // list of receivers
                 subject: 'Test!', // Subject line
                 text: 'This is the text text', // plain text body
                 html: text // html body
             };

             // send mail with defined transport object
             transporter.sendMail(mailOptions, (error, info) => {
                 if (error) {
                     return console.log(error);
                 }
                 console.log('Message %s sent: %s', info.messageId, info.response);
             });
           }
         });
      }
    }); // end pool.connect

  // res.send(req.user.email);
  res.sendStatus(200);
}); // end router.post

router.get('/', function(req, res) {
  var hashId = req.query.id;
  console.log('this is the hashId ', hashId);
  res.redirect('/newUser?hashId='+hashId);
});

module.exports = router;
