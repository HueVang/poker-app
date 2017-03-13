angular.module('pokerApp').controller('GameController', function(GameService, MailService, UserService, DigestService, $location){
  var ctrl = this;
  ctrl.newGame = {'name' : '', 'date' : '', 'time' : '', 'count' : '', 'digest' : '', 'leagues_id' : ''};
  var gamehash = 'this isn\'t right...';
  var users = 'neither is this...';
  var data = 'okay...';
  ctrl.userList = {'first_name' : 'No', 'last_name' : 'Yes'};
  ctrl.gameEdit = {};
  ctrl.gameTime;
  ctrl.gameDate;

  GameService.log();
  MailService.log();
  UserService.log();

  ctrl.loadGameEdit = function() {
    console.log('This works');
    GameService.displayGameEdit().then(function(res) {
      res.data.forEach(function(game){
        game.date = new Date(game.date).toDateString();
      })
      ctrl.gameEdit = res.data[0];
      var gameTime = new Date(res.data[0].time);
      ctrl.gameTime = gameTime;
      var gameDate = res.data[0].date;
      ctrl.gameDate = new Date(gameDate);
      console.log('This is the response from GameService: ', ctrl.gameEdit);
    })
  }; // end ctrl.loadGameEdit

  ctrl.loadGameEdit();

  ctrl.gameEditCancel = function() {
    $location.path('adminLeague');
  }; // end ctrl.gameEditCancel

  ctrl.getRegulars = function() {
    UserService.getRegulars().then(function(res) {
      ctrl.userList = res.data;
    })
  }; // end ctrl.getUsersNames

  ctrl.getRegulars();

  ctrl.getPlayers = function(){
    UserService.getUsers().then(function(res){
      var users = res.data;
      users.forEach(function(user){
        user.name = user.first_name + ' ' + user.last_name;
      });
      console.log(users);
    });
  }

  ctrl.getPlayers();

  ctrl.create = function(game) {
    console.log('This is the game attributes: ', game);
    GameService.createGame(game).then(function(res) {
      gamehash = res.data.gamehash;
      console.log('This is the game hash: ', gamehash);
      gameinfo = res.data;
      console.log('This is the gameinfo: ', gameinfo);

    }).then(function() {
      UserService.getAllUsers().then(function(res) {
        users = res.data;
        regulars = [];
        players = [];

        users.forEach(function(person) {
          if (person.regular) {
            console.log('This person is a regular: ', person.name);
            regulars.push(person);
          } else {
            console.log('This person is a player: ', person.name);
            players.push(person);
          }
        }); // end users.forEach

        digest = {'gameid' : gamehash, 'entry' : game.digest};
        regulardata = {'gameid' : gamehash, 'gamename' : gameinfo.name, 'gamedate' : gameinfo.date, 'gamecount' : gameinfo.count, 'gametime' : gameinfo.time, 'user' : regulars, 'digest' : game.digest};
        playerdata = {'gameid' : gamehash, 'gamename' : gameinfo.name, 'gamedate' : gameinfo.date, 'gamecount' : gameinfo.count, 'gametime' : gameinfo.time, 'user' : players, 'digest' : game.digest};


        DigestService.postDigest(digest).then(function(res) {

        }); // end DigestService.postDigest

        MailService.sendEmailRegulars(regulardata).then(function(res) {

        }); // end MailService sendEmailRegulars

        MailService.sendEmailPlayers(playerdata).then(function(res) {

        }); // end MailService sendEmailPlayers


      }); // end UserService.getUsers
    });

    $location.path('home');
  }; // end ctrl.create


}); // end angular.module
