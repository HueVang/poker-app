var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');

var connection = require('./db/connection');
var login = require('./routes/login');
var register = require('./routes/register');
var adminInterface = require('./routes/admin/admin.interface.js');
var createLeague = require('./routes/admin/create.league.js');
var currentGame = require('./routes/admin/current.game.js');
var leaderBoard = require('./routes/admin/leader.board.js');
var playerRoster = require('./routes/admin/player.roster.js');
var scheduleNewGame = require('./routes/admin/schedule.new.game.js');
// var createPlayerProfile = require('./routes/player/create.player.profile.js'); Already included in register route
var editPlayerProfile = require('./routes/player/edit.player.profile.js');
var otherPlayerProfile = require('./routes/player/other.player.profile.js');
var playerInterface = require('./routes/player/player.interface.js');

require('./auth/setup');

connection.connect();

var app = express();

var sessionConfig = {
  secret: process.env.SECRET || 'sduuhjmoilyiujn',
  key: 'user',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 60 * 1000, // 30 minutes
    secure: false
  }
};

app.use(session(sessionConfig));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

// no auth needed
app.use('/login', login);
app.use('/register', register);
app.get('/loginStatus', function(req, res){
  res.send(req.isAuthenticated());
});
// app.use('/adminHome' ,adminInterface);
// app.use('/league' ,createLeague);
// app.use('/game' ,currentGame);
// app.use('/leaderboard' ,leaderBoard);
// app.use('/roster' ,playerRoster);
// app.use('/newGame' ,scheduleNewGame);
// // app.use('/newprofile' ,createPlayerProfile); Already included in register route
// app.use('/editProfile' ,editPlayerProfile);
// app.use('/otherProfile' ,otherPlayerProfile);
// app.use('/playerHome' ,playerInterface);




// the following routes require authentication
app.use('/private', ensureAuthenticated);

app.get('/private/secretInfo', function(req, res){
  console.log('Sending secret info');
  res.send('This is very secret!');
});

function ensureAuthenticated(req, res, next) {
  console.log('Ensuring the user is authenticated');
  if (req.isAuthenticated()) {
    next();
  } else {
    res.sendStatus(401);
  }
}

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

var server = app.listen(3000, function() {
  console.log('Listening on port', server.address().port);
});
