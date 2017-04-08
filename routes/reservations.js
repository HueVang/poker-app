var router = require('express').Router();
var pg = require('pg');
var config = {
  user: 'txfsjkkwcnvqcx',
  database: 'd2rohuktrv2324',
  password: '16874f1450d436358f3597ea158d5e69ced2635019f67fa21392951729a3a5fb',
  host: 'ec2-174-129-37-15.compute-1.amazonaws.com',
  port: 5432
};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);
const nodemailer = require('nodemailer');


var returnRouter=function(io){
  router.get('/', function(req, res) {
    var reservationId = Number(hashids.decode(req.param('id')));
    var date = new Date();
    var playerList= [];
    var alternateList= [];
    console.log('Unhashed reservationId id: ' + reservationId);
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
  }); // end router.get /


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
        client.query('SELECT reservations.name, games.name as game_name, games.date FROM reservations JOIN games ' +
        'ON reservations.games_id=games.id WHERE (points=10 OR points=20) AND games.leagues_id=$1 ' +
        'ORDER BY games.date DESC;',
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


router.get('/sortusers/:gameId1&:count', function(req, res) {
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
}); // end router.get /sortusers


router.post('/regulars', function(req, res) {
  console.log('This is the req.user: ', req.user);
  var email = req.user.email;
  var emailcred = hashids.decode(req.user.emailcred)

  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: email,
          pass: emailcred
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
                      }
                  });
               }
             });
           }
         });
      }
    });

    var text = '<p>Hello '+ name + '!<br /> You have been registered for the upcoming game "' + gamename + '" at ' + gamedate.toDateString() + '!<br/>' + gamedigest + '</p>'
    let mailOptions = {
        from: '"D12 Poker League" <' + email + '>', // sender address
        to: useremail, // list of receivers
        subject: 'You have been registered for '+ gamename +'!', // Subject line
        text: 'This is the text text', // plain text body
        html: text // html body
    };

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
}); // end router.post




router.post('/players', function(req, res) {
  console.log('This is the req.user: ', req.user);
  var email = req.user.email;
  var emailcred = hashids.decode(req.user.emailcred);
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: email,
          pass: emailcred
      }
  });


  var game = Number(hashids.decode(req.body.gameid));
  var users = req.body.user;
  var gamedigest = req.body.digest;
  var gamecount = req.body.gamecount;
  var gamename = req.body.gamename;
  var gamedate = new Date(req.body.gamedate);
  var gametime = req.body.gametime;

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
             var reshashid = hashids.encode(reservationId);
             console.log('This is hash id of reservations: ', reshashid);
             console.log('This is hash id type of reservations: ', typeof reshashid);
             var text = '<p>Hello '+ name + '!<br /> Click on the link to RSVP for ' + gamename + ' on ' + gamedate.toDateString() + '!<br />' + gamedigest + '<br /> http://localhost:3000/reservations/?id='+ reshashid +'</p>'
             let mailOptions = {
                 from: '"D12 Poker League" <' + email + '>', // sender address
                 to: useremail, // list of receivers
                 subject: 'Reserve your spot for ' + gamename + '!', // Subject line
                 text: 'This is the text text', // plain text body
                 html: text // html body
             };

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
}); // end router.post


        router.get('/playerPoints/:id', function(req, res){
          pool.connect(function(err, client, done){
            if (err) {
              console.log('Error connecting to DB', err);
              res.sendStatus(500);
              done()
            } else {
              client.query('SELECT * FROM reservations WHERE games_id=$1 AND points > 0 ORDER BY points DESC;',
              [req.params.id],
              function(err, result){
                done();
                if (err) {
                  console.log('Error selecting user points from reservations', err);
                  res.sendStatus(500);
                } else {
                  res.send(result.rows);
                }
              });
            }
          });
        }); // end router.get playerPoints


        router.put('/playerPoints/:id', function(req, res){
          pool.connect(function(err, client, done){
            if (err) {
              console.log('Error connecting to DB', err);
              res.sendStatus(500);
              done()
            } else {
              client.query('UPDATE reservations SET points=$2 WHERE id=$1 RETURNING *;',
              [req.params.id, 0],
              function(err, result){
                done();
                if (err) {
                  console.log('Error selecting user points from reservations', err);
                  res.sendStatus(500);
                } else {
                  res.send(result.rows);
                }
              });
            }
          });
        }); // end router.put playerPoints

        router.put('/givePlayerPoints', function(req, res){
          pool.connect(function(err, client, done){
            if (err) {
              console.log('Error connecting to DB', err);
              res.sendStatus(500);
              done()
            } else {
              client.query('UPDATE reservations SET points=$3 WHERE games_id=$1 AND users_id=$2 RETURNING *;',
              [req.body.games_id, req.body.user_info.id , req.body.points],
              function(err, result){
                done();
                if (err) {
                  console.log('Error giving user points in reservations', err);
                  res.sendStatus(500);
                } else {
                  res.send(result.rows);
                }
              });
            }
          });
        }); // end router.put givePlayerPoints


        router.get('/usersInGame/:id', function(req, res){
          pool.connect(function(err, client, done){
            if (err) {
              console.log('Error connecting to DB', err);
              res.sendStatus(500);
              done()
            } else {
              client.query('SELECT reservations.id, reservations.points, reservations.games_id,' +
              ' reservations.users_id, reservations.status, users.first_name, users.last_name,' +
              ' users.username FROM reservations JOIN users ON reservations.users_id=users.id' +
              ' WHERE reservations.games_id=$1 AND reservations.points=$2 AND reservations.status=$3;',
              [req.params.id, 0, 1],
              function(err, result){
                done();
                if (err) {
                  console.log('Error selecting usersInGame for points from reservations', err);
                  res.sendStatus(500);
                } else {
                  console.log('usersInGame call works!');
                  res.send(result.rows);
                }
              });
            }
          });
        }); // end router.get usersInGame

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
                  console.log('Error updating reservations on line 956', err);
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
