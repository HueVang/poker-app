angular.module('pokerApp').controller('HomeController', function(ReservationService, UserService, DigestService, GameService, $http, $location, $scope){

  var ctrl = this;
  var currentGame1;
  var currentGame2;
  ctrl.currentGame;
  var user;
  ctrl.showPlayers = true;
  ctrl.showAlternates = false;
  ctrl.hideInput = true;
  ctrl.digestArray;
  ctrl.indexNumber = 0;

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

  ctrl.getGameList = function(){
    GameService.getGameList().then(function(res){

      currentGame1 = {id:res.data[0].id, count:res.data[0].count};
      currentGame2 = {id:res.data[1].id, count:res.data[1].count};
      ctrl.currentGame = {id:res.data[0].id, count:res.data[0].count};
      console.log(res.data);
    }).then(function(){
      console.log('This is currentGame1: ', currentGame1);
      ctrl.getPlayerList(currentGame1);
    });
  }

  ctrl.getGame2List = function(){
    ctrl.currentGame = currentGame2;
    ctrl.getPlayerList(currentGame2);
  }

  ctrl.getGameList();

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
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
      ctrl.playerList.forEach(function(x){
        if(x.users_id == user.id){
          ctrl.notAdmin = true;
          if(ctrl.admin == true){
            ctrl.notAdmin = false;
          }
        }else{
          ctrl.notAdmin = false;
        }
      });
      ctrl.alternates.forEach(function(x){
        if(x.users_id == user.id){
          ctrl.notAdmin = true;
          if(ctrl.admin == true){
            ctrl.notAdmin = false;
          }
        }else{
          ctrl.notAdmin = false;
        }
      });
      $scope.$apply();
    });

    ctrl.showAlternateList = function(){
      ctrl.showAlternates = true;
      ctrl.showPlayers = false;
    }
    ctrl.showPlayerList = function(){
      ctrl.showAlternates = false;
      ctrl.showPlayers = true;
    }

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

    ctrl.removeFromGame = function(){
      console.log(ctrl.currentGame);
      ReservationService.removeFromGame(user.id, ctrl.currentGame).then(function(res){
        console.log(res);
        ctrl.getPlayerList(ctrl.currentGame);
      });
    }

    ctrl.adminRemoveFromGame = function(player){
      console.log(player, ctrl.currentGame);
      ReservationService.removeFromGame(player, ctrl.currentGame).then(function(res){
        console.log(res);
        ctrl.getPlayerList(ctrl.currentGame);
      });
    }
});
