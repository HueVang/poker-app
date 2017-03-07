var router = require('express').Router();
var pg = require('pg');
var config = {database: 'upsilon_aces'};
var pool = new pg.Pool(config);
var Hashids = require('hashids');
var hashids = new Hashids('', 10);
const nodemailer = require('nodemailer');

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


router.post('/', function(req, res) {
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


  var game = req.body.game;
  var users = req.body.user;
  // var keys = Object.keys(users);

  console.log('these are the req.body.user: ', users);

  users.forEach(function(person, i) {
    // console.log('These are the keys: ', key);
    // console.log('These are the values: ', person[key]);
    var key = Object.keys(person)[0];
    var useremail = person[key];

    var text = '<p>Click this link to get an RSVP! http://localhost:3000/reservations/users?id='+ key +'&game='+ game + '</p>' 
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

  // emails.forEach(function(useremail) {
  //   // setup email data with unicode symbols
  //   let mailOptions = {
  //       from: '"Prime Devs" <' + email + '>', // sender address
  //       to: useremail, // list of receivers
  //       subject: 'Test!', // Subject line
  //       text: 'This is the text text', // plain text body
  //       html: '<p>This is the test html</p>' // html body
  //   };
  //
  //   // send mail with defined transport object
  //   transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //           return console.log(error);
  //       }
  //       console.log('Message %s sent: %s', info.messageId, info.response);
  //   });
  // }); // end for each


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
