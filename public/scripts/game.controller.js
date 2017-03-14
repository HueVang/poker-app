angular.module('pokerApp').controller('GameController', function(GameService, MailService, UserService, DigestService, $location){
  var ctrl = this;
  ctrl.newGame = {'name' : '', 'date' : '', 'time' : '', 'count' : '', 'digest' : '', 'leagues_id' : ''};
  var gamehash = 'this isn\'t right...';
  var users = 'neither is this...';
  var data = 'okay...';
  var players = [];
  ctrl.addedToGame = [];
  ctrl.userList = [];
  ctrl.gameEdit = {};
  ctrl.gameTime;
  ctrl.gameDate;
  ctrl.addPlayerInput = false;
  ctrl.autoCompleteArray = [];
  ctrl.username;

  GameService.log();
  MailService.log();
  UserService.log();




  ctrl.addPlayer = function() {
    ctrl.addPlayerInput = true;
  }

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
        var regulars = [];

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
          console.log('postDigest Finished');
        }); // end DigestService.postDigest

        MailService.sendEmailRegulars(regulardata).then(function(res) {
          console.log('sendEmailRegulars Finished');
          ctrl.revertRegularStatus();
        }); // end MailService sendEmailRegulars

        MailService.sendEmailPlayers(playerdata).then(function(res) {
          console.log('sendEmailPlayers Finished');
        }); // end MailService sendEmailPlayers


      }); // end UserService.getUsers
    });
    
    $location.path('home');
  }; // end ctrl.create

  ctrl.getautoCompleteArray = function() {
    UserService.getUsers().then(function(res){
      res.data.forEach(function(person){
        var playerName = person.first_name + ' ' + person.last_name + ' (' + person.username + ')';
        ctrl.autoCompleteArray.push(playerName);
        // console.log('This is the autoCompleteArray: ', ctrl.autoCompleteArray);
        // console.log('This is the length of autoCompleteArray: ', ctrl.autoCompleteArray.length);
      });
      console.log('This is the autoCompleteArray:', ctrl.autoCompleteArray);
    });
  }; // end ctrl.getautoCompleteArray

  ctrl.getautoCompleteArray();

  ctrl.addToPlayersList = function(username){
    var usernameArray = username.split('(');
    var newUsername = usernameArray[1].substr(0, usernameArray[1].length-1)
    console.log(newUsername);
    UserService.addUserToGame(newUsername).then(function(res){
      // var firstAndLastNameArray = usernameArray[0].split(' ')
      // var obj = {}
      // obj['first_name'] = firstAndLastNameArray[0];
      // obj['last_name'] = firstAndLastNameArray[1];
      ctrl.userList.push(res.data[0]);
      console.log('This is the thing pushed to the userList: ', res.data[0]);
      ctrl.addedToGame.push(newUsername);
      console.log('This is the user to be added: ', res.data[0]);
    });
  } // end ctrl.addToPlayersList

  ctrl.revertRegularStatus = function(){
    ctrl.addedToGame.forEach(function(username){
      UserService.revertRegularStatus(username).then(function(res){
        console.log('Successfully reverted regular status: ', res.data[0]);
      });
    });
  }; // end ctrl.revertRegularStatus

  ctrl.removeFromGame = function(userObject){
    var index = ctrl.userList.indexOf(userObject);
    ctrl.userList.splice(index, 1);
    UserService.revertRegularStatus(userObject.username).then(function(res){
      console.log('Successfully reverted regular status: ', res.data[0]);
    });
  }; // end ctrl.removeFromGame

  ctrl.cancel = function() {
    $location.path('adminLeague');
  }; // end ctrl.cancel

}); // end angular.module
