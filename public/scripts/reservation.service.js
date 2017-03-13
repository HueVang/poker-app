angular.module('pokerApp').service('ReservationService', function($http, $location) {
  var ctrl = this;

  ctrl.removeFromGame = function(user, currentGame){
    var game_id = currentGame.id;
    return $http.delete('/reservations/'+user+game_id).then(function(res) {
      console.log('This is user.service.js res: ', res);
      return res;
    });
  }
});
