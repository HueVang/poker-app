angular.module('pokerApp').service('GameService', function($http, $location) {
  var ctrl = this;

  ctrl.createGame = function(game) {
    return $http.post('/games/creategame', game).then(function(res) {
      return res;
    })
  }

  ctrl.log = function() {
    console.log('This is the game service console log');
  };

});
