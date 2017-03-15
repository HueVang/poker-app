var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);
const nodemailer = require('nodemailer');


// http://localhost:3000/reservations/users?id=l4zbq2dprO&game=7LDdwRb1YK
var returnRouter=function(io){
// test path to add users into our reservations table with hased values
router.get('/', function(req, res) {
  // console.log('Hashed user id: ' + req.param('id') + ' hashed game id: ' + req.param('game'));
  var reservationId = Number(hashids.decode(req.param('id')));
  // var game_id = Number(hashids.decode(req.param('game')));
  // var game_count = Number(req.param('count'));
  var date = new Date();
  // var name = req.param('name').replace(/#/g, ' ');
  var playerList= [];
  var alternateList= [];
  // var name = req.param('name').replace(/#/g, ' ');
  console.log('Unhashed reservationId id: ' + reservationId);
  // res.send('User id: ' + user_id + ' and game id: ' + game_id);
  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('UPDATE reservations SET status=$2, timestamp=$3 WHERE id = $1 RETURNING *',
         [reservationId, 1, date],
         function(err, result){
           done();
         if (err) {
           console.log('Error updating reservations', err);
           res.sendStatus(500);
         } else {
           var game_id = result.rows[0].games_id;
          //  console.log('this is the game id from very top: ', game_id);
           pool.connect(function(err, client, done){
             if (err) {
               console.log('Error connecting to DB', err);
               res.sendStatus(500);
               done();
             } else {
               console.log('This is the game_id: ', game_id);
               client.query('SELECT * FROM games WHERE id=$1',
                  [game_id],
                  function(err, result){
                    done();
                  if (err) {
                    console.log('Error updating users', err);
                    res.sendStatus(500);
                  } else {
                    var game_count = result.rows[0].count;
                    console.log('This is game count: ', game_count);
                    pool.connect(function(err, client, done){
                      if (err) {
                        console.log('Error connecting to DB', err);
                        res.sendStatus(500);
                        done();
                      } else {
                        client.query('SELECT * FROM reservations WHERE games_id=$1 AND status=$2 ORDER BY timestamp ASC',
                        [game_id, 1],
                           function(err, result){
                             done();
                           if (err) {
                             console.log('Error updating reservations', err);
                             res.sendStatus(500);
                           }else {
                             console.log('This is the game_id from 3rd pool connect: ', game_id);
                             result.rows.forEach(function(i){
                               if(playerList.length < game_count){
                                 playerList.push(i);
                               }else{
                                   alternateList.push(i);
                                 }
                               });
                             var lists = {players: playerList,
                                          alternates: alternateList};
                             io.sockets.emit('broadcast',{description: lists});
                             res.redirect('/');
                             }
                           });
                         };
                      })
                  }
                });
             }
           });
           };
         })
       };
    })
  }); // end router.get /users


  router.get('/leaderboard/:leagueId', function(req, res){
    var leagueId = req.params.leagueId;
    console.log('This is the league id: ', leagueId);
    pool.connect(function(err, client, done){
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      } else {
        client.query('SELECT reservations.name, rank() over (order by SUM(points) DESC) as place ,SUM(points) as points, COUNT(points) ' +
        'FROM reservations JOIN games ON reservations.games_id=games.id ' +
        'WHERE points > 0 AND games.leagues_id=$1 GROUP BY reservations.name, reservations.users_id ORDER BY points DESC;',
            [leagueId],
           function(err, result){
             done();
           if (err) {
             console.log('Error selecting from reservations', err);
             res.sendStatus(500);
           } else {
             res.send(result.rows);
           }
         });
      }
    });
  })

  router.get('/winners/:leagueId', function(req, res){
    var leagueId = req.params.leagueId;
    console.log('This is the league id: ', leagueId);
    pool.connect(function(err, client, done){
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      } else {
        client.query('SELECT reservations.name, games.date FROM reservations JOIN games ' +
        'ON reservations.games_id=games.id WHERE (points=10 OR points=20) AND games.leagues_id=$1 ' +
        'ORDER BY games.date ASC;',
            [leagueId],
           function(err, result){
             done();
           if (err) {
             console.log('Error selecting from reservations', err);
             res.sendStatus(500);
           } else {
             res.send(result.rows);
           }
         });
      }
    });
  })


//test path to sort list of users in specified game by earliest rsvp
// router.get('/sortusers', function(req, res) {
//   var user_id = req.param('id');
//   var game_id = req.param('game');
//   var date = new Date();
//   pool.connect(function(err, client, done){
//     if (err) {
//       console.log('Error connecting to DB', err);
//       res.sendStatus(500);
//       done();
//     } else {
//       client.query('INSERT INTO reservations (timestamp, points, games_id, users_id) VALUES ($1, $2, $3, $4) RETURNING *',
//          [date, 0, game_id, user_id],
//          function(err, result){
//            done();
//          if (err) {
//            console.log('Error updating reservations', err);
//            res.sendStatus(500);
//          } else {
//            pool.connect(function(err, client, done){
//              if (err) {
//                console.log('Error connecting to DB', err);
//                res.sendStatus(500);
//                done();
//              } else {
//                client.query('SELECT users_id FROM reservations WHERE games_id=$1 ORDER BY timestamp ASC',
//                 [game_id],
//                   function(err, result){
//                     done();
//                   if (err) {
//                     console.log('Error updating reservations', err);
//                     res.sendStatus(500);
//                   } else {
//                     result.rows.forEach(function(i){
//                         playerList.push(i);
//                       });
//                     var lists = {players: playerList,
//                                  alternates: alternateList};
//                     io.sockets.emit('broadcast',{description: lists});
//                     res.sendStatus(200);
//                     }
//                 });
//              }
//            });
//          }
//        });
//     }
//   });
// }); // end router.get /users

//test path to sort list of users in specified game by earliest rsvp
router.get('/sortusers/:gameId1&:count', function(req, res) {
  // var user_id = req.param('id');
  var game_id = req.params.gameId1;
  var game_count = req.params.count;
  var playerList= [];
  var alternateList= [];

  pool.connect(function(err, client, done){
    if (err) {
      console.log('Error connecting to DB', err);
      res.sendStatus(500);
      done();
    } else {
      console.log("Game id and count are: ", game_id, game_count);
      client.query('SELECT * FROM reservations WHERE games_id = $1 AND status = $2 ORDER BY timestamp ASC',
      [game_id, 1],
         function(err, result){
           done();
         if (err) {
           console.log('Error updating reservations', err);
           res.sendStatus(500);
         } else {
           console.log("these are the current players", result.rows);
           result.rows.forEach(function(i){
             if(playerList.length < game_count){
               playerList.push(i);
             }else{
                 alternateList.push(i);
               }
             });
           var lists = {players: playerList,
                        alternates: alternateList};
           io.sockets.emit('broadcast',{description: lists});
           res.sendStatus(200);
         }
       });
    }
  });
}); // end router.get /users


router.post('/regulars', function(req, res) {
  console.log('This is the req.user: ', req.user);
  // console.log('This is the req.body:', req.body);
  var email = req.user.email;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: email,
          pass: 'PrimeDevsUpsilonAces'
      }
  });


  var game = req.body.gameid;
  var users = req.body.user;
  var gamedigest = req.body.digest;
  var gamecount = req.body.gamecount;
  var gamename = req.body.gamename;
  var gamedate = new Date(req.body.gamedate);
  var gametime = req.body.gametime;
  var playerList= [];
  var alternateList= [];
  // var keys = Object.keys(users);

  console.log('these are the req.body.user: ', users);

  users.forEach(function(person, i) {
    var key = Object.keys(person)[0];
    var user_id = Number(hashids.decode(key));
    var game_id = Number(hashids.decode(game));
    var date = new Date();
    var name = person.name;
    var useremail = person[key];

    console.log('Unhashed user id: ' + user_id + ' Unhashed game id: ' + game_id);
    pool.connect(function(err, client, done){
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      } else {
        client.query('INSERT INTO reservations (timestamp, points, games_id, users_id, name, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
           [date, 0, game_id, user_id, name, 1],
           function(err, result){
             done();
           if (err) {
             console.log('Error updating reservations', err);
             res.sendStatus(500);
           } else {
             pool.connect(function(err, client, done){
               if (err) {
                 console.log('Error connecting to DB', err);
                 res.sendStatus(500);
                 done();
               } else {
                 client.query('SELECT * FROM reservations WHERE games_id=$1 ORDER BY timestamp ASC',
                  [game_id],
                    function(err, result){
                      done();
                    if (err) {
                      console.log('Error updating reservations', err);
                      res.sendStatus(500);
                    } else {
                      result.rows.forEach(function(i){
                          playerList.push(i);
                        });
                      // var lists = {players: playerList,
                      //              alternates: alternateList};
                      // io.sockets.emit('broadcast',{description: lists});
                      }
                  });
               }
             });
           }
         });
      }
    });

    var text = '<p>Hello '+ name + '!<br /> You have been registered for the upcoming game "' + gamename + '" at ' + gamedate.toISOString().slice(0,10) + '!<br/>' + gamedigest + '</p>'
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
  }); // end for Each
  var lists = {players: playerList,
               alternates: alternateList};
  io.sockets.emit('broadcast',{description: lists});


  res.send(req.user.email);
  // res.sendStatus(200);
}); // end router.post




router.post('/players', function(req, res) {
  console.log('This is the req.user: ', req.user);
  // console.log('This is the req.body:', req.body);

  var email = req.user.email;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: email,
          pass: 'PrimeDevsUpsilonAces'
      }
  });


  var game = Number(hashids.decode(req.body.gameid));
  var users = req.body.user;
  var gamedigest = req.body.digest;
  var gamecount = req.body.gamecount;
  var gamename = req.body.gamename;
  var gamedate = new Date(req.body.gamedate);
  var gametime = req.body.gametime;
  // var keys = Object.keys(users);

  console.log('these are the req.body.user: ', users);

  users.forEach(function(person, i) {
    var date = new Date();
    var key = Object.keys(person)[0];
    var name = person.name;
    var useremail = person[key];
    var userid = Number(hashids.decode(key));
    var reservationId = 'It will update after pool.connect has been run';
    pool.connect(function(err, client, done){
      if (err) {
        console.log('Error connecting to DB', err);
        res.sendStatus(500);
        done();
      } else {
        client.query('INSERT INTO reservations (timestamp, points, games_id, users_id, name, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
           [date, 0, game, userid, name, 0],
           function(err, result){
             done();
           if (err) {
             console.log('Error posting to reservations: ', err);
             res.sendStatus(500);
           } else {
             reservationId = result.rows[0].id;
             console.log('This is the reservationId: ', reservationId);
             // console.log('These are the keys: ', key);
             // console.log('These are the values: ', person[key]);
             var reshashid = hashids.encode(reservationId);
             console.log('This is hash id of reservations: ', reshashid);
             console.log('This is hash id type of reservations: ', typeof reshashid);
             var text = '<p>Hello '+ name + '!<br /> Click on the link to RSVP for ' + gamename + ' on ' + gamedate.toISOString().slice(0,10) + '!<br />' + gamedigest + '<br /> http://localhost:3000/reservations/?id='+ reshashid +'</p>'
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
  }); // end for Each


  res.send(req.user.email);
  // res.sendStatus(200);
}); // end router.post






// ==========================================================================================================



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

router.put('/remove/:id&:games_id', function(req, res){
 pool.connect(function(err, client, done){

   if (err) {
     console.log('Error connecting to DB', err);
     res.sendStatus(500);
     done();
   } else {
     console.log("This is the user id ", req.params.id);
     console.log("This is the games id ", req.params.games_id);
     client.query('UPDATE reservations SET status=$3 WHERE users_id = $1 AND games_id = $2 RETURNING *',
        [req.params.id, req.params.games_id, 0],
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
});

router.delete('/:id&:games_id', function(req, res){
 pool.connect(function(err, client, done){
   console.log(req.params.id, req.params.games_id);
   if (err) {
     console.log('Error connecting to DB', err);
     res.sendStatus(500);
     done();
   } else {
     client.query('DELETE FROM reservations WHERE users_id = $1 AND games_id = $2 RETURNING *',
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

return router;

}


module.exports = returnRouter;
