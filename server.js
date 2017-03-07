var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var connection = require('./db/connection');
var login = require('./routes/login');
var register = require('./routes/register');
var digests = require('./routes/digests');
var games = require('./routes/games');
var reservations = require('./routes/reservations');
var leagues = require('./routes/leagues');
var users = require('./routes/users');

require('./auth/setup');

connection.connect();



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

app.use('/leagues' ,leagues);
app.use('/games' ,games);
app.use('/reservations' ,reservations);
app.use('/digests' ,digests);
app.use('/users' ,users);





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

var playerList = [{name:'bob'}, {name:'joe'},{name:'jim'},{name:'zoe'},{name:'rob'}];

io.on('connection', function(socket){
  console.log('A user connected');
  io.sockets.emit('broadcast',{description: playerList});
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});

var server = http.listen(3000, function() {
  console.log('Listening on port', 3000);
});
