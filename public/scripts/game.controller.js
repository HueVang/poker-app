angular.module('pokerApp').controller('GameController', function(GameService, MailService, ReservationService, UserService, DigestService, $window, $location, $http){
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
  ctrl.autoCompleteArrayForPoints = [];
  ctrl.username;
  ctrl.userPointsArray;
  ctrl.person;


  GameService.log();
  MailService.log();
  UserService.log();

  ctrl.getLeagueId = function() {
    GameService.getLeagueId().then(function(res){
      ctrl.newGame.leagues_id = res.data[0].id;
      console.log('This is the leagues_id for newGame: ', ctrl.newGame.leagues_id);
    });
  }; // end ctrl.getLeagueId

  ctrl.getLeagueId();

  ctrl.removePoints = function(reservation) {
    ReservationService.removePoints(reservation.id).then(function(res){
      console.log('Removed points on: ', res.data[0]);
      var index = ctrl.userPointsArray.indexOf(reservation);
      ctrl.userPointsArray.splice(index, 1);
      ctrl.autoCompleteArrayForPoints = [];
      console.log('Reset autoCompleteArray: ', ctrl.autoCompleteArrayForPoints);
      ctrl.getautoCompleteArrayForPoints(ctrl.gameToEdit.id);
      console.log('This is the autoCompleteArrayForPoints:', ctrl.autoCompleteArrayForPoints);
    });
  }; // end ctrl.removePoints

  ctrl.getPlayerPoints = function(gameId) {
    ReservationService.getPlayerPoints(gameId).then(function(res){
      ctrl.userPointsArray = res.data;
      console.log('This is the userPointsArray: ', ctrl.userPointsArray);
    });
  }; // end ctrl.getPlayerPoints

  ctrl.addPlayer = function() {
    if (ctrl.addPlayerInput == false){
      ctrl.addPlayerInput = true;
    }else{
      ctrl.addPlayerInput = false;
    }
  }

  ctrl.loadGameEdit = function() {
    console.log('This works');
    GameService.displayGameEdit().then(function(res) {
      res.data.forEach(function(game){
        game.date = new Date(game.date).toDateString();
      })
      ctrl.gameToEdit = res.data[0];
      var gameTime = new Date(res.data[0].time);
      ctrl.gameTime = gameTime;
      var gameDate = res.data[0].date;
      ctrl.gameDate = new Date(gameDate);
      console.log('This is the response from GameService: ', ctrl.gameToEdit);
      ctrl.gameToEdit.time = ctrl.gameTime;
      ctrl.gameToEdit.date = ctrl.gameDate;
      ctrl.getPlayerPoints(ctrl.gameToEdit.id);
      ctrl.getautoCompleteArrayForPoints(ctrl.gameToEdit.id);
    })
  }; // end ctrl.loadGameEdit

  ctrl.loadGameEdit();

  ctrl.gameEditSave = function(game) {
    console.log('This is the game edit to save: ', game);
    GameService.editGame(game).then(function(res){
      console.log('This is the updated game: ', res.data[0]);
    });
    GameService.editGameDigest(game).then(function(res){
      console.log('This is the updated digest: ', res.data[0]);
    });
    $location.path('/adminLeague');
  }; // end ctrl.gameEditSave


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


    $location.path('/adminLeague');
    alertify.success('Game created successfully!');

  }; // end ctrl.create

  ctrl.getautoCompleteArray = function() {
    UserService.getUsers().then(function(res){
      res.data.forEach(function(person){
        var playerName = person.first_name + ' ' + person.last_name + ' (' + person.username + ')';
        ctrl.autoCompleteArray.push(playerName);
      });
      console.log('This is the autoCompleteArray:', ctrl.autoCompleteArray);
    });
  }; // end ctrl.getautoCompleteArray

  ctrl.getautoCompleteArray();

  ctrl.getautoCompleteArrayForPoints = function(gameId) {
    ReservationService.getUsersInGame(gameId).then(function(res){
      res.data.forEach(function(person){
        var playerName = person.first_name + ' ' + person.last_name + ' (' + person.username + ')';
        ctrl.autoCompleteArrayForPoints.push(playerName);
      });
      console.log('This is the autoCompleteArrayForPoints:', ctrl.autoCompleteArrayForPoints);
    });
  }; // end ctrl.getautoCompleteArrayForPoints

  ctrl.addToPlayersList = function(username){
    var usernameArray = username.split('(');
    var newUsername = usernameArray[1].substr(0, usernameArray[1].length-1)
    console.log('Add to players list username: ', newUsername);
    UserService.addUserToGame(newUsername).then(function(res){
      ctrl.userList.push(res.data[0]);
      console.log('This is the thing pushed to the userList: ', res.data[0]);
      ctrl.addedToGame.push(newUsername);
      console.log('This is the user to be added: ', res.data[0]);
    });
    ctrl.username = '';
  } // end ctrl.addToPlayersList

  ctrl.addToUserPointsArray = function(person){
    var usernameArray = person.username.split('(');
    var username = usernameArray[1].substr(0, usernameArray[1].length-1)
    console.log('Add to user points array username: ', username);
    UserService.getUserByUsername(username).then(function(res){
      person.user_info = res.data[0];
      person.games_id = ctrl.gameToEdit.id;
      console.log('This is the userPointsArray length: ', ctrl.userPointsArray.length);
      ReservationService.givePlayerPoints(person).then(function(res){
        if (ctrl.userPointsArray.length > 0) {
          for (var i=0; i < ctrl.userPointsArray.length; i++){
            console.log('This is the user\'s name: ', res.data[0].name);
            if(res.data[0].points >= ctrl.userPointsArray[i].points) {
              ctrl.userPointsArray.splice(i, 0, res.data[0]);
              console.log('This pushed in if statement: ', ctrl.userPointsArray);
              break;
            } else if (ctrl.userPointsArray[i+1] !== undefined &&  (res.data[0].points < ctrl.userPointsArray[i].points && res.data[0].points > ctrl.userPointsArray[i+1].points)) {
              ctrl.userPointsArray.splice(i+1, 0, res.data[0]);
              break;
            } else if(i+1 == ctrl.userPointsArray.length) {
              ctrl.userPointsArray.push(res.data[0]);
              console.log('This pushed in the first if statement loop: ', ctrl.userPointsArray);
              break;
            } else {
              console.log('Not yet.');
            }
          }; // end for loop
        } else {
          ctrl.userPointsArray.push(res.data[0]);
          console.log('This pushed in else statement: ', ctrl.userPointsArray);
        }
        console.log('This is the thing pushed to the userPointsArray: ', res.data[0]);
        console.log('This is ther userPointsArray :', ctrl.userPointsArray);
        ctrl.autoCompleteArrayForPoints = [];
        ctrl.getautoCompleteArrayForPoints(ctrl.gameToEdit.id);
        console.log('This is the autoCompleteArrayForPoints:', ctrl.autoCompleteArrayForPoints);
      }); // end ReservationService.givePlayerPoints
    }); // end UserService.getUserByUsername
    ctrl.person = {};
  }; // end ctrl.addToUserPointsArray

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

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      alertify.warning('You are now signed out.');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };

  ctrl.checkAdminStatus = function() {
    UserService.getCurrentUser().then(function(res) {
     user=res.data.user;
     if(user.admin == true){
       ctrl.admin = true;
     }else{
       ctrl.admin = false;
     }
    });
  };

  ctrl.checkAdminStatus();

  ctrl.cancel = function() {
    ctrl.revertRegularStatus();
    $location.path('adminLeague');
    alertify.error('Game creation cancelled');

  }; // end ctrl.cancel

  ctrl.cancelEdit = function() {
    ctrl.revertRegularStatus();
    $location.path('adminLeague');
    alertify.error('Game editing cancelled');

  }; // end ctrl.cancelEdit

}); // end angular.module
