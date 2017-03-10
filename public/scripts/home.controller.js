angular.module('pokerApp').controller('HomeController', function(DigestService, GameService, $http, $location, $scope){

  var ctrl = this;
  var currentGame1;
  var currentGame2;
  var currentGameList1=[];
  var currentGameList2=[];

  var socket = io.connect();

  ctrl.getDigests = function() {
    DigestService.getDigests().then(function(res) {
      console.log('This is the digests: ', res.data);
      ctrl.digestList = res.data;
    });
  }; // end ctrl.getDigests

  ctrl.getDigests();

  ctrl.getPlayerList = function(currentGame1){
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
      $scope.$apply();
    });


});
