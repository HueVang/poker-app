angular.module('pokerApp').service('GameService', function($http, $location) {
  var ctrl = this;
  var gameId = [{}];

  ctrl.createGame = function(game) {
    return $http.post('/games/creategame', game).then(function(res) {
      return res;
    })
  } // end ctrl.createGame

  ctrl.getGameEdit = function(game) {
    gameId = game.id;
    console.log('This is the game id information: ', gameId);
  } // end ctrl.getGameEdit

  ctrl.displayGameEdit = function() {
    console.log('This is the game id information again: ', gameId);
    return $http.get('/games/editGame/' + gameId).then(function(res) {
      return res;
    })
  }; // end ctrl.displayGameEdit

  ctrl.getGames = function(leagueId) {
    return $http.get('/games/' + leagueId).then(function(res) {
      return res;
    })
  }; // end vtrl.getGames

  ctrl.log = function() {
    console.log('This is the game service console log');
  };

  ctrl.getGameList = function(){
    return $http.get('/games/getCurrentGames').then(function(res){
      return res;
    });
  }

  ctrl.getPlayerList = function(currentGame){
    console.log('This is currentGame in getPlayerList: ',currentGame);
    var gameId1 = currentGame.id;
    var count = currentGame.count;
    return $http.get('/reservations/sortusers/'+gameId1+'&'+count).then(function(res){
      return res;
    });
  }

});
