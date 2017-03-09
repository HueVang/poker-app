angular.module('pokerApp').service('GameService', function($http, $location) {
  var ctrl = this;

  ctrl.createGame = function(game) {
    return $http.post('/games/creategame', game).then(function(res) {
      return res;
    })
  } // end ctrl.createGame

  ctrl.getGames = function(leagueId) {
    return $http.get('/games/' + leagueId).then(function(res) {
      return res;
    })
  }; // end vtrl.getGames

  ctrl.log = function() {
    console.log('This is the game service console log');
  };

});
