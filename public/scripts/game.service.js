angular.module('pokerApp').service('GameService', function($http, $location) {
  var ctrl = this;

  ctrl.createGame = function(game) {
    return $http.post('/games/creategame', game).then(function(res) {
      return res;
    })
  } // end ctrl.createGame

  ctrl.log = function() {
    console.log('This is the game service console log');
  };

  ctrl.getGameList = function(){
    return $http.get('/games/getCurrentGames').then(function(res){
      return res;
    });
  }

  ctrl.getPlayerList = function(currentGame){
    console.log(currentGame);
    var gameId1 = currentGame1.id;
    var count = currentGame1.count;
    return $http.get('/reservations/sortusers/'+gameId1+count).then(function(res){
      return res;
    });
  }

});
