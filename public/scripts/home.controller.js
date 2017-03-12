angular.module('pokerApp').controller('HomeController', function(UserService, DigestService, GameService, $http, $location, $scope){

  var ctrl = this;
  var currentGame1;
  var currentGame2;
  var currentGame;
  ctrl.showPlayers = true;
  ctrl.showAlternates = false;


  var socket = io.connect();

  ctrl.getDigests = function() {
    DigestService.getDigests().then(function(res) {
      console.log('This is the digests: ', res.data);
      ctrl.digestList = res.data;
      ctrl.digestList.forEach(function(x){
        x.date = new Date(x.date).toDateString();
      });
    });
  }; // end ctrl.getDigests

  ctrl.getDigests();

  ctrl.getPlayerList = function(currentGame){
    GameService.getPlayerList(currentGame).then(function(res){
      console.log(res);
    });
  }

  ctrl.getGameList = function(){
    GameService.getGameList().then(function(res){

      currentGame1 = {id:res.data[0].id, count:res.data[0].count};
      currentGame2 = {id:res.data[1].id, count:res.data[1].count};
      console.log(res.data);
    }).then(function(){
      console.log(currentGame1);
      ctrl.getPlayerList(currentGame1);
    });
  }

  ctrl.getGame2List = function(){
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
      UserService.checkAdminStatus().then(function(res) {
       console.log(res.data);
       if(res.data == true){
         ctrl.admin = true;
       }else{
         ctrl.admin = false;
       }
      });
    };

    ctrl.checkAdminStatus();
});
