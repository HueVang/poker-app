angular.module('pokerApp').controller('HomeController', function(ReservationService, LeagueService, UserService, DigestService, GameService, $http, $location, $scope){

  var ctrl = this;
  var currentGame1;
  var currentGame2;
  var currentLeague1;
  var currentLeague2;
  ctrl.currentGame;
  ctrl.currentLeague;
  var user;
  ctrl.showPlayers = true;
  ctrl.showAlternates = false;
  ctrl.showLeaderboard = false;
  ctrl.hideInput = true;
  ctrl.digestArray;
  ctrl.indexNumber = 0;
  ctrl.showGames = true;

  var socket = io.connect();

  ctrl.getDigests = function() {
    DigestService.getDigests().then(function(res) {
      ctrl.digestArray = res;
      ctrl.digestList = ctrl.digestArray[0];
    });
  }; // end ctrl.getDigests

  ctrl.getDigests();

  ctrl.jumpToPage = function(array, index){
    ctrl.indexNumber = index;
    ctrl.digestList = array;
  }

  ctrl.nextPage = function(){
    if(ctrl.indexNumber == ctrl.digestArray.length-1){
      ctrl.digestList = ctrl.digestArray[ctrl.indexNumber];
    }
    else if(ctrl.indexNumber < ctrl.digestArray.length){
      ctrl.digestList = ctrl.digestArray[ctrl.indexNumber+1];
      ctrl.indexNumber++;
    }
  }

  ctrl.prevPage = function(){
    if(ctrl.indexNumber > 0){
      ctrl.digestList = ctrl.digestArray[ctrl.indexNumber-1];
      ctrl.indexNumber--;
    }
  }

  ctrl.getPlayerList = function(currentGame){
    GameService.getPlayerList(currentGame).then(function(res){
      console.log('This is the response from ctrl.getPlayerList: ' , res);
    });
  }

  ctrl.getLeaderboard = function(currentLeague){
    LeagueService.getLeaderboard(currentLeague).then(function(res) {
      ctrl.leaderboard = res.data;
      ctrl.showLeaderboard = true;
      ctrl.showPlayers = false;
      ctrl.showAlternates = false;
      ctrl.showGames = false;
    });
  }; // end ctrl.getLeaderboard


  ctrl.getLeagueList = function(){
    LeagueService.getLeagueList().then(function(res){
      currentLeague1 = res.data[0].id;
      currentLeague2 = res.data[1].id;
      ctrl.currentLeague = res.data[0].id;
      console.log('This is the getLeagueList data: ', res.data);
    }).then(function(){
      console.log('This is currentLeague1: ', currentLeague1);
    });
  }

  ctrl.showLeaderboard1 = function(){
    ctrl.currentLeague = currentLeague1;
    ctrl.getLeaderboard(currentLeague1);
    console.log('This is the currentLeague: ', ctrl.currentLeague);
  }; // end ctrl.showLeaderboard1

  ctrl.showLeaderboard2 = function(){
    ctrl.currentLeague = currentLeague2;
    ctrl.getLeaderboard(currentLeague2);
    console.log('This is the currentLeague: ', ctrl.currentLeague);
  }; // end ctrl.showLeaderboard2

  ctrl.getLeagueList();


  ctrl.getGameList = function(){
    GameService.getGameList().then(function(res){
      ctrl.showLeaderboard = false;
      ctrl.showGames = true;
      ctrl.showPlayers = true;
      ctrl.showAlternates = false;
      currentGame1 = {id:res.data[0].id, count:res.data[0].count};
      currentGame2 = {id:res.data[1].id, count:res.data[1].count};
      ctrl.currentGame = {id:res.data[0].id, count:res.data[0].count};
      console.log(res.data);
    }).then(function(){
      console.log('This is currentGame1: ', currentGame1);
      ctrl.getPlayerList(currentGame1);
    });
  };

  ctrl.getGame2List = function(){
    ctrl.showLeaderboard = false;
    ctrl.showGames = true;
    ctrl.showPlayers = true;
    ctrl.showAlternates = false;
    ctrl.currentGame = currentGame2;
    ctrl.getPlayerList(currentGame2);
  };

  ctrl.getGameList();

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      alertify.warning('You are now signed out.');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };
    socket.on('broadcast', function(data){
      console.log(data.description);
      var playerList = data.description.players;
      var alternates = data.description.alternates;
      ctrl.playerList = playerList;
      ctrl.alternates = alternates;

      console.log('Sockets broadcast loaded');
      ctrl.playerList.forEach(function(x){
        if(x.users_id == user.id){
          console.log('Triggered in if playerList forEach');
          ctrl.notAdmin = true;
          if(ctrl.admin == true){
            ctrl.notAdmin = false;
          }
        }
      });

      ctrl.alternates.forEach(function(x){
        if(x.users_id == user.id){
          console.log('Triggered in if alternates forEach');
          ctrl.notAdmin = true;
          if(ctrl.admin == true){
            ctrl.notAdmin = false;
          }
        }
      });
      console.log('ctrl.notAdmin is: ', ctrl.notAdmin);
      $scope.$apply();
    });

    ctrl.showAlternateList = function(){
      ctrl.showAlternates = true;
      ctrl.showPlayers = false;
      ctrl.showLeaderboard = false;
    }

    ctrl.showPlayerList = function(){
      ctrl.showAlternates = false;
      ctrl.showPlayers = true;
      ctrl.showLeaderboard = false;
    }

    ctrl.checkAdminStatus = function() {
      UserService.getCurrentUser().then(function(res) {
       user=res.data.user;
       console.log('checkAdminStatus loads first');
       if(user.admin == true){
         ctrl.admin = true;
         console.log('User admin status is: ', ctrl.admin);
       }else{
         ctrl.admin = false;
         console.log('User admin status is: ', ctrl.admin);
       }
      });
    };

    ctrl.checkAdminStatus();

    ctrl.adminRemoveAlert = function(player) {
      var player_id = player;
      alertify.confirm(
        'Remove player from game?',
       'Are you sure you want to remove this player from the game?',
       function(){
         console.log('This is the argument: ', player_id);
         ctrl.adminRemoveFromGame(player_id);
         alertify.success('Removed player from game');
       },
       function(){
         alertify.error('Cancelled player removal');
       });
    }; // end ctrl.adminRemoveAlert

    ctrl.userRemoveAlert = function() {
      alertify.confirm(
        'Leave this game?',
       'Are you sure you want to leave this game?',
       function(){
         ctrl.removeFromGame();
         alertify.success('Left game');
       },
       function(){
         alertify.error('Cancelled');
       });
    }; // end ctrl.userRemoveAlert


    ctrl.addActive = function() {
      document.getElementById('selected').removeAttribute('id');
      console.log('Selected ID removed', document.getElementsByClassName('alternates')[0]);
      event.target.setAttribute('id', 'selected');
      console.log('Selected ID added');
      document.getElementsByClassName('alternates')[0].removeAttribute('id');
      document.getElementsByClassName('regulars')[0].setAttribute('id', 'selected2');
    }; // end ctrl.addActive

    ctrl.addActive2 = function() {
      document.getElementById('selected2').removeAttribute('id');
      console.log('Selected2 ID removed');
      event.target.setAttribute('id', 'selected2');
      console.log('Selected2 ID added');
    }; // end ctrl.addActive2

    ctrl.addActive3 = function() {
      console.log('This is the currentLeague: ', ctrl.currentLeague);
      if (ctrl.currentLeague == currentLeague1) {
        document.getElementsByClassName('league2')[0].removeAttribute('id');
        document.getElementsByClassName('league1')[0].setAttribute('id', 'selected3');
      } else {
        console.log('currentLeague == currentLeague2');
        document.getElementsByClassName('league1')[0].removeAttribute('id');
        document.getElementsByClassName('league2')[0].setAttribute('id', 'selected3');
      }
    }; // end ctrl.addActive3


    ctrl.removeFromGame = function(){
      console.log(ctrl.currentGame);
      ReservationService.removeFromGame(user.id, ctrl.currentGame).then(function(res){
        console.log(res);
        ctrl.getPlayerList(ctrl.currentGame);
      });
    };

    ctrl.adminRemoveFromGame = function(player){
      console.log(player, ctrl.currentGame);
      ReservationService.removeFromGame(player, ctrl.currentGame).then(function(res){
        console.log(res);
        ctrl.getPlayerList(ctrl.currentGame);
      });
    }
});
